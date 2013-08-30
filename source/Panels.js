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
	queuedIndex: null,

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
	//*
	setIndex: function(inIndex) {
		inIndex = this.clamp(inIndex);

		if (this.toIndex !== null) {
			this.queuedIndex = inIndex;
			return;
		}

		this.fromIndex = this.index;
		this.toIndex = inIndex;

		this.queuedIndex = null;
		this.triggerPanelPreTransitions(this.fromIndex, this.toIndex);
	},
	_setIndex: function(inIndex) {
		if (this.fromIndex === this.toIndex) {
			this.finishTransition();
			return;
		}

		var prev = this.get("index");
		this.index = this.clamp(inIndex);
		this.notifyObservers("index", prev, inIndex);
	},
	//* Called when the arranger animation completes
	completed: function() {
		if (this.$.animator.isAnimating()) {
			this.$.animator.stop();
		}
		this.fraction = 1;
		this.stepTransition();
		this.triggerPanelPostTransitions(this.fromIndex, this.toIndex);
		return true;
	},
	//* If any panel has a pre-transition, pushes the panel's index to _preTransitionWaitList_.
	triggerPanelPreTransitions: function(inFromIndex, inToIndex) {
		var panels = this.getPanels(),
			options = {};

		this.preTransitionWaitlist = [];

		for(var i = 0, panel; (panel = panels[i]); i++) {
			options = this.getTransitionOptions(i, inToIndex);
			if (panel.preTransition && panel.preTransition(inFromIndex, inToIndex, options)) {
				this.preTransitionWaitlist.push(i);
			}
		}

		if (this.preTransitionWaitlist.length === 0) {
			this.preTransitionComplete();
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
	//* Called after all pre transitions have been completed. Triggers standard _setIndex_ functionality.
	preTransitionComplete: function() {
		this._setIndex(this.toIndex);
		enyo.Spotlight.spot(this.getActive());
		this.waterfallDown("onPanelPreTransitionFinished");
	},
	triggerPanelPostTransitions: function(inFromIndex, inToIndex) {
		var panels = this.getPanels(),
			options = {};

		this.postTransitionWaitlist = [];

		for(var i = 0, panel; (panel = panels[i]); i++) {
			options = this.getTransitionOptions(i, inToIndex);
			if (panel.postTransition && panel.postTransition(inFromIndex, inToIndex, options)) {
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
		var activeIndex = this.getIndex();
		this.doPanelsPostTransitionFinished({active: activeIndex});
		for (var i = 0; i < this.getPanels().length; i++) {
			this.getPanels()[i].waterfall("onPanelsPostTransitionFinished", {active: activeIndex, index: i});
		}

		this.finishTransition();
	},
	//* When index changes, make sure to update the breadcrumbed panel _spotlight_ property (to avoid spotlight issues)
	indexChanged: function() {
		var activePanel = this.getActive();
		
		if (activePanel.isBreadcrumb) {
			activePanel.removeSpottableBreadcrumbProps();
		}

		this.inherited(arguments);
	},
	finishTransition: function() {
		this.inherited(arguments);

		if (this.queuedIndex !== null) {
			this.setIndex(this.queuedIndex);
		}
	},
	getTransitionOptions: function(fromIndex, toIndex) {
		return this.layout.getTransitionOptions && this.layout.getTransitionOptions(fromIndex, toIndex) || {};
	},
	_applyPattern: function() {
		switch (this.pattern) {
		case "none":
			break;
		case "alwaysviewing":
			this.addClass("always-viewing-panels panels-50-percent-scrim");
			break;
		case "activity":
			this.addClass("activity-panels");
			this.showFirstBreadcrumb = true;
			break;
		default:
			break;
		}
	}
});
