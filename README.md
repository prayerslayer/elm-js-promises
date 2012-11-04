# Elm Flickr Example w/ JS Promises

The Flickr Example from the blogpost [Escape from Callback Hell](http://elm-lang.org/learn/Escape-from-Callback-Hell.elm) in Javascript with Promises, resulting in prettier code.

~~~ javascript
	var deferred_photos = requestTag( tag );
	var deferred_photo = requestOneFrom( deferred_photos );
	drawOnScreen( deferred_photo );
~~~

However, Elm is still more reusable due to implicit dependencies of JS Code. For example `requestOneFrom`:

1. Expects jQuery Deferred Object as input,
2. expects that input will be resolved some time,
3. expects that after resolving, input will return photos fetched from Flickr.