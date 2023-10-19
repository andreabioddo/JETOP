
const express = require('express');
const cors = require('cors')
const app = express();
app.use(express.static('public')); // host public folder
app.use(cors()); // allow all origins -> Access-Control-Allow-Origin: *


const port = 3000;


const weather = require('./routes/weather');
app.use("/weather", weather);


app.get('/es/:city/:day', async (req, res) => {
        const city = req.params.city;
        const day = req.params.day;
  
    try {
      const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=API_KEY`);
  
      // Ottieni i dati dalla risposta dell'API
      const weatherData = weatherResponse.data;
  
      // Altri placeholder per le altre API
      const locationData = `Informazioni sulla posizione di ${city}`;
      const otherData = `Altri dati per ${city} il giorno ${day}`;
  
      // Restituisci i dati come JSON
      res.json({
        city: city,
        day: day,
        weather: weatherData,
        location: locationData,
        other: otherData,
      });
    } catch (error) {
      console.error('Errore durante la chiamata all\'API:', error);
      res.status(500).json({ error: 'Errore nella richiesta all\'API' });
    }
  });
  
app.listen(port, () => {
  console.log(`Il server è in ascolto sulla porta ${port}`);
});
