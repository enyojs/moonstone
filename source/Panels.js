/**
	The _moon.Panels_ kind extends _enyo.Panels_, and provides support for
	spotlight events.
	
	For more information, see the
	[Panels documentation](https://github.com/enyojs/enyo/wiki/Panels) in the Enyo
	Developer Guide.
*/
enyo.kind({
	name: "moon.Panels",
	kind: "enyo.Panels",
	spotlight: true,

	//* @protected
	handlers: {
		onSpotlightFocus:  "_spotFocus"
	},
	
	draggable: false,
	
	/*
		Override _addControl_ to make sure each panel instance is spotlight-able
		and has a _lastFocused_ property
	*/
	addControl: function(inControl, inBefore) {
		this.inherited(arguments);
		enyo.mixin(inControl, {
			spotlight: true,
			_lastFocused: null
		});
	},
	
	/**
		Spotlight focus handler. If the originator of the focus event is a panel,
		set focus to the last focused item in that panel. Otherwise update the
		_lastFocused_ property of the originator.
	*/
	_spotFocus: function(inSender, inEvent) {
		var dir = inEvent.dir,
			control = inEvent.originator;
		
		// If panels gets focus, either pass focus to current panel or out of
		// panels (if the current focused item is a panel)
		if(control === this) {
			if(this.isPanel(enyo.Spotlight.getCurrent())) {
				this._spotEscape(dir);
			} else {
				this._spotLastFocused();
			}
			return true;
		}
		
		// If a panel gets focus, handle event based on the focus direction
		if(this.isPanel(control)) {
			this._handleFocusDirection(dir, control);
			return true;
		}

		// Set last focused item for the given panel
		this._setLastFocused(this._getContainingPanel(control), control);
	},
	
	/**
		When a panel gets focus, call _this.next_ or _this.previous_ if the
		user pressed left or right
	*/
	_handleFocusDirection: function(inDirection, inControl) {
		switch(inDirection) {
			case "RIGHT":
				this.next();
				break;
			case "LEFT":
				this.previous();
				break;
			case "UP":
			case "DOWN":
				this._spotEscape(inDirection);
				break;
			default:
				enyo.Spotlight.setCurrent(inControl);
				break;
		}
	},
	
	//* Move spotlight to next adjacent control of _this_
	_spotEscape: function(inDirection) {
		enyo.Spotlight.spot(enyo.Spotlight._getAdjacentControl(inDirection, this));
	},
	
	//* Set the last-focused control for the given panel
	_setLastFocused: function(inPanel, inControl) {
		inPanel = inPanel || this.getActive();
		if(inControl.isDescendantOf(inPanel)) {
			inPanel._lastFocused = inControl;
		}
	},
	
	//* Return the last-focused control for the given panel
	_getLastFocused: function(inPanel) {
		return inPanel._lastFocused || enyo.Spotlight.getFirstChild(inPanel);
	},
	
	//* Spot the last focused control in the given panel
	_spotLastFocused: function(inPanel) {
		inPanel = inPanel || this.getActive();
		var lastFocused = inPanel._lastFocused || enyo.Spotlight.getFirstChild(inPanel);
		if(lastFocused) {
			enyo.Spotlight.spot(lastFocused);
		} else {
			enyo.Spotlight.setCurrent(inPanel);
		}
	},
	
	//* Return the index of the parent panel of _inControl_
	_getContainingPanel: function(inControl) {
		for(var i=0, panels = this.getPanels();i<panels.length;i++) {
			if(inControl.isDescendantOf(panels[i])) {
				return panels[i];
			}
		}
	},
	
	//* Check whether the given control is a panel
	isPanel: function(inControl) {
		var panels = this.getPanels();
		for(var i=0;i<panels.length;i++) {
			if(inControl === panels[i]) {
				return true;
			}
		}
	},
	
	//* Spot the specified control or the last focused control on index changes
	next: function(inControl) {
		if(inControl) {
			this._setLastFocused(this.getPanels()[this.getIndex()+1], inControl);
		}
		this.inherited(arguments);
	},
	previous: function(inControl) {
		if(inControl) {
			this._setLastFocused(this.getPanels()[this.getIndex()-1], inControl);
		}
		this.inherited(arguments);
	},
	setIndexDirect: function(inIndex, inControl) {
		if(inControl) {
			this._setLastFocused(this.getPanels()[this.getIndex()], inControl);
		}
		this.inherited(arguments);
	},
	//* After usual setIndex() logic, spot the last focused item for the current index
	setIndex: function(inIndex, inControl) {
		if(inControl) {
			this._setLastFocused(this.getPanels()[this.getIndex()], inControl);
		}
		this.inherited(arguments);
		this._spotLastFocused();
	},
	// Automatically jump index to any panel body that was tapped
	tap: function(inSender, inEvent) {
		var tapped = enyo.indexOf(inEvent.originator, this.getPanels());
		if ((tapped >= 0) && (tapped != this.getIndex())) {
			this.setIndex(tapped);
		}
	}
});
