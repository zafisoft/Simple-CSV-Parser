
/**
 * Columbia CSV Parser
 * 
 * @langversion JavaScript
 * 
 * @author Christopher Pappas | github.com/damassi
 * @since 7.28.12
 */

//--------------------------------------
//+ CONSTANTS
//--------------------------------------

/*
 * The path the the CSV spreadsheet
 */
var DOCUMENT_URL = 'data/amos-vogel.csv';

/*
 * Parser Class
 */
var Parser = function() {

	var _urlVariables = [], _fileUrl;
		
	/*
   	 * @constructor
	 */
	var initialize = (function() {

		// Store url variables for filter
		_urlVariables = getUrlVars();

	})( this );

	//--------------------------------------
	//+ EVENT HANDLERS
	//--------------------------------------

	/*
   	 * Handler called when the file has loaded successfully
   	 * 
   	 * @param data
	 */
	function onLoadSuccess( data ) {
		$( '#msg-box' )
			.hide()
			.html( "Loaded: " + _fileUrl )
			.delay( 100 )
			.fadeIn();

		parseCSV( data );
	}

	/*
   	 * Handler called when there is an error loading the file
   	 * 
   	 * @param event
	 */
	function onLoadError( event ) {
		$( '#msg-box' )
			.hide()
			.html( "Error loading " + _fileUrl + ": " + event.statusText )
			.delay( 500 )
			.fadeIn();
	}

	//--------------------------------------
	//+ PRIVATE AND PROTECTED METHODS
	//--------------------------------------

	/*
   	 * Parses loaded CSV file based upon filter params 
   	 * 
   	 * @param data
	 */
	function parseCSV( data ) {
		// convert data using jQuery CSV lib
		csv = $.csv2Dictionary( data )
		
		filterAndDisplayResults( csv );
	}

	/*
   	 * Parses loaded CSV file based upon url filter params 
   	 * 
   	 * @param Array data
	 */
	function filterAndDisplayResults( csvArr ) {

		// Underscore template for quick layout
		var filteredResults = [], key, value;

		csvArr = _.filter( csvArr, function( item ) {
			for( var i = 0; i < _urlVariables.length; i++ ) {
				key = _urlVariables[ i ];
				value = _urlVariables[ key ];

				if( item[ key ] === value ) return item;
			} 
		});

		// Render items to page
		_.each( csvArr, function( item ) {
			var $ul = $( '<ul />' );
			var $li = $( '<li />' );

			for( var i in item ) {
				var $innerLi = $( '<li />' );
				$innerLi.html( 
					"<b>" + i + "</b>" + ": " + 
					item[ i ] 
				);

				$innerLi.appendTo( $ul );
			}

			$ul.appendTo( $li );
			$li.appendTo( '#results-list' );
		}) 
	}

	/*
   	 * Utility function for grabbing URLVariables from window
   	 * 
   	 * @returns Array
	 */
	function getUrlVars() {
	    var vars = [], hash;
	    var hashes = window.location.href.slice( window.location.href.indexOf( '?' ) + 1 ).split( '&' );
	 
	    for(var i = 0; i < hashes.length; i++) {
	        hash = hashes[i].split( '=' );
	        vars.push( hash[ 0 ] );
	        vars[ hash[ 0 ] ] = hash[ 1 ];
	    }
	 
	    return vars;
	}

	//--------------------------------------
	//+ PUBLIC METHODS 
	//--------------------------------------

	return {

		/*
	   	 * Public method which loads a CSV file
		 */
		load: function( url ) {
			_fileUrl = url;

			console.log( "Loading: " + _fileUrl );

			$.ajax({ 
				url: _fileUrl,
				dataType: 'text',
				success: onLoadSuccess,
				error: onLoadError
			});
		}
	}
};

/*
 * Make sure jQuery is loaded and initialize application
 */
$( document ).ready(function() {

	// Instantiate the parser
	var parser = new Parser();

	// Load the file 
	parser.load( DOCUMENT_URL );

})