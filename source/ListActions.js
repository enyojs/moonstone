(function (enyo, scope) {

	/**
	* Used internally for [`ListActions`]{@link moon.ListActions} to request 
	* [`Header`]{@link moon.Header} to add fitting components to itself. Not intended for use by 
	* end-developer.
	*
	* @event moon.ListActions#onRequestCreateListActions
	* @type {Object}
	* @property {Object} components - The drawer components to be created
	* @private
	*/

	/**
	* Fires when when the open state of the drawer has changed.
	*
	* @event moon.ListActions#onListActionOpenChanged
	* @type {Object}
	* @property {Boolean} open - `true` if the drawer is open
	* @public
	*/

	/**
	* `moon.ListActions` is a [control]{@link enyo.Control} designed to live within a 
	* [`moon.Header`]{@link moon.Header}. It is used to perform actions on an associated list of 
	* items. A `ListActions` [object]{@glossary Object} combines an activating control with a drawer
	* containing a user-defined menu of selectable options for acting on items in the list. When a 
	* menu item is selected, an action--such as filtering, sorting, moving, or deleting--may be
	* invoked in the application by handling change events from the selected items.
	*
	* @class moon.ListActions
	* @extends enyo.GroupItem
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.ListActions.prototype */ {

		/**
		* @private
		*/
		name: 'moon.ListActions',

		/**
		* @private
		*/
		classes: 'moon-list-actions',

		/**
		* @private
		*/
		kind: 'enyo.GroupItem',

		/**
		* @private
		* @lends moon.ListActions.prototype
		*/
		published: {

			/**
			* If `true`, the drawer is expanded, showing this item's contents.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			open: false,

			/**
			* If `true`, the drawer will automatically close when the user selects a menu item.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			autoCollapse: false,

			/**
			* A block of one or more controls to be displayed inside the list actions menu. By 
			* default, each top-level ListActions will have a 
			* [`defaultKind`]{@link enyo.Control#defaultKind} of 
			* [`FittableRows`]{@link enyo.FittableRows}, and should typically contain a 
			* [`moon.Divider`]{@link moon.Divider} identifying the category and a 
			* [`moon.Scroller`]{@link moon.Scroller} with `fit:true`, containing instances of 
			* [`moon.CheckboxItem`]{@link moon.CheckboxItem}, 
			* [`moon.ToggleItem`]{@link moon.ToggleItem}, or 
			* [`moon.SelectableItem`]{@link moon.SelectableItem} for setting options for the 
			* underlying [panel]{@link moon.Panel}. Alternatively, a 
			* [`moon.DataRepeater`]{@link moon.DataRepeater} (with a `moon.Scroller` set as its 
			* container) or a [`moon.DataList`]{@link moon.DataList} may be used as the `fit:true` 
			* control for populating a data-bound list of options (see below for limitations on 
			* using a `moon.DataList`).
			* 
			* More than one option group may be added to the `listActions` block, in which options
			* are laid out horizontally by default, with each `FittableRows`' height constrained to
			* the height of the parent [`Header`]{@link moon.Header}. However, a minimum width
			* (300px) is enforced for each group, and if there are more groups than will fit in the
			* available horizontal space, all controls will instead be stacked vertically. In this
			* case, an outer scroller is enabled; the outer scroller scrolls all groups vertically,
			* and the `FittableRows` are reset to natural size based on their content, effectively
			* disabling any scrollers contained within, to prevent nested scrolling.
			* 
			* Note that the vertical stacking capability poses a limitation on using
			* {@link moon.DataList}. Since `moon.DataList` must always be allowed to scroll, it is
			* not suitable for use in a stacked scenario in which only one outer scroller is used.
			* As such, `moon.DataList` cannot be used within a `ListActions` that may need to stack
			* vertically.
			*
			* Each group should have a string value set for the `action` property, as this will be
			* passed in all events that bubble from the `ListActions`, to allow the user to identify
			* which category changed.
			*
			* @type {Object[]}
			* @default null
			* @public
			*/
			listActions: null,

			/**
			* Source URL for icon image.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			iconSrc: '',

			/**
			* Set the icon name to be used by the `ListActions Activator` button (like 
			* [`moon.Icon`]{@link moon.Icon} and [`moon.IconButton`]{@link moon.IconButton}).
			*
			* @type {String}
			* @default ''
			* @public
			*/
			icon: '',

			/**
			* By default, list action menus are 300px wide. Set this to `true` to instead have the
			* menus be proportionally sized within the available space. Note that a minimum width of
			* 300px is still respected; if all menus don't fit horizontally, they will be stacked
			* vertically.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			proportionalWidth: false
		},

		/**
		* @private
		*/
		events: {
			onRequestCreateListActions: '',
			onListActionOpenChanged: ''
		},

		/**
		* @private
		*/
		components:[
			{name:'activator', kind: 'moon.IconButton', classes: 'moon-list-actions-activator', ontap: 'expandContract'}
		],

		/**
		* @private
		*/
		drawerComponents: [
			{name: 'drawer', spotlightDisabled: true, kind: 'moon.ListActionsDrawer', classes: 'list-actions-drawer', onComplete: 'drawerAnimationEnd', open: false, spotlight: 'container', spotlightModal:true, components: [
				{name: 'closeButton', kind: 'moon.IconButton', icon: 'closex', classes: 'moon-popup-close moon-list-actions-close moon-neutral', ontap: 'expandContract', defaultSpotlightDown:'listActions'},
				{name: 'listActionsClientContainer', classes: 'enyo-fit moon-list-actions-client-container moon-neutral', components: [
					{name: 'listActions', kind: 'moon.Scroller', classes: 'enyo-fit moon-list-actions-scroller', horizontal:'hidden', vertical:'hidden', onActivate: 'optionSelected', defaultSpotlightUp:'closeButton'}
				]}
			]}
		],

		/**
		* @private
		*/
		bindings: [
			{from: 'open', to: '$.drawer.open'},
			{from: 'iconSrc', to: '$.activator.src'},
			{from: 'icon', to: '$.activator.icon'},
			{from: 'disabled', to: '$.activator.disabled', oneWay: false}
		],

		/**
		* @fires moon.ListActions#onRequestCreateListActions
		* @private
		*/
		create: function() {
			this.inherited(arguments);
			this.doRequestCreateListActions({components: this.drawerComponents});
			if (!this.$.drawer) {
				throw 'moon.ListActions must be created as a child of moon.Header';
			}
			this.disabledChanged();
			this.listActionsChanged();
			this.drawerNeedsResize = true;
		},

		/**
		* @private
		*/
		rendered: function() {
			this.inherited(arguments);
			if (this.open) {
				// Perform post-open work
				this.drawerAnimationEnd();
				// Update stacking
				this.resizeDrawer();
			}
		},

		/**
		* @private
		*/
		destroy: function() {
			enyo.dispatcher.release(this.$.drawer);
			this.inherited(arguments);
		},

		/**
		* @private
		*/
		disabledChanged: function() {
			this.addRemoveClass('disabled', this.disabled);
		},

		/**
		* @private
		*/
		listActionsChanged: function() {
			var owner = this.hasOwnProperty('listActions') ? this.getInstanceOwner() : this;
			this.listActions = this.listActions || [];
			this.renderListActionComponents(owner);
		},

		/**
		* @private
		*/
		renderListActionComponents: function(owner) {
			this.noAutoCollapse = true;
			this.createListActionComponents(owner);
			this.noAutoCollapse = false;
		},

		/**
		* @private
		*/
		createListActionComponents: function(owner) {
			var listAction, i;

			this.listActionComponents = [];
			for (i = 0; (listAction = this.listActions[i]); i++) {
				this.listActionComponents.push(this.createListActionComponent(listAction, owner));
			}

			// Increase width to 100% if there is only one list action
			if (this.proportionalWidth) {
				this.$.drawer.addClass('proportional-width');
				var w = 100 / this.listActionComponents.length;
				for (i=0; i<this.listActionComponents.length; i++) {
					this.listActionComponents[i].applyStyle('width', w + '%');
				}
			}

			if (this.hasNode()) {
				this.$.listActions.render();
			}
		},

		/**
		* Creates a new list action component based on _inListAction_.
		*
		* @private
		*/
		createListActionComponent: function(listAction, owner) {
			var listActionComponent;

			listAction.mixins = this.addListActionMixin(listAction);
			listActionComponent = this.$.listActions.createComponent(listAction, {owner: owner, layoutKind:'FittableRowsLayout'});
			listActionComponent.addClass('moon-list-actions-menu');

			return listActionComponent;
		},

		/**
		* Adds a mixin to each list action menu that decorates _activate_ events with the menu's
		* _action_ property.
		*
		* @private
		*/
		addListActionMixin: function(listAction) {
			var mixins = listAction.mixins || [];
			if (mixins.indexOf('moon.ListActionActivationSupport') === -1) {
				mixins.push('moon.ListActionActivationSupport');
			}
			return mixins;
		},

		/**
		* Toggles value of _this.open_.
		*
		* @private
		*/
		expandContract: function(sender, e) {
			if (this.disabled) {
				return true;
			}
			this.setOpen(!this.getOpen());
		},

		/**
		* @private
		*/
		beforeOpenDrawer: function(standardHeight, type) {
			this.standardHeight = standardHeight;
			if (type !== 'large') {
				this.set(this.stacked, 'false');
			}
		},

		/**
		* @fires moon.ListActions#onListActionOpenChanged
		* @private
		*/
		openChanged: function(){
			this.$.drawer.set('spotlightDisabled', !this.getOpen());
			this.setActive(this.getOpen());
			this.doListActionOpenChanged({open: this.open});
			// If opened, show drawer and resize it if needed
			if(this.open){
				if (this.drawerNeedsResize) {
					this.resizeDrawer();
					this.drawerNeedsResize = false;
				}
				// Capture onSpotlightFocus happening outside the drawer, so that we can prevent focus
				// from landing in the header beneath the drawer
				enyo.dispatcher.capture(this.$.drawer, {onSpotlightFocus: 'capturedSpotlightFocus'}, this);
			} else {
				enyo.dispatcher.release(this.$.drawer);
			}
		},

		/**
		* @fires moon.TooltipDecorator#onRequestMuteTooltip
		* @fires moon.TooltipDecorator#onRequestUnmuteTooltip
		* @private
		*/
		drawerAnimationEnd: function() {
			//on closed, hide drawer and spot _this.$.activator_
			if (!this.getOpen()) {
				if (this.generated) {
					enyo.Spotlight.spot(this.$.activator);
				}
				this.bubble('onRequestUnmuteTooltip');
			}
			//on open, move top and spot _this.$.closeButton_
			else {
				if (this.resetScroller) {
					this.$.listActions.scrollTo(0, 0);
					this.resetScroller = false;
				}
				if (this.generated) {
					enyo.Spotlight.spot(this.$.closeButton);
				}
				this.bubble('onRequestMuteTooltip');
			}
			return true;
		},

		/**
		* @private
		*/
		updateStacking: function() {
			if (this.$.drawer.hasNode()) {
				this.set('stacked', this.shouldStack());
			}
		},

		/**
		* @private
		*/
		shouldStack: function() {
			// Assumption: min-width of all listActionsComponents set to 300px in CSS
			return this.$.listActions.getBounds().width < (300 * this.listActionComponents.length);
		},

		/**
		* @private
		*/
		stackedChanged: function() {
			if (this.stacked) {
				this.$.drawer.addClass('stacked');
				this.stackMeUp();
				// When stacked, always have vertical scroller
				this.$.listActions.setVertical('scroll');
			}
			else {
				this.$.drawer.removeClass('stacked');
				this.unStackMeUp();
				this.$.listActions.setVertical('hidden');
			}
			this.resetScroller = true;
			this.$.listActions.resize();
		},

		/**
		* @private
		*/
		stackMeUp: function() {
			var optionGroup, i;

			for (i = 0; (optionGroup = this.listActionComponents[i]); i++) {
				optionGroup.applyStyle('display', 'block');
				// Stacked contols get natural height (which prevents scrolling), such that they stack
				// within outer scroller which is allowed to scroll all controls; this is a problem for
				// DataLists, which require an explicit height, making them unsuitable for use in
				// stacked ListActions
				optionGroup.applyStyle('height', 'none');
			}
		},

		/**
		* @private
		*/
		unStackMeUp: function() {
			var containerHeight, optionGroup, i;
			if (this.standardHeight) {
				this.$.drawer.applyStyle('height', this.standardHeight + 'px');
			}
			containerHeight = this.getContainerBounds().height;

			for (i = 0; (optionGroup = this.listActionComponents[i]); i++) {
				optionGroup.applyStyle('display', 'inline-block');
				optionGroup.applyStyle('height', containerHeight + 'px');
			}
		},

		/**
		* @private
		*/
		handleResize: function() {
			this.resetCachedValues();

			// If drawer is collapsed, resize it the next time it is opened
			if (this.getOpen()) {
				this.resizeDrawer();
			} else {
				this.drawerNeedsResize = true;
			}
		},

		/**
		* @private
		*/
		resizeDrawer: function() {
			this.updateStacking();
		},

		/**
		* @private
		*/
		optionSelected: function(sender, e) {
			if (this.getOpen() && this.autoCollapse && !this.noAutoCollapse) {
				this.startJob('expandContract', 'expandContract', 300);
			}
		},

		/**
		* @private
		*/
		getContainerBounds: function() {
			this.containerBounds = this.containerBounds || this.$.listActions.getBounds();
			return this.containerBounds;
		},

		/**
		* @private
		*/
		resetCachedValues: function() {
			this.headerBounds = null;
			this.clientBounds = null;
			this.containerBounds = null;
		},

		/**
		* @private
		*/
		capturedSpotlightFocus: function(sender, e) {
			// We need to prevent header children below the drawer from being focused
			if (e.originator.isDescendantOf(this.$.drawer.parent) &&
				!e.originator.isDescendantOf(this.$.drawer)) {
				enyo.Spotlight.spot(this.$.drawer);
				return true;
			}
		}
	});

	/**
	* Fires when the [`ListActionsDrawer`]{@link moon.ListActionsDrawer} has completed any setup 
	* and/or preparation work, i.e. when animating or initial setup. No event-specific information
	* is sent with this event.
	*
	* @event moon.ListActionsDrawer#onComplete
	* @type {Object}
	* @public
	*/

	/**
	* `moon.ListActionsDrawer` is a [control]{@link enyo.Control} used by {@link moon.ListActions}
	* to house a menu of selectable options.
	*
	* @class moon.ListActionsDrawer
	* @extends enyo.Control
	* @public
	*/
	enyo.kind(
		/** @lends moon.ListActionsDrawer */ {

		/**
		* @private
		*/
		name: 'moon.ListActionsDrawer',

		/**
		* @private
		*/
		kind: 'enyo.Control',

		/**
		* @private
		* @lends moon.ListActionsDrawer.prototype
		*/
		published: {

			/**
			* If `true`, the drawer will be in its opened state, otherwise it will be closed.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			open: false
		},

		/**
		* @private
		*/
		classes: 'moon-list-actions-drawer',

		/**
		* @private
		*/
		components: [
			{name: 'client', classes: 'moon-list-actions-drawer-client moon-neutral', ontransitionend: 'handleTransitionEnd'}
		],

		/**
		* @private
		*/
		events: {
			onComplete: ''
		},

		/**
		* @fires moon.ListActionsDrawer#onComplete
		* @private
		*/
		rendered: function() {
			this.inherited(arguments);
			// Temporarily disable animation
			this.applyAnimatedMode(false);
			// Set the state of the drawer
			this.openChanged();
			// Re-enable animation
			this.applyAnimatedMode(true);
			// Let any watchers know we've finished our preparation
			this.doComplete();
		},

		/**
		* @fires moon.ListActionsDrawer#onComplete
		* @private
		*/
		handleTransitionEnd: function(sender, e) {
			if (e.originator === this.$.client) {
				this.doComplete();
				return true;
			}
		},

		/**
		* We override getBubbleTarget here so that events emanating from a 
		* [`ListActionsDrawer`]{@link moon.ListActionsDrawer} instance will bubble to the owner of
		* the associated [`ListActions`]{@link moon.ListActions} instance, as expected. This is
		* necessary because events normally bubble to a control's DOM parent, but we have sneakily
		* arranged for the DOM parent of a `ListActionsDrawer` instance to be not the `ListActions`
		* instance but the containing [`Header`]{@link moon.Header} instance.
		*
		* @private
		*/
		getBubbleTarget: function() {
			return this.owner;
		},

		/**
		* @private
		*/
		openChanged: function() {
			// Skip animation before render time
			if (!this.$.client.hasNode()) { return; }
			this.$.client.addRemoveClass('open', this.open);
		},

		/**
		* @private
		*/
		applyAnimatedMode: function(shouldAnimate) {
			this.$.client.addRemoveClass('animated', shouldAnimate);
		}
	});

	/**
	* An internally-used support mixin added to a {@link moon.ListActions} menu that decorates
	* `activate` events with the menu's `action` property.
	*
	* @mixin moon.ListActionActivationSupport
	* @protected
	*/
	moon.ListActionActivationSupport = {

		/**
		* @private
		*/
		name: 'ListActionActivationSupport',

		/**
		* @private
		*/
		handlers: {
			onActivate: 'activate'
		},

		/**
		* @private
		*/
		activate: function(sender, e) {
			e.action = this.action;
		}
	};

})(enyo, this);
