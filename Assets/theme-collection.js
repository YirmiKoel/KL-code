theme.collectionFeatures = {
  eventHandlers: {
    onThemeCollectionChanged: function(e)
    {
      console.log('theme.collectionFeatures.eventHandlers.onThemeCollectionChanged()');
      theme.collectionFeatures.eventHandlers.onProductGridChanged(e);
      
      if( typeof parseCountdownProducts !== 'undefined' )
      {
        parseCountdownProducts();
      }
      
      theme.collectionFeatures.initPriceSlider();
    },
    onProductGridChanged: function(e)
    {
      console.log('theme.collectionFeatures.eventHandlers.onProductGridChanged()');
      theme.lazyLoad();
      theme.productHandler.intersectProductBlocks();
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
          $(this).closest('form').submit();
        }
      });
  },
  init: function()
  {
    theme.collectionFeatures.initPriceSlider();
  }
};