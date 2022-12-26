const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

// Mongoose Setup:
mongoose.set('strictQuery', true); //Added to stop showing the warning messae.
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () =>{
  console.log("Database Connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for(let i=0; i<50; i++){
    const random1000 = Math.floor(Math.random(0)*1000);
    const price = Math.floor(Math.random()*20) + 10
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: 'https://source.unsplash.com/random/900%C3%97700/?camping',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus cum ea officiis eius vitae libero quos, optio omnis harum dicta saepe consequuntur consectetur voluptate sint explicabo non excepturi aperiam voluptatibus.',
      price
    });
    await camp.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
});