/**
	_moon.AudioPlaybackSlider_ 
*/
enyo.kind({
	name: "moon.AudioPlaybackSlider",
	kind: "moon.Slider",
	published: {
		displayPopup: false,
		displayKnob: true
	},
	//* @protected
	create: function() {
		this.inherited(arguments);
		this.bgProgressChanged();
		this.progressChanged();
		this.barClassesChanged();
		//this.valueChanged();
		this.disabledChanged();
		this.$.knob.setShowing(this.displayKnob);
	},
	rendered: function() {
		this.inherited(arguments);
		if (this.displayPopup) {
			this.drawToCanvas(this.popupColor);
			this.adjustPopupPosition();
		}
	},
	spotBlur: function() {
		if(this.dragging) {
			return true;
		}
		else {
			this.$.knob.hide();
			this.$.popup.hide();
			this.$.knob.removeClass("spotselect");
			this.$.knob.setShowing(this.displayKnob);
			this.selected = false;
		}
	},
	updateKnobPosition: function(inPercent) {
		this.$.knob.applyStyle("left", inPercent + "%");
		if (this.displayPopup) {
			this.$.popup.applyStyle("left", inPercent + "%");
			this.$.popupLabel.setContent( Math.round(inPercent) + "%" );
		}
	},
	drag: function(inSender, inEvent) {
		if (this.dragging) {
			var v = this.calcKnobPosition(inEvent);
			v = (this.increment) ? this.calcIncrement(v) : v;
			this.setValue(v);
			this.doChanging({value: this.value});
			if (this.displayPopup) {
				this.adjustPopupPosition();
			}
			return true;
		}
	}
});
