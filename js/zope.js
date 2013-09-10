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
        this.on('all', function(e) { console.log(this.get('title') + " event: " + e); });
    },
    defaults: {
        id: 'NA',
        summary: 'NA',
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
        return base + "/" + encodeURIComponent(this.id) + ".json";
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
        this.on('all', function(e) { console.log("Movie event: " + e); });
    },
    model: Movie,
    url: "http://cs3213.herokuapp.com/movies"
});    

var AppRouter = Backbone.Router.extend({
    routes: {
        "": "defaultRoute",
        "movie/:id": "viewMovieDetails",
        "movie/new": "createNewMovie",
        "user/profile": "viewUserProfile",
    }
});

var MovieModel = Backbone.Model.extend({
    initialize: function() {
    }
})

var MovieItemView = Backbone.View.extend({
    initialize: function() {
        this.render();
    },
    render: function() {
        var template = _.template( $("#movieListItem").html(), {movie: this.model} );
        this.$el.html(template);
    }
})

var MovieListView = Backbone.View.extend({
    initialize: function() {
        this.render();
    },
    render: function() {
        var movieListModel = new MovieList();
        movieListModel.fetch({
            success: function (movieListModel){
                var template = _.template($("#movieListTemplate").html(), {movies: movieListModel.models});
            }
        });
        // Compile the template using underscore
    }});


    // Initiate the router
    var app_router = new AppRouter;

    app_router.on('route:defaultRoute', function(actions) {
        var movieListView = new MovieListView({ el: $("#list_container") });
        movieListView.render();
    });
    app_router.on('route:viewMovieDetails', function(id) {

    });
    app_router.on('route:createNewMovie', function() {

    });
    app_router.on('route:viewUserProfile', function() {

    });

    // Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start();



