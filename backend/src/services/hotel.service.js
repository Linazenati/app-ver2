const service = {}

const VILLES_IDS = {
    "alger": "-458371",
    "bejaia":"-458371",
}

const URL_BOOKING_COM = "https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels"
const OPTIONAL_PARAMS = "&adults=1&children_age=0%2C17&room_qty=1&page_number=1&units=metric&temperature_unit=c&languagecode=en-us&currency_code=AED&location=US"

const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '6761c199f8msh08da520f135ee89p129be6jsn149a961b3909',
		'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
	}
};

service.find = async (ville, arrival_date, departure_date ) => {
    const data = null;

    const dest_id = VILLES_IDS[ville];

    const url = URL_BOOKING_COM
        + `?dest_id=${dest_id}&search_type=CITY&arrival_date=${arrival_date}&departure_date=${departure_date}`
        + OPTIONAL_PARAMS;
    

    const response = await fetch(url, options);
    const result = await response.json();

    return  result;
}

module.exports = service;