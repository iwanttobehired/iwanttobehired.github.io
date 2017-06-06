$(document).ready(function() {
  
  // Add product to cart
  // ----------------------------------
  $('.btn--primary').click(function (e) { 

    var num = +$('.cart').attr("data-number");
    num = num + 1;
    $('.cart').attr('data-number', num);

    if ( num > 0 ) {
      $('.cart').addClass('showNumber');
    }
  });
 


  // Carousel
  // ----------------------------------
  function carousel() {
    var $carousel = $('[data-carousel="carousel"]');
    var itemClass = 'rv-pagination__item';
    var $item = '<button class="rv-pagination__item"></button>';
    var $items = [];

    // Create pagination button
    function createPagination(target, items) {

      target.children().remove();
      target.parent().prev().find('[data-carousel="list"]')
        .css('transform', 'translate3d(0%, 0, 0)');

      for (var i = 0; i < items; i++) {
        $items.push($item);
      }

      return target.append($items);
    }


    $carousel.each(function(el, index){
      $carouselContainer = $(this);

      var $pagination = $carouselContainer.children('[data-carousel="pagination"]');
      var $list =  $carouselContainer.children('[data-carousel="list"]');
      var size;

      // Check resolution to change items size
      if (window.matchMedia("(max-width: 767px)").matches) {
        size = 1;
      }
      if (window.matchMedia("(min-width: 768px) and (max-width: 991px)").matches) {
        size = 2;
      } 
      if (window.matchMedia("(min-width: 992px)").matches) {
        size = 4;
      }


      setTimeout(function () {
        var items = ($carouselContainer.find('[data-carousel="item"]:not(.hidden)').length) / size;
        $items = [];

        // Create pagination with new size
        createPagination($pagination, items);

        var $button = $pagination.children('.rv-pagination__item');

        // Hidden pagination if we have only 1 
        if ($button.length <= 1) {
          $pagination.addClass('hidden');
        } else {
          $pagination.removeClass('hidden');
          $pagination.children('.rv-pagination__item:first-child').addClass('active');
        }

        // Add/Remove class active and scroll carousel
        $button.each(function (el, index) {
          $(this).click(function (event) {
            $(index).parent().prev().find('[data-carousel="list"]')
              .css('transform', 'translate3d(-' + (el * 100) + '%, 0, 0)');
            
            $button.removeClass('active');
            $(index).addClass('active');
          });
        });
      });
    })
  };


  window.onresize = carousel;
  carousel();



  // Filter
  // ----------------------------------
  var $filterType = $('[data-filter-type]');
  var $filterCategory = $('[data-filter-category]');
  var $showAllProducts = $('[data-filter="all"]');

  var $productType = $('[data-product-type]');
  var $productCategory = $('[data-product-catogory]');


  function hideProduct(item) {
    item.addClass('hidden');
    carousel();
  }

  function showProduct(item) {
    item.removeClass('hidden');
    carousel();
  }

  // Filter product's type
  $filterType.click(function (e) {
    var value = this.getAttribute('data-filter-type');
    var $item = $('[data-product-type=' + value + ']');

    if ( !this.checked ) {
      return hideProduct($item);
    }

    return showProduct($item);
  });

  // Filter product's category
  $filterCategory.click(function (e) {
    var value = this.getAttribute('data-filter-category');
    var $item = $('[data-product-category=' + value + ']');

    if ( !this.checked ) {
      return hideProduct($item);
    }

    return showProduct($item);
  });

  // Show all products
  $showAllProducts.click(function (e) {
    $filterType.each(function () {
      var isChecked = $(this).prop('checked');

      if ( !isChecked ) {
        $(this).click();
      }
    });

    $filterCategory.each(function () {
      var isChecked = $(this).prop('checked');
      
      if ( !isChecked ) {
        $(this).click();
      }
    });
  });

});




