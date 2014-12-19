(function (enyo, scope) {

	var _delayedMeasurementFinished;

	/**
	* Custom input event to allow apps to distinguish header inputs from regular inputs.
	*
	* @event moon.Header#onInputHeaderInput
	* @type {Object}
	* @property {Object} originalEvent - The original event fired from the input. See
	*	{@link enyo.Input#oninput} for more event information.
	* @public
	*/

	/**
	* Custom input change event to allow apps to distinguish header input changes from
	* regular input changes.
	*
	* @event moon.Header#onInputHeaderChange
	* @type {Object}
	* @property {Object} originalEvent - The original event fired from the input. See
	*	{@link enyo.Input#onchange} for more event information.
	* @public
	*/

	/**
	* {@link moon.Header} is a Moonstone-styled control with a large title and an area for
	* additional controls.
	*
	* @class moon.Header
	* @extends enyo.Control
	* @mixes moon.MarqueeSupport
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.Header.prototype */ {

		/**
		* @private
		*/
		name: 'moon.Header',

		/**
		* @private
		*/
		classes: 'moon-header',

		/**
		* @private
		* @lends moon.Header.prototype
		*/
		published: {

			/**
			* Title of the header.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			title: '',

			/**
			* Text above the header.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			titleAbove: '',

			/**
			* Text below the header.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			titleBelow: '',

			/**
			* Sub-text below the header.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			subTitleBelow: '',

			/**
			* Size of the header, for styling purposes. Will be one of `'large'` (the default),
			* `'medium'`, or `'small'`. If `'large'`, the `moon-header` CSS class will be applied
			* to this header; if `'medium'`, the `moon-medium-header` class will be applied; if
			* `'small'`, the `moon-small-header` class will be applied.
			*
			* @type {String}
			* @default 'large'
			* @public
			*/
			type: 'large',

			/**
			* If `true`, the `moon-medium-header` CSS class will be applied to this header.
			*
			* Note that this property will be deprecated soon. For now, it is being left in
			* for backward compatibility. Until it is removed, `small: true` refers to the
			* historical header size, which is now equivalent to `type: 'medium'`.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			small: false,

			/**
			* URL(s) of background image(s).
			* This may be a string referring a single background image, or an array of
			* strings referring to multiple background images.
			*
			* @type {(String|String[])}
			* @default null
			* @public
			*/
			backgroundSrc: null,

			/**
			* Position of background image, defined as a string of the form
			* `'<vertical> <horizontal>'`, with a space separating the `<vertical>`
			* and `<horizontal>` values (e.g., `'top right'`). If no second property
			* is specified, the `<horizontal>` value will default to `'right'`. As
			* with [backgroundSrc]{@link moon.Header#backgroundSrc}, an array of strings
			* may be supplied to position multiple background images. The order of items
			* should be the same as in `backgroundSrc`.
			*
			* @type {(String|String[])}
			* @default 'top right'
			* @public
			*/
			backgroundPosition: 'top right',

			/**
			* When using a full-bleed background image, set this property to `true` to indent
			* the header text/controls and remove the header lines.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			fullBleedBackground: false,

			/**
			* If `true`, title will be an input.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			inputMode: false,

			/**
			* When `true`, input will be blurred on Enter keypress, if it was previously
			* focused.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			dismissOnEnter: false,

			/**
			* Text to display when the input is empty.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			placeholder: '',

			/**
			* The value of the input.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			value: '',

			/**
			* When `true`, the title text will have locale-safe uppercasing applied.
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
		mixins: ['moon.MarqueeSupport'],

		/**
		* @private
		*/
		marqueeOnSpotlight: false,

		/**
		* @private
		*/
		marqueeOnHover: true,

		/**
		* @private
		*/
		marqueeOnRender: true,

		/**
		* @private
		*/
		marqueeOnRenderDelay: 10000,

		/**
		* Described in .moon-header class
		*
		* @private
		*/
		standardHeight: 360,

		/**
		* @private
		*/
		handlers: {
			oninput: 'handleInput',
			onchange: 'handleChange',
			onRequestCreateListActions: 'handleRequestCreateComponents',
			onListActionOpenChanged: 'handleListActionOpenChanged'
		},

		/**
		* @private
		*/
		events: {

			/**
			* Custom input event to allow apps to distinguish header inputs from regular inputs.
			*/
			onInputHeaderInput: '',

			/**
			* Custom input change event to allow apps to distinguish header input changes from
			* regular input changes.
			*/
			onInputHeaderChange: ''
		},

		/**
		* @private
		*/
		components: [
			{name: 'titleAbove', classes: 'moon-super-header-text moon-header-title-above'},
			{name: 'titleWrapper', classes: 'moon-header-title-wrapper', components: [
				{name: 'title', kind: 'moon.MarqueeText', classes: 'moon-header-text moon-header-title', canGenerate: false},
				{name: 'inputDecorator', kind: 'moon.InputDecorator', classes: 'moon-input-header-input-decorator',canGenerate: false, components: [
					{name: 'titleInput', kind: 'moon.Input', classes: 'moon-header-text moon-header-title'}
				]}
			]},
			{name: 'titleBelow', kind: 'moon.MarqueeText', classes: 'moon-sub-header-text moon-header-title-below'},
			{name: 'subTitleBelow', kind: 'moon.MarqueeText', classes: 'moon-body-text moon-header-sub-title-below'},
			{name: 'client', classes: 'moon-hspacing moon-header-client'},
			{name: 'animator', kind: 'enyo.StyleAnimator', onComplete: 'animationComplete'}
		],

		/**
		* @private
		*/
		bindings: [
			{from: '.value', to: '.$.titleInput.value', oneWay: false},
			{from: '.dismissOnEnter', to: '.$.titleInput.dismissOnEnter'}
		],

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			// Note: This smallchanged() line will be deprecated soon. For backward compatiblity, I leave it for a
			// while.
			this.smallChanged();
			this.typeChanged();
			this.titleChanged();
			this.titleAboveChanged();
			this.titleBelowChanged();
			this.subTitleBelowChanged();
			this.allowHtmlChanged();
			this.backgroundSrcChanged();
			this.backgroundPositionChanged();
			this.inputModeChanged();
			this.placeholderChanged();
			this.fullBleedBackgroundChanged();
		},

		rendered: function() {
			this.inherited(arguments);
			// At the first render, the fonts may not have finished loading yet. We delay the first
			// time using an async method, and set a flag so we know the deed is done at subsequent calls.
			if (_delayedMeasurementFinished) {
				this.adjustTitleWidth();
			} else {
				enyo.asyncMethod(this, function () {
					this.adjustTitleWidth();
					_delayedMeasurementFinished = true;
				});
			}
		},

		/**
		* @private
		*/
		allowHtmlChanged: function () {
			this.$.title.setAllowHtml( this.get('type') == 'small' ? true : this.allowHtml );
			this.$.titleBelow.setAllowHtml(this.allowHtml);
			this.$.subTitleBelow.setAllowHtml(this.allowHtml);
		},

		/**
		* @private
		*/
		backgroundSrcChanged: function () {
			var bgs = (enyo.isArray(this.backgroundSrc)) ? this.backgroundSrc : [this.backgroundSrc];
			bgs = enyo.map(bgs, function (inBackgroundSource) {
					return inBackgroundSource ? 'url(' + inBackgroundSource + ')' : null;
				});
			this.applyStyle('background-image', (bgs.length) ? bgs.join(', ') : null);
		},

		/**
		* @private
		*/
		backgroundPositionChanged: function () {
			var bgp = this.backgroundPosition;
			if (enyo.isArray(bgp)) {
				bgp = (bgp.length) ? bgp.join(', ') : null;
			}
			// If `this.backgroundPosition` is set explicitly to inherit or initial, apply that
			// instead of assuming a position.
			if (bgp == 'inherit' || bgp == 'initial') {
				this.applyStyle('background-position', bgp);
				return;
			}
			var posArray = bgp && bgp.split(' ') || [],
				posStr = (posArray.length === 0) ? 'top right'
						: (posArray.length === 1) ? posArray[0] + ' right' : bgp;
			this.applyStyle('background-position', posStr);
		},

		/**
		* @private
		*/
		fullBleedBackgroundChanged: function () {
			this.addRemoveClass('full-bleed', this.fullBleedBackground);
		},

		/**
		* @private
		*/
		handleRequestCreateComponents: function (inSender, inEvent) {
			this.controlParent = null;
			this.createComponents(inEvent.components, {owner: inEvent.originator});
			this.discoverControlParent();
		},

		/**
		* Collapses the drawer, hiding its contents.
		*
		* @public
		*/
		collapseToSmall: function () {
			if (this.collapsed) {
				return;
			}

			var myStyle = enyo.dom.getComputedStyle(this.hasNode());
			var titleWrapperStyle = enyo.dom.getComputedStyle(this.$.titleWrapper.hasNode());
			var titleBelowStyle = enyo.dom.getComputedStyle(this.$.titleBelow.hasNode());
			var subTitleBelowStyle = enyo.dom.getComputedStyle(this.$.subTitleBelow.hasNode());
			var titleAboveStyle = enyo.dom.getComputedStyle(this.$.titleAbove.hasNode());

			// TODO - animator should track initial positions so we don't have to store these if we
			// want to reverse the animation
			this.smallAnimProps = {
				'height': myStyle['height']
			};
			this.$.titleWrapper.smallAnimProps = {
				'padding-left': titleWrapperStyle['padding-left'],
				'top': titleWrapperStyle['top']
			};
			this.$.title.smallAnimProps = {};
			this.$.titleAbove.smallAnimProps = {
				'height': titleAboveStyle['height'],
				'opacity': titleAboveStyle['opacity']
			};
			this.$.titleBelow.smallAnimProps = {
				'top': titleBelowStyle['top']
			};
			this.$.subTitleBelow.smallAnimProps = {
				'top': subTitleBelowStyle['top']
			};

			this.$.animator.newAnimation({
				name: 'collapseToSmall',
				duration: 200,
				timingFunction: 'linear',
				keyframes: {
					0: [{
						control: this,
						properties: {
							'height': 'current'
						}
					}, {
						control: this.$.titleWrapper,
						properties: {
							'padding-left': 'current',
							'top': 'current'
						}
					}, {
						control: this.$.titleAbove,
						properties: {
							'height': 'current',
							'opacity': 'current',
							'margin-top': 'current'
						}
					}, {
						control: this.$.title,
						properties: {}
					}, {
						control: this.$.titleBelow,
						properties: {
							'top': 'current'
						}
					}, {
						control: this.$.subTitleBelow,
						properties: {
							'top': 'current'
						}
					}],
					70: [],
					100: [{
						control: this,
						properties: {
							'height': '260px'
						}
					}, {
						control: this.$.titleWrapper,
						properties: {}
					}, {
						control: this.$.titleAbove,
						properties: {
							'height': 0,
							'opacity': 0,
							'margin-top': 0
						}
					}, {
						control: this.$.title,
						properties: {}
					}, {
						control: this.$.titleBelow,
						properties: {}
					}, {
						control: this.$.subTitleBelow,
						properties: {}
					}]

				}
			});
			this.$.animator.play('collapseToSmall');
			this.collapsed = true;
		},

		/**
		* Expands the drawer, showing its contents.
		*
		* @public
		*/
		expandToLarge: function () {
			if (!this.collapsed) {
				return;
			}

			this.$.animator.newAnimation({
				name: 'expandToLarge',
				duration: 200,
				timingFunction: 'linear',
				keyframes: {
					0: [{
						control: this,
						properties: {
							'height': 'current'
						}
					}, {
						control: this.$.titleWrapper,
						properties: {
							'padding-left': 'current',
							'top': 'current'
						}
					}, {
						control: this.$.titleAbove,
						properties: {
							'height': 'current',
							'opacity': 'current',
							'margin-top': 'current'
						}
					}, {
						control: this.$.title,
						properties: {}
					}, {
						control: this.$.titleBelow,
						properties: {
							'top': 'current'
						}
					}, {
						control: this.$.subTitleBelow,
						properties: {
							'top': 'current'
						}
					}],
					30: [],
					100: [{
						control: this,
						properties: {
							'height': this.smallAnimProps.height
						}
					}, {
						control: this.$.titleWrapper,
						properties: {
							'padding-left': this.$.titleWrapper.smallAnimProps['padding-left'],
							'top': this.$.titleWrapper.smallAnimProps['top']
						}
					}, {
						control: this.$.titleAbove,
						properties: {
							'height': this.$.titleAbove.smallAnimProps['height'],
							'opacity': this.$.titleAbove.smallAnimProps['opacity'],
							'margin-top': this.$.titleAbove.smallAnimProps['margin-top']
						}
					}, {
						control: this.$.title,
						properties: {}
					}, {
						control: this.$.titleBelow,
						properties: {
							'top': this.$.titleBelow.smallAnimProps['top']
						}
					}, {
						control: this.$.subTitleBelow,
						properties: {
							'top': this.$.subTitleBelow.smallAnimProps['top']
						}
					}]
				}
			});
			this.$.animator.play('expandToLarge');
			this.collapsed = false;
		},

		/**
		* @private
		*/
		typeChanged: function () {
			this.addRemoveClass('moon-medium-header', this.get('type') == 'medium');
			this.addRemoveClass('moon-small-header', this.get('type') == 'small');
			this.contentChanged();
		},

		/**
		* @private
		*/
		valueChanged: function () {
			this.$.titleInput.detectTextDirectionality((this.$.titleInput.value || this.$.titleInput.value === 0 || this.$.titleInput.value === '0') ? this.$.titleInput.value : this.$.titleInput.get('placeholder'));
		},

		/**
		* @private
		*/
		adjustTitleWidth: function() {
			var type = this.get('type'),
				// Measure client area's width + 40px of spacing
				client = this.$.client ? this.$.client.hasNode() : null,
				clientWidth = client ? client.offsetWidth : null,
				clientSpace = enyo.dom.unit(clientWidth + 40, 'rem'),
				rtl = this.rtl;

			if (client) {
				// Set the margin on the correct side for the correct control, otherwise set it to nothing
				this.$.title.applyStyle('margin-right', (type == 'small' && !rtl && clientWidth) ? clientSpace : null);
				this.$.title.applyStyle('margin-left', (type == 'small' && rtl && clientWidth) ? clientSpace : null);

				this.$.titleBelow.applyStyle('margin-right', (type == 'medium' && !rtl && clientWidth) ? clientSpace : null);
				this.$.titleBelow.applyStyle('margin-left', (type == 'medium' && rtl && clientWidth) ? clientSpace : null);

				this.$.subTitleBelow.applyStyle('margin-right', (type == 'medium' && !rtl && clientWidth) ? clientSpace : null);
				this.$.subTitleBelow.applyStyle('margin-left', (type == 'medium' && rtl && clientWidth) ? clientSpace : null);
			}
		},

		/**
		* Note that this method will be deprecated soon. For now, it is being left in for
		* backward compatibility.
		*
		* @private
		*/
		smallChanged: function () {
			this.addRemoveClass('moon-medium-header', this.get('small'));
		},

		/**
		* @private
		*/
		contentChanged: function () {
			var title = this.getTitleUpperCase()
						? enyo.toUpperCase(this.get('title') || this.get('content'))
						: (this.get('title') || this.get('content')),
				subtitle = this.get('titleBelow');
			if ((this.get('type') == 'small') && subtitle) {
				this.$.title.set('allowHtml', true);
				this.$.title.set('content', enyo.Control.prototype.rtl && !enyo.isRtl(subtitle + title) ? 
					'<span class="moon-sub-header-text moon-header-sub-title">' + subtitle + '</span>' + '   ' + title :
					title + '   ' + '<span class="moon-sub-header-text moon-header-sub-title">' + subtitle + '</span>');
			} else {
				this.$.title.set('allowHtml', this.get('allowHtml') );
				this.$.title.set('content', title);
			}
			this.placeholderChanged();
		},

		/**
		* For backward-compatibility with original API.
		*
		* @private
		*/
		titleChanged: function () {
			this.contentChanged();
		},

		/**
		* @private
		*/
		placeholderChanged: function () {
			// For backward-compatibility with original API
			this.$.titleInput.set('placeholder', this.getTitleUpperCase()
					? enyo.toUpperCase(this.placeholder || this.title || this.content)
					: (this.placeholder || this.title || this.content) );
			this.valueChanged();
		},

		/**
		* @private
		*/
		titleUpperCaseChanged: function () {
			this.titleChanged();
		},

		/**
		* @private
		*/
		titleAboveChanged: function () {
			this.$.titleAbove.addRemoveClass('no-border', this.titleAbove === '');
			this.$.titleAbove.set('content', this.titleAbove);
		},

		/**
		* @private
		*/
		titleBelowChanged: function () {
			this.$.titleBelow.set('content', this.titleBelow || '');
			this.contentChanged();
		},

		/**
		* @private
		*/
		subTitleBelowChanged: function () {
			this.$.subTitleBelow.set('content', this.subTitleBelow || '');
		},

		/**
		* Placeholder
		*
		* @private
		*/
		// animationComplete: function (inSender, inEvent) {
			// Do something?
		// },

		/**
		* @private
		*/
		inputModeChanged: function () {
			this.$.title.canGenerate = !this.inputMode;
			this.$.title.setShowing(!this.inputMode);
			this.$.inputDecorator.canGenerate = this.inputMode;
			this.$.inputDecorator.setShowing(this.inputMode);

			if (!this.inputMode) {
				if (!this.$.title.hasNode()) {
					this.$.title.render();
				}
				// Reset marquees when coming back to static text
				if (this.generated) {
					this.stopMarquee();
					this.startMarquee();
				}
			}
			if (this.inputMode && !this.$.inputDecorator.hasNode()) {
				this.$.inputDecorator.render();
			}
			this.addRemoveClass('moon-input-header', this.inputMode);
		},

		/**
		* Handles `input` event, firing custom
		* [onInputHeaderInput]{@link moon.Header#onInputHeaderInput} event.
		*
		* @fires moon.Header#onInputHeaderInput
		* @private
		*/
		handleInput: function (inSender, inEvent) {
			this.doInputHeaderInput({originalEvent: enyo.clone(inEvent, true)});
		},

		/**
		* Handles `change` event, firing custom
		* [onInputHeaderChange]{@link moon.Header#onInputHeaderChange} event.
		*
		* @fires moon.Header#onInputHeaderChange
		* @private
		*/
		handleChange: function (inSender, inEvent) {
			this.doInputHeaderChange({originalEvent: enyo.clone(inEvent, true)});
		},


		/**
		* Enlarges listActionDrawer's height to large type's height.
		*
		* @private
		*/
		handleListActionOpenChanged: function (inSender, inEvent) {
			if (!inEvent.open) {
				return;
			}
			inEvent.originator.beforeOpenDrawer(this.standardHeight, this.get('type'));
		}
	});

})(enyo, this);
