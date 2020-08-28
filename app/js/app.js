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

// Display weather info
class CITY {
  constructor(json) {
    this.name = json.city.name;
    this.todayTemp = ConvertKelvinToCelcius(json.list[0].main.temp);
    this.todayPress = json.list[0].main.pressure;
    this.todayHuma = json.list[0].main.humidity;
    this.todayWind = json.list[0].wind.speed;
    this.todayIco = json.list[0].weather[0].main;
    this.predWeather = [];
    for (let i = 1; i <= 5; i++) {
      const tempObj = {
        hour: GetHourOfDay(json.list[i].dt_txt),
        icon: json.list[i].weather[0].main,
        temperature: ConvertKelvinToCelcius(json.list[i].main.temp),
      };
      this.predWeather.push(tempObj);
    }
  }

  prepareBox = (DOM) => {
    DOM.querySelectorAll(".city__name")[0].innerText = this.name;
    DOM.querySelectorAll(".temperature__value")[0].innerText = this.todayTemp;
    DOM.querySelectorAll(".pressure__value")[0].innerText =
      this.todayPress + " hPa";
    DOM.querySelectorAll(".humidity__value")[0].innerText =
      this.todayHuma + "%";
    DOM.querySelectorAll(".wind-speed__value")[0].innerText =
      this.todayWind + " m/s";

    DOM.querySelectorAll(".weather__forecast")[0].innerText = "";

    this.predWeather.forEach((prediction) => {
      const li = document.createElement("LI");

      const citySpan = document.createElement("SPAN");
      citySpan.classList.add("day");
      citySpan.innerText = prediction.hour;

      const img = document.createElement("IMG");
      img.src = "images/icons/clear-day.svg";

      const temperatureSpan = document.createElement("SPAN");
      const valueSpan = document.createElement("SPAN");
      valueSpan.innerText = prediction.temperature;
      temperatureSpan.appendChild(valueSpan);

      li.appendChild(citySpan);
      li.appendChild(img);
      li.appendChild(temperatureSpan);

      DOM.querySelectorAll(".weather__forecast")[0].appendChild(li);
    });
  };
}

const main = async () => {
  // User location info
  const [lat, lon] = await new IP().Get();

  // Weather info from user location
  const weatherInfo = await new WEATHER().GetByLatLon(lat, lon);

  // Prepare box
  let firstBox = new CITY(weatherInfo);
  firstBox.prepareBox($weatherBox);
};

main();

// EVENT HANDLERS

// event listeners handling
$addButton.addEventListener("click", () => {
  $searchBox.classList.toggle("d-none");
});

// search city handling
$searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const cityName = formData.get("search");

  // form clear
  $searchForm.reset();

  // loader
  $body.classList.add("loading");
  $searchBox.classList.toggle("d-none");

  // get data from API
  const wheatherInfo = await new WEATHER().GetByCity(cityName);
  let newBox = new CITY(wheatherInfo);
  console.log(newBox);

  // new weather box
  const newDOMBox = $weatherBox.cloneNode(true);
  $weatherContainer.appendChild(newDOMBox);

  // inserting data to weather box
  newBox.prepareBox(newDOMBox);

  // refresh references to buttons
  $closeButtons = document.querySelectorAll(".btn--close");
});

// close weather box handling
$closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.parentNode.classList.add("d-none");
  });
});
