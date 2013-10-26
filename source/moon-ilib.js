(function() {
	window.moon = window.moon || {};
	if (window.ilib) {
		moon.$L = (function() {
			var lfunc = function (string) {
				if (!moon.$L.rb) {
					return string;
				}
				var str = moon.$L.rb.getString(string);
				return str.toString();
			};
			lfunc.rb = new ilib.ResBundle({
				loadParams: {
					root: "$lib/moonstone/resources"
				}
			});
			return lfunc;
		})();
	} else {
		moon.$L = $L || function(s) { return s; };
	}
})();
