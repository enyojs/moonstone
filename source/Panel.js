(function (enyo, scope) {
	/**
	* Fires when this [panel]{@link moon.Panel} has completed its pre-arrangement transition.
	* No additional data is passed with this event.
	*
	* @event moon.Panel#onPreTransitionComplete
	* @type {Object}
	* @public
	*/

	/**
	* Fires when this [panel]{@link moon.Panel} has completed its post-arrangement transition.
	* No additional data is passed with this event.
	*
	* @event moon.Panel#onPostTransitionComplete
	* @type {Object}
	* @public
	*/

	/**
	* {@link moon.Panel} is the default kind for controls created inside a
	* [moon.Panels]{@link moon.Panels} container. A `moon.Panels` will typically
	* contain several instances of `moon.Panel`.
	*
	* The built-in features include an embedded {@link moon.Header} and an
	* {@link enyo.FittableRows} layout for the main body content.
	*
	* @class moon.Panel
	* @extends enyo.Control
	* @ui
	* @public
	*/

	enyo.kind(
		/** @lends moon.Panel.prototype */ {

		/**
		* @private
		*/
		name: 'moon.Panel',

		/**
		* @private
		*/
		kind: 'enyo.Control',

		/**
		* @private
		* @lends moon.Panel.prototype
		*/
		published: {
			/**
			* Facade for the [title]{@link moon.Header#title} property of the embedded
			* {@link moon.Header}.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			title: '',

			/**
			* Facade for the [titleAbove]{@link moon.Header#titleAbove} property of the
			* embedded {@link moon.Header}.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			titleAbove: '',

			/**
			* Facade for the [titleBelow]{@link moon.Header#titleBelow} property of the
			* embedded {@link moon.Header}.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			titleBelow: '',

			/**
			* Facade for the [subTitleBelow]{@link moon.Header#subTitleBelow} property
			* of the embedded {@link moon.Header}.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			subTitleBelow: '',

			/**
			* When `true`, the header's [titleAbove]{@link moon.Header#titleAbove} property
			* is automatically populated with the panel index.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			autoNumber: true,

			/**
			* Facade for the [type]{@link moon.Header#type} property of the embedded
			* {@link moon.Header}.
			* Valid values are: `'large'`, `'small'`, and `'medium'`.
			*
			* @type {String}
			* @default 'large'
			* @public
			*/
			headerType: 'medium',

			/**
			* Facade for the [allowHtml]{@link enyo.Control#allowHtml} property of the
			* embedded {@link moon.Header}.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			allowHtmlHeader: false,

			/**
			* Facade for the [backgroundSrc]{@link moon.Header#backgroundSrc} property
			* of the embedded {@link moon.Header}.
			*
			* @type {(String|String[])}
			* @default null
			* @public
			*/
			headerBackgroundSrc: null,

			/**
			* Facade for the [backgroundPosition]{@link moon.Header#backgroundPosition}
			* property of the embedded {@link moon.Header}.
			*
			* @type {(String|String[])}
			* @default 'top right'
			* @public
			*/
			headerBackgroundPosition: 'top right',

			/**
			* An object containing additional settings for the {@link moon.Header}. Any
			* values specified here will be mixed into the header definition.
			*
			* @type {Object}
			* @default null
			* @public
			*/
			headerOptions: null,

			/**
			* Facade for the [titleUpperCase]{@link moon.Header#titleUpperCase} property
			* of the embedded {@link moon.Header}.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			titleUpperCase: true
		},


		/**
		* @private
		*/
		spotlight: 'container',

		/**
		* @private
		*/
		classes: 'moon-panel',

		/**
		* @private
		*/
		layoutKind: 'FittableRowsLayout',

		/**
		* @private
		*/
		useFlex: true,

		/**
		* @private
		*/
		panelTools : [
			/* header will be created here programmatically in createTools after mixing-in headerOptions */
			{name: 'panelBody', kind: 'FittableRows', fit: true, classes: 'moon-panel-body'},
			{name: 'spotlightDummy', spotlight: false, style: 'width:0;height:0;'}
		],

		/**
		* @private
		*/
		headerConfig : {name: 'header', kind: 'moon.Header', isChrome: true},

		/**
		* @private
		*/
		bindings: [
			{from: '.title', to: '.$.header.title'},
			{from: '.title', to: '.$.breadcrumbText.content'},
			{from: '.titleAbove', to: '.$.header.titleAbove'},
			{from: '.titleAbove', to: '.$.breadcrumbTitleAbove.content'},
			{from: '.titleBelow', to: '.$.header.titleBelow'},
			{from: '.subTitleBelow', to: '.$.header.subTitleBelow'},
			{from: '.allowHtmlHeader', to: '.$.header.allowHtml'},
			{from: '.allowHtmlHeader', to: '.$.breadcrumbText.allowHtml'},
			{from: '.headerBackgroundSrc', to: '.$.header.backgroundSrc'},
			{from: '.headerBackgroundPosition', to: '.$.header.backgroundPosition'},
			{from: '.titleUpperCase', to: '.$.header.titleUpperCase'},
			{from: '.headerType', to: '.$.header.type', oneWay: false}
		],

		/**
		* @private
		*/
		headerComponents: [],

		// /**
		// * @private
		// */
		// isBreadcrumb: false,

		// /**
		// * @private
		// */
		// isOffscreen: false,

		// /**
		// * @private
		// */
		// isHeaderCollapsed: false,

		// /**
		// * @private
		// */
		// shrinking: false,

		// /**
		// * @private
		// */
		// growing: false,

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			// FIXME: Need to determine whether headerComponents was passed on the instance or kind to get the ownership correct
			if (this.headerComponents) {
				var owner = this.hasOwnProperty('headerComponents') ? this.getInstanceOwner() : this;
				this.$.header.createComponents(this.headerComponents, {owner: owner});
			}
			this.autoNumberChanged();
			// Note: This line will be deprecated soon. For backward compatiblity, I leave it for a while.
			// this.smallHeaderChanged();
			this.headerTypeChanged();
		},

		/**
		* @private
		*/
		initComponents: function () {
			this.createTools();
			this.controlParentName = 'panelBody';
			this.discoverControlParent();
			this.inherited(arguments);
		},

		/**
		* @private
		*/
		createTools: function () {
			// Create everything but the header
			this.createChrome(this.panelTools);
			// Special-handling for header, which can have its options modified by the instance
			var hc = enyo.clone(this.headerConfig || {});
			hc.addBefore = this.$.panelBody;
			enyo.mixin(hc, this.headerOptions || this.headerOption);
			this.createComponent(hc, {owner:this});
		},

		/**
		* On reflow, updates `this.$.contentWrapper` bounds.
		* @private
		*/
		reflow: function () {
			this.inherited(arguments);
			this.getInitAnimationValues();
			this.updatePanelBodySize();
		},

		/**
		* Updates `this.$.contentWrapper` to have the height/width of `this`.
		* @private
		*/
		updatePanelBodySize: function () {
			var node = this.hasNode();

			if (!node || this.isBreadcrumb) {
				return;
			}

			this.$.panelBody.applyStyle('height', this.initialHeight + 'px');
		},

		/**
		* Forcibly applies layout kind changes to `this.$.panelBody`.
		* @private
		*/
		layoutKindChanged: function () {
			this.$.panelBody.setLayoutKind(this.layoutKind);
		},

		/**
		* @private
		*/
		updateSpotability: function () {
			if (this.isOffscreen) {
				this.spotlightDisabled = true;
			} else {
				this.spotlightDisabled = false;
				this.$.spotlightDummy.spotlight = false;
				if (!enyo.Spotlight.isSpottable(this)) {
					// make dummy div spottable if there is no spottable child
					this.$.spotlightDummy.spotlight = true;
				}
			}
		},

		/**
		* @private
		*/
		headerTypeChanged: function () {
			this.$.header.setType(this.headerType);
			this.$.header.adjustTitleWidth();
			if (this.generated) {
				this.resize();
			}
		},

		/**
		* Updates [titleAbove]{@link moon.Panel#titleAbove} when
		* [autoNumber]{@link moon.Panel#autoNumber} changes.
		* @private
		*/
		autoNumberChanged: function () {
			if (this.getAutoNumber() === true && this.container) {
				// This gets the index regardless of whether the panel is client or chome
				var n = this.parent.indexOfChild(this) + 1;
				n = ((n < 10) ? '0' : '') + n;
				this.setTitleAbove(n);
			}
		},

		/**
		* @private
		*/
		generateAutoNumber: function () {
			var adjustedIndex = this.indexInContainer() + 1;
			return (adjustedIndex < 10) ? '0'+ adjustedIndex : adjustedIndex;
		},

		/**
		* @private
		*/
		enableMarquees: function () {
			this.$.header.enableMarquee();
		},

		/**
		* @private
		*/
		disableMarquees: function () {
			this.$.header.disableMarquee();
		},

		/**
		* @private
		*/
		startMarqueeAsNeeded: function (info) {
			var onscreen = !info.offscreen;
			if (onscreen) {
				this.$.header.enableMarquee();
				this.$.header.startMarquee();
			}
		},

		/**
		* @private
		*/
		getHeader: function () {
			return this.$.header;
		},

		/**
		* Called directly by {@link moon.Panels}.
		* @private
		*/
		initPanel: function (info) {
			this.set('isBreadcrumb', info.breadcrumb);
			this.set('isOffscreen', info.offscreen);
			this.updateSpotability();
			this.disableMarquees();
			this.startMarqueeAsNeeded(info);
		},

		/**
		* Called directly by {@link moon.Panels}.
		* @private
		*/
		preTransition: function (info) {
			this.disableMarquees();
			this.addClass('transitioning');

			return false;
		},

		/**
		* Called directly by {@link moon.Panels}.
		* @private
		*/
		postTransition: function (info) {
			this.removeClass('transitioning');

			return false;
		},

		/**
		* Called directly by {@link moon.Panels}.
		* @private
		*/
		updatePanel: function (info) {
			if (!info.animate) {
				this.disableMarquees();
			}

			this.set('isBreadcrumb', info.breadcrumb);
			this.set('isOffscreen', info.offscreen);
			this.updateSpotability();
			this.startMarqueeAsNeeded(info);
		},

		/**
		* Called directly on the panel by {@link moon.Panels} when the panel has completed a
		* transition. You may override this function in a panel subkind to perform
		* post-transition work (e.g., loading data for the panel).
		*
		* @param {Object} info - Information from the [Panels]{@link moon.Panels} component.
		* Additional information may be supplied by the arranger, such as breadcrumb and
		* offscreen status.
		* @param {Number} info.from - The index the parent Panels was moving from for this transition.
		* @param {Number} info.to - The index the parent Panels was moving to for this transition.
		* @param {Number} info.index - The current index of this [panel]{@link moon.Panel}.
		* @param {Boolean} info.animate - Whether the parent Panels is set to animate.
		* @public
		*/
		transitionFinished: function (info) {
			this.updatePanel(info);
		},

		/**
		* Was protected
		* @private
		*/
		getInitAnimationValues: function () {
			var panelNode = this.hasNode(), headerNode = this.$.header.hasNode(), bodyNode = this.$.panelBody.hasNode()
				panelPaddingT = parseInt(enyo.dom.getComputedStyleValue(panelNode, 'padding-top'), 10),
				panelPaddingB = parseInt(enyo.dom.getComputedStyleValue(panelNode, 'padding-bottom'), 10),
				bodyPaddingT = parseInt(enyo.dom.getComputedStyleValue(bodyNode, 'padding-top'), 10),
				panelHeight = panelNode.getBoundingClientRect().height,
				headerHeight = headerNode.getBoundingClientRect().height;
			this.initialHeight = panelHeight - headerHeight - (panelPaddingT + panelPaddingB + bodyPaddingT);
		}
	});
})(enyo, this);
