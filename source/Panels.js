/**
	_moon.Panels_ extends <a href="#enyo.Panels">enyo.Panels</a>, adding support
	for 5-way focus (Spotlight).  By default, controls added to a _moon.Panels_
	are instances of <a href="#moon.Panel">moon.Panel</a>.
 */

enyo.kind({
	name				: 'moon.Panels',
	kind				: 'enyo.Panels',
	classes				: 'moon-panels',
	spotlightDecorate	: false,
	published: {
		/**
			The current design pattern; valid values are "none", "activity" (default),
			and "alwaysviewing".
		*/
		pattern: "activity",
		//* Handle is hided automatically in this time amount
		autoHideTimeout: 4000
	},
	events: {
		// Fired when panels transition by show is finished
		onShowFinished: "",
		// Fired when panels transition by hide is finished
		onHideFinished: "",
		// Fired when panel transition by setIndex is finished 
		// inEvent.activeIndex: active index
		onPanelsPostTransitionFinished: ''
	},
	handlers: {
		onSpotlightFocused			: 'onSpotlightFocused',
		onSpotlightContainerLeave	: 'onSpotlightPanelLeave',
		ontap						: 'onTap',
		onTransitionFinish			: 'transitionFinish',
		onPreTransitionComplete		: 'panelPreTransitionComplete',
		onPostTransitionComplete	: 'panelPostTransitionComplete',
		ontransitionend				: 'cssTransitionEnded'
	},
	patternTools: [
		{
			name: "backgroundScrim",
			kind: enyo.Control,
			classes: "moon-panels-background-scrim"
		},
		{
			name: "client",
			kind: enyo.Control,
			classes: "enyo-fill enyo-arranger moon-panels-client",
			components: [
				{name: "scrim", classes: "moon-panels-panel-scrim"}
			]
		},
		{
			name: "spotable",
			kind: enyo.Control,
			spotlight: true,
			classes: "moon-panels-spotable off",
			ontap: "togglePanelsShowHide",
			onSpotlightFocused: "onSpotableFocused",
			onSpotlightBlur: "onSpotableBlur",
			onSpotlightRight: "onSpotableRight",
			components: [
				{name: "spot", classes: "moon-panels-spot"}
			]
		}
	],
	//* @protected
	defaultKind: "moon.Panel",
	draggable: false,
	panelCoverRatio: 1,				// 0 ~ 1
	showFirstBreadcrumb: false,		// none: false, activity: true, alwaysviewing: false
	arrangerKind: "moon.BreadcrumbArranger",
	queuedIndex: null,
	showing: false,
	_transitionCommand: "",

	initComponents: function() {
		this._applyPattern();
		this.inherited(arguments);
	},
	createComponents: function(inC, inOpts) {
		var inherited = this.createComponents._inherited;
		if (inC && !inOpts.isChrome) {
			for (var n=0; n<inC.length; n++) {
				if (!(inC[n].isChrome)) {
					inC[n].spotlight = 'container';
				}
			}
		}
		return inherited.call(this, inC, inOpts);
	},
	createComponent: function(inC, inOpts) {
		var inherited = this.createComponent._inherited;
		if (inC && !inC.isChrome && !inOpts.isChrome) {
			inC.spotlight = 'container';
		}
		return inherited.call(this, inC, inOpts);
	},
	// Returns true if the last spotted control was a child of this Panels.
	_hadFocus: function() {
		return enyo.Spotlight.Util.isChild(this, enyo.Spotlight.getLastControl());
	},

	_focusLeave: function(s5WayEventType) {
		enyo.Spotlight.Util.dispatchEvent(s5WayEventType, null, this);
	},

	onTap: function(oSender, oEvent) {
		var n = this.getPanelIndex(oEvent.originator);
		if (n == -1) {
			// Tapped on other than panel (Scrim, etc)
			if (this.pattern === "alwaysviewing" && this.openPanels) {
				this.hide();
				enyo.Spotlight.spot(this);
			}
		} else {
			// Tapped on panel
			if (n != this.getIndex()) {
				// Tapped on not current panel (breadcrumb)
				this.setIndex(n);
				enyo.Spotlight.setLast5WayControl(oEvent.originator);
				enyo.Spotlight.setPointerMode(false);
			}
		}
		return false;
	},
	_applyPattern: function() {
		switch (this.pattern) {
		case "none":
			break;
		case "alwaysviewing":
			this.addClass('moon-dark-gray moon-panels-fullscreen alwaysviewing');
			this.createChrome(this.patternTools);
			this.panelCoverRatio = 0.5;
			break;
		case "activity":
			this.addClass('moon-dark-gray moon-panels-fullscreen activity');
			this.createChrome(this.patternTools);
		default:
			this.showFirstBreadcrumb = true;
		}
	},
	onSpotableRight: function(inSender, inEvent) {
		if (this.isOpened()) {
			return true;
		}
	},
	onSpotableFocused: function(inSender, inEvent) {
		this.showHandle();
		this.stopHandleAutoHide();
	},
	onSpotableBlur: function(inSender, inEvent) {
		this.showHandle();
		this.resetHandleAutoHide();
	},
	resetHandleAutoHide: function(inSender, inEvent) {
		this.startJob("autoHide", this.bindSafely("hideHandle"), this.getAutoHideTimeout());
	},
	stopHandleAutoHide: function(inSender, inEvent) {
		this.stopJob("autoHide");
	},
	//* Show handle without focusing
	showHandle: function(inSender, inEvent) {
		this.$.spotable.addRemoveClass('off', false);
	},
	//* Hide handle 
	hideHandle: function(inSender, inEvent) {
		this.$.spotable.addRemoveClass('off', true);
	},
	isHandleShowing: function() {
		return !this.$.spotable.hasClass('off');
	},
	isOpened: function() {
		return this.openPanels;
	},
	cssTransitionEnded: function(inSender, inEvent) {
		if (inEvent.originator === this.$.client) {
			switch (this._transitionCommand) {
			case "show":
				this._transitionCommand = "";
				this.$.spotable.addRemoveClass("right", true);
				this.doShowFinished(inEvent);
				enyo.Spotlight.spot(this.getActive());
				this.openPanels = true;
				break;
			case "hide":
				this._transitionCommand = "";
				// this.$.client.hide();
				this.$.spotable.addRemoveClass("right", false);
				this.doHideFinished(inEvent);
				this.openPanels = false;
				break;
			default:
				// other transition inside of panels
			}
		}
		if (inEvent.originator === this.$.spot) {
			switch (inEvent.propertyName) {
			case "transform":
			case "-webkit-transform":
				this.$.spotable.addRemoveClass("gray", !this.$.spotable.hasClass('spotlight'));
				break;
			default:
				// other transition inside of panels
			}
		}
	},
	
	
	//* @public
	/**
		Returns an array of contained panels.
		Subclasses can override this if they don't want the arranger to layout all of their children
	*/
	getPanels: function() {
		return this.getClientControls();
	},
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
	//* Destroy right panel and create panel without transition effect. */
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
	// Called when focus leaves one of the panels.
	onSpotlightPanelLeave: function(oSender, oEvent) {
		if (oEvent.originator != this.getActive())	{ return false; }
		if (enyo.Spotlight.getPointerMode())		{ return true; }

		var nIndex = this.getIndex();
		switch (oEvent.direction) {
		case 'LEFT':
			if (nIndex > 0) {
				this.setIndex(nIndex - 1);
				break;
			} else if (this.toIndex === null && this.openPanels) {
				this.hide();
				break;
			}
			this._focusLeave('onSpotlightLeft');
			break;
		case 'RIGHT':
			if (this.$.spotable && this.layout.joinedPanels[nIndex + 1] === undefined) {
				enyo.Spotlight.spot(this.$.spotable);
				break;
			} else if (nIndex < this.getPanels().length - 1) {
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
	onSpotlightFocus: function(oSender, oEvent) {
		if (oEvent.originator === this && this.isHandleShowing() ) { 
			return true; 
		}
	},
	onSpotlightFocused: function(oSender, oEvent) {
		if (oEvent.originator !== this) { return false; }
		if (enyo.Spotlight.getPointerMode()) { return true; }

		// Check if child of panels is last spotted control
		if (!this._hadFocus()) {
			enyo.Spotlight.spot(this.getActive());
		}

		return false;
	},
	/** Gets index of a panel by its reference. */
	getPanelIndex: function(oControl) {
		var oPanel = null;

		while (oControl.parent) {
			// Parent of a panel can be a client or a panels.
			if (oControl.parent === this.$.client || oControl.parent === this) {
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
		var index = this.getPanels().indexOf(inEvent.originator);

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
		var index = this.getPanels().indexOf(inEvent.originator);

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
	finishTransition: function() {
		this.inherited(arguments);
		
		if (this.queuedIndex !== null) {
			this.setIndex(this.queuedIndex);
		}
	},
	togglePanelsShowHide: function() {
		if (this.openPanels) {
			this._hidePanels();
		} else {	
			this._showPanels();
		}
	},
	showingChanged: function() {
		if (this.showing) {
			this._showPanels();
		} else {
			this._hidePanels();
		}
	},
	//* Show panals with transition from right */
	_showPanels: function() {
		this.spotlight = true;
		this._transitionCommand = "show";
		this.$.spotable.addRemoveClass("gray", false);
		this.$.backgroundScrim.addRemoveClass("on", true);
		enyo.dom.transformValue(this.$.client, "translateX", 0);
		enyo.Signals.send("onPanelsShown");
	},
	//* Hide panals with transition to right */
	_hidePanels: function() {
		this.spotlight = false;
		this._transitionCommand = "hide";
		this.$.backgroundScrim.addRemoveClass("on", false);
		enyo.dom.transformValue(this.$.client, "translateX", enyo.dom.getWindowWidth()+15 + "px");
		enyo.Signals.send("onPanelsHidden");
	},
	getTransitionOptions: function(fromIndex, toIndex) {
		return this.layout.getTransitionOptions && this.layout.getTransitionOptions(fromIndex, toIndex) || {};
	}
});