var searchButtonEl = document.getElementById("search-btn");
var searchInputEl = document.getElementById("search-city");
var searchHistoryEl = document.getElementById("search-history");
var searchHistoryArray = [];

const convertToLatLong = async (city) => {
  try {
    const apiKey = "a53b263fd5fb250576a1fa55d6798ef5";
    const apiURLGeo = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;
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
  cityNameEl.textContent = city;
  humidityEl.textContent = data.current.humidity;
  temperatureEl.textContent = data.current.temp;
  uvIndexEl.textContent = data.current.uvi;
  windSpeedEl.textContent = data.current.wind_speed;
};

const displayFutureWeatherData = (city, data) => {
  const futureCardsArray = document.querySelectorAll(".future-card");
  for (i = 0; i < futureCardsArray.length; i++) {
    var futureTemperatureEl = document.getElementById(
      `future-temperature-${i + 1}`
    );
    var futureWindSpeedEl = document.getElementById(
      `future-wind-speed-${i + 1}`
    );
    var futureHumidityEl = document.getElementById(`future-humidity-${i + 1}`);
    futureTemperatureEl.textContent =
      "Temperature: " + data.daily[i + 1].temp.day;
    futureWindSpeedEl.textContent =
      "Wind Speed: " + data.daily[i + 1].wind_speed;
    futureHumidityEl.textContent = "Humidity: " + data.daily[i + 1].humidity;
  }
};

const addSearchHistory = function (city) {
  var historyButtonEl = document.createElement("button");
  historyButtonEl.classList = "history-button";
  historyButtonEl.textContent = city;
  searchHistoryEl.appendChild(historyButtonEl);
  searchHistoryArray.push(city);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArray));
};

const searchCity = async () => {
  const city = searchInputEl.value;
  const formattedCity = city.replace(" ", "-");
  const latLong = await convertToLatLong(formattedCity);
  const currentWeatherData = await fetchCurrentWeatherData(latLong);
  displayCurrentWeatherData(city, currentWeatherData);
  displayFutureWeatherData(city, currentWeatherData);
  addSearchHistory(city);
};

searchButtonEl.addEventListener("click", searchCity);
