(function(module){
  Post.all = [];

  function Post(option){
    this.title = option.title;
    this.publishedOn = option.publishedOn;
    this.category = option.category;
    this.body = option.body;
    this.projectURL = option.projectURL;
  }

  Post.prototype.toHtml = function() {
    var theTemplateScript  = $('#post-template').html();
    var theTemplate = Handlebars.compile(theTemplateScript);

    /*** Calculation for how long ago a post was created ***/
    this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
    this.dateInfo = this.publishedOn ? 'Published ' + this.daysAgo + ' days ago' : '(draft)';

    var context = {
      'category': this.category,
      'title': this.title,
      'publishedOn': this.publishedOn,
      'projectURL': this.projectURL,
      'body': this.body,
      'dateInfo': this.dateInfo
    };

    var theCompiledHml = theTemplate(context);

    return theCompiledHml;
  };

  Post.loadAll = function(sourceData){
    /***Sorts blog by newest projects first ***/
    sourceData.sort(function(a,b) {
      return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
    });

    /*** Add JSON data to the Post array and write to the html ***/
    Post.all = sourceData.map(function(el){
      return new Post(el);
    });
  };



  Post.fetchAll = function(callback){
      /*** Get eTag to see if the file on the server was changed ***/
      /*** This helps to make sure the data in local storage is up to date ***/
    $.ajax({
      method: 'HEAD',
      url: '/scripts/projectData.json',
      success: function(data, message, xhr){
        var newETag = xhr.getResponseHeader('ETag');
        var oldETag = localStorage.eTag;

        if (oldETag == newETag) {
          /***file wasn't modified so use cached version***/
          Post.loadAll(JSON.parse(localStorage.sourceData));
          callback();
        }
        else {
          /***the file on the server was modified or this is the first time loading the site...requesting the entire JSON file again***/
          localStorage.setItem('eTag', newETag);
          $.ajax('/scripts/projectData.json').done(function(returnedObj){
            localStorage.setItem('sourceData', JSON.stringify(returnedObj));
            Post.loadAll(returnedObj);
            callback();
          });
        }
      }
    });
  };

  module.Post = Post;
})(window);
