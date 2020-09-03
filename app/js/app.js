import WEATHER_API_KEY from "./api_keys";

// Components selectors
const $body = document.querySelector("body");
const $btnClose = document.querySelector(".btn-remove-module");
const $btnFormClose = document.querySelector(".btn-add-module-form");
const $btnShowForm = document.querySelector("#add-city");
const $addForm = document.querySelector(".module__form");
const $cityNameInput = document.querySelector("#search");

// Weather main module selectors
const $weatherModule = document.querySelector(".module__weather");
const $cityName = document.querySelector(".city__name");
const $temperature = document.querySelector(".temperature__value");

// Weather details module selectors
const $pressure = document.querySelector(".pressure__value");
const $humidity = document.querySelector(".humidity__value");
const $windSpeed = document.querySelector(".wind-speed__value");
const $weatherIcon = document.querySelector(".weather__icon").firstChild;

// Weather forecast module selectors
const $daysContent = document.querySelectorAll(".day");

// Get user location
let userLocation = async () => {};
