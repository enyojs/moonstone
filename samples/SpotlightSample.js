enyo.kind({
	name: 'moon.sample.SpotlightSample',
	classes: "moon",
	fit: false,
	components:[
		{kind: 'enyo.Spotlight'},
		{kind: "onyx.Toolbar", components: [
			{kind: "moon.Button", content: "Add Control", style: "position:aboslute; top:20px; left:20px; width:300px; background:#ccc;", ontap: "addBarracuda"}
		]},
		{name: "container", style: "position:relative;"}
	],
	rendered: function() {
		this.inherited(arguments);
		enyo.Spotlight.enableTestMode();
	},
	addBarracuda: function() {
		var b = this.$.container.createComponent({kind: "Barracuda"}).render();
	}
});

enyo.kind({
	name: "Barracuda",
	kind: "moon.Item",
	classes: "barracuda",
	handlers: {
		ondown: "mousedown",
		ondrag: "drag"
	},
	components: [
		{name: "corner", classes: "barracuda-corner"}
	],
	resizing: false,
	cornerWidth: 20,
	initY: null,
	initX: null,
	initHeight: null,
	initWidth: null,
	
	mousedown: function(inSender, inEvent) {
		// check if resizing
		this.resizing = this.isResizing(inEvent);
		
		// save initial values
		var bounds = this.getBounds();
		this.initY = bounds.top;
		this.initX = bounds.left;
		this.initWidth = bounds.width;
		this.initHeight = bounds.height;
	},
	drag: function(inSender, inEvent) {
		if(this.resizing) {
			this.doResize(inEvent);
		} else {
			this.doDrag(inEvent);
		}
	},
	isResizing: function(inEvent) {
		var bounds = enyo.Spotlight.Util.getAbsoluteBounds(this),
			relativeTop = inEvent.clientY - bounds.top,
			relativeLeft = inEvent.clientX - bounds.left,
			relativeBottom = bounds.height - relativeTop,
			relativeRight = bounds.width - relativeLeft;
		
		this.resizingX =	(relativeLeft < this.cornerWidth) ? -1 :
							(relativeRight < this.cornerWidth) ? 1 :
							0;
		
		this.resizingY =	(relativeTop < this.cornerWidth) ? -1 :
							(relativeBottom < this.cornerWidth) ? 1 :
							0;
		
		//	TODO - only pay attention to bottom right for resizing for now
		return (relativeRight < this.cornerWidth && relativeBottom < this.cornerWidth);
		
		return this.resizingX !== 0 && this.resizingY !== 0;
	},
	doResize: function(inEvent) {
		var bounds = this.getBounds();
		console.log(inEvent.dx, this.initX, bounds.width);
		this.addStyles("width:"+(inEvent.dx + this.initWidth)+"px;height:"+(inEvent.dy + this.initHeight)+"px;")
	},
	doDrag: function(inEvent) {
		this.addStyles("left:"+(inEvent.dx + this.initX)+"px;top:"+(inEvent.dy + this.initY)+"px;");
	}
});

