$(document).ready(function(){

    var isRetina = retina();

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

    /*var slideout = new Slideout({
        'panel': document.getElementById('panel-page'),
        'menu': document.getElementById('mobile-menu'),
        'side': 'right',
        'padding': 256,
        'tolerance': 70
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
    });*/

    var mapView = false,
        nowScroll = false,
        tolerant = 0,
        blockScroll = false,
        scrollID,
        blockHash = false;
    var page = document.body;

    if(!!window.location.hash){
        blockHash = true;
    }

    if($('.main-page').length){
        
        if (page.addEventListener) {
            if ('onwheel' in document) {
                // IE9+, FF17+, Ch31+
                page.addEventListener("wheel", onWheel);
            }else if('onmousewheel' in document) {
                // устаревший вариант события
                page.addEventListener("mousewheel", onWheel);
            }else {
                // Firefox < 17
                page.addEventListener("MozMousePixelScroll", onWheel);
            }
        }else { // IE8-
            page.attachEvent("onmousewheel", onWheel);
        }

        function onWheel(e) {
            e = e || window.event;

            console.log(tolerant , nowScroll);
            if(!nowScroll && !blockScroll && !$('.burger-menu').hasClass("open")){
                var delta = e.deltaY || e.detail || e.wheelDelta;
                tolerant += delta;
                //console.log(tolerant, delta, nowScroll);

                if(Math.abs(tolerant) > 20){
                    nowScroll = true;
                    blockScroll = true;
                    scrollID = setTimeout(function(){
                        blockScroll = false;
                    }, 100);

                    var slideCount;
                    if($('.b-screen-menu').length){
                        slideCount = $('.b-screen').length - 1;
                    }else{
                        slideCount = $('.b-screen').length;
                    }

                    if(tolerant < 0){
                        console.log("scroll-up");

                        var currentID = parseInt($('.current-slide').attr("data-id"));
                        var prevID = currentID > 1 ? currentID - 1 : slideCount;

                        $('.b-screen[data-id="'+prevID+'"]').addClass("move-down current-slide")
                        $('.b-screen[data-id="'+currentID+'"]').addClass("scale-down").removeClass("current-slide");
                        $('#slider-nav a.active').removeClass("active");
                        $('#slider-nav a[data-id="'+prevID+'"]').addClass("active");
                    }else{
                        console.log("scroll-down");

                        var currentID = parseInt($('.current-slide').attr("data-id"));
                        var nextID = currentID < slideCount ? currentID + 1 : 1;

                        $('.b-screen[data-id="'+currentID+'"]').addClass("move-up").removeClass("current-slide");
                        $('.b-screen[data-id="'+nextID+'"]').addClass("scale-up current-slide");
                        $('#slider-nav a.active').removeClass("active");
                        $('#slider-nav a[data-id="'+nextID+'"]').addClass("active");
                    }
                }
                window.location.hash = $(".current-slide").attr("data-hash");
            }else{
                clearTimeout(scrollID);
                scrollID = setTimeout(function(){
                    blockScroll = false;
                }, 100);
                tolerant = 0;
            }

            e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        }
        $('.b-logo').on('click', function(){
            $('#slider-nav a[data-id="1"]').click();
            return false;
        });

        $("*[data-back-full]").each(function(){
            var $this = $(this),
                img = new Image(),
                src = $this.attr("data-back-full");
            img.onload = function(){
                $this.css("background-image", 'url(' + $this.attr("data-back-full") + ')');
            };
            img.src = src;
        });
        
    }

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
            console.log("nowScroll-cancel");
            nowScroll = false;
            tolerant = 0;
        }, 250);
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
    }); 

    $('#slider-nav a').on('click', function(){
        if(!nowScroll){
            nowScroll = true;
            tolerant = 0;

            var currentID = parseInt($('.current-slide').attr("data-id"));
            var buttonID = parseInt($(this).attr("data-id"));
            if(currentID === buttonID){
                nowScroll = false;
                return false;
            }
            if(currentID < buttonID){
                $('.b-screen[data-id="'+currentID+'"]').addClass("move-up").removeClass("current-slide");
                $('.b-screen[data-id="'+buttonID+'"]').addClass("scale-up current-slide");
            }else{
                $('.b-screen[data-id="'+buttonID+'"]').addClass("move-down current-slide")
                $('.b-screen[data-id="'+currentID+'"]').addClass("scale-down").removeClass("current-slide");
            }

            $('#slider-nav a.active').removeClass("active");
            $(this).addClass("active");
        }
    });

    $('.b-mouse').on('click', function(){
        $('#slider-nav a[data-id="2"]').click();
        return false;
    });

    $('.mobile-next-slide').on('click', function(){
        var nextID = parseInt($(this).parent().attr("data-id")) + 1;
        $('#slider-nav a[data-id="'+nextID+'"]').click();
    });

    $('.mobile-prev-slide').on('click', function(){
        var prevID = parseInt($(this).parent().attr("data-id")) - 1;
        $('#slider-nav a[data-id="'+prevID+'"]').click();
    });
    
    $('.burger-menu').click(function() {
        if(!nowScroll && !blockHash){
            nowScroll = true;
            if(!$(this).hasClass("open")){
                $('.current-slide').addClass("scale-down current-slide-menu").removeClass("current-slide");
                $('.b-screen-menu').addClass("move-down current-slide");
                $(this).addClass("open");
                $('#slider-nav').addClass("hide");
            }else{
                $('.current-slide-menu').addClass("scale-up current-slide").removeClass("current-slide-menu");
                $('.b-screen-menu').addClass("move-up").removeClass("current-slide");
                $(this).removeClass("open");
                $('#slider-nav').removeClass("hide");
            }
        }
    });

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
            $('#slider-nav a[data-id="'+slideID+'"]').click();
            blockHash = false;
        }
    });

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
                url: "i/pin.svg",
                scaledSize: new google.maps.Size(40, 58), // scaled size
                origin: new google.maps.Point(0,0), // origin
                anchor: new google.maps.Point(23,50), // anchor
            },
            title: ""
        });
        //this.marker.setAnimation(google.maps.Animation.BOUNCE);
    }

    //массив со всеми картами
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

        //Обновить карту
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