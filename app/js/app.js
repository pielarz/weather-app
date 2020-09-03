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

const $addButton = document.querySelector("#add-city");
let $closeButtons = document.querySelectorAll(".btn--close");

function ConvertKelvinToCelcius(kelvin) {
  return Math.round((kelvin - 273.15) * 100) / 100;
}

function GetHourOfDay(date) {
  return new Date(date).toLocaleTimeString(navigator.language, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

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

class WEATHER {
  APIKEY = "Enter your API key";

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
      valueSpan.innerText = `${prediction.temperature}\u{000B0}C`;
      temperatureSpan.appendChild(valueSpan);

      li.appendChild(citySpan);
      li.appendChild(img);
      li.appendChild(temperatureSpan);

      DOM.querySelectorAll(".weather__forecast")[0].appendChild(li);

      DOM.firstElementChild.addEventListener("click", () => {
        DOM.setAttribute("hidden", "true");
      });
    });
  };
}

const main = async () => {
  const [lat, lon] = await new IP().Get();

  const wheatherInfo = await new WEATHER().GetByLatLon(lat, lon);

  let firstBox = new CITY(wheatherInfo);
  firstBox.prepareBox($weatherBox);
};

main();

$addButton.addEventListener("click", () => {
  $searchBox.getAttributeNames()[2] == "hidden"
    ? $searchBox.removeAttribute("hidden")
    : $searchBox.setAttribute("hidden", "true");
});

$searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const cityName = formData.get("search");

  $searchForm.reset();

  $body.classList.add("loading");
  $searchBox.setAttribute("hidden", "true");

  const wheatherInfo = await new WEATHER().GetByCity(cityName);
  let newBox = new CITY(wheatherInfo);
  console.log(newBox);

  const newDOMBox = $weatherBox.cloneNode(true);
  newDOMBox.removeAttribute("hidden");
  $weatherContainer.appendChild(newDOMBox);

  newBox.prepareBox(newDOMBox);

  $closeButtons = document.querySelectorAll(".btn--close");
});

$closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.parentNode.getAttributeNames()[2] == "hidden"
      ? button.parentNode.removeAttribute("hidden")
      : button.parentNode.setAttribute("hidden", "true");
  });
});
