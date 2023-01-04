const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const {campgroundSchema} = require('./schemas.js')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const app = express();

// Mongoose Setup:
mongoose.set('strictQuery', true); //Added to stop showing the warning messae.
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () =>{
  console.log("Database Connected");
});

app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const validateCampground = (req, res, next) => {  
  const {error} = campgroundSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg.toUpperCase(), 400);
  }else{
    next();
  }
}

//Mongoose Routes:
app.get('/', (req,res)=>{res.render('home')});

app.get('/campgrounds', async (req,res)=>{
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

app.get('/campgrounds/new', (req,res)=>{
  res.render('campgrounds/new');
});

app.post('/campgrounds', validateCampground, catchAsync(async (req,res)=>{
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.get('/campgrounds/:id', catchAsync(async (req, res)=>{
  const {id} = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/show', { campground });
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req,res)=>{
  const {id} = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/edit', { campground });
}));

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req,res)=>{
  const {id} = req.params;
  const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
  res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res)=>{
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
}));

app.all('*', (req, res, next)=>{
  next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next)=>{
  const {statusCode = 500} = err;
  if(!err.message) err.message = 'Oh No, Somethign Went Wront!';
  res.status(statusCode).render('error',{err});
})

app.listen(3000, (req, res)=>{
  console.log('Serving on port 3000')
});