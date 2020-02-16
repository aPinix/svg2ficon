$(function() {
  // search();
  modal();
  initIsotope();
  doTyped();
});

function initIsotope() {
  var qsRegex;

  // init Isotope
  var $grid = $('ul').isotope({
    itemSelector: 'li',
    layoutMode: 'fitRows',
    filter: function() {
      var searchBy = $(this).attr('title'),
          result = qsRegex ? searchBy.match(qsRegex) : true;
      return result;
    }
  });

  // use value of search field to filter
  var $quicksearch = $('.header input').keyup(debounce(function() {
    qsRegex = new RegExp($quicksearch.val(), 'gi');
    $grid.isotope();
  }, 200));
}

// debounce so filtering doesn't happen every millisecond
function debounce(fn, threshold) {
  var timeout;
  return function debounced() {
    if(timeout) {
      clearTimeout(timeout);
    }
    function delayed() {
      fn();
      timeout = null;
    }
    timeout = setTimeout(delayed, threshold || 100);
  }
}

function doTyped() {
  initTyped();
  stopTyped();
}

function initTyped() {
  var strArray = [];

  $('ul li').each(function(index, el) {
    var elTit = $(el).attr('title');
    elTit = elTit.replace('icon-', '');
    strArray.push(elTit);

    // $(el).hover(function() {
    //   TweenMax.to(el, .125, {scale: 1.1});
    // }, function() {
    //   TweenMax.to(el, .125, {scale: 1});
    // });
  });


  $('.header input').typed({
    strings: strArray,
    stringsElement: null,
    typeSpeed: 100,
    startDelay: 1000,
    backSpeed: 100,
    backDelay: 2000,
    showCursor: true,
    cursorChar: "|",
    shuffle: true,
    loop: true
  });
}

function stopTyped() {
  var searchInput = $('.header input');
  searchInput.on('click', function(event) {
    event.preventDefault();
    if($('.header').hasClass('no-color')) searchInput.val('');
    searchInput.typed('reset');
    $('.header').removeClass('no-color');
  });

  searchInput.focusout(function(event) {
    initTyped();
    searchInput.val('');
    initIsotope();
    $('.header').addClass('no-color');
  });
}






// search
function search() {
  var input = $('.search input');
  input.keyup(function(event) {
    var str = input.val();

    $('ul li').each(function(index, el) {
      if(str !== '') {
        if($(el).is('[class*="' + str + '"]')) $(this).show();
        else $(this).hide();
      }
      else $('ul li').show();
    });
  });
}

// modal
function modal() {
  $('ul li').each(function(index, el) {
    $(el).on('click', function(event) {
      event.preventDefault();
      var iconTitle = $(el).attr('title');
      if(!$(this).hasClass('icon-clicked')) $(this).addClass('icon-clicked');

      var modalBody = '<div class="icon-modal">' +
        '<div class="icon-holder">' +
          '<div class="icon-big ' + iconTitle + '"></div>' +
          '<div class="icon-title">' + iconTitle + '</div>' +
        '</div>' +
      '</div>';

      $('body').append(modalBody);

      // var fromX = $(el).position().left,
      //     fromY = $(el).position().top,
      //     toX = $('.icon-holder').position().left,
      //     toY = $('.icon-holder').position().top;

      // console.log(fromX, fromY, toX, toY);

      TweenMax.from('.icon-holder', .25, {autoAlpha: 0, scale: 2});
      TweenMax.fromTo('.icon-modal', .25, {autoAlpha: 0}, {autoAlpha: 1, onStart: function() {
        if(!$('.wrapper').hasClass('blurred')) $('.wrapper').addClass('blurred');
      }, onComplete: function() {

        $('.icon-modal').on('click', function(event) {
          event.preventDefault();
          event.stopPropagation();

          if($('.wrapper').length) $('.wrapper').removeClass('blurred');
          TweenMax.to('.icon-holder', .25, {autoAlpha: 1, scale: 2});
          TweenMax.fromTo('.icon-modal', .25, {autoAlpha: 1}, {autoAlpha: 0, onStart: function() {
            if($('.icon-clicked').length) $('.icon-clicked').removeClass('icon-clicked');
            TweenMax.to($('.icon-clicked'), .125, {scale: 1});
          }, onComplete: function() {
            $('.icon-modal').remove();
          }});
        });

        $('.icon-holder').on('click', function(event) {
          event.stopPropagation();
        });

      }});
    });
  });
}
