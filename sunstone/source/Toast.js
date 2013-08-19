/**
	_sun.Toast_ is an <a href="#sun.Toast">sun.Toast</a> that appears at the
	TopMiddle of the screen.
*/
enyo.kind({
	name: "sun.Toast",
	kind: "enyo.Popup",
	classes: "sun sun-toast",
	modal: true,
	floating: true,
	scrim: false,
	//* @protected
	tools: [
		{name: "client"},	
	],
	statics: { count: 0 },
	defaultZ: 120,
	timeoutJob: null,
	hideDelay: 5000,
	//* Creates chrome
	initComponents: function() {
		this.createChrome(this.tools);
		this.inherited(arguments);
	},
	//* Renders _moon.Toast_, extending enyo.Popup
	render: function() {
		this.allowHtmlChanged();
		this.contentChanged();
		this.inherited(arguments);
	},
	contentChanged: function() {
		this.$.client.setContent(this.content);
	},
	allowHtmlChanged: function() {
		this.$.client.setAllowHtml(this.allowHtml);
	},
	showingChanged: function() {
		if(this.showing) {
			sun.Toast.count++;
			this.applyZIndex();
		}
		else {
			if(sun.Toast.count > 0) {
				sun.Toast.count--;
			}
		}
		this.showHideScrim(this.showing);
		this.inherited(arguments);
	},
	showHideScrim: function(inShow) {
		if (this.floating && (this.scrim || (this.modal && this.scrimWhenModal))) {
			var scrim = this.getScrim();
			if (inShow) {
				// move scrim to just under the toast to obscure rest of screen
				var i = this.getScrimZIndex();
				this._scrimZ = i;
				scrim.showAtZIndex(i);
			} else {
				scrim.hideAtZIndex(this._scrimZ);
			}
			enyo.call(scrim, "addRemoveClass", [this.scrimClassName, scrim.showing]);
		}
	},
	getScrimZIndex: function() {
		// Position scrim directly below Toast
		return this.findZIndex()-1;
	},
	getScrim: function() {
		// show a transparent scrim for modal Toasts if scrimWhenModal is true
		// if scrim is true, then show a regular scrim.
		if (this.modal && this.scrimWhenModal && !this.scrim) {
			return moon.scrimTransparent.make();
		}
		return moon.scrim.make();
	},
	applyZIndex: function() {
		// Adjust the zIndex so that Toasts will properly stack on each other.
		this._zIndex = sun.Toast.count * 2 + this.findZIndex() + 1;
		// leave room for scrim
		this.applyStyle("z-index", this._zIndex);
	},
	findZIndex: function() {
		// a default z value
		var z = this.defaultZ;
		if (this._zIndex) {
			z = this._zIndex;
		} else if (this.hasNode()) {
			// Re-use existing zIndex if it has one
			z = Number(enyo.dom.getComputedStyleValue(this.node, "z-index")) || z;
		}
		this._zIndex = z;
		return this._zIndex;
	},
	hide: function() {
		this.inherited(arguments);
		clearTimeout(this.timeoutJob);
	},
	show: function() {
		this.inherited(arguments);
		this.timeoutJob = setTimeout(this.bindSafely("hide"), this.hideDelay);
	}
});

