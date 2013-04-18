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
			_transitionReady_ is the ready flag.
			If is has true, transition from arranger can be played.
			The other hand, transition should be blocked until some internal transitions are finished.
		*/
		transitionReady: false,		
	},
	handlers: {
		onSpotlightFocused			: 'onSpotlightFocused',
		onSpotlightContainerEnter	: 'onSpotlightPanelEnter',
		onSpotlightContainerLeave	: 'onSpotlightPanelLeave',
		ontap						: 'onTap',
		onTransitionFinish			: 'onBackwardTransitionFinished',
		onPreTransitionComplete		: 'panelPreTransitionComplete',
		onPostTransitionComplete	: 'panelPostTransitionComplete'
	},
	defaultKind: "moon.Panel",

	/************ PROTECTED **********/

	// Was last spotted control the panels's child?
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

	//* create component on stack top
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
	//* remove component if it is at stack top
	removeComponent: function(inComponent) { // added
		var lastIndex = this.getPanels().length - 1;
		if (this.getPanels()[lastIndex] === inComponent) {
			return this.inherited(arguments); 
		}
	},
	//* create component on top and changeIndex
	push: function(inInfo, inMoreInfo) { // added
		var lastIndex = this.getPanels().length - 1,
			oPanel = null;
		oPanel = this.createComponent(inInfo, inMoreInfo);
		oPanel.render();
		this.resized();
		this.setIndex(lastIndex+1);
		return oPanel;
	},
	//* create component on top and changeIndex
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
	//* changeIndex
	pop: function(toIndex) {
		this.setIndex(toIndex);
	},
	//* replace last panel
	replace: function(inInfo, inMoreInfo) {
		var lastIndex = this.getPanels().length - 1;
		this.getPanels()[lastIndex].destroy();
		this.push(inInfo, inMoreInfo);
	},
	//* destroy component on top 
	//*   if toIndex is set then pop to toIndex
	//*   if toIndex is undefined then pop one pannel	
	destroyPanels: function(toIndex) { // added
		var lastIndex = this.getPanels().length - 1;
		toIndex = (typeof(toIndex) == 'number') ? toIndex : lastIndex;
		while (lastIndex > -1 && lastIndex >= toIndex) {
			// Ask layout here about do I need to destroy panels.
			//    if layout provides isOutOfScreen and given index is out of screen then destroy
			if ( (this.layout && this.layout.isOutOfScreen && this.layout.isOutOfScreen(lastIndex)) || 
				(this.layout && !this.layout.isOutOfScreen) )  {
				this.getPanels()[lastIndex].destroy();
			}
			lastIndex = lastIndex - 1;	
		}
	},
	onBackwardTransitionFinished: function(oSender, oEvent) { // added
		if (oEvent.fromIndex > oEvent.toIndex) {
			this.destroyPanels(oEvent.toIndex+1);
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
		return false; //
	},


	// Focus left one of the panels
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

	// Get index of a panel by it's reference
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
		If there is any pre-transition from it's children,
		Check whether it was done or not.
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
		If there is any panel which has preTransition,
		put this panel index to preTransitionWainList
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
		
	}
});