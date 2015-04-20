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
    $this.replaceWith($wrapper);

    $wrapper.click(function() {
      $wrapper.replaceWith($this);
      $this.click(function() {
        $(this).progressiveZoom();
      })
    });

    var xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open('GET', fullSizeImageUrl, true);
    xmlHTTP.responseType = 'arraybuffer';
    xmlHTTP.onload = function (e) {
      console.log('onload', e);
      if (e.target.status === 200) {
        var blob = new Blob([this.response]);
        $img.attr('src', window.URL.createObjectURL(blob));
        $wrapper.addClass(settings.doneLoadingClass);
      } else {
        console.log('error loading');
        $wrapper.addClass(settings.errorLoadingClass);
      }
    };
    xmlHTTP.onprogress = function (e) {
      console.log('progress', e);
      if (e.lengthComputable) {
        $progressBar.width((e.loaded / e.total * 100) + '%');
      }
    };
    xmlHTTP.onloadstart = function () {
      console.log('load start');
      setTimeout(function () {
        $wrapper.css({width : '100%'});
      }, 1);
      $wrapper.append($progressBar);
    };
    console.log('send http req');
    xmlHTTP.send();
  }
};

$('#thumb-test2').click(function () {
  $(this).progressiveZoom();
});

console.log('started');
