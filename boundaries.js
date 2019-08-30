$(document).ready(function () {


    var controller = new ScrollMagic.Controller();

    // Fade in banner text at slightly different durations.
    var bannerH1 = $("#banner .inner h1")
    TweenMax.fromTo(bannerH1, 2, {
        opacity: 0,
        x: -15
    }, {
        opacity: 1,
        x: 0
    })
    var bannerp = $("#banner .inner p")
    TweenMax.fromTo(bannerp, 5, {
        opacity: 0,
        x: -15
    }, {
        opacity: 1,
        x: 0
    })

    // Create scenes for revealing committee members

    var officialFadeIn = ScrollMagic.Scene({
								triggerElement: $("profileLi Official"), // y value not modified, so we can use element as trigger as well
								offset: 5,												 // start a little later
								triggerHook: 0.9,
							})
							.setClassToggle($("profile Official"), "visible") // add class toggle
							.addIndicators({name: "digit " + (i+1) }) // add indicators (requires plugin)
							.addTo(controller);

})
