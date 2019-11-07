// create popup and table for results
function resultsPopup(element) {
    data = jQuery.getJSON("data/constituencies1955.json", function (data) {
        var popup = L.popup();
        var wardName = element.target.feature.properties.Name;

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
var Layer1953Topo = L.tileLayer('https://libmaps.nus.edu.sg/gis/rest/services/Sing_Hist_Maps/1953/MapServer/tile/{z}/{y}/{x}', {
    "layers": "11,12,13,14,15,16,17,18,19,20,21,22",
    attribution: '<a href="https://libmaps.nus.edu.sg/">National University of Singapore<a>'
})
var Layer1953Aerial = L.tileLayer("https://libmaps.nus.edu.sg/gis/rest/services/Sing_Hist_Maps/1953/MapServer/tile/{z}/{y}/{x}", {
    "layers": "11,12,13,14,15,16,17,18,19,20,21,22",
    attribution: '<a href="https://libmaps.nus.edu.sg/">National University of Singapore<a>'
});
// Default base Map
map.addLayer(LayerOneMapSG_Default);
// Add geojson
function polyStyle(feature) {
    return {
        fillColor: getColor(feature.properties.Winner),
        weight: 2,
        opacity: 0.7,
        color: 'black',
        dashArray: '5',
        fillOpacity: 0.7
    };
}
var Layer1955Wards = new L.GeoJSON.AJAX("assets/maplayers/wards1955.geojson", {
    attribution: 'Data.gov.sg',
    style: polyStyle,
    onEachFeature: function (feature, layer) {
        layer.on({
            // Set highlighted style if mouse hovers over polygon
            mouseover: function (e) {
                    var layer = e.target;
                    layer.setStyle({
                        stroke: '#347ebf',
                        fillOpacity: 0
                    });
                    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                        layer.bringToFront();
                    }
                },
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
function generateElected() {
    var divWidth = $(".viz-elected").width()
    var divHeight = 150
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

    var div = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)

    d3.json("data/electedMembers1955.json").then(function (data) {
        var NestedData = d3.nest().key(function (d) {
            return d.bench
        }).entries(data.wards)

        var plots = svg.selectAll("g").data(NestedData).enter().append("g").attr("transform", function (d, i) {
            if (d.key == "Government") {
                return "translate(5," + ((i * 150)) + ")"
            } else {
                return "translate(" + (($(".viz-elected").width() / 2) + 5) + "," + ((i * 0)) + ")"
            }
        })
        plots.selectAll(".rect").data(function (d) {
                return d.values
            }).enter().append("rect").classed("cell", true).attr("width", 20).attr("height", 20).attr("x", function (d, i) {
                var colIndex = i % numCols
                return colIndex * 24
            }).attr("y", function (d, i) {
                var rowIndex = Math.floor(i / numCols)
                return rowIndex * 24
            }).attr("r", 6).style("fill", function (d) {
                return getColor(d.party)
            }).attr("wardName", function (d) {
                return d.wardName
            }).on("mouseover", function (d) {
                div.transition().duration(100).style("opacity", 1)

                div.style("border-color", getColor(d.party))
                    .style("border-width", "5px")
                    .style("border-style", "solid")

                var htmlString = "<span class='tooltip-candidates'>" + d.candidates + "</span></div>";
                htmlString = htmlString.concat("<span class='tooltip-party'>" + getFullPartyName(d.party) + "</span>")
                htmlString = htmlString.concat("<span class='tooltip-wardName'> Member for " + d.wardName + "</span>")
                htmlString = htmlString.concat("<span class='tooltip-office'>" + d.office + "</span>")

                div.html(htmlString)


                div.style("visibility", "visible")
                    .style("left", (d3.event.pageX - 20) + "px")
                    .style("top", (d3.event.pageY - 130) + "px")

                $(this).addClass("hover");
            })
            .on("mousemove", function (d) {
                div.style("left", (d3.event.pageX - 20) + "px")
                    .style("top", (d3.event.pageY - 130) + "px")
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                div.style("visibility", "hidden")
                $(this).removeClass("hover");
            })
    });
};

function generatenonElected() {
    var divWidth = $(".viz-non-elected").width()
    var divHeight = 150
    var numCols = 3;
    var margin = {
        right: 10,
        left: 10,
        top: 10,
        botom: 10
    }
    var width = divWidth - margin.right - margin.left;
    var height = divWidth - margin.top - margin.bottom;

    var svg = d3.select(".viz-non-elected").append("svg").attr("class", "chart").attr("width", divWidth).attr("height", divHeight).append("g").attr("transform", "translate(0" + margin.left + "," + margin.top + ")");

    var div = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)

    d3.json("data/nonElectedMembers.json").then(function (data) {
        var NestedData = d3.nest().key(function (d) {
            return d.bench
        }).entries(data.members)

        var plots = svg.selectAll("g").data(NestedData).enter().append("g").attr("transform", function (d, i) {
            if (d.key == "Government") {
                return "translate(5," + ((i * 150)) + ")"
            } else {
                return "translate(" + (($(".viz-non-elected").width() / 2) + 5) + "," + ((i * 0)) + ")"
            }
        })
        plots.selectAll(".rect").data(function (d) {
                return d.values
            }).enter().append("rect").classed("cell", true).attr("width", 20).attr("height", 20).attr("x", function (d, i) {
                var colIndex = i % numCols
                return colIndex * 24
            }).attr("y", function (d, i) {
                var rowIndex = Math.floor(i / numCols)
                return rowIndex * 24
            }).attr("r", 6).style("fill", function (d) {
                return getColor(d.party)
            }).attr("wardName", function (d) {
                return d.wardName
            }).on("mouseover", function (d) {
                div.transition().duration(100).style("opacity", 1)

                div.style("border-color", getColor(d.party))
                    .style("border-width", "5px")
                    .style("border-style", "solid")

                var htmlString = "<span class='tooltip-candidates'>" + d.name + "</span></div>";
                htmlString = htmlString.concat("<span class='tooltip-party'>" + getFullPartyName(d.party) + "</span>")
                htmlString = htmlString.concat("<span class='tooltip-seat_type'> " + d.seat_type + "</span>")
                htmlString = htmlString.concat("<span class='tooltip-office'>" + d.office + "</span>")

                div.html(htmlString)


                div.style("visibility", "visible")
                    .style("left", (d3.event.pageX - 20) + "px")
                    .style("top", (d3.event.pageY - 130) + "px")

                $(this).addClass("hover");
            })
            .on("mousemove", function (d) {
                div.style("left", (d3.event.pageX - 20) + "px")
                    .style("top", (d3.event.pageY - 130) + "px")
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                div.style("visibility", "hidden")
                $(this).removeClass("hover");
            })
    });
};

$(document).ready(function () {
    generateElected()
    generatenonElected()

    // Fixes map issues on startup
    setTimeout(function () {
        map.invalidateSize()
    });
});
