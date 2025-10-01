// Cliente para OpenWeatherMap API
const fetch = require('node-fetch')
require('dotenv').config();


const API_KEY = process.env.OPENWEATHER_KEY


async function fetchWeatherByCity(city) {
if (!API_KEY) throw new Error('OPENWEATHER_KEY não definido no .env')


const encoded = encodeURIComponent(city)
const url = `https://api.openweathermap.org/data/2.5/weather?q=${encoded}&units=metric&lang=pt_br&appid=${API_KEY}`


const res = await fetch(url)
if (!res.ok) throw new Error(`Erro na API: ${res.status}`)


const data = await res.json()


return {
temp: data.main.temp,
feels_like: data.main.feels_like,
description: data.weather[0].description
}
}


module.exports = { fetchWeatherByCity }
