$(document).ready(function() {
    
    var isloaded = false;

    //preload
    $(window).on("load", function () {// makes sure the whole site is loaded
        if (!isloaded) {
            loaded();
        }
    });
    setTimeout(function(){
        if (!isloaded) {
            loaded();
        }
    }, 600);

    function loaded(){
        isloaded = true;
        $('#status').fadeOut(); // will first fade out the loading animation
        $('#preloader').delay(300).fadeOut('slow'); // will fade out the white DIV that covers the website.
    }

	function init() {
        artist_arr = [];
        $('.artwork').each( function() {
            var artist_num = $(this).attr('data-artist');
            artist_arr.push(artist_num); 
        });

        getfade()

    }

    function getfade(){
        fade_position_arr = [];

        $(".fadein").data("show",false);
        $(".fadein").each( function() {
            var position = Math.round($(this).offset().top - ($( window ).height()/4*3));
            fade_position_arr.push(position); 
        });
    }

    function imgfit(e){
            var imgcoH = e.height();
            var imgcoW = e.width();
            var imgcoI = (imgcoH / imgcoW).toFixed(2);
            
            var imgH = e.find('img').height();
            var imgW = e.find('img').width();
            var imgI = (imgH / imgW).toFixed(2);

            // console.log(e + ":" + imgcoI + ":" + imgI);

            if (imgcoI > imgI) {
                e.find('.img-container').removeClass('img-heigher');
                e.find('.img-container').addClass('img-wider');
            }else if (imgcoI < imgcoI) {
                e.find('.img-container').removeClass('img-wider');
                e.find('.img-container').addClass('img-heigher');
            }else {
                e.find('.img-container').removeClass('img-wider');
                e.find('.img-container').removeClass('img-heigher');
            }
    }

    init();

    $('#navbar-toggler').click(function(){
        var target = $(this).attr('data-target');
        if ($(target).hasClass('active') == true) {
            $(target).removeClass('active');
            $('body').removeClass('navbar-show');
        }else{
            $(target).addClass('active');
            $('body').addClass('navbar-show');
        }
    })

    /* scrollspy */
    var anchor = new Array;
    var media_arr = new Array;
    var navScroll = $('.nav-scrollspy');

    if (navScroll.length > 0){
        scrollby();
    }

    function scrollby(){
        $(navScroll).find('a').each(function(){
            var anchorId = $(this).attr('href');
            if (anchorId.slice(0,1) == '#') {
                anchor.push($(anchorId).offset().top);
                $(this).click(function(){
                    $('html, body').animate({
                        scrollTop: $(anchorId).offset().top
                    }, 800);
                })
            } else {

            }
        });
    }

    /* menu hide and detached */
    var prev = 0;
    var headerMenu = $('#header');

    function checkHeader(position){
        var bottom = $(document).height() - $(window).height() - 10;
        if (position <= 40 ) {
            headerMenu.removeClass('detached show detachedHide')
        }else{
            if (prev > position) {
                prev = position;
                headerMenu.addClass('show')
            }else if(prev < position) {
                prev = position;
                headerMenu.removeClass('show')
                headerMenu.addClass('detached')
                headerMenu.addClass('detachedHide')
            }
            if (position >= bottom) {
                headerMenu.addClass('show')
            }
        }
        
    }

    $(window).scroll(function(){
        var position = $(window).scrollTop()
        checkHeader(position);
        checkfadein(position);
    });

    $(window).resize(function(){
        $('.artwork').each(function(){
            imgfit($(this));
        });
        getfade();
    })

    $('.lazy').Lazy({
        delay: '1000',
        afterLoad: function(element) {
            // console.log(element.parents(".artwork"));
            imgfit(element.parents(".artwork"));
            element.parents(".img-container").addClass("loaded");
        },
        onError: function(element) {
            console.log('error loading ' + element.data('src'));
        }
    });
    /* fade in */

    function checkfadein(position) {
        for (var i=0; i<=fade_position_arr.length ; i++) {
            if(position > fade_position_arr[i]){
                $(".fadein").eq(i).addClass("show")
            }else{
                // $(".fadein").eq(i).removeClass("show")
            }
        }
    }

    $('.popupbtn').click(function(){
        $('body').addClass('hidden');
        var ptarget = $(this).attr('data-target');
        $('#popup').addClass('active');
        $(ptarget).addClass('active');
        $('header, main, footer').addClass('blur');

        if (ptarget == '#popup-artwork') {
            $('#popup').removeClass('hidden');
            var artworkNum = $(this).attr('data-num');
            var artistNum = $(this).attr('data-artist');
            getArtwork(artworkNum);
            getArtist(artistNum);
            getPageNum(artworkNum, artistNum);
        }
    })
        
    $('.popup-close').click(function(){
        $('#popup').removeClass('active');
        $('.popup-container').removeClass('active');
        $('header, main, footer').removeClass('blur');
        setTimeout(function(){
            $('.artwork-img').removeClass(artclass)
            artclass = "";
            $('#artistExp').html("");
        }, 400)
        $('#popup').addClass('hidden');
        $('body').removeClass('hidden');
    })


    /* get json */

    var artworksList, artistsList;

    $.ajax({
      url: "js/artworks.json?v=7",
      type: "GET",
      dataType: "json",
      success: function(Jdata) {
        artworksList = Jdata;
        // console.log(artworksList);
        $('#artworkNum').html(artworksList.length);
      },
      error: function() {
        alert("error");
      }
    });

    $.ajax({
      url: "js/artists.json?v=7",
      type: "GET",
      dataType: "json",
      success: function(Jdata) {
        artistsList = Jdata;
        // console.log(artistsList);
      },
      error: function() {
        alert("error");
      }
    });

    var artclass;

    function getArtwork(i) {
        var artwork = artworksList[i];
        $('#artworkUrl').attr('src', 'artwork/' + artwork['url']);
        artclass = artwork['class']
        $('.artwork-img').addClass(artclass);
        $('#artworkTitle').html(artwork['ch-name'])
        $('#artworkTitleEn').html(artwork['en-name'].replace(/\n/g,'<br />'))
        $('#artworkIntro').html(artwork['intro'].replace(/\n/g,'<br />'))
        
        $('#artworkData').html(artwork['data'].replace(/\n/g,'<br />'))
    }

    function getArtist(i) {
        var artist = artistsList[i];
        $('#artistName').html(artist['ch-name'])
        $('#artistNameEn').html(artist['en-name'])
        $('#artistIntro').html(artist['intro'].replace(/\n/g,'<br />'))

        var artistExp = artist['experience'];
        var aExpHtml = [];
        $.each(artistExp,function(n,value) {
            
            $('#artistExp').append('<h4 class="t-blue mt-2 mb-s">' + value['ch-title'] + '</h4>');
            
            var ExpContent = value['content'];
            $.each(ExpContent,function(n,value) {
                if (value['year'] !== undefined) {
                    if ($.isArray(value['disc'])) {
                        var discArray = []
                        var discContent = value['disc'];
                        $.each(discContent,function(n,value) {
                            discArray.push(value + '<br />')
                        })

                        var discHtml = discArray.join( "" )
                        
                        aExpHtml.push( '<div class="d-row"><div class="d-cell year">' + value['year'].replace(/-/g,'<span class="dash">-</span>') + '</div><div class="d-cell">' + discHtml + '</div></div>' );
                    }else {
                        aExpHtml.push( '<div class="d-row"><div class="d-cell year">' + value['year'].replace(/-/g,'<span class="dash">-</span>') + '</div><div class="d-cell">' + value['disc'] + '</div></div>' );
                    }
                }else {
                    aExpHtml.push( '<div class="d-row"><div class="d-cell">' + value + '</div></div>' );
                }
                
            })

            $( "<div/>", {
                "class": "d-table t-small lh-mid",
                html: aExpHtml.join( "" )
            }).appendTo( "#artistExp" );

            aExpHtml = [];
        });
    }

    $('.pagebtn').click(function(){
        var artworkNum = $(this).attr('data-num');
        var artistNum = $(this).attr('data-artist');
        changeArt(artworkNum, artistNum);
    })


    function changeArt(artworkNum, artistNum){
        $('.artwork-img, .artwork-about, .artist').addClass('hide');
        $('#artistExp').html("");
        getPageNum(artworkNum, artistNum);
        setTimeout(function(){
            $('.artwork-img').removeClass(artclass);
            artclass = "";
            getArtwork(artworkNum);
            getArtist(artistNum);
            $('.artwork-img, .artwork-about, .artist').removeClass('hide');
        }, 400);
    }

    function getPageNum(artworkNum, artistNum){
        // console.log(artworkNum + ',' + artist_arr[artworkNum])
        artworkNum = parseInt(artworkNum);
        if (artworkNum < (artist_arr.length - 1) && artworkNum > 0) {
            $('#prevArt').attr('data-num', artworkNum - 1).attr('data-artist', artist_arr[artworkNum - 1]);
            $('#nextArt').attr('data-num', artworkNum + 1).attr('data-artist', artist_arr[artworkNum + 1]);
        }else if (artworkNum == 0) {
            $('#prevArt').attr('data-num', (artist_arr.length - 1)).attr('data-artist', artist_arr[-1]);
            $('#nextArt').attr('data-num', artworkNum + 1).attr('data-artist', artist_arr[1]);
        }else if (artworkNum == (artist_arr.length - 1)) {
            $('#prevArt').attr('data-num', artworkNum - 1).attr('data-artist', artist_arr[artworkNum - 1]);
            $('#nextArt').attr('data-num', 0).attr('data-artist', artist_arr[0]);
        }else {
            // console.log('Art is missing');
        }
    }

    /* shorter-toggler */
    $('.shorter-toggler').click(function(){
        $('.shorter').addClass('show');
    })


    /* browser prev event */
    if (window.history && window.history.pushState) {

        window.history.pushState('forward', null, './#forward');

        $(window).on('popstate', function() {

            if ($('.popup.active').length > 0) {
                $('.popup-close').click();
                // console.log('Back button was pressed.');
                return false;
            }
          
        });

      }

})