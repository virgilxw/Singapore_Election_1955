function chart(data) {


    var speed = 1;
    // Generate align
    var align = []
    data.forEach(function (d) {
        align.push(d.alignment)
    })

    var parties = Object.keys(data[0]).slice(1, -1)

    //Generate graph
    var margin = ({
            top: 50,
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
        .range([margin.left, width - margin.right])
        .padding(0.1)

    var y = d3.scaleLinear()
        .rangeRound([height - margin.bottom, margin.top])

    var xAxis = svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .attr("class", "x-axis")

    var yAxis = svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .attr("class", "y-axis")

    var z = d3.scaleOrdinal(d3.schemeCategory10).domain(parties)

    svg.selectAll(".y-axis").transition().duration(speed)
        .call(d3.axisLeft(y).ticks(null, "s"))

    data.forEach(function (d) {
        d.total = d3.sum(parties, k => +d[k])
    })

    y.domain([0, d3.max(data, d => d.total)])

    x.domain(align);

    svg.selectAll(".x-axis").transition().duration(speed)
        .call(d3.axisBottom(x).tickSizeOuter(0))
}

$(document).ready(function () {
    d3.json("assets/data/resultsPopVote.json").then(d => chart(d));
});
