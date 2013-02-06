/**

	A control that presents a range of selection options in the form of a
	horizontal slider with a control knob.  The knob may be tapped and dragged
	to the desired location.

		{kind: "moon.Slider", value: 30}
		{kind: "moon.Slider", value: 60, nofocus: false}

	The _onChanging_ event is fired when dragging the control knob.
	The _onChange_ event is fired when the position is set, either by finishing
	a drag or by tapping the bar.
*/
enyo.kind({
	name: "moon.Slider",
	classes: "moon-slider",
	spotlight: true,
	published: {
		progress: 0,
		min: 0,
		max: 100,
		barClasses: "",
		lockBar: true,
		nofocus: true,
		value: 0,
		completed: 0,
		tappable: true,
		//* When true, button is shown as disabled and does not generate tap
		//* events
		disabled: false
	},
	events: {
		//* Fires when progress animation to a position finishes.
		onAnimateProgressFinish: "",
		//* Fires when bar position is set. The _value_ property contains the
		//* new position.
		onChange: "",
		//* Fires while control knob is being dragged. The _value_ property
		//* contains the current position.
		onChanging: "",
		//* Fires when animation to a position finishes.
		onAnimateFinish: ""
	},
	handlers: {
		ondragstart: "dragstart",
		ondrag: "drag",
		ondragfinish: "dragfinish"
	},
	components: [
		{name: "progressAnimator", kind: "Animator", onStep: "progressAnimatorStep", onEnd: "progressAnimatorComplete"},
		{name: "animator", kind: "Animator", onStep: "animatorStep", onEnd: "animatorComplete"},

		{name: "taparea", classes: "moon-slider-taparea"},

		{name: "bar", classes: "moon-slider-bar"},

		{name: "knob", ondown: "showKnobStatus", onup: "hideKnobStatus", classes: "moon-slider-knob"},
	],
	//* @protected
	create: function() {
		this.inherited(arguments);
		this.nofocusChanged();
		this.progressChanged();
		this.barClassesChanged();
		this.valueChanged();
		this.disabledChanged();
	},
	rendered: function() {
		this.inherited(arguments);
		this.knobLeft = this.hasNode().getBoundingClientRect().left;
//		this.drawToCanvas(this.controlColor);
//		this.adjustPopupPosition(false);
	},
	nofocusChanged: function() {
		this.$.knob.setShowing(!this.nofocus);
		this.tappable = !this.nofocus;

		this.$.bar.removeClass(this.barClasses);
		this.$.knob.removeClass(this.barClasses);
		this.barClasses = !this.nofocus ? "moon-slider-focus" : "moon-slider-nofocus";
		this.$.bar.addClass(this.barClasses);
		this.$.knob.addClass(this.barClasses);
	},
	barClassesChanged: function(inOld) {
		this.$.bar.removeClass(inOld);
		this.$.bar.addClass(this.barClasses);
	},
	progressChanged: function() {
		this.progress = this.clampValue(this.min, this.max, this.progress);
		var p = this.calcPercent(this.progress);
		this.updateBarPosition(p);
	},
	clampValue: function(inMin, inMax, inValue) {
		return Math.max(inMin, Math.min(inValue, inMax));
	},
	calcRatio: function(inValue) {
		return (inValue - this.min) / (this.max - this.min);
	},
	calcPercent: function(inValue) {
		return this.calcRatio(inValue) * 100;
	},
	updateBarPosition: function(inPercent) {
		this.$.bar.applyStyle("width", inPercent + "%");
	},
	disabledChanged: function() {
		this.addRemoveClass("disabled", this.disabled);
		this.setTappable(!this.disabled);
	},
	valueChanged: function() {
		this.value = this.clampValue(this.min, this.max, this.value);
		var p = this.calcPercent(this.value);
		this.updateKnobPosition(p);
		if (this.lockBar || this.nofocus) {
			this.setProgress(this.value);
		}
	},
	updateKnobPosition: function(inPercent) {
		this.$.knob.applyStyle("left", inPercent + "%");
//		this.$.popup.applyStyle("left", inPercent + "%");
//		this.$.popupLabel.setContent( Math.round(inPercent) + "%" );
	},
	calcKnobPosition: function(inEvent) {
		//var x = inEvent.clientX - this.hasNode().getBoundingClientRect().left;
		var x = inEvent.clientX - this.knobLeft;
		return (x / this.getBounds().width) * (this.max - this.min) + this.min;
	},
	showKnobStatus: function(inSender, inEvent) {
//		this.$.popup.show();
	},
	hideKnobStatus: function(inSender, inEvent) {
//		this.$.popup.hide();
	},
	dragstart: function(inSender, inEvent) {
		if (inEvent.horizontal && !this.nofocus) {
			inEvent.preventDefault();
			this.dragging = true;
			this.$.knob.addClass("active");
			this.showKnobStatus();
			return true;
		}
	},
	drag: function(inSender, inEvent) {
		if (this.dragging) {
			var v = this.calcKnobPosition(inEvent);
			this.setValue(v);
			this.doChanging({value: this.value});
//			this.adjustPopupPosition(inEvent);
			return true;
		}
	},
	dragfinish: function(inSender, inEvent) {
		this.dragging = false;
		inEvent.preventTap();
		this.doChange({value: this.value});
		this.$.knob.removeClass("active");
//		this.$.popup.setShowing(false);
		return true;
	},
	tap: function(inSender, inEvent) {
		if (this.disabled)
			return true;
		if (this.tappable) {
			var v = this.calcKnobPosition(inEvent);
			this.tapped = true;
			this.animateTo(v);
			return true;
		}
	},
	//* @public
	//* Animates progress to the given value.
	animateProgressTo: function(inValue) {
		this.$.progressAnimator.play({
			startValue: this.progress,
			endValue: inValue,
			node: this.hasNode()
		});
	},
	//* @protected
	progressAnimatorStep: function(inSender) {
		this.setProgress(inSender.value);
		return true;
	},
	progressAnimatorComplete: function(inSender) {
		this.doAnimateProgressFinish(inSender);
		return true;
	},
	//* @public
	//* Animates to the given value.
	animateTo: function(inValue) {
		this.$.animator.play({
			startValue: this.value,
			endValue: inValue,
			node: this.hasNode()
		});
	},
	//* @protected
	animatorStep: function(inSender) {
		this.setValue(inSender.value);
		return true;
	},
	animatorComplete: function(inSender) {
		if (this.tapped) {
			this.tapped = false;
			this.doChange({value: this.value});
		}
		this.doAnimateFinish(inSender);
		return true;
	},
});