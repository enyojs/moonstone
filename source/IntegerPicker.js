/**
    _moon.IntegerPicker_, a subkind of <a href="#moon.SimplePicker">moon.SimplePicker</a>,
    is used to display a list of integers that solicits a choice from the user, 
	ranging from _min_ to _max_.

    To initialize the IntegerPicker to a particular value, set the _value_
    property to the integer that should be selected.

	{kind: "moon.IntegerPicker", noneText: "None Selected", content: "Choose a Number", min: 0, max: 25, value: 5]}

	The picker can be programmatically changed by modifying the published properties _value_, 
	_min_, or _max_ by calling the appropriate setter functions (_setValue()_, _setMin()_, _setMax()_ and
	_getValue()_, _getMin()_ and _getMax()_).
*/
enyo.kind({
	name: "moon.IntegerPicker",
	kind: "moon.SimplePicker",	
	classes: "moon-integer-picker",	
	published: {
		value: undefined,
		min: 0,
		max: 9
	},
	handlers: {
		onSpotlightUp:"previous", 
		onSpotlightDown:"next", 
		onSpotlightLeft:"left"
	},
	spotlight: true,
	components: [
		{kind:"enyo.Panels", classes:"moon-integer-picker-panels", controlClasses:"moon-integer-picker-item", draggable:true, 
		 arrangerKind: "moon.IntegerPickerArranger", name:"client", onTransitionFinish:"transitionFinished"},
	],
	//* @protected
	create: function() {
		this.inherited(arguments);
		this.rangeChanged();
		if (this.value){
			this.valueChanged();	
		} else {
			this.value = this.min;
		}
	},
	rangeChanged: function() {
		for (var i=this.min; i<=this.max; i++) {
			this.createComponent({content: i.toString()});
		}
		this.reflow();		
	},
	valueChanged: function(inOld) {
		var controls = this.$.client.getClientControls();
		var len = controls.length;
		// Validate our value
		this.value = this.value >= this.min && this.value <= this.max ? this.value : this.min;
		for (var i=0; i<len; i++) {
			if (this.value === parseInt(controls[i].content)) {
				this.setSelected(controls[i]);
				break;
			}
		}
	},
	reflow: function() {
		this.reflow._inherited._inherited.call(this, arguments);
		this.$.client.reflow();

		// Make sure selected item is in sync after Panels reflow, which may have
		// followed an item being added/removed
		if (this.selected != this.$.client.getActive()) {
			this.setSelected(this.$.client.getActive());
			this.setSelectedIndex(this.$.client.getIndex());
			this.fireChangedEvent();
		}
	},
	minChanged: function() {
		this.destroyClientControls();
		this.rangeChanged();
		this.render();
	},
	maxChanged: function() {
		this.destroyClientControls();
		this.rangeChanged();
		this.render();
	},
	selectedChanged: function(inOld) {
		this.inherited(arguments);
		this.value = parseInt(this.selected.content);
	},
	previous: function() {
		this.inherited(arguments);			
		return true;
	},
	next: function() {
		this.inherited(arguments);
		return true;		
	}
});

enyo.kind({
	name: "moon.IntegerPickerArranger",
	kind: "enyo.TopBottomArranger",	
	margin: 0
});