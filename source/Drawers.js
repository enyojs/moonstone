(function (enyo, scope) {
	/**
	* Handler for initial rendering event
	*
	* event.drawersHeight contains the height of the drawer
	*
	* @event moon.Drawers#event:onDrawersRendered
	* @type {Object}
	* @property {Object} sender - The [component]{@link enyo.Component} that most recently
	*	propagated the [event]{@link external:event}.
	* @property {Object} event - An [object]{@link external:Object} containing
	*	[event]{@link external:event} information.
	* @public
	*/

	/**
	* Handler for initial resizing event to size drawers to full screen
	*
	* event.drawersHeight contains the height of the drawer
	*
	* @event moon.Drawers#event:onDrawersResized
	* @type {Object}
	* @property {Object} sender - The [component]{@link enyo.Component} that most recently
	*	propagated the [event]{@link external:event}.
	* @property {Object} event - An [object]{@link external:Object} containing
	*	[event]{@link external:event} information.
	* @public
	*/


	/**
	* _moon.Drawers_ is a container kind designed to hold a set of
	* {@link moon.Drawer} objects and client content. The {@link moon.Drawers#drawers} property
	* accepts an array of {@link moon.Drawer} controls. The associated
	* {@link moon.DrawerHandle) are positioned in their own small drawer,
	* centered at the top of the 'dresser'--the region containing the array of
	* Drawer controls and the activator nub.
	*
	* When a handle is selected, it opens the corresponding Drawer object's main
	* drawer or control drawer, depending on how the Drawer object is configured.
	* The control's child components may be of any kind.
	*
	* ```
	*		{
	*			kind: 'moon.Drawers',
	*			drawers: [
	*				{
	*					name: 'musicDrawer',
	*					kind: 'moon.Drawer',
	*					handle: {kind: 'moon.DrawerHandle', content: 'Handle'},
	*					components: [
	*						{content: 'Drawer Content'}
	*					],
	*					controlDrawerComponents: [
	*						{content: 'Controls'}
	*					]
	*				}
	*			],
	*		components: [
	*				{content: 'Content Area'}
	*			]
	*		}
	* ```
	*
	* @class moon.Drawers
	* @extends enyo.Control
	* @public
	*/
	enyo.kind(
		/** @lends moon.Drawers.prototype */ {

		/**
		* @private
		*/
		name: 'moon.Drawers',

		/**
		* @private
		*/
		kind: 'enyo.Control',

		/**
		* @private
		*/
		classes: 'moon-drawers enyo-fit',

		/**
		* @private
		*/
		published: /** @lends moon.Drawers.prototype */ {

			/**
			* Populate with an array of {@link moon.Drawer} components
			*
			* @type {object}
			* @default null
			* @public
			*/
			drawers: null,
			//* icon src of drawer
			src:""
		},

		/**
		* @private
		*/
		handlers: {
			//* Handlers to update the activator when the state of the contained drawers changes
			onActivate: 'drawerActivated',
			onDeactivate: 'drawerDeactivated',
			onSpotlightDown:'spotDown',
			onSpotlightUp:'spotUp'
		},

		/**
		* @private
		*/
		components: [
			{name:'activatorWrapper', classes:'moon-drawers-activator-wrapper', spotlight:true, ontap:'activatorHandler', components: [
				{name:"activator", classes:"moon-drawers-activator",mixins: ["enyo.StylesheetSupport"],stylesheetContent:""}
			]},
			{name:'handleContainer', classes:'moon-drawers-handle-container', kind:'enyo.Drawer', resizeContainer:false, open:false, spotlightDisabled: true, onpostresize:'resizeHandleContainer', components:[
				{name:'handles', classes:'moon-neutral moon-drawers-handles'}
			]},
			{name: 'drawers', classes:'moon-drawers-drawer-container'},
			{name: 'client', classes:'moon-drawers-client'}
		],

		/**
		* @private
		*/
		eventsToCapture: {
			ontap: 'captureTapSelect',
			onSpotlightFocus: 'captureSpotFocus',
			onSpotlightSelect: 'captureTapSelect'
		},

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.$.drawers.createComponents(this.drawers, {kind: 'moon.Drawer', owner:this.owner});
			this.setupHandles();
			if(this.src){
				this.srcChanged();
			}
		},

		/**
		* event waterfalls down
		* @fires moon.Drawers#event:onDrawersRendered
		* @private
		*/
		rendered: function () {
			this.inherited(arguments);
			var dh = document.body.getBoundingClientRect().height;
			this.waterfall('onDrawersRendered', {drawersHeight: dh});
		},

		/**
		* @private
		*/
		setupHandles: function () {
			var handles = []
				, controls, index;

			// cover the case where one is not defined
			if (this.drawers) {
				for (index = 0; index < this.drawers.length; ++index) {
					handles.push(this.drawers[index].handle || {});
				}
				this.$.handles.createComponents(handles, {kind: 'moon.DrawerHandle', owner:this});
				controls = this.$.handles.getControls();
				enyo.forEach(handles, function (handle, idx) {
					controls[idx].addClass('moon-drawers-handle');
					controls[idx].tap = this.bindSafely(this.handleTapped);
				}, this);
			}
		},
		//Callback if icon source is changed
		srcChanged: function(num){
			var src = this.src || null;
			//for class rules in css, needs to replace any special character in icon name with _
			var className=src.replace(/[^a-zA-Z0-9]/g,'_');
			if (src) {
				if (src != "none" && src != "inherit" && src != "initial") {
					src = "url(" + enyo.path.rewrite(this.src) + ")";
				}
				//Overriding content of div if src is passed
				this.$.activator.addClass('moon-'+ className + '-d');
				this.$.activator.addStylesheetContent('.moon-'+ className +'-d.moon-drawers-activator:after{content:'+src+'}');
				this.$.activator.addStylesheetContent('.moon-'+ className +'-d.moon-drawers-activator.open:after{content:url(../images/DarkTheme_Icons/drawer_up_spotlight.png)}');
			}
		},

		/**
		* @private
		*/
		activatorHandler: function (){
			if (this.drawerOpen()) {
				this.closeDrawers();
			} else {
				if (this.$.handles.getControls().length == 1) {
					this.openDrawer(this.$.handles.getControls()[0]);
					this.updateActivator(true);
				} else {
					if (this.$.handleContainer.getOpen()) {
						this.closeHandleContainer();
					} else {
						this.openHandleContainer();
					}
				}
			}
		},

		/**
		* @private
		*/
		openHandleContainer: function () {
			this.$.handleContainer.spotlightDisabled = false;
			this.$.handleContainer.setOpen(true);
			enyo.Spotlight.spot(this.$.handleContainer);
			this.updateActivator(true);
			enyo.dispatcher.capture(this.$.handleContainer, this.eventsToCapture, this);
		},

		/**
		* @private
		*/
		closeHandleContainer: function () {
			enyo.dispatcher.release(this.$.handleContainer);
			this.$.handleContainer.spotlightDisabled = true;
			this.$.handleContainer.setOpen(false);
			this.updateActivator(this.drawerOpen());
		},

		/**
		* @private
		*/
		handleTapped: function (inSender, inEvent) {
			this.openDrawer(inEvent.originator);
			return true;
		},

		/**
		* @private
		*/
		openDrawer: function (drawer) {
			var handles = this.$.handles.getControls();
			for (var index = 0; index < handles.length; ++index)
			{
				if (handles[index] == drawer || enyo.Spotlight.Util.isChild(handles[index],drawer)) {
					drawer = this.$.drawers.getControls()[index];
					drawer.toggleDrawer();
					this.closeHandleContainer();
					enyo.dispatcher.capture(drawer, this.eventsToCapture, this);
					return;
				}
			}
		},

		/**
		* @private
		*/
		drawerOpen: function () {
			var drawers = this.$.drawers.getControls();
			for (var index = 0; index < drawers.length; ++index){
				if (drawers[index].getOpen() || drawers[index].getControlsOpen()) {
					return true;
				}
			}
			return false;
		},

		/**
		* @private
		*/
		closeDrawers: function () {
			var drawers = this.$.drawers.getControls();
			for (var index = 0; index < drawers.length; ++index){
				var drawer = drawers[index];
				if (drawer.getOpen() || drawer.getControlsOpen()) {
					enyo.dispatcher.release(drawer);
					drawer.setOpen(false);
					drawer.setControlsOpen(false);
				}
			}
			this.updateActivator(false);
		},

		/**
		* @private
		*/
		captureSpotFocus: function (inSender, inEvent) {
			// Only close drawers on 5-way focus in the client (not pointer focus)
			if (inEvent.dir && inEvent.dispatchTarget.isDescendantOf(this.$.client)) {
				this.closeDrawers();
				this.closeHandleContainer();
			}
		},

		/**
		* @private
		*/
		captureTapSelect: function (inSender, inEvent) {
			// Any tap or select in the client area closes the dresser/drawer
			if (inEvent.dispatchTarget.isDescendantOf(this.$.client)) {
				this.closeDrawers();
				this.closeHandleContainer();
			}
		},

		/**
		* @private
		*/
		drawerActivated: function (inSender, inEvent) {
			if (inEvent.originator instanceof moon.Drawer) {
				this.updateActivator(true);
				// Hide client when fullscreen drawer is open so it is not focusable
				if (inEvent.originator.getOpen()) {
					this.$.client.hide();
				}
			}
		},

		/**
		* @private
		*/
		drawerDeactivated: function (inSender, inEvent) {
			if (inEvent.originator instanceof moon.Drawer) {
				if (!inEvent.originator.getOpen() && !inEvent.originator.getControlsOpen()) {
					this.updateActivator(false);
				}
				// Re-show client when closing fullscreen drawer
				if (!inEvent.originator.getOpen()) {
					this.$.client.show();
				}
			}
		},

		/**
		* @private
		*/
		updateActivator: function (up) {
			this.$.activator.addRemoveClass('open', up);
		},

		/**
		* @fires moon.Drawers#event:onDrawersResized
		* @private
		*/
		handleResize: function () {
			this.inherited(arguments);
			var dh = document.body.getBoundingClientRect().height;
			this.waterfall('onDrawersResized', {drawersHeight: dh});
			this.updateActivator(false);
		},

		/**
		* Updates the activator's style only when it is not animating, so that there
		* are no visual artifacts.
		*
		* @private
		*/
		resizeHandleContainer: function (inSender, inEvent) {
			enyo.asyncMethod(inEvent.delegate.bindSafely(function (){
				if (!this.$.animator.isAnimating()) {
					this.parent.$.activator.addRemoveClass('drawer-open', this.parent.drawerOpen() ? true : false);
				}
			}));
		},

		/**
		* @private
		*/
		handleAtIndex: function (inIndex) {
			return this.$.handles.getControls()[inIndex];
		},

		/**
		* @private
		*/
		destroy: function () {
			enyo.dispatcher.release(this.$.handleContainer);
			for (var i=0, c$=this.$.drawers.getControls(); i<c$.length; i++) {
				enyo.dispatcher.release(c$[i]);
			}
			this.inherited(arguments);
		}
	});

})(enyo, this);
