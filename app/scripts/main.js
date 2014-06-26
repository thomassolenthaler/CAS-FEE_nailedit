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
        var $article = $('<article></article>');
        $article.append('<img />').append('<h1>'+content+'</h1>').append('<p></p>');
        $('.article-wrapper').append($article);
    }
};