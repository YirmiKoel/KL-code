function $id(id){ return document.getElementById(id); }
function $qs(qs){ return document.querySelector(qs); }
function $qsa(qsa){ return document.querySelectorAll(qsa); }

if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';
    if (start === undefined) { start = 0; }
    return this.indexOf(search, start) !== -1;
  };
}

if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function(callback, thisArg) {
    thisArg = thisArg || window
    for (let i = 0; i < this.length; i++) {
    	callback.call(thisArg, this[i], i, this)
    }
  }
}

function getDataFeatures(dataField)
{
  let features = {};
  
  if( !dataField )
  {
    return features;
  }
  
  const params = dataField.split('|');
  
  if( params.length )
  {
  	params.forEach( function(paramGroup)
    {
      const param = paramGroup.split(':');
      const option = param[0].trim().toLowerCase();
      const value = (param[1] ? param[1] : param[0]).trim();

      features[option] = value;
    });
  }
  
  return features;
}

function getDataFeature(option, dataField)
{
  const feature = getDataFeatures(dataField);
  
  return feature[option] || false;
}

function pad(number, length)
{
  var str = '' + number;
  while (str.length < length) {
    str = '0' + str;
  }
	
	return str;
}

function getProductImage(imageId, size)
{
  size = size || '650x750x2';
  return theme.url.static + 'files/'+pad(imageId,9)+'/'+size+'/image.jpg'
}

//=============================================
// Extend Swiper JS
//=============================================
Swiper.prototype.checkScrollbars = function()
{
  (this.size / this.virtualSize) < 1 ? this.wrapperEl.classList.add('has-scrollbar') : this.wrapperEl.classList.remove('has-scrollbar');
}

Swiper.prototype.centerSlides = function()
{  
  if( this.params.slidesPerView == 'auto' )
  {
    (this.wrapperEl.scrollWidth <= this.wrapperEl.clientWidth) ? this.wrapperEl.classList.add('justify-content-center', 'pl-2') : this.wrapperEl.classList.remove('justify-content-center', 'pl-2');
  }
  else
  {
		(this.slides.length < this.params.slidesPerView) ? this.wrapperEl.classList.add('justify-content-center', 'pl-2') : this.wrapperEl.classList.remove('justify-content-center', 'pl-2');
  }
}

Swiper.prototype.calcSpaceBetween = function(amt)
{
  switch(this.slides.length)
  {
    case 3:
      return 100;
    case 4:
      return 50;
    default:
      return 30;
  }
}

theme.helpers = {
  parsePrice: function(price)
  {
    price = theme.shop.currency.symbol + (parseFloat(price) * theme.shop.currency.ratio).toFixed(2);
    const periodUse = ['USD', 'GBP', 'CAD'];

    return periodUse.includes(theme.shop.currency.code.toUpperCase()) ? price : price.replace('.', ',');
  },
  responsiveVideos: function(nodeList)
  {
    nodeList.forEach( function(element)
		{
      element.width = '100%';
      element.height = element.scrollWidth / 1.78;
    });
  },
  bindShareButton: function(selector)
  {
    const shareButton = $qs(selector);
    
    if (navigator.share && shareButton)
    {
      console.log('BINDSHAREBUTTON CALLED');
    	shareButton.addEventListener('click', function(e){
        e.preventDefault();
        navigator.share({
          title: shareButton.dataset.title,
          url: shareButton.dataset.url
        }).then(() => {
          console.log('Thanks for sharing!');
        })
        .catch(console.error);
    	});
    }
  },
  loadingButton: function(elem)
  {
    const h = elem.clientHeight;
    const w = elem.clientWidth;
    const html = elem.innerHTML;
    
    elem.style.height = h+'px';
    elem.style.width = w+'px'
    elem.classList.add('button-is-loading');
    
    elem.innerHTML = '<i class="icon-loader-rect icon-large icon-spin"></i>';
    
    this.clear = function()
    {
      elem.style.height = '';
      elem.style.width = '';
      elem.classList.remove('button-is-loading');
      elem.innerHTML = html;
    }
  },
  initPriceSlider: function()
  {
      let params = new URLSearchParams(document.location.search);
      let min = params.get("min");
      let max = params.get("max");
    
      
      $(".collection-filter-price").slider(
      {
        range: true,
        min: theme.pageData.collection.price_min,
        max: theme.pageData.collection.price_max,
        values: [min ?? theme.pageData.collection.filters.min, max ?? theme.pageData.collection.filters.max],
        step: 1,
        slide: function( event, ui)
        {
          $('.price-filter-min').val(ui.values[0]);
          $('.price-filter-max').val(ui.values[1]);
        },
        stop: function(event, ui)
        {
          const form = $(this).closest('form');
          
          if( form.attr('data-filter-type') === 'fancybox' )
          {
            return;
          }
          
          form.submit();
        }
      });
  }
};

theme.scrollTo = function(element, yOffset, behaviour)
{
  yOffset = yOffset || 0;
  yOffset = parseInt(yOffset);
  behaviour = behaviour || 'smooth'
  
  window.scrollTo({
    top: (element.getBoundingClientRect().top + window.pageYOffset + yOffset),
    left: 0,
    behavior: behaviour
  });
};

theme.debug = {
  enable: function(){ localStorage.setItem('theme_debug', true); location.reload(); },
  disable: function(){ localStorage.removeItem('theme_debug'); }
};

theme.logGroup = function(label, collapsed)
{
  if( collapsed )
  {
  	return console.groupCollapsed(label);
  }

  return console.group(label);
};

theme.logGroupEnd = function()
{
  console.groupEnd();
};

theme.log = function(msg, type)
{
  if( !localStorage.getItem('theme_debug') )
  {
    return;
  }
  
  type = type || '';
  
  return (typeof msg == "object") ? console.log(msg) : console.log('%c' + msg, '' + type);
};

theme.logAll = function()
{
  let length = arguments.length;
  let lastParam = arguments[ length ];
  let styling = '';
  
  if( typeof lastParam === 'string' )
  {
    length--;
    styling = lastParam;
  }
  
  for (var i=0; i<length; i++)
  {
    const msg = arguments[i];
    
    if (typeof msg == "object")
    {
        console.log(msg);
    }
    else
    {
        console.log('%c' + msg, '' + styling);
    }
  }
};

theme.urlBuilder = function(baseUrl)
{
  let builtUrl = baseUrl;
  
  this.url = function()
  {
    return builtUrl;
  }
  
  this.addParam = function(key, value)
  {
    let separator = (builtUrl.indexOf("?")===-1) ? "?" : "&";
    let newParam = separator + key + "=" + value;
    
    builtUrl = (builtUrl.replace(newParam,"") + newParam);
    
    return this;
  }
}

theme.colorMix = function(col, amt)
{
  col = col.slice(1); //remove #
  var num = parseInt(col,16);
  var r = (num >> 16) + amt;

  if ( r > 255 ) r = 255;
  else if  (r < 0) r = 0;

  var b = ((num >> 8) & 0x00FF) + amt;

  if ( b > 255 ) b = 255;
  else if  (b < 0) b = 0;

  var g = (num & 0x0000FF) + amt;

  if ( g > 255 ) g = 255;
  else if  ( g < 0 ) g = 0;

  return ('#') + (g | (b << 8) | (r << 16)).toString(16);
}

theme.horizontalScroller = function(selector, config)
{
  const _this = this;
  const elem = document.querySelector(selector);
  config = config || {};
  
  if( !elem )
  {
    return false;
  }
  
  if( !config.enableNav && !elem.classList.contains('horizontal-scroller') )
  {
    elem.classList.add('horizontal-scroller');
  }
  
	const parent = elem.parentNode;  
  
  this.elem = elem;
  this.isScrolling = false;
  this.scrollTimes = 0;
  this.lastPosition = 0;
  this.scrollByAmount = 0;
  
  let direction = null;
  
  this.isScrollable = function()
  {
    return elem.scrollWidth > elem.clientWidth;
  }
  
  parent.classList.add('horizontal-scroller-start');
  
	function clearDirection(){ direction = null; console.log('****************** CLEARED DIRECTION ******************'); }
    
  let directionTimeout = setTimeout(clearDirection, 1000);
  
  this.throttleTimer = function()
  {
    setTimeout( function() { this.isScrolling = false; console.log('throttle'); }.bind(this), 30);
  }

  this.scrollHandler = function(e)
  {
    // if( Math.abs(elem.scrollLeft) === elem.scrollWidth - elem.clientWidth )
    // {
    //   parent.classList.add('horizontal-scroller-end');
    // }
    // else if( elem.scrollLeft === 0 )
    // {
    //   parent.classList.add('horizontal-scroller-start');
    // }
    // else
    // {
    //   parent.classList.remove('horizontal-scroller-start');
    //   parent.classList.remove('horizontal-scroller-end');
    // }
    _this.revalidate();
  };
  
  this.wheelHandler = function(e)
  {
    // theme.log('dY: '+ e.deltaY);
    // theme.log('dX: '+ e.deltaX);
    //e.preventDefault();
    
    //if( (e.deltaX !== 0 && e.deltaY === 0) || this.isScrolling)
    if( !this.isScrollable() )
    {
      return;
    }
    
    if( this.isScrolling)
    {
      e.preventDefault();
      return;
    }
    
    function preventDefault()
    {
      console.log('PreventDefault');
      e.preventDefault();
    }
    
    if( !direction || direction === 'y' )
    {
      preventDefault();
    }
    
    this.scrollTimes = Math.min(1.5, Math.max(1, this.scrollTimes+0.25));
    
    if( elem.scrollLeft === this.lastScrollLeft )
    {
      this.scrollTimes = 1;
    }
    
    //theme.log('this.scrollTimes: '+this.scrollTimes);
    
    let frames = 0;
    
    clearTimeout(directionTimeout);
    directionTimeout = setTimeout(clearDirection, 100);
    
    let interval = setInterval( function()
 		{
      let deltaPos;
     
      if( !direction )
      {
        if( Math.abs(e.deltaX) > Math.abs(e.deltaY) )
        {
          //console.log("dX > dY: "+e.deltaX+ " / "+e.deltaY);
          //deltaPos = e.deltaX;


          direction = 'x';
          //clearInterval(interval);
          return;

        }
        else
        {
        //deltaPos = e.deltaY;

        direction = 'y';

        }
      }
      
      e.preventDefault();
      
      deltaPos = direction === 'x' ? e.deltaX : e.deltaY;
      
      if( deltaPos === 0 )
      {
        console.log('not moving');
        // Not moving?
        clearInterval(interval);
        return;
      }
      
      console.log(direction);
      
      //this.scrollByAmount = Math.max(1, Math.min(5, Math.abs(e.deltaY))) * this.scrollTimes;
      this.scrollByAmount = Math.max(1, Math.min(5, Math.abs(deltaPos))) * this.scrollTimes;
      
      //elem.scrollLeft = e.deltaY < 0 ? (elem.scrollLeft - this.scrollByAmount) : (elem.scrollLeft + this.scrollByAmount);
      elem.scrollLeft = deltaPos < 0 ? (elem.scrollLeft - this.scrollByAmount) : (elem.scrollLeft + this.scrollByAmount);
      
      let maxFrames = 20;
      maxFrames = Math.max(5, Math.min(20, (this.scrollByAmount * 4)));
      
      //console.log(this.scrollByAmount + ' / ' + maxFrames );
      
      frames++;
      
      if( frames >= maxFrames )
      {
        this.lastScrollLeft = elem.scrollLeft;
        clearInterval(interval);
        return;
      }
      
    }.bind(this), 5);
    
    this.isScrolling = true;
    this.throttleTimer();
  };
  
  this.revalidate = function()
  {
    theme.log('horizontalScroller.revalidate() '+selector);
    
    if( _this.isScrollable() )
  	{
      parent.classList.add('is-scrollable');
      parent.classList.remove('not-scrollable');
      
      if( Math.abs(elem.scrollLeft) === elem.scrollWidth - elem.clientWidth )
      {
        theme.log('scroller = end');
        parent.classList.add('horizontal-scroller-end');
        parent.classList.remove('horizontal-scroller-start');
      }
      else if( elem.scrollLeft === 0 )
      {
        theme.log('scroller = start');
        parent.classList.add('horizontal-scroller-start');
        parent.classList.remove('horizontal-scroller-end');
      }
      else
      {
        theme.log('scroller = in betwen?');
        parent.classList.remove('horizontal-scroller-start');
        parent.classList.remove('horizontal-scroller-end');
      }
    }
    else
    {
      parent.classList.remove('is-scrollable');
      parent.classList.add('not-scrollable');
      
      parent.classList.remove('horizontal-scroller-start');
      parent.classList.remove('horizontal-scroller-end');
    }
  };

  if( config.observer )
  {
    var observer = new MutationObserver(function(mutations, observer)
    {
      _this.revalidate();
    });

    observer.observe(this.elem, {
      childList: true
    });
  }
  
  function enableNav()
  {
    const moveAmount = Math.round(elem.clientWidth / 2);
    
    let leftElem, rightElem;
    
    if( !config.navigation )
    {
			leftElem = document.createElement('i');
    	leftElem.classList.add('icon-angle-left', 'horizontal-scroll-icon', 'horizontal-scroll-icon-left');
      
    	rightElem = document.createElement('i');
    	rightElem.classList.add('icon-angle-right', 'horizontal-scroll-icon', 'horizontal-scroll-icon-right');
      
      elem.parentNode.appendChild(leftElem);
    	elem.parentNode.appendChild(rightElem);
    }
    else
    {
      leftElem = $qs(config.navigation.left);
      rightElem = $qs(config.navigation.right);
    }
    
    leftElem.addEventListener('click', function()
    {
      elem.style.scrollBehavior = "smooth";
      elem.scrollLeft -= moveAmount;
      elem.style.scrollBehavior = "auto";
    });
    
    rightElem.addEventListener('click', function()
    {
      elem.style.scrollBehavior = "smooth";
      elem.scrollLeft += moveAmount;
      elem.style.scrollBehavior = "auto";
    });
   
    elem.classList.add('horizontal-scroller-with-nav');
  }
  
  elem.addEventListener("wheel", this.wheelHandler.bind(this));
  
  // if( config.enableNav === true && elem.scrollWidth > elem.clientWidth ) // && window.innerWidth > 767 )
  // {
  //   enableNav();
  //   elem.addEventListener("scroll", this.scrollHandler.bind(this));
  // }
  
  if( config.enableNav === true ) // && window.innerWidth > 767 )
  {
    enableNav();
  }
  
  elem.addEventListener("scroll", this.scrollHandler.bind(this));

  let checkResize;
  
  window.addEventListener('resize', function()
	{
    clearTimeout(checkResize);
    checkResize = setTimeout(_this.revalidate, 250);
  });
  
  this.revalidate();
  
  if( true )
  {
    let pos = { top: 0, left: 0, x: 0, y: 0 };

    const mouseMoveHandler = function (e) {
      console.log('MM!');

      // How far the mouse has been moved
      const dx = e.clientX - pos.x;
      const dy = e.clientY - pos.y;

      console.log(dx);
      
      if( Math.abs(dx) > 2 )
      {
        elem.classList.add('horizontal-scroller-is-dragging');
      }

      // Scroll the element
      elem.scrollTop = pos.top - dy;
      elem.scrollLeft = pos.left - dx;
    };
    
    const mouseUpHandler = function () {
      console.log('MU!');
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);

        elem.style.cursor = 'grab';
        elem.style.removeProperty('user-select');
      
      elem.classList.remove('horizontal-scroller-is-dragging');
    };
    
    const mouseDownHandler = function (e) {
      console.log('MD!');
      elem.style.cursor = 'grabbing';
      elem.style.userSelect = 'none';
        pos = {
            // The current scroll
            left: elem.scrollLeft,
            top: elem.scrollTop,
            // Get the current mouse position
            x: e.clientX,
            y: e.clientY,
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };
    
    elem.addEventListener('mousedown', mouseDownHandler);
  }
}

theme.hooks = {};

theme.events = {
  fire: function(eventName, detail)
  {
    detail = detail || null;
    
    if( false ) //isIE?
    {
      this[eventName] = document.createEvent(eventName);
      this[eventName].initCustomEvent(eventName, false, false, {
        detail: detail
      });
    }
    else
    {
      this[eventName] = new CustomEvent(eventName, {
        detail: detail
      });
    }

    theme.logGroup('Dispatching customEvent '+eventName+' with detail:', true);
    theme.log(detail);
    theme.logGroupEnd();
    window.dispatchEvent(this[eventName]);
  },
  handlers: {
    onThemeCollectionChanged: function(e)
    {
      console.log('theme.events.handlers.onThemeCollectionChanged()');
      theme.events.handlers.onProductGridChanged(e);
      
      if( typeof parseCountdownProducts !== 'undefined' )
      {
        parseCountdownProducts();
      }
      
      // if( typeof initPriceSlider !== 'undefined' )
      // {
      //   initPriceSlider();
      // }
      
      theme.helpers.initPriceSlider();
    },
    onProductGridChanged: function(e)
    {
      console.log('theme.events.handlers.onProductGridChanged()');
      theme.lazyLoad();
      theme.productHandler.intersectProductBlocks();
    }
  },
  init: function()
  {
    window.addEventListener('themeCollectionChanged', theme.events.handlers.onThemeCollectionChanged);
    window.addEventListener('themeProductGridChanged', theme.events.handlers.onProductGridChanged);
  }
}

//=============================================
// Message parser
//=============================================
theme.message = function(message)
{
  // Default values
  this.type = 'info';
  this.icon = 'icon-check';
  this.classes = ''; //msg classes from gui
  
  this.msgIndex = Math.floor((Math.random() * 1000) + 1);
  
  this.messageHtml = message || '';
}

theme.message.prototype.append = function()
{
  if( !this.messageHtml )
  {
    console.log('* Calling theme.message.render() but no message HTML found *');
    return;
  }
  
  var element = $('<div class="theme-message message-'+this.type+'" style="opacity:0; right:-500px;">\
    <i class="icon-x-l fz-090 theme-message-close"></i>\
    <i class="theme-message-icon '+this.icon+'"></i>\
    <div class="content">\
      <ul class="'+this.type+'">\
          <li>'+this.messageHtml+'</li>\
      </ul>\
    </div>\
  </div>');
  
  $('#theme-messages').prepend(element);
  
  element.animate({'right':'0px', 'opacity': 1}, 300);
  
  setTimeout( function()
  {
    element.animate({'right':'-500px', 'opacity': 0}, 300, function()
    {
      element.remove();
    });
  }, 6000);

  $('#theme-messages .theme-message:not(:first-child)').animate({'right':'-500px', 'opacity': 0}, 300, function()
  {
    $(this).remove();
  });
};

theme.message.prototype.wasAddedToCart = function()
{
  return this.messageText.includes( theme.text.cart.toLowerCase() ) || this.classes.includes('success');
}

theme.message.prototype.fromHtml = function(html)
{
  let messageHolder = $(html).find('[class*="messages"] ul');
  
  if( messageHolder.length )
  {
    this.messageHtml = messageHolder.first('li').html();
    this.messageText = messageHolder.first('li').text();
    
    // To string instead of array so we can compare loosely (e.g. 'success' also includes gui-success).
    let classes = messageHolder[0].classList.toString();
    this.classes = classes;

    if( classes.includes('error') )
    {
      this.type = 'error';
      this.icon = 'icon-x';
    }
    else if( this.messageText.includes( theme.text.cart.toLowerCase() ) || classes.includes('success'))
    {
      this.type = 'success';
      this.icon = 'icon-check';
    }
    else
    {
      this.type = 'info';
      this.icon = 'icon-question-l';
    }
  }
}

//=============================================
// Quickshop parser
//=============================================
theme.quickshop =
{
  swiper: null,
  
	hydrate: function(product)
  {
    $('#quickshop-modal .stock').html( theme.productHandler.parseStockStatus( theme.productHandler.getStockStatus(product.stock)) );
      
    var description = product.description;
    $('#qs-title').html(product.title);
    if (description.indexOf('[capacity]') != -1) {
      description = description.split('[description]')[1];
    }
    $('#quickshop-modal .description').append('<p>'+description+'</p>');
    
    if( product.brand != false && theme.settings.show_product_brands )
    {
      $('#quickshop-modal .brand').html(product.brand.title);
    }
    
    $('#qs-view-product').attr('href', theme.url.gotoProduct+product.id);
    $('#qs-view-product').html(theme.text.view+' <i class="icon-arrow-right valign-middle ml-1"></i>');
    
    if( product.custom )
    {
      $('#qs-view-product').html(theme.text.customizeProduct+' <i class="icon-arrow-right"></i>');
    }

    if( product.price.price_old > 0 )
    {
      $('#qs-price-holder').append('<span class="price-old margin-right-10">'+theme.helpers.parsePrice(product.price.price_old)+'</span>');
    }
    $('#qs-price-holder').append('<span class="price price-incl">'+theme.helpers.parsePrice(product.price.price_incl)+'</span>');
    $('#qs-price-holder').append('<span class="price price-excl">'+theme.helpers.parsePrice(product.price.price_excl)+'</span>');
    $('#qs-price-holder').append(' <span class="price-strict">'+theme.text.tax+'</span>');
    
    // Selecteer de inhoud van het element en voeg deze toe aan een variabele
      var priceHolderContent = $('#qs-price-holder').text();
    // Selecteer alle elementen met de klassen "price-incl" en "price-excl" binnen #qs-price-holder
      var priceElements = $('#qs-price-holder .price-incl, #qs-price-holder .price-excl, #qs-price-holder .price-old');

    // Loop door de geselecteerde elementen en vervang eurotekens door een spatie
      priceElements.each(function() {
          var newText = $(this).text().replace(/€/g, ' ');
          $(this).text(newText);
      });



    $('#qs-form').attr('action', theme.url.addToCart+product.vid+'/');

    theme.log('Product data:');
    theme.log(product);

    if( product.variants )
    {
      $('#qs-variants').append('<select id="qs-variant-select" class="quick-variants fancy-select" name="variant"></select>');

      var skus = [];
      for( var vid in product.variants )
      {
        var variant = product.variants[vid]
        var sku = variant.sku;
        if (variant.sku) {
          skus.push(variant.sku);
        }
        var selected = (product.vid == vid) ? ' selected' : '';
        let availAble = theme.productHandler.getStockStatus(variant.stock);
        
        
        
				var metadata = {
            id: product.id,
            vid: variant.id,
            variant: ((variant.title.toLowerCase()) == "default" ? '' : variant.title),
            title: product.title,
            price: variant.price,
          	image: getProductImage(product.image, '25x325x2'),
        };
        console.log(metadata);
        
        $('#qs-variant-select').append('<option value="'+variant.id+'" data-stock=\''+JSON.stringify(variant.stock)+'\' data-sku="'+sku+'" data-price-incl="'+variant.price.price_incl+'" data-price-excl="'+variant.price.price_excl+'"'+selected+' data-metadata=\''+JSON.stringify(metadata)+'\'>'+variant.title+' - '+theme.helpers.parsePrice(variant.price.price)+' ('+(theme.shop.b2b || (theme.settings.b2b_enabled && theme.settings.b2b_default_pricing == 'excl') ? theme.text.exclVAT : theme.text.inclVAT)+')'+(!variant.stock.available ? ' - ' + theme.text.outOfStock : '')+'</option>');
        
      }

      $('#qs-variant-select').off().on('change', function()
      {
        $(this).find('qs-dot').remove();
        let selected = $(this).find('option:selected');
        var dot = selected.find('.qs-dot').addClass('selected');
        $('#qs-variants').find('.qs-dot.selected').remove();
        $('#qs-variants').append(dot);
        
        $('#qs-form').attr('action', theme.url.addToCart + selected.val()+'/');
        $('#quickshop-modal .price-incl').html(theme.helpers.parsePrice(selected.attr('data-price-incl')));
        $('#quickshop-modal .price-excl').html(theme.helpers.parsePrice(selected.attr('data-price-excl')));
        
        $('#quickshop-modal .stock').html( theme.productHandler.parseStockStatus( theme.productHandler.getStockStatus(JSON.parse(selected.attr('data-stock'))) ) );
        
        var metadata = selected.attr('data-metadata');
        $('#quickshop-modal .trigger-add-to-cart').attr('data-metadata', metadata);
        
      });
      console.log('1');
      quickvieuwColours(skus);
      // collectionVariantColors(skus);
    }

    this.swiper = new Swiper('#swiper-quickimage',
    {
      navigation: {
      nextEl: '#qs-swiper-next',
      prevEl: '#qs-swiper-prev'
      },
      updateOnImagesReady: true,
      spaceBetween:0,
    });
    
    for( var i = 0; i < product.images.length; i++)
    {
      this.swiper.appendSlide('<div class="swiper-slide zoom"><img src="'+getProductImage(product.images[i], '400x460x2')+'" class="img-responsive"></div>');
    }
    
    this.swiper.update();
    
    theme.events.fire('themeQuickshopHydrated', {
      product: product,
    });
  },
  
  show: function()
  {
    $('body').addClass('modal-active');
    $('#quickshop-holder').addClass('modal-active');
    
    theme.events.fire('themeQuickshopHydrated');
  },
  
  close: function()
  {
    $('#quickshop-holder').removeClass('modal-active');
    $('body').removeClass('modal-active');
    
    theme.events.fire('themeQuickshopClosed');
    
    setTimeout(function()
    {
      theme.quickshop.clear();
      theme.events.fire('themeQuickshopCleared');
    }, 300);
  },
  
  clear: function()
  {
    if( this.swiper )
    {
      this.swiper.destroy();
      this.swiper = null;
    }

    $('#quickshop-modal .swiper-wrapper').html('');
    $('#quickshop-modal .brand').html('');
    $('#qs-title').html('');
    $('#qs-variants').html('');
    $('#quickshop-modal .description').html('');
    $('#quickshop-modal .stock').html('');
    $('#qs-price-holder').html(''); 
  }
};

//=============================================
// Products
//=============================================
theme.productHandler =
{
  storage: [],
  
  getJsonData: function(jsonUrl, elem)
  {
    $.get(jsonUrl).done( function(data)
		{
      theme.log(' - retrieved pid '+data.product.id);
      theme.productHandler.storeData( data.product )
      theme.productHandler.hydrateElements(elem, data.product);
      
      theme.events.fire('themeProductBlockLoaded', {
        product: data.product,
        element: elem
      });
    });
  },
  
  getStockStatus: function(stockData)
  {
    if( !stockData.track || (stockData.available && stockData.on_stock) )
    {
      return 'in-stock';
    }
    
    if( stockData.available && !stockData.on_stock )
    {
      return 'backorder';
    }

      return 'out-of-stock';
  },
  
  generateStockText: function(status, withIcon, disableMarkup)
  {
    let text;
    let icon;
    
    switch(status)
    {
      case 'out-of-stock':
        icon = '<i class="icon-x"></i> ';
        text = theme.text.outOfStock;
        break;
      case 'backorder':
        icon = '<i class="icon-check-b"></i> ';
        text = theme.text.backorder;
        break;
      default:
        icon = '<i class="icon-check-b"></i> ';
        text = theme.text.inStock;
        break;
    }
    
    if( !withIcon )
      icon = '';
    
    if( disableMarkup )
      return icon+text;
    
    return '<div class="'+status+'">'+icon+''+text+'</div>';
  },
  
  parseStockStatus: function(status, textOnly)
  {
    let text;
    let icon;
    
    switch(status)
    {
      case 'out-of-stock':
        icon = '<i class="icon-x"></i>';
        text = theme.text.outOfStock;
        break;
      case 'backorder':
        icon = '<i class="icon-check-b"></i>';
        text = theme.text.backorder;
        break;
      default:
        icon = '<i class="icon-check-b"></i>';
        text = theme.text.inStock;
        break;
    }
    
    if( textOnly )
      return text;
    
    return '<div class="'+status+'">'+icon+' '+text+'</div>';
  },
  
  storeData: function(product)
  {
    return this.storage[ product.id ] = product;
  },
  
  getDataPromise: function(jsonUrl, pid)
  {
    theme.log('* Fired getDataPromise for '+jsonUrl+' *')
    let productData = this.getData(pid);
    
		return new Promise( function(resolve, reject)
		{
      if( productData )
      {
        theme.log(' - Already available for pid '+pid);
        resolve( productData );
        return;
      }
      
    	$.get(jsonUrl).done( function(data)
      {
        theme.log(' - Resolved by AJAX '+pid);
        resolve( data.product );
      })
      .fail( function()
      {
        theme.log(' - Failed AJAX resolve '+pid);
        reject('Failed AJAX retrieval for '+pid);
      });
    });
  },
  
  getData: function(pid)
  {
    return this.storage[pid] || false;
  },
  
  hydrateElements: function(elem, product)
  {
    let element = $(elem);
    let stock = '';
    let deliveryTime = product.stock.delivery ? product.stock.delivery.title : false;
    let stockStatus = this.getStockStatus(product.stock);
    const cardType = elem.classList.contains('product-list') ? 'list' : 'grid';
    const isProductAsABundle = product.bundles && getDataFeature('bundle', product.data_01);
    
    theme.logGroup('hydrateElements() for '+product.title, true);
    theme.log(elem);
    //--------------------------------------------------
    // Check if any variant is in stock
    //--------------------------------------------------
    if( isProductAsABundle )
    {
      stockStatus = (product.bundles[0].stock.available) ? 'in-stock' : 'out-of-stock';
      stock = this.generateStockText( stockStatus );
    }
    else if( product.variants != false )
    {
      for(let vid in product.variants)
      {
        let variant = product.variants[vid];
        
        stock = this.generateStockText( this.getStockStatus(variant.stock) );
        deliveryTime = variant.stock.delivery ? variant.stock.delivery.title : false;
        
        // If any is in stock, mark as in stock and bail
        if( stock.includes(theme.text.inStock) )
        {
          stockStatus = this.getStockStatus(variant.stock)
          break;
        }
      }
    }
    else if( product.variants == false || stock == '' )
    {
      // console.log('no variants or use default stock');
    	stock = this.generateStockText( stockStatus );
    }
    
    theme.log('stockStatus: '+stockStatus);
    
    const quickOrderElem = elem.querySelector('.quick-order');
    if( quickOrderElem )
    {
      quickOrderElem.setAttribute('data-stock', stockStatus); 

      if( !product.variants )
        quickOrderElem.setAttribute('data-is-single-product', true); 

      if( stockStatus === 'out-of-stock' )
        quickOrderElem.innerHTML = '';
    }
    
    element.find('.product-col-stock').html(stock).addClass('loaded');
    
    let hideDeliveryTime = ( (stockStatus === 'out-of-stock' && theme.settings.product_hide_delivery_outofstock) );
    
    // Set delivery text if applicable
    if( theme.settings.show_delivery_time == 'custom' || (theme.settings.show_delivery_time == 'custom_if_stock' && stockStatus === 'in-stock') || (theme.settings.show_delivery_time == 'custom_if_stock_condition' && deliveryTime && stockStatus === 'in-stock') )
    {
      //if( (theme.settings.show_delivery_time == 'custom_if_stock' && stockStatus === 'in-stock') )
      if( cardType === 'grid' && stockStatus !== 'in-stock' )
      {
        element.find('.product-col-delivery').html(stock).addClass('loaded').addClass(stockStatus);
      }
      else
      {
        element.find('.product-col-delivery').html(theme.settings.delivery_time_text).addClass('loaded').addClass(stockStatus);
      }
    }
    else if( deliveryTime )
    {
      let stockSplit = stock.split('[SPLIT]');
      let deliveryTimeSplit = deliveryTime.split('[SPLIT]');
      // element.find('.product-col-delivery').html( (hideDeliveryTime ? stock : deliveryTime) ).addClass('loaded').addClass(stockStatus);
    	element.find('.product-col-delivery').html( (hideDeliveryTime ? stockSplit[0] : deliveryTimeSplit[0]) ).addClass('loaded').addClass(stockStatus);
    }
    
    if( product.images[1] && theme.settings.grid_second_image_hover && window.innerWidth > 767 )
    {
      let src = getProductImage(product.images[1], theme.images.imageSize)
      
      let img = new Image();
      img.fetchPriority = 'low'; //experimental browser feature
      img.src = src;
      img.classList.add('product-grid-img');
      img.classList.add('product-grid-hover-img');
      
      let imgHolder = element.find('.product-grid-img-holder');
      theme.log(imgHolder);
      
      imgHolder.append(img);
    }
    
    theme.logGroupEnd();
  },
  
  intersectProductBlocks: function()
  // HIER
  {
    let productBlockObserver = new IntersectionObserver(function(entries, observer)
    {
      entries.forEach(function(entry)
      {
        if (entry.isIntersecting)
        {
          let productBlock = entry.target;
          
          // console.log(' START getJsonData ');
          theme.productHandler.getJsonData(productBlock.getAttribute('data-json'), productBlock);
          // console.log(' END getJsoNData ');
          
          productBlock.classList.remove('product-intersect-json');
          productBlockObserver.unobserve(productBlock);
        }
      });
    });

    document.querySelectorAll('.product-intersect-json').forEach(function(productBlockElem)
    {
      productBlockObserver.observe(productBlockElem);
    });
    
    $('#collection .product-col').each(function(){
      var cur = $(this);
      var prodUrl = $(this).attr('data-prod-url');
      var skus = []
      if(!cur.hasClass('loaded')){
        $.get(shopUrl + prodUrl + '?format=json', function(data){
          // console.log(data);
          var product = data.product;
          const {variants} = product;


          const variantsArray = Object.values(variants);

          variantsArray.forEach(variant => {
            if (!skus.includes(variant.sku)) {
              skus.push(variant.sku);
            }
          })
          console.log('2');

          collectionVariantColors(skus, cur);
          // if(skus.length > 1 && !cur.find('.color-circles').hasClass('counter-active')){
          //   cur.find('.color-circles').append('<div class="collection-dot-counter">+'+ skus.length +'</div>');
          // }
        }).done(function(){
          cur.find('.color-circles').addClass('counter-active');
          cur.addClass('loaded');
        });
      }
    });
  }
};

theme.dynamicProducts = function(elem)
{
  const url = elem.getAttribute('data-products-url');
  const dynamicProduct = this;
  
  // Callbacks
  this.onComplete = null;
  this.onSuccess = null;
  this.onError = null;
  
  function dispatchOnComplete()
  {
      if( this.onComplete)
      {
         this.onComplete();
      }
  }
  
  this.showError = function( error)
  {
    const onErrorMessage = elem.getAttribute('data-on-error');
    const originalHeight = elem.clientHeight;

    const message = onErrorMessage || '<h5 class="c-non-success mb-1 fz-100">'+error+'</h5> <div>'+url.substring(0, url.indexOf('?'))+'</div>';

    elem.outerHTML = '<div class="c-non-success p-3 gray-border mt-2" style="word-break: break-word;">'+message+'</div>';
  };
  
  this.hydrateElement = function(html)
  {
    elem.innerHTML = html;
    elem.classList.remove('col-loading'); //remove styling

    const onCompleteEvent = elem.getAttribute('data-event-complete');
    
    if( onCompleteEvent )
    {
    	theme.events.fire(onCompleteEvent);
    }

    if( this.onComplete )
    {
      theme.log('dynamicProduct.onComplete() for '+url);
    	this.onComplete();
    }
    else if( this.onSuccess )
    {
      theme.log('dynamicProduct.onSuccess() for '+url);
    	this.onSuccess();
    }
  };
  
	this.run = function()
  {
    theme.log('run theme.dynamicProducts.run() for: '+url);
    theme.log(elem);
    
    if( !url )
    {
      theme.log('No url found, no dynamic products, just consider complete and bail');
      
      if( this.onComplete)
      {
         this.onComplete();
      }
      
      return;
    }
    
    if( elem.classList.contains('dy-needs-addons') && (!window.dyapps || (window.dyapps && !window.dyapps.addons)) )
    {
        elem.outerHTML = '<div class="c-non-success p-2 gray-border mt-2" style="word-break: break-word;"><h5 class="c-non-success">Missing DyApps Theme Addons plugin</h5></div></div>';
        return;
    }
    
    if( 'fetch' in window )
    {
			// Stupid ajax and session messing when calling any html page
    	// Use fetch instead and omit credentials (all cookies), so LS cannot alter our session
    	// Mainly for breadcrumbs but also for templatebar
      fetch(url, { credentials: 'omit' }).then(function (response)
			{
        if( !response.ok )
        {
          throw new Error('Could not load products ('+response.status+')');
        }
        
        return response.text();
      }).then(function (html) {
        // This is the JSON from our response
        console.log('Got response text, now hydrating');
        
        dynamicProduct.hydrateElement(html);
      }).catch(function (message) {
        // There was an error
        console.log('fetch exception:');
        console.log(message);
        
        dynamicProduct.showError(message);
        
        if( this.onComplete )
        {
          theme.log('dynamicProduct.onComplete() (error!) for '+url);
          this.onComplete();
        }
        else if( this.onError )
        {
          theme.log('dynamicProduct.onError() for '+url);
          this.onError();
        }
      });
    }
    else
    {
      if( typeof _t_p === 'function' )
      {
          console.log(".dynamic-products not loaded because template bar is active");
          elem.outerHTML = '<div class="c-non-success p-2 gray-border mt-2"><h5 class="c-non-success">Dynamic-products not loaded because template bar is active</h5></div></div>';
          return;
      }
      
      $.get( url, function(data)
      {
        dynamicProduct.hydrateElement(data);
      }).fail( function()
      {
        dynamicProduct.showError('Could not load products')
      }); 
    }
  };
}

// theme.dynamicProducts = {
//   showError: function(elem, error, url)
//   {
//     const onErrorMessage = elem.getAttribute('data-on-error');
//     const originalHeight = elem.clientHeight;

//     const message = onErrorMessage || '<h5 class="c-non-success mb-1 fz-100">'+error+'</h5> <div>'+url.substring(0, url.indexOf('?'))+'</div>';

//     elem.outerHTML = '<div class="c-non-success p-3 gray-border mt-2" style="word-break: break-word;">'+message+'</div>';
//   },
//   hydrateElement: function(elem, html)
//   {
//       elem.innerHTML = html;
//       elem.classList.remove('col-loading'); //remove styling
      
//       const onCompleteEvent = elem.getAttribute('data-event-complete');
      
//       if( onCompleteEvent )
//       {
//         theme.events.fire(onCompleteEvent);
//       }
//   },
//   parseElement: function(elem)
//   {
//     const url = elem.getAttribute('data-products-url');
    
//     theme.log('theme.dynamicProducts.parseElement() for: '+url);
//     theme.log(elem);
    
//     if( elem.classList.contains('dy-needs-addons') && (!window.dyApps || (window.dyApps && !window.dyApps.addons)) )
//     {
//         elem.outerHTML = '<div class="c-non-success p-2 gray-border mt-2" style="word-break: break-word;"><h5 class="c-non-success">Missing DyApps Theme Addons plugin</h5></div></div>';
//         return;
//     }
    
//     if( 'fetch' in window )
//     {
// 			// Stupid ajax and session messing when calling any html page
//     	// Use fetch instead and omit credentials (all cookies), so LS cannot alter our session
//     	// Mainly for breadcrumbs but also for templatebar
//       fetch(url, { credentials: 'omit' }).then(function (response) {
//         console.log(response);
        
//         if( !response.ok )
//         {
//           throw new Error('Could not load products ('+response.status+')');
//         }
        
//         return response.text();
//       }).then(function (html) {
//         // This is the JSON from our response
//         console.log('Got response text, now hydrating');
        
//         theme.dynamicProducts.hydrateElement(elem, html);
//       }).catch(function (message) {
//         // There was an error
//         console.log('fetch exception:');
//         console.log(message);
        
//         theme.dynamicProducts.showError(elem, message, url);
//       });
//     }
//     else
//     {
//       if( typeof _t_p === 'function' )
//       {
//           console.log(".dynamic-products not loaded because template bar is active");
//           elem.outerHTML = '<div class="c-non-success p-2 gray-border mt-2"><h5 class="c-non-success">Dynamic-products not loaded because template bar is active</h5></div></div>';
//           return;
//       }
      
//       $.get( url, function(data)
//       {
//         theme.dynamicProducts.hydrateElement(elem, data);
//       }).fail( function()
//       {
//         theme.dynamicProducts.showError(elem, 'Could not load products', url)
//       }); 
//     }
//   },
//   init: function()
//   {
//     const observer = new IntersectionObserver(function(entries)
//     {
//       entries.forEach( function(entry)
//       {
//         if (entry.isIntersecting)
//         {
//           theme.dynamicProducts.parseElement(entry.target);
//           observer.unobserve(entry.target);
//         }
//       });
//     }, {
//       rootMargin: '150px'
//     });
    
//     $qsa('.dynamic-products').forEach( function(elem)
//     {
//       observer.observe(elem);
//     }); 
//   }
// };

theme.cartHandler = {
  getData: function(jsonUrl, elem)
  {
    console.log(elem);
    $.get(jsonUrl).done( function(product)
		{
      theme.log(' - retrieved pid '+product.id);
      theme.cartHandler.hydrateElements(elem, product);
      
//       theme.events.fire('themeProductBlockLoaded', {
//         product: data.product,
//         element: elem
//       });
    });
  },
  hydrateElements: function(elem, product)
  {
    let element = $(elem);
    const qty = parseInt(element.find('.qty-input').val());
    console.log(product);
    
    if( product.price.price_old && !elem.getAttribute('data-has-discount') )
    {
      if( theme.settings.vat_switcher_enabled )
      {
    		element.find('.cart-col-price-base').prepend('<span class="price-old price-incl fz-100r">'+product.price.price_old_incl_money+'</span><span class="price-old price-excl fz-100r">'+product.price.price_old_excl_money+'</span>');
    		element.find('.cart-col-price-total').prepend('<span class="price-old price-incl fz-100r">'+theme.helpers.parsePrice(product.price.price_old_incl * qty)+'</span><span class="price-old price-excl fz-100r">'+theme.helpers.parsePrice(product.price.price_old_excl * qty)+'</span>');
      }
      else
      {
    		element.find('.cart-col-price-base').prepend('<span class="price-old price-incl fz-100r">'+product.price.price_old_money+'</span>');
    		element.find('.cart-col-price-total').prepend('<span class="price-old price-incl fz-100r">'+theme.helpers.parsePrice(product.price.price_old * qty)+'</span>');
      }
    }
  },
  intersectProducts: function()
  {
    var cartItems = $qsa(".cart-item");

    let cartItemObserver = new IntersectionObserver(function(entries, observer)
    {
      entries.forEach(function(entry)
      {
        if (entry.isIntersecting && entry.target.getAttribute('data-json'))
        {
          let cartItem = entry.target;
          
          theme.cartHandler.getData(cartItem.getAttribute('data-json'), cartItem);
          
          // productBlock.classList.remove('product-preload');
          cartItemObserver.unobserve(cartItem);
        }
      });
    });

    cartItems.forEach(function(cartItem)
    {
      cartItemObserver.observe(cartItem);
    });
  },
};

theme.cartHandler.intersectProducts();

//=============================================
// Lazyload
//=============================================
theme.lazyLoad = function()
{
    let lazyImageObserver = new IntersectionObserver(function(lazyImageEntries, observer)
    {
      lazyImageEntries.forEach(function(entry)
      {
        if (entry.isIntersecting)
        {
          let element = entry.target;
          let src = element.getAttribute('data-src');
          
          theme.log('lazy intersecting #'+element.id+' ('+src+')');

          // Is img or div?
          if( element instanceof HTMLImageElement )
          {
            if( element.classList.contains('product-grid-img') )
            {
              element.addEventListener('load', function()
              {
                element.classList.remove('lazy');
              });
              
              element.src = src;
            }
            else
            {
              element.src = src;
              element.classList.remove('lazy')
            }
          }
          else if(element instanceof HTMLSourceElement)
          {
            element.srcset = element.getAttribute('data-srcset');
            element.classList.remove('lazy');
            theme.log('Lazy SRCSET: '+src+ ' @ '+ Date.now() + ' / ' + performance.now() );
          }

          lazyImageObserver.unobserve(element);
        }
      });
    },
		{
			rootMargin: '100px'
		});
  
    $qsa('.lazy').forEach( function(lazyImageElement)
		{
			lazyImageObserver.observe(lazyImageElement);
    });
}

  theme.headerScroll = {
    isScrolling: false,
    lastScroll: 0,
    isSticky: false,
    lastScrollDirection: false,
    scheduledAnimationFrame: false,
    elems: {
      headerHolder: $('#header-holder'),
      header: $('#header-holder')
    },
    checkFrame: function()
    {
      let currentScroll = window.pageYOffset;
      
      // theme.log('headerscroll/checkframe() '+currentScroll+ ' / '+theme.headerScroll.lastScroll+'  / ('+theme.headerScroll.isScrolling+')');
      
      if( theme.headerScroll.isScrolling != 'down' && theme.headerScroll.lastScroll <= currentScroll )
      {
        theme.headerScroll.isScrolling = 'down';
        theme.log(' -scroll DOWN');
      }
      else if( theme.headerScroll.isScrolling != 'up' && theme.headerScroll.lastScroll > currentScroll )
      {
      	theme.headerScroll.isScrolling = 'up';
        theme.log(' -scroll UP');
      }
      
      if( currentScroll >= 50 )
      {
        if( !theme.headerScroll.isSticky )
        {
          theme.headerScroll.isSticky = true;
          
          theme.headerScroll.elems.header.addClass('headerscrolled');

          if( theme.settings.navbar_sticky && theme.settings.navigation_mode == 'menubar' && window.innerWidth > 991  )
          {
            $('#header').after($('#navbar-holder').clone().addClass('navscrolled'));
          }
        }
      }
      else
      {
        if( theme.headerScroll.isSticky )
        {
          theme.headerScroll.isSticky = false;
          theme.headerScroll.isScrolling = false;
          
          theme.headerScroll.elems.header.removeClass('headerscrolled');
          $('.navscrolled').remove();
        }
      }
      
      
      
//       if( !theme.headerScroll.isScrolling  )
//       {
//         theme.headerScroll.elems.header.addClass('headerscrolled');

//         if( theme.settings.navbar_sticky === true && theme.settings.navigation_mode == 'menubar' )
//         {
//           $('#header').after($('#navbar').clone().addClass('navscrolled'));
//         }
        
//         if( theme.headerScroll.isScrolling != 'down' && theme.headerScroll.lastScroll <= currentScroll )
//         {
//           theme.headerScroll.isScrolling = 'down';
//         }
//         else if( theme.headerScroll.isScrolling != 'up' )
//         {
//           theme.headerScroll.isScrolling = 'up';
//         }
//       }
//       else if( theme.headerScroll.isScrolling )
//       {
//         console.log('Is scrolling set ('+theme.headerScroll.isScrolling+')');
//         theme.headerScroll.elems.header.removeClass('headerscrolled');
//         $('.navscrolled').remove();

//         theme.headerScroll.isScrolling = false;
//       }
      
      theme.headerScroll.lastScroll = currentScroll;

      theme.headerScroll.scheduledAnimationFrame = false;
    },
    check: function()
    { 
      // Prevent multiple rAF callbacks
      if( theme.headerScroll.scheduledAnimationFrame )
        return;
      
      theme.headerScroll.scheduledAnimationFrame = true;
      
      window.requestAnimationFrame(this.checkFrame);
    }
  }

theme.Throttle = function(name, delay)
{
  const throttle = this;
  const timeout = delay || 300;
  
  this.name = name;
  this.throttled = false;

  this.isThrottled = function()
  {
    return this.throttled;
  };
  
  this.run = function(callback)
  {
    theme.log('Throttle RUN');
    
    throttle.throttled = true;
    
    clearTimeout(this.timer);
    
    this.timer = setTimeout( function()
   	{
      throttle.throttled = false; 
      theme.log('Cleared throttle for '+throttle.name+', running callback');
      
      callback();
      
    }, timeout);
  }
}

theme.liveSearch = new (function ()
{
  const maxResults = 6;
  const searchInput = $id('header-search-input');
  const formElement = $id('header-search');
	const resultElement = $id('search-results');
  let initiated = false;
  
  const throttle = new theme.Throttle('liveSearch');

  function process(q)
  {
    const searchUrl = theme.url.search + q.replace('/', '') + '/page1.html?limit='+maxResults+'&request_type=ajax&request_action=search';

    if (q.length < 3)
  	{
      resultElement.classList.remove('active');
      return;
    }

    if (throttle.isThrottled())
    {
      theme.log('Throttling - LiveSearch!');
      return;
    }

    theme.log('Search keyup: '+q);
    
    formElement.classList.add('active');

    $.get(searchUrl, function (htmlResponse)
    {
      if( htmlResponse )
      {
        resultElement.innerHTML = htmlResponse;

        resultElement.classList.add('active');
      }
    });
  }

  function bindListeners()
  {
    searchInput.addEventListener('keyup', function (e)
    {
      const value = this.value;

      if( e.key === "Escape" )
      {
        return;
      }

      throttle.run(function ()
      {
          process(value)
      });
    });
    
    formElement.addEventListener('keyup', function(e)
    {
      theme.log('theme.liveSearch() - pressed key');
      
      if( e.key === "Escape" || searchInput.value == '' )
      {
        theme.log('Pressed esc todo refactor? Already listening to formElement instead of document');
        theme.liveSearch.clear();
      }
    });
    
    formElement.addEventListener('click', function(e)
    {
      theme.log('theme.liveSearch() - clicked formElement');
      
      if( e.target == formElement )
      {
        theme.log('Clicked on FORM elem (backdrop), not results or search input. Clear!');
        theme.liveSearch.clear(false);
      }
    });
  }

  this.init = function()
  {
    if( !searchInput )
    {
      theme.log('liveSearch::init - no search input element found, bail..');
      return;
    };
    
    searchInput.addEventListener('focus', function (e)
    {
      if( formElement.classList.contains('is-dummy') )
      {
        return;
      }
      
      if( this.value.trim() )
      {
        resultElement.classList.add('active');
        formElement.classList.add('active');
      }
      
      if( !initiated )
      {
        theme.log('liveSearch bind listeners');
        bindListeners();
        initiated = true;
      }
    });
  };
  
  this.clear = function(keepSearchInput)
  {
    formElement.classList.remove('active');
    resultElement.classList.remove('active');
    
    if( keepSearchInput !== false )
    {
      searchInput.value = '';
      resultElement.innerHTML = '';
    }
  };
});

theme.mobileNav = {
  loaded: false,
  holderElem: null,
  parsedNavItems: [],
  activeSubCount: function()
  {
    return document.querySelectorAll('.mobile-sub-active').length;
  },
  parseNavItems: function(mainCategory, level)
  {
    const isRoot = (level === 0 );
    
    // Check for duplicate custom links
    if( !isRoot && mainCategory.type !== 'category' )
    {      
      if( theme.mobileNav.parsedNavItems.includes( mainCategory.url ) )
      {
        return '';
      }
      
    	theme.mobileNav.parsedNavItems.push( mainCategory.url );
    }
    
    const hasSubs = (mainCategory.subs && mainCategory.subs.length);
    const categories = hasSubs ? mainCategory.subs : mainCategory;
    
    let html = '<ul class="mobile-nav-list '+(isRoot ? 'mobile-nav-list-main' : 'mobile-nav-sub')+'" data-level="'+level+'" '+ ( !isRoot ? 'data-parent="'+mainCategory.title+'" data-parent-id="'+mainCategory.id+'"' : '' ) +'>';
    
    if( !isRoot )
    {
      html += '<li class="mobile-nav-sub-title mobile-nav-list-item d-flex mobile-nav-back-item"><div class=""><i class="icon-angle-left fz-080"></i></div><span class="pl-2 bold fz-125">'+mainCategory.title+'</span></li>';
      
      if( mainCategory.image && theme.settings.mobile_nav_sub_header_enabled )
      {
      	html += '<li class="mobile-nav-image"><div class="pos-relative gray-overlay w-100 h-100" style="background-image:url('+mainCategory.image+');"></div></li>';
      }
      
      html += '<li class="mobile-nav-list-item mobile-nav-list-type-'+mainCategory.type+'" data-id="'+mainCategory.id+'">';
      html +=   '<a href="'+mainCategory.url+'" class="flex-grow-1 fz-110 '+(mainCategory.active === true ? 'bold' : '')+'">'+theme.text.viewAll+' <i class="icon-angle-right fz-080 mobile-nav-arrow"></i></a>';
      html += '</li>';
    }
    
    categories.forEach( function(category)
    {
    	html += '<li class="mobile-nav-list-item mobile-nav-list-type-'+category.type+'" data-id="'+category.id+'">';
      
      if( isRoot && category.type == 'category' && theme.settings.mobile_nav_main_images_enabled )
      {
        html += '<img src="'+(category.thumb ? category.thumb : theme.images.placeholderSquare)+'" class="mobile-nav-list-root-img mr-2 br-2" width="30" height="30">';
      }
      
      html +=   '<a href="'+category.url+'" class="flex-grow-1 fz-110 '+(category.active === true ? 'bold' : '')+'" '+(category.subs.length && theme.settings.mobile_nav_click_toggle_sub_enabled ? 'data-toggle-sub="'+category.id+'"' : '')+'>';
      html +=     category.title;
      html +=   '</a>';
      
      if( category.subs.length )
      {
        html +=   theme.mobileNav.parseNavItems(category, (level+1));
        html += '<i class="icon-angle-right fz-080 mobile-nav-arrow" '+(category.subs.length ? 'data-toggle-sub="'+category.id+'"' : '')+'></i>';
      }
      
      html += '</li>';
    });
    
    html += '</ul>';
    
    return html;
  },
  init: function() // todo split into bind Listeners and separate functions
  {
    $('#mobilenav').click(function (e)
    {
      let touchStartX = 0; // Keep track of swiping back in subnav
      
      if( theme.mobileNav.loaded )
      {
        return;
      }

        theme.log('First run for mobileNav');
        
        theme.mobileNav.holderElem = $('#mobile-nav-holder');
        let html = '';
      	const navContent = $id('mobile-nav-content');
      	const elemWidth = navContent.clientWidth;
        
        navContent.innerHTML = theme.mobileNav.parseNavItems(theme.navigation, 0);

      $qsa('[data-toggle-sub]').forEach( function(elem)
      {
        elem.addEventListener('click', function(e)
        {
          e.preventDefault();
          
          const elem = e.currentTarget;
          const targetId = elem.getAttribute('data-toggle-sub');
          const subItemsHolder = elem.parentNode.querySelector('[data-parent-id]');
          
          //const closestParent = elem.closest('.mobile-nav-sub');
          const closestParent = elem.closest('ul');
          
          console.log(elem);
          console.log('Clicking id '+targetId);
          console.log(subItemsHolder);
          
          subItemsHolder.classList.add('mobile-sub-active');
          //location.hash = 'cat-'+targetId;
          
          if( closestParent )
          {
            closestParent.classList.add('mobile-nav-has-child-open');
            
            subItemsHolder.style.top = closestParent.scrollTop+'px';
          }
        });
      });
      
      //
      $qsa('.mobile-nav-back-item').forEach( function(elem)
      {
        elem.addEventListener('click', function(e)
        {
          e.preventDefault();
          console.log('pressed back item in nav');
          
          const elem = e.currentTarget;
          
          console.log(elem);
          
          elem.parentNode.classList.remove('mobile-sub-active');
          elem.parentNode.style.top = 'auto';
          
          //const closestParent = elem.parentNode.parentNode.closest('.mobile-nav-sub');
          const closestParent = elem.parentNode.parentNode.closest('ul');
          console.log(closestParent);
          
          closestParent.classList.remove('mobile-nav-has-child-open');
        });
      });
      
        $('#mobile-lang-switcher').on('click', function()
        {
          theme.fancyHandler.closeAllAndClear();          
          theme.scrollTo( $id('mobile-lang-footer'), -100 );
        });

//         $('[data-toggle-sub]').on('click', function(e)
//         {
//           e.preventDefault();

//           const offsetTop = navContent.getBoundingClientRect().top;
//           const subMenu = $(this).siblings('.mobile-nav-sub');

//           if( parseInt(subMenu.attr('data-level')) === 1 )
//           {
//             subMenu.css('top', offsetTop+'px');
//           }
//           else
//           {
//             const parentSubmenu = $(this).closest('.mobile-nav-sub');
//           	const scrollTop = parentSubmenu.scrollTop;
            
//             $(this).find('.mobile-nav-sub').css('top', scrollTop+'px');
            
//             parentSubmenu.addClass('mobile-nav-has-child-open');
//           }

//           subMenu.addClass('mobile-sub-active');

//           $('#mobile-nav-holder').addClass('sub-active');
//         });

//         $('.mobile-nav-back-item').on('click', function(e)
//         {
//           e.preventDefault();
//           theme.log('Clicked mobile nav sub back button');
//           $(this).closest('.mobile-nav-sub').removeClass('transition-none');
//           $(this).closest('.mobile-nav-sub').removeClass('mobile-sub-active');

//           if( theme.mobileNav.activeSubCount() < 1 )
//           {
//             theme.mobileNav.holderElem.removeClass('sub-active');
//           }
//         });

        $('.mobile-nav-sub').on('touchstart', function(e)
        {
          theme.log('start:');
          theme.log(e);
          theme.log(e.originalEvent);
          theme.log(e.target);
          theme.log(e.currentTarget);
          
          if (e.originalEvent.changedTouches[0].clientX < 25 ) //|| e.pageX < window.innerWidth - 10)
          {
          	e.preventDefault();
          }
          touchStartX = e.originalEvent.changedTouches[0].clientX;
          //e.currentTarget.classList.add('transition-none');
        });

        if('ontouchstart' in window)
        {
          $('.mobile-nav-sub').on('touchend', function(e)
          {
            const elem = e.currentTarget;
            const posX = e.originalEvent.changedTouches[0].clientX;
            const deltaX = posX - touchStartX;

            if( elem.classList.contains('dragging') )
            {
              elem.classList.remove('dragging');
              elem.classList.remove('transition-none');
              elem.style.removeProperty("transform");

              if( deltaX > 50 )
              {
                elem.classList.remove('mobile-sub-active');
              }

              if( theme.mobileNav.activeSubCount() < 1 )
              {
                theme.mobileNav.holderElem.removeClass('sub-active');
              }
            }
          });

          $('.mobile-nav-sub').on('touchmove', function(e)
          {
            const elem = e.currentTarget;
            const posX = e.originalEvent.changedTouches[0].clientX;
            const deltaX = posX - touchStartX;
            const transformX = Math.round(elemWidth-deltaX);

            const isDraggable = (elem.classList.contains('mobile-sub-active') && !elem.querySelector('.mobile-sub-active'));

            theme.log('moved '+posX + ' Dx: '+deltaX + ' transformX: '+transformX);

            if( isDraggable && deltaX > 1 && deltaX <= elemWidth )
            {
              elem.classList.add('transition-none');
              elem.classList.add('dragging');
              elem.style.transform = 'translateX(-'+transformX+'px)';
            }
          });
        }

        theme.mobileNav.loaded = true;
      
    });
  }
};

theme.lazyLoad();

//=============================================
// Get ready for the launch
//=============================================
document.addEventListener('DOMContentLoaded', function()
{
  //console.log(theme);
  
	// // Init
	// theme.events.init(); // bind global listeners for specific theme events
	// theme.lazyLoad(); // load up initial dom elements lazy loading
	// theme.productHandler.intersectProductBlocks(); // load up initial dom elements lazy loading
	// theme.headerScroll.check(); // initial page load checking header/scroll position
  
  theme.mobileNav.init();
  
  if( theme.settings.live_search_enabled )
  {
    theme.liveSearch.init();
  }
  
  switch( theme.shop.template )
  {
    case 'pages/product.rain':
    	theme.helpers.responsiveVideos( document.querySelectorAll('#product-content iframe') );
      theme.helpers.bindShareButton('.share-button');
      break;
    case 'pages/blog.rain':
    	//theme.helpers.responsiveVideos( document.querySelectorAll('#article-content iframe') );
      break;
		case 'pages/article.rain':
      theme.helpers.bindShareButton('.share-button');
    	theme.helpers.responsiveVideos( document.querySelectorAll('#article-content iframe') );
      break;
    case 'pages/collection.rain':
      theme.helpers.initPriceSlider();
      break;
  }
  
	// Process dynamic product grids/elements
  // Todo, only homepage and productpage (related) ?
  //theme.dynamicProducts.init();
  const observer = new IntersectionObserver(function(entries)
  {
    entries.forEach( function(entry)
    {
      if (entry.isIntersecting)
      {
        //theme.dynamicProducts.parseElement(entry.target);
        (new theme.dynamicProducts( entry.target )).run();
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '150px'
  });

  $qsa('.dynamic-products').forEach( function(elem)
  {
    observer.observe(elem);
  }); 
    
  $('[data-scrollview-id]').on('click', function(e)
	{
    console.log('data-scrollview-id clicked')
    e.preventDefault();
    
    const scrollOffset = $(this).attr('data-scrollview-offset') || -100;
    const elemId = $(this).attr('data-scrollview-id');
    theme.scrollTo( $id(elemId), parseInt(scrollOffset), 'smooth');
  });
  
  // $('[data-tooltip]').tooltip()
  
  $('input:checkbox:not(.fancy-checkbox, .vat-switcher-checkbox)').addClass('fancy-checkbox');
  $('input:radio:not(.fancy-radio, [class^="gui-"])').addClass('fancy-radio');
  $('select:not(.fancy-select)').addClass('fancy-select');
  
  /*********************************************************************************
  // START scroll handling
  *********************************************************************************/
	window.addEventListener('scroll', function()
	{    
    theme.headerScroll.check();
  }, {
    'passive': true
  });
  
  //Fire first on load
  // theme.headerScroll.check();
  /*********************************************************************************
  // END scroll handling
  *********************************************************************************/
  
  // $(document).on('click', '.dropdown-content', function (e) {
  //   e.stopPropagation();
  // });
  
  
  /*********************************************************************************
  // START theme pop hints
  *********************************************************************************/
  if( !localStorage.getItem('pop_navbar') )
  {
    $('.nav-pop').fadeIn();
  }
  
  if( !localStorage.getItem('pop_collection') )
  {
    $('.collection-pop').fadeIn();
  }
  
  $('[data-pop-close]').on('click', function()
  {
    var closeTarget = $(this).attr('data-pop-close');
    var closeTargetCookieName = 'pop_'+closeTarget;
    
    $('[data-pop="'+closeTarget+'"]').fadeOut();
    localStorage.setItem(closeTargetCookieName, true);
  });
  /*********************************************************************************
  // END theme pop hints
  *********************************************************************************/
  
  /*********************************************************************************
  // START SWIPER SLIDERS
  *********************************************************************************/

  //----------------------------------------------
  // USP bar
  //----------------------------------------------
  // theme.swiperTopUsps = new Swiper('.usps-header',
  theme.swiperTopUsps = new Swiper('.usp-carousel',
	{
    slidesPerView: theme.settings.subheader_usp_default_amount,
    breakpoints: {
      1400: {
        slidesPerView: theme.settings.subheader_usp_default_amount
      },
      1200: {
        slidesPerView: (theme.settings.subheader_usp_default_amount - 1)
      },
      991: {
        slidesPerView: 2
      },
      767: {
        slidesPerView: (theme.settings.hallmark == 'disabled' ? 2 : 1)
      }
    },
    autoplay: {
      delay:4000,
    },
    roundLengths : true
  });
  
  /*********************************************************************************************
  // Process JS for homepage specific features
  *********************************************************************************************/
  if( theme.shop.template == 'pages/index.rain' )
  {
    //----------------------------------------------
    // Homepage slider
    //----------------------------------------------
    if( theme.settings.slidesActive > 1 )
    {
      var swiperHomeSlider = new Swiper('#home-slider', {
        slidesPerView: 1,
        autoplay: {
          delay: theme.settings.sliderTimeout
        },
        navigation:
        {
          prevEl: '#home-slide-prev',
          nextEl: '#home-slide-next'
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
        },
      });
    }
    
    if( theme.settings.home_categories_type == 'default' )
    {
      window.homepageCategoriesScroller = new theme.horizontalScroller('#homepage-categories-default');
    }
    else if( theme.settings.home_categories_type == 'grid' )
    {
       if( window.innerWidth < 768 )
       {
         window.homepageCategoriesScroller = new theme.horizontalScroller('#homepage-categories-grid');
       }
    }
    else if ( theme.settings.home_categories_type == 'catalog' )
    {
      window.homepageCategoriesScroller = new theme.horizontalScroller('#home-category-scroller-catalog',
     	{
        enableNav: true,
        navigation: {
        	left: '#catalog-scroll-icon-left',
        	right: '#catalog-scroll-icon-right'
      	}
      });
    }
    else if( theme.settings.home_categories_type == 'circles' )
    {
      let slideSpaceBetween = theme.pageData.index.featuredCategoriesCount  < 4 ? 50 : 30;
      
      var swiperHomepageCats = new Swiper('#home-categories-circles', {
        slidesPerView: 6,
        spaceBetween: slideSpaceBetween,
        
        navigation:
        {
          prevEl: '#home-cat-prev',
          nextEl: '#home-cat-next'
        },
        breakpoints: {
          1200: {
            slidesPerView: 6,
            spaceBetween: slideSpaceBetween,
          },
          991: {
            slidesPerView: 5.5,
            spaceBetween: (slideSpaceBetween-10),
          },
          768: {
            slidesPerView: 4.5,
            spaceBetween: 15,
          },
          548: {
            slidesPerView: 2.6,
            spaceBetween: 10,
          }
        },
         on: {
           init: function () {
             this.centerSlides();
             this.checkScrollbars();
					},
           resize: function () {
             this.centerSlides();
             this.checkScrollbars();
					}
         }
      });
    }

    var swiperHomeBrands = new Swiper('#home-brands', {
      slidesPerView: 7,
      spaceBetween: 50,
      breakpoints: {
        1400: {
          slidesPerView: 7,
          spaceBetween: 50,
        },
        991: {
          slidesPerView: 6,
          spaceBetween: 50,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
        480: {
          slidesPerView: 3,
          spaceBetween: 30,
        }
      },
      pagination: false,
      autoplay: {
        delay: 2000
      },
      on: {
        init: function () {
          this.centerSlides();
        },
        resize: function () {
          this.centerSlides();
        }
      }
      // loop:true,
		});
    
    let homepageProductSlidersObserver = new IntersectionObserver(function(entries, observer)
    {
      entries.forEach(function(entry)
      {
        if (entry.isIntersecting)
        {
          let productSlider = entry.target;
          
          theme.log('INTERSECTING PRODUCTSLIDER');
          theme.log(productSlider);
          
          let swiperMainProducts = new Swiper(productSlider, {
             observeParents: true,
             observer: true,
             slidesPerView: 4.4,
             breakpoints: {
              1600: {
                slidesPerView: 4.3,
                spaceBetween: 25,
              },
              1300: {
                slidesPerView: 4.3,
                spaceBetween: 25,
              },
              1050: {
                slidesPerView: 3.2,
                spaceBetween: 15,
              },
              991: {
                slidesPerView: 2.8,
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 2.2,
                spaceBetween: 15,
              },
              600: {
                // slidesPerView: 2.05,
                slidesPerView: 1.8,
                spaceBetween: 10,
              }
            },
            spaceBetween: 25,
            navigation: {
              nextEl: '.swiper-home-main-next',
              prevEl: '.swiper-home-main-prev',
            },
            slidesPerGroup: 1
          });
          homepageProductSlidersObserver.unobserve(productSlider);
        }
      });
    }, {
			rootMargin: '200px 0px 200px 0px'
    });

    $qsa('.homepage-product-slider').forEach(function(homepageProductSlider)
    {
      homepageProductSlidersObserver.observe(homepageProductSlider);
    }); 
  }
  /*============================================================================================
  + END SWIPER SLIDERS
  =============================================================================================*/
  
  if( theme.settings.navigation_mode == 'button' )
  {
    $('.nav-main-item').mouseover(function()
    {
      var ulHeight = $(this).find('ul.nav-main-sub').outerHeight();

      console.log('Set subnav height: '+ulHeight);

      $('ul.nav-main').css('height', ulHeight+'px');
    })
    .mouseout(function() {
      $('ul.nav-main').css('height', 'auto');
    });
  
    // $('#main-categories-button, #scroll-nav').on('click', function(e)
    $('#main-categories-button').on('click', function(e)
    {
      console.log('Clicked main categories button');
      
      theme.log(e);
      theme.log(this.id);
      
      $(this).find('.nav-icon').toggleClass('change');
      $(this).toggleClass('active');
      $('.subheader-nav .nav-main-holder').toggleClass('active');
      $('#subnav-dimmed').toggleClass('active');
      
      if( this.id == "scroll-nav" )
      {
        // $('.nav-main-holder').addClass('scrolled');
      }
    });

    $('#scroll-nav').on('click', function()
    {
      let button = $(this);
      
      console.log('Clicked scrolled categories button '+button.attr("class"));
      
      if( button.hasClass('active') )
      {
        button.toggleClass('active');
        $('.categories-button .nav-icon').removeClass('change');
        // $('#scroll-nav .nav-main-holder').fadeOut().remove();
        $('.headerscrolled .nav-main-holder').fadeOut().remove();
        // $('#subnav-dimmed').fadeToggle().toggleClass('active');
        $('#subnav-dimmed').toggleClass('active');
      }
      else
      {
        button.toggleClass('active');
        button.find('.nav-icon').toggleClass('change');

        // $('.subheader-nav').find('.nav-main-holder').clone(true).appendTo('#scroll-nav');
        // $('.subheader-nav').find('.nav-main-holder').clone(true).appendTo('.headerscrolled #header-left');
        var clonedElem = $('.subheader-nav').find('.nav-main-holder').clone(true).addClass('scrolled').appendTo('#header-left');
        theme.log(clonedElem);

        // setTimeout(function(){ $('#scroll-nav .nav-main-holder').addClass('active'); }, 10);
        setTimeout(function(){ $('.headerscrolled .nav-main-holder').addClass('active'); }, 10);

        $('#subnav-dimmed').addClass('active');
      }
    });

    $('#subnav-dimmed').on('click', function()
    {
      $('#main-categories-button').removeClass('active');
      $('#main-categories-button .nav-icon').removeClass('change');
      $('#scroll-nav').removeClass('active');
      $('.headerscrolled .nav-main-holder').fadeOut().remove();
      // $('.nav-main-holder').removeClass('scrolled');
      $('.nav-main-holder').removeClass('active');
      // $(this).fadeToggle().removeClass('active');
      $(this).removeClass('active');
      // $('body').removeClass('flyout-nav-active');
    });
  }
  
  if( theme.settings.navigation_mode == 'menubar' )
  {
    // console.log('Hook navigation events: MENUBAR');
//     $('.categories-button.scroll').on('click', function(e)
//     {
//       console.log('Clicked horizontal scroll nav');
      
//       if(  $('.navscrolled').length > 0 )
//       {
//         $(this).removeClass('active');
//         $(this).find('.nav-icon').removeClass('change');
//         $('.navscrolled').slideUp(300, function()
//         {
//           $('.navscrolled').remove();
//         });
//       }
//       else
//       {
//         $(this).addClass('active');
//         $(this).find('.nav-icon').addClass('change');
//         $('.headerscrolled').after($('#navbar').clone(true).hide().css('position', 'fixed').css('top', '70px').css('width', '100%').addClass('navscrolled').fadeIn());
//       }

//       e.preventDefault();
//     });
  }
  
  
  $('#mobilesearch').on('click', function(e)
  {
    if(  $('.mobilesearchform').length > 0 )
    {
      $('.mobilesearchform').remove();
    }
    else
    {
      if(  $('.headerscrolled').length > 0 )
      {
        $('.headerscrolled').append('<form method="get" action="'+theme.url.search+'" class="mobilesearchform"><input id="mobilesearchinput" type="text" name="q" placeholder="'+theme.text.search+'..."></form>');
      }
      else
      {
        $('#header-holder').after('<form method="get" action="'+theme.url.search+'" class="mobilesearchform"><input id="mobilesearchinput" type="text" name="q" placeholder="'+theme.text.search+'..."></form>');
      }
    }
    
    $('#mobilesearchinput').focus();
    
    e.preventDefault();
  });
  
  if( theme.shop.template == 'pages/index.rain' )
  {
		$('.look-holder').each(function( index )
		{
      const look = $(this);
      const lookModule = look.attr('data-promo-type'); // a or b
      
      $.get(look.attr('data-json'), function(data)
      {
        var product = data.product;
        
        theme.log('HomeLook Data 01:');
        theme.log(getDataFeature('bundle', product.data_01));
        theme.log(product.data_01);
        
        if( product.bundles.length > 0 && getDataFeature('bundle', product.data_01) ) //Todo: check if data 01 contains bundle:
        {
          look.find('.price').html( theme.helpers.parsePrice(product.bundles[0].price.price) );
        	look.find('.price-incl').html( theme.helpers.parsePrice(product.bundles[0].price.price_incl) );
        	look.find('.price-excl').html( theme.helpers.parsePrice(product.bundles[0].price.price_excl) );
        }
        else
        {
          look.find('.price').html( theme.helpers.parsePrice(product.price.price) );
          look.find('.price-incl').html( theme.helpers.parsePrice(product.price.price_incl) );
          look.find('.price-excl').html( theme.helpers.parsePrice(product.price.price_excl) );
        }
        
        if( !product.images || product.images.length == 1 )
        {
          look.find('.look-sub-images').remove();
          look.addClass('promo-product-single-image');
        }
        else if (false)
        {
          look.find('.look-sub-images').append('<div class="sub-image"></div>');
          look.find('.look-sub-images').append('<div class="sub-image"></div>'); 
        }
				else if( product.images.length > 1 )
        {
          for( var i=1; i<product.images.length; i++ )
          {
            if( i > 3 )
            {
              break;
            }
            
            look.find('.look-sub-images').append('<div class="sub-image image-'+i+'"><img src="'+getProductImage(product.images[i], '260x300x2')+'" alt="" class="promo-product-image promo-product-image-sub promo-product-'+lookModule+'-fit" width="260" height="300" loading="lazy"></div>');
          }
          
          if( product.images.length == 2 )
          {
            look.find('.look-sub-images').append('<div class="sub-image image-2"><img src="'+getProductImage(product.images[0], '260x300x2')+'" alt="" class="promo-product-image promo-product-image-sub promo-product-'+lookModule+'-fit" width="260" height="300" loading="lazy"></div>');
          }
        }
        
      });
    });
  }
  
  theme.liveCompare = {
    toggleByLabel: function(elem)
    {
      //elem = $(elem);
      let url = elem.getAttribute('data-url');
      let checkbox = elem.previousElementSibling;
      
      theme.log('Add compare: '+url);
      
      $.ajax({
        url: url,
      }).done(function(data)
      {        
        let html = $('<div></div>').append(data);
        
        let listContent = html.find('#fc-list').html();
        let compareCount = html.find('#compare-count').text();
        
        $('#fc-list').html( listContent );
        $('#compare-count').html( compareCount );
        
        let msg = new theme.message();
        msg.fromHtml(html)
        msg.append();
        
        if( parseInt(compareCount) > 0 )
        {
          $('#fc-holder').addClass('active');
        }
        
        //checkbox.prop('checked', true);
        console.log(checkbox);
        checkbox.checked = true
      })
    },
    init: function()
    {
      $('.static-products-holder').on('click', '.compare', function(e)
      {
        console.log('Clicked compare');
        e.preventDefault();

        theme.liveCompare.toggleByLabel(this)
      });
    }
  };

	theme.liveCompare.init();

  if ('ontouchstart' in document)
  {
    $('.product-block').on('click', function(e)
    {
      console.log('clicked pblock');

      if( $( window ).width() < 768 )
      {
        var formElement = $(this).find('.quick-order');

        if (!formElement.is(e.target) && formElement.has(e.target).length === 0) 
        {
          console.log('small screen, redirect');
          document.location = $(this).attr('data-json').replace('?format=json', '');

          console.log('Clicked outside form');
        }
        else
        {     
          console.log('Clicked INSIDE form');
        }
      }
    });
  }
  
  /* fancy compare */
  $('#fc-title').on('click', function()
  {
    $(this).toggleClass('active');
    $('#fc-list').toggleClass('active');
  });
  
  $('.static-products-holder').on('click', '.trigger-quickshop', function(e)
	{
    let button = $(this);
    var metadata = button.attr('data-metadata');
    console.log(metadata);
    if( button.attr('data-json') )
    {
      var pid = button.attr('data-pid');
    	var jsonUrl =  button.attr('data-json');
    }
    else
    {
    	var pid = button.closest('.product-block').attr('data-pid');
    	var jsonUrl = button.closest('.product-block').attr('data-json');
    }
        console.log(pid, 'pid');
        console.log(jsonUrl, 'jsonUrl');
   
    $('#quickshop-modal .trigger-add-to-cart').attr('data-metadata', metadata);
    
    theme.log('quickShop clicked for product: '+pid);
    
    if( $( window ).width() > 890 )
    { 
      // $('#quickshop-holder').fadeIn().css('display','table');
      // $('body').addClass('quickshop-active');
      
      theme.productHandler.getDataPromise(jsonUrl, pid).then( function(productData)
			{ 
        theme.quickshop.hydrate(productData);
        // theme.quickshop.show();
        theme.fancyBoxes.new('quickshop-holder');
        theme.fancyBoxes.box('quickshop-holder').onClear(theme.quickshop.clear);
      }).
      catch(function(err)
      {
        let alert = new theme.message(err)
        alert.append();
      });
      
      e.preventDefault();
    }
  })
  
	// $('.modal-close').on('click', function(e)
	// {
	// $('.modal-holder.modal-active').removeClass('modal-active');
	// });
  
  // $('#quickshop-holder').on('click', function(e)
  // {
  //   if( $(e.target).hasClass('quickshop-holder') || $(e.target).hasClass('quickshop-inner') ) //|| $(e.target).hasClass('x') )
  //   {
  //     theme.quickshop.close();
  //   }
  // });

  window.clearFancyBox = function(delay)
  {
    delay = (typeof delay !== 'undefined') ?  delay : 300
    console.log('clear with: '+delay);
    
    //Check fancy cart
    if( $('html').hasClass('fancy-active') )
    {
      var elemHandler =  $('.active[data-fancy^="fancy"]');
      var activeElement = elemHandler.attr('data-fancy');
      
      $('html').removeClass('fancy-active');
      
      if( elemHandler.attr('data-fancy-type') == 'flyout' )
    	{
        $('.'+activeElement).removeClass('active');
        $('.'+activeElement).fadeOut(delay);
         $('.dimmed.flyout').fadeOut(delay);
      }
      else if( elemHandler.attr('data-fancy-type') == 'hybrid' && window.innerWidth > 767 )
    	{
        $('.'+activeElement).removeClass('active');
        $('.'+activeElement).fadeOut(delay);
         $('.dimmed.flyout').fadeOut(delay);
      }
      else
      {
        $('.'+activeElement).animate({"right": '-=550'}, 300);
        $('.dimmed.full').fadeOut(delay);
      }
      
      elemHandler.removeClass('active');
    }
  }
  
  window.clearModals = function()
  {
    $('.reviews-modal-holder').fadeOut();
    $('.specs-modal-holder').fadeOut();
    $('.quickshop-modal-holder').fadeOut();
    $('.cart-popup-holder').fadeOut();
    $('.sizechart-modal-holder').fadeOut();
    $('.stock-modal-holder').fadeOut();
    
    $('html').removeClass('modal-active');
    $('.active[data-modal]').removeClass('active');
    
    $('.dimmed').fadeOut();
  }
  
	window.hybridFancyBoxes = [];
  // $('.fancy-box.hybrid').each( function()
  // $('.fancy-box').each( function()
  $('.fancy-box.hybrid').each( function()
  {
    hybridFancyBoxes.push( this.id );
  });
  
  theme.logGroup('hybridFancyBoxes found', true);
  theme.log(hybridFancyBoxes);
  theme.logGroupEnd();
  
  var resizeId;
  window.addEventListener('resize', function()
	{
      clearTimeout(resizeId);
      resizeId = setTimeout(checkHybridFancyBoxesPosition, 500);
  });

  function checkHybridFancyBoxesPosition()
  {
    theme.logGroup('checkHybridFancyBoxesPosition()', true);
    
    hybridFancyBoxes.forEach( function(id, index)
		{
      var elem = $('#'+id);
      
      console.log(elem);
      
      if( !elem.hasClass('pos-body') && window.innerWidth < 768 )
      {
        console.log('Moving #'+id+' to body');
        elem.detach().appendTo(document.body).addClass('pos-body').removeClass('pos-header');
      }
      else if( elem.hasClass('pos-body') && window.innerWidth > 767 )
      {
        console.log('Moving #'+id+' to header');
        elem.detach().appendTo('#header-'+id).removeClass('pos-body').addClass('pos-header');
      }
    });
    
    theme.logGroupEnd();
  }
  
  checkHybridFancyBoxesPosition();
  
  theme.fancyBox = function(elemId, triggerElem)
  {
    this.id = elemId;
    this.elem = null;
    this.type = null;
    this.triggerElem = triggerElem || null;
    this.backdrop = false;
    
    this.clickEvent = null;
    
    this.isActive = function()
    {
      return this.elem.classList.contains('active');
    }
    
    const box = this;
    
    this.clickHandler = function(e)
    {
      // console.log(e);
      
      const element = $(box.elem);
      
      // Prevent race condition
      // Because clicking the trigger wil also immediately trigger this handler
      //
      if( window.getComputedStyle(box.elem).visibility == 'hidden' )
        return;
      
      // Modals can be closed by clicking bg
      if( box.type === 'modal' )
      {
        console.log('Clicked when modal is open');
        
        //const element = $(box.elem);

        // Main Element is always bg elem, so clicking this should close it.
        if (element.is(e.target) ) //&& element.has(e.target).length === 0) 
        {
          theme.fancyBoxes.close(box.id);
        }
      }
      else // fancybox
      {
        console.log((e.target));
        console.log(element.has(e.target));
        console.log(element.is(e.target));
        
        if( !element.is(e.target) && element.has(e.target).length === 0 )
        {
          // clicked outside
          theme.log('theme.fancyBox::clickHandler() clicked outside fancybox');
          theme.fancyBoxes.close(box.id);
        }
      }
    };
    
    this.escHandler = function(e)
    {
      if( e.key === "Escape" )
      {
         theme.fancyBoxes.close(box.id);
      }
    };
    
    this.transitionEndedHandler = function(e)
    {
      console.log('****** TRANSITION ENDED ****** ');
      // console.log(e);
      
      if( e.propertyName === 'visibility' && !box.isActive() )
      {
      	console.log(e.target);
      	console.log(e.currentTarget);
        
        box.removeListeners();
        
        // Run callback when box is hidden
        if( box.onClearCallback )
        {
          box.onClearCallback();
        }
      }
    }
    
    this.onClearCallback;
    
    this.onClear = function(callback)
    {
      this.onClearCallback = callback;
    };
    
    this.bindListeners = function()
    {
      window.addEventListener('click', this.clickHandler);
      window.addEventListener('keyup', this.escHandler);
      this.elem.addEventListener('transitionend', this.transitionEndedHandler);
    };
    
    this.removeListeners = function()
    {
      theme.log('Removed listeners for #'+this.id);
      window.removeEventListener('click', this.clickHandler);
      window.removeEventListener('keyup', this.escHandler);
      this.elem.removeEventListener('transitionend', this.transitionEndedHandler);
    };
    
    this.showBackdrop = function()
    {
      $id('fancy-backdrop').classList.add('active');
    }
    
    this.hideBackdrop = function()
    {
      $id('fancy-backdrop').classList.remove('active');
    }
    
    this.show = function()
    {
      document.body.classList.add('fancy-'+this.type+'-active');
      this.elem.classList.add('active');
      
      if( this.triggerElem )
      {
        this.triggerElem.classList.add('active');
      }
      
      if(this.backdrop)
      {
        this.showBackdrop();
      }
    };
    
    this.clear = function()
    {
      theme.log('fancyBox.clear() called for '+elemId);
      this.elem.classList.remove('active');
      document.body.classList.remove('fancy-'+this.type+'-active');
      
      if( this.triggerElem )
      {
        this.triggerElem.classList.remove('active');
      }
      
      this.hideBackdrop();
      
      // Removing binds is done when transition completed
    };
    
    this.init = function()
    {
      if( !elemId )
      {
        console.log('Created new fancyBox but elemId was null, did you add data-fancy-id attribute? Skipping..');
        return;
      }
      
      theme.log('Inited new fancybox for #'+elemId);
      this.elem = $id(elemId);
      this.type = this.elem.getAttribute('data-type');
      
      this.backdrop = (this.elem.getAttribute('data-backdrop') !== 'false' && this.type != 'modal');
      
      this.bindListeners();
      
      this.show();
    };
    
    this.init();
  }
  
  theme.fancyBoxes = {
    boxes: [],
    box: function(elemId)
    {
      const result = this.boxes.find(function(obj)
      {
  			return obj.id === elemId
			});
      
      return result || null;
    },
    new: function(elemId)
    {
      this.boxes.push( new theme.fancyBox(elemId) );
    },
    close: function(elemId)
    {
      this.box(elemId).clear();
      this.boxes.pop(); // hacky, just remove last
    },
    closeAll: function()
    {
      //loop throuh all and close
      if( !this.boxes[0] )
        return;
      
      this.close( this.boxes[0].id );
    },
    activeCount: function()
    {
      return this.boxes.length;
      // return Object.keys(this.boxes).length;
    }
  }
  
  theme.fancyHandler = {
    activeBox: false,
    type: null,
    activeButton: false,
    activeTrigger: false,
    mobileView: function()
    {
      return window.innerWidth < 768
    },
    closeWindow: function()
    {
      
    },
    handleClick: function(e)
    {
      theme.log('fancyHandler::handleClick(e) called', 'background:#000; color:#fff;');
      
      const button = this.activeButton;
      let fancyBox = this.activeBox;
      
      fancyBox = document.getElementById(this.activeBox.id);
      
      if( !fancyBox )
      {
        theme.log('No activeBox, so bail');
        return;
      }
      
      // If it's a modal, the outer/backdrop element is the main element, so close..
      if( theme.fancyHandler.type == 'modal' && fancyBox === e.target  )
      {
        this.closeAllAndClear();
        return;
      }
      
      theme.logAll('Current ActiveBox, target:', fancyBox, e.target);
      
      // We're not clicking inside the fancybox
    	if( fancyBox !== e.target && !fancyBox.contains(e.target) )
      {
        theme.log('Not clicking inside fancy-box,', 'background:lightblue;');
        
        // We're not clicking the active/trigger button as well, so close all
        if( button !== e.target && !button.contains(e.target) )
        {
          theme.log('Also not clicking the active Button', 'background:lightblue;');
          
          this.closeAllAndClear();
        }
        // We ARE clicking the trigger button
        else
        {
          theme.log('Clicking active button', 'background:orange;');
          
          if( button.tagName === 'A' )
          {
            document.location = button.href;
            return;
          }
          
          this.closeAll();
        }
      }
    },
    closeAllAndClear: function()
    {
      if( this.activeButton )
      {
      	this.activeButton.removeAttribute('data-fancy-active')
      }
      
      this.closeAll();
    },
    closeAll: function()
    {
      theme.log('fancyHandler::closeAll() called');
      
      // Remove active state from buttons
			$('[data-trigger-fancy].active').removeClass('active');
      
      if(  this.activeButton )
      {
      this.activeButton.classList.remove('active');
      }
      
      // Remove active state from fancybox
      $('.fancy-box').removeClass('active');
      $('.fancy-modal').removeClass('active');
      
      $('body').removeClass('fancy-active');
      
      $('#fancy-backdrop').removeClass('active');
      
      this.activeBox = false;
      this.activeButton = false;
    },
    isActive: function(fancyId)
    {
      
    },
    setActiveButton: function(triggerElem)
    {
      // Native DOM element
      this.activeButton = triggerElem[0];
      this.activeButton.classList.add('active');
      this.activeButton.setAttribute('data-fancy-active', 'true');
    },
    setActiveBox: function(fancyElem)
    {
      // Native DOM element
      this.activeBox = fancyElem[0];
    },
    setType: function(type)
    {
      this.type = type;
    },
    show: function(fancyElem)
    {
      fancyElem.addClass('active');
      $('body').addClass('fancy-active');
      
      this.setActiveBox(fancyElem);
      this.setType(fancyElem.attr('data-type'));
      
      if( (theme.fancyHandler.mobileView() || fancyElem.attr('data-fancy-backdrop') === 'always') && fancyElem.attr('data-fancy-backdrop') !== 'disabled' && this.type != 'modal' )
      {
        $('#fancy-backdrop').addClass('active');
      }
    },
    events: {
      close: function(e)
      {
        e.preventDefault();
        theme.fancyHandler.closeAllAndClear();
        theme.fancyBoxes.closeAll();
      },
      trigger: function(e)
      {
        e.preventDefault();
        theme.fancyBoxes.new( this.getAttribute('data-fancy-id') );
      }
    },
    bind: function()
    {
      //bind to close buttons
      $qsa('.close-fancy').forEach( function(elem)
			{
        elem.addEventListener('click', theme.fancyHandler.events.close);
      });
      
      //bind to triggers
      //edit: not in use right now. beware some buttons may have both .trigger-fancy class and data-trigger-fancy
  		// $qsa('.trigger-fancy').forEach( function(elem)
  		// {
  		// elem.addEventListener('click', theme.fancyHandler.events.trigger);
  		// });
    },
    init: function()
    {
      // Bind to fancy module 2.0
      this.bind();
      //return;
      // legacy
      $('body').on('click', '[data-trigger-fancy]', function(e)
      {
        theme.log('Clicked Fancy Trigger', 'font-weight:bold');
        console.debug('CurrentTargets:', e.target, e.currentTarget);
        
        e.preventDefault();
        
        const triggerElem = $(this);
        
        // Refactor, is always removeing active state from trigger, which means?? edit: seems to work now?
        if( triggerElem.attr('data-fancy-active') || (theme.fancyHandler.activeButton && e.target.contains(theme.fancyHandler.activeButton) ) )
        {
          theme.log('Clicked fancy trigger, but some fancy box is already active', 'color:#f00000;');
          
          triggerElem.removeAttr('data-fancy-active');
          return;
        }

        const targetId = '#'+triggerElem.attr('data-trigger-fancy');
        const fancyElem = $(targetId);

        theme.logAll('Triggering fancy '+targetId, fancyElem, 'With button:', triggerElem);

        theme.fancyHandler.show(fancyElem);
        theme.fancyHandler.setActiveButton(triggerElem);
      });
    }
  }

  theme.fancyHandler.init();
  
  $(document).on('keyup', function(e)
	{
    if( e.key === "Escape" )
    {
      if(document.body.classList.contains('fancy-active') || document.body.classList.contains('modal-active'))
			{
         theme.fancyHandler.closeAllAndClear();
    	}
    }
  });
  
  $(document).on('mousedown', function(e)
	{
    if( theme.fancyHandler.activeBox )
    {
    	theme.fancyHandler.handleClick(e);
    }
    
//     if( document.body.classList.contains('modal-active') )
//     {
//       console.log('Clicked when modal is open');
//       var activeElement = $('.' +$('.active[data-modal]').attr('data-modal'));
//       console.log('Active element: '+$('.active[data-modal]').attr('data-modal'))
//       console.log(activeElement);

//       if (!activeElement.is(e.target) && activeElement.has(e.target).length === 0) 
//       {
//         clearFancyBox();
//     		clearModals();
//       }
//     }
  });
  
  // $('.close-fancy, .fancy-modal .x').on('click', function()
	// $('.close-fancy').on('click', function(e)
	// {
	// // clearModals();
	// e.preventDefault();
	// theme.fancyHandler.closeAllAndClear();
	// theme.fancyBoxes.closeAll();
	// });
  

  //=============================================
  // Fancy boxes
  //============================================= 
//   $('[data-fancy^="fancy"]').click(function (e)
//   {
//     return true;
//     console.log('Start fancy box');
    
//     let toggler = $(this);
//     let type = toggler.attr('data-fancy-type');
    
//     toggler.addClass('active');
//     $('html').addClass('fancy-active');
    
//     var elem = $('#'+toggler.attr('data-fancy') );
    
//     console.log(elem);
    
//     if( type == 'flyout' )
//     {
//       $('.dimmed.flyout').fadeIn();
//       elem.fadeIn(300, function()
// 			{
//         console.log('elem faded in');
//       });
//       elem.addClass('active');
      
//       e.preventDefault();
//     }
//     else if( type == 'hybrid' && window.innerWidth >= 768 )
//     {
// 			// $('html').addClass('hybrid');
// 			// $('.dimmed.flyout').fadeIn(100);
// 			// elem.fadeIn(100, function()
// 			// {
// 			// console.log('elem faded in');
// 			// });
// 			// elem.addClass('active');
//     }
//     else
//     {
//       $('.dimmed.full').fadeIn();
//     	// elem.animate({"right": '+=550'}, 200);
//       elem.css('transform', 'translateX(0px)').css('opacity', 1).css('visibility', 'visible');
//       elem.addClass('active');
      
//       e.preventDefault();
//     }
//   });
  
  //=============================================
  //=============================================
  
  theme.liveModal = {
    load: function(triggerElem)
    {
      const loadingButton = new theme.helpers.loadingButton(triggerElem);
      const hookOnload = triggerElem.getAttribute('data-hook-onload');
      
      $.get(triggerElem.getAttribute('data-json-url'), function(data)
      {
        const modalId = triggerElem.getAttribute('data-modal');

        theme.fancyBoxes.new( modalId );

        const modal = $id(modalId);

        if(hookOnload)
        {
          const result = theme.hooks[hookOnload](data);        
          if( result === 0 )
          {
            return false;
          }
        }
        else
        {
        	const contentElem = modal.querySelector('.modal-content');
        	contentElem.innerHTML = data.textpage.content;
        }

        loadingButton.clear();

      }).fail( function(request, status, errorMessage )
      {
        alert("Error\nCould not load: "+triggerElem.getAttribute('data-json-url').replace('?format=json', ''));
      });
    },
    init: function()
    {
      $qsa('.trigger-live-modal').forEach( function(triggerElem)
      {
        triggerElem.addEventListener('click', function(e)
				{
          e.preventDefault();
          theme.liveModal.load(triggerElem);
        });
      });
    }
  };
  theme.liveModal.init();
  
  $('[data-modal]').click(function (e)
  {
    return;
    e.preventDefault();
    console.log('Start modal');
    
    var initiator = $(this);
    var elem = $('.'+$(this).attr('data-modal'));
    var jsonData = $(this).attr('data-modal-json') || false;
    
    $(this).addClass('active');
    
    if( jsonData != false )
    {
      $.get(jsonData, function(data)
      {
        console.log(data);
        
        $('html').addClass('modal-active');
      
        if( initiator.attr('data-type') === 'stock' )
        {
          if( data.productInventory == false )
          {
            alert('Product inventory locations not enabled in Retail');
            return;
          }
        
          $('.stock-modal .stockdata').html('');
          
          var locations = data.productInventory.locations;
          var storeHtml = '';
          
          for( var i in locations)
          {
            let store = locations[i]            
            console.log(store.location.title);
            
            storeHtml += '<div class="store-row">';
            storeHtml += '   <div class="icon"><i class="fas fa-map-marker-alt"></i></div>';
            storeHtml += '   <div class="info">';
            storeHtml += '      <h4>'+store.location.title+'</h4>';
            storeHtml += '      <span>'+store.location.address.formatted+'</span>';
            storeHtml += '   </div>';
            storeHtml += '   <div class="stock">';
            
            if( store.inventory > 0 )
            {
              if( theme.settings.show_amount_of_products_on_productpage )
              	storeHtml += '<div class="in-stock"><i class="fa fa-check"></i> '+theme.text.inStock+' ('+store.inventory+')</div>';
              else
                storeHtml += '<div class="in-stock"><i class="fa fa-check"></i> '+theme.text.inStock+'</div>';
            }
            else
            {
              storeHtml += '<div class="out-of-stock"><i class="fa fa-times"></i> '+theme.text.outOfStock+'</div>';
            }
            
            storeHtml += '   </div>';
            storeHtml += '</div>';
          }
          
          $('.stock-modal .stockdata').html(storeHtml);
        //$('.stock-modal .updatedat').html(theme.text.updatedAt + ': ');
        }
        else
        {
          elem.find('.json-content').html(data.textpage.content);
        }
        
        $('.dimmed.full').fadeIn();
        elem.fadeIn();
      });
    }
    else
    {
      $('html').addClass('modal-active');

      $('.dimmed.full').fadeIn();
      elem.fadeIn();
    }
  });
  
  /*********************************************************************************
  // START Dynamic Countdown Blocks
  *********************************************************************************/
	function expiredBlock(element)
  {
    const id = element.attr('data-id');
    const block = $('[data-countdown-id="'+id+'"]');
   
    console.log('Expired product countdown deal with id: '+ id);
    
    element.html('<span class="zc-non-success fz-090">'+theme.text.dealExpired+'</span>');
    //block.countdown('destroy');
    block.find('.product-block-image').css('opacity', '0.5');
    block.find('h4').css('text-decoration', 'line-through').css('opacity', '0.5');
    block.find('.quickshop-button').remove();
    block.find('.quick-order').css('opacity', '0.5');
    block.find('input').attr('disabled', true);
    block.find('.button').on('click', function()
    {
      return false
    });
  }
  
  function expiredBlockAllow(elem)
  {
    elem.countdown('destroy');
    elem.parent().remove();
  }
  
  var runningCountdowns = [];
  
  window.parseCountdownProducts = function()
  {
    if( typeof jQuery().countdown === 'undefined' )
    {
      return;
    }
    
    theme.logGroup('parseCountdownProducts()', true);
    $('[data-countdown]').each( function(index)
    {
      const element = $(this);
      const type = element.attr('data-type');
      const timerVal = element.attr('data-countdown');
      const id = element.attr('data-id');
      
      theme.log('found [data-countdown] for target element #'+id);

      let config = {
        until: new Date( timerVal ),
        serverSync: theme.shop.getServerTime(),
        format: 'dhms',
        onExpiry: function(){ theme.settings.dealDisableExpiredSale ? expiredBlock(element) : expiredBlockAllow(element); },
        alwaysExpire: true,
        labels: theme.text.countdown.labels,
        labels1: theme.text.countdown.labels1
      };
      
      switch(type)
      {
        case 'text':
          config.layout = '<span>{dn}<span class="blink">:</span>{hnn}<span class="blink">:</span>{mnn}<span class="blink">:</span><span class="timer-sec">{snn}</span></span>'
          break;
        default:
          config.alwaysExpire = false;
          break;
      }
      
      runningCountdowns.push('.countdown-'+id);
      element.countdown(config);
    });
    
    console.log(runningCountdowns);
    theme.logGroupEnd();
  };
  
  parseCountdownProducts()
  
  function removeCountdownProducts()
  {
    for( var i = 0; i<runningCountdowns.length; i++ )
    {
      $( runningCountdowns[i] ).countdown('destroy');
      
      console.log('Countdown stopped for '+runningCountdowns[i]);
    }
    
    runningCountdowns = [];
  }
  /*********************************************************************************
  // END Dynamic Countdown Blocks
  *********************************************************************************/
  
  theme.quantityInputHandler = {
    update: function(inputElement, amount, type)
    {
      const value = parseInt(inputElement.value);
      const minValue = inputElement.dataset.min || 0;
      
      if( value <= minValue && type === 'down' )
      {
        inputElement.value = minValue;
        return;
      }
      
      inputElement.value = (type === 'up') ? (value+amount) : (value-amount);
      console.log(inputElement);
      
      inputElement.dispatchEvent( new CustomEvent('change', {'bubbles': true}) );
      
      //inputElement.trigger('change');
    },
    add: function(inputElement, amount)
    {
      this.update(inputElement, amount, 'up');
    },
    sub: function(inputElement, amount)
    {
      this.update(inputElement, amount, 'down');
    },
    bindListeners: function()
    {
      document.addEventListener('click', function(e)
      {
        if( !e.target.classList.contains('qty-button') )
        {
          return;
        }
        
        const button = e.target;
        const type = button.dataset.type;
        const inputElement = button.parentNode.firstElementChild;
        const amount = inputElement.dataset.type || 1;
        
        theme.quantityInputHandler.update(inputElement, amount, type);
      });
    },
    init: function()
    {
      this.bindListeners();
    }
  };
  
  theme.quantityInputHandler.init();

  $('.qty-fast').on('click', function()
  {
    $(this).select();
  })
  
  if( theme.template == 'pages/cart.rain' )
  {
    $(document).on('change', '#cart-form', function()
    {
      var form = $(this);
      form.css('filter', 'blur(2px)');
      form.css('pointer-events', 'none');
      form.submit();
      return true;
      //
  //     $.post( $(this).attr('action'), form.serialize() ).done( function(data)
  // 		{
  //       var formHtml = $(data).find('#cart_form').html();

  //       $('#cart_form').html( formHtml );

  //       form.css('filter', 'none');
  //       console.log('Cart updated')
  //     });
    });
    
		if( $(window).width() < 768 )
    {
      // console.log('Win Width less than 768');
      console.log('sticky start mobile');
      
      const cartTotals = document.getElementById('cart-totals');
      const elem = $('#cart-checkout-sticky');
      let stickyVisible = false;
      
      if( cartTotals )
      {
        const cartTotalsObserver = new IntersectionObserver(function(entries)
        {
          if(entries[0].isIntersecting === true)
          {
            console.log('sticky intersecting TRUE');
            if( stickyVisible )
            {
              console.log('already visible, remove class');
              elem.removeClass('active');
              stickyVisible = false;
            }
          }
          else
          {
            if( !stickyVisible )
            {
              elem.addClass('active');
              stickyVisible = true;
            }
          }
        }, { threshold: [0] });

        cartTotalsObserver.observe(cartTotals);
      }
    }
  }

  // This should be in dom content loaded event i guess?
  // Nope, takes longer to load probably!
  $qsa('.content-fold-overflow').forEach(function(elem)
  {
    if( elem.scrollHeight > elem.clientHeight )
    {
      const parent = elem.parentNode;
      
      const viewAllButton = document.createElement('div');
      viewAllButton.classList.add('button', 'button-tiny', 'button-lined-soft');
      viewAllButton.textContent = theme.text.viewAll;
      viewAllButton.style.marginLeft = '50%';
      viewAllButton.style.transform = 'translateX(-50%)';
      
      viewAllButton.onclick = function()
      {
        elem.classList.add('active');
        viewAllButton.remove();
        
        // If the parent is toggle-content feature, we need to expand that as well
        // Or our own content stays hidden anyway
        if( parent.classList.contains('toggle-content') )
        {
          parent.style.height = 'auto';
        }
      };
      
      parent.append(viewAllButton);
    }
    else
    {
      elem.classList.add('active');
    }
  });
  
  //=============================================
  // Faq
  //=============================================
  if( theme.shop.template == 'pages/service.rain' )
  {
    $('.faq-item .question').on('click', function()
		{
      /*$('.faq-item .question.active').next().slideUp();
      $('.faq-item .question.active').removeClass('active');*/
      
      $(this).toggleClass('active');
      $(this).next().slideToggle();
    });
  }

  theme.addToCart = {
    triggerSelector: '.trigger-add-to-cart',
    htmlResponse: null,
    hydrateDom: function()
    {
      const newQty = this.htmlResponse.find('#cart-qty').html();
      //const newFancyCart = this.htmlResponse.find('#fancy-cart').html();
      const cartItems = this.htmlResponse.find('.cart-items-holder').html();

      $('#cart-qty').html( newQty );
      //$('#fancy-cart').html( newFancyCart );
      $('.cart-items-holder').html( cartItems );
    },
    openFancyCart: function()
    {
      $('#cart-header-link').click();
    },
    showPopup: function()
    {
      
    },
    clickHandler: function(e)
    {
      if( !theme.settings.live_add_to_cart )
      {
        console.log('Live add to cart disabled, submit form');
        return true;
      }
      
      e.preventDefault();
      
      const button = e.currentTarget;
      const loadingButton = new theme.helpers.loadingButton(button);
      
      try
      {
        // console.log(button.getAttribute('data-metadata'));
        window.md = button.getAttribute('data-metadata');
        const metadata = JSON.parse(button.getAttribute('data-metadata'));
        console.log(button);
        
        const pid = button.getAttribute('data-pid');
        const vid = button.getAttribute('data-vid');
        const title = button.getAttribute('data-title');
        const variantTitle = button.getAttribute('data-variant');
        const image = button.getAttribute('data-image');
        const price = button.getAttribute('data-price');
        
        let imgElement = new Image();
        imgElement.src = metadata.image || theme.images.placeholderSquare;
        imgElement.classList.add('img-responsive');
        
        const productHasRelated = button.getAttribute('data-has-related') == 'true' ? true : false;
      
        let form = button.closest('form');
        if( !form )
        {
          console.log('Quick add to cart: No form found. Trying #product_configure_form');
          form = $id('product_configure_form');
        }

        const formFields = $(form).serialize();
        const formAction = form.action;
        console.log(formAction);
        $.post( formAction, formFields, function()
        {
          console.log('Posted quick cart button: ');
          console.log(formFields);
        }).done( function(data)
        {
          theme.log(data);
          // Process to make usable
          const html = $('<div></div>').append(data);
          theme.addToCart.htmlResponse = html;

          let msg = new theme.message();
          msg.fromHtml(html);
          
          console.log('---- message -----');
          console.log(msg.messageText);
          console.log(msg.messageHtml);

          // If it's an error (e.g. required custom field) and not already on product page
          // Simply submit for forced redirection to product page..
          if( msg.type == 'error' && theme.template !== 'pages/product.rain')
          {
            form.submit();
            return;
          }

          theme.addToCart.hydrateDom();

          if( !metadata || !msg.wasAddedToCart() )
          {
            msg.append();
          }
          else if( window.innerWidth < 768 || theme.shop.cart_redirect_back )
          {
            $('.cart-items-holder').prepend('<div class="success-bar p-2 lh-1">'+msg.messageText+'</div>');
            theme.addToCart.openFancyCart();
          }
          else
          {
            // Reset single quotes;
            metadata.title = metadata.title.replace('#039;', "'");
            metadata.variant = metadata.variant.replace('#039;', "'");
            
            
            $id('fm-cart-product-title').innerHTML = ( metadata.title + (metadata.variant ? (' - ' + metadata.variant) : '') );
            if ($('.product-calculator').length) { $('.product-calculator').removeClass('active'); }
            
            // using jquery because elements may not exist depending on vat switcher..
            $('#fm-cart-price').html( theme.helpers.parsePrice(metadata.price.price) );
            $('#fm-cart-price-incl').html( theme.helpers.parsePrice(metadata.price.price_incl) );
            $('#fm-cart-price-excl').html( theme.helpers.parsePrice(metadata.price.price_excl) );

            const upsellHolderElem = theme.addToCart.htmlResponse.find('#cart-upsell-holder');
            
            if( upsellHolderElem.length > 0 )
            {
            	$id('fm-cart-related').innerHTML = ( theme.addToCart.htmlResponse.find('#cart-upsell-holder').prop("outerHTML") );
            }
            $id('fm-cart-image').innerHTML = '';
            $id('fm-cart-image').appendChild(imgElement);
            
            if (theme.shop.template != 'pages/product.rain') {
              $('.close-fancy').click();
            	theme.addToCart.openFancyCart();
            } else {
              if( upsellHolderElem.length > 0 )
              {
                const dynamicUpsellProducts = new theme.dynamicProducts( $id('cart-upsells') );
                dynamicUpsellProducts.onComplete = function() {
                  theme.fancyBoxes.new('fancy-modal-cart');
                };
                dynamicUpsellProducts.run();
              }
              else
              {
                theme.fancyBoxes.new('fancy-modal-cart');
              }
            }
          }
          
          loadingButton.clear();

        }).fail( function()
        {
          location.reload();
        });
      }
      catch(e)
      {
        // console.log(e);
      }
    },
    init: function()
    {
      $('body').on('click', '.trigger-add-to-cart', theme.addToCart.clickHandler);
    }
  };
  
  theme.addToCart.init();
  
  if( theme.shop.template == 'pages/collection.rain' )
  {
    window.collectionCategoryScroller = new theme.horizontalScroller('#collection-category-carousel', {
      enableNav: theme.settings.collection_subcats_carousel_navigation
    });
    
    // $('.filter-show-more').on('click', function(e)
    $('#collection').on('click', '.filter-show-more', function(e)
    {
      e.preventDefault();
      const groupId = $(this).attr('data-filter-group');
      
      $('.filter-group-'+groupId+' .filter-value').removeClass('hidden-filter');
      $('.filter-group-'+groupId+' .more').remove();
      
      window.sessionStorage.setItem('data-filter-group-'+groupId, true);
      
      $('<style>.filter-group-'+groupId+' .more{ display:none; } .filter-group-'+groupId+' .hidden-filter{display:initial; display:revert;}</style>').appendTo("head");
    });
    
    $('#collection').on('change', '.custom-filter-form-live .fancy-radio, .custom-filter-form-live .fancy-checkbox', function()
    {
      theme.log('Changed filter form');
      const form = $(this).closest('form').submit();
    });
    
    $('#collection').on('submit', '.custom-filter-form', function(e)
    {
      e.preventDefault();
      
    	$('.product-grid, .custom-filters-holder').css('filter', 'blur(4px)');
      $('.product-grid, .custom-filters-holder').css('pointer-events', 'none');
      
      const form = $(this);
      const formData = form.serialize();
      const filerType = form.attr('data-filter-type'); // fancybox or sidebar
      
      // Are we calling from sidebar? need this for scroll pos in the div
      const collectionSidebar = $id('collection-sidebar') ?? false;
      
      const formAction = form.attr('action');
      const urlBuilder = new theme.urlBuilder(formAction);
      urlBuilder.addParam('request_type', 'ajax')
        .addParam('request_action', 'collection_page')
        .addParam('filter_type', form.attr('data-filter-type'));
      
      if( filerType == 'sidebar')
      {
        urlBuilder.addParam('sidebar_scrolltop', collectionSidebar.scrollTop);
      }
			else if( filerType == 'fancybox' )
      {
        // Close all fancyboxes if we're using the fancybox filters, cause we're done with that for now..
        theme.fancyHandler.closeAllAndClear();
      }

      $.get( urlBuilder.url(), formData, function(data)
      {
        // Do some cleanup first..
        removeCountdownProducts();
        
				const fancyFiltersCurrentlyActive = $('#fancy-filters').hasClass('active');
        
        // Hydrate/overwrite current collection content
        $('#collection').html ( data );
        
        fancyFiltersCurrentlyActive ? $('[data-trigger-fancy="fancy-filters"]').first().click() : $('#fancy-filters').removeClass('active');
        
        // Set new sidebar as we've just updated the DOM
        const collectionSidebar = $id('collection-sidebar');
        
        if( collectionSidebar )
        {
          theme.log('Sidebar enabled, set scrollTop of '+collectionSidebar.id+' to: '+collectionSidebar.getAttribute('data-scrolltop'));
          // Keep track of sidebar/filters scroll position
          collectionSidebar.scrollTop = collectionSidebar.getAttribute('data-scrolltop');
        }
        
        // Fix pagination 
        window.history.pushState({type: 'collection'},'TITLE', formAction+'page1.html?'+formData);
        
        // Tell the world that the content has been loaded/refreshed
        theme.events.fire('themeCollectionChanged');
      	
        //parseCountdownProducts();
      	//theme.lazyLoad();
        //initPriceSlider();
        
        // Scroll into view..
        if( window.pageYOffset > 150 )
        {
          theme.scrollTo($id('collection'), -50);
        }
      });
    });
    
    addEventListener("popstate", function (e)
    {
      if( !history.state || (history.state && history.state.type !== 'collection') )
      {
        return true;
      }

      // console.log(e);

      const urlBuilder = new theme.urlBuilder(location.href);
      const pageUrl = urlBuilder.addParam('request_type', 'ajax').addParam('request_action', 'collection_page').url();

        $.get( pageUrl, function(data)
        {
          removeCountdownProducts();

          $('#collection').html ( data );

          //parseCountdownProducts();
          //theme.lazyLoad();
          theme.events.fire('themeCollectionChanged');
          //initPriceSlider();
        });

    });
  }
  
  // INFINITE SCROLL
  if( theme.shop.template == 'pages/collection.rain' && theme.settings.collection_pagination_mode == 'live' )
  {
    $('#collection').on('click', '.collection-load-more', function(e)
		{
      e.preventDefault();
      
      const button = $(this);
      const url = button.attr('href');
      const currentPage = button.attr('data-current-page');
      const direction = button.attr('data-direction');
      
      // paginationButton.find('i').attr('class', 'fa fa-spinner fa-spin');

      const urlBuilder = new theme.urlBuilder(url);
      const pageUrl = urlBuilder.addParam('request_type', 'ajax').addParam('request_action', 'collection_products').url();
      
    	$.get(pageUrl, function(data)
			{
        removeCountdownProducts();
      
        const html = $('<div></div>').append(data);
      	const productHtml = html.find('.product-grid').html();
        const paginationElem = html.find('.pagination-'+direction);
      
        if( direction === 'previous' )
        {
          $('.product-grid').prepend( productHtml );
        }
        else
        {
          $('.product-grid').append( productHtml );
        }
        
        if( paginationElem.length > 0 )
        {          
          $('.pagination-'+direction).html( paginationElem.html() );
        }
        else
        {
          $('.pagination-'+direction).remove();
        }
        
      	parseCountdownProducts();
        
        theme.lazyLoad();
        theme.productHandler.intersectProductBlocks();
        
        const loadedPageNumber = parseInt( currentPage ) + (direction === 'previous' ? -1 : 1);
        
        window.history.replaceState({}, $(data).find('title').text(), 'page'+loadedPageNumber+'.html'+document.location.search);
        
        // Set in storage
        theme.collection.page = loadedPageNumber;
      }).done(function() {
      	var prodUrlList = [];
      

      
    $('#collection .product-col').each(function(){
        var cur = $(this);
      	var prodUrl = $(this).attr('data-prod-url');
      	var skus = []
        if(!cur.hasClass('loaded')){
          $.get(shopUrl + prodUrl + '?format=json', function(data){
            // console.log(data);
            var product = data.product;
            const {variants} = product;


            const variantsArray = Object.values(variants);

            variantsArray.forEach(variant => {
              if (!skus.includes(variant.sku)) {
                skus.push(variant.sku);
              }
            })
            console.log('3');

            collectionVariantColors(skus, cur);
            // if(skus.length > 1 && !cur.find('.color-circles').hasClass('counter-active')){
            //   cur.find('.color-circles').append('<div class="collection-dot-counter">+'+ skus.length +'</div>');
            // }
          }).done(function(){
            cur.find('.color-circles').addClass('counter-active');
            cur.addClass('loaded');
          });
        }
    	});
      });
        
    });
    
  }
  // INFINITE SCROLL
  
  $('.copy-link').on('click', function(e)
	{       
    var tempInput = document.createElement("input");
    tempInput.style = "position: absolute; left: -10000px; top: -10000px";
    tempInput.value = $(this).attr('href');
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    
    document.body.removeChild(tempInput);
    
    $(this).attr('data-original-title', 'Copied!');
    //$(this).tooltip('hide');
    //$(this).tooltip('update');
    // $(this).tooltip('show');
    
    e.preventDefault();
  });
  
  $('.toggle-title').on('click', function(e)
  {
    theme.log('toggling sibling');
    
    e.preventDefault();
    
    const title = $(this);
    const content = title.next();
    const contentHeight = content.prop('scrollHeight');
    
    // Only if we have content to toggle, we could also misuse the toggle title class for styling purposes
    if( !content.hasClass('toggle-content') )
    {
      return;
    }
    
    // Handle mobile only toggles
    if( title.hasClass('toggle-title-md') && window.innerWidth > 767 )
    {
      return;
    }
    
    if( title.hasClass('toggle-active') )
    {
      content.css('height', '0px');
    }
    else
    {
      content.addClass('toggle-active');
      content.css('height', contentHeight+'px');
    }
    
    title.toggleClass('toggle-active');
  });
  
  // Init
  theme.events.init(); // bind global listeners for specific theme events
  //theme.lazyLoad(); // load up initial dom elements lazy loading
	theme.productHandler.intersectProductBlocks(); // load up initial dom elements lazy loading
  theme.headerScroll.check(); // initial page load checking header/scroll position
});

$('#theme-messages').on('click', '.theme-message-close', function()
{
  var message = $(this).parent();

  message.animate({'right':'-500px', 'opacity': 0}, 500, function()
  {
    message.remove();
  });
});

if( theme.isDemoShop )
{
  if( !localStorage.getItem('theme_viewed_presets') )
  {
    const presetLink = $id('demo-preset-link');
    
    if( presetLink )
    {
      presetLink.addEventListener('click', function(e)
      {
        localStorage.setItem('theme_viewed_presets', true);
      });
      
      presetLink.parentNode.classList.add('preset-links-holder-active');
    }
  }
}

if( theme.settings.navigation_mode == 'menubar' && theme.settings.navbar_sub_brands )
{
  theme.navbarBrands = {
    limit: 9,
    waitingForAmount: null,
    injected: false,
    data: {},
    runWhenAjaxFinished: function()
    {
      theme.log('navbarBrands.runWhenAjaxFinished');
      if( theme.navbarBrands.waitingForAmount === 0 )
      {
        theme.log('theme.navbarBrands.waitingForAmount==0');
        theme.navbarBrands.inject( theme.navbarBrands.data );
      }
    },
    inject: function(jsonData)
    {
      theme.log('navbarBrands.inject');
      theme.navbarBrands.injected = true;
      sessionStorage.setItem('navbar_brands', JSON.stringify(jsonData) );
      
      $qsa('.navbar-brands-col').forEach(function(elem)
      {
        const mainId = elem.getAttribute('data-category-id');
        const data = jsonData[mainId];
        theme.log(data);
        
        if( data && Object.keys(data.brands).length > 1 )
        {
          theme.log(data.brands);
          
          const contentElem = elem.querySelector('.navbar-brands-list');
          let i = 0;
          
          contentElem.innerHTML = '';
          
          for( var key in data.brands )
          {
            if( key == 0 )
              continue;

            if( i > theme.navbarBrands.limit )
              break;

            const brand = data.brands[key];

            const link = document.createElement('a');
            link.innerText = (i === theme.navbarBrands.limit ? theme.text.viewAll : brand.title);
            link.classList.add('d-block', 'mt-1');
            if( i === theme.navbarBrands.limit )
            {
              link.classList.add('bold');
            }
            link.href = data.url + (i === theme.navbarBrands.limit ? '' : '?brand='+brand.id);

            contentElem.appendChild(link);

            i++;
          }
        }
        else
        {
          elem.remove();
        }
      });
    },
    run: function()
    {
      if( theme.navbarBrands.waitingForAmount !== null )
        return; //already run
      
      theme.log('theme.navbarBrands.run()');
      const links = $qsa('.navbar-main-link-dropdown');
      theme.navbarBrands.waitingForAmount = links.length;
      
      links.forEach(function(elem)
      {
        $.get( elem.href+'?format=json', function(data)
        {
          if( data.collection && data.collection.brands )
          {
          	theme.navbarBrands.data[ data.collection.category_id ] = {
              url: elem.href,
              brands: data.collection.brands
            };
          }
          
          theme.navbarBrands.waitingForAmount--;
          theme.navbarBrands.runWhenAjaxFinished();
        });
    	});
    },
    init: function()
    {
      theme.log('theme.navbarBrands.init()');
      if( sessionStorage.getItem('navbar_brands') )
      {
        theme.navbarBrands.inject( JSON.parse(sessionStorage.getItem('navbar_brands')) );
        return;
      }
      
      setTimeout(theme.navbarBrands.run, 2000);
    }
  };
  
   theme.navbarBrands.init();
}

if( (theme.shop.template == 'pages/blog-short.rain' || theme.shop.template == 'pages/blog.rain') && theme.settings.blog_tag_carousel_enabled )
{
  window.blogTagsScroller = new theme.horizontalScroller('#blog-tags-carousel', {enableNav: true});
}

// console.log('* Lightspeed theme designed by Dyvelopment.com *');
// console.log('* For custom design or other custom work contact us at www.dyvelopment.com *');

$.fn.toggleHtml = function(t1, t2){
  if (this.html() == t1) this.html(t2);
  else                   this.html(t1);
  return this;
};

$(document).ready(function(){
  
  // Color dots
  if($('.productpage .product-configure .product-variants').length > 0){
    var url = 'https://files.dbgadmin.nl/colors.json';
    var skus = $('.productpage .product-configure .product-variants').attr('data-sku');
    var colorCount = 0;
    var singleSku = skus.split(',');
    
    console.log(url)
    console.log(skus);
    
    $.get(url, function(json){
      console.log('ditmoetwerken')
      $.each(json, function(index, color){
        $.each(singleSku, function(index, sku){
          if(sku == color.sku){
            colorCount++;
            console.log(color.hex)
            $('.productpage .product-configure ul.circles').find('a[data-sku="'+color.sku+'"] .dot').css({'background-color': color.hex});
          }
        });
      });
     }).done(function(){
      if(colorCount > 0){
        $('.productpage .product-configure .color-label').removeClass('hidden');
        $('.productpage .product-configure .variant-label').addClass('hidden');
        $('.productpage .product-configure .circle-wrap').removeClass('hidden');
        $('.productpage .product-configure .product-variants').addClass('color');
        $('.productpage .product-configure select#product_configure_variants').addClass('hidden');
      } else {
        $('.productpage .product-configure .color-label').addClass('hidden');
        $('.productpage .product-configure .variant-label').removeClass('hidden');
      }
    });
  }
  // End color dots
  $('.calc.product-calc-btn').on('click', function(){
  	var lengthCm = $('#lengte').val() * 100;console.log(lengthCm, 'lengthCm');
    var widthCm = $('#breedte').val() / 10;console.log(widthCm, 'widthCm');
    var depthCm = $('#diepte').val() / 10;console.log(depthCm, 'depthCm');
    var volumeMl = lengthCm * widthCm * depthCm;console.log(volumeMl, 'volumeMl');
    var volumePiece = $(this).data('vol');console.log(volumePiece, 'volumePiece');
    var piecesNeeded = Math.ceil(volumeMl / volumePiece);console.log(piecesNeeded, 'piecesNeeded');
    
    $('.product-calculator .result .items').html(piecesNeeded+' stuks');
    $('.product-calculator .result').removeClass('hidden');
    $('.product-calculator .result .btn span').html(piecesNeeded);
    $('.product-calculator .result input').val(piecesNeeded);
    
  });

  
  if(template == 'pages/collection.rain'){
    var prodUrlList = [];
    $('#collection .product-col').each(function(){
        var cur = $(this);
      	var prodUrl = $(this).attr('data-prod-url');
      		var skus = []
        if(!cur.hasClass('loaded')){
      	$.get(shopUrl + prodUrl + '?format=json', function(data){
          // console.log(data);
          var product = data.product;
					const {variants} = product;
					
          const variantsArray = Object.values(variants);
					
          variantsArray.forEach(variant => {
          	if (!skus.includes(variant.sku)) {
            	skus.push(variant.sku);
            }
          })
          console.log('4');

          collectionVariantColors(skus, cur);
          if(skus.length > 1 && !cur.find('.color-circles').hasClass('counter-active')){
          	// cur.find('.color-circles').append('<div class="collection-dot-counter">+'+ skus.length  +'</div>');
          }
        }).done(function(){
      		cur.find('.color-circles').addClass('counter-active');
          cur.addClass('loaded');
    		}); 
        }
    });
  }
});

function quickvieuwColours(skus) {
  if($('#qs-variants #qs-variant-select').length > 0){
    var url = 'https://files.dbgadmin.nl/colors.json';
    var skus = skus;
    $.get(url, function(json){
      $.each(json, function(index, color){
        $.each(skus, function(index, sku){
          if(sku == color.sku){
            $('#qs-variants #qs-variant-select').find('option[data-sku="'+color.sku+'"]').append('<div class="qs-dot"style="background-color: '+color.hex+';"></div>');
          }
        });
      });
     }).done(function(){
      var sel = $('#qs-variants #qs-variant-select').find('option:selected');
      var dot = sel.find('.qs-dot').addClass('selected');
      $('#qs-variants').append(dot);
    });
  }
}

function collectionVariantColors(skus, cur){
  console.log('5');
  if(!cur.hasClass('loaded')){
  	if($('#collection .product-col').length > 0){
  	var prodList = [];
    var colorUrl = 'https://files.dbgadmin.nl/colors.json';
    var skus = skus;
    var listItemCounter = 0;
    var colorOptions = 0;
    
    $.get(colorUrl, function(json){
      console.log('test2');
      $.each(json, function(index, color){
        $.each(skus, function(index, sku){
          if(sku == color.sku){
               listItemCounter++; 
            		colorOptions++
            if(listItemCounter < 5 && !cur.find('.color-circles-list').hasClass('color-done') ){
              // $('#collection .product-col').find('.color-circles-list').append('<li class="collection-dot"style="background-color: '+color.hex+';"></li>');
                cur.find('.color-circles-list').append('<li class="collection-dot"style="background-color: '+color.hex+';"></li>');
              	// if(skus.length > 1 && !cur.find('.color-circles').hasClass('counter-active')){
              	// 	cur.find('.color-circles').append('<div class="collection-dot-counter">+'+ (skus.length - listItemCounter)  +'</div>');
              	// }
                // listItemCounter++; 
            }
          }
        });
      });
     }).done(function(){
      cur.find('.color-circles-list').addClass('color-done');
      cur.addClass('loaded');
      cur.find('.color-circles').addClass('counter-active');
      if(skus.length > 5 && colorOptions != 0){
      	cur.find('.color-circles').append('<div class="collection-dot-counter">+'+ colorOptions +'</div>');
      }
    });
  }
  }
}