$(document).ready(function(){
    
    var controller = new ScrollMagic.Controller();
    
    // Fade in banner text at slightly different durations.
    var bannerH1 = $("#banner .inner h1")
    TweenMax.fromTo(bannerH1, 2, {opacity: 0, x: -15}, {opacity: 1, x: 0})
    var bannerp = $("#banner .inner p")
    TweenMax.fromTo(bannerp, 5, {opacity: 0, x: -15}, {opacity: 1, x: 0})
    
})