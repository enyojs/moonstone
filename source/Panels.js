/**
	_moon.Panels_ extends [enyo.Panels](#enyo.Panels), adding support for 5-way
	focus (Spotlight) and pre-configured Moonstone panels design patterns. By
	default, controls added to a _moon.Panels_ are instances of
	[moon.Panel](#moon.Panel).
 */
enyo.kind({
	name				: 'moon.Panels',
	kind				: 'enyo.Panels',
	//* @protected
	classes				: 'moon-panels',
	spotlightDecorate	: false,
	//* @public
	published: {
		/**
			A convenience property for configuring _moon.Panels_ according to a
			particular design pattern.  Valid values are "none" (default), "activity",
			and "alwaysviewing". Note that this property may only be set at creation
			time, and should not be changed at runtime.

			The "alwaysviewing" pattern uses the _moon.BreadcrumbArranger_ with
			semi-transparent panels (depending on the color theme) over the right half
			of the screen, allowing multiple breadcrumbs to accumulate on the left
			half of the screen.

			The "activity" pattern  uses the _moon.BreadcrumbArranger_, with opaque
			panels over the full screen, with only one breadcrumb showing onscreen.

			The "none" pattern should be used when selecting other arrangers, such as
			_enyo.CarouselArranger_ or _enyo.CardArranger_.
		*/
		pattern: "none",
		/**
			When handle is used, it is automatically hidden after this amount of time
			(in milliseconds)
		*/
		autoHideTimeout: 4000,
		/**
			When true, a handle is created to allow the user to control the showing
			state of the panels using animation. When false, no handle is created and
			panels can only be hidden/shown programmatically with no animation.
			When "auto" (the default), _useHandle_ is set to true if _pattern_ is
			"alwaysviewing" and set to false if the _pattern_ is "activity". Note that
			this property may only be set at creation time, and should not be changed
			at runtime. This property only has an effect when using the "activity" or
			"alwaysviewing" pattern.
		*/
		useHandle: "auto",
		/**
			Dynamically controls whether the handle is showing.
			When true (the default), the handle is shown and panels may be shown by
			activating the handle and hidden by re-activating the handle or by tapping
			outside the panel area. When false, the handle is hidden and panels may
			only be shown or hidden programmatically using the _showing_ property or
			the _hide()_/_show()_ API. This property only has an effect when the value
			of _useHandle_ is true (or "auto", resulting in true).
		*/
		handleShowing: true,
		//* When true, panels are automatically popped when the user moves back
		popOnBack: false,
		/**
			The source of the image used for branding in the lower left region of the
			Panels (only applies to Panels using the "activity" pattern)
		*/
		brandingSrc: ""

	},
	//* @protected
	narrowFit: false,
	handlers: {
		ontap:						"onTap",

		onSpotlightRight:			"spotlightRight",
		onSpotlightLeft:			"spotlightLeft",
		onSpotlightUp:				"spotlightUp",
		onSpotlightDown:			"spotlightDown",
		onSpotlightFocused:			"spotlightFocused",
		onSpotlightContainerLeave:	"onSpotlightPanelLeave",
		onSpotlightContainerEnter:	"onSpotlightPanelEnter",

		onPreTransitionComplete:	"preTransitionComplete",
		onPostTransitionComplete:	"postTransitionComplete"
	},
	handleTools: [
		{name: "backgroundScrim", kind: "enyo.Control", classes: "moon-panels-background-scrim"},
		{name: "clientWrapper", kind: "enyo.Control", classes: "enyo-fill enyo-arranger moon-panels-client", components: [
			{name: "scrim", classes: "moon-panels-panel-scrim"},
			{name: "client", tag: null}
		]},
		{name: "handleWrapper", kind: "enyo.Control", classes: "moon-panels-handle-wrapper hidden", canGenerate: false, ontap: "handleTap", onSpotlightLeft: "handleSpotLeft", onSpotlightRight: "handleSpotRight", onSpotlightFocused: "handleFocused", onSpotlightBlur: "handleBlur", components: [
			{name: "showHideHandle", kind: "enyo.Control", classes: "moon-panels-handle"}
		]},
		{name: "showHideAnimator", kind: "enyo.StyleAnimator", onComplete: "animationComplete"}
	],

	//* @protected
	defaultKind: "moon.Panel",
	//* Set to false to disable dragging
	draggable: false,
	//* Value may be between 0 and 1, inclusive
	panelCoverRatio: 1,
	//* True for "activity" pattern; false for "alwaysviewing" pattern
	showFirstBreadcrumb: false,
	//* Default to using _moon.BreadcrumbArranger_
	arrangerKind: "moon.BreadcrumbArranger",
	//* Index of panel set in the middle of transition
	queuedIndex: null,
	//* Flag for initial transition
	_initialTransition: true,
	//* Flag for panel transition
	transitionInProgress: false,
	//* Flag for blocking consecutive push/pop/replace panel to protect create/render/destroy time
	isModifyingPanels: false,
	//* @public

	//* Returns true if a transition between panels is currently in progress.
	inTransition: function() {
		return this.transitionInProgress;
	},

	//* Creates a panel on top of the stack and increments index to select that
	//* component.
	pushPanel: function(inInfo, inMoreInfo) { // added
		if (this.transitionInProgress || this.isModifyingPanels) {return null;}
		this.isModifyingPanels = true;
		var lastIndex = this.getPanels().length - 1,
			oPanel = this.createComponent(inInfo, inMoreInfo);
		oPanel.render();
		this.reflow();
		oPanel.resized();
		this.setIndex(lastIndex+1);
		this.isModifyingPanels = false;
		return oPanel;
	},
	//* Creates multiple panels on top of the stack and updates index to select
	//* the last one created.
	pushPanels: function(inInfos, inCommonInfo) { // added
		if (this.transitionInProgress || this.isModifyingPanels) {return null;}
		this.isModifyingPanels = true;
		var lastIndex = this.getPanels().length - 1,
			oPanels = this.createComponents(inInfos, inCommonInfo),
			nPanel;
		
		for (nPanel = 0; nPanel < oPanels.length; ++nPanel) {
			oPanels[nPanel].render();
		}
		this.reflow();
		for (nPanel = 0; nPanel < oPanels.length; ++nPanel) {
			oPanels[nPanel].resized();
		}
		this.setIndex(lastIndex+1);
		this.isModifyingPanels = false;
		return oPanels;
	},
	//* Destroys panels whose index is greater than or equal to _inIndex_.
	popPanels: function(inIndex) {
		if (this.transitionInProgress || this.isModifyingPanels) {return;}
		this.isModifyingPanels = true;
		var panels = this.getPanels();
		inIndex = inIndex || panels.length - 1;

		while (panels.length > inIndex && inIndex >= 0) {
			panels[panels.length - 1].destroy();
		}
		this.isModifyingPanels = false;
	},
	//* Destroys right panel and creates new panel without transition effect.
	replacePanel: function(index, inInfo, inMoreInfo) {
		if (this.transitionInProgress || this.isModifyingPanels) {return;}
		this.isModifyingPanels = true;
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
		this.isModifyingPanels = false;
	},
	/**
		Returns the panel index of the passed-in control, or -1 if the panel is not
		found.
	*/
	getPanelIndex: function(oControl) {
		var oPanel = null;

		while (oControl && oControl.parent) {
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
	/**
		Returns true if the passed-in control is a child panel of this Panels
		instance.
	*/
	isPanel: function(inControl) {
		for (var n=0; n<this.getPanels().length; n++) {
			if (this.getPanels()[n] == inControl) {
				return true;
			}
		}
	},

	//* @protected
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			
			// we need to ensure our handler has the opportunity to modify the flow during
			// initialization
			this.showingChanged();
		};
	}),
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
		if (oEvent.originator === this.$.showHideHandle || this.pattern === "none" || 
			this.transitionInProgress === true || this.isModifyingPanels === true) {
			return;
		}

		if (this.shouldHide(oEvent)) {
			if (this.showing && (this.useHandle === true) && this.handleShowing) {
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
	spotlightLeft: function(oSender, oEvent) {
		var orig = oEvent.originator,
			idx;
		// Don't allow left-movement from a breadcrumb
		if (orig.name === "breadcrumbBackground") {
			return true;
		}
		if (orig instanceof moon.Panel) {
			idx = this.getPanelIndex(orig);
			if (idx === 0) {
				if (this.showing && (this.useHandle === true) && this.handleShowing) {
					this.hide();
					return true;
				}
			}
			else {
				this.previous();
				return true;
			}
		}
	},
	spotlightRight: function(oSender, oEvent) {
		var orig = oEvent.originator,
			idx = this.getPanelIndex(orig),
			next = this.getPanels()[idx + 1];
		if (orig.name === "breadcrumbBackground") {
			// Upon pressing right from a pointer-focused breadcrumb, just jump
			// to the current panel to keep focus visible
			enyo.Spotlight.spot(next);
			return true; 
		}
		if (next && orig instanceof moon.Panel) {
			if (this.useHandle === true && this.handleShowing && next.isOffscreen) {
				enyo.Spotlight.spot(this.$.handleWrapper);
			}
			else {
				this.next();
			}
			return true;
		}
	},
	spotlightDown: function(oSender, oEvent) {
		if (oEvent.originator.name === "breadcrumbBackground") { return true; }
	},
	spotlightFocused: function(oSender, oEvent) {
		this.index = this.getPanelIndex(oEvent.originator);
	},
	//* Responds to tap on show/hide handle.
	handleTap: function() {
		this.setShowing(!this.showing);
	},
	handleSpotLeft: function() {
		if (this.showing) {
			enyo.Spotlight.spot(this.getActive());
		} else {
			enyo.Spotlight.unspot();
		}
		return true;
	},
	handleSpotRight: function(inSender, inEvent) {
		if (this.showing) {
			return true;
		}
	},
	handleBlur: function(inSender, inEvent) {
		if (this.isHandleFocused) {
			this.isHandleFocused = false;
			if (!enyo.Spotlight.getPointerMode()) {
				if (!this.showing) {
					// Use asyncMethod to prevent blur/focus bounce as onPanelsHandleBlurred signal is also being sent
					enyo.asyncMethod(this, "panelsHiddenAsync");
				}
			}
		}
		this.resetHandleAutoHide();
		if (!this.showing) {
			enyo.Signals.send("onPanelsHandleBlurred");
		}
	},
	panelsHiddenAsync: function() {
		enyo.Signals.send("onPanelsHidden");
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
	handleFocused: function() {
		this.unstashHandle();
		this.startJob("autoHide", "handleSpotLeft", this.getAutoHideTimeout());
		this.isHandleFocused = true;
		enyo.Signals.send("onPanelsHandleFocused");
	},
	handleShowingChanged: function() {
		//* show handle only when useHandle is true
		if (this.useHandle !== true) { return; }
		this.$.handleWrapper.addRemoveClass('hidden', !this.handleShowing);
		this.$.handleWrapper.spotlight = this.handleShowing;
	},
	/**
		Called when focus enters one of the panels. If currently hiding and
		_this.useHandle_ is true, shows handle.
	*/
	onSpotlightPanelEnter: function() {
		if (!this.showing && (this.useHandle === true) && this.handleShowing ) {
			enyo.Spotlight.spot(this.$.handleWrapper);
			return true;
		}
	},
	setIndex: function(inIndex) {
		// Normally this.index cannot be smaller than 0 and larger than panels.length
		// However, if panels uses handle and there is sequential key input during transition
		// then inIndex could have -1. It means that panels will be hided.
		if (this.toIndex === null || this.useHandle === false) {
			inIndex = this.clamp(inIndex);
		}

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

		// Ensure any VKB is closed when transitioning panels
		this.blurActiveElementIfHiding(inIndex);

		// If panels will move for this index change, kickoff animation. Otherwise skip it.
		if (this.shouldArrange()) {
			if (this.animate) {
				this.transitionInProgress = true;
				enyo.Spotlight.mute(this);
				this.triggerPreTransitions();
			}
			else {
				this._setIndex(this.toIndex);
			}
		}
		else {
			this.skipArrangerAnimation();
		}
	},
	blurActiveElementIfHiding: function(inIndex) {
		var activeElement = document.activeElement,
			activeComponent = activeElement ? enyo.$[activeElement.id] : null,
			panels = this.getPanels(),
			panel,
			panelInfo;
		if (activeComponent) {
			for (var i = 0; i < panels.length; i++) {
				panel = panels[i];
				if (activeComponent.isDescendantOf(panel)) {
					panelInfo = this.getPanelInfo(i, inIndex);
					if (panelInfo.offscreen) {
						document.activeElement.blur();
					}
					break;
				}
			}
		}
	},
	/**
		Returns true if any panels will move in the transition from
		_this.fromIndex_ to _this.toIndex_.
	*/
	shouldArrange: function() {
		return this.layout.shouldArrange ? this.layout.shouldArrange(this.fromIndex, this.toIndex) : true;
	},
	//* Skips animation and jumps to next arrangement.
	skipArrangerAnimation: function() {
		this._setIndex(this.toIndex);
		this.completed();
	},
	_setIndex: function(inIndex) {
		var prev = this.get("index");
		this.index = this.clamp(inIndex);
		this.notifyObservers("index", prev, inIndex);
	},
	//* Called when the arranger animation completes.
	completed: function() {
		if (this.$.animator.isAnimating()) {
			this.$.animator.stop();
		}

		this.fraction = 1;
		this.stepTransition();
		if (this.animate) {
			this.triggerPostTransitions();
		}
		else {
			this.finishTransition(true);
		}
		return true;
	},
	getPanelInfo: function(inPanelIndex, inActiveIndex) {
		return this.layout.getPanelInfo && this.layout.getPanelInfo(inPanelIndex, inActiveIndex) || {};
	},
	getTransitionInfo: function(inPanelIndex) {
		var info = this.getPanelInfo(inPanelIndex, this.toIndex);
		info.from = this.fromIndex;
		info.to = this.toIndex;
		info.index = inPanelIndex;
		info.animate = this.animate;
		return info;
	},
	/**
		If any panel has a pre-transition, pushes the panel's index to
		_preTransitionWaitList_.
	*/
	triggerPreTransitions: function() {
		var panels = this.getPanels(),
			info;

		this.preTransitionWaitlist = [];

		for(var i = 0, panel; (panel = panels[i]); i++) {
			info = this.getTransitionInfo(i);
			if (panel.preTransition && panel.preTransition(info)) {
				this.preTransitionWaitlist.push(i);
			}
		}

		if (this.preTransitionWaitlist.length === 0) {
			this._setIndex(this.toIndex);
		}
	},
	preTransitionComplete: function(inSender, inEvent) {
		var index = this.getPanels().indexOf(inEvent.originator);

		for (var i = 0; i < this.preTransitionWaitlist.length; i++) {
			if (this.preTransitionWaitlist[i] === index) {
				this.preTransitionWaitlist.splice(i,1);
				break;
			}
		}

		if (this.preTransitionWaitlist.length === 0) {
			this._setIndex(this.toIndex);
		}

		return true;
	},
	triggerPostTransitions: function() {
		var panels = this.getPanels(),
			info;

		this.postTransitionWaitlist = [];

		for(var i = 0, panel; (panel = panels[i]); i++) {
			info = this.getTransitionInfo(i);
			if (panel.postTransition && panel.postTransition(info)) {
				this.postTransitionWaitlist.push(i);
			}
		}

		if (this.postTransitionWaitlist.length === 0) {
			this.finishTransition(true);
		}
	},
	postTransitionComplete: function(inSender, inEvent) {
		var index = this.getPanels().indexOf(inEvent.originator);

		for (var i = 0; i < this.postTransitionWaitlist.length; i++) {
			if (this.postTransitionWaitlist[i] === index) {
				this.postTransitionWaitlist.splice(i,1);
				break;
			}
		}

		if (this.postTransitionWaitlist.length === 0) {
			this.finishTransition(true);
		}

		return true;
	},
	//* When index changes, make sure to update the breadcrumbed panel _spotlight_ property (to avoid spotlight issues)
	indexChanged: function(inPrevious) {
		var activePanel = this.getActive();

		if (activePanel && activePanel.isBreadcrumb) {
			activePanel.removeSpottableBreadcrumbProps();
		}

		this.inherited(arguments);

		// Update display of branding image
		if (this.getPanelInfo(0, this.index).breadcrumb !== this.getPanelInfo(0, this.inPrevious).breadcrumb) {
			this.brandingSrcChanged();
		}
	},
	finishTransition: function(sendEvents) {
		var panels = this.getPanels(),
			transitioned = typeof this.lastIndex !== "undefined",
			method = transitioned ? (sendEvents ? "transitionFinished" : "updatePanel") : "initPanel",
			i,
			panel,
			info,
			popFrom,
			toIndex = this.toIndex,
			fromIndex = this.fromIndex;

		// Pop panels starting at this index, plus any that are still onscreen
		popFrom = toIndex + 1;
		// Notify panels of transition
		for (i =0 ; (panel = panels[i]); i++) {
			info = this.getTransitionInfo(i);
			if (panel[method]) {
				panel[method](info);
			}
			// If a panel is onscreen, don't pop it
			if ((i > toIndex) && !info.offscreen) {
				popFrom++;
			}
		}
		this.inherited(arguments);

		this.transitionInProgress = false;

		// "sendEvents" means we actually transitioned (not a reflow), so
		// check popOnBack logic
		if (sendEvents) {
			// Automatically pop off panels that are no longer on screen
			if (this.popOnBack && (toIndex < fromIndex)) {
				this.popPanels(popFrom);
			}
		}

		// queuedIndex becomes -1 when left key input is occurred 
 		// during transition from index 1 to 0.
 		if (this.queuedIndex === -1) {
 			this.hide();
		} else if (this.queuedIndex !== null) {
  			this.setIndex(this.queuedIndex);
  		}

		enyo.Spotlight.unmute(this);
		// Spot the active panel
		enyo.Spotlight.spot(this.getActive());

	},
	/**
		Override the default _getShowing()_ behavior to avoid setting _this.showing_
		based on the CSS _display_ property.
	*/
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
	showingChanged: function(inOldValue) {
		if (this.$.backgroundScrim) {
			this.$.backgroundScrim.addRemoveClass("visible", this.showing);
		}
		if (this.useHandle === true) {
			if (this.showing) {
				this.unstashHandle();
				this._show();
				enyo.Spotlight.spot(this.getActive());
			}
			else {
				// in this case, our display flag will have been set to none so we need to clear
				// that even though the showing flag will remain false
				this.applyStyle('display', null);
				this.resetHandleAutoHide();
				this._hide();
			}
			this.sendShowingChangedEvent(inOldValue);
		}
		else {
			this.inherited(arguments);
		}
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
		this.setArrangerKind("moon.BreadcrumbArranger");
		this.addClass('always-viewing');
		this.panelCoverRatio = 0.5;
		this.useHandle = (this.useHandle === "auto") ? true : this.useHandle;
		this.createChrome(this.handleTools);
		this.breadcrumbGap = 20;
	},
	applyActivityPattern: function() {
		this.setArrangerKind("moon.BreadcrumbArranger");
		this.addClass('activity');
		this.showFirstBreadcrumb = true;
		this.useHandle = (this.useHandle === "auto") ? false : this.useHandle;
		this.createChrome(this.handleTools);
		this.breadcrumbGap = 0;
	},
	initializeShowHideHandle: function() {
		if (this.useHandle === true) {
			this.$.handleWrapper.canGenerate = true;
			this.$.handleWrapper.spotlight = true;
		}
	},
	//* Shows panels with transition from right.
	_show: function() {
		var init = false;
		if (!this.hasNode()) {
			init = true;
		} else {
			this.$.showHideHandle.addClass("right");
			this.applyShowAnimation();
		}
		enyo.Signals.send("onPanelsShown", {initialization: init});
	},
	//* Hides panels with transition to right.
	_hide: function() {
		if (!this.hasNode()) {
			return;
		}
		this.$.showHideHandle.removeClass("right");
		this.applyHideAnimation();
		enyo.Signals.send("onPanelsHidden");
	},
	//* Sets show state without animation.
	_directShow: function() {
		this.$.showHideHandle.addClass("right");
		if (this.handleShowing) {
			this.$.handleWrapper.removeClass("hidden");
		}
		this.applyShowAnimation(true);
	},
	//* Sets hide state without animation.
	_directHide: function() {
		this.$.handleWrapper.addClass("hidden");
		this.$.showHideHandle.removeClass("right");
		this.applyHideAnimation(true);
		this.hideAnimationComplete();
	},
	applyShowAnimation: function(inDirect) {
		this.$.clientWrapper.applyStyle("-webkit-transition", inDirect ? null : "-webkit-transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)");
		this.$.clientWrapper.applyStyle("-webkit-transform", "translateX(0)");
	},
	applyHideAnimation: function(inDirect) {
		this.$.clientWrapper.applyStyle("-webkit-transition", inDirect ? null : "-webkit-transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)");
		this.$.clientWrapper.applyStyle("-webkit-transform", "translateX(100%)");
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
			this.$.handleWrapper.removeClass("hidden");
		}
	},
	hideAnimationComplete: function() {
		if (this.handleShowing) {
			this.$.handleWrapper.removeClass("hidden");
		}
	},
	brandingSrcChanged: function() {
		if (this.pattern === "activity") {
			this.$.scrim.applyStyle("background-image", (this.brandingSrc && this.getPanelInfo(0, this.index).breadcrumb) ? "url(" + this.brandingSrc + ")" : "none");
		}
	}
});
