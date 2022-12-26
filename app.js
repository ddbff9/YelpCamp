const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
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

//Mongoose Routes:
app.get('/', (req,res)=>{res.render('home')});

app.get('/campgrounds', async (req,res)=>{
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

app.get('/campgrounds/new', (req,res)=>{
  res.render('campgrounds/new');
});

app.post('/campgrounds', async (req,res)=>{
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
})

app.get('/campgrounds/:id', async (req, res)=>{
  const {id} = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/show', { campground });
});

app.get('/campgrounds/:id/edit', async (req,res)=>{
  const {id} = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/edit', { campground });
});

app.put('/campgrounds/:id', async (req,res)=>{
  const {id} = req.params;
  const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
  res.redirect(`/campgrounds/${campground._id}`);
});

app.delete('/campgrounds/:id', async (req, res)=>{
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
});

app.listen(3000, (req, res)=>{
  console.log('Serving on port 3000')
});