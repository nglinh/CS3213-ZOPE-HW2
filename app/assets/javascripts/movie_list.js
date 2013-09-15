<script type="text/template" id="movieListTemplate">
  <div class='container'>
    <div class='row'>
      <%% _.each(movies, function(movie) { %> 
        <div class="span3 movie">
          <a id="detail_page" href="movie/<%%= movie.attributes.id %>">
            <h4 class="movie-title"><%%= regulate_length(movie.attributes.title, 23) %></h4>
            <img class= "img-rounded" src=<%%= movie.attributes.img_url %>>
            <p>Score: <%%= regulate_decimal_points(movie.attributes.avg_score) %></p>
          </a>
        </div>
        <%% }); %>
    </div>
  </div>
</script>