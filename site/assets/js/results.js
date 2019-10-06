function generateTooltips(data, rect, div) {
    var party = rect.parent().attr("party");
    var partyData = data.filter(function (f, i) {
        return f.party == party
    })[0];

    var tooltip_content = `<p class="bold">` + partyData.full_name + `</p><p>Nominated ` + partyData.num_cand + ` candidates</p><p>Won ` + partyData.seats_won + ` seats</p><p>Won ` + formatNumber(partyData.pop_vote) + ` votes</p><p>` + partyData.vote_share + ` vote share</p>`

    console.log(tooltip_content)
    
    $(this).addClass("hover")
    div.html(tooltip_content);

    div.transition()
        .duration(500)
        .style("opacity", 0);
    div.transition()
        .duration(200)
        .style("opacity", .9);

}

function translateTooltips(x, y, div) {
    div.style("left", (x) + "px")
        .style("top", (y - 28) + "px")
}

function chart(data) {


    var speed = 1;
    // Generate align
    var align = []
    data.forEach(function (d) {
        align.push(d.alignment)
    })

    var parties = Object.keys(data[0]).slice(2, )

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
        .attr("transform", `translate(${width-margin.right},0)`)
        .attr("class", "y-axis")

    data.forEach(function (d) {
        d.total = d3.sum(parties, k => +d[k])
    })

    y.domain([0, d3.max(data, d => d.total)]).nice();

    x.domain(data.map(d => d.alignment));

    svg.selectAll(".y-axis").transition().duration(speed)
        .call(d3.axisLeft(y).ticks(10).tickSize(width - margin.left - margin.right))

    svg.selectAll(".x-axis").transition().duration(speed)
        .call(d3.axisBottom(x))

    var group = svg.selectAll("g.layer").data(d3.stack().keys(parties)(data))

    //Remove empty elements
    group.exit().remove()

    group.enter().append("g").classed("layer", true)
        .attr("fill", d => getColor(d.key))
        .attr("party", d => d.key)
        .text("Something went wrong")


    var party_label = svg.selectAll("g.layer").selectAll(".text")
        .data(d => d, e => e.data.align);

    party_label.exit().remove();

    party_label.enter()
        .append("text")
        .text(function (d) {
            return $(this).parent().attr("party")
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
        .attr("stroke-width", "1")
        .attr("stroke", "black")

    // Remove empty rects
    $(document).ready(function () {
        $("[height=0]").remove()
        $("text").filter(function () {
            return $(this).attr("height") < 25
        }).remove()

        // Define the div for the tooltip
        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        d3.json("assets/data/tooltipDetails.json").then(function (d) {
            $(".layer rect").on("mouseover", function (e) {
                    generateTooltips(d, $(this), div);
                    translateTooltips(e.pageX, e.pageY, div)
                })
                .on("mousemove", function (e) {
                    translateTooltips(e.pageX, e.pageY, div)
                })
                .on("mouseout", function (e) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                    $(this).removeClass("hover")
                });
        })
    })
}

$(document).ready(function () {
    d3.json("assets/data/resultsPopVote.json").then(d => chart(d));

    // Scrollmagic
    var controller = new ScrollMagic.Controller();

    var revealP = new ScrollMagic.Scene({
            triggerElement: ".reveal1",
            triggerHook: 0.5, // show, when scrolled 10% into view
            offset: 250
        })
        .setClassToggle(".reveal1", "visible") // add class to reveal
        .addIndicators({
            name: "reveal text"
        }) // add indicators (requires plugin)
        .addTo(controller);

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
