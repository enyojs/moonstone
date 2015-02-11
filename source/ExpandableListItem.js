(function (enyo, scope) {

	/**
	* @class moon.ExpandableListDrawer
	* @extends enyo.Control
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.ExpandableListDrawer.prototype */ {

		/**
		* @private
		*/
		name: 'moon.ExpandableListDrawer',

		/**
		* @private
		*/
		kind: 'enyo.Drawer',

		/**
		* @private
		*/
		open: false,

		/**
		* @private
		*/
		openChanged: function () {
			if (this.open && !this.showing && this.renderOnShow) this.show();
			this.inherited(arguments);
		}
	});

	/**
	* {@link moon.ExpandableListItem}, which extends {@link moon.Item}, displays a header
	* while also allowing additional content to be stored in an {@link enyo.Drawer}. When
	* the header is selected, the drawer opens below. To close the drawer, tap on the
	* header text or navigate (via 5-way) back to the top of the drawer.
	*
	* The control's child components may be of any kind; by default, they are
	* instances of `moon.Item`.
	*
	* ```
	* 		{kind: 'moon.ExpandableListItem', content: 'A Countries', components: [
	* 			{content: 'Algeria'},
	* 			{content: 'Argentina'},
	* 			{content: 'Australia'}
	* 		]},
	* 		{kind: 'moon.ExpandableListItem', content: 'B Countries', components: [
	* 			{content: 'Belgium'},
	* 			{content: 'Bolivia'},
	* 			{content: 'Brazil'}
	* 		]}
	*
	* When multiple ExpandableListItems are used in a group, only one may be open at
	* a given time.
	*
	* ```
	* 		{kind: 'enyo.Group', highlander: true, components: [
	* 			{kind: 'moon.ExpandableListItem',  open: true,
	* 			content: 'This is a grouped ExpandableListItem', components: [
	* 				{content: 'Item One'},
	* 				{content: 'Item Two'}
	* 			]},
	* 			{kind: 'moon.ExpandableListItem',
	* 				content: 'This is another grouped ExpandableListItem', components: [
	* 					{content: 'Item Three'},
	* 					{content: 'Item Four'}
	* 				]
	* 			},
	* 			{kind: 'moon.ExpandableListItem',
	* 				content: 'This is yet another grouped ExpandableListItem', components: [
	* 					{content: 'Item Five'},
	* 					{content: 'Item Six'}
	* 				]
	* 			}
	* 		]}
	* ```
	*
	* @class moon.ExpandableListItem
	* @extends enyo.Control
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.ExpandableListItem.prototype */ {

		/**
		* @private
		*/
		name: 'moon.ExpandableListItem',

		/**
		* @private
		*/
		kind: 'enyo.Control',

		/**
		* @private
		* @lends moon.ExpandableListItem.prototype
		*/
		published: {

			/**
			* If `true`, the drawer automatically closes when the user navigates to the top of the
			* control; if `false`, the user must select/tap the header to close the drawer.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			autoCollapse: false,

			/**
			* If `true`, the drawer is expanded, showing this item's contents. Use this property
			* (rather than [active]{@link moon.ExpandableListItem#active}) to set the item's
			* initial state.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			open: false,

			/**
			* Boolean that reflects the value of the [open]{@link moon.ExpandableListItem#open}
			* property; it is used to support the {@link enyo.Group} API for grouping a set of
			* ExpandableListItems in which only one is expanded at a time. Note that the `open`
			* property (not the `active` property) controls the initial state of the picker.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			active: false,

			/**
			* If `true`, the user is prevented from moving {@glossary Spotlight} past the bottom
			* of the drawer (when open) using 5-way controls.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			lockBottom: false,

			/**
			* If `true`, item is shown as disabled and does not generate tap events.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			disabled: false
		},

		/**
		* @private
		*/
		classes: 'moon-expandable-list-item',

		/**
		* @private
		*/
		spotlight: false,

		/**
		* @private
		*/
		defaultKind: 'moon.Item',

		/**
		* @private
		*/
		handlers: {
			onSpotlightDown: 'spotlightDown',
			onDrawerAnimationEnd: 'drawerAnimationEnd'
		},

		/**
		* @private
		*/
		components: [
			// headerContainer required to avoid bad scrollWidth returned in RTL for certain text
			// widths (webkit bug)
			{name: 'headerContainer', classes: 'moon-expandable-list-item-header moon-expandable-picker-header moon-expandable-list-header', onSpotlightFocus: 'headerFocus', ontap: 'expandContract', components: [
				{name: 'header', kind: 'moon.MarqueeText'}
			]},
			{name: 'drawer', kind: 'enyo.Drawer', resizeContainer:false, classes: 'moon-expandable-list-item-client', components: [
				{name: 'client', kind: 'Group', tag: null}
			]}
		],

		/**
		* @private
		*/
		bindings: [
			{from: '.allowHtml', to: '.$.header.allowHtml'},
			{from: '.disabled', to: '.$.headerContainer.disabled'}
		],

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.openChanged();
			this.setActive(this.open);
			this.disabledChanged();
		},

		/**
		* Facade for header content.
		*
		* @private
		*/
		contentChanged: function () {
			this.$.header.setContent(this.getContent());
		},

		/**
		* Facade for drawer.
		*
		* @private
		*/
		openChanged: function () {
			var open = this.getOpen();
			this.addRemoveClass('open', open);
			this.$.drawer.setOpen(open);
			this.$.drawer.spotlightDisabled = !open;
			this.setActive(open);
		},

		/**
		* @private
		*/
		disabledChanged: function () {
			var disabled = this.getDisabled();

			this.addRemoveClass('disabled', disabled);
			if (disabled) {
				this.setActive(false);
			}
		},

		/**
		* @fires enyo.GroupItem#onActivate
		* @private
		*/
		activeChanged: function () {
			this.bubble('onActivate', {allowHighlanderDeactivate:true});
			this.setOpen(this.active);
		},

		/**
		* If closed, opens drawer and highlights first spottable child.
		*
		* @private
		*/
		expandContract: function (inSender, inEvent) {
			this.toggleActive();

			if (this.getActive() && !enyo.Spotlight.getPointerMode()) {
				enyo.Spotlight.spot(enyo.Spotlight.getFirstChild(this.$.drawer));
			}
		},

		/**
		* @private
		*/
		toggleActive: function () {
			if (this.getOpen()) {
				this.setActive(false);
			} else {
				this.setActive(true);
			}
		},

		/**
		* If drawer is currently open, and event was sent via keypress (i.e., it has a direction),
		* process header focus.
		*
		* @fires moon.Scroller#onRequestScrollIntoView
		* @private
		*/
		headerFocus: function (inSender, inEvent) {
			var direction = inEvent && inEvent.dir;

			if (this.getOpen() && this.getAutoCollapse() && direction === 'UP') {
				this.setActive(false);
			}

			if (inEvent.originator === this.$.header) {
				this.bubble('onRequestScrollIntoView');
			}
		},

		/**
		* Check for the last item in the client area, and prevent 5-way focus movement below it,
		* per UX specs.
		*
		* @private
		*/
		spotlightDown: function (inSender, inEvent) {
			var children = enyo.Spotlight.getChildren(this.$.client);
			if (this.getLockBottom() && this.getOpen() && children.length && inEvent.originator == children[children.length - 1]) {
				return true;
			}
		},

		/**
		* @fires moon.Scroller#onRequestScrollIntoView
		* @private
		*/
		drawerAnimationEnd: function () {
			this.bubble('onRequestScrollIntoView', {scrollInPointerMode: true});
			return true;
		}
	});

})(enyo, this);
