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

// Event listeners
$btnShowForm.addEventListener("click", () => {
  $addForm.getAttributeNames()[1] === "hidden"
    ? $addForm.removeAttribute("hidden")
    : $addForm.setAttribute("hidden", "hidden");
});

$btnFormClose.addEventListener("click", () => {
  $addForm.getAttributeNames()[1] === "hidden"
    ? $addForm.removeAttribute("hidden")
    : $addForm.setAttribute("hidden", "hidden");
});

// Get user location (latitude, longitude)
class Location {
  Get() {
    try {
      let array = [];
      navigator.geolocation.getCurrentPosition((data) => {
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

// Get weather from user location
class Weather {
  WEATHER_API_KEY = "";

  async GetByLatLon(lat, lon) {
    const URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`;
    try {
      const data = await fetch(URL);
      const json = await data.json();
      return json;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      $body.classList.remove("loading");
      $weatherModule.classList.remove("hidden");
    }
  }

  async GetByCity(city) {
    const URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${WEATHER_API_KEY}`;
    try {
      const data = await fetch(URL);
      const json = await data.json();
      return json;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      $body.classList.remove("loading");
      $weatherModule.classList.remove("hidden");
    }
  }
}

// Hold information about weather
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

  prepareBox = () => {
    $cityName.innerText = this.name;
    $temperature.innerText = this.todayTemp;
    $pressure.innerText = this.todayPress + " hPa";
    $humidity.innerText = this.todayHuma + "%";
    $windSpeed.innerText = this.todayWind + " m/s";

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

      $daysContent[0].append(li);
    });
  };
}
