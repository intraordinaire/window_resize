/*
 * windowResize
 * Attach it to the window to delay it, catch if resize is more important than XXpx or simply to  catch the good IE resize event (IE < 9)
 *
 * Latest version and complete README available on Github:
 * https://github.com/intraordinaire/window_resize
 *
 * @version 1.1.1
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
            window_height: 0, //Save window height to check if really resized
            window_width: 0,  //Save window width to check if really resized
            timer: 0,         //Timer to delay the event
            evt: null,        //The event who is catch
            defaults: {
                timeout: 0,         //The delay, in ms
                callback: null,     //The callback fn
                diff_height: false, //The min diff height, Integer, before firing the event
                step_height: false, //A table with heights, Integer, for those the event has to be fired
                diff_width: false,  //The min diff width, Integer, before firing the event
                step_width: false,  //A table with widths, Integer, for those the event has to be fired
                type: 'both'        //If we look at height, width or both resize
            },
            prototype: {
                init: function () {
                    if (this.settings.callback == null) {
                        return;
                    }
                    if (this.settings.type != 'both' && this.settings.type != 'width' && this.settings.type != 'height') {
                        this.settings.type = 'both';
                    }

                    var $window = $(window);
                    this.window_height = $window.height();
                    this.window_width = $window.width();
                    $window.resize($.proxy(this, 'handleResize'));
                },
                /**
                 * Save event fired by the browser to be able to throw it if it's ok
                 * @param evt
                 */
                handleResize: function (evt) {
                    this.evt = evt;
                    if (this.isResized()) { //If event is ok
                        //Check if we have a timeout or not
                        if (this.settings.timeout != false && !isNaN(this.settings.timeout)) { //Delay event
                            this.delayEvent();
                        } else { //Send event
                            this.sendEvent();
                        }
                    }
                },
                /**
                 * Check if resize is effective and complies with the parameters
                 * @return {boolean} true if it's a real resize with, who complies with params, false otherwise
                 */
                isResized: function () {
                    //If it's IE or if we have to respect some parameters
                    if (($.browser.msie && parseInt($.browser.version, 10) < 9) || (this.settings.diff_height != false || this.settings.diff_width != false) || (this.settings.step_height != false || this.settings.step_width != false) || this.settings.type != 'both') {
                        //Get the current window height, and check height param
                        var current_height = $(window).height();
                        var checked_height = this.checkSize(current_height, this.settings.diff_height, this.settings.step_height, this.window_height);

                        //Get the current window width, and check width params
                        var current_width = $(window).width();
                        var checked_width = this.checkSize(current_width, this.settings.diff_width, this.settings.step_width, this.window_width);

                        //If width or height changed, resize is valid
                        if ((this.settings.type == 'both' && (checked_height || checked_width)) || (this.settings.type == 'height' && checked_height) || (this.settings.type == 'width' && checked_width)) {
                            this.window_height = current_height;
                            this.window_width = current_width;
                            return true;
                        }
                        return false;
                    }
                    return true;
                },
                /**
                 * Send event
                 */
                sendEvent: function () {
                    this.settings.callback.apply(this, [this.evt]);
                },
                /**
                 * For a given size (width or height) check the paramters
                 * @param current_size current widht or height
                 * @param diff_size min diff size
                 * @param step_size step table
                 * @param window_size saved window size
                 * @return {boolean} true if the current size is compliant with the others params, false otherwise
                 */
                checkSize: function (current_size, diff_size, step_size, window_size) {
                    return (!diff_size && !step_size && current_size != window_size)
                        ||
                        (
                            diff_size
                            &&
                            (
                                parseInt(diff_size) < parseInt(window_size - current_size)
                                ||
                                (parseInt(diff_size) * -1) > parseInt(window_size - current_size)
                            )
                        )
                        ||
                        (
                            typeof step_size == 'object'
                            &&
                            this.inStep(current_size, window_size, step_size)
                        );
                },
                /**
                 * Delay the "sendEvent" function with de timeout
                 */
                delayEvent: function () {
                    clearTimeout(this.timer);
                    this.timer = setTimeout($.proxy(this, 'sendEvent'), parseInt(this.settings.timeout));
                },
                /**
                 * Check if the current size is between the saved one, and one of the given steps
                 * @param current The current size
                 * @param saved The saved window size
                 * @param step The steps
                 * @return {boolean} true if size is between, false otherwise
                 */
                inStep: function (current, saved, step) {
                    var length = step.length;
                    for (var i = 0; i < length; i++) {
                        if (step[i] == current || step[i] == saved || (step[i] < current && step[i] > saved) || (step[i] > current && step[i] < saved)) return true;
                    }
                    return false;
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