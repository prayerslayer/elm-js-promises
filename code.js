//get photos for tag
function requestTag( tag ) {
	console.log( "requesting tag " + tag + "..." );
	var defer = jQuery.Deferred();
	$.get( "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=ca0c4e9e5c12ae69c7a7e489c56670a7&format=json&nojsoncallback=1&tags=" + tag, function( list ) {
		console.log( "got photos for tag " + tag );
		defer.resolve( list.photos.photo );
	});
	return defer.promise();
}

//choose random photo, request full photo
function requestOneFrom( tag_defer ) {
	console.log( "choosing photo...");
	//wait until tag request finished
	var defer = jQuery.Deferred();
	tag_defer.then( function( list ) {
		var count = list.length;
		//choose random photo
		var index = Math.floor( Math.random() * count );
		console.log( "photo #" + index + " it is!" );
		var photo = list[index];
		console.log( photo );
		//request sizes
		$.get( "http://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=ca0c4e9e5c12ae69c7a7e489c56670a7&format=json&nojsoncallback=1&photo_id=" + photo.id, function( sizes ) {
			console.log( "got sizes for photo" );
			//kaizer sizes
			console.log( sizes.sizes.size );
			defer.resolve( sizes.sizes.size );
		});
	});
	return defer.promise();
}

//draw photo on screen
function drawOnScreen( request_defer ) {
	console.log( "drawing photo on screen" );
	//wait util photo size request finished
	request_defer.then( function( sizes ) {
		//find closest matching size
		console.log( "looking for appropriate size" );

		var $photo = $( "#photo" ),
			width = $photo.width(),
			height = $photo.height(),
			index = 0,
			mindiff = Number.POSITIVE_INFINITY;

		$.each( sizes, function( idx, size ) {
			var diff = Math.abs( parseInt( size.width ) - width + parseInt( size.height ) - height );
			if ( diff < mindiff ) {
				console.log( diff + " is better than " + mindiff );
				index = idx;
				mindiff = diff;
			}
		});
		console.log( "size #" + index + " it is" );
		console.log( sizes[ index ].source );
		$photo.attr( "src", sizes[ index ].source );
		$photo.css( "width", sizes[ index ].width );
		$photo.css( "height", sizes[ index ].height );
	});
}

$( document ).ready( function() {
	$( "#spinner" )
		.ajaxStart( function() {
			$(this).fadeIn(100);
		})
		.ajaxComplete( function() {
			$(this).fadeOut(100);
		});

	$( "#tag" ).keypress( function( evt ) {
		// user pressed enter
		if ( evt.which == 13 ) {
			//get tag
			var tag = $( "#tag" ).val();
			//check if it's not empty
			if ( !tag.length ) {
				alert( "Please enter something." );
				return;
			}

			var deferred_photos = requestTag( tag );
			var deferred_photo = requestOneFrom( deferred_photos );
			drawOnScreen( deferred_photo );
		}
	});
});