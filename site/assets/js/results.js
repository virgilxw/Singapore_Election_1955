function generateGraph() {
    // Generates an initial stacked bar chart of pop_vote
    // Adapted from https://bl.ocks.org/SpaceActuary/6233700e7f443b719855a227f4749ee5

    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
        },
        windowWidth = $(window).width(),
        windowHeight = $(window).height(),
        height = windowHeight - margin.top - margin.bottom,
        width = windowWidth - margin.left - margin.right,
        svg = d3.select(".graphContainer")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

        // TODO: Dynamically retrieve total for each data set
        var seatsTotal = 25,
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

        z.domain(data.map(function (d) {
            return d["Party"]
        }))
        var keys = z.domain()

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

        var series = svg.selectAll(".series")
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
            .attr("width", x1.bandwidth());

        // X-axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x0));

        // Y-axis
        svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y0).ticks(null, "s"))
            .append("text")
            .attr("x", 2)
            .attr("y", y0(y0.ticks().pop()) + 0.5)
            .attr("dy", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start")
            .text("Value");
    })
};


$(document).ready(function () {

    // Scrollmagic controller
    var controller = new ScrollMagic.Controller();

    // reveal text on scroll
    var revealP = new ScrollMagic.Scene({
            triggerElement: ".reveal1",
            triggerHook: 0.5,
            offset: 250
        })
        .setClassToggle(".reveal1", "visible")
        .addIndicators({
            name: "reveal text"
        })
        .addTo(controller);

    generateGraph()
});
