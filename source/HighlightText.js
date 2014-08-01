(function (enyo, scope) {
	/**
	* Event sent to {@link moon.HighlightText} to turn on highlight
	*
	* @event moon.HighlightText#onHighlight
	* @type {Object}
	* @property {String|RegExp} highlight - String or regular expression specifying the text or
	*	pattern to highlight.
	* @public
	*/

	/**
	* Event sent to {@link moon.HighlightText} to turn off highlight
	*
	* @event moon.HighlightText#onUnHighlight
	* @type {Object}
	* @public
	*/

	var HTMLStringDelegate = enyo.HTMLStringDelegate,
		HighlightTextDelegate = Object.create(HTMLStringDelegate);

	HighlightTextDelegate.generateInnerHtml = function (control) {
		// flow can alter the way that html content is rendered inside
		// the container regardless of whether there are children.
		control.flow();
		if (control.children.length) { return this.generateChildHtml(control); }
		else {
			if (control.search) {
				return control.content.replace(control.search, control.bindSafely(function (s) {
					return '<span style=\'pointer-events:none;\' class=\'' + this.highlightClasses + '\'>' + enyo.dom.escape(s) + '</span>';
				}));
			} else {
				return enyo.dom.escape(control.get('content'));
			}
		}
	};

	/**
	* `moon.HighlightText` is a control that displays highlighted text.  When
	* [`highlight`]{@link moon.HighlightText#highlight} is set or an
	* {@link moon.HighlightText#event:onHighlight} event is received, it will highlight a specified
	* string if that string is found within the control's content.
	*
	* For example, let's say we have the following control:
	*
	* ```
	* {kind: 'moon.HighlightText', name: 'myHT', content: 'Hello World!'}
	* ```
	* In response to the event
	*
	* ```
	* this.waterfall('onHighlight', {highlight: 'Hello'});
	* ```
	* or the direct API call
	*
	* ```
	* this.$.myHT.set('highlight', 'Hello');
	* ```
	*
	* the word 'Hello' will be highlighted.
	*
	* The highlighting will be turned off when an {@link moon.HighlightText#event:onUnHighlight}
	* event is received
	*
	* ```
	* this.waterfall('onUnHighlight');
	* ```
	* or when {@link moon.HighlightText#highlight} is set to a **falsy** value
	*
	* ```
	* this.$.myHT.set('highlight', '');
	* ```
	*
	* @class moon.HighlightText
	* @extends enyo.Control
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.HighlightText.prototype */ {

		/**
		* @private
		*/
		name: 'moon.HighlightText',

		/**
		* @private
		*/
		kind: 'enyo.Control',

		/**
		* @private
		* @lends moon.HighlightText.prototype
		*/
		published: {

			/**
			* String or regular expression specifying the text or pattern to
			* highlight. Setting this to an empty string, **falsy** value, or empty
			* regex will disable highlighting.
			*
			* @type {String|RegExp}
			* @default ''
			* @public
			*/
			highlight: '',

			/**
			* When `true`, only case-sensitive matches of the string to highlight will be
			* highlighted.  This property will be ignored if the
			* {@link moon.HighlightText#highlight} property is set to a regular expression (you
			* may use the `'i'` modifier to create a case-insensitive regex).
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			caseSensitive: false,

			/**
			* The default CSS class to apply to highlighted content
			*
			* @type {String}
			* @default 'moon-highlight-text-highlighted'
			* @public
			*/
			highlightClasses: 'moon-highlight-text-highlighted'
		},

		/**
		* @private
		*/
		renderDelegate: HighlightTextDelegate,

		/**
		* @private
		*/
		handlers: {
			onHighlight: 'onHighlightHandler',
			onUnHighlight: 'unHighlightHandler'
		},

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.highlightChanged();
		},

		/**
		* @private
		*/
		highlightChanged: function () {
			if (this.highlight) {
				if (this.highlight instanceof RegExp) {
					// Make sure the regex isn't empty
					this.search = (''.match(this.highlight)) ? null : this.highlight;
				} else {
					// Escape string for use in regex (standard regex escape from google)
					var escaped = this.highlight.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
					this.search = new RegExp(escaped, this.caseSensitive ? 'g' : 'ig');
				}
			} else {
				this.search = false;
			}
			if (this.hasNode()) {
				this.contentChanged();
			}
		},

		/**
		* @private
		*/
		caseSensitiveChanged: function () {
			this.highlightChanged();
		},

		/**
		* @private
		*/
		onHighlightHandler: function (inSender, inEvent) {
			this.setHighlight(inEvent.highlight);
			return true;
		},

		/**
		* @private
		*/
		unHighlightHandler: function (inSender, inEvent) {
			this.setHighlight('');
			return true;
		}
	});

})(enyo, this);
