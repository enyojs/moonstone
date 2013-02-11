/**
 * moon.Panels kind definition
 * @author: Lex Podgorny
 */

enyo.kind({
	name				: 'moon.Panels',
	kind 				: 'enyo.Panels',
	spotlight			: true,
	spotlightDecorate	: false,	

	published: {
	},
	handlers: {
		onSpotlightFocused			: 'onSpotlightFocused',
		onSpotlightContainerEnter	: 'onSpotlightPanelEnter',
		onSpotlightContainerLeave	: 'onSpotlightPanelLeave',
		ontap						: 'onTap',
	},
	events: {
		onIndexChange: '',
		onIndexChanged: ''
	},

	/************ PROTECTED **********/
	
	_bHasFocus: false,
	
	/************ PUBLIC *************/
	
	create: function(oSender, oEvent) {
		this.inherited(arguments);
		for (var n=0; n<this.getPanels().length; n++) {
			this.getPanels()[n].spotlight = 'container';
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
	
	onSpotlightPanelLeave: function(oSender, oEvent) {
		if (enyo.Spotlight.getPointerMode()) { return true; }
		var sEvent,
			nIndex = this.getIndex();
		
		switch (oEvent.direction) {
			case 'LEFT':
				this.doIndexChange({index: nIndex - 1});
				if (nIndex > 0) {
					this.setIndex(nIndex - 1);
					this._bHasFocus = false;
					return true;
				}
				sEvent = 'onSpotlightLeft';
				break;
			case 'RIGHT':
				this.doIndexChange({index: nIndex + 1});
				if (nIndex < this.getPanels().length - 1) {
					this.setIndex(nIndex + 1);
					this._bHasFocus = false;
					return true;
				}
				sEvent = 'onSpotlightRight';
				break;
			case 'UP':
				sEvent = 'onSpotlightUp';
				break;
			case 'DOWN':
				sEvent = 'onSpotlightDown';
				break;
			
		}
		
		if (typeof oEvent.direction != 'undefined') {
			this._bHasFocus = false;
			enyo.Spotlight.Util.dispatchEvent('onSpotlightBlur', null, enyo.Spotlight.getCurrent());
			enyo.Spotlight.setCurrent(this.parent)
			enyo.Spotlight.Util.dispatchEvent(sEvent, null, this.parent);
		}
		return true;
	},

	onSpotlightFocused: function(oSender, oEvent) {
		if (oEvent.originator !== this) { return false; }
		if (enyo.Spotlight.getPointerMode()) { return false; }
		
		if (this._bHasFocus) {														// Focus came from within
			this._bHasFocus = false;
		} else {																	// Focus came from without
			enyo.Spotlight.spot(this.getCurrentPanel());
			this._bHasFocus = true;
		}
		
		return false;
	},
	
	// Get index of a panel by it's reference
	getPanelIndex: function(oControl) {
		var oPanel 	= null;
		
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
	
	getCurrentPanel: function() {
		return this.getPanels()[this.getIndex()];
	},
	
	setIndex: function(n) {
		enyo.Spotlight.Decorator.Container.setFocus(this.getPanels()[this.getIndex()], false);
		this.inherited(arguments);
		this.getPanels()[n].spotlight = 'container';
		enyo.Spotlight.spot(this.getPanels()[n]);
		this.doIndexChanged({index: n});
	}
});