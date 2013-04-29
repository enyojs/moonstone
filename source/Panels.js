/**
 * moon.Panels kind definition
 * @author: Lex Podgorny
 */

enyo.kind({
	name				: 'moon.Panels',
	kind				: 'enyo.Panels',
	spotlight			: true,
	spotlightDecorate	: false,
	published: {
		/**
			The ready flag. If true, the transition from arranger can be played;
			otherwise, the transition should be delayed until some internal
			transitions have finished.
		*/
		transitionReady: false,		
	},
	handlers: {
		onSpotlightFocused			: 'onSpotlightFocused',
		onSpotlightContainerEnter	: 'onSpotlightPanelEnter',
		onSpotlightContainerLeave	: 'onSpotlightPanelLeave',
		ontap						: 'onTap',
		onTransitionFinish			: 'transitionFinish',
		onPreTransitionComplete		: 'panelPreTransitionComplete',
		onPostTransitionComplete	: 'panelPostTransitionComplete'
	},
	defaultKind: "moon.Panel",

	/************ PROTECTED **********/

	// Returns true if the last spotted control was a child of this Panels.
	_hadFocus: function() {
		return enyo.Spotlight.Util.isChild(this, enyo.Spotlight.getLastControl());
	},

	_focusLeave: function(s5WayEventType) {
		enyo.Spotlight.Util.dispatchEvent(s5WayEventType, null, this);
	},

	/************ PUBLIC *************/

	create: function(oSender, oEvent) {
		this.inherited(arguments);
		for (var n=0; n<this.getPanels().length; n++) {
			this.getPanels()[n].spotlight = 'container';
		}
	},

	//* Creates component on top of stack.
	createComponent: function(inInfo, inMoreInfo) { // added
		this.addBefore = undefined;
		var c = this.inherited(arguments);
		return c;
	},
	createComponents: function(inInfos, inCommonInfo) { // added
		this.addBefore = undefined;
		var cs = this.inherited(arguments);
		return cs;
	},
	//* Removes component if it is on top of stack.
	removeComponent: function(inComponent) { // added
		var lastIndex = this.getPanels().length - 1;
		if (this.getPanels()[lastIndex] === inComponent) {
			return this.inherited(arguments); 
		}
	},
	//* Creates component on top and changes index.
	push: function(inInfo, inMoreInfo) { // added
		var lastIndex = this.getPanels().length - 1,
			oPanel = null;
		oPanel = this.createComponent(inInfo, inMoreInfo);
		oPanel.render();
		this.resized();
		this.setIndex(lastIndex+1);
		return oPanel;
	},
	//* Creates component on top and changes index.
	pushs: function(inInfos, inCommonInfo) { // added
		var lastIndex = this.getPanels().length - 1,
			oPanels = null, oPanel = null;
		oPanels = this.createComponents(inInfos, inCommonInfo);
		for (var nPanel in oPanels) {
			oPanels[nPanel].render();
		}
		this.resized();
		this.setIndex(lastIndex+1);
		return oPanel;
	},
	//* Changes index.
	pop: function(inIndex) {
		var panels = this.getPanels(),
			inIndex = inIndex || panels.length - 1;
		
		while (panels.length > inIndex && inIndex >= 0) {
			panels[panels.length - 1].destroy();
		}
	},
	onTap: function(oSender, oEvent) {
		var n = this.getPanelIndex(oEvent.originator);

		if (n != -1 && n != this.getIndex()) {
			this.setIndex(n);
			enyo.Spotlight.setLast5WayControl(oEvent.originator);
			enyo.Spotlight.setPointerMode(false);
			return true;
		}
		return false;
	},
	// Called when focus leaves one of the panels.
	onSpotlightPanelLeave: function(oSender, oEvent) {
		if (oEvent.originator != this.getActive())	{ return false; }
		if (enyo.Spotlight.getPointerMode())		{ return true; }

		var nIndex = this.getIndex();

		switch (oEvent.direction) {
		case 'LEFT':
			if (nIndex > 0) {
				this.setIndex(nIndex - 1);
				return true;
			}
			this._focusLeave('onSpotlightLeft');
			break;
		case 'RIGHT':
			if (nIndex < this.getPanels().length - 1) {
				this.setIndex(nIndex + 1);
				return true;
			}
			this._focusLeave('onSpotlightRight');
			break;
		case 'UP':
			this._focusLeave('onSpotlightUp');
			break;
		case 'DOWN':
			this._focusLeave('onSpotlightDown');
			break;
		}
		return true;
	},

	onSpotlightFocused: function(oSender, oEvent) {
		if (oEvent.originator !== this) { return false; }
		if (enyo.Spotlight.getPointerMode()) { return false; }

		if (!this._hadFocus()) {
			enyo.Spotlight.spot(this.getActive());
		}

		return false;
	},

	// Gets index of a panel by its reference.
	getPanelIndex: function(oControl) {
		var oPanel = null;

		while (oControl.parent) {
			if (oControl.parent === this) {
				oPanel = oControl;
				break;
			}
			oControl = oControl.parent;
		}

		if (oPanel) {
			for (var n=0; n<this.getPanels().length; n++) {
				if (this.getPanels()[n] == oPanel) {
					return n;
				}
			}
		}

		return -1;
	},
	/**
		If there is any pre-transition from this control's children, checks whether
		it was done or not.
	*/
	setIndex: function(inIndex) {
		this.fromIndex = this.getIndex();
		this.toIndex = inIndex;
		
		if (this.transitionReady) {
			this.inherited(arguments);
			this.getActive().spotlight = 'container';
			enyo.Spotlight.spot(this.getActive());
			this.setTransitionReady(false);
			this.triggerPanelPostTransitions();
		} else {
			this.transitionIndex = inIndex;
			this.triggerPanelPreTransitions();
		}
	},
	/**
		If any panel has pre-transition, pushes the panel's index to
		preTransitionWaitList.
	*/
	triggerPanelPreTransitions: function() {
		var panels = this.getPanels();
		this.preTransitionWaitlist = [];
		for(var i = 0, panel; (panel = panels[i]); i++) {
			if (panel.preTransition && panel.preTransition(this.fromIndex, this.toIndex)) {
				this.preTransitionWaitlist.push(i);
			}
		}
		
		if (this.preTransitionWaitlist.length === 0) {
			this.transitionReady = true;
			this.setIndex(this.transitionIndex);
		}
	},
	panelPreTransitionComplete: function(inSender, inEvent) {
		var index = this.getPanels().indexOf(inSender);
		for (var i = 0; i < this.preTransitionWaitlist.length; i++) {
			if (this.preTransitionWaitlist[i] === index) {
				this.preTransitionWaitlist.splice(i,1);
				break;
			}
		}
		
		if (this.preTransitionWaitlist.length === 0) {
			this.preTransitionComplete();
		}
	},
	preTransitionComplete: function() {
		this.transitionReady = true;
		this.setIndex(this.transitionIndex);
	},
	
	triggerPanelPostTransitions: function() {
		var panels = this.getPanels();
		this.postTransitionWaitlist = [];
		for(var i = 0, panel; (panel = panels[i]); i++) {
			if (panel.postTransition && panel.postTransition(this.fromIndex, this.toIndex)) {
				this.postTransitionWaitlist.push(i);
			}
		}
		
		if (this.postTransitionWaitlist.length === 0) {
			this.postTransitionComplete();
		}
	},
	panelPostTransitionComplete: function(inSender, inEvent) {
		var index = this.getPanels().indexOf(inSender);
		for (var i = 0; i < this.postTransitionWaitlist.length; i++) {
			if (this.postTransitionWaitlist[i] === index) {
				this.postTransitionWaitlist.splice(i,1);
				break;
			}
		}
		
		if (this.postTransitionWaitlist.length === 0) {
			this.postTransitionComplete();
		}
	},
	postTransitionComplete: function() {
		// TODO - something here?
	}
});