function getRect(partyName) {
    return $(".layer[party='" + partyName + "'] rect")
}

function generateTooltips(partyRect, detailDiv) {
    // partyRect accepts $(".layer[party='PAP'] rect")
    // position takes two values: mousePos or rectMid

    d3.json("assets/data/tooltipDetails.json").then(function (data) {

        var party = partyRect.parent().attr("party");
        var partyData = data.filter(function (f, i) {
            return f.party == party
        })[0];

        var tooltip_content = `<p class="bold">` + partyData.full_name + `</p><p>Nominated ` + partyData.num_cand + ` candidates</p><p>Won ` + partyData.seats_won + ` seats</p><p>Won ` + formatNumber(partyData.pop_vote) + ` votes</p><p>` + partyData.vote_share + ` vote share</p>`

        detailDiv.html(tooltip_content)
        partyRect.attr("stroke-width", 3);

        detailDiv.transition()
            .duration(500)
            .style("opacity", 0);
        detailDiv.transition()
            .duration(200)
            .style("opacity", 1);
    });
}

function translateTooltips(x, y) {
    d3.select("div#hoverTooltip").style("left", (x) + "px")
        .style("top", (y - 28) + "px")
}

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
            .attr("id", "hoverTooltip")
            .style("opacity", 0);

        $(".layer rect").on("mouseover", function (e) {
                generateTooltips($(this), div);
                translateTooltips(e.pageX, e.pageY)
            })
            .on("mousemove", function (e) {
                translateTooltips(e.pageX, e.pageY)
            })
            .on("mouseout", function (e) {
                $(".layer rect").attr("stroke-width", "1");

                div.transition()
                    .duration(500)
                    .style("opacity", 0);
                $(this).removeClass("hover")
            });
    })
}

function rightWingPartyDetails() {

    // Fade out non-left wing parties

    $.each($(".layer"), function (key, value) {

        if ($(value).attr("party") != "PP") {

            if ($(value).attr("party") != "DP") {
                TweenMax.to(value, 1, {
                    opacity: 0.3
                })
            }
        }
    })

    var PPdiv = d3.select(".graphContainer").append("div")
        .classed("tooltip", true)
        .classed("rightDetail", true)
        .style("opacity", 1);

    var PPrect = $(".layer[party='PP'] rect")
        .attr("stroke-width", 3);

    $(".layer[party='PP']").attr("opacity", 1)


    generateTooltips(PPrect, PPdiv)

    var xPos = +PPrect.attr("x") + +PPrect.width();
    var yPos = +PPrect.attr("y") + 50;

    PPdiv.style("top", yPos + "px")
        .style("left", xPos + "px")

    var DPdiv = d3.select(".graphContainer").append("div")
        .classed("tooltip", true)
        .classed("rightDetail", true);

    var DPrect = $(".layer[party='DP'] rect")
        .attr("stroke-width", 3);

    $(".layer[party='DP']").attr("opacity", 1);



    generateTooltips(DPrect, DPdiv)

    var xPos = +PPrect.attr("x") + +PPrect.width();
    var yPos = +DPrect.attr("y") + 50;

    DPdiv.style("top", yPos + "px")
        .style("left", xPos + "px")
}

function labourWins() {

    $(".rightDetail").remove();
    TweenMax.to($(".layer"), 1, {
        opacity: 1
    });
    $(".layer rect").attr("stroke-width", "1");

    $.each($(".layer"), function (key, value) {

        if ($(value).attr("party") != "SLF") {
            TweenMax.to(value, 1, {
                opacity: 0.3
            })
        }
    })

    var LFdiv = d3.select(".graphContainer").append("div")
        .classed("tooltip", true)
        .classed("rightDetail", true)
        .style("opacity", 1);

    var LFrect = $(".layer[party='SLF'] rect")
        .attr("stroke-width", 3);

    $(".layer[party='SLF']").attr("opacity", 1)


    generateTooltips(LFrect, LFdiv)

    var xPos = +LFrect.attr("x") + +LFrect.width();
    var yPos = +LFrect.attr("y") + 50;

    LFdiv.style("top", yPos + "px")
        .style("left", xPos + "px")
}

$(document).ready(function () {
    d3.json("assets/data/resultsPopVote.json").then(d => chart(d));

    // Scrollmagic
    var controller = new ScrollMagic.Controller();

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

    var pinChart = new ScrollMagic.Scene({
            triggerElement: ".graphContainer",
            duration: 500,
            triggerHook: 0
        })
        .setPin(".graphContainer")
        .addIndicators({
            name: "Pin Chart"
        })
        .addTo(controller);

    var rightTooltips = new ScrollMagic.Scene({
            triggerElement: ".rightTooltips",
            triggerHook: 0.5,
        })
        .on("enter", rightWingPartyDetails)
        .on("leave", function () {
            $(".rightDetail").remove();
            TweenMax.to($(".layer"), 1, {
                opacity: 1
            });
            $(".layer rect").attr("stroke-width", "1");
        })
        .addIndicators({
            name: "rightTooltips"
        })
        .addTo(controller);

    var LabourWins = new ScrollMagic.Scene({
            triggerElement: ".labourWins",
            triggerHook: 0.5
        })
        .on("enter", labourWins)
        .on("leave end", function () {
            $(".rightDetail").remove();
            TweenMax.to($(".layer"), 1, {
                opacity: 1
            });
            $(".layer rect").attr("stroke-width", "1");
        })
        .addIndicators({
            name: "labourWins"
        })
        .addTo(controller);
});
