(function (enyo, scope) {
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
	enyo.kind({
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
			'dark': 'moonstone-dark.css',
			'light': 'moonstone-light.css'
		},

		/**
		* @lends moon.Theme.prototype
		* @private
		*/
		published: {
			theme: null
		},

		/**
		* @method
		* @private
		*/
		constructed: function () {
			this.themeChanged();
			this.inherited(arguments);
		},

		/**
		* @method
		* @private
		*/
		themeChanged: function() {
			var themes = this.get('themes'),
				defaultCssFile = themes['dark'],
				targetCssFile = themes[this.get('theme')];

			if (!defaultCssFile || !targetCssFile) return;
			this.replaceTheme(defaultCssFile, targetCssFile);
		},

		/**
		* @method
		* @private
		*/
		replaceTheme: function(from, to) {
			var cs = document.getElementsByTagName("link");
			for(var i=0; i<cs.length; i++) {
				if (cs[i].href.indexOf(from) > 0) {
					cs[i].href = cs[i].href.replace(from, to);
					break;
				}
			}
		}
	});
})(enyo, this);