var input = document.getElementById('city');

input.oninput = function() {
    let value = input.value;
    if ( value.length > 3) {
        getGeoData(value);
    } else {
        document.getElementById('geolist').innerHTML = null;
    }
}


const getGeoData = (cityString) => {

    let url = `https://api.opencagedata.com/geocode/v1/json?language=en&q=${cityString}&key=918108d01a284079b79a988dfa06d314`;

    let xhttp = new XMLHttpRequest();

    xhttp.open("get", url, true);
    xhttp.send();
    
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            if ( response.status.code = 200 ) {
                renderList(response.results);
            } 
        }
    }

}


const renderList = (items) => {
    
    let list = '';

    if ( items.length > 0 ) {
        for (const city of items) {

            let point = JSON.stringify(city.geometry);

            list += `<div 
                class="geolist-item"
                data-point=${point}
                onclick="selectItem(this)"
                >
                ${city.formatted}
                </div>`;
        }
    } 

    document.getElementById('geolist').innerHTML = list;
}


const selectItem = (selectedItem) => {

    input.value = selectedItem.innerText;
    let point = selectedItem.getAttribute('data-point');
    document.getElementById('geolist').innerHTML = null;
    getWeather(point);
 
}

const getWeather = (point) => {

    point = JSON.parse(point),
        lng = point.lng.toFixed(6),
        lat = point.lat.toFixed(6),
        url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}2&lon=${lng}&units=metric&exclude=hourly,minutely&appid=44be0095680d66ebe6dae5a69351b2d7`;

    fetch(url)
        .then( (response) => response.json() )
        .then( data => {
            renderTable(data);
        })
        .catch(err => {
            console.log(err);
        })

}


const renderTable = (data) => {
    console.log(data.daily);

    var compiled = _.template(document.getElementById('forecast-template').innerHTML);

    document.getElementById('forecast').innerHTML = compiled({'rows': data.daily});

}




