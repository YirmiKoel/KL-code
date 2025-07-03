theme.productFeatures = {
  discounts:
  {
    init: function()
    {
      $('.product-discount-block').on('click', function(e)
      {
        const elem = $(this)[0];
        theme.log(elem);
        theme.log(elem.parentNode);
        
        $('.product-discount').removeClass('active');
        elem.parentNode.classList.add('active');
        
        $('#product-quantity').val( elem.parentNode.dataset.quantity )
      });
    }
  },
  images: {
    init: function()
    {
      const swiperProdImage = new Swiper('#swiper-productimage', {
        lazy: true,      
        on: {
          lazyImageReady: function()
          {
            $('.productpage .swiper-lazy.swiper-lazy-loaded').animate({opacity: 1}, 200);
          }
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
        },
      });

      window.swiperThumbs = new Swiper('#swiper-product-thumbs', {
        navigation: {
          nextEl: '.thumb-arrow-right',
          prevEl: '.thumb-arrow-left',
        },
        slidesPerView: 'auto'
      });

      $('.product-thumb-img').on('click', function()
      {
        var itemIndex = $(this).parent().index();

        $('#swiper-product-thumbs .swiper-slide').removeClass('active');
        $(this).parent().addClass('active');
        swiperProdImage.slideTo(itemIndex);
        swiperProdImage.update(true);
      });
    }
  },
  init: function()
  {
    theme.productFeatures.images.init();
    theme.productFeatures.discounts.init();
    
    // Zoom on mouseover
    if( window.innerWidth > 767 && theme.settings.product_mouseover_zoom )
    {
      $('.zoom').zoom({touch:false});
    }
  }
};

theme.productFeatures.init();

if( theme.settings.dyapps_advanced_variants && theme.settings.dyapps_addons_enabled )
{
    if( (!window.dyapps || (window.dyapps && !window.dyapps.addons) || (window.dyapps && window.dyapps.addons && window.dyapps.addons.settings.advancedVariants && !window.dyapps.addons.settings.advancedVariants.enabled)) || (typeof ThemeAddons === 'undefined') || (typeof ThemeAddons !== 'undefined' && !ThemeAddons.loaded))
  {
    $qsa('.dy-advanced-variants-form-loading').forEach( function(elem)
    {
      elem.classList.remove('dy-advanced-variants-form-loading');
    });
  }
}

$qsa('.product-as-bundle-variants').forEach( function(elem)
{
  $.get( elem.getAttribute('data-json'), function(data)
  {
    theme.log('ProductAsBundleVariants:');
    theme.log(data.product.variants);

    const selectElem = document.createElement(data.product.variants ? 'select' : 'input');
    selectElem.name = 'product[]';
    
    if( !data.product.variants )
    {
      selectElem.type = 'hidden';
      selectElem.value = data.product.vid;
    }
    else
    {
      elem.innerHTML = '';
      selectElem.classList.add('fancy-select', 'mt-1');

      for (variantId in data.product.variants)
      {
        const variant = data.product.variants[variantId];

        const optionElem = document.createElement('option');
        optionElem.value = variant.id;
        optionElem.innerText = variant.title + ' - ' + theme.helpers.parsePrice(variant.price.price);

        if( !variant.stock.available )
        {
          optionElem.innerText += ' ('+theme.text.outOfStock+')';

          if( variant.position != 1 )
          {
            optionElem.disabled = true;
          }
        }

        selectElem.appendChild(optionElem);
      }
    }

    elem.appendChild(selectElem);
  });
});


if(window.innerWidth < 768 )
{
  // console.log('Win Width less than 768');
  theme.log('sticky start mobile');

  const addToCartButton = document.getElementById('add-to-cart-button');
  const elem = $('.addtocart-sticky');
  let stickyVisible = false;

  const observer = new IntersectionObserver(function(entries)
  {
    if(entries[0].isIntersecting === true)
    {
      theme.log('sticky intersecting TRUE');
      if( stickyVisible )
      {
        theme.log('already visible, remove class');
        elem.removeClass('mobile-visible');
        stickyVisible = false;
      }
    }
    else
    {
      if( !stickyVisible )
      {
        elem.addClass('mobile-visible');
        stickyVisible = true;
      }
    }
  }, { threshold: [0] });

  if( addToCartButton )
  {
    observer.observe(addToCartButton);
  }
}
else
{
  var stickyVisible = false;
  var stickyBar = $('.addtocart-sticky');
  var holder = $('.addtocart-holder');

  function checkStickyAddToCart()
  {
    if( !holder.length )
      return;
    
      if ( $(window).scrollTop() >= holder.offset().top )
      {
        if( !stickyVisible )
        {
          stickyBar.addClass('visible');
          stickyBar.fadeIn(100);
          stickyVisible = true;
        }

      }
      else
      {
        if( stickyVisible )
        {
          stickyBar.removeClass('visible');
          stickyBar.fadeOut(100);
          stickyVisible = false;
        }
      }

      setTimeout(checkStickyAddToCart, 100);
    
  }

  if( stickyBar )
  {
  checkStickyAddToCart();
  }
}

$('.open-bundle-item-options').on('click', function(e)
{
  e.preventDefault();
  var pid = $(this).attr('data-bundle-pid');
  var bid = $(this).attr('data-bundle-id');
  $('.bundle-configure[data-bundle-id="'+bid+'"][data-bundle-pid="'+pid+'"]').fadeIn();
});

$('.close-bundle-item-options').on('click', function(e)
{
  e.preventDefault();
  $(this).closest('.bundle-configure').fadeOut();
});

window.collectionCategoryScroller = new theme.horizontalScroller('#pp-related-dynamic', {
  enableNav: true,
  observer: true
});

window.discountsCarousel = new theme.horizontalScroller('.product-discounts', {
  enableNav: true
});

window.proconCarousel = new theme.horizontalScroller('.procon-carousel', {
  enableNav: true
});

theme.hooks.productStoreInventoryLoaded = function(data)
{
  console.log(data);
  const contentElem = $id('store-inventory-content');

  if( !data.productInventory )
  {
    contentElem.innerHTML = '<div class="c-non-success p-3 gray-border mt-2 mb-3" style="word-break: break-word;">No inventory location data found. Have you set up and enabled Inventory Locations correctly in Retail? Please contact Lightspeed support for assistance.</div>';
    return;
  }

  const locations = data.productInventory.locations;
  let storeHtml = '';

  for( var i in locations)
  {
    let store = locations[i]

    storeHtml += '<div class="stock-modal-store-row gray-border-bottom mt-3 pb-3">';
    storeHtml += '   <i class="stock-modal-store-icon d-none d-sm-block icon-location mr-3"></i>';
    storeHtml += '   <div class="flex-grow-1 pr-2">';
    storeHtml += '      <h4 class="fz-100 bold">'+store.location.title+'</h4>';
    storeHtml += '      <span class="fz-090 opacity-70">'+store.location.address.formatted+'</span>';
    storeHtml += '   </div>';
    storeHtml += '   <div class="stock nowrap">';

    if( store.inventory > 0 )
    {
      if( theme.settings.show_amount_of_products_on_productpage )
      	storeHtml += '<div class="in-stock"><i class="icon-check"></i> '+theme.text.inStock+' ('+store.inventory+')</div>';
      else
      	storeHtml += '<div class="in-stock"><i class="icon-check"></i> '+theme.text.inStock+'</div>';
    }
    else
    {
    	storeHtml += '<div class="out-of-stock"> '+theme.text.outOfStock+'</div>';
    }

    storeHtml += '   </div>';
    storeHtml += '</div>';
  }

  contentElem.innerHTML = storeHtml;
}