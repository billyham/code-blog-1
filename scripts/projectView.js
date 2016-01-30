(function(module) {
  var projectView = {};

  projectView.handleNavTabs = function(){
    $('.tab').hide();
    $('#main-nav').on('click', '.tabLink', function(event){
      event.preventDefault();
      var clickedLink = event.currentTarget;
      var tabId = $(this).data('tab');
      /*** Show/hide the correct tab ***/
      $('#'+ tabId).show();
      $('#'+ tabId).show().siblings().hide();
      /*** Underline active tab***/
      $('.tabLink').each(function(){
        $(this).removeClass('active');
      });
      $(clickedLink).addClass('active');
    });
  };

  projectView.populateFilters = function(){
    /*** Populate filters using a Handlebars template ***/
    var source = $('#filter-template').html();
    var filterTemplate = Handlebars.compile(source);

    var content = {
      filter: [ ]
    };

    /***Scan through categories in projectData and populate the drop down choices***/
    $('article').each(function(){
      var value = $(this).data('category');
      /*** Checking to see if the value already exists in the array ***/
      if (content.filter.indexOf(value) == -1) {
        content.filter.push(value);
      }
    });

    var compiledHtml = filterTemplate(content);
    $('#category-filter').append(compiledHtml);
    /*** End handlebars code ***/

  };

  projectView.handleCategoryFilter = function(){
    $('#category-filter').on('change', function(){
      var selectedOption = $(this).val();
      if(selectedOption){
        $('article').hide().each(function(){
          if($(this).data('category') == selectedOption){
            $(this).show();
          }
        });
      }
      else {
        /***Show all posts if the first item in the dropdown is selected***/
        $('article').show();
      }
    });
  };

  projectView.setPreview = function(){
    /*** Display only the first paragraph in the post body ***/
    $('.post_body *:nth-of-type(n+2)').hide();
    /***add event handler to display the full post body on click here***/
    $('article').on('click', '.read_more ', function(event){
      var clickedLink = $(this);
      event.preventDefault();
      $(this).parent().find('.post_body *:nth-of-type(n+2)').slideToggle(function(){
        if($(this).is(':visible')){
          clickedLink.html('<a>Read Less</a>');
        }
        else {
          clickedLink.html('<a>Read More</a>');
        }
      });
    });
  };

  projectView.initStats = function(){
    /*** Calc total num words in all posts ***/
    var wordTotal = Post.all.map(function(post){
      return post.body.match(/\b\w+/g).length;
    }).reduce(function(a, b){
      return a + b;
    });

    /*** Build handlebars template and append to the DOM ***/
    var statsTemplateScript = $('#stats-template').html();
    var statsTemplate = Handlebars.compile(statsTemplateScript);
    var statsContent = {
      'postNum': Post.all.length,
      'postWordTotal': wordTotal,
      'avgPostWord': (wordTotal/Post.all.length).toFixed(2)
    };
    var compiledHTML = statsTemplate(statsContent);

    $('#stats_content').append(compiledHTML);
  };

  projectView.initHomePage = function(){
    /*** Writes blog posts to the page and enables views ***/
    var postHtml = Post.all.map(function(content){
      return content.toHtml();
    });

    $('#articles').append(postHtml);

    projectView.initStats();
    projectView.handleNavTabs();
    projectView.populateFilters();
    projectView.handleCategoryFilter();
    projectView.setPreview();
  };
  module.projectView = projectView;
})(window);
