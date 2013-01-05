/**
	The _moon.Panels_ kind extends _enyo.Panels_, and provides support for
	spotlight events.
*/
enyo.kind({
	name: "moon.Panels",
	kind: "enyo.Panels",
	spotlight: true,
	//* @protected
	handlers: {
		onSpotlightFocus:  "_spotFocus"
	},
	//* Array of items that last had focus in each panel
	_lastFocused: [],
	
	//* Override _addControl_ to make sure each panel instance is spotlight-able
	addControl: function(inControl, inBefore) {
		this.inherited(arguments);
		inControl.spotlight = true;
	},

	/**
		Spotlight focus handler. If the originator of the focus event is a panel,
		set focus to the last focused item in that panel. Otherwise update
		_this.lastFocused[]_ with the originator.
	*/
	_spotFocus: function(inSender, inEvent) {
		// If panels gets focus, pass to current panel
		if(inEvent.originator === this) {
			enyo.Spotlight.spot(this.getActive());
			return true;
		}
		// If a panel gets focus, pass to last focused item
		if(this._isAPanel(inEvent.originator)) {
			this._handleFocusDirection(inEvent.dir)
			this._spotLastFocused();
			return true;
		}
		// Set last focused item for the current panel
		this._setLastFocused(inEvent.originator);
	},
	
	/**
		When a panel gets focus, call _this.next_ or _this.previous_ if the
		user pressed left or right
	*/
	_handleFocusDirection: function(dir) {
		switch(dir) {
			case "RIGHT":
				this.next();
				break;
			case "LEFT":
				this.previous();
				break;
			case "UP":
			case "DOWN":
				return false;
			default:
				break;
		}
		return true;
	},
	
	//* Set the last-focused control for the current panel
	_setLastFocused: function(control) {
		this._lastFocused[this.getIndex()] = control;
	},
	
	//* Spot the last focused control in the current panel
	_spotLastFocused: function() {
		var currentPanel = this.getActive();
		var lastFocused = this._lastFocused[this.getIndex()] || enyo.Spotlight.getFirstChild(currentPanel);
		if(!lastFocused) {
			enyo.log("Couldn't find focusable item in "+currentPanel.name+".");
			return;
		}
		enyo.Spotlight.spot(lastFocused);
	},
	
	//* Check whether the given control is a panel
	_isAPanel: function(control) {
		var panels = this.getPanels();
		for(var i=0;i<panels.length;i++) {
			if(control === panels[i]) {
				return true;
			}
		}
	}
});
