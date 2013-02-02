/**
    _moon.IntegerScrollPicker_ is used to display a list of integers that solicits a choice from the user, 
	ranging from _min_ to _max_.

    To initialize the IntegerScrollPicker to a particular value, set the _value_
    property to the integer that should be selected.

	{kind: "moon.IntegerScrollPicker", noneText: "None Selected", content: "Choose a Number", min: 0, max: 25, value: 5]}

	The picker can be programmatically changed by modifying the published properties _value_, 
	_min_, or _max_ by calling the appropriate setter functions (_setValue()_, _setMin()_, _setMax()_ and
	_getValue()_, _getMin()_ and _getMax()_).
*/
enyo.kind({
	name: "moon.IntegerScrollPicker",	
	classes: "moon-scroll-picker",
	kind: "enyo.Scroller", 
	thumb:false,
	touch:true,	//force to touch based strategy for animated scrollTo behavior
	published: {
		value: null,
		min: 0,
		max: 9
	},
	handlers: {
		onSpotlightUp:"previous", 
		onSpotlightDown:"next", 
		onSpotlightLeft:"left"		
	},
	events: {
		onChange: ""
	},
	spotlight: true,
	//* Cache scroll bounds so we don't have to run stop() every time we need them
	scrollBounds: {},
	components: [
		{name:"repeater", kind:"enyo.FlyweightRepeater", ondragstart: "dragstart", onSetupItem: "setupItem", components: [
			{name: "item", classes:"moon-scroll-picker-item"}
		]}
	],
	//* @protected
	create: function() {
		this.inherited(arguments);
		this.rangeChanged();
	},
	rendered: function(){
		this.inherited(arguments);
		this.updateScrollBounds();		
		this.scrollToNode(this.$.repeater.fetchRowNode(this.value - this.min));		
	},
	setupItem: function(inSender, inEvent) {
		var index = inEvent.index;
		this.$.item.setContent(index+this.min);
	},
	rangeChanged: function() {
		this.value = this.value >= this.min && this.value <= this.max ? this.value : this.min;		
		this.$.repeater.setCount(this.max-this.min+1);
		this.$.repeater.render();
	},
	valueChanged: function(inOld) {
		this.animateToNode(this.$.repeater.fetchRowNode(this.value - this.min));
	},
	//preventing dragging
	dragstart: function(inSender, inEvent) {
		return true;
	},
	minChanged: function() {
		this.rangeChanged();
		this.render();
	},
	maxChanged: function() {
		this.rangeChanged();
		this.render();
	},
	previous: function() {
		if (this.value > this.min) {
			this.animateToNode(this.$.repeater.fetchRowNode(--this.value - this.min));
		}
		return true;
	},
	next: function() {
		if (this.value < this.max) {
			this.animateToNode(this.$.repeater.fetchRowNode(++this.value - this.min));
		}
		return true;		
	},
	//scrollStop will be called multiple times if they hold the key down (due to getScrollBounds calls stopping the scroller)
	scrollStop: function(inSender, inEvent) {
		this.inherited(arguments);
		this.updateScrollBounds();		
		if (this.value!=null) {
			this.doChange({
				name:this.name, 
				value:this.value
			});			
		}
	},
	scrollStart: function(inSender, inEvent) {
		this.inherited(arguments);
		this.updateScrollBounds();		
	},
	//* On scroll, update our cached _this.scrollBounds_ property, and show/hide pagination controls
	scroll: function(inSender, inEvent) {
		this.inherited(arguments);
		this.updateScrollBounds();
	},
	//* Cache scroll bounds in _this.scrollBounds_ so we don't have to call stop() to retrieve them later
	// NOTE - this is a copy of what's in Scroller, we will likely later integrate this functionality (including animateToNode) into enyo.Scroller & remove from here
	updateScrollBounds: function() {
		this.scrollBounds = this.$.strategy._getScrollBounds();
	},
	//* Scroll to a given node in list
	animateToNode: function(inNode) {
		var sb = this.scrollBounds,
			st = this.getStrategy(),
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
		if (x !== this.getScrollLeft() || y !== this.getScrollTop()) {
			this.scrollTo(x,y);
		}
	}
});