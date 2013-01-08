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
		var dir = inEvent.dir,
			control = inEvent.originator,
			index = -1;
		
		// If panels gets focus, pass to current panel
		if(control === this) {
			enyo.Spotlight.spot(this.getActive(), dir);
			return true;
		}
		
		// If a panel gets focus, handle event based on the focus direction
		if(this._isAPanel(control)) {
			this._handleFocusDirection(dir);
			return true;
		}
		
		// Get the index of the panel that the spotlighted item belongs to
		index = this._getContainingPanelIndex(control);
		// Set last focused item for the given panel
		this._setLastFocused(control, index);
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
			default:
				this._spotLastFocused();
				break;
		}
	},
	
	//* Set the last-focused control for the given panel	TODO - this is NOT efficient!
	_setLastFocused: function(inControl, inIndex) {
		inIndex = inIndex || this.getIndex();
		if(this._isChildOfIndex(inControl, inIndex)) {
			this._lastFocused[inIndex] = inControl;
		}
	},
	
	//* Return the last-focused control for the given panel
	_getLastFocused: function(inIndex) {
		return this._lastFocused[inIndex] || enyo.Spotlight.getFirstChild(this.getActive());
	},
	
	//* Spot the last focused control in the current panel
	_spotLastFocused: function() {
		var lastFocused = this._getLastFocused(this.getIndex());
		if(!lastFocused) {
			enyo.Spotlight.setCurrent(this.getActive());
			return true;
		}
		enyo.Spotlight.spot(lastFocused);
		return true;
	},
	
	//* Check whether the given control is a panel
	_isAPanel: function(inControl) {
		var panels = this.getPanels();
		for(var i=0;i<panels.length;i++) {
			if(inControl === panels[i]) {
				return true;
			}
		}
	},
	
	/**
		Determine if _inControl_ is a child of the panel at _inIndex_. If _inIndex_ is
		not specified, use current index.
	*/
	_isChildOfIndex: function(inControl, inIndex) {
		inIndex = inIndex || this.getIndex();
		var panelIndex = this._getContainingPanelIndex(inControl);
		return panelIndex === inIndex;
	},
	
	//* Return the index of the parent panel of _inControl_
	_getContainingPanelIndex: function(inControl) {
		var parent = inControl.parent,
			panels = this.getPanels();
		
		while(parent !== this) {
			for(var i=0;i<panels.length;i++) {
				if(parent === panels[i]) {
					return i;
				}
			}
			parent = parent.parent;
		}
		
		return -1;
	},
	
	//* Spot the specified control or the last focused control on index changes
	next: function(inControl) {
		if(inControl) {
			this._setLastFocused(inControl, this.getIndex() + 1)
		}
		this.inherited(arguments);
	},
	previous: function(inControl) {
		if(inControl) {
			this._setLastFocused(inControl, this.getIndex() - 1)
		}
		this.inherited(arguments);
	},
	setIndexDirect: function(inIndex, inControl) {
		if(inControl) {
			this._setLastFocused(inControl, inIndex)
		}
		this.inherited(arguments);
	},
	//* After usual setIndex() logic, spot the last focused item for the current index
	setIndex: function(inIndex, inControl) {
		if(inControl) {
			this._setLastFocused(inControl, inIndex)
		}
		this.inherited(arguments);
		this._spotLastFocused();
	}
});
