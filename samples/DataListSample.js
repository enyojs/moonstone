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
					{name: "scrollIndex", kind: "moon.ExpandableInput", value: 0, content: "Scroll to Index", onblur: "scrollToIndex", style: "vertical-align: top;"},
					{name: "debugging", kind: "moon.ExpandablePicker", selectedIndex: 0, content: "Page Debugging", components: [
						{value: false, content: "off"},
						{value: true, content: "on"}
					], style: "vertical-align: top;"},
					{kind: "moon.Button", content: "Hide", ontap: "toggleShowing"}
				]}
			]}
		], components: [
			{kind: "moon.Panels", pattern: "activity", classes: "enyo-fit", components: [
				{name: "repeaterContainer", kind: "enyo.Control"}
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
		var records = this.$.collection.records
			, add = []
			, i = records.length
			, len = (i + (!isNaN(amount)? amount: 0));
		
		for (; i<len; ++i) {
			add.push({
				on: false,
				disabled: Boolean(i % 10 === 0),
				caption: "Caption " + i,
				label: "Label " + i
			});
		}
		
		return add;
	},
	scrollToIndex: function (sender, event) {
		var newIndex = sender.getValue();
		if (this.isScrolled && newIndex) {
			this.$.drawers.closeDrawers();
			this.$.repeater.scrollToIndex(newIndex);
			this.isScrolled = false;
		}
	},
	scrollStopped: function() {
		this.isScrolled = true;
	},
	toggleShowing: function (sender) {
		var showing = ! this.$.repeater.getShowing();
		this.$.repeater.setShowing(showing);
		sender.set("content", (showing? "Hide": "Show"));
	},
	repeaterDebuggingChanged: function () {
		if (this.$.repeater) {
			this.$.repeater.addRemoveClass("debug", this.repeaterDebugging);
		}
	},
	orientationChanged: function () {
		var props = enyo.mixin({}, [this.repeaterDefaults, {orientation: this.orientation}]),
			cp    = this.controlParent,
			c;
		if (this.$.repeater) {
			this.$.repeater.destroy();
		}
		this.set("side", this.orientation == "vertical"? "left": "bottom");
		this.controlParent = this.$.repeaterContainer;
		c = this.createComponent(props);
		c.render();
		this.controlParent = cp;
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
	},
	repeaterDefaults: {name: "repeater", kind: "moon.DataList", components: [
		{classes: "enyo-border-box", components: [
			{name: "caption", kind: "moon.CaptionDecorator", components: [
				{name: "button", kind: "moon.ToggleButton"}
			]}
		], bindings: [
			{from: ".model.caption", to: ".$.caption.content"},
			{from: ".repeater.side", to: ".$.caption.side"},
			{from: ".model.label", to: ".$.button.content"},
			{from: ".model.disabled", to: ".$.button.disabled"},
			{from: ".model.on", to: ".$.button.value", oneWay: false}
		]}
	], onScrollStop: "scrollStopped"}
});
