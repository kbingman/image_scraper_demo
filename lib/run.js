var jsdom  = require('jsdom'),
    request = require('request'),
    cleaner = require('./cleaner.js'),
    fs = require('fs');
    
request({ uri: 'http://tokyocamerastyle.com' }, function (error, response, body) {
  if (error && response.statusCode !== 200) {
    console.log('Error when contacting ' + 'http://tokyocamerastyle.com' );
  }
    
  jsdom.env({
    html: body,
    scripts: ['ender.js']
  }, function(errors, window) {
    if(errors){
      console.log(errors)
    }
    var $ = window.$;
    var images = $('img');
    var imageList = [];
    var matchTerm = 'avatar';
    var regex = new RegExp(matchTerm);
    
    console.log($('title').text());
    
    
    images.forEach(function(i){
      var src = $(i).attr('src');
      
      if(src.match(regex)){
        imageList.push(src)
      } 
    });

    console.log(imageList);
  });
});






