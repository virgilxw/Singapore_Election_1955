$(document).ready(function () {
    // Scrollmagic Controller
    var controller = new ScrollMagic.Controller()

    // Parralax effect for all pinned elements
    var pinned = $(".pinned")

    for (var i = 0; i < pinned.length; i++) {
        new ScrollMagic.Scene({
                triggerElement: pinned[i],
                triggerHook: 0,
                duration: "200%"
            }).setPin(pinned[i], {
                pushFollowers: false
            })
            .addIndicators() // add indicators (requires plugin)
            .addTo(controller);
    }

    // Official fade-in
    new ScrollMagic.Scene({
        triggerElement: pinned[i]
    });

    // reveal Member Profiles
    var profiles = $(".profile")
    for (var i = 0; i < profiles.length; i++) { // create a scene for each element
        new ScrollMagic.Scene({
                triggerElement: profiles[i], // y value not modified, so we can use element as trigger as well
                offset: 50, // start a little later
                triggerHook: 0.5
            })
            .setClassToggle(profiles[i], "visible") // add class toggle
            .addIndicators({
                name: "profile " + (i + 1)
            }) // add indicators (requires plugin)
            .addTo(controller);
    }

    // load Map

    // Initiates Map
    var map = L.map('map', {
        zoomControl: false
    }).setView([1.35, 103.82], 11);
    // Disable user controls
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();

    // Basemaps
    var LayerOneMapSG_Default = L.tileLayer('https://api.mapbox.com/styles/v1/virgilwxw/ck06ksmvx2axs1ctqea2zqt77/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidmlyZ2lsd3h3IiwiYSI6ImNqYmhrN25rZTNoNWgyeHBlNnY0N3Z6dDAifQ.KCzg-gN0vwIeQNoQyjWVXg', {
        attribution: '© <a href="https://apps.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);


    setTimeout(function () {
        map.invalidateSize()
    }, 300);
    $(window).resize(function () {
        map.invalidateSize()
    });

    //Scene to pin map
    var pinMap = new ScrollMagic.Scene({
            triggerElement: "#map",
            triggerHook: 0
        })
        .setPin("#map")
        .addIndicators({
            name: "pinMap"
        })
        .addTo(controller);

    // Add traffic layer
    var trafficLayer = L.imageOverlay("/assets/maplayers/Traffic_small.png", [[1.1307, 103.5810], [1.519, 104.1338]]);

    var traffic = new ScrollMagic.Scene({
        triggerElement: "#three",
        triggerHook: 0.5
    }).on('enter', function () {
        map.addLayer(trafficLayer).flyToBounds([[1.478, 104.096], [1.162, 103.145]])
    }).on('leave', function () {
        map.removeLayer(trafficLayer).panTo([1.35, 103.82], 11)
    }).addIndicators({
        name: "load traffic layer"
    }).addTo(controller);

    var roads = new ScrollMagic.Scene({
        triggerElement: ".roads",
        triggerHook: 0.5
    }).on('enter', function () {
        map.flyToBounds([[1.412, 103.795], [1.266, 103.510]])
    }).on('leave', function () {
        map.flyToBounds([[1.478, 104.096], [1.162, 103.145]])
    }).addIndicators({
        name: "load roads slide"
    }).addTo(controller);
});
