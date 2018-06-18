$(document).ready(function(){
    var isDesktop = false,
    isTablet = false,
    isMobile = false,
    isRetina = retina();

    function resize(){
       if( typeof( window.innerWidth ) == 'number' ) {
            myWidth = window.innerWidth;
            myHeight = window.innerHeight;
        } else if( document.documentElement && ( document.documentElement.clientWidth || 
        document.documentElement.clientHeight ) ) {
            myWidth = document.documentElement.clientWidth;
            myHeight = document.documentElement.clientHeight;
        } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
            myWidth = document.body.clientWidth;
            myHeight = document.body.clientHeight;
        }

        if( myWidth > 1199 ){
            isDesktop = true;
        }else if( myWidth > 767 ){
            isTablet = true;
        }else{
            isMobile = true;
        }

        if($('.b-footer').length){
            footerToBottom();
        }
    }

    function retina(){
        var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
            (min--moz-device-pixel-ratio: 1.5),\
            (-o-min-device-pixel-ratio: 3/2),\
            (min-resolution: 1.5dppx)";
        if (window.devicePixelRatio > 1)
            return true;
        if (window.matchMedia && window.matchMedia(mediaQuery).matches)
            return true;
        return false;
    }

    $(window).resize(resize);
    resize();

    $.fn.placeholder = function() {
        if(typeof document.createElement("input").placeholder == 'undefined') {
            $('[placeholder]').focus(function() {
                var input = $(this);
                if (input.val() == input.attr('placeholder')) {
                    input.val('');
                    input.removeClass('placeholder');
                }
            }).blur(function() {
                var input = $(this);
                if (input.val() == '' || input.val() == input.attr('placeholder')) {
                    input.addClass('placeholder');
                    input.val(input.attr('placeholder'));
                }
            }).blur().parents('form').submit(function() {
                $(this).find('[placeholder]').each(function() {
                    var input = $(this);
                    if (input.val() == input.attr('placeholder')) {
                        input.val('');
                    }
                });
            });
        }
    }
    $.fn.placeholder();

    if(isRetina){
        $("*[data-retina]").each(function(){
            var $this = $(this),
                img = new Image(),
                src = $this.attr("data-retina");

            img.onload = function(){
                $this.attr("src", $this.attr("data-retina"));
            };
            img.src = src;
        });
    }

    function footerToBottom(){
        var browserHeight = window.innerHeight,
            footerOuterHeight = !!$('.b-footer').outerHeight() ? $('.b-footer').outerHeight(true) : 0,
            headerHeight = !!$('.b-header').outerHeight() ? $('.b-header').outerHeight(true) : 0;
        var minHeight = browserHeight - footerOuterHeight - headerHeight;
        if(minHeight >= 0){
            $('.b-content').css({
                'min-height': minHeight
            });
        }  
    };

    $('.services-item').on('click', function(){
        if (!$(this).hasClass('active-accordion')) {
            $('.services-item.active-accordion').removeClass('active-accordion');
            $(this).addClass('active-accordion');
        }
        else{
            $(this).removeClass('active-accordion');
        };
    });
    if(isMobile){

        var slideout = new Slideout({
            'panel': document.getElementById('panel-page'),
            'menu': document.getElementById('mobile-menu'),
            'side': 'right',
            'padding': 256,
            'tolerance': 70,
            'touch': false
        });

        $('.mobile-menu').removeClass("hide");

        $('.burger-menu').click(function() {
            slideout.open();
            $(".b-menu-overlay").show();
            return false;
        });

        $('.b-menu-overlay').click(function() {
            slideout.close();
            $('.b-menu-overlay').hide();
            return false;
        });

        slideout.on('open', function() {
            $('.burger-menu').addClass("menu-on");
            $(".b-menu-overlay").show();
        });

        slideout.on('close', function() {
            $('.burger-menu').removeClass("menu-on");
            setTimeout(function(){
                $("body").unbind("touchmove");
                $(".b-menu-overlay").hide();
            },100);
        });

    }
    var mapView = false,
        nowScroll = false,
        tolerant = 0,
        blockHash = false,
        deltaPrev = 0,
        page = document.body;

    var slideCount;
    if($('.b-screen-menu').length){
        slideCount = $('.b-screen').length - 1;
    }else{
        slideCount = $('.b-screen').length;
    }

    if(!!window.location.hash){
        blockHash = true;
    }
    if(!isMobile){

        if($('.main-page').length){
            
            if (page.addEventListener) {
                if ('onwheel' in document) {
                    // IE9+, FF17+, Ch31+
                    page.addEventListener("wheel", onWheel);
                }else if('onmousewheel' in document) {
                    // СѓСЃС‚Р°СЂРµРІС€РёР№ РІР°СЂРёР°РЅС‚ СЃРѕР±С‹С‚РёСЏ
                    page.addEventListener("mousewheel", onWheel);
                }else {
                    // Firefox < 17
                    page.addEventListener("MozMousePixelScroll", onWheel);
                }
            }else { // IE8-
                page.attachEvent("onmousewheel", onWheel);
            }

            var timer;
                // timerToggle = false;
            function onWheel(e) {
                clearTimeout(timer);

                // timerToggle = true;

                if(!$(".fancybox-slide .b-popup").length){
                    e = e || window.event;
                    var delta = e.deltaY || e.detail || e.wheelDelta;
                    // console.log("before " + delta);
                    if (!isMobile) {
                        console.log(Math.abs(delta)+" "+Math.abs(deltaPrev)+" "+tolerant);
                        if(!nowScroll && !$('.burger-menu').hasClass("open")
                            && Math.abs(delta) > Math.abs(deltaPrev) ){
                            console.log("--------------------scroll--------------------");
                            tolerant += delta;
                            if(Math.abs(tolerant) > 1){
                                nowScroll = true;

                                var currentID = parseInt($('.current-slide').attr("data-id"));
                                if(tolerant < 0){                            var prevID = currentID > 1 ? currentID - 1 : slideCount;
                                    $('.b-screen[data-id="'+prevID+'"]').addClass("move-down current-slide")
                                    $('.b-screen[data-id="'+currentID+'"]').addClass("scale-down").removeClass("current-slide");
                                    $('#slider-nav a.active').removeClass("active");
                                    $('#slider-nav a[data-id="'+prevID+'"]').addClass("active");
                                }else{
                                    var nextID = currentID < slideCount ? currentID + 1 : 1;
                                    $('.b-screen[data-id="'+currentID+'"]').addClass("move-up").removeClass("current-slide");
                                    $('.b-screen[data-id="'+nextID+'"]').addClass("scale-up current-slide");
                                    $('#slider-nav a.active').removeClass("active");
                                    $('#slider-nav a[data-id="'+nextID+'"]').addClass("active");
                                }
                                tolerant = 0;
                            }
                        }else{
                            
                        }
                        deltaPrev = delta;
                        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
                    }
                }
                timer = setTimeout(function(){
                    deltaPrev = 0;
                    console.log("timeout");
                },300);
            }
            $('.b-logo').on('click', function(){
                if(!$('.burger-menu').hasClass("open")){
                    $('#slider-nav a[data-id="1"]').click();
                }else{
                    $('.current-slide').removeClass("current-slide");
                    $('.current-slide-menu').removeClass("current-slide-menu");
                    $('.b-screen[data-id="1"]').addClass("current-slide-menu");
                    $('#slider-nav a.active').removeClass("active");
                    $('#slider-nav a[data-id="1"]').addClass("active");
                    $('.burger-menu').click();
                    //$('.burger-menu').click();
                }
                return false;
            }); 
        }
    }

    $("*[data-back-full]").each(function(){
        var $this = $(this),
            img = new Image(),
            src = $this.attr("data-back-full");
        img.onload = function(){
            $this.css("background-image", 'url(' + $this.attr("data-back-full") + ')');
        };
        img.src = src;
    });

    var timers = [];

    function showDots(){
        var delayCoef = 1,
        delayYellow = 75,
        delay = 0;
        $(".dot-white, .dot-white-small, .dot-yellow").each(function(){
            var el = this;
            if(!$(el).hasClass("dot-yellow")){
                delay = 25 * delayCoef;
            }else{
                delay = 25 * delayCoef + delayYellow;
                delayYellow += 75;
            }
            timers.push(setTimeout(function(){
                $(el).addClass('dot-show');
            }, delay))
            delayCoef++;
        });
    }

    function hideDots(){
        timers.forEach(function(item, i, arr) {
            clearTimeout(item);
        });
        $(".dot-white, .dot-white-small, .dot-yellow").each(function(){
            $(this).removeClass('dot-show');
        });
    }

    $('.b-screen').bind('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function(e){
        $(this).removeClass("move-up scale-up move-down scale-down");
        setTimeout(function() {
            // console.log("nowScroll-cancel");
            nowScroll = false;
            tolerant = 0;
        }, 500);
        if(parseInt($('.current-slide').attr("data-id")) === 4){
            showDots();
        }else{
            hideDots();
        }
        if(parseInt($('.current-slide').attr("data-id")) === 5 && !mapView){
            maps[0].marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                maps[0].marker.setAnimation(null)
            }, 725);
            mapView = true;
        }
        if(!$('.current-slide').hasClass("b-screen-menu") && $('.main-page').length){
            window.location.hash = $(".current-slide").attr("data-hash");
        }
        if($('.burger-menu').hasClass("close") && $('.b-header .burger-menu').length){
            $('.b-screen-menu').addClass("hide");
        }
        //$("body").unbind("touchmove");
    }); 

    var bubbleTimer,
        openBubble = true;

    $('#slider-nav a').on('click', function(){
        if (!isMobile) {
            if(!nowScroll){
                nowScroll = true;
                tolerant = 0;
                $this = $(this);

                if(isMobile){
                    $("#slider-nav a").each(function(){
                        $(this).removeClass("bubble-open");
                    });
                    if(openBubble){
                        clearTimeout(bubbleTimer);
                        $this.addClass("bubble-open");
                    }
                }

                var currentID = parseInt($('.current-slide').attr("data-id"));
                var buttonID = parseInt($(this).attr("data-id"));
                if(currentID === buttonID){
                    nowScroll = false;
                    return false;
                }
                if(currentID < buttonID){
                    if(buttonID === slideCount && currentID === 1){
                        $('.b-screen[data-id="'+buttonID+'"]').addClass("move-down current-slide")
                        $('.b-screen[data-id="'+currentID+'"]').addClass("scale-down").removeClass("current-slide");
                    }else{
                        $('.b-screen[data-id="'+currentID+'"]').addClass("move-up").removeClass("current-slide");
                        $('.b-screen[data-id="'+buttonID+'"]').addClass("scale-up current-slide");
                    }
                }else{
                    if(currentID === slideCount && buttonID === 1){
                        $('.b-screen[data-id="'+currentID+'"]').addClass("move-up").removeClass("current-slide");
                        $('.b-screen[data-id="'+buttonID+'"]').addClass("scale-up current-slide");
                    }else{
                        $('.b-screen[data-id="'+buttonID+'"]').addClass("move-down current-slide")
                        $('.b-screen[data-id="'+currentID+'"]').addClass("scale-down").removeClass("current-slide");
                    }
                }
                

                if(isMobile){
                    bubbleTimer = setTimeout(function() {
                        $this.removeClass("bubble-open");
                    }, 1500);
                }

                $('#slider-nav a.active').removeClass("active");
                $('#slider-nav a[data-id="'+buttonID+'"]').addClass("active");
                $('.b-screen.b-screen-menu.current-slide').removeClass("current-slide");
                $('.burger-menu.open').removeClass('open').addClass('close');
                openBubble = true;
            }
        }
    });

    $('.b-mouse').on('click', function(){
        $('#slider-nav a[data-id="2"]').click();
        return false;
    });

    $('.mobile-next-slide').on('click', function(){
        var nextID = parseInt($(this).parent().attr("data-id")) + 1;
        openBubble = false;
        $('#slider-nav a[data-id="'+nextID+'"]').click();
    });

    $('.mobile-prev-slide').on('click', function(){
        openBubble = false;
        $('#slider-nav a[data-id="1"]').click();
    });
    if(!isMobile){
        $('.burger-menu').click(function() {
            if(!nowScroll){
                nowScroll = true;
                if(!$(this).hasClass("open")){
                    $('.current-slide').addClass("scale-down current-slide-menu").removeClass("current-slide");
                    $('.b-screen-menu').addClass("move-down current-slide");
                    if($('.b-header .burger-menu').length){
                        $('.b-screen-menu').removeClass("hide");
                        $('.b-block-menu').addClass("fixed");
                        $('body').addClass("no-scroll");
                    }
                    $('.burger-menu').addClass("open").removeClass("close");
                    $('#slider-nav').addClass("hide");
                }else{
                    $('.current-slide-menu').addClass("scale-up current-slide").removeClass("current-slide-menu");
                    $('.b-screen-menu').addClass("move-up").removeClass("current-slide");
                    if($('.b-header .burger-menu').length){
                        $('body').removeClass("no-scroll");
                        $('.b-block-menu').removeClass("fixed");
                    }
                    $('.burger-menu').removeClass("open").addClass("close");
                    $('#slider-nav').removeClass("hide");
                }
            }
        });
    };
    // var swipeVertical = new MobiSwipe("panel-page");
    // swipeVertical.direction = swipeVertical.VERTICAL;
    // swipeVertical.onswipeup = function() {
    //     /*$("body").bind("touchmove", function(e){
    //         e.preventDefault();
    //         return false;
    //     });*/

    //     if(!$('.burger-menu').hasClass("open")){
    //         var currentID = parseInt($('.current-slide').attr("data-id"));
    //         var nextID = currentID < slideCount ? currentID + 1 : 1;
    //         nowScroll = false;
    //         openBubble = false;
    //         $('#slider-nav a[data-id="'+nextID+'"]').click();

    //     }

    // };
    // swipeVertical.onswipedown = function() {
    //     /*$("body").bind("touchmove", function(e){
    //         e.preventDefault();
    //         return false;
    //     });*/
    //     if(!$('.burger-menu').hasClass("open")){
    //         var currentID = parseInt($('.current-slide').attr("data-id"));
    //         var prevID = currentID > 1 ? currentID - 1 : slideCount;
    //         nowScroll = false;
    //         openBubble = false;
    //         $('#slider-nav a[data-id="'+prevID+'"]').click();
    //     }
    // };

    $(".b-popup[data-back]").each(function(){
        var $this = $(this),
            img = new Image(),
            src = $this.attr("data-back");
        img.onload = function(){
            $this.css("background-image", 'url(' + $this.attr("data-back") + ')');
        };
        img.src = src;
    });

    $(window).on('load', function(){
        console.log("load");
        $('.init-hide').each(function(){
            $(this).removeClass("init-hide");
        });
        if(!!window.location.hash){
            var hash = window.location.hash;
            var slideID = $('*[data-hash="'+hash+'"]').attr("data-id");
            openBubble = false;
            $('#slider-nav a[data-id="'+slideID+'"]').click();
            blockHash = false;
        }
    });

    if(isMobile){
        $(function() {
            FastClick.attach(document.body);
        });
    }

    var styles = [
        {
            "featureType": "all",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "gamma": 1
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "saturation": "-99"
                },
                {
                    "lightness": "38"
                },
                {
                    "gamma": "3.11"
                },
                {
                    "color": "#aaaaaa"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
                { "color": "#fece0b" },
                { "visibility": "simplified" }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        }
    ];

    function mapInfo($btn)
    {
        this.name = $btn.attr("data-map");
        this.x = parseFloat($btn.attr("data-coord-x"));
        this.y = parseFloat($btn.attr("data-coord-y"));
        this.myPlace = new google.maps.LatLng(this.x, this.y);
        var myOptions = {
            zoom: 16,
            center: this.myPlace,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            scrollwheel: false,
            zoomControl: true
        }
        this.map = new google.maps.Map(document.getElementById(this.name), myOptions);

        this.styledMap = new google.maps.StyledMapType(styles,{name: "Styled Map"});
        this.map.mapTypes.set('map_style', this.styledMap);
        this.map.setMapTypeId('map_style');

        this.marker = new google.maps.Marker({
            position: this.myPlace,
            map: this.map,
            icon: {
                url: "/bitrix/templates/main/html/i/pin.svg",
                scaledSize: new google.maps.Size(40, 58), // scaled size
                origin: new google.maps.Point(0,0), // origin
                anchor: new google.maps.Point(23,50), // anchor
            },
            title: ""
        });
        //this.marker.setAnimation(google.maps.Animation.BOUNCE);
    }

    //РјР°СЃСЃРёРІ СЃРѕ РІСЃРµРјРё РєР°СЂС‚Р°РјРё
    var maps = [];

    $('.b-btn-city').each(function(){
        maps.push(new mapInfo($(this)));
    });

    $('.b-map-city a').on('click', function(){
        $this = $(this);
        $this.siblings("a").each(function(){
            $('#'+$(this).attr("data-map")).addClass("hide");
            $('#'+$(this).attr("data-contacts")).addClass("hide");
            $(this).removeClass("active");
        });
        $('#'+$this.attr("data-map")).removeClass("hide");
        $('#'+$this.attr("data-contacts")).removeClass("hide");
        $this.addClass("active");

        //РћР±РЅРѕРІРёС‚СЊ РєР°СЂС‚Сѓ
        var mapObj = maps[$this.index()];
        google.maps.event.trigger(mapObj.map, 'resize');
        mapObj.map.setCenter(mapObj.myPlace);
        mapObj.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            mapObj.marker.setAnimation(null)
        }, 750);
    });

    /*var options = {
        $AutoPlay: true,                                
        $SlideDuration: 500,                            

        $BulletNavigatorOptions: {                      
            $Class: $JssorBulletNavigator$,             
            $ChanceToShow: 2,                           
            $AutoCenter: 1,                            
            $Steps: 1,                                  
            $Lanes: 1,                                  
            $SpacingX: 10,                              
            $SpacingY: 10,                              
            $Orientation: 1                             
        }
    };

    var jssor_slider1 = new $JssorSlider$("slider1_container", options);*/

});