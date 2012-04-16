function time() {
	return ( new Date() ).getTime() / 1000;
}

// Set up namespace to which we'll bind functions
window.Humanize = {}

/*!
PHP-inspired helper functions
/**/
function date (format, timestamp) {
	// Format a local date/time  
	// 
	// version: 1109.2015
	// discuss at: http://phpjs.org/functions/date
	var that = this,
		jsdate, f, formatChr = /\\?([a-z])/gi,
		formatChrCb,
		// Keep this here (works, but for code commented-out
		// below for file size reasons)
		//, tal= [],
		_pad = function (n, c) {
			if ((n = n + '').length < c) {
				return new Array((++c) - n.length).join('0') + n;
			}
			return n;
		},
		txt_words = ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	formatChrCb = function (t, s) {
		return f[t] ? f[t]() : s;
	};
	f = {
		// Day
		d: function () { // Day of month w/leading 0; 01..31
			return _pad(f.j(), 2);
		},
		D: function () { // Shorthand day name; Mon…Sun
			return f.l().slice(0, 3);
		},
		j: function () { // Day of month; 1..31
			return jsdate.getDate();
		},
		l: function () { // Full day name; Monday…Sunday
			return txt_words[f.w()] + 'day';
		},
		N: function () { // ISO-8601 day of week; 1[Mon]..7[Sun]
			return f.w() || 7;
		},
		S: function () { // Ordinal suffix for day of month; st, nd, rd, th
			var j = f.j();
			return j > 4 && j < 21 ? 'th' : {1: 'st', 2: 'nd', 3: 'rd'}[j % 10] || 'th';
		},
		w: function () { // Day of week; 0[Sun]..6[Sat]
			return jsdate.getDay();
		},
		z: function () { // Day of year; 0..365
			var a = new Date(f.Y(), f.n() - 1, f.j()),
				b = new Date(f.Y(), 0, 1);
			return Math.round((a - b) / 864e5) + 1;
		},
 
		// Week
		W: function () { // ISO-8601 week number
			var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3),
				b = new Date(a.getFullYear(), 0, 4);
			return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
		},
 
		// Month
		F: function () { // Full month name; January…December
			return txt_words[6 + f.n()];
		},
		m: function () { // Month w/leading 0; 01…12
			return _pad(f.n(), 2);
		},
		M: function () { // Shorthand month name; Jan…Dec
			return f.F().slice(0, 3);
		},
		n: function () { // Month; 1…12
			return jsdate.getMonth() + 1;
		},
		t: function () { // Days in month; 28…31
			return (new Date(f.Y(), f.n(), 0)).getDate();
		},

		// Year
		L: function () { // Is leap year?; 0 or 1
			return new Date(f.Y(), 1, 29).getMonth() === 1 | 0;
		},
		o: function () { // ISO-8601 year
			var n = f.n(),
				W = f.W(),
				Y = f.Y();
			return Y + (n === 12 && W < 9 ? -1 : n === 1 && W > 9);
		},
		Y: function () { // Full year; e.g. 1980…2010
			return jsdate.getFullYear();
		},
		y: function () { // Last two digits of year; 00…99
			return (f.Y() + "").slice(-2);
		},
 
		// Time
		a: function () { // am or pm
			return jsdate.getHours() > 11 ? "pm" : "am";
		},
		A: function () { // AM or PM
			return f.a().toUpperCase();
		},
		B: function () { // Swatch Internet time; 000..999
			var H = jsdate.getUTCHours() * 36e2,
				// Hours
				i = jsdate.getUTCMinutes() * 60,
				// Minutes
				s = jsdate.getUTCSeconds(); // Seconds
			return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
		},
		g: function () { // 12-Hours; 1..12
			return f.G() % 12 || 12;
		},
		G: function () { // 24-Hours; 0..23
			return jsdate.getHours();
		},
		h: function () { // 12-Hours w/leading 0; 01..12
			return _pad(f.g(), 2);
		},
		H: function () { // 24-Hours w/leading 0; 00..23
			return _pad(f.G(), 2);
		},
		i: function () { // Minutes w/leading 0; 00..59
			return _pad(jsdate.getMinutes(), 2);
		},
		s: function () { // Seconds w/leading 0; 00..59
			return _pad(jsdate.getSeconds(), 2);
		},
		u: function () { // Microseconds; 000000-999000
			return _pad(jsdate.getMilliseconds() * 1000, 6);
		},
		I: function () { // DST observed?; 0 or 1
			// Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
			// If they are not equal, then DST is observed.
			var a = new Date(f.Y(), 0),
				// Jan 1
				c = Date.UTC(f.Y(), 0),
				// Jan 1 UTC
				b = new Date(f.Y(), 6),
				// Jul 1
				d = Date.UTC(f.Y(), 6); // Jul 1 UTC
			return 0 + ((a - c) !== (b - d));
		},
		O: function () { // Difference to GMT in hour format; e.g. +0200
			var tzo = jsdate.getTimezoneOffset(),
				a = Math.abs(tzo);
			return (tzo > 0 ? "-" : "+") + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
		},
		P: function () { // Difference to GMT w/colon; e.g. +02:00
			var O = f.O();
			return (O.substr(0, 3) + ":" + O.substr(3, 2));
		},
		Z: function () { // Timezone offset in seconds (-43200…50400)
			return -jsdate.getTimezoneOffset() * 60;
		},
		// Full Date/Time
		c: function () { // ISO-8601 date.
			return 'Y-m-d\\Th:i:sP'.replace(formatChr, formatChrCb);
		},
		r: function () { // RFC 2822
			return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
		},
		U: function () { // Seconds since UNIX epoch
			return jsdate.getTime() / 1000 | 0;
		}
	};
	this.date = function (format, timestamp) {
		that = this;
		jsdate = ((typeof timestamp === 'undefined') ? new Date() : // Not provided
		(timestamp instanceof Date) ? new Date(timestamp) : // JS Date()
		new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
		);
		return format.replace(formatChr, formatChrCb);
	};
	return this.date(format, timestamp);
}
function number_format( number, decimals, dec_point, thousands_sep ) {
	// http://kevin.vanzonneveld.net
	// +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
	// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +	 bugfix by: Michael White (http://crestidg.com)
	// +	 bugfix by: Benjamin Lupton
	// +	 bugfix by: Allan Jensen (http://www.winternet.no)
	// +	revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)	
	// *	 example 1: number_format(1234.5678, 2, '.', '');
	// *	 returns 1: 1234.57	 
 
	var n = number, c = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals;
	var d = dec_point == undefined ? "," : dec_point;
	var t = thousands_sep == undefined ? "." : thousands_sep, s = n < 0 ? "-" : "";
	var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
 
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}

/*!
apnumber
For numbers 1-9, returns the number spelled out. Otherwise, returns the number. This follows Associated Press style.

Examples:

1 becomes one.
2 becomes two.
10 becomes 10.
You can pass in either an integer or a string representation of an integer.
/**/
Humanize.apnumber = function( n ) {
	var strings = [ 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine' ];
	var result = strings[ parseInt( n ) -1 ];
	return result !== undefined ? result : n;
};

/*!
intcomma
Converts an integer to a string containing commas every three digits.

Examples:

4500 becomes 4,500.
45000 becomes 45,000.
450000 becomes 450,000.
4500000 becomes 4,500,000.
https://github.com/gburtini/Humanize-PHP/blob/master/Humanize.php
/**/
Humanize.intcomma = function( number, decimals ) {
	decimals = decimals === undefined ? 0 : decimals;
	return number_format( number, decimals, '.', ',' );
};

/*!
intword
Converts a large integer to a friendly text representation. Works best for numbers over 1 million.

Examples:
1000000 becomes 1.0 million.
1200000 becomes 1.2 million.
1200000000 becomes 1.2 billion.
/**/
Humanize.intword = function( number ) {
	number = parseInt( number );
	if( number < 1000000 ) {
		return number;
	} else if( number < 100 ) {
		return Humanize.intcomma(number, 1 );
	} else if( number < 1000 ) {
		return Humanize.intcomma( number / 100, 1 ) + " hundred";
	} else if( number < 100000 ) {
		return Humanize.intcomma( number / 1000.0, 1 ) + " thousand";
	} else if( number < 1000000 ) {
		return Humanize.intcomma( number / 100000.0, 1 ) + " hundred thousand";
	} else if( number < 1000000000 ) {
		return Humanize.intcomma( number / 1000000.0, 1 ) + " million";
	} else if( number < 1000000000000 ) { //senseless on a 32 bit system probably.
		return Humanize.intcomma( number / 1000000000.0, 1 ) + " billion";
	} else if( number < 1000000000000000 ) {
		return Humanize.intcomma( number / 1000000000000.0, 1 ) + " trillion";
	} 
	return "" + number;	// too big.
}


/*!
naturalDay
For dates that are the current day or within one day, return “today”, “tomorrow” or “yesterday”, as appropriate. Otherwise, format the date using the passed in format string.

Argument: Date formatting string as described in the date tag.

Examples (when ‘today’ is 17 Feb 2007):

16 Feb 2007 becomes yesterday.
17 Feb 2007 becomes today.
18 Feb 2007 becomes tomorrow.
Any other day is formatted according to given argument or the DATE_FORMAT setting if no argument is given.
/**/
Humanize.processDate = function( timestamp ) {
	timestamp = timestamp === undefined ? time() : timestamp;
	
	if( parseInt( timestamp ) < 10000 ) {
		// x( date( 'y-m-d h-i-s', Date.parse( timestamp ) / 1000 ) );
		return Date.parse( timestamp ) / 1000;
	}
	return( parseInt( timestamp ) );

};
Humanize.naturalDay = function(timestamp, format) {
	timestamp = Humanize.processDate( timestamp );
	var format = format === undefined ? 'Y-m-d' : format; //'F j, Y'

	var oneday = 60 * 60 * 24;
	var d = new Date();
	
	var today = ( new Date( d.getFullYear(), d.getMonth(), d.getDate() ) ).getTime() / 1000;
	var tomorrow = today + oneday;
	var end_tomorrow = tomorrow + oneday;
	var yesterday = today - oneday;
	
	if( timestamp >= yesterday && timestamp < today ) {
		return "yesterday";
	} else if( timestamp >= today && timestamp < tomorrow ) {
		return "today";
	} else if( timestamp >= tomorrow && timestamp < end_tomorrow ) {
		return "tomorrow";
	} else {
		return date( format, timestamp );
	}
}
/*!
naturaltime
New in Django 1.4: Please see the release notes
For datetime values, returns a string representing how many seconds, minutes or hours ago it was – falling back to a longer date format if the value is more than a day old. In case the datetime value is in the future the return value will automatically use an appropriate phrase.

Examples (when ‘now’ is 17 Feb 2007 16:30:00):

17 Feb 2007 16:30:00 becomes now.
17 Feb 2007 16:29:31 becomes 29 seconds ago.
17 Feb 2007 16:29:00 becomes a minute ago.
17 Feb 2007 16:25:35 becomes 4 minutes ago.
17 Feb 2007 15:30:29 becomes an hour ago.
17 Feb 2007 13:31:29 becomes 2 hours ago.
16 Feb 2007 13:31:29 becomes 1 day ago.
17 Feb 2007 16:30:30 becomes 29 seconds from now.
17 Feb 2007 16:31:00 becomes a minute from now.
17 Feb 2007 16:34:35 becomes 4 minutes from now.
17 Feb 2007 16:30:29 becomes an hour from now.
17 Feb 2007 18:31:29 becomes 2 hours from now.
18 Feb 2007 16:31:29 becomes 1 day from now.
/**/
Humanize.naturalTime = function( timestamp, format ) {
	timestamp = Humanize.processDate( timestamp );
	format = format === undefined ? 'g:ia' : format;
	
	
	var now = time();
	var hour = 60 * 60;
	var seconds, minutes, hours;
	if ( Humanize.naturalDay( timestamp, format ) === 'today' ) {
		var hourago = now - hour;
		var hourfromnow = now + hour;
		// if timestamp passed in was after an hour ago…
		if ( timestamp > hourago ) {
			/*!
			The future
			/**/
			if ( timestamp > now ) {
				seconds = Math.round( timestamp - now );
				minutes = Math.round(seconds/60);
				// if more than 60 minutes ago, report in hours
				if ( minutes > 60 ) {
					hours = Math.round(minutes/60);
					return "in about "+hours+" hours";
				} else if ( ! minutes ) {
					if ( seconds <= 10 ) {
						return "just now"
					} else {
						
						return "in "+seconds+" seconds";
					}
				} else if ( minutes === 1 ) {
					return "in one minute";
				} else {
					return "in "+minutes+" minutes";
				}
			}
			/*!
			The past
			/**/
			seconds = Math.round( now - timestamp );
			minutes = Math.round( seconds / 60 );
			/*! Process minutes */
			if ( ! minutes ) {
				if ( seconds <= 10 ) {
					return "now"
				} else {
					return seconds + " seconds ago";
				}
			} else if ( minutes === 1 ) {
				return "one minute ago";
			} else {
				return minutes+" minutes ago";
			}
		}
	}

	return date( format, timestamp );
};

/*!
ordinal
Converts an integer to its ordinal as a string.

Examples:

1 becomes 1st.
2 becomes 2nd.
3 becomes 3rd.
You can pass in either an integer or a string representation of an integer.
/**/
Humanize.ordinal = function( value ) {
	var number = parseInt( value );
	if( number === 0 ) {
		return value; 	// could be a bad string or just a 0.
	}

	var specialCase = number % 100;
	if ( specialCase === 11 || specialCase === 12 || specialCase === 13) {
		return number + "th";
	}

	var leastSignificant = number % 10;
	var end = '';
	switch( leastSignificant ) {
		case 1:
			end = "st";
		break;
		case 2: 
			end = "nd";
		break;
		case 3:
			end = "rd";
		break;
		default:
			end = "th";
		break;
	}	
	return number + end;
};

/*!
filesizeformat
Formats the value like a 'human-readable' file size (i.e. '13 KB', '4.1 MB', '102 bytes', etc).

For example:

{{ value|filesizeformat }}
If value is 123456789, the output would be 117.7 MB.
/**/
Humanize.filesizeformat = function(filesize) {
	if (filesize >= 1073741824) {
		 filesize = number_format(filesize / 1073741824, 2, '.', '') + ' Gb';
	} else { 
		if (filesize >= 1048576) {
	 		filesize = number_format(filesize / 1048576, 2, '.', '') + ' Mb';
   	} else { 
			if (filesize >= 1024) {
			filesize = number_format(filesize / 1024, 0) + ' Kb';
  		} else {
			filesize = number_format(filesize, 0) + ' bytes';
			};
 		};
	};
	return filesize;
};
/*!
linebreaks
Replaces line breaks in plain text with appropriate HTML; a single newline becomes an HTML line break (<br />) and a new line followed by a blank line becomes a paragraph break (</p>).

For example:

{{ value|linebreaks }}
If value is Joel\nis a slug, the output will be <p>Joel<br />is a slug</p>.
/**/
Humanize.linebreaks = function( str ) {
	str = str.replace( /(\r\n|\n|\r){2}/gm, "</p><p>" );
	str = str.replace( /(\r\n|\n|\r)/gm, "<br />" );
	return '<p>' + str + '</p>';
};
/*!
linebreaksbr
Converts all newlines in a piece of plain text to HTML line breaks (<br />).

For example:

{{ value|linebreaksbr }}
If value is Joel\nis a slug, the output will be Joel<br />is a slug.
/**/
Humanize.linebreaksbr = function( str ) {
	return str.replace( /(\r\n|\n|\r)/gm, "<br />" );
};
/*!
pluralize
Returns a plural suffix if the value is not 1. By default, this suffix is 's'.

Example:

You have {{ num_messages }} message{{ num_messages|pluralize }}.
If num_messages is 1, the output will be You have 1 message. If num_messages is 2 the output will be You have 2 messages.

For words that require a suffix other than 's', you can provide an alternate suffix as a parameter to the filter.

Example:

You have {{ num_walruses }} walrus{{ num_walruses|pluralize:"es" }}.
For words that don't pluralize by simple suffix, you can specify both a singular and plural suffix, separated by a comma.

Example:

You have {{ num_cherries }} cherr{{ num_cherries|pluralize:"y,ies" }}.
/**/
Humanize.pluralize = function( number, suffix1, suffix2 ) {
	var singular = '', plural = 's';
	if ( suffix2 !== undefined ) {
		singular = suffix1;
		plural = suffix2;
	} else if ( suffix1 !== undefined ) {
		plural = suffix1;
	}
	
	return parseInt( number ) === 1 ? singular : plural;
};

/*!
truncatechars
New in Django 1.4: Please see the release notes
Truncates a string if it is longer than the specified number of characters. Truncated strings will end with a translatable ellipsis sequence ("…").

Argument: Number of characters to truncate to

For example:

{{ value|truncatechars:9 }}
If value is "Joel is a slug", the output will be "Joel is …".
/**/
Humanize.truncatechars = function( string, length ) {
	if ( string.length > length ) {
		return string.substr( 0,length -1 ) + '…';
	} else {
		return string;
	}
};
/*!
truncatewords
Truncates a string after a certain number of words.

Argument: Number of words to truncate after

For example:

{{ value|truncatewords:2 }}
If value is "Joel is a slug", the output will be "Joel is …".

Newlines within the string will be removed.
/**/
Humanize.truncatewords = function( string, length ) {
	var array = string.split( ' ' );
	var result = '';
	for ( var i = 0; i < length; i++ ) {
		if ( array[ i ] === undefined) {
			break;
		}
		result += array[ i ];
		result += ' ';
	}
	if ( array.length > length ) {
		result += '…';
	}
	return result;
};
