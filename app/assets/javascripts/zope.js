NProgress.configure({showSpinner: false});

$(document).ready(function () {
    NProgress.done(true);
});

function add_file_button(){
    var change_img_button = $('.movie-img');
    if ($('.movie-img').html() === 'Change Img'){
        change_img_button.html('Remove Image Upload');
        $('.movie-file-holder').html('<input id="movie_img" name="movie[img]" type="file" required="true">');
    } else{
        change_img_button.html('Change Img');
        $('.movie-file-holder').html('');
    }
}

function activate_page_button(){

    $('.previous-page-button').on({
        click: previous_page
    });
    $('.next-page-button').on({
        click: next_page
    });

    if (page_number <= 1){
        $('.previous-page-button').css({"display":"none"});
    }
}

function previous_page(){
    console.log('Previous Page');
    page_number -= 1;
    switch_to_page(page_number);
}

function next_page(){
    console.log('Next Page');
    page_number += 1;
    switch_to_page(page_number);
}

function switch_to_page(number){
    app_router.navigate("page/" + number, {trigger: true});
}

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


var Movie = Backbone.Model.extend({
    initialize: function() {
        //this.on('all', function(e) { console.log(this.get('title') + " event for single movie: " + e); });
    },
    defaults: {
        id: 'NA',
        avg_score: '0',
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
        return base + (this.id) + ".json";
    }
});

var Review = Backbone.Model.extend({
    defaults: {
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
    getCreateUrl: function() {
        var base = this.urlRoot;
        return base  + (this.get("movie_id")) + "/reviews.json";
    },
    getDeleteUrl: function() {
        var base = this.urlRoot;
        return base  + (this.get("movie_id")) + "/reviews/"+this.get("id")+".json";
    },
     sync: function(method, model, options) {
        options || (options = {});

       // passing options.url will override 
       // the default construction of the url in Backbone.sync
       var base = this.urlRoot;
        switch (method) {
            case "create":
                options.url = base  + (this.get("movie_id")) + "/reviews.json";
                break;
            case "delete":
                options.url = base  + (this.get("movie_id")) + "/reviews/"+(this.get("id"))+".json";
                break;
        }

        if (options.url)
            Backbone.sync.call(model, method, model, options);
    }

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

var MovieList = Backbone.Collection.extend({
    initialize: function() {
        //this.on('all', function(e) { console.log(e); });
    },
    model: Movie,
    url: "http://cs3213.herokuapp.com/movies.json"
});   

var AppRouter = Backbone.Router.extend({
    routes: {
        "page/:movie_page_id": "movie_in_page",
        "": "defaultRoute",
        "movie/:id": "viewMovieDetails",
        "movie/:id/edit": "editMovieDetails",        
        "new": "createNewMovie",
    }
});

var MovieCreationView = Backbone.View.extend({
    render : function(id) {
        var template = _.template( $("#movie_creation").html(), {} );
        this.$el.html(template);
        NProgress.done(true);
    },
    events: {
        'submit .new_movie' : 'submitNewMovie',
    },

    submitNewMovie: function(e){
        NProgress.start();
        var access_token = getAccessToken();
        
        if (access_token === ""){
            alert("Please Login");
            return false;
        }

        console.log('Adding new movie');
        $(e.target).closest('form').ajaxSubmit({
            url: 'http://cs3213.herokuapp.com/movies.json',
            dataType: 'application/json',
            data: {
                access_token: access_token
            },
            method: 'POST',
            processData: true,
            success: function(e){
                parse_response(e);
            },
            error: function(e){
                parse_response(e);
            },
            beforeSubmit: function(e){

            }
        });
        //app_router.navigate('/', {trigger:true});
        return false;
    }
});

function parse_response(e){
    console.log(e);
    if (e.status == 200){
        alert("Create movie succeeded");
        var responseText = JSON.parse(e.responseText);
        app_router.navigate("movie/" + responseText.id, {trigger: true});
    } else{
        alert("Create movie failed");
    }
    NProgress.done(true);
}

var MovieCreationModel = Backbone.Model.extend({
    defaults: {
        title: 'NA',
        summary: 'NA',
        img: 'NA',
        access_token: 'NA',
    },
    url: function() {
        return "http://cs3213.herokuapp.com/movies.json";
    },
});

var page_number = 1;

var MovieEditView = Backbone.View.extend({
    render : function(id) {
        var movie = new Movie();
        var that = this;
        movie.id = id;
        console.log("id is: " + id);
        movie.fetch({
            success: function(e){
                console.log('successfully retrieved the movie');
                var template = _.template( $("#movie_edit").html(), {movie: movie} );
                that.$el.html(template);
                NProgress.done(true);
            },
            error: function(e){
                console.log('failed to retrieve movie');
                NProgress.done(true);
            }
        });
    },
    events: {
        'submit .edit_movie' : 'submitEditMovie',
    },
    submitEditMovie: function(e){
        NProgress.start();
        var access_token = getAccessToken();
        
        if (access_token === ""){
            alert("Please Login");
            return false;
        }
        var id = (e.currentTarget)[1].value;
        $(e.target).closest('form').ajaxSubmit({
            url: 'http://cs3213.herokuapp.com/movies/' + id + '.json',
            dataType: 'application/json',
            data: {
                access_token: access_token
            },
            method: 'PUT',
            error: function(e){
                alert("This movie cannot be edited. Please check your permission");
                NProgress.done(true);
            },
            success: function(e){
                NProgress.done(true);
                app_router.navigate("/movie/" + id, {trigger: true});
            },
            beforeSubmit: function(e){

            }
        });
        return false;
    }
});

var MovieListView = Backbone.View.extend({
    initialize: function() {

        this.render();
    },
    render: function() {
        console.log("this renders");
        var self = this;
        var movieListModel = new MovieList();
        movieListModel.url = "http://cs3213.herokuapp.com/movies.json" + "?page=" + page_number;

        movieListModel.fetch({
            success: function (movieListModel){
                var template = _.template($("#movieListTemplate").html(), {movies: movieListModel.models});
                self.$el.html(template);
                NProgress.done(true);
                activate_page_button();
            },
            error: function(model, xhr, options){
                console.log(model);
                console.log(xhr);
                console.log(options);
                NProgress.done(true);
            }
        });
        // Compile the template using underscore
    }});

var movie = new Movie();
var reviews;
var moviePage;

var MoviePage = Backbone.View.extend({
    render: function (choice){
        NProgress.start();
        switch(choice) {
            case 1:
            var template = _.template( $("#movie_info_template").html(), {movie: movie} );
            $("#list_container").html(template);
            break;
            case 2:
            var write_review_template = _.template( $("#write_review_template").html(), {id:movie.get("id")} );
            $("#list_container").append(write_review_template);
            break;
        }
        NProgress.done();
    },
    events: {

        'submit .new-review-form' : 'saveReview',
        'click .delete-movie': 'deleteMovie',
        'click .edit-movie' : 'editMovie'

    },
    saveReview: function(ev) {
        NProgress.start();
        var reviewDetail = $(ev.currentTarget).serializeObject();
        reviewDetail.access_token = getAccessToken();
        reviewDetail.user = getUser();
        var newReview = new Review();
        var self = this;
        console.log(reviewDetail);
        newReview.save(reviewDetail, {
            success: function () {
                reviews.add(newReview);
                console.log(reviews);
                $("#list_container").html();
                self.render(1);
                renderReviews(reviews);
                self.render(2);
                NProgress.done();
            },
            error: function (){
                alert("You are not allowed to write a review");
                console.log(newReview);
                NProgress.done();
            }
        });
        return false;

    },
    deleteMovie: function(ev) {
        NProgress.start();

        console.log(movie);
        movie.destroy({
            data : {
                access_token: getAccessToken()
            },
            processData: true,
            success: function(model,response){
                NProgress.done(true);
                app_router.navigate("", {trigger: true});
                return;
            },
            error: function(model,response){
                alert("This movie cannot be deleted");
                NProgress.done(true);
            }
        });
    },
    editMovie: function(ev) {
        app_router.navigate('/movie/' + movie.id + '/edit', {trigger:true});
    }
});

var ReviewView = Backbone.View.extend ({
    render: function(model) {
        this.review = model;
        this.template = _.template($("#review_template").html(), {review: model, login_user:getUser()});
        this.$el.append(this.template);
        $("#list_container").append(this.$el);
    },
    events: {
        'click .delete-review' : 'deleteReview'
    },
    deleteReview: function(ev) {
        NProgress.start();
        var self = this;
        this.review.destroy({
            data : {
                access_token: getAccessToken()
            },
            processData: true,
            success: function() {
                $("#list_container").html();
                moviePage.render(1);
                renderReviews(reviews);
                moviePage.render(2);
                NProgress.done(true);
            },
            error: function() {
                alert("error");
                NProgress.done(true);
            }
        });
    }
});


// Initiate the router
var app_router = new AppRouter();


app_router.on('route:defaultRoute', function(actions) {
    NProgress.start();
    var movieListView = new MovieListView({ el: $("#list_container") });
});
app_router.on('route:viewMovieDetails', function(id) {
    NProgress.start();
    
    moviePage = new MoviePage({ el: $("#list_container") });
        
    movie.set({id:id});
    movie.fetch({
        success: function(movie) {
                //console.log(movie.toJSON());
                reviews = new Reviews({id:id});
                reviews.fetch({
                    success: function(reviews) {
                        //console.log(reviews.toJSON());
                        moviePage.render(1);
                        renderReviews(reviews);
                        moviePage.render(2);
                    }
                });
            }
        });
});

app_router.on('route:editMovieDetails', function(id){
    var movieEditView = new MovieEditView({ el: $("#list_container") });
    movieEditView.render(id);
});

app_router.on('route:createNewMovie', function() {
    NProgress.start();
    var movieCreationView = new MovieCreationView({ el: $("#list_container") });
    movieCreationView.render();
});

app_router.on('route:movie_in_page', function(id) {
    NProgress.start();
    console.log('Going to page: ' + id);
    page_number = parseInt(id);
    var movieListView = new MovieListView({ el: $("#list_container") });
});


// Start Backbone history a necessary step for bookmarkable URL's
if (!Backbone.History.started){
    Backbone.history.start({pushState: true,
        root: "/"});
}

function regulate_length(long_string){
    var max_length = 17;

    if (long_string.length >= max_length - 3){
        long_string = long_string.substring(0, max_length - 4) + '...';
    }

    return long_string;
}

function regulate_decimal_points(number){
    var decimal_points = 2;
    var zeros = decimal_points * 10;
    return parseFloat(Math.round(number * zeros) / zeros).toFixed(decimal_points);
}


function getAccessToken() {
    return window.access_token;
}

function getUser() {
    return {
        id: window.user_id,
        username: window.user_email
    };
}

function renderReviews(reviews) {
    for (var i =0;i< reviews.length;i++) {
        var review = reviews.at(i);
        var elid = "#"+review.get("id");
        var reviewView = new ReviewView();
        reviewView.render(review);
    }
}

