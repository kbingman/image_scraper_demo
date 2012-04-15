var flatiron = require('flatiron'),
    app = flatiron.app,
    jsdom = require('jsdom'),
    request = require('request'),
    cleaner = require('../../lib/cleaner'),
    Base = exports;
    
Base.index = function(name){
  var self = this, data;

  app.render('index/image_import_form', data, function(template){
    app.renderLayout(self, template);
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
  Base.request(siteUrl, function(body){
    Base.scrapeImages(body, siteUrl, function(response){
      self.res.json({
        siteUrl: siteUrl,
        title: response.title,
        images: response.images
      });
    });
  });
};

// Makes a request to the desired site
Base.request = function(siteUrl, callback){
  request({ uri: siteUrl }, function (error, response, body) {
    if (error) {
      //&& response.statusCode !== 200
      console.log(error);
      callback(Base.errorMessage);
      return;
    }
    callback(body);
  });
};

// Scrapes the response for
Base.scrapeImages = function(body, siteUrl, callback){
  jsdom.env({
    html: body,
    scripts: ['./lib/ender.js']
  }, function(error, window) {
    if(error){
      console.dir(error);
      callback(Base.errorMessage);
      return;
    } 
    var $ = window.$;
    var images = $('img').map(function(image){
      var src = $(image).attr('src');
      // checks for relative paths
      src = Base.unrelativize(src, siteUrl);
      return { 
        src: src,
        filename: Base.extractFilename(src)
      } 
    });
    var response = { 
      title: $('title').text(), 
      images: images
    };
                
    callback(response);
  });
}

Base.unrelativize = function(src, siteUrl){
  if(!src.match(/^(http|https):\/\//)){
    if(siteUrl.match(/(\.html|\.htm)$/)){
      var parts = siteUrl.split('/');
      delete parts[parts.length - 1]
      siteUrl = parts.join('/');
    }
    src = siteUrl + src.replace(/^\//,'');
  }
  return src;
}

Base.extractFilename = function(src){
  var filename = src.split('/')[src.split('/').length - 1];
  filename = filename.split('?')[0]
  return filename;
}

Base.errorMessage = { 
  title: 'We are sorry, there was a problem fetching the requested site.', 
  images: []
}
