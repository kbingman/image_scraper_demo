var flatiron = require('flatiron'),
    app = flatiron.app,
    jsdom = require('jsdom'),
    request = require('request'),
    Base = exports;
    
Base.index = function(name){
  var self = this, data;

  app.render('index/image_import_form', data, function(template){
    app.render_layout(self, template);
  }); 
  
};

Base.results = function(name){
  var self = this,
      siteUrl = this.req.body.siteUrl,
      matchTerm = this.req.body.matchTerm;

  // Move this somewhere
  // if(!siteUrl.match(/^(http|https):\/\//)){
  //   siteUrl = 'http://' + siteUrl;
  // }
  Base.request(siteUrl, function(response){
    self.res.json({
      siteUrl: siteUrl,
      title: response.title,
      images: response.images
    });
  });
};

Base.request = function(siteUrl, callback){
  console.log(siteUrl)
  request({ uri: siteUrl }, function (error, response, body) {
    if (error) {
      //&& response.statusCode !== 200
      console.log(error);
      callback(Base.errorMessage);
      return;
    }
    Base.scapeImages(body, callback);
  });
};

Base.scapeImages = function(body, callback){
  jsdom.env({
    html: body,
    scripts: ['./lib/ender.js']
  }, function(error, window) {
    if(error){
      console.log(error);
      callback(Base.errorMessage);
      return;
    } 
    var $ = window.$, images = $('img');
          
    images = images.map(function(i){
      var src = $(i).attr('src');
      return { 
        src: src,
        filename: src.split('/')[src.split('/').length - 1]
      };
    });
                  
    callback({ title: $('title').text(), images: images });
  });
}

Base.errorMessage = { 
  title: 'We are sorry, there was a problem fetching the requested site.', 
  images: []
}
