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
		//* The current design pattern; valid values are "none" (default), "activity", and "alwaysviewing".
		//* Note, pattern must be set at craete-time; changes to pattern after create time have no effect
		pattern: "none",
		//* Handle is hided automatically in this time amount
		autoHideTimeout: 4000,
		//* When "true", create handle; when "false", not create handle, when "auto" (default), true for alwaysviewing and false for activity;
		//* This property can be set only at creation time
		useHandle: "auto",
		//* When true (default), set do not show handle; when false, show handle
		handleShowing: true
	},
	events: {
		// Fired when panel transition by setIndex is finished
		// inEvent.activeIndex: active index
		onPanelsPostTransitionFinished: "",
		onHidePanels: ""
	},
	handlers: {
		ontap:						"onTap",

		onSpotlightRight:			"spotlightRight",
		onSpotlightLeft:			"spotlightLeft",
		onSpotlightContainerLeave:	"onSpotlightPanelLeave",
		onSpotlightContainerEnter:	"onSpotlightPanelEnter",

		onTransitionFinish:			"transitionFinish",
		onPreTransitionComplete:	"panelPreTransitionComplete",
		onPostTransitionComplete:	"panelPostTransitionComplete"
	},
	handleTools: [
		{name: "backgroundScrim", kind: "enyo.Control", classes: "moon-panels-background-scrim", showing: false},
		{name: "clientWrapper", kind: "enyo.Control", classes: "enyo-fill enyo-arranger moon-panels-client", components: [
			{name: "scrim", classes: "moon-panels-panel-scrim"},
			{name: "client", tag: null}
		]},
		{name: "showHideHandle", kind: "enyo.Control", classes: "moon-panels-handle hidden", canGenerate: false,
			ontap: "handleTap", onSpotlightLeft: "handleSpotLeft", onSpotlightRight: "handleSpotRight", onSpotlightFocus: "handleFocus", onSpotlightBlur: "handleBlur"
		},
		{name: "showHideAnimator", kind: "StyleAnimator", onComplete: "animationComplete"}
	],

	//* @protected

	//* Use _moon.Panel_s by default
	defaultKind: "moon.Panel",
	//* Disable dragging
	draggable: false,
	//* 0 ~ 1
	panelCoverRatio: 1,
	//* activity: true, alwaysviewing: false
	showFirstBreadcrumb: false,
	//* Default to using _moon.BreadcrumbArranger_
	arrangerKind: "moon.BreadcrumbArranger",
	//* Index of panel which is set in the middle of transition
	queuedIndex: null,
	//* Flag for initial transition
	_initialTransition: true,


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
	//* Destroy right panel and create panel without transition effect. */
	replacePanel: function(index, inInfo, inMoreInfo) {
		var oPanel = null;

		if (this.getPanels().length > index) {
			this.getPanels()[index].destroy();
			if (this.getPanels().length > index) {
				inMoreInfo = enyo.mixin({addBefore: this.getPanels()[index]}, inMoreInfo);
			}
		}
		oPanel = this.createComponent(inInfo, inMoreInfo);
		oPanel.render();
		this.resized();
	},
	/** Returns the panel index of a control contained within a panel, or -1 otherwise */
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
	/** Returns true if the control is a child panel of this _moon.Panels_ */
	isPanel: function(inControl) {
		for (var n=0; n<this.getPanels().length; n++) {
			if (this.getPanels()[n] == inControl) {
				return true;
			}
		}
	},

	//* @protected

	initComponents: function() {
		this.applyPattern();
		this.inherited(arguments);
		this.initializeShowHideHandle();
		this.handleShowingChanged();
	},
	rendered: function() {
		this.inherited(arguments);

		// Direct hide if not showing and using handle
		if (this.useHandle === true) {
			if (this.showing) {
				this._directShow();
			} else {
				this._directHide();
			}
		}
	},
	onTap: function(oSender, oEvent) {
		if (oEvent.originator === this.$.showHideHandle || this.pattern === "none") {
			return;
		}

		if (this.shouldHide(oEvent)) {
			if (this.showing && this.useHandle === true) {
				this.hide();
			}
		} else {
			var n = (oEvent.breadcrumbTap) ? this.getPanelIndex(oEvent.originator) : -1;
			// If tapped on not current panel (breadcrumb), go to that panel
			if (n >= 0 && n !== this.getIndex()) {
				this.setIndex(n);
			}
		}
	},
	shouldHide: function(oEvent) {
		return (oEvent.originator === this.$.clientWrapper || (oEvent.originator instanceof moon.Panel && this.isPanel(oEvent.originator)));
	},
	//* Prevent event bubble up when parent of originator is client
	spotlightLeft: function(oSender, oEvent) {
		if (oEvent.originator.parent === this.$.client || oEvent.originator.parent === this) {
			if (this.getIndex() > 0 && this.showing) {
				return true;
			}
		}
	},
	//* Prevent event bubble up when parent of originator is client
	spotlightRight: function(oSender, oEvent) {
		if (oEvent.originator.parent === this.$.client || oEvent.originator.parent === this) {
			if (this.getIndex() < this.getPanels().length - 1) {
				return true;
			}
		}
	},
	//* Tap on show/hide handle
	handleTap: function() {
		enyo.Spotlight.unspot();
		this.setShowing(!this.showing);
	},
	handleSpotLeft: function() {
		if (this.showing) {
			enyo.Spotlight.spot(this.getActive());
			return true;
		}
	},
	handleSpotRight: function(inSender, inEvent) {
		if (this.showing) {
			return true;
		}
	},
	handleBlur: function() {
		this.resetHandleAutoHide();
	},
	resetHandleAutoHide: function(inSender, inEvent) {
		this.startJob("autoHide", "stashHandle", this.getAutoHideTimeout());
	},
	stopHandleAutoHide: function(inSender, inEvent) {
		this.stopJob("autoHide");
	},
	stashHandle: function() {
		this.$.showHideHandle.addRemoveClass("stashed", !this.showing);
	},
	unstashHandle: function() {
		this.stopHandleAutoHide();
		this.$.showHideHandle.removeClass("stashed");
	},
	handleFocus: function() {
		this.unstashHandle();
	},
	handleShowingChanged: function() {
		//* show handle only when useHandle is true
		if (this.useHandle !== true) { return; }
		this.$.showHideHandle.addRemoveClass('hidden', !this.handleShowing);
		this.$.showHideHandle.spotlight = this.handleShowing;
	},
	//* Called when focus enters one of the panels. If currently hiding and _this.useHandle_ is true,
	//* show handle.
	onSpotlightPanelEnter: function() {
		if (!this.showing && this.useHandle === true) {
			enyo.Spotlight.spot(this.$.showHideHandle);
			return true;
		}
	},
	//* Called when focus leaves one of the panels
	onSpotlightPanelLeave: function(inSender, inEvent) {
		var direction = inEvent.direction;

		// Ignore panel leave events that don't come from active panel
		if (inEvent.originator != this.getActive())	{
			return false;
		}

		// Kill leave events that come from pointer mode
		if (enyo.Spotlight.getPointerMode()) {
			return true;
		}

		if (direction === "LEFT") {
			// If leaving to the left and we're not at first panel, go to previous panel
			if (this.getIndex() > 0) {
				this.previous();
				return true;
			}
			// If leaving to the left and we are at the first panel, hide panels
			else if (this.toIndex === null && this.showing && this.useHandle === true) {
				this.hide();
				return true;
			}
		}
		else if (direction === "RIGHT") {
			// If leaving to the right and handle is enabled, spot the handle (unless next panel is joined to current)
			if (this.useHandle === true && this.layout.joinedPanels && this.layout.joinedPanels[this.getIndex() + 1] === undefined) {
				enyo.Spotlight.spot(this.$.showHideHandle);
				return true;
			}
			// If leaving to the right and handle is not enabled, go to next panel
			else if (this.getIndex() < this.getPanels().length - 1) {
				this.next();
				return true;
			}
		}
	},
	setIndex: function(inIndex) {
		inIndex = this.clamp(inIndex);

		if (inIndex === this.index) {
			return;
		}

		if (this.toIndex !== null) {
			this.queuedIndex = inIndex;
			return;
		}

		this.fromIndex = this.index;
		this.toIndex = inIndex;

		this.queuedIndex = null;

		// If panels will move for this index change, kickoff animation. Otherwise skip it.
		if (this.shouldArrange()) {
			this.triggerPanelPreTransitions(this.fromIndex, this.toIndex);
		}
		else {
			this.skipArrangerAnimation();
		}
	},
	//* Return _true_ if any panels will move in the transition from _this.fromIndex_ to _this.toIndex_
	shouldArrange: function() {
		return this.layout.shouldArrange ? this.layout.shouldArrange(this.fromIndex, this.toIndex) : true;
	},
	//* Skip animation and jump to next arrangement
	skipArrangerAnimation: function() {
		this._setIndex(this.toIndex);
		this.completed();
	},
	_setIndex: function(inIndex) {
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

		this.finishTransition(true);

		for (var i = 0; i < this.getPanels().length; i++) {
			this.getPanels()[i].waterfall("onPanelsPostTransitionFinished", {active: activeIndex, index: i});
		}
	},
	//* When index changes, make sure to update the breadcrumbed panel _spotlight_ property (to avoid spotlight issues)
	indexChanged: function() {
		var activePanel = this.getActive();

		if (activePanel && activePanel.isBreadcrumb) {
			activePanel.removeSpottableBreadcrumbProps();
		}

		this.inherited(arguments);
	},
	finishTransition: function(sendEvents) {
		this.inherited(arguments);

		if (this.queuedIndex !== null) {
			this.setIndex(this.queuedIndex);
		}
		// Don't change focus unless this was an actual transition (indicated
		// by sendEvents being true
		if (sendEvents) {
			enyo.Spotlight.spot(this.getActive());
		}
	},
	//* Override default _getShowing()_ behavior to avoid setting _this.showing_ based on the CSS _display_ property
	getShowing: function() {
		return this.showing;
	},
	//* Returns true if this and all parents are showing.
	getAbsoluteShowing: function() {
		var b = this.getBounds();

		if ((b.height === 0 && b.width === 0)) {
			return false;
		}

		if (this.parent && this.parent.getAbsoluteShowing) {
			return this.parent.getAbsoluteShowing();
		} else {
			return true;
		}
	},
	showingChanged: function() {
		if (this.useHandle === true) {
			if (this.showing) {
				this.unstashHandle();
				this._show();
			}
			else {
				this.resetHandleAutoHide();
				this._hide();
			}
			return;
		}

		this.inherited(arguments);
	},
	applyPattern: function() {
		switch (this.pattern) {
		case "alwaysviewing":
			this.applyAlwaysViewingPattern();
			break;
		case "activity":
			this.applyActivityPattern();
			break;
		default:
			this.useHandle = false;
			break;
		}
	},
	applyAlwaysViewingPattern: function() {
		this.addClass('always-viewing');
		this.panelCoverRatio = 0.5;
		this.useHandle = (this.useHandle === "auto") ? true : this.useHandle;
		this.createChrome(this.handleTools);
		this.breadcrumbGap = 20;
	},
	applyActivityPattern: function() {
		this.addClass('activity');
		this.showFirstBreadcrumb = true;
		this.useHandle = (this.useHandle === "auto") ? false : this.useHandle;
		this.createChrome(this.handleTools);
		this.breadcrumbGap = 0;
	},
	initializeShowHideHandle: function() {
		if (this.useHandle === true) {
			this.$.showHideHandle.canGenerate = true;
			this.$.showHideHandle.spotlight = true;
		}
	},
	//* Show panels with transition from right
	_show: function() {
		if (!this.hasNode()) {
			return;
		}

		this.$.backgroundScrim.show();
		this.$.showHideHandle.addClass("right");	
		this.$.showHideAnimator.play(this.createShowAnimation().name);
		enyo.Signals.send("onPanelsShown");
	},
	//* Hide panels with transition to right
	_hide: function() {
		if (!this.hasNode()) {
			return;
		}
		this.$.showHideHandle.removeClass("right");	
		this.$.showHideAnimator.play(this.createHideAnimation().name);
		enyo.Signals.send("onPanelsHidden");
	},
	//* Set to show state without animation
	_directShow: function() {
		this.$.backgroundScrim.show();
		this.$.showHideHandle.addClass("right");
		if (this.handleShowing) {
			this.$.showHideHandle.removeClass("hidden");
		}
	},
	//* Set to hide state without animation
	_directHide: function() {
		var x = this.getOffscreenXPosition();
		this.$.showHideHandle.addClass("hidden");
		this.$.showHideHandle.removeClass("right");
		this.$.clientWrapper.applyStyle("-webkit-transform", "translate3d( " + x + "px, 0, 0)");
		this.hideAnimationComplete();
	},
	createShowAnimation: function() {
		return this.$.showHideAnimator.newAnimation({
			name: "show",
			duration: 500,
			timingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1)",
			keyframes: {
				0: [
					{control: this.$.clientWrapper, properties: { "-webkit-transform": "current" }}
				],
				100: [
					{control: this.$.clientWrapper, properties: { "-webkit-transform": "translate3d(0, 0, 0)" }}
				]
			}
		});
	},
	createHideAnimation: function() {
		var x = this.getOffscreenXPosition();
		return this.$.showHideAnimator.newAnimation({
			name: "hide",
			duration: 500,
			timingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1)",
			keyframes: {
				0: [
					{control: this.$.clientWrapper, properties: { "-webkit-transform": "current" }}
				],
				100: [
					{control: this.$.clientWrapper, properties: { "-webkit-transform": "translate3d( " + x + "px, 0, 0)" }}
				]
			}
		});
	},
	getOffscreenXPosition: function() {
		return this.$.clientWrapper.getBounds().width;
	},
	//* Hide/show animation complete
	animationComplete: function(inSender, inEvent) {
		switch (inEvent.animation.name) {
		case "show":
			this.showAnimationComplete();
			return true;
		case "hide":
			this.hideAnimationComplete();
			return true;
		}
	},
	showAnimationComplete: function() {
		if (this.handleShowing) {
			this.$.showHideHandle.removeClass("hidden");
		}
		enyo.Spotlight.spot(this.getActive());
	},
	hideAnimationComplete: function() {
		if (this.handleShowing) {
			this.$.showHideHandle.removeClass("hidden");
		}
		this.$.backgroundScrim.hide();
	},
	getTransitionOptions: function(fromIndex, toIndex) {
		return this.layout.getTransitionOptions && this.layout.getTransitionOptions(fromIndex, toIndex) || {};
	}
});