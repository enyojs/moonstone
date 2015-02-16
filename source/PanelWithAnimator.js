enyo.kind({
	name: 'moon.PanelWithAnimator',
	kind: 'moon.Panel',
	animationTools: [
		{name: 'panelAnimator', kind: 'enyo.Animator', onStep: 'drawPanelFrame', onEnd: 'animationComplete', easingFunction: enyo.easing.quadInOut},
		{name: 'breadAnimator', kind: 'enyo.Animator', onStep: 'drawBreadFrame', easingFunction: enyo.easing.quadInOut}
	],
	initComponents: function() {
		this.createComponents(this.animationTools);
		this.inherited(arguments);
	},

	/**
	* Called directly by {@link moon.Panels}.
	* @private
	*/
	preTransition: function (info) {
		this.disableMarquees();

		if (!this.shrinking && info.breadcrumb && (!this.isBreadcrumb || this.growing)) {
			this.shrinkAnimation();
			return true;
		}

		return false;
	},

	/**
	* Called directly by {@link moon.Panels}.
	* @private
	*/
	postTransition: function (info) {
		if (!this.growing && !info.breadcrumb && (this.isBreadcrumb || this.shrinking)) {
            //only grow if it has been shrunk before
			this.growAnimation();
			return true;
		}

		return false;
	},

	shrinkAnimation: function () {
		this.growing = false;
		this.shrinking = true;

		this.$.viewport.applyStyle('-webkit-transform', 'translate3d(0, -101%, 0)');
		this.$.contentWrapper.applyStyle('-webkit-transform', 'translate3d(0, 101%, 0)');

		this.$.panelAnimator.setDuration(500);
		this.$.panelAnimator.setStartValue(0);
		this.$.panelAnimator.setEndValue(100);
		this.$.panelAnimator.play();

		setTimeout(enyo.bind(this, 'shrinkBread'), 500 * (36 / 100));
	},

	shrinkBread: function() {
		this.$.breadAnimator.setDuration(500 * (64 / 100));
		this.$.breadAnimator.setStartValue(100);
		this.$.breadAnimator.setEndValue(0);
		this.$.breadAnimator.play();
	},

	/**
	* @private
	*/
	shrink: function () {
		this.$.viewport.applyStyle('-webkit-transform', 'translate3d(0, -101%, 0)');
		this.$.contentWrapper.applyStyle('-webkit-transform', 'translate3d(0, 101%, 0)');
	},

	/**
	* @private
	*/
	growAnimation: function () {
		this.growing = true;
		this.shrinking = false;

		this.$.panelAnimator.setDuration(100);
		this.$.panelAnimator.setStartValue(100);
		this.$.panelAnimator.setEndValue(0);
		this.$.panelAnimator.play();

		this.$.breadcrumbViewport.applyStyle('-webkit-transform', 'translate3d(0, 101%, 0)');
		this.$.breadcrumbBackground.applyStyle('-webkit-transform', 'translate3d(0, -101%, 0)');

		//it seems like not needed..
		//setTimeout(enyo.bind(this, 'growBread'), 500 * (36 / 100));
	},

	growBread: function() {
		this.$.breadAnimator.setDuration(400 * (64 / 100));
		this.$.breadAnimator.setStartValue(0);
		this.$.breadAnimator.setEndValue(100);
		this.$.breadAnimator.play();
	},

	/**
	* @private
	*/
	grow: function () {
		this.$.breadcrumbViewport.applyStyle('-webkit-transform', 'translate3d(0, 101%, 0)');
		this.$.breadcrumbBackground.applyStyle('-webkit-transform', 'translate3d(0, -101%, 0)');
	},

	/**
	* @private
	*/
	haltAnimations: function () {
	},

	/**
	* @private
	*/
	animationComplete: function (sender, event) {
		if (this.shrinking) {
			this.$.viewport.applyStyle('-webkit-transform', 'translate3d(0, -101%, 0)');
			this.$.contentWrapper.applyStyle('-webkit-transform', 'translate3d(0, 101%, 0)');
			this.preTransitionComplete();
			return true;
		}
		if (this.growing) {
			this.$.viewport.applyStyle('-webkit-transform', 'translate3d(0, 0, 0)');
			this.$.contentWrapper.applyStyle('-webkit-transform', 'translate3d(0, 0, 0)');
			this.postTransitionComplete();
			return true;
		}
	},
	drawPanelFrame: function(sender, ev) {
		this.$.viewport.applyStyle('-webkit-transform', 'translate3d(0, -' + sender.value + '%, 0)');
		this.$.contentWrapper.applyStyle('-webkit-transform', 'translate3d(0, ' + sender.value + '%, 0)');
	},
	drawBreadFrame: function(sender, ev) {
		this.$.breadcrumbViewport.applyStyle('-webkit-transform', 'translate3d(0, ' + sender.value + '%, 0)');
		this.$.breadcrumbBackground.applyStyle('-webkit-transform', 'translate3d(0, -' + sender.value + '%, 0)');
	}
});