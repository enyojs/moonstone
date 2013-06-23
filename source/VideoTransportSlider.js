/**
	_moon.VideoTransportSlider_ extends <a href="#moon.Slider">moon.Slider</a>,
	adding specialized behavior related to video playback.

		{kind: "moon.VideoTransportSlider", value: 30}

	The _onChanging_ event is fired while the control knob is being dragged, and
	the _onChange_ event is fired when the position is set, either by finishing a
	drag or by tapping the bar.
*/
enyo.kind({
	name: "moon.VideoTransportSlider",
	kind: "moon.Slider",
	popupWidth: 300,
	popupHeight: 200,
	handlers: {
		onTimeupdate: "timeUpdate",
		ondown: "down"
	},
	events: {
		onSeekStart: "",
		onSeek: "",
		onSeekFinish: ""
	},
	//* If user presses on _this.$.tapArea_, seek to that point
	down: function(inSender, inEvent) {
		if (inSender === this.$.tapArea) {
			this.sendSeekEvent(inEvent);
		}
	},
	//* If dragstart, bubble _onSeekStart_ event
	dragstart: function(inSender, inEvent) {
		var dragstart = this.inherited(arguments);
		if (dragstart) {
			this.doSeekStart();
		}
		return dragstart;
	},
	//* If drag, bubble _onSeek_ event
	drag: function(inSender, inEvent) {
		var drag = this.inherited(arguments);
		if (drag) {
			this.throttleJob("updateCanvas", this.bindSafely(function() { this.sendSeekEvent(inEvent); }), 200);
		}
		return drag;
	},
	//* If dragfinish, bubble _onSeekFinish_ event
	dragfinish: function(inSender, inEvent) {
		var dragging = (this.dragging),
			dragfinish = this.inherited(arguments)
		;
		if (dragging && dragfinish) {
			this.doSeekFinish({value: this.value});
		}
		return dragfinish;
	},
	//* Send seek event
	sendSeekEvent: function(inEvent) {
		var v = this.calcKnobPosition(inEvent);
		v = (this.increment) ? this.calcIncrement(v) : v;
		v = this.clampValue(this.min, this.max, v);
		this.doSeek({value: v});
	},
	//* When the time updates, update buffered progress and canvas
	timeUpdate: function(inSender, inEvent) {
		this.updateBufferedProgress(inEvent.srcElement);
		this.triggerCanvasUpdate(inEvent.srcElement);
	},
	//* Update _this.bgProgress_ to reflect video buffered progress
	updateBufferedProgress: function(inNode) {
		var bufferData = inNode.buffered,
			numberOfBuffers = bufferData.length,
			bufferedPercentage = 0,
			highestBufferPoint = 0,
			endPoint = 0,
			i
		;
		
		// Find furthest along buffer end point and use that (only supporting one buffer range for now)
		for (i = 0; i < numberOfBuffers; i++) {
			endPoint = bufferData.end(i);
			highestBufferPoint = (endPoint > highestBufferPoint) ? endPoint : highestBufferPoint;
		}
		
		bufferedPercentage = highestBufferPoint * 100 / inNode.duration;
		this.setBgProgress(bufferedPercentage)
	},
	//* Kickoff canvas update when video time changes
	triggerCanvasUpdate: function(inNode) {
		if (!this.dragging) {
			return;
		}
		// Add delay here to account for pause in dragging
		setTimeout(enyo.bind(this, function() { this.updateCanvas(inNode); }), 200);
	},
	//* Draw copy of _inNode_ to _this.$.drawing_
	updateCanvas: function(inNode) {
		var drawingNode = this.$.drawing.hasNode(),
			db = drawingNode.getBoundingClientRect(),
			ctx = drawingNode.getContext("2d")
		;
		// draw video preview thumbnail
		ctx.drawImage(inNode, 0, 0, db.width, db.height);
	}
});
