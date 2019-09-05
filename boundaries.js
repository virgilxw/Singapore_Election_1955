$(document).ready(function () {

    // init controller
    var controller = new ScrollMagic.Controller();
    // Fade in banner text at slightly different durations.
    var bannerH1 = $("#banner .inner h1");
    TweenMax.fromTo(bannerH1, 1, {
        opacity: 0,
        x: -20
    }, {
        opacity: 1,
        x: 0
    });
    var bannerp = $("#banner .inner p");
    TweenMax.fromTo(bannerp, 2, {
        opacity: 0,
        x: -20
    }, {
        opacity: 1,
        x: 0
    });
    // Fade in profiles
    var officialProfileFadeIn = new ScrollMagic.Scene({
            triggerElement: "#GGThomson",
            triggerHook: 0.7, // Set position of trigger at 85% down the viewport
            reverse: true
        }).setTween("#GGThomson", 1, {
            opacity: "1"
        }).on("enter", function () {
            $("#listOfficial").css("background-color", "rgba(219, 211, 0, 0.22)")
        }).on("leave", function () {
            $("#listOfficial").css("background-color", "rgba(219, 211, 0 , 0)")
        }).addIndicators({
            name: "Official Profile Fade In"
        }) // add indicators (requires plugin)
        .addTo(controller);
    var legCoProfileFadeIn = new ScrollMagic.Scene({
            triggerElement: ".LegCo",
            triggerHook: 0.7, // Set position of trigger at 85% down the viewport
            reverse: true,
            offset: 100
        }).setTween(".LegCo", 1, {
            opacity: "1"
        }).on("enter", function () {
            $("#listOfficial").css("background-color", "rgba(219, 211, 0 , 0)")
            $("#listLegCo").css("background-color", "rgba(219, 211, 0 , 0.22)")
        }).on("leave", function () {
            $("#listLegCo").css("background-color", "rgba(219, 211, 0 , 0)")
            $("#listOfficial").css("background-color", "rgba(219, 211, 0, 0.22)")
        }).addIndicators({
            name: "LegCo Profile Fade In"
        }) // add indicators (requires plugin)
        .addTo(controller);
    var citCoProfileFadeIn = new ScrollMagic.Scene({
            triggerElement: ".citCo",
            triggerHook: 0.7, // Set position of trigger at 85% down the viewport
            reverse: true
        }).setTween(".citCo", 1, {
            opacity: "1"
        }).on("enter", function () {
            $("#listLegCo").css("background-color", "rgba(219, 211, 0 , 0)")
            $("#listCitCo").css("background-color", "rgba(219, 211, 0 , 0.22)")
        }).on("leave", function () {
            $("#listCitCo").css("background-color", "rgba(219, 211, 0 , 0)")
            $("#listLegCo").css("background-color", "rgba(219, 211, 0 , 0.22)")
        }).addIndicators({
            name: "CitCo Profile Fade In"
        }) // add indicators (requires plugin)
        .addTo(controller);
    var RurBoProfileFadeIn = new ScrollMagic.Scene({
            triggerElement: ".citCo",
            triggerHook: 0.7, // Set position of trigger at 85% down the viewport
            reverse: true,
            offset: 200
        }).setTween(".RurBo", 1, {
            opacity: "1"
        }).on("enter", function () {
            $("#listCitCo").css("background-color", "rgba(219, 211, 0 , 0)")
            $("#listRurBo").css("background-color", "rgba(219, 211, 0 , 0.22)")
        }).on("leave", function () {
            $("#listRurBo").css("background-color", "rgba(219, 211, 0 , 0)")
            $("#listCitCo").css("background-color", "rgba(219, 211, 0 , 0.22)")
        }).addIndicators({
            name: "CitCo Profile Fade In"
        }) // add indicators (requires plugin)
        .addTo(controller);

    // Resize map div
    function resizeMap(){
        var vph = window.innerHeight
        $("#map").height(vph);
        var vpw = $(window).width();
        $("#map").width(vpw);
        console.log(vph)
    }
    
    resizeMap();
    $(window).resize(resizeMap).resize();
    
    //Create scene to pin map
    
    var pinMap = new ScrollMagic.Scene({triggerElement: "#trigger1", duration: 300})
						.setPin("#pin1")
						.addIndicators({name: "1 (duration: 300)"}) // add indicators (requires plugin)
						.addTo(controller);

    // Initiates Map
    var map = L.map('map').setView([1.35, 103.82], 12);
    // Basemaps
    var LayerOneMapSG_Default = L.tileLayer('https://api.mapbox.com/styles/v1/virgilwxw/ck06ksmvx2axs1ctqea2zqt77/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidmlyZ2lsd3h3IiwiYSI6ImNqYmhrN25rZTNoNWgyeHBlNnY0N3Z6dDAifQ.KCzg-gN0vwIeQNoQyjWVXg', {
        minZoom: 11,
        maxZoom: 18,
        bounds: [[1.56073, 104.11475], [1.16, 103.502]],
        attribution: 'Mapbox'


    });
});
