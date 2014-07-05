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
             *
             * @param article
             * @param callback
             * @returns {boolean}
             */
            add:function(article,callback) {
                article = $.extend(structure.article,article);
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
                callback(data.article);
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
             * Remove all  articles
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
                comment = $.extend(structure.comment,comment);
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
                vote = $.extend(structure.vote,vote);
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
                var votes = helper.find(article_id,data.vote,'article_id');

                // loop votes from article and summarize votes by type
                for(var vote in votes) {
                    if(votes.hasOwnProperty(vote)) {
                        vote.type === 'up' ? sum.upvote++ : sum.downvote--;
                    }
                }
                return sum;
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
            property = property || 'id';

            for(var elem in haystack) {
                if(haystack.hasOwnProperty(elem) && elem[property] === needle) {
                    return elem;
                }
            }
            return false;
        }
    };

    // our public interface
    var n = {
        run:function() {
            data.article = {};
            data.comment = {};
            data.vote = {};

            n._bindEvents();
            model.article.getAll(n.renderArticles);
        },
        renderArticles:function(articles) {
            if(articles.length > 0) {
                for(var article in articles) {
                    if(articles.hasOwnProperty(article)) {
                        console.log(article);
                    }
                }
            } else {
                throw "no articles to render";
            }
        },
        addArticle:function() {
            var content = $('#article-input').val();
            if(content !== '') {
                model.article.add({content:content});
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
        addComment:function() {
            var content = $('#comment-input').val();
            if(content !== '') {
                model.comment.add({content:content});
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
        addVote:function(type) {
            if(type !== 'up' || type !== 'down') {
                model.vote.add(type);
            } else {
                throw "type has to be up or down";
            }
        },
        _bindEvents:function() {
            $('.btn-share').on('click', n._onClickShare);
            $('.btn-vote-up').on('click', n._onClickVoteUp);
            $('.btn-vote-down').on('click', n._onClickVoteDown);
            $('.btn-comment').on('click', n._onClickComment);
            $('.btn-comment-add').on('click', n._onClickCommentAdd);
        },
        _onClickShare:function() {
            n.addArticle();
            return false;
        },
        _onClickVoteUp:function() {
            n.addVote('up',function() {

            });
        },
        _onClickVoteDown:function() {
            n.addVote('down');
        },
        _onClickComment:function() {
            n.addComment();
        },
        _onClickCommentAdd:function() {
            n.addComment();
        }
    };

    return n;
})(jQuery,console);

/**
 * Get the party started
 */
jQuery(document).ready(nailedit.run);