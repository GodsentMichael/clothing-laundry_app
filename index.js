const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express();
const bodyParser = require('body-parser');
const authRouter = require('./routes/authRoute');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser')
dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

app.use('/api/user', authRouter);

app.use(notFound)
app.use(errorHandler )

app.listen(PORT, () => {
  console.log(`My server is listening on port ${PORT}`);
});
