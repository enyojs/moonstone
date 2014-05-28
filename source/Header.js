/**
 _moon.Header_ is a Moonstone-styled control with a large title and an area for
 additional controls.
 */
enyo.kind({
	name: "moon.Header",
	//* @protected
	classes: "moon-header",
	//* @public
	published: {
		//* Title of the header
		title: '',
		//* Text above the header
		titleAbove: '',
		//* Text below the header
		titleBelow: '',
		//* Sub-text below the header
		subTitleBelow: '',
		/** If small, the _moon-small-header_ CSS class will be applied to this header
			If mini, the _moon-mini-header_ CSS class will be applied to this header
			If large, the _moon-header_ CSS class will be applied to this header
		*/
		type: "large",
		//* If true, the _moon-small-header_ CSS class will be applied to this header
		// Note: This property will be deprecated soon. For backward compatiblity, I leave it for a while.
		small: false,
		/**
			URL of background image(s).
			This may be a string referring a single background image, or an array of
			strings referring to multiple background images.
		*/
		backgroundSrc: null,
		/**
			Position of background image, defined as a string of the form _"vertical
			horizontal"_, with a space separating the _vertical_ and _horizontal_
			properties (e.g., _"top right"_). If no second property is included, the
			horizontal value will default to _right_.
			As with _backgroundSrc_, an array of strings may be supplied to position
			multiple background images. The order of items should be the same as in
			_backgroundSrc_.
		*/
		backgroundPosition: "top right",
		//* When using a full-bleed background image, set this property to true to indent
		//* the header text/controls and remove the header lines
		fullBleedBackground: false,
		//* If true, title will be an input
		inputMode: false,
		//* When true, input will be blurred on Enter keypress (if focused)
		dismissOnEnter: false,
		//* Text to display when the input is empty
		placeholder: "",
		//* The value of the input
		value: "",
		//* When true, the title text will be converted to locale-safe uppercasing
		titleUpperCase: true
	},
	//* @protected
	mixins: ["moon.MarqueeSupport"],
	marqueeOnSpotlight: false,
	marqueeOnHover: true,
	marqueeOnRender: true,
	marqueeOnRenderDelay: 10000,
	handlers: {
		oninput: "handleInput",
		onchange: "handleChange",
		onRequestCreateListActions: "handleRequestCreateComponents",
		onExpand: "handleExpandDrawer"
	},
	//* @public
	events: {
		//* Custom input event to allow apps to differentiate between inputs and header inputs
		onInputHeaderInput: "",
		//* Custom input change event to allow apps to differentiate between input changes and header input changes
		onInputHeaderChange: ""
	},
	//* @protected
	components: [{
		name: "texts",
		components: [{
			name: "titleAbove",
			classes: "moon-super-header-text moon-header-title-above"
		}, {
			name: "titleWrapper",
			classes: "moon-header-title-wrapper",
			components: [{
				name: "title",
				kind: "moon.MarqueeText",
				classes: "moon-header-font moon-header-title",
				canGenerate: false
			}, {
				name: "inputDecorator",
				kind: "moon.InputDecorator",
				classes: "moon-input-header-input-decorator",
				canGenerate: false,
				components: [{
					name: "titleInput",
					kind: "moon.Input",
					classes: "moon-header-text moon-header-title"
				}]
			}]
		}, {
			name: "titleBelow",
			kind: "moon.MarqueeText",
			classes: "moon-header-title-below"
		}, {
			name: "subTitleBelow",
			kind: "moon.MarqueeText",
			classes: "moon-header-sub-title-below"
		}]
	}, {
		name: "client",
		classes: "moon-hspacing moon-header-client"
	}, {
		name: "animator",
		kind: "enyo.StyleAnimator",
		onComplete: "animationComplete"
	}],
	bindings: [
		{from: ".value", to: ".$.titleInput.value", oneWay: false},
		{from: ".dismissOnEnter", to: ".$.titleInput.dismissOnEnter"}
	],
	create: function() {
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
	allowHtmlChanged: function() {
		this.$.title.setAllowHtml(this.allowHtml);
		this.$.titleBelow.setAllowHtml(this.allowHtml);
		this.$.subTitleBelow.setAllowHtml(this.allowHtml);
	},
	backgroundSrcChanged: function() {
		var bgs = (enyo.isArray(this.backgroundSrc)) ? this.backgroundSrc : [this.backgroundSrc];
		bgs = enyo.map(bgs, function(inBackgroundSource) { return inBackgroundSource ? "url(" + inBackgroundSource + ")" : null; });
		this.applyStyle("background-image", (bgs.length) ? bgs.join(", ") : null);
	},
	backgroundPositionChanged: function() {
		var bgp = this.backgroundPosition;
		if (enyo.isArray(bgp)) {
			bgp = (bgp.length) ? bgp.join(", ") : null;
		}
		// If this.backgroundPosition is set explicitly to inherit or initial, apply that instead of assuming a position.
		if (bgp === "inherit" || bgp === "initial") {
			this.applyStyle("background-position", bgp);
			return;
		}
		var posArray = bgp && bgp.split(" ") || [],
			posStr = (posArray.length === 0) ? "top right": (posArray.length === 1) ? posArray[0] + " right": bgp;
		this.applyStyle("background-position", posStr);
	},
	fullBleedBackgroundChanged: function() {
		this.addRemoveClass("full-bleed", this.fullBleedBackground);
	},
	handleRequestCreateComponents: function(inSender, inEvent) {
		this.controlParent = null;
		this.createComponents(inEvent.components, {owner: inEvent.originator});
		this.discoverControlParent();
	},
	//* @public
	//* Collapses the drawer, hiding its contents.
	collapseToSmall: function() {
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
			"height": myStyle["height"]
		};
		this.$.titleWrapper.smallAnimProps = {
			"padding-left": titleWrapperStyle["padding-left"],
			"top": titleWrapperStyle["top"]
		};
		this.$.title.smallAnimProps = {};
		this.$.titleAbove.smallAnimProps = {
			"height": titleAboveStyle["height"],
			"opacity": titleAboveStyle["opacity"]
		};
		this.$.titleBelow.smallAnimProps = {
			"top": titleBelowStyle["top"]
		};
		this.$.subTitleBelow.smallAnimProps = {
			"top": subTitleBelowStyle["top"]
		};

		this.$.animator.newAnimation({
			name: "collapseToSmall",
			duration: 200,
			timingFunction: "linear",
			keyframes: {
				0: [{
					control: this,
					properties: {
						"height": "current"
					}
				}, {
					control: this.$.titleWrapper,
					properties: {
						"padding-left": "current",
						"top": "current"
					}
				}, {
					control: this.$.titleAbove,
					properties: {
						"height": "current",
						"opacity": "current",
						"margin-top": "current"
					}
				}, {
					control: this.$.title,
					properties: {}
				}, {
					control: this.$.titleBelow,
					properties: {
						"top": "current"
					}
				}, {
					control: this.$.subTitleBelow,
					properties: {
						"top": "current"
					}
				}],
				70: [],
				100: [{
					control: this,
					properties: {
						"height": "260px"
					}
				}, {
					control: this.$.titleWrapper,
					properties: {}
				}, {
					control: this.$.titleAbove,
					properties: {
						"height": 0,
						"opacity": 0,
						"margin-top": 0
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
		this.$.animator.play("collapseToSmall");
		this.collapsed = true;
	},
	//* Expands the drawer, showing its contents.
	expandToLarge: function() {
		if (!this.collapsed) {
			return;
		}

		this.$.animator.newAnimation({
			name: "expandToLarge",
			duration: 200,
			timingFunction: "linear",
			keyframes: {
				0: [{
					control: this,
					properties: {
						"height": "current"
					}
				}, {
					control: this.$.titleWrapper,
					properties: {
						"padding-left": "current",
						"top": "current"
					}
				}, {
					control: this.$.titleAbove,
					properties: {
						"height": "current",
						"opacity": "current",
						"margin-top": "current"
					}
				}, {
					control: this.$.title,
					properties: {}
				}, {
					control: this.$.titleBelow,
					properties: {
						"top": "current"
					}
				}, {
					control: this.$.subTitleBelow,
					properties: {
						"top": "current"
					}
				}],
				30: [],
				100: [{
					control: this,
					properties: {
						"height": this.smallAnimProps.height
					}
				}, {
					control: this.$.titleWrapper,
					properties: {
						"padding-left": this.$.titleWrapper.smallAnimProps["padding-left"],
						"top": this.$.titleWrapper.smallAnimProps["top"]
					}
				}, {
					control: this.$.titleAbove,
					properties: {
						"height": this.$.titleAbove.smallAnimProps["height"],
						"opacity": this.$.titleAbove.smallAnimProps["opacity"],
						"margin-top": this.$.titleAbove.smallAnimProps["margin-top"]
					}
				}, {
					control: this.$.title,
					properties: {}
				}, {
					control: this.$.titleBelow,
					properties: {
						"top": this.$.titleBelow.smallAnimProps["top"]
					}
				}, {
					control: this.$.subTitleBelow,
					properties: {
						"top": this.$.subTitleBelow.smallAnimProps["top"]
					}
				}]
			}
		});
		this.$.animator.play("expandToLarge");
		this.collapsed = false;
	},
	//* @protected
	typeChanged: function(inOld) {
		switch (inOld) {
		case "small":
			this.removeClass("moon-small-header");
			break;
		case "mini":
			this.removeClass("moon-mini-header");
			break;
		}

		switch (this.getType()) {
		case "small":
			this.addClass("moon-small-header");
			break;
		case "mini":
			this.addClass("moon-mini-header");
			break;
		}		
	},
	//* @protected
	// Note: This method will be deprecated soon. For backward compatiblity, I leave it for a while.
	smallChanged: function() {
		this.addRemoveClass("moon-small-header", this.getSmall());
	},	
	//* @protected
	contentChanged: function() {
		this.$.title.setContent( this.getTitleUpperCase() ? enyo.toUpperCase(this.title || this.content) : (this.title || this.content) );
		this.placeholderChanged();
	},
	//* @protected
	// For backward-compatibility with original API
	titleChanged: function() {
		this.contentChanged();
		this.placeholderChanged();
	},
	placeholderChanged: function() {
		// For backward-compatibility with original API
		this.$.titleInput.set("placeholder", this.getTitleUpperCase() ? enyo.toUpperCase(this.placeholder || this.title || this.content) : (this.placeholder || this.title || this.content) );
	},
	//* @protected
	titleUpperCaseChanged: function() {
		this.titleChanged();
	},
	//* @protected
	titleAboveChanged: function() {
		this.$.titleAbove.addRemoveClass('no-border', this.titleAbove === '');
		this.$.titleAbove.setContent(this.titleAbove);
	},
	//* @protected
	titleBelowChanged: function() {
		this.$.titleBelow.setContent(this.titleBelow || '');
	},
	//* @protected
	subTitleBelowChanged: function() {
		this.$.subTitleBelow.setContent(this.subTitleBelow || '');
	},
	//* @protected
	animationComplete: function(inSender, inEvent) {
		// Do something?
	},
	//* @protected
	inputModeChanged: function() {
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
		this.addRemoveClass("moon-input-header", this.inputMode);
	},
	//* Create custom event for _input_ events
	handleInput: function(inSender, inEvent) {
		this.doInputHeaderInput(inEvent);
	},
	//* Create custom event for _change_ events
	handleChange: function(inSender, inEvent) {
		this.doInputHeaderChange(inEvent);
	},
	//* Expand header to large type before expand drawer.
	handleExpandDrawer: function (inSender, inEvent) {
		this.setType("large");
	}
});
