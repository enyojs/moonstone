/**
	_moon.Tooltip_ is a popup that works in conjunction with
	[moon.TooltipDecorator](#moon.TooltipDecorator). It automatically displays a
	tooltip when the user hovers over the decorator for a given period of time.
	The tooltip is positioned around the decorator where there is available window
	space.

		{kind: "moon.TooltipDecorator", components: [
			{kind: "moon.Button", content: "Tooltip"},
			{kind: "moon.Tooltip", content: "I'm a tooltip for a button."}
		]}

	You may force the tooltip to appear by calling its _show()_ method.
*/

enyo.kind({
	name: "moon.Tooltip",
	kind: "enyo.Popup",
	//* @protected
	classes: "moon-tooltip below left-arrow",
	//* @public
	published: {
		/**
			This value overrides the default value of _autoDismiss_ inherited from
			_enyo.Popup_. If true, the Tooltip will hide when the user taps outside of
			it or presses ESC.  Note that this property only affects behavior when the
			Tooltip is used independently--not when it is used with TooltipDecorator.
		*/
		autoDismiss: false,
		//* Hovering over the decorator for this length of time (in milliseconds)
		//* causes the tooltip to appear.
		showDelay: 500,
		//* Whether to position the tooltip above or below the activator.  Valid values are
		//* "above", "below", or "auto".
		position: "auto",
		//* Default _margin-left_ value
		defaultLeft: 10,
		//* When true, the content will be converted to locale-safe uppercasing
		contentUpperCase: true
	},
	//* @protected
	captureEvents: false,
	handlers: {
		onRequestShowTooltip: "requestShow",
		onRequestHideTooltip: "requestHide"
	},
	tools: [
		{name: "client", classes: "moon-tooltip-label moon-header-font"}
	],
	initComponents: function() {
		this.createChrome(this.tools);
		this.inherited(arguments);
	},
	create: function() {
		this.inherited(arguments);
		this.contentChanged();
	},
	contentChanged: function() {
		this._orgContent = this.getContent();
		this.$.client.setContent( this.getContentUpperCase() ? enyo.toUpperCase(this._orgContent) : this._orgContent );
	},
	contentUpperCaseChanged: function() {
		this.content = this._orgContent;
		this.contentChanged();
	},
	requestShow: function() {
		this.startJob("showJob", "show", this.showDelay);
		return true;
	},
	cancelShow: function() {
		this.stopJob("showJob");
	},
	requestHide: function() {
		this.cancelShow();
		return this.inherited(arguments);
	},
	showingChanged: function() {
		this.cancelShow();
		this.inherited(arguments);
		this.adjustPosition(true);
	},
	applyPosition: function(inRect) {
		var s = "";
		for (var n in inRect) {
			s += (n + ":" + inRect[n] + (isNaN(inRect[n]) ? "; " : "px; "));
		}
		this.addStyles(s);
	},
	adjustPosition: function(belowActivator) {
		if (this.showing && this.hasNode()) {

			var b = this.node.getBoundingClientRect(),
				moonDefaultPadding = 20,
				pBounds = null;

			//when the tooltip bottom goes below the window height move it above the decorator
			if ((b.top + b.height > window.innerHeight - moonDefaultPadding) || (this.position == "above")) {
				this.removeClass("below");
				this.addClass("above");
				if (this.get("floating")) {
					pBounds = this.parent.getAbsoluteBounds();
					this.applyStyle("top", (pBounds.top - b.height) + "px" );
					this.applyStyle("left", (pBounds.left + (pBounds.width / 2)) + "px" );
				}
				else {
					this.applyStyle("top", -b.height + "px");
				}
			}
			if ((b.top  < 0) || (this.position == "below")) {
				this.removeClass("above");
				this.addClass("below");
				if (this.get("floating")) {
					pBounds = this.parent.getAbsoluteBounds();
					this.applyStyle("top", (pBounds.top + pBounds.height) + "px" );
					this.applyStyle("left", (pBounds.left + (pBounds.width / 2)) + "px" );
				}
				else {
					this.applyStyle("top", "100%");
				}
			}

			// FIXME: Leaving the following commented until verification from UX
			//when the tooltip top goes above the window height move it below the decorator
			/*
			if (b.top < 0) {
				this.addRemoveClass("below", true);
				this.addRemoveClass("above", false);
			} else {
				this.addRemoveClass("above", true);
				this.addRemoveClass("below", false);
			}
			*/

			//when the tooltip's right edge is out of the window, align its right edge with the decorator left edge (approx)
			if (b.left + b.width > window.innerWidth - moonDefaultPadding){
				//use the right-arrow
				this.applyPosition({"margin-left": -b.width + "px"});
				this.removeClass("left-arrow");
				this.addClass("right-arrow");
			}
		}
	},
	resizeHandler: function() {
		//reset the tooltip to align its left edge with the decorator
		this.applyPosition({"margin-left": this.defaultLeft, "bottom": "auto"});
		this.addRemoveClass("left-arrow", true);
		this.addRemoveClass("right-arrow", false);
		this.applyStyle("top", "100%");
		this.adjustPosition(true);
		this.inherited(arguments);
	}
});
