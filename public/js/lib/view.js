var View = {
  
  // Renders a hogan template. Takes template, data, partials options.
  // 'method' is the jQuery method used to render, i.e. 'append', 'prepend', 'html', etc.
  // If this option is left blank, 'append' will be used.
  render_template: function(options){
    var html = this.render_html(options),
        method = options.method || 'append';
    
    $(options.target)[method](html);
  },
  
  render_html: function(options){
    var template = new Hogan.Template(Templates[options.template]),
        partials = {};
        
    // console.log(options)
    if(options.partials){
      options.partials.each(function(partial){ 
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
  }
  
  
};
