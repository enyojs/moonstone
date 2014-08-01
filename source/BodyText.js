(function (enyo, scope) {
	/**
	* `moon.BodyText` is a simple control for displaying body text in an app.  It is designed to
	* align with other text-based controls.
	*
	* @class moon.BodyText
	* @extends enyo.Control
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.BodyText.prototype */ {

		/**
		* @private
		*/
		name: 'moon.BodyText',

		/**
		* @private
		*/
		kind: 'enyo.Control',

		/**
		* @private
		*/
		classes: 'moon-body-text moon-body-text-spacing moon-body-text-control',

		/**
		*
		* If `true`, HTML tags are allowed in the control's content
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		allowHtml: true,

		/**
		* @private
		* @lends moon.BodyText.prototype
		*/
		published: {

			/**
			* When `true`, text content is centered; otherwise left-aligned
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			centered: false
		},

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.centeredChanged();
		},

		/**
		* @private
		*/
		contentChanged: function () {
			this.inherited(arguments);
			this.detectTextDirectionality();
			this.bubble('onRequestSetupBounds');
		},

		/**
		* @private
		*/
		centeredChanged: function () {
			this.applyStyle('text-align', this.centered ? 'center' : null);
		}
	});

})(enyo, this);
