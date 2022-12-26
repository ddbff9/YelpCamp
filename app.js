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

//Mongoose Routes:
app.get('/', (req,res)=>{res.render('home')});

app.get('/campgrounds', async (req,res)=>{
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

app.listen(3000, (req, res)=>{
  console.log('Serving on port 3000')
});