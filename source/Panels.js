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
		// Fired when panels transition by show is finished
		onShowFinished: "",
		// Fired when panels transition by hide is finished
		onHideFinished: "",
		// Fired when panels transition by hideToLeft is finished
		onHideToLeftFinished: "",
		// Fired when panel transition by setIndex is finished 
		// inEvent.activeIndex: active index
		onPanelsPostTransitionFinished: ''
	},
	handlers: {
		onSpotlightFocused			: 'onSpotlightFocused',
		onSpotlightContainerEnter	: 'onSpotlightPanelEnter',
		onSpotlightContainerLeave	: 'onSpotlightPanelLeave',
		onSpotlightRight			: 'onSpotlightRight',
		ontap						: 'onTap',
		onTransitionFinish			: 'transitionFinish',
		onPreTransitionComplete		: 'panelPreTransitionComplete',
		onPostTransitionComplete	: 'panelPostTransitionComplete',
		ontransitionend				: 'cssTransitionEnded'
	},
	defaultKind: "moon.Panel",
	draggable: false,
	panelCoverRatio: 1,				// 0 ~ 1
	showFirstBreadcrumb: false,		// none: false, activity: true, alwaysviewing: false
	arrangerKind: "moon.BreadcrumbArranger",

	//* @protected
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
	rendered: function() {
		this.inherited(arguments);
		if (this.pattern === "alwaysviewing") {
			this.$.client.hide();
		}
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
			if (this.pattern === "alwaysviewing" && this.$.client.showing === true) {
				this.hide();
				enyo.Spotlight.spot(this);
			}
		} else {
			// Tapped on panel
			if (n != this.getIndex()) {
				// Tapped on not current panel
				this.setIndex(n);
				enyo.Spotlight.setLast5WayControl(oEvent.originator);
				enyo.Spotlight.setPointerMode(false);
			} else {
				// Tapped on current panel
			}
		}
		return false;
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
	},
	preTransitionComplete: function() {
		this.transitionReady = true;
		this.setIndex(this.transitionIndex);
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
	},
	postTransitionComplete: function() {
		// TODO - something here?
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
			this.addClass('moon-dark-gray');
			this.applyStyle("background-color", "inherit");
			this.createChrome([
				{
					name: "backgroundScrim",
					kind: enyo.Control,
					classes: "moon-panels-background-scrim",
					components: [
						{
							name: "spotable",
							kind: enyo.Control,
							classes: "moon-panels-spot",
							onenter: "show"
						}
					]
				},
				{
					name: "client",
					kind: enyo.Control,
					classes: "enyo-fill enyo-arranger moon-panels-client",
					components: [
						{
							name: "panelScrim",
							kind: enyo.Control,
							classes: "moon-panels-panel-scrim"
						}
					]
				}
			]);
			this.panelCoverRatio = 0.5;
			break;
		case "activity":
			/* falls through */
		default:
			this.showFirstBreadcrumb = true;
		}
	},

	cssTransitionEnded: function(inSender, inEvent) {
		if (inEvent.originator === this.$.client) {
			switch (this._transitionCommand) {
			case "show":
				this._transitionCommand = "";
				this.doShowFinished(inEvent);
				enyo.Spotlight.spot(this.getActive());
				break;
			case "hide":
				this._transitionCommand = "";
				this.$.client.hide();
				this.doHideFinished(inEvent);
				enyo.Spotlight.spot(this);
				break;
			case "hideToLeft":
				this._transitionCommand = "";
				this.$.client.hide();
				this.$.client.addRemoveClass("show", false);
				this.$.client.addRemoveClass("left", false);
				this.doHideToLeftFinished(inEvent);
				enyo.Spotlight.spot(this);
				break;
			default:
				// other transition inside of panels
			}
		}
	},
	_show: function() {
		this.$.backgroundScrim.addRemoveClass("on", true);
		this.$.client.addRemoveClass("show", true);
	},

	// Called when focus leaves one of the panels.
	onSpotlightPanelLeave: function(oSender, oEvent) {
		if (oEvent.originator != this.getActive())	{ return false; }
		if (enyo.Spotlight.getPointerMode())		{ return false; }

		var nIndex = this.getIndex();

		switch (oEvent.direction) {
		case 'LEFT':
			if (nIndex > 0) {
				this.setIndex(nIndex - 1);
				return true;
			} else {
				if (this.pattern == "alwaysviewing") {
					this.hide();
					return true;
				}
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
	onSpotlightRight: function(oSender, oEvent) {
		if (oEvent.originator !== this) { return false; }
		// Show panels when moon.Panels got spot and user enter right key.
		if (this.pattern === "alwaysviewing" && !this._hadFocus()) {
			this.show();
		}
	},
	onSpotlightFocused: function(oSender, oEvent) {
		if (oEvent.originator !== this) { return false; }
		if (enyo.Spotlight.getPointerMode()) { return false; }

		// Check if child of panels is last spotted control
		if (!this._hadFocus()) {
			enyo.Spotlight.spot(this.getActive());
		}

		return false;
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
	//* Advance panel index by 1 until index is reached to the last. */
	next: function(oControl) {
		var index = this.getPanelIndex(oControl);
		this.setIndex(index);
		index = this.clamp(index+1);
		if (index != this.getIndex()) {
			this.setIndex(index);
		}
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
	/**
		If there was a pre-transition from this control's children, checks whether
		it was done or not.
	*/
	setIndex: function(inIndex) {
		this.fromIndex = this.getIndex();
		this.toIndex = inIndex;

		if (this.transitionReady) {
			this.inherited(arguments);
			enyo.Spotlight.spot(this.getActive());
			this.setTransitionReady(false);
			this.triggerPanelPostTransitions();
		} else {
			this.transitionIndex = inIndex;
			this.triggerPanelPreTransitions();
		}
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
		var activeIndex = this.getIndex(), active;
		// parent and child of panels can get event
		this.doPanelsPostTransitionFinished({active: activeIndex});
		for (var i = 0; i < this.getPanels().length; i++) {
			this.getPanels()[i].waterfall("onPanelsPostTransitionFinished", {active: activeIndex, index: i});
		}
	},
	//* Show panals with transition from right */
	show: function() {
		if (this._transitionCommand !== "") {return false;}
		this._transitionCommand = "show";
		this.$.client.show();
		enyo.job(this.id + "showhide", this.bindSafely("_show"), 50);
		return true;
	},
	//* Hide panals with transition to right */
	hide: function() {
		if (this._transitionCommand !== "") {return false;}
		this._transitionCommand = "hide";
		this.$.backgroundScrim.addRemoveClass("on", false);
		this.$.client.addRemoveClass("show", false);
		return true;
	},
	//* Hide panals with transition to left */
	hideToLeft: function() {
		if (this._transitionCommand !== "") {return false;}
		this._transitionCommand = "hideToLeft";
		this.$.backgroundScrim.addRemoveClass("on", false);
		this.$.client.addRemoveClass("left", true);
		return true;
	}
});
