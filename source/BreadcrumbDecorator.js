/**
	_moon.BreadcrumbDecorator_ is a control that wraps an instance of
	<a href="#moon.Panels">moon.Panels</a> to create breadcrumbs, which allow the
	user to navigate to hidden panels. For example, in a Panels instance with four
	panels, if the user moves forward from panel 1 to panel 4, and panels 1 and 2
	are hidden, breadcrumbs will be created for panes 1 and 2. Clicking a
	breadcrumb will navigate the Panels back to the associated panel.

	Breadcrumbs are created based on a template of controls defined in the
	published property _breadcrumbComponents_. Each time a breadcrumb is
	created, an _onSetupBreadcrumb_ event is bubbled up. This event contains a
	reference to the newly created breadcrumb (_inEvent.breadcrumb_) and allows
	the app to control the content and style of the breadcrumb.

		{name: "breadcrumb", kind: "moon.BreadcrumbDecorator", fit: true, classes: "enyo-fit",
			onSetupBreadcrumb: "setupBreadcrumb",
			breadcrumbComponents: [
				{name: "title", content: "title"}
			],
			components: [
				{kind: "enyo.Panels", name: "panels", arrangerKind: "moon.BreadcrumbArranger",
					realtimeFit: true, classes: "enyo-fit moon-panels-sample",
					components: [
						{content: 0, classes: "moon-panels-sample-panel", style: "background:red;width:50%;"},
						{content: 1, classes: "moon-panels-sample-panel", style: "background:orange;width:10%;"},
						{content: 2, classes: "moon-panels-sample-panel", style: "background:yellow;width:40%;"},
						{content: 3, classes: "moon-panels-sample-panel", style: "background:green;width:80%;"}
					]
				}
			]
		}
*/
enyo.kind({
	name: "moon.BreadcrumbDecorator",
	kind: "enyo.Control",
	published: {
		/**
			Template components block used whenever a breadcrumb is created. The
			_this.$_ hash of each breadcrumb contains controls with the same names as
			those defined in this property.
		*/
		breadcrumbComponents: []
	},
	events: {
		/**
			Fires when a new breadcrumb is created.
			
			_inEvent.breadcrumb_ contains a reference to the newly created breadcrumb.
		*/
		onSetupBreadcrumb: ""
	},
	//* @protected
	handlers: {
		onTransitionStart: "panelIndexChanged"
	},
	classes: "moon-breadcrumb-decorator",
	components: [
		{name: "breadcrumbWrapper", classes: "moon-breadcrumb-wrapper"},
		{name: "client", classes: "moon-breadcrumb-decorator-client"}
	],
	//* Reference to the _Panels_ instance that this decorator wraps.
	$panels: null,
	//* Previous panels index
	previousIndex: -1,
	//* Number of crumbs to show (defaults to -1, which means unlimited)
	_visibleCrumbs: -1,
	//* During creation, adds styling based on the arranger kind of the _Panels_
	//* instance that this decorator wraps.
	create: function() {
		this.inherited(arguments);
		this.$panels = this.$.client.children[0];
		if (this.$panels.arrangerKind === "moon.BreadcrumbArranger") {
			this.addClass("breadcrumb");
			this._visibleCrumbs = 1;
		} else {
			this.addClass("instantOn");
		}
		this.$panels.hiddenPanels = [];
	},
	/**
		Updates the breadcrumb when the panel index changes. If a new breadcrumb is
		created, bubbles an _onSetupBreadcrumb_ event to allow the owner to
		customize the breadcrumb.
	*/
	panelIndexChanged: function(inSender, inEvent, inIndex) {
		var i = inIndex || this.getLastHiddenPanelIndex(),
			newIndex = this.$panels.getIndex();

		if (newIndex > this.previousIndex) {
			this.panelsForward(i);
		} else if (newIndex < this.previousIndex) {
			this.panelsBackward(i);
		}

		this.previousIndex = newIndex;
	},
	//* Called as Panels moves forward (i.e., we will be adding breadcrumbs).
	panelsForward: function(inIndex) {
		var hiddenPanelIndices = this.$panels.hiddenPanels,
			breadcrumbs = this.getBreadcrumbs(),
			panelIndex,
			match,
			i,
			j;

		for (i=0;i<hiddenPanelIndices.length;i++) {
			panelIndex = hiddenPanelIndices[i];
			match = false;
			var bc;
			for(j=0;(bc = breadcrumbs[j]);j++) {
				if(panelIndex === bc.index) {
					match = true;
					break;
				}
			}
			if(!match) {
				this.createBreadcrumb(i);
			}
		}
		this.showHideCrumbs();
	},
	//* Called as Panels moves backwards (i.e., we will be removing breadcrumbs).
	panelsBackward: function(inIndex) {
		var highestHiddenIndex = this.getLastHiddenPanelIndex(),
			breadcrumbs = this.getBreadcrumbs(),
			j = breadcrumbs.length - 1,
			bc;

		while((bc = breadcrumbs[j])) {
			if (bc.index > highestHiddenIndex) {
				bc.destroy();
				j = breadcrumbs.length - 1;
			} else {
				j--;
			}
		}

		this.$.breadcrumbWrapper.render();
		this.showHideCrumbs();
	},
	//* Provides references to all breadcrumbs.
	getBreadcrumbs: function() {
		return this.$.breadcrumbWrapper.getControls();
	},
	//* Gets the last hidden panel index.
	getLastHiddenPanelIndex: function() {
		var index = this.$panels.hiddenPanels.length-1;
		return this.$panels.hiddenPanels[index] >= 0 ? this.$panels.hiddenPanels[index] : -1;
	},
	//* Creates a new breadcrumb at the specified index.
	createBreadcrumb: function(inIndex) {
		// Create new breadcrumb component
		var bc = this.$.breadcrumbWrapper.createComponent({classes: "moon-breadcrumb", index: inIndex, ontap: "breadcrumbTap"}, {owner: this});
		// Add components from _this.breadcrumbComponents_ template to new breadcrumb
		bc.createComponents(this.getBreadcrumbComponents());
		// Allow _this.owner_ to customize breadcrumb via _onSetupBreadcrumb_ event
		this.doSetupBreadcrumb({breadcrumb: bc});
		bc.render();
		//this.showHideCrumbs();
	},
	//* Destroys all existing breadcrumbs.
	destroyBreadcrumbs: function() {
		this.$.breadcrumbWrapper.destroyClientControls();
	},
	//* Decorates the _ontap_ event with an _index_ and sets Panels instance to
	//* the specified index.
	breadcrumbTap: function(inSender, inEvent) {
		var i = inSender.index;
		inEvent.index = i;
		this.jumpToBreadcrumb(i);
	},
	//* Jumps back to the specified breadcrumb.
	jumpToBreadcrumb: function(inIndex) {
		var nextHiddenIndex = this.$panels.hiddenPanels[this.$panels.hiddenPanels.length-2];
		if(nextHiddenIndex && nextHiddenIndex >= 0) {
			this.panelIndexChanged(null, null, nextHiddenIndex);
		}
		this.$panels.setIndex(inIndex);
	},
	showHideCrumbs: function() {
		var bc = this.getBreadcrumbs();
		this.$.breadcrumbWrapper.setShowing(bc.length > 0);
		if (this._visibleCrumbs <= 0) {
			return;
		}
		for (var i=0; i < bc.length ; i++) {
			bc[i].setShowing(i >= bc.length - this._visibleCrumbs);
		}
	}
});