import React, { useState, useEffect } from 'react';

const IndexPage: React.FC = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState<any>(null);
    const [error, setError] = useState('');
    const [currentDateTime, setCurrentDateTime] = useState('');

    const apiKey = '0b1d6509a07887d1480ab3060a20dad9';

    const getWeather = async () => {
        if (!city) {
            setError('Please enter a city');
            return;
        }
    
        try {
            const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    
            const currentWeatherResponse = await fetch(currentWeatherUrl);
            const currentWeatherData = await currentWeatherResponse.json();
    
            if (currentWeatherData.cod && currentWeatherData.cod !== 200) {
                setError('Place not available or wrong place name');
                return;
            }
    
            const forecastResponse = await fetch(forecastUrl);
            const forecastData = await forecastResponse.json();
    
            setWeatherData({ current: currentWeatherData, forecast: forecastData.list });
            setError('');
        } catch (error) {
            console.error('Error fetching weather data:', error);
            setError('Error fetching weather data. Please try again.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCity(e.target.value);
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        const hours = date.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${formattedHours}:${minutes} ${ampm}`;
    };

    const getCurrentDateTime = () => {
        const date = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } as const;
        const formattedDate = date.toLocaleDateString(undefined, options);
        const hours = date.getHours() % 12 || 12;
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
        const formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`;
        setCurrentDateTime(`${formattedDate} ${formattedTime}`);
    };
    
    
    useEffect(() => {
        const interval = setInterval(getCurrentDateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        getCurrentDateTime();
    }, []);

    return (
        <div id="weather-container">
            <h2>Weather App</h2>
            <input type="text" id="city" placeholder="Enter city" value={city} onChange={handleChange} />
            <button onClick={getWeather}>Search</button>

            {error && <p>{error}</p>}

            {weatherData && (
                <>
                    <img className="weather-icon" src={`http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}.png`} alt="Weather Icon" />
                    <div id="weather-info">
                        <p>{Math.round(weatherData.current.main.temp - 273.15)}°C</p>
                        <p>{weatherData.current.weather[0].main}</p>
                        <p>{currentDateTime}</p>
                    </div>
                    <div id="hourly-forecast">
                        {weatherData.forecast.map((hour: any, index: number) => (
                            <div className="hourly-item" key={index}>
                                <p>{Math.round(hour.main.temp - 273.15)}°C</p>
                                <p>{formatTime(hour.dt)}</p>
                                <img src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}.png`} alt="Hourly Weather Icon" />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default IndexPage;
