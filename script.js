const apiKey = "361f461bd053e84661b77a41ae71cf2b"; // Your OpenWeather API key

function showHome() {
    document.getElementById("home").style.display = "block";
    document.getElementById("about").style.display = "none";
}

function showAbout() {
    document.getElementById("home").style.display = "none";
    document.getElementById("about").style.display = "block";
}

function getWeather() {
    const city = document.getElementById("input").value.trim();
    if (!city) {
        alert("Please enter a city name.");
        return;
    }
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude=current,minutely,daily,alerts&appid=${apiKey}&units=metric`;
    fetchWeatherData(weatherUrl, forecastUrl);
}

function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
            const forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&appid=${apiKey}&units=metric`;
            fetchWeatherData(weatherUrl, forecastUrl);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function fetchWeatherData(weatherUrl, forecastUrl) {
    document.getElementById("loader").style.display = "block";
    document.getElementById("result").style.display = "none";
    document.getElementById("hourly-chart-container").style.display = "none";
    
    fetch(weatherUrl)
        .then((response) => response.json())
        .then((data) => {
            document.getElementById("loader").style.display = "none";
            document.getElementById("result").style.display = "block";
            document.getElementById("city-name").innerText = data.name;
            document.getElementById("weather-desc").innerText = data.weather[0].description;
            document.getElementById("temperature").innerText = data.main.temp;
            document.getElementById("humidity").innerText = data.main.humidity;
            document.getElementById("wind-speed").innerText = data.wind.speed;
            fetch(forecastUrl)
                .then((response) => response.json())
                .then((forecastData) => {
                    displayHourlyChart(forecastData.hourly);
                });
        })
        .catch((error) => {
            document.getElementById("loader").style.display = "none";
            alert("Error fetching weather data. Please try again.");
        });
}

function displayHourlyChart(hourlyData) {
    const hours = [];
    const temps = [];
    hourlyData.forEach((hour) => {
        const date = new Date(hour.dt * 1000);
        hours.push(`${date.getHours()}:00`);
        temps.push(hour.temp);
    });
    document.getElementById("hourly-chart-container").style.display = "block";
    const ctx = document.getElementById("hourlyChart").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: hours,
            datasets: [
                {
                    label: "Hourly Temperature (°C)",
                    data: temps,
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                    fill: false,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

document.getElementById("copyrightYear").innerText = new Date().getFullYear();
