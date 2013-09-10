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


var movies = [];
movies.push(new MovieModel({title: "Hey there"}));
movies.push(new MovieModel({title: "Hello"}));
movies.push(new MovieModel({title: "heyheyhey"}));

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
        // Compile the template using underscore
        var template = _.template( $("#movieListTemplate").html(), {} );
            // Load the compiled HTML into the Backbone "el"
            this.$el.html( template );
            for (var i=0;i<movies.length;i++){
                console.log(movies[i]);
                var movieItemView = new MovieItemView({model:movies[i]});
                this.$el.append(movieItemView.el);
            }
        }
    });


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


    