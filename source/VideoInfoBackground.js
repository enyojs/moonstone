(function (enyo, scope) {
	/**
	* `moon.VideoInfoBackground` is a [control]{@link enyo.Control} that provides a stylized 
	* background for [components]{@link enyo.Component} placed in the
	* [`infoComponents`]{@link moon.VideoPlayer#infoComponents} block of a {@link moon.VideoPlayer}.
	* It is designed as a decorator, wrapping components placed inside with the stylized background.
	* 
	* Use the [`orient`]{@link moon.VideoInfoBackground#orient} property to set the orientation 
	* (`'left'` or `'right'`).
	* 
	* For more details, see {@link moon.VideoPlayer}.
	*
	* @class moon.VideoInfoBackground
	* @extends enyo.Control
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.VideoInfoBackground.prototype */ {

		/**
		* @private
		*/
		name: 'moon.VideoInfoBackground',

		/**
		* @private
		*/
		kind: 'enyo.Control',
		
		/**
		* @private
		*/
		classes: 'moon-background-wrapper',
		
		/**
		* @private
		* @lends moon.VideoInfoBackground.prototype
		*/
		published: {
			
			/** 
			* Orientation of the control; valid values are `'left'` and `'right'`.
			*
			* @type {String}
			* @default 'left'
			* @public
			*/
			orient: 'left',

			/**
			* If `true`, background color is set to black; otherwise, background is transparent.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			background: true
		},
		
		/**
		* @private
		*/
		components: [
			{name: 'client', classes: 'moon-background-wrapper-client-content'}
		],

		/**
		* @private
		*/
		initComponents: function() {
			this.inherited(arguments);
			this.orientChanged();
			this.backgroundChanged();
		},

		/**
		* @private
		*/
		orientChanged: function() {
			this.$.client.addRemoveClass('right', this.orient != 'left');
			this.$.client.addRemoveClass('left', this.orient == 'left');
		},

		/**
		* @private
		*/
		backgroundChanged: function() {
			this.$.client.addRemoveClass('bg', this.background);
		}
	});

})(enyo, this);
