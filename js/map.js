var map = L.map('map').setView([1.35, 103.82], 12);

// Basemaps
var layerOneMapSG_Default = L.tileLayer('https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png', {
	minZoom: 11,
	maxZoom: 18,
	bounds: [[1.56073, 104.11475], [1.16, 103.502]],
	attribution: '<img src="https://docs.onemap.sg/maps/images/oneMap64-01.png" style="height:20px;width:20px;"/> New OneMap | Map data &copy; contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>'
});

// Default base Map
map.addLayer(layerOneMapSG_Default);

// Styled Layer Control
var baseMaps = [
	{
		groupName: "Base Maps",
		expanded: true,
		layers: {
			"OneMap": layerOneMapSG_Default,
			"1953 Topological": layerTopo1953
		}
	}];

var overlays = [
	];

var styledLayerControlOptions = {
	container_width: "300px",
	container_maxHeight: "350px",
	group_maxHeight: "80px",
	exclusive: true
};

var styledLayerControl = L.Control.styledLayerControl(baseMaps, overlays, styledLayerControlOptions);
map.addControl(styledLayerControl);
