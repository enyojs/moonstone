enyo.kind({
	name: "moon.IntegerPickerArranger",
	kind: "enyo.TopBottomArranger",
	margin: 0
});


/**
	_moon.IntegerPicker_, a subkind of <a href="#moon.SimplePicker">moon.SimplePicker</a>,
	is used to display a list of integers ranging from _min_ to _max_, soliciting
	a choice from the user.

	To initialize the picker to a particular integer, set the _value_ property to
	that integer:

		{kind: "moon.IntegerPicker", noneText: "None Selected",
			content: "Choose a Number", min: 0, max: 25, value: 5}

	The picker may be changed programmatically by modifying the published
	properties _value_, _min_, or _max_ in the normal manner, by calling _set()_.
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
		arrangerKind: "moon.IntegerPickerArranger", name:"client", onTransitionFinish:"transitionFinished"}
	],
	//* @protected
	create: function() {
		this.inherited(arguments);
	},
	rendered: function() {
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
			if (this.value === parseInt(controls[i].content, 10)) {
				this.setSelected(controls[i]);
				break;
			}
		}
	},
	reflow: function() {
		this.reflow._inherited._inherited.call(this, arguments);
		this.$.client.reflow();

		// Make sure selected item is in sync after Panels reflow, which may have
		// followed an item's being added/removed
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
		this.value = parseInt(this.selected.content, 10);
	},
	//* Overrides _moon.SimplePicker.disabledChanged()_
	disabledChanged: function() {
		this.addRemoveClass("disabled", this.disabled);
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
