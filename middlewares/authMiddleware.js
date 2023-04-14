const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if (req?.headers?.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
        try {
            if(token){
                // To make sure the person with the token can get a user.
                const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
                const user = await User.findById(decoded?.id);
                req.user = user;
                next();
            }
        } catch (error) {
          throw new Error("You're not authorized or your token expired, please login again");
            
        }
    } else {
        throw new Error("There's no token attached to the header");
    }
})

const isAdmin = asyncHandler(async (req, res, next) => {
    const { email} = req.user;
    console.log('This user is an admin=>',email);
        const adminUser = await User.findOne({email: email});
        // console.log(adminUser);
        if(adminUser?.role !== "admin"){
            throw new Error("You're not an admin");
        } else {
            next();}

})

module.exports = {authMiddleware, isAdmin};