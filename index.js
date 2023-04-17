const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express();
const bodyParser = require('body-parser');
const authRouter = require('./routes/authRoute');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const orderRouter = require('./routes/laundryOrderRoutes');
const clothingRouter = require('./routes/clothingRoute');
const clothCategoryRouter = require('./routes/clothCategoryRoute');
const laundryCategoryRouter = require('./routes/laundryCategoryRoutes');
const promoCodeRouter = require('./routes/promoCodeRoute');
const userOrderRouter = require('./routes/userOrderRoute');
const morgan = require('morgan');
const dotenv = require("dotenv").config();
const cloudinary = require('cloudinary').v2;
const PORT = process.env.PORT || 4000;
dbConnect();

app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

app.use('/api/user', authRouter);
app.use('/api/order', orderRouter);
app.use('/api/clothing', clothingRouter);
app.use('/api/category', clothCategoryRouter);
app.use('/api/laundry-category' , laundryCategoryRouter)
app.use('/api/promo-code', promoCodeRouter)
app.use('/api/user/cart', userOrderRouter)

app.use(notFound)
app.use(errorHandler )

app.listen(PORT, () => {
  console.log(`My server is listening on port ${PORT}`);
});
