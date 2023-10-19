const express = require('express');
const router = express.Router();
const request = require('request');
const config = require("../config.json");
const moment = require('moment');
const { json } = require('express/lib/response');


router.get("/:city/:day", async (req, res) => {
    const city = req.params.city;
    const day = req.params.day;

    const next5Days = moment().clone().add(5, 'days');

    if (!(moment(day).isSameOrAfter(moment(), 'day') && moment(day).isBefore(next5Days, 'day'))) {
        res.status(500).json({
            error:"something went wrong",
            messsage: "date is not valid"
        });
        return
    }

    const urlGeoInfo = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${config.apikey}`;

    request({ uri:urlGeoInfo, json: true }, (error, response, body) => {


        if(error && response.statusCode != 200){
            res.status(500).json({
                error:"something went wrong",
                messsage: error
            });
            return;
        }

        if(!body || Object.keys(body).length === 0){
            res.status(500).json({
                error:"something went wrong",
                messsage: "city provided don't exist"
            });
            return;
        }

        const geoData = body.map(i => {
            return {
                lat: i.lat,
                lon: i.lon
            }
        })


        const urlWeather = `http://api.openweathermap.org/data/2.5/forecast?lat=${geoData[0].lat}&lon=${geoData[0].lon}&appid=${config.apikey}`;


        request({uri:urlWeather, json:true}, (error, response, body) => {
            if(error && response.statusCode != 200){
                res.status(500).json({
                    error:"something went wrong",
                    messsage: error
                })
            }

            const weatherDataByDay = {};
            const finalResponse = [];

            body.list.forEach((item) => {
                const dateTime = item.dt_txt.split(' ');
                const date = dateTime[0];

                if (!weatherDataByDay[date]) {
                    weatherDataByDay[date] = [];
                }
                weatherDataByDay[date].push(item); 
            });


            weatherDataByDay[day].forEach((item) => {
                finalResponse.push({
                    weather:item.weather[0].description,
                    hour: new Date(item.dt_txt).getHours()
                })
            })


            res.status(200).json({
                result: {   
                    day:day,
                    forecast: finalResponse
                }
            });

            return;
        });
    });

        
});

module.exports = router;