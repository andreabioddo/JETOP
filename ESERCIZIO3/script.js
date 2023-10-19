
const express = require('express');
const cors = require('cors')
const app = express();
app.use(express.static('public')); // host public folder
app.use(cors()); // allow all origins -> Access-Control-Allow-Origin: *


const port = 3000;


const weather = require('./routes/weather');
app.use("/weather", weather);

  
app.listen(port, () => {
  console.log(`Il server è in ascolto sulla porta ${port}`);
});
