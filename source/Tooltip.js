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
			it or presses ESC. Note that this property only affects behavior when the
			Tooltip is used independently--not when it is used with TooltipDecorator.
		*/
		autoDismiss: false,
		//* Hovering over the decorator for this length of time (in milliseconds)
		//* causes the tooltip to appear
		showDelay: 500,
		/**
			Position of the tooltip with respect to the activating control.  Valid
			values are "above", "below", and "auto".
		*/
		position: "auto",
		//* Default _margin-left_ value
		defaultLeft: 0,
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
		var content = this.getContent();
		this.$.client.setContent( this.getContentUpperCase() ? enyo.toUpperCase(content) : content);
	},
	contentUpperCaseChanged: function() {
		this.contentChanged();
	},
	positionChanged:function() {
		this.inherited(arguments);
		this.adjustPosition(true);
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
				pBounds = this.parent.getAbsoluteBounds(),
				pClients = this.parent.getClientControls(),
				acBounds =null;

			//* Get the activating control
			for (var i=0; i < pClients.length; i++) {
				if (this.get("id") !== pClients[i].id) {
					acBounds = pClients[i].getAbsoluteBounds();
				}
			}
			//* Calculate the difference between decorator and activating
			//* control's top, left, right differences, position tooltip against
			//* the activating control instead of the decorator accordingly.
			var paTopDiff = pBounds.top - acBounds.top,
				paLeftDiff =  acBounds.left - pBounds.left;
				paRightDiff = pBounds.left + pBounds.width - acBounds.left - acBounds.width,
				acRight = window.innerWidth - moonDefaultPadding - acBounds.left - acBounds.width;

			//* When there is not enough room in the bottom, move it above the
			//* decorator; when the tooltip bottom is within window height but
			//* set programmatically above, move it above
			if ((window.innerHeight - moonDefaultPadding) - (pBounds.top + pBounds.height) < b.height + 5 || (this.position == "above")) {
				this.removeClass("below");
				this.addClass("above");
				if (this.get("floating")) {
					this.applyPosition({"top": (acBounds.top - b.height - 5) + "px", "left": acBounds.left + acBounds.width / 2 + "px", "right": "auto"});
				} else {
					this.applyPosition({"top": -(b.height + 5 + paTopDiff) + "px", "left": acBounds.width / 2 + paLeftDiff + "px", "right": "auto"});			
				}
			}

			//* When there is not enough space above the parent container, move
			//* it below the decorator; when there is enough space above the
			//* parent container but is set programmatically, leave it below
			if (pBounds.top < (b.height + 5) || (this.position == "below") || this.hasClass("below")) {
				this.removeClass("above");
				this.addClass("below");
				if (this.get("floating")) {
					this.applyPosition({"top": acBounds.top + acBounds.height + 5 + "px", "left": acBounds.left + acBounds.width / 2 + "px", "right": "auto"});
				} else {
					this.applyPosition({"top": pBounds.height + 5 + paTopDiff + "px", "left": acBounds.width / 2 + paLeftDiff + "px", "right": "auto"});
				}
			}

			//* When there is not enough room on the left, using right-arrow for the tooltip
			if (window.innerWidth - moonDefaultPadding - pBounds.left - pBounds.width / 2 < b.width){
				//* use the right-arrow
				this.removeClass("left-arrow");
				this.addClass("right-arrow");
				this.applyPosition({"margin-left": -b.width + "px", "left": "auto"});
				if (this.floating) {
					this.applyStyle("right", acBounds.width / 2 + acRight + moonDefaultPadding + "px");
				} else {
					this.applyStyle("right", acBounds.width / 2 + paRightDiff + "px");
				}
			}
		}
	},
	resizeHandler: function() {
		this.applyPosition({"margin-left": this.defaultLeft, "bottom": "auto"});
		this.adjustPosition(true);
		this.inherited(arguments);
	}
});
