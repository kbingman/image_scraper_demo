
$(document).ready(function(){
  
  $('form#select-image button').click(function(e){
    e.preventDefault();
    
    var form = $(this).parents('form'),
        siteUrl = form.find('input#site_url').val(),
        matchTerm = form.find('input#match_term').val();
        
 
    
    if(siteUrl == ''){
      alert('Please add a valid URL')
    } else {
      
      // Basic validation
      if(!siteUrl.match(/^(http|https):\/\//)){
        siteUrl = 'http://' + siteUrl;
      }
      
      // Just resorts the images from the current site, rather than 
      // fetching them again
      if(View.currentSite == siteUrl){
        View.render_template({
          template: 'index/image',
          data: {
            images: View.sortImages(View.currentImages, matchTerm)
          },
          target: '#images',
          method: 'html'
        });
        return;
      }   
      
      // Clears out the previous results
      View.render_template({
        template: 'index/results',
        data: {
          siteUrl: siteUrl,
          title: 'Waiting for response...'
        },
        target: '#results',
        method: 'html'
      });
      
      $.ajax({
        url: '/scrape',
        method: 'POST',
        type: 'json',
        data: { siteUrl: siteUrl, matchTerm: matchTerm },
        success: function(data){ 
          View.currentImages = data.images; 
          View.currentSite = data.siteUrl;  
          View.currentTitle = data.title;
                
          View.render_template({
            template: 'index/results',
            data: {
              siteUrl: data.siteUrl,
              title: data.title,
              images: View.sortImages(View.currentImages, matchTerm),
              showImages: View.sortImages(View.currentImages, matchTerm).length ? true : false
            },
            partials: ['index/image'],
            target: '#results',
            method: 'html'
          });
        }
      });
      
    }

  });
  
});




