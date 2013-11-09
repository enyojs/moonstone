/**
	_moon.IntegerPicker_ is a control that displays a list of integers
	ranging from _min_ to _max_, soliciting a choice from the user.

	To initialize the picker to a particular integer, set the _value_ property to
	that integer:

		{kind: "moon.IntegerPicker", noneText: "None Selected",
			content: "Choose a Number", min: 0, max: 25, value: 5}

	The picker may be changed programmatically by modifying the published
	properties _value_,	_min_, or _max_ in the normal manner, by calling _set()_.
*/
enyo.kind({
	name: "moon.IntegerPicker",
	//* @protected
	classes: "moon-scroll-picker-container",
	//* @public
	published: {
		//* Current value of the picker
		value: null,
		//* Minimum value of the picker
		min: 0,
		//* Maximum value of the picker
		max: 9,
		//* If a number is specified, the picker value is displayed as this many
		//* zero-filled digits
		digits: null
	},
	//* @protected
	handlers: {
		onSpotlightUp:"next",
		onSpotlightDown:"previous",
		onSpotlightBlur:"spotlightBlur",
		onSpotlightScrollUp:"next",
		onSpotlightScrollDown:"previous"
	},
	//* @public
	events: {
		/**
			Fires when the currently selected value changes (i.e., when either
			_topOverlay_ or _bottomOverlay_ is tapped).

			_inEvent.name_ contains the name of the IntegerPicker instance.

			_inEvent.value_ contains the current value of the picker.
		*/
		onChange: ""
	},
	//* @protected
	spotlight: true,
	//* Cache scroll bounds so we don't have to run _stop()_ every time we need them
	scrollBounds: {},
	components: [
		{name:"topOverlay", ondown:"next", classes:"moon-scroll-picker-overlay-container top top-image", components:[
			{classes:"moon-scroll-picker-overlay top"},
			{classes: "moon-scroll-picker-taparea"}
		]},
		{kind: "enyo.Scroller", thumb:false, touch:true, useMouseWheel: false, classes: "moon-scroll-picker", components:[
			{name:"repeater", kind:"enyo.FlyweightRepeater", ondragstart: "dragstart", onSetupItem: "setupItem", components: [
				{name: "item", classes:"moon-scroll-picker-item"}
			]}
		]},
		{name:"bottomOverlay", ondown:"previous", classes:"moon-scroll-picker-overlay-container bottom bottom-image", components:[
			{classes:"moon-scroll-picker-overlay bottom"},
			{classes: "moon-scroll-picker-taparea"}
		]}
	],
	//* @protected
	rendered: function(){
		this.inherited(arguments);
		this.rangeChanged();
		this.updateOverlays();
		this.refreshScrollState();
	},
	refreshScrollState: function() {
		this.updateScrollBounds();
		this.$.scroller.scrollToNode(this.$.repeater.fetchRowNode(this.value - this.min));
	},
	setupItem: function(inSender, inEvent) {
		var index = inEvent.index;
		var content = index + this.min;
		if (this.digits) {
			content = ("00000000000000000000" + content).slice(-this.digits);
		}
		this.$.item.setContent(content);
	},
	rangeChanged: function() {
		this.value = this.value >= this.min && this.value <= this.max ? this.value : this.min;
		this.$.repeater.setCount(this.max-this.min+1);
		this.$.repeater.render();
		//asynchronously scroll to the current node, this works around a potential scrolling glitch
		enyo.asyncMethod(enyo.bind(this,function(){
			this.$.scroller.scrollToNode(this.$.repeater.fetchRowNode(this.value - this.min));
		}));
	},
	valueChanged: function(inOld) {
		this.animateToNode(this.$.repeater.fetchRowNode(this.value - this.min));
	},
	//prevent scroller dragging
	dragstart: function(inSender, inEvent) {
		return true;
	},
	minChanged: function() {
		this.rangeChanged();
	},
	maxChanged: function() {
		this.rangeChanged();
	},
	previous: function(inSender, inEvent) {
		if (this.value > this.min) {
			this.stopJob("hideTopOverlay");
			this.animateToNode(this.$.repeater.fetchRowNode(--this.value - this.min));
			this.$.bottomOverlay.addClass("selected");
			if (inEvent.originator != this.$.upArrow) {
				this.startJob("hideBottomOverlay", "hideBottomOverlay", 350);
			}
			this.fireChangeEvent();
		}
		this.updateOverlays();
		return true;
	},
	next: function(inSender, inEvent) {
		if (this.value < this.max) {
			this.stopJob("hideBottomOverlay");
			this.animateToNode(this.$.repeater.fetchRowNode(++this.value - this.min));
			this.$.topOverlay.addClass("selected");
			if (inEvent.originator != this.$.downArrow) {
				this.startJob("hideTopOverlay", "hideTopOverlay", 350);
			}
			this.fireChangeEvent();
		}
		this.updateOverlays();
		return true;
	},
	updateOverlays: function() {
		this.$.bottomOverlay.addRemoveClass("bottom-image", (this.value !== this.min));
		this.$.topOverlay.addRemoveClass("top-image", (this.value !== this.max));
	},
	hideTopOverlay: function() {
		this.$.topOverlay.removeClass("selected");
	},
	hideBottomOverlay: function() {
		this.$.bottomOverlay.removeClass("selected");
	},
	fireChangeEvent: function() {
		this.doChange({
			name:this.name,
			value:this.value
		});
	},
	resetOverlay: function() {
		this.hideTopOverlay();
		this.hideBottomOverlay();
	},
	spotlightFocus: function() {
		this.bubble("onRequestScrollIntoView", {side: "top"});
	},
	spotlightBlur: function() {
		this.hideTopOverlay();
		this.hideBottomOverlay();
	},
	//* Cache scroll bounds in _this.scrollBounds_ so we don't have to call stop() to retrieve them later
	// NOTE - this is a copy of what's in Scroller, we will likely later integrate this functionality (including animateToNode) into enyo.Scroller & remove from here
	updateScrollBounds: function() {
		this.scrollBounds = this.$.scroller.getStrategy()._getScrollBounds();
	},
	//* Scrolls to a given node in the list.
	animateToNode: function(inNode) {
		if(!inNode) {
			return;
		}

		var sb = this.scrollBounds,
			st = this.$.scroller.getStrategy(),
			b = {
				height: inNode.offsetHeight,
				width: inNode.offsetWidth,
				top: 0,
				left: 0
			},
			n = inNode;

		if(!st.scrollNode) {
			return;
		}

		while (n && n.parentNode && n.id != st.scrollNode.id) {
			b.top += n.offsetTop;
			b.left += n.offsetLeft;
			n = n.parentNode;
		}

		var xDir = b.left - sb.left > 0 ? 1 : b.left - sb.left < 0 ? -1 : 0;
		var yDir = b.top - sb.top > 0 ? 1 : b.top - sb.top < 0 ? -1 : 0;

		var y = (yDir === 0) ? sb.top  : Math.min(sb.maxTop, b.top);
		var x = (xDir === 0) ? sb.left : Math.min(sb.maxLeft, b.left);

		// If x or y changed, scroll to new position
		if (x !== this.$.scroller.getScrollLeft() || y !== this.$.scroller.getScrollTop()) {
			this.$.scroller.scrollTo(x,y);
		}
	},
	//* Silently scrolls to the _inValue_ y-position without animating
	setScrollTop: function(inValue) {
		this.$.scroller.setScrollTop(inValue);
	},
	//* Ensures scroll position is in bounds.
	stabilize: function() {
		this.$.scroller.stabilize();
	}
});

// For backward compatibility
moon.IntegerScrollPicker = moon.IntegerPicker;
