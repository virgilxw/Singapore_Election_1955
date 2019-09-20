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
                triggerHook: 0.8,
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

    // Scene to pin map
    var panMap = new ScrollMagic.Scene({
        triggerElement: "#three",
        triggerHook: 0.8
    }).on('enter', function () {
        map.panInsideBounds([[1.100, 103.185], [1.580, 103.900]], {
            animate: true,
            duration: 2,
            easeLinearity: 0.1
        })

        L.imageOverlay("/assets/maplayers/Traffic_small.png", [[1.1307, 103.5810], [1.519, 104.1338]])
    }).on('leave', function () {
        map.panTo([1.35, 103.82], 11, {
            animate: true,
            duration: 2,
            easeLinearity: 0.1
        })
    }).addIndicators({
        name: "pan map"
    }).addTo(controller);

    var trafficLayer = L.imageOverlay("/assets/maplayers/Traffic_small.png", [[1.1307, 103.5810], [1.519, 104.1338]]);

    var panMap = new ScrollMagic.Scene({
        triggerElement: "#three",
        triggerHook: 0.8,
        offset: 100
    }).on('enter', function () {
        trafficLayer.addTo(map);
    }).addIndicators({
        name: "load traffic layer"
    }).addTo(controller);
});
