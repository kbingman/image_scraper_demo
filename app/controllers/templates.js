var fs = require('fs'),
    hogan = require('hogan.js'),
    async = require('async');

var compile = function (callback) {
  var path = '/../templates';
  var results = 'var Templates={};';
  var files = [];

  
  fs.readdir(__dirname + path, function(err, folders) {
    var read_files = function(folder, done){
      var folder_path = __dirname + path + '/' + folder;
      
      fs.readdir(folder_path, function(err, f) {
        if(err) return callback(err);
        f.forEach(function(file){
          files.push(folder_path + '/' + file)
        });
        done();
      });
    };
    
    var compile_file = function(file_path, done) {
      fs.readFile(file_path, function(err, contents) {
        if(err) return done(err);
    
        var compiled = hogan.compile(contents.toString(), { asString : true }),
            path_segments = file_path.split('/'),
            folder_name = path_segments[path_segments.length - 2],
            file_name = path_segments[path_segments.length - 1].split('.')[0];
        
        results = results + "\nTemplates['" + folder_name + '/' + file_name + "']=" + compiled;
        done();
      });
    };
    
    async.forEach(folders, read_files, function(err) {
      if(err) return callback(err);
      async.forEach(files, compile_file, function(err) {
        if(err) return callback(err);
        callback(null, results);
      });
    });
  });
}

// Exports
exports.templates = function(next) {
  var app = this;
  compile(function(err, results) {
    if(err) return next(err);
    
    app.res.writeHead(200, { 
      'Content-Type': 'text/javascript', 
      'Cache-Control': 'max-age=3000, public' 
    });
    app.res.end(results);
  });
};
