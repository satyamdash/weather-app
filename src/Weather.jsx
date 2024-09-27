import React, { useState, useEffect } from 'react'
import './Weather.css'

const Weather = () => {
   const [city, setCity] = useState('');
   const [weather, setWeather] = useState(null);
   const [error, setError] = useState(null);
   const [currentTime, setCurrentTime] = useState('');

   const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

   const getWeather = async () => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setWeather(data);
      setError(null);
      updateLocalTime(data.timezone);
    } catch (e) {
      console.error("An error occurred:", e);
      setError("Failed to fetch weather data. Please check your API key and try again.");
      setWeather(null);
    }
   }

   const getWeatherIcon = (iconCode) => {
     return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
   }

   const updateLocalTime = (timezoneOffset) => {
     const localTime = new Date(Date.now() + timezoneOffset * 1000 + new Date().getTimezoneOffset() * 60000);
     setCurrentTime(localTime.toLocaleTimeString());
   }

   useEffect(() => {
     if (weather) {
       const timer = setInterval(() => updateLocalTime(weather.timezone), 1000);
       return () => clearInterval(timer);
     }
   }, [weather]);

  return (
    <div className="weather-container">
      <input 
        type="text" 
        className="weather-input"
        value={city} 
        onChange={(e) => setCity(e.target.value)} 
        placeholder="Enter city name..." 
      />
      <button className="weather-button" onClick={getWeather}>Get Weather</button>
      {error && <p className="weather-error">{error}</p>}
      {weather && (
        <div className="weather-info">
          <div className="weather-main">
            <img 
              className="weather-icon" 
              src={getWeatherIcon(weather.weather[0].icon)} 
              alt={weather.weather[0].description} 
            />
            <h2>{weather.name}, {weather.sys.country}</h2>
          </div>
          <div className="weather-details">
          <p className="weather-time">🕒 Time IST: {currentTime}</p>
            <p>🌡️ Temperature: {weather.main.temp}°C</p>
            <p>体感 Feels like: {weather.main.feels_like}°C</p>
            <p>☁️ Weather: {weather.weather[0].description}</p>
            <p>💧 Humidity: {weather.main.humidity}%</p>
            <p>💨 Wind Speed: {weather.wind.speed} m/s</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Weather
