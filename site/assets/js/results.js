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
        width = windowWidth - margin.left - margin.right;

    d3.select(".graphContainer")
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

    // y1 = whole graph
    var y0 = d3.scaleLinear()
        .rangeRound([height, 0]);

    // y1 = specific y-stacks
    var y1 = d3.scaleBand();

    // z = specific rectangles
    var z = d3.scaleOrdinal();


    d3.csv("/assets/data/results.csv").then(function (data) {

        data.forEach(function (d) {
            d["Value"] = +d["Value"];
        })

        console.log("loaded CSV:", data)

        x0.domain(data.map(function (d) {
            return d["Category"]
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
                    d2[d.Party] = d.Value
                })
                console.log("rollup d", d, d2);
                return d2;
            })
            .entries(data)
            .map(function (d) {
                return d.value;
            });

        console.log("groupData", groupData)

        var stackData = d3.stack()
            .keys(keys)(groupData)

        console.log("stackData", stackData)

        console.log("keys", keys)
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
