# Elm Flickr Example w/ JS Promises

The Flickr Example from the blogpost [Escape from Callback Hell](http://elm-lang.org/learn/Escape-from-Callback-Hell.elm) in Javascript. But with Promises, resulting in prettier code.

~~~ javascript
	var deferred_photos = requestTag( tag );
	var deferred_photo = requestOneFrom( deferred_photos );
	drawOnScreen( deferred_photo );
~~~