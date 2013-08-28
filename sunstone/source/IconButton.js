//* @public
/**
	_sun.IconButton_ is an <a href="#sun.IconButton">sun.IconButton</a> with Mobile
	styling applied. 
*/

enyo.kind({
	name: "sun.IconButton",
	kind: "moon.IconButton",
	published: {
		//* If true, the moon-small-icon-button css class will be applied to this button
		small: false
	},
	create: function() {
		this.inherited(arguments);
		this.smallChanged();
	},
	//* @protected
	smallChanged: function() {
		this.addRemoveClass("moon-small-icon-button", this.getSmall());
	}
});

enyo.kind({
	name: "sun.LoadingIconButton",
	kind: "sun.IconButton",
	published: {
		loading: false
	},
	components: [
		{
			kind: "enyo.Animator", startValue: 0, endValue: 360, duration: 1000,
			easingFunction: enyo.easing.linear,
			onStep: "animatorStep", onEnd: "animatorEnd"
		}
	],
	create: function() {
		this.inherited(arguments);
		this.loadingChanged();
	},
	loadingChanged: function() {
		this.addRemoveClass("moon-loading-icon-button", this.getLoading());
		if(this.getLoading()) {
			this.applyStyle("background-image","");
			this.setDisabled(true);

			this.$.animator.play();
		} else {
			this.srcChanged();
			this.applyStyle("-webkit-transform","");
			this.setDisabled(false);

			this.$.animator.stop();
		}
	},
	animatorStep: function(inSender) {
		this.applyStyle("-webkit-transform","rotate(" + inSender.value + "deg)");
		return true;
	},
	animatorEnd: function(inSender) {
		if(this.getLoading()) {
			this.$.animator.play();
		}
		return true;
	}
});
