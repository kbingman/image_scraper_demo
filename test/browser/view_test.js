var should = chai.should();

describe('View', function(){

  it('should be defined', function(){
    View.should.be.a('object');
  });
  
  it('should render html', function(){
    var options = {
      template: 'test',
      data: { foo: 'bar' }
    };
    // console.log(template.render(options.data));
    View.render_html(options).should.equal('<h2>Test</h2>');
  });
  
});
