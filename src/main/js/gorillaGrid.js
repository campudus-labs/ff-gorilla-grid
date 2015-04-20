var $ = require("jQuery");

var marginVertical = 100;
var marginHorizontal = 100;
var gorillaGridSelector = "#gorillaGrid";
var $window = $(window);
var $html = $("html");
var $gorillaGrid = $(gorillaGridSelector);
var containerHeight = $window.height() - marginVertical;
var containerWidth = $window.width() - marginHorizontal;
var resizeDelayTime = 100;

/**
 * Window resize event after x ms
 */
(function(){
  var windowResizeTimer = null;
  $window.resize(function () {
    if (windowResizeTimer !== null) {
      clearTimeout(windowResizeTimer);
    }
    windowResizeTimer = setTimeout(function () {
      windowResizeTimer = null;
      windowResizeActions();
    }, resizeDelayTime);
  });
}());

function windowResizeActions(){
  containerHeight = $window.height() - marginVertical;
  containerWidth = $window.width() - marginHorizontal;
  console.log("resized: container height: " + containerHeight + " / width: " + containerWidth);

  $gorillaGrid.width(containerWidth);
  $gorillaGrid.height(containerHeight);
  //$html.css("overflow","hidden");
}

windowResizeActions();

