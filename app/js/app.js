// Components selectors
const $body = document.querySelector("body");
let $btnClose = document.querySelectorAll(".btn-remove-module");
const $btnFormClose = document.querySelector(".btn-add-module-form");
const $btnShowForm = document.querySelector("#add-city");
const $addForm = document.querySelector(".module__form");
const $cityNameInput = document.querySelector("#search");
const $searchForm = document.querySelector(".find-city");
const $weatherContainer = document.querySelector("#app");

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
const $weatherForecast = document.querySelector(".weather__forecast");

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

$searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const cityName = formData.get("search");

  $searchForm.reset();

  $body.classList.add("loading");
  $addForm.classList.setAttribute("hidden", "hidden");

  const wheatherInfo = await new Weather().GetByCity(cityName);
  let newBox = new WeatherInfo(wheatherInfo);
  console.log(newBox);

  const newDOMBox = $weatherModule.cloneNode(true);
  $weatherContainer.appendChild(newDOMBox);
  newBox.prepareBox(newDOMBox);

  let $btnClose = document.querySelectorAll(".btn-remove-module");
});

// Get user location (latitude, longitude)
class Location {
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

// Get weather from user location
class Weather {
  WEATHER_API_KEY = "37a1594273db599dac37e502bc97e237";

  async GetByLatLon(lat, lon) {
    const URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.WEATHER_API_KEY}`;
    try {
      const data = await fetch(URL);
      const json = await data.json();
      return json;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      $body.classList.remove("loading");
      $weatherModule.removeAttribute("hidden");
    }
  }

  async GetByCity(city) {
    const URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.WEATHER_API_KEY}`;
    try {
      const data = await fetch(URL);
      const json = await data.json();
      return json;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      $body.classList.remove("loading");
      $weatherModule.removeAttribute("hidden");
    }
  }
}

// Hold information about weather
// TODO: CHANGE ICONS BASED ON WEATHER INFO
class WeatherInfo {
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
      valueSpan.innerText = `${prediction.temperature}\u{000B0}C`;
      temperatureSpan.appendChild(valueSpan);

      li.appendChild(citySpan);
      li.appendChild(img);
      li.appendChild(temperatureSpan);

      $weatherForecast.appendChild(li);
    });
  };
}

const main = async () => {
  const [lat, lon] = await new Location().Get();

  const weatherInfo = await new Weather().GetByLatLon(lat, lon);

  let firstBox = new WeatherInfo(weatherInfo);
  firstBox.prepareBox($weatherModule);
};

main();
