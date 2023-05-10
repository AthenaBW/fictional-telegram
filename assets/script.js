// Variables
var searchButton = $("#search-button");
var cityEl = $("#current-city");
var citySearch = $("#city-Search")
var currentTempEl = $("#temperature");
var currentHumidityEl = $("#humidity");
var currentWindEl = $("#wind-speed");
var city = "";
var cityS = [];

const APIKey = "1d0e627d5fe8d06e3b6a7622fe65ea25";

function displayWeather(event) {
    event.preventDefault();

    city = citySearch.val();
    currentWeather(city);
  }

  // AJAX call
  function currentWeather(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +  city + "&APPID=" + APIKey;

    $.ajax({ url: queryURL, method: "GET",
    }).then(function (response) {
        
      var weatherIcon = response.weather[0].icon;

      var iconUrl = "https://openweathermap.org/img/wn/" + weatherIcon + ".png";
  
      var date = new Date(response.dt * 1000).toLocaleDateString();

      $(cityEl).html( response.name + "(" + date + ")" + "<img src=" + iconUrl + ">");
  
      // Convert the temp to fahrenheit
  
      var Ftemp = (response.main.temp - 273.15) * 1.8 + 32;

      $(currentTempEl).html(Ftemp.toFixed(0) + " F");
  
      $(currentHumidityEl).html(response.main.humidity + "%");
  
      // convert wind to MPH
      var ws = response.wind.speed;
      var windsmph = (ws * 2.237).toFixed(0);
      $(currentWindEl).html(windsmph + " MPH");
  
      // set local storage
      forecast(response.id);
      if (response.id !== "null") {
        cityS = JSON.parse(localStorage.getItem("cityname"));
  
        if (cityS == null) {
          cityS = [];
          cityS.push(city);
          localStorage.setItem("cityname", JSON.stringify(cityS));
          addToList(city);
        } else {
          if (find(city) > 0) {
            cityS.push(city);
            localStorage.setItem("cityname", JSON.stringify(cityS));
            addToList(city);
          }
        }
      }
    });
  }
  
  function forecast(cityid) {
    var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?id=${cityid}&appid=${APIKey}`;
    $.ajax({
      url: forecastURL,
      method: "GET",
    }).then((response) => {
      for (let i = 0; i < 5; i++) {
        var date = new Date(response.list[(i + 1) * 7].dt * 1000).toLocaleDateString();
        var iconcode = response.list[(i + 1) * 7].weather[0].icon;
        var iconUrl = `https://openweathermap.org/img/w/${iconcode}.png`;
        var tempA = response.list[(i + 1) * 7].main.temp;
        var Ftemp = ((tempA - 273.5) * 1.8 + 32).toFixed(0);
        var humidity = response.list[(i + 1) * 7].main.humidity;
  
        $(`#wDate${i}`).html(date);
        $(`#wImg${i}`).html(`<img src="${iconUrl}">`);
        $(`#wTemp${i}`).html(`${Ftemp} F`);
        $(`#wHumidity${i}`).html(`${humidity}%`);
      }
    });
  }
  
  function addToList(place) {
    const listEl = $(`<li>${place}</li>`)
      .attr("class", "list-group-item")
      .attr("data-value", place);
    $(".list-group").append(listEl);
  }
  
// local storage
function previousCity() {
    $("ul").empty();
    var cityS = JSON.parse(localStorage.getItem("cityname"));
    if (cityS !== null) {
      cityS = JSON.parse(localStorage.getItem("cityname"));
      for (i = 0; i < cityS.length; i++) {
        addToList(cityS[i]);
      }
      city = cityS[(i -= 1)];
  
      currentWeather(city);
    }
  }
  
  //Click Handlers
  $("#search-button").on("click", displayWeather);
  
  $(window).on("load", previousCity);
  