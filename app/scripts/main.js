console.log('\'Allo \'Allo!');

$(document).ready(function() {
    $('.btn-share').on('click',function() {
        var content = $('#input-article').val();
        nailit.addEntry(content);

        return false;
    });


});

var nailit = {
    addEntry:function(content) {
        var $article = $('<article class="col-xs-12 col-md-12"></article>');
        var $img = $('<a class="pull-left" href="#"><img class="media-object" data-src="holder.js/100x100" alt="100x100" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZWVlIi8+PHRleHQgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iMzIiIHk9IjMyIiBzdHlsZT0iZmlsbDojYWFhO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zaXplOjEycHg7Zm9udC1mYW1pbHk6QXJpYWwsSGVsdmV0aWNhLHNhbnMtc2VyaWY7ZG9taW5hbnQtYmFzZWxpbmU6Y2VudHJhbCI+NjR4NjQ8L3RleHQ+PC9zdmc+"></a>');
        $article.append($img).append('<h4 class="media-heading">'+content+'</h4>').append('<p></p>');
        $('.article-wrapper').append($article);
    }
};