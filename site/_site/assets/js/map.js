// TODO: DataVizElected
// TODO: DataVizElected
function dataVizElected(year) {
	// A helper function to generate the dataviz for elected candidates. Takes a variable, the year
	// TODO: implement year function
}
// TODO: DataVizNominated
function dataVizNominated(year) {
	// A helper function to generate the dataviz for elected candidates. Takes a variable, the year
	// TODO: implement year function
}

function resultsPopup(element) {
	data = jQuery.getJSON("data/constituencies1955.json", function (data) {
		var popup = L.popup();
		var wardName = element.target.feature.properties.name;
		var htmlString = ("<h1>").concat(wardName, "</h1><table class='result-table'><tr><th>Party</th><th>Candidate</th><th colspan='2'>Votes</th></tr>");
		for (i = 0; i < data[wardName].length; i++) {
			htmlString = htmlString.concat("<tr>");
			htmlString = htmlString.concat("<td>", data[wardName][i]['party'], "</td>");
			htmlString = htmlString.concat("<td>", data[wardName][i]['candidates'], "</td>");
			htmlString = htmlString.concat("<td class='percent'>", data[wardName][i]['vote_percentage'], "%</td>");
			htmlString = htmlString.concat("<td class='count'>", data[wardName][i]['vote_count'], "</td>");
			htmlString = htmlString.concat("</tr>");
		}
		htmlString = htmlString.concat("</table>");
		popup.setLatLng(element.target.getBounds().getCenter()).setContent(htmlString).openOn(map);
	})
}

function getColor(i) {
	return i == "PP" ? "#DA70D6" : i == "DP" ? "#AFEEEE" : i == "SLF" ? "#8B4513" : i == "Independent" ? "#708090" : i == "SA" ? "#191970" : i == "PAP" ? "#F5F5F5" : i == "LP" ? "#8B0000" : "#00FF00"
}
// Initiates Map
var map = L.map('map').setView([1.35, 103.82], 12);
// Basemaps
var LayerOneMapSG_Default = L.tileLayer('https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png', {
	minZoom: 11,
	maxZoom: 18,
	bounds: [[1.56073, 104.11475], [1.16, 103.502]],
	attribution: '<img src="https://docs.onemap.sg/maps/images/oneMap64-01.png" style="height:20px;width:20px;"/> New OneMap | Map data &copy; contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>'
});
var LayerOSM = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
})
var Layer1953Topo = L.WMS.tileLayer("https://libmaps.nus.edu.sg/gis/services/Sing_Hist_Maps/1953/MapServer/WMSServer?", {
	"layers": "11,12,13,14,15,16,17,18,19,20,21,22",
	attribution: '<a href="https://libmaps.nus.edu.sg/">National University of Singapore<a>'
})
var Layer1953Aerial = L.WMS.tileLayer("https://libmaps.nus.edu.sg/gis/services/Sing_Hist_Maps/1950/MapServer/WMSServer?", {
	"layers": "11,12,13,14,15,16,17,18,19,20,21,22",
	attribution: '<a href="https://libmaps.nus.edu.sg/">National University of Singapore<a>'
});
// Default base Map
map.addLayer(LayerOneMapSG_Default);
// Add geojson
function polyStyle(feature) {
	return {
		fillColor: getColor(feature.properties.winner),
		weight: 2,
		opacity: 0.7,
		color: 'black',
		dashArray: '5',
		fillOpacity: 0.7
	};
}
var Layer1955Wards = new L.GeoJSON.AJAX("assets/geojson/wards1955.geojson", {
	attribution: 'Data.gov.sg',
	style: polyStyle,
	onEachFeature: function (feature, layer) {
		layer.on({
			// Set highlighted style if mouse hovers over polygon
			mouseover: function (e) {
					var layer = e.target;
					layer.setStyle({
						weight: 5,
						color: '#ccff00',
						dashArray: '',
						fillOpacity: 0.4
					});
					if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
						layer.bringToFront();
					}
				} // Remove highlighted style once mouse leaves

				,
			mouseout: function (e) {
				Layer1955Wards.resetStyle(e.target);
			},
			click: function (e) {
				map.fitBounds(e.target.getBounds());
				resultsPopup(e);
			},
		});
	}
}).addTo(map);
// Styled Layer Control
var baseMaps = [
	{
		groupName: "Base Maps",
		expanded: true,
		layers: {
			"OneMap": LayerOneMapSG_Default,
			"OSM": LayerOSM
		}
	}];
var overlays = [
	{
		groupName: "data",
		expaned: "true",
		layers: {
			"Constituencies": Layer1955Wards
		}
	}
		, {
		groupName: "Map Overlays",
		expanded: "true",
		layers: {
			"1953 Topological": Layer1953Topo,
			"1953 Aerial Photographs": Layer1953Aerial
		}
}];
var styledLayerControlOptions = {
	container_width: "300px",
	container_maxHeight: "350px",
	group_maxHeight: "80px",
	exclusive: false
};
var styledLayerControl = L.Control.styledLayerControl(baseMaps, overlays, styledLayerControlOptions);
map.addControl(styledLayerControl, overlays);
// data_viz
function generateGraphs() {
	var divWidth = $(".viz-elected").width()
	var divHeight = $(".viz-elected").height()
	var numCols = 3;
	var margin = {
		right: 10,
		left: 10,
		top: 10,
		botom: 10
	}
	var width = divWidth - margin.right - margin.left;
	var height = divWidth - margin.top - margin.bottom;
	var svg = d3.select(".viz-elected").append("svg").attr("class", "chart").attr("width", divWidth).attr("height", divHeight).append("g").attr("transform", "translate(0" + margin.left + "," + margin.top + ")");
	d3.json("data/electedMembers1955.json").then(function (data) {
		var NestedData = d3.nest().key(function (d) {
			return d.bench
		}).entries(data.wards)
		console.log(NestedData)
		
		var plots = svg.selectAll("g").data(NestedData).enter().append("g").attr("transform", function (d, i) {
			if (d.key == "Government") {
				return "translate(5," + ((i * 150)) + ")"
			} else {
				return "translate(" + (($(".viz-elected").width() / 2) + 5) + "," + ((i * 0)) + ")"
			}
		})
		plots.selectAll(".rect").data(function (d) {
			return d.values
		}).enter().append("rect").attr("width", 20).attr("height", 20).attr("x", function (d, i) {
			var colIndex = i % numCols
			return colIndex * 24
		}).attr("y", function (d, i) {
			var rowIndex = Math.floor(i / numCols)
			return rowIndex * 24
		}).attr("r", 6).style("fill", function (d) {
			return getColor(d.party)
		}).style("stroke", "rgba(0, 0, 0, 0.54)").on("mouseover", function (d) {

			$(this).css("stroke", "rgb(0, 0, 0)").css("stroke-width", 2)
		}).on("mouseout", function (d) {
			$(this).css("stroke", "rgba(0, 0, 0, 0.54)").css("stroke-width", 1)
		})
	});
};
//Invalidate size
$(document).ready(function () {
	generateGraphs()
	setTimeout(function () {
		map.invalidateSize()
	}, 100);
});
