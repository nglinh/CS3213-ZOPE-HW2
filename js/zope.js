var loadTemplates = function (names, callback) {

    var that = this;

    var loadTemplate = function (index) {
        var name = names[index];
        //console.log('Loading template: ' + name);
        $.get('templates/' + name + '.html', function (data) {
            that.templates[name] = data;
            index++;
            if (index < names.length) {
                loadTemplate(index);
            } else {
                callback();
            }
        });
    }

    loadTemplate(0);
};

var AppRouter = Backbone.Router.extend({
    routes: {
        "": "defaultRoute",
        "movie/:id": "viewMovieDetails",
        "movie/new": "createNewMovie",
        "user/profile": "viewUserProfile",
    }
});
var HomeView = Backbone.View.extend({
    initialize: function() {
        this.render();
    },
    render: function() {
        // Compile the template using underscore
        var template = _.template( $("#searchTemplate").html(), {} );
            // Load the compiled HTML into the Backbone "el"
            this.$el.html( template );
        }
    });


    // Initiate the router
    var app_router = new AppRouter;

    app_router.on('route:defaultRoute', loadTemplates(['search_template'],function(actions) {
        var homeView = new HomeView({ el: $("#search_container") });
        homeView.render();
    }
    ));
    app_router.on('route:viewMovieDetails', function(id) {

    });
    app_router.on('route:createNewMovie', function() {

    });
    app_router.on('route:viewUserProfile', function() {

    });

    // Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start();


    