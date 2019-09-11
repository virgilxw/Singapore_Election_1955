$(document).ready(function () {
    // Scrollmagic Controller
    var controller = new ScrollMagic.Controller()


    // Parralax effect for all pinned elements
    var pinned = $(".pinned")

    for (var i = 0; i < pinned.length; i++) {
        new ScrollMagic.Scene({
                triggerElement: pinned[i],
                triggerHook: 0,
                duration: "100%"
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
                triggerHook: 0.5,
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
    // Basemaps
    var LayerOneMapSG_Default = L.tileLayer('https://api.mapbox.com/styles/v1/virgilwxw/ck06ksmvx2axs1ctqea2zqt77/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidmlyZ2lsd3h3IiwiYSI6ImNqYmhrN25rZTNoNWgyeHBlNnY0N3Z6dDAifQ.KCzg-gN0vwIeQNoQyjWVXg', {
        attribution: '© <a href="https://apps.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    
    setTimeout(function () {
            map.invalidateSize()
        }, 400);
    $(window).resize(function () {
            map.invalidateSize()
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


});
