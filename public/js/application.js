$(document).ready(function(){
  
  $('form#select-image button').click(function(e){
    e.preventDefault();
    
    var form = $(this).parents('form'),
        siteUrl = form.find('input#site_url').val().toLowerCase(),
        matchTerm = form.find('input#match_term').val().toLowerCase();

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
        View.renderImages(matchTerm);
        return;
      }   
      
      // Clears out the previous results
      View.renderTemplate({
        template: 'index/results',
        data: {
          siteUrl: siteUrl,
          title: 'Waiting for response...',
          showImages: false
        },
        target: '#results',
        method: 'html'
      });
      
      $.ajax({
        url: '/',
        method: 'POST',
        type: 'json',
        data: { siteUrl: siteUrl, matchTerm: matchTerm },
        success: function(data){ 
          View.currentImages = data.images; 
          View.currentSite = data.siteUrl;  
          View.renderCompleteResults(data, matchTerm);
        }
      });
    }
  });
  
  $(window).resize(function(){
    View.buildBubbleNav();
  });
  
});
