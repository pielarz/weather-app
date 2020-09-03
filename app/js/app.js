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

// Helpers
function ConvertKelvinToCelcius(kelvin) {
  return Math.round((kelvin - 273.15) * 100) / 100;
}

function GetHourOfDay(date) {
  let d = new Date(date);
  return d.toLocaleTimeString();
}

// Get user location (latitude, longitude)
class Location {
  async Get() {
    try {
      let array = [];
      const data = await navigator.geolocation.getCurrentPosition((data) => {
        array.push(data.coords.latitude);
        array.push(data.coords.longitude);
      }, console.error("Can't get user location"));

      return array;
    } catch (error) {
      console.error(error);
      // Warsaw city coordinates
      return [52.237049, 21.017532];
    }
  }
}
