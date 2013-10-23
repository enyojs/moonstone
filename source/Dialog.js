/**
	_moon.Dialog_ is a <a href="#moon.Popup">moon.Popup</a> with a title, a
	message, and an area for additional controls.
*/
enyo.kind({
	name: "moon.Dialog",
	kind: moon.Popup,
	classes: "moon-dialog",
	published: {
		title: "",
		message: ""
	},
	bounds: null,
	tools: [
		{
			name: "dialogwrapper",
			classes: "moon-neutral moon-dialog-wrapper",
			components: [
				{name: "title", classes: "moon-header-font moon-popup-header-text moon-dialog-title"},
				{
					layoutKind: "FittableColumnsLayout",
					components: [
						{name: "message", kind:"moon.BodyText", fit: true},
						{name: "client"}
					]
				}
			]
		},
		{name: "showHideAnimator", kind: "StyleAnimator", onComplete: "animationComplete"}
	],
	create: function() {
		this.inherited(arguments);
		this.titleChanged();
		this.messageChanged();
	},
	titleChanged: function() {
		this.$.title.setContent(this.title);
	},
	messageChanged: function() {
		this.$.message.setContent(this.message);
	},
	show: function () {
		this.inherited(arguments);
		if (!this.bounds) {
			this.bounds = this.getBounds();
		}
		this.$.showHideAnimator.play(this.createShowAnimation().name);
	},
	hide: function () {
		this.showHideScrim(false);
		this.$.showHideAnimator.play(this.createHideAnimation().name);
		this.aniCompleteCallback = function () {
			this.setShowing(false);
		};
	},
	animationComplete: function (inSender, inEvent) {
		if (this.aniCompleteCallback) {
			this.aniCompleteCallback();
		}
		this.aniCompleteCallback = null;
		return true;
	},
	createShowAnimation: function() {
		return this.$.showHideAnimator.newAnimation({
			name: "show",
			duration: 200,
			timingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1)",
			keyframes: {
				0: [
					{control: this.$.dialogwrapper, properties: { "-webkit-transform": "translateY(" + this.bounds.height + "px)" }}
				],
				100: [
					{control: this.$.dialogwrapper, properties: { "-webkit-transform": "translateY(0)" }}
				]
			}
		});
	},
	createHideAnimation: function() {
		return this.$.showHideAnimator.newAnimation({
			name: "hide",
			duration: 200,
			timingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1)",
			keyframes: {
				0: [
					{control: this.$.dialogwrapper, properties: { "-webkit-transform": "current" }}
				],
				100: [
					{control: this.$.dialogwrapper, properties: { "-webkit-transform": "translateY(" + this.bounds.height + "px)" }}
				]
			}
		});
	}
});