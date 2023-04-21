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
const checkoutRouter = require('./routes/checkoutRoutes');
const morgan = require('morgan');
const dotenv = require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const request = require('request');
const pug = require('pug');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const PORT = process.env.PORT || 4000;
// const { initializePayment, verifyPayment } = paystack(request);
dbConnect();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('stripe_frontend'));
app.use(express.static(path.join(__dirname, 'public/')));

app.set('view engine', 'pug');

app.use('/api/user', authRouter);
app.use('/api/order', orderRouter);
app.use('/api/clothing', clothingRouter);
app.use('/api/category', clothCategoryRouter);
app.use('/api/laundry-category', laundryCategoryRouter);
app.use('/api/promo-code', promoCodeRouter);
app.use('/api/user/cart', userOrderRouter);
app.use('/api/user/',checkoutRouter );
app.post('/charge', async (req, res) => {
    const { reference, amount } = req.body;
  
    try {
      const charge = await paystack.charge.create({
        amount,
        email: 'customer@email.com',
        card: {
          cvv: '123',
          number: '4123450131001381',
          expiry_month: '12',
          expiry_year: '22',
        },
        reference,
      });
      if (charge.status === 'success') {
        // Update your database with the payment details
      } else {
        // Payment failed
        }
    } catch (error) {
        console.log(error);
    }
    });
  
  
  
  
  

app.get('/',(req, res) => {
  res.render('index.pug');
  });

app.get('/paystack/callback', (req,res) => {
    const ref = req.query.reference;
    verifyPayment(ref, (error,body)=>{
        if(error){
            //handle errors appropriately
            console.log(error)
            return res.redirect('/error');
        }
        response = JSON.parse(body);
        const data = _.at(response.data, ['reference', 'amount','customer.email', 'metadata.full_name']);
        [reference, amount, email, full_name] = data;
        newDonor = {reference, amount, email, full_name}
        const donor = new Donor(newDonor)
        donor.save().then((donor)=>{
            if(donor){
                res.redirect('/receipt/'+donor._id);
            }
        }).catch((e)=>{
            res.redirect('/error');
        })
    })
});

app.post('/paystack/pay', (req, res) => {
    const form = _.pick(req.body,['amount','email','full_name']);
    form.metadata = {
        full_name : form.full_name
    }
    form.amount *= 100;
    initializePayment(form, (error, body)=>{
        if(error){
            //handle errors
            console.log(error);
            return;
       }
       response = JSON.parse(body);
       res.redirect(response.data.authorization_url)
    });
});

app.get('/', (req, res) => {
  res.send('Hello Welcome to Laundry/Clothing App')
  });

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`My server is listening on port ${PORT}`);
});
