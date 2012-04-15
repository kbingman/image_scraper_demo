var View = {
  
  // Renders a hogan template. Takes template, data, partials options.
  // 'method' is the jQuery method used to render, i.e. 'append', 'prepend', 'html', etc.
  // If this option is left blank, 'append' will be used.
  renderTemplate: function(options){
    var html = this.renderHtml(options),
        method = options.method || 'append';
    
    $(options.target)[method](html);
  },
  
  renderHtml: function(options){
    var template = new Hogan.Template(Templates[options.template]),
        partials = {};
        
    if(options.partials){
      options.partials.forEach(function(partial){ 
        partials[partial] = new Hogan.Template(Templates[partial]);
      });
    }
    return template.render(options.data, partials);
  },
  
  sortImages: function(images, matchTerm){
    var imageList = [],
        regex = new RegExp(matchTerm);
    
    images.forEach(function(image){
      if(image.src.match(regex)){
        imageList.push(image);
      } 
    });
    return imageList;
  },
  
  // Renders the complete images results, with site info
  renderCompleteResults: function(data, matchTerm){
    var images = View.sortImages(data.images, matchTerm)
    View.renderTemplate({
      template: 'index/results',
      data: {
        siteUrl: data.siteUrl,
        title: data.title,
        images: images,
        imageCount: images.length,
        showImages: true
      },
      partials: ['index/image'],
      target: '#results',
      method: 'html'
    });
    View.centerAndResize(images);
  },
  
  // Renders only the images, based on the current search term
  renderImages: function(matchTerm){
    var images = View.sortImages(View.currentImages, matchTerm); 
    View.renderTemplate({
      template: 'index/image',
      data: {
        images: images,
      },
      target: '#images',
      method: 'html'
    });
    $('#count').text(images.length);
    View.centerAndResize(images);
  },
  
  buildBubbleNav: function(){
    var imagesContainer = $('ul#images'),
        imageEl = $('#images li'),
        numberOfImages = imageEl.length,
        scrollerWindowWidth = $('div.scroller').width(),
        step = imageEl.width() + 12,
        rows = scrollerWindowWidth > 740 && scrollerWindowWidth < 960 ? 1 : 2, 
        scrollerWidth = Math.ceil(numberOfImages / rows) * step,
        numberOfPanes = Math.ceil(scrollerWidth / scrollerWindowWidth),
        links = [];
        
    imagesContainer.css({ 
      'width': scrollerWidth,
      'margin-left': 0 
    });
    
    // resizes the gallery if tablet is horizontal
    if(rows == 1){
      $('div.scroller').height('210');
    } else {
       $('div.scroller').height('420');
    }
    
    (numberOfPanes).times(function(i){ links.push({ index: i, title: i + 1 }) });
    
    View.renderTemplate({
      template: 'index/bubble_nav',
      data: {
        links: links
      },
      target: '#bubble-container',
      method: 'html'
    });
    
    var linkEl = $('#bubble-nav a');
    linkEl.unbind('click').first().addClass('active');
    linkEl.bind('click', function(e){
      e.preventDefault();
      // gets width again in case of resize
      var index = parseInt($(this).text()),
          leftMargin = -1 * ((index-1) * (Math.floor(scrollerWindowWidth / step) + 1) * step); 
          // leftMargin = -1 * ((scrollerWindowWidth - 1) * (index - 1));
      
      imagesContainer.css({ 
        'margin-left': leftMargin,
        '-webkit-transition': 'margin-left 0.5s linear',
        'transition': 'margin-left 0.5s linear'
      });
      linkEl.removeClass('active');
      $(this).addClass('active');
    });
  },
  
  centerAndResize: function(images){
    var display = $('#images .display'),
        displayHeight = display.height(),
        displayWidth = display.width();;
        
    View.buildBubbleNav();
    $('div#results img').css({ 'opacity': 0}).load(function(){
      var image = this;
      
      setTimeout(function(){
        var img = $(image)
            width = img.width(),
            height = img.height();

         if(width > displayWidth){
           img.css({
             'width': displayWidth + 'px',
             'display': 'inline', 
             'opacity': 1,
             '-webkit-transition': 'opacity 0.3s linear',
             'transition': 'opacity 0.5s linear',
             'margin-top': Math.round((displayHeight - (height * displayWidth/width))/2) + 'px'
           });
         } else {
           img.css({ 
             'display': 'inline', 
             'opacity': 1,
             '-webkit-transition': 'opacity 0.3s linear',
             'transition': 'opacity 0.5s linear',
             'margin-top': (displayHeight - height)/2 + 'px' 
           });
         }
      }, 100);
    });
  }
  
};
