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
        "new": "createNewMovie",
        "user/profile": "viewUserProfile",
    }
});

var MovieItem = Backbone.Model.extend({
    initialize: function() {

    },
    render: function() {

    }
})

var MovieCreation = Backbone.View.extend({
    el: '.list_container',
    render : function(id) {
        var template = _.template( $("#movie_creation").html(), {} );
        this.$el.html(template);
    }
});

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


    // Initiate the router
    var app_router = new AppRouter;

    app_router.on('route:defaultRoute', function(actions) {
        var movieListView = new MovieListView({ el: $("#list_container") });
    });
    app_router.on('route:viewMovieDetails', function(id) {

    });
    app_router.on('route:createNewMovie', function() {
        var movieCreation = new MovieCreation({ el: $("#list_container") });
        movieCreation.render();
    });
    app_router.on('route:viewUserProfile', function() {

    });

    // Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start();

function regulate_length(long_string, max_length){

    if (long_string.length > max_length - 3){
        long_string = long_string.substring(0, max_length - 3) + '...';
    }

    return long_string;
}

function regulate_decimal_points(number, decimal_points){
    var zeros = decimal_points * 10;
    return parseFloat(Math.round(number * zeros) / zeros).toFixed(decimal_points);
}


