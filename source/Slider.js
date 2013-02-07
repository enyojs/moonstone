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
		bgProgress: 0,
		min: 0,
		max: 100,
		barClasses: "",
		lockBar: true,
		nofocus: true,
		value: 0,
		completed: 0,
		tappable: true,
		popupColor: "#a2a2a2",
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
/*		{name: "bgbar", classes: "moon-slider-bgbar", components: [
			{name: "bar", classes: "moon-slider-bar"},
		]},*/
		{name: "bgbar", classes: "moon-slider-bgbar"},
		{name: "bar", classes: "moon-slider-bar"},
		{name: "knob", ondown: "showKnobStatus", onup: "hideKnobStatus", classes: "moon-slider-knob"},
		{kind: "enyo.Popup", name: "popup", classes: "moon-slider-popup above", components: [
			{tag: "canvas", name: "drawing", attributes: { width: 62, height: 36 }},
			{name: "popupLabel", classes: "moon-slider-popup-label"}
		]}
	],
	//* @protected
	create: function() {
		this.inherited(arguments);
		this.nofocusChanged();
		this.bgProgressChanged();
		this.progressChanged();
		this.barClassesChanged();
		this.valueChanged();
		this.disabledChanged();
	},
	rendered: function() {
		this.inherited(arguments);
		this.knobLeft = this.hasNode().getBoundingClientRect().left;
		this.drawToCanvas(this.popupColor);
		this.adjustPopupPosition();
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
	bgProgressChanged: function() {
		this.bgProgress = this.clampValue(this.min, this.max, this.bgProgress);

		var p = this.calcPercent(this.bgProgress);
		this.updateBgBarPosition(p);
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
	updateBgBarPosition: function(inPercent) {
		this.$.bgbar.applyStyle("width", inPercent + "%");
	},
	disabledChanged: function() {
		this.addRemoveClass("disabled", this.disabled);
		this.$.knob.addRemoveClass("disabled", this.disabled);
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
		this.$.popup.applyStyle("left", inPercent + "%");
		this.$.popupLabel.setContent( Math.round(inPercent) + "%" );
	},
	calcKnobPosition: function(inEvent) {
		//var x = inEvent.clientX - this.hasNode().getBoundingClientRect().left;
		var x = inEvent.clientX - this.knobLeft;
		return (x / this.getBounds().width) * (this.max - this.min) + this.min;
	},
	adjustPopupPosition: function() {
		var inControl = this.$.popup;

		// popup bounds
		var pb = inControl.hasNode().getBoundingClientRect();
		// container bounds
		var cb = this.container.hasNode().getBoundingClientRect();
		// knob bounds
		var kb = this.$.knob.hasNode().getBoundingClientRect();

		// FIXME: What do we do when the popup's top goes above the window height?
		// Adding "above" class directly to classes property for now
		/*
		// IE8 doesn't return window.page{X/Y}Offset
		var pageYOffset = (window.pageYOffset === undefined) ? document.documentElement.scrollTop : window.pageYOffset;
		//when the popup's top goes above the container's top, move popup below the decorator
		if ((pb.top + pb.height) < pageYOffset) {
			inControl.addRemoveClass("above", false);
			inControl.addRemoveClass("below", true);
		} else 	{
			inControl.addRemoveClass("above", true);
			inControl.addRemoveClass("below", false);
		}
		*/
//		enyo.log("kb.left="+kb.left+", kb.right="+kb.right+", cb.left="+cb.left+", cb.right="+cb.right+", pb.left="+pb.left+", pb.right="+pb.right);
		// when the popup's right edge is out of the window, adjust to the left
		if ( (pb.width + pb.left) > cb.right ) {
			inControl.applyStyle("left", (cb.right - cb.left - pb.width - kb.width) + "px");
		}
	},
	showKnobStatus: function(inSender, inEvent) {
		if (!this.disabled) {
			this.$.popup.show();
		}
	},
	hideKnobStatus: function(inSender, inEvent) {
		this.$.popup.hide();
	},
	dragstart: function(inSender, inEvent) {
		if (this.disabled || this.nofocus)
			return;	// return nothing

		if (inEvent.horizontal) {
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
			this.adjustPopupPosition();
			return true;
		}
	},
	dragfinish: function(inSender, inEvent) {
		this.dragging = false;
		inEvent.preventTap();
		this.doChange({value: this.value});
		this.$.knob.removeClass("active");
		this.hideKnobStatus();
		return true;
	},
	tap: function(inSender, inEvent) {
		if (this.disabled || this.nofocus)
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
	drawToCanvas: function(bgColor) {
		var ctx = this.$.drawing.hasNode().getContext("2d");

		// Set styles. Default color is knob's color
		ctx.fillStyle = bgColor || enyo.dom.getComputedStyleValue(this.$.knob.hasNode(), "background-color");

		// Draw shape with arrow on bottom-left
		ctx.moveTo(1, 37);
		ctx.arcTo(1, 33, 12, 33, 4);
		ctx.lineTo(46, 33);
		ctx.arcTo(61, 33, 61, 17, 16);
		ctx.moveTo(61, 17); // This is needed on IE9 for some reason
		ctx.arcTo(61, 1, 46, 1, 16);
		ctx.lineTo(16, 1);
		ctx.arcTo(1, 1, 1, 17, 16);
		ctx.lineTo(1, 37);
		ctx.fill();
	}
});