function generateGraph() {
    // Generates an initial stacked bar chart of pop_vote
    // Adapted from https://bl.ocks.org/SpaceActuary/6233700e7f443b719855a227f4749ee5

    var margin = {
            top: 20,
            right: 100,
            bottom: 30,
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

    console.log(windowHeight, height)

    // x0 =  whole graph
    var x0 = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1);

    // x1 = specific x-groups
    var x1 = d3.scaleBand()
        .padding(0.05);

    // y0 = whole graph
    var y0 = d3.scaleLinear()
        .rangeRound([height, 0]);

    // z = specific rectangles
    var z = d3.scaleOrdinal();


    d3.csv("/assets/data/results.csv").then(function (data) {
        // FUTURE: Dynamically retrieve total for each data set
        var seatsTotal = 32,
            votesTotal = 300199

        data.forEach(function (d) {
            d["Value"] = +d["Value"];
        })

        console.log("loaded CSV:", data)

        x0.domain(data.map(function (d) {
            return d["Chart"]
        }))

        x1.domain(data.map(function (d) {
                return d["Align"]
            }))
            .rangeRound([0, x0.bandwidth()])
            .padding(0.2);

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

        console.log("keys", keys)

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
                    if (d["Chart"] == "PopVote") {
                        d2[d.Party] = d.Value / votesTotal
                    } else if (d["Chart"] == "Seats") {
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

        console.log("groupData", groupData)

        var stackData = d3.stack()
            .keys(keys)(groupData)

        console.log("stackData", stackData)

        var series = g.selectAll(".series")
            .data(stackData)
            .enter().append("g")
            .attr("class", "series")
            .attr("fill", d => getColor(d.key));

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
            .attr("stroke", "black");
    })
};


$(document).ready(function () {

    // Scrollmagic controller
    var controller = new ScrollMagic.Controller();

    // Scene 1
    var scene1 = new ScrollMagic.Scene({
            triggerElement: ".reveal1",
            triggerHook: 0.5,
            offset: 250
        })
        .setClassToggle(".reveal1", "visible")
        .addIndicators({
            name: "Scene1"
        })
        .addTo(controller);

    // Scene 2 pin
    var scene2Pin = new ScrollMagic.Scene({
            triggerElement: ".resultsViz",
            triggerHook: 0,
            offset: 0
        })
        .setPin(".resultsViz")
        .addIndicators({name: "Scene 2 Pin"})
        .addTo(controller);

    generateGraph()
});
