(function (enyo, scope) {
	/**
	* Fires when either the main drawer or the control drawer is activated.
	*
	* @event moon.Drawer#event:onActivate
	* @type {Object}
	* @property {Object} sender - The [component]{@link enyo.Component} that most recently
	*	propagated the [event]{@link external:event}.
	* @property {Object} event - An [object]{@link external:Object} containing
	*	[event]{@link external:event} information.
	* @public
	*/

	/**
	* Fires when either the main drawer or the control drawer is deactivated.
	*
	* @event moon.Drawer#event:onDeactivate
	* @type {Object}
	* @property {Object} sender - The [component]{@link enyo.Component} that most recently
	*	propagated the [event]{@link external:event}.
	* @property {Object} event - An [object]{@link external:Object} containing
	*	[event]{@link external:event} information.
	* @public
	*/


	/**
	* _moon.Drawer_, a control designed for use with {@link moon.Drawers},
	* consists of two drawers and a {@link moon.DrawerHandle}.
	* The main drawer is populated with any child components that are specified in
	* the constructor; the optional second drawer {@link moon.Drawer#controlDrawer} is populated
	* with components passed into the {@link moon.Drawer#controlDrawerComponents} property.
	*
	* If the second drawer has no components, the main drawer will take up the full
	* height of the containing view; otherwise, its height will be equal to the
	* height of the containing view minus the height of the
	* {@link moon.Drawer#controlDrawerComponents}.
	*
	* A call to {@link moon.Drawer#toggleDrawer} will open the {@link moon.Drawer#controlDrawer} if
	* {@link moon.Drawer#controlDrawerComponents} is non-empty; otherwise, it will open the main
	* drawer.
	*
	* The control's child components may be of any kind.
	*
	* ```
	* 		{
	* 			name: 'musicDrawer',
	* 			kind: 'moon.Drawer',
	* 			handle: {kind: 'moon.DrawerHandle', content: 'Handle'},
	* 			components: [
	* 				{content: 'Drawer Content'}
	* 			],
	* 			controlDrawerComponents: [
	* 				{content: 'Controls'}
	* 			]
	* 		}
	* ```
	*
	* @ui
	* @class moon.Drawer
	* @extends enyo.Control
	* @public
	*/
	enyo.kind(
		/** @lends moon.Drawer.prototype */ {

		/**
		* @private
		*/
		name: 'moon.Drawer',

		/**
		* @private
		*/
		kind:'enyo.Control',

		/**
		* @private
		*/
		classes: 'moon-drawer moon-neutral',

		/**
		* @private
		*/
		published: /** @lends moon.Drawer.prototype */ {

			/**
			* Components that are to be placed in the control drawer
			*
			* @type {Object}
			* @default null
			* @public
			*/
			controlDrawerComponents: null,

			/**
			* Typically set to an instance of {@link moon.DrawerHandle}
			*
			* @type {Object}
			* @default null
			* @public
			*/
			handle: null,

			/**
			* Visibility state of the main drawer
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			open: false,

			/**
			* Visibility state of the control drawer
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			controlsOpen: false
		},

		/**
		* @private
		*/
		events: {

			/**
			* {@link moon.Drawer#event:onActivate}
			*/
			onActivate: '',

			/**
			* {@link moon.Drawer#event:onDeactivate}
			*/
			onDeactivate: ''
		},

		/**
		* @private
		*/
		handlers: {

			/**
			* Handler for initial rendering event
			*/
			onDrawersRendered: 'drawersRendered',

			/**
			* Handler for initial resizing event to size drawers to full screen
			*/
			onDrawersResized: 'drawersResized'
		},

		/**
		* @private
		*/
		components: [
			{name: 'client', kind: 'moon.FullScreenDrawer', spotlightDisabled: true, resizeContainer:false},
			{name: 'controlDrawer', kind: 'enyo.Drawer', spotlightDisabled: true, resizeContainer:false}
		],

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.$.controlDrawer.createComponents(this.controlDrawerComponents, {owner:this.owner});
			//* Todo: remove padding on client
			this.$.client.$.client.addClass('moon-drawer-client');
			this.$.controlDrawer.$.client.addClass('moon-drawer-partial-client');
		},

		/**
		* @private
		*/
		drawersRendered: function (inSender, inEvent) {
			this.$.client.setDrawerProps({height: this.calcDrawerHeight(inEvent.drawersHeight)});
			this.openChanged();
			if (!this.controlsOpen) {
				this.$.controlDrawer.setAnimated(false);
				this.$.controlDrawer.setOpen(this.controlsOpen);
				this.$.controlDrawer.setAnimated(true);
			} else {
				this.controlsOpenChanged();
			}
		},

		/**
		* @private
		*/
		calcDrawerHeight: function (drawersHeight) {
			var clientHeight = drawersHeight;
			if (this.controlDrawerComponents == null) {
				return clientHeight;
			} else {
				this.controlDrawerHeight = (this.controlDrawerHeight) ? this.controlDrawerHeight : this.$.controlDrawer.hasNode().getBoundingClientRect().height;
				return (clientHeight - this.controlDrawerHeight);
			}
		},

		/**
		* @private
		*/
		toggleDrawer: function () {
			if (this.controlDrawerComponents == null) {
				this.setOpen(!this.open);
			} else {
				this.setControlsOpen(!this.controlsOpen);
			}
			return true;
		},

		/**
		* @fires moon.Drawer#event:onActivate
		* @fires moon.Drawer#event:onDeactivate
		* @private
		*/
		openChanged: function () {
			this.$.client.setOpen(this.open);
			if (this.open) {
				this.doActivate();
				this.$.client.spotlightDisabled = false;
				enyo.Spotlight.spot(this.$.client);
			} else {
				this.$.client.spotlightDisabled = true;
				this.doDeactivate();
			}
		},

		/**
		* @fires moon.Drawer#event:onActivate
		* @fires moon.Drawer#event:onDeactivate
		* @private
		*/
		controlsOpenChanged: function () {
			this.$.controlDrawer.setOpen(this.controlsOpen);
			if (this.controlsOpen) {
				this.doActivate();
				this.$.controlDrawer.spotlightDisabled = false;
				enyo.Spotlight.spot(this.$.controlDrawer);
			} else {
				if (this.$.client.getOpen()) {
					this.$.client.setOpen(false);
				}
				this.$.controlDrawer.spotlightDisabled = true;
				this.doDeactivate();
			}
		},

		/**
		* @private
		*/
		drawersResized: function (inSender, inEvent) {
			this.$.client.setDrawerProps({height: this.calcDrawerHeight(inEvent.drawersHeight)});
			this.setOpen(false);
			this.setControlsOpen(false);
		}
	});

	/**
	* _moon.FullScreenDrawer_ is a content-free drawer that fills the client's
	* full screen area.  It is only intended for use inside of {@link moon.Drawer}.
	* Users should not instantiate {@link moon.FullScreenDrawer} directly.
	*
	* @class moon.FullScreenDrawer
	* @extends enyo.Drawer
	* @protected
	*/
	enyo.kind({

		/**
		* @private
		*/
		name: 'moon.FullScreenDrawer',

		/**
		* @private
		*/
		kind: 'enyo.Drawer',

		/**
		* @private
		*/
		handlers: {
			onResizeDrawer: 'resizeDrawer'
		},

		/**
		* @private
		*/
		open: false,

		/**
		* @private
		*/
		published: {

			/**
			* An object that holds the client dimensions for the fullscreen drawer,
			* e.g.: _drawer.setDrawerProps({height:100px});_.  This property is only
			* intended to be used internally by {@link moon.Drawer}.
			*
			* @type {object}
			* @default null
			* @public
			*/
			drawerProps: null
		},

		/**
		* @private
		*/
		initComponents: function () {
			this.inherited(arguments);
			this.$.client.setShowing(true);
		},

		/**
		* @private
		*/
		openChanged: function () {
			this.$.client.show();
			if (this.hasNode()) {
				if (this.$.animator.isAnimating()) {
					this.$.animator.reverse();
				} else {
					var v = this.orient == 'v';
					var d = v ? 'height' : 'width';
					var p = v ? 'top' : 'left';
					var s = this.drawerProps.height;
					// unfixing the height/width is needed to properly
					// measure the scrollHeight/Width DOM property, but
					// can cause a momentary flash of content on some browsers
					this.applyStyle(d, null);

					if (this.animated) {
						this.$.animator.play({
							startValue: this.open ? 0 : s,
							endValue: this.open ? s : 0,
							dimension: d,
							position: p
						});
					} else {
						// directly run last frame if not animating
						this.animatorEnd();
					}
				}
			}
		},

		/**
		* @private
		*/
		animatorEnd: function () {
			if (!this.open) {
				this.$.client.hide();
			}
			if (this.container) {
				this.container.resize();
			}
		},

		/**
		* @private
		*/
		resizeDrawer: function (inSender, inProps) {
			this.drawerProps = inProps;
			if ((this.open) && (!this.$.animator.isAnimating())) {
				this.applyStyle('height', inProps.height + 'px');
			}
			return true;
		},

		/**
		* @private
		*/
		drawerPropsChanged: function (){
			this.$.client.applyStyle('height', this.drawerProps.height + 'px');
			this.$.client.resize();
			this.$.client.setShowing(this.open);
		}
	});

})(enyo, this);