(function (enyo, scope) {

	var defaultThemeName = 'dark';

	/**
	* {@link moon.Theme}, which extends {@link enyo.Component}, is
	* a runtime theme switcher.
	*
	* ```
	* enyo.kind({
	*	name: 'app',
	*	components: [
	*		{kind: 'moon.Theme', theme: 'light'},
	*		{kind: ...}
	*	]
	* });
	* ```
	*
	* @class moon.Theme
	* @extends enyo.Component
	* @public
	*/
	enyo.kind(
		/** @lends moon.Theme.prototype */ {

		/**
		* @private
		*/
		name: 'moon.Theme',

		/**
		* @private
		*/
		kind: 'enyo.Component',

		/**
		* @private
		*/
		themes: {
			'dark': 'moonstone.css',
			'light': 'moonstone-light.css'
		},

		/**
		* @lends moon.Theme.prototype
		* @private
		*/
		published: {
			theme: defaultThemeName
		},

		/**
		* @method
		* @private
		*/
		constructed: function () {
			this.themeChanged(defaultThemeName, this.theme);
			this.inherited(arguments);
		},

		/**
		* @method
		* @private
		*/
		themeChanged: function(from, to) {
			if (from == to) return;

			var themes = this.get('themes'),
				currentCssFile = themes[from],
				targetCssFile = themes[to];

			if (!currentCssFile || !targetCssFile) return;
			this.changeLink(currentCssFile, targetCssFile);
		},

		/**
		* @method
		* @private
		*/
		changeLink: function(from, to) {
			if (from == to) return;

			var i, cs = document.getElementsByTagName('link');

			for (i = 0; i < cs.length; i++) {
				if (cs[i].href.indexOf(from) > 0) {
					cs[i].href = cs[i].href.replace(from, to);
					break;
				}
			}
		}
	});

})(enyo, this);
