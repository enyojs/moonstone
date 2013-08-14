/**
	_moon.Panels_ extends <a href="#enyo.Panels">enyo.Panels</a>, adding support
	for 5-way focus (Spotlight).  By default, controls added to a _moon.Panels_
	are instances of <a href="#moon.Panel">moon.Panel</a>.
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
		/**
			The current design pattern; valid values are "none", "activity" (default),
			and "alwaysviewing".
		*/
		pattern: "activity"			
	},
	events: {
		// Fired when panel transition finished
		// inEvent.activeIndex: active index
		onPanelsPostTransitionFinished: ''
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
	draggable: false,
	panelCoverRatio: 1,				// 0 ~ 1
	showFirstBreadcrumb: false,		// none: false, activity: true, alwaysviewing: false
	arrangerKind: "moon.BreadcrumbArranger",

	//* @protected
	create: function(oSender, oEvent) {
		this._applyPattern();
		this.inherited(arguments);
		for (var n=0; n<this.getPanels().length; n++) {
			this.getPanels()[n].spotlight = 'container';
		}
	},

	// Returns true if the last spotted control was a child of this Panels.
	_hadFocus: function() {
		return enyo.Spotlight.Util.isChild(this, enyo.Spotlight.getLastControl());
	},

	_focusLeave: function(s5WayEventType) {
		enyo.Spotlight.Util.dispatchEvent(s5WayEventType, null, this);
	},

	//* @public
	//* Creates a panel on top of the stack and increments index to select that
	//* component.
	pushPanel: function(inInfo, inMoreInfo) { // added
		var lastIndex = this.getPanels().length - 1,
			oPanel = this.createComponent(inInfo, inMoreInfo);

		oPanel.render();
		this.resized();
		this.setIndex(lastIndex+1);
		return oPanel;
	},
	//* Creates multiple panels on top of the stack and updates index to select
	//* the last one created.
	pushPanels: function(inInfos, inCommonInfo) { // added
		var lastIndex = this.getPanels().length - 1,
			oPanels = this.createComponents(inInfos, inCommonInfo),
			nPanel;

		for (nPanel in oPanels) {
			oPanels[nPanel].render();
		}

		this.resized();
		this.setIndex(lastIndex+1);
		return oPanels;
	},
	//* Destroys panels whose index is greater than or equal to _inIndex_.
	popPanels: function(inIndex) {
		var panels = this.getPanels();
		inIndex = inIndex || panels.length - 1;

		while (panels.length > inIndex && inIndex >= 0) {
			panels[panels.length - 1].destroy();
		}
	},
	replacePanel: function(index, inInfo, inMoreInfo) {
		var panels = this.getPanels(),
			oPanel = null;

		if (panels.length > index) {
			panels[index].destroy();
			if (panels.length > index) {
				inMoreInfo = enyo.mixin({addBefore: panels[index]}, inMoreInfo);
			}
		}
		oPanel = this.createComponent(inInfo, inMoreInfo);
		oPanel.render();
		this.resized();
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
	next: function() {
		var nextIndex = this.clamp(this.index+1);
		if (nextIndex != this.getIndex()) {
			this.setIndex(nextIndex);
		}
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
		If there was a pre-transition from this control's children, checks whether
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
		} else {
			this.transitionIndex = inIndex;
			this.triggerPanelPreTransitions();
		}
	},
	finishTransition: function() {
		this.triggerPanelPostTransitions();
		this.inherited(arguments);
	},
	/**
		If any panel has a pre-transition, pushes the panel's index to
		_preTransitionWaitList_.
	*/
	triggerPanelPreTransitions: function() {
		var panels = this.getPanels(),
			options = {};

		this.preTransitionWaitlist = [];
		for(var i = 0, panel; (panel = panels[i]); i++) {
			options = this.getTransitionOptions(i, this.toIndex);
			if (panel.preTransition && panel.preTransition(this.fromIndex, this.toIndex, options)) {
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
		return true;
	},
	preTransitionComplete: function() {
		this.transitionReady = true;
		this.setIndex(this.transitionIndex);
		this.waterfallDown("onPanelPreTransitionFinished");
	},
	triggerPanelPostTransitions: function() {
		var panels = this.getPanels(),
			options = {};
		this.postTransitionWaitlist = [];
		for(var i = 0, panel; (panel = panels[i]); i++) {
			options = this.getTransitionOptions(i, this.toIndex);
			if (panel.postTransition && panel.postTransition(this.fromIndex, this.toIndex, options)) {
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
		return true;
	},
	postTransitionComplete: function() {
		var activeIndex = this.getIndex(), active;
		// parent and child of panels can get event
		this.doPanelsPostTransitionFinished({active: activeIndex});
		for (var i = 0; i < this.getPanels().length; i++) {
			this.getPanels()[i].waterfall("onPanelsPostTransitionFinished", {active: activeIndex, index: i});
		}
	},
	getTransitionOptions: function(fromIndex, toIndex) {
		if (this.layout.getTransitionOptions) {
			return this.layout.getTransitionOptions(fromIndex, toIndex);
		} else {
			return {};
		}
	},
	_applyPattern: function() {
		switch (this.pattern) {
		case "none":
			break;
		case "alwaysviewing":
			this.addClass("panels-50-percent-scrim");
			break;
		case "activity":
			/* falls through */
		default:
			this.showFirstBreadcrumb = true;
		}
	}
});
