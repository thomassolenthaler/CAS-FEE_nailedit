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

// Navigation

(function(window, document, undefined)
{

    // helper functions

    var trim = function(str)
    {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g,'');
    };

    var hasClass = function(el, cn)
    {
        return (' ' + el.className + ' ').indexOf(' ' + cn + ' ') !== -1;
    };

    var addClass = function(el, cn)
    {
        if (!hasClass(el, cn)) {
            el.className = (el.className === '') ? cn : el.className + ' ' + cn;
        }
    };

    var removeClass = function(el, cn)
    {
        el.className = trim((' ' + el.className + ' ').replace(' ' + cn + ' ', ' '));
    };

    var hasParent = function(el, id)
    {
        if (el) {
            do {
                if (el.id === id) {
                    return true;
                }
                if (el.nodeType === 9) {
                    break;
                }
            }
            while((el = el.parentNode));
        }
        return false;
    };

    // normalize vendor prefixes

    var doc = document.documentElement;

    var transform_prop = window.Modernizr.prefixed('transform'),
        transition_prop = window.Modernizr.prefixed('transition'),
        transition_end = (function() {
            var props = {
                'WebkitTransition' : 'webkitTransitionEnd',
                'MozTransition'    : 'transitionend',
                'OTransition'      : 'oTransitionEnd otransitionend',
                'msTransition'     : 'MSTransitionEnd',
                'transition'       : 'transitionend'
            };
            return props.hasOwnProperty(transition_prop) ? props[transition_prop] : false;
        })();

    window.App = (function()
    {

        var _init = false, app = { };

        var inner = document.getElementById('inner-wrap'),

            nav_open = false,
            search_open = false,
            search_class = 'js-search',
            nav_class = 'js-nav';


        app.init = function()
        {
            if (_init) {
                return;
            }
            _init = true;

            var closeNavEnd = function(e)
            {
                if (e && e.target === inner) {
                    document.removeEventListener(transition_end, closeNavEnd, false);
                }
                nav_open = false;
            };

            var closeSearchEnd = function(e)
            {
                if (e && e.target === inner) {
                    document.removeEventListener(transition_end, closeSearchEnd, false);
                }
                search_open = false;
            };

            app.closeNav =function()
            {
                if (nav_open) {
                    // close navigation after transition or immediately
                    var duration = (transition_end && transition_prop) ? parseFloat(window.getComputedStyle(inner, '')[transition_prop + 'Duration']) : 0;
                    if (duration > 0) {
                        document.addEventListener(transition_end, closeNavEnd, false);
                    } else {
                        closeNavEnd(null);
                    }
                }
                removeClass(doc, nav_class);
            };

            app.closeSearch =function()
            {
                if (search_open) {
                    // close navigation after transition or immediately
                    var duration = (transition_end && transition_prop) ? parseFloat(window.getComputedStyle(inner, '')[transition_prop + 'Duration']) : 0;
                    if (duration > 0) {
                        document.addEventListener(transition_end, closeSearchEnd, false);
                    } else {
                        closeSearchEnd(null);
                    }
                }
                removeClass(doc, search_class);
            };

            app.openNav = function()
            {
                if (nav_open) {
                    return;
                }
                addClass(doc, nav_class);
                nav_open = true;
            };

            app.openSearch = function()
            {
                if (search_open) {
                    return;
                }
                addClass(doc, search_class);
                search_open = true;
            };

            app.toggleNav = function(e)
            {
                if (nav_open && hasClass(doc, nav_class)) {
                    app.closeNav();
                } else {
                    app.openNav();
                }
                if (e) {
                    e.preventDefault();
                }
            };

            app.toggleSearch = function(e)
            {
                if (search_open && hasClass(doc, search_class)) {
                    app.closeSearch();
                } else {
                    app.openSearch();
                }
                if (e) {
                    e.preventDefault();
                }
            };

            // open nav with main "nav" button
            document.getElementById('nav-open-btn').addEventListener('click', app.toggleNav, false);

            // open nav with main "nav" button
            document.getElementById('nav-open-search').addEventListener('click', app.toggleSearch, false);

            // close nav with main "close" button
            document.getElementById('nav-close-btn').addEventListener('click', app.toggleNav, false);

            // close nav with main "close" button
            document.getElementById('nav-close-search').addEventListener('click', app.toggleSearch, false);

            // close nav by touching the partial off-screen content
            document.addEventListener('click', function(e)
                {
                    if (nav_open && !hasParent(e.target, 'nav')) {
                        e.preventDefault();
                        app.closeNav();
                    }
                },
                true);

            // close nav by touching the partial off-screen content
            document.addEventListener('click', function(e)
                {
                    if (search_open && !hasParent(e.target, 'nav-search')) {
                        e.preventDefault();
                        app.closeSearch();
                    }
                },
                true);

            addClass(doc, 'js-ready');

        };

        return app;

    })();

    if (window.addEventListener) {
        window.addEventListener('DOMContentLoaded', window.App.init, false);
    }

})(window, window.document);