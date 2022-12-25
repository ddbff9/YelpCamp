const express = require('express');
const app = express();

app.get('/', (req,res)=>{
  res.send('HELLO FROM YELP CAMP!');
});

app.listen(3000, (req, res)=>{
  console.log('Serving on port 3000')
});