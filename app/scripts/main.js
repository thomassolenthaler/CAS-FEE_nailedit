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
        var $img = $('<a class="pull-left" href="#"><img class="media-object"></a>');
        $article.append($img).append('<h4 class="media-heading">'+content+'</h4>').append('<p></p>');
        $('.article-wrapper').append($article);
    }
};