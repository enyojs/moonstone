/**
 * moon.Panels kind definition
 * @author: Lex Podgorny
 */

enyo.kind({
	name				: 'moon.Panels',
	kind				: 'enyo.Panels',
	spotlight			: true,
	spotlightDecorate	: false,
	/**
		_refCounter_ is the counter which indicates how many pre-transition is required.
	*/
	refCounter			: 0,
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
		onPreTransitionFinish		: 'finishPreTransition'
	},
	defaultKind: "moon.Panel",

	/************ PROTECTED **********/

	// Was last spotted control the panels's child?
	_hadFocus: function() {
		return enyo.Spotlight.Util.isChild(this, enyo.Spotlight.getLastControl());
	},

	_focusLeave: function(s5WayEventType) {
		// console.log('PANELS LEAVE');
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

		if (!this._hadFocus()) {									// Focus came from without
			// console.log('PANELS FOCUS ENTER');
			enyo.Spotlight.spot(this.getActive());
		} else {
			// console.log('PANELS FOCUS LEAVE');
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
	setIndex: function(n) {
		// if (this.transitionReady) {
			this.inherited(arguments);
			this.getActive().spotlight = 'container';
			enyo.Spotlight.spot(this.getActive());
		// } else {
		// 	this.checkIfTransitionReady(n);
		// }
	},

	finishPreTransition: function() {
		this.refCounter--;
		if (this.refCounter == 0) {
			this.setTransitionReady(true);
			this.transition();
		}
	},
	
	/**
		Check whether child panel has transition or not.
		If they has it, start transition and then marks _transitionReady_ true.
		The property named _transitionReady_ means this object is ready to transit.
	*/
	checkPreTransition: function(panels) {
		var readyFlag = true;
		for (var i=0; i < panels.length; i++) {
			if (!panels[i].transitionReady) {
				panels[i].transitionReady = !(panels[i].transition && panels[i].transition()); // { animateClosed:true}
				this.refCounter += !panels[i].transitionReady;
				readyFlag &= panels[i].transitionReady;	
			}
			
		}
		return readyFlag;
	},
	
	checkIfTransitionReady: function(selectedIndex) {
		var panels = this.getPanels(),
			readyFlag = true;

		for (var i=0; i < panels.length; i++) {
			readyFlag &= panels[i].transitionReady;
		}

		if (readyFlag || this.checkPreTransition(panels)) {
			this.setTransitionReady(true);
			this.transition(selectedIndex);
		} 
	},

	transition: function(selectedIndex) {
		this.setIndex(selectedIndex);
	}
});