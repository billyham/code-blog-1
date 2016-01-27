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
    $.ajax('/scripts/projectData.json').done(function(returnedObj){
      Post.loadAll(returnedObj);
      callback();
    });
  };

  module.Post = Post;
})(window);
