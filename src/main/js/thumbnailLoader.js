var $ = require('jQuery');

$.fn.progressiveZoom = function (options) {
  var settings = $.extend({
    className : 'progressive-zoom-wrap',
    progressClass : 'progressive-zoom-progress',
    errorLoadingClass : 'error',
    doneLoadingClass : 'done'
  }, options);

  if (this.filter('img').length === 0) {
    return this.find('img').each(createBoxAroundImage)
  }
  return this.filter('img').each(createBoxAroundImage);

  function createBoxAroundImage() {
    var $this = $(this);
    var fullSizeImageUrl = $this.attr('data-full-size');
    var $wrapper = $('<div>').addClass(settings.className);
    var $thumb = $this.clone().addClass('thumb');
    var $progressBar = $('<div>').addClass(settings.progressClass);
    var $img = $('<img>').addClass('full');

    $wrapper.css({width : $this.width()});
    $wrapper.append($thumb);
    $wrapper.append($img);
    $(this).replaceWith($wrapper);

    var xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open('GET', fullSizeImageUrl, true);
    xmlHTTP.responseType = 'arraybuffer';
    xmlHTTP.onload = function () {
      var blob = new Blob([this.response]);
      $img.attr('src', window.URL.createObjectURL(blob));
      $img.css({opacity : 1});
      $progressBar.addClass(settings.doneLoadingClass);
      $progressBar.css({opacity : 0});
    };
    xmlHTTP.onprogress = function (e) {
      if (e.lengthComputable) {
        $progressBar.width((e.loaded / e.total * 100) + '%');
      }
    };
    xmlHTTP.onloadstart = function () {
      setTimeout(function(){
        $wrapper.css({width : '100%'});
      }, 1);
      $wrapper.append($progressBar);
    };
    xmlHTTP.onerror = function () {
      $progressBar.addClass(settings.errorLoadingClass);
    };
    console.log('send http req');
    xmlHTTP.send();
  }
};

$('#thumb-test2').click(function () {
  $(this).progressiveZoom();
});

console.log('started');
