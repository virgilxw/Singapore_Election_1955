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
        triggerElement: "#threealpha",
        triggerHook: 0.5,
        offset: -50
    }).on('enter', function () {
        map.addLayer(trafficLayer).flyToBounds([[1.478, 104.096], [1.162, 103.145]])
    }).on('leave', function () {
        map.removeLayer(trafficLayer).flyTo([1.35, 103.82], 11)
    }).addIndicators({
        name: "load traffic layer"
    }).addTo(controller);

    var zoomToRoads = new ScrollMagic.Scene({
        triggerElement: "#threealpha",
        triggerHook: 0.5,
        offset: 100
    }).on('enter', function () {
        map.flyToBounds([[1.412, 103.795], [1.266, 103.510]])
    }).on('leave', function () {
        map.flyToBounds([[1.478, 104.096], [1.162, 103.145]])
    }).addIndicators({
        name: "fly to East Singapore"
    }).addTo(controller);

    var layerRoadsTrunk = new L.GeoJSON.AJAX("assets/maplayers/roads-trunk.geojson", {
        style: {
            weight: 15,
            color: "#ffffff"
        }
    })
    var layerRoadsNorth = new L.GeoJSON.AJAX("assets/maplayers/roads-north.geojson", {
        style: {
            weight: 15,
            color: "#d44c46"
        }
    })

    var layerRoadsSouth = new L.GeoJSON.AJAX("assets/maplayers/roads-south.geojson", {
        style: {
            weight: 15,
            color: "#347ebf"
        }
    })

    var addRoadsLayersTrunk = new ScrollMagic.Scene({
        triggerElement: "#threebravo",
        triggerHook: 0.5,
        offset: 0
    }).on('enter', function () {
        map.addLayer(layerRoadsTrunk);
    }).on('leave', function () {
        map.removeLayer(layerRoadsTrunk);
    }).addIndicators({
        name: "add roadsTrunk"
    }).addTo(controller);

    var addRoadsLayersBranch = new ScrollMagic.Scene({
        triggerElement: "#threebravo",
        triggerHook: 0.5,
        offset: 100
    }).on('enter', function () {
        map.addLayer(layerRoadsNorth).addLayer(layerRoadsSouth);
    }).on('leave', function () {
        map.removeLayer(layerRoadsNorth).removeLayer(layerRoadsSouth)
    }).addIndicators({
        name: "add roadsBranch"
    }).addTo(controller);

    var layerRoadsWards = new L.GeoJSON.AJAX("assets/maplayers/roadWards.geojson")

    var addRoadsLayers = new ScrollMagic.Scene({
        triggerElement: "#threecharlie",
        triggerHook: 0.5
    }).on('enter', function () {
        map.addLayer(layerRoadsWards);
    }).on('leave', function () {
        map.removeLayer(layerRoadsWards)
    }).addIndicators({
        name: "add wards"
    }).addTo(controller);
});