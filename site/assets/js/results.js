function generateGraph(data) {
	// Generates an initial stacked bar chart of pop_vote
	// Adapted from https://bl.ocks.org/SpaceActuary/6233700e7f443b719855a227f4749ee5

	var margin = {
			top: 40,
			right: 100,
			bottom: 70,
			left: 100
		},
		windowWidth = $(window).innerWidth(),
		windowHeight = $(window).innerHeight() - 44,
		height = windowHeight - margin.top - margin.bottom,
		width = windowWidth - margin.left - margin.right,
		svg = d3.select(".resultsViz")
		.append("svg")
		.attr("width", windowWidth)
		.attr("height", windowHeight),
		g = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// x0 =  whole graph
	var x0 = d3.scaleBand()

	// x1 = specific x-groups
	var x1 = d3.scaleBand();

	// y0 = whole graph
	var y0 = d3.scaleLinear()
		.rangeRound([height, 0]);

	// z = specific rectangles
	var z = d3.scaleOrdinal();

	// FUTURE: Dynamically retrieve total for each data set
	var seatsTotal = 32,
		votesTotal = 156324

	// div for tooltips
	var div = d3.select("body")
		.append("div")
		.attr("class", "tooltip")
		.style("opacity", 0)

	data.forEach(function (d) {
		d["Value"] = +d["Value"];
	})

	x0.domain(data.map(function (d) {
			return d["Chart"]
		}))
		.rangeRound([0, width])
		.paddingInner(0.3);

	x1.domain(data.map(function (d) {
			return d["Align"]
		}))
		.rangeRound([0, x0.bandwidth()])
		.padding(0.5)

	// NOTE: Set y-axis range. Currently mannually set.
	y0.domain([0, 0.6]).nice();

	z.domain(data.map(function (d) {
		return d["Party"]
	}))
	var keys = z.domain()

	// Y-axis
	yAxis = g.append("g")
		.attr("class", "yAxis")
		.call(d3.axisLeft(y0).ticks(null, ".0%").tickSize(-width, 0, 0))
		.attr("x", 2)
		.call(g => g.selectAll(".tick:not(:first-of-type) line")
			.attr("stroke-opacity", 0.5)
			.attr("stroke-dasharray", "2,2")
		)
		.call(function (g) {
			// Highlight 50% line
			g.selectAll(".tick:nth-child(12) line")
				.attr("stroke", "red")
				.attr("stroke-width", 3)
				.attr("stroke-opacity", 1)
				.attr("stroke-dasharray", 0)
		})
		.call(function (g) {
			// Highlight 50% text
			g.selectAll(".tick:nth-child(12) text")
				.attr("fill", "red")
				.attr("font-size", "large")
		})
		.append("text")
		.attr("dx", "1em")
		.attr("dy", "-1em")
		.attr("fill", "#000")
		.attr("font-weight", "bold")
		.attr("text-anchor", "start")
		.text("Percentage of Total");

	// X-axis
	xAxis = g.append("g")
		.attr("class", "xAxis")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x0));

	// Increase font size of x-axis
	d3.select(".xAxis").selectAll("text")
		.attr("font-size", "large")

	var groupData = d3.nest()
		.key(function (d) {
			return d.Chart + d.Align;
		})
		.rollup(function (d, i) {
			var d2 = {
				Chart: d[0].Chart,
				Align: d[0].Align
			}
			d.forEach(function (d) {
				if (d["Chart"] == "Popular Vote") {
					d2[d.Party] = d.Value / votesTotal
				} else if (d["Chart"] == "Seats Won") {
					d2[d.Party] = d.Value / seatsTotal
				}
			})
			return d2;
		})
		.entries(data)
		.map(function (d) {
			return d.value;
		});

	// Add in 0 for values without entries
	groupData.forEach(function (d) {
		keys.forEach(function (e) {
			if (isNaN(d[e])) {
				d[e] = 0
			}
		})
	})

	var stackData = d3.stack()
		.keys(keys)(groupData)

	var series = g.selectAll(".series")
		.data(stackData)
		.enter().append("g")
		.attr("class", "series")
		.attr("fill", d => getColor(d.key))
		.attr("party", d => d["key"])
		.on("mouseover", function (d) {
			div.transition().duration(100).style("opacity", 1)

			generateTooltip(d["key"], div)

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
		});

	series.selectAll("rect")
		.data(function (d) {
			return d;
		})
		.enter().append("rect")
		.attr("class", "series-rect")
		.attr("transform", function (d) {
			return "translate(" + x0(d["data"]["Chart"]) + ",0)";
		})
		.attr("x", function (d) {
			return x1(d.data["Align"]);
		})
		.attr("y", function (d) {
			return y0(d[1]);
		})
		.attr("height", function (d) {
			return y0(d[0]) - y0(d[1]);
		})
		.attr("width", x1.bandwidth())
		.attr("stroke", "black")
		.attr("class", d => d["data"]["Align"].concat(" ", d["data"]["Chart"]))
};

function generateTooltip(party, div, ward, data, e) {

	if (data) {

		var entry = data.filter(function (d) {
			return d.candidates == party
		})[0]

		// Generate Tooltips with party detail
		div.style("border-color", getColor(entry.party))
			.style("border-width", "5px")
			.style("border-style", "solid")

		if (e == 0) {
			e = "WON"
		} else {
			e = "LOST"
		}

		var htmlString = `<p class="bold">` + entry.candidates + `</p><p>` + getFullPartyName(entry.party) + `</p><p>Votes: ` + (entry.vote_percentage * 100).toFixed(1) + `% </p><p> (` + formatNumber(entry.vote_count) + ` votes)</p><B class="bold">` + e + `</p>`


		div.html(htmlString)

		return div
	}

	// Generate Tooltips with party detail
	div.style("border-color", getColor(party))
		.style("border-width", "5px")
		.style("border-style", "solid")


	d3.json("./assets/data/tooltipDetails.json").then(function (d) {

		d = d.filter(d => (d.party == party))[0]

		var htmlString = `<p class="bold">` + d.full_name + `</p><p>Nominated ` + d.num_cand + ` candidates</p><p>Won ` + d.seats_won + ` seats</p><p>Won ` + formatNumber(d.pop_vote) + ` votes</p><p>` + d.vote_share + ` vote share</p>`


		div.html(htmlString)
	})
}

function generateDonuts(data) {

	var width = 300,
		height = 300,
		margin = 25

	var radius = Math.min(width, height) / 2 - margin

	data = data.filter(d => d.year == "1955");
	var nested_data = d3.nest().key(d => d.constituency).rollup(function (v) {
		var v3 = []

		v.forEach(function (v2) {
			v3[v2.candidates] = v2.vote_count
		})
		return v3;
	}).entries(data)

	// div for tooltips
	var div = d3.select("body")
		.append("div")
		.attr("class", "tooltip")
		.style("opacity", 0)

	d3.select("div.graphContainer.donuts")
		.selectAll("svg")
		.data(nested_data).enter()
		.insert("svg", ":first-child")
		.attr("class", d => d.key)
		.attr("width", width)
		.attr("height", height)
		.each(function (d) {
			var pie = d3.pie().value(d => d.value)
			var pie_data = pie(d3.entries(d.value))
			d3.select(this).append("g")
				.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
				.selectAll("path")
				.data(pie_data).enter()
				.append("path")
				.attr("d", d3.arc().innerRadius(90)
					.outerRadius(radius))
				.attr("class", function (d, i) {
					return d.data.key, i
				})
				.attr('fill', function (d) {
					return getColor(data.filter(function (e) {
						return e.candidates == d.data.key
					})[0].party)
				}).attr("stroke", "black")
				.style("stroke-width", "2px")
				.style("opacity", 0.8)
				.on("mouseover", function (d, e) {
					div.transition().duration(100).style("opacity", 1)

					generateTooltip(d.data.key, div, $(this).parent().parent().attr("class"), data, e)

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
				});

		}).append("text")
		.text(d => d.key)
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
		.attr("text-anchor", "middle")
		.attr("dominant-baseline", "central");

	// Resize background to fit
	$(".inner.content.act2").css("min-height", $(".graphContainer.donuts").height())

	// Highlight winners
	$(".graphContainer.donuts path.0")
		.attr("stroke", "yellow")
		.append("polyLine")
};

function generateMap() {

	// Initiates Map
	var map = L.map('map', {
		zoomControl: false
	}).setView([1.35, 103.82], 11);
	// Disable user controls
	map.touchZoom.disable();
	map.doubleClickZoom.disable();
	map.scrollWheelZoom.disable();

	map.createPane('left');
	map.createPane('right');


	// Basemaps
	var Base_Default = L.tileLayer('https://api.mapbox.com/styles/v1/virgilwxw/ck06ksmvx2axs1ctqea2zqt77/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidmlyZ2lsd3h3IiwiYSI6ImNqYmhrN25rZTNoNWgyeHBlNnY0N3Z6dDAifQ.KCzg-gN0vwIeQNoQyjWVXg', {
		attribution: '© <a href="https://apps.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	// Basemaps
	var tileLayer1953Topo = L.tileLayer('https://libmaps.nus.edu.sg/gis/rest/services/Sing_Hist_Maps/1953/MapServer/tile/{z}/{y}/{x}', {
		"layers": "11,12,13,14,15,16,17,18,19,20,21,22",
		attribution: '<a href="https://libmaps.nus.edu.sg/">National University of Singapore<a>'
	}).addTo(map);

	L.control.sideBySide(Base_Default, tileLayer1953Topo).addTo(map);

	return map;
}

$(document).ready(function () {

	//filter data

	// Scrollmagic controller
	var controller = new ScrollMagic.Controller();

	$.when(d3.csv("/assets/data/results.csv").then(data => generateGraph(data))).done(function () {

		// Prelude
		var prelude = new ScrollMagic.Scene({
				triggerElement: "#prelude",
				triggerhook: 0.4,
				offset: 250
			})
			.setClassToggle(".reveal", "visible")
			.addIndicators({
				name: "prelude"
			})
			.addTo(controller);

		// Act 1 pin chart
		var s1ChartPin = new ScrollMagic.Scene({
				triggerElement: ".graphContainer.Votes",
				triggerHook: 0,
				offset: 0,
				duration: 1000
			})
			.setPin(".graphContainer.Votes")
			.addIndicators({
				name: "Scene 1 Chart Pin"
			})
			.addTo(controller);

		var s1tween = new TimelineMax()
			.from("rect.Seats.Won", 0, {
				opacity: 1
			})
			.to("rect.Seats.Won", 3, {
				opacity: 0.1,
				ease: Power2.easeOut
			});

		var s1 = new ScrollMagic.Scene({
				triggerElement: "#s1",
				triggerhook: 0.4,
				duration: 100,
				offset: "-150"
			}).setTween(s1tween)
			.addIndicators({
				name: "Scene 1"
			})
			.addTo(controller)


		var s2tween = new TimelineMax()
			.from("rect.Right.Popular.Vote", 3, {})
			.to("rect.Right.Popular.Vote", 3, {
				strokeWidth: 10,
				stroke: "rgba(255, 0, 0, 0.6)",
				ease: Power2.easeOut
			});

		var s2 = new ScrollMagic.Scene({
				triggerElement: "#s1",
				triggerhook: 0.4,
				duration: 50
			}).setTween(s2tween)
			.addIndicators({
				name: "Scene 2"
			})
			.addTo(controller)

		var s3tween = new TimelineMax()
			.from("rect.Popular.Vote", 0, {
				opacity: 1
			})
			.to("rect.Popular.Vote", 3, {
				opacity: 0.1,
				ease: Power2.easeOut
			}).from("rect.Seats.Won", 0, {
				opacity: 0.1
			})
			.to("rect.Seats.Won", 3, {
				opacity: 1,
				ease: Power2.easeOut
			});;


		var s3 = new ScrollMagic.Scene({
				triggerElement: "#s3",
				triggerhook: 0.4,
				duration: 100,
				offset: "-150"
			}).setTween(s3tween)
			.addIndicators({
				name: "Scene 3"
			})
			.addTo(controller)


		var s4tween = new TimelineMax()
			.from("rect.Left.Seats.Won", 3, {})
			.to("rect.Left.Seats.Won", 3, {
				strokeWidth: 10,
				stroke: "rgba(255, 0, 0, 0.6)",
				ease: Power2.easeOut
			});

		var s4 = new ScrollMagic.Scene({
				triggerElement: "#s3",
				triggerhook: 0.4,
				duration: 50
			}).setTween(s4tween)
			.addIndicators({
				name: "Scene 4"
			})
			.addTo(controller)

		var s5tween = new TimelineMax()
			.from("rect", 0, {
				opacity: 0.1
			})
			.to("rect", 3, {
				opacity: 1,
				ease: Power2.easeOut
			}).from("rect", 0, {})
			.to("rect", 3, {
				strokeWidth: 1,
				stroke: "black",
				ease: Power2.easeOut
			});

		var s5 = new ScrollMagic.Scene({
				triggerElement: "#s5",
				triggerhook: 0.4,
				duration: 50
			}).setTween(s5tween)
			.addIndicators({
				name: "Scene 5"
			})
			.addTo(controller)
	});

	$.when(d3.csv("/assets/data/datagov.csv").then(data => generateDonuts(data))).done(function () {

		var s5atween = new TimelineMax()
			.from("#s5a", 0, {
				opacity: 1
			}).to("#s5a", 3, {
				opacity: 0.1,
				ease: Power2.easeOut
			});

		var s5a = new ScrollMagic.Scene({
				triggerElement: "#s5a",
				triggerhook: 0.4,
				duration: 100
			}).setTween(s5atween)
			.addIndicators({
				name: "Scene 5a"
			})
			.addTo(controller)

		var s6tween = new TimelineMax()
			.from("#s6", 0, {
				opacity: 1
			})
			.to("#s6", 3, {
				opacity: 0.1,
				ease: Power2.easeOut
			});

		var s6 = new ScrollMagic.Scene({
				triggerElement: "#s6",
				triggerhook: 0.4,
				duration: 100
			}).setTween(s6tween)
			.addIndicators({
				name: "Scene 6"
			})
			.addTo(controller)
	});

	var map = generateMap();

	// Invalidate Size to make it responsive
	setTimeout(function () {
		map.invalidateSize()
	}, 300);
	$(window).resize(function () {
		map.invalidateSize()
	});

	function divStyle(feature) {
		return {
			fillColor: getColor(feature.properties.Winner),
			weight: 0.7,
			color: 'black',
			fillOpacity: opacity,
			opacity: 1,
			className: "test"
		};
	}

	var pinMap = new ScrollMagic.Scene({
			triggerElement: "#mapCont",
			triggerHook: 0
		})
		.setPin("#mapCont")
		.addIndicators({
			name: "Pin Map"
		})
		.addTo(controller);

	function s8Enter(map) {
		map.flyTo([1.35, 103.82], 12)
	}

	function s8Exit(map) {
		map.flyTo([1.35, 103.82], 11)
	}

	var s8 = new ScrollMagic.Scene({
			triggerElement: "#s8",
			triggerhook: 0.4,
			duration: $("#s8").height() + 200
		}).on("enter", d => s8Enter(map))
		.on("leave", d => s8Exit(map))
		.addIndicators({
			name: "Scene 8"
		}).addTo(controller)


	function TypeStyle(feature) {
		return {
			weight: 2,
			color: getColor(feature.properties.Type),
			fillColor: getColor(feature.properties.Type),
			fillOpacity: 0.9
		};
	}

	var Layer1955Type = new L.GeoJSON.AJAX("assets/maplayers/wardsType1955.geojson", {
		style: TypeStyle
	}).setZIndex(5);

	function s9Enter(map) {
		map.addLayer(Layer1955Type)
	}

	function s9Exit(map) {
		map.removeLayer(Layer1955Type)
	}

	var s9 = new ScrollMagic.Scene({
			triggerElement: "#s9",
			triggerhook: 0.4
		}).on("enter", d => s9Enter(map))
		.on("leave", d => s9Exit(map))
		.addIndicators({
			name: "Scene 9"
		}).addTo(controller)

	function s10Enter(map) {
		map.flyTo([1.306, 103.8575], 14);
		map.addLayer(Layer1955Type)
		$("[stroke='#E41A1C']").fadeTo(400, 0)
	}

	function s10Exit(map) {
		map.flyTo([1.35, 103.82], 12)
		map.addLayer(Layer1955Div, {
			onEachFeature: function (layer, feature) {}
		})
		$("[stroke='#E41A1C']").fadeTo(400, 0.9)
	}

	var s10 = new ScrollMagic.Scene({
			triggerElement: "#s11",
			triggerhook: 0.4,
			offset: -(window.innerHeight / 2) + 100
		}).on("enter", d => s10Enter(map))
		.on("leave", d => s10Exit(map))
		.addIndicators({
			name: "Scene 10"
		}).addTo(controller)

	function DivStyleLowOpacity(feature) {
		return {
			fillColor: getColor(feature.properties.Winner),
			weight: 0.7,
			color: 'black',
			fillOpacity: 0.5,
			opacity: 1,
			className: feature.properties.Name
		};
	}
	var urbanDivs = new L.GeoJSON.AJAX("assets/maplayers/urbanDivs.geojson", {
		attribution: 'Data.gov.sg',
		style: DivStyleLowOpacity,
		onEachFeature: function (feature, layer) {}
	}).setZIndex(3)

	function s11Enter(map) {
		map.addLayer(urbanDivs)
	}

	function s11Exit(map) {
		map.removeLayer(urbanDivs)
		map.addLayer(Layer1955Type)
		map.flyTo([1.306, 103.8575], 14);
	}

	var s11 = new ScrollMagic.Scene({
			triggerElement: "#s11",
			triggerhook: 0.4
		}).on("enter", d => s11Enter(map))
		.on("leave", d => s11Exit(map))
		.addIndicators({
			name: "Scene 11"
		}).addTo(controller)


	var LayerUrbanCentoids = new L.GeoJSON.AJAX("assets/maplayers/urbanCentoids.geojson", {
			attribution: 'Data.gov.sg',
			onEachFeature: function (feature) {
				L.marker(polygonCenter)
					.bindLabel(feature.properties['NAME'], {
						noHide: true
					})
					.addTo(map);
			}
		})
		.setZIndex(3)


	function s12Enter(map) {
		map.addLayer(LayerUrbanCentoids)
		$(".Tanjong.Pagar.leaflet-interactive").attr("stroke", "yellow")
			.attr("stroke-width", 15)

		map.flyTo([1.2756, 103.8440], 16)
	}

	function s12Exit(map) {
		map.removeLayer(LayerUrbanCentoids)
		$(".Tanjong.Pagar.leaflet-interactive").attr("stroke", "black")
			.attr("stroke-width", 0.7)

		map.flyTo([1.306, 103.8575], 14);
	}

	var s12 = new ScrollMagic.Scene({
			triggerElement: "#s12",
			triggerhook: 0.4
		}).on("enter", d => s12Enter(map))
		.on("leave", d => s12Exit(map))
		.addIndicators({
			name: "Scene 12"
		}).addTo(controller)

	var mixedDivs = new L.GeoJSON.AJAX("assets/maplayers/mixedDivs.geojson", {
		attribution: 'Data.gov.sg',
		style: DivStyleLowOpacity,
		onEachFeature: function (feature, layer) {}
	}).setZIndex(3)

	function s13Enter(map) {
		$(".Tanjong.Pagar.leaflet-interactive").attr("stroke", "black")
			.attr("stroke-width", 0.7)

		map.removeLayer(urbanDivs)
		map.addLayer(mixedDivs)

		$("[stroke='#E41A1C']").fadeTo(400, 1)
		$("[stroke='#377EB8']").fadeTo(1200, 0)

		map.flyTo([1.306, 103.8575], 13)
	}

	function s13Exit(map) {
		map.addLayer(urbanDivs)
		$(".Tanjong.Pagar.leaflet-interactive").attr("stroke", "black")
			.attr("stroke-width", 0.7)

		$(".Tanjong.Pagar.leaflet-interactive").attr("stroke", "yellow")
			.attr("stroke-width", 15)

		map.removeLayer(mixedDivs)

		map.flyTo([1.2756, 103.8440], 16)

		$("[stroke='#377EB8']").fadeTo(400, 1)
		$("[stroke='#E41A1C']").fadeTo(400, 0)
	}

	var s13 = new ScrollMagic.Scene({
			triggerElement: "#s13",
			triggerhook: 0.4
		}).on("enter", d => s13Enter(map))
		.on("leave", d => s13Exit(map))
		.addIndicators({
			name: "Scene 13"
		}).addTo(controller)


	function s14Enter(map) {
		map.addLayer(LayerUrbanCentoids)
		$(".Queenstown.leaflet-interactive").attr("stroke", "yellow")
			.attr("stroke-width", 15)

		map.flyTo([1.2940, 103.8100], 15)
	}

	function s14Exit(map) {
		map.removeLayer(LayerUrbanCentoids)
		$(".Queenstown.leaflet-interactive").attr("stroke", "black")
			.attr("stroke-width", 0.7)

		map.flyTo([1.306, 103.8575], 13);
	}

	var s14 = new ScrollMagic.Scene({
			triggerElement: "#s14",
			triggerhook: 0.4
		}).on("enter", d => s14Enter(map))
		.on("leave", d => s14Exit(map))
		.addIndicators({
			name: "Scene 14"
		}).addTo(controller)

	var ruralDivs = new L.GeoJSON.AJAX("assets/maplayers/ruralDivs.geojson", {
		attribution: 'Data.gov.sg',
		style: DivStyleLowOpacity,
		onEachFeature: function (feature, layer) {}
	}).setZIndex(3)

	function s15Enter(map) {
		map.flyTo([1.35, 103.82], 12)
		$(".Queenstown.leaflet-interactive").attr("stroke", "black")
			.attr("stroke-width", 0.7)


		$("[stroke='#377EB8']").fadeTo(400, 1)
		$("[stroke='#4DAF4A']").fadeTo(400, 0)

		map.removeLayer(mixedDivs)
		map.addLayer(ruralDivs)
	}

	function s15Exit(map) {
		map.flyTo([1.2940, 103.8100], 15)

		$("[stroke='#377EB8']").fadeTo(400, 0)
		$("[stroke='#4DAF4A']").fadeTo(400, 1)

		map.addLayer(mixedDivs)
		map.removeLayer(ruralDivs)
	}

	var s15 = new ScrollMagic.Scene({
			triggerElement: "#s15",
			triggerhook: 0.4
		}).on("enter", d => s15Enter(map))
		.on("leave", d => s15Exit(map))
		.addIndicators({
			name: "Scene 15"
		}).addTo(controller)

	function s16Enter(map) {
		$(".Sembawang.leaflet-interactive").attr("stroke", "yellow")
			.attr("stroke-width", 5)

		map.flyTo([1.41, 103.8290], 13)
	}

	function s16Exit(map) {
		$(".Sembawang.leaflet-interactive").attr("stroke", "black")
			.attr("stroke-width", 0.7)

		map.flyTo([1.35, 103.82], 12)
	}

	var s16 = new ScrollMagic.Scene({
			triggerElement: "#s16",
			triggerhook: 0.4
		}).on("enter", d => s16Enter(map))
		.on("leave", d => s16Exit(map))
		.addIndicators({
			name: "Scene 16"
		}).addTo(controller)

	function s17Enter(map) {
		map.addLayer(LayerUrbanCentoids)
		$(".Southern.Islands.leaflet-interactive").attr("stroke", "yellow")
			.attr("stroke-width", 5)

		map.flyTo([1.230, 103.7460], 13)
	}

	function s17Exit(map) {

		$(".Southern.Islands.leaflet-interactive").attr("stroke", "black")
			.attr("stroke-width", 0.7)

		map.flyTo([1.41, 103.8290], 13)
	}

	var s17 = new ScrollMagic.Scene({
			triggerElement: "#s17",
			triggerhook: 0.4
		}).on("enter", d => s17Enter(map))
		.on("leave", d => s17Exit(map))
		.addIndicators({
			name: "Scene 16"
		}).addTo(controller)

	// Prelude
	var prelude = new ScrollMagic.Scene({
			triggerElement: "#epilogue span",
			triggerhook: 0.4
		})
		.setClassToggle(".reveal", "visible")
		.addIndicators({
			name: "prelude"
		})
		.addTo(controller);
});
