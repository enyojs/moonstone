enyo.kind({
	name: 'moon.MarqueeTextWithAnimator',
	kind: 'moon.MarqueeText',
	tools: [
		{name: 'animator', kind: 'enyo.Animator', onStep: '_drawFrame', onEnd: '_marquee_animationEnded', easingFunction: enyo.easing.linear}
	],
	// @override
	initComponents: enyo.inherit(function (sup) {
		return function() {
			sup.apply(this, arguments);
			this.createComponents(this.tools);
		};
	}),
	// @override
	_marquee_animationEnded: enyo.inherit(function (sup) {
		return function(sender, ev) {
			this.startJob('stopMarquee', '_marquee_stopAnimation', this.marqueePause);
			return true;
		};
	}),
	// @override
	_marquee_addAnimationStyles: enyo.inherit(function (sup) {
		return function(distance) {
			var duration = this._marquee_calcDuration(distance);

			this.$.marqueeText.addClass('animate-marquee');

			this.$.animator.setDuration(duration * 1000);
			this.$.animator.setEndValue(distance);

			this.$.animator.play();
		};
	}),
	// @override
	_marquee_removeAnimationStyles: enyo.inherit(function (sup) {
		return function() {
			if (!this.$.marqueeText) {
				return;
			}

			this.$.animator.stop();
			this.$.marqueeText.applyStyle(this._styleKey, 'translate3d(' + 0 + 'px, 0, 0)');
			this.$.marqueeText.removeClass('animate-marquee');
		};
	}),
	_drawFrame: function(inSender, inEvent) {
		this.$.marqueeText.applyStyle(this._styleKey, 'translate3d(' + (-inSender.value) + 'px, 0, 0)');
	},
	_styleKey: '-webkit-transform'
});