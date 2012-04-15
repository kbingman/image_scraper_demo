var should = require('should'),
    Browser = require('zombie'),
    browser = new Browser(),
    base_url = 'http://localhost:3000';

describe('Loads pages', function(){

  it('should load the front page', function(done){
    browser.visit(base_url, function () {
      browser.text('title').should.equal('Scrapomatic!');
      done();
    });
  });
  
  it('should have a .container div', function(done){
    browser.visit(base_url, function () {
      browser.html('div.container').should.not.be.empty;
      done();
    });
  });
  
});

describe('Image Scraper', function(){
  
  it('should show the requested URL', function(done){
    browser.visit(base_url, function() {
      browser.
        fill('site_url', 'http://tokyocamerastyle.com').
        fill('match_term', 'tumblr').
        pressButton('Submit', function(err, browser) {
          browser.text('#results h2').should.equal('URL: http://tokyocamerastyle.com');
          done();
        });  
    });
  });
  
  it('should show the scraped title', function(done){
    browser.visit(base_url, function() {
      browser.
        fill('site_url', 'http://tokyocamerastyle.com').
        fill('match_term', 'tumblr_').
        pressButton('Submit', function(err, browser) {
          browser.text('#results h3').should.include('tokyo camera style');
          browser.text('#results h3').should.include('10');
          done();
        });  
    });
  });
  
  it('should show the scraped images with no search term', function(done){
    browser.visit(base_url, function() {
      browser.
        fill('site_url', 'http://tokyocamerastyle.com').
        fill('match_term', '').
        pressButton('Submit', function(err, browser) {
          browser.queryAll('#results ul li').length.should.within(70, 200);
          done();
        });  
    });
  });
  
  
  it('should show the scraped images with the tumblr_ search term', function(done){
    browser.visit(base_url, function() {
      browser.
        fill('site_url', 'http://tokyocamerastyle.com').
        fill('match_term', 'tumblr_').
        pressButton('Submit', function(err, browser) {
          browser.queryAll('#results ul li').length.should.equal(10);
          done();
        });  
    });
  });
  
  it('should show the scraped images with the avatar search term', function(done){
    browser.visit(base_url, function() {
      browser.
        fill('site_url', 'http://tokyocamerastyle.com').
        fill('match_term', 'avatar').
        pressButton('Submit', function(err, browser) {
          browser.queryAll('#results ul li').length.should.within(20, 70);
          done();
        });  
    });
  });
  
  
  it('should show not reload the images if the site url does not change', function(done){
    browser.visit(base_url, function() {
      browser.
        fill('site_url', 'http://tokyocamerastyle.com').
        fill('match_term', 'avatar').
        pressButton('Submit', function(err, browser) {
          browser.queryAll('#results ul li').length.should.within(20, 70);
          browser.fill('match_term', '500').pressButton('Submit', function(err, browser) {
            browser.queryAll('#results ul li').length.should.be.within(10,15);            
            done();
          });  
        });  
    });
  });
  
});

