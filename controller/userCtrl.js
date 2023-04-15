const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { generateToken } = require('../config/jwtToken');
const { validateMongoDbId } = require('../utils/validateMongoId');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
const sendEmail = require('./emailCtrl')
const path = require('path');
const crypto = require("crypto");
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Set up Multer storage engine to store uploaded images temporarily on the server.
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname,  "../public/images/"));
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + '-' + uniqueSuffix + '.jpeg');
	},
});
const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("image")) {
		cb(null, true);
	} else {
		cb({ message: 'Unsuported file format' }, false);
	}
};
const upload = multer({
    storage: storage,
    fileFilter: multerFilter,
    limits: { fileSize: 1000000 },
  });
// const upload = multer({ storage: storage });

// Set up Cloudinary configuration to upload the image to Cloudinary.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUploadImg = async (fileToUploads) => {
	try {
		const result = await cloudinary.uploader.upload(fileToUploads, {
			resource_type: 'auto',
		});
		console.log(result);
		return {
			url: result?.secure_url,
			asset_id: result?.asset_id,
			public_id: result?.public_id,
		};
	} catch (error) {
		console.error(error);
		throw new Error('Error uploading image to Cloudinary');
	}
};

// Register a new user with profile image
const createUser = asyncHandler(async (req, res) => {
	const { firstname, lastname, email, mobile, password } = req.body;
  
	// Check if email is already registered
	const existingUser = await User.findOne({ email: email });
	if (existingUser) {
	  res.status(400);
	  throw new Error("Email address is already registered");
	}
	// Check if a profile image was uploaded
	const file = req.file;
	if (!file) {
	  res.status(400);
	  throw new Error("Please upload a profile image");
	} else{
	// Upload profile image to Cloudinary
	const newPath = await cloudinaryUploadImg(file.path);
	// Create new user with profile image URL
	const newUser = await User.create({ 
	  firstname,
	  lastname,
	  email,
	  mobile,
	  password,
	  profileImage: newPath.url,
	});
	res.status(201).json({ message: "User created successfully", newUser });
  };
});  

// Login a user
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	// console.log(email, password);

	// Check if user exists or not.
	const findUser = await User.findOne({ email: email });
	if (findUser && (await findUser.isPasswordMatched(password))) {
		const refreshToken = await generateRefreshToken(findUser?._id);
		const updateUser = await User.findByIdAndUpdate(
			findUser?.id,
			{ refreshToken: refreshToken },
			{ new: true }
		);
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			maxAge: 72 * 24 * 60 * 60 * 1000,
		});
		res.json({
			_id: findUser?._id,
			firstname: findUser?.firstname,
			lastname: findUser?.lastname,
			email: findUser?.email,
			mobile: findUser?.mobile,
			token: generateToken(findUser?._id),
		});
	} else {
		throw new Error('Invalid email or password');
	}
});

// To get all users

const getAllUsers = asyncHandler(async (req, res) => {
	try {
		const allUsers = await User.find({});
		res.json(allUsers);
	} catch (error) {
		throw new Error('User not found');
	}
});

// To get a single user

const getAUser = asyncHandler(async (req, res) => {
	try {
		const getAUser = await User.findById(req.params.id);
		validateMongoDbId(id);
		// console.log(req.params.id);
		res.json(getAUser);
	} catch (error) {
		throw new Error('User not found');
	}
});

// To update a user

const updatedUser = asyncHandler(async (req, res) => {
	//This is the user who has a token or admin(I might just remove admin).
	const { _id } = req.user;
	// console.log(req.user);
	validateMongoDbId(_id);
	try {
		const updateAUser = await User.findByIdAndUpdate(
			_id,
			{
				firstname: req?.body?.firstname,
				lastname: req?.body?.lastname,
				email: req?.body?.email,
				mobile: req?.body?.mobile,
			},
			{ new: true }
		);
		res.json(updateAUser);
		console.log('User updated successfully!!');
	} catch (error) {
		throw new Error(error);
	}
});

// Delete a user

const deleteAUser = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongoDbId(id);
	try {
		const deleteAUser = await User.findByIdAndDelete(id);
		res.json({ message: 'user deleted susccessfully!!', data: deleteAUser });
	} catch (error) {
		throw new Error('User not found');
	}
	console.log('User deleted successfully!!');
});

const blockUser = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongoDbId(id);
	try {
		const blockAUser = await User.findByIdAndUpdate(
			id,
			{
				isBlocked: true,
			},
			{ new: true }
		);
		res.json({ message: 'user blocked susccessfully!!', data: blockAUser });
	} catch (error) {
		throw new Error('User not found');
	}
	console.log('User blocked successfully!!');
});

const unblockUser = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongoDbId(id);
	try {
		const unblockAUser = await User.findByIdAndUpdate(
			id,
			{
				isBlocked: false,
			},
			{ new: true }
		);
		res.json({ message: 'user unBlocked susccessfully!!', data: unblockAUser });
	} catch (error) {
		throw new Error('User not found');
	}
	console.log('User unblocked successfully!!');
});

// To Handle refresh token
const refreshTokenHandler = asyncHandler(async (req, res) => {
	const cookie = req.cookies;
	// console.log(cookie);
	if (!cookie?.refreshToken) throw new Error('No refresh token in cookies');
	const refreshToken = cookie.refreshToken;
	// console.log(refreshToken);
	const user = await User.findOne({ refreshToken });
	if (!user)
		throw new Error('No refresh token for this user in DB or not matched!');
	jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
		console.log(decoded);
		if (err || user.id !== decoded.id) {
			throw new Error('There is something wrong with refresh token!');
		}
		const accessToken = generateToken(user?.id);
		res.json({ accessToken });
	});
});

// For user logout
const logoutUser = asyncHandler(async (req, res) => {
const cookie = req.cookies;
if (!cookie?.refreshToken) throw new Error('No refresh token in cookies');
const refreshToken = cookie.refreshToken;
const user = await User.findOne({ refreshToken });
// Incase of a bad outcome where no user with that refresh token is found in DB.
if (!user){
	res.clearCookie('refreshToken',{httpOnly:true, secure:true});
	return res.sendStatus(204) 
}
await User.findOneAndUpdate({ refreshToken }, { refreshToken: '' });
res.clearCookie('refreshToken',{httpOnly:true, secure:true});
console.log('User logged out successfully!!');
return res.sendStatus(204); 
});

// To update password
const updatePassword = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const {password } = req.body;
	validateMongoDbId(_id);
	const user = await User.findById(_id);
	if(password){
		user.password = password;
		const updatedPassword = await user.save()
		res.json(updatedPassword)
	} else {
		res.json(user)
	}
});

// To generate forgotPassword Token
const forgotPasswordToken = asyncHandler(async (req, res) => {
	const { email } = req.body;
	console.log(email);
	const user = await User.findOne({email} );
	if (!user) throw new Error('No user with this email');
	try {
		const token = await user.createPasswordResetToken();
		// const token = crypto.randomBytes(32).toString('hex');

		await user.save();
		const resetURL = `Hi Please follow this link to reset your password. This link is valid for 10 minutes only.<a href='http://localhost:4001/api/user/reset-password/${token}'>Click Here</>`
		const data = {
			to: email,
			text: 'Laundry_App User',
			subject: 'Forgot Password Link',
			html: resetURL,
		} 
		sendEmail(data);
		res.json(token)
	} catch (error) {
		throw new Error(error);
	}
});

//To now reset the password 
const resetPassword = asyncHandler(async (req, res) => {
const {password} = req.body;
const {token} = req.params;
const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()}})
if (!user) throw new Error('Token Expired, Please try again later.'); 
user.password = password;
user.passwordResetToken = undefined;
user.passwordResetExpires = undefined;
await user.save();
res.json(user)
});

module.exports = {
	createUser,
	upload,
	multerFilter,
	cloudinary,
	loginUser,
	getAllUsers,
	getAUser,
	updatedUser,
	deleteAUser,
	unblockUser,
	blockUser,
	refreshTokenHandler,
	logoutUser,
	updatePassword,
	forgotPasswordToken,
	resetPassword
};
