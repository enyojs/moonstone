(function (enyo, scope) {
	/**
	* Custom input event to allow apps to differentiate between inputs and header inputs. See
	* {@link enyo.Input#event:oninput} for more event information.
	*
	* @event moon.Header#event:onInputHeaderInput
	* @type {Object}
	* @public
	*/

	/**
	* Custom input change event to allow apps to differentiate between input changes and header
	* input changes. See {@link enyo.Input#event:onchange} for more event information.
	*
	* @event moon.Header#event:onInputHeaderChange
	* @type {Object}
	* @public
	*/

	/**
	* _moon.Header_ is a Moonstone-styled control with a large title and an area for
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
		kind: 'enyo.Control',

		/**
		* @private
		*/
		classes: 'moon-header',

		/**
		* @private
		*/
		published: /** @lends moon.Header.prototype */ {

			/**
			* Title of the header
			*
			* @type {String}
			* @default ''
			* @public
			*/
			title: '',

			/**
			* Text above the header
			*
			* @type {String}
			* @default ''
			* @public
			*/
			titleAbove: '',

			/**
			* Text below the header
			*
			* @type {String}
			* @default ''
			* @public
			*/
			titleBelow: '',

			/**
			* Sub-text below the header
			*
			* @type {String}
			* @default ''
			* @public
			*/
			subTitleBelow: '',

			/**
			* If medium, the _moon-medium-header_ CSS class will be applied to this header
			* If small, the _moon-small-header_ CSS class will be applied to this header
			* If large, the _moon-header_ CSS class will be applied to this header
			*
			* @type {String}
			* @default 'large'
			* @public
			*/
			type: 'large',

			/**
			* If true, the _moon-medium-header_ CSS class will be applied to this header
			* Note: This property will be deprecated soon. For backward compatiblity, I leave it for a
			* while. And until it is removed, 'small' refers to the historical size, which is now 'medium'
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			small: false,

			/**
			* URL of background image(s).
			* This may be a string referring a single background image, or an array of
			* strings referring to multiple background images.
			*
			* @type {(String|String[])}
			* @default null
			* @public
			*/
			backgroundSrc: null,

			/**
			* Position of background image, defined as a string of the form _'vertical
			* horizontal'_, with a space separating the _vertical_ and _horizontal_
			* properties (e.g., _'top right'_). If no second property is included, the
			* horizontal value will default to _right_.
			* As with {@link moon.Header#backgroundSrc}, an array of strings may be supplied to position
			* multiple background images. The order of items should be the same as in
			* {@link moon.Header#backgroundSrc}.
			*
			* @type {(String|String[])}
			* @default 'top right'
			* @public
			*/
			backgroundPosition: 'top right',

			/**
			* When using a full-bleed background image, set this property to true to indent
			* the header text/controls and remove the header lines
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			fullBleedBackground: false,

			/**
			* If true, title will be an input
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			inputMode: false,

			/**
			* When true, input will be blurred on Enter keypress (if focused)
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			dismissOnEnter: false,

			/**
			* Text to display when the input is empty
			*
			* @type {String}
			* @default ''
			* @public
			*/
			placeholder: '',

			/**
			* The value of the input
			*
			* @type {String}
			* @default ''
			* @public
			*/
			value: '',

			/**
			* When true, the title text will be converted to locale-safe uppercasing
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
			* Custom input event to allow apps to differentiate between inputs and header inputs
			*/
			onInputHeaderInput: '',

			/**
			* Custom input change event to allow apps to differentiate between input changes and header
			* input changes
			*/
			onInputHeaderChange: ''
		},

		/**
		* @private
		*/
		components: [{
			name: 'texts',
			components: [{
				name: 'titleAbove',
				classes: 'moon-super-header-text moon-header-title-above'
			}, {
				name: 'titleWrapper',
				classes: 'moon-header-title-wrapper',
				components: [{
					name: 'title',
					kind: 'moon.MarqueeText',
					classes: 'moon-header-font moon-header-title',
					canGenerate: false
				}, {
					name: 'inputDecorator',
					kind: 'moon.InputDecorator',
					classes: 'moon-input-header-input-decorator',
					canGenerate: false,
					components: [{
						name: 'titleInput',
						kind: 'moon.Input',
						classes: 'moon-header-text moon-header-title'
					}]
				}]
			}, {
				name: 'titleBelow',
				kind: 'moon.MarqueeText',
				classes: 'moon-sub-header-text moon-header-title-below'
			}, {
				name: 'subTitleBelow',
				kind: 'moon.MarqueeText',
				classes: 'moon-body-text moon-header-sub-title-below'
			}]
		}, {
			name: 'client',
			classes: 'moon-hspacing moon-header-client'
		}, {
			name: 'animator',
			kind: 'enyo.StyleAnimator',
			onComplete: 'animationComplete'
		}],

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
			// Note: This line will be deprecated soon. For backward compatiblity, I leave it for a while.
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

		/**
		* @private
		*/
		allowHtmlChanged: function () {
			this.$.title.setAllowHtml(this.allowHtml);
			this.$.titleBelow.setAllowHtml(this.allowHtml);
			this.$.subTitleBelow.setAllowHtml(this.allowHtml);
		},

		/**
		* @private
		*/
		backgroundSrcChanged: function () {
			var bgs = (enyo.isArray(this.backgroundSrc)) ? this.backgroundSrc : [this.backgroundSrc];
			bgs = enyo.map(bgs, function (inBackgroundSource) { return inBackgroundSource ? 'url(' + inBackgroundSource + ')' : null; });
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
			// If this.backgroundPosition is set explicitly to inherit or initial, apply that instead of assuming a position.
			if (bgp === 'inherit' || bgp === 'initial') {
				this.applyStyle('background-position', bgp);
				return;
			}
			var posArray = bgp && bgp.split(' ') || [],
				posStr = (posArray.length === 0) ? 'top right': (posArray.length === 1) ? posArray[0] + ' right': bgp;
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

			// TODO - animator should track initial positions so we don't have to store these if we want to reverse the animation
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
		typeChanged: function (inOld) {
			switch (inOld) {
			case 'medium':
				this.removeClass('moon-medium-header');
				break;
			case 'small':
				this.removeClass('moon-small-header');
				break;
			}

			switch (this.getType()) {
			case 'medium':
				this.addClass('moon-medium-header');
				break;
			case 'small':
				this.addClass('moon-small-header');
				break;
			}
		},

		/**
		* Note: This method will be deprecated soon. For backward compatiblity, I leave it for a while.
		*
		* @private
		*/
		smallChanged: function () {
			this.addRemoveClass('moon-medium-header', this.getSmall());
		},

		/**
		* @private
		*/
		contentChanged: function () {
			this.$.title.setContent( this.getTitleUpperCase() ? enyo.toUpperCase(this.title || this.content) : (this.title || this.content) );
			this.placeholderChanged();
		},

		/**
		* For backward-compatibility with original API
		*
		* @private
		*/
		titleChanged: function () {
			this.contentChanged();
			this.placeholderChanged();
		},

		/**
		* @private
		*/
		placeholderChanged: function () {
			// For backward-compatibility with original API
			this.$.titleInput.set('placeholder', this.getTitleUpperCase() ? enyo.toUpperCase(this.placeholder || this.title || this.content) : (this.placeholder || this.title || this.content) );
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
			this.$.titleAbove.setContent(this.titleAbove);
		},

		/**
		* @private
		*/
		titleBelowChanged: function () {
			this.$.titleBelow.setContent(this.titleBelow || '');
		},

		/**
		* @private
		*/
		subTitleBelowChanged: function () {
			this.$.subTitleBelow.setContent(this.subTitleBelow || '');
		},

		/**
		* @private
		*/
		animationComplete: function (inSender, inEvent) {
			// Do something?
		},

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
		* Create custom event for _input_ events
		*
		* @fires moon.Header#event:onInputHeaderInput
		* @private
		*/
		handleInput: function (inSender, inEvent) {
			this.doInputHeaderInput(inEvent);
		},

		/**
		* Create custom event for _change_ events
		*
		* @fires moon.Header#event:onInputHeaderChange
		* @private
		*/
		handleChange: function (inSender, inEvent) {
			this.doInputHeaderChange(inEvent);
		},


		/**
		* Enlarge listActionDrawer's height to large type's height
		*
		* @private
		*/
		handleListActionOpenChanged: function (inSender, inEvent) {
			if (!inEvent.open) {
				return;
			}
			inEvent.originator.beforeOpenDrawer(this.standardHeight, this.getType());
		}
	});

})(enyo, this);
