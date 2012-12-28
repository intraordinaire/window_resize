window_resize
=============

Attach it to the window to delay it, catch if resize if more important thant XXpx or simply to  catch the good IE resize event (IE &lt; 9)


Changelog
=============
V1.0 : Initial release

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