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

// Get user location from API
class IP {
  async Get() {
    try {
      const data = await fetch("http://ip-api.com/json/");
      const json = await data.json();

      const lat = json.lat;
      const lon = json.lon;

      return [lat, lon];
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
// Weather API from user location
class WEATHER {
  APIKEY = "37a1594273db599dac37e502bc97e237";

  async GetByLatLon(lat, lon) {
    const URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.APIKEY}`;
    try {
      const data = await fetch(URL);
      const json = await data.json();
      return json;
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      $body.classList.remove("loading");
      $weatherBox.classList.remove("d-none");
    }
  }

  async GetByCity(city) {
    const URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.APIKEY}`;
    try {
      const data = await fetch(URL);
      const json = await data.json();
      return json;
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      $body.classList.remove("loading");
      $weatherBox.classList.remove("d-none");
    }
  }
}
