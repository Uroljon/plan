/*!
 * jQuery JavaScript Library v1.9.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2012 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-2-4
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<9
	// For `typeof node.method` instead of `node.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,
	location = window.location,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.9.1",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				args = args || [];
				args = [ context, args.slice ? args.slice() : args ];
				if ( list && ( !fired || stack ) ) {
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function() {

	var support, all, a,
		input, select, fragment,
		opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Support tests won't run in some limited or non-browser environments
	all = div.getElementsByTagName("*");
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !all || !a || !all.length ) {
		return {};
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";
	support = {
		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType === 3,

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.5/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
		checkOn: !!input.value,

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Tests for enctype support on a form (#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
		boxModel: document.compatMode === "CSS1Compat",

		// Will be defined later
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		boxSizingReliable: true,
		pixelPosition: false
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP), test/csp.php
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
		support.boxSizing = ( div.offsetWidth === 4 );
		support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})();

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, ret,
		internalKey = jQuery.expando,
		getByName = typeof name === "string",

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			elem[ internalKey ] = id = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		cache[ id ] = {};

		// Avoids exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		if ( !isNode ) {
			cache[ id ].toJSON = jQuery.noop;
		}
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( getByName ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var i, l, thisCache,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			for ( i = 0, l = name.length; i < l; i++ ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( !name.indexOf( "data-" ) ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				// Try to fetch any internally stored data first
				return elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
			}

			this.each(function() {
				jQuery.data( this, key, value );
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		hooks.cur = fn;
		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	rboolean = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val,
				self = jQuery(this);

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, notxml, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && notxml && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && notxml && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			// In IE9+, Flash objects don't have .getAttribute (#12945)
			// Support: IE9+
			if ( typeof elem.getAttribute !== core_strundefined ) {
				ret =  elem.getAttribute( name );
			}

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( rboolean.test( name ) ) {
					// Set corresponding property to false for boolean attributes
					// Also clear defaultChecked/defaultSelected (if appropriate) for IE<8
					if ( !getSetAttribute && ruseDefault.test( name ) ) {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					} else {
						elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		var
			// Use .prop to determine if this attribute is understood as boolean
			prop = jQuery.prop( elem, name ),

			// Fetch it accordingly
			attr = typeof prop === "boolean" && elem.getAttribute( name ),
			detail = typeof prop === "boolean" ?

				getSetInput && getSetAttribute ?
					attr != null :
					// oldIE fabricates an empty string for missing boolean attributes
					// and conflates checked/selected into attroperties
					ruseDefault.test( name ) ?
						elem[ jQuery.camelCase( "default-" + name ) ] :
						!!attr :

				// fetch an attribute node for properties not recognized as boolean
				elem.getAttributeNode( name );

		return detail && detail.value !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};

// fix oldIE value attroperty
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return jQuery.nodeName( elem, "input" ) ?

				// Ignore the value *property* by using defaultValue
				elem.defaultValue :

				ret && ret.specified ? ret.value : undefined;
		},
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ( name === "id" || name === "name" || name === "coords" ? ret.value !== "" : ret.specified ) ?
				ret.value :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret == null ? undefined : ret;
			}
		});
	});

	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		event.isTrigger = true;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur != this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			}
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== document.activeElement && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === document.activeElement && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
/*!
 * Sizzle CSS Selector Engine
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */
(function( window, undefined ) {

var i,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	hasDuplicate,
	outermostContext,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsXML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,
	sortOrder,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	support = {},
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Array methods
	arr = [],
	pop = arr.pop,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},


	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	operators = "([*^$|!~]?=)",
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rsibling = /[\x20\t\r\n\f]*[+~]/,

	rnative = /^[^{]+\{\s*\[native code/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,
	rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
	funescape = function( _, escaped ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		return high !== high ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Use a stripped-down slice if we can't use a native one
try {
	slice.call( preferredDoc.documentElement.childNodes, 0 )[0].nodeType;
} catch ( e ) {
	slice = function( i ) {
		var elem,
			results = [];
		while ( (elem = this[i++]) ) {
			results.push( elem );
		}
		return results;
	};
}

/**
 * For feature detection
 * @param {Function} fn The function to test for native support
 */
function isNative( fn ) {
	return rnative.test( fn + "" );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var cache,
		keys = [];

	return (cache = function( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	});
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return fn( div );
	} catch (e) {
		return false;
	} finally {
		// release memory in IE
		div = null;
	}
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( !documentIsXML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getByClassName && context.getElementsByClassName ) {
				push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && !rbuggyQSA.test(selector) ) {
			old = true;
			nid = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results, slice.call( newContext.querySelectorAll(
						newSelector
					), 0 ) );
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsXML = isXML( doc );

	// Check if getElementsByTagName("*") returns only elements
	support.tagNameNoComments = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if attributes should be retrieved by attribute nodes
	support.attributes = assert(function( div ) {
		div.innerHTML = "<select></select>";
		var type = typeof div.lastChild.getAttribute("multiple");
		// IE8 returns a string for some attributes even when not present
		return type !== "boolean" && type !== "string";
	});

	// Check if getElementsByClassName can be trusted
	support.getByClassName = assert(function( div ) {
		// Opera can't find a second classname (in 9.6)
		div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
		if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
			return false;
		}

		// Safari 3.2 caches class attributes and doesn't catch changes
		div.lastChild.className = "e";
		return div.getElementsByClassName("e").length === 2;
	});

	// Check if getElementById returns elements by name
	// Check if getElementsByName privileges form controls or returns elements by ID
	support.getByName = assert(function( div ) {
		// Inject content
		div.id = expando + 0;
		div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
		docElem.insertBefore( div, docElem.firstChild );

		// Test
		var pass = doc.getElementsByName &&
			// buggy browsers will return fewer than the correct 2
			doc.getElementsByName( expando ).length === 2 +
			// buggy browsers will return more than the correct 0
			doc.getElementsByName( expando + 0 ).length;
		support.getIdNotName = !doc.getElementById( expando );

		// Cleanup
		docElem.removeChild( div );

		return pass;
	});

	// IE6/7 return modified attributes
	Expr.attrHandle = assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
			div.firstChild.getAttribute("href") === "#";
	}) ?
		{} :
		{
			"href": function( elem ) {
				return elem.getAttribute( "href", 2 );
			},
			"type": function( elem ) {
				return elem.getAttribute("type");
			}
		};

	// ID find and filter
	if ( support.getIdNotName ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
				var m = context.getElementById( id );

				return m ?
					m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
						[m] :
						undefined :
					[];
			}
		};
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.tagNameNoComments ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Name
	Expr.find["NAME"] = support.getByName && function( tag, context ) {
		if ( typeof context.getElementsByName !== strundefined ) {
			return context.getElementsByName( name );
		}
	};

	// Class
	Expr.find["CLASS"] = support.getByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && !documentIsXML ) {
			return context.getElementsByClassName( className );
		}
	};

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21),
	// no need to also add to buggyMatches since matches checks buggyQSA
	// A support test would require too much code (would include document ready)
	rbuggyQSA = [ ":focus" ];

	if ( (support.qsa = isNative(doc.querySelectorAll)) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explictly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// IE8 - Some boolean attributes are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Opera 10-12/IE8 - ^= $= *= and empty values
			// Should not select anything
			div.innerHTML = "<input type='hidden' i=''/>";
			if ( div.querySelectorAll("[i^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = isNative( (matches = docElem.matchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.webkitMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = new RegExp( rbuggyMatches.join("|") );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = isNative(docElem.contains) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {
		var compare;

		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( (compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b )) ) {
			if ( compare & 1 || a.parentNode && a.parentNode.nodeType === 11 ) {
				if ( a === doc || contains( preferredDoc, a ) ) {
					return -1;
				}
				if ( b === doc || contains( preferredDoc, b ) ) {
					return 1;
				}
				return 0;
			}
			return compare & 4 ? -1 : 1;
		}

		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	// Always assume the presence of duplicates if sort doesn't
	// pass them to our comparison function (as in Google Chrome).
	hasDuplicate = false;
	[0, 0].sort( sortOrder );
	support.detectDuplicates = hasDuplicate;

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	// rbuggyQSA always contains :focus, so no need for an existence check
	if ( support.matchesSelector && !documentIsXML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && !rbuggyQSA.test(expr) ) {
		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	var val;

	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	if ( !documentIsXML ) {
		name = name.toLowerCase();
	}
	if ( (val = Expr.attrHandle[ name ]) ) {
		return val( elem );
	}
	if ( documentIsXML || support.attributes ) {
		return elem.getAttribute( name );
	}
	return ( (val = elem.getAttributeNode( name )) || elem.getAttribute( name ) ) && elem[ name ] === true ?
		name :
		val && val.specified ? val.value : null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

// Document sorting and removing duplicates
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		i = 1,
		j = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		for ( ; (elem = results[i]); i++ ) {
			if ( elem === results[ i - 1 ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && ( ~b.sourceIndex || MAX_NEGATIVE ) - ( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

// Returns a function to use in pseudos for input types
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

// Returns a function to use in pseudos for buttons
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

// Returns a function to use in pseudos for positionals
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[4] ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeName ) {
			if ( nodeName === "*" ) {
				return function() { return true; };
			}

			nodeName = nodeName.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
			};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifider
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsXML ?
						elem.getAttribute("xml:lang") || elem.getAttribute("lang") :
						elem.lang) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector( tokens.slice( 0, i - 1 ) ).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					context.nodeType === 9 && !documentIsXML &&
					Expr.relative[ tokens[1].type ] ) {

				context = Expr.find["ID"]( token.matches[0].replace( runescape, funescape ), context )[0];
				if ( !context ) {
					return results;
				}

				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, slice.call( seed, 0 ) );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		documentIsXML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// Deprecated
Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Easy API for creating new setFilters
function setFilters() {}
Expr.filters = setFilters.prototype = Expr.pseudos;
Expr.setFilters = new setFilters();

// Initialize with the default document
setDocument();

// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
var runtil = /Until$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	isSimple = /^.[^:#\[\.,]*$/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i, ret, self,
			len = this.length;

		if ( typeof selector !== "string" ) {
			self = this;
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		ret = [];
		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, this[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = ( this.selector ? this.selector + " " : "" ) + selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true) );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				rneedsContext.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			cur = this[i];

			while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;
				}
				cur = cur.parentNode;
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

jQuery.fn.andSelf = jQuery.fn.addBack;

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( this.length > 1 && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, false, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, false, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length > 0 ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( getAll( elem ) );
				}

				if ( elem.parentNode ) {
					if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
						setGlobalEval( getAll( elem, "script" ) );
					}
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function( value ) {
		var isFunc = jQuery.isFunction( value );

		// Make sure that the elements are removed from the DOM before they are inserted
		// this can help fix replacing a parent with child elements
		if ( !isFunc && typeof value !== "string" ) {
			value = jQuery( value ).not( this ).detach();
		}

		return this.domManip( [ value ], true, function( elem ) {
			var next = this.nextSibling,
				parent = this.parentNode;

			if ( parent ) {
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		});
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, table ? self.html() : undefined );
				}
				self.domManip( args, table, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call(
						table && jQuery.nodeName( this[i], "table" ) ?
							findOrAppend( this[i], "tbody" ) :
							this[i],
						node,
						i
					);
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery.ajax({
									url: node.src,
									type: "GET",
									dataType: "script",
									async: false,
									global: false,
									"throws": true
								});
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

function findOrAppend( elem, tag ) {
	return elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	var attr = elem.getAttributeNode("type");
	elem.type = ( attr && attr.specified ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		var bool = typeof state === "boolean";

		return this.each(function() {
			if ( bool ? state : isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.hover = function( fnOver, fnOut ) {
	return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
};
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 ) {
					isSuccess = true;
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					isSuccess = true;
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					isSuccess = ajaxConvert( s, response );
					statusText = isSuccess.state;
					success = isSuccess.data;
					error = isSuccess.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	}
});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {
	var conv2, current, conv, tmp,
		converters = {},
		i = 0,
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice(),
		prev = dataTypes[ 0 ];

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	// Convert to each sequential dataType, tolerating list modification
	for ( ; (current = dataTypes[++i]); ) {

		// There's only work to do if current dataType is non-auto
		if ( current !== "*" ) {

			// Convert response if prev dataType is non-auto and differs from current
			if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split(" ");
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.splice( i--, 0, current );
								}

								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s["throws"] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}

			// Update prev for next iteration
			prev = current;
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var end, unit,
				tween = this.createTween( prop, value ),
				parts = rfxnum.exec( value ),
				target = tween.cur(),
				start = +target || 0,
				scale = 1,
				maxIterations = 20;

			if ( parts ) {
				end = +parts[2];
				unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

				// We need to compute starting value
				if ( unit !== "px" && start ) {
					// Iteratively approximate from a nonzero starting point
					// Prefer the current property, because this process will be trivial if it uses the same units
					// Fallback to end or a simple constant
					start = jQuery.css( tween.elem, prop, true ) || end || 1;

					do {
						// If previous iteration zeroed out, double until we get *something*
						// Use a string for doubling factor so we don't accidentally see scale as unchanged below
						scale = scale || ".5";

						// Adjust and apply
						start = start / scale;
						jQuery.style( tween.elem, prop, start + unit );

					// Update scale, tolerating zero or NaN from tween.cur()
					// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
					} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
				}

				tween.unit = unit;
				tween.start = start;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
			}
			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTweens( animation, props ) {
	jQuery.each( props, function( prop, value ) {
		var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( collection[ index ].call( animation, prop, value ) ) {

				// we're done with this property
				return;
			}
		}
	});
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	createTweens( animation, props );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var value, name, index, easing, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/*jshint validthis:true */
	var prop, index, length,
		value, dataShow, toggle,
		tween, hooks, oldfire,
		anim = this,
		style = elem.style,
		orig = {},
		handled = [],
		hidden = elem.nodeType && isHidden( elem );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( index in props ) {
		value = props[ index ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ index ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			handled.push( index );
		}
	}

	length = handled.length;
	if ( length ) {
		dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
		if ( "hidden" in dataShow ) {
			hidden = dataShow.hidden;
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( index = 0 ; index < length ; index++ ) {
			prop = handled[ index ];
			tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
			orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );
				doAnimation.finish = function() {
					anim.stop( true );
				};
				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.cur && hooks.cur.finish ) {
				hooks.cur.finish.call( this );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.documentElement;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || document.documentElement;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// })();
// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Button elements boud jquery-ujs
    buttonClickSelector: 'button[data-remote]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($(document), 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $(document).delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $(document).delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $(document).delegate(rails.buttonClickSelector, 'click.rails', function(e) {
      var button = $(this);
      if (!rails.allowAction(button)) return rails.stopEverything(e);

      rails.handleRemote(button);
      return false;
    });

    $(document).delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $(document).delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $(document).delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $(document).delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $(document).delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
/*!
 * Bootstrap v3.1.1 (http://getbootstrap.com)
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");+function(a){"use strict";function b(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return{end:b[c]};return!1}a.fn.emulateTransitionEnd=function(b){var c=!1,d=this;a(this).one(a.support.transition.end,function(){c=!0});var e=function(){c||a(d).trigger(a.support.transition.end)};return setTimeout(e,b),this},a(function(){a.support.transition=b()})}(jQuery),+function(a){"use strict";var b='[data-dismiss="alert"]',c=function(c){a(c).on("click",b,this.close)};c.prototype.close=function(b){function c(){f.trigger("closed.bs.alert").remove()}var d=a(this),e=d.attr("data-target");e||(e=d.attr("href"),e=e&&e.replace(/.*(?=#[^\s]*$)/,""));var f=a(e);b&&b.preventDefault(),f.length||(f=d.hasClass("alert")?d:d.parent()),f.trigger(b=a.Event("close.bs.alert")),b.isDefaultPrevented()||(f.removeClass("in"),a.support.transition&&f.hasClass("fade")?f.one(a.support.transition.end,c).emulateTransitionEnd(150):c())};var d=a.fn.alert;a.fn.alert=function(b){return this.each(function(){var d=a(this),e=d.data("bs.alert");e||d.data("bs.alert",e=new c(this)),"string"==typeof b&&e[b].call(d)})},a.fn.alert.Constructor=c,a.fn.alert.noConflict=function(){return a.fn.alert=d,this},a(document).on("click.bs.alert.data-api",b,c.prototype.close)}(jQuery),+function(a){"use strict";var b=function(c,d){this.$element=a(c),this.options=a.extend({},b.DEFAULTS,d),this.isLoading=!1};b.DEFAULTS={loadingText:"loading..."},b.prototype.setState=function(b){var c="disabled",d=this.$element,e=d.is("input")?"val":"html",f=d.data();b+="Text",f.resetText||d.data("resetText",d[e]()),d[e](f[b]||this.options[b]),setTimeout(a.proxy(function(){"loadingText"==b?(this.isLoading=!0,d.addClass(c).attr(c,c)):this.isLoading&&(this.isLoading=!1,d.removeClass(c).removeAttr(c))},this),0)},b.prototype.toggle=function(){var a=!0,b=this.$element.closest('[data-toggle="buttons"]');if(b.length){var c=this.$element.find("input");"radio"==c.prop("type")&&(c.prop("checked")&&this.$element.hasClass("active")?a=!1:b.find(".active").removeClass("active")),a&&c.prop("checked",!this.$element.hasClass("active")).trigger("change")}a&&this.$element.toggleClass("active")};var c=a.fn.button;a.fn.button=function(c){return this.each(function(){var d=a(this),e=d.data("bs.button"),f="object"==typeof c&&c;e||d.data("bs.button",e=new b(this,f)),"toggle"==c?e.toggle():c&&e.setState(c)})},a.fn.button.Constructor=b,a.fn.button.noConflict=function(){return a.fn.button=c,this},a(document).on("click.bs.button.data-api","[data-toggle^=button]",function(b){var c=a(b.target);c.hasClass("btn")||(c=c.closest(".btn")),c.button("toggle"),b.preventDefault()})}(jQuery),+function(a){"use strict";var b=function(b,c){this.$element=a(b),this.$indicators=this.$element.find(".carousel-indicators"),this.options=c,this.paused=this.sliding=this.interval=this.$active=this.$items=null,"hover"==this.options.pause&&this.$element.on("mouseenter",a.proxy(this.pause,this)).on("mouseleave",a.proxy(this.cycle,this))};b.DEFAULTS={interval:5e3,pause:"hover",wrap:!0},b.prototype.cycle=function(b){return b||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(a.proxy(this.next,this),this.options.interval)),this},b.prototype.getActiveIndex=function(){return this.$active=this.$element.find(".item.active"),this.$items=this.$active.parent().children(),this.$items.index(this.$active)},b.prototype.to=function(b){var c=this,d=this.getActiveIndex();return b>this.$items.length-1||0>b?void 0:this.sliding?this.$element.one("slid.bs.carousel",function(){c.to(b)}):d==b?this.pause().cycle():this.slide(b>d?"next":"prev",a(this.$items[b]))},b.prototype.pause=function(b){return b||(this.paused=!0),this.$element.find(".next, .prev").length&&a.support.transition&&(this.$element.trigger(a.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},b.prototype.next=function(){return this.sliding?void 0:this.slide("next")},b.prototype.prev=function(){return this.sliding?void 0:this.slide("prev")},b.prototype.slide=function(b,c){var d=this.$element.find(".item.active"),e=c||d[b](),f=this.interval,g="next"==b?"left":"right",h="next"==b?"first":"last",i=this;if(!e.length){if(!this.options.wrap)return;e=this.$element.find(".item")[h]()}if(e.hasClass("active"))return this.sliding=!1;var j=a.Event("slide.bs.carousel",{relatedTarget:e[0],direction:g});return this.$element.trigger(j),j.isDefaultPrevented()?void 0:(this.sliding=!0,f&&this.pause(),this.$indicators.length&&(this.$indicators.find(".active").removeClass("active"),this.$element.one("slid.bs.carousel",function(){var b=a(i.$indicators.children()[i.getActiveIndex()]);b&&b.addClass("active")})),a.support.transition&&this.$element.hasClass("slide")?(e.addClass(b),e[0].offsetWidth,d.addClass(g),e.addClass(g),d.one(a.support.transition.end,function(){e.removeClass([b,g].join(" ")).addClass("active"),d.removeClass(["active",g].join(" ")),i.sliding=!1,setTimeout(function(){i.$element.trigger("slid.bs.carousel")},0)}).emulateTransitionEnd(1e3*d.css("transition-duration").slice(0,-1))):(d.removeClass("active"),e.addClass("active"),this.sliding=!1,this.$element.trigger("slid.bs.carousel")),f&&this.cycle(),this)};var c=a.fn.carousel;a.fn.carousel=function(c){return this.each(function(){var d=a(this),e=d.data("bs.carousel"),f=a.extend({},b.DEFAULTS,d.data(),"object"==typeof c&&c),g="string"==typeof c?c:f.slide;e||d.data("bs.carousel",e=new b(this,f)),"number"==typeof c?e.to(c):g?e[g]():f.interval&&e.pause().cycle()})},a.fn.carousel.Constructor=b,a.fn.carousel.noConflict=function(){return a.fn.carousel=c,this},a(document).on("click.bs.carousel.data-api","[data-slide], [data-slide-to]",function(b){var c,d=a(this),e=a(d.attr("data-target")||(c=d.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,"")),f=a.extend({},e.data(),d.data()),g=d.attr("data-slide-to");g&&(f.interval=!1),e.carousel(f),(g=d.attr("data-slide-to"))&&e.data("bs.carousel").to(g),b.preventDefault()}),a(window).on("load",function(){a('[data-ride="carousel"]').each(function(){var b=a(this);b.carousel(b.data())})})}(jQuery),+function(a){"use strict";var b=function(c,d){this.$element=a(c),this.options=a.extend({},b.DEFAULTS,d),this.transitioning=null,this.options.parent&&(this.$parent=a(this.options.parent)),this.options.toggle&&this.toggle()};b.DEFAULTS={toggle:!0},b.prototype.dimension=function(){var a=this.$element.hasClass("width");return a?"width":"height"},b.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var b=a.Event("show.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.$parent&&this.$parent.find("> .panel > .in");if(c&&c.length){var d=c.data("bs.collapse");if(d&&d.transitioning)return;c.collapse("hide"),d||c.data("bs.collapse",null)}var e=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[e](0),this.transitioning=1;var f=function(){this.$element.removeClass("collapsing").addClass("collapse in")[e]("auto"),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!a.support.transition)return f.call(this);var g=a.camelCase(["scroll",e].join("-"));this.$element.one(a.support.transition.end,a.proxy(f,this)).emulateTransitionEnd(350)[e](this.$element[0][g])}}},b.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var b=a.Event("hide.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.dimension();this.$element[c](this.$element[c]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse").removeClass("in"),this.transitioning=1;var d=function(){this.transitioning=0,this.$element.trigger("hidden.bs.collapse").removeClass("collapsing").addClass("collapse")};return a.support.transition?void this.$element[c](0).one(a.support.transition.end,a.proxy(d,this)).emulateTransitionEnd(350):d.call(this)}}},b.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()};var c=a.fn.collapse;a.fn.collapse=function(c){return this.each(function(){var d=a(this),e=d.data("bs.collapse"),f=a.extend({},b.DEFAULTS,d.data(),"object"==typeof c&&c);!e&&f.toggle&&"show"==c&&(c=!c),e||d.data("bs.collapse",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.collapse.Constructor=b,a.fn.collapse.noConflict=function(){return a.fn.collapse=c,this},a(document).on("click.bs.collapse.data-api","[data-toggle=collapse]",function(b){var c,d=a(this),e=d.attr("data-target")||b.preventDefault()||(c=d.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,""),f=a(e),g=f.data("bs.collapse"),h=g?"toggle":d.data(),i=d.attr("data-parent"),j=i&&a(i);g&&g.transitioning||(j&&j.find('[data-toggle=collapse][data-parent="'+i+'"]').not(d).addClass("collapsed"),d[f.hasClass("in")?"addClass":"removeClass"]("collapsed")),f.collapse(h)})}(jQuery),+function(a){"use strict";function b(b){a(d).remove(),a(e).each(function(){var d=c(a(this)),e={relatedTarget:this};d.hasClass("open")&&(d.trigger(b=a.Event("hide.bs.dropdown",e)),b.isDefaultPrevented()||d.removeClass("open").trigger("hidden.bs.dropdown",e))})}function c(b){var c=b.attr("data-target");c||(c=b.attr("href"),c=c&&/#[A-Za-z]/.test(c)&&c.replace(/.*(?=#[^\s]*$)/,""));var d=c&&a(c);return d&&d.length?d:b.parent()}var d=".dropdown-backdrop",e="[data-toggle=dropdown]",f=function(b){a(b).on("click.bs.dropdown",this.toggle)};f.prototype.toggle=function(d){var e=a(this);if(!e.is(".disabled, :disabled")){var f=c(e),g=f.hasClass("open");if(b(),!g){"ontouchstart"in document.documentElement&&!f.closest(".navbar-nav").length&&a('<div class="dropdown-backdrop"/>').insertAfter(a(this)).on("click",b);var h={relatedTarget:this};if(f.trigger(d=a.Event("show.bs.dropdown",h)),d.isDefaultPrevented())return;f.toggleClass("open").trigger("shown.bs.dropdown",h),e.focus()}return!1}},f.prototype.keydown=function(b){if(/(38|40|27)/.test(b.keyCode)){var d=a(this);if(b.preventDefault(),b.stopPropagation(),!d.is(".disabled, :disabled")){var f=c(d),g=f.hasClass("open");if(!g||g&&27==b.keyCode)return 27==b.which&&f.find(e).focus(),d.click();var h=" li:not(.divider):visible a",i=f.find("[role=menu]"+h+", [role=listbox]"+h);if(i.length){var j=i.index(i.filter(":focus"));38==b.keyCode&&j>0&&j--,40==b.keyCode&&j<i.length-1&&j++,~j||(j=0),i.eq(j).focus()}}}};var g=a.fn.dropdown;a.fn.dropdown=function(b){return this.each(function(){var c=a(this),d=c.data("bs.dropdown");d||c.data("bs.dropdown",d=new f(this)),"string"==typeof b&&d[b].call(c)})},a.fn.dropdown.Constructor=f,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=g,this},a(document).on("click.bs.dropdown.data-api",b).on("click.bs.dropdown.data-api",".dropdown form",function(a){a.stopPropagation()}).on("click.bs.dropdown.data-api",e,f.prototype.toggle).on("keydown.bs.dropdown.data-api",e+", [role=menu], [role=listbox]",f.prototype.keydown)}(jQuery),+function(a){"use strict";var b=function(b,c){this.options=c,this.$element=a(b),this.$backdrop=this.isShown=null,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,a.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};b.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},b.prototype.toggle=function(a){return this[this.isShown?"hide":"show"](a)},b.prototype.show=function(b){var c=this,d=a.Event("show.bs.modal",{relatedTarget:b});this.$element.trigger(d),this.isShown||d.isDefaultPrevented()||(this.isShown=!0,this.escape(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',a.proxy(this.hide,this)),this.backdrop(function(){var d=a.support.transition&&c.$element.hasClass("fade");c.$element.parent().length||c.$element.appendTo(document.body),c.$element.show().scrollTop(0),d&&c.$element[0].offsetWidth,c.$element.addClass("in").attr("aria-hidden",!1),c.enforceFocus();var e=a.Event("shown.bs.modal",{relatedTarget:b});d?c.$element.find(".modal-dialog").one(a.support.transition.end,function(){c.$element.focus().trigger(e)}).emulateTransitionEnd(300):c.$element.focus().trigger(e)}))},b.prototype.hide=function(b){b&&b.preventDefault(),b=a.Event("hide.bs.modal"),this.$element.trigger(b),this.isShown&&!b.isDefaultPrevented()&&(this.isShown=!1,this.escape(),a(document).off("focusin.bs.modal"),this.$element.removeClass("in").attr("aria-hidden",!0).off("click.dismiss.bs.modal"),a.support.transition&&this.$element.hasClass("fade")?this.$element.one(a.support.transition.end,a.proxy(this.hideModal,this)).emulateTransitionEnd(300):this.hideModal())},b.prototype.enforceFocus=function(){a(document).off("focusin.bs.modal").on("focusin.bs.modal",a.proxy(function(a){this.$element[0]===a.target||this.$element.has(a.target).length||this.$element.focus()},this))},b.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keyup.dismiss.bs.modal",a.proxy(function(a){27==a.which&&this.hide()},this)):this.isShown||this.$element.off("keyup.dismiss.bs.modal")},b.prototype.hideModal=function(){var a=this;this.$element.hide(),this.backdrop(function(){a.removeBackdrop(),a.$element.trigger("hidden.bs.modal")})},b.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},b.prototype.backdrop=function(b){var c=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var d=a.support.transition&&c;if(this.$backdrop=a('<div class="modal-backdrop '+c+'" />').appendTo(document.body),this.$element.on("click.dismiss.bs.modal",a.proxy(function(a){a.target===a.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus.call(this.$element[0]):this.hide.call(this))},this)),d&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!b)return;d?this.$backdrop.one(a.support.transition.end,b).emulateTransitionEnd(150):b()}else!this.isShown&&this.$backdrop?(this.$backdrop.removeClass("in"),a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one(a.support.transition.end,b).emulateTransitionEnd(150):b()):b&&b()};var c=a.fn.modal;a.fn.modal=function(c,d){return this.each(function(){var e=a(this),f=e.data("bs.modal"),g=a.extend({},b.DEFAULTS,e.data(),"object"==typeof c&&c);f||e.data("bs.modal",f=new b(this,g)),"string"==typeof c?f[c](d):g.show&&f.show(d)})},a.fn.modal.Constructor=b,a.fn.modal.noConflict=function(){return a.fn.modal=c,this},a(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(b){var c=a(this),d=c.attr("href"),e=a(c.attr("data-target")||d&&d.replace(/.*(?=#[^\s]+$)/,"")),f=e.data("bs.modal")?"toggle":a.extend({remote:!/#/.test(d)&&d},e.data(),c.data());c.is("a")&&b.preventDefault(),e.modal(f,this).one("hide",function(){c.is(":visible")&&c.focus()})}),a(document).on("show.bs.modal",".modal",function(){a(document.body).addClass("modal-open")}).on("hidden.bs.modal",".modal",function(){a(document.body).removeClass("modal-open")})}(jQuery),+function(a){"use strict";var b=function(a,b){this.type=this.options=this.enabled=this.timeout=this.hoverState=this.$element=null,this.init("tooltip",a,b)};b.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1},b.prototype.init=function(b,c,d){this.enabled=!0,this.type=b,this.$element=a(c),this.options=this.getOptions(d);for(var e=this.options.trigger.split(" "),f=e.length;f--;){var g=e[f];if("click"==g)this.$element.on("click."+this.type,this.options.selector,a.proxy(this.toggle,this));else if("manual"!=g){var h="hover"==g?"mouseenter":"focusin",i="hover"==g?"mouseleave":"focusout";this.$element.on(h+"."+this.type,this.options.selector,a.proxy(this.enter,this)),this.$element.on(i+"."+this.type,this.options.selector,a.proxy(this.leave,this))}}this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},b.prototype.getDefaults=function(){return b.DEFAULTS},b.prototype.getOptions=function(b){return b=a.extend({},this.getDefaults(),this.$element.data(),b),b.delay&&"number"==typeof b.delay&&(b.delay={show:b.delay,hide:b.delay}),b},b.prototype.getDelegateOptions=function(){var b={},c=this.getDefaults();return this._options&&a.each(this._options,function(a,d){c[a]!=d&&(b[a]=d)}),b},b.prototype.enter=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type);return clearTimeout(c.timeout),c.hoverState="in",c.options.delay&&c.options.delay.show?void(c.timeout=setTimeout(function(){"in"==c.hoverState&&c.show()},c.options.delay.show)):c.show()},b.prototype.leave=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type);return clearTimeout(c.timeout),c.hoverState="out",c.options.delay&&c.options.delay.hide?void(c.timeout=setTimeout(function(){"out"==c.hoverState&&c.hide()},c.options.delay.hide)):c.hide()},b.prototype.show=function(){var b=a.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){if(this.$element.trigger(b),b.isDefaultPrevented())return;var c=this,d=this.tip();this.setContent(),this.options.animation&&d.addClass("fade");var e="function"==typeof this.options.placement?this.options.placement.call(this,d[0],this.$element[0]):this.options.placement,f=/\s?auto?\s?/i,g=f.test(e);g&&(e=e.replace(f,"")||"top"),d.detach().css({top:0,left:0,display:"block"}).addClass(e),this.options.container?d.appendTo(this.options.container):d.insertAfter(this.$element);var h=this.getPosition(),i=d[0].offsetWidth,j=d[0].offsetHeight;if(g){var k=this.$element.parent(),l=e,m=document.documentElement.scrollTop||document.body.scrollTop,n="body"==this.options.container?window.innerWidth:k.outerWidth(),o="body"==this.options.container?window.innerHeight:k.outerHeight(),p="body"==this.options.container?0:k.offset().left;e="bottom"==e&&h.top+h.height+j-m>o?"top":"top"==e&&h.top-m-j<0?"bottom":"right"==e&&h.right+i>n?"left":"left"==e&&h.left-i<p?"right":e,d.removeClass(l).addClass(e)}var q=this.getCalculatedOffset(e,h,i,j);this.applyPlacement(q,e),this.hoverState=null;var r=function(){c.$element.trigger("shown.bs."+c.type)};a.support.transition&&this.$tip.hasClass("fade")?d.one(a.support.transition.end,r).emulateTransitionEnd(150):r()}},b.prototype.applyPlacement=function(b,c){var d,e=this.tip(),f=e[0].offsetWidth,g=e[0].offsetHeight,h=parseInt(e.css("margin-top"),10),i=parseInt(e.css("margin-left"),10);isNaN(h)&&(h=0),isNaN(i)&&(i=0),b.top=b.top+h,b.left=b.left+i,a.offset.setOffset(e[0],a.extend({using:function(a){e.css({top:Math.round(a.top),left:Math.round(a.left)})}},b),0),e.addClass("in");var j=e[0].offsetWidth,k=e[0].offsetHeight;if("top"==c&&k!=g&&(d=!0,b.top=b.top+g-k),/bottom|top/.test(c)){var l=0;b.left<0&&(l=-2*b.left,b.left=0,e.offset(b),j=e[0].offsetWidth,k=e[0].offsetHeight),this.replaceArrow(l-f+j,j,"left")}else this.replaceArrow(k-g,k,"top");d&&e.offset(b)},b.prototype.replaceArrow=function(a,b,c){this.arrow().css(c,a?50*(1-a/b)+"%":"")},b.prototype.setContent=function(){var a=this.tip(),b=this.getTitle();a.find(".tooltip-inner")[this.options.html?"html":"text"](b),a.removeClass("fade in top bottom left right")},b.prototype.hide=function(){function b(){"in"!=c.hoverState&&d.detach(),c.$element.trigger("hidden.bs."+c.type)}var c=this,d=this.tip(),e=a.Event("hide.bs."+this.type);return this.$element.trigger(e),e.isDefaultPrevented()?void 0:(d.removeClass("in"),a.support.transition&&this.$tip.hasClass("fade")?d.one(a.support.transition.end,b).emulateTransitionEnd(150):b(),this.hoverState=null,this)},b.prototype.fixTitle=function(){var a=this.$element;(a.attr("title")||"string"!=typeof a.attr("data-original-title"))&&a.attr("data-original-title",a.attr("title")||"").attr("title","")},b.prototype.hasContent=function(){return this.getTitle()},b.prototype.getPosition=function(){var b=this.$element[0];return a.extend({},"function"==typeof b.getBoundingClientRect?b.getBoundingClientRect():{width:b.offsetWidth,height:b.offsetHeight},this.$element.offset())},b.prototype.getCalculatedOffset=function(a,b,c,d){return"bottom"==a?{top:b.top+b.height,left:b.left+b.width/2-c/2}:"top"==a?{top:b.top-d,left:b.left+b.width/2-c/2}:"left"==a?{top:b.top+b.height/2-d/2,left:b.left-c}:{top:b.top+b.height/2-d/2,left:b.left+b.width}},b.prototype.getTitle=function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||("function"==typeof c.title?c.title.call(b[0]):c.title)},b.prototype.tip=function(){return this.$tip=this.$tip||a(this.options.template)},b.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},b.prototype.validate=function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},b.prototype.enable=function(){this.enabled=!0},b.prototype.disable=function(){this.enabled=!1},b.prototype.toggleEnabled=function(){this.enabled=!this.enabled},b.prototype.toggle=function(b){var c=b?a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type):this;c.tip().hasClass("in")?c.leave(c):c.enter(c)},b.prototype.destroy=function(){clearTimeout(this.timeout),this.hide().$element.off("."+this.type).removeData("bs."+this.type)};var c=a.fn.tooltip;a.fn.tooltip=function(c){return this.each(function(){var d=a(this),e=d.data("bs.tooltip"),f="object"==typeof c&&c;(e||"destroy"!=c)&&(e||d.data("bs.tooltip",e=new b(this,f)),"string"==typeof c&&e[c]())})},a.fn.tooltip.Constructor=b,a.fn.tooltip.noConflict=function(){return a.fn.tooltip=c,this}}(jQuery),+function(a){"use strict";var b=function(a,b){this.init("popover",a,b)};if(!a.fn.tooltip)throw new Error("Popover requires tooltip.js");b.DEFAULTS=a.extend({},a.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),b.prototype=a.extend({},a.fn.tooltip.Constructor.prototype),b.prototype.constructor=b,b.prototype.getDefaults=function(){return b.DEFAULTS},b.prototype.setContent=function(){var a=this.tip(),b=this.getTitle(),c=this.getContent();a.find(".popover-title")[this.options.html?"html":"text"](b),a.find(".popover-content")[this.options.html?"string"==typeof c?"html":"append":"text"](c),a.removeClass("fade top bottom left right in"),a.find(".popover-title").html()||a.find(".popover-title").hide()},b.prototype.hasContent=function(){return this.getTitle()||this.getContent()},b.prototype.getContent=function(){var a=this.$element,b=this.options;return a.attr("data-content")||("function"==typeof b.content?b.content.call(a[0]):b.content)},b.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")},b.prototype.tip=function(){return this.$tip||(this.$tip=a(this.options.template)),this.$tip};var c=a.fn.popover;a.fn.popover=function(c){return this.each(function(){var d=a(this),e=d.data("bs.popover"),f="object"==typeof c&&c;(e||"destroy"!=c)&&(e||d.data("bs.popover",e=new b(this,f)),"string"==typeof c&&e[c]())})},a.fn.popover.Constructor=b,a.fn.popover.noConflict=function(){return a.fn.popover=c,this}}(jQuery),+function(a){"use strict";function b(c,d){var e,f=a.proxy(this.process,this);this.$element=a(a(c).is("body")?window:c),this.$body=a("body"),this.$scrollElement=this.$element.on("scroll.bs.scroll-spy.data-api",f),this.options=a.extend({},b.DEFAULTS,d),this.selector=(this.options.target||(e=a(c).attr("href"))&&e.replace(/.*(?=#[^\s]+$)/,"")||"")+" .nav li > a",this.offsets=a([]),this.targets=a([]),this.activeTarget=null,this.refresh(),this.process()}b.DEFAULTS={offset:10},b.prototype.refresh=function(){var b=this.$element[0]==window?"offset":"position";this.offsets=a([]),this.targets=a([]);{var c=this;this.$body.find(this.selector).map(function(){var d=a(this),e=d.data("target")||d.attr("href"),f=/^#./.test(e)&&a(e);return f&&f.length&&f.is(":visible")&&[[f[b]().top+(!a.isWindow(c.$scrollElement.get(0))&&c.$scrollElement.scrollTop()),e]]||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){c.offsets.push(this[0]),c.targets.push(this[1])})}},b.prototype.process=function(){var a,b=this.$scrollElement.scrollTop()+this.options.offset,c=this.$scrollElement[0].scrollHeight||this.$body[0].scrollHeight,d=c-this.$scrollElement.height(),e=this.offsets,f=this.targets,g=this.activeTarget;if(b>=d)return g!=(a=f.last()[0])&&this.activate(a);if(g&&b<=e[0])return g!=(a=f[0])&&this.activate(a);for(a=e.length;a--;)g!=f[a]&&b>=e[a]&&(!e[a+1]||b<=e[a+1])&&this.activate(f[a])},b.prototype.activate=function(b){this.activeTarget=b,a(this.selector).parentsUntil(this.options.target,".active").removeClass("active");var c=this.selector+'[data-target="'+b+'"],'+this.selector+'[href="'+b+'"]',d=a(c).parents("li").addClass("active");d.parent(".dropdown-menu").length&&(d=d.closest("li.dropdown").addClass("active")),d.trigger("activate.bs.scrollspy")};var c=a.fn.scrollspy;a.fn.scrollspy=function(c){return this.each(function(){var d=a(this),e=d.data("bs.scrollspy"),f="object"==typeof c&&c;e||d.data("bs.scrollspy",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.scrollspy.Constructor=b,a.fn.scrollspy.noConflict=function(){return a.fn.scrollspy=c,this},a(window).on("load",function(){a('[data-spy="scroll"]').each(function(){var b=a(this);b.scrollspy(b.data())})})}(jQuery),+function(a){"use strict";var b=function(b){this.element=a(b)};b.prototype.show=function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.data("target");if(d||(d=b.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,"")),!b.parent("li").hasClass("active")){var e=c.find(".active:last a")[0],f=a.Event("show.bs.tab",{relatedTarget:e});if(b.trigger(f),!f.isDefaultPrevented()){var g=a(d);this.activate(b.parent("li"),c),this.activate(g,g.parent(),function(){b.trigger({type:"shown.bs.tab",relatedTarget:e})})}}},b.prototype.activate=function(b,c,d){function e(){f.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),b.addClass("active"),g?(b[0].offsetWidth,b.addClass("in")):b.removeClass("fade"),b.parent(".dropdown-menu")&&b.closest("li.dropdown").addClass("active"),d&&d()}var f=c.find("> .active"),g=d&&a.support.transition&&f.hasClass("fade");g?f.one(a.support.transition.end,e).emulateTransitionEnd(150):e(),f.removeClass("in")};var c=a.fn.tab;a.fn.tab=function(c){return this.each(function(){var d=a(this),e=d.data("bs.tab");e||d.data("bs.tab",e=new b(this)),"string"==typeof c&&e[c]()})},a.fn.tab.Constructor=b,a.fn.tab.noConflict=function(){return a.fn.tab=c,this},a(document).on("click.bs.tab.data-api",'[data-toggle="tab"], [data-toggle="pill"]',function(b){b.preventDefault(),a(this).tab("show")})}(jQuery),+function(a){"use strict";var b=function(c,d){this.options=a.extend({},b.DEFAULTS,d),this.$window=a(window).on("scroll.bs.affix.data-api",a.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",a.proxy(this.checkPositionWithEventLoop,this)),this.$element=a(c),this.affixed=this.unpin=this.pinnedOffset=null,this.checkPosition()};b.RESET="affix affix-top affix-bottom",b.DEFAULTS={offset:0},b.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(b.RESET).addClass("affix");var a=this.$window.scrollTop(),c=this.$element.offset();return this.pinnedOffset=c.top-a},b.prototype.checkPositionWithEventLoop=function(){setTimeout(a.proxy(this.checkPosition,this),1)},b.prototype.checkPosition=function(){if(this.$element.is(":visible")){var c=a(document).height(),d=this.$window.scrollTop(),e=this.$element.offset(),f=this.options.offset,g=f.top,h=f.bottom;"top"==this.affixed&&(e.top+=d),"object"!=typeof f&&(h=g=f),"function"==typeof g&&(g=f.top(this.$element)),"function"==typeof h&&(h=f.bottom(this.$element));var i=null!=this.unpin&&d+this.unpin<=e.top?!1:null!=h&&e.top+this.$element.height()>=c-h?"bottom":null!=g&&g>=d?"top":!1;if(this.affixed!==i){this.unpin&&this.$element.css("top","");var j="affix"+(i?"-"+i:""),k=a.Event(j+".bs.affix");this.$element.trigger(k),k.isDefaultPrevented()||(this.affixed=i,this.unpin="bottom"==i?this.getPinnedOffset():null,this.$element.removeClass(b.RESET).addClass(j).trigger(a.Event(j.replace("affix","affixed"))),"bottom"==i&&this.$element.offset({top:c-h-this.$element.height()}))}}};var c=a.fn.affix;a.fn.affix=function(c){return this.each(function(){var d=a(this),e=d.data("bs.affix"),f="object"==typeof c&&c;e||d.data("bs.affix",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.affix.Constructor=b,a.fn.affix.noConflict=function(){return a.fn.affix=c,this},a(window).on("load",function(){a('[data-spy="affix"]').each(function(){var b=a(this),c=b.data();c.offset=c.offset||{},c.offsetBottom&&(c.offset.bottom=c.offsetBottom),c.offsetTop&&(c.offset.top=c.offsetTop),b.affix(c)})})}(jQuery);
(function(){var a=(function(){var a={};var b=function(b,c,d){var e=b.split(".");for(var f=0;f<e.length-1;f++){if(!d[e[f]])d[e[f]]={};d=d[e[f]];}if(typeof c==="function")if(c.isClass)d[e[f]]=c;else d[e[f]]=function(){return c.apply(a,arguments);};else d[e[f]]=c;};var c=function(c,d,e){b(c,d,a);if(e)b(c,d,window.filepicker);};var d=function(b,d,e){if(typeof b==="function"){e=d;d=b;b='';}if(b)b+=".";var f=d.call(a);for(var g in f)c(b+g,f[g],e);};var e=function(b){b.apply(a,arguments);};return{extend:d,internal:e};})();if(!window.filepicker)window.filepicker=a;else for(attr in a)window.filepicker[attr]=a[attr];})();filepicker.extend("ajax",function(){var a=this;var b=function(a,b){b.method='GET';f(a,b);};var c=function(b,c){c.method='POST';b+=(b.indexOf('?')>=0?'&':'?')+'_cacheBust='+a.util.getId();f(b,c);};var d=function(b,c){var e=[];for(var f in b){var g=b[f];if(c)f=c+'['+f+']';var h;switch(a.util.typeOf(g)){case 'object':h=d(g,f);break;case 'array':var i={};for(var j=0;j<g.length;j++)i[j]=g[j];h=d(i,f);break;default:h=f+'='+encodeURIComponent(g);break;}if(g!==null)e.push(h);}return e.join('&');};var e=function(){try{return new window.XMLHttpRequest();}catch(a){try{return new window.ActiveXObject("Msxml2.XMLHTTP");}catch(a){try{return new window.ActiveXObject("Microsoft.XMLHTTP");}catch(a){return null;}}}};var f=function(b,c){b=b||"";var f=c.method?c.method.toUpperCase():"POST";var h=c.success||function(){};var i=c.error||function(){};var j=c.async===undefined?true:c.async;var k=c.data||null;var l=c.processData===undefined?true:c.processData;var m=c.headers||{};var n=a.util.parseUrl(b);var o=window.location.protocol+'//'+window.location.host;var p=o!==n.origin;var q=false;if(k&&l)k=d(c.data);var r;if(c.xhr)r=c.xhr;else{r=e();if(!r){c.error("Ajax not allowed");return r;}}if(p&&window.XDomainRequest&&!("withCredentials" in r))return g(b,c);if(c.progress&&r.upload)r.upload.addEventListener("progress",function(a){if(a.lengthComputable)c.progress(Math.round((a.loaded*95)/a.total));},false);var s=function(){if(r.readyState==4&&!q){if(c.progress)c.progress(100);if(r.status>=200&&r.status<300){var b=r.responseText;if(c.json)try{b=a.json.decode(b);}catch(d){t.call(r,"Invalid json: "+b);return;}h(b,r.status,r);q=true;}else{t.call(r,r.responseText);q=true;}}};r.onreadystatechange=s;var t=function(a){if(q)return;if(c.progress)c.progress(100);q=true;if(this.status==400){i("bad_params",this.status,this);return;}else if(this.status==403){i("not_authorized",this.status,this);return;}else if(this.status==404){i("not_found",this.status,this);return;}if(p)if(this.readyState==4&&this.status===0){i("CORS_not_allowed",this.status,this);return;}else{i("CORS_error",this.status,this);return;}i(a,this.status,this);};r.onerror=t;if(k&&f=='GET'){b+=(b.indexOf('?')!=-1?'&':'?')+k;k=null;}r.open(f,b,j);if(c.json)r.setRequestHeader('Accept','application/json, text/javascript');else r.setRequestHeader('Accept','text/javascript, text/html, application/xml, text/xml, */*');var u=m['Content-Type']||m['content-type'];if(k&&l&&(f=="POST"||f=="PUT")&&u==undefined)r.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=utf-8');if(m)for(var v in m)r.setRequestHeader(v,m[v]);r.send(k);return r;};var g=function(b,c){if(!window.XDomainRequest)return null;var e=c.method?c.method.toUpperCase():"POST";var f=c.success||function(){};var g=c.error||function(){};var h=c.data||{};if(window.location.protocol=="http:")b=b.replace("https:","http:");else if(window.location.protocol=="https:")b=b.replace("http:","https:");if(c.async)throw new a.FilepickerException("Asyncronous Cross-domain requests are not supported");if(e!="GET"&&e!="POST"){h._method=e;e="POST";}if(c.processData!==false)h=h?d(h):null;if(h&&e=='GET'){b+=(b.indexOf('?')>=0?'&':'?')+h;h=null;}b+=(b.indexOf('?')>=0?'&':'?')+'_xdr=true&_cacheBust='+a.util.getId();var i=new window.XDomainRequest();i.onload=function(){var b=i.responseText;if(c.progress)c.progress(100);if(c.json)try{b=a.json.decode(b);}catch(d){g("Invalid json: "+b,200,i);return;}f(b,200,i);};i.onerror=function(){if(c.progress)c.progress(100);g(i.responseText||"CORS_error",this.status||500,this);};i.onprogress=function(){};i.ontimeout=function(){};i.timeout=30000;i.open(e,b,true);i.send(h);return i;};return{get:b,post:c,request:f};});filepicker.extend("base64",function(){var a=this;_keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var b=function(a,b){b=b||b===undefined;var c="";var e,f,g,h,i,j,k;var l=0;if(b)a=d(a);while(l<a.length){e=a.charCodeAt(l);f=a.charCodeAt(l+1);g=a.charCodeAt(l+2);l+=3;h=e>>2;i=((e&3)<<4)|(f>>4);j=((f&15)<<2)|(g>>6);k=g&63;if(isNaN(f))j=k=64;else if(isNaN(g))k=64;c=c+_keyStr.charAt(h)+_keyStr.charAt(i)+_keyStr.charAt(j)+_keyStr.charAt(k);}return c;};var c=function(a,b){b=b||b===undefined;var c="";var d,f,g;var h,i,j,k;var l=0;a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(l<a.length){h=_keyStr.indexOf(a.charAt(l));i=_keyStr.indexOf(a.charAt(l+1));j=_keyStr.indexOf(a.charAt(l+2));k=_keyStr.indexOf(a.charAt(l+3));l+=4;d=(h<<2)|(i>>4);f=((i&15)<<4)|(j>>2);g=((j&3)<<6)|k;c=c+String.fromCharCode(d);if(j!=64)c=c+String.fromCharCode(f);if(k!=64)c=c+String.fromCharCode(g);}if(b)c=e(c);return c;};var d=function(a){a=a.replace(/\r\n/g,"\n");var b="";for(var c=0;c<a.length;c++){var d=a.charCodeAt(c);if(d<128)b+=String.fromCharCode(d);else if((d>127)&&(d<2048)){b+=String.fromCharCode((d>>6)|192);b+=String.fromCharCode((d&63)|128);}else{b+=String.fromCharCode((d>>12)|224);b+=String.fromCharCode(((d>>6)&63)|128);b+=String.fromCharCode((d&63)|128);}}return b;};var e=function(a){var b="";var c=0;var d=c1=c2=0;while(c<a.length){d=a.charCodeAt(c);if(d<128){b+=String.fromCharCode(d);c++;}else if((d>191)&&(d<224)){c2=a.charCodeAt(c+1);b+=String.fromCharCode(((d&31)<<6)|(c2&63));c+=2;}else{c2=a.charCodeAt(c+1);c3=a.charCodeAt(c+2);b+=String.fromCharCode(((d&15)<<12)|((c2&63)<<6)|(c3&63));c+=3;}}return b;};return{encode:b,decode:c};},true);filepicker.extend("browser",function(){var a=this;var b=function(){return !!(navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPod/i)||navigator.userAgent.match(/iPad/i));};var c=function(){return !!navigator.userAgent.match(/Android/i);};var d=function(){return !!navigator.userAgent.match(/MSIE 7\.0/i);};return{isIOS:b,isAndroid:c,isIE7:d};});filepicker.extend("comm",function(){var a=this;var b="filepicker_comm_iframe";var c=function(){if(window.frames[b]===undefined){f();var c;c=document.createElement("iframe");c.id=c.name=b;c.src=a.urls.COMM;c.style.display='none';document.body.appendChild(c);}};var d=function(b){if(b.origin!=a.urls.BASE)return;var c=a.json.parse(b.data);a.handlers.run(c);};var e=false;var f=function(){if(e)return;else e=true;if(window.addEventListener)window.addEventListener("message",d,false);else if(window.attachEvent)window.attachEvent("onmessage",d);else throw new a.FilepickerException("Unsupported browser");};var g=function(){if(window.removeEventListener)window.removeEventListener("message",d,false);else if(window.attachEvent)window.detachEvent("onmessage",d);else throw new a.FilepickerException("Unsupported browser");if(!e)return;else e=false;var c=document.getElementsByName(b);for(var f=0;f<c.length;f++)c[f].parentNode.removeChild(c[f]);try{delete window.frames[b];}catch(g){}};return{openChannel:c,closeChannel:g};});filepicker.extend("comm_fallback",function(){var a=this;var b="filepicker_comm_iframe";var c="host_comm_iframe";var d="";var e=200;var f=function(){g();};var g=function(){if(window.frames[c]===undefined){var b;b=document.createElement("iframe");b.id=b.name=c;d=b.src=a.urls.constructHostCommFallback();b.style.display='none';var e=function(){d=b.contentWindow.location.href;h();};if(b.attachEvent)b.attachEvent('onload',e);else b.onload=e;document.body.appendChild(b);}};var h=function(){if(window.frames[b]===undefined){var c;c=document.createElement("iframe");c.id=c.name=b;c.src=a.urls.FP_COMM_FALLBACK+"?host_url="+encodeURIComponent(d);c.style.display='none';document.body.appendChild(c);}m();};var i=false;var j=undefined;var k="";var l=function(){var d=window.frames[b];if(!d)return;var e=d.frames[c];if(!e)return;var f=e.location.hash;if(f&&f.charAt(0)=="#")f=f.substr(1);if(f===k)return;k=f;if(!k)return;var g;try{g=a.json.parse(f);}catch(h){}if(g)a.handlers.run(g);};var m=function(){if(i)return;else i=true;j=window.setInterval(l,e);};var n=function(){window.clearInterval(j);if(!i)return;else i=false;var a=document.getElementsByName(b);for(var d=0;d<a.length;d++)a[d].parentNode.removeChild(a[d]);try{delete window.frames[b];}catch(e){}a=document.getElementsByName(c);for(d=0;d<a.length;d++)a[d].parentNode.removeChild(a[d]);try{delete window.frames[c];}catch(e){}};var o=!('postMessage' in window);var p=function(a){if(a!==o){o=!!a;if(o)r();else s();}};var q;var r=function(){q=a.comm;a.comm={openChannel:f,closeChannel:n};};var s=function(){a.comm=q;q=undefined;};if(o)r();return{openChannel:f,closeChannel:n,isEnabled:o};});filepicker.extend("conversions",function(){var a=this;var b={width:'number',height:'number',fit:'string',format:'string',watermark:'string',watermark_size:'number',watermark_position:'string',align:'string',crop:'string or array',quality:'number',text:'string',text_font:'string',text_size:'number',text_color:'string',text_align:'string',text_padding:'number',policy:'string',signature:'string',storeLocation:'string',storePath:'string'};var c=function(c){var d;for(var e in c){d=false;for(var f in b)if(e==f){d=true;if(b[f].indexOf(a.util.typeOf(c[e]))===-1)throw new a.FilepickerException("Conversion parameter "+e+" is not the right type: "+c[e]+". Should be a "+b[f]);}if(!d)throw new a.FilepickerException("Conversion parameter "+e+" is not a valid parameter.");}};var d=function(b,d,e,f,g){c(d);if(d.crop&&a.util.isArray(d.crop))d.crop=d.crop.join(",");a.ajax.post(b+'/convert',{data:d,json:true,success:function(b){e(a.util.standardizeFPFile(b));},error:function(b,c,d){if(b=="not_found")f(new a.errors.FPError(141));else if(b=="bad_params")f(new a.errors.FPError(142));else if(b=="not_authorized")f(new a.errors.FPError(403));else f(new a.errors.FPError(143));},progress:g});};return{convert:d};});filepicker.extend("cookies",function(){var a=this;var b=function(b){var c=function(c){if(c.type!=="ThirdPartyCookies")return;a.cookies.THIRD_PARTY_COOKIES=!!c.payload;if(b&&typeof b==="function")b(!!c.payload);};return c;};var c=function(c){var d=b(c);a.handlers.attach('cookies',d);a.comm.openChannel();};return{checkThirdParty:c};});filepicker.extend("dragdrop",function(){var a=this;var b=function(){return(!!window.FileReader||navigator.userAgent.indexOf("Safari")>=0)&&('draggable' in document.createElement('span'));};var c=function(c,d){var e="No DOM element found to create drop pane";if(!c)throw new a.FilepickerException(e);if(c.jquery){if(c.length===0)throw new a.FilepickerException(e);c=c[0];}if(!b()){a.util.console.error("Your browser doesn't support drag-drop functionality");return false;}d=d||{};var f=d.dragEnter||function(){};var g=d.dragLeave||function(){};var h=d.onStart||function(){};var i=d.onSuccess||function(){};var j=d.onError||function(){};var k=d.onProgress||function(){};var l=d.mimetypes;if(!l)if(d.mimetype)l=[d.mimetype];else l=["*/*"];if(a.util.typeOf(l)=='string')l=l.split(',');var m=d.extensions;if(!m)if(d.extension)m=[d.extensions];if(a.util.typeOf(m)=='string')m=m.split(',');var n={location:d.location,path:d.path,policy:d.policy,signature:d.signature};c.addEventListener("dragenter",function(a){f();a.stopPropagation();a.preventDefault();return false;},false);c.addEventListener("dragleave",function(a){g();a.stopPropagation();a.preventDefault();return false;},false);c.addEventListener("dragover",function(a){a.preventDefault();return false;},false);c.addEventListener("drop",function(b){b.stopPropagation();b.preventDefault();var c;var d;var e;if(b.dataTransfer.items){d=b.dataTransfer.items;for(c=0;c<d.length;c++){e=d[c]&&d[c].webkitGetAsEntry?d[c].webkitGetAsEntry():undefined;if(e&&!!e.isDirectory){j("WrongType","Uploading a folder is not allowed");return;}}}var f=b.dataTransfer.files;var g=f.length;if(u(f)){h(f);for(c=0;c<f.length;c++)a.store(f[c],n,q(c,g),r,s(c,g));}});var o={};var p=[];var q=function(a,b){return function(c){if(!d.multiple)i([c]);else{p.push(c);if(p.length==b){i(p);p=[];}else{o[a]=100;t(b);}}};};var r=function(a){j("UploadError",a.toString());};var s=function(a,b){return function(c){o[a]=c;t(b);};};var t=function(a){var b=0;for(var c in o)b+=o[c];var d=b/a;k(d);};var u=function(b){if(b.length>0){if(b.length>1&&!d.multiple){j("TooManyFiles","Only one file at a time");return false;}var c;var e;var f;for(var g=0;g<b.length;g++){c=false;e=b[g];f=e.name||e.fileName||'"Unknown file"';for(var h=0;h<l.length;h++){var i=a.mimetypes.getMimetype(e);c=c||a.mimetypes.matchesMimetype(i,l[h]);}if(!c){j("WrongType",f+" isn't the right type of file");return false;}if(m){c=false;for(h=0;h<m.length;h++)c=c||a.util.endsWith(f,m[h]);if(!c){j("WrongType",f+" isn't the right type of file");return false;}}if(e.size&&!!d.maxSize&&e.size>d.maxSize){j("WrongSize",f+" is too large ("+e.size+" Bytes)");return false;}}return true;}else j("NoFilesFound","No files uploaded");return false;};return true;};return{enabled:b,makeDropPane:c};});filepicker.extend("errors",function(){var a=this;var b=function(a){if(this===window)return new b(a);this.code=a;if(filepicker.debug){var c=filepicker.error_map[this.code];this.message=c.message;this.moreInfo=c.moreInfo;this.toString=function(){return "FPError "+this.code+": "+this.message+". For help, see "+this.moreInfo;};}else this.toString=function(){return "FPError "+this.code+". Include filepicker_debug.js for more info";};return this;};b.isClass=true;var c=function(b){if(filepicker.debug)a.util.console.error(b.toString());};return{FPError:b,handleError:c};},true);filepicker.extend("exporter",function(){var a=this;var b=function(b){var c=function(c,d,e){if(b[d]&&!a.util.isArray(b[d]))b[d]=[b[d]];else if(b[c])b[d]=[b[c]];else if(e)b[d]=e;};if(b.mimetype&&b.extension)throw a.FilepickerException("Error: Cannot pass in both mimetype and extension parameters to the export function");c('service','services');if(b.services)for(var d=0;d<b.services.length;d++){var e=(''+b.services[d]).replace(" ","");var f=a.services[e];b.services[d]=(f===undefined?e:f);}if(b.openTo)b.openTo=a.services[b.openTo]||b.openTo;a.util.setDefault(b,'container','modal');};var c=function(b,c){var d=function(d){if(d.type!=="filepickerUrl")return;if(d.error){a.util.console.error(d.error);c(a.errors.FPError(132));}else{var e={};e.url=d.payload.url;e.filename=d.payload.data.filename;e.mimetype=d.payload.data.type;e.size=d.payload.data.size;e.isWriteable=true;b(e);}a.modal.close();};return d;};var d=function(e,f,g,h){b(f);if(f.debug){setTimeout(function(){g({url:"https://www.filepicker.io/api/file/-nBq2onTSemLBxlcBWn1",filename:'test.png',mimetype:'image/png',size:58979});},1);return;}if(a.cookies.THIRD_PARTY_COOKIES===undefined){a.cookies.checkThirdParty(function(){d(e,f,g,h);});return;}var i=a.util.getId();var j=false;var k=function(a){j=true;g(a);};var l=function(a){j=true;h(a);};var m=function(){if(!j){j=true;h(a.errors.FPError(131));}};if(f.container=='modal'&&(f.mobile||a.window.shouldForce()))f.container='window';a.window.open(f.container,a.urls.constructExportUrl(e,f,i),m);a.handlers.attach(i,c(k,l));};return{createExporter:d};});filepicker.extend("files",function(){var a=this;var b=function(b,d,e,f,g){var h=d.base64encode===undefined;if(h)d.base64encode=true;d.base64encode=d.base64encode!==false;var i=function(b){if(h)b=a.base64.decode(b,!!d.asText);e(b);};c.call(this,b,d,i,f,g);};var c=function(b,c,d,e,f){if(c.cache!==true)c._cacheBust=a.util.getId();a.ajax.get(b,{data:c,headers:{'X-NO-STREAM':true},success:d,error:function(b,c,d){if(b=="CORS_not_allowed")e(new a.errors.FPError(113));else if(b=="CORS_error")e(new a.errors.FPError(114));else if(b=="not_found")e(new a.errors.FPError(115));else if(b=="bad_params")e(new a.errors.FPError(400));else if(b=="not_authorized")e(new a.errors.FPError(403));else e(new a.errors.FPError(118));},progress:f});};var d=function(b,c,d,e,f){if(!(window.File&&window.FileReader&&window.FileList&&window.Blob)){f(10);a.files.storeFile(b,{},function(b){f(50);a.files.readFromFPUrl(b.url,c,d,e,function(a){f(50+a/2);});},e,function(a){f(a/2);});return;}var g=!!c.base64encode;var h=!!c.asText;var i=new FileReader();i.onprogress=function(a){if(a.lengthComputable)f(Math.round((a.loaded/a.total)*100));};i.onload=function(b){f(100);if(g)d(a.base64.encode(b.target.result,h));else d(b.target.result);};i.onerror=function(b){switch(b.target.error.code){case b.target.error.NOT_FOUND_ERR:e(new a.errors.FPError(115));break;case b.target.error.NOT_READABLE_ERR:e(new a.errors.FPError(116));break;case b.target.error.ABORT_ERR:e(new a.errors.FPError(117));break;default:e(new a.errors.FPError(118));break;}};if(h||!i.readAsBinaryString)i.readAsText(b);else i.readAsBinaryString(b);};var e=function(b,c,d,e,f,g){var h=d.mimetype||'text/plain';a.ajax.post(a.urls.constructWriteUrl(b,d),{headers:{'Content-Type':h},data:c,processData:false,json:true,success:function(b){e(a.util.standardizeFPFile(b));},error:function(b,c,d){if(b=="not_found")f(new a.errors.FPError(121));else if(b=="bad_params")f(new a.errors.FPError(122));else if(b=="not_authorized")f(new a.errors.FPError(403));else f(new a.errors.FPError(123));},progress:g});};var f=function(b,c,d,e,f,g){var h=function(b,c,d){if(b=="not_found")f(new a.errors.FPError(121));else if(b=="bad_params")f(new a.errors.FPError(122));else if(b=="not_authorized")f(new a.errors.FPError(403));else f(new a.errors.FPError(123));};var i=function(b){e(a.util.standardizeFPFile(b));};k(c,a.urls.constructWriteUrl(b,d),i,h,g);};var g=function(b,c,d,e,f,g){var h=function(b,c,d){if(b=="not_found")f(new a.errors.FPError(121));else if(b=="bad_params")f(new a.errors.FPError(122));else if(b=="not_authorized")f(new a.errors.FPError(403));else f(new a.errors.FPError(123));};var i=function(b){e(a.util.standardizeFPFile(b));};d.mimetype=c.type;k(c,a.urls.constructWriteUrl(b,d),i,h,g);};var h=function(b,c,d,e,f,g){a.ajax.post(a.urls.constructWriteUrl(b,d),{data:{'url':c},json:true,success:function(b){e(a.util.standardizeFPFile(b));},error:function(b,c,d){if(b=="not_found")f(new a.errors.FPError(121));else if(b=="bad_params")f(new a.errors.FPError(122));else if(b=="not_authorized")f(new a.errors.FPError(403));else f(new a.errors.FPError(123));},progress:g});};var i=function(b,c,d,e,f){if(b.files){if(b.files.length===0)e(new a.errors.FPError(115));else j(b.files[0],c,d,e,f);return;}a.util.setDefault(c,'storage','S3');if(!c.filename)c.filename=b.value.replace("C:\\fakepath\\","")||b.name;var g=b.name;b.name="fileUpload";a.iframeAjax.post(a.urls.constructStoreUrl(c),{data:b,processData:false,json:true,success:function(c){b.name=g;d(a.util.standardizeFPFile(c));},error:function(b,c,d){if(b=="not_found")e(new a.errors.FPError(121));else if(b=="bad_params")e(new a.errors.FPError(122));else if(b=="not_authorized")e(new a.errors.FPError(403));else e(new a.errors.FPError(123));}});};var j=function(b,c,d,e,f){a.util.setDefault(c,'storage','S3');var g=function(b,c,d){if(b=="not_found")e(new a.errors.FPError(121));else if(b=="bad_params")e(new a.errors.FPError(122));else if(b=="not_authorized")e(new a.errors.FPError(403));else{a.util.console.error(b);e(new a.errors.FPError(123));}};var h=function(b){d(a.util.standardizeFPFile(b));};if(!c.filename)c.filename=b.name||b.fileName;k(b,a.urls.constructStoreUrl(c),h,g,f);};var k=function(b,c,d,e,f){if(b.files)b=b.files[0];var g=!!window.FormData&&!!window.XMLHttpRequest;if(g){data=new FormData();data.append('fileUpload',b);a.ajax.post(c,{json:true,processData:false,data:data,success:d,error:e,progress:f});}else a.iframeAjax.post(c,{data:b,json:true,success:d,error:e});};var l=function(b,c,d,e,f){a.util.setDefault(c,'storage','S3');a.util.setDefault(c,'mimetype','text/plain');a.ajax.post(a.urls.constructStoreUrl(c),{headers:{'Content-Type':c.mimetype},data:b,processData:false,json:true,success:function(b){d(a.util.standardizeFPFile(b));},error:function(b,c,d){if(b=="not_found")e(new a.errors.FPError(121));else if(b=="bad_params")e(new a.errors.FPError(122));else if(b=="not_authorized")e(new a.errors.FPError(403));else e(new a.errors.FPError(123));},progress:f});};var m=function(b,c,d,e,f){a.util.setDefault(c,'storage','S3');a.ajax.post(a.urls.constructStoreUrl(c),{data:{'url':b},json:true,success:function(b){d(a.util.standardizeFPFile(b));},error:function(b,c,d){if(b=="not_found")e(new a.errors.FPError(151));else if(b=="bad_params")e(new a.errors.FPError(152));else if(b=="not_authorized")e(new a.errors.FPError(403));else e(new a.errors.FPError(153));},progress:f});};var n=function(b,c,d,e){var f=['uploaded','modified','created'];if(c.cache!==true)c._cacheBust=a.util.getId();a.ajax.get(b+"/metadata",{json:true,data:c,success:function(a){for(var b=0;b<f.length;b++)if(a[f[b]])a[f[b]]=new Date(a[f[b]]);d(a);},error:function(b,c,d){if(b=="not_found")e(new a.errors.FPError(161));else if(b=="bad_params")e(new a.errors.FPError(400));else if(b=="not_authorized")e(new a.errors.FPError(403));else e(new a.errors.FPError(162));}});};var o=function(b,c,d,e){c.key=a.apikey;a.ajax.post(b+"/remove",{data:c,success:function(a){d();},error:function(b,c,d){if(b=="not_found")e(new a.errors.FPError(171));else if(b=="bad_params")e(new a.errors.FPError(400));else if(b=="not_authorized")e(new a.errors.FPError(403));else e(new a.errors.FPError(172));}});};return{readFromUrl:c,readFromFile:d,readFromFPUrl:b,writeDataToFPUrl:e,writeFileToFPUrl:g,writeFileInputToFPUrl:f,writeUrlToFPUrl:h,storeFileInput:i,storeFile:j,storeUrl:m,storeData:l,stat:n,remove:o};});filepicker.extend("handlers",function(){var a=this;var b={};var c=function(a,c){if(b.hasOwnProperty(a))b[a].push(c);else b[a]=[c];return c;};var d=function(a,c){var d=b[a];if(!d)return;if(c){for(var e=0;e<d.length;e++)if(d[e]===c){d.splice(e,1);break;}if(d.length===0)delete b[a];}else delete b[a];};var e=function(a){var c=a.id;if(b.hasOwnProperty(c)){var d=b[c];for(var e=0;e<d.length;e++)d[e](a);return true;}return false;};return{attach:c,detach:d,run:e};});filepicker.extend("iframeAjax",function(){var a=this;var b="ajax_iframe";var c=[];var d=false;var e=function(a,b){b.method='GET';h(a,b);};var f=function(b,c){c.method='POST';b+=(b.indexOf('?')>=0?'&':'?')+'_cacheBust='+a.util.getId();h(b,c);};var g=function(){if(c.length>0){var a=c.shift();h(a.url,a.options);}};var h=function(e,f){if(d){c.push({url:e,options:f});return;}e+=(e.indexOf('?')>=0?'&':'?')+'_cacheBust='+a.util.getId();e+="&Content-Type=text%2Fhtml";a.comm.openChannel();var g;try{g=document.createElement('<iframe name="'+b+'">');}catch(h){g=document.createElement('iframe');}g.id=g.name=b;g.style.display='none';var k=function(){d=false;};if(g.attachEvent){g.attachEvent("onload",k);g.attachEvent("onerror",k);}else g.onerror=g.onload=k;g.id=b;g.name=b;g.style.display='none';g.onerror=g.onload=function(){d=false;};document.body.appendChild(g);a.handlers.attach('upload',i(f));var l=document.createElement("form");l.method=f.method||'GET';l.action=e;l.target=b;var m=f.data;if(a.util.isFileInputElement(m)||a.util.isFile(m))l.encoding=l.enctype="multipart/form-data";document.body.appendChild(l);if(a.util.isFile(m)){var n=j(m);if(!n)throw a.FilepickerException("Couldn't find corresponding file input.");m={'fileUpload':n};}else if(a.util.isFileInputElement(m)){var o=m;m={};m.fileUpload=o;}else if(m&&a.util.isElement(m)&&m.tagName=="INPUT"){o=m;m={};m[o.name]=o;}else if(f.processData!==false)m={'data':m};m.format='iframe';var p={};for(var q in m){var r=m[q];if(a.util.isElement(r)&&r.tagName=="INPUT"){p[q]={par:r.parentNode,sib:r.nextSibling,name:r.name,input:r,focused:r==document.activeElement};r.name=q;l.appendChild(r);}else{var s=document.createElement("input");s.name=q;s.value=r;l.appendChild(s);}}d=true;window.setTimeout(function(){l.submit();for(var a in p){var b=p[a];b.par.insertBefore(b.input,b.sib);b.input.name=b.name;if(b.focused)b.input.focus();}l.parentNode.removeChild(l);},1);};var i=function(b){var c=b.success||function(){};var e=b.error||function(){};var f=function(b){if(b.type!=="Upload")return;d=false;var f=b.payload;if(f.error)e(f.error);else c(f);a.handlers.detach("upload");g();};return f;};var j=function(a){var b=document.getElementsByTagName("input");for(var c=0;c<b.length;c++){var d=b[0];if(d.type!="file"||!d.files||!d.files.length)continue;for(var e=0;e<d.files.length;e++)if(d.files[e]===a)return d;}return null;};return{get:e,post:f,request:h};});filepicker.extend("json",function(){var a=this;var b={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'};var c=function(a){return b[a]||'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);};var d=function(a){a=a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,'');return(/^[\],:{}\s]*$/).test(a);};var e=function(b){if(window.JSON&&window.JSON.stringify)return window.JSON.stringify(b);if(b&&b.toJSON)b=b.toJSON();var d=[];switch(a.util.typeOf(b)){case 'string':return '"'+b.replace(/[\x00-\x1f\\"]/g,c)+'"';case 'array':for(var f=0;f<b.length;f++)d.push(e(b[f]));return '['+d+']';case 'object':case 'hash':var g;var h;for(h in b){g=e(b[h]);if(g)d.push(e(h)+':'+g);g=null;}return '{'+d+'}';case 'number':case 'boolean':return ''+b;case 'null':return 'null';default:return 'null';}return null;};var f=function(b,c){if(!b||a.util.typeOf(b)!='string')return null;if(window.JSON&&window.JSON.parse)return window.JSON.parse(b);else{if(c)if(!d(b))throw new Error('JSON could not decode the input; security is enabled and the value is not secure.');return eval('('+b+')');}};return{validate:d,encode:e,stringify:e,decode:f,parse:f};});filepicker.extend(function(){var a=this;a.API_VERSION="v1";var b=function(b){a.apikey=b;};var c=function(a){this.text=a;this.toString=function(){return "FilepickerException: "+this.text;};return this;};c.isClass=true;var d=function(){if(!a.apikey)throw new a.FilepickerException("API Key not found");};var e=function(b,c,e){d();if(typeof b==="function"){e=c;c=b;b={};}b=b||{};c=c||function(){};e=e||a.errors.handleError;a.picker.createPicker(b,c,e,false);};var f=function(b,c,e){d();if(typeof b==="function"){e=c;c=b;b={};}b=b||{};c=c||function(){};e=e||a.errors.handleError;a.picker.createPicker(b,c,e,true);};var g=function(b,c,e,f){d();if(!b||!c||typeof b==="function"||typeof b==="function")throw new a.FilepickerException("Not all required parameters given, missing picker or store options");f=f||a.errors.handleError;var g=!!b.multiple;var h=!!b?a.util.clone(b):{};h.storeLocation=c.location||'S3';h.storePath=c.path;if(g&&h.storePath)if(h.storePath.charAt(h.storePath.length-1)!="/")throw new a.FilepickerException("pickAndStore with multiple files requires a path that ends in '/'");var i=e;if(!g)i=function(a){e([a]);};a.picker.createPicker(h,i,f,g);};var h=function(b,c,e,f,g){d();if(!b)throw new a.FilepickerException("No input given - nothing to read!");if(typeof c==="function"){g=f;f=e;e=c;c={};}c=c||{};e=e||function(){};f=f||a.errors.handleError;g=g||function(){};if(typeof b=="string")if(a.util.isFPUrl(b))a.files.readFromFPUrl(b,c,e,f,g);else a.files.readFromUrl(b,c,e,f,g);else if(a.util.isFileInputElement(b))if(!b.files)i(b,c,e,f,g);else if(b.files.length===0)f(new a.errors.FPError(115));else a.files.readFromFile(b.files[0],c,e,f,g);else if(a.util.isFile(b))a.files.readFromFile(b,c,e,f,g);else if(b.url)a.files.readFromFPUrl(b.url,c,e,f,g);else throw new a.FilepickerException("Cannot read given input: "+b+". Not a url, file input, DOM File, or FPFile object.");};var i=function(b,c,d,e,f){f(10);a.store(b,function(b){f(50);a.read(b,c,d,e,function(a){f(50+a/2);});},e);};var j=function(b,c,e,f,g,h){d();if(!b)throw new a.FilepickerException("No fpfile given - nothing to write to!");if(c===undefined||c===null)throw new a.FilepickerException("No input given - nothing to write!");if(typeof e==="function"){h=g;g=f;f=e;e={};}e=e||{};f=f||function(){};g=g||a.errors.handleError;h=h||function(){};var i;if(a.util.isFPUrl(b))i=b;else if(b.url)i=b.url;else throw new a.FilepickerException("Invalid file to write to: "+b+". Not a filepicker url or FPFile object.");if(typeof c=="string")a.files.writeDataToFPUrl(i,c,e,f,g,h);else if(a.util.isFileInputElement(c))if(!c.files)a.files.writeFileInputToFPUrl(i,c,e,f,g,h);else if(c.files.length===0)g(new a.errors.FPError(115));else a.files.writeFileToFPUrl(i,c.files[0],e,f,g,h);else if(a.util.isFile(c))a.files.writeFileToFPUrl(i,c,e,f,g,h);else if(c.url)a.files.writeUrlToFPUrl(i,c.url,e,f,g,h);else throw new a.FilepickerException("Cannot read from given input: "+c+". Not a string, file input, DOM File, or FPFile object.");};var k=function(b,c,e,f,g,h){d();if(!b)throw new a.FilepickerException("No fpfile given - nothing to write to!");if(c===undefined||c===null)throw new a.FilepickerException("No input given - nothing to write!");if(typeof e==="function"){h=g;g=f;f=e;e={};}e=e||{};f=f||function(){};g=g||a.errors.handleError;h=h||function(){};var i;if(a.util.isFPUrl(b))i=b;else if(b.url)i=b.url;else throw new a.FilepickerException("Invalid file to write to: "+b+". Not a filepicker url or FPFile object.");a.files.writeUrlToFPUrl(i,c,e,f,g,h);};var l=function(b,c,e,f){d();if(typeof c==="function"){f=e;e=c;c={};}c=!!c?a.util.clone(c):{};e=e||function(){};f=f||a.errors.handleError;var g;if(typeof b=="string"&&a.util.isUrl(b))g=b;else if(b.url){g=b.url;if(!c.mimetype&&!c.extension)c.mimetype=b.mimetype;if(!c.suggestedFilename)c.suggestedFilename=b.filename;}else throw new a.FilepickerException("Invalid file to export: "+b+". Not a valid url or FPFile object. You may want to use filepicker.store() to get an FPFile to export");a.exporter.createExporter(g,c,e,f);};var m=function(b,c,e,f,g){d();if(typeof c==="function"){g=f;f=e;e=c;c={};}c=!!c?a.util.clone(c):{};e=e||function(){};f=f||a.errors.handleError;g=g||function(){};if(typeof b=="string")a.files.storeData(b,c,e,f,g);else if(a.util.isFileInputElement(b))if(!b.files)a.files.storeFileInput(b,c,e,f,g);else if(b.files.length===0)f(new a.errors.FPError(115));else a.files.storeFile(b.files[0],c,e,f,g);else if(a.util.isFile(b))a.files.storeFile(b,c,e,f,g);else if(b.url){if(!c.filename)c.filename=b.filename;a.files.storeUrl(b.url,c,e,f,g);}else throw new a.FilepickerException("Cannot store given input: "+b+". Not a string, file input, DOM File, or FPFile object.");};var n=function(b,c,e,f,g){d();if(typeof c==="function"){g=f;f=e;e=c;c={};}c=c||{};e=e||function(){};f=f||a.errors.handleError;g=g||function(){};a.files.storeUrl(b,c,e,f,g);};var o=function(b,c,e,f){d();if(typeof c==="function"){f=e;e=c;c={};}c=c||{};e=e||function(){};f=f||a.errors.handleError;var g;if(a.util.isFPUrl(b))g=b;else if(b.url)g=b.url;else throw new a.FilepickerException("Invalid file to get metadata for: "+b+". Not a filepicker url or FPFile object.");a.files.stat(g,c,e,f);};var p=function(b,c,e,f){d();if(typeof c==="function"){f=e;e=c;c={};}c=c||{};e=e||function(){};f=f||a.errors.handleError;var g;if(a.util.isFPUrl(b))g=b;else if(b.url)g=b.url;else throw new a.FilepickerException("Invalid file to remove: "+b+". Not a filepicker url or FPFile object.");a.files.remove(g,c,e,f);};var q=function(b,c,e,f,g,h){d();if(!b)throw new a.FilepickerException("No fpfile given - nothing to convert!");if(typeof e==="function"){h=g;g=f;f=e;e={};}options=!!c?a.util.clone(c):{};e=e||{};f=f||function(){};g=g||a.errors.handleError;h=h||function(){};if(e.location)options.storeLocation=e.location;if(e.path)options.storePath=e.path;var i;if(a.util.isFPUrl(b))i=b;else if(b.url){i=b.url;if(!a.mimetypes.matchesMimetype(b.mimetype,'image/*')){g(new a.errors.FPError(142));return;}}else throw new a.FilepickerException("Invalid file to convert: "+b+". Not a filepicker url or FPFile object.");a.conversions.convert(i,options,f,g,h);};var r=function(b){return a.widgets.constructWidget(b);};var s=function(b,c){return a.dragdrop.makeDropPane(b,c);};return{setKey:b,pick:e,pickMultiple:f,pickAndStore:g,read:h,write:j,writeUrl:k,'export':l,exportFile:l,store:m,storeUrl:n,stat:o,metadata:o,remove:p,convert:q,constructWidget:r,makeDropPane:s,FilepickerException:c};},true);filepicker.extend('mimetypes',function(){var a=this;var b={'.stl':'applicaiton/sla','.hbs':'text/html','.pdf':'application/pdf','.jpg':'image/jpeg','.jpeg':'image/jpeg','.jpe':'image/jpeg','.imp':'application/x-impressionist'};var c=['application/octet-stream','application/download','application/force-download','octet/stream','application/unknown','application/x-download','application/x-msdownload','application/x-secure-download'];var d=function(a){if(a.type){var d=a.type;d=d.toLowerCase();var e=false;for(var f=0;f<c.length;f++)e=e||d==c[f];if(!e)return a.type;}var g=a.name||a.fileName;var h=g.match(/\.\w*$/);if(h)return b[h[0].toLowerCase()]||'';else if(a.type)return a.type;else return '';};var e=function(b,d){if(!b)return d=="*/*";b=a.util.trim(b).toLowerCase();d=a.util.trim(d).toLowerCase();for(var e=0;e<c.length;e++)if(b==c[e])return true;test_parts=b.split("/");against_parts=d.split("/");if(against_parts[0]=="*")return true;if(against_parts[0]!=test_parts[0])return false;if(against_parts[1]=="*")return true;return against_parts[1]==test_parts[1];};return{getMimetype:d,matchesMimetype:e};});filepicker.extend("modal",function(){var a=this;var b="filepicker_shade";var c="filepicker_dialog_container";var d=function(b,c){var d=e(c);var h=f();var i=g(c);var j=document.createElement("iframe");j.name=a.window.WINDOW_NAME;j.id=a.window.WINDOW_NAME;var k=a.window.getSize();var l=Math.min(k[1]-40,500);j.style.width='100%';j.style.height=l-32+'px';j.style.border="none";j.style.position="relative";j.setAttribute('border',0);j.setAttribute('frameborder',0);j.setAttribute('frameBorder',0);j.setAttribute('marginwidth',0);j.setAttribute('marginheight',0);j.src=b;document.body.appendChild(d);h.appendChild(i);h.appendChild(j);document.body.appendChild(h);return j;};var e=function(a){var c=document.createElement("div");c.id=b;c.style.position='fixed';c.style.top=0;c.style.bottom=0;c.style.right=0;c.style.left=0;c.style.backgroundColor='#000000';c.style.opacity='0.5';c.style.filter='alpha(opacity=50)';c.style.zIndex=10000;c.onclick=h(a);return c;};var f=function(){var b=document.createElement("div");b.id=c;b.style.position='fixed';b.style.padding="10px";b.style.background='#ffffff url("https://www.filepicker.io/static/img/spinner.gif") no-repeat 50% 50%';b.style.top='10px';b.style.bottom='auto';b.style.right='auto';var d=a.window.getSize();var e=Math.min(d[1]-40,500);var f=Math.max(Math.min(d[0]-40,800),620);var g=(d[0]-f-40)/2;b.style.left=g+"px";b.style.height=e+'px';b.style.width=f+'px';b.style.overflow='hidden';b.style.webkitOverflowScrolling='touch';b.style.border='1px solid #999';b.style.webkitBorderRadius='3px';b.style.borderRadius='3px';b.style.margin='0';b.style.webkitBoxShadow='0 3px 7px rgba(0, 0, 0, 0.3)';b.style.boxShadow='0 3px 7px rgba(0, 0, 0, 0.3)';b.style.zIndex=10001;b.style.boxSizing="content-box";b.style.webkitBoxSizing="content-box";b.style.mozBoxSizing="content-box";return b;};var g=function(a){var b=document.createElement("a");b.appendChild(document.createTextNode('\u00D7'));b.onclick=h(a);b.style.cssFloat="right";b.style.styleFloat="right";b.style.cursor="default";b.style.padding='0 5px 0 0px';b.style.fontSize='1.5em';b.style.color='#555555';b.style.textDecoration='none';return b;};var h=function(d,e){e=!!e;return function(){if(a.uploading&&!e)if(!window.confirm("You are currently uploading. If you choose 'OK', the window will close and your upload will not finish. Do you want to stop uploading and close the window?"))return;a.uploading=false;var f=document.getElementById(b);if(f)document.body.removeChild(f);var g=document.getElementById(c);if(g)document.body.removeChild(g);try{delete window.frames[a.window.WINDOW_NAME];}catch(h){}if(d)d();};};var i=h(function(){});return{generate:d,close:i};});filepicker.extend("picker",function(){var a=this;var b=function(b){var c=function(c,d,e){if(b[d]){if(!a.util.isArray(b[d]))b[d]=[b[d]];}else if(b[c])b[d]=[b[c]];else if(e)b[d]=e;};c('service','services');c('mimetype','mimetypes');c('extension','extensions');if(b.services)for(var d=0;d<b.services.length;d++){var e=(''+b.services[d]).replace(" ","");if(a.services[e]!==undefined)e=a.services[e];b.services[d]=e;}if(b.mimetypes&&b.extensions)throw a.FilepickerException("Error: Cannot pass in both mimetype and extension parameters to the pick function");if(!b.mimetypes&&!b.extensions)b.mimetypes=['*/*'];if(b.openTo)b.openTo=a.services[b.openTo]||b.openTo;a.util.setDefault(b,'container','modal');};var c=function(b,c){var d=function(d){if(d.type!=="filepickerUrl")return;a.uploading=false;if(d.error){a.util.console.error(d.error);c(a.errors.FPError(102));}else{var e={};e.url=d.payload.url;e.filename=d.payload.data.filename;e.mimetype=d.payload.data.type;e.size=d.payload.data.size;if(d.payload.data.key)e.key=d.payload.data.key;e.isWriteable=true;b(e);}a.modal.close();};return d;};var d=function(b){b=b||function(){};var c=function(c){if(c.type!=="uploading")return;a.uploading=!!c.payload;b(a.uploading);};return c;};var e=function(b,c){var d=function(d){if(d.type!=="filepickerUrl")return;a.uploading=false;if(d.error){a.util.console.error(d.error);c(a.errors.FPError(102));}else{var e=[];if(!a.util.isArray(d.payload))d.payload=[d.payload];for(var f=0;f<d.payload.length;f++){var g={};var h=d.payload[f];g.url=h.url;g.filename=h.data.filename;g.mimetype=h.data.type;g.size=h.data.size;if(h.data.key)g.key=h.data.key;g.isWriteable=true;e.push(g);}b(e);}a.modal.close();};return d;};var f=function(g,h,i,j){b(g);if(g.debug){setTimeout(function(){h({url:"https://www.filepicker.io/api/file/-nBq2onTSemLBxlcBWn1",filename:'test.png',mimetype:'image/png',size:58979});},1);return;}if(a.cookies.THIRD_PARTY_COOKIES===undefined){a.cookies.checkThirdParty(function(){f(g,h,i,!!j);});return;}var k=a.util.getId();var l=false;var m=function(a){l=true;h(a);};var n=function(a){l=true;i(a);};var o=function(){if(!l){l=true;i(a.errors.FPError(101));}};if(g.container=='modal'&&(g.mobile||a.window.shouldForce()))g.container='window';a.window.open(g.container,a.urls.constructPickUrl(g,k,j),o);var p=j?e(m,n):c(m,n);a.handlers.attach(k,p);var q=k+"-upload";a.handlers.attach(q,d(function(){a.handlers.detach(q);}));};return{createPicker:f};});filepicker.extend('services',function(){return{COMPUTER:1,DROPBOX:2,FACEBOOK:3,GITHUB:4,GMAIL:5,IMAGE_SEARCH:6,URL:7,WEBCAM:8,GOOGLE_DRIVE:9,SEND_EMAIL:10,INSTAGRAM:11,FLICKR:12,VIDEO:13,EVERNOTE:14,PICASA:15,WEBDAV:16,FTP:17,ALFRESCO:18,BOX:19,SKYDRIVE:20};},true);filepicker.extend('util',function(){var a=this;var b=function(a){return a.replace(/^\s+|\s+$/g,"");};var c=/^(http|https)\:.*\/\//i;var d=function(a){return !!a.match(c);};var e=function(a){if(!a||a.charAt(0)=='/')a=window.location.protocol+"//"+window.location.host+a;var b=document.createElement('a');b.href=a;var c=b.hostname.indexOf(":")==-1?b.hostname:b.host;var d={source:a,protocol:b.protocol.replace(':',''),host:c,port:b.port,query:b.search,params:(function(){var a={},c=b.search.replace(/^\?/,'').split('&'),d=c.length,e=0,f;for(;e<d;e++){if(!c[e])continue;f=c[e].split('=');a[f[0]]=f[1];}return a;})(),file:(b.pathname.match(/\/([^\/?#]+)$/i)||[,''])[1],hash:b.hash.replace('#',''),path:b.pathname.replace(/^([^\/])/,'/$1'),relative:(b.href.match(/tps?:\/\/[^\/]+(.+)/)||[,''])[1],segments:b.pathname.replace(/^\//,'').split('/')};d.origin=d.protocol+"://"+d.host+(d.port?":"+d.port:'');return d;};var f=function(a,b){return a.indexOf(b,a.length-b.length)!==-1;};return{trim:b,parseUrl:e,isUrl:d,endsWith:f};});filepicker.extend("urls",function(){var a=this;var b="https://www.filepicker.io";if(window.filepicker.hostname)b=window.filepicker.hostname;var c=b+"/dialog/open/";var d=b+"/dialog/save/";var e=b+"/api/store/";var f=function(b,d,e){return c+"?key="+a.apikey+"&id="+d+"&referrer="+window.location.hostname+"&iframe="+(b.container!='window')+"&version="+a.API_VERSION+(b.services?"&s="+b.services.join(","):"")+(e?"&multi="+!!e:"")+(b.mimetypes!==undefined?"&m="+b.mimetypes.join(","):"")+(b.extensions!==undefined?"&ext="+b.extensions.join(","):"")+(b.openTo!==undefined?"&loc="+b.openTo:"")+(b.maxSize?"&maxsize="+b.maxSize:"")+(b.signature?"&signature="+b.signature:"")+(b.policy?"&policy="+b.policy:"")+(b.mobile!==undefined?"&mobile="+b.mobile:"")+(b.storeLocation?"&storeLocation="+b.storeLocation:"")+(b.storePath?"&storePath="+b.storePath:"");};var g=function(b,c,e){if(b.indexOf("&")>=0||b.indexOf("?")>=0)b=encodeURIComponent(b);return d+"?url="+b+"&key="+a.apikey+"&id="+e+"&referrer="+window.location.hostname+"&iframe="+(c.container!='window')+"&version="+a.API_VERSION+(c.services?"&s="+c.services.join(","):"")+(c.openTo!==undefined?"&loc="+c.openTo:"")+(c.mimetype!==undefined?"&m="+c.mimetype:"")+(c.extension!==undefined?"&ext="+c.extension:"")+(c.mobile!==undefined?"&mobile="+c.mobile:"")+(c.suggestedFilename!==undefined?"&defaultSaveasName="+c.suggestedFilename:"")+(c.signature?"&signature="+c.signature:"")+(c.policy?"&policy="+c.policy:"");};var h=function(b){return e+b.storage+"?key="+a.apikey+(b.base64decode?"&base64decode=true":"")+(b.mimetype?"&mimetype="+b.mimetype:"")+(b.filename?"&filename="+b.filename:"")+(b.path?"&path="+b.path:"")+(b.signature?"&signature="+b.signature:"")+(b.policy?"&policy="+b.policy:"");};var i=function(a,b){return a+"?nonce=fp"+(!!b.base64decode?"&base64decode=true":"")+(b.mimetype?"&mimetype="+b.mimetype:"")+(b.signature?"&signature="+b.signature:"")+(b.policy?"&policy="+b.policy:"");};var j=function(){var b=a.util.parseUrl(window.location.href);return b.origin+"/404";};return{BASE:b,COMM:b+"/dialog/comm_iframe/",FP_COMM_FALLBACK:b+"/dialog/comm_hash_iframe/",STORE:e,PICK:c,EXPORT:d,constructPickUrl:f,constructExportUrl:g,constructWriteUrl:i,constructStoreUrl:h,constructHostCommFallback:j};});filepicker.extend("util",function(){var a=this;var b=function(a){return a&&Object.prototype.toString.call(a)==='[object Array]';};var c=function(a){return a&&Object.prototype.toString.call(a)==='[object File]';};var d=function(a){if(typeof HTMLElement==="object")return a instanceof HTMLElement;else return a&&typeof a==="object"&&a.nodeType===1&&typeof a.nodeName==="string";};var e=function(a){return d(a)&&a.tagName=="INPUT"&&a.type=="file";};var f=function(a){if(a===null)return 'null';else if(b(a))return 'array';else if(c(a))return 'file';return typeof a;};var g=function(){var a=new Date();return a.getTime().toString();};var h=function(a,b,c){if(a[b]===undefined)a[b]=c;};var i=function(a){if(window.jQuery)window.jQuery(function(){a();});else{var b="load";if(window.addEventListener)window.addEventListener(b,a,false);else if(window.attachEvent)window.attachEvent("on"+b,a);else if(window.onload){var c=window.onload;window.onload=function(){c();a();};}else window.onload=a;}};var j=function(a){return typeof a=="string"&&a.match("www.filepicker.io/api/file/");};var k=function(a){return function(){if(window.console&&typeof window.console[a]=="function")try{window.console[a].apply(window.console,arguments);}catch(b){alert(Array.prototype.join.call(arguments,","));}};};var l={};l.log=k("log");l.error=k("error");var m=function(a){var b={};for(key in a)b[key]=a[key];return b;};var n=function(a){var b={};b.url=a.url;b.filename=a.filename||a.name;b.mimetype=a.mimetype||a.type;b.size=a.size;b.key=a.key||a.s3_key;b.isWriteable=!!(a.isWriteable||a.writeable);return b;};return{isArray:b,isFile:c,isElement:d,isFileInputElement:e,getId:g,setDefault:h,typeOf:f,addOnLoad:i,isFPUrl:j,console:l,clone:m,standardizeFPFile:n};});filepicker.extend("widgets",function(){var a=this;var b=function(a,b,c,d){var e=d.getAttribute(c);if(e)b[a]=e;};var c=function(a,b){var c;if(document.createEvent){c=document.createEvent('Event');c.initEvent("change",true,false);c.fpfile=b?b[0]:undefined;c.fpfiles=b;a.dispatchEvent(c);}else if(document.createEventObject){c=document.createEventObject('Event');c.eventPhase=2;c.currentTarget=c.srcElement=c.target=a;c.fpfile=b?b[0]:undefined;c.fpfiles=b;a.fireEvent('onchange',c);}else if(a.onchange)a.onchange(b);};var d=function(d){var e=document.createElement("button");e.setAttribute('type','button');e.innerHTML=d.getAttribute('data-fp-button-text')||d.getAttribute('data-fp-text')||"Pick File";e.className=d.getAttribute('data-fp-button-class')||d.getAttribute('data-fp-class')||d.className;d.style.display="none";var f={};b("container",f,"data-fp-option-container",d);b("maxSize",f,"data-fp-option-maxsize",d);b("mimetype",f,"data-fp-mimetype",d);b("mimetypes",f,"data-fp-mimetypes",d);b("extension",f,"data-fp-extension",d);b("extensions",f,"data-fp-extensions",d);b("container",f,"data-fp-container",d);b("maxSize",f,"data-fp-maxSize",d);b("openTo",f,"data-fp-openTo",d);b("debug",f,"data-fp-debug",d);b("signature",f,"data-fp-signature",d);b("policy",f,"data-fp-policy",d);b("storeLocation",f,"data-fp-store-location",d);var g=d.getAttribute("data-fp-services");if(!g)g=d.getAttribute("data-fp-option-services");if(g){g=g.split(",");for(var h=0;h<g.length;h++)g[h]=a.services[g[h].replace(" ","")];f.services=g;}var i=d.getAttribute("data-fp-service");if(i)f.service=a.services[i.replace(" ","")];if(f.mimetypes)f.mimetypes=f.mimetypes.split(",");if(f.extensions)f.extensions=f.extensions.split(",");var j=d.getAttribute("data-fp-apikey");if(j)a.setKey(j);var k=(d.getAttribute("data-fp-multiple")||d.getAttribute("data-fp-option-multiple")||"false")=="true";if(k)e.onclick=function(){e.blur();a.pickMultiple(f,function(a){var b=[];for(var e=0;e<a.length;e++)b.push(a[e].url);d.value=b.join();c(d,a);});return false;};else e.onclick=function(){e.blur();a.pick(f,function(a){d.value=a.url;c(d,[a]);});return false;};d.parentNode.insertBefore(e,d);};var e=function(d){var e=document.createElement("div");e.className=d.getAttribute('data-fp-class')||d.className;e.style.padding="1px";d.style.display="none";d.parentNode.insertBefore(e,d);var i=document.createElement("button");i.setAttribute('type','button');i.innerHTML=d.getAttribute('data-fp-button-text')||"Pick File";i.className=d.getAttribute('data-fp-button-class')||'';e.appendChild(i);var j=document.createElement("div");g(j);j.innerHTML=d.getAttribute('data-fp-drag-text')||"Or drop files here";j.className=d.getAttribute('data-fp-drag-class')||'';e.appendChild(j);var k={};b("container",k,"data-fp-option-container",d);b("maxSize",k,"data-fp-option-maxsize",d);b("mimetype",k,"data-fp-mimetype",d);b("mimetypes",k,"data-fp-mimetypes",d);b("extension",k,"data-fp-extension",d);b("extensions",k,"data-fp-extensions",d);b("container",k,"data-fp-container",d);b("maxSize",k,"data-fp-maxSize",d);b("openTo",k,"data-fp-openTo",d);b("debug",k,"data-fp-debug",d);b("signature",k,"data-fp-signature",d);b("policy",k,"data-fp-policy",d);b("storeLocation",k,"data-fp-store-location",d);var l=d.getAttribute("data-fp-services");if(!l)l=d.getAttribute("data-fp-option-services");if(l){l=l.split(",");for(var m=0;m<l.length;m++)l[m]=a.services[l[m].replace(" ","")];k.services=l;}var n=d.getAttribute("data-fp-service");if(n)k.service=a.services[n.replace(" ","")];if(k.mimetypes)k.mimetypes=k.mimetypes.split(",");if(k.extensions)k.extensions=k.extensions.split(",");var o=d.getAttribute("data-fp-apikey");if(o)a.setKey(o);var p=(d.getAttribute("data-fp-multiple")||d.getAttribute("data-fp-option-multiple")||"false")=="true";if(a.dragdrop.enabled())h(j,p,k,d);else j.innerHTML="&nbsp;";if(p)j.onclick=i.onclick=function(){i.blur();a.pickMultiple(k,function(a){var b=[];var e=[];for(var g=0;g<a.length;g++){b.push(a[g].url);e.push(a[g].filename);}d.value=b.join();f(d,j,e.join(', '));c(d,a);});return false;};else j.onclick=i.onclick=function(){i.blur();a.pick(k,function(a){d.value=a.url;f(d,j,a.filename);c(d,[a]);});return false;};};var f=function(b,d,e){d.innerHTML=e;d.style.padding="2px 4px";d.style.cursor="default";d.style.width='';var f=document.createElement("span");f.innerHTML="X";f.style.borderRadius="8px";f.style.fontSize="14px";f.style.cssFloat="right";f.style.padding="0 3px";f.style.color="#600";f.style.cursor="pointer";var h=function(e){if(!e)e=window.event;e.cancelBubble=true;if(e.stopPropagation)e.stopPropagation();g(d);if(!a.dragdrop.enabled)d.innerHTML='&nbsp;';else d.innerHTML=b.getAttribute('data-fp-drag-text')||"Or drop files here";b.value='';c(b);return false;};if(f.addEventListener)f.addEventListener("click",h,false);else if(f.attachEvent)f.attachEvent("onclick",h);d.appendChild(f);};var g=function(a){a.style.border="1px dashed #AAA";a.style.display="inline-block";a.style.margin="0 0 0 4px";a.style.borderRadius="3px";a.style.backgroundColor="#F3F3F3";a.style.color="#333";a.style.fontSize="14px";a.style.lineHeight="22px";a.style.padding="2px 4px";a.style.verticalAlign="middle";a.style.cursor="pointer";a.style.overflow="hidden";};var h=function(b,d,e,g){var h=b.innerHTML;var j;a.dragdrop.makeDropPane(b,{multiple:d,maxSize:e.maxSize,mimetypes:e.mimetypes,mimetype:e.mimetype,extensions:e.extensions,extension:e.extension,dragEnter:function(){b.innerHTML="Drop to upload";b.style.backgroundColor="#E0E0E0";b.style.border="1px solid #000";},dragLeave:function(){b.innerHTML=h;b.style.backgroundColor="#F3F3F3";b.style.border="1px dashed #AAA";},onError:function(a,c){if(a=="TooManyFiles")b.innerHTML=c;else if(a=="WrongType")b.innerHTML=c;else if(a=="NoFilesFound")b.innerHTML=c;else if(a=="UploadError")b.innerHTML="Oops! Had trouble uploading.";},onStart:function(a){j=i(b);},onProgress:function(a){if(j)j.style.width=a+"%";},onSuccess:function(a){var d=[];var e=[];for(var h=0;h<a.length;h++){d.push(a[h].url);e.push(a[h].filename);}g.value=d.join();f(g,b,e.join(', '));c(g,a);}});};var i=function(a){var b=document.createElement("div");var c=a.offsetHeight-2;b.style.height=c+"px";b.style.backgroundColor="#0E90D2";b.style.width="2%";b.style.borderRadius="3px";a.style.width=a.offsetWidth+"px";a.style.padding="0";a.style.border="1px solid #AAA";a.style.backgroundColor="#F3F3F3";a.style.boxShadow="inset 0 1px 2px rgba(0, 0, 0, 0.1)";a.innerHTML="";a.appendChild(b);return b;};var j=function(c){c.onclick=function(){var d=c.getAttribute("data-fp-url");if(!d)return true;var e={};b("container",e,"data-fp-option-container",c);b("suggestedFilename",e,"data-fp-option-defaultSaveasName",c);b("container",e,"data-fp-container",c);b("suggestedFilename",e,"data-fp-suggestedFilename",c);b("mimetype",e,"data-fp-mimetype",c);b("extension",e,"data-fp-extension",c);var f=c.getAttribute("data-fp-services");if(!f)f=c.getAttribute("data-fp-option-services");if(f){f=f.split(",");for(var g=0;g<f.length;g++)f[g]=a.services[f[g].replace(" ","")];e.services=f;}var h=c.getAttribute("data-fp-service");if(h)e.service=a.services[h.replace(" ","")];apikey=c.getAttribute("data-fp-apikey");if(apikey)a.setKey(apikey);a.exportFile(d,e);return false;};};var k=function(){if(document.querySelectorAll){var a;var b=document.querySelectorAll('input[type="filepicker"]');for(a=0;a<b.length;a++)d(b[a]);var c=document.querySelectorAll('input[type="filepicker-dragdrop"]');for(a=0;a<c.length;a++)e(c[a]);var f=[];var g=document.querySelectorAll('button[data-fp-url]');for(a=0;a<g.length;a++)f.push(g[a]);g=document.querySelectorAll('a[data-fp-url]');for(a=0;a<g.length;a++)f.push(g[a]);g=document.querySelectorAll('input[type="button"][data-fp-url]');for(a=0;a<g.length;a++)f.push(g[a]);for(a=0;a<f.length;a++)j(f[a]);}};var l=function(a){if(a.jquery)a=a[0];var b=a.getAttribute('type');if(b=='filepicker')d(a);else if(b=='filepicker-dragdrop')e(a);else j(a);};return{constructPickWidget:d,constructDragWidget:e,constructExportWidget:j,buildWidgets:k,constructWidget:l};});filepicker.extend('window',function(){var a=this;var b={OPEN:'/dialog/open/',SAVEAS:'/dialog/save/'};var c="filepicker_dialog";var d="left=100,top=100,height=600,width=800,menubar=no,toolbar=no,location=no,personalbar=no,status=no,resizable=yes,scrollbars=yes,dependent=yes,dialog=yes";var e=1000;var f=function(){if(document.body&&document.body.offsetWidth){winW=document.body.offsetWidth;winH=document.body.offsetHeight;}if(document.compatMode=='CSS1Compat'&&document.documentElement&&document.documentElement.offsetWidth){winW=document.documentElement.offsetWidth;winH=document.documentElement.offsetHeight;}if(window.innerWidth&&window.innerHeight){winW=window.innerWidth;winH=window.innerHeight;}return [winW,winH];};var g=function(){var b=f()[0]<768;var c=a.cookies.THIRD_PARTY_COOKIES===false;return a.browser.isIOS()||a.browser.isAndroid()||b||c;};var h=function(b,f,h){h=h||function(){};if(!b)b='modal';if(b=='modal'&&g())b='window';if(b=='window'){var i=c+a.util.getId();var j=window.open(f,i,d);var k=window.setInterval(function(){if(!j||j.closed){window.clearInterval(k);h();}},e);}else if(b=='modal')a.modal.generate(f,h);else{var l=document.getElementById(b);if(!l)throw new a.FilepickerException("Container '"+b+"' not found. This should either be set to 'window','modal', or the ID of an iframe that is currently in the document.");l.src=f;}};return{open:h,WINDOW_NAME:c,getSize:f,shouldForce:g};});(function(){filepicker.internal(function(){var a=this;a.util.addOnLoad(a.cookies.checkThirdParty);a.util.addOnLoad(a.widgets.buildWidgets);});delete filepicker.internal;delete filepicker.extend;var a=filepicker._queue||[];var b;var c=a.length;if(c)for(var d=0;d<c;d++){b=a[d];filepicker[b[0]].apply(filepicker,b[1]);}delete filepicker._queue;})();
/*! jQuery UI - v1.10.2 - 2013-03-20
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.sortable.js, jquery.ui.effect.js, jquery.ui.effect-highlight.js
* Copyright 2013 jQuery Foundation and other contributors Licensed MIT */


(function(e,t){function i(t,i){var a,n,r,o=t.nodeName.toLowerCase();return"area"===o?(a=t.parentNode,n=a.name,t.href&&n&&"map"===a.nodeName.toLowerCase()?(r=e("img[usemap=#"+n+"]")[0],!!r&&s(r)):!1):(/input|select|textarea|button|object/.test(o)?!t.disabled:"a"===o?t.href||i:i)&&s(t)}function s(t){return e.expr.filters.visible(t)&&!e(t).parents().addBack().filter(function(){return"hidden"===e.css(this,"visibility")}).length}var a=0,n=/^ui-id-\d+$/;e.ui=e.ui||{},e.extend(e.ui,{version:"1.10.2",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),e.fn.extend({focus:function(t){return function(i,s){return"number"==typeof i?this.each(function(){var t=this;setTimeout(function(){e(t).focus(),s&&s.call(t)},i)}):t.apply(this,arguments)}}(e.fn.focus),scrollParent:function(){var t;return t=e.ui.ie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(e.css(this,"position"))&&/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0),/fixed/.test(this.css("position"))||!t.length?e(document):t},zIndex:function(i){if(i!==t)return this.css("zIndex",i);if(this.length)for(var s,a,n=e(this[0]);n.length&&n[0]!==document;){if(s=n.css("position"),("absolute"===s||"relative"===s||"fixed"===s)&&(a=parseInt(n.css("zIndex"),10),!isNaN(a)&&0!==a))return a;n=n.parent()}return 0},uniqueId:function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++a)})},removeUniqueId:function(){return this.each(function(){n.test(this.id)&&e(this).removeAttr("id")})}}),e.extend(e.expr[":"],{data:e.expr.createPseudo?e.expr.createPseudo(function(t){return function(i){return!!e.data(i,t)}}):function(t,i,s){return!!e.data(t,s[3])},focusable:function(t){return i(t,!isNaN(e.attr(t,"tabindex")))},tabbable:function(t){var s=e.attr(t,"tabindex"),a=isNaN(s);return(a||s>=0)&&i(t,!a)}}),e("<a>").outerWidth(1).jquery||e.each(["Width","Height"],function(i,s){function a(t,i,s,a){return e.each(n,function(){i-=parseFloat(e.css(t,"padding"+this))||0,s&&(i-=parseFloat(e.css(t,"border"+this+"Width"))||0),a&&(i-=parseFloat(e.css(t,"margin"+this))||0)}),i}var n="Width"===s?["Left","Right"]:["Top","Bottom"],r=s.toLowerCase(),o={innerWidth:e.fn.innerWidth,innerHeight:e.fn.innerHeight,outerWidth:e.fn.outerWidth,outerHeight:e.fn.outerHeight};e.fn["inner"+s]=function(i){return i===t?o["inner"+s].call(this):this.each(function(){e(this).css(r,a(this,i)+"px")})},e.fn["outer"+s]=function(t,i){return"number"!=typeof t?o["outer"+s].call(this,t):this.each(function(){e(this).css(r,a(this,t,!0,i)+"px")})}}),e.fn.addBack||(e.fn.addBack=function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}),e("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(e.fn.removeData=function(t){return function(i){return arguments.length?t.call(this,e.camelCase(i)):t.call(this)}}(e.fn.removeData)),e.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),e.support.selectstart="onselectstart"in document.createElement("div"),e.fn.extend({disableSelection:function(){return this.bind((e.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(e){e.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}}),e.extend(e.ui,{plugin:{add:function(t,i,s){var a,n=e.ui[t].prototype;for(a in s)n.plugins[a]=n.plugins[a]||[],n.plugins[a].push([i,s[a]])},call:function(e,t,i){var s,a=e.plugins[t];if(a&&e.element[0].parentNode&&11!==e.element[0].parentNode.nodeType)for(s=0;a.length>s;s++)e.options[a[s][0]]&&a[s][1].apply(e.element,i)}},hasScroll:function(t,i){if("hidden"===e(t).css("overflow"))return!1;var s=i&&"left"===i?"scrollLeft":"scrollTop",a=!1;return t[s]>0?!0:(t[s]=1,a=t[s]>0,t[s]=0,a)}})})(jQuery);(function(e,t){var i=0,s=Array.prototype.slice,n=e.cleanData;e.cleanData=function(t){for(var i,s=0;null!=(i=t[s]);s++)try{e(i).triggerHandler("remove")}catch(a){}n(t)},e.widget=function(i,s,n){var a,r,o,h,l={},u=i.split(".")[0];i=i.split(".")[1],a=u+"-"+i,n||(n=s,s=e.Widget),e.expr[":"][a.toLowerCase()]=function(t){return!!e.data(t,a)},e[u]=e[u]||{},r=e[u][i],o=e[u][i]=function(e,i){return this._createWidget?(arguments.length&&this._createWidget(e,i),t):new o(e,i)},e.extend(o,r,{version:n.version,_proto:e.extend({},n),_childConstructors:[]}),h=new s,h.options=e.widget.extend({},h.options),e.each(n,function(i,n){return e.isFunction(n)?(l[i]=function(){var e=function(){return s.prototype[i].apply(this,arguments)},t=function(e){return s.prototype[i].apply(this,e)};return function(){var i,s=this._super,a=this._superApply;return this._super=e,this._superApply=t,i=n.apply(this,arguments),this._super=s,this._superApply=a,i}}(),t):(l[i]=n,t)}),o.prototype=e.widget.extend(h,{widgetEventPrefix:r?h.widgetEventPrefix:i},l,{constructor:o,namespace:u,widgetName:i,widgetFullName:a}),r?(e.each(r._childConstructors,function(t,i){var s=i.prototype;e.widget(s.namespace+"."+s.widgetName,o,i._proto)}),delete r._childConstructors):s._childConstructors.push(o),e.widget.bridge(i,o)},e.widget.extend=function(i){for(var n,a,r=s.call(arguments,1),o=0,h=r.length;h>o;o++)for(n in r[o])a=r[o][n],r[o].hasOwnProperty(n)&&a!==t&&(i[n]=e.isPlainObject(a)?e.isPlainObject(i[n])?e.widget.extend({},i[n],a):e.widget.extend({},a):a);return i},e.widget.bridge=function(i,n){var a=n.prototype.widgetFullName||i;e.fn[i]=function(r){var o="string"==typeof r,h=s.call(arguments,1),l=this;return r=!o&&h.length?e.widget.extend.apply(null,[r].concat(h)):r,o?this.each(function(){var s,n=e.data(this,a);return n?e.isFunction(n[r])&&"_"!==r.charAt(0)?(s=n[r].apply(n,h),s!==n&&s!==t?(l=s&&s.jquery?l.pushStack(s.get()):s,!1):t):e.error("no such method '"+r+"' for "+i+" widget instance"):e.error("cannot call methods on "+i+" prior to initialization; "+"attempted to call method '"+r+"'")}):this.each(function(){var t=e.data(this,a);t?t.option(r||{})._init():e.data(this,a,new n(r,this))}),l}},e.Widget=function(){},e.Widget._childConstructors=[],e.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(t,s){s=e(s||this.defaultElement||this)[0],this.element=e(s),this.uuid=i++,this.eventNamespace="."+this.widgetName+this.uuid,this.options=e.widget.extend({},this.options,this._getCreateOptions(),t),this.bindings=e(),this.hoverable=e(),this.focusable=e(),s!==this&&(e.data(s,this.widgetFullName,this),this._on(!0,this.element,{remove:function(e){e.target===s&&this.destroy()}}),this.document=e(s.style?s.ownerDocument:s.document||s),this.window=e(this.document[0].defaultView||this.document[0].parentWindow)),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:e.noop,_getCreateEventData:e.noop,_create:e.noop,_init:e.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled "+"ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:e.noop,widget:function(){return this.element},option:function(i,s){var n,a,r,o=i;if(0===arguments.length)return e.widget.extend({},this.options);if("string"==typeof i)if(o={},n=i.split("."),i=n.shift(),n.length){for(a=o[i]=e.widget.extend({},this.options[i]),r=0;n.length-1>r;r++)a[n[r]]=a[n[r]]||{},a=a[n[r]];if(i=n.pop(),s===t)return a[i]===t?null:a[i];a[i]=s}else{if(s===t)return this.options[i]===t?null:this.options[i];o[i]=s}return this._setOptions(o),this},_setOptions:function(e){var t;for(t in e)this._setOption(t,e[t]);return this},_setOption:function(e,t){return this.options[e]=t,"disabled"===e&&(this.widget().toggleClass(this.widgetFullName+"-disabled ui-state-disabled",!!t).attr("aria-disabled",t),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")),this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_on:function(i,s,n){var a,r=this;"boolean"!=typeof i&&(n=s,s=i,i=!1),n?(s=a=e(s),this.bindings=this.bindings.add(s)):(n=s,s=this.element,a=this.widget()),e.each(n,function(n,o){function h(){return i||r.options.disabled!==!0&&!e(this).hasClass("ui-state-disabled")?("string"==typeof o?r[o]:o).apply(r,arguments):t}"string"!=typeof o&&(h.guid=o.guid=o.guid||h.guid||e.guid++);var l=n.match(/^(\w+)\s*(.*)$/),u=l[1]+r.eventNamespace,c=l[2];c?a.delegate(c,u,h):s.bind(u,h)})},_off:function(e,t){t=(t||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,e.unbind(t).undelegate(t)},_delay:function(e,t){function i(){return("string"==typeof e?s[e]:e).apply(s,arguments)}var s=this;return setTimeout(i,t||0)},_hoverable:function(t){this.hoverable=this.hoverable.add(t),this._on(t,{mouseenter:function(t){e(t.currentTarget).addClass("ui-state-hover")},mouseleave:function(t){e(t.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(t){this.focusable=this.focusable.add(t),this._on(t,{focusin:function(t){e(t.currentTarget).addClass("ui-state-focus")},focusout:function(t){e(t.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(t,i,s){var n,a,r=this.options[t];if(s=s||{},i=e.Event(i),i.type=(t===this.widgetEventPrefix?t:this.widgetEventPrefix+t).toLowerCase(),i.target=this.element[0],a=i.originalEvent)for(n in a)n in i||(i[n]=a[n]);return this.element.trigger(i,s),!(e.isFunction(r)&&r.apply(this.element[0],[i].concat(s))===!1||i.isDefaultPrevented())}},e.each({show:"fadeIn",hide:"fadeOut"},function(t,i){e.Widget.prototype["_"+t]=function(s,n,a){"string"==typeof n&&(n={effect:n});var r,o=n?n===!0||"number"==typeof n?i:n.effect||i:t;n=n||{},"number"==typeof n&&(n={duration:n}),r=!e.isEmptyObject(n),n.complete=a,n.delay&&s.delay(n.delay),r&&e.effects&&e.effects.effect[o]?s[t](n):o!==t&&s[o]?s[o](n.duration,n.easing,a):s.queue(function(i){e(this)[t](),a&&a.call(s[0]),i()})}})})(jQuery);(function(e){var t=!1;e(document).mouseup(function(){t=!1}),e.widget("ui.mouse",{version:"1.10.2",options:{cancel:"input,textarea,button,select,option",distance:1,delay:0},_mouseInit:function(){var t=this;this.element.bind("mousedown."+this.widgetName,function(e){return t._mouseDown(e)}).bind("click."+this.widgetName,function(i){return!0===e.data(i.target,t.widgetName+".preventClickEvent")?(e.removeData(i.target,t.widgetName+".preventClickEvent"),i.stopImmediatePropagation(),!1):undefined}),this.started=!1},_mouseDestroy:function(){this.element.unbind("."+this.widgetName),this._mouseMoveDelegate&&e(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(i){if(!t){this._mouseStarted&&this._mouseUp(i),this._mouseDownEvent=i;var s=this,n=1===i.which,a="string"==typeof this.options.cancel&&i.target.nodeName?e(i.target).closest(this.options.cancel).length:!1;return n&&!a&&this._mouseCapture(i)?(this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){s.mouseDelayMet=!0},this.options.delay)),this._mouseDistanceMet(i)&&this._mouseDelayMet(i)&&(this._mouseStarted=this._mouseStart(i)!==!1,!this._mouseStarted)?(i.preventDefault(),!0):(!0===e.data(i.target,this.widgetName+".preventClickEvent")&&e.removeData(i.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(e){return s._mouseMove(e)},this._mouseUpDelegate=function(e){return s._mouseUp(e)},e(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate),i.preventDefault(),t=!0,!0)):!0}},_mouseMove:function(t){return e.ui.ie&&(!document.documentMode||9>document.documentMode)&&!t.button?this._mouseUp(t):this._mouseStarted?(this._mouseDrag(t),t.preventDefault()):(this._mouseDistanceMet(t)&&this._mouseDelayMet(t)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,t)!==!1,this._mouseStarted?this._mouseDrag(t):this._mouseUp(t)),!this._mouseStarted)},_mouseUp:function(t){return e(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,t.target===this._mouseDownEvent.target&&e.data(t.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(t)),!1},_mouseDistanceMet:function(e){return Math.max(Math.abs(this._mouseDownEvent.pageX-e.pageX),Math.abs(this._mouseDownEvent.pageY-e.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return!0}})})(jQuery);(function(t){function e(t,e,i){return t>e&&e+i>t}function i(t){return/left|right/.test(t.css("float"))||/inline|table-cell/.test(t.css("display"))}t.widget("ui.sortable",t.ui.mouse,{version:"1.10.2",widgetEventPrefix:"sort",ready:!1,options:{appendTo:"parent",axis:!1,connectWith:!1,containment:!1,cursor:"auto",cursorAt:!1,dropOnEmpty:!0,forcePlaceholderSize:!1,forceHelperSize:!1,grid:!1,handle:!1,helper:"original",items:"> *",opacity:!1,placeholder:!1,revert:!1,scroll:!0,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1e3,activate:null,beforeStop:null,change:null,deactivate:null,out:null,over:null,receive:null,remove:null,sort:null,start:null,stop:null,update:null},_create:function(){var t=this.options;this.containerCache={},this.element.addClass("ui-sortable"),this.refresh(),this.floating=this.items.length?"x"===t.axis||i(this.items[0].item):!1,this.offset=this.element.offset(),this._mouseInit(),this.ready=!0},_destroy:function(){this.element.removeClass("ui-sortable ui-sortable-disabled"),this._mouseDestroy();for(var t=this.items.length-1;t>=0;t--)this.items[t].item.removeData(this.widgetName+"-item");return this},_setOption:function(e,i){"disabled"===e?(this.options[e]=i,this.widget().toggleClass("ui-sortable-disabled",!!i)):t.Widget.prototype._setOption.apply(this,arguments)},_mouseCapture:function(e,i){var s=null,n=!1,a=this;return this.reverting?!1:this.options.disabled||"static"===this.options.type?!1:(this._refreshItems(e),t(e.target).parents().each(function(){return t.data(this,a.widgetName+"-item")===a?(s=t(this),!1):undefined}),t.data(e.target,a.widgetName+"-item")===a&&(s=t(e.target)),s?!this.options.handle||i||(t(this.options.handle,s).find("*").addBack().each(function(){this===e.target&&(n=!0)}),n)?(this.currentItem=s,this._removeCurrentsFromItems(),!0):!1:!1)},_mouseStart:function(e,i,s){var n,a,o=this.options;if(this.currentContainer=this,this.refreshPositions(),this.helper=this._createHelper(e),this._cacheHelperProportions(),this._cacheMargins(),this.scrollParent=this.helper.scrollParent(),this.offset=this.currentItem.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},t.extend(this.offset,{click:{left:e.pageX-this.offset.left,top:e.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.helper.css("position","absolute"),this.cssPosition=this.helper.css("position"),this.originalPosition=this._generatePosition(e),this.originalPageX=e.pageX,this.originalPageY=e.pageY,o.cursorAt&&this._adjustOffsetFromHelper(o.cursorAt),this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]},this.helper[0]!==this.currentItem[0]&&this.currentItem.hide(),this._createPlaceholder(),o.containment&&this._setContainment(),o.cursor&&"auto"!==o.cursor&&(a=this.document.find("body"),this.storedCursor=a.css("cursor"),a.css("cursor",o.cursor),this.storedStylesheet=t("<style>*{ cursor: "+o.cursor+" !important; }</style>").appendTo(a)),o.opacity&&(this.helper.css("opacity")&&(this._storedOpacity=this.helper.css("opacity")),this.helper.css("opacity",o.opacity)),o.zIndex&&(this.helper.css("zIndex")&&(this._storedZIndex=this.helper.css("zIndex")),this.helper.css("zIndex",o.zIndex)),this.scrollParent[0]!==document&&"HTML"!==this.scrollParent[0].tagName&&(this.overflowOffset=this.scrollParent.offset()),this._trigger("start",e,this._uiHash()),this._preserveHelperProportions||this._cacheHelperProportions(),!s)for(n=this.containers.length-1;n>=0;n--)this.containers[n]._trigger("activate",e,this._uiHash(this));return t.ui.ddmanager&&(t.ui.ddmanager.current=this),t.ui.ddmanager&&!o.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e),this.dragging=!0,this.helper.addClass("ui-sortable-helper"),this._mouseDrag(e),!0},_mouseDrag:function(e){var i,s,n,a,o=this.options,r=!1;for(this.position=this._generatePosition(e),this.positionAbs=this._convertPositionTo("absolute"),this.lastPositionAbs||(this.lastPositionAbs=this.positionAbs),this.options.scroll&&(this.scrollParent[0]!==document&&"HTML"!==this.scrollParent[0].tagName?(this.overflowOffset.top+this.scrollParent[0].offsetHeight-e.pageY<o.scrollSensitivity?this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop+o.scrollSpeed:e.pageY-this.overflowOffset.top<o.scrollSensitivity&&(this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop-o.scrollSpeed),this.overflowOffset.left+this.scrollParent[0].offsetWidth-e.pageX<o.scrollSensitivity?this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft+o.scrollSpeed:e.pageX-this.overflowOffset.left<o.scrollSensitivity&&(this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft-o.scrollSpeed)):(e.pageY-t(document).scrollTop()<o.scrollSensitivity?r=t(document).scrollTop(t(document).scrollTop()-o.scrollSpeed):t(window).height()-(e.pageY-t(document).scrollTop())<o.scrollSensitivity&&(r=t(document).scrollTop(t(document).scrollTop()+o.scrollSpeed)),e.pageX-t(document).scrollLeft()<o.scrollSensitivity?r=t(document).scrollLeft(t(document).scrollLeft()-o.scrollSpeed):t(window).width()-(e.pageX-t(document).scrollLeft())<o.scrollSensitivity&&(r=t(document).scrollLeft(t(document).scrollLeft()+o.scrollSpeed))),r!==!1&&t.ui.ddmanager&&!o.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e)),this.positionAbs=this._convertPositionTo("absolute"),this.options.axis&&"y"===this.options.axis||(this.helper[0].style.left=this.position.left+"px"),this.options.axis&&"x"===this.options.axis||(this.helper[0].style.top=this.position.top+"px"),i=this.items.length-1;i>=0;i--)if(s=this.items[i],n=s.item[0],a=this._intersectsWithPointer(s),a&&s.instance===this.currentContainer&&n!==this.currentItem[0]&&this.placeholder[1===a?"next":"prev"]()[0]!==n&&!t.contains(this.placeholder[0],n)&&("semi-dynamic"===this.options.type?!t.contains(this.element[0],n):!0)){if(this.direction=1===a?"down":"up","pointer"!==this.options.tolerance&&!this._intersectsWithSides(s))break;this._rearrange(e,s),this._trigger("change",e,this._uiHash());break}return this._contactContainers(e),t.ui.ddmanager&&t.ui.ddmanager.drag(this,e),this._trigger("sort",e,this._uiHash()),this.lastPositionAbs=this.positionAbs,!1},_mouseStop:function(e,i){if(e){if(t.ui.ddmanager&&!this.options.dropBehaviour&&t.ui.ddmanager.drop(this,e),this.options.revert){var s=this,n=this.placeholder.offset(),a=this.options.axis,o={};a&&"x"!==a||(o.left=n.left-this.offset.parent.left-this.margins.left+(this.offsetParent[0]===document.body?0:this.offsetParent[0].scrollLeft)),a&&"y"!==a||(o.top=n.top-this.offset.parent.top-this.margins.top+(this.offsetParent[0]===document.body?0:this.offsetParent[0].scrollTop)),this.reverting=!0,t(this.helper).animate(o,parseInt(this.options.revert,10)||500,function(){s._clear(e)})}else this._clear(e,i);return!1}},cancel:function(){if(this.dragging){this._mouseUp({target:null}),"original"===this.options.helper?this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper"):this.currentItem.show();for(var e=this.containers.length-1;e>=0;e--)this.containers[e]._trigger("deactivate",null,this._uiHash(this)),this.containers[e].containerCache.over&&(this.containers[e]._trigger("out",null,this._uiHash(this)),this.containers[e].containerCache.over=0)}return this.placeholder&&(this.placeholder[0].parentNode&&this.placeholder[0].parentNode.removeChild(this.placeholder[0]),"original"!==this.options.helper&&this.helper&&this.helper[0].parentNode&&this.helper.remove(),t.extend(this,{helper:null,dragging:!1,reverting:!1,_noFinalSort:null}),this.domPosition.prev?t(this.domPosition.prev).after(this.currentItem):t(this.domPosition.parent).prepend(this.currentItem)),this},serialize:function(e){var i=this._getItemsAsjQuery(e&&e.connected),s=[];return e=e||{},t(i).each(function(){var i=(t(e.item||this).attr(e.attribute||"id")||"").match(e.expression||/(.+)[\-=_](.+)/);i&&s.push((e.key||i[1]+"[]")+"="+(e.key&&e.expression?i[1]:i[2]))}),!s.length&&e.key&&s.push(e.key+"="),s.join("&")},toArray:function(e){var i=this._getItemsAsjQuery(e&&e.connected),s=[];return e=e||{},i.each(function(){s.push(t(e.item||this).attr(e.attribute||"id")||"")}),s},_intersectsWith:function(t){var e=this.positionAbs.left,i=e+this.helperProportions.width,s=this.positionAbs.top,n=s+this.helperProportions.height,a=t.left,o=a+t.width,r=t.top,h=r+t.height,l=this.offset.click.top,c=this.offset.click.left,u=s+l>r&&h>s+l&&e+c>a&&o>e+c;return"pointer"===this.options.tolerance||this.options.forcePointerForContainers||"pointer"!==this.options.tolerance&&this.helperProportions[this.floating?"width":"height"]>t[this.floating?"width":"height"]?u:e+this.helperProportions.width/2>a&&o>i-this.helperProportions.width/2&&s+this.helperProportions.height/2>r&&h>n-this.helperProportions.height/2},_intersectsWithPointer:function(t){var i="x"===this.options.axis||e(this.positionAbs.top+this.offset.click.top,t.top,t.height),s="y"===this.options.axis||e(this.positionAbs.left+this.offset.click.left,t.left,t.width),n=i&&s,a=this._getDragVerticalDirection(),o=this._getDragHorizontalDirection();return n?this.floating?o&&"right"===o||"down"===a?2:1:a&&("down"===a?2:1):!1},_intersectsWithSides:function(t){var i=e(this.positionAbs.top+this.offset.click.top,t.top+t.height/2,t.height),s=e(this.positionAbs.left+this.offset.click.left,t.left+t.width/2,t.width),n=this._getDragVerticalDirection(),a=this._getDragHorizontalDirection();return this.floating&&a?"right"===a&&s||"left"===a&&!s:n&&("down"===n&&i||"up"===n&&!i)},_getDragVerticalDirection:function(){var t=this.positionAbs.top-this.lastPositionAbs.top;return 0!==t&&(t>0?"down":"up")},_getDragHorizontalDirection:function(){var t=this.positionAbs.left-this.lastPositionAbs.left;return 0!==t&&(t>0?"right":"left")},refresh:function(t){return this._refreshItems(t),this.refreshPositions(),this},_connectWith:function(){var t=this.options;return t.connectWith.constructor===String?[t.connectWith]:t.connectWith},_getItemsAsjQuery:function(e){var i,s,n,a,o=[],r=[],h=this._connectWith();if(h&&e)for(i=h.length-1;i>=0;i--)for(n=t(h[i]),s=n.length-1;s>=0;s--)a=t.data(n[s],this.widgetFullName),a&&a!==this&&!a.options.disabled&&r.push([t.isFunction(a.options.items)?a.options.items.call(a.element):t(a.options.items,a.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),a]);for(r.push([t.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):t(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]),i=r.length-1;i>=0;i--)r[i][0].each(function(){o.push(this)});return t(o)},_removeCurrentsFromItems:function(){var e=this.currentItem.find(":data("+this.widgetName+"-item)");this.items=t.grep(this.items,function(t){for(var i=0;e.length>i;i++)if(e[i]===t.item[0])return!1;return!0})},_refreshItems:function(e){this.items=[],this.containers=[this];var i,s,n,a,o,r,h,l,c=this.items,u=[[t.isFunction(this.options.items)?this.options.items.call(this.element[0],e,{item:this.currentItem}):t(this.options.items,this.element),this]],d=this._connectWith();if(d&&this.ready)for(i=d.length-1;i>=0;i--)for(n=t(d[i]),s=n.length-1;s>=0;s--)a=t.data(n[s],this.widgetFullName),a&&a!==this&&!a.options.disabled&&(u.push([t.isFunction(a.options.items)?a.options.items.call(a.element[0],e,{item:this.currentItem}):t(a.options.items,a.element),a]),this.containers.push(a));for(i=u.length-1;i>=0;i--)for(o=u[i][1],r=u[i][0],s=0,l=r.length;l>s;s++)h=t(r[s]),h.data(this.widgetName+"-item",o),c.push({item:h,instance:o,width:0,height:0,left:0,top:0})},refreshPositions:function(e){this.offsetParent&&this.helper&&(this.offset.parent=this._getParentOffset());var i,s,n,a;for(i=this.items.length-1;i>=0;i--)s=this.items[i],s.instance!==this.currentContainer&&this.currentContainer&&s.item[0]!==this.currentItem[0]||(n=this.options.toleranceElement?t(this.options.toleranceElement,s.item):s.item,e||(s.width=n.outerWidth(),s.height=n.outerHeight()),a=n.offset(),s.left=a.left,s.top=a.top);if(this.options.custom&&this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this);else for(i=this.containers.length-1;i>=0;i--)a=this.containers[i].element.offset(),this.containers[i].containerCache.left=a.left,this.containers[i].containerCache.top=a.top,this.containers[i].containerCache.width=this.containers[i].element.outerWidth(),this.containers[i].containerCache.height=this.containers[i].element.outerHeight();return this},_createPlaceholder:function(e){e=e||this;var i,s=e.options;s.placeholder&&s.placeholder.constructor!==String||(i=s.placeholder,s.placeholder={element:function(){var s=e.currentItem[0].nodeName.toLowerCase(),n=t(e.document[0].createElement(s)).addClass(i||e.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper");return"tr"===s?n.append("<td colspan='99'>&#160;</td>"):"img"===s&&n.attr("src",e.currentItem.attr("src")),i||n.css("visibility","hidden"),n},update:function(t,n){(!i||s.forcePlaceholderSize)&&(n.height()||n.height(e.currentItem.innerHeight()-parseInt(e.currentItem.css("paddingTop")||0,10)-parseInt(e.currentItem.css("paddingBottom")||0,10)),n.width()||n.width(e.currentItem.innerWidth()-parseInt(e.currentItem.css("paddingLeft")||0,10)-parseInt(e.currentItem.css("paddingRight")||0,10)))}}),e.placeholder=t(s.placeholder.element.call(e.element,e.currentItem)),e.currentItem.after(e.placeholder),s.placeholder.update(e,e.placeholder)},_contactContainers:function(s){var n,a,o,r,h,l,c,u,d,p,f=null,m=null;for(n=this.containers.length-1;n>=0;n--)if(!t.contains(this.currentItem[0],this.containers[n].element[0]))if(this._intersectsWith(this.containers[n].containerCache)){if(f&&t.contains(this.containers[n].element[0],f.element[0]))continue;f=this.containers[n],m=n}else this.containers[n].containerCache.over&&(this.containers[n]._trigger("out",s,this._uiHash(this)),this.containers[n].containerCache.over=0);if(f)if(1===this.containers.length)this.containers[m].containerCache.over||(this.containers[m]._trigger("over",s,this._uiHash(this)),this.containers[m].containerCache.over=1);else{for(o=1e4,r=null,p=f.floating||i(this.currentItem),h=p?"left":"top",l=p?"width":"height",c=this.positionAbs[h]+this.offset.click[h],a=this.items.length-1;a>=0;a--)t.contains(this.containers[m].element[0],this.items[a].item[0])&&this.items[a].item[0]!==this.currentItem[0]&&(!p||e(this.positionAbs.top+this.offset.click.top,this.items[a].top,this.items[a].height))&&(u=this.items[a].item.offset()[h],d=!1,Math.abs(u-c)>Math.abs(u+this.items[a][l]-c)&&(d=!0,u+=this.items[a][l]),o>Math.abs(u-c)&&(o=Math.abs(u-c),r=this.items[a],this.direction=d?"up":"down"));if(!r&&!this.options.dropOnEmpty)return;if(this.currentContainer===this.containers[m])return;r?this._rearrange(s,r,null,!0):this._rearrange(s,null,this.containers[m].element,!0),this._trigger("change",s,this._uiHash()),this.containers[m]._trigger("change",s,this._uiHash(this)),this.currentContainer=this.containers[m],this.options.placeholder.update(this.currentContainer,this.placeholder),this.containers[m]._trigger("over",s,this._uiHash(this)),this.containers[m].containerCache.over=1}},_createHelper:function(e){var i=this.options,s=t.isFunction(i.helper)?t(i.helper.apply(this.element[0],[e,this.currentItem])):"clone"===i.helper?this.currentItem.clone():this.currentItem;return s.parents("body").length||t("parent"!==i.appendTo?i.appendTo:this.currentItem[0].parentNode)[0].appendChild(s[0]),s[0]===this.currentItem[0]&&(this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")}),(!s[0].style.width||i.forceHelperSize)&&s.width(this.currentItem.width()),(!s[0].style.height||i.forceHelperSize)&&s.height(this.currentItem.height()),s},_adjustOffsetFromHelper:function(e){"string"==typeof e&&(e=e.split(" ")),t.isArray(e)&&(e={left:+e[0],top:+e[1]||0}),"left"in e&&(this.offset.click.left=e.left+this.margins.left),"right"in e&&(this.offset.click.left=this.helperProportions.width-e.right+this.margins.left),"top"in e&&(this.offset.click.top=e.top+this.margins.top),"bottom"in e&&(this.offset.click.top=this.helperProportions.height-e.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var e=this.offsetParent.offset();return"absolute"===this.cssPosition&&this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])&&(e.left+=this.scrollParent.scrollLeft(),e.top+=this.scrollParent.scrollTop()),(this.offsetParent[0]===document.body||this.offsetParent[0].tagName&&"html"===this.offsetParent[0].tagName.toLowerCase()&&t.ui.ie)&&(e={top:0,left:0}),{top:e.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:e.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"===this.cssPosition){var t=this.currentItem.position();return{top:t.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:t.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var e,i,s,n=this.options;"parent"===n.containment&&(n.containment=this.helper[0].parentNode),("document"===n.containment||"window"===n.containment)&&(this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,t("document"===n.containment?document:window).width()-this.helperProportions.width-this.margins.left,(t("document"===n.containment?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top]),/^(document|window|parent)$/.test(n.containment)||(e=t(n.containment)[0],i=t(n.containment).offset(),s="hidden"!==t(e).css("overflow"),this.containment=[i.left+(parseInt(t(e).css("borderLeftWidth"),10)||0)+(parseInt(t(e).css("paddingLeft"),10)||0)-this.margins.left,i.top+(parseInt(t(e).css("borderTopWidth"),10)||0)+(parseInt(t(e).css("paddingTop"),10)||0)-this.margins.top,i.left+(s?Math.max(e.scrollWidth,e.offsetWidth):e.offsetWidth)-(parseInt(t(e).css("borderLeftWidth"),10)||0)-(parseInt(t(e).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,i.top+(s?Math.max(e.scrollHeight,e.offsetHeight):e.offsetHeight)-(parseInt(t(e).css("borderTopWidth"),10)||0)-(parseInt(t(e).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top])},_convertPositionTo:function(e,i){i||(i=this.position);var s="absolute"===e?1:-1,n="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,a=/(html|body)/i.test(n[0].tagName);return{top:i.top+this.offset.relative.top*s+this.offset.parent.top*s-("fixed"===this.cssPosition?-this.scrollParent.scrollTop():a?0:n.scrollTop())*s,left:i.left+this.offset.relative.left*s+this.offset.parent.left*s-("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():a?0:n.scrollLeft())*s}},_generatePosition:function(e){var i,s,n=this.options,a=e.pageX,o=e.pageY,r="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,h=/(html|body)/i.test(r[0].tagName);return"relative"!==this.cssPosition||this.scrollParent[0]!==document&&this.scrollParent[0]!==this.offsetParent[0]||(this.offset.relative=this._getRelativeOffset()),this.originalPosition&&(this.containment&&(e.pageX-this.offset.click.left<this.containment[0]&&(a=this.containment[0]+this.offset.click.left),e.pageY-this.offset.click.top<this.containment[1]&&(o=this.containment[1]+this.offset.click.top),e.pageX-this.offset.click.left>this.containment[2]&&(a=this.containment[2]+this.offset.click.left),e.pageY-this.offset.click.top>this.containment[3]&&(o=this.containment[3]+this.offset.click.top)),n.grid&&(i=this.originalPageY+Math.round((o-this.originalPageY)/n.grid[1])*n.grid[1],o=this.containment?i-this.offset.click.top>=this.containment[1]&&i-this.offset.click.top<=this.containment[3]?i:i-this.offset.click.top>=this.containment[1]?i-n.grid[1]:i+n.grid[1]:i,s=this.originalPageX+Math.round((a-this.originalPageX)/n.grid[0])*n.grid[0],a=this.containment?s-this.offset.click.left>=this.containment[0]&&s-this.offset.click.left<=this.containment[2]?s:s-this.offset.click.left>=this.containment[0]?s-n.grid[0]:s+n.grid[0]:s)),{top:o-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.scrollParent.scrollTop():h?0:r.scrollTop()),left:a-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():h?0:r.scrollLeft())}},_rearrange:function(t,e,i,s){i?i[0].appendChild(this.placeholder[0]):e.item[0].parentNode.insertBefore(this.placeholder[0],"down"===this.direction?e.item[0]:e.item[0].nextSibling),this.counter=this.counter?++this.counter:1;var n=this.counter;this._delay(function(){n===this.counter&&this.refreshPositions(!s)})},_clear:function(t,e){this.reverting=!1;var i,s=[];if(!this._noFinalSort&&this.currentItem.parent().length&&this.placeholder.before(this.currentItem),this._noFinalSort=null,this.helper[0]===this.currentItem[0]){for(i in this._storedCSS)("auto"===this._storedCSS[i]||"static"===this._storedCSS[i])&&(this._storedCSS[i]="");this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")}else this.currentItem.show();for(this.fromOutside&&!e&&s.push(function(t){this._trigger("receive",t,this._uiHash(this.fromOutside))}),!this.fromOutside&&this.domPosition.prev===this.currentItem.prev().not(".ui-sortable-helper")[0]&&this.domPosition.parent===this.currentItem.parent()[0]||e||s.push(function(t){this._trigger("update",t,this._uiHash())}),this!==this.currentContainer&&(e||(s.push(function(t){this._trigger("remove",t,this._uiHash())}),s.push(function(t){return function(e){t._trigger("receive",e,this._uiHash(this))}}.call(this,this.currentContainer)),s.push(function(t){return function(e){t._trigger("update",e,this._uiHash(this))}}.call(this,this.currentContainer)))),i=this.containers.length-1;i>=0;i--)e||s.push(function(t){return function(e){t._trigger("deactivate",e,this._uiHash(this))}}.call(this,this.containers[i])),this.containers[i].containerCache.over&&(s.push(function(t){return function(e){t._trigger("out",e,this._uiHash(this))}}.call(this,this.containers[i])),this.containers[i].containerCache.over=0);if(this.storedCursor&&(this.document.find("body").css("cursor",this.storedCursor),this.storedStylesheet.remove()),this._storedOpacity&&this.helper.css("opacity",this._storedOpacity),this._storedZIndex&&this.helper.css("zIndex","auto"===this._storedZIndex?"":this._storedZIndex),this.dragging=!1,this.cancelHelperRemoval){if(!e){for(this._trigger("beforeStop",t,this._uiHash()),i=0;s.length>i;i++)s[i].call(this,t);this._trigger("stop",t,this._uiHash())}return this.fromOutside=!1,!1}if(e||this._trigger("beforeStop",t,this._uiHash()),this.placeholder[0].parentNode.removeChild(this.placeholder[0]),this.helper[0]!==this.currentItem[0]&&this.helper.remove(),this.helper=null,!e){for(i=0;s.length>i;i++)s[i].call(this,t);this._trigger("stop",t,this._uiHash())}return this.fromOutside=!1,!0},_trigger:function(){t.Widget.prototype._trigger.apply(this,arguments)===!1&&this.cancel()},_uiHash:function(e){var i=e||this;return{helper:i.helper,placeholder:i.placeholder||t([]),position:i.position,originalPosition:i.originalPosition,offset:i.positionAbs,item:i.currentItem,sender:e?e.element:null}}})})(jQuery);(function(t,e){var i="ui-effects-";t.effects={effect:{}},function(t,e){function i(t,e,i){var s=u[e.type]||{};return null==t?i||!e.def?null:e.def:(t=s.floor?~~t:parseFloat(t),isNaN(t)?e.def:s.mod?(t+s.mod)%s.mod:0>t?0:t>s.max?s.max:t)}function s(i){var s=l(),n=s._rgba=[];return i=i.toLowerCase(),f(h,function(t,a){var o,r=a.re.exec(i),h=r&&a.parse(r),l=a.space||"rgba";return h?(o=s[l](h),s[c[l].cache]=o[c[l].cache],n=s._rgba=o._rgba,!1):e}),n.length?("0,0,0,0"===n.join()&&t.extend(n,a.transparent),s):a[i]}function n(t,e,i){return i=(i+1)%1,1>6*i?t+6*(e-t)*i:1>2*i?e:2>3*i?t+6*(e-t)*(2/3-i):t}var a,o="backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",r=/^([\-+])=\s*(\d+\.?\d*)/,h=[{re:/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(t){return[t[1],t[2],t[3],t[4]]}},{re:/rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(t){return[2.55*t[1],2.55*t[2],2.55*t[3],t[4]]}},{re:/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,parse:function(t){return[parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16)]}},{re:/#([a-f0-9])([a-f0-9])([a-f0-9])/,parse:function(t){return[parseInt(t[1]+t[1],16),parseInt(t[2]+t[2],16),parseInt(t[3]+t[3],16)]}},{re:/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,space:"hsla",parse:function(t){return[t[1],t[2]/100,t[3]/100,t[4]]}}],l=t.Color=function(e,i,s,n){return new t.Color.fn.parse(e,i,s,n)},c={rgba:{props:{red:{idx:0,type:"byte"},green:{idx:1,type:"byte"},blue:{idx:2,type:"byte"}}},hsla:{props:{hue:{idx:0,type:"degrees"},saturation:{idx:1,type:"percent"},lightness:{idx:2,type:"percent"}}}},u={"byte":{floor:!0,max:255},percent:{max:1},degrees:{mod:360,floor:!0}},d=l.support={},p=t("<p>")[0],f=t.each;p.style.cssText="background-color:rgba(1,1,1,.5)",d.rgba=p.style.backgroundColor.indexOf("rgba")>-1,f(c,function(t,e){e.cache="_"+t,e.props.alpha={idx:3,type:"percent",def:1}}),l.fn=t.extend(l.prototype,{parse:function(n,o,r,h){if(n===e)return this._rgba=[null,null,null,null],this;(n.jquery||n.nodeType)&&(n=t(n).css(o),o=e);var u=this,d=t.type(n),p=this._rgba=[];return o!==e&&(n=[n,o,r,h],d="array"),"string"===d?this.parse(s(n)||a._default):"array"===d?(f(c.rgba.props,function(t,e){p[e.idx]=i(n[e.idx],e)}),this):"object"===d?(n instanceof l?f(c,function(t,e){n[e.cache]&&(u[e.cache]=n[e.cache].slice())}):f(c,function(e,s){var a=s.cache;f(s.props,function(t,e){if(!u[a]&&s.to){if("alpha"===t||null==n[t])return;u[a]=s.to(u._rgba)}u[a][e.idx]=i(n[t],e,!0)}),u[a]&&0>t.inArray(null,u[a].slice(0,3))&&(u[a][3]=1,s.from&&(u._rgba=s.from(u[a])))}),this):e},is:function(t){var i=l(t),s=!0,n=this;return f(c,function(t,a){var o,r=i[a.cache];return r&&(o=n[a.cache]||a.to&&a.to(n._rgba)||[],f(a.props,function(t,i){return null!=r[i.idx]?s=r[i.idx]===o[i.idx]:e})),s}),s},_space:function(){var t=[],e=this;return f(c,function(i,s){e[s.cache]&&t.push(i)}),t.pop()},transition:function(t,e){var s=l(t),n=s._space(),a=c[n],o=0===this.alpha()?l("transparent"):this,r=o[a.cache]||a.to(o._rgba),h=r.slice();return s=s[a.cache],f(a.props,function(t,n){var a=n.idx,o=r[a],l=s[a],c=u[n.type]||{};null!==l&&(null===o?h[a]=l:(c.mod&&(l-o>c.mod/2?o+=c.mod:o-l>c.mod/2&&(o-=c.mod)),h[a]=i((l-o)*e+o,n)))}),this[n](h)},blend:function(e){if(1===this._rgba[3])return this;var i=this._rgba.slice(),s=i.pop(),n=l(e)._rgba;return l(t.map(i,function(t,e){return(1-s)*n[e]+s*t}))},toRgbaString:function(){var e="rgba(",i=t.map(this._rgba,function(t,e){return null==t?e>2?1:0:t});return 1===i[3]&&(i.pop(),e="rgb("),e+i.join()+")"},toHslaString:function(){var e="hsla(",i=t.map(this.hsla(),function(t,e){return null==t&&(t=e>2?1:0),e&&3>e&&(t=Math.round(100*t)+"%"),t});return 1===i[3]&&(i.pop(),e="hsl("),e+i.join()+")"},toHexString:function(e){var i=this._rgba.slice(),s=i.pop();return e&&i.push(~~(255*s)),"#"+t.map(i,function(t){return t=(t||0).toString(16),1===t.length?"0"+t:t}).join("")},toString:function(){return 0===this._rgba[3]?"transparent":this.toRgbaString()}}),l.fn.parse.prototype=l.fn,c.hsla.to=function(t){if(null==t[0]||null==t[1]||null==t[2])return[null,null,null,t[3]];var e,i,s=t[0]/255,n=t[1]/255,a=t[2]/255,o=t[3],r=Math.max(s,n,a),h=Math.min(s,n,a),l=r-h,c=r+h,u=.5*c;return e=h===r?0:s===r?60*(n-a)/l+360:n===r?60*(a-s)/l+120:60*(s-n)/l+240,i=0===l?0:.5>=u?l/c:l/(2-c),[Math.round(e)%360,i,u,null==o?1:o]},c.hsla.from=function(t){if(null==t[0]||null==t[1]||null==t[2])return[null,null,null,t[3]];var e=t[0]/360,i=t[1],s=t[2],a=t[3],o=.5>=s?s*(1+i):s+i-s*i,r=2*s-o;return[Math.round(255*n(r,o,e+1/3)),Math.round(255*n(r,o,e)),Math.round(255*n(r,o,e-1/3)),a]},f(c,function(s,n){var a=n.props,o=n.cache,h=n.to,c=n.from;l.fn[s]=function(s){if(h&&!this[o]&&(this[o]=h(this._rgba)),s===e)return this[o].slice();var n,r=t.type(s),u="array"===r||"object"===r?s:arguments,d=this[o].slice();return f(a,function(t,e){var s=u["object"===r?t:e.idx];null==s&&(s=d[e.idx]),d[e.idx]=i(s,e)}),c?(n=l(c(d)),n[o]=d,n):l(d)},f(a,function(e,i){l.fn[e]||(l.fn[e]=function(n){var a,o=t.type(n),h="alpha"===e?this._hsla?"hsla":"rgba":s,l=this[h](),c=l[i.idx];return"undefined"===o?c:("function"===o&&(n=n.call(this,c),o=t.type(n)),null==n&&i.empty?this:("string"===o&&(a=r.exec(n),a&&(n=c+parseFloat(a[2])*("+"===a[1]?1:-1))),l[i.idx]=n,this[h](l)))})})}),l.hook=function(e){var i=e.split(" ");f(i,function(e,i){t.cssHooks[i]={set:function(e,n){var a,o,r="";if("transparent"!==n&&("string"!==t.type(n)||(a=s(n)))){if(n=l(a||n),!d.rgba&&1!==n._rgba[3]){for(o="backgroundColor"===i?e.parentNode:e;(""===r||"transparent"===r)&&o&&o.style;)try{r=t.css(o,"backgroundColor"),o=o.parentNode}catch(h){}n=n.blend(r&&"transparent"!==r?r:"_default")}n=n.toRgbaString()}try{e.style[i]=n}catch(h){}}},t.fx.step[i]=function(e){e.colorInit||(e.start=l(e.elem,i),e.end=l(e.end),e.colorInit=!0),t.cssHooks[i].set(e.elem,e.start.transition(e.end,e.pos))}})},l.hook(o),t.cssHooks.borderColor={expand:function(t){var e={};return f(["Top","Right","Bottom","Left"],function(i,s){e["border"+s+"Color"]=t}),e}},a=t.Color.names={aqua:"#00ffff",black:"#000000",blue:"#0000ff",fuchsia:"#ff00ff",gray:"#808080",green:"#008000",lime:"#00ff00",maroon:"#800000",navy:"#000080",olive:"#808000",purple:"#800080",red:"#ff0000",silver:"#c0c0c0",teal:"#008080",white:"#ffffff",yellow:"#ffff00",transparent:[null,null,null,0],_default:"#ffffff"}}(jQuery),function(){function i(e){var i,s,n=e.ownerDocument.defaultView?e.ownerDocument.defaultView.getComputedStyle(e,null):e.currentStyle,a={};if(n&&n.length&&n[0]&&n[n[0]])for(s=n.length;s--;)i=n[s],"string"==typeof n[i]&&(a[t.camelCase(i)]=n[i]);else for(i in n)"string"==typeof n[i]&&(a[i]=n[i]);return a}function s(e,i){var s,n,o={};for(s in i)n=i[s],e[s]!==n&&(a[s]||(t.fx.step[s]||!isNaN(parseFloat(n)))&&(o[s]=n));return o}var n=["add","remove","toggle"],a={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};t.each(["borderLeftStyle","borderRightStyle","borderBottomStyle","borderTopStyle"],function(e,i){t.fx.step[i]=function(t){("none"!==t.end&&!t.setAttr||1===t.pos&&!t.setAttr)&&(jQuery.style(t.elem,i,t.end),t.setAttr=!0)}}),t.fn.addBack||(t.fn.addBack=function(t){return this.add(null==t?this.prevObject:this.prevObject.filter(t))}),t.effects.animateClass=function(e,a,o,r){var h=t.speed(a,o,r);return this.queue(function(){var a,o=t(this),r=o.attr("class")||"",l=h.children?o.find("*").addBack():o;l=l.map(function(){var e=t(this);return{el:e,start:i(this)}}),a=function(){t.each(n,function(t,i){e[i]&&o[i+"Class"](e[i])})},a(),l=l.map(function(){return this.end=i(this.el[0]),this.diff=s(this.start,this.end),this}),o.attr("class",r),l=l.map(function(){var e=this,i=t.Deferred(),s=t.extend({},h,{queue:!1,complete:function(){i.resolve(e)}});return this.el.animate(this.diff,s),i.promise()}),t.when.apply(t,l.get()).done(function(){a(),t.each(arguments,function(){var e=this.el;t.each(this.diff,function(t){e.css(t,"")})}),h.complete.call(o[0])})})},t.fn.extend({addClass:function(e){return function(i,s,n,a){return s?t.effects.animateClass.call(this,{add:i},s,n,a):e.apply(this,arguments)}}(t.fn.addClass),removeClass:function(e){return function(i,s,n,a){return arguments.length>1?t.effects.animateClass.call(this,{remove:i},s,n,a):e.apply(this,arguments)}}(t.fn.removeClass),toggleClass:function(i){return function(s,n,a,o,r){return"boolean"==typeof n||n===e?a?t.effects.animateClass.call(this,n?{add:s}:{remove:s},a,o,r):i.apply(this,arguments):t.effects.animateClass.call(this,{toggle:s},n,a,o)}}(t.fn.toggleClass),switchClass:function(e,i,s,n,a){return t.effects.animateClass.call(this,{add:i,remove:e},s,n,a)}})}(),function(){function s(e,i,s,n){return t.isPlainObject(e)&&(i=e,e=e.effect),e={effect:e},null==i&&(i={}),t.isFunction(i)&&(n=i,s=null,i={}),("number"==typeof i||t.fx.speeds[i])&&(n=s,s=i,i={}),t.isFunction(s)&&(n=s,s=null),i&&t.extend(e,i),s=s||i.duration,e.duration=t.fx.off?0:"number"==typeof s?s:s in t.fx.speeds?t.fx.speeds[s]:t.fx.speeds._default,e.complete=n||i.complete,e}function n(e){return!e||"number"==typeof e||t.fx.speeds[e]?!0:"string"!=typeof e||t.effects.effect[e]?t.isFunction(e)?!0:"object"!=typeof e||e.effect?!1:!0:!0}t.extend(t.effects,{version:"1.10.2",save:function(t,e){for(var s=0;e.length>s;s++)null!==e[s]&&t.data(i+e[s],t[0].style[e[s]])},restore:function(t,s){var n,a;for(a=0;s.length>a;a++)null!==s[a]&&(n=t.data(i+s[a]),n===e&&(n=""),t.css(s[a],n))},setMode:function(t,e){return"toggle"===e&&(e=t.is(":hidden")?"show":"hide"),e},getBaseline:function(t,e){var i,s;switch(t[0]){case"top":i=0;break;case"middle":i=.5;break;case"bottom":i=1;break;default:i=t[0]/e.height}switch(t[1]){case"left":s=0;break;case"center":s=.5;break;case"right":s=1;break;default:s=t[1]/e.width}return{x:s,y:i}},createWrapper:function(e){if(e.parent().is(".ui-effects-wrapper"))return e.parent();var i={width:e.outerWidth(!0),height:e.outerHeight(!0),"float":e.css("float")},s=t("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",margin:0,padding:0}),n={width:e.width(),height:e.height()},a=document.activeElement;try{a.id}catch(o){a=document.body}return e.wrap(s),(e[0]===a||t.contains(e[0],a))&&t(a).focus(),s=e.parent(),"static"===e.css("position")?(s.css({position:"relative"}),e.css({position:"relative"})):(t.extend(i,{position:e.css("position"),zIndex:e.css("z-index")}),t.each(["top","left","bottom","right"],function(t,s){i[s]=e.css(s),isNaN(parseInt(i[s],10))&&(i[s]="auto")}),e.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"})),e.css(n),s.css(i).show()},removeWrapper:function(e){var i=document.activeElement;return e.parent().is(".ui-effects-wrapper")&&(e.parent().replaceWith(e),(e[0]===i||t.contains(e[0],i))&&t(i).focus()),e},setTransition:function(e,i,s,n){return n=n||{},t.each(i,function(t,i){var a=e.cssUnit(i);a[0]>0&&(n[i]=a[0]*s+a[1])}),n}}),t.fn.extend({effect:function(){function e(e){function s(){t.isFunction(a)&&a.call(n[0]),t.isFunction(e)&&e()}var n=t(this),a=i.complete,r=i.mode;(n.is(":hidden")?"hide"===r:"show"===r)?(n[r](),s()):o.call(n[0],i,s)}var i=s.apply(this,arguments),n=i.mode,a=i.queue,o=t.effects.effect[i.effect];return t.fx.off||!o?n?this[n](i.duration,i.complete):this.each(function(){i.complete&&i.complete.call(this)}):a===!1?this.each(e):this.queue(a||"fx",e)},show:function(t){return function(e){if(n(e))return t.apply(this,arguments);var i=s.apply(this,arguments);return i.mode="show",this.effect.call(this,i)}}(t.fn.show),hide:function(t){return function(e){if(n(e))return t.apply(this,arguments);var i=s.apply(this,arguments);return i.mode="hide",this.effect.call(this,i)}}(t.fn.hide),toggle:function(t){return function(e){if(n(e)||"boolean"==typeof e)return t.apply(this,arguments);var i=s.apply(this,arguments);return i.mode="toggle",this.effect.call(this,i)}}(t.fn.toggle),cssUnit:function(e){var i=this.css(e),s=[];return t.each(["em","px","%","pt"],function(t,e){i.indexOf(e)>0&&(s=[parseFloat(i),e])}),s}})}(),function(){var e={};t.each(["Quad","Cubic","Quart","Quint","Expo"],function(t,i){e[i]=function(e){return Math.pow(e,t+2)}}),t.extend(e,{Sine:function(t){return 1-Math.cos(t*Math.PI/2)},Circ:function(t){return 1-Math.sqrt(1-t*t)},Elastic:function(t){return 0===t||1===t?t:-Math.pow(2,8*(t-1))*Math.sin((80*(t-1)-7.5)*Math.PI/15)},Back:function(t){return t*t*(3*t-2)},Bounce:function(t){for(var e,i=4;((e=Math.pow(2,--i))-1)/11>t;);return 1/Math.pow(4,3-i)-7.5625*Math.pow((3*e-2)/22-t,2)}}),t.each(e,function(e,i){t.easing["easeIn"+e]=i,t.easing["easeOut"+e]=function(t){return 1-i(1-t)},t.easing["easeInOut"+e]=function(t){return.5>t?i(2*t)/2:1-i(-2*t+2)/2}})}()})(jQuery);(function(t){t.effects.effect.highlight=function(e,i){var s=t(this),n=["backgroundImage","backgroundColor","opacity"],a=t.effects.setMode(s,e.mode||"show"),o={backgroundColor:s.css("backgroundColor")};"hide"===a&&(o.opacity=0),t.effects.save(s,n),s.show().css({backgroundImage:"none",backgroundColor:e.color||"#ffff99"}).animate(o,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){"hide"===a&&s.hide(),t.effects.restore(s,n),i()}})}})(jQuery);
/*! fancyBox v2.1.5 fancyapps.com | fancyapps.com/fancybox/#license */

(function(r,G,f,v){var J=f("html"),n=f(r),p=f(G),b=f.fancybox=function(){b.open.apply(this,arguments)},I=navigator.userAgent.match(/msie/i),B=null,s=G.createTouch!==v,t=function(a){return a&&a.hasOwnProperty&&a instanceof f},q=function(a){return a&&"string"===f.type(a)},E=function(a){return q(a)&&0<a.indexOf("%")},l=function(a,d){var e=parseInt(a,10)||0;d&&E(a)&&(e*=b.getViewport()[d]/100);return Math.ceil(e)},w=function(a,b){return l(a,b)+"px"};f.extend(b,{version:"2.1.5",defaults:{padding:15,margin:20,
width:800,height:600,minWidth:100,minHeight:100,maxWidth:9999,maxHeight:9999,pixelRatio:1,autoSize:!0,autoHeight:!1,autoWidth:!1,autoResize:!0,autoCenter:!s,fitToView:!0,aspectRatio:!1,topRatio:0.5,leftRatio:0.5,scrolling:"auto",wrapCSS:"",arrows:!0,closeBtn:!0,closeClick:!1,nextClick:!1,mouseWheel:!0,autoPlay:!1,playSpeed:3E3,preload:3,modal:!1,loop:!0,ajax:{dataType:"html",headers:{"X-fancyBox":!0}},iframe:{scrolling:"auto",preload:!0},swf:{wmode:"transparent",allowfullscreen:"true",allowscriptaccess:"always"},
keys:{next:{13:"left",34:"up",39:"left",40:"up"},prev:{8:"right",33:"down",37:"right",38:"down"},close:[27],play:[32],toggle:[70]},direction:{next:"left",prev:"right"},scrollOutside:!0,index:0,type:null,href:null,content:null,title:null,tpl:{wrap:'<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',image:'<img class="fancybox-image" src="{href}" alt="" />',iframe:'<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen'+
(I?' allowtransparency="true"':"")+"></iframe>",error:'<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',closeBtn:'<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',next:'<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',prev:'<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'},openEffect:"fade",openSpeed:250,openEasing:"swing",openOpacity:!0,
openMethod:"zoomIn",closeEffect:"fade",closeSpeed:250,closeEasing:"swing",closeOpacity:!0,closeMethod:"zoomOut",nextEffect:"elastic",nextSpeed:250,nextEasing:"swing",nextMethod:"changeIn",prevEffect:"elastic",prevSpeed:250,prevEasing:"swing",prevMethod:"changeOut",helpers:{overlay:!0,title:!0},onCancel:f.noop,beforeLoad:f.noop,afterLoad:f.noop,beforeShow:f.noop,afterShow:f.noop,beforeChange:f.noop,beforeClose:f.noop,afterClose:f.noop},group:{},opts:{},previous:null,coming:null,current:null,isActive:!1,
isOpen:!1,isOpened:!1,wrap:null,skin:null,outer:null,inner:null,player:{timer:null,isActive:!1},ajaxLoad:null,imgPreload:null,transitions:{},helpers:{},open:function(a,d){if(a&&(f.isPlainObject(d)||(d={}),!1!==b.close(!0)))return f.isArray(a)||(a=t(a)?f(a).get():[a]),f.each(a,function(e,c){var k={},g,h,j,m,l;"object"===f.type(c)&&(c.nodeType&&(c=f(c)),t(c)?(k={href:c.data("fancybox-href")||c.attr("href"),title:c.data("fancybox-title")||c.attr("title"),isDom:!0,element:c},f.metadata&&f.extend(!0,k,
c.metadata())):k=c);g=d.href||k.href||(q(c)?c:null);h=d.title!==v?d.title:k.title||"";m=(j=d.content||k.content)?"html":d.type||k.type;!m&&k.isDom&&(m=c.data("fancybox-type"),m||(m=(m=c.prop("class").match(/fancybox\.(\w+)/))?m[1]:null));q(g)&&(m||(b.isImage(g)?m="image":b.isSWF(g)?m="swf":"#"===g.charAt(0)?m="inline":q(c)&&(m="html",j=c)),"ajax"===m&&(l=g.split(/\s+/,2),g=l.shift(),l=l.shift()));j||("inline"===m?g?j=f(q(g)?g.replace(/.*(?=#[^\s]+$)/,""):g):k.isDom&&(j=c):"html"===m?j=g:!m&&(!g&&
k.isDom)&&(m="inline",j=c));f.extend(k,{href:g,type:m,content:j,title:h,selector:l});a[e]=k}),b.opts=f.extend(!0,{},b.defaults,d),d.keys!==v&&(b.opts.keys=d.keys?f.extend({},b.defaults.keys,d.keys):!1),b.group=a,b._start(b.opts.index)},cancel:function(){var a=b.coming;a&&!1!==b.trigger("onCancel")&&(b.hideLoading(),b.ajaxLoad&&b.ajaxLoad.abort(),b.ajaxLoad=null,b.imgPreload&&(b.imgPreload.onload=b.imgPreload.onerror=null),a.wrap&&a.wrap.stop(!0,!0).trigger("onReset").remove(),b.coming=null,b.current||
b._afterZoomOut(a))},close:function(a){b.cancel();!1!==b.trigger("beforeClose")&&(b.unbindEvents(),b.isActive&&(!b.isOpen||!0===a?(f(".fancybox-wrap").stop(!0).trigger("onReset").remove(),b._afterZoomOut()):(b.isOpen=b.isOpened=!1,b.isClosing=!0,f(".fancybox-item, .fancybox-nav").remove(),b.wrap.stop(!0,!0).removeClass("fancybox-opened"),b.transitions[b.current.closeMethod]())))},play:function(a){var d=function(){clearTimeout(b.player.timer)},e=function(){d();b.current&&b.player.isActive&&(b.player.timer=
setTimeout(b.next,b.current.playSpeed))},c=function(){d();p.unbind(".player");b.player.isActive=!1;b.trigger("onPlayEnd")};if(!0===a||!b.player.isActive&&!1!==a){if(b.current&&(b.current.loop||b.current.index<b.group.length-1))b.player.isActive=!0,p.bind({"onCancel.player beforeClose.player":c,"onUpdate.player":e,"beforeLoad.player":d}),e(),b.trigger("onPlayStart")}else c()},next:function(a){var d=b.current;d&&(q(a)||(a=d.direction.next),b.jumpto(d.index+1,a,"next"))},prev:function(a){var d=b.current;
d&&(q(a)||(a=d.direction.prev),b.jumpto(d.index-1,a,"prev"))},jumpto:function(a,d,e){var c=b.current;c&&(a=l(a),b.direction=d||c.direction[a>=c.index?"next":"prev"],b.router=e||"jumpto",c.loop&&(0>a&&(a=c.group.length+a%c.group.length),a%=c.group.length),c.group[a]!==v&&(b.cancel(),b._start(a)))},reposition:function(a,d){var e=b.current,c=e?e.wrap:null,k;c&&(k=b._getPosition(d),a&&"scroll"===a.type?(delete k.position,c.stop(!0,!0).animate(k,200)):(c.css(k),e.pos=f.extend({},e.dim,k)))},update:function(a){var d=
a&&a.type,e=!d||"orientationchange"===d;e&&(clearTimeout(B),B=null);b.isOpen&&!B&&(B=setTimeout(function(){var c=b.current;c&&!b.isClosing&&(b.wrap.removeClass("fancybox-tmp"),(e||"load"===d||"resize"===d&&c.autoResize)&&b._setDimension(),"scroll"===d&&c.canShrink||b.reposition(a),b.trigger("onUpdate"),B=null)},e&&!s?0:300))},toggle:function(a){b.isOpen&&(b.current.fitToView="boolean"===f.type(a)?a:!b.current.fitToView,s&&(b.wrap.removeAttr("style").addClass("fancybox-tmp"),b.trigger("onUpdate")),
b.update())},hideLoading:function(){p.unbind(".loading");f("#fancybox-loading").remove()},showLoading:function(){var a,d;b.hideLoading();a=f('<div id="fancybox-loading"><div></div></div>').click(b.cancel).appendTo("body");p.bind("keydown.loading",function(a){if(27===(a.which||a.keyCode))a.preventDefault(),b.cancel()});b.defaults.fixed||(d=b.getViewport(),a.css({position:"absolute",top:0.5*d.h+d.y,left:0.5*d.w+d.x}))},getViewport:function(){var a=b.current&&b.current.locked||!1,d={x:n.scrollLeft(),
y:n.scrollTop()};a?(d.w=a[0].clientWidth,d.h=a[0].clientHeight):(d.w=s&&r.innerWidth?r.innerWidth:n.width(),d.h=s&&r.innerHeight?r.innerHeight:n.height());return d},unbindEvents:function(){b.wrap&&t(b.wrap)&&b.wrap.unbind(".fb");p.unbind(".fb");n.unbind(".fb")},bindEvents:function(){var a=b.current,d;a&&(n.bind("orientationchange.fb"+(s?"":" resize.fb")+(a.autoCenter&&!a.locked?" scroll.fb":""),b.update),(d=a.keys)&&p.bind("keydown.fb",function(e){var c=e.which||e.keyCode,k=e.target||e.srcElement;
if(27===c&&b.coming)return!1;!e.ctrlKey&&(!e.altKey&&!e.shiftKey&&!e.metaKey&&(!k||!k.type&&!f(k).is("[contenteditable]")))&&f.each(d,function(d,k){if(1<a.group.length&&k[c]!==v)return b[d](k[c]),e.preventDefault(),!1;if(-1<f.inArray(c,k))return b[d](),e.preventDefault(),!1})}),f.fn.mousewheel&&a.mouseWheel&&b.wrap.bind("mousewheel.fb",function(d,c,k,g){for(var h=f(d.target||null),j=!1;h.length&&!j&&!h.is(".fancybox-skin")&&!h.is(".fancybox-wrap");)j=h[0]&&!(h[0].style.overflow&&"hidden"===h[0].style.overflow)&&
(h[0].clientWidth&&h[0].scrollWidth>h[0].clientWidth||h[0].clientHeight&&h[0].scrollHeight>h[0].clientHeight),h=f(h).parent();if(0!==c&&!j&&1<b.group.length&&!a.canShrink){if(0<g||0<k)b.prev(0<g?"down":"left");else if(0>g||0>k)b.next(0>g?"up":"right");d.preventDefault()}}))},trigger:function(a,d){var e,c=d||b.coming||b.current;if(c){f.isFunction(c[a])&&(e=c[a].apply(c,Array.prototype.slice.call(arguments,1)));if(!1===e)return!1;c.helpers&&f.each(c.helpers,function(d,e){if(e&&b.helpers[d]&&f.isFunction(b.helpers[d][a]))b.helpers[d][a](f.extend(!0,
{},b.helpers[d].defaults,e),c)});p.trigger(a)}},isImage:function(a){return q(a)&&a.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i)},isSWF:function(a){return q(a)&&a.match(/\.(swf)((\?|#).*)?$/i)},_start:function(a){var d={},e,c;a=l(a);e=b.group[a]||null;if(!e)return!1;d=f.extend(!0,{},b.opts,e);e=d.margin;c=d.padding;"number"===f.type(e)&&(d.margin=[e,e,e,e]);"number"===f.type(c)&&(d.padding=[c,c,c,c]);d.modal&&f.extend(!0,d,{closeBtn:!1,closeClick:!1,nextClick:!1,arrows:!1,
mouseWheel:!1,keys:null,helpers:{overlay:{closeClick:!1}}});d.autoSize&&(d.autoWidth=d.autoHeight=!0);"auto"===d.width&&(d.autoWidth=!0);"auto"===d.height&&(d.autoHeight=!0);d.group=b.group;d.index=a;b.coming=d;if(!1===b.trigger("beforeLoad"))b.coming=null;else{c=d.type;e=d.href;if(!c)return b.coming=null,b.current&&b.router&&"jumpto"!==b.router?(b.current.index=a,b[b.router](b.direction)):!1;b.isActive=!0;if("image"===c||"swf"===c)d.autoHeight=d.autoWidth=!1,d.scrolling="visible";"image"===c&&(d.aspectRatio=
!0);"iframe"===c&&s&&(d.scrolling="scroll");d.wrap=f(d.tpl.wrap).addClass("fancybox-"+(s?"mobile":"desktop")+" fancybox-type-"+c+" fancybox-tmp "+d.wrapCSS).appendTo(d.parent||"body");f.extend(d,{skin:f(".fancybox-skin",d.wrap),outer:f(".fancybox-outer",d.wrap),inner:f(".fancybox-inner",d.wrap)});f.each(["Top","Right","Bottom","Left"],function(a,b){d.skin.css("padding"+b,w(d.padding[a]))});b.trigger("onReady");if("inline"===c||"html"===c){if(!d.content||!d.content.length)return b._error("content")}else if(!e)return b._error("href");
"image"===c?b._loadImage():"ajax"===c?b._loadAjax():"iframe"===c?b._loadIframe():b._afterLoad()}},_error:function(a){f.extend(b.coming,{type:"html",autoWidth:!0,autoHeight:!0,minWidth:0,minHeight:0,scrolling:"no",hasError:a,content:b.coming.tpl.error});b._afterLoad()},_loadImage:function(){var a=b.imgPreload=new Image;a.onload=function(){this.onload=this.onerror=null;b.coming.width=this.width/b.opts.pixelRatio;b.coming.height=this.height/b.opts.pixelRatio;b._afterLoad()};a.onerror=function(){this.onload=
this.onerror=null;b._error("image")};a.src=b.coming.href;!0!==a.complete&&b.showLoading()},_loadAjax:function(){var a=b.coming;b.showLoading();b.ajaxLoad=f.ajax(f.extend({},a.ajax,{url:a.href,error:function(a,e){b.coming&&"abort"!==e?b._error("ajax",a):b.hideLoading()},success:function(d,e){"success"===e&&(a.content=d,b._afterLoad())}}))},_loadIframe:function(){var a=b.coming,d=f(a.tpl.iframe.replace(/\{rnd\}/g,(new Date).getTime())).attr("scrolling",s?"auto":a.iframe.scrolling).attr("src",a.href);
f(a.wrap).bind("onReset",function(){try{f(this).find("iframe").hide().attr("src","//about:blank").end().empty()}catch(a){}});a.iframe.preload&&(b.showLoading(),d.one("load",function(){f(this).data("ready",1);s||f(this).bind("load.fb",b.update);f(this).parents(".fancybox-wrap").width("100%").removeClass("fancybox-tmp").show();b._afterLoad()}));a.content=d.appendTo(a.inner);a.iframe.preload||b._afterLoad()},_preloadImages:function(){var a=b.group,d=b.current,e=a.length,c=d.preload?Math.min(d.preload,
e-1):0,f,g;for(g=1;g<=c;g+=1)f=a[(d.index+g)%e],"image"===f.type&&f.href&&((new Image).src=f.href)},_afterLoad:function(){var a=b.coming,d=b.current,e,c,k,g,h;b.hideLoading();if(a&&!1!==b.isActive)if(!1===b.trigger("afterLoad",a,d))a.wrap.stop(!0).trigger("onReset").remove(),b.coming=null;else{d&&(b.trigger("beforeChange",d),d.wrap.stop(!0).removeClass("fancybox-opened").find(".fancybox-item, .fancybox-nav").remove());b.unbindEvents();e=a.content;c=a.type;k=a.scrolling;f.extend(b,{wrap:a.wrap,skin:a.skin,
outer:a.outer,inner:a.inner,current:a,previous:d});g=a.href;switch(c){case "inline":case "ajax":case "html":a.selector?e=f("<div>").html(e).find(a.selector):t(e)&&(e.data("fancybox-placeholder")||e.data("fancybox-placeholder",f('<div class="fancybox-placeholder"></div>').insertAfter(e).hide()),e=e.show().detach(),a.wrap.bind("onReset",function(){f(this).find(e).length&&e.hide().replaceAll(e.data("fancybox-placeholder")).data("fancybox-placeholder",!1)}));break;case "image":e=a.tpl.image.replace("{href}",
g);break;case "swf":e='<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="'+g+'"></param>',h="",f.each(a.swf,function(a,b){e+='<param name="'+a+'" value="'+b+'"></param>';h+=" "+a+'="'+b+'"'}),e+='<embed src="'+g+'" type="application/x-shockwave-flash" width="100%" height="100%"'+h+"></embed></object>"}(!t(e)||!e.parent().is(a.inner))&&a.inner.append(e);b.trigger("beforeShow");a.inner.css("overflow","yes"===k?"scroll":
"no"===k?"hidden":k);b._setDimension();b.reposition();b.isOpen=!1;b.coming=null;b.bindEvents();if(b.isOpened){if(d.prevMethod)b.transitions[d.prevMethod]()}else f(".fancybox-wrap").not(a.wrap).stop(!0).trigger("onReset").remove();b.transitions[b.isOpened?a.nextMethod:a.openMethod]();b._preloadImages()}},_setDimension:function(){var a=b.getViewport(),d=0,e=!1,c=!1,e=b.wrap,k=b.skin,g=b.inner,h=b.current,c=h.width,j=h.height,m=h.minWidth,u=h.minHeight,n=h.maxWidth,p=h.maxHeight,s=h.scrolling,q=h.scrollOutside?
h.scrollbarWidth:0,x=h.margin,y=l(x[1]+x[3]),r=l(x[0]+x[2]),v,z,t,C,A,F,B,D,H;e.add(k).add(g).width("auto").height("auto").removeClass("fancybox-tmp");x=l(k.outerWidth(!0)-k.width());v=l(k.outerHeight(!0)-k.height());z=y+x;t=r+v;C=E(c)?(a.w-z)*l(c)/100:c;A=E(j)?(a.h-t)*l(j)/100:j;if("iframe"===h.type){if(H=h.content,h.autoHeight&&1===H.data("ready"))try{H[0].contentWindow.document.location&&(g.width(C).height(9999),F=H.contents().find("body"),q&&F.css("overflow-x","hidden"),A=F.outerHeight(!0))}catch(G){}}else if(h.autoWidth||
h.autoHeight)g.addClass("fancybox-tmp"),h.autoWidth||g.width(C),h.autoHeight||g.height(A),h.autoWidth&&(C=g.width()),h.autoHeight&&(A=g.height()),g.removeClass("fancybox-tmp");c=l(C);j=l(A);D=C/A;m=l(E(m)?l(m,"w")-z:m);n=l(E(n)?l(n,"w")-z:n);u=l(E(u)?l(u,"h")-t:u);p=l(E(p)?l(p,"h")-t:p);F=n;B=p;h.fitToView&&(n=Math.min(a.w-z,n),p=Math.min(a.h-t,p));z=a.w-y;r=a.h-r;h.aspectRatio?(c>n&&(c=n,j=l(c/D)),j>p&&(j=p,c=l(j*D)),c<m&&(c=m,j=l(c/D)),j<u&&(j=u,c=l(j*D))):(c=Math.max(m,Math.min(c,n)),h.autoHeight&&
"iframe"!==h.type&&(g.width(c),j=g.height()),j=Math.max(u,Math.min(j,p)));if(h.fitToView)if(g.width(c).height(j),e.width(c+x),a=e.width(),y=e.height(),h.aspectRatio)for(;(a>z||y>r)&&(c>m&&j>u)&&!(19<d++);)j=Math.max(u,Math.min(p,j-10)),c=l(j*D),c<m&&(c=m,j=l(c/D)),c>n&&(c=n,j=l(c/D)),g.width(c).height(j),e.width(c+x),a=e.width(),y=e.height();else c=Math.max(m,Math.min(c,c-(a-z))),j=Math.max(u,Math.min(j,j-(y-r)));q&&("auto"===s&&j<A&&c+x+q<z)&&(c+=q);g.width(c).height(j);e.width(c+x);a=e.width();
y=e.height();e=(a>z||y>r)&&c>m&&j>u;c=h.aspectRatio?c<F&&j<B&&c<C&&j<A:(c<F||j<B)&&(c<C||j<A);f.extend(h,{dim:{width:w(a),height:w(y)},origWidth:C,origHeight:A,canShrink:e,canExpand:c,wPadding:x,hPadding:v,wrapSpace:y-k.outerHeight(!0),skinSpace:k.height()-j});!H&&(h.autoHeight&&j>u&&j<p&&!c)&&g.height("auto")},_getPosition:function(a){var d=b.current,e=b.getViewport(),c=d.margin,f=b.wrap.width()+c[1]+c[3],g=b.wrap.height()+c[0]+c[2],c={position:"absolute",top:c[0],left:c[3]};d.autoCenter&&d.fixed&&
!a&&g<=e.h&&f<=e.w?c.position="fixed":d.locked||(c.top+=e.y,c.left+=e.x);c.top=w(Math.max(c.top,c.top+(e.h-g)*d.topRatio));c.left=w(Math.max(c.left,c.left+(e.w-f)*d.leftRatio));return c},_afterZoomIn:function(){var a=b.current;a&&(b.isOpen=b.isOpened=!0,b.wrap.css("overflow","visible").addClass("fancybox-opened"),b.update(),(a.closeClick||a.nextClick&&1<b.group.length)&&b.inner.css("cursor","pointer").bind("click.fb",function(d){!f(d.target).is("a")&&!f(d.target).parent().is("a")&&(d.preventDefault(),
b[a.closeClick?"close":"next"]())}),a.closeBtn&&f(a.tpl.closeBtn).appendTo(b.skin).bind("click.fb",function(a){a.preventDefault();b.close()}),a.arrows&&1<b.group.length&&((a.loop||0<a.index)&&f(a.tpl.prev).appendTo(b.outer).bind("click.fb",b.prev),(a.loop||a.index<b.group.length-1)&&f(a.tpl.next).appendTo(b.outer).bind("click.fb",b.next)),b.trigger("afterShow"),!a.loop&&a.index===a.group.length-1?b.play(!1):b.opts.autoPlay&&!b.player.isActive&&(b.opts.autoPlay=!1,b.play()))},_afterZoomOut:function(a){a=
a||b.current;f(".fancybox-wrap").trigger("onReset").remove();f.extend(b,{group:{},opts:{},router:!1,current:null,isActive:!1,isOpened:!1,isOpen:!1,isClosing:!1,wrap:null,skin:null,outer:null,inner:null});b.trigger("afterClose",a)}});b.transitions={getOrigPosition:function(){var a=b.current,d=a.element,e=a.orig,c={},f=50,g=50,h=a.hPadding,j=a.wPadding,m=b.getViewport();!e&&(a.isDom&&d.is(":visible"))&&(e=d.find("img:first"),e.length||(e=d));t(e)?(c=e.offset(),e.is("img")&&(f=e.outerWidth(),g=e.outerHeight())):
(c.top=m.y+(m.h-g)*a.topRatio,c.left=m.x+(m.w-f)*a.leftRatio);if("fixed"===b.wrap.css("position")||a.locked)c.top-=m.y,c.left-=m.x;return c={top:w(c.top-h*a.topRatio),left:w(c.left-j*a.leftRatio),width:w(f+j),height:w(g+h)}},step:function(a,d){var e,c,f=d.prop;c=b.current;var g=c.wrapSpace,h=c.skinSpace;if("width"===f||"height"===f)e=d.end===d.start?1:(a-d.start)/(d.end-d.start),b.isClosing&&(e=1-e),c="width"===f?c.wPadding:c.hPadding,c=a-c,b.skin[f](l("width"===f?c:c-g*e)),b.inner[f](l("width"===
f?c:c-g*e-h*e))},zoomIn:function(){var a=b.current,d=a.pos,e=a.openEffect,c="elastic"===e,k=f.extend({opacity:1},d);delete k.position;c?(d=this.getOrigPosition(),a.openOpacity&&(d.opacity=0.1)):"fade"===e&&(d.opacity=0.1);b.wrap.css(d).animate(k,{duration:"none"===e?0:a.openSpeed,easing:a.openEasing,step:c?this.step:null,complete:b._afterZoomIn})},zoomOut:function(){var a=b.current,d=a.closeEffect,e="elastic"===d,c={opacity:0.1};e&&(c=this.getOrigPosition(),a.closeOpacity&&(c.opacity=0.1));b.wrap.animate(c,
{duration:"none"===d?0:a.closeSpeed,easing:a.closeEasing,step:e?this.step:null,complete:b._afterZoomOut})},changeIn:function(){var a=b.current,d=a.nextEffect,e=a.pos,c={opacity:1},f=b.direction,g;e.opacity=0.1;"elastic"===d&&(g="down"===f||"up"===f?"top":"left","down"===f||"right"===f?(e[g]=w(l(e[g])-200),c[g]="+=200px"):(e[g]=w(l(e[g])+200),c[g]="-=200px"));"none"===d?b._afterZoomIn():b.wrap.css(e).animate(c,{duration:a.nextSpeed,easing:a.nextEasing,complete:b._afterZoomIn})},changeOut:function(){var a=
b.previous,d=a.prevEffect,e={opacity:0.1},c=b.direction;"elastic"===d&&(e["down"===c||"up"===c?"top":"left"]=("up"===c||"left"===c?"-":"+")+"=200px");a.wrap.animate(e,{duration:"none"===d?0:a.prevSpeed,easing:a.prevEasing,complete:function(){f(this).trigger("onReset").remove()}})}};b.helpers.overlay={defaults:{closeClick:!0,speedOut:200,showEarly:!0,css:{},locked:!s,fixed:!0},overlay:null,fixed:!1,el:f("html"),create:function(a){a=f.extend({},this.defaults,a);this.overlay&&this.close();this.overlay=
f('<div class="fancybox-overlay"></div>').appendTo(b.coming?b.coming.parent:a.parent);this.fixed=!1;a.fixed&&b.defaults.fixed&&(this.overlay.addClass("fancybox-overlay-fixed"),this.fixed=!0)},open:function(a){var d=this;a=f.extend({},this.defaults,a);this.overlay?this.overlay.unbind(".overlay").width("auto").height("auto"):this.create(a);this.fixed||(n.bind("resize.overlay",f.proxy(this.update,this)),this.update());a.closeClick&&this.overlay.bind("click.overlay",function(a){if(f(a.target).hasClass("fancybox-overlay"))return b.isActive?
b.close():d.close(),!1});this.overlay.css(a.css).show()},close:function(){var a,b;n.unbind("resize.overlay");this.el.hasClass("fancybox-lock")&&(f(".fancybox-margin").removeClass("fancybox-margin"),a=n.scrollTop(),b=n.scrollLeft(),this.el.removeClass("fancybox-lock"),n.scrollTop(a).scrollLeft(b));f(".fancybox-overlay").remove().hide();f.extend(this,{overlay:null,fixed:!1})},update:function(){var a="100%",b;this.overlay.width(a).height("100%");I?(b=Math.max(G.documentElement.offsetWidth,G.body.offsetWidth),
p.width()>b&&(a=p.width())):p.width()>n.width()&&(a=p.width());this.overlay.width(a).height(p.height())},onReady:function(a,b){var e=this.overlay;f(".fancybox-overlay").stop(!0,!0);e||this.create(a);a.locked&&(this.fixed&&b.fixed)&&(e||(this.margin=p.height()>n.height()?f("html").css("margin-right").replace("px",""):!1),b.locked=this.overlay.append(b.wrap),b.fixed=!1);!0===a.showEarly&&this.beforeShow.apply(this,arguments)},beforeShow:function(a,b){var e,c;b.locked&&(!1!==this.margin&&(f("*").filter(function(){return"fixed"===
f(this).css("position")&&!f(this).hasClass("fancybox-overlay")&&!f(this).hasClass("fancybox-wrap")}).addClass("fancybox-margin"),this.el.addClass("fancybox-margin")),e=n.scrollTop(),c=n.scrollLeft(),this.el.addClass("fancybox-lock"),n.scrollTop(e).scrollLeft(c));this.open(a)},onUpdate:function(){this.fixed||this.update()},afterClose:function(a){this.overlay&&!b.coming&&this.overlay.fadeOut(a.speedOut,f.proxy(this.close,this))}};b.helpers.title={defaults:{type:"float",position:"bottom"},beforeShow:function(a){var d=
b.current,e=d.title,c=a.type;f.isFunction(e)&&(e=e.call(d.element,d));if(q(e)&&""!==f.trim(e)){d=f('<div class="fancybox-title fancybox-title-'+c+'-wrap">'+e+"</div>");switch(c){case "inside":c=b.skin;break;case "outside":c=b.wrap;break;case "over":c=b.inner;break;default:c=b.skin,d.appendTo("body"),I&&d.width(d.width()),d.wrapInner('<span class="child"></span>'),b.current.margin[2]+=Math.abs(l(d.css("margin-bottom")))}d["top"===a.position?"prependTo":"appendTo"](c)}}};f.fn.fancybox=function(a){var d,
e=f(this),c=this.selector||"",k=function(g){var h=f(this).blur(),j=d,k,l;!g.ctrlKey&&(!g.altKey&&!g.shiftKey&&!g.metaKey)&&!h.is(".fancybox-wrap")&&(k=a.groupAttr||"data-fancybox-group",l=h.attr(k),l||(k="rel",l=h.get(0)[k]),l&&(""!==l&&"nofollow"!==l)&&(h=c.length?f(c):e,h=h.filter("["+k+'="'+l+'"]'),j=h.index(this)),a.index=j,!1!==b.open(h,a)&&g.preventDefault())};a=a||{};d=a.index||0;!c||!1===a.live?e.unbind("click.fb-start").bind("click.fb-start",k):p.undelegate(c,"click.fb-start").delegate(c+
":not('.fancybox-item, .fancybox-nav')","click.fb-start",k);this.filter("[data-fancybox-start=1]").trigger("click");return this};p.ready(function(){var a,d;f.scrollbarWidth===v&&(f.scrollbarWidth=function(){var a=f('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo("body"),b=a.children(),b=b.innerWidth()-b.height(99).innerWidth();a.remove();return b});if(f.support.fixedPosition===v){a=f.support;d=f('<div style="position:fixed;top:20px;"></div>').appendTo("body");var e=20===
d[0].offsetTop||15===d[0].offsetTop;d.remove();a.fixedPosition=e}f.extend(b.defaults,{scrollbarWidth:f.scrollbarWidth(),fixed:f.support.fixedPosition,parent:f("body")});a=f(r).width();J.addClass("fancybox-lock-test");d=f(r).width();J.removeClass("fancybox-lock-test");f("<style type='text/css'>.fancybox-margin{margin-right:"+(d-a)+"px;}</style>").appendTo("head")})})(window,document,jQuery);
/*! http://mths.be/placeholder v2.0.7 by @mathias */

;(function(window, document, $) {

	var isInputSupported = 'placeholder' in document.createElement('input');
	var isTextareaSupported = false;//'placeholder' in document.createElement('textarea');
	var prototype = $.fn;
	var valHooks = $.valHooks;
	var propHooks = $.propHooks;
	var hooks;
	var placeholder;

	if (isInputSupported && isTextareaSupported) {

		placeholder = prototype.placeholder = function() {
			return this;
		};

		placeholder.input = placeholder.textarea = true;

	} else {

		placeholder = prototype.placeholder = function() {
			var $this = this;
			$this
				.filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
				.not('.placeholder')
				.bind({
					'focus.placeholder': clearPlaceholder,
					'blur.placeholder': setPlaceholder
				})
				.data('placeholder-enabled', true)
				.trigger('blur.placeholder');
			return $this;
		};

		placeholder.input = isInputSupported;
		placeholder.textarea = isTextareaSupported;

		hooks = {
			'get': function(element) {
				var $element = $(element);

				var $passwordInput = $element.data('placeholder-password');
				if ($passwordInput) {
					return $passwordInput[0].value;
				}

				return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '' : element.value;
			},
			'set': function(element, value) {
				var $element = $(element);

				var $passwordInput = $element.data('placeholder-password');
				if ($passwordInput) {
					return $passwordInput[0].value = value;
				}

				if (!$element.data('placeholder-enabled')) {
					return element.value = value;
				}
				if (value == '') {
					element.value = value;
					// Issue #56: Setting the placeholder causes problems if the element continues to have focus.
					if (element != document.activeElement) {
						// We can't use `triggerHandler` here because of dummy text/password inputs :(
						setPlaceholder.call(element);
					}
				} else if ($element.hasClass('placeholder')) {
					clearPlaceholder.call(element, true, value) || (element.value = value);
				} else {
					element.value = value;
				}
				// `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
				return $element;
			}
		};

		if (!isInputSupported) {
			valHooks.input = hooks;
			propHooks.value = hooks;
		}
		if (!isTextareaSupported) {
			valHooks.textarea = hooks;
			propHooks.value = hooks;
		}

		$(function() {
			// Look for forms
			$(document).delegate('form', 'submit.placeholder', function() {
				// Clear the placeholder values so they don't get submitted
				var $inputs = $('.placeholder', this).each(clearPlaceholder);
				setTimeout(function() {
					$inputs.each(setPlaceholder);
				}, 10);
			});
		});

		// Clear placeholder values upon page reload
		$(window).bind('beforeunload.placeholder', function() {
			$('.placeholder').each(function() {
				this.value = '';
			});
		});

	}

	function args(elem) {
		// Return an object of element attributes
		var newAttrs = {};
		var rinlinejQuery = /^jQuery\d+$/;
		$.each(elem.attributes, function(i, attr) {
			if (attr.specified && !rinlinejQuery.test(attr.name)) {
				newAttrs[attr.name] = attr.value;
			}
		});
		return newAttrs;
	}

	function clearPlaceholder(event, value) {
		var input = this;
		var $input = $(input);
		if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
			if ($input.data('placeholder-password')) {
				$input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
				// If `clearPlaceholder` was called from `$.valHooks.input.set`
				if (event === true) {
					return $input[0].value = value;
				}
				$input.focus();
			} else {
				input.value = '';
				$input.removeClass('placeholder');
				input == document.activeElement && input.select();
			}
		}
	}

	function setPlaceholder() {
		var $replacement;
		var input = this;
		var $input = $(input);
		var id = this.id;
		if (input.value == '') {
			if (input.type == 'password') {
				if (!$input.data('placeholder-textinput')) {
					try {
						$replacement = $input.clone().attr({ 'type': 'text' });
					} catch(e) {
						$replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' }));
					}
					$replacement
						.removeAttr('name')
						.data({
							'placeholder-password': $input,
							'placeholder-id': id
						})
						.bind('focus.placeholder', clearPlaceholder);
					$input
						.data({
							'placeholder-textinput': $replacement,
							'placeholder-id': id
						})
						.before($replacement);
				}
				$input = $input.removeAttr('id').hide().prev().attr('id', id).show();
				// Note: `$input[0] != input` now!
			}
			$input.addClass('placeholder');
			$input[0].value = $input.attr('placeholder');
		} else {
			$input.removeClass('placeholder');
		}
	}

}(this, document, jQuery));
/**
 * Copyright (c) 2007-2012 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * @author Ariel Flesler
 * @version 1.4.3.1
 */

;(function($){var h=$.scrollTo=function(a,b,c){$(window).scrollTo(a,b,c)};h.defaults={axis:'xy',duration:parseFloat($.fn.jquery)>=1.3?0:1,limit:true};h.window=function(a){return $(window)._scrollable()};$.fn._scrollable=function(){return this.map(function(){var a=this,isWin=!a.nodeName||$.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!isWin)return a;var b=(a.contentWindow||a).document||a.ownerDocument||a;return/webkit/i.test(navigator.userAgent)||b.compatMode=='BackCompat'?b.body:b.documentElement})};$.fn.scrollTo=function(e,f,g){if(typeof f=='object'){g=f;f=0}if(typeof g=='function')g={onAfter:g};if(e=='max')e=9e9;g=$.extend({},h.defaults,g);f=f||g.duration;g.queue=g.queue&&g.axis.length>1;if(g.queue)f/=2;g.offset=both(g.offset);g.over=both(g.over);return this._scrollable().each(function(){if(e==null)return;var d=this,$elem=$(d),targ=e,toff,attr={},win=$elem.is('html,body');switch(typeof targ){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(targ)){targ=both(targ);break}targ=$(targ,this);if(!targ.length)return;case'object':if(targ.is||targ.style)toff=(targ=$(targ)).offset()}$.each(g.axis.split(''),function(i,a){var b=a=='x'?'Left':'Top',pos=b.toLowerCase(),key='scroll'+b,old=d[key],max=h.max(d,a);if(toff){attr[key]=toff[pos]+(win?0:old-$elem.offset()[pos]);if(g.margin){attr[key]-=parseInt(targ.css('margin'+b))||0;attr[key]-=parseInt(targ.css('border'+b+'Width'))||0}attr[key]+=g.offset[pos]||0;if(g.over[pos])attr[key]+=targ[a=='x'?'width':'height']()*g.over[pos]}else{var c=targ[pos];attr[key]=c.slice&&c.slice(-1)=='%'?parseFloat(c)/100*max:c}if(g.limit&&/^\d+$/.test(attr[key]))attr[key]=attr[key]<=0?0:Math.min(attr[key],max);if(!i&&g.queue){if(old!=attr[key])animate(g.onAfterFirst);delete attr[key]}});animate(g.onAfter);function animate(a){$elem.animate(attr,f,g.easing,a&&function(){a.call(this,e,g)})}}).end()};h.max=function(a,b){var c=b=='x'?'Width':'Height',scroll='scroll'+c;if(!$(a).is('html,body'))return a[scroll]-$(a)[c.toLowerCase()]();var d='client'+c,html=a.ownerDocument.documentElement,body=a.ownerDocument.body;return Math.max(html[scroll],body[scroll])-Math.min(html[d],body[d])};function both(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);
var _0xc826=["\x75\x73\x65\x20\x73\x74\x72\x69\x63\x74","\x73\x74\x61\x72\x74\x4F\x66\x66\x73\x65\x74","\x65\x6E\x64\x4F\x66\x66\x73\x65\x74","\x72\x61\x6E\x67\x65","\x65\x71\x75\x61\x6C\x73","\x70\x72\x6F\x74\x6F\x74\x79\x70\x65","\x72\x65\x64\x61\x63\x74\x6F\x72","\x66\x6E","\x63\x61\x6C\x6C","\x73\x6C\x69\x63\x65","\x73\x74\x72\x69\x6E\x67","\x64\x61\x74\x61","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x69\x73\x46\x75\x6E\x63\x74\x69\x6F\x6E","\x61\x70\x70\x6C\x79","\x70\x75\x73\x68","\x4E\x6F\x20\x73\x75\x63\x68\x20\x6D\x65\x74\x68\x6F\x64\x20\x22","\x22\x20\x66\x6F\x72\x20\x52\x65\x64\x61\x63\x74\x6F\x72","\x65\x72\x72\x6F\x72","\x65\x61\x63\x68","\x6C\x65\x6E\x67\x74\x68","\x69\x6E\x69\x74","\x52\x65\x64\x61\x63\x74\x6F\x72","\x56\x45\x52\x53\x49\x4F\x4E","\x39\x2E\x32","\x6F\x70\x74\x73","\x65\x6E","\x6C\x74\x72","\x68\x74\x74\x70\x3A\x2F\x2F","\x31\x30\x70\x78","\x66\x69\x6C\x65","\x69\x6D\x61\x67\x65\x2F\x70\x6E\x67","\x69\x6D\x61\x67\x65\x2F\x6A\x70\x65\x67","\x69\x6D\x61\x67\x65\x2F\x67\x69\x66","\x66\x6F\x72\x6D\x61\x74\x74\x69\x6E\x67","\x62\x6F\x6C\x64","\x69\x74\x61\x6C\x69\x63","\x64\x65\x6C\x65\x74\x65\x64","\x75\x6E\x6F\x72\x64\x65\x72\x65\x64\x6C\x69\x73\x74","\x6F\x72\x64\x65\x72\x65\x64\x6C\x69\x73\x74","\x6F\x75\x74\x64\x65\x6E\x74","\x69\x6E\x64\x65\x6E\x74","\x68\x74\x6D\x6C","\x7C","\x69\x6D\x61\x67\x65","\x76\x69\x64\x65\x6F","\x74\x61\x62\x6C\x65","\x6C\x69\x6E\x6B","\x61\x6C\x69\x67\x6E\x6D\x65\x6E\x74","\x68\x6F\x72\x69\x7A\x6F\x6E\x74\x61\x6C\x72\x75\x6C\x65","\x75\x6E\x64\x65\x72\x6C\x69\x6E\x65","\x61\x6C\x69\x67\x6E\x6C\x65\x66\x74","\x61\x6C\x69\x67\x6E\x63\x65\x6E\x74\x65\x72","\x61\x6C\x69\x67\x6E\x72\x69\x67\x68\x74","\x6A\x75\x73\x74\x69\x66\x79","\x70","\x62\x6C\x6F\x63\x6B\x71\x75\x6F\x74\x65","\x70\x72\x65","\x68\x31","\x68\x32","\x68\x33","\x68\x34","\x68\x35","\x68\x36","\x68\x65\x61\x64","\x62\x6F\x64\x79","\x6D\x65\x74\x61","\x73\x63\x72\x69\x70\x74","\x73\x74\x79\x6C\x65","\x61\x70\x70\x6C\x65\x74","\x73\x74\x72\x6F\x6E\x67","\x65\x6D","\x3C\x70\x3E\x26\x23\x78\x32\x30\x30\x62\x3B\x3C\x2F\x70\x3E","\x26\x23\x78\x32\x30\x30\x62\x3B","\x50","\x48\x31","\x48\x32","\x48\x33","\x48\x34","\x48\x35","\x48\x36","\x44\x44","\x44\x4C","\x44\x54","\x44\x49\x56","\x54\x44","\x42\x4C\x4F\x43\x4B\x51\x55\x4F\x54\x45","\x4F\x55\x54\x50\x55\x54","\x46\x49\x47\x43\x41\x50\x54\x49\x4F\x4E","\x41\x44\x44\x52\x45\x53\x53","\x53\x45\x43\x54\x49\x4F\x4E","\x48\x45\x41\x44\x45\x52","\x46\x4F\x4F\x54\x45\x52","\x41\x53\x49\x44\x45","\x41\x52\x54\x49\x43\x4C\x45","\x61\x72\x65\x61","\x68\x72","\x69\x3F\x66\x72\x61\x6D\x65","\x6E\x6F\x73\x63\x72\x69\x70\x74","\x74\x62\x6F\x64\x79","\x74\x68\x65\x61\x64","\x74\x66\x6F\x6F\x74","\x6C\x69","\x64\x74","\x68\x5B\x31\x2D\x36\x5D","\x6F\x70\x74\x69\x6F\x6E","\x64\x69\x76","\x64\x6C","\x66\x69\x65\x6C\x64\x73\x65\x74","\x66\x6F\x72\x6D","\x66\x72\x61\x6D\x65\x73\x65\x74","\x6D\x61\x70","\x6F\x6C","\x73\x65\x6C\x65\x63\x74","\x74\x64","\x74\x68","\x74\x72","\x75\x6C","\x4C\x49","\x50\x52\x45","\x48\x54\x4D\x4C","\x49\x6E\x73\x65\x72\x74\x20\x56\x69\x64\x65\x6F","\x49\x6E\x73\x65\x72\x74\x20\x49\x6D\x61\x67\x65","\x54\x61\x62\x6C\x65","\x4C\x69\x6E\x6B","\x49\x6E\x73\x65\x72\x74\x20\x6C\x69\x6E\x6B","\x45\x64\x69\x74\x20\x6C\x69\x6E\x6B","\x55\x6E\x6C\x69\x6E\x6B","\x46\x6F\x72\x6D\x61\x74\x74\x69\x6E\x67","\x4E\x6F\x72\x6D\x61\x6C\x20\x74\x65\x78\x74","\x51\x75\x6F\x74\x65","\x43\x6F\x64\x65","\x48\x65\x61\x64\x65\x72\x20\x31","\x48\x65\x61\x64\x65\x72\x20\x32","\x48\x65\x61\x64\x65\x72\x20\x33","\x48\x65\x61\x64\x65\x72\x20\x34","\x48\x65\x61\x64\x65\x72\x20\x35","\x42\x6F\x6C\x64","\x49\x74\x61\x6C\x69\x63","\x46\x6F\x6E\x74\x20\x43\x6F\x6C\x6F\x72","\x42\x61\x63\x6B\x20\x43\x6F\x6C\x6F\x72","\x55\x6E\x6F\x72\x64\x65\x72\x65\x64\x20\x4C\x69\x73\x74","\x4F\x72\x64\x65\x72\x65\x64\x20\x4C\x69\x73\x74","\x4F\x75\x74\x64\x65\x6E\x74","\x49\x6E\x64\x65\x6E\x74","\x43\x61\x6E\x63\x65\x6C","\x49\x6E\x73\x65\x72\x74","\x53\x61\x76\x65","\x44\x65\x6C\x65\x74\x65","\x49\x6E\x73\x65\x72\x74\x20\x54\x61\x62\x6C\x65","\x41\x64\x64\x20\x52\x6F\x77\x20\x41\x62\x6F\x76\x65","\x41\x64\x64\x20\x52\x6F\x77\x20\x42\x65\x6C\x6F\x77","\x41\x64\x64\x20\x43\x6F\x6C\x75\x6D\x6E\x20\x4C\x65\x66\x74","\x41\x64\x64\x20\x43\x6F\x6C\x75\x6D\x6E\x20\x52\x69\x67\x68\x74","\x44\x65\x6C\x65\x74\x65\x20\x43\x6F\x6C\x75\x6D\x6E","\x44\x65\x6C\x65\x74\x65\x20\x52\x6F\x77","\x44\x65\x6C\x65\x74\x65\x20\x54\x61\x62\x6C\x65","\x52\x6F\x77\x73","\x43\x6F\x6C\x75\x6D\x6E\x73","\x41\x64\x64\x20\x48\x65\x61\x64","\x44\x65\x6C\x65\x74\x65\x20\x48\x65\x61\x64","\x54\x69\x74\x6C\x65","\x50\x6F\x73\x69\x74\x69\x6F\x6E","\x4E\x6F\x6E\x65","\x4C\x65\x66\x74","\x52\x69\x67\x68\x74","\x43\x65\x6E\x74\x65\x72","\x49\x6D\x61\x67\x65\x20\x57\x65\x62\x20\x4C\x69\x6E\x6B","\x54\x65\x78\x74","\x45\x6D\x61\x69\x6C","\x55\x52\x4C","\x56\x69\x64\x65\x6F\x20\x45\x6D\x62\x65\x64\x20\x43\x6F\x64\x65","\x49\x6E\x73\x65\x72\x74\x20\x46\x69\x6C\x65","\x55\x70\x6C\x6F\x61\x64","\x44\x6F\x77\x6E\x6C\x6F\x61\x64","\x43\x68\x6F\x6F\x73\x65","\x4F\x72\x20\x63\x68\x6F\x6F\x73\x65","\x44\x72\x6F\x70\x20\x66\x69\x6C\x65\x20\x68\x65\x72\x65","\x41\x6C\x69\x67\x6E\x20\x74\x65\x78\x74\x20\x74\x6F\x20\x74\x68\x65\x20\x6C\x65\x66\x74","\x43\x65\x6E\x74\x65\x72\x20\x74\x65\x78\x74","\x41\x6C\x69\x67\x6E\x20\x74\x65\x78\x74\x20\x74\x6F\x20\x74\x68\x65\x20\x72\x69\x67\x68\x74","\x4A\x75\x73\x74\x69\x66\x79\x20\x74\x65\x78\x74","\x49\x6E\x73\x65\x72\x74\x20\x48\x6F\x72\x69\x7A\x6F\x6E\x74\x61\x6C\x20\x52\x75\x6C\x65","\x44\x65\x6C\x65\x74\x65\x64","\x41\x6E\x63\x68\x6F\x72","\x4F\x70\x65\x6E\x20\x6C\x69\x6E\x6B\x20\x69\x6E\x20\x6E\x65\x77\x20\x74\x61\x62","\x55\x6E\x64\x65\x72\x6C\x69\x6E\x65","\x41\x6C\x69\x67\x6E\x6D\x65\x6E\x74","\x4E\x61\x6D\x65\x20\x28\x6F\x70\x74\x69\x6F\x6E\x61\x6C\x29","\x45\x64\x69\x74","\x72\x74\x65\x50\x61\x73\x74\x65","\x24\x65\x6C\x65\x6D\x65\x6E\x74","\x24\x73\x6F\x75\x72\x63\x65","\x75\x75\x69\x64","\x65\x78\x74\x65\x6E\x64","\x73\x74\x61\x72\x74","\x64\x72\x6F\x70\x64\x6F\x77\x6E\x73","\x73\x6F\x75\x72\x63\x65\x48\x65\x69\x67\x68\x74","\x68\x65\x69\x67\x68\x74","\x63\x73\x73","\x73\x6F\x75\x72\x63\x65\x57\x69\x64\x74\x68","\x77\x69\x64\x74\x68","\x66\x75\x6C\x6C\x70\x61\x67\x65","\x69\x66\x72\x61\x6D\x65","\x6C\x69\x6E\x65\x62\x72\x65\x61\x6B\x73","\x70\x61\x72\x61\x67\x72\x61\x70\x68\x79","\x74\x6F\x6F\x6C\x62\x61\x72\x46\x69\x78\x65\x64\x42\x6F\x78","\x74\x6F\x6F\x6C\x62\x61\x72\x46\x69\x78\x65\x64","\x64\x6F\x63\x75\x6D\x65\x6E\x74","\x77\x69\x6E\x64\x6F\x77","\x73\x61\x76\x65\x64\x53\x65\x6C","\x63\x6C\x65\x61\x6E\x6C\x69\x6E\x65\x42\x65\x66\x6F\x72\x65","\x5E\x3C\x28\x2F\x3F","\x7C\x2F\x3F","\x6A\x6F\x69\x6E","\x6F\x77\x6E\x4C\x69\x6E\x65","\x63\x6F\x6E\x74\x4F\x77\x6E\x4C\x69\x6E\x65","\x29\x5B\x20\x3E\x5D","\x63\x6C\x65\x61\x6E\x6C\x69\x6E\x65\x41\x66\x74\x65\x72","\x5E\x3C\x28\x62\x72\x7C\x2F\x3F","\x7C\x2F","\x63\x6C\x65\x61\x6E\x6E\x65\x77\x4C\x65\x76\x65\x6C","\x5E\x3C\x2F\x3F\x28","\x6E\x65\x77\x4C\x65\x76\x65\x6C","\x72\x54\x65\x73\x74\x42\x6C\x6F\x63\x6B","\x5E\x28","\x62\x6C\x6F\x63\x6B\x4C\x65\x76\x65\x6C\x45\x6C\x65\x6D\x65\x6E\x74\x73","\x29\x24","\x69","\x61\x6C\x6C\x6F\x77\x65\x64\x54\x61\x67\x73","\x64\x65\x6C","\x62","\x73\x74\x72\x69\x6B\x65","\x69\x6E\x41\x72\x72\x61\x79","\x2D\x31","\x64\x65\x6E\x69\x65\x64\x54\x61\x67\x73","\x73\x70\x6C\x69\x63\x65","\x6D\x73\x69\x65","\x62\x72\x6F\x77\x73\x65\x72","\x6F\x70\x65\x72\x61","\x62\x75\x74\x74\x6F\x6E\x73","\x72\x65\x6D\x6F\x76\x65\x46\x72\x6F\x6D\x41\x72\x72\x61\x79\x42\x79\x56\x61\x6C\x75\x65","\x63\x75\x72\x4C\x61\x6E\x67","\x6C\x61\x6E\x67","\x6C\x61\x6E\x67\x73","\x62\x75\x69\x6C\x64\x53\x74\x61\x72\x74","\x74\x6F\x67\x67\x6C\x65","\x73\x68\x6F\x77","\x70\x61\x72\x61\x67\x72\x61\x70\x68","\x66\x6F\x72\x6D\x61\x74\x42\x6C\x6F\x63\x6B\x73","\x71\x75\x6F\x74\x65","\x66\x6F\x72\x6D\x61\x74\x51\x75\x6F\x74\x65","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x6F\x72\x6D\x61\x74\x5F\x62\x6C\x6F\x63\x6B\x71\x75\x6F\x74\x65","\x63\x6F\x64\x65","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x6F\x72\x6D\x61\x74\x5F\x70\x72\x65","\x68\x65\x61\x64\x65\x72\x31","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x6F\x72\x6D\x61\x74\x5F\x68\x31","\x68\x65\x61\x64\x65\x72\x32","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x6F\x72\x6D\x61\x74\x5F\x68\x32","\x68\x65\x61\x64\x65\x72\x33","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x6F\x72\x6D\x61\x74\x5F\x68\x33","\x68\x65\x61\x64\x65\x72\x34","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x6F\x72\x6D\x61\x74\x5F\x68\x34","\x68\x65\x61\x64\x65\x72\x35","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x6F\x72\x6D\x61\x74\x5F\x68\x35","\x73\x74\x72\x69\x6B\x65\x74\x68\x72\x6F\x75\x67\x68","\x26\x62\x75\x6C\x6C\x3B\x20","\x69\x6E\x73\x65\x72\x74\x75\x6E\x6F\x72\x64\x65\x72\x65\x64\x6C\x69\x73\x74","\x31\x2E\x20","\x69\x6E\x73\x65\x72\x74\x6F\x72\x64\x65\x72\x65\x64\x6C\x69\x73\x74","\x3C\x20","\x69\x6E\x64\x65\x6E\x74\x69\x6E\x67\x4F\x75\x74\x64\x65\x6E\x74","\x3E\x20","\x69\x6E\x64\x65\x6E\x74\x69\x6E\x67\x49\x6E\x64\x65\x6E\x74","\x69\x6D\x61\x67\x65\x53\x68\x6F\x77","\x76\x69\x64\x65\x6F\x53\x68\x6F\x77","\x66\x69\x6C\x65\x53\x68\x6F\x77","\x69\x6E\x73\x65\x72\x74\x5F\x74\x61\x62\x6C\x65","\x74\x61\x62\x6C\x65\x53\x68\x6F\x77","\x73\x65\x70\x61\x72\x61\x74\x6F\x72","\x69\x6E\x73\x65\x72\x74\x5F\x72\x6F\x77\x5F\x61\x62\x6F\x76\x65","\x74\x61\x62\x6C\x65\x41\x64\x64\x52\x6F\x77\x41\x62\x6F\x76\x65","\x69\x6E\x73\x65\x72\x74\x5F\x72\x6F\x77\x5F\x62\x65\x6C\x6F\x77","\x74\x61\x62\x6C\x65\x41\x64\x64\x52\x6F\x77\x42\x65\x6C\x6F\x77","\x69\x6E\x73\x65\x72\x74\x5F\x63\x6F\x6C\x75\x6D\x6E\x5F\x6C\x65\x66\x74","\x74\x61\x62\x6C\x65\x41\x64\x64\x43\x6F\x6C\x75\x6D\x6E\x4C\x65\x66\x74","\x69\x6E\x73\x65\x72\x74\x5F\x63\x6F\x6C\x75\x6D\x6E\x5F\x72\x69\x67\x68\x74","\x74\x61\x62\x6C\x65\x41\x64\x64\x43\x6F\x6C\x75\x6D\x6E\x52\x69\x67\x68\x74","\x61\x64\x64\x5F\x68\x65\x61\x64","\x74\x61\x62\x6C\x65\x41\x64\x64\x48\x65\x61\x64","\x64\x65\x6C\x65\x74\x65\x5F\x68\x65\x61\x64","\x74\x61\x62\x6C\x65\x44\x65\x6C\x65\x74\x65\x48\x65\x61\x64","\x64\x65\x6C\x65\x74\x65\x5F\x63\x6F\x6C\x75\x6D\x6E","\x74\x61\x62\x6C\x65\x44\x65\x6C\x65\x74\x65\x43\x6F\x6C\x75\x6D\x6E","\x64\x65\x6C\x65\x74\x65\x5F\x72\x6F\x77","\x74\x61\x62\x6C\x65\x44\x65\x6C\x65\x74\x65\x52\x6F\x77","\x64\x65\x6C\x65\x74\x65\x5F\x74\x61\x62\x6C\x65","\x74\x61\x62\x6C\x65\x44\x65\x6C\x65\x74\x65\x54\x61\x62\x6C\x65","\x6C\x69\x6E\x6B\x5F\x69\x6E\x73\x65\x72\x74","\x6C\x69\x6E\x6B\x53\x68\x6F\x77","\x75\x6E\x6C\x69\x6E\x6B","\x66\x6F\x6E\x74\x63\x6F\x6C\x6F\x72","\x62\x61\x63\x6B\x63\x6F\x6C\x6F\x72","\x61\x6C\x69\x67\x6E\x5F\x6C\x65\x66\x74","\x61\x6C\x69\x67\x6E\x6D\x65\x6E\x74\x4C\x65\x66\x74","\x61\x6C\x69\x67\x6E\x5F\x63\x65\x6E\x74\x65\x72","\x61\x6C\x69\x67\x6E\x6D\x65\x6E\x74\x43\x65\x6E\x74\x65\x72","\x61\x6C\x69\x67\x6E\x5F\x72\x69\x67\x68\x74","\x61\x6C\x69\x67\x6E\x6D\x65\x6E\x74\x52\x69\x67\x68\x74","\x61\x6C\x69\x67\x6E\x5F\x6A\x75\x73\x74\x69\x66\x79","\x61\x6C\x69\x67\x6E\x6D\x65\x6E\x74\x4A\x75\x73\x74\x69\x66\x79","\x69\x6E\x73\x65\x72\x74\x68\x6F\x72\x69\x7A\x6F\x6E\x74\x61\x6C\x72\x75\x6C\x65","\x43\x61\x6C\x6C\x62\x61\x63\x6B","\x61\x75\x74\x6F\x73\x61\x76\x65\x49\x6E\x74\x65\x72\x76\x61\x6C","\x2E\x72\x65\x64\x61\x63\x74\x6F\x72","\x6F\x66\x66","\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x74\x65\x78\x74\x61\x72\x65\x61","\x72\x65\x6D\x6F\x76\x65\x44\x61\x74\x61","\x67\x65\x74","\x74\x65\x78\x74\x61\x72\x65\x61\x6D\x6F\x64\x65","\x61\x66\x74\x65\x72","\x24\x62\x6F\x78","\x72\x65\x6D\x6F\x76\x65","\x76\x61\x6C","\x24\x65\x64\x69\x74\x6F\x72","\x63\x6F\x6E\x74\x65\x6E\x74\x65\x64\x69\x74\x61\x62\x6C\x65","\x72\x65\x6D\x6F\x76\x65\x41\x74\x74\x72","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x65\x64\x69\x74\x6F\x72\x5F\x77\x79\x6D","\x72\x65\x6D\x6F\x76\x65\x43\x6C\x61\x73\x73","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x65\x64\x69\x74\x6F\x72","\x74\x6F\x6F\x6C\x62\x61\x72\x45\x78\x74\x65\x72\x6E\x61\x6C","","\x61\x69\x72","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x61\x69\x72\x5F","\x24\x66\x72\x61\x6D\x65","\x24\x74\x6F\x6F\x6C\x62\x61\x72","\x64\x69\x72","\x63\x68\x69\x6C\x64\x72\x65\x6E","\x63\x6F\x6E\x74\x65\x6E\x74\x73","\x6F\x75\x74\x65\x72\x48\x74\x6D\x6C","\x64\x69\x72\x65\x63\x74\x69\x6F\x6E","\x61\x74\x74\x72","\x26\x23\x33\x36\x3B","\x72\x65\x70\x6C\x61\x63\x65","\x73\x65\x74\x43\x6F\x64\x65\x49\x66\x72\x61\x6D\x65","\x73\x65\x74\x45\x64\x69\x74\x6F\x72","\x70\x6C\x61\x63\x65\x68\x6F\x6C\x64\x65\x72\x52\x65\x6D\x6F\x76\x65","\x63\x6C\x65\x61\x6E\x53\x61\x76\x65\x50\x72\x65\x43\x6F\x64\x65","\x63\x6C\x65\x61\x6E\x53\x74\x72\x69\x70\x54\x61\x67\x73","\x63\x6C\x65\x61\x6E\x43\x6F\x6E\x76\x65\x72\x74\x50\x72\x6F\x74\x65\x63\x74\x65\x64","\x63\x6C\x65\x61\x6E\x43\x6F\x6E\x76\x65\x72\x74\x49\x6E\x6C\x69\x6E\x65\x54\x61\x67\x73","\x63\x6C\x65\x61\x6E\x43\x6F\x6E\x76\x65\x72\x74\x65\x72\x73","\x24\x32\x3C\x62\x72\x3E","\x24","\x63\x6C\x65\x61\x6E\x45\x6D\x70\x74\x79","\x73\x65\x74\x4E\x6F\x6E\x45\x64\x69\x74\x61\x62\x6C\x65","\x73\x65\x74\x53\x70\x61\x6E\x73\x56\x65\x72\x69\x66\x69\x65\x64","\x73\x79\x6E\x63","\x69\x66\x72\x61\x6D\x65\x50\x61\x67\x65","\x73\x72\x63","\x61\x62\x6F\x75\x74\x3A\x62\x6C\x61\x6E\x6B","\x63\x6C\x65\x61\x6E\x52\x65\x6D\x6F\x76\x65\x53\x70\x61\x63\x65\x73","\x6F\x70\x65\x6E","\x77\x72\x69\x74\x65","\x63\x6C\x6F\x73\x65","\x66\x69\x6E\x64","\x73\x70\x61\x6E","\x69\x6E\x6C\x69\x6E\x65","\x6F\x75\x74\x65\x72\x48\x54\x4D\x4C","\x3C","\x74\x61\x67\x4E\x61\x6D\x65","\x67\x69","\x3C\x2F","\x72\x65\x70\x6C\x61\x63\x65\x57\x69\x74\x68","\x3C\x69\x6E\x6C\x69\x6E\x65\x24\x31\x3E","\x3C\x2F\x69\x6E\x6C\x69\x6E\x65\x3E","\x2E\x6E\x6F\x6E\x65\x64\x69\x74\x61\x62\x6C\x65","\x63\x6C\x65\x61\x6E\x55\x6E\x76\x65\x72\x69\x66\x69\x65\x64","\x67\x65\x74\x43\x6F\x64\x65\x49\x66\x72\x61\x6D\x65","\x73\x79\x6E\x63\x43\x6C\x65\x61\x6E","\x63\x6C\x65\x61\x6E\x52\x65\x6D\x6F\x76\x65\x45\x6D\x70\x74\x79\x54\x61\x67\x73","\x3C\x24\x31\x3E\x24\x32\x3C\x2F\x24\x31\x3E\x3C\x2F\x6C\x69\x3E","\x74\x72\x69\x6D","\x3C\x62\x72\x3E","\x78\x68\x74\x6D\x6C","\x62\x72","\x69\x6D\x67","\x69\x6E\x70\x75\x74","\x28\x2E\x2A\x3F\x5B\x5E\x2F\x24\x5D\x3F\x29\x3E","\x24\x31\x20\x2F\x3E","\x73\x79\x6E\x63\x42\x65\x66\x6F\x72\x65","\x63\x61\x6C\x6C\x62\x61\x63\x6B","\x73\x79\x6E\x63\x41\x66\x74\x65\x72","\x63\x68\x61\x6E\x67\x65","\x70\x6C\x61\x63\x65\x68\x6F\x6C\x64\x65\x72\x52\x65\x6D\x6F\x76\x65\x46\x72\x6F\x6D\x43\x6F\x64\x65","\x3C\x2F\x61\x3E\x20","\x3C\x70\x3E\x3C\x2F\x70\x3E","\x3C\x70\x3E\x20\x3C\x2F\x70\x3E","\x3C\x70\x3E\x26\x6E\x62\x73\x70\x3B\x3C\x2F\x70\x3E","\x6C\x69\x6E\x6B\x4E\x6F\x66\x6F\x6C\x6C\x6F\x77","\x3C\x61\x24\x31\x24\x32\x3E","\x3C\x61\x24\x31\x20\x72\x65\x6C\x3D\x22\x6E\x6F\x66\x6F\x6C\x6C\x6F\x77\x22\x3E","\x3C\x21\x2D\x2D\x3F\x70\x68\x70","\x3C\x3F\x70\x68\x70","\x3F\x2D\x2D\x3E","\x3F\x3E","\x3C\x24\x31\x63\x6C\x61\x73\x73\x3D\x22\x6E\x6F\x65\x64\x69\x74\x61\x62\x6C\x65\x22\x24\x32\x24\x33\x3E","\x3C\x2F\x24\x31\x3E","\x24\x33\x3C\x69\x6D\x67\x24\x34\x3E","\x3C\x24\x31\x24\x32\x24\x34\x3E","\x24\x32","\x3C\x73\x70\x61\x6E\x3E","\x3C\x73\x70\x61\x6E\x20","\x3C\x2F\x73\x70\x61\x6E\x3E","\x24\x31","\x26","\x26\x74\x72\x61\x64\x65\x3B","\x26\x63\x6F\x70\x79\x3B","\x63\x6C\x65\x61\x6E\x52\x65\x43\x6F\x6E\x76\x65\x72\x74\x50\x72\x6F\x74\x65\x63\x74\x65\x64","\x63\x6F\x6E\x74\x65\x6E\x74","\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x62\x6F\x78\x22\x20\x2F\x3E","\x7A\x2D\x69\x6E\x64\x65\x78","\x54\x45\x58\x54\x41\x52\x45\x41","\x6D\x6F\x62\x69\x6C\x65","\x69\x73\x4D\x6F\x62\x69\x6C\x65","\x62\x75\x69\x6C\x64\x4D\x6F\x62\x69\x6C\x65","\x62\x75\x69\x6C\x64\x43\x6F\x6E\x74\x65\x6E\x74","\x61\x75\x74\x6F\x72\x65\x73\x69\x7A\x65","\x69\x66\x72\x61\x6D\x65\x53\x74\x61\x72\x74","\x62\x75\x69\x6C\x64\x46\x72\x6F\x6D\x54\x65\x78\x74\x61\x72\x65\x61","\x62\x75\x69\x6C\x64\x46\x72\x6F\x6D\x45\x6C\x65\x6D\x65\x6E\x74","\x62\x75\x69\x6C\x64\x4F\x70\x74\x69\x6F\x6E\x73","\x62\x75\x69\x6C\x64\x41\x66\x74\x65\x72","\x68\x69\x64\x65","\x62\x75\x69\x6C\x64\x43\x6F\x64\x65\x61\x72\x65\x61","\x61\x70\x70\x65\x6E\x64","\x69\x6E\x73\x65\x72\x74\x41\x66\x74\x65\x72","\x3C\x64\x69\x76\x20\x2F\x3E","\x62\x75\x69\x6C\x64\x41\x64\x64\x43\x6C\x61\x73\x73\x65\x73","\x62\x75\x69\x6C\x64\x45\x6E\x61\x62\x6C\x65","\x6E\x61\x6D\x65","\x69\x64","\x3C\x74\x65\x78\x74\x61\x72\x65\x61\x20\x2F\x3E","\x73\x70\x6C\x69\x74","\x63\x6C\x61\x73\x73\x4E\x61\x6D\x65","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F","\x61\x64\x64\x43\x6C\x61\x73\x73","\x73\x65\x74","\x74\x61\x62\x69\x6E\x64\x65\x78","\x6D\x69\x6E\x48\x65\x69\x67\x68\x74","\x6D\x69\x6E\x2D\x68\x65\x69\x67\x68\x74","\x70\x78","\x6D\x61\x78\x48\x65\x69\x67\x68\x74","\x77\x79\x6D","\x74\x79\x70\x65\x77\x72\x69\x74\x65\x72","\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x65\x64\x69\x74\x6F\x72\x2D\x74\x79\x70\x65\x77\x72\x69\x74\x65\x72","\x74\x6F\x6F\x6C\x62\x61\x72","\x74\x6F\x6F\x6C\x62\x61\x72\x49\x6E\x69\x74","\x74\x6F\x6F\x6C\x62\x61\x72\x42\x75\x69\x6C\x64","\x6D\x6F\x64\x61\x6C\x54\x65\x6D\x70\x6C\x61\x74\x65\x73\x49\x6E\x69\x74","\x62\x75\x69\x6C\x64\x50\x6C\x75\x67\x69\x6E\x73","\x62\x75\x69\x6C\x64\x42\x69\x6E\x64\x4B\x65\x79\x62\x6F\x61\x72\x64","\x61\x75\x74\x6F\x73\x61\x76\x65","\x6F\x62\x73\x65\x72\x76\x65\x53\x74\x61\x72\x74","\x70\x72\x6F\x78\x79","\x6D\x6F\x7A\x69\x6C\x6C\x61","\x65\x6E\x61\x62\x6C\x65\x4F\x62\x6A\x65\x63\x74\x52\x65\x73\x69\x7A\x69\x6E\x67","\x65\x78\x65\x63\x43\x6F\x6D\x6D\x61\x6E\x64","\x65\x6E\x61\x62\x6C\x65\x49\x6E\x6C\x69\x6E\x65\x54\x61\x62\x6C\x65\x45\x64\x69\x74\x69\x6E\x67","\x66\x6F\x63\x75\x73","\x76\x69\x73\x75\x61\x6C","\x64\x62\x6C\x45\x6E\x74\x65\x72","\x64\x72\x61\x67\x55\x70\x6C\x6F\x61\x64","\x69\x6D\x61\x67\x65\x55\x70\x6C\x6F\x61\x64","\x64\x72\x6F\x70\x2E\x72\x65\x64\x61\x63\x74\x6F\x72","\x62\x75\x69\x6C\x64\x45\x76\x65\x6E\x74\x44\x72\x6F\x70","\x6F\x6E","\x69\x6E\x70\x75\x74\x2E\x72\x65\x64\x61\x63\x74\x6F\x72","\x70\x61\x73\x74\x65\x2E\x72\x65\x64\x61\x63\x74\x6F\x72","\x62\x75\x69\x6C\x64\x45\x76\x65\x6E\x74\x50\x61\x73\x74\x65","\x6B\x65\x79\x64\x6F\x77\x6E\x2E\x72\x65\x64\x61\x63\x74\x6F\x72","\x62\x75\x69\x6C\x64\x45\x76\x65\x6E\x74\x4B\x65\x79\x64\x6F\x77\x6E","\x6B\x65\x79\x75\x70\x2E\x72\x65\x64\x61\x63\x74\x6F\x72","\x62\x75\x69\x6C\x64\x45\x76\x65\x6E\x74\x4B\x65\x79\x75\x70","\x74\x65\x78\x74\x61\x72\x65\x61\x4B\x65\x79\x64\x6F\x77\x6E\x43\x61\x6C\x6C\x62\x61\x63\x6B","\x6B\x65\x79\x64\x6F\x77\x6E\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x74\x65\x78\x74\x61\x72\x65\x61","\x66\x6F\x63\x75\x73\x43\x61\x6C\x6C\x62\x61\x63\x6B","\x66\x6F\x63\x75\x73\x2E\x72\x65\x64\x61\x63\x74\x6F\x72","\x74\x61\x72\x67\x65\x74","\x6D\x6F\x75\x73\x65\x64\x6F\x77\x6E","\x62\x6C\x75\x72\x2E\x72\x65\x64\x61\x63\x74\x6F\x72","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x6F\x6F\x6C\x62\x61\x72","\x68\x61\x73\x43\x6C\x61\x73\x73","\x73\x69\x7A\x65","\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x6F\x6F\x6C\x62\x61\x72","\x70\x61\x72\x65\x6E\x74\x73","\x73\x65\x6C\x65\x63\x74\x61\x6C\x6C","\x62\x6C\x75\x72\x43\x61\x6C\x6C\x62\x61\x63\x6B","\x62\x6C\x75\x72","\x6F\x72\x69\x67\x69\x6E\x61\x6C\x45\x76\x65\x6E\x74","\x46\x6F\x72\x6D\x44\x61\x74\x61","\x64\x61\x74\x61\x54\x72\x61\x6E\x73\x66\x65\x72","\x66\x69\x6C\x65\x73","\x70\x72\x65\x76\x65\x6E\x74\x44\x65\x66\x61\x75\x6C\x74","\x64\x6E\x62\x49\x6D\x61\x67\x65\x54\x79\x70\x65\x73","\x74\x79\x70\x65","\x69\x6E\x64\x65\x78\x4F\x66","\x62\x75\x66\x66\x65\x72\x53\x65\x74","\x3C\x64\x69\x76\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x70\x72\x6F\x67\x72\x65\x73\x73\x22\x3E\x3C\x73\x70\x61\x6E\x3E\x3C\x2F\x73\x70\x61\x6E\x3E\x3C\x2F\x64\x69\x76\x3E","\x73\x33","\x69\x6D\x61\x67\x65\x55\x70\x6C\x6F\x61\x64\x50\x61\x72\x61\x6D","\x64\x72\x61\x67\x55\x70\x6C\x6F\x61\x64\x41\x6A\x61\x78","\x73\x33\x75\x70\x6C\x6F\x61\x64\x46\x69\x6C\x65","\x77\x65\x62\x6B\x69\x74","\x43\x68\x72\x6F\x6D\x65","\x75\x73\x65\x72\x41\x67\x65\x6E\x74","\x2E","\x76\x65\x72\x73\x69\x6F\x6E","\x63\x6C\x69\x70\x62\x6F\x61\x72\x64\x55\x70\x6C\x6F\x61\x64","\x62\x75\x69\x6C\x64\x45\x76\x65\x6E\x74\x43\x6C\x69\x70\x62\x6F\x61\x72\x64\x55\x70\x6C\x6F\x61\x64","\x63\x6C\x65\x61\x6E\x75\x70","\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x53\x61\x76\x65","\x66\x75\x6C\x6C\x73\x63\x72\x65\x65\x6E","\x73\x61\x76\x65\x53\x63\x72\x6F\x6C\x6C","\x73\x63\x72\x6F\x6C\x6C\x54\x6F\x70","\x65\x78\x74\x72\x61\x63\x74\x43\x6F\x6E\x74\x65\x6E\x74","\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x52\x65\x73\x74\x6F\x72\x65","\x67\x65\x74\x46\x72\x61\x67\x6D\x65\x6E\x74\x48\x74\x6D\x6C","\x70\x61\x73\x74\x65\x43\x6C\x65\x61\x6E","\x61\x75\x74\x6F","\x63\x6C\x69\x70\x62\x6F\x61\x72\x64\x46\x69\x6C\x65\x50\x61\x73\x74\x65","\x63\x6C\x69\x70\x62\x6F\x61\x72\x64\x44\x61\x74\x61","\x69\x74\x65\x6D\x73","\x67\x65\x74\x41\x73\x46\x69\x6C\x65","\x6F\x6E\x6C\x6F\x61\x64","\x70\x61\x73\x74\x65\x43\x6C\x69\x70\x62\x6F\x61\x72\x64\x55\x70\x6C\x6F\x61\x64","\x72\x65\x61\x64\x41\x73\x44\x61\x74\x61\x55\x52\x4C","\x77\x68\x69\x63\x68","\x63\x74\x72\x6C\x4B\x65\x79","\x6D\x65\x74\x61\x4B\x65\x79","\x67\x65\x74\x50\x61\x72\x65\x6E\x74","\x67\x65\x74\x43\x75\x72\x72\x65\x6E\x74","\x67\x65\x74\x42\x6C\x6F\x63\x6B","\x6B\x65\x79\x64\x6F\x77\x6E","\x69\x6D\x61\x67\x65\x52\x65\x73\x69\x7A\x65\x48\x69\x64\x65","\x44\x4F\x57\x4E","\x6B\x65\x79\x43\x6F\x64\x65","\x69\x6E\x73\x65\x72\x74\x41\x66\x74\x65\x72\x4C\x61\x73\x74\x45\x6C\x65\x6D\x65\x6E\x74","\x70\x61\x72\x65\x6E\x74","\x73\x68\x69\x66\x74\x4B\x65\x79","\x73\x68\x6F\x72\x74\x63\x75\x74\x73","\x61\x6C\x74\x4B\x65\x79","\x62\x75\x66\x66\x65\x72","\x62\x75\x66\x66\x65\x72\x55\x6E\x64\x6F","\x75\x6E\x64\x6F","\x72\x65\x62\x75\x66\x66\x65\x72","\x62\x75\x66\x66\x65\x72\x52\x65\x64\x6F","\x72\x65\x64\x6F","\x4C\x45\x46\x54\x5F\x57\x49\x4E","\x45\x4E\x54\x45\x52","\x6E\x6F\x64\x65\x54\x79\x70\x65","\x54\x48","\x63\x72\x65\x61\x74\x65\x45\x6C\x65\x6D\x65\x6E\x74","\x69\x6E\x73\x65\x72\x74\x4E\x6F\x64\x65","\x65\x6E\x74\x65\x72","\x69\x73\x45\x6E\x64\x4F\x66\x45\x6C\x65\x6D\x65\x6E\x74","\x69\x6E\x73\x65\x72\x74\x69\x6E\x67\x41\x66\x74\x65\x72\x4C\x61\x73\x74\x45\x6C\x65\x6D\x65\x6E\x74","\x6C\x61\x73\x74","\x62\x75\x69\x6C\x64\x45\x76\x65\x6E\x74\x4B\x65\x79\x64\x6F\x77\x6E\x50\x72\x65","\x74\x65\x73\x74","\x72\x42\x6C\x6F\x63\x6B\x54\x65\x73\x74","\x3C\x70\x3E","\x69\x6E\x76\x69\x73\x69\x62\x6C\x65\x53\x70\x61\x63\x65","\x3C\x2F\x70\x3E","\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x53\x74\x61\x72\x74","\x72\x65\x70\x6C\x61\x63\x65\x4C\x69\x6E\x65\x42\x72\x65\x61\x6B","\x62\x75\x69\x6C\x64\x45\x76\x65\x6E\x74\x4B\x65\x79\x64\x6F\x77\x6E\x49\x6E\x73\x65\x72\x74\x4C\x69\x6E\x65\x42\x72\x65\x61\x6B","\x69\x6E\x73\x65\x72\x74\x4C\x69\x6E\x65\x42\x72\x65\x61\x6B","\x54\x41\x42","\x62\x75\x69\x6C\x64\x45\x76\x65\x6E\x74\x4B\x65\x79\x64\x6F\x77\x6E\x54\x61\x62","\x42\x41\x43\x4B\x53\x50\x41\x43\x45","\x62\x75\x69\x6C\x64\x45\x76\x65\x6E\x74\x4B\x65\x79\x64\x6F\x77\x6E\x42\x61\x63\x6B\x73\x70\x61\x63\x65","\x74\x65\x78\x74","\x0A","\x63\x72\x65\x61\x74\x65\x54\x65\x78\x74\x4E\x6F\x64\x65","\x73\x65\x61\x72\x63\x68","\x74\x61\x62\x46\x6F\x63\x75\x73","\x69\x73\x45\x6D\x70\x74\x79","\x74\x61\x62\x53\x70\x61\x63\x65\x73","\x09","\xA0","\x6E\x6F\x64\x65\x56\x61\x6C\x75\x65","\x6D\x61\x74\x63\x68","\x42\x4F\x44\x59","\x63\x6C\x6F\x6E\x65","\x6E\x65\x78\x74","\x42\x52","\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x45\x6E\x64","\x63\x6F\x6E\x76\x65\x72\x74\x4C\x69\x6E\x6B\x73","\x63\x6F\x6E\x76\x65\x72\x74\x49\x6D\x61\x67\x65\x4C\x69\x6E\x6B\x73","\x63\x6F\x6E\x76\x65\x72\x74\x56\x69\x64\x65\x6F\x4C\x69\x6E\x6B\x73","\x62\x75\x69\x6C\x64\x45\x76\x65\x6E\x74\x4B\x65\x79\x75\x70\x43\x6F\x6E\x76\x65\x72\x74\x65\x72\x73","\x44\x45\x4C\x45\x54\x45","\x66\x6F\x72\x6D\x61\x74\x45\x6D\x70\x74\x79","\x6B\x65\x79\x75\x70","\x6C\x69\x6E\x6B\x50\x72\x6F\x74\x6F\x63\x6F\x6C","\x6C\x69\x6E\x6B\x53\x69\x7A\x65","\x66\x6F\x72\x6D\x61\x74\x4C\x69\x6E\x6B\x69\x66\x79","\x6F\x62\x73\x65\x72\x76\x65\x49\x6D\x61\x67\x65\x73","\x6F\x62\x73\x65\x72\x76\x65\x4C\x69\x6E\x6B\x73","\x70\x6C\x75\x67\x69\x6E\x73","\x69\x66\x72\x61\x6D\x65\x43\x72\x65\x61\x74\x65","\x69\x66\x72\x61\x6D\x65\x41\x70\x70\x65\x6E\x64","\x24\x73\x6F\x75\x72\x63\x65\x4F\x6C\x64","\x6C\x6F\x61\x64","\x69\x66\x72\x61\x6D\x65\x4C\x6F\x61\x64","\x6F\x6E\x65","\x3C\x69\x66\x72\x61\x6D\x65\x20\x73\x74\x79\x6C\x65\x3D\x22\x77\x69\x64\x74\x68\x3A\x20\x31\x30\x30\x25\x3B\x22\x20\x66\x72\x61\x6D\x65\x62\x6F\x72\x64\x65\x72\x3D\x22\x30\x22\x20\x2F\x3E","\x63\x6F\x6E\x74\x65\x6E\x74\x57\x69\x6E\x64\x6F\x77","\x69\x66\x72\x61\x6D\x65\x44\x6F\x63","\x64\x6F\x63\x75\x6D\x65\x6E\x74\x45\x6C\x65\x6D\x65\x6E\x74","\x72\x65\x6D\x6F\x76\x65\x43\x68\x69\x6C\x64","\x69\x73\x53\x74\x72\x69\x6E\x67","\x3C\x6C\x69\x6E\x6B\x20\x72\x65\x6C\x3D\x22\x73\x74\x79\x6C\x65\x73\x68\x65\x65\x74\x22\x20\x68\x72\x65\x66\x3D\x22","\x22\x20\x2F\x3E","\x69\x73\x41\x72\x72\x61\x79","\x69\x66\x72\x61\x6D\x65\x41\x64\x64\x43\x73\x73","\x6F\x77\x6E\x65\x72\x44\x6F\x63\x75\x6D\x65\x6E\x74","\x64\x65\x66\x61\x75\x6C\x74\x56\x69\x65\x77","\x73\x65\x74\x46\x75\x6C\x6C\x70\x61\x67\x65\x4F\x6E\x49\x6E\x69\x74","\x70\x6C\x61\x63\x65\x68\x6F\x6C\x64\x65\x72","\x70\x6C\x61\x63\x65\x68\x6F\x6C\x64\x65\x72\x45\x76\x65\x6E\x74\x73","\x70\x6C\x61\x63\x65\x68\x6F\x6C\x64\x65\x72\x47\x65\x74","\x66\x6F\x63\x75\x73\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x70\x6C\x61\x63\x65\x68\x6F\x6C\x64\x65\x72","\x70\x6C\x61\x63\x65\x68\x6F\x6C\x64\x65\x72\x46\x6F\x63\x75\x73","\x62\x6C\x75\x72\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x70\x6C\x61\x63\x65\x68\x6F\x6C\x64\x65\x72","\x70\x6C\x61\x63\x65\x68\x6F\x6C\x64\x65\x72\x42\x6C\x75\x72","\x76\x65\x72\x69\x66\x69\x65\x64","\x3C\x73\x70\x61\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x70\x6C\x61\x63\x65\x68\x6F\x6C\x64\x65\x72\x22\x3E","\x73\x70\x61\x6E\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x70\x6C\x61\x63\x65\x68\x6F\x6C\x64\x65\x72","\x65\x6D\x70\x74\x79\x48\x74\x6D\x6C","\x72\x65\x6D\x6F\x76\x65\x46\x6F\x72\x6D\x61\x74","\x73\x68\x6F\x72\x74\x63\x75\x74\x73\x4C\x6F\x61\x64","\x73\x75\x70\x65\x72\x73\x63\x72\x69\x70\x74","\x73\x75\x62\x73\x63\x72\x69\x70\x74","\x73\x68\x6F\x72\x74\x63\x75\x74\x73\x4C\x6F\x61\x64\x46\x6F\x72\x6D\x61\x74","\x66\x6F\x63\x75\x73\x53\x65\x74","\x73\x65\x74\x54\x69\x6D\x65\x6F\x75\x74","\x67\x65\x74\x52\x61\x6E\x67\x65","\x73\x65\x6C\x65\x63\x74\x4E\x6F\x64\x65\x43\x6F\x6E\x74\x65\x6E\x74\x73","\x63\x6F\x6C\x6C\x61\x70\x73\x65","\x67\x65\x74\x53\x65\x6C\x65\x63\x74\x69\x6F\x6E","\x72\x65\x6D\x6F\x76\x65\x41\x6C\x6C\x52\x61\x6E\x67\x65\x73","\x61\x64\x64\x52\x61\x6E\x67\x65","\x74\x6F\x67\x67\x6C\x65\x43\x6F\x64\x65","\x74\x6F\x67\x67\x6C\x65\x56\x69\x73\x75\x61\x6C","\x6D\x6F\x64\x69\x66\x69\x65\x64","\x6B\x65\x79\x64\x6F\x77\x6E\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x74\x65\x78\x74\x61\x72\x65\x61\x2D\x69\x6E\x64\x65\x6E\x74\x69\x6E\x67","\x62\x75\x74\x74\x6F\x6E\x41\x63\x74\x69\x76\x65\x56\x69\x73\x75\x61\x6C","\x62\x75\x74\x74\x6F\x6E\x49\x6E\x61\x63\x74\x69\x76\x65","\x69\x6E\x6E\x65\x72\x48\x65\x69\x67\x68\x74","\x74\x69\x64\x79\x48\x74\x6D\x6C","\x63\x6C\x65\x61\x6E\x48\x74\x6D\x6C","\x74\x65\x78\x74\x61\x72\x65\x61\x49\x6E\x64\x65\x6E\x74\x69\x6E\x67","\x62\x75\x74\x74\x6F\x6E\x49\x6E\x61\x63\x74\x69\x76\x65\x56\x69\x73\x75\x61\x6C","\x62\x75\x74\x74\x6F\x6E\x41\x63\x74\x69\x76\x65","\x73\x75\x62\x73\x74\x72\x69\x6E\x67","\x70\x6F\x73\x74","\x3D","\x61\x6A\x61\x78","\x62\x75\x74\x74\x6F\x6E\x73\x48\x69\x64\x65\x4F\x6E\x4D\x6F\x62\x69\x6C\x65","\x61\x69\x72\x42\x75\x74\x74\x6F\x6E\x73","\x62\x75\x74\x74\x6F\x6E\x53\x6F\x75\x72\x63\x65","\x64\x72\x6F\x70\x64\x6F\x77\x6E","\x66\x6F\x72\x6D\x61\x74\x74\x69\x6E\x67\x54\x61\x67\x73","\x61\x69\x72\x45\x6E\x61\x62\x6C\x65","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x6F\x6F\x6C\x62\x61\x72\x5F","\x3C\x75\x6C\x3E","\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x74\x6F\x6F\x6C\x62\x61\x72\x2D\x74\x79\x70\x65\x77\x72\x69\x74\x65\x72","\x74\x6F\x6F\x6C\x62\x61\x72\x4F\x76\x65\x72\x66\x6C\x6F\x77","\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x74\x6F\x6F\x6C\x62\x61\x72\x2D\x6F\x76\x65\x72\x66\x6C\x6F\x77","\x24\x61\x69\x72","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x61\x69\x72\x5F","\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x61\x69\x72\x22\x3E","\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x74\x6F\x6F\x6C\x62\x61\x72\x2D\x65\x78\x74\x65\x72\x6E\x61\x6C","\x70\x72\x65\x70\x65\x6E\x64","\x66\x69\x6C\x65\x55\x70\x6C\x6F\x61\x64","\x62\x75\x74\x74\x6F\x6E\x42\x75\x69\x6C\x64","\x3C\x6C\x69\x3E","\x61","\x74\x6F\x6F\x6C\x62\x61\x72\x4F\x62\x73\x65\x72\x76\x65\x53\x63\x72\x6F\x6C\x6C","\x73\x63\x72\x6F\x6C\x6C\x2E\x72\x65\x64\x61\x63\x74\x6F\x72","\x74\x6F\x6F\x6C\x62\x61\x72\x46\x69\x78\x65\x64\x54\x61\x72\x67\x65\x74","\x61\x63\x74\x69\x76\x65\x42\x75\x74\x74\x6F\x6E\x73","\x6D\x6F\x75\x73\x65\x75\x70\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x20\x6B\x65\x79\x75\x70\x2E\x72\x65\x64\x61\x63\x74\x6F\x72","\x62\x75\x74\x74\x6F\x6E\x41\x63\x74\x69\x76\x65\x4F\x62\x73\x65\x72\x76\x65\x72","\x74\x6F\x70","\x6F\x66\x66\x73\x65\x74","\x31\x30\x30\x25","\x6C\x65\x66\x74","\x69\x6E\x6E\x65\x72\x57\x69\x64\x74\x68","\x74\x6F\x6F\x6C\x62\x61\x72\x5F\x66\x69\x78\x65\x64\x5F\x62\x6F\x78","\x66\x69\x78\x65\x64","\x74\x6F\x6F\x6C\x62\x61\x72\x46\x69\x78\x65\x64\x54\x6F\x70\x4F\x66\x66\x73\x65\x74","\x76\x69\x73\x69\x62\x69\x6C\x69\x74\x79","\x76\x69\x73\x69\x62\x6C\x65","\x68\x69\x64\x64\x65\x6E","\x72\x65\x6C\x61\x74\x69\x76\x65","\x67\x65\x74\x53\x65\x6C\x65\x63\x74\x69\x6F\x6E\x54\x65\x78\x74","\x6D\x6F\x75\x73\x65\x75\x70","\x61\x69\x72\x53\x68\x6F\x77","\x66\x6F\x63\x75\x73\x4E\x6F\x64\x65","\x67\x65\x74\x45\x6C\x65\x6D\x65\x6E\x74","\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x61\x69\x72","\x70\x6F\x73\x69\x74\x69\x6F\x6E","\x63\x6C\x69\x65\x6E\x74\x58","\x63\x6C\x69\x65\x6E\x74\x59","\x61\x69\x72\x42\x69\x6E\x64\x48\x69\x64\x65","\x45\x53\x43","\x63\x6F\x6C\x6C\x61\x70\x73\x65\x54\x6F\x53\x74\x61\x72\x74","\x66\x61\x64\x65\x4F\x75\x74","\x6D\x6F\x75\x73\x65\x64\x6F\x77\x6E\x2E\x72\x65\x64\x61\x63\x74\x6F\x72","\x63\x6C\x6F\x73\x65\x73\x74","\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x52\x65\x6D\x6F\x76\x65","\x6D\x6F\x75\x73\x65\x6D\x6F\x76\x65\x2E\x72\x65\x64\x61\x63\x74\x6F\x72","\x3C\x61\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x73\x65\x70\x61\x72\x61\x74\x6F\x72\x5F\x64\x72\x6F\x70\x22\x3E","\x3C\x61\x20\x68\x72\x65\x66\x3D\x22\x23\x22\x20\x63\x6C\x61\x73\x73\x3D\x22","\x20\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x64\x72\x6F\x70\x64\x6F\x77\x6E\x5F","\x22\x3E","\x74\x69\x74\x6C\x65","\x3C\x2F\x61\x3E","\x63\x6C\x69\x63\x6B","\x72\x65\x74\x75\x72\x6E\x56\x61\x6C\x75\x65","\x65\x78\x65\x63","\x66\x75\x6E\x63","\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x64\x72\x6F\x70\x64\x6F\x77\x6E\x5F\x62\x6F\x78\x5F","\x62\x75\x74\x74\x6F\x6E\x47\x65\x74","\x64\x72\x6F\x70\x61\x63\x74","\x64\x72\x6F\x70\x64\x6F\x77\x6E\x48\x69\x64\x65\x41\x6C\x6C","\x61\x62\x73\x6F\x6C\x75\x74\x65","\x64\x72\x6F\x70\x64\x6F\x77\x6E\x48\x69\x64\x65","\x73\x74\x6F\x70\x50\x72\x6F\x70\x61\x67\x61\x74\x69\x6F\x6E","\x66\x6F\x63\x75\x73\x57\x69\x74\x68\x53\x61\x76\x65\x53\x63\x72\x6F\x6C\x6C","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x61\x63\x74","\x61\x2E\x64\x72\x6F\x70\x61\x63\x74","\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x64\x72\x6F\x70\x64\x6F\x77\x6E","\x3C\x61\x20\x68\x72\x65\x66\x3D\x22\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x3A\x3B\x22\x20\x74\x69\x74\x6C\x65\x3D\x22","\x22\x20\x74\x61\x62\x69\x6E\x64\x65\x78\x3D\x22\x2D\x31\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x2D\x69\x63\x6F\x6E\x20\x72\x65\x2D","\x22\x3E\x3C\x2F\x61\x3E","\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x62\x74\x6E\x2D\x69\x6D\x61\x67\x65","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x62\x75\x74\x74\x6F\x6E\x5F\x64\x69\x73\x61\x62\x6C\x65\x64","\x69\x73\x46\x6F\x63\x75\x73\x65\x64","\x61\x69\x72\x42\x69\x6E\x64\x4D\x6F\x75\x73\x65\x6D\x6F\x76\x65\x48\x69\x64\x65","\x64\x72\x6F\x70\x64\x6F\x77\x6E\x53\x68\x6F\x77","\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x64\x72\x6F\x70\x64\x6F\x77\x6E\x20\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x64\x72\x6F\x70\x64\x6F\x77\x6E\x5F\x62\x6F\x78\x5F","\x22\x20\x73\x74\x79\x6C\x65\x3D\x22\x64\x69\x73\x70\x6C\x61\x79\x3A\x20\x6E\x6F\x6E\x65\x3B\x22\x3E","\x61\x70\x70\x65\x6E\x64\x54\x6F","\x64\x72\x6F\x70\x64\x6F\x77\x6E\x42\x75\x69\x6C\x64","\x61\x2E\x72\x65\x2D","\x61\x63\x74\x69\x76\x65\x42\x75\x74\x74\x6F\x6E\x73\x53\x74\x61\x74\x65\x73","\x2E\x72\x65\x2D","\x6E\x6F\x74","\x61\x2E\x72\x65\x2D\x69\x63\x6F\x6E","\x61\x2E\x72\x65\x2D\x68\x74\x6D\x6C","\x72\x65\x2D","\x66\x61\x2D\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x62\x74\x6E","\x3C\x69\x20\x63\x6C\x61\x73\x73\x3D\x22\x66\x61\x20","\x22\x3E\x3C\x2F\x69\x3E","\x62\x65\x66\x6F\x72\x65","\x62\x75\x74\x74\x6F\x6E\x49\x6E\x61\x63\x74\x69\x76\x65\x41\x6C\x6C","\x62\x75\x74\x74\x6F\x6E\x41\x63\x74\x69\x76\x65\x54\x6F\x67\x67\x6C\x65","\x41","\x6C\x69\x6E\x6B\x5F\x65\x64\x69\x74","\x61\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x64\x72\x6F\x70\x64\x6F\x77\x6E\x5F\x6C\x69\x6E\x6B","\x74\x6F\x4C\x6F\x77\x65\x72\x43\x61\x73\x65","\x61\x6C\x69\x67\x6E\x6D\x65\x6E\x74\x54\x61\x67\x73","\x74\x65\x78\x74\x2D\x61\x6C\x69\x67\x6E","\x72\x69\x67\x68\x74","\x63\x65\x6E\x74\x65\x72","\x61\x6C\x69\x67\x6E\x6A\x75\x73\x74\x69\x66\x79","\x67\x65\x74\x52\x61\x6E\x67\x65\x41\x74","\x72\x61\x6E\x67\x65\x43\x6F\x75\x6E\x74","\x64\x65\x6C\x65\x74\x65\x43\x6F\x6E\x74\x65\x6E\x74\x73","\x69\x6E\x6E\x65\x72\x48\x54\x4D\x4C","\x63\x72\x65\x61\x74\x65\x44\x6F\x63\x75\x6D\x65\x6E\x74\x46\x72\x61\x67\x6D\x65\x6E\x74","\x61\x70\x70\x65\x6E\x64\x43\x68\x69\x6C\x64","\x66\x69\x72\x73\x74\x43\x68\x69\x6C\x64","\x63\x6C\x6F\x6E\x65\x52\x61\x6E\x67\x65","\x73\x65\x74\x53\x74\x61\x72\x74\x41\x66\x74\x65\x72","\x66\x6F\x72\x6D\x61\x74\x62\x6C\x6F\x63\x6B","\x3E","\x69\x6E\x73\x65\x72\x74\x68\x74\x6D\x6C","\x69\x73\x49\x65\x31\x31","\x70\x61\x73\x74\x65\x48\x54\x4D\x4C","\x63\x72\x65\x61\x74\x65\x52\x61\x6E\x67\x65","\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E","\x65\x78\x65\x63\x50\x61\x73\x74\x65\x46\x72\x61\x67","\x53\x55\x50","\x53\x55\x42","\x69\x6E\x6C\x69\x6E\x65\x52\x65\x6D\x6F\x76\x65\x46\x6F\x72\x6D\x61\x74\x52\x65\x70\x6C\x61\x63\x65","\x69\x6E\x73\x65\x72\x74\x48\x74\x6D\x6C","\x63\x75\x72\x72\x65\x6E\x74\x4F\x72\x50\x61\x72\x65\x6E\x74\x49\x73","\x66\x6F\x72\x6D\x61\x74\x74\x69\x6E\x67\x50\x72\x65","\x65\x78\x65\x63\x4C\x69\x73\x74\x73","\x65\x78\x65\x63\x55\x6E\x6C\x69\x6E\x6B","\x6F\x6C\x2C\x20\x75\x6C","\x69\x73\x50\x61\x72\x65\x6E\x74\x52\x65\x64\x61\x63\x74\x6F\x72","\x4F\x4C","\x55\x4C","\x67\x65\x74\x4E\x6F\x64\x65\x73","\x67\x65\x74\x42\x6C\x6F\x63\x6B\x73","\x75\x6E\x73\x68\x69\x66\x74","\x65\x6D\x70\x74\x79","\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x72\x65\x70\x6C\x61\x63\x65\x64","\x3A\x65\x6D\x70\x74\x79","\x3C\x74\x64\x3E","\x77\x72\x61\x70\x41\x6C\x6C","\x6E\x6F\x64\x65\x54\x65\x73\x74\x42\x6C\x6F\x63\x6B\x73","\x69\x6E\x64\x65\x6E\x74\x69\x6E\x67\x53\x74\x61\x72\x74","\x70\x72\x65\x76","\x75\x6C\x2C\x20\x6F\x6C","\x66\x6F\x72\x6D\x61\x74\x42\x6C\x6F\x63\x6B","\x3C\x64\x69\x76\x20\x64\x61\x74\x61\x2D\x74\x61\x67\x62\x6C\x6F\x63\x6B\x3D\x22\x22\x3E","\x6D\x61\x72\x67\x69\x6E\x2D\x6C\x65\x66\x74","\x6E\x6F\x72\x6D\x61\x6C\x69\x7A\x65","\x69\x6E\x64\x65\x6E\x74\x56\x61\x6C\x75\x65","\x69\x6E\x73\x69\x64\x65\x4F\x75\x74\x64\x65\x6E\x74","\x74\x61\x67\x62\x6C\x6F\x63\x6B","\x72\x65\x6D\x6F\x76\x65\x45\x6D\x70\x74\x79\x41\x74\x74\x72","\x4A\x75\x73\x74\x69\x66\x79\x4C\x65\x66\x74","\x61\x6C\x69\x67\x6E\x6D\x65\x6E\x74\x53\x65\x74","\x4A\x75\x73\x74\x69\x66\x79\x52\x69\x67\x68\x74","\x4A\x75\x73\x74\x69\x66\x79\x43\x65\x6E\x74\x65\x72","\x4A\x75\x73\x74\x69\x66\x79\x46\x75\x6C\x6C","\x6F\x6C\x64\x49\x45","\x70\x6C\x61\x63\x65\x68\x6F\x6C\x64\x65\x72\x53\x74\x61\x72\x74","\x3C\x68\x72\x3E","\x63\x6F\x6E\x76\x65\x72\x74\x44\x69\x76\x73","\x3C\x70\x24\x31\x3E\x24\x32\x3C\x2F\x70\x3E","\x63\x6C\x65\x61\x6E\x50\x61\x72\x61\x67\x72\x61\x70\x68\x79","\x74\x65\x6D\x70\x6C\x61\x74\x65\x56\x61\x72\x73","\x3C\x21\x2D\x2D\x20\x74\x65\x6D\x70\x6C\x61\x74\x65\x20\x64\x6F\x75\x62\x6C\x65\x20\x24\x31\x20\x2D\x2D\x3E","\x3C\x21\x2D\x2D\x20\x74\x65\x6D\x70\x6C\x61\x74\x65\x20\x24\x31\x20\x2D\x2D\x3E","\x3C\x74\x69\x74\x6C\x65\x20\x74\x79\x70\x65\x3D\x22\x74\x65\x78\x74\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x22\x20\x73\x74\x79\x6C\x65\x3D\x22\x64\x69\x73\x70\x6C\x61\x79\x3A\x20\x6E\x6F\x6E\x65\x3B\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x73\x63\x72\x69\x70\x74\x2D\x74\x61\x67\x22\x24\x31\x3E\x24\x32\x3C\x2F\x74\x69\x74\x6C\x65\x3E","\x3C\x73\x65\x63\x74\x69\x6F\x6E\x24\x31\x20\x73\x74\x79\x6C\x65\x3D\x22\x64\x69\x73\x70\x6C\x61\x79\x3A\x20\x6E\x6F\x6E\x65\x3B\x22\x20\x72\x65\x6C\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x73\x74\x79\x6C\x65\x2D\x74\x61\x67\x22\x3E\x24\x32\x3C\x2F\x73\x65\x63\x74\x69\x6F\x6E\x3E","\x3C\x73\x65\x63\x74\x69\x6F\x6E\x24\x31\x20\x72\x65\x6C\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x66\x6F\x72\x6D\x2D\x74\x61\x67\x22\x3E\x24\x32\x3C\x2F\x73\x65\x63\x74\x69\x6F\x6E\x3E","\x70\x68\x70\x54\x61\x67\x73","\x3C\x73\x65\x63\x74\x69\x6F\x6E\x20\x73\x74\x79\x6C\x65\x3D\x22\x64\x69\x73\x70\x6C\x61\x79\x3A\x20\x6E\x6F\x6E\x65\x3B\x22\x20\x72\x65\x6C\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x70\x68\x70\x2D\x74\x61\x67\x22\x3E\x24\x31\x3C\x2F\x73\x65\x63\x74\x69\x6F\x6E\x3E","\x7B\x7B\x24\x31\x7D\x7D","\x7B\x24\x31\x7D","\x3C\x73\x63\x72\x69\x70\x74\x24\x31\x20\x74\x79\x70\x65\x3D\x22\x74\x65\x78\x74\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x22\x3E\x24\x32\x3C\x2F\x73\x63\x72\x69\x70\x74\x3E","\x3C\x73\x74\x79\x6C\x65\x24\x31\x3E\x24\x32\x3C\x2F\x73\x74\x79\x6C\x65\x3E","\x3C\x66\x6F\x72\x6D\x24\x31\x24\x32\x3E\x24\x33\x3C\x2F\x66\x6F\x72\x6D\x3E","\x3C\x3F\x70\x68\x70\x0D\x0A\x24\x31\x0D\x0A\x3F\x3E","\x6D\x65\x72\x67\x65","\x62\x75\x66\x66\x65\x72\x5F","\x20","\x3E\x20\x3C","\x63\x6C\x65\x61\x6E\x52\x65\x70\x6C\x61\x63\x65\x72","\x3C\x62\x3E\x5C\x73\x2A\x3C\x2F\x62\x3E","\x3C\x62\x3E\x26\x6E\x62\x73\x70\x3B\x3C\x2F\x62\x3E","\x3C\x65\x6D\x3E\x5C\x73\x2A\x3C\x2F\x65\x6D\x3E","\x3C\x70\x72\x65\x3E\x3C\x2F\x70\x72\x65\x3E","\x3C\x62\x6C\x6F\x63\x6B\x71\x75\x6F\x74\x65\x3E\x5C\x73\x2A\x3C\x2F\x62\x6C\x6F\x63\x6B\x71\x75\x6F\x74\x65\x3E","\x3C\x64\x64\x3E\x3C\x2F\x64\x64\x3E","\x3C\x64\x74\x3E\x3C\x2F\x64\x74\x3E","\x3C\x75\x6C\x3E\x3C\x2F\x75\x6C\x3E","\x3C\x6F\x6C\x3E\x3C\x2F\x6F\x6C\x3E","\x3C\x6C\x69\x3E\x3C\x2F\x6C\x69\x3E","\x3C\x74\x61\x62\x6C\x65\x3E\x3C\x2F\x74\x61\x62\x6C\x65\x3E","\x3C\x74\x72\x3E\x3C\x2F\x74\x72\x3E","\x3C\x73\x70\x61\x6E\x3E\x5C\x73\x2A\x3C\x73\x70\x61\x6E\x3E","\x3C\x73\x70\x61\x6E\x3E\x26\x6E\x62\x73\x70\x3B\x3C\x73\x70\x61\x6E\x3E","\x3C\x70\x3E\x5C\x73\x2A\x3C\x2F\x70\x3E","\x3C\x70\x3E\x5C\x73\x2A\x3C\x62\x72\x3E\x5C\x73\x2A\x3C\x2F\x70\x3E","\x3C\x64\x69\x76\x3E\x5C\x73\x2A\x3C\x2F\x64\x69\x76\x3E","\x3C\x64\x69\x76\x3E\x5C\x73\x2A\x3C\x62\x72\x3E\x5C\x73\x2A\x3C\x2F\x64\x69\x76\x3E","\x72\x65\x6D\x6F\x76\x65\x45\x6D\x70\x74\x79\x54\x61\x67\x73","\x63\x6F\x6E\x63\x61\x74","\x7B\x72\x65\x70\x6C\x61\x63\x65","\x7D\x0A","\x0A\x0A","\x28\x63\x6F\x6D\x6D\x65\x6E\x74\x7C\x68\x74\x6D\x6C\x7C\x62\x6F\x64\x79\x7C\x68\x65\x61\x64\x7C\x74\x69\x74\x6C\x65\x7C\x6D\x65\x74\x61\x7C\x73\x74\x79\x6C\x65\x7C\x73\x63\x72\x69\x70\x74\x7C\x6C\x69\x6E\x6B\x7C\x69\x66\x72\x61\x6D\x65\x7C\x74\x61\x62\x6C\x65\x7C\x74\x68\x65\x61\x64\x7C\x74\x66\x6F\x6F\x74\x7C\x63\x61\x70\x74\x69\x6F\x6E\x7C\x63\x6F\x6C\x7C\x63\x6F\x6C\x67\x72\x6F\x75\x70\x7C\x74\x62\x6F\x64\x79\x7C\x74\x72\x7C\x74\x64\x7C\x74\x68\x7C\x64\x69\x76\x7C\x64\x6C\x7C\x64\x64\x7C\x64\x74\x7C\x75\x6C\x7C\x6F\x6C\x7C\x6C\x69\x7C\x70\x72\x65\x7C\x73\x65\x6C\x65\x63\x74\x7C\x6F\x70\x74\x69\x6F\x6E\x7C\x66\x6F\x72\x6D\x7C\x6D\x61\x70\x7C\x61\x72\x65\x61\x7C\x62\x6C\x6F\x63\x6B\x71\x75\x6F\x74\x65\x7C\x61\x64\x64\x72\x65\x73\x73\x7C\x6D\x61\x74\x68\x7C\x73\x74\x79\x6C\x65\x7C\x70\x7C\x68\x5B\x31\x2D\x36\x5D\x7C\x68\x72\x7C\x66\x69\x65\x6C\x64\x73\x65\x74\x7C\x6C\x65\x67\x65\x6E\x64\x7C\x73\x65\x63\x74\x69\x6F\x6E\x7C\x61\x72\x74\x69\x63\x6C\x65\x7C\x61\x73\x69\x64\x65\x7C\x68\x67\x72\x6F\x75\x70\x7C\x68\x65\x61\x64\x65\x72\x7C\x66\x6F\x6F\x74\x65\x72\x7C\x6E\x61\x76\x7C\x66\x69\x67\x75\x72\x65\x7C\x66\x69\x67\x63\x61\x70\x74\x69\x6F\x6E\x7C\x64\x65\x74\x61\x69\x6C\x73\x7C\x6D\x65\x6E\x75\x7C\x73\x75\x6D\x6D\x61\x72\x79\x29","\x28\x3C","\x5B\x5E\x3E\x5D\x2A\x3E\x29","\x0A\x24\x31","\x28\x3C\x2F","\x3E\x29","\x24\x31\x0A\x0A","\x0D\x0A","\x67","\x0D","\x2F\x0A\x0A\x2B\x2F","\x0A\x73\x2A\x0A","\x68\x61\x73\x4F\x77\x6E\x50\x72\x6F\x70\x65\x72\x74\x79","\x3C\x70\x3E\x3C\x70\x3E","\x3C\x2F\x70\x3E\x3C\x2F\x70\x3E","\x3C\x70\x3E\x73\x3F\x3C\x2F\x70\x3E","\x3C\x70\x3E\x28\x5B\x5E\x3C\x5D\x2B\x29\x3C\x2F\x28\x64\x69\x76\x7C\x61\x64\x64\x72\x65\x73\x73\x7C\x66\x6F\x72\x6D\x29\x3E","\x3C\x70\x3E\x24\x31\x3C\x2F\x70\x3E\x3C\x2F\x24\x32\x3E","\x3C\x70\x3E\x28\x3C\x2F\x3F","\x5B\x5E\x3E\x5D\x2A\x3E\x29\x3C\x2F\x70\x3E","\x3C\x70\x3E\x28\x3C\x6C\x69\x2E\x2B\x3F\x29\x3C\x2F\x70\x3E","\x3C\x70\x3E\x73\x3F\x28\x3C\x2F\x3F","\x28\x3C\x2F\x3F","\x5B\x5E\x3E\x5D\x2A\x3E\x29\x73\x3F\x3C\x2F\x70\x3E","\x5B\x5E\x3E\x5D\x2A\x3E\x29\x73\x3F\x3C\x62\x72\x20\x2F\x3E","\x3C\x62\x72\x20\x2F\x3E\x28\x73\x2A\x3C\x2F\x3F\x28\x3F\x3A\x70\x7C\x6C\x69\x7C\x64\x69\x76\x7C\x64\x6C\x7C\x64\x64\x7C\x64\x74\x7C\x74\x68\x7C\x70\x72\x65\x7C\x74\x64\x7C\x75\x6C\x7C\x6F\x6C\x29\x5B\x5E\x3E\x5D\x2A\x3E\x29","\x0A\x3C\x2F\x70\x3E","\x3C\x6C\x69\x3E\x3C\x70\x3E","\x3C\x2F\x70\x3E\x3C\x2F\x6C\x69\x3E","\x3C\x2F\x6C\x69\x3E","\x3C\x2F\x6C\x69\x3E\x3C\x70\x3E","\x3C\x70\x3E\x09\x3F\x0A\x3F\x3C\x70\x3E","\x3C\x2F\x64\x74\x3E\x3C\x70\x3E","\x3C\x2F\x64\x74\x3E","\x3C\x2F\x64\x64\x3E\x3C\x70\x3E","\x3C\x2F\x64\x64\x3E","\x3C\x62\x72\x3E\x3C\x2F\x70\x3E\x3C\x2F\x62\x6C\x6F\x63\x6B\x71\x75\x6F\x74\x65\x3E","\x3C\x2F\x62\x6C\x6F\x63\x6B\x71\x75\x6F\x74\x65\x3E","\x3C\x70\x3E\x09\x2A\x3C\x2F\x70\x3E","\x7D","\x62\x6F\x6C\x64\x54\x61\x67","\x69\x74\x61\x6C\x69\x63\x54\x61\x67","\x3E\x24\x31\x3C\x2F","\x3C\x73\x74\x72\x6F\x6E\x67\x3E\x24\x31\x3C\x2F\x73\x74\x72\x6F\x6E\x67\x3E","\x3C\x62\x3E\x24\x31\x3C\x2F\x62\x3E","\x3C\x65\x6D\x3E\x24\x31\x3C\x2F\x65\x6D\x3E","\x3C\x69\x3E\x24\x31\x3C\x2F\x69\x3E","\x3C\x64\x65\x6C\x3E\x24\x31\x3C\x2F\x64\x65\x6C\x3E","\x3C\x73\x74\x72\x69\x6B\x65\x3E\x24\x31\x3C\x2F\x73\x74\x72\x69\x6B\x65\x3E","\x63\x6C\x65\x61\x6E\x45\x6E\x63\x6F\x64\x65\x45\x6E\x74\x69\x74\x69\x65\x73","\x22","\x26\x71\x75\x6F\x74\x3B","\x26\x67\x74\x3B","\x26\x6C\x74\x3B","\x26\x61\x6D\x70\x3B","\x6C\x69\x2C\x20\x69\x6D\x67\x2C\x20\x61\x2C\x20\x62\x2C\x20\x73\x74\x72\x6F\x6E\x67\x2C\x20\x73\x75\x62\x2C\x20\x73\x75\x70\x2C\x20\x69\x2C\x20\x65\x6D\x2C\x20\x75\x2C\x20\x73\x6D\x61\x6C\x6C\x2C\x20\x73\x74\x72\x69\x6B\x65\x2C\x20\x64\x65\x6C\x2C\x20\x73\x70\x61\x6E\x2C\x20\x63\x69\x74\x65","\x6C\x69\x6E\x65\x2D\x68\x65\x69\x67\x68\x74","\x62\x61\x63\x6B\x67\x72\x6F\x75\x6E\x64\x2D\x63\x6F\x6C\x6F\x72","\x5B\x73\x74\x79\x6C\x65\x2A\x3D\x22\x62\x61\x63\x6B\x67\x72\x6F\x75\x6E\x64\x2D\x63\x6F\x6C\x6F\x72\x3A\x20\x74\x72\x61\x6E\x73\x70\x61\x72\x65\x6E\x74\x3B\x22\x5D\x5B\x73\x74\x79\x6C\x65\x2A\x3D\x22\x6C\x69\x6E\x65\x2D\x68\x65\x69\x67\x68\x74\x22\x5D","\x66\x69\x6C\x74\x65\x72","\x5B\x73\x74\x79\x6C\x65\x2A\x3D\x22\x62\x61\x63\x6B\x67\x72\x6F\x75\x6E\x64\x2D\x63\x6F\x6C\x6F\x72\x3A\x20\x74\x72\x61\x6E\x73\x70\x61\x72\x65\x6E\x74\x3B\x22\x5D","\x75\x6E\x77\x72\x61\x70","\x64\x69\x76\x5B\x73\x74\x79\x6C\x65\x3D\x22\x74\x65\x78\x74\x2D\x61\x6C\x69\x67\x6E\x3A\x20\x2D\x77\x65\x62\x6B\x69\x74\x2D\x61\x75\x74\x6F\x3B\x22\x5D","\x63\x6C\x65\x61\x6E\x6C\x65\x76\x65\x6C","\x73\x75\x62\x73\x74\x72","\x63\x6C\x65\x61\x6E\x46\x69\x6E\x69\x73\x68","\x63\x68\x61\x72\x41\x74","\x63\x6C\x65\x61\x6E\x47\x65\x74\x54\x61\x62\x73","\x21\x2D\x2D","\x2D\x2D\x3E","\x3E\x0A","\x21","\x70\x6C\x61\x63\x65\x54\x61\x67","\x3F","\x63\x6C\x65\x61\x6E\x54\x61\x67","\x3C\x73\x63\x72\x69\x70\x74\x24\x31\x3E\x3C\x2F\x73\x63\x72\x69\x70\x74\x3E","\x2F","\x3C\x73\x70\x61\x6E\x20\x69\x64\x3D\x22\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x2D\x6D\x61\x72\x6B\x65\x72\x2D\x31\x22\x3E\x3C\x2F\x73\x70\x61\x6E\x3E","\x3C\x64\x69\x76\x3E","\x2F\x3E","\x70\x61\x72\x61\x67\x72\x61\x70\x68\x73","\x3C\x62\x6C\x6F\x63\x6B\x71\x75\x6F\x74\x65\x3E","\x67\x65\x74\x53\x65\x6C\x65\x63\x74\x69\x6F\x6E\x48\x74\x6D\x6C","\x74\x6D\x70","\x69\x6E\x6C\x69\x6E\x65\x46\x6F\x72\x6D\x61\x74","\x3C\x74\x6D\x70\x3E\x3C\x2F\x74\x6D\x70\x3E","\x3C\x2F\x62\x6C\x6F\x63\x6B\x71\x75\x6F\x74\x65\x3E\x3C\x73\x70\x61\x6E\x20\x69\x64\x3D\x22\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x2D\x6D\x61\x72\x6B\x65\x72\x2D\x31\x22\x3E","\x73\x70\x61\x6E\x23\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x2D\x6D\x61\x72\x6B\x65\x72\x2D\x31","\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x57\x72\x61\x70","\x28\x2E\x2A\x3F\x29\x3E","\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x45\x6C\x65\x6D\x65\x6E\x74","\x63\x6C\x61\x73\x73","\x69\x6E\x6C\x69\x6E\x65\x45\x61\x63\x68\x4E\x6F\x64\x65\x73","\x69\x6E\x6C\x69\x6E\x65\x4D\x65\x74\x68\x6F\x64\x73","\x63\x6F\x6C\x6C\x61\x70\x73\x65\x64","\x73\x74\x61\x72\x74\x43\x6F\x6E\x74\x61\x69\x6E\x65\x72","\x65\x6E\x64\x43\x6F\x6E\x74\x61\x69\x6E\x65\x72","\x69\x6E\x6C\x69\x6E\x65\x55\x6E\x77\x72\x61\x70\x53\x70\x61\x6E","\x66\x6F\x6E\x74\x53\x69\x7A\x65","\x66\x6F\x6E\x74","\x69\x6E\x6C\x69\x6E\x65\x53\x65\x74\x4D\x65\x74\x68\x6F\x64\x73","\x49\x4E\x4C\x49\x4E\x45","\x61\x74\x74\x72\x69\x62\x75\x74\x65\x73","\x3C\x69\x6E\x6C\x69\x6E\x65\x3E","\x70\x61\x72\x65\x6E\x74\x4E\x6F\x64\x65","\x74\x6F\x55\x70\x70\x65\x72\x43\x61\x73\x65","\x70\x61\x72\x73\x65\x48\x54\x4D\x4C","\x67\x65\x74\x52\x61\x6E\x67\x65\x53\x65\x6C\x65\x63\x74\x65\x64\x4E\x6F\x64\x65\x73","\x73\x65\x74\x53\x70\x61\x6E\x73\x56\x65\x72\x69\x66\x69\x65\x64\x48\x74\x6D\x6C","\x70\x2C\x20\x3A\x68\x65\x61\x64\x65\x72\x2C\x20\x75\x6C\x2C\x20\x6F\x6C\x2C\x20\x6C\x69\x2C\x20\x64\x69\x76\x2C\x20\x74\x61\x62\x6C\x65\x2C\x20\x74\x64\x2C\x20\x62\x6C\x6F\x63\x6B\x71\x75\x6F\x74\x65\x2C\x20\x70\x72\x65\x2C\x20\x61\x64\x64\x72\x65\x73\x73\x2C\x20\x73\x65\x63\x74\x69\x6F\x6E\x2C\x20\x68\x65\x61\x64\x65\x72\x2C\x20\x66\x6F\x6F\x74\x65\x72\x2C\x20\x61\x73\x69\x64\x65\x2C\x20\x61\x72\x74\x69\x63\x6C\x65","\x69\x73","\x69\x6E\x73\x65\x72\x74\x48\x74\x6D\x6C\x41\x64\x76\x61\x6E\x63\x65\x64","\x66\x6F\x63\x75\x73\x45\x6E\x64","\u200B","\x53\x50\x41\x4E","\x73\x65\x74\x45\x6E\x64\x41\x66\x74\x65\x72","\x63\x61\x72\x65\x74\x50\x6F\x73\x69\x74\x69\x6F\x6E\x46\x72\x6F\x6D\x50\x6F\x69\x6E\x74","\x6F\x66\x66\x73\x65\x74\x4E\x6F\x64\x65","\x73\x65\x74\x53\x74\x61\x72\x74","\x63\x61\x72\x65\x74\x52\x61\x6E\x67\x65\x46\x72\x6F\x6D\x50\x6F\x69\x6E\x74","\x63\x72\x65\x61\x74\x65\x54\x65\x78\x74\x52\x61\x6E\x67\x65","\x6D\x6F\x76\x65\x54\x6F\x50\x6F\x69\x6E\x74","\x64\x75\x70\x6C\x69\x63\x61\x74\x65","\x45\x6E\x64\x54\x6F\x45\x6E\x64","\x73\x65\x74\x45\x6E\x64\x50\x6F\x69\x6E\x74","\x3C\x73\x70\x61\x6E\x20\x69\x64\x3D\x22\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x2D\x6D\x61\x72\x6B\x65\x72\x2D\x31\x22\x3E","\x23\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x2D\x6D\x61\x72\x6B\x65\x72\x2D\x31","\x3C\x62\x72\x3E\x3C\x62\x72\x3E","\x70\x61\x73\x74\x65\x42\x65\x66\x6F\x72\x65","\x70\x61\x73\x74\x65\x50\x6C\x61\x69\x6E\x54\x65\x78\x74","\x74\x65\x78\x74\x43\x6F\x6E\x74\x65\x6E\x74","\x69\x6E\x6E\x65\x72\x54\x65\x78\x74","\x70\x61\x73\x74\x65\x49\x6E\x73\x65\x72\x74","\x70\x61\x73\x74\x65\x50\x72\x65","\x3C\x75\x6C\x3E\x3C\x6C\x69\x24\x32\x3C\x2F\x6C\x69\x3E","\x3C\x6C\x69\x24\x32\x3C\x2F\x6C\x69\x3E","\x3C\x6C\x69\x24\x32\x3C\x2F\x6C\x69\x3E\x3C\x2F\x75\x6C\x3E","\x3C\x75\x6C\x3E\x3C\x6C\x69\x24\x32\x3C\x2F\x6C\x69\x3E\x3C\x2F\x75\x6C\x3E","\x26\x6E\x62\x73\x70\x3B","\x24\x33","\x5B\x74\x64\x5D","\x5B\x74\x64\x20\x63\x6F\x6C\x73\x70\x61\x6E\x3D\x22\x24\x32\x22\x5D\x24\x34\x5B\x2F\x74\x64\x5D","\x5B\x74\x64\x20\x72\x6F\x77\x73\x70\x61\x6E\x3D\x22\x24\x32\x22\x5D\x24\x34\x5B\x2F\x74\x64\x5D","\x5B\x61\x20\x68\x72\x65\x66\x3D\x22\x24\x32\x22\x5D\x24\x34\x5B\x2F\x61\x5D","\x5B\x69\x66\x72\x61\x6D\x65\x24\x31\x5D\x24\x32\x5B\x2F\x69\x66\x72\x61\x6D\x65\x5D","\x5B\x76\x69\x64\x65\x6F\x24\x31\x5D\x24\x32\x5B\x2F\x76\x69\x64\x65\x6F\x5D","\x5B\x61\x75\x64\x69\x6F\x24\x31\x5D\x24\x32\x5B\x2F\x61\x75\x64\x69\x6F\x5D","\x5B\x65\x6D\x62\x65\x64\x24\x31\x5D\x24\x32\x5B\x2F\x65\x6D\x62\x65\x64\x5D","\x5B\x6F\x62\x6A\x65\x63\x74\x24\x31\x5D\x24\x32\x5B\x2F\x6F\x62\x6A\x65\x63\x74\x5D","\x5B\x70\x61\x72\x61\x6D\x24\x31\x5D","\x5B\x69\x6D\x67\x24\x31\x5D","\x3C\x24\x31\x3E","\x3C\x74\x64\x20\x63\x6F\x6C\x73\x70\x61\x6E\x3D\x22\x24\x31\x22\x3E\x24\x32\x3C\x2F\x74\x64\x3E","\x3C\x74\x64\x20\x72\x6F\x77\x73\x70\x61\x6E\x3D\x22\x24\x31\x22\x3E\x24\x32\x3C\x2F\x74\x64\x3E","\x3C\x74\x64\x3E\x26\x6E\x62\x73\x70\x3B\x3C\x2F\x74\x64\x3E","\x3C\x61\x20\x68\x72\x65\x66\x3D\x22\x24\x31\x22\x3E\x24\x32\x3C\x2F\x61\x3E","\x3C\x69\x66\x72\x61\x6D\x65\x24\x31\x3E\x24\x32\x3C\x2F\x69\x66\x72\x61\x6D\x65\x3E","\x3C\x76\x69\x64\x65\x6F\x24\x31\x3E\x24\x32\x3C\x2F\x76\x69\x64\x65\x6F\x3E","\x3C\x61\x75\x64\x69\x6F\x24\x31\x3E\x24\x32\x3C\x2F\x61\x75\x64\x69\x6F\x3E","\x3C\x65\x6D\x62\x65\x64\x24\x31\x3E\x24\x32\x3C\x2F\x65\x6D\x62\x65\x64\x3E","\x3C\x6F\x62\x6A\x65\x63\x74\x24\x31\x3E\x24\x32\x3C\x2F\x6F\x62\x6A\x65\x63\x74\x3E","\x3C\x70\x61\x72\x61\x6D\x24\x31\x3E","\x3C\x69\x6D\x67\x24\x31\x3E","\x3C\x70\x3E\x24\x32\x3C\x2F\x70\x3E","\x3C\x62\x72\x20\x2F\x3E","\x24\x31\x3C\x62\x72\x3E","\x3C\x74\x64\x24\x31\x3E\x24\x33\x3C\x2F\x74\x64\x3E","\x70\x61\x73\x74\x65\x43\x6C\x69\x70\x62\x6F\x61\x72\x64\x4D\x6F\x7A\x69\x6C\x6C\x61","\x3C\x69\x6D\x67","\x3C\x69\x6D\x67\x20\x64\x61\x74\x61\x2D\x6D\x6F\x7A\x69\x6C\x6C\x61\x2D\x70\x61\x73\x74\x65\x2D\x69\x6D\x61\x67\x65\x3D\x22","\x22\x20","\x3C\x6C\x69\x3E\x24\x31\x3C\x2F\x6C\x69\x3E","\x3C\x74\x64\x24\x31\x3E\x24\x32\x24\x34\x3C\x2F\x74\x64\x3E","\x3C\x74\x64\x24\x31\x3E\x24\x32\x24\x33\x3C\x2F\x74\x64\x3E","\x70\x61\x73\x74\x65\x41\x66\x74\x65\x72","\x70\x3A\x65\x6D\x70\x74\x79","\x70\x61\x73\x74\x65\x43\x6C\x69\x70\x62\x6F\x61\x72\x64\x55\x70\x6C\x6F\x61\x64\x4D\x6F\x7A\x69\x6C\x6C\x61","\x75\x70\x6C\x6F\x61\x64\x46\x69\x65\x6C\x64\x73","\x6F\x62\x6A\x65\x63\x74","\x23","\x69\x6D\x67\x5B\x64\x61\x74\x61\x2D\x6D\x6F\x7A\x69\x6C\x6C\x61\x2D\x70\x61\x73\x74\x65\x2D\x69\x6D\x61\x67\x65\x5D","\x2C","\x3A","\x3B","\x70\x61\x73\x74\x65\x43\x6C\x69\x70\x62\x6F\x61\x72\x64\x41\x70\x70\x65\x6E\x64\x46\x69\x65\x6C\x64\x73","\x63\x6C\x69\x70\x62\x6F\x61\x72\x64\x55\x70\x6C\x6F\x61\x64\x55\x72\x6C","\x70\x61\x72\x73\x65\x4A\x53\x4F\x4E","\x66\x69\x6C\x65\x6C\x69\x6E\x6B","\x64\x61\x74\x61\x2D\x6D\x6F\x7A\x69\x6C\x6C\x61\x2D\x70\x61\x73\x74\x65\x2D\x69\x6D\x61\x67\x65","\x72\x65\x73\x75\x6C\x74","\x3C\x69\x6D\x67\x20\x73\x72\x63\x3D\x22","\x22\x20\x69\x64\x3D\x22\x63\x6C\x69\x70\x62\x6F\x61\x72\x64\x2D\x69\x6D\x61\x67\x65\x2D\x6D\x61\x72\x6B\x65\x72\x22\x20\x2F\x3E","\x69\x6D\x67\x23\x63\x6C\x69\x70\x62\x6F\x61\x72\x64\x2D\x69\x6D\x61\x67\x65\x2D\x6D\x61\x72\x6B\x65\x72","\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x52\x65\x6D\x6F\x76\x65\x4D\x61\x72\x6B\x65\x72\x73","\x70\x6F\x70","\x6C\x69\x6E\x6B\x4F\x62\x73\x65\x72\x76\x65\x72","\x63\x6C\x69\x63\x6B\x2E\x72\x65\x64\x61\x63\x74\x6F\x72","\x6C\x69\x6E\x6B\x4F\x62\x73\x65\x72\x76\x65\x72\x54\x6F\x6F\x6C\x74\x69\x70\x43\x6C\x6F\x73\x65","\x75\x6E\x73\x65\x6C\x65\x63\x74\x61\x62\x6C\x65","\x69\x6D\x61\x67\x65\x52\x65\x73\x69\x7A\x65","\x3C\x73\x70\x61\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x6C\x69\x6E\x6B\x2D\x74\x6F\x6F\x6C\x74\x69\x70\x22\x3E\x3C\x2F\x73\x70\x61\x6E\x3E","\x68\x72\x65\x66","\x2E\x2E\x2E","\x3C\x61\x20\x68\x72\x65\x66\x3D\x22","\x22\x20\x74\x61\x72\x67\x65\x74\x3D\x22\x5F\x62\x6C\x61\x6E\x6B\x22\x3E","\x3C\x61\x20\x68\x72\x65\x66\x3D\x22\x23\x22\x3E","\x65\x64\x69\x74","\x20\x7C\x20","\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x6C\x69\x6E\x6B\x2D\x74\x6F\x6F\x6C\x74\x69\x70","\x72\x61\x6E\x67\x79","\x73\x65\x74\x43\x61\x72\x65\x74","\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x53\x65\x74","\x73\x65\x74\x45\x6E\x64","\x66\x6F\x72\x6D\x61\x74\x43\x68\x61\x6E\x67\x65\x54\x61\x67","\x65\x78\x74\x72\x61\x63\x74\x43\x6F\x6E\x74\x65\x6E\x74\x73","\x67\x65\x74\x54\x65\x78\x74\x4E\x6F\x64\x65\x73\x49\x6E","\x63\x68\x69\x6C\x64\x4E\x6F\x64\x65\x73","\x64\x69\x76\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x65\x64\x69\x74\x6F\x72","\x6E\x6F\x64\x65\x4E\x61\x6D\x65","\x74\x61\x67\x54\x65\x73\x74\x42\x6C\x6F\x63\x6B","\x69\x73\x43\x6F\x6C\x6C\x61\x70\x73\x65\x64","\x6E\x65\x78\x74\x4E\x6F\x64\x65","\x63\x6F\x6D\x6D\x6F\x6E\x41\x6E\x63\x65\x73\x74\x6F\x72\x43\x6F\x6E\x74\x61\x69\x6E\x65\x72","\x68\x61\x73\x43\x68\x69\x6C\x64\x4E\x6F\x64\x65\x73","\x6E\x65\x78\x74\x53\x69\x62\x6C\x69\x6E\x67","\x63\x6C\x6F\x6E\x65\x43\x6F\x6E\x74\x65\x6E\x74\x73","\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x43\x72\x65\x61\x74\x65\x4D\x61\x72\x6B\x65\x72","\x73\x61\x76\x65\x53\x65\x6C\x65\x63\x74\x69\x6F\x6E","\x3C\x73\x70\x61\x6E\x20\x69\x64\x3D\x22\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x2D\x6D\x61\x72\x6B\x65\x72\x2D\x31\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x2D\x6D\x61\x72\x6B\x65\x72\x22\x3E","\x3C\x73\x70\x61\x6E\x20\x69\x64\x3D\x22\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x2D\x6D\x61\x72\x6B\x65\x72\x2D\x32\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x2D\x6D\x61\x72\x6B\x65\x72\x22\x3E","\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x53\x65\x74\x4D\x61\x72\x6B\x65\x72","\x64\x65\x74\x61\x63\x68","\x73\x70\x61\x6E\x23\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x2D\x6D\x61\x72\x6B\x65\x72\x2D\x32","\x72\x65\x73\x74\x6F\x72\x65\x53\x65\x6C\x65\x63\x74\x69\x6F\x6E","\x73\x70\x61\x6E\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x2D\x6D\x61\x72\x6B\x65\x72","\x72\x65\x6D\x6F\x76\x65\x4D\x61\x72\x6B\x65\x72\x73","\x6D\x6F\x64\x61\x6C\x5F\x74\x61\x62\x6C\x65","\x74\x61\x62\x6C\x65\x49\x6E\x73\x65\x72\x74","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x73\x65\x72\x74\x5F\x74\x61\x62\x6C\x65\x5F\x62\x74\x6E","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x6C\x65\x5F\x72\x6F\x77\x73","\x6D\x6F\x64\x61\x6C\x49\x6E\x69\x74","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x6C\x65\x5F\x63\x6F\x6C\x75\x6D\x6E\x73","\x3C\x64\x69\x76\x3E\x3C\x2F\x64\x69\x76\x3E","\x72\x61\x6E\x64\x6F\x6D","\x66\x6C\x6F\x6F\x72","\x3C\x74\x61\x62\x6C\x65\x20\x69\x64\x3D\x22\x74\x61\x62\x6C\x65","\x22\x3E\x3C\x74\x62\x6F\x64\x79\x3E\x3C\x2F\x74\x62\x6F\x64\x79\x3E\x3C\x2F\x74\x61\x62\x6C\x65\x3E","\x3C\x2F\x74\x64\x3E","\x6D\x6F\x64\x61\x6C\x43\x6C\x6F\x73\x65","\x23\x74\x61\x62\x6C\x65","\x73\x70\x61\x6E\x23\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x2D\x6D\x61\x72\x6B\x65\x72\x2D\x31\x2C\x20\x69\x6E\x6C\x69\x6E\x65\x23\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x2D\x6D\x61\x72\x6B\x65\x72\x2D\x31","\x66\x69\x72\x73\x74","\x63\x65\x6C\x6C\x49\x6E\x64\x65\x78","\x65\x71","\x3C\x74\x68\x65\x61\x64\x3E\x3C\x2F\x74\x68\x65\x61\x64\x3E","\x74\x61\x62\x6C\x65\x41\x64\x64\x52\x6F\x77","\x74\x61\x62\x6C\x65\x41\x64\x64\x43\x6F\x6C\x75\x6D\x6E","\x6D\x6F\x64\x61\x6C\x5F\x76\x69\x64\x65\x6F","\x76\x69\x64\x65\x6F\x49\x6E\x73\x65\x72\x74","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x73\x65\x72\x74\x5F\x76\x69\x64\x65\x6F\x5F\x62\x74\x6E","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x73\x65\x72\x74\x5F\x76\x69\x64\x65\x6F\x5F\x61\x72\x65\x61","\x69\x6E\x73\x65\x72\x74\x5F\x6C\x69\x6E\x6B\x5F\x6E\x6F\x64\x65","\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6C\x69\x6E\x6B\x5F\x74\x65\x78\x74","\x6C\x6F\x63\x61\x74\x69\x6F\x6E","\x5E\x28\x68\x74\x74\x70\x7C\x66\x74\x70\x7C\x68\x74\x74\x70\x73\x29\x3A\x2F\x2F","\x68\x6F\x73\x74","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x73","\x6C\x69\x6E\x6B\x45\x6D\x61\x69\x6C","\x6C\x69\x6E\x6B\x41\x6E\x63\x68\x6F\x72","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6C\x69\x6E\x6B\x5F\x75\x72\x6C","\x6D\x61\x69\x6C\x74\x6F\x3A","\x6D\x6F\x64\x61\x6C\x53\x65\x74\x54\x61\x62","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x5F\x73\x65\x6C\x65\x63\x74\x65\x64","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6C\x69\x6E\x6B\x5F\x6D\x61\x69\x6C\x74\x6F","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6C\x69\x6E\x6B\x5F\x61\x6E\x63\x68\x6F\x72","\x5F\x62\x6C\x61\x6E\x6B","\x63\x68\x65\x63\x6B\x65\x64","\x70\x72\x6F\x70","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6C\x69\x6E\x6B\x5F\x62\x6C\x61\x6E\x6B","\x6C\x69\x6E\x6B\x49\x6E\x73\x65\x72\x74\x50\x72\x65\x73\x73\x65\x64","\x6C\x69\x6E\x6B\x50\x72\x6F\x63\x65\x73\x73","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x73\x65\x72\x74\x5F\x6C\x69\x6E\x6B\x5F\x62\x74\x6E","\x6D\x6F\x64\x61\x6C\x5F\x6C\x69\x6E\x6B","\x31","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6C\x69\x6E\x6B\x5F\x75\x72\x6C\x5F\x74\x65\x78\x74","\x20\x74\x61\x72\x67\x65\x74\x3D\x22\x5F\x62\x6C\x61\x6E\x6B\x22","\x28\x28\x78\x6E\x2D\x2D\x29\x3F\x5B\x61\x2D\x7A\x30\x2D\x39\x5D\x2B\x28\x2D\x5B\x61\x2D\x7A\x30\x2D\x39\x5D\x2B\x29\x2A\x2E\x29\x2B\x5B\x61\x2D\x7A\x5D\x7B\x32\x2C\x7D","\x5E","\x32","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6C\x69\x6E\x6B\x5F\x6D\x61\x69\x6C\x74\x6F\x5F\x74\x65\x78\x74","\x33","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6C\x69\x6E\x6B\x5F\x61\x6E\x63\x68\x6F\x72\x5F\x74\x65\x78\x74","\x6C\x69\x6E\x6B\x49\x6E\x73\x65\x72\x74","\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x61\x64\x64\x65\x64\x2D\x6C\x69\x6E\x6B","\x61\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x61\x64\x64\x65\x64\x2D\x6C\x69\x6E\x6B","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x69\x6C\x65\x6E\x61\x6D\x65","\x69\x73\x49\x50\x61\x64","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x69\x6C\x65","\x66\x69\x6C\x65\x43\x61\x6C\x6C\x62\x61\x63\x6B","\x66\x69\x6C\x65\x55\x70\x6C\x6F\x61\x64\x45\x72\x72\x6F\x72","\x66\x69\x6C\x65\x55\x70\x6C\x6F\x61\x64\x50\x61\x72\x61\x6D","\x64\x72\x61\x67\x75\x70\x6C\x6F\x61\x64\x49\x6E\x69\x74","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x69\x6C\x65","\x75\x70\x6C\x6F\x61\x64\x49\x6E\x69\x74","\x6D\x6F\x64\x61\x6C\x5F\x66\x69\x6C\x65","\x66\x69\x6C\x65\x6E\x61\x6D\x65","\x22\x20\x69\x64\x3D\x22\x66\x69\x6C\x65\x6C\x69\x6E\x6B\x2D\x6D\x61\x72\x6B\x65\x72\x22\x3E","\x63\x68\x72\x6F\x6D\x65","\x61\x23\x66\x69\x6C\x65\x6C\x69\x6E\x6B\x2D\x6D\x61\x72\x6B\x65\x72","\x69\x6D\x61\x67\x65\x47\x65\x74\x4A\x73\x6F\x6E","\x66\x6F\x6C\x64\x65\x72","\x69\x73\x45\x6D\x70\x74\x79\x4F\x62\x6A\x65\x63\x74","\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x66\x6F\x6C\x64\x65\x72","\x74\x68\x75\x6D\x62","\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x66\x6F\x6C\x64\x65\x72\x20\x72\x65\x64\x61\x63\x74\x6F\x72\x66\x6F\x6C\x64\x65\x72","\x22\x20\x72\x65\x6C\x3D\x22","\x22\x20\x74\x69\x74\x6C\x65\x3D\x22","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6D\x61\x67\x65\x5F\x62\x6F\x78","\x69\x6D\x61\x67\x65\x54\x68\x75\x6D\x62\x43\x6C\x69\x63\x6B","\x3C\x73\x65\x6C\x65\x63\x74\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6D\x61\x67\x65\x5F\x62\x6F\x78\x5F\x73\x65\x6C\x65\x63\x74\x22\x3E","\x3C\x6F\x70\x74\x69\x6F\x6E\x20\x76\x61\x6C\x75\x65\x3D\x22","\x3C\x2F\x6F\x70\x74\x69\x6F\x6E\x3E","\x67\x65\x74\x4A\x53\x4F\x4E","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x6D\x6F\x64\x61\x6C\x2D\x74\x61\x62\x2D\x32","\x69\x6D\x61\x67\x65\x43\x61\x6C\x6C\x62\x61\x63\x6B","\x69\x6D\x61\x67\x65\x55\x70\x6C\x6F\x61\x64\x45\x72\x72\x6F\x72","\x63\x68\x61\x6E\x67\x65\x2E\x72\x65\x64\x61\x63\x74\x6F\x72","\x73\x33\x68\x61\x6E\x64\x6C\x65\x46\x69\x6C\x65\x53\x65\x6C\x65\x63\x74","\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x33","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x6D\x6F\x64\x61\x6C\x2D\x74\x61\x62\x2D\x31","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x73\x5F\x61\x63\x74","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x32","\x69\x6D\x61\x67\x65\x54\x61\x62\x4C\x69\x6E\x6B","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x74\x61\x62\x2D\x63\x6F\x6E\x74\x72\x6F\x6C\x2D\x33","\x69\x6D\x61\x67\x65\x43\x61\x6C\x6C\x62\x61\x63\x6B\x4C\x69\x6E\x6B","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x75\x70\x6C\x6F\x61\x64\x5F\x62\x74\x6E","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x69\x6C\x65\x5F\x6C\x69\x6E\x6B","\x6D\x6F\x64\x61\x6C\x5F\x69\x6D\x61\x67\x65","\x61\x6C\x74","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x69\x6C\x65\x5F\x61\x6C\x74","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6D\x61\x67\x65\x5F\x65\x64\x69\x74\x5F\x73\x72\x63","\x64\x69\x73\x70\x6C\x61\x79","\x62\x6C\x6F\x63\x6B","\x66\x6C\x6F\x61\x74","\x6E\x6F\x6E\x65","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x6F\x72\x6D\x5F\x69\x6D\x61\x67\x65\x5F\x61\x6C\x69\x67\x6E","\x69\x6D\x61\x67\x65\x52\x65\x6D\x6F\x76\x65","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6D\x61\x67\x65\x5F\x64\x65\x6C\x65\x74\x65\x5F\x62\x74\x6E","\x69\x6D\x61\x67\x65\x53\x61\x76\x65","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x53\x61\x76\x65\x42\x74\x6E","\x6D\x6F\x64\x61\x6C\x5F\x69\x6D\x61\x67\x65\x5F\x65\x64\x69\x74","\x69\x6D\x61\x67\x65\x44\x65\x6C\x65\x74\x65","\x30\x20","\x69\x6D\x61\x67\x65\x46\x6C\x6F\x61\x74\x4D\x61\x72\x67\x69\x6E","\x20\x30","\x30\x20\x30\x20","\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x69\x6D\x61\x67\x65\x2D\x62\x6F\x78","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x69\x6D\x61\x67\x65\x2D\x62\x6F\x78","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x69\x6D\x61\x67\x65\x2D\x65\x64\x69\x74\x74\x65\x72\x2C\x20\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x69\x6D\x61\x67\x65\x2D\x72\x65\x73\x69\x7A\x65\x72","\x6D\x61\x72\x67\x69\x6E\x54\x6F\x70","\x6D\x61\x72\x67\x69\x6E\x42\x6F\x74\x74\x6F\x6D","\x6D\x61\x72\x67\x69\x6E\x4C\x65\x66\x74","\x6D\x61\x72\x67\x69\x6E\x52\x69\x67\x68\x74","\x6D\x61\x72\x67\x69\x6E","\x6F\x70\x61\x63\x69\x74\x79","\x63\x6C\x69\x63\x6B\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x69\x6D\x61\x67\x65\x2D\x72\x65\x73\x69\x7A\x65\x2D\x68\x69\x64\x65","\x6B\x65\x79\x64\x6F\x77\x6E\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x69\x6D\x61\x67\x65\x2D\x64\x65\x6C\x65\x74\x65","\x64\x72\x61\x67\x73\x74\x61\x72\x74","\x64\x72\x6F\x70\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x69\x6D\x61\x67\x65\x2D\x69\x6E\x73\x69\x64\x65\x2D\x64\x72\x6F\x70","\x69\x6D\x61\x67\x65\x52\x65\x73\x69\x7A\x65\x43\x6F\x6E\x74\x72\x6F\x6C\x73","\x70\x61\x67\x65\x58","\x72\x6F\x75\x6E\x64","\x70\x61\x67\x65\x59","\x6D\x6F\x75\x73\x65\x6D\x6F\x76\x65","\x2D\x37\x70\x78","\x2D\x31\x33\x70\x78","\x39\x70\x78","\x33\x70\x78\x20\x35\x70\x78","\x69\x6D\x61\x67\x65\x45\x64\x69\x74\x74\x65\x72","\x2D\x31\x31\x70\x78","\x2D\x31\x38\x70\x78","\x31\x31\x70\x78","\x37\x70\x78\x20\x31\x30\x70\x78","\x3C\x73\x70\x61\x6E\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x69\x6D\x61\x67\x65\x2D\x62\x6F\x78\x22\x20\x64\x61\x74\x61\x2D\x72\x65\x64\x61\x63\x74\x6F\x72\x3D\x22\x76\x65\x72\x69\x66\x69\x65\x64\x22\x3E","\x69\x6E\x6C\x69\x6E\x65\x2D\x62\x6C\x6F\x63\x6B","\x31\x70\x78\x20\x64\x61\x73\x68\x65\x64\x20\x72\x67\x62\x61\x28\x30\x2C\x20\x30\x2C\x20\x30\x2C\x20\x2E\x36\x29","\x3C\x73\x70\x61\x6E\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x69\x6D\x61\x67\x65\x2D\x65\x64\x69\x74\x74\x65\x72\x22\x20\x64\x61\x74\x61\x2D\x72\x65\x64\x61\x63\x74\x6F\x72\x3D\x22\x76\x65\x72\x69\x66\x69\x65\x64\x22\x3E","\x35\x30\x25","\x23\x30\x30\x30","\x23\x66\x66\x66","\x70\x6F\x69\x6E\x74\x65\x72","\x69\x6D\x61\x67\x65\x45\x64\x69\x74","\x3C\x73\x70\x61\x6E\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x69\x6D\x61\x67\x65\x2D\x72\x65\x73\x69\x7A\x65\x72\x22\x20\x64\x61\x74\x61\x2D\x72\x65\x64\x61\x63\x74\x6F\x72\x3D\x22\x76\x65\x72\x69\x66\x69\x65\x64\x22\x3E\x3C\x2F\x73\x70\x61\x6E\x3E","\x6E\x77\x2D\x72\x65\x73\x69\x7A\x65","\x2D\x34\x70\x78","\x2D\x35\x70\x78","\x31\x70\x78\x20\x73\x6F\x6C\x69\x64\x20\x23\x66\x66\x66","\x38\x70\x78","\x3C\x69\x6D\x67\x20\x69\x64\x3D\x22\x69\x6D\x61\x67\x65\x2D\x6D\x61\x72\x6B\x65\x72\x22\x20\x73\x72\x63\x3D\x22","\x72\x65\x6C","\x22\x20\x61\x6C\x74\x3D\x22","\x69\x6D\x61\x67\x65\x49\x6E\x73\x65\x72\x74","\x69\x6D\x67\x23\x69\x6D\x61\x67\x65\x2D\x6D\x61\x72\x6B\x65\x72","\x3C\x73\x65\x63\x74\x69\x6F\x6E\x3E\x3C\x64\x69\x76\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x70\x72\x6F\x67\x72\x65\x73\x73\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x70\x72\x6F\x67\x72\x65\x73\x73\x2D\x69\x6E\x6C\x69\x6E\x65\x22\x20\x73\x74\x79\x6C\x65\x3D\x22\x64\x69\x73\x70\x6C\x61\x79\x3A\x20\x6E\x6F\x6E\x65\x3B\x22\x3E\x3C\x73\x70\x61\x6E\x3E\x3C\x2F\x73\x70\x61\x6E\x3E\x3C\x2F\x64\x69\x76\x3E\x3C\x66\x6F\x72\x6D\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x55\x70\x6C\x6F\x61\x64\x46\x69\x6C\x65\x46\x6F\x72\x6D\x22\x20\x6D\x65\x74\x68\x6F\x64\x3D\x22\x70\x6F\x73\x74\x22\x20\x61\x63\x74\x69\x6F\x6E\x3D\x22\x22\x20\x65\x6E\x63\x74\x79\x70\x65\x3D\x22\x6D\x75\x6C\x74\x69\x70\x61\x72\x74\x2F\x66\x6F\x72\x6D\x2D\x64\x61\x74\x61\x22\x3E\x3C\x6C\x61\x62\x65\x6C\x3E","\x3C\x2F\x6C\x61\x62\x65\x6C\x3E\x3C\x69\x6E\x70\x75\x74\x20\x74\x79\x70\x65\x3D\x22\x74\x65\x78\x74\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x69\x6C\x65\x6E\x61\x6D\x65\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x70\x75\x74\x22\x20\x2F\x3E\x3C\x64\x69\x76\x20\x73\x74\x79\x6C\x65\x3D\x22\x6D\x61\x72\x67\x69\x6E\x2D\x74\x6F\x70\x3A\x20\x37\x70\x78\x3B\x22\x3E\x3C\x69\x6E\x70\x75\x74\x20\x74\x79\x70\x65\x3D\x22\x66\x69\x6C\x65\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x69\x6C\x65\x22\x20\x6E\x61\x6D\x65\x3D\x22","\x22\x20\x2F\x3E\x3C\x2F\x64\x69\x76\x3E\x3C\x2F\x66\x6F\x72\x6D\x3E\x3C\x2F\x73\x65\x63\x74\x69\x6F\x6E\x3E","\x3C\x73\x65\x63\x74\x69\x6F\x6E\x3E\x3C\x6C\x61\x62\x65\x6C\x3E","\x3C\x2F\x6C\x61\x62\x65\x6C\x3E\x3C\x69\x6E\x70\x75\x74\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x69\x6C\x65\x5F\x61\x6C\x74\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x70\x75\x74\x22\x20\x2F\x3E\x3C\x6C\x61\x62\x65\x6C\x3E","\x3C\x2F\x6C\x61\x62\x65\x6C\x3E\x3C\x69\x6E\x70\x75\x74\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x69\x6C\x65\x5F\x6C\x69\x6E\x6B\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x70\x75\x74\x22\x20\x2F\x3E\x3C\x6C\x61\x62\x65\x6C\x3E\x3C\x69\x6E\x70\x75\x74\x20\x74\x79\x70\x65\x3D\x22\x63\x68\x65\x63\x6B\x62\x6F\x78\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6C\x69\x6E\x6B\x5F\x62\x6C\x61\x6E\x6B\x22\x3E\x20","\x6C\x69\x6E\x6B\x5F\x6E\x65\x77\x5F\x74\x61\x62","\x3C\x2F\x6C\x61\x62\x65\x6C\x3E\x3C\x6C\x61\x62\x65\x6C\x3E","\x69\x6D\x61\x67\x65\x5F\x70\x6F\x73\x69\x74\x69\x6F\x6E","\x3C\x2F\x6C\x61\x62\x65\x6C\x3E\x3C\x73\x65\x6C\x65\x63\x74\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x6F\x72\x6D\x5F\x69\x6D\x61\x67\x65\x5F\x61\x6C\x69\x67\x6E\x22\x3E\x3C\x6F\x70\x74\x69\x6F\x6E\x20\x76\x61\x6C\x75\x65\x3D\x22\x6E\x6F\x6E\x65\x22\x3E","\x3C\x2F\x6F\x70\x74\x69\x6F\x6E\x3E\x3C\x6F\x70\x74\x69\x6F\x6E\x20\x76\x61\x6C\x75\x65\x3D\x22\x6C\x65\x66\x74\x22\x3E","\x3C\x2F\x6F\x70\x74\x69\x6F\x6E\x3E\x3C\x6F\x70\x74\x69\x6F\x6E\x20\x76\x61\x6C\x75\x65\x3D\x22\x63\x65\x6E\x74\x65\x72\x22\x3E","\x3C\x2F\x6F\x70\x74\x69\x6F\x6E\x3E\x3C\x6F\x70\x74\x69\x6F\x6E\x20\x76\x61\x6C\x75\x65\x3D\x22\x72\x69\x67\x68\x74\x22\x3E","\x3C\x2F\x6F\x70\x74\x69\x6F\x6E\x3E\x3C\x2F\x73\x65\x6C\x65\x63\x74\x3E\x3C\x2F\x73\x65\x63\x74\x69\x6F\x6E\x3E\x3C\x66\x6F\x6F\x74\x65\x72\x3E\x3C\x64\x69\x76\x20\x73\x74\x79\x6C\x65\x3D\x22\x77\x69\x64\x74\x68\x3A\x20\x33\x33\x25\x3B\x22\x3E\x3C\x62\x75\x74\x74\x6F\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x64\x65\x6C\x65\x74\x65\x5F\x62\x74\x6E\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6D\x61\x67\x65\x5F\x64\x65\x6C\x65\x74\x65\x5F\x62\x74\x6E\x22\x3E","\x5F\x64\x65\x6C\x65\x74\x65","\x3C\x2F\x62\x75\x74\x74\x6F\x6E\x3E\x3C\x2F\x64\x69\x76\x3E\x3C\x64\x69\x76\x20\x73\x74\x79\x6C\x65\x3D\x22\x77\x69\x64\x74\x68\x3A\x20\x33\x33\x25\x3B\x22\x3E\x3C\x62\x75\x74\x74\x6F\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x62\x74\x6E\x5F\x6D\x6F\x64\x61\x6C\x5F\x63\x6C\x6F\x73\x65\x22\x3E","\x63\x61\x6E\x63\x65\x6C","\x3C\x2F\x62\x75\x74\x74\x6F\x6E\x3E\x3C\x2F\x64\x69\x76\x3E\x3C\x64\x69\x76\x20\x73\x74\x79\x6C\x65\x3D\x22\x77\x69\x64\x74\x68\x3A\x20\x33\x34\x25\x3B\x20\x66\x6C\x6F\x61\x74\x3A\x20\x72\x69\x67\x68\x74\x3B\x22\x3E\x3C\x62\x75\x74\x74\x6F\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x61\x63\x74\x69\x6F\x6E\x5F\x62\x74\x6E\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x53\x61\x76\x65\x42\x74\x6E\x22\x3E","\x73\x61\x76\x65","\x3C\x2F\x62\x75\x74\x74\x6F\x6E\x3E\x3C\x2F\x64\x69\x76\x3E\x3C\x2F\x66\x6F\x6F\x74\x65\x72\x3E","\x3C\x73\x65\x63\x74\x69\x6F\x6E\x3E\x3C\x64\x69\x76\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x73\x22\x3E\x3C\x61\x20\x68\x72\x65\x66\x3D\x22\x23\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x74\x61\x62\x2D\x63\x6F\x6E\x74\x72\x6F\x6C\x2D\x31\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x73\x5F\x61\x63\x74\x22\x3E","\x75\x70\x6C\x6F\x61\x64","\x3C\x2F\x61\x3E\x3C\x61\x20\x68\x72\x65\x66\x3D\x22\x23\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x74\x61\x62\x2D\x63\x6F\x6E\x74\x72\x6F\x6C\x2D\x32\x22\x3E","\x63\x68\x6F\x6F\x73\x65","\x3C\x2F\x61\x3E\x3C\x61\x20\x68\x72\x65\x66\x3D\x22\x23\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x74\x61\x62\x2D\x63\x6F\x6E\x74\x72\x6F\x6C\x2D\x33\x22\x3E","\x3C\x2F\x61\x3E\x3C\x2F\x64\x69\x76\x3E\x3C\x64\x69\x76\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x70\x72\x6F\x67\x72\x65\x73\x73\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x70\x72\x6F\x67\x72\x65\x73\x73\x2D\x69\x6E\x6C\x69\x6E\x65\x22\x20\x73\x74\x79\x6C\x65\x3D\x22\x64\x69\x73\x70\x6C\x61\x79\x3A\x20\x6E\x6F\x6E\x65\x3B\x22\x3E\x3C\x73\x70\x61\x6E\x3E\x3C\x2F\x73\x70\x61\x6E\x3E\x3C\x2F\x64\x69\x76\x3E\x3C\x66\x6F\x72\x6D\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x49\x6E\x73\x65\x72\x74\x49\x6D\x61\x67\x65\x46\x6F\x72\x6D\x22\x20\x6D\x65\x74\x68\x6F\x64\x3D\x22\x70\x6F\x73\x74\x22\x20\x61\x63\x74\x69\x6F\x6E\x3D\x22\x22\x20\x65\x6E\x63\x74\x79\x70\x65\x3D\x22\x6D\x75\x6C\x74\x69\x70\x61\x72\x74\x2F\x66\x6F\x72\x6D\x2D\x64\x61\x74\x61\x22\x3E\x3C\x64\x69\x76\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x31\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x22\x3E\x3C\x69\x6E\x70\x75\x74\x20\x74\x79\x70\x65\x3D\x22\x66\x69\x6C\x65\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x69\x6C\x65\x22\x20\x6E\x61\x6D\x65\x3D\x22","\x22\x20\x2F\x3E\x3C\x2F\x64\x69\x76\x3E\x3C\x64\x69\x76\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x32\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x22\x20\x73\x74\x79\x6C\x65\x3D\x22\x64\x69\x73\x70\x6C\x61\x79\x3A\x20\x6E\x6F\x6E\x65\x3B\x22\x3E\x3C\x64\x69\x76\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6D\x61\x67\x65\x5F\x62\x6F\x78\x22\x3E\x3C\x2F\x64\x69\x76\x3E\x3C\x2F\x64\x69\x76\x3E\x3C\x2F\x66\x6F\x72\x6D\x3E\x3C\x64\x69\x76\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x33\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x22\x20\x73\x74\x79\x6C\x65\x3D\x22\x64\x69\x73\x70\x6C\x61\x79\x3A\x20\x6E\x6F\x6E\x65\x3B\x22\x3E\x3C\x6C\x61\x62\x65\x6C\x3E","\x69\x6D\x61\x67\x65\x5F\x77\x65\x62\x5F\x6C\x69\x6E\x6B","\x3C\x2F\x6C\x61\x62\x65\x6C\x3E\x3C\x69\x6E\x70\x75\x74\x20\x74\x79\x70\x65\x3D\x22\x74\x65\x78\x74\x22\x20\x6E\x61\x6D\x65\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x69\x6C\x65\x5F\x6C\x69\x6E\x6B\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x69\x6C\x65\x5F\x6C\x69\x6E\x6B\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x70\x75\x74\x22\x20\x20\x2F\x3E\x3C\x62\x72\x3E\x3C\x62\x72\x3E\x3C\x2F\x64\x69\x76\x3E\x3C\x2F\x73\x65\x63\x74\x69\x6F\x6E\x3E\x3C\x66\x6F\x6F\x74\x65\x72\x3E\x3C\x64\x69\x76\x20\x73\x74\x79\x6C\x65\x3D\x22\x77\x69\x64\x74\x68\x3A\x20\x35\x30\x25\x3B\x22\x3E\x3C\x62\x75\x74\x74\x6F\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x62\x74\x6E\x5F\x6D\x6F\x64\x61\x6C\x5F\x63\x6C\x6F\x73\x65\x22\x3E","\x3C\x2F\x62\x75\x74\x74\x6F\x6E\x3E\x3C\x2F\x64\x69\x76\x3E\x3C\x64\x69\x76\x20\x73\x74\x79\x6C\x65\x3D\x22\x77\x69\x64\x74\x68\x3A\x20\x35\x30\x25\x3B\x22\x3E\x3C\x62\x75\x74\x74\x6F\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x61\x63\x74\x69\x6F\x6E\x5F\x62\x74\x6E\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x75\x70\x6C\x6F\x61\x64\x5F\x62\x74\x6E\x22\x3E","\x69\x6E\x73\x65\x72\x74","\x3C\x73\x65\x63\x74\x69\x6F\x6E\x3E\x3C\x66\x6F\x72\x6D\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x49\x6E\x73\x65\x72\x74\x4C\x69\x6E\x6B\x46\x6F\x72\x6D\x22\x20\x6D\x65\x74\x68\x6F\x64\x3D\x22\x70\x6F\x73\x74\x22\x20\x61\x63\x74\x69\x6F\x6E\x3D\x22\x22\x3E\x3C\x64\x69\x76\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x73\x22\x3E\x3C\x61\x20\x68\x72\x65\x66\x3D\x22\x23\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x73\x5F\x61\x63\x74\x22\x3E\x55\x52\x4C\x3C\x2F\x61\x3E\x3C\x61\x20\x68\x72\x65\x66\x3D\x22\x23\x22\x3E\x45\x6D\x61\x69\x6C\x3C\x2F\x61\x3E\x3C\x61\x20\x68\x72\x65\x66\x3D\x22\x23\x22\x3E","\x61\x6E\x63\x68\x6F\x72","\x3C\x2F\x61\x3E\x3C\x2F\x64\x69\x76\x3E\x3C\x69\x6E\x70\x75\x74\x20\x74\x79\x70\x65\x3D\x22\x68\x69\x64\x64\x65\x6E\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x5F\x73\x65\x6C\x65\x63\x74\x65\x64\x22\x20\x76\x61\x6C\x75\x65\x3D\x22\x31\x22\x20\x2F\x3E\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x31\x22\x3E\x3C\x6C\x61\x62\x65\x6C\x3E\x55\x52\x4C\x3C\x2F\x6C\x61\x62\x65\x6C\x3E\x3C\x69\x6E\x70\x75\x74\x20\x74\x79\x70\x65\x3D\x22\x74\x65\x78\x74\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6C\x69\x6E\x6B\x5F\x75\x72\x6C\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x70\x75\x74\x22\x20\x20\x2F\x3E\x3C\x6C\x61\x62\x65\x6C\x3E","\x3C\x2F\x6C\x61\x62\x65\x6C\x3E\x3C\x69\x6E\x70\x75\x74\x20\x74\x79\x70\x65\x3D\x22\x74\x65\x78\x74\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x70\x75\x74\x20\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6C\x69\x6E\x6B\x5F\x74\x65\x78\x74\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6C\x69\x6E\x6B\x5F\x75\x72\x6C\x5F\x74\x65\x78\x74\x22\x20\x2F\x3E\x3C\x6C\x61\x62\x65\x6C\x3E\x3C\x69\x6E\x70\x75\x74\x20\x74\x79\x70\x65\x3D\x22\x63\x68\x65\x63\x6B\x62\x6F\x78\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6C\x69\x6E\x6B\x5F\x62\x6C\x61\x6E\x6B\x22\x3E\x20","\x3C\x2F\x6C\x61\x62\x65\x6C\x3E\x3C\x2F\x64\x69\x76\x3E\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x32\x22\x20\x73\x74\x79\x6C\x65\x3D\x22\x64\x69\x73\x70\x6C\x61\x79\x3A\x20\x6E\x6F\x6E\x65\x3B\x22\x3E\x3C\x6C\x61\x62\x65\x6C\x3E\x45\x6D\x61\x69\x6C\x3C\x2F\x6C\x61\x62\x65\x6C\x3E\x3C\x69\x6E\x70\x75\x74\x20\x74\x79\x70\x65\x3D\x22\x74\x65\x78\x74\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6C\x69\x6E\x6B\x5F\x6D\x61\x69\x6C\x74\x6F\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x70\x75\x74\x22\x20\x2F\x3E\x3C\x6C\x61\x62\x65\x6C\x3E","\x3C\x2F\x6C\x61\x62\x65\x6C\x3E\x3C\x69\x6E\x70\x75\x74\x20\x74\x79\x70\x65\x3D\x22\x74\x65\x78\x74\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x70\x75\x74\x20\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6C\x69\x6E\x6B\x5F\x74\x65\x78\x74\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6C\x69\x6E\x6B\x5F\x6D\x61\x69\x6C\x74\x6F\x5F\x74\x65\x78\x74\x22\x20\x2F\x3E\x3C\x2F\x64\x69\x76\x3E\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x33\x22\x20\x73\x74\x79\x6C\x65\x3D\x22\x64\x69\x73\x70\x6C\x61\x79\x3A\x20\x6E\x6F\x6E\x65\x3B\x22\x3E\x3C\x6C\x61\x62\x65\x6C\x3E","\x3C\x2F\x6C\x61\x62\x65\x6C\x3E\x3C\x69\x6E\x70\x75\x74\x20\x74\x79\x70\x65\x3D\x22\x74\x65\x78\x74\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x70\x75\x74\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6C\x69\x6E\x6B\x5F\x61\x6E\x63\x68\x6F\x72\x22\x20\x20\x2F\x3E\x3C\x6C\x61\x62\x65\x6C\x3E","\x3C\x2F\x6C\x61\x62\x65\x6C\x3E\x3C\x69\x6E\x70\x75\x74\x20\x74\x79\x70\x65\x3D\x22\x74\x65\x78\x74\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x70\x75\x74\x20\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6C\x69\x6E\x6B\x5F\x74\x65\x78\x74\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6C\x69\x6E\x6B\x5F\x61\x6E\x63\x68\x6F\x72\x5F\x74\x65\x78\x74\x22\x20\x2F\x3E\x3C\x2F\x64\x69\x76\x3E\x3C\x2F\x66\x6F\x72\x6D\x3E\x3C\x2F\x73\x65\x63\x74\x69\x6F\x6E\x3E\x3C\x66\x6F\x6F\x74\x65\x72\x3E\x3C\x64\x69\x76\x20\x73\x74\x79\x6C\x65\x3D\x22\x77\x69\x64\x74\x68\x3A\x20\x35\x30\x25\x3B\x22\x3E\x3C\x62\x75\x74\x74\x6F\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x62\x74\x6E\x5F\x6D\x6F\x64\x61\x6C\x5F\x63\x6C\x6F\x73\x65\x22\x3E","\x3C\x2F\x62\x75\x74\x74\x6F\x6E\x3E\x3C\x2F\x64\x69\x76\x3E\x3C\x64\x69\x76\x20\x73\x74\x79\x6C\x65\x3D\x22\x77\x69\x64\x74\x68\x3A\x20\x35\x30\x25\x3B\x22\x3E\x3C\x62\x75\x74\x74\x6F\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x61\x63\x74\x69\x6F\x6E\x5F\x62\x74\x6E\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x73\x65\x72\x74\x5F\x6C\x69\x6E\x6B\x5F\x62\x74\x6E\x22\x3E","\x72\x6F\x77\x73","\x3C\x2F\x6C\x61\x62\x65\x6C\x3E\x3C\x69\x6E\x70\x75\x74\x20\x74\x79\x70\x65\x3D\x22\x74\x65\x78\x74\x22\x20\x73\x69\x7A\x65\x3D\x22\x35\x22\x20\x76\x61\x6C\x75\x65\x3D\x22\x32\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x6C\x65\x5F\x72\x6F\x77\x73\x22\x20\x2F\x3E\x3C\x6C\x61\x62\x65\x6C\x3E","\x63\x6F\x6C\x75\x6D\x6E\x73","\x3C\x2F\x6C\x61\x62\x65\x6C\x3E\x3C\x69\x6E\x70\x75\x74\x20\x74\x79\x70\x65\x3D\x22\x74\x65\x78\x74\x22\x20\x73\x69\x7A\x65\x3D\x22\x35\x22\x20\x76\x61\x6C\x75\x65\x3D\x22\x33\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x6C\x65\x5F\x63\x6F\x6C\x75\x6D\x6E\x73\x22\x20\x2F\x3E\x3C\x2F\x73\x65\x63\x74\x69\x6F\x6E\x3E\x3C\x66\x6F\x6F\x74\x65\x72\x3E\x3C\x64\x69\x76\x20\x73\x74\x79\x6C\x65\x3D\x22\x77\x69\x64\x74\x68\x3A\x20\x35\x30\x25\x3B\x22\x3E\x3C\x62\x75\x74\x74\x6F\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x62\x74\x6E\x5F\x6D\x6F\x64\x61\x6C\x5F\x63\x6C\x6F\x73\x65\x22\x3E","\x3C\x2F\x62\x75\x74\x74\x6F\x6E\x3E\x3C\x2F\x64\x69\x76\x3E\x3C\x64\x69\x76\x20\x73\x74\x79\x6C\x65\x3D\x22\x77\x69\x64\x74\x68\x3A\x20\x35\x30\x25\x3B\x22\x3E\x3C\x62\x75\x74\x74\x6F\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x61\x63\x74\x69\x6F\x6E\x5F\x62\x74\x6E\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x73\x65\x72\x74\x5F\x74\x61\x62\x6C\x65\x5F\x62\x74\x6E\x22\x3E","\x3C\x73\x65\x63\x74\x69\x6F\x6E\x3E\x3C\x66\x6F\x72\x6D\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x49\x6E\x73\x65\x72\x74\x56\x69\x64\x65\x6F\x46\x6F\x72\x6D\x22\x3E\x3C\x6C\x61\x62\x65\x6C\x3E","\x76\x69\x64\x65\x6F\x5F\x68\x74\x6D\x6C\x5F\x63\x6F\x64\x65","\x3C\x2F\x6C\x61\x62\x65\x6C\x3E\x3C\x74\x65\x78\x74\x61\x72\x65\x61\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x73\x65\x72\x74\x5F\x76\x69\x64\x65\x6F\x5F\x61\x72\x65\x61\x22\x20\x73\x74\x79\x6C\x65\x3D\x22\x77\x69\x64\x74\x68\x3A\x20\x39\x39\x25\x3B\x20\x68\x65\x69\x67\x68\x74\x3A\x20\x31\x36\x30\x70\x78\x3B\x22\x3E\x3C\x2F\x74\x65\x78\x74\x61\x72\x65\x61\x3E\x3C\x2F\x66\x6F\x72\x6D\x3E\x3C\x2F\x73\x65\x63\x74\x69\x6F\x6E\x3E\x3C\x66\x6F\x6F\x74\x65\x72\x3E\x3C\x64\x69\x76\x20\x73\x74\x79\x6C\x65\x3D\x22\x77\x69\x64\x74\x68\x3A\x20\x35\x30\x25\x3B\x22\x3E\x3C\x62\x75\x74\x74\x6F\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x62\x74\x6E\x5F\x6D\x6F\x64\x61\x6C\x5F\x63\x6C\x6F\x73\x65\x22\x3E","\x3C\x2F\x62\x75\x74\x74\x6F\x6E\x3E\x3C\x2F\x64\x69\x76\x3E\x3C\x64\x69\x76\x20\x73\x74\x79\x6C\x65\x3D\x22\x77\x69\x64\x74\x68\x3A\x20\x35\x30\x25\x3B\x22\x3E\x3C\x62\x75\x74\x74\x6F\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x61\x63\x74\x69\x6F\x6E\x5F\x62\x74\x6E\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x73\x65\x72\x74\x5F\x76\x69\x64\x65\x6F\x5F\x62\x74\x6E\x22\x3E","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x6F\x76\x65\x72\x6C\x61\x79","\x24\x6F\x76\x65\x72\x6C\x61\x79","\x3C\x64\x69\x76\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x6F\x76\x65\x72\x6C\x61\x79\x22\x20\x73\x74\x79\x6C\x65\x3D\x22\x64\x69\x73\x70\x6C\x61\x79\x3A\x20\x6E\x6F\x6E\x65\x3B\x22\x3E\x3C\x2F\x64\x69\x76\x3E","\x6D\x6F\x64\x61\x6C\x4F\x76\x65\x72\x6C\x61\x79","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C","\x24\x6D\x6F\x64\x61\x6C","\x3C\x64\x69\x76\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x22\x20\x73\x74\x79\x6C\x65\x3D\x22\x64\x69\x73\x70\x6C\x61\x79\x3A\x20\x6E\x6F\x6E\x65\x3B\x22\x3E\x3C\x64\x69\x76\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x63\x6C\x6F\x73\x65\x22\x3E\x26\x74\x69\x6D\x65\x73\x3B\x3C\x2F\x64\x69\x76\x3E\x3C\x68\x65\x61\x64\x65\x72\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x68\x65\x61\x64\x65\x72\x22\x3E\x3C\x2F\x68\x65\x61\x64\x65\x72\x3E\x3C\x64\x69\x76\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x69\x6E\x6E\x65\x72\x22\x3E\x3C\x2F\x64\x69\x76\x3E\x3C\x2F\x64\x69\x76\x3E","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x63\x6C\x6F\x73\x65","\x68\x64\x6C\x4D\x6F\x64\x61\x6C\x43\x6C\x6F\x73\x65","\x6D\x6F\x64\x61\x6C\x63\x6F\x6E\x74\x65\x6E\x74","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x69\x6E\x6E\x65\x72","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x68\x65\x61\x64\x65\x72","\x64\x72\x61\x67\x67\x61\x62\x6C\x65","\x63\x75\x72\x73\x6F\x72","\x6D\x6F\x76\x65","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62","\x6F\x75\x74\x65\x72\x48\x65\x69\x67\x68\x74","\x6D\x61\x72\x67\x69\x6E\x2D\x74\x6F\x70","\x2D","\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x62\x74\x6E\x5F\x6D\x6F\x64\x61\x6C\x5F\x63\x6C\x6F\x73\x65","\x73\x61\x76\x65\x4D\x6F\x64\x61\x6C\x53\x63\x72\x6F\x6C\x6C","\x2D\x32\x30\x30\x30\x70\x78","\x6D\x6F\x64\x61\x6C\x53\x61\x76\x65\x42\x6F\x64\x79\x4F\x76\x65\x66\x6C\x6F\x77","\x6F\x76\x65\x72\x66\x6C\x6F\x77","\x30","\x33\x30\x30\x70\x78","\x66\x75\x6E\x63\x74\x69\x6F\x6E","\x66\x6F\x63\x75\x73\x69\x6E\x2E\x6D\x6F\x64\x61\x6C","\x66\x61\x73\x74","\x75\x6E\x62\x69\x6E\x64","\x73\x33\x75\x70\x6C\x6F\x61\x64\x54\x6F\x53\x33","\x73\x33\x65\x78\x65\x63\x75\x74\x65\x4F\x6E\x53\x69\x67\x6E\x65\x64\x55\x72\x6C","\x47\x45\x54","\x6E\x61\x6D\x65\x3D","\x26\x74\x79\x70\x65\x3D","\x6F\x76\x65\x72\x72\x69\x64\x65\x4D\x69\x6D\x65\x54\x79\x70\x65","\x74\x65\x78\x74\x2F\x70\x6C\x61\x69\x6E\x3B\x20\x63\x68\x61\x72\x73\x65\x74\x3D\x78\x2D\x75\x73\x65\x72\x2D\x64\x65\x66\x69\x6E\x65\x64","\x6F\x6E\x72\x65\x61\x64\x79\x73\x74\x61\x74\x65\x63\x68\x61\x6E\x67\x65","\x72\x65\x61\x64\x79\x53\x74\x61\x74\x65","\x73\x74\x61\x74\x75\x73","\x66\x61\x64\x65\x49\x6E","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x70\x72\x6F\x67\x72\x65\x73\x73","\x72\x65\x73\x70\x6F\x6E\x73\x65\x54\x65\x78\x74","\x73\x65\x6E\x64","\x77\x69\x74\x68\x43\x72\x65\x64\x65\x6E\x74\x69\x61\x6C\x73","\x50\x55\x54","\x73\x33\x63\x72\x65\x61\x74\x65\x43\x4F\x52\x53\x52\x65\x71\x75\x65\x73\x74","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x70\x72\x6F\x67\x72\x65\x73\x73\x2C\x20\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x70\x72\x6F\x67\x72\x65\x73\x73\x2D\x64\x72\x61\x67","\x6F\x6E\x65\x72\x72\x6F\x72","\x6F\x6E\x70\x72\x6F\x67\x72\x65\x73\x73","\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65","\x73\x65\x74\x52\x65\x71\x75\x65\x73\x74\x48\x65\x61\x64\x65\x72","\x78\x2D\x61\x6D\x7A\x2D\x61\x63\x6C","\x70\x75\x62\x6C\x69\x63\x2D\x72\x65\x61\x64","\x75\x70\x6C\x6F\x61\x64\x4F\x70\x74\x69\x6F\x6E\x73","\x49\x4E\x50\x55\x54","\x65\x6C","\x65\x6C\x65\x6D\x65\x6E\x74\x5F\x61\x63\x74\x69\x6F\x6E","\x61\x63\x74\x69\x6F\x6E","\x73\x75\x62\x6D\x69\x74","\x75\x70\x6C\x6F\x61\x64\x53\x75\x62\x6D\x69\x74","\x74\x72\x69\x67\x67\x65\x72","\x65\x6C\x65\x6D\x65\x6E\x74","\x75\x70\x6C\x6F\x61\x64\x46\x72\x61\x6D\x65","\x75\x70\x6C\x6F\x61\x64\x46\x6F\x72\x6D","\x66","\x3C\x69\x66\x72\x61\x6D\x65\x20\x73\x74\x79\x6C\x65\x3D\x22\x64\x69\x73\x70\x6C\x61\x79\x3A\x6E\x6F\x6E\x65\x22\x20\x69\x64\x3D\x22","\x22\x20\x6E\x61\x6D\x65\x3D\x22","\x22\x3E\x3C\x2F\x69\x66\x72\x61\x6D\x65\x3E","\x75\x70\x6C\x6F\x61\x64\x4C\x6F\x61\x64\x65\x64","\x72\x65\x64\x61\x63\x74\x6F\x72\x55\x70\x6C\x6F\x61\x64\x46\x6F\x72\x6D","\x72\x65\x64\x61\x63\x74\x6F\x72\x55\x70\x6C\x6F\x61\x64\x46\x69\x6C\x65","\x3C\x66\x6F\x72\x6D\x20\x20\x61\x63\x74\x69\x6F\x6E\x3D\x22","\x75\x72\x6C","\x22\x20\x6D\x65\x74\x68\x6F\x64\x3D\x22\x50\x4F\x53\x54\x22\x20\x74\x61\x72\x67\x65\x74\x3D\x22","\x22\x20\x69\x64\x3D\x22","\x22\x20\x65\x6E\x63\x74\x79\x70\x65\x3D\x22\x6D\x75\x6C\x74\x69\x70\x61\x72\x74\x2F\x66\x6F\x72\x6D\x2D\x64\x61\x74\x61\x22\x20\x2F\x3E","\x3C\x69\x6E\x70\x75\x74\x2F\x3E","\x65\x6E\x63\x74\x79\x70\x65","\x6D\x75\x6C\x74\x69\x70\x61\x72\x74\x2F\x66\x6F\x72\x6D\x2D\x64\x61\x74\x61","\x6D\x65\x74\x68\x6F\x64","\x50\x4F\x53\x54","\x63\x6F\x6E\x74\x65\x6E\x74\x44\x6F\x63\x75\x6D\x65\x6E\x74","\x66\x72\x61\x6D\x65\x73","\x73\x75\x63\x63\x65\x73\x73","\x55\x70\x6C\x6F\x61\x64\x20\x66\x61\x69\x6C\x65\x64\x21","\x64\x72\x61\x67\x75\x70\x6C\x6F\x61\x64\x4F\x70\x74\x69\x6F\x6E\x73","\x64\x72\x6F\x70\x5F\x66\x69\x6C\x65\x5F\x68\x65\x72\x65","\x6F\x72\x5F\x63\x68\x6F\x6F\x73\x65","\x64\x72\x6F\x70\x61\x72\x65\x61","\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x64\x72\x6F\x70\x61\x72\x65\x61\x22\x3E\x3C\x2F\x64\x69\x76\x3E","\x64\x72\x6F\x70\x61\x72\x65\x61\x62\x6F\x78","\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x64\x72\x6F\x70\x61\x72\x65\x61\x62\x6F\x78\x22\x3E","\x3C\x2F\x64\x69\x76\x3E","\x64\x72\x6F\x70\x61\x6C\x74\x65\x72\x6E\x61\x74\x69\x76\x65","\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x64\x72\x6F\x70\x61\x6C\x74\x65\x72\x6E\x61\x74\x69\x76\x65\x22\x3E","\x61\x74\x65\x78\x74","\x64\x72\x61\x67\x6F\x76\x65\x72","\x64\x72\x61\x67\x75\x70\x6C\x6F\x61\x64\x4F\x6E\x64\x72\x61\x67","\x64\x72\x61\x67\x6C\x65\x61\x76\x65","\x64\x72\x61\x67\x75\x70\x6C\x6F\x61\x64\x4F\x6E\x64\x72\x61\x67\x6C\x65\x61\x76\x65","\x6F\x6E\x64\x72\x6F\x70","\x64\x72\x6F\x70","\x68\x6F\x76\x65\x72","\x75\x70\x6C\x6F\x61\x64\x50\x61\x72\x61\x6D","\x78\x68\x72","\x61\x6A\x61\x78\x53\x65\x74\x74\x69\x6E\x67\x73","\x70\x72\x6F\x67\x72\x65\x73\x73","\x75\x70\x6C\x6F\x61\x64\x50\x72\x6F\x67\x72\x65\x73\x73","\x61\x64\x64\x45\x76\x65\x6E\x74\x4C\x69\x73\x74\x65\x6E\x65\x72","\x61\x6A\x61\x78\x53\x65\x74\x75\x70","\x73\x6C\x6F\x77","\x3C\x69\x6D\x67\x3E","\x64\x72\x61\x67\x2D\x69\x6D\x61\x67\x65\x2D\x6D\x61\x72\x6B\x65\x72","\x69\x6E\x73\x65\x72\x74\x4E\x6F\x64\x65\x54\x6F\x43\x61\x72\x65\x74\x50\x6F\x73\x69\x74\x69\x6F\x6E\x46\x72\x6F\x6D\x50\x6F\x69\x6E\x74","\x69\x6D\x67\x23\x64\x72\x61\x67\x2D\x69\x6D\x61\x67\x65\x2D\x6D\x61\x72\x6B\x65\x72","\x6C\x6F\x61\x64\x65\x64","\x74\x6F\x74\x61\x6C","\x4C\x6F\x61\x64\x69\x6E\x67\x20","\x25\x20","\x74\x6F\x53\x74\x72\x69\x6E\x67","\x5B\x6F\x62\x6A\x65\x63\x74\x20\x53\x74\x72\x69\x6E\x67\x5D","\x74\x72\x69\x64\x65\x6E\x74","\x63\x6F\x6D\x70\x61\x74\x69\x62\x6C\x65","\x72\x76","\x6F\x70\x72","\x63\x6C\x6F\x6E\x65\x4E\x6F\x64\x65","\x67\x65\x74\x43\x61\x72\x65\x74\x4F\x66\x66\x73\x65\x74","\x67\x65\x74\x43\x61\x72\x65\x74\x4F\x66\x66\x73\x65\x74\x52\x61\x6E\x67\x65","\x3C\x69\x66\x72\x61\x6D\x65\x20\x77\x69\x64\x74\x68\x3D\x22\x35\x30\x30\x22\x20\x68\x65\x69\x67\x68\x74\x3D\x22\x32\x38\x31\x22\x20\x73\x72\x63\x3D\x22","\x22\x20\x66\x72\x61\x6D\x65\x62\x6F\x72\x64\x65\x72\x3D\x22\x30\x22\x20\x61\x6C\x6C\x6F\x77\x66\x75\x6C\x6C\x73\x63\x72\x65\x65\x6E\x3E\x3C\x2F\x69\x66\x72\x61\x6D\x65\x3E","\x2F\x2F\x77\x77\x77\x2E\x79\x6F\x75\x74\x75\x62\x65\x2E\x63\x6F\x6D\x2F\x65\x6D\x62\x65\x64\x2F\x24\x31","\x2F\x2F\x70\x6C\x61\x79\x65\x72\x2E\x76\x69\x6D\x65\x6F\x2E\x63\x6F\x6D\x2F\x76\x69\x64\x65\x6F\x2F\x24\x32","\x3C\x69\x6D\x67\x20\x73\x72\x63\x3D\x22\x24\x31\x22\x3E","\x24\x31\x3C\x61\x20\x68\x72\x65\x66\x3D\x22\x24\x32\x22\x3E","\x3C\x2F\x61\x3E\x24\x35","\x24\x31\x3C\x61\x20\x68\x72\x65\x66\x3D\x22","\x24\x32\x22\x3E","\x3C\x2F\x61\x3E\x24\x33"];(function (c){var a=0;_0xc826[0];var d=function (e){this[0]=e[_0xc826[1]];this[1]=e[_0xc826[2]];this[_0xc826[3]]=e;return this;} ;d[_0xc826[5]][_0xc826[4]]=function (){return this[0]===this[1];} ;c[_0xc826[7]][_0xc826[6]]=function (f){var g=[];var e=Array[_0xc826[5]][_0xc826[9]][_0xc826[8]](arguments,1);if( typeof f===_0xc826[10]){this[_0xc826[19]](function (){var j=c[_0xc826[11]](this,_0xc826[6]);if( typeof j!==_0xc826[12]&&c[_0xc826[13]](j[f])){var h=j[f][_0xc826[14]](j,e);if(h!==undefined&&h!==j){g[_0xc826[15]](h);} ;} else {return c[_0xc826[18]](_0xc826[16]+f+_0xc826[17]);} ;} );} else {this[_0xc826[19]](function (){if(!c[_0xc826[11]](this,_0xc826[6])){c[_0xc826[11]](this,_0xc826[6],b(this,f));} ;} );} ;if(g[_0xc826[20]]===0){return this;} else {if(g[_0xc826[20]]===1){return g[0];} else {return g;} ;} ;} ;function b(f,e){return  new b[_0xc826[5]][_0xc826[21]](f,e);} ;c[_0xc826[22]]=b;c[_0xc826[22]][_0xc826[23]]=_0xc826[24];c[_0xc826[22]][_0xc826[25]]={rangy:false,iframe:false,fullpage:false,css:false,lang:_0xc826[26],direction:_0xc826[27],placeholder:false,typewriter:false,wym:false,mobile:true,cleanup:true,tidyHtml:true,pastePlainText:false,removeEmptyTags:true,templateVars:false,xhtml:false,visual:true,focus:false,tabindex:false,autoresize:true,minHeight:false,maxHeight:false,shortcuts:true,autosave:false,autosaveInterval:60,plugins:false,linkAnchor:true,linkEmail:true,linkProtocol:_0xc826[28],linkNofollow:false,linkSize:50,imageFloatMargin:_0xc826[29],imageGetJson:false,dragUpload:true,imageTabLink:true,imageUpload:false,imageUploadParam:_0xc826[30],fileUpload:false,fileUploadParam:_0xc826[30],clipboardUpload:true,clipboardUploadUrl:false,dnbImageTypes:[_0xc826[31],_0xc826[32],_0xc826[33]],s3:false,uploadFields:false,observeImages:true,observeLinks:true,modalOverlay:true,tabSpaces:false,tabFocus:true,air:false,airButtons:[_0xc826[34],_0xc826[35],_0xc826[36],_0xc826[37],_0xc826[38],_0xc826[39],_0xc826[40],_0xc826[41]],toolbar:true,toolbarFixed:false,toolbarFixedTarget:document,toolbarFixedTopOffset:0,toolbarFixedBox:false,toolbarExternal:false,toolbarOverflow:false,buttonSource:true,buttons:[_0xc826[42],_0xc826[43],_0xc826[34],_0xc826[35],_0xc826[36],_0xc826[37],_0xc826[38],_0xc826[39],_0xc826[40],_0xc826[41],_0xc826[44],_0xc826[45],_0xc826[30],_0xc826[46],_0xc826[47],_0xc826[48],_0xc826[49]],buttonsHideOnMobile:[],activeButtons:[_0xc826[37],_0xc826[36],_0xc826[35],_0xc826[50],_0xc826[38],_0xc826[39],_0xc826[51],_0xc826[52],_0xc826[53],_0xc826[54],_0xc826[46]],activeButtonsStates:{b:_0xc826[35],strong:_0xc826[35],i:_0xc826[36],em:_0xc826[36],del:_0xc826[37],strike:_0xc826[37],ul:_0xc826[38],ol:_0xc826[39],u:_0xc826[50],tr:_0xc826[46],td:_0xc826[46],table:_0xc826[46]},formattingTags:[_0xc826[55],_0xc826[56],_0xc826[57],_0xc826[58],_0xc826[59],_0xc826[60],_0xc826[61],_0xc826[62],_0xc826[63]],linebreaks:false,paragraphy:true,convertDivs:true,convertLinks:true,convertImageLinks:false,convertVideoLinks:false,formattingPre:false,phpTags:false,allowedTags:false,deniedTags:[_0xc826[42],_0xc826[64],_0xc826[47],_0xc826[65],_0xc826[66],_0xc826[67],_0xc826[68],_0xc826[69]],boldTag:_0xc826[70],italicTag:_0xc826[71],indentValue:20,buffer:[],rebuffer:[],textareamode:false,emptyHtml:_0xc826[72],invisibleSpace:_0xc826[73],rBlockTest:/^(P|H[1-6]|LI|ADDRESS|SECTION|HEADER|FOOTER|ASIDE|ARTICLE)$/i,alignmentTags:[_0xc826[74],_0xc826[75],_0xc826[76],_0xc826[77],_0xc826[78],_0xc826[79],_0xc826[80],_0xc826[81],_0xc826[82],_0xc826[83],_0xc826[84],_0xc826[85],_0xc826[86],_0xc826[87],_0xc826[88],_0xc826[89],_0xc826[90],_0xc826[91],_0xc826[92],_0xc826[93],_0xc826[94]],ownLine:[_0xc826[95],_0xc826[65],_0xc826[64],_0xc826[96],_0xc826[97],_0xc826[47],_0xc826[66],_0xc826[98],_0xc826[68],_0xc826[67],_0xc826[46],_0xc826[99],_0xc826[100],_0xc826[101]],contOwnLine:[_0xc826[102],_0xc826[103],_0xc826[103],_0xc826[104],_0xc826[105],_0xc826[67]],newLevel:[_0xc826[56],_0xc826[106],_0xc826[107],_0xc826[108],_0xc826[109],_0xc826[110],_0xc826[111],_0xc826[112],_0xc826[55],_0xc826[57],_0xc826[113],_0xc826[114],_0xc826[115],_0xc826[116],_0xc826[117]],blockLevelElements:[_0xc826[74],_0xc826[75],_0xc826[76],_0xc826[77],_0xc826[78],_0xc826[79],_0xc826[80],_0xc826[81],_0xc826[82],_0xc826[83],_0xc826[84],_0xc826[118],_0xc826[86],_0xc826[87],_0xc826[88],_0xc826[119],_0xc826[89],_0xc826[90],_0xc826[91],_0xc826[92],_0xc826[93],_0xc826[94],_0xc826[85]],langs:{en:{html:_0xc826[120],video:_0xc826[121],image:_0xc826[122],table:_0xc826[123],link:_0xc826[124],link_insert:_0xc826[125],link_edit:_0xc826[126],unlink:_0xc826[127],formatting:_0xc826[128],paragraph:_0xc826[129],quote:_0xc826[130],code:_0xc826[131],header1:_0xc826[132],header2:_0xc826[133],header3:_0xc826[134],header4:_0xc826[135],header5:_0xc826[136],bold:_0xc826[137],italic:_0xc826[138],fontcolor:_0xc826[139],backcolor:_0xc826[140],unorderedlist:_0xc826[141],orderedlist:_0xc826[142],outdent:_0xc826[143],indent:_0xc826[144],cancel:_0xc826[145],insert:_0xc826[146],save:_0xc826[147],_delete:_0xc826[148],insert_table:_0xc826[149],insert_row_above:_0xc826[150],insert_row_below:_0xc826[151],insert_column_left:_0xc826[152],insert_column_right:_0xc826[153],delete_column:_0xc826[154],delete_row:_0xc826[155],delete_table:_0xc826[156],rows:_0xc826[157],columns:_0xc826[158],add_head:_0xc826[159],delete_head:_0xc826[160],title:_0xc826[161],image_position:_0xc826[162],none:_0xc826[163],left:_0xc826[164],right:_0xc826[165],center:_0xc826[166],image_web_link:_0xc826[167],text:_0xc826[168],mailto:_0xc826[169],web:_0xc826[170],video_html_code:_0xc826[171],file:_0xc826[172],upload:_0xc826[173],download:_0xc826[174],choose:_0xc826[175],or_choose:_0xc826[176],drop_file_here:_0xc826[177],align_left:_0xc826[178],align_center:_0xc826[179],align_right:_0xc826[180],align_justify:_0xc826[181],horizontalrule:_0xc826[182],deleted:_0xc826[183],anchor:_0xc826[184],link_new_tab:_0xc826[185],underline:_0xc826[186],alignment:_0xc826[187],filename:_0xc826[188],edit:_0xc826[189]}}};b[_0xc826[7]]=c[_0xc826[22]][_0xc826[5]]={keyCode:{BACKSPACE:8,DELETE:46,DOWN:40,ENTER:13,ESC:27,TAB:9,CTRL:17,META:91,LEFT:37,LEFT_WIN:91},init:function (f,e){this[_0xc826[190]]=false;this[_0xc826[191]]=this[_0xc826[192]]=c(f);this[_0xc826[193]]=a++;var g=c[_0xc826[194]](true,{},c[_0xc826[22]][_0xc826[25]]);this[_0xc826[25]]=c[_0xc826[194]]({},g,this[_0xc826[191]][_0xc826[11]](),e);this[_0xc826[195]]=true;this[_0xc826[196]]=[];this[_0xc826[197]]=this[_0xc826[192]][_0xc826[199]](_0xc826[198]);this[_0xc826[200]]=this[_0xc826[192]][_0xc826[199]](_0xc826[201]);if(this[_0xc826[25]][_0xc826[202]]){this[_0xc826[25]][_0xc826[203]]=true;} ;if(this[_0xc826[25]][_0xc826[204]]){this[_0xc826[25]][_0xc826[205]]=false;} ;if(this[_0xc826[25]][_0xc826[205]]){this[_0xc826[25]][_0xc826[204]]=false;} ;if(this[_0xc826[25]][_0xc826[206]]){this[_0xc826[25]][_0xc826[207]]=true;} ;this[_0xc826[208]]=document;this[_0xc826[209]]=window;this[_0xc826[210]]=false;this[_0xc826[211]]= new RegExp(_0xc826[212]+this[_0xc826[25]][_0xc826[215]][_0xc826[214]](_0xc826[213])+_0xc826[43]+this[_0xc826[25]][_0xc826[216]][_0xc826[214]](_0xc826[43])+_0xc826[217]);this[_0xc826[218]]= new RegExp(_0xc826[219]+this[_0xc826[25]][_0xc826[215]][_0xc826[214]](_0xc826[213])+_0xc826[220]+this[_0xc826[25]][_0xc826[216]][_0xc826[214]](_0xc826[220])+_0xc826[217]);this[_0xc826[221]]= new RegExp(_0xc826[222]+this[_0xc826[25]][_0xc826[223]][_0xc826[214]](_0xc826[43])+_0xc826[217]);this[_0xc826[224]]= new RegExp(_0xc826[225]+this[_0xc826[25]][_0xc826[226]][_0xc826[214]](_0xc826[43])+_0xc826[227],_0xc826[228]);if(this[_0xc826[25]][_0xc826[204]]===false){if(this[_0xc826[25]][_0xc826[229]]!==false){var h=[_0xc826[70],_0xc826[71],_0xc826[230]];var j=[_0xc826[231],_0xc826[228],_0xc826[232]];if(c[_0xc826[233]](_0xc826[55],this[_0xc826[25]][_0xc826[229]])===_0xc826[234]){this[_0xc826[25]][_0xc826[229]][_0xc826[15]](_0xc826[55]);} ;for(i in h){if(c[_0xc826[233]](h[i],this[_0xc826[25]][_0xc826[229]])!=_0xc826[234]){this[_0xc826[25]][_0xc826[229]][_0xc826[15]](j[i]);} ;} ;} ;if(this[_0xc826[25]][_0xc826[235]]!==false){var l=c[_0xc826[233]](_0xc826[55],this[_0xc826[25]][_0xc826[235]]);if(l!==_0xc826[234]){this[_0xc826[25]][_0xc826[235]][_0xc826[236]](l,l);} ;} ;} ;if(this[_0xc826[238]](_0xc826[237])||this[_0xc826[238]](_0xc826[239])){this[_0xc826[25]][_0xc826[240]]=this[_0xc826[241]](this[_0xc826[25]][_0xc826[240]],_0xc826[49]);} ;this[_0xc826[25]][_0xc826[242]]=this[_0xc826[25]][_0xc826[244]][this[_0xc826[25]][_0xc826[243]]];this[_0xc826[245]]();} ,toolbarInit:function (e){return {html:{title:e[_0xc826[42]],func:_0xc826[246]},formatting:{title:e[_0xc826[34]],func:_0xc826[247],dropdown:{p:{title:e[_0xc826[248]],func:_0xc826[249]},blockquote:{title:e[_0xc826[250]],func:_0xc826[251],className:_0xc826[252]},pre:{title:e[_0xc826[253]],func:_0xc826[249],className:_0xc826[254]},h1:{title:e[_0xc826[255]],func:_0xc826[249],className:_0xc826[256]},h2:{title:e[_0xc826[257]],func:_0xc826[249],className:_0xc826[258]},h3:{title:e[_0xc826[259]],func:_0xc826[249],className:_0xc826[260]},h4:{title:e[_0xc826[261]],func:_0xc826[249],className:_0xc826[262]},h5:{title:e[_0xc826[263]],func:_0xc826[249],className:_0xc826[264]}}},bold:{title:e[_0xc826[35]],exec:_0xc826[35]},italic:{title:e[_0xc826[36]],exec:_0xc826[36]},deleted:{title:e[_0xc826[37]],exec:_0xc826[265]},underline:{title:e[_0xc826[50]],exec:_0xc826[50]},unorderedlist:{title:_0xc826[266]+e[_0xc826[38]],exec:_0xc826[267]},orderedlist:{title:_0xc826[268]+e[_0xc826[39]],exec:_0xc826[269]},outdent:{title:_0xc826[270]+e[_0xc826[40]],func:_0xc826[271]},indent:{title:_0xc826[272]+e[_0xc826[41]],func:_0xc826[273]},image:{title:e[_0xc826[44]],func:_0xc826[274]},video:{title:e[_0xc826[45]],func:_0xc826[275]},file:{title:e[_0xc826[30]],func:_0xc826[276]},table:{title:e[_0xc826[46]],func:_0xc826[247],dropdown:{insert_table:{title:e[_0xc826[277]],func:_0xc826[278]},separator_drop1:{name:_0xc826[279]},insert_row_above:{title:e[_0xc826[280]],func:_0xc826[281]},insert_row_below:{title:e[_0xc826[282]],func:_0xc826[283]},insert_column_left:{title:e[_0xc826[284]],func:_0xc826[285]},insert_column_right:{title:e[_0xc826[286]],func:_0xc826[287]},separator_drop2:{name:_0xc826[279]},add_head:{title:e[_0xc826[288]],func:_0xc826[289]},delete_head:{title:e[_0xc826[290]],func:_0xc826[291]},separator_drop3:{name:_0xc826[279]},delete_column:{title:e[_0xc826[292]],func:_0xc826[293]},delete_row:{title:e[_0xc826[294]],func:_0xc826[295]},delete_table:{title:e[_0xc826[296]],func:_0xc826[297]}}},link:{title:e[_0xc826[47]],func:_0xc826[247],dropdown:{link:{title:e[_0xc826[298]],func:_0xc826[299]},unlink:{title:e[_0xc826[300]],exec:_0xc826[300]}}},fontcolor:{title:e[_0xc826[301]],func:_0xc826[247]},backcolor:{title:e[_0xc826[302]],func:_0xc826[247]},alignment:{title:e[_0xc826[48]],func:_0xc826[247],dropdown:{alignleft:{title:e[_0xc826[303]],func:_0xc826[304]},aligncenter:{title:e[_0xc826[305]],func:_0xc826[306]},alignright:{title:e[_0xc826[307]],func:_0xc826[308]},justify:{title:e[_0xc826[309]],func:_0xc826[310]}}},alignleft:{title:e[_0xc826[303]],func:_0xc826[304]},aligncenter:{title:e[_0xc826[305]],func:_0xc826[306]},alignright:{title:e[_0xc826[307]],func:_0xc826[308]},alignjustify:{title:e[_0xc826[309]],func:_0xc826[310]},horizontalrule:{exec:_0xc826[311],title:e[_0xc826[49]]}};} ,callback:function (e,f,g){var h=this[_0xc826[25]][e+_0xc826[312]];if(c[_0xc826[13]](h)){if(f===false){return h[_0xc826[8]](this,g);} else {return h[_0xc826[8]](this,f,g);} ;} else {return g;} ;} ,destroy:function (){clearInterval(this[_0xc826[313]]);c(window)[_0xc826[315]](_0xc826[314]);this[_0xc826[192]][_0xc826[315]](_0xc826[316]);this[_0xc826[191]][_0xc826[315]](_0xc826[314])[_0xc826[317]](_0xc826[6]);var f=this[_0xc826[318]]();if(this[_0xc826[25]][_0xc826[319]]){this[_0xc826[321]][_0xc826[320]](this.$source);this[_0xc826[321]][_0xc826[322]]();this[_0xc826[192]][_0xc826[323]](f)[_0xc826[247]]();} else {var e=this[_0xc826[324]];if(this[_0xc826[25]][_0xc826[203]]){e=this[_0xc826[191]];} ;this[_0xc826[321]][_0xc826[320]](e);this[_0xc826[321]][_0xc826[322]]();e[_0xc826[328]](_0xc826[329])[_0xc826[328]](_0xc826[327])[_0xc826[326]](_0xc826[325])[_0xc826[42]](f)[_0xc826[247]]();} ;if(this[_0xc826[25]][_0xc826[330]]){c(this[_0xc826[25]][_0xc826[330]])[_0xc826[42]](_0xc826[331]);} ;if(this[_0xc826[25]][_0xc826[332]]){c(_0xc826[333]+this[_0xc826[193]])[_0xc826[322]]();} ;} ,getObject:function (){return c[_0xc826[194]]({},this);} ,getEditor:function (){return this[_0xc826[324]];} ,getBox:function (){return this[_0xc826[321]];} ,getIframe:function (){return (this[_0xc826[25]][_0xc826[203]])?this[_0xc826[334]]:false;} ,getToolbar:function (){return (this[_0xc826[335]])?this[_0xc826[335]]:false;} ,get:function (){return this[_0xc826[192]][_0xc826[323]]();} ,getCodeIframe:function (){this[_0xc826[324]][_0xc826[326]](_0xc826[325])[_0xc826[326]](_0xc826[336]);var e=this[_0xc826[339]](this[_0xc826[334]][_0xc826[338]]()[_0xc826[337]]());this[_0xc826[324]][_0xc826[341]]({contenteditable:true,dir:this[_0xc826[25]][_0xc826[340]]});return e;} ,set:function (e,f,g){e=e.toString();e=e[_0xc826[343]](/\$/g,_0xc826[342]);if(this[_0xc826[25]][_0xc826[202]]){this[_0xc826[344]](e);} else {this[_0xc826[345]](e,f);} ;if(e==_0xc826[331]){g=false;} ;if(g!==false){this[_0xc826[346]]();} ;} ,setEditor:function (e,f){if(f!==false){e=this[_0xc826[347]](e);e=this[_0xc826[348]](e);e=this[_0xc826[349]](e);e=this[_0xc826[350]](e,true);if(this[_0xc826[25]][_0xc826[204]]===false){e=this[_0xc826[351]](e);} else {e=e[_0xc826[343]](/<p(.*?)>([\w\W]*?)<\/p>/gi,_0xc826[352]);} ;} ;e=e[_0xc826[343]](/&amp;#36;/g,_0xc826[353]);e=this[_0xc826[354]](e);this[_0xc826[324]][_0xc826[42]](e);this[_0xc826[355]]();this[_0xc826[356]]();this[_0xc826[357]]();} ,setCodeIframe:function (e){var f=this[_0xc826[358]]();this[_0xc826[334]][0][_0xc826[359]]=_0xc826[360];e=this[_0xc826[349]](e);e=this[_0xc826[350]](e);e=this[_0xc826[361]](e);f[_0xc826[362]]();f[_0xc826[363]](e);f[_0xc826[364]]();if(this[_0xc826[25]][_0xc826[202]]){this[_0xc826[324]]=this[_0xc826[334]][_0xc826[338]]()[_0xc826[365]](_0xc826[65])[_0xc826[341]]({contenteditable:true,dir:this[_0xc826[25]][_0xc826[340]]});} ;this[_0xc826[355]]();this[_0xc826[356]]();this[_0xc826[357]]();} ,setFullpageOnInit:function (e){e=this[_0xc826[347]](e,true);e=this[_0xc826[351]](e);e=this[_0xc826[354]](e);this[_0xc826[324]][_0xc826[42]](e);this[_0xc826[355]]();this[_0xc826[356]]();this[_0xc826[357]]();} ,setSpansVerified:function (){var f=this[_0xc826[324]][_0xc826[365]](_0xc826[366]);var e=_0xc826[367];c[_0xc826[19]](f,function (){var g=this[_0xc826[368]];var j= new RegExp(_0xc826[369]+this[_0xc826[370]],_0xc826[371]);var h=g[_0xc826[343]](j,_0xc826[369]+e);j= new RegExp(_0xc826[372]+this[_0xc826[370]],_0xc826[371]);h=h[_0xc826[343]](j,_0xc826[372]+e);c(this)[_0xc826[373]](h);} );} ,setSpansVerifiedHtml:function (e){e=e[_0xc826[343]](/<span(.*?)>/,_0xc826[374]);return e[_0xc826[343]](/<\/span>/,_0xc826[375]);} ,setNonEditable:function (){this[_0xc826[324]][_0xc826[365]](_0xc826[376])[_0xc826[341]](_0xc826[325],false);} ,sync:function (){var e=_0xc826[331];this[_0xc826[377]]();if(this[_0xc826[25]][_0xc826[202]]){e=this[_0xc826[378]]();} else {e=this[_0xc826[324]][_0xc826[42]]();} ;e=this[_0xc826[379]](e);e=this[_0xc826[380]](e);var g=this[_0xc826[361]](this[_0xc826[192]][_0xc826[323]](),false);var f=this[_0xc826[361]](e,false);if(g==f){return false;} ;e=e[_0xc826[343]](/<\/li><(ul|ol)>([\w\W]*?)<\/(ul|ol)>/gi,_0xc826[381]);if(c[_0xc826[382]](e)===_0xc826[383]){e=_0xc826[331];} ;if(this[_0xc826[25]][_0xc826[384]]){var h=[_0xc826[385],_0xc826[96],_0xc826[386],_0xc826[47],_0xc826[387],_0xc826[66]];c[_0xc826[19]](h,function (j,l){e=e[_0xc826[343]]( new RegExp(_0xc826[369]+l+_0xc826[388],_0xc826[371]),_0xc826[369]+l+_0xc826[389]);} );} ;e=this[_0xc826[391]](_0xc826[390],false,e);this[_0xc826[192]][_0xc826[323]](e);this[_0xc826[391]](_0xc826[392],false,e);if(this[_0xc826[195]]===false){this[_0xc826[391]](_0xc826[393],false,e);} ;} ,syncClean:function (e){if(!this[_0xc826[25]][_0xc826[202]]){e=this[_0xc826[348]](e);} ;e=c[_0xc826[382]](e);e=this[_0xc826[394]](e);e=e[_0xc826[343]](/&#x200b;/gi,_0xc826[331]);e=e[_0xc826[343]](/&#8203;/gi,_0xc826[331]);e=e[_0xc826[343]](/<\/a>&nbsp;/gi,_0xc826[395]);e=e[_0xc826[343]](/\u200B/g,_0xc826[331]);if(e==_0xc826[396]||e==_0xc826[397]||e==_0xc826[398]){e=_0xc826[331];} ;if(this[_0xc826[25]][_0xc826[399]]){e=e[_0xc826[343]](/<a(.*?)rel="nofollow"(.*?)>/gi,_0xc826[400]);e=e[_0xc826[343]](/<a(.*?)>/gi,_0xc826[401]);} ;e=e[_0xc826[343]](_0xc826[402],_0xc826[403]);e=e[_0xc826[343]](_0xc826[404],_0xc826[405]);e=e[_0xc826[343]](/<(.*?)class="noeditable"(.*?) contenteditable="false"(.*?)>/gi,_0xc826[406]);e=e[_0xc826[343]](/ data-tagblock=""/gi,_0xc826[331]);e=e[_0xc826[343]](/<br\s?\/?>\n?<\/(P|H[1-6]|LI|ADDRESS|SECTION|HEADER|FOOTER|ASIDE|ARTICLE)>/gi,_0xc826[407]);e=e[_0xc826[343]](/<span(.*?)id="redactor-image-box"(.*?)>([\w\W]*?)<img(.*?)><\/span>/gi,_0xc826[408]);e=e[_0xc826[343]](/<span(.*?)id="redactor-image-resizer"(.*?)>(.*?)<\/span>/gi,_0xc826[331]);e=e[_0xc826[343]](/<span(.*?)id="redactor-image-editter"(.*?)>(.*?)<\/span>/gi,_0xc826[331]);e=e[_0xc826[343]](/<(ul|ol|li)(.*?) style="(.*?)"(.*?)>/gi,_0xc826[409]);e=e[_0xc826[343]](/<(ul|ol)>\s*\t*\n*<\/(ul|ol)>/gi,_0xc826[331]);e=e[_0xc826[343]](/<font(.*?)>([\w\W]*?)<\/font>/gi,_0xc826[410]);e=e[_0xc826[343]](/<span(.*?)>([\w\W]*?)<\/span>/gi,_0xc826[410]);e=e[_0xc826[343]](/<inline>/gi,_0xc826[411]);e=e[_0xc826[343]](/<inline /gi,_0xc826[412]);e=e[_0xc826[343]](/<\/inline>/gi,_0xc826[413]);e=e[_0xc826[343]](/<span(.*?)class="redactor_placeholder"(.*?)>([\w\W]*?)<\/span>/gi,_0xc826[331]);e=e[_0xc826[343]](/<span>([\w\W]*?)<\/span>/gi,_0xc826[414]);e=e[_0xc826[343]](/&amp;/gi,_0xc826[415]);e=e[_0xc826[343]](/™/gi,_0xc826[416]);e=e[_0xc826[343]](/©/gi,_0xc826[417]);e=this[_0xc826[418]](e);return e;} ,buildStart:function (){this[_0xc826[419]]=_0xc826[331];this[_0xc826[321]]=c(_0xc826[420]);this[_0xc826[321]][_0xc826[199]](_0xc826[421],100-this[_0xc826[193]]);if(this[_0xc826[192]][0][_0xc826[370]]===_0xc826[422]){this[_0xc826[25]][_0xc826[319]]=true;} ;if(this[_0xc826[25]][_0xc826[423]]===false&&this[_0xc826[424]]()){this[_0xc826[425]]();} else {this[_0xc826[426]]();if(this[_0xc826[25]][_0xc826[203]]){this[_0xc826[25]][_0xc826[427]]=false;this[_0xc826[428]]();} else {if(this[_0xc826[25]][_0xc826[319]]){this[_0xc826[429]]();} else {this[_0xc826[430]]();} ;} ;if(!this[_0xc826[25]][_0xc826[203]]){this[_0xc826[431]]();this[_0xc826[432]]();} ;} ;} ,buildMobile:function (){if(!this[_0xc826[25]][_0xc826[319]]){this[_0xc826[324]]=this[_0xc826[192]];this[_0xc826[324]][_0xc826[433]]();this[_0xc826[192]]=this[_0xc826[434]](this.$editor);this[_0xc826[192]][_0xc826[323]](this[_0xc826[419]]);} ;this[_0xc826[321]][_0xc826[436]](this.$source)[_0xc826[435]](this.$source);} ,buildContent:function (){if(this[_0xc826[25]][_0xc826[319]]){this[_0xc826[419]]=c[_0xc826[382]](this[_0xc826[192]][_0xc826[323]]());} else {this[_0xc826[419]]=c[_0xc826[382]](this[_0xc826[192]][_0xc826[42]]());} ;} ,buildFromTextarea:function (){this[_0xc826[324]]=c(_0xc826[437]);this[_0xc826[321]][_0xc826[436]](this.$source)[_0xc826[435]](this.$editor)[_0xc826[435]](this.$source);this[_0xc826[438]](this.$editor);this[_0xc826[439]]();} ,buildFromElement:function (){this[_0xc826[324]]=this[_0xc826[192]];this[_0xc826[192]]=this[_0xc826[434]](this.$editor);this[_0xc826[321]][_0xc826[436]](this.$editor)[_0xc826[435]](this.$editor)[_0xc826[435]](this.$source);this[_0xc826[439]]();} ,buildCodearea:function (e){return c(_0xc826[442])[_0xc826[341]](_0xc826[440],e[_0xc826[341]](_0xc826[441]))[_0xc826[199]](_0xc826[198],this[_0xc826[197]]);} ,buildAddClasses:function (e){c[_0xc826[19]](this[_0xc826[192]][_0xc826[318]](0)[_0xc826[444]][_0xc826[443]](/\s+/),function (f,g){e[_0xc826[446]](_0xc826[445]+g);} );} ,buildEnable:function (){this[_0xc826[324]][_0xc826[446]](_0xc826[329])[_0xc826[341]]({contenteditable:true,dir:this[_0xc826[25]][_0xc826[340]]});this[_0xc826[192]][_0xc826[341]](_0xc826[336],this[_0xc826[25]][_0xc826[340]])[_0xc826[433]]();this[_0xc826[447]](this[_0xc826[419]],true,false);} ,buildOptions:function (){var e=this[_0xc826[324]];if(this[_0xc826[25]][_0xc826[203]]){e=this[_0xc826[334]];} ;if(this[_0xc826[25]][_0xc826[448]]){e[_0xc826[341]](_0xc826[448],this[_0xc826[25]][_0xc826[448]]);} ;if(this[_0xc826[25]][_0xc826[449]]){e[_0xc826[199]](_0xc826[450],this[_0xc826[25]][_0xc826[449]]+_0xc826[451]);} ;if(this[_0xc826[25]][_0xc826[452]]){this[_0xc826[25]][_0xc826[427]]=false;this[_0xc826[197]]=this[_0xc826[25]][_0xc826[452]];} ;if(this[_0xc826[25]][_0xc826[453]]){this[_0xc826[324]][_0xc826[446]](_0xc826[327]);} ;if(this[_0xc826[25]][_0xc826[454]]){this[_0xc826[324]][_0xc826[446]](_0xc826[455]);} ;if(!this[_0xc826[25]][_0xc826[427]]){e[_0xc826[199]](_0xc826[198],this[_0xc826[197]]);} ;} ,buildAfter:function (){this[_0xc826[195]]=false;if(this[_0xc826[25]][_0xc826[456]]){this[_0xc826[25]][_0xc826[456]]=this[_0xc826[457]](this[_0xc826[25]][_0xc826[242]]);this[_0xc826[458]]();} ;this[_0xc826[459]]();this[_0xc826[460]]();this[_0xc826[461]]();if(this[_0xc826[25]][_0xc826[462]]){this[_0xc826[462]]();} ;setTimeout(c[_0xc826[464]](this[_0xc826[463]],this),4);if(this[_0xc826[238]](_0xc826[465])){try{this[_0xc826[208]][_0xc826[467]](_0xc826[466],false,false);this[_0xc826[208]][_0xc826[467]](_0xc826[468],false,false);} catch(f){} ;} ;if(this[_0xc826[25]][_0xc826[469]]){setTimeout(c[_0xc826[464]](this[_0xc826[469]],this),100);} ;if(!this[_0xc826[25]][_0xc826[470]]){setTimeout(c[_0xc826[464]](function (){this[_0xc826[25]][_0xc826[470]]=true;this[_0xc826[246]](false);} ,this),200);} ;this[_0xc826[391]](_0xc826[21]);} ,buildBindKeyboard:function (){this[_0xc826[471]]=0;if(this[_0xc826[25]][_0xc826[472]]&&this[_0xc826[25]][_0xc826[473]]!==false){this[_0xc826[324]][_0xc826[476]](_0xc826[474],c[_0xc826[464]](this[_0xc826[475]],this));} ;this[_0xc826[324]][_0xc826[476]](_0xc826[477],c[_0xc826[464]](this[_0xc826[357]],this));this[_0xc826[324]][_0xc826[476]](_0xc826[478],c[_0xc826[464]](this[_0xc826[479]],this));this[_0xc826[324]][_0xc826[476]](_0xc826[480],c[_0xc826[464]](this[_0xc826[481]],this));this[_0xc826[324]][_0xc826[476]](_0xc826[482],c[_0xc826[464]](this[_0xc826[483]],this));if(c[_0xc826[13]](this[_0xc826[25]][_0xc826[484]])){this[_0xc826[192]][_0xc826[476]](_0xc826[485],c[_0xc826[464]](this[_0xc826[25]][_0xc826[484]],this));} ;if(c[_0xc826[13]](this[_0xc826[25]][_0xc826[486]])){this[_0xc826[324]][_0xc826[476]](_0xc826[487],c[_0xc826[464]](this[_0xc826[25]][_0xc826[486]],this));} ;var e;c(document)[_0xc826[489]](function (f){e=c(f[_0xc826[488]]);} );this[_0xc826[324]][_0xc826[476]](_0xc826[490],c[_0xc826[464]](function (f){if(!c(e)[_0xc826[492]](_0xc826[491])&&c(e)[_0xc826[495]](_0xc826[494])[_0xc826[493]]()==0){this[_0xc826[496]]=false;if(c[_0xc826[13]](this[_0xc826[25]][_0xc826[497]])){this[_0xc826[391]](_0xc826[498],f);} ;} ;} ,this));} ,buildEventDrop:function (j){j=j[_0xc826[499]]||j;if(window[_0xc826[500]]===undefined||!j[_0xc826[501]]){return true;} ;var h=j[_0xc826[501]][_0xc826[502]][_0xc826[20]];if(h==0){return true;} ;j[_0xc826[503]]();var g=j[_0xc826[501]][_0xc826[502]][0];if(this[_0xc826[25]][_0xc826[504]]!==false&&this[_0xc826[25]][_0xc826[504]][_0xc826[506]](g[_0xc826[505]])==-1){return true;} ;this[_0xc826[507]]();var f=c(_0xc826[508]);c(document[_0xc826[65]])[_0xc826[435]](f);if(this[_0xc826[25]][_0xc826[509]]===false){this[_0xc826[511]](this[_0xc826[25]][_0xc826[473]],g,true,f,j,this[_0xc826[25]][_0xc826[510]]);} else {this[_0xc826[512]](g);} ;} ,buildEventPaste:function (g){var h=false;if(this[_0xc826[238]](_0xc826[513])&&navigator[_0xc826[515]][_0xc826[506]](_0xc826[514])===-1){var f=this[_0xc826[238]](_0xc826[517])[_0xc826[443]](_0xc826[516]);if(f[0]<536){h=true;} ;} ;if(h){return true;} ;if(this[_0xc826[238]](_0xc826[239])){return true;} ;if(this[_0xc826[25]][_0xc826[518]]&&this[_0xc826[519]](g)){return true;} ;if(this[_0xc826[25]][_0xc826[520]]){this[_0xc826[190]]=true;this[_0xc826[521]]();if(!this[_0xc826[496]]){if(this[_0xc826[25]][_0xc826[427]]===true&&this[_0xc826[522]]!==true){this[_0xc826[324]][_0xc826[198]](this[_0xc826[324]][_0xc826[198]]());this[_0xc826[523]]=this[_0xc826[208]][_0xc826[65]][_0xc826[524]];} else {this[_0xc826[523]]=this[_0xc826[324]][_0xc826[524]]();} ;} ;var j=this[_0xc826[525]]();setTimeout(c[_0xc826[464]](function (){var e=this[_0xc826[525]]();this[_0xc826[324]][_0xc826[435]](j);this[_0xc826[526]]();var l=this[_0xc826[527]](e);this[_0xc826[528]](l);if(this[_0xc826[25]][_0xc826[427]]===true&&this[_0xc826[522]]!==true){this[_0xc826[324]][_0xc826[199]](_0xc826[198],_0xc826[529]);} ;} ,this),1);} ;} ,buildEventClipboardUpload:function (j){var h=j[_0xc826[499]]||j;this[_0xc826[530]]=false;if( typeof (h[_0xc826[531]])===_0xc826[12]){return false;} ;if(h[_0xc826[531]][_0xc826[532]]){var g=h[_0xc826[531]][_0xc826[532]][0][_0xc826[533]]();if(g!==null){this[_0xc826[507]]();this[_0xc826[530]]=true;var f= new FileReader();f[_0xc826[534]]=c[_0xc826[464]](this[_0xc826[535]],this);f[_0xc826[536]](g);return true;} ;} ;return false;} ,buildEventKeydown:function (n){if(this[_0xc826[190]]){return false;} ;var r=n[_0xc826[537]];var f=n[_0xc826[538]]||n[_0xc826[539]];var p=this[_0xc826[540]]();var o=this[_0xc826[541]]();var j=this[_0xc826[542]]();var h=false;this[_0xc826[391]](_0xc826[543],n);this[_0xc826[544]](false);if((p&&c(p)[_0xc826[318]](0)[_0xc826[370]]===_0xc826[119])||(o&&c(o)[_0xc826[318]](0)[_0xc826[370]]===_0xc826[119])){h=true;if(r===this[_0xc826[546]][_0xc826[545]]){this[_0xc826[547]](j);} ;} ;if(r===this[_0xc826[546]][_0xc826[545]]){if(p&&c(p)[0][_0xc826[370]]===_0xc826[86]){this[_0xc826[547]](p);} ;if(o&&c(o)[0][_0xc826[370]]===_0xc826[86]){this[_0xc826[547]](o);} ;if(p&&c(p)[0][_0xc826[370]]===_0xc826[74]&&c(p)[_0xc826[548]]()[0][_0xc826[370]]==_0xc826[86]){this[_0xc826[547]](p,c(p)[_0xc826[548]]()[0]);} ;if(o&&c(o)[0][_0xc826[370]]===_0xc826[74]&&p&&c(p)[0][_0xc826[370]]==_0xc826[86]){this[_0xc826[547]](o,p);} ;} ;if(f&&!n[_0xc826[549]]){this[_0xc826[550]](n,r);} ;if(f&&r===90&&!n[_0xc826[549]]&&!n[_0xc826[551]]){n[_0xc826[503]]();if(this[_0xc826[25]][_0xc826[552]][_0xc826[20]]){this[_0xc826[553]]();} else {this[_0xc826[208]][_0xc826[467]](_0xc826[554],false,false);} ;return ;} else {if(f&&r===90&&n[_0xc826[549]]&&!n[_0xc826[551]]){n[_0xc826[503]]();if(this[_0xc826[25]][_0xc826[555]][_0xc826[20]]!=0){this[_0xc826[556]]();} else {this[_0xc826[208]][_0xc826[467]](_0xc826[557],false,false);} ;return ;} ;} ;if(r==32){this[_0xc826[507]]();} ;if(f&&r===65){this[_0xc826[507]]();this[_0xc826[496]]=true;} else {if(r!=this[_0xc826[546]][_0xc826[558]]&&!f){this[_0xc826[496]]=false;} ;} ;if(r==this[_0xc826[546]][_0xc826[559]]&&!n[_0xc826[549]]&&!n[_0xc826[538]]&&!n[_0xc826[539]]){if(this[_0xc826[238]](_0xc826[237])&&(p[_0xc826[560]]==1&&(p[_0xc826[370]]==_0xc826[85]||p[_0xc826[370]]==_0xc826[561]))){n[_0xc826[503]]();this[_0xc826[507]]();this[_0xc826[563]](document[_0xc826[562]](_0xc826[385]));this[_0xc826[391]](_0xc826[564],n);return false;} ;if(j&&(j[_0xc826[370]]==_0xc826[86]||c(j)[_0xc826[548]]()[0][_0xc826[370]]==_0xc826[86])){if(this[_0xc826[565]]()){if(this[_0xc826[471]]==1){var m;var q;if(j[_0xc826[370]]==_0xc826[86]){q=_0xc826[385];m=j;} else {q=_0xc826[55];m=c(j)[_0xc826[548]]()[0];} ;n[_0xc826[503]]();this[_0xc826[566]](m);this[_0xc826[471]]=0;if(q==_0xc826[55]){c(j)[_0xc826[548]]()[_0xc826[365]](_0xc826[55])[_0xc826[567]]()[_0xc826[322]]();} else {var l=c[_0xc826[382]](c(j)[_0xc826[42]]());c(j)[_0xc826[42]](l[_0xc826[343]](/<br\s?\/?>$/i,_0xc826[331]));} ;return ;} else {this[_0xc826[471]]++;} ;} else {this[_0xc826[471]]++;} ;} ;if(h===true){return this[_0xc826[568]](n,o);} else {if(!this[_0xc826[25]][_0xc826[204]]){if(j&&this[_0xc826[25]][_0xc826[570]][_0xc826[569]](j[_0xc826[370]])){this[_0xc826[507]]();setTimeout(c[_0xc826[464]](function (){var s=this[_0xc826[542]]();if(s[_0xc826[370]]===_0xc826[84]&&!c(s)[_0xc826[492]](_0xc826[329])){var e=c(_0xc826[571]+this[_0xc826[25]][_0xc826[572]]+_0xc826[573]);c(s)[_0xc826[373]](e);this[_0xc826[574]](e);} ;} ,this),1);} else {if(j===false){this[_0xc826[507]]();var g=c(_0xc826[571]+this[_0xc826[25]][_0xc826[572]]+_0xc826[573]);this[_0xc826[563]](g[0]);this[_0xc826[574]](g);this[_0xc826[391]](_0xc826[564],n);return false;} ;} ;} ;if(this[_0xc826[25]][_0xc826[204]]){if(j&&this[_0xc826[25]][_0xc826[570]][_0xc826[569]](j[_0xc826[370]])){this[_0xc826[507]]();setTimeout(c[_0xc826[464]](function (){var e=this[_0xc826[542]]();if((e[_0xc826[370]]===_0xc826[84]||e[_0xc826[370]]===_0xc826[74])&&!c(e)[_0xc826[492]](_0xc826[329])){this[_0xc826[575]](e);} ;} ,this),1);} else {return this[_0xc826[576]](n);} ;} ;if(j[_0xc826[370]]==_0xc826[86]||j[_0xc826[370]]==_0xc826[88]){return this[_0xc826[576]](n);} ;} ;this[_0xc826[391]](_0xc826[564],n);} else {if(r===this[_0xc826[546]][_0xc826[559]]&&(n[_0xc826[538]]||n[_0xc826[549]])){this[_0xc826[507]]();n[_0xc826[503]]();this[_0xc826[577]]();} ;} ;if(r===this[_0xc826[546]][_0xc826[578]]&&this[_0xc826[25]][_0xc826[550]]){return this[_0xc826[579]](n,h,r);} ;if(r===this[_0xc826[546]][_0xc826[580]]){this[_0xc826[581]](o);} ;} ,buildEventKeydownPre:function (h,g){h[_0xc826[503]]();this[_0xc826[507]]();var f=c(g)[_0xc826[548]]()[_0xc826[582]]();this[_0xc826[563]](document[_0xc826[584]](_0xc826[583]));if(f[_0xc826[585]](/\s$/)==-1){this[_0xc826[563]](document[_0xc826[584]](_0xc826[583]));} ;this[_0xc826[357]]();this[_0xc826[391]](_0xc826[564],h);return false;} ,buildEventKeydownTab:function (h,g,f){if(!this[_0xc826[25]][_0xc826[586]]){return true;} ;if(this[_0xc826[587]](this[_0xc826[318]]())&&this[_0xc826[25]][_0xc826[588]]===false){return true;} ;h[_0xc826[503]]();if(g===true&&!h[_0xc826[549]]){this[_0xc826[507]]();this[_0xc826[563]](document[_0xc826[584]](_0xc826[589]));this[_0xc826[357]]();return false;} else {if(this[_0xc826[25]][_0xc826[588]]!==false){this[_0xc826[507]]();this[_0xc826[563]](document[_0xc826[584]](Array(this[_0xc826[25]][_0xc826[588]]+1)[_0xc826[214]](_0xc826[590])));this[_0xc826[357]]();return false;} else {if(!h[_0xc826[549]]){this[_0xc826[273]]();} else {this[_0xc826[271]]();} ;} ;} ;return false;} ,buildEventKeydownBackspace:function (f){if( typeof f[_0xc826[370]]!==_0xc826[12]&&/^(H[1-6])$/i[_0xc826[569]](f[_0xc826[370]])){var e;if(this[_0xc826[25]][_0xc826[204]]===false){e=c(_0xc826[571]+this[_0xc826[25]][_0xc826[572]]+_0xc826[573]);} else {e=c(_0xc826[383]+this[_0xc826[25]][_0xc826[572]]);} ;c(f)[_0xc826[373]](e);this[_0xc826[574]](e);} ;if( typeof f[_0xc826[591]]!==_0xc826[12]&&f[_0xc826[591]]!==null){if(f[_0xc826[322]]&&f[_0xc826[560]]===3&&f[_0xc826[591]][_0xc826[592]](/[^\u200B]/g)==null){f[_0xc826[322]]();} ;} ;} ,buildEventKeydownInsertLineBreak:function (f){this[_0xc826[507]]();f[_0xc826[503]]();this[_0xc826[577]]();this[_0xc826[391]](_0xc826[564],f);return ;} ,buildEventKeyup:function (m){if(this[_0xc826[190]]){return false;} ;var f=m[_0xc826[537]];var h=this[_0xc826[540]]();var l=this[_0xc826[541]]();if(!this[_0xc826[25]][_0xc826[204]]&&l[_0xc826[560]]==3&&(h==false||h[_0xc826[370]]==_0xc826[593])){var j=c(_0xc826[571])[_0xc826[435]](c(l)[_0xc826[594]]());c(l)[_0xc826[373]](j);var g=c(j)[_0xc826[595]]();if( typeof (g[0])!==_0xc826[12]&&g[0][_0xc826[370]]==_0xc826[596]){g[_0xc826[322]]();} ;this[_0xc826[597]](j);} ;if((this[_0xc826[25]][_0xc826[598]]||this[_0xc826[25]][_0xc826[599]]||this[_0xc826[25]][_0xc826[600]])&&f===this[_0xc826[546]][_0xc826[559]]){this[_0xc826[601]]();} ;if(f===this[_0xc826[546]][_0xc826[602]]||f===this[_0xc826[546]][_0xc826[580]]){return this[_0xc826[603]](m);} ;this[_0xc826[391]](_0xc826[604],m);this[_0xc826[357]]();} ,buildEventKeyupConverters:function (){this[_0xc826[607]](this[_0xc826[25]][_0xc826[605]],this[_0xc826[25]][_0xc826[598]],this[_0xc826[25]][_0xc826[599]],this[_0xc826[25]][_0xc826[600]],this[_0xc826[25]][_0xc826[606]]);setTimeout(c[_0xc826[464]](function (){if(this[_0xc826[25]][_0xc826[599]]){this[_0xc826[608]]();} ;if(this[_0xc826[25]][_0xc826[609]]){this[_0xc826[609]]();} ;} ,this),5);} ,buildPlugins:function (){if(!this[_0xc826[25]][_0xc826[610]]){return ;} ;c[_0xc826[19]](this[_0xc826[25]][_0xc826[610]],c[_0xc826[464]](function (e,f){if(RedactorPlugins[f]){c[_0xc826[194]](this,RedactorPlugins[f]);if(c[_0xc826[13]](RedactorPlugins[f][_0xc826[21]])){this[_0xc826[21]]();} ;} ;} ,this));} ,iframeStart:function (){this[_0xc826[611]]();if(this[_0xc826[25]][_0xc826[319]]){this[_0xc826[612]](this.$source);} else {this[_0xc826[613]]=this[_0xc826[192]][_0xc826[433]]();this[_0xc826[192]]=this[_0xc826[434]](this.$sourceOld);this[_0xc826[612]](this.$sourceOld);} ;} ,iframeAppend:function (e){this[_0xc826[192]][_0xc826[341]](_0xc826[336],this[_0xc826[25]][_0xc826[340]])[_0xc826[433]]();this[_0xc826[321]][_0xc826[436]](e)[_0xc826[435]](this.$frame)[_0xc826[435]](this.$source);} ,iframeCreate:function (){this[_0xc826[334]]=c(_0xc826[617])[_0xc826[616]](_0xc826[614],c[_0xc826[464]](function (){if(this[_0xc826[25]][_0xc826[202]]){this[_0xc826[358]]();if(this[_0xc826[419]]===_0xc826[331]){this[_0xc826[419]]=this[_0xc826[25]][_0xc826[572]];} ;this[_0xc826[334]][_0xc826[338]]()[0][_0xc826[363]](this[_0xc826[419]]);this[_0xc826[334]][_0xc826[338]]()[0][_0xc826[364]]();var e=setInterval(c[_0xc826[464]](function (){if(this[_0xc826[334]][_0xc826[338]]()[_0xc826[365]](_0xc826[65])[_0xc826[42]]()){clearInterval(e);this[_0xc826[615]]();} ;} ,this),0);} else {this[_0xc826[615]]();} ;} ,this));} ,iframeDoc:function (){return this[_0xc826[334]][0][_0xc826[618]][_0xc826[208]];} ,iframePage:function (){var e=this[_0xc826[619]]();if(e[_0xc826[620]]){e[_0xc826[621]](e[_0xc826[620]]);} ;return e;} ,iframeAddCss:function (e){e=e||this[_0xc826[25]][_0xc826[199]];if(this[_0xc826[622]](e)){this[_0xc826[334]][_0xc826[338]]()[_0xc826[365]](_0xc826[64])[_0xc826[435]](_0xc826[623]+e+_0xc826[624]);} ;if(c[_0xc826[625]](e)){c[_0xc826[19]](e,c[_0xc826[464]](function (g,f){this[_0xc826[626]](f);} ,this));} ;} ,iframeLoad:function (){this[_0xc826[324]]=this[_0xc826[334]][_0xc826[338]]()[_0xc826[365]](_0xc826[65])[_0xc826[341]]({contenteditable:true,dir:this[_0xc826[25]][_0xc826[340]]});if(this[_0xc826[324]][0]){this[_0xc826[208]]=this[_0xc826[324]][0][_0xc826[627]];this[_0xc826[209]]=this[_0xc826[208]][_0xc826[628]]||window;} ;this[_0xc826[626]]();if(this[_0xc826[25]][_0xc826[202]]){this[_0xc826[629]](this[_0xc826[324]][_0xc826[42]]());} else {this[_0xc826[447]](this[_0xc826[419]],true,false);} ;this[_0xc826[431]]();this[_0xc826[432]]();} ,placeholderStart:function (e){if(this[_0xc826[587]](e)){if(this[_0xc826[191]][_0xc826[341]](_0xc826[630])){this[_0xc826[25]][_0xc826[630]]=this[_0xc826[191]][_0xc826[341]](_0xc826[630]);} ;if(this[_0xc826[25]][_0xc826[630]]===_0xc826[331]){this[_0xc826[25]][_0xc826[630]]=false;} ;if(this[_0xc826[25]][_0xc826[630]]!==false){this[_0xc826[25]][_0xc826[469]]=false;this[_0xc826[631]]();return this[_0xc826[632]]();} ;} ;return false;} ,placeholderEvents:function (){this[_0xc826[324]][_0xc826[476]](_0xc826[633],c[_0xc826[464]](this[_0xc826[634]],this));this[_0xc826[324]][_0xc826[476]](_0xc826[635],c[_0xc826[464]](this[_0xc826[636]],this));} ,placeholderGet:function (){return c(_0xc826[638])[_0xc826[11]](_0xc826[6],_0xc826[637])[_0xc826[341]](_0xc826[325],false)[_0xc826[582]](this[_0xc826[25]][_0xc826[630]]);} ,placeholderBlur:function (){var e=this[_0xc826[318]]();if(this[_0xc826[587]](e)){this[_0xc826[324]][_0xc826[476]](_0xc826[633],c[_0xc826[464]](this[_0xc826[634]],this));this[_0xc826[324]][_0xc826[42]](this[_0xc826[632]]());} ;} ,placeholderFocus:function (){this[_0xc826[324]][_0xc826[365]](_0xc826[639])[_0xc826[322]]();var e=_0xc826[331];if(this[_0xc826[25]][_0xc826[204]]===false){e=this[_0xc826[25]][_0xc826[640]];} ;this[_0xc826[324]][_0xc826[315]](_0xc826[633]);this[_0xc826[324]][_0xc826[42]](e);if(this[_0xc826[25]][_0xc826[204]]===false){this[_0xc826[574]](this[_0xc826[324]][_0xc826[337]]()[0]);} else {this[_0xc826[469]]();} ;this[_0xc826[357]]();} ,placeholderRemove:function (){this[_0xc826[25]][_0xc826[630]]=false;this[_0xc826[324]][_0xc826[365]](_0xc826[639])[_0xc826[322]]();this[_0xc826[324]][_0xc826[315]](_0xc826[633]);} ,placeholderRemoveFromCode:function (e){return e[_0xc826[343]](/<span class="redactor_placeholder"(.*?)>(.*?)<\/span>/i,_0xc826[331]);} ,shortcuts:function (g,f){if(!this[_0xc826[25]][_0xc826[550]]){return ;} ;if(!g[_0xc826[551]]){if(f===77){this[_0xc826[642]](g,_0xc826[641]);} else {if(f===66){this[_0xc826[642]](g,_0xc826[35]);} else {if(f===73){this[_0xc826[642]](g,_0xc826[36]);} else {if(f===74){this[_0xc826[642]](g,_0xc826[267]);} else {if(f===75){this[_0xc826[642]](g,_0xc826[269]);} else {if(f===72){this[_0xc826[642]](g,_0xc826[643]);} else {if(f===76){this[_0xc826[642]](g,_0xc826[644]);} ;} ;} ;} ;} ;} ;} ;} else {if(f===48){this[_0xc826[645]](g,_0xc826[55]);} else {if(f===49){this[_0xc826[645]](g,_0xc826[58]);} else {if(f===50){this[_0xc826[645]](g,_0xc826[59]);} else {if(f===51){this[_0xc826[645]](g,_0xc826[60]);} else {if(f===52){this[_0xc826[645]](g,_0xc826[61]);} else {if(f===53){this[_0xc826[645]](g,_0xc826[62]);} else {if(f===54){this[_0xc826[645]](g,_0xc826[63]);} ;} ;} ;} ;} ;} ;} ;} ;} ,shortcutsLoad:function (g,f){g[_0xc826[503]]();this[_0xc826[467]](f,false);} ,shortcutsLoadFormat:function (g,f){g[_0xc826[503]]();this[_0xc826[249]](f);} ,focus:function (){if(!this[_0xc826[238]](_0xc826[239])){this[_0xc826[209]][_0xc826[647]](c[_0xc826[464]](this[_0xc826[646]],this,true),1);} else {this[_0xc826[324]][_0xc826[469]]();} ;} ,focusWithSaveScroll:function (){if(this[_0xc826[238]](_0xc826[237])){var e=this[_0xc826[208]][_0xc826[620]][_0xc826[524]];} ;this[_0xc826[324]][_0xc826[469]]();if(this[_0xc826[238]](_0xc826[237])){this[_0xc826[208]][_0xc826[620]][_0xc826[524]]=e;} ;} ,focusEnd:function (){if(!this[_0xc826[238]](_0xc826[465])){this[_0xc826[646]]();} else {if(this[_0xc826[25]][_0xc826[204]]===false){var e=this[_0xc826[324]][_0xc826[337]]()[_0xc826[567]]();this[_0xc826[324]][_0xc826[469]]();this[_0xc826[597]](e);} else {this[_0xc826[646]]();} ;} ;} ,focusSet:function (h,f){this[_0xc826[324]][_0xc826[469]]();if( typeof f==_0xc826[12]){f=this[_0xc826[324]][0];} ;var e=this[_0xc826[648]]();e[_0xc826[649]](f);e[_0xc826[650]](h||false);var g=this[_0xc826[651]]();g[_0xc826[652]]();g[_0xc826[653]](e);} ,toggle:function (e){if(this[_0xc826[25]][_0xc826[470]]){this[_0xc826[654]](e);} else {this[_0xc826[655]]();} ;} ,toggleVisual:function (){var e=this[_0xc826[192]][_0xc826[433]]()[_0xc826[323]]();if( typeof this[_0xc826[656]]!==_0xc826[12]){this[_0xc826[656]]=this[_0xc826[361]](this[_0xc826[656]],false)!==this[_0xc826[361]](e,false);} ;if(this[_0xc826[656]]){if(this[_0xc826[25]][_0xc826[202]]&&e===_0xc826[331]){this[_0xc826[629]](e);} else {this[_0xc826[447]](e);if(this[_0xc826[25]][_0xc826[202]]){this[_0xc826[461]]();} ;} ;} ;if(this[_0xc826[25]][_0xc826[203]]){this[_0xc826[334]][_0xc826[247]]();} else {this[_0xc826[324]][_0xc826[247]]();} ;if(this[_0xc826[25]][_0xc826[202]]){this[_0xc826[324]][_0xc826[341]](_0xc826[325],true);} ;this[_0xc826[192]][_0xc826[315]](_0xc826[657]);this[_0xc826[324]][_0xc826[469]]();this[_0xc826[526]]();this[_0xc826[463]]();this[_0xc826[658]]();this[_0xc826[659]](_0xc826[42]);this[_0xc826[25]][_0xc826[470]]=true;} ,toggleCode:function (g){if(g!==false){this[_0xc826[521]]();} ;var e=null;if(this[_0xc826[25]][_0xc826[203]]){e=this[_0xc826[334]][_0xc826[198]]();if(this[_0xc826[25]][_0xc826[202]]){this[_0xc826[324]][_0xc826[326]](_0xc826[325]);} ;this[_0xc826[334]][_0xc826[433]]();} else {e=this[_0xc826[324]][_0xc826[660]]();this[_0xc826[324]][_0xc826[433]]();} ;var f=this[_0xc826[192]][_0xc826[323]]();if(f!==_0xc826[331]&&this[_0xc826[25]][_0xc826[661]]){this[_0xc826[192]][_0xc826[323]](this[_0xc826[662]](f));} ;this[_0xc826[656]]=f;this[_0xc826[192]][_0xc826[198]](e)[_0xc826[247]]()[_0xc826[469]]();this[_0xc826[192]][_0xc826[476]](_0xc826[657],this[_0xc826[663]]);this[_0xc826[664]]();this[_0xc826[665]](_0xc826[42]);this[_0xc826[25]][_0xc826[470]]=false;} ,textareaIndenting:function (g){if(g[_0xc826[546]]===9){var f=c(this);var h=f[_0xc826[318]](0)[_0xc826[574]];f[_0xc826[323]](f[_0xc826[323]]()[_0xc826[666]](0,h)+_0xc826[589]+f[_0xc826[323]]()[_0xc826[666]](f[_0xc826[318]](0)[_0xc826[597]]));f[_0xc826[318]](0)[_0xc826[574]]=f[_0xc826[318]](0)[_0xc826[597]]=h+1;return false;} ;} ,autosave:function (){var e=false;this[_0xc826[313]]=setInterval(c[_0xc826[464]](function (){var f=this[_0xc826[318]]();if(e!==f){c[_0xc826[669]]({url:this[_0xc826[25]][_0xc826[462]],type:_0xc826[667],data:this[_0xc826[192]][_0xc826[341]](_0xc826[440])+_0xc826[668]+escape(encodeURIComponent(f)),success:c[_0xc826[464]](function (g){this[_0xc826[391]](_0xc826[462],false,g);e=f;} ,this)});} ;} ,this),this[_0xc826[25]][_0xc826[313]]*1000);} ,toolbarBuild:function (){if(this[_0xc826[424]]()&&this[_0xc826[25]][_0xc826[670]][_0xc826[20]]>0){c[_0xc826[19]](this[_0xc826[25]][_0xc826[670]],c[_0xc826[464]](function (g,h){var f=this[_0xc826[25]][_0xc826[240]][_0xc826[506]](h);this[_0xc826[25]][_0xc826[240]][_0xc826[236]](f,1);} ,this));} ;if(this[_0xc826[25]][_0xc826[332]]){this[_0xc826[25]][_0xc826[240]]=this[_0xc826[25]][_0xc826[671]];} else {if(!this[_0xc826[25]][_0xc826[672]]){var e=this[_0xc826[25]][_0xc826[240]][_0xc826[506]](_0xc826[42]);this[_0xc826[25]][_0xc826[240]][_0xc826[236]](e,1);} ;} ;if(this[_0xc826[25]][_0xc826[456]]){c[_0xc826[19]](this[_0xc826[25]][_0xc826[456]][_0xc826[34]][_0xc826[673]],c[_0xc826[464]](function (f,g){if(c[_0xc826[233]](f,this[_0xc826[25]][_0xc826[674]])==_0xc826[234]){delete this[_0xc826[25]][_0xc826[456]][_0xc826[34]][_0xc826[673]][f];} ;} ,this));} ;if(this[_0xc826[25]][_0xc826[240]][_0xc826[20]]===0){return false;} ;this[_0xc826[675]]();this[_0xc826[335]]=c(_0xc826[677])[_0xc826[446]](_0xc826[491])[_0xc826[341]](_0xc826[441],_0xc826[676]+this[_0xc826[193]]);if(this[_0xc826[25]][_0xc826[454]]){this[_0xc826[335]][_0xc826[446]](_0xc826[678]);} ;if(this[_0xc826[25]][_0xc826[679]]&&this[_0xc826[424]]()){this[_0xc826[335]][_0xc826[446]](_0xc826[680]);} ;if(this[_0xc826[25]][_0xc826[332]]){this[_0xc826[681]]=c(_0xc826[683])[_0xc826[341]](_0xc826[441],_0xc826[682]+this[_0xc826[193]])[_0xc826[433]]();this[_0xc826[681]][_0xc826[435]](this.$toolbar);c(_0xc826[65])[_0xc826[435]](this.$air);} else {if(this[_0xc826[25]][_0xc826[330]]){this[_0xc826[335]][_0xc826[446]](_0xc826[684]);c(this[_0xc826[25]][_0xc826[330]])[_0xc826[42]](this.$toolbar);} else {this[_0xc826[321]][_0xc826[685]](this.$toolbar);} ;} ;c[_0xc826[19]](this[_0xc826[25]][_0xc826[240]],c[_0xc826[464]](function (g,h){if(this[_0xc826[25]][_0xc826[456]][h]){var f=this[_0xc826[25]][_0xc826[456]][h];if(this[_0xc826[25]][_0xc826[686]]===false&&h===_0xc826[30]){return true;} ;this[_0xc826[335]][_0xc826[435]](c(_0xc826[688])[_0xc826[435]](this[_0xc826[687]](h,f)));} ;} ,this));this[_0xc826[335]][_0xc826[365]](_0xc826[689])[_0xc826[341]](_0xc826[448],_0xc826[234]);if(this[_0xc826[25]][_0xc826[207]]){this[_0xc826[690]]();c(this[_0xc826[25]][_0xc826[692]])[_0xc826[476]](_0xc826[691],c[_0xc826[464]](this[_0xc826[690]],this));} ;if(this[_0xc826[25]][_0xc826[693]]){this[_0xc826[324]][_0xc826[476]](_0xc826[694],c[_0xc826[464]](this[_0xc826[695]],this));} ;} ,toolbarObserveScroll:function (){var j=c(this[_0xc826[25]][_0xc826[692]])[_0xc826[524]]();var g=this[_0xc826[321]][_0xc826[697]]()[_0xc826[696]];var h=0;var e=g+this[_0xc826[321]][_0xc826[198]]()+40;if(j>g){var f=_0xc826[698];if(this[_0xc826[25]][_0xc826[206]]){h=this[_0xc826[321]][_0xc826[697]]()[_0xc826[699]];f=this[_0xc826[321]][_0xc826[700]]();this[_0xc826[335]][_0xc826[446]](_0xc826[701]);} ;this[_0xc826[207]]=true;this[_0xc826[335]][_0xc826[199]]({position:_0xc826[702],width:f,zIndex:1005,top:this[_0xc826[25]][_0xc826[703]]+_0xc826[451],left:h});if(j<e){this[_0xc826[335]][_0xc826[199]](_0xc826[704],_0xc826[705]);} else {this[_0xc826[335]][_0xc826[199]](_0xc826[704],_0xc826[706]);} ;} else {this[_0xc826[207]]=false;this[_0xc826[335]][_0xc826[199]]({position:_0xc826[707],width:_0xc826[529],top:0,left:h});if(this[_0xc826[25]][_0xc826[206]]){this[_0xc826[335]][_0xc826[328]](_0xc826[701]);} ;} ;} ,airEnable:function (){if(!this[_0xc826[25]][_0xc826[332]]){return ;} ;this[_0xc826[324]][_0xc826[476]](_0xc826[694],this,c[_0xc826[464]](function (g){var j=this[_0xc826[708]]();if(g[_0xc826[505]]===_0xc826[709]&&j!=_0xc826[331]){this[_0xc826[710]](g);} ;if(g[_0xc826[505]]===_0xc826[604]&&g[_0xc826[549]]&&j!=_0xc826[331]){var f=c(this[_0xc826[712]](this[_0xc826[651]]()[_0xc826[711]])),h=f[_0xc826[697]]();h[_0xc826[198]]=f[_0xc826[198]]();this[_0xc826[710]](h,true);} ;} ,this));} ,airShow:function (l,f){if(!this[_0xc826[25]][_0xc826[332]]){return ;} ;var j,h;c(_0xc826[713])[_0xc826[433]]();if(f){j=l[_0xc826[699]];h=l[_0xc826[696]]+l[_0xc826[198]]+14;if(this[_0xc826[25]][_0xc826[203]]){h+=this[_0xc826[321]][_0xc826[714]]()[_0xc826[696]]-c(this[_0xc826[208]])[_0xc826[524]]();j+=this[_0xc826[321]][_0xc826[714]]()[_0xc826[699]];} ;} else {var g=this[_0xc826[681]][_0xc826[700]]();j=l[_0xc826[715]];if(c(this[_0xc826[208]])[_0xc826[201]]()<(j+g)){j-=g;} ;h=l[_0xc826[716]]+14;if(this[_0xc826[25]][_0xc826[203]]){h+=this[_0xc826[321]][_0xc826[714]]()[_0xc826[696]];j+=this[_0xc826[321]][_0xc826[714]]()[_0xc826[699]];} else {h+=c(this[_0xc826[208]])[_0xc826[524]]();} ;} ;this[_0xc826[681]][_0xc826[199]]({left:j+_0xc826[451],top:h+_0xc826[451]})[_0xc826[247]]();this[_0xc826[717]]();} ,airBindHide:function (){if(!this[_0xc826[25]][_0xc826[332]]){return ;} ;var e=c[_0xc826[464]](function (f){c(f)[_0xc826[476]](_0xc826[721],c[_0xc826[464]](function (g){if(c(g[_0xc826[488]])[_0xc826[722]](this.$toolbar)[_0xc826[20]]===0){this[_0xc826[681]][_0xc826[720]](100);this[_0xc826[723]]();c(f)[_0xc826[315]](g);} ;} ,this))[_0xc826[476]](_0xc826[480],c[_0xc826[464]](function (g){if(g[_0xc826[537]]===this[_0xc826[546]][_0xc826[718]]){this[_0xc826[651]]()[_0xc826[719]]();} ;this[_0xc826[681]][_0xc826[720]](100);c(f)[_0xc826[315]](g);} ,this));} ,this);e(document);if(this[_0xc826[25]][_0xc826[203]]){e(this[_0xc826[208]]);} ;} ,airBindMousemoveHide:function (){if(!this[_0xc826[25]][_0xc826[332]]){return ;} ;var e=c[_0xc826[464]](function (f){c(f)[_0xc826[476]](_0xc826[724],c[_0xc826[464]](function (g){if(c(g[_0xc826[488]])[_0xc826[722]](this.$toolbar)[_0xc826[20]]===0){this[_0xc826[681]][_0xc826[720]](100);c(f)[_0xc826[315]](g);} ;} ,this));} ,this);e(document);if(this[_0xc826[25]][_0xc826[203]]){e(this[_0xc826[208]]);} ;} ,dropdownBuild:function (f,e){c[_0xc826[19]](e,c[_0xc826[464]](function (j,h){if(!h[_0xc826[444]]){h[_0xc826[444]]=_0xc826[331];} ;var g;if(h[_0xc826[440]]===_0xc826[279]){g=c(_0xc826[725]);} else {g=c(_0xc826[726]+h[_0xc826[444]]+_0xc826[727]+j+_0xc826[728]+h[_0xc826[729]]+_0xc826[730]);g[_0xc826[476]](_0xc826[731],c[_0xc826[464]](function (l){if(l[_0xc826[503]]){l[_0xc826[503]]();} ;if(this[_0xc826[238]](_0xc826[237])){l[_0xc826[732]]=false;} ;if(h[_0xc826[391]]){h[_0xc826[391]][_0xc826[8]](this,j,g,h,l);} ;if(h[_0xc826[733]]){this[_0xc826[467]](h[_0xc826[733]],j);} ;if(h[_0xc826[734]]){this[h[_0xc826[734]]](j);} ;this[_0xc826[695]]();if(this[_0xc826[25]][_0xc826[332]]){this[_0xc826[681]][_0xc826[720]](100);} ;} ,this));} ;f[_0xc826[435]](g);} ,this));} ,dropdownShow:function (m,q){if(!this[_0xc826[25]][_0xc826[470]]){m[_0xc826[503]]();return false;} ;var n=this[_0xc826[335]][_0xc826[365]](_0xc826[735]+q);var f=this[_0xc826[736]](q);if(f[_0xc826[492]](_0xc826[737])){this[_0xc826[738]]();} else {this[_0xc826[738]]();this[_0xc826[665]](q);f[_0xc826[446]](_0xc826[737]);var r=f[_0xc826[714]]();if(this[_0xc826[207]]){r=f[_0xc826[697]]();} ;var o=n[_0xc826[201]]();if((r[_0xc826[699]]+o)>c(document)[_0xc826[201]]()){r[_0xc826[699]]-=o;} ;var h=r[_0xc826[699]]+_0xc826[451];var j=f[_0xc826[660]]();var l=_0xc826[739];var p=j+_0xc826[451];if(this[_0xc826[25]][_0xc826[207]]&&this[_0xc826[207]]){l=_0xc826[702];} else {if(!this[_0xc826[25]][_0xc826[332]]){p=r[_0xc826[696]]+j+_0xc826[451];} ;} ;n[_0xc826[199]]({position:l,left:h,top:p})[_0xc826[247]]();} ;var g=c[_0xc826[464]](function (s){this[_0xc826[740]](s,n);} ,this);c(document)[_0xc826[616]](_0xc826[731],g);this[_0xc826[324]][_0xc826[616]](_0xc826[731],g);m[_0xc826[741]]();this[_0xc826[742]]();} ,dropdownHideAll:function (){this[_0xc826[335]][_0xc826[365]](_0xc826[744])[_0xc826[328]](_0xc826[743])[_0xc826[328]](_0xc826[737]);c(_0xc826[745])[_0xc826[433]]();} ,dropdownHide:function (g,f){if(!c(g[_0xc826[488]])[_0xc826[492]](_0xc826[737])){f[_0xc826[328]](_0xc826[737]);this[_0xc826[738]]();} ;} ,buttonBuild:function (j,f,e){var g=c(_0xc826[746]+f[_0xc826[729]]+_0xc826[747]+j+_0xc826[748]);if( typeof e!=_0xc826[12]){g[_0xc826[446]](_0xc826[749]);} ;g[_0xc826[476]](_0xc826[731],c[_0xc826[464]](function (l){if(l[_0xc826[503]]){l[_0xc826[503]]();} ;if(this[_0xc826[238]](_0xc826[237])){l[_0xc826[732]]=false;} ;if(g[_0xc826[492]](_0xc826[750])){return false;} ;if(this[_0xc826[751]]()===false&&!f[_0xc826[733]]){this[_0xc826[742]]();} ;if(f[_0xc826[733]]){this[_0xc826[742]]();this[_0xc826[467]](f[_0xc826[733]],j);this[_0xc826[752]]();} else {if(f[_0xc826[734]]&&f[_0xc826[734]]!==_0xc826[247]){this[f[_0xc826[734]]](j);this[_0xc826[752]]();} else {if(f[_0xc826[391]]){f[_0xc826[391]][_0xc826[8]](this,j,g,f,l);this[_0xc826[752]]();} else {if(f[_0xc826[673]]){this[_0xc826[753]](l,j);} ;} ;} ;} ;this[_0xc826[695]](false,j);} ,this));if(f[_0xc826[673]]){var h=c(_0xc826[754]+j+_0xc826[755]);h[_0xc826[756]](this.$toolbar);this[_0xc826[757]](h,f[_0xc826[673]]);} ;return g;} ,buttonGet:function (e){if(!this[_0xc826[25]][_0xc826[456]]){return false;} ;return c(this[_0xc826[335]][_0xc826[365]](_0xc826[758]+e));} ,buttonTagToActiveState:function (e,f){this[_0xc826[25]][_0xc826[693]][_0xc826[15]](e);this[_0xc826[25]][_0xc826[759]][f]=e;} ,buttonActiveToggle:function (f){var e=this[_0xc826[736]](f);if(e[_0xc826[492]](_0xc826[743])){this[_0xc826[659]](f);} else {this[_0xc826[665]](f);} ;} ,buttonActive:function (f){var e=this[_0xc826[736]](f);e[_0xc826[446]](_0xc826[743]);} ,buttonInactive:function (f){var e=this[_0xc826[736]](f);e[_0xc826[328]](_0xc826[743]);} ,buttonInactiveAll:function (e){this[_0xc826[335]][_0xc826[365]](_0xc826[762])[_0xc826[761]](_0xc826[760]+e)[_0xc826[328]](_0xc826[743]);} ,buttonActiveVisual:function (){this[_0xc826[335]][_0xc826[365]](_0xc826[762])[_0xc826[761]](_0xc826[763])[_0xc826[328]](_0xc826[750]);} ,buttonInactiveVisual:function (){this[_0xc826[335]][_0xc826[365]](_0xc826[762])[_0xc826[761]](_0xc826[763])[_0xc826[446]](_0xc826[750]);} ,buttonChangeIcon:function (e,f){this[_0xc826[736]](e)[_0xc826[446]](_0xc826[764]+f);} ,buttonRemoveIcon:function (e,f){this[_0xc826[736]](e)[_0xc826[328]](_0xc826[764]+f);} ,buttonAwesome:function (g,e){var f=this[_0xc826[736]](g);f[_0xc826[328]](_0xc826[749]);f[_0xc826[446]](_0xc826[765]);f[_0xc826[42]](_0xc826[766]+e+_0xc826[767]);} ,buttonAdd:function (f,g,j,h){if(!this[_0xc826[25]][_0xc826[456]]){return ;} ;var e=this[_0xc826[687]](f,{title:g,callback:j,dropdown:h},true);this[_0xc826[335]][_0xc826[435]](c(_0xc826[688])[_0xc826[435]](e));} ,buttonAddFirst:function (f,g,j,h){if(!this[_0xc826[25]][_0xc826[456]]){return ;} ;var e=this[_0xc826[687]](f,{title:g,callback:j,dropdown:h},true);this[_0xc826[335]][_0xc826[685]](c(_0xc826[688])[_0xc826[435]](e));} ,buttonAddAfter:function (m,f,h,l,j){if(!this[_0xc826[25]][_0xc826[456]]){return ;} ;var e=this[_0xc826[687]](f,{title:h,callback:l,dropdown:j},true);var g=this[_0xc826[736]](m);if(g[_0xc826[493]]()!==0){g[_0xc826[548]]()[_0xc826[320]](c(_0xc826[688])[_0xc826[435]](e));} else {this[_0xc826[335]][_0xc826[435]](c(_0xc826[688])[_0xc826[435]](e));} ;} ,buttonAddBefore:function (j,f,h,m,l){if(!this[_0xc826[25]][_0xc826[456]]){return ;} ;var e=this[_0xc826[687]](f,{title:h,callback:m,dropdown:l},true);var g=this[_0xc826[736]](j);if(g[_0xc826[493]]()!==0){g[_0xc826[548]]()[_0xc826[768]](c(_0xc826[688])[_0xc826[435]](e));} else {this[_0xc826[335]][_0xc826[435]](c(_0xc826[688])[_0xc826[435]](e));} ;} ,buttonRemove:function (e){var f=this[_0xc826[736]](e);f[_0xc826[322]]();} ,buttonActiveObserver:function (h,l){var f=this[_0xc826[540]]();this[_0xc826[769]](l);if(h===false&&l!==_0xc826[42]){if(c[_0xc826[233]](l,this[_0xc826[25]][_0xc826[693]])!=-1){this[_0xc826[770]](l);} ;return ;} ;if(f&&f[_0xc826[370]]===_0xc826[771]){this[_0xc826[335]][_0xc826[365]](_0xc826[773])[_0xc826[582]](this[_0xc826[25]][_0xc826[242]][_0xc826[772]]);} else {this[_0xc826[335]][_0xc826[365]](_0xc826[773])[_0xc826[582]](this[_0xc826[25]][_0xc826[242]][_0xc826[298]]);} ;c[_0xc826[19]](this[_0xc826[25]][_0xc826[759]],c[_0xc826[464]](function (e,m){if(c(f)[_0xc826[722]](e,this[_0xc826[324]][_0xc826[318]]()[0])[_0xc826[20]]!=0){this[_0xc826[665]](m);} ;} ,this));var g=c(f)[_0xc826[722]](this[_0xc826[25]][_0xc826[775]].toString()[_0xc826[774]](),this[_0xc826[324]][0]);if(g[_0xc826[20]]){var j=g[_0xc826[199]](_0xc826[776]);switch(j){case _0xc826[777]:this[_0xc826[665]](_0xc826[53]);break ;;case _0xc826[778]:this[_0xc826[665]](_0xc826[52]);break ;;case _0xc826[54]:this[_0xc826[665]](_0xc826[779]);break ;;default:this[_0xc826[665]](_0xc826[51]);break ;;} ;} ;} ,execPasteFrag:function (e){var j=this[_0xc826[209]][_0xc826[651]]();if(j[_0xc826[780]]&&j[_0xc826[781]]){range=j[_0xc826[780]](0);range[_0xc826[782]]();var f=document[_0xc826[562]](_0xc826[106]);f[_0xc826[783]]=e;var m=document[_0xc826[784]](),h,g;while((h=f[_0xc826[786]])){g=m[_0xc826[785]](h);} ;var l=m[_0xc826[786]];range[_0xc826[563]](m);if(g){range=range[_0xc826[787]]();range[_0xc826[788]](g);range[_0xc826[650]](true);} ;j[_0xc826[652]]();j[_0xc826[653]](range);} ;} ,exec:function (f,g,e){if(f===_0xc826[789]&&this[_0xc826[238]](_0xc826[237])){g=_0xc826[369]+g+_0xc826[790];} ;if(f===_0xc826[791]&&this[_0xc826[238]](_0xc826[237])){if(!this[_0xc826[792]]()){this[_0xc826[742]]();this[_0xc826[208]][_0xc826[795]][_0xc826[794]]()[_0xc826[793]](g);} else {this[_0xc826[796]](g);} ;} else {this[_0xc826[208]][_0xc826[467]](f,false,g);} ;if(e!==false){this[_0xc826[357]]();} ;this[_0xc826[391]](_0xc826[467],f,g);} ,execCommand:function (g,h,f){if(!this[_0xc826[25]][_0xc826[470]]){this[_0xc826[192]][_0xc826[469]]();return false;} ;if(g===_0xc826[643]||g===_0xc826[644]){var e=this[_0xc826[540]]();if(e[_0xc826[370]]===_0xc826[797]||e[_0xc826[370]]===_0xc826[798]){this[_0xc826[799]](e);} ;} ;if(g===_0xc826[791]){this[_0xc826[800]](h,f);this[_0xc826[391]](_0xc826[467],g,h);return ;} ;if(this[_0xc826[801]](_0xc826[119])&&!this[_0xc826[25]][_0xc826[802]]){return false;} ;if(g===_0xc826[267]||g===_0xc826[269]){return this[_0xc826[803]](g,h);} ;if(g===_0xc826[300]){return this[_0xc826[804]](g,h);} ;this[_0xc826[733]](g,h,f);if(g===_0xc826[311]){this[_0xc826[324]][_0xc826[365]](_0xc826[96])[_0xc826[326]](_0xc826[441]);} ;} ,execUnlink:function (f,g){this[_0xc826[507]]();var e=this[_0xc826[801]](_0xc826[771]);if(e){c(e)[_0xc826[373]](c(e)[_0xc826[582]]());this[_0xc826[357]]();this[_0xc826[391]](_0xc826[467],f,g);return ;} ;} ,execLists:function (j,h){this[_0xc826[507]]();var q=this[_0xc826[540]]();var n=c(q)[_0xc826[722]](_0xc826[805]);if(!this[_0xc826[806]](n)&&n[_0xc826[493]]()!=0){n=false;} ;var m=false;if(n&&n[_0xc826[20]]){m=true;var p=n[0][_0xc826[370]];if((j===_0xc826[267]&&p===_0xc826[807])||(j===_0xc826[269]&&p===_0xc826[808])){m=false;} ;} ;this[_0xc826[521]]();if(m){var f=this[_0xc826[809]]();var g=this[_0xc826[810]](f);if( typeof f[0]!=_0xc826[12]&&f[_0xc826[20]]>1&&f[0][_0xc826[560]]==3){g[_0xc826[811]](this[_0xc826[542]]());} ;var l=_0xc826[331],r=_0xc826[331];c[_0xc826[19]](g,c[_0xc826[464]](function (v,w){if(w[_0xc826[370]]==_0xc826[118]){var u=c(w);var t=u[_0xc826[594]]();t[_0xc826[365]](_0xc826[117],_0xc826[112])[_0xc826[322]]();if(this[_0xc826[25]][_0xc826[204]]===false){l+=this[_0xc826[339]](c(_0xc826[571])[_0xc826[435]](t[_0xc826[338]]()));} else {l+=t[_0xc826[42]]()+_0xc826[383];} ;if(v==0){u[_0xc826[446]](_0xc826[813])[_0xc826[812]]();r=this[_0xc826[339]](u);} else {u[_0xc826[322]]();} ;} ;} ,this));html=this[_0xc826[324]][_0xc826[42]]()[_0xc826[343]](r,_0xc826[372]+p+_0xc826[790]+l+_0xc826[369]+p+_0xc826[790]);this[_0xc826[324]][_0xc826[42]](html);this[_0xc826[324]][_0xc826[365]](p+_0xc826[814])[_0xc826[322]]();} else {var e=c(this[_0xc826[540]]())[_0xc826[722]](_0xc826[114]);this[_0xc826[208]][_0xc826[467]](j);var q=this[_0xc826[540]]();var n=c(q)[_0xc826[722]](_0xc826[805]);if(e[_0xc826[493]]()!=0){n[_0xc826[816]](_0xc826[815]);} ;if(n[_0xc826[20]]){var o=n[_0xc826[548]]();if(this[_0xc826[806]](o)&&o[0][_0xc826[370]]!=_0xc826[118]&&this[_0xc826[817]](o[0])){o[_0xc826[373]](o[_0xc826[338]]());} ;} ;if(this[_0xc826[238]](_0xc826[465])){this[_0xc826[324]][_0xc826[469]]();} ;} ;this[_0xc826[526]]();this[_0xc826[357]]();this[_0xc826[391]](_0xc826[467],j,h);return ;} ,indentingIndent:function (){this[_0xc826[818]](_0xc826[41]);} ,indentingOutdent:function (){this[_0xc826[818]](_0xc826[40]);} ,indentingStart:function (h){this[_0xc826[507]]();if(h===_0xc826[41]){var j=this[_0xc826[542]]();this[_0xc826[521]]();if(j&&j[_0xc826[370]]==_0xc826[118]){var o=this[_0xc826[540]]();var l=c(o)[_0xc826[722]](_0xc826[805]);var n=l[0][_0xc826[370]];var f=this[_0xc826[810]]();c[_0xc826[19]](f,function (t,u){if(u[_0xc826[370]]==_0xc826[118]){var r=c(u)[_0xc826[819]]();if(r[_0xc826[493]]()!=0&&r[0][_0xc826[370]]==_0xc826[118]){var q=r[_0xc826[337]](_0xc826[820]);if(q[_0xc826[493]]()==0){r[_0xc826[435]](c(_0xc826[369]+n+_0xc826[790])[_0xc826[435]](u));} else {q[_0xc826[435]](u);} ;} ;} ;} );} else {if(j===false&&this[_0xc826[25]][_0xc826[204]]===true){this[_0xc826[733]](_0xc826[821],_0xc826[56]);var p=this[_0xc826[542]]();var j=c(_0xc826[822])[_0xc826[42]](c(p)[_0xc826[42]]());c(p)[_0xc826[373]](j);var g=this[_0xc826[824]](c(j)[_0xc826[199]](_0xc826[823]))+this[_0xc826[25]][_0xc826[825]];c(j)[_0xc826[199]](_0xc826[823],g+_0xc826[451]);} else {var e=this[_0xc826[810]]();c[_0xc826[19]](e,c[_0xc826[464]](function (r,s){var q=false;if(s[_0xc826[370]]===_0xc826[85]){return ;} ;if(c[_0xc826[233]](s[_0xc826[370]],this[_0xc826[25]][_0xc826[775]])!==-1){q=c(s);} else {q=c(s)[_0xc826[722]](this[_0xc826[25]][_0xc826[775]].toString()[_0xc826[774]](),this[_0xc826[324]][0]);} ;var t=this[_0xc826[824]](q[_0xc826[199]](_0xc826[823]))+this[_0xc826[25]][_0xc826[825]];q[_0xc826[199]](_0xc826[823],t+_0xc826[451]);} ,this));} ;} ;this[_0xc826[526]]();} else {this[_0xc826[521]]();var j=this[_0xc826[542]]();if(j&&j[_0xc826[370]]==_0xc826[118]){var f=this[_0xc826[810]]();var m=0;this[_0xc826[826]](j,m,f);} else {var e=this[_0xc826[810]]();c[_0xc826[19]](e,c[_0xc826[464]](function (r,s){var q=false;if(c[_0xc826[233]](s[_0xc826[370]],this[_0xc826[25]][_0xc826[775]])!==-1){q=c(s);} else {q=c(s)[_0xc826[722]](this[_0xc826[25]][_0xc826[775]].toString()[_0xc826[774]](),this[_0xc826[324]][0]);} ;var t=this[_0xc826[824]](q[_0xc826[199]](_0xc826[823]))-this[_0xc826[25]][_0xc826[825]];if(t<=0){if(this[_0xc826[25]][_0xc826[204]]===true&& typeof (q[_0xc826[11]](_0xc826[827]))!==_0xc826[12]){q[_0xc826[373]](q[_0xc826[42]]());} else {q[_0xc826[199]](_0xc826[823],_0xc826[331]);this[_0xc826[828]](q,_0xc826[68]);} ;} else {q[_0xc826[199]](_0xc826[823],t+_0xc826[451]);} ;} ,this));} ;this[_0xc826[526]]();} ;this[_0xc826[357]]();} ,insideOutdent:function (e,g,f){if(e&&e[_0xc826[370]]==_0xc826[118]){var h=c(e)[_0xc826[548]]()[_0xc826[548]]();if(h[_0xc826[493]]()!=0&&h[0][_0xc826[370]]==_0xc826[118]){h[_0xc826[320]](e);} else {if( typeof f[g]!=_0xc826[12]){e=f[g];g++;this[_0xc826[826]](e,g,f);} else {this[_0xc826[467]](_0xc826[267]);} ;} ;} ;} ,alignmentLeft:function (){this[_0xc826[830]](_0xc826[331],_0xc826[829]);} ,alignmentRight:function (){this[_0xc826[830]](_0xc826[777],_0xc826[831]);} ,alignmentCenter:function (){this[_0xc826[830]](_0xc826[778],_0xc826[832]);} ,alignmentJustify:function (){this[_0xc826[830]](_0xc826[54],_0xc826[833]);} ,alignmentSet:function (f,h){this[_0xc826[507]]();if(this[_0xc826[834]]()){this[_0xc826[208]][_0xc826[467]](h,false,false);return true;} ;this[_0xc826[521]]();var j=this[_0xc826[542]]();if(!j&&this[_0xc826[25]][_0xc826[204]]){this[_0xc826[733]](_0xc826[821],_0xc826[56]);var e=this[_0xc826[542]]();var j=c(_0xc826[822])[_0xc826[42]](c(e)[_0xc826[42]]());c(e)[_0xc826[373]](j);c(j)[_0xc826[199]](_0xc826[776],f);this[_0xc826[828]](j,_0xc826[68]);if(f==_0xc826[331]&& typeof (c(j)[_0xc826[11]](_0xc826[827]))!==_0xc826[12]){c(j)[_0xc826[373]](c(j)[_0xc826[42]]());} ;} else {var g=this[_0xc826[810]]();c[_0xc826[19]](g,c[_0xc826[464]](function (m,n){var l=false;if(c[_0xc826[233]](n[_0xc826[370]],this[_0xc826[25]][_0xc826[775]])!==-1){l=c(n);} else {l=c(n)[_0xc826[722]](this[_0xc826[25]][_0xc826[775]].toString()[_0xc826[774]](),this[_0xc826[324]][0]);} ;if(l){l[_0xc826[199]](_0xc826[776],f);this[_0xc826[828]](l,_0xc826[68]);} ;} ,this));} ;this[_0xc826[526]]();this[_0xc826[357]]();} ,cleanEmpty:function (e){var f=this[_0xc826[835]](e);if(f!==false){return f;} ;if(this[_0xc826[25]][_0xc826[204]]===false){if(e===_0xc826[331]){e=this[_0xc826[25]][_0xc826[640]];} else {if(e[_0xc826[585]](/^<hr\s?\/?>$/gi)!==-1){e=_0xc826[836]+this[_0xc826[25]][_0xc826[640]];} ;} ;} ;return e;} ,cleanConverters:function (e){if(this[_0xc826[25]][_0xc826[837]]){e=e[_0xc826[343]](/<div(.*?)>([\w\W]*?)<\/div>/gi,_0xc826[838]);} ;if(this[_0xc826[25]][_0xc826[205]]){e=this[_0xc826[839]](e);} ;return e;} ,cleanConvertProtected:function (e){if(this[_0xc826[25]][_0xc826[840]]){e=e[_0xc826[343]](/\{\{(.*?)\}\}/gi,_0xc826[841]);e=e[_0xc826[343]](/\{(.*?)\}/gi,_0xc826[842]);} ;e=e[_0xc826[343]](/<script(.*?)>([\w\W]*?)<\/script>/gi,_0xc826[843]);e=e[_0xc826[343]](/<style(.*?)>([\w\W]*?)<\/style>/gi,_0xc826[844]);e=e[_0xc826[343]](/<form(.*?)>([\w\W]*?)<\/form>/gi,_0xc826[845]);if(this[_0xc826[25]][_0xc826[846]]){e=e[_0xc826[343]](/<\?php([\w\W]*?)\?>/gi,_0xc826[847]);} else {e=e[_0xc826[343]](/<\?php([\w\W]*?)\?>/gi,_0xc826[331]);} ;return e;} ,cleanReConvertProtected:function (e){if(this[_0xc826[25]][_0xc826[840]]){e=e[_0xc826[343]](/<!-- template double (.*?) -->/gi,_0xc826[848]);e=e[_0xc826[343]](/<!-- template (.*?) -->/gi,_0xc826[849]);} ;e=e[_0xc826[343]](/<title type="text\/javascript" style="display: none;" class="redactor-script-tag"(.*?)>([\w\W]*?)<\/title>/gi,_0xc826[850]);e=e[_0xc826[343]](/<section(.*?) style="display: none;" rel="redactor-style-tag">([\w\W]*?)<\/section>/gi,_0xc826[851]);e=e[_0xc826[343]](/<section(.*?)rel="redactor-form-tag"(.*?)>([\w\W]*?)<\/section>/gi,_0xc826[852]);if(this[_0xc826[25]][_0xc826[846]]){e=e[_0xc826[343]](/<section style="display: none;" rel="redactor-php-tag">([\w\W]*?)<\/section>/gi,_0xc826[853]);} ;return e;} ,cleanRemoveSpaces:function (f,e){if(e!==false){var e=[];var h=f[_0xc826[592]](/<(pre|style|script|title)(.*?)>([\w\W]*?)<\/(pre|style|script|title)>/gi);if(h===null){h=[];} ;if(this[_0xc826[25]][_0xc826[846]]){var g=f[_0xc826[592]](/<\?php([\w\W]*?)\?>/gi);if(g){h=c[_0xc826[854]](h,g);} ;} ;if(h){c[_0xc826[19]](h,function (j,l){f=f[_0xc826[343]](l,_0xc826[855]+j);e[_0xc826[15]](l);} );} ;} ;f=f[_0xc826[343]](/\n/g,_0xc826[856]);f=f[_0xc826[343]](/[\t]*/g,_0xc826[331]);f=f[_0xc826[343]](/\n\s*\n/g,_0xc826[583]);f=f[_0xc826[343]](/^[\s\n]*/g,_0xc826[856]);f=f[_0xc826[343]](/[\s\n]*$/g,_0xc826[856]);f=f[_0xc826[343]](/>\s{2,}</g,_0xc826[857]);f=this[_0xc826[858]](f,e);f=f[_0xc826[343]](/\n\n/g,_0xc826[583]);return f;} ,cleanReplacer:function (f,e){if(e===false){return f;} ;c[_0xc826[19]](e,function (g,h){f=f[_0xc826[343]](_0xc826[855]+g,h);} );return f;} ,cleanRemoveEmptyTags:function (h){h=h[_0xc826[343]](/<span>([\w\W]*?)<\/span>/gi,_0xc826[414]);h=h[_0xc826[343]](/[\u200B-\u200D\uFEFF]/g,_0xc826[331]);var j=[_0xc826[859],_0xc826[860],_0xc826[861]];var g=[_0xc826[862],_0xc826[863],_0xc826[864],_0xc826[865],_0xc826[866],_0xc826[867],_0xc826[868],_0xc826[869],_0xc826[870],_0xc826[871],_0xc826[872],_0xc826[873],_0xc826[396],_0xc826[398],_0xc826[874],_0xc826[875],_0xc826[876]];if(this[_0xc826[25]][_0xc826[877]]){g=g[_0xc826[878]](j);} else {g=j;} ;var e=g[_0xc826[20]];for(var f=0;f<e;++f){h=h[_0xc826[343]]( new RegExp(g[f],_0xc826[371]),_0xc826[331]);} ;return h;} ,cleanParagraphy:function (l){l=c[_0xc826[382]](l);if(this[_0xc826[25]][_0xc826[204]]===true){return l;} ;if(l===_0xc826[331]||l===_0xc826[396]){return this[_0xc826[25]][_0xc826[640]];} ;l=l+_0xc826[583];var n=[];var j=l[_0xc826[592]](/<(table|div|pre|object)(.*?)>([\w\W]*?)<\/(table|div|pre|object)>/gi);if(!j){j=[];} ;var m=l[_0xc826[592]](/<!--([\w\W]*?)-->/gi);if(m){j=c[_0xc826[854]](j,m);} ;if(this[_0xc826[25]][_0xc826[846]]){var f=l[_0xc826[592]](/<section(.*?)rel="redactor-php-tag">([\w\W]*?)<\/section>/gi);if(f){j=c[_0xc826[854]](j,f);} ;} ;if(j){c[_0xc826[19]](j,function (p,q){n[p]=q;l=l[_0xc826[343]](q,_0xc826[879]+p+_0xc826[880]);} );} ;l=l[_0xc826[343]](/<br \/>\s*<br \/>/gi,_0xc826[881]);function h(s,p,q){return l[_0xc826[343]]( new RegExp(s,p),q);} ;var e=_0xc826[882];l=h(_0xc826[883]+e+_0xc826[884],_0xc826[371],_0xc826[885]);l=h(_0xc826[886]+e+_0xc826[887],_0xc826[371],_0xc826[888]);l=h(_0xc826[889],_0xc826[890],_0xc826[583]);l=h(_0xc826[891],_0xc826[890],_0xc826[583]);l=h(_0xc826[892],_0xc826[890],_0xc826[881]);var o=l[_0xc826[443]]( new RegExp(_0xc826[893],_0xc826[890]),-1);l=_0xc826[331];for(var g in o){if(o[_0xc826[894]](g)){if(o[g][_0xc826[585]](_0xc826[879])==-1){o[g]=o[g][_0xc826[343]](/<p>\n\t<\/p>/gi,_0xc826[331]);o[g]=o[g][_0xc826[343]](/<p><\/p>/gi,_0xc826[331]);if(o[g]!=_0xc826[331]){l+=_0xc826[571]+o[g][_0xc826[343]](/^\n+|\n+$/g,_0xc826[331])+_0xc826[573];} ;} else {l+=o[g];} ;} ;} ;l=h(_0xc826[895],_0xc826[371],_0xc826[571]);l=h(_0xc826[896],_0xc826[371],_0xc826[573]);l=h(_0xc826[897],_0xc826[371],_0xc826[331]);l=h(_0xc826[898],_0xc826[371],_0xc826[899]);l=h(_0xc826[900]+e+_0xc826[901],_0xc826[371],_0xc826[414]);l=h(_0xc826[902],_0xc826[371],_0xc826[414]);l=h(_0xc826[903]+e+_0xc826[884],_0xc826[371],_0xc826[414]);l=h(_0xc826[904]+e+_0xc826[905],_0xc826[371],_0xc826[414]);l=h(_0xc826[904]+e+_0xc826[906],_0xc826[371],_0xc826[414]);l=h(_0xc826[907],_0xc826[371],_0xc826[414]);l=h(_0xc826[908],_0xc826[371],_0xc826[573]);l=h(_0xc826[909],_0xc826[371],_0xc826[688]);l=h(_0xc826[910],_0xc826[371],_0xc826[911]);l=h(_0xc826[912],_0xc826[371],_0xc826[911]);l=h(_0xc826[913],_0xc826[371],_0xc826[571]);l=h(_0xc826[914],_0xc826[371],_0xc826[915]);l=h(_0xc826[916],_0xc826[371],_0xc826[917]);l=h(_0xc826[918],_0xc826[371],_0xc826[919]);l=h(_0xc826[920],_0xc826[371],_0xc826[331]);c[_0xc826[19]](n,function (p,q){l=l[_0xc826[343]](_0xc826[879]+p+_0xc826[921],q);} );return c[_0xc826[382]](l);} ,cleanConvertInlineTags:function (e,h){var f=_0xc826[70];if(this[_0xc826[25]][_0xc826[922]]===_0xc826[231]){f=_0xc826[231];} ;var g=_0xc826[71];if(this[_0xc826[25]][_0xc826[923]]===_0xc826[228]){g=_0xc826[228];} ;e=e[_0xc826[343]](/<span style="font-style: italic;">([\w\W]*?)<\/span>/gi,_0xc826[369]+g+_0xc826[924]+g+_0xc826[790]);e=e[_0xc826[343]](/<span style="font-weight: bold;">([\w\W]*?)<\/span>/gi,_0xc826[369]+f+_0xc826[924]+f+_0xc826[790]);if(this[_0xc826[25]][_0xc826[922]]===_0xc826[70]){e=e[_0xc826[343]](/<b>([\w\W]*?)<\/b>/gi,_0xc826[925]);} else {e=e[_0xc826[343]](/<strong>([\w\W]*?)<\/strong>/gi,_0xc826[926]);} ;if(this[_0xc826[25]][_0xc826[923]]===_0xc826[71]){e=e[_0xc826[343]](/<i>([\w\W]*?)<\/i>/gi,_0xc826[927]);} else {e=e[_0xc826[343]](/<em>([\w\W]*?)<\/em>/gi,_0xc826[928]);} ;if(h!==true){e=e[_0xc826[343]](/<strike>([\w\W]*?)<\/strike>/gi,_0xc826[929]);} else {e=e[_0xc826[343]](/<del>([\w\W]*?)<\/del>/gi,_0xc826[930]);} ;return e;} ,cleanStripTags:function (g){if(g==_0xc826[331]|| typeof g==_0xc826[12]){return g;} ;var h=false;if(this[_0xc826[25]][_0xc826[229]]!==false){h=true;} ;var e=h===true?this[_0xc826[25]][_0xc826[229]]:this[_0xc826[25]][_0xc826[235]];var f=/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;g=g[_0xc826[343]](f,function (l,j){if(h===true){return c[_0xc826[233]](j[_0xc826[774]](),e)>_0xc826[234]?l:_0xc826[331];} else {return c[_0xc826[233]](j[_0xc826[774]](),e)>_0xc826[234]?_0xc826[331]:l;} ;} );g=this[_0xc826[350]](g);return g;} ,cleanSavePreCode:function (e,f){var g=e[_0xc826[592]](/<(pre|code)(.*?)>([\w\W]*?)<\/(pre|code)>/gi);if(g!==null){c[_0xc826[19]](g,c[_0xc826[464]](function (j,l){var h=l[_0xc826[592]](/<(pre|code)(.*?)>([\w\W]*?)<\/(pre|code)>/i);h[3]=h[3][_0xc826[343]](/&nbsp;/g,_0xc826[856]);if(f!==false){h[3]=this[_0xc826[931]](h[3]);} ;h[3]=h[3][_0xc826[343]](/\$/g,_0xc826[342]);e=e[_0xc826[343]](l,_0xc826[369]+h[1]+h[2]+_0xc826[790]+h[3]+_0xc826[372]+h[1]+_0xc826[790]);} ,this));} ;return e;} ,cleanEncodeEntities:function (e){e=String(e)[_0xc826[343]](/&amp;/g,_0xc826[415])[_0xc826[343]](/&lt;/g,_0xc826[369])[_0xc826[343]](/&gt;/g,_0xc826[790])[_0xc826[343]](/&quot;/g,_0xc826[932]);return e[_0xc826[343]](/&/g,_0xc826[936])[_0xc826[343]](/</g,_0xc826[935])[_0xc826[343]](/>/g,_0xc826[934])[_0xc826[343]](/"/g,_0xc826[933]);} ,cleanUnverified:function (){var e=this[_0xc826[324]][_0xc826[365]](_0xc826[937]);e[_0xc826[941]](_0xc826[940])[_0xc826[199]](_0xc826[939],_0xc826[331])[_0xc826[199]](_0xc826[938],_0xc826[331]);e[_0xc826[941]](_0xc826[942])[_0xc826[199]](_0xc826[939],_0xc826[331]);e[_0xc826[199]](_0xc826[938],_0xc826[331]);c[_0xc826[19]](e,c[_0xc826[464]](function (f,g){this[_0xc826[828]](g,_0xc826[68]);} ,this));this[_0xc826[324]][_0xc826[365]](_0xc826[944])[_0xc826[338]]()[_0xc826[943]]();} ,cleanHtml:function (f){var j=0,m=f[_0xc826[20]],l=0,e=null,g=null,p=_0xc826[331],h=_0xc826[331],o=_0xc826[331];this[_0xc826[945]]=0;for(;j<m;j++){l=j;if(-1==f[_0xc826[946]](j)[_0xc826[506]](_0xc826[369])){h+=f[_0xc826[946]](j);return this[_0xc826[947]](h);} ;while(l<m&&f[_0xc826[948]](l)!=_0xc826[369]){l++;} ;if(j!=l){o=f[_0xc826[946]](j,l-j);if(!o[_0xc826[592]](/^\s{2,}$/g)){if(_0xc826[583]==h[_0xc826[948]](h[_0xc826[20]]-1)){h+=this[_0xc826[949]]();} else {if(_0xc826[583]==o[_0xc826[948]](0)){h+=_0xc826[583]+this[_0xc826[949]]();o=o[_0xc826[343]](/^\s+/,_0xc826[331]);} ;} ;h+=o;} ;if(o[_0xc826[592]](/\n/)){h+=_0xc826[583]+this[_0xc826[949]]();} ;} ;e=l;while(l<m&&_0xc826[790]!=f[_0xc826[948]](l)){l++;} ;p=f[_0xc826[946]](e,l-e);j=l;var n;if(_0xc826[950]==p[_0xc826[946]](1,3)){if(!p[_0xc826[592]](/--$/)){while(_0xc826[951]!=f[_0xc826[946]](l,3)){l++;} ;l+=2;p=f[_0xc826[946]](e,l-e);j=l;} ;if(_0xc826[583]!=h[_0xc826[948]](h[_0xc826[20]]-1)){h+=_0xc826[583];} ;h+=this[_0xc826[949]]();h+=p+_0xc826[952];} else {if(_0xc826[953]==p[1]){h=this[_0xc826[954]](p+_0xc826[790],h);} else {if(_0xc826[955]==p[1]){h+=p+_0xc826[952];} else {if(n=p[_0xc826[592]](/^<(script|style|pre)/i)){n[1]=n[1][_0xc826[774]]();p=this[_0xc826[956]](p);h=this[_0xc826[954]](p,h);g=String(f[_0xc826[946]](j+1))[_0xc826[774]]()[_0xc826[506]](_0xc826[372]+n[1]);if(g){o=f[_0xc826[946]](j+1,g);j+=g;h+=o;} ;} else {p=this[_0xc826[956]](p);h=this[_0xc826[954]](p,h);} ;} ;} ;} ;} ;return this[_0xc826[947]](h);} ,cleanGetTabs:function (){var f=_0xc826[331];for(var e=0;e<this[_0xc826[945]];e++){f+=_0xc826[589];} ;return f;} ,cleanFinish:function (e){e=e[_0xc826[343]](/\n\s*\n/g,_0xc826[583]);e=e[_0xc826[343]](/^[\s\n]*/,_0xc826[331]);e=e[_0xc826[343]](/[\s\n]*$/,_0xc826[331]);e=e[_0xc826[343]](/<script(.*?)>\n<\/script>/gi,_0xc826[957]);this[_0xc826[945]]=0;return e;} ,cleanTag:function (f){var h=_0xc826[331];f=f[_0xc826[343]](/\n/g,_0xc826[856]);f=f[_0xc826[343]](/\s{2,}/g,_0xc826[856]);f=f[_0xc826[343]](/^\s+|\s+$/g,_0xc826[856]);var g=_0xc826[331];if(f[_0xc826[592]](/\/$/)){g=_0xc826[958];f=f[_0xc826[343]](/\/+$/,_0xc826[331]);} ;var e;while(e=/\s*([^= ]+)(?:=((['"']).*?\3|[^ ]+))?/[_0xc826[733]](f)){if(e[2]){h+=e[1][_0xc826[774]]()+_0xc826[668]+e[2];} else {if(e[1]){h+=e[1][_0xc826[774]]();} ;} ;h+=_0xc826[856];f=f[_0xc826[946]](e[0][_0xc826[20]]);} ;return h[_0xc826[343]](/\s*$/,_0xc826[331])+g+_0xc826[790];} ,placeTag:function (e,g){var f=e[_0xc826[592]](this[_0xc826[221]]);if(e[_0xc826[592]](this[_0xc826[211]])||f){g=g[_0xc826[343]](/\s*$/,_0xc826[331]);g+=_0xc826[583];} ;if(f&&_0xc826[958]==e[_0xc826[948]](1)){this[_0xc826[945]]--;} ;if(_0xc826[583]==g[_0xc826[948]](g[_0xc826[20]]-1)){g+=this[_0xc826[949]]();} ;if(f&&_0xc826[958]!=e[_0xc826[948]](1)){this[_0xc826[945]]++;} ;g+=e;if(e[_0xc826[592]](this[_0xc826[218]])||e[_0xc826[592]](this[_0xc826[221]])){g=g[_0xc826[343]](/ *$/,_0xc826[331]);g+=_0xc826[583];} ;return g;} ,formatEmpty:function (j){var f=c[_0xc826[382]](this[_0xc826[324]][_0xc826[42]]());if(this[_0xc826[25]][_0xc826[204]]){if(f==_0xc826[331]){j[_0xc826[503]]();this[_0xc826[324]][_0xc826[42]](_0xc826[331]);this[_0xc826[469]]();} ;} else {f=f[_0xc826[343]](/<br\s?\/?>/i,_0xc826[331]);var h=f[_0xc826[343]](/<p>\s?<\/p>/gi,_0xc826[331]);if(f===_0xc826[331]||h===_0xc826[331]){j[_0xc826[503]]();var g=c(this[_0xc826[25]][_0xc826[640]])[_0xc826[318]](0);this[_0xc826[324]][_0xc826[42]](g);this[_0xc826[469]]();} ;} ;this[_0xc826[357]]();} ,formatBlocks:function (e){this[_0xc826[507]]();var f=this[_0xc826[810]]();this[_0xc826[521]]();c[_0xc826[19]](f,c[_0xc826[464]](function (g,j){if(j[_0xc826[370]]!==_0xc826[118]){var h=c(j)[_0xc826[548]]();if(e===_0xc826[55]){if((j[_0xc826[370]]===_0xc826[74]&&h[_0xc826[493]]()!=0&&h[0][_0xc826[370]]===_0xc826[86])||j[_0xc826[370]]===_0xc826[86]){this[_0xc826[251]]();return ;} else {if(this[_0xc826[25]][_0xc826[204]]){if(j&&j[_0xc826[370]][_0xc826[585]](/H[1-6]/)==0){c(j)[_0xc826[373]](j[_0xc826[783]]+_0xc826[383]);} else {return ;} ;} else {this[_0xc826[821]](e,j);} ;} ;} else {this[_0xc826[821]](e,j);} ;} ;} ,this));this[_0xc826[526]]();this[_0xc826[357]]();} ,formatBlock:function (e,j){if(j===false){j=this[_0xc826[542]]();} ;if(j===false){if(this[_0xc826[25]][_0xc826[204]]===true){this[_0xc826[467]](_0xc826[789],e);} ;return true;} ;var h=_0xc826[331];if(e!==_0xc826[57]){h=c(j)[_0xc826[338]]();} else {h=c(j)[_0xc826[42]]();if(c[_0xc826[382]](h)===_0xc826[331]){h=_0xc826[959];} ;} ;if(j[_0xc826[370]]===_0xc826[119]){e=_0xc826[55];} ;if(this[_0xc826[25]][_0xc826[204]]===true&&e===_0xc826[55]){c(j)[_0xc826[373]](c(_0xc826[960])[_0xc826[435]](h)[_0xc826[42]]()+_0xc826[383]);} else {var f=this[_0xc826[540]]();var g=c(_0xc826[369]+e+_0xc826[790])[_0xc826[435]](h);c(j)[_0xc826[373]](g);if(f&&f[_0xc826[370]]==_0xc826[85]){c(g)[_0xc826[816]](_0xc826[815]);} ;} ;} ,formatChangeTag:function (g,e,f){if(f!==false){this[_0xc826[521]]();} ;var h=c(_0xc826[369]+e+_0xc826[961]);c(g)[_0xc826[373]](function (){return h[_0xc826[435]](c(this)[_0xc826[338]]());} );if(f!==false){this[_0xc826[526]]();} ;return h;} ,formatQuote:function (){this[_0xc826[507]]();if(this[_0xc826[25]][_0xc826[204]]===false){this[_0xc826[521]]();var e=this[_0xc826[810]]();var p=false;var u=e[_0xc826[20]];if(e){var m=_0xc826[331];var v=_0xc826[331];var h=false;var r=true;c[_0xc826[19]](e,function (w,x){if(x[_0xc826[370]]!==_0xc826[74]){r=false;} ;} );c[_0xc826[19]](e,c[_0xc826[464]](function (w,x){if(x[_0xc826[370]]===_0xc826[86]){this[_0xc826[821]](_0xc826[55],x,false);} else {if(x[_0xc826[370]]===_0xc826[74]){p=c(x)[_0xc826[548]]();if(p[0][_0xc826[370]]==_0xc826[86]){var y=c(p)[_0xc826[337]](_0xc826[55])[_0xc826[493]]();if(y==1){c(p)[_0xc826[373]](x);} else {if(y==u){h=_0xc826[56];m+=this[_0xc826[339]](x);} else {h=_0xc826[42];m+=this[_0xc826[339]](x);if(w==0){c(x)[_0xc826[446]](_0xc826[813])[_0xc826[812]]();v=this[_0xc826[339]](x);} else {c(x)[_0xc826[322]]();} ;} ;} ;} else {if(r===false||e[_0xc826[20]]==1){this[_0xc826[821]](_0xc826[56],x,false);} else {h=_0xc826[962];m+=this[_0xc826[339]](x);} ;} ;} else {if(x[_0xc826[370]]!==_0xc826[118]){this[_0xc826[821]](_0xc826[56],x,false);} ;} ;} ;} ,this));if(h){if(h==_0xc826[962]){c(e[0])[_0xc826[373]](_0xc826[963]+m+_0xc826[919]);c(e)[_0xc826[322]]();} else {if(h==_0xc826[56]){c(p)[_0xc826[373]](m);} else {if(h==_0xc826[42]){var o=this[_0xc826[324]][_0xc826[42]]()[_0xc826[343]](v,_0xc826[919]+m+_0xc826[963]);this[_0xc826[324]][_0xc826[42]](o);this[_0xc826[324]][_0xc826[365]](_0xc826[56])[_0xc826[19]](function (){if(c[_0xc826[382]](c(this)[_0xc826[42]]())==_0xc826[331]){c(this)[_0xc826[322]]();} ;} );} ;} ;} ;} ;} ;this[_0xc826[526]]();} else {var j=this[_0xc826[542]]();if(j[_0xc826[370]]===_0xc826[86]){this[_0xc826[521]]();var o=c[_0xc826[382]](c(j)[_0xc826[42]]());var s=c[_0xc826[382]](this[_0xc826[964]]());o=o[_0xc826[343]](/<span(.*?)id="selection-marker(.*?)<\/span>/gi,_0xc826[331]);if(o==s){c(j)[_0xc826[373]](c(j)[_0xc826[42]]()+_0xc826[383]);} else {this[_0xc826[966]](_0xc826[965]);var l=this[_0xc826[324]][_0xc826[365]](_0xc826[965]);l[_0xc826[812]]();var q=this[_0xc826[324]][_0xc826[42]]()[_0xc826[343]](_0xc826[967],_0xc826[968]+this[_0xc826[25]][_0xc826[572]]+_0xc826[413]+s+_0xc826[963]);this[_0xc826[324]][_0xc826[42]](q);l[_0xc826[322]]();this[_0xc826[324]][_0xc826[365]](_0xc826[56])[_0xc826[19]](function (){if(c[_0xc826[382]](c(this)[_0xc826[42]]())==_0xc826[331]){c(this)[_0xc826[322]]();} ;} );} ;this[_0xc826[526]]();this[_0xc826[324]][_0xc826[365]](_0xc826[969])[_0xc826[341]](_0xc826[441],false);} else {var g=this[_0xc826[970]](_0xc826[56]);var o=c(g)[_0xc826[42]]();var t=[_0xc826[117],_0xc826[112],_0xc826[46],_0xc826[116],_0xc826[99],_0xc826[100],_0xc826[101],_0xc826[107]];c[_0xc826[19]](t,function (w,x){o=o[_0xc826[343]]( new RegExp(_0xc826[369]+x+_0xc826[971],_0xc826[371]),_0xc826[331]);o=o[_0xc826[343]]( new RegExp(_0xc826[372]+x+_0xc826[790],_0xc826[371]),_0xc826[331]);} );var f=this[_0xc826[25]][_0xc826[226]];c[_0xc826[19]](f,function (w,x){o=o[_0xc826[343]]( new RegExp(_0xc826[369]+x+_0xc826[971],_0xc826[371]),_0xc826[331]);o=o[_0xc826[343]]( new RegExp(_0xc826[372]+x+_0xc826[790],_0xc826[371]),_0xc826[383]);} );c(g)[_0xc826[42]](o);this[_0xc826[972]](g);var n=c(g)[_0xc826[595]]();if(n[_0xc826[493]]()!=0&&n[0][_0xc826[370]]===_0xc826[596]){n[_0xc826[322]]();} ;} ;} ;this[_0xc826[357]]();} ,blockRemoveAttr:function (e,g){var f=this[_0xc826[810]]();c(f)[_0xc826[326]](e);this[_0xc826[357]]();} ,blockSetAttr:function (e,g){var f=this[_0xc826[810]]();c(f)[_0xc826[341]](e,g);this[_0xc826[357]]();} ,blockRemoveStyle:function (f){var e=this[_0xc826[810]]();c(e)[_0xc826[199]](f,_0xc826[331]);this[_0xc826[828]](e,_0xc826[68]);this[_0xc826[357]]();} ,blockSetStyle:function (g,f){var e=this[_0xc826[810]]();c(e)[_0xc826[199]](g,f);this[_0xc826[357]]();} ,blockRemoveClass:function (f){var e=this[_0xc826[810]]();c(e)[_0xc826[328]](f);this[_0xc826[828]](e,_0xc826[973]);this[_0xc826[357]]();} ,blockSetClass:function (f){var e=this[_0xc826[810]]();c(e)[_0xc826[446]](f);this[_0xc826[357]]();} ,inlineRemoveClass:function (e){this[_0xc826[521]]();this[_0xc826[974]](function (f){c(f)[_0xc826[328]](e);this[_0xc826[828]](f,_0xc826[973]);} );this[_0xc826[526]]();this[_0xc826[357]]();} ,inlineSetClass:function (e){var f=this[_0xc826[541]]();if(!c(f)[_0xc826[492]](e)){this[_0xc826[975]](_0xc826[446],e);} ;} ,inlineRemoveStyle:function (e){this[_0xc826[521]]();this[_0xc826[974]](function (f){c(f)[_0xc826[199]](e,_0xc826[331]);this[_0xc826[828]](f,_0xc826[68]);} );this[_0xc826[526]]();this[_0xc826[357]]();} ,inlineSetStyle:function (f,e){this[_0xc826[975]](_0xc826[199],f,e);} ,inlineRemoveAttr:function (e){this[_0xc826[521]]();var g=this[_0xc826[648]](),h=this[_0xc826[712]](),f=this[_0xc826[809]]();if(g[_0xc826[976]]||g[_0xc826[977]]===g[_0xc826[978]]&&h){f=c(h);} ;c(f)[_0xc826[326]](e);this[_0xc826[979]]();this[_0xc826[526]]();this[_0xc826[357]]();} ,inlineSetAttr:function (e,f){this[_0xc826[975]](_0xc826[341],e,f);} ,inlineMethods:function (h,e,j){this[_0xc826[507]]();this[_0xc826[521]]();var f=this[_0xc826[648]]();var g=this[_0xc826[712]]();if((f[_0xc826[976]]||f[_0xc826[977]]===f[_0xc826[978]])&&g&&!this[_0xc826[817]](g)){c(g)[h](e,j);} else {this[_0xc826[208]][_0xc826[467]](_0xc826[980],false,4);var l=this[_0xc826[324]][_0xc826[365]](_0xc826[981]);c[_0xc826[19]](l,c[_0xc826[464]](function (m,n){this[_0xc826[982]](h,n,e,j);} ,this));} ;this[_0xc826[526]]();this[_0xc826[357]]();} ,inlineSetMethods:function (j,o,g,l){var m=c(o)[_0xc826[548]](),e;var n=this[_0xc826[708]]();var h=c(m)[_0xc826[582]]();var f=n==h;if(f&&m&&m[0][_0xc826[370]]===_0xc826[983]&&m[0][_0xc826[984]][_0xc826[20]]!=0){e=m;c(o)[_0xc826[373]](c(o)[_0xc826[42]]());} else {e=c(_0xc826[985])[_0xc826[435]](c(o)[_0xc826[338]]());c(o)[_0xc826[373]](e);} ;c(e)[j](g,l);return e;} ,inlineEachNodes:function (j){var f=this[_0xc826[648]](),g=this[_0xc826[712]](),e=this[_0xc826[809]](),h;if(f[_0xc826[976]]||f[_0xc826[977]]===f[_0xc826[978]]&&g){e=c(g);h=true;} ;c[_0xc826[19]](e,c[_0xc826[464]](function (m,o){if(!h&&o[_0xc826[370]]!==_0xc826[983]){var l=this[_0xc826[708]]();var p=c(o)[_0xc826[548]]()[_0xc826[582]]();var n=l==p;if(n&&o[_0xc826[986]][_0xc826[370]]===_0xc826[983]&&!c(o[_0xc826[986]])[_0xc826[492]](_0xc826[329])){o=o[_0xc826[986]];} else {return ;} ;} ;j[_0xc826[8]](this,o);} ,this));} ,inlineUnwrapSpan:function (){var e=this[_0xc826[324]][_0xc826[365]](_0xc826[367]);c[_0xc826[19]](e,c[_0xc826[464]](function (g,h){var f=c(h);if(f[_0xc826[341]](_0xc826[973])===undefined&&f[_0xc826[341]](_0xc826[68])===undefined){f[_0xc826[338]]()[_0xc826[943]]();} ;} ,this));} ,inlineFormat:function (e){this[_0xc826[521]]();this[_0xc826[208]][_0xc826[467]](_0xc826[980],false,4);var g=this[_0xc826[324]][_0xc826[365]](_0xc826[981]);var f;c[_0xc826[19]](g,function (h,l){var j=c(_0xc826[369]+e+_0xc826[961])[_0xc826[435]](c(l)[_0xc826[338]]());c(l)[_0xc826[373]](j);f=j;} );this[_0xc826[526]]();this[_0xc826[357]]();} ,inlineRemoveFormat:function (e){this[_0xc826[521]]();var f=e[_0xc826[987]]();var g=this[_0xc826[809]]();var h=c(this[_0xc826[540]]())[_0xc826[548]]();c[_0xc826[19]](g,function (j,l){if(l[_0xc826[370]]===f){this[_0xc826[799]](l);} ;} );if(h&&h[0][_0xc826[370]]===f){this[_0xc826[799]](h);} ;this[_0xc826[526]]();this[_0xc826[357]]();} ,inlineRemoveFormatReplace:function (e){c(e)[_0xc826[373]](c(e)[_0xc826[338]]());} ,insertHtml:function (g,j){var m=this[_0xc826[541]]();var h=m[_0xc826[986]];this[_0xc826[742]]();this[_0xc826[507]]();var e=c(_0xc826[960])[_0xc826[435]](c[_0xc826[988]](g));g=e[_0xc826[42]]();g=this[_0xc826[380]](g);e=c(_0xc826[960])[_0xc826[435]](c[_0xc826[988]](g));var f=this[_0xc826[542]]();if(e[_0xc826[338]]()[_0xc826[20]]==1){var l=e[_0xc826[338]]()[0][_0xc826[370]];if(l!=_0xc826[74]&&l==f[_0xc826[370]]||l==_0xc826[119]){g=e[_0xc826[582]]();e=c(_0xc826[960])[_0xc826[435]](g);} ;} ;if(!this[_0xc826[25]][_0xc826[204]]&&e[_0xc826[338]]()[_0xc826[20]]==1&&e[_0xc826[338]]()[0][_0xc826[560]]==3&&(this[_0xc826[989]]()[_0xc826[20]]>2||(!m||m[_0xc826[370]]==_0xc826[593]&&!h||h[_0xc826[370]]==_0xc826[120]))){g=_0xc826[571]+g+_0xc826[573];} ;g=this[_0xc826[990]](g);if(e[_0xc826[338]]()[_0xc826[20]]>1&&f||e[_0xc826[338]]()[_0xc826[992]](_0xc826[991])){if(this[_0xc826[238]](_0xc826[237])){if(!this[_0xc826[792]]()){this[_0xc826[208]][_0xc826[795]][_0xc826[794]]()[_0xc826[793]](g);} else {this[_0xc826[796]](g);} ;} else {this[_0xc826[208]][_0xc826[467]](_0xc826[791],false,g);} ;} else {this[_0xc826[993]](g,false);} ;if(this[_0xc826[496]]){this[_0xc826[209]][_0xc826[647]](c[_0xc826[464]](function (){if(!this[_0xc826[25]][_0xc826[204]]){this[_0xc826[597]](this[_0xc826[324]][_0xc826[338]]()[_0xc826[567]]());} else {this[_0xc826[994]]();} ;} ,this),1);} ;this[_0xc826[463]]();this[_0xc826[355]]();if(j!==false){this[_0xc826[357]]();} ;} ,insertHtmlAdvanced:function (f,l){f=this[_0xc826[990]](f);var m=this[_0xc826[651]]();if(m[_0xc826[780]]&&m[_0xc826[781]]){var e=m[_0xc826[780]](0);e[_0xc826[782]]();var g=this[_0xc826[208]][_0xc826[562]](_0xc826[106]);g[_0xc826[783]]=f;var n=this[_0xc826[208]][_0xc826[784]](),j,h;while((j=g[_0xc826[786]])){h=n[_0xc826[785]](j);} ;e[_0xc826[563]](n);if(h){e=e[_0xc826[787]]();e[_0xc826[788]](h);e[_0xc826[650]](true);m[_0xc826[652]]();m[_0xc826[653]](e);} ;} ;if(l!==false){this[_0xc826[357]]();} ;} ,insertBeforeCursor:function (f){f=this[_0xc826[990]](f);var g=c(f);var j=document[_0xc826[562]](_0xc826[366]);j[_0xc826[783]]=_0xc826[995];var e=this[_0xc826[648]]();e[_0xc826[563]](j);e[_0xc826[563]](g[0]);e[_0xc826[650]](false);var h=this[_0xc826[651]]();h[_0xc826[652]]();h[_0xc826[653]](e);this[_0xc826[357]]();} ,insertText:function (f){var e=c(c[_0xc826[988]](f));if(e[_0xc826[20]]){f=e[_0xc826[582]]();} ;this[_0xc826[742]]();if(this[_0xc826[238]](_0xc826[237])&&!this[_0xc826[792]]()){this[_0xc826[208]][_0xc826[795]][_0xc826[794]]()[_0xc826[793]](f);} else {this[_0xc826[208]][_0xc826[467]](_0xc826[791],false,f);} ;this[_0xc826[357]]();} ,insertNode:function (j){j=j[0]||j;if(j[_0xc826[370]]==_0xc826[996]){var e=_0xc826[367];var f=j[_0xc826[368]];var h= new RegExp(_0xc826[369]+j[_0xc826[370]],_0xc826[228]);var g=f[_0xc826[343]](h,_0xc826[369]+e);h= new RegExp(_0xc826[372]+j[_0xc826[370]],_0xc826[228]);g=g[_0xc826[343]](h,_0xc826[372]+e);j=c(g)[0];} ;var l=this[_0xc826[651]]();if(l[_0xc826[780]]&&l[_0xc826[781]]){range=l[_0xc826[780]](0);range[_0xc826[782]]();range[_0xc826[563]](j);range[_0xc826[997]](j);range[_0xc826[788]](j);l[_0xc826[652]]();l[_0xc826[653]](range);} ;} ,insertNodeToCaretPositionFromPoint:function (l,j){var g;var f=l[_0xc826[715]],n=l[_0xc826[716]];if(this[_0xc826[208]][_0xc826[998]]){var m=this[_0xc826[208]][_0xc826[998]](f,n);g=this[_0xc826[648]]();g[_0xc826[1000]](m[_0xc826[999]],m[_0xc826[697]]);g[_0xc826[650]](true);g[_0xc826[563]](j);} else {if(this[_0xc826[208]][_0xc826[1001]]){g=this[_0xc826[208]][_0xc826[1001]](f,n);g[_0xc826[563]](j);} else {if( typeof document[_0xc826[65]][_0xc826[1002]]!=_0xc826[12]){g=this[_0xc826[208]][_0xc826[65]][_0xc826[1002]]();g[_0xc826[1003]](f,n);var h=g[_0xc826[1004]]();h[_0xc826[1003]](f,n);g[_0xc826[1006]](_0xc826[1005],h);g[_0xc826[113]]();} ;} ;} ;} ,insertAfterLastElement:function (e,f){if( typeof (f)!=_0xc826[12]){e=f;} ;if(this[_0xc826[565]]()){if(this[_0xc826[25]][_0xc826[204]]){var g=c(_0xc826[960])[_0xc826[435]](c[_0xc826[382]](this[_0xc826[324]][_0xc826[42]]()))[_0xc826[338]]();if(this[_0xc826[339]](g[_0xc826[567]]()[0])!=this[_0xc826[339]](e)){return false;} ;} else {if(this[_0xc826[324]][_0xc826[338]]()[_0xc826[567]]()[0]!==e){return false;} ;} ;this[_0xc826[566]](e);} ;} ,insertingAfterLastElement:function (e){this[_0xc826[507]]();if(this[_0xc826[25]][_0xc826[204]]===false){var f=c(this[_0xc826[25]][_0xc826[640]]);c(e)[_0xc826[320]](f);this[_0xc826[574]](f);} else {var f=c(_0xc826[1007]+this[_0xc826[25]][_0xc826[572]]+_0xc826[413],this[_0xc826[208]])[0];c(e)[_0xc826[320]](f);c(f)[_0xc826[320]](this[_0xc826[25]][_0xc826[572]]);this[_0xc826[526]]();this[_0xc826[324]][_0xc826[365]](_0xc826[969])[_0xc826[326]](_0xc826[441]);} ;} ,insertLineBreak:function (){this[_0xc826[521]]();this[_0xc826[324]][_0xc826[365]](_0xc826[1008])[_0xc826[768]](_0xc826[383]+(this[_0xc826[238]](_0xc826[513])?this[_0xc826[25]][_0xc826[572]]:_0xc826[331]));this[_0xc826[526]]();} ,insertDoubleLineBreak:function (){this[_0xc826[521]]();this[_0xc826[324]][_0xc826[365]](_0xc826[1008])[_0xc826[768]](_0xc826[1009]+(this[_0xc826[238]](_0xc826[513])?this[_0xc826[25]][_0xc826[572]]:_0xc826[331]));this[_0xc826[526]]();} ,replaceLineBreak:function (e){var f=c(_0xc826[383]+this[_0xc826[25]][_0xc826[572]]);c(e)[_0xc826[373]](f);this[_0xc826[574]](f);} ,pasteClean:function (j){j=this[_0xc826[391]](_0xc826[1010],false,j);if(this[_0xc826[238]](_0xc826[237])){var h=c[_0xc826[382]](j);if(h[_0xc826[585]](/^<a(.*?)>(.*?)<\/a>$/i)==0){j=j[_0xc826[343]](/^<a(.*?)>(.*?)<\/a>$/i,_0xc826[410]);} ;} ;if(this[_0xc826[25]][_0xc826[1011]]){var h=this[_0xc826[208]][_0xc826[562]](_0xc826[106]);j=j[_0xc826[343]](/<br>|<\/H[1-6]>|<\/p>|<\/div>/gi,_0xc826[583]);h[_0xc826[783]]=j;j=h[_0xc826[1012]]||h[_0xc826[1013]];j=c[_0xc826[382]](j);j=j[_0xc826[343]](_0xc826[583],_0xc826[383]);j=this[_0xc826[839]](j);this[_0xc826[1014]](j);return false;} ;var f=false;if(this[_0xc826[801]](_0xc826[85])){f=true;var g=this[_0xc826[25]][_0xc826[226]];g[_0xc826[15]](_0xc826[116]);g[_0xc826[15]](_0xc826[46]);c[_0xc826[19]](g,function (m,n){j=j[_0xc826[343]]( new RegExp(_0xc826[369]+n+_0xc826[971],_0xc826[371]),_0xc826[331]);j=j[_0xc826[343]]( new RegExp(_0xc826[372]+n+_0xc826[790],_0xc826[371]),_0xc826[383]);} );} ;if(this[_0xc826[801]](_0xc826[119])){j=this[_0xc826[1015]](j);this[_0xc826[1014]](j);return true;} ;j=j[_0xc826[343]](/<img(.*?)v:shapes=(.*?)>/gi,_0xc826[331]);j=j[_0xc826[343]](/<p(.*?)class="MsoListParagraphCxSpFirst"([\w\W]*?)<\/p>/gi,_0xc826[1016]);j=j[_0xc826[343]](/<p(.*?)class="MsoListParagraphCxSpMiddle"([\w\W]*?)<\/p>/gi,_0xc826[1017]);j=j[_0xc826[343]](/<p(.*?)class="MsoListParagraphCxSpLast"([\w\W]*?)<\/p>/gi,_0xc826[1018]);j=j[_0xc826[343]](/<p(.*?)class="MsoListParagraph"([\w\W]*?)<\/p>/gi,_0xc826[1019]);j=j[_0xc826[343]](/·/g,_0xc826[331]);j=j[_0xc826[343]](/<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi,_0xc826[331]);j=j[_0xc826[343]](/(&nbsp;){2,}/gi,_0xc826[1020]);j=j[_0xc826[343]](/&nbsp;/gi,_0xc826[856]);j=j[_0xc826[343]](/<b\sid="internal-source-marker(.*?)">([\w\W]*?)<\/b>/gi,_0xc826[410]);j=j[_0xc826[343]](/<b(.*?)id="docs-internal-guid(.*?)">([\w\W]*?)<\/b>/gi,_0xc826[1021]);j=this[_0xc826[348]](j);j=j[_0xc826[343]](/<td>\u200b*<\/td>/gi,_0xc826[1022]);j=j[_0xc826[343]](/<td>&nbsp;<\/td>/gi,_0xc826[1022]);j=j[_0xc826[343]](/<td><br><\/td>/gi,_0xc826[1022]);j=j[_0xc826[343]](/<td(.*?)colspan="(.*?)"(.*?)>([\w\W]*?)<\/td>/gi,_0xc826[1023]);j=j[_0xc826[343]](/<td(.*?)rowspan="(.*?)"(.*?)>([\w\W]*?)<\/td>/gi,_0xc826[1024]);j=j[_0xc826[343]](/<a(.*?)href="(.*?)"(.*?)>([\w\W]*?)<\/a>/gi,_0xc826[1025]);j=j[_0xc826[343]](/<iframe(.*?)>([\w\W]*?)<\/iframe>/gi,_0xc826[1026]);j=j[_0xc826[343]](/<video(.*?)>([\w\W]*?)<\/video>/gi,_0xc826[1027]);j=j[_0xc826[343]](/<audio(.*?)>([\w\W]*?)<\/audio>/gi,_0xc826[1028]);j=j[_0xc826[343]](/<embed(.*?)>([\w\W]*?)<\/embed>/gi,_0xc826[1029]);j=j[_0xc826[343]](/<object(.*?)>([\w\W]*?)<\/object>/gi,_0xc826[1030]);j=j[_0xc826[343]](/<param(.*?)>/gi,_0xc826[1031]);j=j[_0xc826[343]](/<img(.*?)>/gi,_0xc826[1032]);j=j[_0xc826[343]](/ class="(.*?)"/gi,_0xc826[331]);j=j[_0xc826[343]](/<(\w+)([\w\W]*?)>/gi,_0xc826[1033]);j=j[_0xc826[343]](/<[^\/>][^>]*>(\s*|\t*|\n*|&nbsp;|<br>)<\/[^>]+>/gi,_0xc826[331]);j=j[_0xc826[343]](/<div>\s*?\t*?\n*?(<ul>|<ol>|<p>)/gi,_0xc826[414]);j=j[_0xc826[343]](/\[td colspan="(.*?)"\]([\w\W]*?)\[\/td\]/gi,_0xc826[1034]);j=j[_0xc826[343]](/\[td rowspan="(.*?)"\]([\w\W]*?)\[\/td\]/gi,_0xc826[1035]);j=j[_0xc826[343]](/\[td\]/gi,_0xc826[1036]);j=j[_0xc826[343]](/\[a href="(.*?)"\]([\w\W]*?)\[\/a\]/gi,_0xc826[1037]);j=j[_0xc826[343]](/\[iframe(.*?)\]([\w\W]*?)\[\/iframe\]/gi,_0xc826[1038]);j=j[_0xc826[343]](/\[video(.*?)\]([\w\W]*?)\[\/video\]/gi,_0xc826[1039]);j=j[_0xc826[343]](/\[audio(.*?)\]([\w\W]*?)\[\/audio\]/gi,_0xc826[1040]);j=j[_0xc826[343]](/\[embed(.*?)\]([\w\W]*?)\[\/embed\]/gi,_0xc826[1041]);j=j[_0xc826[343]](/\[object(.*?)\]([\w\W]*?)\[\/object\]/gi,_0xc826[1042]);j=j[_0xc826[343]](/\[param(.*?)\]/gi,_0xc826[1043]);j=j[_0xc826[343]](/\[img(.*?)\]/gi,_0xc826[1044]);if(this[_0xc826[25]][_0xc826[837]]){j=j[_0xc826[343]](/<div(.*?)>([\w\W]*?)<\/div>/gi,_0xc826[1045]);j=j[_0xc826[343]](/<\/div><p>/gi,_0xc826[571]);j=j[_0xc826[343]](/<\/p><\/div>/gi,_0xc826[573]);j=j[_0xc826[343]](/<p><\/p>/gi,_0xc826[1046]);} else {j=j[_0xc826[343]](/<div><\/div>/gi,_0xc826[1046]);} ;if(this[_0xc826[801]](_0xc826[118])){j=j[_0xc826[343]](/<p>([\w\W]*?)<\/p>/gi,_0xc826[1047]);} else {if(f===false){j=this[_0xc826[839]](j);} ;} ;j=j[_0xc826[343]](/<span(.*?)>([\w\W]*?)<\/span>/gi,_0xc826[410]);j=j[_0xc826[343]](/<img>/gi,_0xc826[331]);j=j[_0xc826[343]](/<[^\/>][^>][^img|param|source|td][^<]*>(\s*|\t*|\n*| |<br>)<\/[^>]+>/gi,_0xc826[331]);j=j[_0xc826[343]](/\n{3,}/gi,_0xc826[583]);j=j[_0xc826[343]](/<p><p>/gi,_0xc826[571]);j=j[_0xc826[343]](/<\/p><\/p>/gi,_0xc826[573]);j=j[_0xc826[343]](/<li>(\s*|\t*|\n*)<p>/gi,_0xc826[688]);j=j[_0xc826[343]](/<\/p>(\s*|\t*|\n*)<\/li>/gi,_0xc826[911]);if(this[_0xc826[25]][_0xc826[204]]===true){j=j[_0xc826[343]](/<p(.*?)>([\w\W]*?)<\/p>/gi,_0xc826[352]);} ;j=j[_0xc826[343]](/<[^\/>][^>][^img|param|source|td][^<]*>(\s*|\t*|\n*| |<br>)<\/[^>]+>/gi,_0xc826[331]);j=j[_0xc826[343]](/<img src="webkit-fake-url\:\/\/(.*?)"(.*?)>/gi,_0xc826[331]);j=j[_0xc826[343]](/<td(.*?)>(\s*|\t*|\n*)<p>([\w\W]*?)<\/p>(\s*|\t*|\n*)<\/td>/gi,_0xc826[1048]);if(this[_0xc826[25]][_0xc826[837]]){j=j[_0xc826[343]](/<div(.*?)>([\w\W]*?)<\/div>/gi,_0xc826[410]);j=j[_0xc826[343]](/<div(.*?)>([\w\W]*?)<\/div>/gi,_0xc826[410]);} ;this[_0xc826[1049]]=false;if(this[_0xc826[238]](_0xc826[465])){if(this[_0xc826[25]][_0xc826[518]]){var l=j[_0xc826[592]](/<img src="data:image(.*?)"(.*?)>/gi);if(l!==null){this[_0xc826[1049]]=l;for(k in l){var e=l[k][_0xc826[343]](_0xc826[1050],_0xc826[1051]+k+_0xc826[1052]);j=j[_0xc826[343]](l[k],e);} ;} ;} ;while(/<br>$/gi[_0xc826[569]](j)){j=j[_0xc826[343]](/<br>$/gi,_0xc826[331]);} ;} ;j=j[_0xc826[343]](/<p>•([\w\W]*?)<\/p>/gi,_0xc826[1053]);while(/<font>([\w\W]*?)<\/font>/gi[_0xc826[569]](j)){j=j[_0xc826[343]](/<font>([\w\W]*?)<\/font>/gi,_0xc826[414]);} ;if(f===false){j=j[_0xc826[343]](/<td(.*?)>([\w\W]*?)<p(.*?)>([\w\W]*?)<\/td>/gi,_0xc826[1054]);j=j[_0xc826[343]](/<td(.*?)>([\w\W]*?)<\/p>([\w\W]*?)<\/td>/gi,_0xc826[1055]);j=j[_0xc826[343]](/<td(.*?)>([\w\W]*?)<p(.*?)>([\w\W]*?)<\/td>/gi,_0xc826[1054]);j=j[_0xc826[343]](/<td(.*?)>([\w\W]*?)<\/p>([\w\W]*?)<\/td>/gi,_0xc826[1055]);} ;j=j[_0xc826[343]](/\n/g,_0xc826[856]);j=j[_0xc826[343]](/<p>\n?<li>/gi,_0xc826[688]);this[_0xc826[1014]](j);} ,pastePre:function (f){f=f[_0xc826[343]](/<br>|<\/H[1-6]>|<\/p>|<\/div>/gi,_0xc826[583]);var e=this[_0xc826[208]][_0xc826[562]](_0xc826[106]);e[_0xc826[783]]=f;return this[_0xc826[931]](e[_0xc826[1012]]||e[_0xc826[1013]]);} ,pasteInsert:function (e){e=this[_0xc826[391]](_0xc826[1056],false,e);if(this[_0xc826[496]]){this[_0xc826[324]][_0xc826[42]](e);this[_0xc826[723]]();this[_0xc826[994]]();this[_0xc826[357]]();} else {this[_0xc826[800]](e);} ;this[_0xc826[496]]=false;setTimeout(c[_0xc826[464]](function (){this[_0xc826[190]]=false;if(this[_0xc826[238]](_0xc826[465])){this[_0xc826[324]][_0xc826[365]](_0xc826[1057])[_0xc826[322]]();} ;if(this[_0xc826[1049]]!==false){this[_0xc826[1058]]();} ;} ,this),100);if(this[_0xc826[25]][_0xc826[427]]&&this[_0xc826[522]]!==true){c(this[_0xc826[208]][_0xc826[65]])[_0xc826[524]](this[_0xc826[523]]);} else {this[_0xc826[324]][_0xc826[524]](this[_0xc826[523]]);} ;} ,pasteClipboardAppendFields:function (e){if(this[_0xc826[25]][_0xc826[1059]]!==false&& typeof this[_0xc826[25]][_0xc826[1059]]===_0xc826[1060]){c[_0xc826[19]](this[_0xc826[25]][_0xc826[1059]],c[_0xc826[464]](function (g,f){if(f!=null&&f.toString()[_0xc826[506]](_0xc826[1061])===0){f=c(f)[_0xc826[323]]();} ;e[g]=f;} ,this));} ;return e;} ,pasteClipboardUploadMozilla:function (){var e=this[_0xc826[324]][_0xc826[365]](_0xc826[1062]);c[_0xc826[19]](e,c[_0xc826[464]](function (j,l){var g=c(l);var f=l[_0xc826[359]][_0xc826[443]](_0xc826[1063]);var h={contentType:f[0][_0xc826[443]](_0xc826[1065])[0][_0xc826[443]](_0xc826[1064])[1],data:f[1]};h=this[_0xc826[1066]](h);c[_0xc826[667]](this[_0xc826[25]][_0xc826[1067]],h,c[_0xc826[464]](function (n){var m=( typeof n===_0xc826[10]?c[_0xc826[1068]](n):n);g[_0xc826[341]](_0xc826[359],m[_0xc826[1069]]);g[_0xc826[326]](_0xc826[1070]);this[_0xc826[357]]();this[_0xc826[391]](_0xc826[473],g,m);} ,this));} ,this));} ,pasteClipboardUpload:function (j){var g=j[_0xc826[488]][_0xc826[1071]];var f=g[_0xc826[443]](_0xc826[1063]);var h={contentType:f[0][_0xc826[443]](_0xc826[1065])[0][_0xc826[443]](_0xc826[1064])[1],data:f[1]};if(this[_0xc826[25]][_0xc826[518]]){h=this[_0xc826[1066]](h);c[_0xc826[667]](this[_0xc826[25]][_0xc826[1067]],h,c[_0xc826[464]](function (m){var l=( typeof m===_0xc826[10]?c[_0xc826[1068]](m):m);var e=_0xc826[1072]+l[_0xc826[1069]]+_0xc826[1073];this[_0xc826[467]](_0xc826[791],e,false);var n=c(this[_0xc826[324]][_0xc826[365]](_0xc826[1074]));if(n[_0xc826[20]]){n[_0xc826[326]](_0xc826[441]);} else {n=false;} ;this[_0xc826[357]]();if(n){this[_0xc826[391]](_0xc826[473],n,l);} ;} ,this));} else {this[_0xc826[800]](_0xc826[1072]+g+_0xc826[624]);} ;} ,bufferSet:function (e,f){if(e!==undefined||e===false){this[_0xc826[25]][_0xc826[552]][_0xc826[15]](e);} else {if(f!==false){this[_0xc826[521]]();} ;this[_0xc826[25]][_0xc826[552]][_0xc826[15]](this[_0xc826[324]][_0xc826[42]]());this[_0xc826[1075]](_0xc826[552]);} ;} ,bufferUndo:function (){if(this[_0xc826[25]][_0xc826[552]][_0xc826[20]]===0){this[_0xc826[742]]();return ;} ;this[_0xc826[521]]();this[_0xc826[25]][_0xc826[555]][_0xc826[15]](this[_0xc826[324]][_0xc826[42]]());this[_0xc826[526]](false,true);this[_0xc826[324]][_0xc826[42]](this[_0xc826[25]][_0xc826[552]][_0xc826[1076]]());this[_0xc826[526]]();setTimeout(c[_0xc826[464]](this[_0xc826[463]],this),100);} ,bufferRedo:function (){if(this[_0xc826[25]][_0xc826[555]][_0xc826[20]]===0){this[_0xc826[742]]();return false;} ;this[_0xc826[521]]();this[_0xc826[25]][_0xc826[552]][_0xc826[15]](this[_0xc826[324]][_0xc826[42]]());this[_0xc826[526]](false,true);this[_0xc826[324]][_0xc826[42]](this[_0xc826[25]][_0xc826[555]][_0xc826[1076]]());this[_0xc826[526]](true);setTimeout(c[_0xc826[464]](this[_0xc826[463]],this),4);} ,observeStart:function (){this[_0xc826[608]]();if(this[_0xc826[25]][_0xc826[609]]){this[_0xc826[609]]();} ;} ,observeLinks:function (){this[_0xc826[324]][_0xc826[365]](_0xc826[689])[_0xc826[476]](_0xc826[731],c[_0xc826[464]](this[_0xc826[1077]],this));this[_0xc826[324]][_0xc826[476]](_0xc826[1078],c[_0xc826[464]](function (f){this[_0xc826[1079]](f);} ,this));c(document)[_0xc826[476]](_0xc826[1078],c[_0xc826[464]](function (f){this[_0xc826[1079]](f);} ,this));} ,observeImages:function (){if(this[_0xc826[25]][_0xc826[608]]===false){return false;} ;this[_0xc826[324]][_0xc826[365]](_0xc826[386])[_0xc826[19]](c[_0xc826[464]](function (e,f){if(this[_0xc826[238]](_0xc826[237])){c(f)[_0xc826[341]](_0xc826[1080],_0xc826[476]);} ;this[_0xc826[1081]](f);} ,this));} ,linkObserver:function (h){var j=c(h[_0xc826[488]]);if(j[_0xc826[493]]()==0||j[0][_0xc826[370]]!==_0xc826[771]){return ;} ;var m=j[_0xc826[697]]();if(this[_0xc826[25]][_0xc826[203]]){var g=this[_0xc826[334]][_0xc826[697]]();m[_0xc826[696]]=g[_0xc826[696]]+(m[_0xc826[696]]-c(this[_0xc826[208]])[_0xc826[524]]());m[_0xc826[699]]+=g[_0xc826[699]];} ;var p=c(_0xc826[1082]);var f=j[_0xc826[341]](_0xc826[1083]);if(f[_0xc826[20]]>24){f=f[_0xc826[666]](0,24)+_0xc826[1084];} ;var l=c(_0xc826[1085]+j[_0xc826[341]](_0xc826[1083])+_0xc826[1086]+f+_0xc826[730])[_0xc826[476]](_0xc826[731],c[_0xc826[464]](function (q){this[_0xc826[1079]](false);} ,this));var n=c(_0xc826[1087]+this[_0xc826[25]][_0xc826[242]][_0xc826[1088]]+_0xc826[730])[_0xc826[476]](_0xc826[731],c[_0xc826[464]](function (q){q[_0xc826[503]]();this[_0xc826[299]]();this[_0xc826[1079]](false);} ,this));var o=c(_0xc826[1087]+this[_0xc826[25]][_0xc826[242]][_0xc826[300]]+_0xc826[730])[_0xc826[476]](_0xc826[731],c[_0xc826[464]](function (q){q[_0xc826[503]]();this[_0xc826[467]](_0xc826[300]);this[_0xc826[1079]](false);} ,this));p[_0xc826[435]](l);p[_0xc826[435]](_0xc826[1089]);p[_0xc826[435]](n);p[_0xc826[435]](_0xc826[1089]);p[_0xc826[435]](o);p[_0xc826[199]]({top:(m[_0xc826[696]]+20)+_0xc826[451],left:m[_0xc826[699]]+_0xc826[451]});c(_0xc826[1090])[_0xc826[322]]();c(_0xc826[65])[_0xc826[435]](p);} ,linkObserverTooltipClose:function (f){if(f!==false&&f[_0xc826[488]][_0xc826[370]]==_0xc826[771]){return false;} ;c(_0xc826[1090])[_0xc826[322]]();} ,getSelection:function (){if(!this[_0xc826[25]][_0xc826[1091]]){return this[_0xc826[208]][_0xc826[651]]();} else {if(!this[_0xc826[25]][_0xc826[203]]){return rangy[_0xc826[651]]();} else {return rangy[_0xc826[651]](this[_0xc826[334]][0]);} ;} ;} ,getRange:function (){if(!this[_0xc826[25]][_0xc826[1091]]){if(this[_0xc826[208]][_0xc826[651]]){var e=this[_0xc826[651]]();if(e[_0xc826[780]]&&e[_0xc826[781]]){return e[_0xc826[780]](0);} ;} ;return this[_0xc826[208]][_0xc826[794]]();} else {if(!this[_0xc826[25]][_0xc826[203]]){return rangy[_0xc826[794]]();} else {return rangy[_0xc826[794]](this[_0xc826[619]]());} ;} ;} ,selectionElement:function (e){this[_0xc826[1092]](e);} ,selectionStart:function (e){this[_0xc826[1093]](e[0]||e,0,null,0);} ,selectionEnd:function (e){this[_0xc826[1093]](e[0]||e,1,null,1);} ,selectionSet:function (o,n,m,j){if(m==null){m=o;} ;if(j==null){j=n;} ;var h=this[_0xc826[651]]();if(!h){return ;} ;if(o[_0xc826[370]]==_0xc826[74]&&o[_0xc826[783]]==_0xc826[331]){o[_0xc826[783]]=this[_0xc826[25]][_0xc826[572]];} ;if(o[_0xc826[370]]==_0xc826[596]&&this[_0xc826[25]][_0xc826[204]]===false){var g=c(this[_0xc826[25]][_0xc826[640]])[0];c(o)[_0xc826[373]](g);o=g;m=o;} ;var f=this[_0xc826[648]]();f[_0xc826[1000]](o,n);f[_0xc826[1094]](m,j);try{h[_0xc826[652]]();} catch(l){} ;h[_0xc826[653]](f);} ,selectionWrap:function (e){e=e[_0xc826[774]]();var h=this[_0xc826[542]]();if(h){var j=this[_0xc826[1095]](h,e);this[_0xc826[357]]();return j;} ;var g=this[_0xc826[651]]();var f=g[_0xc826[780]](0);var j=document[_0xc826[562]](e);j[_0xc826[785]](f[_0xc826[1096]]());f[_0xc826[563]](j);this[_0xc826[972]](j);return j;} ,selectionAll:function (){var e=this[_0xc826[648]]();e[_0xc826[649]](this[_0xc826[324]][0]);var f=this[_0xc826[651]]();f[_0xc826[652]]();f[_0xc826[653]](e);} ,selectionRemove:function (){this[_0xc826[651]]()[_0xc826[652]]();} ,getCaretOffset:function (h){var e=0;var g=this[_0xc826[648]]();var f=g[_0xc826[787]]();f[_0xc826[649]](h);f[_0xc826[1094]](g[_0xc826[978]],g[_0xc826[2]]);e=c[_0xc826[382]](f.toString())[_0xc826[20]];return e;} ,getCaretOffsetRange:function (){return  new d(this[_0xc826[651]]()[_0xc826[780]](0));} ,setCaret:function (h,f,m){if( typeof m===_0xc826[12]){m=f;} ;h=h[0]||h;var o=this[_0xc826[648]]();o[_0xc826[649]](h);var p=this[_0xc826[1097]](h);var l=false;var e=0,q;if(p[_0xc826[20]]==1&&f){o[_0xc826[1000]](p[0],f);o[_0xc826[1094]](p[0],m);} else {for(var n=0,j;j=p[n++];){q=e+j[_0xc826[20]];if(!l&&f>=e&&(f<q||(f==q&&n<p[_0xc826[20]]))){o[_0xc826[1000]](j,f-e);l=true;} ;if(l&&m<=q){o[_0xc826[1094]](j,m-e);break ;} ;e=q;} ;} ;var g=this[_0xc826[651]]();g[_0xc826[652]]();g[_0xc826[653]](o);} ,getTextNodesIn:function (j){var h=[];if(j[_0xc826[560]]==3){h[_0xc826[15]](j);} else {var g=j[_0xc826[1098]];for(var f=0,e=g[_0xc826[20]];f<e;++f){h[_0xc826[15]][_0xc826[14]](h,this[_0xc826[1097]](g[f]));} ;} ;return h;} ,getCurrent:function (){var e=false;var f=this[_0xc826[651]]();if(f&&f[_0xc826[781]]>0){e=f[_0xc826[780]](0)[_0xc826[977]];} ;return this[_0xc826[806]](e);} ,getParent:function (e){e=e||this[_0xc826[541]]();if(e){return this[_0xc826[806]](c(e)[_0xc826[548]]()[0]);} else {return false;} ;} ,getBlock:function (e){if( typeof e===_0xc826[12]){e=this[_0xc826[541]]();} ;while(e){if(this[_0xc826[817]](e)){if(c(e)[_0xc826[492]](_0xc826[329])){return false;} ;return e;} ;e=e[_0xc826[986]];} ;return false;} ,getBlocks:function (f){var g=[];if( typeof f==_0xc826[12]){var e=this[_0xc826[648]]();if(e&&e[_0xc826[976]]===true){return [this[_0xc826[542]]()];} ;var f=this[_0xc826[809]](e);} ;c[_0xc826[19]](f,c[_0xc826[464]](function (h,j){if(this[_0xc826[25]][_0xc826[203]]===false&&c(j)[_0xc826[495]](_0xc826[1099])[_0xc826[493]]()==0){return false;} ;if(this[_0xc826[817]](j)){g[_0xc826[15]](j);} ;} ,this));if(g[_0xc826[20]]===0){g=[this[_0xc826[542]]()];} ;return g;} ,nodeTestBlocks:function (e){return e[_0xc826[560]]==1&&this[_0xc826[224]][_0xc826[569]](e[_0xc826[1100]]);} ,tagTestBlock:function (e){return this[_0xc826[224]][_0xc826[569]](e);} ,getNodes:function (g,e){if( typeof g==_0xc826[12]||g==false){var g=this[_0xc826[648]]();} ;if(g&&g[_0xc826[976]]===true){if( typeof e===_0xc826[12]&&this[_0xc826[1101]](e)){var m=this[_0xc826[542]]();if(m[_0xc826[370]]==e){return [m];} else {return [];} ;} else {return [this[_0xc826[541]]()];} ;} ;var f=[],l=[];var j=this[_0xc826[208]][_0xc826[651]]();if(!j[_0xc826[1102]]){f=this[_0xc826[989]](j[_0xc826[780]](0));} ;c[_0xc826[19]](f,c[_0xc826[464]](function (n,o){if(this[_0xc826[25]][_0xc826[203]]===false&&c(o)[_0xc826[495]](_0xc826[1099])[_0xc826[493]]()==0){return false;} ;if( typeof e===_0xc826[12]){if(c[_0xc826[382]](o[_0xc826[1012]])!=_0xc826[331]){l[_0xc826[15]](o);} ;} else {if(o[_0xc826[370]]==e){l[_0xc826[15]](o);} ;} ;} ,this));if(l[_0xc826[20]]==0){if( typeof e===_0xc826[12]&&this[_0xc826[1101]](e)){var m=this[_0xc826[542]]();if(m[_0xc826[370]]==e){return l[_0xc826[15]](m);} else {return [];} ;} else {l[_0xc826[15]](this[_0xc826[541]]());} ;} ;var h=l[l[_0xc826[20]]-1];if(this[_0xc826[817]](h)){l=l[_0xc826[9]](0,-1);} ;return l;} ,getElement:function (e){if(!e){e=this[_0xc826[541]]();} ;while(e){if(e[_0xc826[560]]==1){if(c(e)[_0xc826[492]](_0xc826[329])){return false;} ;return e;} ;e=e[_0xc826[986]];} ;return false;} ,getRangeSelectedNodes:function (f){f=f||this[_0xc826[648]]();var g=f[_0xc826[977]];var e=f[_0xc826[978]];if(g==e){return [g];} ;var h=[];while(g&&g!=e){h[_0xc826[15]](g=this[_0xc826[1103]](g));} ;g=f[_0xc826[977]];while(g&&g!=f[_0xc826[1104]]){h[_0xc826[811]](g);g=g[_0xc826[986]];} ;return h;} ,nextNode:function (e){if(e[_0xc826[1105]]()){return e[_0xc826[786]];} else {while(e&&!e[_0xc826[1106]]){e=e[_0xc826[986]];} ;if(!e){return null;} ;return e[_0xc826[1106]];} ;} ,getSelectionText:function (){return this[_0xc826[651]]().toString();} ,getSelectionHtml:function (){var h=_0xc826[331];var j=this[_0xc826[651]]();if(j[_0xc826[781]]){var f=this[_0xc826[208]][_0xc826[562]](_0xc826[106]);var e=j[_0xc826[781]];for(var g=0;g<e;++g){f[_0xc826[785]](j[_0xc826[780]](g)[_0xc826[1107]]());} ;h=f[_0xc826[783]];} ;return this[_0xc826[379]](h);} ,selectionSave:function (){if(!this[_0xc826[751]]()){this[_0xc826[742]]();} ;if(!this[_0xc826[25]][_0xc826[1091]]){this[_0xc826[1108]](this[_0xc826[648]]());} else {this[_0xc826[210]]=rangy[_0xc826[1109]]();} ;} ,selectionCreateMarker:function (h,e){if(!h){return ;} ;var g=c(_0xc826[1110]+this[_0xc826[25]][_0xc826[572]]+_0xc826[413],this[_0xc826[208]])[0];var f=c(_0xc826[1111]+this[_0xc826[25]][_0xc826[572]]+_0xc826[413],this[_0xc826[208]])[0];if(h[_0xc826[976]]===true){this[_0xc826[1112]](h,g,true);} else {this[_0xc826[1112]](h,g,true);this[_0xc826[1112]](h,f,false);} ;this[_0xc826[210]]=this[_0xc826[324]][_0xc826[42]]();this[_0xc826[526]](false,false);} ,selectionSetMarker:function (e,g,f){var h=e[_0xc826[787]]();h[_0xc826[650]](f);h[_0xc826[563]](g);h[_0xc826[1113]]();} ,selectionRestore:function (h,e){if(!this[_0xc826[25]][_0xc826[1091]]){if(h===true&&this[_0xc826[210]]){this[_0xc826[324]][_0xc826[42]](this[_0xc826[210]]);} ;var g=this[_0xc826[324]][_0xc826[365]](_0xc826[969]);var f=this[_0xc826[324]][_0xc826[365]](_0xc826[1114]);if(this[_0xc826[238]](_0xc826[465])){this[_0xc826[324]][_0xc826[469]]();} else {if(!this[_0xc826[751]]()){this[_0xc826[742]]();} ;} ;if(g[_0xc826[20]]!=0&&f[_0xc826[20]]!=0){this[_0xc826[1093]](g[0],0,f[0],0);} else {if(g[_0xc826[20]]!=0){this[_0xc826[1093]](g[0],0,null,0);} ;} ;if(e!==false){this[_0xc826[1075]]();this[_0xc826[210]]=false;} ;} else {rangy[_0xc826[1115]](this[_0xc826[210]]);} ;} ,selectionRemoveMarkers:function (e){if(!this[_0xc826[25]][_0xc826[1091]]){c[_0xc826[19]](this[_0xc826[324]][_0xc826[365]](_0xc826[1116]),function (){var f=c[_0xc826[382]](c(this)[_0xc826[42]]()[_0xc826[343]](/[^\u0000-\u1C7F]/g,_0xc826[331]));if(f==_0xc826[331]){c(this)[_0xc826[322]]();} else {c(this)[_0xc826[326]](_0xc826[973])[_0xc826[326]](_0xc826[441]);} ;} );} else {rangy[_0xc826[1117]](this[_0xc826[210]]);} ;} ,tableShow:function (){this[_0xc826[521]]();this[_0xc826[1122]](this[_0xc826[25]][_0xc826[242]][_0xc826[46]],this[_0xc826[25]][_0xc826[1118]],300,c[_0xc826[464]](function (){c(_0xc826[1120])[_0xc826[731]](c[_0xc826[464]](this[_0xc826[1119]],this));setTimeout(function (){c(_0xc826[1121])[_0xc826[469]]();} ,200);} ,this));} ,tableInsert:function (){this[_0xc826[507]](false,false);var r=c(_0xc826[1121])[_0xc826[323]](),f=c(_0xc826[1123])[_0xc826[323]](),n=c(_0xc826[1124]),e=Math[_0xc826[1126]](Math[_0xc826[1125]]()*99999),p=c(_0xc826[1127]+e+_0xc826[1128]),g,l,m,o;for(g=0;g<r;g++){l=c(_0xc826[870]);for(m=0;m<f;m++){o=c(_0xc826[815]+this[_0xc826[25]][_0xc826[572]]+_0xc826[1129]);if(g===0&&m===0){o[_0xc826[435]](_0xc826[1007]+this[_0xc826[25]][_0xc826[572]]+_0xc826[413]);} ;c(l)[_0xc826[435]](o);} ;p[_0xc826[435]](l);} ;n[_0xc826[435]](p);var h=n[_0xc826[42]]();this[_0xc826[1130]]();this[_0xc826[526]]();var j=this[_0xc826[542]]()||this[_0xc826[541]]();if(j&&j[_0xc826[370]]!=_0xc826[593]){if(j[_0xc826[370]]==_0xc826[118]){var j=c(j)[_0xc826[722]](_0xc826[820]);} ;c(j)[_0xc826[320]](h);} else {this[_0xc826[993]](h,false);} ;this[_0xc826[526]]();var q=this[_0xc826[324]][_0xc826[365]](_0xc826[1131]+e);this[_0xc826[695]]();q[_0xc826[365]](_0xc826[1132])[_0xc826[322]]();q[_0xc826[326]](_0xc826[441]);this[_0xc826[357]]();} ,tableDeleteTable:function (){var e=c(this[_0xc826[540]]())[_0xc826[722]](_0xc826[46]);if(!this[_0xc826[806]](e)){return false;} ;if(e[_0xc826[493]]()==0){return false;} ;this[_0xc826[507]]();e[_0xc826[322]]();this[_0xc826[357]]();} ,tableDeleteRow:function (){var g=this[_0xc826[540]]();var e=c(g)[_0xc826[722]](_0xc826[46]);if(!this[_0xc826[806]](e)){return false;} ;if(e[_0xc826[493]]()==0){return false;} ;this[_0xc826[507]]();var j=c(g)[_0xc826[722]](_0xc826[116]);var f=j[_0xc826[819]]()[_0xc826[20]]?j[_0xc826[819]]():j[_0xc826[595]]();if(f[_0xc826[20]]){var h=f[_0xc826[337]](_0xc826[114])[_0xc826[1133]]();if(h[_0xc826[20]]){h[_0xc826[685]](_0xc826[1007]+this[_0xc826[25]][_0xc826[572]]+_0xc826[413]);} ;} ;j[_0xc826[322]]();this[_0xc826[526]]();this[_0xc826[357]]();} ,tableDeleteColumn:function (){var h=this[_0xc826[540]]();var g=c(h)[_0xc826[722]](_0xc826[46]);if(!this[_0xc826[806]](g)){return false;} ;if(g[_0xc826[493]]()==0){return false;} ;this[_0xc826[507]]();var e=c(h)[_0xc826[722]](_0xc826[114]);if(!(e[_0xc826[992]](_0xc826[114]))){e=e[_0xc826[722]](_0xc826[114]);} ;var f=e[_0xc826[318]](0)[_0xc826[1134]];g[_0xc826[365]](_0xc826[116])[_0xc826[19]](c[_0xc826[464]](function (j,l){var m=f-1<0?f+1:f-1;if(j===0){c(l)[_0xc826[365]](_0xc826[114])[_0xc826[1135]](m)[_0xc826[685]](_0xc826[1007]+this[_0xc826[25]][_0xc826[572]]+_0xc826[413]);} ;c(l)[_0xc826[365]](_0xc826[114])[_0xc826[1135]](f)[_0xc826[322]]();} ,this));this[_0xc826[526]]();this[_0xc826[357]]();} ,tableAddHead:function (){var e=c(this[_0xc826[540]]())[_0xc826[722]](_0xc826[46]);if(!this[_0xc826[806]](e)){return false;} ;if(e[_0xc826[493]]()==0){return false;} ;this[_0xc826[507]]();if(e[_0xc826[365]](_0xc826[100])[_0xc826[493]]()!==0){this[_0xc826[291]]();} else {var f=e[_0xc826[365]](_0xc826[116])[_0xc826[1133]]()[_0xc826[594]]();f[_0xc826[365]](_0xc826[114])[_0xc826[42]](this[_0xc826[25]][_0xc826[572]]);$thead=c(_0xc826[1136]);$thead[_0xc826[435]](f);e[_0xc826[685]]($thead);this[_0xc826[357]]();} ;} ,tableDeleteHead:function (){var e=c(this[_0xc826[540]]())[_0xc826[722]](_0xc826[46]);if(!this[_0xc826[806]](e)){return false;} ;var f=e[_0xc826[365]](_0xc826[100]);if(f[_0xc826[493]]()==0){return false;} ;this[_0xc826[507]]();f[_0xc826[322]]();this[_0xc826[357]]();} ,tableAddRowAbove:function (){this[_0xc826[1137]](_0xc826[768]);} ,tableAddRowBelow:function (){this[_0xc826[1137]](_0xc826[320]);} ,tableAddColumnLeft:function (){this[_0xc826[1138]](_0xc826[768]);} ,tableAddColumnRight:function (){this[_0xc826[1138]](_0xc826[320]);} ,tableAddRow:function (f){var e=c(this[_0xc826[540]]())[_0xc826[722]](_0xc826[46]);if(!this[_0xc826[806]](e)){return false;} ;if(e[_0xc826[493]]()==0){return false;} ;this[_0xc826[507]]();var g=c(this[_0xc826[540]]())[_0xc826[722]](_0xc826[116]);var h=g[_0xc826[594]]();h[_0xc826[365]](_0xc826[114])[_0xc826[42]](this[_0xc826[25]][_0xc826[572]]);if(f===_0xc826[320]){g[_0xc826[320]](h);} else {g[_0xc826[768]](h);} ;this[_0xc826[357]]();} ,tableAddColumn:function (j){var h=this[_0xc826[540]]();var g=c(h)[_0xc826[722]](_0xc826[46]);if(!this[_0xc826[806]](g)){return false;} ;if(g[_0xc826[493]]()==0){return false;} ;this[_0xc826[507]]();var f=0;var l=this[_0xc826[541]]();var m=c(l)[_0xc826[722]](_0xc826[116]);var e=c(l)[_0xc826[722]](_0xc826[114]);m[_0xc826[365]](_0xc826[114])[_0xc826[19]](c[_0xc826[464]](function (n,o){if(c(o)[0]===e[0]){f=n;} ;} ,this));g[_0xc826[365]](_0xc826[116])[_0xc826[19]](c[_0xc826[464]](function (n,p){var o=c(p)[_0xc826[365]](_0xc826[114])[_0xc826[1135]](f);var q=o[_0xc826[594]]();q[_0xc826[42]](this[_0xc826[25]][_0xc826[572]]);j===_0xc826[320]?o[_0xc826[320]](q):o[_0xc826[768]](q);} ,this));this[_0xc826[357]]();} ,videoShow:function (){this[_0xc826[521]]();this[_0xc826[1122]](this[_0xc826[25]][_0xc826[242]][_0xc826[45]],this[_0xc826[25]][_0xc826[1139]],600,c[_0xc826[464]](function (){c(_0xc826[1141])[_0xc826[731]](c[_0xc826[464]](this[_0xc826[1140]],this));setTimeout(function (){c(_0xc826[1142])[_0xc826[469]]();} ,200);} ,this));} ,videoInsert:function (){var e=c(_0xc826[1142])[_0xc826[323]]();e=this[_0xc826[348]](e);this[_0xc826[526]]();var f=this[_0xc826[542]]()||this[_0xc826[541]]();if(f){c(f)[_0xc826[320]](e);} else {this[_0xc826[993]](e,false);} ;this[_0xc826[357]]();this[_0xc826[1130]]();} ,linkShow:function (){this[_0xc826[521]]();var e=c[_0xc826[464]](function (){this[_0xc826[1143]]=false;var g=this[_0xc826[651]]();var f=_0xc826[331],o=_0xc826[331],j=_0xc826[331];var h=this[_0xc826[540]]();var l=c(h)[_0xc826[548]]()[_0xc826[318]](0);if(l&&l[_0xc826[370]]===_0xc826[771]){h=l;} ;if(h&&h[_0xc826[370]]===_0xc826[771]){f=h[_0xc826[1083]];o=c(h)[_0xc826[582]]();j=h[_0xc826[488]];this[_0xc826[1143]]=h;} else {o=g.toString();} ;c(_0xc826[1144])[_0xc826[323]](o);var q=self[_0xc826[1145]][_0xc826[1083]][_0xc826[343]](/\/$/i,_0xc826[331]);var n=f[_0xc826[343]](q,_0xc826[331]);if(this[_0xc826[25]][_0xc826[605]]===false){var p= new RegExp(_0xc826[1146]+self[_0xc826[1145]][_0xc826[1147]],_0xc826[228]);n=n[_0xc826[343]](p,_0xc826[331]);} ;var m=c(_0xc826[1148])[_0xc826[365]](_0xc826[689]);if(this[_0xc826[25]][_0xc826[1149]]===false){m[_0xc826[1135]](1)[_0xc826[322]]();} ;if(this[_0xc826[25]][_0xc826[1150]]===false){m[_0xc826[1135]](2)[_0xc826[322]]();} ;if(this[_0xc826[25]][_0xc826[1149]]===false&&this[_0xc826[25]][_0xc826[1150]]===false){c(_0xc826[1148])[_0xc826[322]]();c(_0xc826[1151])[_0xc826[323]](n);} else {if(f[_0xc826[585]](_0xc826[1152])===0){this[_0xc826[1153]][_0xc826[8]](this,2);c(_0xc826[1154])[_0xc826[323]](2);c(_0xc826[1155])[_0xc826[323]](f[_0xc826[343]](_0xc826[1152],_0xc826[331]));} else {if(n[_0xc826[585]](/^#/gi)===0){this[_0xc826[1153]][_0xc826[8]](this,3);c(_0xc826[1154])[_0xc826[323]](3);c(_0xc826[1156])[_0xc826[323]](n[_0xc826[343]](/^#/gi,_0xc826[331]));} else {c(_0xc826[1151])[_0xc826[323]](n);} ;} ;} ;if(j===_0xc826[1157]){c(_0xc826[1160])[_0xc826[1159]](_0xc826[1158],true);} ;this[_0xc826[1161]]=false;c(_0xc826[1163])[_0xc826[731]](c[_0xc826[464]](this[_0xc826[1162]],this));setTimeout(function (){c(_0xc826[1151])[_0xc826[469]]();} ,200);} ,this);this[_0xc826[1122]](this[_0xc826[25]][_0xc826[242]][_0xc826[47]],this[_0xc826[25]][_0xc826[1164]],460,e);} ,linkProcess:function (){if(this[_0xc826[1161]]){return ;} ;this[_0xc826[1161]]=true;var j=c(_0xc826[1154])[_0xc826[323]]();var g=_0xc826[331],n=_0xc826[331],l=_0xc826[331],m=_0xc826[331];if(j===_0xc826[1165]){g=c(_0xc826[1151])[_0xc826[323]]();n=c(_0xc826[1166])[_0xc826[323]]();if(c(_0xc826[1160])[_0xc826[1159]](_0xc826[1158])){l=_0xc826[1167];m=_0xc826[1157];} ;var h=_0xc826[1168];var f= new RegExp(_0xc826[1146]+h,_0xc826[228]);var e= new RegExp(_0xc826[1169]+h,_0xc826[228]);if(g[_0xc826[585]](f)==-1&&g[_0xc826[585]](e)==0&&this[_0xc826[25]][_0xc826[605]]){g=this[_0xc826[25]][_0xc826[605]]+g;} ;} else {if(j===_0xc826[1170]){g=_0xc826[1152]+c(_0xc826[1155])[_0xc826[323]]();n=c(_0xc826[1171])[_0xc826[323]]();} else {if(j===_0xc826[1172]){g=_0xc826[1061]+c(_0xc826[1156])[_0xc826[323]]();n=c(_0xc826[1173])[_0xc826[323]]();} ;} ;} ;n=n[_0xc826[343]](/<|>/g,_0xc826[331]);this[_0xc826[1174]](_0xc826[1085]+g+_0xc826[932]+l+_0xc826[790]+n+_0xc826[730],c[_0xc826[382]](n),g,m);} ,linkInsert:function (e,j,f,h){this[_0xc826[526]]();if(j!==_0xc826[331]){if(this[_0xc826[1143]]){this[_0xc826[507]]();c(this[_0xc826[1143]])[_0xc826[582]](j)[_0xc826[341]](_0xc826[1083],f);if(h!==_0xc826[331]){c(this[_0xc826[1143]])[_0xc826[341]](_0xc826[488],h);} else {c(this[_0xc826[1143]])[_0xc826[326]](_0xc826[488]);} ;this[_0xc826[357]]();} else {var g=c(e)[_0xc826[446]](_0xc826[1175]);this[_0xc826[733]](_0xc826[791],this[_0xc826[339]](g),false);this[_0xc826[324]][_0xc826[365]](_0xc826[1176])[_0xc826[326]](_0xc826[68])[_0xc826[328]](_0xc826[1175])[_0xc826[19]](function (){if(this[_0xc826[444]]==_0xc826[331]){c(this)[_0xc826[326]](_0xc826[973]);} ;} );this[_0xc826[357]]();} ;} ;setTimeout(c[_0xc826[464]](function (){if(this[_0xc826[25]][_0xc826[609]]){this[_0xc826[609]]();} ;} ,this),5);this[_0xc826[1130]]();} ,fileShow:function (){this[_0xc826[521]]();var e=c[_0xc826[464]](function (){var f=this[_0xc826[651]]();var g=_0xc826[331];if(this[_0xc826[834]]()){g=f[_0xc826[582]];} else {g=f.toString();} ;c(_0xc826[1177])[_0xc826[323]](g);if(!this[_0xc826[424]]()&&!this[_0xc826[1178]]()){this[_0xc826[1183]](_0xc826[1179],{url:this[_0xc826[25]][_0xc826[686]],uploadFields:this[_0xc826[25]][_0xc826[1059]],success:c[_0xc826[464]](this[_0xc826[1180]],this),error:c[_0xc826[464]](function (j,h){this[_0xc826[391]](_0xc826[1181],h);} ,this),uploadParam:this[_0xc826[25]][_0xc826[1182]]});} ;this[_0xc826[1185]](_0xc826[1184],{auto:true,url:this[_0xc826[25]][_0xc826[686]],success:c[_0xc826[464]](this[_0xc826[1180]],this),error:c[_0xc826[464]](function (j,h){this[_0xc826[391]](_0xc826[1181],h);} ,this)});} ,this);this[_0xc826[1122]](this[_0xc826[25]][_0xc826[242]][_0xc826[30]],this[_0xc826[25]][_0xc826[1186]],500,e);} ,fileCallback:function (f){this[_0xc826[526]]();if(f!==false){var h=c(_0xc826[1177])[_0xc826[323]]();if(h===_0xc826[331]){h=f[_0xc826[1187]];} ;var g=_0xc826[1085]+f[_0xc826[1069]]+_0xc826[1188]+h+_0xc826[730];if(this[_0xc826[238]](_0xc826[513])&&!!this[_0xc826[209]][_0xc826[1189]]){g=g+_0xc826[1020];} ;this[_0xc826[467]](_0xc826[791],g,false);var e=c(this[_0xc826[324]][_0xc826[365]](_0xc826[1190]));if(e[_0xc826[493]]()!=0){e[_0xc826[326]](_0xc826[441]);} else {e=false;} ;this[_0xc826[357]]();this[_0xc826[391]](_0xc826[686],e,f);} ;this[_0xc826[1130]]();} ,imageShow:function (){this[_0xc826[521]]();var e=c[_0xc826[464]](function (){if(this[_0xc826[25]][_0xc826[1191]]){c[_0xc826[1204]](this[_0xc826[25]][_0xc826[1191]],c[_0xc826[464]](function (l){var g={},j=0;c[_0xc826[19]](l,c[_0xc826[464]](function (n,o){if( typeof o[_0xc826[1192]]!==_0xc826[12]){j++;g[o[_0xc826[1192]]]=j;} ;} ,this));var h=false;c[_0xc826[19]](l,c[_0xc826[464]](function (q,r){var p=_0xc826[331];if( typeof r[_0xc826[729]]!==_0xc826[12]){p=r[_0xc826[729]];} ;var n=0;if(!c[_0xc826[1193]](g)&& typeof r[_0xc826[1192]]!==_0xc826[12]){n=g[r[_0xc826[1192]]];if(h===false){h=_0xc826[1194]+n;} ;} ;var o=c(_0xc826[1072]+r[_0xc826[1195]]+_0xc826[1196]+n+_0xc826[1197]+r[_0xc826[44]]+_0xc826[1198]+p+_0xc826[624]);c(_0xc826[1199])[_0xc826[435]](o);c(o)[_0xc826[731]](c[_0xc826[464]](this[_0xc826[1200]],this));} ,this));if(!c[_0xc826[1193]](g)){c(_0xc826[1194])[_0xc826[433]]();c(h)[_0xc826[247]]();var m=function (n){c(_0xc826[1194])[_0xc826[433]]();c(_0xc826[1194]+c(n[_0xc826[488]])[_0xc826[323]]())[_0xc826[247]]();} ;var f=c(_0xc826[1201]);c[_0xc826[19]](g,function (o,n){f[_0xc826[435]](c(_0xc826[1202]+n+_0xc826[728]+o+_0xc826[1203]));} );c(_0xc826[1199])[_0xc826[768]](f);f[_0xc826[393]](m);} ;} ,this));} else {c(_0xc826[1205])[_0xc826[322]]();} ;if(this[_0xc826[25]][_0xc826[473]]||this[_0xc826[25]][_0xc826[509]]){if(!this[_0xc826[424]]()&&!this[_0xc826[1178]]()&&this[_0xc826[25]][_0xc826[509]]===false){if(c(_0xc826[1179])[_0xc826[20]]){this[_0xc826[1183]](_0xc826[1179],{url:this[_0xc826[25]][_0xc826[473]],uploadFields:this[_0xc826[25]][_0xc826[1059]],success:c[_0xc826[464]](this[_0xc826[1206]],this),error:c[_0xc826[464]](function (g,f){this[_0xc826[391]](_0xc826[1207],f);} ,this),uploadParam:this[_0xc826[25]][_0xc826[510]]});} ;} ;if(this[_0xc826[25]][_0xc826[509]]===false){this[_0xc826[1185]](_0xc826[1184],{auto:true,url:this[_0xc826[25]][_0xc826[473]],success:c[_0xc826[464]](this[_0xc826[1206]],this),error:c[_0xc826[464]](function (g,f){this[_0xc826[391]](_0xc826[1207],f);} ,this)});} else {c(_0xc826[1179])[_0xc826[476]](_0xc826[1208],c[_0xc826[464]](this[_0xc826[1209]],this));} ;} else {c(_0xc826[1210])[_0xc826[433]]();if(!this[_0xc826[25]][_0xc826[1191]]){c(_0xc826[1148])[_0xc826[322]]();c(_0xc826[1211])[_0xc826[247]]();} else {c(_0xc826[1212])[_0xc826[322]]();c(_0xc826[1205])[_0xc826[446]](_0xc826[1213]);c(_0xc826[1214])[_0xc826[247]]();} ;} ;if(!this[_0xc826[25]][_0xc826[1215]]&&(this[_0xc826[25]][_0xc826[473]]||this[_0xc826[25]][_0xc826[1191]])){c(_0xc826[1216])[_0xc826[433]]();} ;c(_0xc826[1218])[_0xc826[731]](c[_0xc826[464]](this[_0xc826[1217]],this));if(!this[_0xc826[25]][_0xc826[473]]&&!this[_0xc826[25]][_0xc826[1191]]){setTimeout(function (){c(_0xc826[1219])[_0xc826[469]]();} ,200);} ;} ,this);this[_0xc826[1122]](this[_0xc826[25]][_0xc826[242]][_0xc826[44]],this[_0xc826[25]][_0xc826[1220]],610,e);} ,imageEdit:function (g){var e=g;var f=e[_0xc826[548]]()[_0xc826[548]]();var h=c[_0xc826[464]](function (){c(_0xc826[1222])[_0xc826[323]](e[_0xc826[341]](_0xc826[1221]));c(_0xc826[1223])[_0xc826[341]](_0xc826[1083],e[_0xc826[341]](_0xc826[359]));if(e[_0xc826[199]](_0xc826[1224])==_0xc826[1225]&&e[_0xc826[199]](_0xc826[1226])==_0xc826[1227]){c(_0xc826[1228])[_0xc826[323]](_0xc826[778]);} else {c(_0xc826[1228])[_0xc826[323]](e[_0xc826[199]](_0xc826[1226]));} ;if(c(f)[_0xc826[318]](0)[_0xc826[370]]===_0xc826[771]){c(_0xc826[1219])[_0xc826[323]](c(f)[_0xc826[341]](_0xc826[1083]));if(c(f)[_0xc826[341]](_0xc826[488])==_0xc826[1157]){c(_0xc826[1160])[_0xc826[1159]](_0xc826[1158],true);} ;} ;c(_0xc826[1230])[_0xc826[731]](c[_0xc826[464]](function (){this[_0xc826[1229]](e);} ,this));c(_0xc826[1232])[_0xc826[731]](c[_0xc826[464]](function (){this[_0xc826[1231]](e);} ,this));} ,this);this[_0xc826[1122]](this[_0xc826[25]][_0xc826[242]][_0xc826[1088]],this[_0xc826[25]][_0xc826[1233]],380,h);} ,imageRemove:function (h){var e=c(h)[_0xc826[548]]()[_0xc826[548]]();var g=c(h)[_0xc826[548]]();var f=false;if(e[_0xc826[20]]&&e[0][_0xc826[370]]===_0xc826[771]){f=true;c(e)[_0xc826[322]]();} else {if(g[_0xc826[20]]&&g[0][_0xc826[370]]===_0xc826[771]){f=true;c(g)[_0xc826[322]]();} else {c(h)[_0xc826[322]]();} ;} ;if(g[_0xc826[20]]&&g[0][_0xc826[370]]===_0xc826[74]){this[_0xc826[742]]();if(f===false){this[_0xc826[574]](g);} ;} ;this[_0xc826[391]](_0xc826[1234],h);this[_0xc826[1130]]();this[_0xc826[357]]();} ,imageSave:function (h){var f=c(h);var g=f[_0xc826[548]]();f[_0xc826[341]](_0xc826[1221],c(_0xc826[1222])[_0xc826[323]]());var n=c(_0xc826[1228])[_0xc826[323]]();var l=_0xc826[331];this[_0xc826[544]](false);if(n===_0xc826[699]){l=_0xc826[1235]+this[_0xc826[25]][_0xc826[1236]]+_0xc826[856]+this[_0xc826[25]][_0xc826[1236]]+_0xc826[1237];f[_0xc826[199]]({"\x66\x6C\x6F\x61\x74":_0xc826[699],margin:l});} else {if(n===_0xc826[777]){l=_0xc826[1238]+this[_0xc826[25]][_0xc826[1236]]+_0xc826[856]+this[_0xc826[25]][_0xc826[1236]]+_0xc826[331];f[_0xc826[199]]({"\x66\x6C\x6F\x61\x74":_0xc826[777],margin:l});} else {if(n===_0xc826[778]){f[_0xc826[199]]({"\x66\x6C\x6F\x61\x74":_0xc826[331],display:_0xc826[1225],margin:_0xc826[529]});} else {f[_0xc826[199]]({"\x66\x6C\x6F\x61\x74":_0xc826[331],display:_0xc826[331],margin:_0xc826[331]});} ;} ;} ;var j=c[_0xc826[382]](c(_0xc826[1219])[_0xc826[323]]());if(j!==_0xc826[331]){var m=false;if(c(_0xc826[1160])[_0xc826[1159]](_0xc826[1158])){m=true;} ;if(g[_0xc826[318]](0)[_0xc826[370]]!==_0xc826[771]){var e=c(_0xc826[1085]+j+_0xc826[728]+this[_0xc826[339]](h)+_0xc826[730]);if(m){e[_0xc826[341]](_0xc826[488],_0xc826[1157]);} ;f[_0xc826[373]](e);} else {g[_0xc826[341]](_0xc826[1083],j);if(m){g[_0xc826[341]](_0xc826[488],_0xc826[1157]);} else {g[_0xc826[326]](_0xc826[488]);} ;} ;} else {if(g[_0xc826[318]](0)[_0xc826[370]]===_0xc826[771]){g[_0xc826[373]](this[_0xc826[339]](h));} ;} ;this[_0xc826[1130]]();this[_0xc826[608]]();this[_0xc826[357]]();} ,imageResizeHide:function (g){if(g!==false&&c(g[_0xc826[488]])[_0xc826[548]]()[_0xc826[493]]()!=0&&c(g[_0xc826[488]])[_0xc826[548]]()[0][_0xc826[441]]===_0xc826[1239]){return false;} ;var f=this[_0xc826[324]][_0xc826[365]](_0xc826[1240]);if(f[_0xc826[493]]()==0){return false;} ;this[_0xc826[324]][_0xc826[365]](_0xc826[1241])[_0xc826[322]]();f[_0xc826[365]](_0xc826[386])[_0xc826[199]]({marginTop:f[0][_0xc826[68]][_0xc826[1242]],marginBottom:f[0][_0xc826[68]][_0xc826[1243]],marginLeft:f[0][_0xc826[68]][_0xc826[1244]],marginRight:f[0][_0xc826[68]][_0xc826[1245]]});f[_0xc826[199]](_0xc826[1246],_0xc826[331]);f[_0xc826[365]](_0xc826[386])[_0xc826[199]](_0xc826[1247],_0xc826[331]);f[_0xc826[373]](function (){return c(this)[_0xc826[338]]();} );c(document)[_0xc826[315]](_0xc826[1248]);this[_0xc826[324]][_0xc826[315]](_0xc826[1248]);this[_0xc826[324]][_0xc826[315]](_0xc826[1249]);this[_0xc826[357]]();} ,imageResize:function (f){var e=c(f);e[_0xc826[476]](_0xc826[489],c[_0xc826[464]](function (){this[_0xc826[544]](false);} ,this));e[_0xc826[476]](_0xc826[1250],c[_0xc826[464]](function (){this[_0xc826[324]][_0xc826[476]](_0xc826[1251],c[_0xc826[464]](function (){setTimeout(c[_0xc826[464]](function (){this[_0xc826[608]]();this[_0xc826[324]][_0xc826[315]](_0xc826[1251]);this[_0xc826[357]]();} ,this),1);} ,this));} ,this));e[_0xc826[476]](_0xc826[731],c[_0xc826[464]](function (l){if(this[_0xc826[324]][_0xc826[365]](_0xc826[1240])[_0xc826[493]]()!=0){return false;} ;var n=false,q,p,m=e[_0xc826[201]]()/e[_0xc826[198]](),o=20,j=10;var g=this[_0xc826[1252]](e);var h=false;g[_0xc826[476]](_0xc826[489],function (r){h=true;r[_0xc826[503]]();m=e[_0xc826[201]]()/e[_0xc826[198]]();q=Math[_0xc826[1254]](r[_0xc826[1253]]-e[_0xc826[1135]](0)[_0xc826[697]]()[_0xc826[699]]);p=Math[_0xc826[1254]](r[_0xc826[1255]]-e[_0xc826[1135]](0)[_0xc826[697]]()[_0xc826[696]]);} );c(this[_0xc826[208]][_0xc826[65]])[_0xc826[476]](_0xc826[1256],c[_0xc826[464]](function (v){if(h){var s=Math[_0xc826[1254]](v[_0xc826[1253]]-e[_0xc826[1135]](0)[_0xc826[697]]()[_0xc826[699]])-q;var r=Math[_0xc826[1254]](v[_0xc826[1255]]-e[_0xc826[1135]](0)[_0xc826[697]]()[_0xc826[696]])-p;var u=e[_0xc826[198]]();var w=parseInt(u,10)+r;var t=Math[_0xc826[1254]](w*m);if(t>o){e[_0xc826[201]](t);if(t<100){this[_0xc826[1261]][_0xc826[199]]({marginTop:_0xc826[1257],marginLeft:_0xc826[1258],fontSize:_0xc826[1259],padding:_0xc826[1260]});} else {this[_0xc826[1261]][_0xc826[199]]({marginTop:_0xc826[1262],marginLeft:_0xc826[1263],fontSize:_0xc826[1264],padding:_0xc826[1265]});} ;} ;q=Math[_0xc826[1254]](v[_0xc826[1253]]-e[_0xc826[1135]](0)[_0xc826[697]]()[_0xc826[699]]);p=Math[_0xc826[1254]](v[_0xc826[1255]]-e[_0xc826[1135]](0)[_0xc826[697]]()[_0xc826[696]]);this[_0xc826[357]]();} ;} ,this))[_0xc826[476]](_0xc826[709],function (){h=false;} );this[_0xc826[324]][_0xc826[476]](_0xc826[1249],c[_0xc826[464]](function (s){var r=s[_0xc826[537]];if(this[_0xc826[546]][_0xc826[580]]==r||this[_0xc826[546]][_0xc826[602]]==r){this[_0xc826[507]](false,false);this[_0xc826[544]](false);this[_0xc826[1229]](e);} ;} ,this));c(document)[_0xc826[476]](_0xc826[1248],c[_0xc826[464]](this[_0xc826[544]],this));this[_0xc826[324]][_0xc826[476]](_0xc826[1248],c[_0xc826[464]](this[_0xc826[544]],this));} ,this));} ,imageResizeControls:function (f){var g=c(_0xc826[1266]);g[_0xc826[199]]({position:_0xc826[707],display:_0xc826[1267],lineHeight:0,outline:_0xc826[1268],"\x66\x6C\x6F\x61\x74":f[_0xc826[199]](_0xc826[1226])});g[_0xc826[341]](_0xc826[325],false);if(f[0][_0xc826[68]][_0xc826[1246]]!=_0xc826[529]){g[_0xc826[199]]({marginTop:f[0][_0xc826[68]][_0xc826[1242]],marginBottom:f[0][_0xc826[68]][_0xc826[1243]],marginLeft:f[0][_0xc826[68]][_0xc826[1244]],marginRight:f[0][_0xc826[68]][_0xc826[1245]]});f[_0xc826[199]](_0xc826[1246],_0xc826[331]);} else {g[_0xc826[199]]({display:_0xc826[1225],margin:_0xc826[529]});} ;f[_0xc826[199]](_0xc826[1247],0.5)[_0xc826[320]](g);this[_0xc826[1261]]=c(_0xc826[1269]+this[_0xc826[25]][_0xc826[242]][_0xc826[1088]]+_0xc826[413]);this[_0xc826[1261]][_0xc826[199]]({position:_0xc826[739],zIndex:5,top:_0xc826[1270],left:_0xc826[1270],marginTop:_0xc826[1262],marginLeft:_0xc826[1263],lineHeight:1,backgroundColor:_0xc826[1271],color:_0xc826[1272],fontSize:_0xc826[1264],padding:_0xc826[1265],cursor:_0xc826[1273]});this[_0xc826[1261]][_0xc826[341]](_0xc826[325],false);this[_0xc826[1261]][_0xc826[476]](_0xc826[731],c[_0xc826[464]](function (){this[_0xc826[1274]](f);} ,this));g[_0xc826[435]](this[_0xc826[1261]]);var e=c(_0xc826[1275]);e[_0xc826[199]]({position:_0xc826[739],zIndex:2,lineHeight:1,cursor:_0xc826[1276],bottom:_0xc826[1277],right:_0xc826[1278],border:_0xc826[1279],backgroundColor:_0xc826[1271],width:_0xc826[1280],height:_0xc826[1280]});e[_0xc826[341]](_0xc826[325],false);g[_0xc826[435]](e);g[_0xc826[435]](f);return e;} ,imageThumbClick:function (h){var f=_0xc826[1281]+c(h[_0xc826[488]])[_0xc826[341]](_0xc826[1282])+_0xc826[1283]+c(h[_0xc826[488]])[_0xc826[341]](_0xc826[729])+_0xc826[624];var g=this[_0xc826[540]]();if(this[_0xc826[25]][_0xc826[205]]&&c(g)[_0xc826[722]](_0xc826[102])[_0xc826[493]]()==0){f=_0xc826[571]+f+_0xc826[573];} ;this[_0xc826[1284]](f,true);} ,imageCallbackLink:function (){var f=c(_0xc826[1219])[_0xc826[323]]();if(f!==_0xc826[331]){var e=_0xc826[1281]+f+_0xc826[624];if(this[_0xc826[25]][_0xc826[204]]===false){e=_0xc826[571]+e+_0xc826[573];} ;this[_0xc826[1284]](e,true);} else {this[_0xc826[1130]]();} ;} ,imageCallback:function (e){this[_0xc826[1284]](e);} ,imageInsert:function (f,h){this[_0xc826[526]]();if(f!==false){var e=_0xc826[331];if(h!==true){e=_0xc826[1281]+f[_0xc826[1069]]+_0xc826[624];var g=this[_0xc826[540]]();if(this[_0xc826[25]][_0xc826[205]]&&c(g)[_0xc826[722]](_0xc826[102])[_0xc826[493]]()==0){e=_0xc826[571]+e+_0xc826[573];} ;} else {e=f;} ;this[_0xc826[467]](_0xc826[791],e,false);var j=c(this[_0xc826[324]][_0xc826[365]](_0xc826[1285]));if(j[_0xc826[20]]){j[_0xc826[326]](_0xc826[441]);} else {j=false;} ;this[_0xc826[357]]();h!==true&&this[_0xc826[391]](_0xc826[473],j,f);} ;this[_0xc826[1130]]();this[_0xc826[608]]();} ,modalTemplatesInit:function (){c[_0xc826[194]](this[_0xc826[25]],{modal_file:String()+_0xc826[1286]+this[_0xc826[25]][_0xc826[242]][_0xc826[1187]]+_0xc826[1287]+this[_0xc826[25]][_0xc826[1182]]+_0xc826[1288],modal_image_edit:String()+_0xc826[1289]+this[_0xc826[25]][_0xc826[242]][_0xc826[729]]+_0xc826[1290]+this[_0xc826[25]][_0xc826[242]][_0xc826[47]]+_0xc826[1291]+this[_0xc826[25]][_0xc826[242]][_0xc826[1292]]+_0xc826[1293]+this[_0xc826[25]][_0xc826[242]][_0xc826[1294]]+_0xc826[1295]+this[_0xc826[25]][_0xc826[242]][_0xc826[1227]]+_0xc826[1296]+this[_0xc826[25]][_0xc826[242]][_0xc826[699]]+_0xc826[1297]+this[_0xc826[25]][_0xc826[242]][_0xc826[778]]+_0xc826[1298]+this[_0xc826[25]][_0xc826[242]][_0xc826[777]]+_0xc826[1299]+this[_0xc826[25]][_0xc826[242]][_0xc826[1300]]+_0xc826[1301]+this[_0xc826[25]][_0xc826[242]][_0xc826[1302]]+_0xc826[1303]+this[_0xc826[25]][_0xc826[242]][_0xc826[1304]]+_0xc826[1305],modal_image:String()+_0xc826[1306]+this[_0xc826[25]][_0xc826[242]][_0xc826[1307]]+_0xc826[1308]+this[_0xc826[25]][_0xc826[242]][_0xc826[1309]]+_0xc826[1310]+this[_0xc826[25]][_0xc826[242]][_0xc826[47]]+_0xc826[1311]+this[_0xc826[25]][_0xc826[510]]+_0xc826[1312]+this[_0xc826[25]][_0xc826[242]][_0xc826[1313]]+_0xc826[1314]+this[_0xc826[25]][_0xc826[242]][_0xc826[1302]]+_0xc826[1315]+this[_0xc826[25]][_0xc826[242]][_0xc826[1316]]+_0xc826[1305],modal_link:String()+_0xc826[1317]+this[_0xc826[25]][_0xc826[242]][_0xc826[1318]]+_0xc826[1319]+this[_0xc826[25]][_0xc826[242]][_0xc826[582]]+_0xc826[1320]+this[_0xc826[25]][_0xc826[242]][_0xc826[1292]]+_0xc826[1321]+this[_0xc826[25]][_0xc826[242]][_0xc826[582]]+_0xc826[1322]+this[_0xc826[25]][_0xc826[242]][_0xc826[1318]]+_0xc826[1323]+this[_0xc826[25]][_0xc826[242]][_0xc826[582]]+_0xc826[1324]+this[_0xc826[25]][_0xc826[242]][_0xc826[1302]]+_0xc826[1325]+this[_0xc826[25]][_0xc826[242]][_0xc826[1316]]+_0xc826[1305],modal_table:String()+_0xc826[1289]+this[_0xc826[25]][_0xc826[242]][_0xc826[1326]]+_0xc826[1327]+this[_0xc826[25]][_0xc826[242]][_0xc826[1328]]+_0xc826[1329]+this[_0xc826[25]][_0xc826[242]][_0xc826[1302]]+_0xc826[1330]+this[_0xc826[25]][_0xc826[242]][_0xc826[1316]]+_0xc826[1305],modal_video:String()+_0xc826[1331]+this[_0xc826[25]][_0xc826[242]][_0xc826[1332]]+_0xc826[1333]+this[_0xc826[25]][_0xc826[242]][_0xc826[1302]]+_0xc826[1334]+this[_0xc826[25]][_0xc826[242]][_0xc826[1316]]+_0xc826[1305]});} ,modalInit:function (m,h,f,n){var e=c(_0xc826[1335]);if(!e[_0xc826[20]]){this[_0xc826[1336]]=e=c(_0xc826[1337]);c(_0xc826[65])[_0xc826[685]](this.$overlay);} ;if(this[_0xc826[25]][_0xc826[1338]]){e[_0xc826[247]]()[_0xc826[476]](_0xc826[731],c[_0xc826[464]](this[_0xc826[1130]],this));} ;var j=c(_0xc826[1339]);if(!j[_0xc826[20]]){this[_0xc826[1340]]=j=c(_0xc826[1341]);c(_0xc826[65])[_0xc826[435]](this.$modal);} ;c(_0xc826[1342])[_0xc826[476]](_0xc826[731],c[_0xc826[464]](this[_0xc826[1130]],this));this[_0xc826[1343]]=c[_0xc826[464]](function (o){if(o[_0xc826[546]]===this[_0xc826[546]][_0xc826[718]]){this[_0xc826[1130]]();return false;} ;} ,this);c(document)[_0xc826[604]](this[_0xc826[1343]]);this[_0xc826[324]][_0xc826[604]](this[_0xc826[1343]]);this[_0xc826[1344]]=false;if(h[_0xc826[506]](_0xc826[1061])==0){this[_0xc826[1344]]=c(h);c(_0xc826[1345])[_0xc826[812]]()[_0xc826[435]](this[_0xc826[1344]][_0xc826[42]]());this[_0xc826[1344]][_0xc826[42]](_0xc826[331]);} else {c(_0xc826[1345])[_0xc826[812]]()[_0xc826[435]](h);} ;j[_0xc826[365]](_0xc826[1346])[_0xc826[42]](m);if( typeof c[_0xc826[7]][_0xc826[1347]]!==_0xc826[12]){j[_0xc826[1347]]({handle:_0xc826[1346]});j[_0xc826[365]](_0xc826[1346])[_0xc826[199]](_0xc826[1348],_0xc826[1349]);} ;var l=c(_0xc826[1148]);if(l[_0xc826[20]]){var g=this;l[_0xc826[365]](_0xc826[689])[_0xc826[19]](function (o,p){o++;c(p)[_0xc826[476]](_0xc826[731],function (r){r[_0xc826[503]]();l[_0xc826[365]](_0xc826[689])[_0xc826[328]](_0xc826[1213]);c(this)[_0xc826[446]](_0xc826[1213]);c(_0xc826[1210])[_0xc826[433]]();c(_0xc826[1350]+o)[_0xc826[247]]();c(_0xc826[1154])[_0xc826[323]](o);if(g[_0xc826[424]]()===false){var q=j[_0xc826[1351]]();j[_0xc826[199]](_0xc826[1352],_0xc826[1353]+(q+10)/2+_0xc826[451]);} ;} );} );} ;j[_0xc826[365]](_0xc826[1354])[_0xc826[476]](_0xc826[731],c[_0xc826[464]](this[_0xc826[1130]],this));if(this[_0xc826[25]][_0xc826[427]]===true){this[_0xc826[1355]]=this[_0xc826[208]][_0xc826[65]][_0xc826[524]];} else {this[_0xc826[1355]]=this[_0xc826[324]][_0xc826[524]]();} ;if(this[_0xc826[424]]()===false){j[_0xc826[199]]({position:_0xc826[702],top:_0xc826[1356],left:_0xc826[1270],width:f+_0xc826[451],marginLeft:_0xc826[1353]+(f+60)/2+_0xc826[451]})[_0xc826[247]]();this[_0xc826[1357]]=c(document[_0xc826[65]])[_0xc826[199]](_0xc826[1358]);c(document[_0xc826[65]])[_0xc826[199]](_0xc826[1358],_0xc826[706]);} else {j[_0xc826[199]]({position:_0xc826[702],width:_0xc826[698],height:_0xc826[698],top:_0xc826[1359],left:_0xc826[1359],margin:_0xc826[1359],minHeight:_0xc826[1360]})[_0xc826[247]]();} ;if( typeof n===_0xc826[1361]){n();} ;c(document)[_0xc826[315]](_0xc826[1362]);if(this[_0xc826[424]]()===false){setTimeout(function (){var o=j[_0xc826[1351]]();j[_0xc826[199]]({top:_0xc826[1270],height:_0xc826[529],minHeight:_0xc826[529],marginTop:_0xc826[1353]+(o+10)/2+_0xc826[451]});} ,10);} ;} ,modalClose:function (){c(_0xc826[1342])[_0xc826[315]](_0xc826[731],this[_0xc826[1130]]);c(_0xc826[1339])[_0xc826[720]](_0xc826[1363],c[_0xc826[464]](function (){var e=c(_0xc826[1345]);if(this[_0xc826[1344]]!==false){this[_0xc826[1344]][_0xc826[42]](e[_0xc826[42]]());this[_0xc826[1344]]=false;} ;e[_0xc826[42]](_0xc826[331]);if(this[_0xc826[25]][_0xc826[1338]]){c(_0xc826[1335])[_0xc826[433]]()[_0xc826[315]](_0xc826[731],this[_0xc826[1130]]);} ;c(document)[_0xc826[1364]](_0xc826[604],this[_0xc826[1343]]);this[_0xc826[324]][_0xc826[1364]](_0xc826[604],this[_0xc826[1343]]);this[_0xc826[526]]();if(this[_0xc826[25]][_0xc826[427]]&&this[_0xc826[1355]]){c(this[_0xc826[208]][_0xc826[65]])[_0xc826[524]](this[_0xc826[1355]]);} else {if(this[_0xc826[25]][_0xc826[427]]===false&&this[_0xc826[1355]]){this[_0xc826[324]][_0xc826[524]](this[_0xc826[1355]]);} ;} ;} ,this));if(this[_0xc826[424]]()===false){c(document[_0xc826[65]])[_0xc826[199]](_0xc826[1358],this[_0xc826[1357]]?this[_0xc826[1357]]:_0xc826[705]);} ;return false;} ,modalSetTab:function (e){c(_0xc826[1210])[_0xc826[433]]();c(_0xc826[1148])[_0xc826[365]](_0xc826[689])[_0xc826[328]](_0xc826[1213])[_0xc826[1135]](e-1)[_0xc826[446]](_0xc826[1213]);c(_0xc826[1350]+e)[_0xc826[247]]();} ,s3handleFileSelect:function (l){var h=l[_0xc826[488]][_0xc826[502]];for(var g=0,j;j=h[g];g++){this[_0xc826[512]](j);} ;} ,s3uploadFile:function (e){this[_0xc826[1366]](e,c[_0xc826[464]](function (f){this[_0xc826[1365]](e,f);} ,this));} ,s3executeOnSignedUrl:function (e,h){var f= new XMLHttpRequest();var g=_0xc826[955];if(this[_0xc826[25]][_0xc826[509]][_0xc826[585]](/\?/)!=_0xc826[234]){g=_0xc826[415];} ;f[_0xc826[362]](_0xc826[1367],this[_0xc826[25]][_0xc826[509]]+g+_0xc826[1368]+e[_0xc826[440]]+_0xc826[1369]+e[_0xc826[505]],true);if(f[_0xc826[1370]]){f[_0xc826[1370]](_0xc826[1371]);} ;f[_0xc826[1372]]=function (j){if(this[_0xc826[1373]]==4&&this[_0xc826[1374]]==200){c(_0xc826[1376])[_0xc826[1375]]();h(decodeURIComponent(this[_0xc826[1377]]));} else {if(this[_0xc826[1373]]==4&&this[_0xc826[1374]]!=200){} ;} ;} ;f[_0xc826[1378]]();} ,s3createCORSRequest:function (g,e){var f= new XMLHttpRequest();if(_0xc826[1379] in f){f[_0xc826[362]](g,e,true);} else {if( typeof XDomainRequest!=_0xc826[12]){f= new XDomainRequest();f[_0xc826[362]](g,e);} else {f=null;} ;} ;return f;} ,s3uploadToS3:function (f,e){var g=this[_0xc826[1381]](_0xc826[1380],e);if(!g){} else {g[_0xc826[534]]=c[_0xc826[464]](function (){if(g[_0xc826[1374]]==200){c(_0xc826[1382])[_0xc826[433]]();var l=e[_0xc826[443]](_0xc826[955]);if(!l[0]){return false;} ;this[_0xc826[526]]();var h=_0xc826[331];h=_0xc826[1281]+l[0]+_0xc826[624];if(this[_0xc826[25]][_0xc826[205]]){h=_0xc826[571]+h+_0xc826[573];} ;this[_0xc826[467]](_0xc826[791],h,false);var j=c(this[_0xc826[324]][_0xc826[365]](_0xc826[1285]));if(j[_0xc826[20]]){j[_0xc826[326]](_0xc826[441]);} else {j=false;} ;this[_0xc826[357]]();this[_0xc826[391]](_0xc826[473],j,false);this[_0xc826[1130]]();this[_0xc826[608]]();} else {} ;} ,this);g[_0xc826[1383]]=function (){} ;g[_0xc826[1307]][_0xc826[1384]]=function (h){} ;g[_0xc826[1386]](_0xc826[1385],f[_0xc826[505]]);g[_0xc826[1386]](_0xc826[1387],_0xc826[1388]);g[_0xc826[1378]](f);} ;} ,uploadInit:function (g,e){this[_0xc826[1389]]={url:false,success:false,error:false,start:false,trigger:false,auto:false,input:false};c[_0xc826[194]](this[_0xc826[1389]],e);var f=c(_0xc826[1061]+g);if(f[_0xc826[20]]&&f[0][_0xc826[370]]===_0xc826[1390]){this[_0xc826[1389]][_0xc826[387]]=f;this[_0xc826[1391]]=c(f[0][_0xc826[109]]);} else {this[_0xc826[1391]]=f;} ;this[_0xc826[1392]]=this[_0xc826[1391]][_0xc826[341]](_0xc826[1393]);if(this[_0xc826[1389]][_0xc826[529]]){c(this[_0xc826[1389]][_0xc826[387]])[_0xc826[393]](c[_0xc826[464]](function (h){this[_0xc826[1391]][_0xc826[1394]](function (j){return false;} );this[_0xc826[1395]](h);} ,this));} else {if(this[_0xc826[1389]][_0xc826[1396]]){c(_0xc826[1061]+this[_0xc826[1389]][_0xc826[1396]])[_0xc826[731]](c[_0xc826[464]](this[_0xc826[1395]],this));} ;} ;} ,uploadSubmit:function (f){c(_0xc826[1376])[_0xc826[1375]]();this[_0xc826[1399]](this[_0xc826[1397]],this[_0xc826[1398]]());} ,uploadFrame:function (){this[_0xc826[441]]=_0xc826[1400]+Math[_0xc826[1126]](Math[_0xc826[1125]]()*99999);var f=this[_0xc826[208]][_0xc826[562]](_0xc826[106]);var e=_0xc826[1401]+this[_0xc826[441]]+_0xc826[1402]+this[_0xc826[441]]+_0xc826[1403];f[_0xc826[783]]=e;c(f)[_0xc826[756]](_0xc826[65]);if(this[_0xc826[1389]][_0xc826[195]]){this[_0xc826[1389]][_0xc826[195]]();} ;c(_0xc826[1061]+this[_0xc826[441]])[_0xc826[614]](c[_0xc826[464]](this[_0xc826[1404]],this));return this[_0xc826[441]];} ,uploadForm:function (j,h){if(this[_0xc826[1389]][_0xc826[387]]){var l=_0xc826[1405]+this[_0xc826[441]],e=_0xc826[1406]+this[_0xc826[441]];this[_0xc826[109]]=c(_0xc826[1407]+this[_0xc826[1389]][_0xc826[1408]]+_0xc826[1409]+h+_0xc826[1402]+l+_0xc826[1410]+l+_0xc826[1411]);if(this[_0xc826[25]][_0xc826[1059]]!==false&& typeof this[_0xc826[25]][_0xc826[1059]]===_0xc826[1060]){c[_0xc826[19]](this[_0xc826[25]][_0xc826[1059]],c[_0xc826[464]](function (n,f){if(f!=null&&f.toString()[_0xc826[506]](_0xc826[1061])===0){f=c(f)[_0xc826[323]]();} ;var o=c(_0xc826[1412],{type:_0xc826[706],name:n,value:f});c(this[_0xc826[109]])[_0xc826[435]](o);} ,this));} ;var g=this[_0xc826[1389]][_0xc826[387]];var m=c(g)[_0xc826[594]]();c(g)[_0xc826[341]](_0xc826[441],e)[_0xc826[768]](m)[_0xc826[756]](this[_0xc826[109]]);c(this[_0xc826[109]])[_0xc826[199]](_0xc826[714],_0xc826[739])[_0xc826[199]](_0xc826[696],_0xc826[1356])[_0xc826[199]](_0xc826[699],_0xc826[1356])[_0xc826[756]](_0xc826[65]);this[_0xc826[109]][_0xc826[1394]]();} else {j[_0xc826[341]](_0xc826[488],h)[_0xc826[341]](_0xc826[1415],_0xc826[1416])[_0xc826[341]](_0xc826[1413],_0xc826[1414])[_0xc826[341]](_0xc826[1393],this[_0xc826[1389]][_0xc826[1408]]);this[_0xc826[1397]][_0xc826[1394]]();} ;} ,uploadLoaded:function (){var h=c(_0xc826[1061]+this[_0xc826[441]])[0],j;if(h[_0xc826[1417]]){j=h[_0xc826[1417]];} else {if(h[_0xc826[618]]){j=h[_0xc826[618]][_0xc826[208]];} else {j=window[_0xc826[1418]][this[_0xc826[441]]][_0xc826[208]];} ;} ;if(this[_0xc826[1389]][_0xc826[1419]]){c(_0xc826[1376])[_0xc826[433]]();if( typeof j!==_0xc826[12]){var g=j[_0xc826[65]][_0xc826[783]];var f=g[_0xc826[592]](/\{(.|\n)*\}/)[0];f=f[_0xc826[343]](/^\[/,_0xc826[331]);f=f[_0xc826[343]](/\]$/,_0xc826[331]);var e=c[_0xc826[1068]](f);if( typeof e[_0xc826[18]]==_0xc826[12]){this[_0xc826[1389]][_0xc826[1419]](e);} else {this[_0xc826[1389]][_0xc826[18]](this,e);this[_0xc826[1130]]();} ;} else {this[_0xc826[1130]]();alert(_0xc826[1420]);} ;} ;this[_0xc826[1391]][_0xc826[341]](_0xc826[1393],this[_0xc826[1392]]);this[_0xc826[1391]][_0xc826[341]](_0xc826[488],_0xc826[331]);} ,draguploadInit:function (f,e){this[_0xc826[1421]]=c[_0xc826[194]]({url:false,success:false,error:false,preview:false,uploadFields:false,text:this[_0xc826[25]][_0xc826[242]][_0xc826[1422]],atext:this[_0xc826[25]][_0xc826[242]][_0xc826[1423]],uploadParam:false},e);if(window[_0xc826[500]]===undefined){return false;} ;this[_0xc826[1424]]=c(_0xc826[1425]);this[_0xc826[1426]]=c(_0xc826[1427]+this[_0xc826[1421]][_0xc826[582]]+_0xc826[1428]);this[_0xc826[1429]]=c(_0xc826[1430]+this[_0xc826[1421]][_0xc826[1431]]+_0xc826[1428]);this[_0xc826[1424]][_0xc826[435]](this[_0xc826[1426]]);c(f)[_0xc826[768]](this[_0xc826[1424]]);c(f)[_0xc826[768]](this[_0xc826[1429]]);this[_0xc826[1426]][_0xc826[476]](_0xc826[1432],c[_0xc826[464]](function (){return this[_0xc826[1433]]();} ,this));this[_0xc826[1426]][_0xc826[476]](_0xc826[1434],c[_0xc826[464]](function (){return this[_0xc826[1435]]();} ,this));this[_0xc826[1426]][_0xc826[318]](0)[_0xc826[1436]]=c[_0xc826[464]](function (g){g[_0xc826[503]]();this[_0xc826[1426]][_0xc826[328]](_0xc826[1438])[_0xc826[446]](_0xc826[1437]);this[_0xc826[511]](this[_0xc826[1421]][_0xc826[1408]],g[_0xc826[501]][_0xc826[502]][0],false,false,false,this[_0xc826[1421]][_0xc826[1439]]);} ,this);} ,dragUploadAjax:function (h,l,f,g,n,m){if(!f){var o=c[_0xc826[1441]][_0xc826[1440]]();if(o[_0xc826[1307]]){o[_0xc826[1307]][_0xc826[1444]](_0xc826[1442],c[_0xc826[464]](this[_0xc826[1443]],this),false);} ;c[_0xc826[1445]]({xhr:function (){return o;} });} ;var j= new FormData();if(m!==false){j[_0xc826[435]](m,l);} else {j[_0xc826[435]](_0xc826[30],l);} ;if(this[_0xc826[25]][_0xc826[1059]]!==false&& typeof this[_0xc826[25]][_0xc826[1059]]===_0xc826[1060]){c[_0xc826[19]](this[_0xc826[25]][_0xc826[1059]],c[_0xc826[464]](function (p,e){if(e!=null&&e.toString()[_0xc826[506]](_0xc826[1061])===0){e=c(e)[_0xc826[323]]();} ;j[_0xc826[435]](p,e);} ,this));} ;c[_0xc826[669]]({url:h,dataType:_0xc826[42],data:j,cache:false,contentType:false,processData:false,type:_0xc826[1416],success:c[_0xc826[464]](function (q){q=q[_0xc826[343]](/^\[/,_0xc826[331]);q=q[_0xc826[343]](/\]$/,_0xc826[331]);var p=( typeof q===_0xc826[10]?c[_0xc826[1068]](q):q);if(f){g[_0xc826[720]](_0xc826[1446],function (){c(this)[_0xc826[322]]();} );var e=c(_0xc826[1447]);e[_0xc826[341]](_0xc826[359],p[_0xc826[1069]])[_0xc826[341]](_0xc826[441],_0xc826[1448]);this[_0xc826[1449]](n,e[0]);var r=c(this[_0xc826[324]][_0xc826[365]](_0xc826[1450]));if(r[_0xc826[20]]){r[_0xc826[326]](_0xc826[441]);} else {r=false;} ;this[_0xc826[357]]();this[_0xc826[608]]();if(r){this[_0xc826[391]](_0xc826[473],r,p);} ;if( typeof p[_0xc826[18]]!==_0xc826[12]){this[_0xc826[391]](_0xc826[1207],p);} ;} else {if( typeof p[_0xc826[18]]==_0xc826[12]){this[_0xc826[1421]][_0xc826[1419]](p);} else {this[_0xc826[1421]][_0xc826[18]](this,p);this[_0xc826[1421]][_0xc826[1419]](false);} ;} ;} ,this)});} ,draguploadOndrag:function (){this[_0xc826[1426]][_0xc826[446]](_0xc826[1438]);return false;} ,draguploadOndragleave:function (){this[_0xc826[1426]][_0xc826[328]](_0xc826[1438]);return false;} ,uploadProgress:function (g,h){var f=g[_0xc826[1451]]?parseInt(g[_0xc826[1451]]/g[_0xc826[1452]]*100,10):g;this[_0xc826[1426]][_0xc826[582]](_0xc826[1453]+f+_0xc826[1454]+(h||_0xc826[331]));} ,isMobile:function (){return /(iPhone|iPod|BlackBerry|Android)/[_0xc826[569]](navigator[_0xc826[515]]);} ,isIPad:function (){return /iPad/[_0xc826[569]](navigator[_0xc826[515]]);} ,normalize:function (e){if( typeof (e)===_0xc826[12]){return 0;} ;return parseInt(e[_0xc826[343]](_0xc826[451],_0xc826[331]),10);} ,outerHtml:function (e){return c(_0xc826[960])[_0xc826[435]](c(e)[_0xc826[1135]](0)[_0xc826[594]]())[_0xc826[42]]();} ,isString:function (e){return Object[_0xc826[5]][_0xc826[1455]][_0xc826[8]](e)==_0xc826[1456];} ,isEmpty:function (e){e=e[_0xc826[343]](/&#x200b;|<br>|<br\/>|&nbsp;/gi,_0xc826[331]);e=e[_0xc826[343]](/\s/g,_0xc826[331]);e=e[_0xc826[343]](/^<p>[^\W\w\D\d]*?<\/p>$/i,_0xc826[331]);return e==_0xc826[331];} ,isIe11:function (){return !!navigator[_0xc826[515]][_0xc826[592]](/Trident\/7\./);} ,browser:function (f){var g=navigator[_0xc826[515]][_0xc826[774]]();var e=/(opr)[\/]([\w.]+)/[_0xc826[733]](g)||/(chrome)[ \/]([\w.]+)/[_0xc826[733]](g)||/(webkit)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/[_0xc826[733]](g)||/(webkit)[ \/]([\w.]+)/[_0xc826[733]](g)||/(opera)(?:.*version|)[ \/]([\w.]+)/[_0xc826[733]](g)||/(msie) ([\w.]+)/[_0xc826[733]](g)||g[_0xc826[506]](_0xc826[1457])>=0&&/(rv)(?::| )([\w.]+)/[_0xc826[733]](g)||g[_0xc826[506]](_0xc826[1458])<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/[_0xc826[733]](g)||[];if(f==_0xc826[517]){return e[2];} ;if(f==_0xc826[513]){return (e[1]==_0xc826[1189]||e[1]==_0xc826[513]);} ;if(e[1]==_0xc826[1459]){return f==_0xc826[237];} ;if(e[1]==_0xc826[1460]){return f==_0xc826[513];} ;return f==e[1];} ,oldIE:function (){if(this[_0xc826[238]](_0xc826[237])&&parseInt(this[_0xc826[238]](_0xc826[517]),10)<9){return true;} ;return false;} ,getFragmentHtml:function (f){var e=f[_0xc826[1461]](true);var g=this[_0xc826[208]][_0xc826[562]](_0xc826[106]);g[_0xc826[785]](e);return g[_0xc826[783]];} ,extractContent:function (){var e=this[_0xc826[324]][0];var g=this[_0xc826[208]][_0xc826[784]]();var f;while((f=e[_0xc826[786]])){g[_0xc826[785]](f);} ;return g;} ,isParentRedactor:function (e){if(!e){return false;} ;if(this[_0xc826[25]][_0xc826[203]]){return e;} ;if(c(e)[_0xc826[495]](_0xc826[1099])[_0xc826[20]]==0||c(e)[_0xc826[492]](_0xc826[329])){return false;} else {return e;} ;} ,currentOrParentIs:function (e){var f=this[_0xc826[540]](),g=this[_0xc826[541]]();return f&&f[_0xc826[370]]===e?f:g&&g[_0xc826[370]]===e?g:false;} ,isEndOfElement:function (){var f=this[_0xc826[542]]();var h=this[_0xc826[1462]](f);var g=c[_0xc826[382]](c(f)[_0xc826[582]]())[_0xc826[343]](/\n\r\n/g,_0xc826[331]);var e=g[_0xc826[20]];if(h==e){return true;} else {return false;} ;} ,isFocused:function (){var e,f=this[_0xc826[651]]();if(f&&f[_0xc826[781]]&&f[_0xc826[781]]>0){e=f[_0xc826[780]](0)[_0xc826[977]];} ;if(!e){return false;} ;if(this[_0xc826[25]][_0xc826[203]]){if(this[_0xc826[1463]]()[_0xc826[4]]()){return !this[_0xc826[324]][_0xc826[992]](e);} else {return true;} ;} ;return c(e)[_0xc826[722]](_0xc826[1099])[_0xc826[20]]!=0;} ,removeEmptyAttr:function (f,e){if(c(f)[_0xc826[341]](e)==_0xc826[331]){c(f)[_0xc826[326]](e);} ;} ,removeFromArrayByValue:function (g,f){var e=null;while((e=g[_0xc826[506]](f))!==-1){g[_0xc826[236]](e,1);} ;return g;} };b[_0xc826[5]][_0xc826[21]][_0xc826[5]]=b[_0xc826[5]];c[_0xc826[22]][_0xc826[7]][_0xc826[607]]=function (x,u,m,r,j){var s=/(^|&lt;|\s)(www\..+?\..+?)(\s|&gt;|$)/g,q=/(^|&lt;|\s)(((https?|ftp):\/\/|mailto:).+?)(\s|&gt;|$)/g,e=/(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/gi,w=/https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube\.com\S*[^\w\-\s])([\w\-]{11})(?=[^\w\-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig,t=/https?:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/;var v=(this[_0xc826[324]]?this[_0xc826[324]][_0xc826[318]](0):this)[_0xc826[1098]],l=v[_0xc826[20]];while(l--){var h=v[l];if(h[_0xc826[560]]===3){var p=h[_0xc826[591]];if(r&&p){var o=_0xc826[1464],g=_0xc826[1465];if(p[_0xc826[592]](w)){p=p[_0xc826[343]](w,o+_0xc826[1466]+g);c(h)[_0xc826[320]](p)[_0xc826[322]]();} else {if(p[_0xc826[592]](t)){p=p[_0xc826[343]](t,o+_0xc826[1467]+g);c(h)[_0xc826[320]](p)[_0xc826[322]]();} ;} ;} ;if(m&&p&&p[_0xc826[592]](e)){p=p[_0xc826[343]](e,_0xc826[1468]);c(h)[_0xc826[320]](p)[_0xc826[322]]();} ;if(u&&p&&(p[_0xc826[592]](s)||p[_0xc826[592]](q))){var f=(p[_0xc826[592]](s)||p[_0xc826[592]](q));f=f[0];if(f[_0xc826[20]]>j){f=f[_0xc826[666]](0,j)+_0xc826[1084];} ;p=p[_0xc826[343]](/&/g,_0xc826[936])[_0xc826[343]](/</g,_0xc826[935])[_0xc826[343]](/>/g,_0xc826[934])[_0xc826[343]](s,_0xc826[1471]+x+_0xc826[1472]+c[_0xc826[382]](f)+_0xc826[1473])[_0xc826[343]](q,_0xc826[1469]+c[_0xc826[382]](f)+_0xc826[1470]);c(h)[_0xc826[320]](p)[_0xc826[322]]();} ;} else {if(h[_0xc826[560]]===1&&!/^(a|button|textarea)$/i[_0xc826[569]](h[_0xc826[370]])){c[_0xc826[22]][_0xc826[7]][_0xc826[607]][_0xc826[8]](h,x,u,m,r,j);} ;} ;} ;} ;} )(jQuery);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//




$(function(){
	$('input[type="submit"]').click(function(){
		$(this).button('loading');
	});
	$('a[data-confirm]').click(function(e) {
		var href = $(this).attr('href');
		var data = $(this).data;

		if (!$('#dataConfirmModal').length) {
			$('body').append('<div id="dataConfirmModal" data-backdrop=false class="modal" role="dialog" aria-labelledby="dataConfirmLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h3 id="dataConfirmLabel">Please Confirm</h3></div><div class="modal-body"></div><div class="modal-footer"><button class="btn btn-default" data-dismiss="modal" aria-hidden="true">Cancel</button><a class="btn btn-primary" id="dataConfirmOK">OK</a></div></div></div></div>');
		} 
		$('#dataConfirmModal').find('.modal-body').text($(this).attr('data-confirm'));
		$('#dataConfirmOK').attr('href', href);
		if ($(this).data('method') == 'delete')	{
			$('#dataConfirmOK').attr('data-method','delete')
		}
		$('#dataConfirmOK').click(function(){
			$(this).button('loading');
		});
		$('#dataConfirmModal').modal({show:true});
		return false;
	});
	$('[data-toggle="popover"]').popover();
	$('#action_menu').prepend($('#temp_menu').html());
	$('[title]').tooltip({html: 'true', placement: 'auto'});
	$('body').scrollspy({ target: '.bs-docs-sidebar', offset: 150});
	$('body').on('click', function (e) {
		$('[data-toggle="popover"]').each(function () {
			if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
				$(this).popover('hide');
			}
		});
	});
	$(window).on('resize', function(){
		  $('.modal-body').css('max-height',($(window).height() - 180)+"px");
	});
//	$('.modal').on('show.bs.modal', function (e) {
//	  $(this).spin();
//	}).on('loaded.bs.modal', function (e) {
//	  $(this).spin(false);
//	})

	//hide ad on small screens when virtual keyboard active
	$('input').focus(function(){
		if ($('#mobile_ad').is(":visible")){
			$('#mobile_ad').removeClass('visible-xs');
			$('#mobile_ad').hide();
		}
	});

	//submit search on enter
	$(document).keypress(function(e) {
	  if(e.which == 13) {
		if ($('#search_box').is(":focus")){
			$('#search_submit').click();
			return false;
		}
	  }
	});

	// Google+ Button
	var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
	po.src = 'https://apis.google.com/js/platform.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);

	//iOS modal form fix
	if( navigator.userAgent.match(/iPhone|iPad|iPod/i) ) {
		$('.modal').on('show.bs.modal', function() {
			$(this)
				.css({
					position: 'absolute',
					marginTop: $(window).scrollTop() + 'px',
					bottom: 'auto'
				});
			setTimeout( function() {
				$('.modal-backdrop').css({
					position: 'absolute', 
					top: 0, 
					left: 0,
					width: '100%',
					height: Math.max(
						document.body.scrollHeight, document.documentElement.scrollHeight,
						document.body.offsetHeight, document.documentElement.offsetHeight,
						document.body.clientHeight, document.documentElement.clientHeight
					) + 'px'
				});
			}, 0);
		});
	}

	$('.redactor').redactor({allowedTags: ['p', 'b', 'i'],buttons:['bold', 'italic']});
});



function localize(t)
{
  var d=new Date(t+" UTC");
  document.write(d.toString());
}
;
