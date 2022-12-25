const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.get('/', (req,res)=>{
  res.render('home');
});

app.listen(3000, (req, res)=>{
  console.log('Serving on port 3000')
});