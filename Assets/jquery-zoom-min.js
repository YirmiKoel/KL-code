/*!
	Zoom 1.7.18
	license: MIT
	http://www.jacklmoore.com/zoom
*
(function(o){var t={url:!1,callback:!1,target:!1,duration:120,on:"mouseover",touch:!0,onZoomIn:!1,onZoomOut:!1,magnify:1};o.zoom=function(t,n,e,i){var u,c,a,r,m,l,s,f=o(t),h=f.css("position"),d=o(n);return t.style.position=/(absolute|fixed)/.test(h)?h:"relative",t.style.overflow="hidden",e.style.width=e.style.height="",o(e).addClass("zoomImg").css({position:"absolute",top:0,left:0,opacity:0,width:e.width*i,height:e.height*i,border:"none",maxWidth:"none",maxHeight:"none"}).appendTo(t),{init:function(){c=f.outerWidth(),u=f.outerHeight(),n===t?(r=c,a=u):(r=d.outerWidth(),a=d.outerHeight()),m=(e.width-c)/r,l=(e.height-u)/a,s=d.offset()},move:function(o){var t=o.pageX-s.left,n=o.pageY-s.top;n=Math.max(Math.min(n,a),0),t=Math.max(Math.min(t,r),0),e.style.left=t*-m+"px",e.style.top=n*-l+"px"}}},o.fn.zoom=function(n){return this.each(function(){var e=o.extend({},t,n||{}),i=e.target&&o(e.target)[0]||this,u=this,c=o(u),a=document.createElement("img"),r=o(a),m="mousemove.zoom",l=!1,s=!1;if(!e.url){var f=u.querySelector("img");if(f&&(e.url=f.getAttribute("data-src-zoom")||f.currentSrc||f.src),!e.url)return}c.one("zoom.destroy",function(o,t){c.off(".zoom"),i.style.position=o,i.style.overflow=t,a.onload=null,r.remove()}.bind(this,i.style.position,i.style.overflow)),a.onload=function(){function t(t){f.init(),f.move(t),r.stop().fadeTo(o.support.opacity?e.duration:0,1,o.isFunction(e.onZoomIn)?e.onZoomIn.call(a):!1)}function n(){r.stop().fadeTo(e.duration,0,o.isFunction(e.onZoomOut)?e.onZoomOut.call(a):!1)}var f=o.zoom(i,u,a,e.magnify);"grab"===e.on?c.on("mousedown.zoom",function(e){1===e.which&&(o(document).one("mouseup.zoom",function(){n(),o(document).off(m,f.move)}),t(e),o(document).on(m,f.move),e.preventDefault())}):"click"===e.on?c.on("click.zoom",function(e){return l?void 0:(l=!0,t(e),o(document).on(m,f.move),o(document).one("click.zoom",function(){n(),l=!1,o(document).off(m,f.move)}),!1)}):"toggle"===e.on?c.on("click.zoom",function(o){l?n():t(o),l=!l}):"mouseover"===e.on&&(f.init(),c.on("mouseenter.zoom",t).on("mouseleave.zoom",n).on(m,f.move)),e.touch&&c.on("touchstart.zoom",function(o){o.preventDefault(),s?(s=!1,n()):(s=!0,t(o.originalEvent.touches[0]||o.originalEvent.changedTouches[0]))}).on("touchmove.zoom",function(o){o.preventDefault(),f.move(o.originalEvent.touches[0]||o.originalEvent.changedTouches[0])}).on("touchend.zoom",function(o){o.preventDefault(),s&&(s=!1,n())}),o.isFunction(e.callback)&&e.callback.call(a)},a.src=e.url})},o.fn.zoom.defaults=t})(window.jQuery);*/

/*!
	Zoom 1.7.20
	license: MIT
	http://www.jacklmoore.com/zoom
*/
(function ($) {
    var defaults = {
        url: false,
        callback: false,
        target: false,
        duration: 120,
        on: 'mouseover', // other options: grab, click, toggle
        touch: true, // enables a touch fallback
        onZoomIn: false,
        onZoomOut: false,
        magnify: 1
    };

    // Core Zoom Logic, independent of event listeners.
    $.zoom = function (target, source, img, magnify) {
        var targetHeight,
            targetWidth,
            sourceHeight,
            sourceWidth,
            xRatio,
            yRatio,
            offset,
            $target = $(target),
            position = $target.css('position'),
            $source = $(source);

        // The parent element needs positioning so that the zoomed element can be correctly positioned within.
        target.style.position = /(absolute|fixed)/.test(position) ? position : 'relative';
        target.style.overflow = 'hidden';
        img.style.width = img.style.height = '';

        $(img)
            .addClass('zoomImg')
            .css({
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: 0,
                width: img.width * magnify,
                height: img.height * magnify,
                border: 'none',
                maxWidth: 'none',
                maxHeight: 'none'
            })
            .appendTo(target);

        return {
            init: function () {
                targetWidth = $target.outerWidth();
                targetHeight = $target.outerHeight();

                if (source === target) {
                    sourceWidth = targetWidth;
                    sourceHeight = targetHeight;
                } else {
                    sourceWidth = $source.outerWidth();
                    sourceHeight = $source.outerHeight();
                }

                xRatio = (img.width - targetWidth) / sourceWidth;
                yRatio = (img.height - targetHeight) / sourceHeight;

                offset = $source.offset();
            },
            move: function (e) {
                var left = (e.pageX - offset.left),
                    top = (e.pageY - offset.top);

                top = Math.max(Math.min(top, sourceHeight), 0);
                left = Math.max(Math.min(left, sourceWidth), 0);

                img.style.left = (left * -xRatio) + 'px';
                img.style.top = (top * -yRatio) + 'px';
            }
        };
    };

    $.fn.zoom = function (options) {
        return this.each(function () {
            var
                settings = $.extend({}, defaults, options || {}),
                //target will display the zoomed image
                target = settings.target && $(settings.target)[0] || this,
                //source will provide zoom location info (thumbnail)
                source = this,
                $source = $(source),
                img = document.createElement('img'),
                $img = $(img),
                mousemove = 'mousemove.zoom',
                clicked = false,
                loaded = false,
                touched = false;

            // If a url wasn't specified, look for an image element.
            if (!settings.url) {
                var srcElement = source.querySelector('img');
                if (srcElement) {
                    settings.url = srcElement.getAttribute('data-src-zoom') || srcElement.currentSrc || srcElement.src;
                }
                if (!settings.url) {
                    return;
                }
            }

            $source.one('zoom.destroy', function (position, overflow) {
                $source.off(".zoom");
                target.style.position = position;
                target.style.overflow = overflow;
                img.onload = null;
                $img.remove();
            }.bind(this, target.style.position, target.style.overflow));

            var zoom = null

            function start(e) {
                if (loaded == false) {
                    img.setAttribute('role', 'presentation');
                    img.src = settings.url;

                    img.onload = function () {
                        zoom = $.zoom(target, source, img, settings.magnify);

                        zoom.init();
                        zoom.move(e);

                        $img.fadeTo(settings.duration, 1, false);

                        loaded = true;
                    }
                }
                else {
                    zoom.move(e);

                    $img.fadeTo(settings.duration, 1, false);
                }
            }

            function stop() {
                $img.stop()
                    .fadeTo(settings.duration, 0, $.isFunction(settings.onZoomOut) ? settings.onZoomOut.call(img) : false);
            }

            function xmove(e) {
                if (loaded == true) {
                    zoom.move(e);
                    console.log('move');
                }
            }

            $source
                .on('mouseenter.zoom', start)
                .on('mouseleave.zoom', stop)
                .on('mousemove', xmove);

            if ($.isFunction(settings.callback)) {
                settings.callback.call(img);
            }
        });
    };

    $.fn.zoom.defaults = defaults;
}(window.jQuery));