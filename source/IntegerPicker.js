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
	classes: "moon-scroll-picker-container",
	published: {
		value: null,
		min: 0,
		max: 9,
		//* If a number is specified, picker value is displayed as this many
		//* zero-filled digits
		digits: null,
		//**The number of rows to be shown on a given list page segment.
		itemPerPage: 5
	},
	handlers: {
		onSpotlightUp:"previous",
		onSpotlightDown:"next",
		onSpotlightBlur:"spotlightBlur",
		onSpotlightScrollUp:"previous",
		onSpotlightScrollDown:"next"
	},
	events: {
		onChange: ""
	},
	spotlight:true,
	//* Cache scroll bounds so we don't have to run _stop()_ every time we need them
	scrollBounds: {},
	components: [
		{name:"topOverlay", ondown:"previous", classes:"moon-scroll-picker-overlay-container top", components:[
			{classes:"moon-scroll-picker-overlay top"},
			{classes: "moon-scroll-picker-taparea"}
		]},
		{name:"listItemSize", classes: "moon-scroll-picker-item-div"},
		{name:"list", kind: "enyo.List", thumb: false, touch: true, useMouseWheel: false, classes: "moon-scroll-picker", ondragstart: "dragstart", onSetupItem: "setupItem", components: [
			{name: "item", classes: "moon-scroll-picker-item"}
		]},
		{name:"bottomOverlay", ondown:"next", classes:"moon-scroll-picker-overlay-container bottom", components:[
			{classes:"moon-scroll-picker-overlay bottom"},
			{classes: "moon-scroll-picker-taparea"}
		]}
	],
	scrollInterval: 65,
	itemHeight: 94,
	rendered: function(){
		this.inherited(arguments);
		this.rangeChanged();
		this.$.list.getStrategy().setInterval(this.scrollInterval);
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
		this.$.listItemSize.setContent(this.max);
		this.$.list.setCount(this.max-this.min+1);
		this.$.list.setRowsPerPage(this.itemPerPage);
		this.$.list.render();
		this.scrollToValue(true);
	},
	valueChanged: function(inOld) {
		this.scrollToValue(!this.generated);
	},
	scrollToValue: function(inDirect) {
		var val = (this.value - this.min) * this.itemHeight;
		if (inDirect) {
			this.$.list.setScrollTop(val);
		} else {
			this.$.list.scrollTo(0, val);
		}
	},
	refreshScrollState: function() {
		this.scrollToValue(true);
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
	itemPerPageChanged: function(){
		this.rangeChanged();
	},
	previous: function(inSender, inEvent) {
		if (this.value > this.min) {
			this.stopJob("hideTopOverlay");
			this.setValue(this.value - 1);
			this.$.topOverlay.addClass("selected");
			if (inEvent.originator != this.$.upArrow) {
				this.startJob("hideTopOverlay", "hideTopOverlay", 350);
			}
			this.fireChangeEvent();
		}
		return true;
	},
	next: function(inSender, inEvent) {
		if (this.value < this.max) {
			this.stopJob("hideBottomOverlay");
			this.setValue(this.value + 1);
			this.$.bottomOverlay.addClass("selected");
			if (inEvent.originator != this.$.downArrow) {
				this.startJob("hideBottomOverlay", "hideBottomOverlay", 350);
			}
			this.fireChangeEvent();
		}
		return true;
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
	//* Ensures scroll position is in bounds.
	stabilize: function() {
		this.$.list.stabilize();
	}
});

// For backward compatibility
moon.IntegerScrollPicker = moon.IntegerPicker;
