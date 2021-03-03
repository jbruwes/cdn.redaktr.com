(function($) {
	"use strict";
	$.extend($, {
		rhashcalc: function(pathname) {
			//return decodeURIComponent(window.location.pathname).replace(new RegExp('^' + pathname), '').replace(/\_/g, " ").replace(/\%2f/g, "/").replace(/\%2F/g, "/").replace(/\/+/g, "/").replace(/^\/|\/$/g, "");
			return decodeURIComponent(window.location.pathname).replace(new RegExp('^' + pathname), '').replace(/\_/g, " ").replace(/\%2f/g, "/").replace(/\%2F/g, "/").replace(/\/+/g, "/").replace(/^\/+|\/+$/g, '');
		}
	});
}($));