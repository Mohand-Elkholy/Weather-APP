let city =document.getElementById("city");
let searchBtn = document.getElementById("searchBtn");
let locationBtn = document.getElementById("locationBtn");

let currentWeather = document.querySelectorAll(".weather-left .card")[0];

let dayForecast = document.querySelector(".day-forecast");

let air_pulloution = document.querySelectorAll(".highlights .card")[0];
let sunRise = document.querySelectorAll(".highlights .card")[1];
let aqiList = ['Good' , 'Fair' , 'Moderate' , 'Poor' , 'Very Poor'];


let humidityVal = document.getElementById("humidityVal");
let pressureVal = document.getElementById("pressureVal");
let visibilityVal = document.getElementById("visibilityVal");
let windSpeedVal = document.getElementById("windSpeedVal");
let feelsVal = document.getElementById("feelsVal");

let hourlyForecastCard = document.querySelector(".hourly-forecast")


let api_key = "a20e45525a2fac6af4cac2865bc3aff4";

searchBtn.addEventListener("click",getCity);
locationBtn.addEventListener("click" , getUserLocation)
function getUserLocation(){
    navigator.geolocation.getCurrentPosition(position =>{
        let {latitude , longitude} = position.coords;
        let reverse_url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${api_key}`
        fetch(reverse_url).then(res => res.json()).then(data =>{
            let {name , country , state} = data[0];
            getWeather(name , latitude ,longitude ,country ,state)
        })
    },error =>{
        if(error.code === error.PERMISSION_DENIED){
            Swal.fire({
            title: "Access Denied",
            text: 'Geolocation permission denied.  Please reset location permission to grant access again ',
            icon: "error"
        });
        }
    })
}

function getCity(){
    let cityName =city.value.trim();
    city.value='';
    if(cityName==null) return;
    let api_url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${api_key}`
    fetch(api_url).then(res => res.json()).then(data =>{
        let {name , lat ,lon ,country ,state}=data[0];
        getWeather(name , lat ,lon ,country ,state);
    })
}

function getWeather(name , lat ,lon ,country ,state){
    let forecast_api_url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`
    let weather_api_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`
    let polloution_api_url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    fetch(weather_api_url).then(res => res.json()).then(data =>{
        let date = new Date();
        currentWeather.innerHTML =`
        <div class="current-weather">
                    <div class="details">
                        <p>Now</p>
                        <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                        <p>${data.weather[0].description}</p>
                    </div>
                    <div class="weather-icon">
                        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
                    </div>
                </div>
                <div class="card-footer">
                    <p><i class="fa-regular fa-calendar"></i>${days[date.getDay()]}, ${date.getDate()}, ${months[date.getMonth()]} ${date.getFullYear()}</p>
                    <p><i class="fa-solid fa-location-dot"></i>${name}, ${country}</p>
        </div>
        `;
        let {sunrise , sunset}= data.sys;
            let {timezone , visibility} = data;
            let {humidity , pressure , feels_like } = data.main;
            let {speed} =  data.wind;
            let sunriseTime = moment.utc(sunrise, 'X').add(timezone , 'seconds').format('hh:mm A');
            let sunsetTime = moment.utc(sunset, 'X').add(timezone , 'seconds').format('hh:mm A');
            sunRise.innerHTML = `
                <div class="card-head">
                            <p>Sunrise & Sunset</p>
                        </div>
                        <div class="sunrise-sunset">
                            <div class="item">
                                <div class="icon">
                                    <i class="fa-regular fa-sun fa-4x"></i>
                                </div>
                                <div>
                                    <p>Sunrise</p>
                                    <h2>${sunriseTime}</h2>
                                </div>
                            </div>
                            <div class="item">
                                <div class="icon">
                                    <i class="fa-solid fa-sun fa-4x"></i>
                                </div>
                                <div>
                                    <p>Sunset</p>
                                    <h2>${sunsetTime}</h2>
                                </div>
                            </div>
                        </div>
            `
        humidityVal.innerHTML = `${humidity}%`;
        pressureVal.innerHTML = `${pressure}hPa`;
        visibilityVal.innerHTML = `${visibility / 1000}Km`;
        windSpeedVal.innerHTML = `${speed}m/s`;
        feelsVal.innerHTML = `${(feels_like -273.15).toFixed(2)}&deg;C`;
    })
    fetch(forecast_api_url).then(res => res.json()).then(data =>{
        let hourlyForecast = data.list;
        hourlyForecastCard.innerHTML = ''
        for(i=1; i<= 8 ; i++){
            let hourlyForecastDate = new Date(hourlyForecast[i].dt_txt);
            let hr = hourlyForecastDate.getHours();
            let x = "PM"
            if(hr < 12) x = "AM";
            if(hr == 0) hr = 12 ;
            if(hr > 12) hr = hr -12;

            hourlyForecastCard.innerHTML += `
                <div class="card">
                        <p>${hr} ${x}</p>
                        <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png" alt="">
                        <p>${(hourlyForecast[i].main.temp -273.15).toFixed(2)}&deg;C</p>
                    </div>
            `
        }
        let forecastDays=[];
        let fiveForecastDays = data.list.filter(forecast =>{
            let forecastDate = new Date(forecast.dt_txt).getDate();
            if(!forecastDays.includes(forecastDate)){
                return forecastDays.push(forecastDate);
            }
        })
        dayForecast.innerHTML = ''
        for( i=1 ; i < fiveForecastDays.length ; i++){
            let date = new Date(fiveForecastDays[i].dt_txt);
            dayForecast.innerHTML += `
                <div class="forecast-item">
                            <div class="icon-wrapper">
                                <img src="https://openweathermap.org/img/wn/${fiveForecastDays[i].weather[0].icon}.png" alt="">
                                <span>${(fiveForecastDays[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
                            </div>
                            <p>${date.getDate()} ${months[date.getMonth()]}</p>
                            <p>${days[date.getDay()]}</p>
                        </div>
            `;
            
        }

    })


    fetch(polloution_api_url).then(res => res.json()).then(data =>{
        let {co ,no ,no2 ,o3 ,so2 , pm2_5 ,pm10 , nh3 }= data.list[0].components;
        air_pulloution.innerHTML = `
            <div class="card-head">
                            <p>Air Quality Index</p>
                            <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[`${data.list[0].main.aqi}`]}</p>
                        </div>
                        <div class="air-indices">
                            <i class="fa-solid fa-wind fa-2x"></i>
                            <div class="item">
                                <p>PM2.5</p>
                                <h2>${pm2_5}</h2>
                            </div>
                            <div class="item">
                                <p>PM10</p>
                                <h2>${pm10}</h2>
                            </div>
                            <div class="item">
                                <p>SO2</p>
                                <h2>${so2}</h2>
                            </div>
                            <div class="item">
                                <p>Co</p>
                                <h2>${co}</h2>
                            </div>
                            <div class="item">
                                <p>No</p>
                                <h2>${no}</h2>
                            </div>
                            <div class="item">
                                <p>No2</p>
                                <h2>${no2}</h2>
                            </div>
                            <div class="item">
                                <p>NH3</p>
                                <h2>${nh3}</h2>
                            </div>
                            <div class="item">
                                <p>O3</p>
                                <h2>${o3}</h2>
                            </div>
                        </div>
        `
    })
}