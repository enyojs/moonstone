//* @public
/**
	sun.Panel_ is the default kind for controls created inside a
	<a href="#moon.Panels">moon.Panels</a> container.  Typically, a sun.Panels_
	will contain several instances of sun.Panel_.

	The built-in features of sun.Panel_ include a header and a FittableRows
	layout for the main body content.
*/

enyo.kind({
	name: "sun.DrawerPanel",
	kind: "sun.Panel",
	
	handlers: {onHeaderLeftTapped:"toggleDrawer"},

	//* @protected
	panelTools: [
		{name: "contentWrapper", kind:"FittableRows", classes: "sun-panel-content-wrapper", components: [
			/* headerTools will be created here */
			{name: "panelBody", fit: true, classes: "sun-panel-body"},
		]},
		{name: "panelDrawer", kind:"FittableRows", classes: "sun-panel-drawer"},
		{name: "animator", kind: "StyleAnimator", onStep: "animationStep", onComplete: "animationComplete"}
	],
	bodyComponents: [],
	drawerComponents: [],
	headerConfig: {name: "header", kind: "sun.Header", isChrome: true},
	headerOption: null,

	//* @protected
	isDrawerClosed: true,
	isAnimationPlaying: false,

	//* @protected
	create: function() {
		this.inherited(arguments);
		this.$.panelBody.createComponents(this.bodyComponents, {owner: this});
		this.$.panelDrawer.createComponents(this.drawerComponents, {owner: this});
	},
	initComponents: function() {
		this.createTools();
		this.controlParentName = "panelBody";
		this.discoverControlParent();
	},
	createTools: function() {
		// Create everything but the header
		this.createChrome(this.panelTools);
		// Special-handling for header, which can have its options modified by the instance
		var hc = enyo.clone(this.headerConfig || {});
		var ho = enyo.clone(this.get("headerOption") || {});
		hc.addBefore = this.$.panelBody;
		enyo.mixin(hc, ho);
		this.$.contentWrapper.createComponent(hc, {owner:this});
		this.$.panelDrawer.setShowing(false);
	},

	//* @public
	toggleDrawer: function() {
		if (this.isAnimationPlaying) {
			return;
		} else if (this.isDrawerClosed) {
			this.$.panelDrawer.setShowing(true);
			this.$.animator.newAnimation({
				name: "openDrawer",
				duration: 250,
				timingFunction: "cubic-bezier(.25,.1,.25,1)",
				keyframes: {
					0: [{control: this, properties: {"left" : 0 + "%"}}],
					100: [{control: this, properties: {"left" : 50 + "%"}}]
				}
			});
			this.$.animator.play("openDrawer");
		}
		else {
			this.$.animator.newAnimation({
				name: "closeDrawer",
				duration: 250,
				timingFunction: "cubic-bezier(.25,.1,.25,1)",
				keyframes: {
					0: [{control: this, properties: {"left" : 50 + "%"}}],
					100: [{control: this, properties: {"left" : 0 + "%"}}]
				}
			});
			this.$.animator.play("closeDrawer");
		}
	},

	//* @protected
	animationStep: function(inSender, inEvent) {
		this.isAnimationPlaying = true;
		return true;
	},
	animationComplete: function(inSender, inEvent) {
		this.isAnimationPlaying = false;
		if (this.isDrawerClosed) {
			this.isDrawerClosed = false;
		} else {
			this.isDrawerClosed = true;
			this.$.panelDrawer.setShowing(false);
		}
		this.$.animator.stop();
	}
});
