import React, { useState } from "react";
import axios from "axios";

const Weather = () => {
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [temperature, setTemperature] = useState("");
    const [condition, setCondition] = useState("");

    const getWeather = async () => {
        try {
            const response = await axios.get(
                `https://api.weatherapi.com/v1/forecast.json?key=466930a22fc94a0696c52143232202&q=${location}&days=${date}&aqi=no&alerts=no`
            );
            console.log(response.data);
            setTemperature(response.data['forecast']['forecastday'][date - 1]['day']['avgtemp_c']);
            setCondition(response.data['forecast']['forecastday'][date - 1]['day']['condition']['text']);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <label htmlFor="location">Location:</label>
            <input
                type="text"
                id="location"
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />

            <br />

            <label htmlFor="date">Date:</label>
            <input
                type="number"
                id="date"
                name="date"
                min="1"
                max="10"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />

            <br />

            <button onClick={getWeather}>Get Weather</button>

            {temperature && <p>Temperature: {temperature}°C</p>}
            {condition && <p>Condition: {condition}</p>}
        </div>
    );
};

export default Weather;
