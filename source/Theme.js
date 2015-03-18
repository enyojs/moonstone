(function (enyo, scope) {

	var defaultThemeName = 'dark',
		linkTags;

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

		theme: 'dark',

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
			// this.themeChanged(defaultThemeName, this.theme);
			this.themeNodeStore = {};
			this.inherited(arguments);
		},

		create: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);

				this.initializeThemes();
			};
		}),

		initializeThemes: function () {
			var i, t, tn,
				theme = this.get('theme'),
				cs = document.getElementsByTagName('link');

			for (i = 0; i < cs.length; i++) {
				if (cs[i].href.indexOf(this.themes[theme]) > 0) {
					// Save our current theme's node
					this.themeNodeStore[theme] = cs[i];
					// Setup the other themes' nodes
					for (t in this.themes) {
						if (t != theme) {
							// Generate the new theme paths based on the existing (found) theme path
							tn = this.createNode('link', {
								href: cs[i].href.replace(this.themes[theme], this.themes[t]),
								rel: 'stylesheet',
								disabled: true
							});
							// Add it to the store and append to the head, already disabled
							this.themeNodeStore[t] = tn;
							this.appendToHead(tn);
						}
					}
					return this.themeNodeStore[theme];
				}
			}
		},

		themeChanged: function (oldTheme, newTheme) {
			if (oldTheme && newTheme) {
				this.themeNodeStore[oldTheme].disabled = true;
				this.themeNodeStore[newTheme].disabled = false;
			}
		},

		appendToHead: function (node) {
			if (typeof node == 'string') {
				document.head.insertAdjacentHTML('beforeend', node );
			} else {
				document.head.appendChild( node );
			}
		}

		/**
		* @method
		* @private
		*/
		// themeChanged: function(from, to) {
		// 	if (from == to) return;

		// 	var themes = this.get('themes'),
		// 		currentCssFile = themes[from],
		// 		targetCssFile = themes[to];

		// 	if (!currentCssFile || !targetCssFile) return;
		// 	this.changeLink(currentCssFile, targetCssFile);
		// },

		// _inventoryLinksMatching: function (match) {
		// 	var i, cs = document.getElementsByTagName('link');
		// 	linkTags = [];
		// 	for (i = 0; i < cs.length; i++) {
		// 		if (cs[i].href.indexOf(match) > 0) {
		// 			linkTags.push(cs[i]);
		// 		}
		// 	}
		// },

		/**
		* @method
		* @private
		*/
		// changeLink: function(from, to) {
		// 	if (from == to) return;

		// 	var i, cs = document.getElementsByTagName('link');

		// 	for (i = 0; i < cs.length; i++) {
		// 		if (cs[i].href.indexOf(from) > 0) {
		// 			cs[i].href = cs[i].href.replace(from, to);
		// 			break;
		// 		}
		// 	}
		// },
		// disableLink: function(match) {
		// 	var i, cs = document.getElementsByTagName('link');
		// 	for (i = 0; i < cs.length; i++) {
		// 		if (cs[i].href.indexOf(match) > 0) {
		// 			cs[i].disable = true;
		// 		}
		// 	}
		// }
	});

})(enyo, this);
