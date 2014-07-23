(function (enyo, scope) {
	/**
	* _moon.CaptionDecorator_ wraps a control with a caption. The position of the
	* caption is defined via the {@link moon.CaptionDecorator#side} property.
	*
	* ```
	* 	{kind: 'moon.CaptionDecorator', side: 'top', content: 'Top Label', components: [
	* 		{kind: 'moon.Button', content: 'My Button', ontap: 'buttonTapped'},
	* 	]}
	* ```
	*
	* @ui
	* @class moon.CaptionDecorator
	@ @extends enyo.Control
	* @public
	*/
	enyo.kind(
		/** @lends moon.CaptionDecorator.prototype */ {

		/**
		* @private
		*/
		name: 'moon.CaptionDecorator',

		/**
		* @private
		*/
		handlers: {
			onSpotlightFocus: 'spotFocus',
			onSpotlightBlur:  'spotBlur'
		},

		/**
		* @private
		*/
		published: /** @lends moon.CaptionDecorator.prototype */ {

			/**
			* The position of the caption with respect to the wrapped control; valid
			* values are 'top', 'bottom', 'left', and 'right'
			*
			* @type {String}
			* @default 'top'
			* @public
			*/
			side: 'top',

			/**
			* If true, the caption is only shown when the wrapped control has Spotlight
			* focus; otherwise, it is always visible
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			showOnFocus: false
		},

		/**
		* @private
		*/
		captionPositioned: false,

		/**
		* @private
		*/
		clientBounds: null,

		/**
		* @private
		*/
		captionBounds: null,

		/**
		* @private
		*/
		decoratorBounds: null,

		/**
		* @private
		*/
		classes: 'moon-button-caption-decorator',

		/**
		* @private
		*/
		components: [
			{kind: 'enyo.Control', name: 'leftCaption',     classes: 'moon-divider-text moon-caption left',   canGenerate: false},
			{kind: 'enyo.Control', name: 'topCaption',      classes: 'moon-divider-text moon-caption top',    canGenerate: false},
			{kind: 'enyo.Control', name: 'client',          classes: 'moon-divider-text moon-caption-client'},
			{kind: 'enyo.Control', name: 'rightCaption',    classes: 'moon-divider-text moon-caption right',  canGenerate: false},
			{kind: 'enyo.Control', name: 'bottomCaption',   classes: 'moon-divider-text moon-caption bottom', canGenerate: false}
		],

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.sideChanged();
			this.showOnFocusChanged();
		},

		/**
		* If _this.showOnFocus_ is _true_, reset caption position on reflow
		*
		* @private
		*/
		reflow: function () {
			this.inherited(arguments);

			if (this.getShowOnFocus()) {
				this.resetCaptionPosition();
			}
		},

		/**
		* If _this.showOnFocus_ is _true_, reset caption position on reflow
		*
		* @private
		*/
		getSide: function () {
			return this.side || 'top';
		},

		// Change handlers

		/**
		* @private
		*/
		sideChanged: function () {
			var side = this.getSide();

			this.$.topCaption.canGenerate =     (side === 'top');
			this.$.rightCaption.canGenerate =   (side === 'right');
			this.$.bottomCaption.canGenerate =  (side === 'bottom');
			this.$.leftCaption.canGenerate =    (side === 'left');

			// Update the content, including position if needed
			this.contentChanged();

			// If this control has already been rendered, re-render to update caption side
			if (this.hasNode()) {
				// Re-render to display caption on proper side
				this.render();
			}
		},

		/**
		* @private
		*/
		showOnFocusChanged: function () {
			this.addRemoveClass('showOnFocus', this.getShowOnFocus());

			// If _showOnFocus_ is _true_, reset caption position
			if (this.hasNode() && this.getShowOnFocus()) {
				this.resetCaptionPosition();
			}
		},

		/**
		* @private
		*/
		contentChanged: function () {
			this.$[this.getSide()+'Caption'].setContent(this.getContent());

			// If _showOnFocus_ is _true_, reset caption position
			if (this.hasNode() && this.getShowOnFocus()) {
				this.resetCaptionPosition();
			}
		},

		// Event handlers

		/**
		* Add spotlight class when button is focused, and calculate caption position if required
		*
		* @private
		*/
		spotFocus: function () {
			this.addClass('spotlight');

			if (this.hasNode() && this.getShowOnFocus()) {
				this.positionCaption();
			}
		},

		/**
		* Remove spotlight class when button is blurred
		*
		* @private
		*/
		spotBlur: function () {
			this.removeClass('spotlight');
		},

		// Caption positioning

		/**
		* Return current caption control
		*
		* @private
		*/
		getCaptionControl: function () {
			return this.$[this.getSide()+'Caption'];
		},

		/**
		* Reset cached position values and reposition caption if currently spotted
		*
		* @private
		*/
		resetCaptionPosition: function () {
			this.resetCachedBounds();
			this.captionPositioned = false;

			if (this.hasNode() && this.hasClass('spotlight')) {
				this.positionCaption();
			}
		},

		/**
		* Position caption based on the value of _this.side_
		*
		* @private
		*/
		positionCaption: function () {
			if (this.captionPositioned) {
				return;
			}

			var bounds = this.getDecoratorBounds(),
				clientBounds = this.getClientBounds(),
				captionBounds = this.getCaptionBounds();

			switch (this.getSide()) {
			case 'left':
				this.centerCaptionVertically(bounds, captionBounds);
				this.positionCaptionAtLeftEdge(bounds, clientBounds, captionBounds);
				break;
			case 'right':
				this.centerCaptionVertically(bounds, captionBounds);
				this.positionCaptionAtRightEdge(bounds, clientBounds, captionBounds);
				break;
			case 'top':
				this.centerCaptionHorizontally(bounds, captionBounds);
				this.positionCaptionAtTopEdge(bounds, clientBounds, captionBounds);
				break;
			case 'bottom':
				this.centerCaptionHorizontally(bounds, captionBounds);
				this.positionCaptionAtBottomEdge(bounds, clientBounds, captionBounds);
				break;
			}

			this.captionPositioned = true;
		},

		/**
		* Center caption control vertically relative to _this.decoratorBounds.height_
		*
		* @private
		*/
		centerCaptionVertically: function (inBounds, inCaptionBounds) {
			this.getCaptionControl().applyStyle('top', ((inBounds.height - inCaptionBounds.height)/2) + 'px');
		},

		/**
		* Center caption control horizontally relative to _this.decoratorBounds.width_
		*
		* @private
		*/
		centerCaptionHorizontally: function (inBounds, inCaptionBounds) {
			this.getCaptionControl().applyStyle('left', ((inBounds.width - inCaptionBounds.width)/2) + 'px');
		},

		/**
		* Position caption at left edge of _this.$.client_
		*
		* @private
		*/
		positionCaptionAtLeftEdge: function (inBounds, inClientBounds, inCaptionBounds) {
			var position = (-1 * inCaptionBounds.width) + ((inBounds.width - inClientBounds.width)/2) - inCaptionBounds.marginRight;
			this.getCaptionControl().applyStyle('left', position + 'px');
		},

		/**
		* Position caption at right edge of _this.$.client_
		*
		* @private
		*/
		positionCaptionAtRightEdge: function (inBounds, inClientBounds, inCaptionBounds) {
			var position = inBounds.width - ((inBounds.width - inClientBounds.width)/2);
			this.getCaptionControl().applyStyle('left', position + 'px');
		},

		/**
		* Position caption at top edge of _this.$.client_
		*
		* @private
		*/
		positionCaptionAtTopEdge: function (inBounds, inClientBounds, inCaptionBounds) {
			var position = (-1 * this.getCaptionBounds().height) + ((inBounds.height - inClientBounds.height)/2) - inCaptionBounds.marginBottom;
			this.getCaptionControl().applyStyle('top', position + 'px');
		},

		/**
		* Position caption at bottom edge of _this.$.client_
		*
		* @private
		*/
		positionCaptionAtBottomEdge: function (inBounds, inClientBounds, inCaptionBounds) {
			var position = inBounds.height - ((inBounds.height - inClientBounds.height)/2);
			this.getCaptionControl().applyStyle('top', position + 'px');
		},

		/**
		* Cache result from _this.getBounds()_ call and save in _this.decoratorBounds_
		*
		* @private
		*/
		getDecoratorBounds: function () {
			this.decoratorBounds = this.decoratorBounds || this.getBounds();
			return this.decoratorBounds;
		},

		/**
		* Cache caption bounds and save in _this.captionBounds_
		*
		* @private
		*/
		getCaptionBounds: function () {
			this.captionBounds = this.captionBounds || enyo.mixin(this.getCaptionControl().getBounds(), this.getCaptionMarginBounds());
			return this.captionBounds;
		},

		/**
		* Cache client bounds and save in _this.clientBounds_
		*
		* @private
		*/
		getClientBounds: function () {
			this.clientBounds = this.clientBounds || this.$.client.getBounds();
			return this.clientBounds;
		},

		/**
		* Clear cached bounds
		*
		* @private
		*/
		resetCachedBounds: function () {
			this.clientBounds = null;
			this.captionBounds = null;
			this.decoratorBounds = null;
		},

		/**
		* Return margins of caption control
		*
		* @private
		*/
		getCaptionMarginBounds: function () {
			var margins = enyo.dom.calcMarginExtents(this.getCaptionControl().hasNode());
			return {
				marginTop:      margins.top,
				marginRight:    margins.right,
				marginBottom:   margins.bottom,
				marginLeft:     margins.left
			};
		}
	});

})(enyo, this);
