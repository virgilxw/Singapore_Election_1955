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
		triggerHook: 0.8, // Set position of trigger at 85% down the viewport
		reverse: true
	})
	.setTween("#GGThomson", 1, {opacity: "1"} )
	.addIndicators({name: "Official Profile Fade In"}) // add indicators (requires plugin)
	.addTo(controller);
	
	var legCoProfileFadeIn = new ScrollMagic.Scene({
		triggerElement: ".LegCo",
		triggerHook: 0.8, // Set position of trigger at 85% down the viewport
		reverse: true
	})
	.setTween(".LegCo", 1, {opacity: "1"} )
	.addIndicators({name: "LegCo Profile Fade In"}) // add indicators (requires plugin)
	.addTo(controller);

	var citCoProfileFadeIn = new ScrollMagic.Scene({
		triggerElement: ".citCo",
		triggerHook: 0.8, // Set position of trigger at 85% down the viewport
		reverse: true
	})
	.setTween(".citCo", 1, {opacity: "1"} )
	.addIndicators({name: "CitCo Profile Fade In"}) // add indicators (requires plugin)
	.addTo(controller);
	
	var RurBoProfileFadeIn = new ScrollMagic.Scene({
		triggerElement: ".citCo",
		triggerHook: 0.8, // Set position of trigger at 85% down the viewport
		reverse: true,
		offset: 200
	})
	.setTween(".RurBo", 1, {opacity: "1"} )
	.addIndicators({name: "CitCo Profile Fade In"}) // add indicators (requires plugin)
	.addTo(controller);
	
	
});