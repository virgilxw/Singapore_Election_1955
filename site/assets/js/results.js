function chart(data) {


    var speed = 1;
    // Generate align
    var align = []
    data.forEach(function (d) {
        align.push(d.alignment)
    })

    var parties = Object.keys(data[0]).slice(1, )

    //Generate graph
    var margin = ({
            top: 25,
            right: 50,
            bottom: 50,
            left: 50
        }),
        height = +$(".resultsViz").height() - margin.top - margin.bottom,
        width = +$(".resultsViz").width() - margin.left - margin.right

    // Create chart
    const svg = d3.select(".resultsViz")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .attr("transform", `translate(${margin.left},${margin.top})`);

    var x = d3.scaleBand()
        .rangeRound([margin.left, width - margin.right])
        .padding(0.5)

    var y = d3.scaleLinear()
        .rangeRound([height - margin.bottom, margin.top])

    var xAxis = svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .attr("class", "x-axis")

    var yAxis = svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .attr("class", "y-axis")

    svg.selectAll(".y-axis").transition().duration(speed)
        .call(d3.axisLeft(y))

    data.forEach(function (d) {
        d.total = d3.sum(parties, k => +d[k])
    })

    y.domain([0, d3.max(data, d => d.total)]).nice();

    x.domain(data.map(d => d.alignment));

    svg.selectAll(".y-axis").transition().duration(speed)
        .call(d3.axisLeft(y).ticks(null, "s"))

    svg.selectAll(".x-axis").transition().duration(speed)
        .call(d3.axisBottom(x).tickSizeOuter(0))

    var group = svg.selectAll("g.layer").data(d3.stack().keys(parties)(data))

    //Remove empty elements
    group.exit().remove()

    group.enter().append("g").classed("layer", true)
        .attr("fill", d => getColor(d.key))
        .attr("party", d => d.key)
        .text("test")


    var party_label = svg.selectAll("g.layer").selectAll(".text")
        .data(d => d, e => e.data.align);

    party_label.exit().remove();

    party_label.enter()
        .append("text")
        .text(function (d) {
            return $(this).parent().attr("party")
            return "tet"
        })
        .classed("party_name", true)
        .transition().duration(speed)
        .attr("x", d => x(d.data.alignment) - 40)
        .attr("y", d => y(d[1]) + 20)
        .attr("height", d => y(d[0]) - y(d[1]))

    var bars = svg.selectAll("g.layer").selectAll("rect")
        .data(d => d, e => e.data.align);

    bars.exit().remove();

    bars.enter().append("rect")
        .attr("width", x.bandwidth())
        .merge(bars)
        .transition().duration(speed)
        .attr("x", d => x(d.data.alignment))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))

    // Remove empty rects
    $(document).ready(function () {
        $("[height=0]").remove()
        $("text").filter(function () {
            return $(this).attr("height") < 25
        }).remove()
    })
}

$(document).ready(function () {
    d3.json("assets/data/resultsPopVote.json").then(d => chart(d));

    // Scrollmagic
    var controller = new ScrollMagic.Controller();

    var pinChart = new ScrollMagic.Scene({
            triggerElement: ".resultsViz",
            duration: 500,
            triggerHook: 0
        })
        .setPin(".resultsViz")
        .addIndicators({
            name: "Pin Chart"
        }) // add indicators (requires plugin)
        .addTo(controller);
});
