/**
	_moon.Button_ is an [enyo.Button](#enyo.Button) with Moonstone styling
	applied. The color of the button may be customized by specifying a background
	color.

	For more information, see the documentation on
	[Buttons](building-apps/controls/buttons.html) in the Enyo Developer Guide.
*/

enyo.kind({
	name: 'moon.Button',
	kind: 'enyo.Button',
	//* @protected
	mixins: ["moon.MarqueeSupport"],
	//* @public
	published: {
		/**
			A parameter indicating the size of the button.
			If true, the diameter of this button is 60px.
			However, the button's tap target still has a diameter of 78px, so there is
			invisible DOM that wraps the small button to provide the larger tap zone.
		*/
		small: false,
		/**
			A parameter indicating the minimum width of the button. If true, the
			min-width should be set 180px wide (the small button is set 130px). When
			false, the min-width should be the current @moon-button-height (forcing it
			to be no smaller than a circle).
		*/
		minWidth: true
	},
	//* @protected
	classes: 'moon-large-button-text moon-button enyo-unselectable',
	spotlight: true,
	handlers: {
		//* _onSpotlightSelect_ simulates _mousedown_.
		onSpotlightSelect	: 'depress',
		//* _onSpotlightKeyUp_ simulates _mouseup_.
		onSpotlightKeyUp	: 'undepress',
		//* Also make sure we remove the pressed class if focus is removed from
		//* this item before it receives a keyup.
		onSpotlightBlur		: 'undepress',
		//* _onSpotlightFocus_ bubble _requestScrollIntoView_ event
		onSpotlightFocused	: "spotFocused"
	},
	//* On creation, updates based on value of _this.small_.
	initComponents: function() {
		if (!(this.components && this.components.length > 0)) {
			this.createComponent({name: "client", kind:"moon.MarqueeText", isChrome: true});
		}
		this.smallChanged();
		this.minWidthChanged();
		this.inherited(arguments);
	},
	//* Adds _pressed_ CSS class.
	depress: function() {
		this.addClass('pressed');
	},
	//* Bubble _requestScrollIntoView_ event
	spotFocused: function(inSender, inEvent) {
		if (inEvent.originator === this) {
			this.bubble("onRequestScrollIntoView");
		}
	},
	//* Removes _pressed_ CSS class.
	undepress: function() {
		this.removeClass('pressed');
	},
	//* If _this.small_ is true, adds a child that increases the tap area.
	smallChanged: function() {
		if (this.$.tapArea) {
			this.$.tapArea.destroy();
		}

		if (this.small) {
			this.addClass('small');
			this.addClass('moon-small-button-text');
			var ta = this.createComponent({name: "tapArea", classes: "small-button-tap-area", isChrome: true});
			if (this.generated) {
				ta.render();
			}
		} else {
			this.removeClass('small');
			this.removeClass('moon-small-button-text');
		}
		this.contentChanged();
	},
	//* Override to handle potential child components.
	contentChanged: function() {
		var content = this.getContent();
		if (this.$.client) {
			this.$.client.setContent( this.getContentUpperCase() ? enyo.toUpperCase(content) : content );
		} else {
			this.inherited(arguments);
		}
	},
	contentUpperCaseChanged: function() {
		this.contentChanged();
	},
	minWidthChanged: function() {
		if (this.minWidth) {
			this.addClass('min-width');
		} else {
			this.removeClass('min-width');
		}
	}
});
