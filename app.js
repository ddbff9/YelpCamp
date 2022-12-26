const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.use(express.urlencoded({extended: true}));

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


app.listen(3000, (req, res)=>{
  console.log('Serving on port 3000')
});