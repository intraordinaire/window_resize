/*
 * windowResize
 * Attach it to the window to delay it, catch if resize is more important than XXpx or simply to  catch the good IE resize event (IE < 9)
 *
 * Latest version and complete README available on Github:
 * https://github.com/intraordinaire/window_resize
 *
 * @version 1.0
 * Copyright 2012 Vincent Garcia
 * @author Vincent Garcia https://github.com/intraordinaire/
 * Licensed under the MIT license.
 */
(function ($) {
    $.windowResize = function (element, options) {
        this.settings = $.extend(true, {}, $.windowResize.defaults, options);
        this.element = element;
        this.init();
    };
    $.extend($.windowResize,
        {
            processing: false,
            window_height: 0,
            window_width: 0,
            timer: 0,
            evt: null,
            defaults: {
                timeout: 0,
                callback: null,
                diff_height: false,
                diff_width: false,
                type: 'both'
            },
            prototype: {
                init: function () {
                    if (this.settings.callback == null) {
                        return;
                    }
                    if (this.settings.type != 'both' && this.settings.type != 'both' && this.settings.type != 'both') {
                        this.settings.type = 'both';
                    }

                    var $window = $(window);
                    this.window_height = $window.height();
                    this.window_width = $window.width();
                    $window.resize($.proxy(this, 'handleResize'));
                },
                handleResize: function (evt) {
                    this.evt = evt;
                    this.triggerResize();
                },
                triggerResize: function () {
                    if (this.isResized()) {
                        if (this.settings.timeout != false && !isNaN(this.settings.timeout)) {
                            this.delayEvent();
                        } else {
                            this.sendEvent();
                        }
                    }
                    return false;
                },
                sendEvent: function () {
                    return this.settings.callback.apply(this, [this.evt]);
                },
                isResized: function () {
                    if (($.browser.msie && parseInt($.browser.version, 10) < 9) || (this.settings.diff_height != false || this.settings.diff_width != false)) {
                        var current_height = $(window).height();
                        var checked_height = (!this.settings.diff_height && current_height != this.window_height) || (this.settings.diff_height && (parseInt(this.settings.diff_height) < parseInt(this.window_height - current_height) || (parseInt(this.settings.diff_height) * -1) > parseInt(this.window_height - current_height)));
                        var current_width = $(window).width();
                        var checked_width = (!this.settings.diff_width && current_width != this.window_width) || (this.settings.diff_width && (parseInt(this.settings.diff_width) < parseInt(this.window_width - current_width) || (parseInt(this.settings.diff_width) * -1) > parseInt(this.window_width - current_width)));

                        if ((this.settings.type == 'both' && (checked_height || checked_width)) || (this.settings.type == 'height' && checked_height) || (this.settings.type == 'width' && checked_width)) {
                            this.window_height = current_height;
                            this.window_width = current_width;
                            return true;
                        }
                        return false;
                    }
                    return true;
                },
                delayEvent: function () {
                    clearTimeout(this.timer);
                    this.timer = setTimeout($.proxy(this, 'sendEvent'), parseInt(this.settings.timeout));
                }
            }
        });
    $.fn.windowResize = function (options) {
        return this.each(function () {
            if (undefined == $(this).data('windowResize')) {
                if (this == window) {
                    $(this).data('windowResize', new $.windowResize(this, options));
                }
                else if (!undefined(options.callback)) {
                    $(this).resize(options.callback);
                }
            }
        });
    }
})(jQuery);