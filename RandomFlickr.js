; RandomFlickr = ( function() {

	var apikey = "44141304bae729be6f9fc4c9173e987f";

	//get photos for tag
	function requestTag( tag ) {
		tag = tag.trim();
		console.log( "requesting tag " + tag + "..." );
		var defer = jQuery.Deferred();
		$.get( "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + apikey + "&format=json&nojsoncallback=1&tags=" + tag, function( list ) {
			if ( list.stat === "ok" ) {
				//received some 2xx code
				console.log( "got photos for tag " + tag );
				defer.resolve( list.photos.photo );
			}
			else {
				alert( list.message );
			}
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
			$.get( "http://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" + apikey + "&format=json&nojsoncallback=1&photo_id=" + photo.id, function( sizes ) {
				console.log( "got sizes for photo" );
				//kaizer sizes
				console.log( sizes.sizes.size );
				defer.resolve( sizes.sizes.size );
			});
		});
		return defer.promise();
	}

	function chooseSize( request_defer, size ) {
		var defer = jQuery.Deferred();
		//wait util photo size request finished
		request_defer.then( function( sizes ) {
			//find closest matching size
			console.log( "looking for appropriate size" );

			var width = size != null ? size[0] : 4000,
				height = size != null ? size[1] : 3000,
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
			defer.resolve( sizes[ index ].source );
		});
		return defer.promise();
	}

	return {
		get: function( tag, callback, options, context ) {
			if ( tag === null || tag.length === 0 )
				throw new Error( "Tag is NULL or empty." );
			if ( callback == null )
				throw new Error( "Callback not provided." );

			if ( options != null ) {
				if ( options.apikey != null )
					this.apikey = options.apikey;
			} 

			var deferred_photos = requestTag( tag );
			var deferred_photo = requestOneFrom( deferred_photos );

			chooseSize( deferred_photo ).then( function( url ) {
				callback( url, context );
			});
		}
	}

} )();