var fs = require('fs'),
    path = require('path'),
    hogan = require('hogan.js'),
    async = require('async'),
    Partials = exports;

Partials.attach = function (options) {
  
  // Currently compiles all the partials, as this is not too slow
  // this may need to change if there are a lot of partials
  this.partials = function(callback) {
    var path = '/../app/templates',
        files = [],
        results = {};

    fs.readdir(__dirname + path, function(err, folders) {
      if(err) return callback(err);
      
      var read_files = function(folder, done){
        var folderPath = __dirname + path + '/' + folder;
      
        fs.readdir(folderPath, function(err, f) {
          if(err) return callback(err);
          f.forEach(function(file){
            files.push(folderPath + '/' + file)
          });
          done();
        });
      };
    
      var compile_file = function(file_path, done) {
        fs.readFile(file_path, function(err, contents) {
          if(err) return done(err);
    
          var compiled = hogan.compile(contents.toString()),
              path_segments = file_path.split('/'),
              folder_name = path_segments[path_segments.length - 2],
              file_name = path_segments[path_segments.length - 1].split('.')[0],
              name = folder_name + '/' + file_name;
        
          results[name] = compiled;
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
  },
  
  this.render = function(template_name, data, callback){ 
    this.partials(function(err, partials){
      if(err){
        return callback(err);
      } else {
        var partial = partials[template_name]; 
        if(callback) callback(partial.render(data, partials));
      }
    });
  },
  
  // app has to be sent here, because our local copy does not contain the request or response.
  this.renderLayout = function(app, content, layout){
    var layout = layout ? layout : 'application';
    var layout_path = path.join(__dirname, '../app/layouts', layout + '.mustache');
    
    fs.readFile(layout_path, 'utf8', function(error, html){
      if(error){
        console.log(error);
        app.res.writeHead(500, { 'Content-Type': 'text/html' });
        app.res.end('error');
      } else {
        var output = hogan.compile(html);

        app.res.writeHead(200, { 'Content-Type': 'text/html' });
        app.res.end(output.render({ content: content }));
      }
    });
  }
  
};
