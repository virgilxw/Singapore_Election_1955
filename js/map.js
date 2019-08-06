var map = L.map('map').setView([1.35, 103.82], 12);

// Basemaps
var layerOneMapSG_Default = L.tileLayer('https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png', {
	minZoom: 11,
	maxZoom: 18,
	bounds: [[1.56073, 104.11475], [1.16, 103.502]],
	attribution: '<img src="https://docs.onemap.sg/maps/images/oneMap64-01.png" style="height:20px;width:20px;"/> New OneMap | Map data &copy; contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>'
});

var Layer1953Topo = L.WMS.tileLayer("https://libmaps.nus.edu.sg/gis/services/Sing_Hist_Maps/1953/MapServer/WMSServer?", {
	"layers": "11,12,13,14,15,16,17,18,19,20,21,22",
	attribution: '<a href="https://libmaps.nus.edu.sg/">National University of Singapore<a>'
})

var Layer1953Aerial = L.WMS.tileLayer("https://libmaps.nus.edu.sg/gis/services/Sing_Hist_Maps/1950/MapServer/WMSServer?", {
	"layers": "11,12,13,14,15,16,17,18,19,20,21,22",
	attribution: '<a href="https://libmaps.nus.edu.sg/">National University of Singapore<a>'
});

// Default base Map
map.addLayer(layerOneMapSG_Default);

// Add geojson
var Layer1955Wards = new L.GeoJSON.AJAX("data/wards1955.geojson");

// Styled Layer Control
var baseMaps = [
	{
		groupName: "Base Maps",
		expanded: true,
		layers: {
			"OneMap": layerOneMapSG_Default
		}
	}];

var overlays = [
	{
		groupName: "data",
		expaned: "true",
		layers: {
			"Constituencies": Layer1955Wards
		}
	},
	{
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
