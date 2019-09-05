$(document).ready(function () {

            //Preloader
            $(window).on("load", function () {
                preloaderFadeOutTime = 500;

                function hidePreloader() {
                    var preloader = $('.spinner-wrapper');
                    preloader.fadeOut(preloaderFadeOutTime);
                }
                hidePreloader();
            });

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
        });
