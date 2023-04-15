const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv').config();

cloudinary.config(
	{
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
       
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
	},
    // console.log(process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_SECRET, process.env.CLOUDINARY_API_KEY)
	
);

// const cloudinaryUploadImg = async (fileToUploads) => {
//     return new Promise((resolve) => {

//       cloudinary.uploader.upload(fileToUploads, (result) => {
//         console.log(result);
//         resolve(
//           {
//             url: result?.secure_url,
//             asset_id: result?.asset_id,
//             public_id: result?.public_id,
//           },
//           {
//             resource_type: "auto",
//           }
//         );
//       });

//     });

//   };

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

module.exports = cloudinaryUploadImg;
