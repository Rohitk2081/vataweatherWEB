async function getWeather() {
    const apiKey = '0f10bdcf8a7f5a1eb8d786a061b0e9da'; // Replace with your actual API key
    const city = document.getElementById('city').value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === '404') {
            document.getElementById('weather-info').innerHTML = '<p>City not found</p>';
            return;
        }

        // Convert sunrise and sunset from UNIX timestamp to readable format
        const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
        const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();

        // Build the weather details using Bootstrap cards
        const weatherDetails = `
            <h2 class="text-center mb-4">${data.name}, ${data.sys.country}</h2>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <div class="card bg-light">
                        <div class="card-body">
                            <h5 class="card-title">Temperature</h5>
                            <p class="card-text">${data.main.temp} °C</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="card bg-light">
                        <div class="card-body">
                            <h5 class="card-title">Feels Like</h5>
                            <p class="card-text">${data.main.feels_like} °C</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="card bg-light">
                        <div class="card-body">
                            <h5 class="card-title">Weather</h5>
                            <p class="card-text">${data.weather[0].description}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="card bg-light">
                        <div class="card-body">
                            <h5 class="card-title">Humidity</h5>
                            <p class="card-text">${data.main.humidity}%</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="card bg-light">
                        <div class="card-body">
                            <h5 class="card-title">Wind Speed</h5>
                            <p class="card-text">${data.wind.speed} m/s</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="card bg-light">
                        <div class="card-body">
                            <h5 class="card-title">Sunrise</h5>
                            <p class="card-text">${sunriseTime}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="card bg-light">
                        <div class="card-body">
                            <h5 class="card-title">Sunset</h5>
                            <p class="card-text">${sunsetTime}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('weather-info').innerHTML = weatherDetails;

        // Call function to get 5-day forecast
        getForecast(city);
    } catch (error) {
        document.getElementById('weather-info').innerHTML = '<p>Error fetching data</p>';
    }
}

async function getForecast(city) {
    const apiKey = '0f10bdcf8a7f5a1eb8d786a061b0e9da'; // Replace with your actual API key
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(forecastUrl);
        const data = await response.json();

        let forecastDetails = '<h3 class="text-center mt-5 mb-3">5-Day Forecast</h3><div class="row">';

        // Loop through forecast data (filtering for the daily 12:00 PM forecast)
        data.list.forEach((forecast, index) => {
            if (forecast.dt_txt.includes("12:00:00")) {
                const date = new Date(forecast.dt * 1000).toLocaleDateString();
                const temp = forecast.main.temp;
                const description = forecast.weather[0].description;
                const icon = `http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;

                // Add a card for each day's forecast
                forecastDetails += `
                    <div class="col-md-4 mb-3">
                        <div class="card bg-light">
                            <div class="card-body text-center">
                                <h5 class="card-title">${date}</h5>
                                <img src="${icon}" alt="Weather icon">
                                <p class="card-text">${temp} °C</p>
                                <p class="card-text">${description}</p>
                            </div>
                        </div>
                    </div>
                `;
            }
        });

        forecastDetails += '</div>';
        document.getElementById('weather-info').insertAdjacentHTML('beforeend', forecastDetails);
    } catch (error) {
        console.error('Error fetching forecast:', error);
    }
}