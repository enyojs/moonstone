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
	},
	handlers: {
		onSpotlightFocused			: 'onSpotlightFocused',
		onSpotlightContainerEnter	: 'onSpotlightPanelEnter',
		onSpotlightContainerLeave	: 'onSpotlightPanelLeave',
		ontap						: 'onTap',
		onTransitionFinish			: 'onBackwardTransitionFinished'
	},

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
		this.destroyPanels();
		this.push(inInfo, inMoreInfo);
	},
	//* destroy component on top 
	//*   if toIndex is set then pop to toIndex
	//*   if toIndex is undefined then pop one pannel	
	destroyPanels: function(toIndex) { // added
		var lastIndex = this.getPanels().length - 1;
		toIndex = (typeof(toIndex) == 'number') ? toIndex : lastIndex;
		while (lastIndex > -1 && lastIndex >= toIndex) {
			this.getPanels()[lastIndex].destroy();
			lastIndex = this.getPanels().length - 1;	
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

	setIndex: function(n) {
		this.inherited(arguments);
		this.getActive().spotlight = 'container';
		enyo.Spotlight.spot(this.getActive());
	}
});