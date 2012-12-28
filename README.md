window_resize
=============

Attach it to the window.
It resolve the IE &lt; 9 problem of window resize who fire event on each DOM element.

PLUS : 
* You can add a timeout.
* You can chose if you want to watch only "width", "height" or "both" resize.
* You can add an minimum "diff" pixels on width and height resize.


Changelog
=============
* V1.0.1 : Correct bug for only 'width' or 'height' without diff
* V1.0   : Initial release

Example
=============
<pre>
	<code>
jQuery(window).windowResize(
{
	callback: onWindowResize,
	timeout: 500
});
	
function onWindowResize(evt) {
    console.log('onWindowResize');
};
</code>
</pre>

More examples
=============
<a href="http://intraordinaire.github.com/window_resize/">Visit website</a>