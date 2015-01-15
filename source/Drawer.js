(function (enyo, scope) {
	/**
	* Fires when either the main drawer or the control drawer is activated. No event-specific
	* data is sent with this event.
	*
	* @event moon.Drawer#onActivate
	* @type {Object}
	* @public
	*/

	/**
	* Fires when either the main drawer or the control drawer is deactivated. No event-specific
	* data is sent with this event.
	*
	* @event moon.Drawer#onDeactivate
	* @type {Object}
	* @public
	*/

	/**
	* {@link moon.Drawer}, a control designed for use with {@link moon.Drawers},
	* consists of two drawers and a handle.
	* The main drawer is populated with any child components that are specified in
	* the constructor; the optional second drawer (control drawer) is populated
	* with components passed into the
	* [controlDrawerComponents]{@link moon.Drawer#controlDrawerComponents} property.
	*
	* If the second drawer has no components, the main drawer will take up the full
	* height of the containing view; otherwise, its height will be equal to the
	* height of the containing view minus the height of the `controlDrawerComponents`.
	*
	* A call to [toggleDrawer()]{@link moon.Drawer#toggleDrawer} will open or close
	* the control drawer if `controlDrawerComponents` is non-empty; otherwise, it will
	* open or close the main drawer.
	*
	* The control's child components may be of any kind.
	*
	* ```
	* 		{
	* 			name: 'musicDrawer',
	* 			kind: 'moon.Drawer',
	* 			handle: {name: 'handleButton', content: 'Handle'},
	* 			components: [
	* 				{content: 'Drawer Content'}
	* 			],
	* 			controlDrawerComponents: [
	* 				{content: 'Controls'}
	* 			]
	* 		}
	* ```
	*
	* @class moon.Drawer
	* @extends enyo.Control
	* @ui
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
		* @lends moon.Drawer.prototype
		*/
		published: {

			/**
			* Components that are to be placed in the control drawer.
			*
			* @type {Object}
			* @default null
			* @public
			*/
			controlDrawerComponents: null,

			/**
			* Control that acts a "handle" for the drawer.
			*
			* @type {Object}
			* @default null
			* @public
			*/
			handle: null,

			/**
			* Visibility state of the main drawer.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			open: false,

			/**
			* Visibility state of the control drawer.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			controlsOpen: false,

			/**,
			* When true, pressing back key makes panels returns to previous panel
			*
			* @type {Bollean}
			* @default true
			* @public
			*/
			allowBackKey: true,

			/**
			* If "disableBackHistoryAPI" in AppInfo.json is set to true, this property
			* should be true
			*
			* @type {Bollean}
			* @default false
			* @public
			*/
			disableBackHistoryAPI: false

		},

		/**
		* @private
		*/
		events: {

			/**
			* {@link moon.Drawer#onActivate}
			*/
			onActivate: '',

			/**
			* {@link moon.Drawer#onDeactivate}
			*/
			onDeactivate: ''
		},

		/**
		* @private
		*/
		handlers: {

			/**
			* Handler for initial rendering event.
			*/
			onDrawersRendered: 'drawersRendered',

			/**
			* Handler for initial resizing event to size drawers to fullscreen.
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
		backKeySupporting: [
			{name: "backKeySupport", kind: 'enyo.Signals', onkeyup:'remoteKeyHandler'}
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
			this.allowBackKeyChanged();
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
		* If [controlDrawerComponents]{@link moon.Drawer#controlDrawerComponents} is
		* non-empty, toggles the visibility state of the control drawer; otherwise,
		* toggles the visibility state of the main drawer.
		*
		* @public
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
		* @fires moon.Drawer#onActivate
		* @fires moon.Drawer#onDeactivate
		* @private
		*/
		openChanged: function () {
			this.$.client.setOpen(this.open);
			if (this.open) {
				this.doActivate();
				this.$.client.spotlightDisabled = false;
				enyo.Spotlight.spot(this.$.client);
				if (!this.disableBackHistoryAPI) {
					moon.BackKeySupport.pushStateToHistory(this.id);
				}
			} else {
				this.$.client.spotlightDisabled = true;
				this.doDeactivate();
			}
		},

		/**
		* @fires moon.Drawer#onActivate
		* @fires moon.Drawer#onDeactivate
		* @private
		*/
		controlsOpenChanged: function () {
			this.$.controlDrawer.setOpen(this.controlsOpen);
			if (this.controlsOpen) {
				this.doActivate();
				this.$.controlDrawer.spotlightDisabled = false;
				enyo.Spotlight.spot(this.$.controlDrawer);
				if (!this.disableBackHistoryAPI) {
					moon.BackKeySupport.pushStateToHistory(this.id);
				}
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
		},

		/**
		* @private
		*/
		remoteKeyHandler: function (inSender, inEvent) {
			switch (inEvent.keySymbol) {
			case 'b':
				if (!(this.open || this.controlsOpen) || moon.BackKeySupport.getCurrentObj() != this.id) {
					break;
				}
				if (!this.disableBackHistoryAPI) {
					moon.BackKeySupport.popStateToHistory();
				}
				this.backKeyHandler();
				break;
			}
			return true;
		},
		/**
		* @private
		*/
		backKeyHandler: function () {
			if (this.open) {
				this.setOpen(false);
			} else if (this.controlsOpen) {
				this.setControlsOpen(false);
			}

			return true;
		},

		/**
		* @private
		*/
		allowBackKeyChanged: function () {
			if (this.allowBackKey) {
				this.createChrome(this.backKeySupporting);
				if (!this.disableBackHistoryAPI) {
					window.addEventListener('popstate', enyo.bindSafely(this, function(inEvent) {
						var currentObj = moon.BackKeySupport.getCurrentObj();
						if ((!history.state && !currentObj) || moon.BackKeySupport.isIgnorePopState() || currentObj != this.id) {
							return true;
						} else {
							this.backKeyHandler();
						}
					}));
				}
			} else if(this.$.backKeySupport) {
				this.$.backKeySupport.destroy();
			}
		}
	});

	/**
	* {@link moon.FullScreenDrawer} is a content-free drawer that fills the client's
	* full screen area.  It is only intended for use inside of {@link moon.Drawer}.
	* Users should not instantiate `moon.FullScreenDrawer` directly.
	*
	* @class moon.FullScreenDrawer
	* @extends enyo.Drawer
	* @ui
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
		* @lends moon.FullScreenDrawer.prototype
		*/
		published: {

			/**
			* An object containing the client dimensions for the fullscreen drawer,
			* e.g.:
			* ```
			* drawer.setDrawerProps({height: 100px});
			* ```
			* This property is only intended to be used internally by {@link moon.Drawer}.
			*
			* @type {Object}
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
