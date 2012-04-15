var flatiron = require('flatiron'),
    ecstatic = require('ecstatic'),
    path = require('path'),
    jsdom = require('jsdom'),
    request = require('request'),
    base = require('./app/controllers/base.js'),
    templates = require('./app/controllers/templates.js').templates,
    app = flatiron.app;

app.config.file({ file: path.join(__dirname, 'config', 'config.json') });

app.use(flatiron.plugins.http);
app.use(require('./plugins/hogan_templates'));

app.http.before.push(ecstatic(__dirname + '/public', { 
  autoIndex: false 
}));

app.routes = {
  '/': { 
    get: base.index,
    post: base.results 
  },
  '/js/templates.js': { get: templates }
};

app.router.mount(app.routes);

app.start(3000, function () {
  console.log('flatiron with http running on 3000');
});
