const apiKey = "4ea20a58521ce82abf000877561f1da5";
const bcg = document.querySelectorAll(".bcg img");
const input = document.querySelector("input");
const icon = document.querySelector(".search");
const CountryName = document.querySelector("h2");
const time = document.querySelector(".time");
const temp = document.querySelector(".tempB");
const clouds = document.querySelector(".cloud img");
const Humidity = document.querySelector("#humidity");
const sunRise = document.querySelector("#sunrise");
const wind = document.querySelector("#wind");
const setRise = document.querySelector("#sunset");
const imgDayClouds = document.querySelectorAll(".day img");
const tempDay = document.querySelectorAll(".temp");
const detailes = document.querySelector(".detailes");
const dayNames = document.querySelectorAll(".dayname");
const description = document.querySelector(".text");
//get the audio elements
const sunAudio = document.getElementById("sun");
const nightAudio = document.getElementById("night");
const rainAudio = document.getElementById("rain");
const thunderAudio = document.getElementById("thunder");
const windAudio = document.getElementById("winds");
const foggyAudio = document.getElementById("foggy");
async function getWeatherDataNow(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) {
      throw new Error("City not found");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    alert(error.message);
  }
}
async function getWeatherDataAfter(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) {
      throw new Error("City not found");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    alert(error.message);
  }
}
function updateWeatherUI(currentData, forecastData) {
  if (!currentData || !forecastData) {
    alert("No data available");
    return;
  }
  /* Update the background image based on the current weather condition */

  setBackgroundImage(
    currentData.weather[0].main,
    currentData.main.temp,
    currentData.sys.sunrise,
    currentData.sys.sunset
  );
  CountryName.textContent = `${currentData.name}, ${currentData.sys.country}`;
  temp.textContent = `${Math.round(currentData.main.temp)}°C`;
  clouds.src = `http://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`;
  Humidity.innerHTML = `<span>${currentData.main.humidity}%</span>`;
  wind.innerHTML = `<span>${currentData.wind.speed} m/s</span>`;
  sunRise.innerHTML = new Date(
    currentData.sys.sunrise * 1000
  ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  setRise.innerHTML = new Date(
    currentData.sys.sunset * 1000
  ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); // pop is a value between 0 and 1 representing the probability of precipitation and  * 100 to convert it to a percentage
  description.textContent = currentData.weather[0].description;
  const prop = forecastData.list[0].pop || 0;
  console.log(prop);
  for (let i = 0; i < tempDay.length && i < forecastData.list.length; i++) {
    const forecastItem = forecastData.list[i * 8]; // Get the forecast for every 8th item (3-hour intervals);
    const date = new Date(forecastItem.dt * 1000);
    dayNames[i].textContent = date.toLocaleDateString("en-US", {
      weekday: "short",
    });
    tempDay[i].textContent = `${Math.round(forecastItem.main.temp)}°C`;
    imgDayClouds[
      i
    ].src = `http://openweathermap.org/img/wn/${forecastItem.weather[0].icon}@2x.png`;
    // Update the background image based on the weather condition
    if (forecastItem) {
      tempDay[i].textContent = `${Math.round(forecastItem.main.temp)}°C`;
      imgDayClouds[
        i
      ].src = `http://openweathermap.org/img/wn/${forecastItem.weather[0].icon}@2x.png`;
    }
  }
  detailes.style.visibility = "visible";
}
function setBackgroundImage(weatherCondition, temp, sunrise, sunset) {
  bcg.forEach((img) => {
    img.classList.remove("active");
  });
  const currentHour = new Date().getTime() / 1000;
  let backgroundId;
  if (currentHour < sunrise || currentHour > sunset) {
    backgroundId = "night";
  } else if (temp < 0) {
    backgroundId = "winter";
  } else if (weatherCondition === "Clear") {
    backgroundId = "sunny";
  } else if (weatherCondition === "Clouds") {
    backgroundId = "cloudy";
  } else if (weatherCondition === "Rain" || weatherCondition === "Drizzle") {
    backgroundId = "rain";
  } else if (weatherCondition === "Snow") {
    backgroundId = "winter";
  } else if (weatherCondition === "Thunderstorm") {
    backgroundId = "thunder";
  } else if (
    weatherCondition === "Mist" ||
    weatherCondition === "Smoke" ||
    weatherCondition === "Haze" ||
    weatherCondition === "Dust" ||
    weatherCondition === "Fog" ||
    weatherCondition === "Sand" ||
    weatherCondition === "Ash" ||
    weatherCondition === "Squall" ||
    weatherCondition === "Tornado"
  ) {
    backgroundId = "foggy";
  } else {
    backgroundId = "sunny"; // Default background
  }
  const active = document.getElementById(backgroundId);
  if (active) {
    /*Check if the element exists*/ active.classList.add("active");
  }
}
async function handle() {
  const city = input.value.trim();
  localStorage.setItem("city", city);
  if (!city) {
    alert("Please enter a city name");
    return;
  }
  const currentData = await getWeatherDataNow(city);
  const forecastData = await getWeatherDataAfter(city);
  updateWeatherUI(currentData, forecastData);
}
icon.addEventListener("click", handle);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handle();
  }
}); // Prevent the form from submitting
document.addEventListener("DOMContentLoaded", () => {
  const now = new Date();
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  time.textContent = now.toLocaleDateString("en-US", options);
  const last = localStorage.getItem("city");
  if (last) {
    input.value = last;
    handle();
  }
});
