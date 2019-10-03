$(document).ready(function () {

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

    var keys = ["Left-wing Parties", "Independents", "Right-wing Parties"]

    data =  d3.json("assets/data/resultsPopVote.json").then(function (err, data) {

        if (err) throw err;

        stackdata = [keys].map(function(d,i) {
            return {x:i, y:d[c]}
        })
        series = d3.stack().keys(keys)(data)
        console.log(series)
    })

    svg.append("g")
        .selectAll("g")

});
