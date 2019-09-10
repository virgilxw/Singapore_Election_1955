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
            triggerHook: 0.5, // Set position of trigger at 85% down the viewport
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
            triggerHook: 0.5, // Set position of trigger at 85% down the viewport
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
            triggerHook: 0.5, // Set position of trigger at 85% down the viewport
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
            triggerHook: 0.5, // Set position of trigger at 85% down the viewport
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
    function resizeMap() {
        var vph = window.innerHeight
        $("#map").height(vph);
        console.log(vph)
    }


    resizeMap();
    $(window).resize(function () {
        resizeMap()
        setTimeout(function () {
            map.invalidateSize()
        }, 400);
    });

    //Create scene to pin map
    var pinMap = new ScrollMagic.Scene({
            triggerElement: "#map",
            triggerHook: 0
        })
        .setPin("#map")
        .addIndicators({
            name: "pinMap"
        })
        .addTo(controller);

    // Fixes map issues on startup
    setTimeout(function () {
        map.invalidateSize()
    });

    // Initiates Map
    var map = L.map('map', {
        zoomControl: false
    }).setView([1.35, 103.82], 12);
    // Basemaps
    var LayerOneMapSG_Default = L.tileLayer('https://api.mapbox.com/styles/v1/virgilwxw/ck06ksmvx2axs1ctqea2zqt77/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidmlyZ2lsd3h3IiwiYSI6ImNqYmhrN25rZTNoNWgyeHBlNnY0N3Z6dDAifQ.KCzg-gN0vwIeQNoQyjWVXg', {
        attribution: '© <a href="https://apps.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    map.setView([1.3521, 103.8198]).setZoom(11)

    // Fade in profiles
    var FadeInProfile = new ScrollMagic.Scene({
            triggerElement: "#GGThomson",
            triggerHook: 0.5, // Set position of trigger at 85% down the viewport
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

    // Add 1975 map
    var Layer1975Topo = L.tileLayer('https://libmaps.nus.edu.sg/gis/rest/services/Sing_Hist_Maps/1975/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'National University of Singapore'
    });

    var FadeIn1975 = new ScrollMagic.Scene({
            triggerElement: "#map",
            triggerHook: 0.5, // Set position of trigger at 85% down the viewport
            reverse: true,
            offset: 200,
        duration: 1000
        }).on("start", function () {
            Layer1975Topo.addTo(map);
        }).on("leave", function () {
            map.removeLayer(Layer1975Topo);
        }).addIndicators({
            name: "Add 1975 map layer"
        }) // add indicators (requires plugin)
        .addTo(controller);

    // Add 1953 map
    var Layer1953Topo = L.tileLayer('https://libmaps.nus.edu.sg/gis/rest/services/Sing_Hist_Maps/1953/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'National University of Singapore'
    });

    var FadeIn1953 = new ScrollMagic.Scene({
            triggerElement: "#map",
            triggerHook: 0.5, // Set position of trigger at 85% down the viewport
            reverse: true,
            offset: 400
        }).on("start", function () {
            Layer1953Topo.addTo(map);
        }).on("leave", function () {
            map.removeLayer(Layer1953Topo);
        }).addIndicators({
            name: "Add 1953 map layer"
        }) // add indicators (requires plugin)
        .addTo(controller);



    var FadeInTwoBG = new ScrollMagic.Scene({
            triggerElement: "#sectionTwo",
            triggerHook: 0.5
        }).setClassToggle("#sectionTwo", "visible")
        .addIndicators({
            name: "Fade in Section Two BG"
        }) // add indicators (requires plugin)
        .addTo(controller);

    var FadeInTwoText = new ScrollMagic.Scene({
            triggerElement: ".sectionTwoText",
            triggerHook: 0.5
        }).setClassToggle(".sectionTwoText", "visible")
        .addIndicators({
            name: "Fade in Section Two Text"
        }) // add indicators (requires plugin)
        .addTo(controller);

    var FadeOutTwoBG = new ScrollMagic.Scene({
            triggerElement: "#twoBlockquote",
            triggerHook: 0.5,
            offset: 10
        }).setClassToggle("#TwoImg", "visible")
        .setClassToggle("#TwoImg", "hidden")
        .addIndicators({
            name: "Fade out bgimage"
        }) // add indicators (requires plugin)
        .addTo(controller)
})
