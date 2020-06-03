{

    let key = '4ea3275ac28ff043b968344208399de3';
    let units = 'imperial';
    let searchMethod;
    let searchTerm;
    let country;
    const uiCnt = {
        body: document.getElementById('body'),
        headerSearch: document.querySelector('.header > .search'),
        searchBtn: document.querySelector('.search-btn'),
        searchIpt: document.querySelector('.search-input'),
        bg1: document.querySelectorAll('.bg1'),
        bg2: document.querySelectorAll('.bg2'),
        bg1s: document.querySelector('.bg1'),
        bg2s: document.querySelector('.bg2'),
        container: document.querySelector('.container'),
        div: document.querySelector('.container > div'),
        weatherDescription: document.querySelector('.weatherDescript'),
        temperature: document.querySelector('.temperature'),
        winds: document.querySelector('.winds'),
        gusts: document.querySelector('.gusts'),
        minMaxTemp: document.querySelector('.minMaxTemp'),
        humidity: document.querySelector('.humidity'),
        pressure: document.querySelector('.pressure'),
        icon: document.querySelector('.weatherIcon'),
        city: document.querySelector('.city'),
        feelsLike: document.querySelector('.feelsLike'),
        introMsg: document.querySelector('.beforeInit'),
    };

    //detects searchTerm from Event Listener.
    function getSearchMethod(searchTerm) {
        if (!isNaN(searchTerm) && searchTerm.length === 5)
            searchMethod = 'zip';
        else
            searchMethod = 'q';
    };


    //https://api.openweathermap.org/data/2.5/weather?${searchMethod}=${searchTerm},${cntryCode}=&appid=${key}
    let searchWeather = (searchTerm, country) => {
        getSearchMethod(searchTerm);
        fetch(`https://api.openweathermap.org/data/2.5/weather?${searchMethod}=${searchTerm},${country}&appid=${key}&units=${units}
    `).then(result => {
            return result.json();
        }).then(result => {
            init(result);
        })
            .catch(error => {
                console.log(error)
            })
    };
    const changeImage = (el, imgName) => {
        el.style.backgroundImage = `url("media/${imgName}.jpg")`;
    };
    const changeBackground = (imgName) => {
        uiCnt.body.style.backgroundImage = `url('media/${imgName}.jpg')`
    };

    const init = (resultFromServer) => {
        uiCnt.container.style.display = 'grid';
        uiCnt.introMsg.style.display = 'none';
        uiCnt.headerSearch.style.display = 'flex';
        console.log(resultFromServer);

        //obtains weather and acts accordingly
        let resultDescription = resultFromServer.weather[0].description;
        switch (resultFromServer.weather[0].main) {
            case 'Clear':

                uiCnt.bg1.forEach(el => {
                    changeImage(el, 'palms');
                });
                uiCnt.bg2.forEach(el => {
                    changeImage(el, 'palms');
                });
                changeBackground('clear');
                break;

            case 'Drizzle':

                uiCnt.bg1.forEach(el => {
                    changeImage(el, 'drizzle');
                });
                uiCnt.bg2.forEach(el => {
                    changeImage(el, 'rain2');
                });
                changeBackground('drizzle');
                break;

            case 'Rain':

                uiCnt.bg1.forEach(el => {
                    if (resultDescription == 'light rain' || resultDescription == 'moderate rain')
                        changeImage(el, 'raindrop1');

                    else
                        changeImage(el, 'raindrop2');

                });
                uiCnt.bg2.forEach(el => {
                    changeImage(el, 'rain2');
                });
                if (resultDescription === 'light rain' || resultDescription === 'moderate rain') {
                    changeBackground('drizzle');

                } else {
                    changeBackground('rain');
                }

                break;

            case 'Thunderstorm':

                uiCnt.bg1.forEach(el => {
                    changeImage(el, 'thunder');
                });
                uiCnt.bg2.forEach(el => {
                    changeImage(el, 'thunder1');
                });
                changeBackground('rain');

                break;

            case 'Clouds':

                uiCnt.bg1.forEach(el => {
                    if (resultDescription == 'overcast clouds') {
                        changeImage(el, 'cloud')
                        changeBackground('cloudback1');
                    }
                    else {
                        changeImage(el, 'brokecloud');
                        changeBackground('cloud4');
                    }
                });
                uiCnt.bg2.forEach(el => {
                    if (resultDescription == 'overcast clouds')
                        changeImage(el, 'cloud')
                    else
                        changeImage(el, 'brokecloud');
                });
                break;

            case 'Snow':

                uiCnt.bg1.forEach(el => {
                    changeImage(el, 'snow1');
                });
                uiCnt.bg2.forEach(el => {
                    changeImage(el, 'snow');
                });
                changeBackground('snow-cloud');

                break;

            default:
                break;
        }
        //places results into ui.
        uiCnt.city.innerHTML = resultFromServer.name + ', ' + country.toUpperCase();
        uiCnt.icon.src = 'https://openweathermap.org/img/wn/' + resultFromServer.weather[0].icon + '.png';
        uiCnt.weatherDescription.innerHTML = resultDescription.charAt(0).toUpperCase() + resultDescription.slice(1);
        uiCnt.temperature.innerHTML = Math.floor(resultFromServer.main.temp) + '&deg';
        uiCnt.minMaxTemp.innerHTML = Math.floor(resultFromServer.main.temp_min) + '&deg' + ' - ' + Math.floor(resultFromServer.main.temp_max) + '&deg'
        uiCnt.humidity.innerHTML = resultFromServer.main.humidity + '%' + '<br> Humidity';
        uiCnt.feelsLike.innerHTML = 'Feels Like ' + Math.floor(resultFromServer.main.feels_like) + '&deg'
        uiCnt.winds.innerHTML = `Winds at ${Math.floor(resultFromServer.wind.speed)} m/s`;
        uiCnt.pressure.innerHTML = 'Pressure<br>' + resultFromServer.main.pressure + ' mb'

    }

    uiCnt.searchBtn.addEventListener('click', () => {
        searchTerm = document.querySelector('.search-input').value;
        country = document.querySelector('.country').value;
        searchWeather(searchTerm, country);
    });
    document.querySelectorAll('.search-btn')[1].addEventListener('click', () => {
        searchTerm = document.querySelectorAll('.search-input')[1].value;
        country = document.querySelectorAll('.country')[1].value;
        searchWeather(searchTerm, country);
    });

    window.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            if (document.querySelector('.search-input').value) {
                searchTerm = document.querySelector('.search-input').value
                country = document.querySelector('.country').value;
                searchWeather(searchTerm, country);
            } else if (document.querySelectorAll('.search-input')[1].value) {
                searchTerm = document.querySelectorAll('.search-input')[1].value
                country = document.querySelectorAll('.country')[1].value;
                searchWeather(searchTerm, country);
            } else { alert('Not a Valid Entry') }
        }
    });

}
