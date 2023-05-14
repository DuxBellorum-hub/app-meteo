const axios = require('axios');
const express = require('express');
const dotenv = require('dotenv')
dotenv.config();
const NodeGeocoder = require('node-geocoder');

const app = express();
const port = 3000;
app.use(express.static('public'));

const options = {
  provider: 'mapquest',
  apiKey: process.env.MAP_KEY
};

const geocoder = NodeGeocoder(options);

const url = `https://api.tutiempo.net/json/?lan=fr&apid=${process.env.API_KEY}&ll=`;

app.get('/', async (req, res) => {
  const latitude = "48.866667";
  const longitude = "2.333333";
  const response = await axios.get(url + latitude + ',' + longitude);
  const data = response.data;
  const hourDataJson = JSON.parse(JSON.stringify(data.hour_hour));
  let arrHours = Object.values(hourDataJson);
  const dayTwo = getDay(data.day2.date);
  const dayThree = getDay(data.day3.date);
  const dayFour = getDay(data.day4.date);
  const dayFive = getDay(data.day5.date);
  const daySix = getDay(data.day6.date);
  const daySeven = getDay(data.day7.date);
  let key = process.env.MAP_KEY.toString();
  res.render("searchBar.twig", { key, data, arrHours, dayTwo, dayThree, dayFour, dayFive, daySix, daySeven, key });

});


app.get('/:id', (req, res) => {
  getCityPosition(req.params.id)
    .then(async (data) => {
      const latitude = data[0].latitude;
      const longitude = data[0].longitude;
      try {
        const response = await axios.get(url + latitude + ',' + longitude);
        const data = response.data;
        const hourDataJson = JSON.parse(JSON.stringify(data.hour_hour));
        let arrHours = Object.values(hourDataJson);
        const dayTwo = getDay(data.day2.date);
        const dayThree = getDay(data.day3.date);
        const dayFour = getDay(data.day4.date);
        const dayFive = getDay(data.day5.date);
        const daySix = getDay(data.day6.date);
        const daySeven = getDay(data.day7.date);
        let key = process.env.MAP_KEY.toString();
        res.render("index.twig", { data, arrHours, dayTwo, dayThree, dayFour, dayFive, daySix, daySeven, key });
      } catch (error) {
        console.error(error);
        res.json(error.message);
      }
    })
    .catch(err => {
      console.error(e)
      res.status(500).json(err.message);
    })


});



app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});


function getDay(date) {
  const dateCode = new Date(date).getDay();
  const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  return days[dateCode];
}
async function getCityPosition(city) {
  const address = city;
  return await geocoder.geocode(address);

}