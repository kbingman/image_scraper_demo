var should = require('should'),
    Base = require('../../app/controllers/base.js');

describe('Base', function(){

  // Mock this
  it('should request a page', function(done){
    Base.request('http://tokyocamerastyle.com', function(body){
      body.should.be.a('string');
      done();
    });
  });
  
  // Ender load paths get changed using mocha
  // so this does not work while testing
  // it('should scrape html for images a page', function(done){
  //   var html = '<html><body><div></div><div><img src="http://test.com/images/img.png"</div></body></html>';
  //   
  //   Base.scrapeImages(html, function(body){
  //     body.title.should.equal('We are sorry, there was a problem fetching the requested site.');
  //     done();
  //   });
  // });
  
  it('should fix relative paths with .html', function(done){
    Base.unrelativize('01.jpg', 'http://test.com/index.html').should.equal('http://test.com/01.jpg');
    done();
  });
  
  it('should fix relative paths with .htm', function(done){
    Base.unrelativize('01.jpg', 'http://test.com/index.htm').should.equal('http://test.com/01.jpg');
    done();
  });
  
  it('should fix relative paths', function(done){
    Base.unrelativize('01.jpg', 'http://test.com/').should.equal('http://test.com/01.jpg');
    done();
  });
  
  it('should fix complex relative paths', function(done){
    Base.unrelativize('/images/01.jpg', 'http://test.com/').should.equal('http://test.com/images/01.jpg');
    done();
  });
  
  it('should ignore absolute paths', function(done){
    Base.unrelativize('http://test.com/images/01.jpg', 'http://test.com/').should.equal('http://test.com/images/01.jpg');
    done();
  });
  
  it('should extract the filename', function(){
    Base.extractFilename('http://test.com/images/01.jpg').should.equal('01.jpg');
  });
  
  it('should extract the filename and remove params', function(){
    Base.extractFilename('http://test.com/images/01.jpg?12345').should.equal('01.jpg');
  });
  
});
