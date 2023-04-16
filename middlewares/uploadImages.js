const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

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
const uploadPhoto = multer({
    storage: storage,
    fileFilter: multerFilter,
    limits: { fileSize: 1000000 },
  });

const clothImgResize = async (req, res, next) => {
	if (!req.files) return next();
	await Promise.all(
		req.files.map(async (file) => {
			await sharp(file.path)
				.resize(300, 300)
				.toFormat('jpeg')
				.jpeg({ quality: 90 })
				.toFile(`public/images/clothes${file.filename}`);
				fs.unlinkSync(`public/images/clothes${file.filename}`);
				// fs.unlinkSync(path.join(__dirname, `../public/images/${file.filename}`));
				
		})
	);
	next();
};
const profileImgResize = async (req, res, next) => {
	if (!req.files) return next();
	await Promise.all(
		req.files.map(async (file) => {
			await sharp(file.path)
				.resize(300, 300)
				.toFormat('jpeg')
				.jpeg({ quality: 90 })
				.toFile(`public/images/profile${file.filename}`);
				fs.unlinkSync(`public/images/profile${file.filename}`);

		})
	);
	next();
};

module.exports = { uploadPhoto, clothImgResize, profileImgResize, multerFilter, storage };
