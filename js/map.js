var map = L.map('map').setView([1.35, 103.82], 12);

var OneMapSG_Default = L.tileLayer('https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png', {
	minZoom: 11,
	maxZoom: 18,
	bounds: [[1.56073, 104.11475], [1.16, 103.502]],
	attribution: '<img src="https://docs.onemap.sg/maps/images/oneMap64-01.png" style="height:20px;width:20px;"/> New OneMap | Map data &copy; contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>'
});

var basemaps = [
	L.tileLayer('https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png', {
		minZoom: 11,
		maxZoom: 18,
		bounds: [[1.56073, 104.11475], [1.16, 103.502]],
		attribution: '<img src="https://docs.onemap.sg/maps/images/oneMap64-01.png" style="height:20px;width:20px;"/> New OneMap | Map data &copy; contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>'
	}),
	    L.tileLayer('//{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
		subdomains: 'abcd',
		maxZoom: 20,
		minZoom: 0,
		label: 'Toner Lite' // optional label used for tooltip
	}),
	L.tileLayer('//{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
		subdomains: 'abcd',
		maxZoom: 20,
		minZoom: 0,
		label: 'Toner Lite' // optional label used for tooltip
	})

];

map.addControl(L.control.basemaps({
	basemaps: basemaps,
	tileX: 1614, // tile X coordinate
	tileY: 1016, // tile Y coordinate
	tileZ: 11 // tile zoom level
}));

// TODO: fix thumbnails
