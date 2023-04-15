# Clothing/Laundry Management App
This application allows users to make an order for laundry services, order fabrics/cloths as well as rate and review clothing items.

## Features
- Users can add new clothing items with details such as fabric type, color, size, and care instructions.
- Users can view and edit details of existing clothing items.
- Users can mark clothing items as sold or unsold.
- Users can view a list of all clothing items they have added.
- Users can search for clothing items by fabric type, color, size, or sold/unsold status.
- Users can add ratings and comments to clothing items.
- Users can view ratings and comments left by other users for clothing items.

## Technologies Used
- Node.js and Express for the backend server.
- MongoDB for the database.
- Mongoose for object modeling and data validation.
- JSON Web Tokens (JWT) for user authentication.
- BCrypt for password hashing.
- Multer for handling file uploads.
Jest for unit and integration testing.
- Postman for API testing.

## Getting Started
To get started with the application, you will need to have Node.js and MongoDB installed on your machine. Follow these steps:

## Clone this repository to your local machine.
Install dependencies by running npm install in the project root directory.
Create a .env file in the project root directory and add the following environment variables:
makefile
Copy code
NODE_ENV=development
PORT=4001
MONGODB_URI=<your MongoDB URI>
JWT_SECRET_Key=<your JWT secret>
Start the server by running npm start or npm run dev for development mode.
You can now use an API client like Postman to interact with the API endpoints.

## API Endpoints
*Authentication*
- POST /api/auth/register - Register a new user.
- POST /api/auth/login - Authenticate a user and generate a JWT token.
