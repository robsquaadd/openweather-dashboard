var searchButtonEl = document.getElementById("search-btn");
var searchInputEl = document.getElementById("search-city");
var searchHistoryEl = document.getElementById("search-history");
var searchHistoryArray = [];
var weatherContainerEl = document.getElementById("weather-container");

const convertToLatLong = async (city) => {
  try {
    const apiKey = "a53b263fd5fb250576a1fa55d6798ef5";
    const apiURLGeo = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;
    const response = await fetch(apiURLGeo);
    const data = await response.json();
    console.log(data);
    var geoArray = [data[0].lat, data[0].lon];
    return geoArray;
  } catch (error) {
    console.log(error);
  }
};

const fetchCurrentWeatherData = async (array) => {
  try {
    const apiKey = "a53b263fd5fb250576a1fa55d6798ef5";
    const apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${array[0]}&lon=${array[1]}&appid=${apiKey}`;
    const response = await fetch(apiURL);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const displayCurrentWeatherData = (city, data) => {
  const cityNameEl = document.getElementById("city-name");
  const humidityEl = document.getElementById("humidity-value");
  const temperatureEl = document.getElementById("temperature-value");
  const uvIndexEl = document.getElementById("uvIndex-value");
  const windSpeedEl = document.getElementById("windSpeed-value");
  const iconEl = document.getElementById("current-weather-icon");
  iconEl.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${data.current.weather[0].icon}.png`
  );
  cityNameEl.textContent = city.replace("-", " ");
  humidityEl.textContent = data.current.humidity;
  temperatureEl.textContent = convertTemptoFarenheit(data.current.temp);
  if (parseFloat(data.current.uvi) < 4) {
    uvIndexEl.style.backgroundColor = "green";
  } else if (
    parseFloat(data.current.uvi) >= 4 &&
    parseFloat(data.current.uvi) < 8
  ) {
    uvIndexEl.style.backgroundColor = "yellow";
  } else {
    uvIndexEl.style.backgroundColor = "red";
  }
  uvIndexEl.textContent = data.current.uvi;
  windSpeedEl.textContent = data.current.wind_speed;
};

const displayFutureWeatherData = (data) => {
  const futureCardsArray = document.querySelectorAll(".future-card");
  for (i = 0; i < futureCardsArray.length; i++) {
    var futureIconEl = document.getElementById(`future-weather-icon-${i + 1}`);
    var dateEl = document.getElementById(`date-${i + 1}`);
    var futureTemperatureEl = document.getElementById(
      `future-temperature-${i + 1}`
    );
    var futureWindSpeedEl = document.getElementById(
      `future-wind-speed-${i + 1}`
    );
    var futureHumidityEl = document.getElementById(`future-humidity-${i + 1}`);
    var dateObject = moment.unix(data.daily[i + 1].dt);
    var date = dateObject._d;
    var formattedDate = moment(dateObject._d).format("dddd, MMM Do");
    dateEl.textContent = formattedDate;
    futureIconEl.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${
        data.daily[i + 1].weather[0].icon
      }.png`
    );
    futureTemperatureEl.textContent =
      "Temperature: " + convertTemptoFarenheit(data.daily[i + 1].temp.day);
    futureWindSpeedEl.textContent =
      "Wind Speed: " + data.daily[i + 1].wind_speed;
    futureHumidityEl.textContent =
      "Humidity: " + data.daily[i + 1].humidity + "%";
  }
};

const addSearchHistory = function (city) {
  var historyButtonEl = document.createElement("button");
  historyButtonEl.classList = "history-button btn-primary my-1 w-100 rounded";
  historyButtonEl.textContent = city.replace("-", " ");
  historyButtonEl.addEventListener("click", () => {
    var city = historyButtonEl.textContent;
    var formattedCity = city.replace(" ", "-");
    searchCity(formattedCity);
  });
  searchHistoryEl.prepend(historyButtonEl);
  searchHistoryArray.push(city.replace("-", " "));
  localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArray));
};

const searchCity = async (formattedCity) => {
  const latLong = await convertToLatLong(formattedCity);
  const currentWeatherData = await fetchCurrentWeatherData(latLong);
  displayCurrentWeatherData(formattedCity, currentWeatherData);
  displayFutureWeatherData(currentWeatherData);
  addSearchHistory(formattedCity);
  weatherContainerEl.style.display = "block";
};

const reloadButtons = () => {
  var historyArray = JSON.parse(localStorage.getItem("searchHistory"));
  if (historyArray != null || historyArray != undefined) {
    for (i = historyArray.length - 1; i >= 0; i--) {
      var historyButtonEl = document.createElement("button");
      historyButtonEl.classList =
        "history-button btn-primary my-1 w-100 rounded";
      historyButtonEl.textContent = historyArray[i];
      historyButtonEl.addEventListener("click", (e) => {
        var buttonClicked = e.target;
        var city = buttonClicked.textContent;
        var formattedCity = city.replace(" ", "-");
        searchCity(formattedCity);
      });
      searchHistoryEl.appendChild(historyButtonEl);
    }
  }
};

const convertTemptoFarenheit = (kelvin) => {
  var tempCelsius = kelvin - 273;
  var tempFarenheit = Math.floor((9 / 5) * tempCelsius + 32);
  return tempFarenheit;
};

searchButtonEl.addEventListener("click", () => {
  var city = searchInputEl.value;
  var formattedCity = city.replace(" ", "-");
  searchCity(formattedCity);
});
reloadButtons();
