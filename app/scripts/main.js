/**
 * Le Application, nicely wrapped, jQuery mapped to $ within our nailedit context
 */
var nailedit = (function($,console) {
    "use strict";

    // our desired structure for each object
    var structure = {
        article: {id:null,url:null,description:null,posted:null,poster:null},
        comment: {id:null,article_id:null,content:null,commented:null,commenter:null},
        vote: {id:null,article_id:null,type:null,voted:null,voter:null}
    };

    // our non-persistant data storage (F5 is evil)
    var data = {};

    // our data manipulation
    var model = {
        article:{
            /**
             * Add article to datastack
             * @param article
             * @param callback
             * @returns {boolean}
             */
            add:function(article,callback) {
                article = $.extend({},structure.article,article);
                article.id = helper.getUID();
                data.article.push(article);

                if(callback) {
                    callback(article);
                }
                return true;
            },
            /**
             * Get all articles
             * @param callback
             */
            getAll:function(callback) {
                try {
                    callback(data.article);
                } catch(err) {
                    console.log('nothing to display');
                }
            },
            /**
             * Get one article that matches id
             * @param id
             * @param callback
             */
            getOne:function(id,callback) {
                var article = helper.findById(id,data.article);
                callback(article);
            },
            /**
             * Remove all articles
             * @param callback
             */
            removeAll:function(callback) {
                data.article.length = 0;
            },
            /**
             * Remove one article that matches id
             * @param id
             * @param callback
             */
            removeOne:function(id,callback) {
                // todo
            }
        },
        comment:{
            /**
             * Add a comment to an article
             * @param comment
             * @param callback
             * @returns {boolean}
             */
            add:function(comment,callback) {
                comment = $.extend({},structure.comment,comment);
                comment.commented = new Date();
                comment.commenter = 'Mr. Comment';

                data.comment.push(comment);
                if(callback) {
                    callback(comment);
                }
                return true;
            },
            /**
             * Remove all comments that match id (article_id)
             * @param article_id
             * @param callback
             */
            removeAllFromArticle:function(article_id,callback) {
                // todo
            },
            /**
             * Remove one comment that matches id (comment_id)
             * @param id
             * @param callback
             */
            removeOne:function(id,callback) {
                //todo
            }
        },
        vote:{
            /**
             * Add a vote for an article
             * @param vote
             * @param callback
             * @returns {boolean}
             */
            add:function(vote,callback) {
                vote = $.extend({},structure.vote,vote);
                vote.id = helper.getUID();
                data.vote.push(vote);

                if(callback) {
                    callback(vote);
                }
                return true;
            },
            /**
             * Remove all votes that match id (article_id)
             * @param article_id
             * @param callback
             */
            removeAllFromArticle:function(article_id,callback) {
                // todo
            },
            /**
             * Summarize the votes of an article
             * @param article_id
             * @returns {{upvote: number, downvote: number}}
             */
            sumVotesForArticle:function(article_id) {
                var sum = {
                    upvote:0,
                    downvote:0
                };
                var vote;
                var votes = helper.find(article_id,data.vote,'article_id');

                // loop votes from article and summarize votes by type
                for(vote in votes) {
                    if(votes.hasOwnProperty(vote)) {
                        votes[vote].type === 'up' ? sum.upvote++ : sum.downvote++;
                    }
                }
                return sum;
            },
            getVoteTotalForArticle:function(article_id) {
                var sum = model.vote.sumVotesForArticle(article_id);
                return sum.upvote-sum.downvote;

            }
        }
    };

    // our helper methods
    var helper = {
        /**
         * Finds a value in a property of an array or object
         * @param needle
         * @param haystack
         * @param property
         * @returns {*}
         */
        find:function(needle,haystack,property) {
            var elem;
            var result = [];
            property = property || 'id';

            for(elem in haystack) {
                if(haystack.hasOwnProperty(elem) && haystack[elem][property] === needle) {
                    result.push(haystack[elem]);
                }
            }
            return result;
        },
        /**
         * Generates a random key for our data since we're lacking a backend system
         * @returns {*|string}
         */
        getUID:function() {
            return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4);
        },
        /**
         * The super minimalistic html placeholder/variable substitution engine ;)
         * @param html
         * @param data
         * @returns {*|XML|string|void}
         */
        dirtyTmplMachine:function(html,data) {
            data = data || {};
            return html.replace(/{{(\w*)}}/g,function(m,key){
                return data.hasOwnProperty(key) ? data[key] : "";
            });
        }
    };

    // our public methods
    var n = {
        run:function() {
            // initialize empty data storages
            data.article = [];
            data.comment = [];
            data.vote = [];

            n._bindGlobalEvents();
            model.article.getAll(n.renderArticles);
        },
        renderArticles:function(articles) {
            var article;
            if(articles.length > 0) {
                for(article in articles) {
                    if(articles.hasOwnProperty(article)) {
                        n.prepepndArticleHTML(articles[article]);
                    }
                }
            } else {
                throw "no articles to render";
            }
        },
        prepepndArticleHTML:function(article) {
            var $article = $('#article-prototype').clone(); // get a copy of the article html
            var parsedTmpl;

            parsedTmpl = helper.dirtyTmplMachine($article.html(),article);

            $article.attr('id','article-'+article.id);
            $article.data('id',article.id);

            $article.html(parsedTmpl);

            n._bindArticleEvents($article,article.id);

            $article.removeClass('hidden');
            $article.prependTo('#article-holder');
        },
        appendCommentHTML:function(comment,article_id) {
            var $comment = $('#comment-prototype').clone(); // get a copy of the article html
            var parsedTmpl;

            parsedTmpl = helper.dirtyTmplMachine($comment.html(),comment);

            $comment.attr('id','comment-'+comment.id);
            $comment.data('id',$comment.id);

            $comment.html(parsedTmpl);

            //n._bindCommentEvents($comment,comment.id);

            $comment.removeClass('hidden');
            $comment.appendTo('#article-'+article_id+' .comments');
            $('.comments-fix','#article-'+article_id).removeClass('hidden');
        },
        addArticle:function() {
            var url = $('#input-article-title').val();
            var description = $('#input-article-text').val();
            var article;
            if(url !== '' && description !== '') {
                model.article.add({
                    description:description,
                    url:url,
                    posted:new Date(),
                    poster:'Mr. Static'
                },n.prepepndArticleHTML);
            } else {
                throw "article cannot be empty";
            }
        },
        removeArticle:function(id) {
            if(id !== undefined) {
                model.vote.removeAllFromArticle(id);
                model.comment.removeAllFromArticle(id);
                model.article.removeOne(id);
            } else {
                throw "id required";
            }
        },
        addComment:function(article_id) {
            var content = $('#input-comment').val();
            if(content !== '' && article_id !== '') {
                model.comment.add({content:content,article_id:article_id},function(comment) {
                    n.appendCommentHTML(comment,article_id);
                });

                $('#article-'+article_id+' .comment-count').text(data.comment.length);
            } else {
                throw "comment cannot be empty";
            }
        },
        removeComment:function(id) {
            if(id !== undefined) {
                model.comment.removeOne(id);
            } else {
                throw "id required";
            }
        },
        addVote:function(article_id,type,callback) {
            if(article_id !== '' && (type !== 'up' || type !== 'down')) {
                model.vote.add({type:type,article_id:article_id},callback);
                $('#article-'+article_id+' .vote-sum').text(model.vote.getVoteTotalForArticle(article_id));
            } else {
                throw "type has to be up or down";
            }
        },
        showArticleModal:function() {
            n._bindArticleModalEvents();
            $('#addArticleModal').modal('show');
        },
        hideArticleModal:function() {
            n._unbindArticleModalEvents();
            $('#addArticleModal').modal('hide');
        },
        showCommentModal:function() {
            n._bindCommentModalEvents();
            $('#addCommentModal').modal('show');
        },
        hideCommentModal:function() {
            n._unbindCommentModalEvents();
            $('#addCommentModal').modal('hide');
        },
        _bindGlobalEvents:function() {
            $('#btn-article-share').on('click', n._onClickShare);
        },
        _bindArticleEvents:function($article) {
            $('.btn-comment-add',$article).on('click', n._onClickCommentAdd);
            $('.btn-vote-up',$article).on('click', n._onClickVoteUp);
            $('.btn-vote-down',$article).on('click', n._onClickVoteDown);
            $('.btn-comment',$article).on('click', n._onClickComment);
        },
        _bindCommentModalEvents:function() {
            $('#btn-comment-save').on('click',n._onClickCommentSave);
        },
        _unbindCommentModalEvents:function() {
            $('#input-comment').val('');
            $('#btn-comment-save').off('click');
        },
        _bindArticleModalEvents:function() {
            $('#btn-article-save').on('click',n._onClickArticleAdd);
        },
        _unbindArticleModalEvents:function() {
            $('#input-article-title').val('');
            $('#input-article-text').val('');
            $('#btn-article-save').off('click');
        },
        _onClickShare:function() {
            n.showArticleModal();
            $('#input-article-title').val($('#input-article').val());
            return false;
        },
        _onClickArticleAdd:function() {
            n.addArticle();
            n.hideArticleModal();
            $('#input-article').val('');
        },
        _onClickVoteUp:function(ev) {
            var article_id = n._getArticleId(ev);
            n.addVote(article_id,'up');
            return false;
        },
        _onClickVoteDown:function(ev) {
            var article_id = n._getArticleId(ev);
            n.addVote(article_id,'down');
            return false;
        },
        _onClickComment:function() {
            // show comments
        },
        _onClickCommentAdd:function(ev) {
            var article_id = n._getArticleId(ev);

            $('#addCommentModal')
                .data('article_id',article_id)
                .modal('show');

            n.showCommentModal();
        },
        _onClickCommentSave:function() {
            var article_id = $('#addCommentModal').data('article_id');

            n.addComment(article_id);
            n.hideCommentModal();

            return false; // no form submit wanted ;)
        },
        _getArticleId:function(ev) {
            return $(ev.target).parents('article').data('id');
        }
    };

    return n;
})(jQuery,console);

/**
 * Get the party started
 */
jQuery(document).ready(nailedit.run);