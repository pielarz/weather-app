const $body = document.querySelector("#body");
const $weatherBox = document.querySelector("#weather-box");
const $searchBox = document.querySelector("#search-box");
const $searchForm = document.querySelector("#find-city");
const $weatherContainer = document.querySelector("#app");

const $cityNames = document.querySelectorAll(".city__name");
const $todayTemperatures = document.querySelectorAll(".temperature__value");
const $pressureValues = document.querySelectorAll(".pressure__value");
const $humidityValues = document.querySelectorAll(".humidity__value");
const $windspeedValues = document.querySelectorAll(".wind-speed__value");
const $weatherForecast = document.querySelectorAll(".weather__forecast");

// buttons
const $addButton = document.querySelector("#add-city");
const $closeButtons = document.querySelectorAll(".btn--close");

// helper functions
function ConvertKelvinToCelcius(kelvin) {
  return Math.round((kelvin - 273.15) * 100) / 100;
}

function GetHourOfDay(date) {
  let d = new Date(date);
  return d.toLocaleTimeString();
}
