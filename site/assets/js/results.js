function generateGraph() {
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

    console.log(windowHeight, height)

    // x0 =  whole graph
    var x0 = d3.scaleBand()

    // x1 = specific x-groups
    var x1 = d3.scaleBand();

    // y0 = whole graph
    var y0 = d3.scaleLinear()
        .rangeRound([height, 0]);

    // z = specific rectangles
    var z = d3.scaleOrdinal();


    d3.csv("/assets/data/results.csv").then(function (data) {

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

        console.log("loaded CSV:", data)

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

        console.log("groupData", groupData)

        var stackData = d3.stack()
            .keys(keys)(groupData)

        console.log("stackData", stackData)

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
    })
};

function generateTooltip(party, div) {

    // Generate Tooltips with party detail

    div.style("border-color", getColor(party))
        .style("border-width", "5px")
        .style("border-style", "solid")


    d3.json("./assets/data/tooltipDetails.json").then(function (d) {

        d = d.filter(d=> (d.party==party))[0]
        console.log(d)

       var htmlString = `<p class="bold">` + d.full_name + `</p><p>Nominated ` + d.num_cand + ` candidates</p><p>Won ` + d.seats_won + ` seats</p><p>Won ` + formatNumber(d.pop_vote) + ` votes</p><p>` + d.vote_share + ` vote share</p>`


        div.html(htmlString)
    })
}

$(document).ready(function () {

    // Scrollmagic controller
    var controller = new ScrollMagic.Controller();

    // Prelude
    var prelude = new ScrollMagic.Scene({
            triggerElement: "#prelude",
            triggerHook: 0.5,
            offset: 250
        })
        .setClassToggle(".reveal", "visible")
        .addIndicators({
            name: "prelude"
        })
        .addTo(controller);

    // Act 1 pin chart
    var act1ChartPin = new ScrollMagic.Scene({
            triggerElement: ".graphContainer",
            triggerHook: 0,
            offset: 0
        })
        .setPin(".graphContainer")
        .addIndicators({
            name: "Act 1 Chart Pin"
        })
        .addTo(controller);

    // Act 1 Scene 1
    var act1Scene1 = new ScrollMagic.Scene({
        triggerElement: "#s1a1",
            triggerHook: 0.5,
            offset: 250
    })
    .

    generateGraph()
});
