var map;
var kmlLayer;

function initPage() {
    map = new google.maps.Map(document.getElementById('map'), {
	    zoom: 10,
	    center: {lat: 42, lng: -70}
	});
}


function getURL(tag) {
    station = document.getElementById("station_select").value;
    year    = document.getElementById(   "year_select").value;
    month   = document.getElementById(  "month_select").value;

    return "http://radar.cs.umass.edu/roost-label-dev/report/get_" + tag + ".php?" + 
	"station=" + station + "&year=" + year + "&month=" + month;
}

function loadKML() {

    var url = getURL('kml');

    kmlLayer = new google.maps.KmlLayer({
	    url: url,
	    map: map
	});

    document.getElementById("getKML").href = url;
    document.getElementById("getCSV").href = getURL('labels');
    document.getElementById("getCSV-meters").href = getURL('labels_meters');

}
