// ===============================
// Async Weather Tracker - FIXED JS
// ===============================

const apiKey = "700d26937883a4ed1a74de05446066a8";

// DOM Elements
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherResult = document.getElementById("weatherResult");
const historyDiv = document.getElementById("history");
const logBox = document.getElementById("logBox");

// ===============================
// LOG FUNCTION
// ===============================
function log(message) {
    console.log(message);
    logBox.textContent += message + "\n";
}

// ===============================
// PAGE LOAD
// ===============================
window.addEventListener("load", () => {
    logBox.textContent = ""; // clear old logs
    log("1️⃣ Page Loaded (Sync)");
    loadHistory();
});

// ===============================
// SEARCH BUTTON
// ===============================
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (city === "") {
        weatherResult.innerHTML = `<p class="error">Please enter a city name</p>`;
        return;
    }

    fetchWeather(city);
});

// ===============================
// FETCH WEATHER (ASYNC)
// ===============================
async function fetchWeather(city) {

    logBox.textContent = ""; // 🔥 CLEAR LOG EACH SEARCH

    log("2️⃣ Sync Start");
    log("3️⃣ Before Fetch (Async starts)");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        log("4️⃣ Fetch Completed (Promise resolved)");

        const data = await response.json();

        if (data.cod !== 200) {
            throw new Error(data.message);
        }

        displayWeather(data);
        saveToHistory(city);

        log("5️⃣ Data Processed Successfully");

    } catch (error) {
        weatherResult.innerHTML = `<p class="error">${error.message}</p>`;
        log("❌ Error: " + error.message);
    }

    log("6️⃣ Sync End");
}

// ===============================
// DISPLAY WEATHER
// ===============================
function displayWeather(data) {
    weatherResult.innerHTML = `
        <p><span>City</span><span>${data.name}, ${data.sys.country}</span></p>
        <p><span>Temp</span><span>${data.main.temp} °C</span></p>
        <p><span>Weather</span><span>${data.weather[0].main}</span></p>
        <p><span>Humidity</span><span>${data.main.humidity}%</span></p>
        <p><span>Wind</span><span>${data.wind.speed} m/s</span></p>
    `;
}

// ===============================
// LOCAL STORAGE
// ===============================
function saveToHistory(city) {
    let history = JSON.parse(localStorage.getItem("cities")) || [];

    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem("cities", JSON.stringify(history));
    }

    loadHistory();
}

function loadHistory() {
    historyDiv.innerHTML = "";

    let history = JSON.parse(localStorage.getItem("cities")) || [];

    history.forEach(city => {
        const btn = document.createElement("button");
        btn.textContent = city;
        btn.onclick = () => fetchWeather(city);
        historyDiv.appendChild(btn);
    });
}

// ===============================
// EVENT LOOP DEMO (RUN ONCE)
// ===============================
Promise.resolve().then(() => {
    console.log("Microtask executed");
});

setTimeout(() => {
    console.log("Macrotask executed");
}, 0);