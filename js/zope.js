$.fn.serializeObject = function() {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
      if (o[this.name] !== undefined) {
          if (!o[this.name].push) {
              o[this.name] = [o[this.name]];
          }
          o[this.name].push(this.value || '');
      } else {
          o[this.name] = this.value || '';
      }
  });
    return o;
};

// var loadTemplates = function (names, callback) {

//     var that = this;

//     var loadTemplate = function (index) {
//         var name = names[index];
//         //console.log('Loading template: ' + name);
//         $.get('templates/' + name + '.html', function (data) {
//             that.templates[name] = data;
//             index++;
//             if (index < names.length) {
//                 loadTemplate(index);
//             } else {
//                 callback();
//             }
//         });
//     }

//     loadTemplate(0);
// };
Backbone.emulateHTTP = true; // Use _method parameter rather than using DELETE and PUT methods
Backbone.emulateJSON = true; // Send data to server via parameter rather than via request content
var Movie = Backbone.Model.extend({
    initialize: function() {
        //this.on('all', function(e) { console.log(this.get('title') + " event for single movie: " + e); });
    },
    defaults: {
        id: 'NA',
        avg_score: 0,
        summary: '',
        title: 'NA',
        updated_at: 'NA',
        img_url: 'NA',
        user: {
            id: 'NA',
            username: 'NA',
        }
    },
    urlRoot: "http://cs3213.herokuapp.com/movies/",
    url: function() {
        var base = this.urlRoot || (this.collection && this.collection.url) || "/";
        return base + "/" + (this.id) + ".json";
    }
});

var Review = Backbone.Model.extend({
    defaults: {
        id: 'NA',
        movie_id: 'NA',
        comment: 'NA',
        score: 'NA',
        updated_at: 'NA',
        user: {
            id: 'NA',
            username: 'NA',
        }
    },
    urlRoot: "http://cs3213.herokuapp.com/movies/",
    url: function() {
        var base = this.urlRoot || (this.collection && this.collection.url) || "/";
        return base  + (this.id) + ".json/reviews.json";
    },
});

var Reviews = Backbone.Collection.extend({
    initialize: function(options) {
        this.id = options.id;
    },
    model: Review,
    comparator: function(review){
        var date = new Date(review.get("updated_at"));
        return -date.getTime();

    },
    urlRoot: "http://cs3213.herokuapp.com/movies/",
    url: function() {
        var base = this.urlRoot || (this.collection && this.collection.url) || "/";
        return base  + (this.id) + "/reviews.json";
    }
    
});

// To be used in the furute development
// var movie = new Movie({id:movie_id});
// movie.fetch(); // fetch model from DB with id = 1

// movie = new Movie({title:"Joe Zim", summary:'Good story'});
// movie.save(); // create and save a new model on the server, also get id back and set it

// movie = new movie({id:1, name:"Joe Zim", age:23});
// movie.save(); // update the model on the server (it has an id set, therefore it is on the server already)
// movie.destroy(): // delete the model from the server

var MovieList = Backbone.Collection.extend({
    initialize: function() {
        //this.on('all', function(e) { console.log(e); });
    },
    model: Movie,
    url: "http://cs3213.herokuapp.com/movies.json"
});   

var AppRouter = Backbone.Router.extend({
    routes: {
        "": "defaultRoute",
        "movie/:id": "viewMovieDetails",
        "movie/new": "createNewMovie",
        "user/profile": "viewUserProfile",
    }
});

// var MovieItemView = Backbone.View.extend({
//     initialize: function() {
//         this.render();
//     },
//     render: function() {
//         var template = _.template( $("#movieListItem").html(), {movie: this.model} );
//         this.$el.html(template);
//     }
// })

var MovieListView = Backbone.View.extend({
    initialize: function() {

        this.render();
    },
    render: function() {
       var self = this;
       var movieListModel = new MovieList();
       movieListModel.fetch({
        success: function (movieListModel){
            console.log(movieListModel);
            var template = _.template($("#movieListTemplate").html(), {movies: movieListModel.models});
            self.$el.html(template);
        },
        error: function(model, xhr, options){
            console.log(model);
            console.log(xhr);
            console.log(options);
        }
    });
        // Compile the template using underscore
    }});

var movie = new Movie();
var reviews;

var MoviePage = Backbone.View.extend({
    render: function (){
        var template = _.template( $("#movie_info_template").html(), {movie: movie} );
        $("#list_container").html(template);
        var review_template = _.template($("#review_template").html(), {reviews: reviews.models});
        $("#list_container").append(review_template);
        var write_review_template = _.template( $("#write_review_template").html(), {id:movie.get("id")} );
        $("#list_container").append(write_review_template);
    },
    events: {
        'submit .new-review-form' : 'saveReview'
    },
    saveReview: function(ev) {
        var reviewDetail = $(ev.currentTarget).serializeObject();
        reviewDetail["data"]["access_token"] = "177b2714bdf3bde52f866f5f36aaddc1"; 
        var newReview = new Review();
        console.log(reviewDetail);
        newReview.save(reviewDetail, {
            success: function (reviewDetail) {
                router.navigate('', {trigger:true});
                reviews.add(newReview);
                this.render();
            },
            error: function (){
                alert("You are not allowed to write a review");
            }
        });
        return false;
    }
});



    // Initiate the router
    var app_router = new AppRouter();

    app_router.on('route:defaultRoute', function(actions) {
        var movieListView = new MovieListView({ el: $("#list_container") });
    });
    app_router.on('route:viewMovieDetails', function(id) {
        var moviePage = new MoviePage({ el: $("#list_container") });
        movie.set({id:id});
        movie.fetch({
            success: function(movie) {
                //console.log(movie.toJSON());
                reviews = new Reviews({id:id});
                reviews.fetch({
                    success: function(reviews) {
                        //console.log(reviews.toJSON());
                        moviePage.render();
                    }
                });
            }
        });
    });
    app_router.on('route:createNewMovie', function() {

    });
    app_router.on('route:viewUserProfile', function() {

    });

    // Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start();

function regulate_length(long_string){
    var max_length = 24;

    if (long_string.length > max_length - 3){
        long_string = long_string.substring(0, max_length - 3) + '...';
    }

    return long_string;
}

function regulate_decimal_points(number){
    var decimal_points = 2;
    var zeros = decimal_points * 10;
    console.log(number);
    return parseFloat(Math.round(number * zeros) / zeros).toFixed(decimal_points);
}



