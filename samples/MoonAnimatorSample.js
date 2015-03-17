enyo.kind({
	name: "moon.sample.MoonAnimatorSample",
	classes: "moon enyo-fit enyo-unselectable moon-video-player-sample",
	fit: true,
	components: [
		{content: "", name: "direction"},
		{name: "panel", style: "position: absolute; top: 50px; left: 100%; width: 80%; height: 50px; background-color: red;"},
		{name: "breadcrumb", style: "position: absolute; top: 50px; left: 100%; width: 100px; height: 50px; background-color: blue;"},
		{name: "animator", kind: "moon.MoonAnimator", useBezier: true, onStep: "stepAnimation", onEnd: "animationEnded" }
	],
	create: function() {
		this.inherited(arguments);
		// Configure animator
		this.$.animator.addConfig({
			panel: {
				forward: { startValue: 0, endValue: 1, delay: 0, duration: 500, bezier: [.69,.01,.97,.59]},
				backward: { startValue: 0, endValue: 1, delay: 0, duration: 500, bezier: [.06,.53,.38,.99] }
			},
			breadcrumb: {
				forward: { startValue: 0, endValue: 1, delay: 500, duration: 70, bezier: [.46,.28,.76,.57] },
				backward: { startValue: 0, endValue: 1, delay: 250, duration: 250, bezier: [.08,.51,.24,.99] }
			}
		});
	},
	stepAnimation: function(inSender, inEvent) {
		this.$.panel.applyStyle("left", 20+inSender.values["panel"] + "%");
		this.$.breadcrumb.applyStyle("left", inSender.values["breadcrumb"] + "%");
	},
	animationEnded: function(){
		var animator = this.$.animator;
		// Reverse direction of animation for Demo
		animator.direction = (animator.direction == 'backward') ? 'forward' : 'backward';
		this.doAnimation();
	},
	rendered: function(){
		this.inherited(arguments);
		this.doAnimation();
	},
	defer: false,
	doAnimation: function(){
		var animator = this.$.animator;
		this.startJob("doAnimation", function(){
			animator.play();
			this.$.direction.setContent("Direction: " + animator.direction);
			this.defer = !this.defer;
		}, 500);
	}
});
