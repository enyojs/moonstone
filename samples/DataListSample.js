enyo.kind({
	name: "moon.sample.DataListSample",
	classes: "moon enyo-fit enyo-unselectable",
	components: [
		{name: "drawers", kind: "moon.Drawers", drawers: [
			{handle: {}, controlsOpen: true, controlDrawerComponents: [
				{classes: "moon-hspacing", controlClasses: "moon-4h", components: [
					{name: "orientation", kind: "moon.ExpandablePicker", selectedIndex: 0, content: "Orientation", components: [
						{content: "vertical"},
						{content: "horizontal"}
					], style: "vertical-align: top;"},
					{name: "recordCount", kind: "moon.ExpandableInput", content: "Record Count", value: 1000, onchange: "updateRecords", style: "vertical-align: top;"},
					{name: "scrollIndex", kind: "moon.ExpandableInput", value: 0, content: "Scroll to Index", onchange: "scrollToIndex", style: "vertical-align: top;"},
					{name: "debugging", kind: "moon.ExpandablePicker", selectedIndex: 0, content: "Page Debugging", components: [
						{value: false, content: "off"},
						{value: true, content: "on"}
					], style: "vertical-align: top;"}
				]}
			]}
		], components: [
			{kind: "moon.Panels", pattern: "activity", classes: "enyo-fit", components: [
				{kind: "enyo.Control", components: [
					{name: "repeater", kind: "moon.DataList", components: [
						{classes: "enyo-border-box", style: "overflow: hidden; min-width: 230px; padding: 10px; margin: 10px;", components: [
							{name: "caption", controlClasses: "moon-2h", kind: "moon.CaptionDecorator", components: [
								{name: "button", kind: "moon.ToggleButton"}
							]}
						], bindings: [
							{from: ".model.caption", to: ".$.caption.content"},
							{from: ".repeater.side", to: ".$.caption.side"},
							{from: ".model.label", to: ".$.button.content"},
							{from: ".model.disabled", to: ".$.button.disabled"},
							{from: ".model.on", to: ".$.button.value"}
						]}
					]}
				]}
			]}
		]},
		{name: "collection", kind: "enyo.Collection"}
	],
	bindings: [
		{from: ".$.orientation.selected.content", to: ".orientation"},
		{from: ".$.debugging.selected.value", to: ".repeaterDebugging"},
		{from: ".$.recordCount.value", to: ".recordCount", debug: true, oneWay: false, transform: function (v) {return (v !== undefined && v !== null && !isNaN(v))? v: undefined;}},
		{from: ".$.collection", to: ".$.repeater.collection"},
		{from: ".side", to: ".$.repeater.side"}
	],
	generateRecords: function (amount) {
		var records = this.$.collection.records,
			add     = [],
			on;
		for (var i=records.length, len=(i+amount); i<len; ++i) {
			add.push({
				on: (on = Boolean(Math.floor(Math.random()*100) % 2 === 0)),
				disabled: on && Boolean(Math.floor(Math.random()*100) % 2 === 0),
				caption: "Item " + i,
				label: "Label " + i
			});
		}
		return add;
	},
	scrollToIndex: function (sender, event) {
		this.$.repeater.scrollToIndex(sender.getValue());
	},
	repeaterDebuggingChanged: function () {
		this.$.repeater.addRemoveClass("debug", this.repeaterDebugging);
	},
	orientationChanged: function () {
		this.set("side", this.orientation == "vertical"? "left": "bottom");
		this.$.repeater.set("orientation", this.orientation);
	},
	recordCountChanged: function () {
		var count   = this.get("recordCount"),
			num     = Math.min(Math.max(count, 0), 1000),
			records = this.$.collection.records;
		if (num != count) {
			this.set("recordCount", num);
		}
		if (records.length > num) {
			this.$.collection.remove(records.slice(num));
		} else if (records.length < num) {
			this.$.collection.add(this.generateRecords(Math.abs(records.length - num)));
		}
	}
});
