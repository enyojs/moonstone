enyo.kind({
	name: "moon.sample.ExpandablePickerSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "moon.Panels", pattern: "activity", classes: "enyo-fit", components: [
			{kind: "moon.Panel", name: "nonGroupedPanel", onChange: "pickerChanged", title: "Expandable", headerType: "medium", titleBelow: "Not grouped", style: "width:50%;", components: [
				{kind: "moon.Scroller", horizontal: "hidden", classes: "enyo-fill", components: [
					{style: "max-width: 500px;", components: [
						{kind: "moon.ExpandablePicker", noneText: "Nothing selected", content: "Expandable Picker", allowHtml:true, components: [
							{content: "English"},
							{content: "Spanish"},
							{content: "French"},
							{content: "German"},
							{content: "Italian"},
							{content: "Japanese"},
							{content: "Symbols <span style='color:orange;'>&#x2620; &#x2764; &#x2619;</span>", allowHtml:true}
						]},
						{kind: "moon.ExpandablePicker", content: "Pre-selected Picker", components: [
							{content: "On", active: true},
							{content: "Off"}
						]},
						{kind: "moon.ExpandablePicker", multipleSelection: true, noneText: "Nothing selected", content: "Non-auto-collapsing", autoCollapseOnSelect: false, components: [
							{content: "Item 1"},
							{content: "Item 2", active: true},
							{content: "Item 3", active: true}
						]},
						{kind: "moon.ExpandablePicker", noneText: "Nothing selected with loooooooooooooooooooooooooong text truncation", content: "Expandable Picker with looooooooooooooooooooooooooong text truncation", components: [
							{content: "Looooooooooooooooooooooooooooooooooooooooooooong Item 1"},
							{content: "Looooooooooooooooooooooooooooooooooooooooooooong Item 2"},
							{content: "Looooooooooooooooooooooooooooooooooooooooooooong Item 3"}
						]},
						{kind: "moon.ExpandablePicker", disabled:true, content: "Disabled Picker", components: [
							{content: "Item 1"},
							{content: "Item 2", active: true},
							{content: "Item 3"}
						]},
						{kind: "moon.ExpandablePicker", content: "Pre-expanded picker", open: true, components: [
							{content: "Item 1"},
							{content: "Item 2", active: true},
							{content: "Item 3"}
						]},
						{kind: "moon.ExpandableIntegerPicker", noneText: "Not Selected", autoCollapse: true, content: "Integer Picker", value: 7, min: 3, max: 15, step: 1, unit: "elephants"},
						{kind: "moon.ExpandableIntegerPicker", noneText: "Not Selected", disabled:true, autoCollapse: true, content: "Disabled Integer Picker", value: 2, min: 1, max: 15, unit: "sec"},
						{kind: "moon.DatePicker", noneText: "Pick a Date", content: "Date Picker"},
						{kind: "moon.TimePicker", noneText: "Pick a Date", content: "Time Picker"},
						{kind: "moon.DayPicker", noneText: "Pick a Day", content: "Day Picker"},
						{kind: "moon.ExpandableInput", noneText: "Enter text", content: "Expandable Input", placeholder: "Enter text"},
						{kind: "moon.ExpandableDataPicker", content: "Expandable Data Picker", noneText: "Nothing Selected", components: [
							{bindings: [
								{from: ".model.label", to: ".content"}
							]}
						]}
					]}
				]}
			]},
			{kind: "moon.Panel", name: "groupedPanel", onChange: "pickerChanged", title: "Pickers", headerType: "medium", titleBelow: "Grouped", joinToPrev:true, components: [
				{kind: "enyo.Group", tag:null, highlander: true, components: [
					{kind: "moon.Scroller", horizontal: "hidden", classes: "enyo-fill", components: [
						{style: "max-width: 500px;", components: [
							{kind: "moon.ExpandablePicker", noneText: "Nothing selected", content: "Expandable Picker", allowHtml:true, components: [
								{content: "English"},
								{content: "Spanish"},
								{content: "French"},
								{content: "German"},
								{content: "Italian"},
								{content: "Japanese"},
								{content: "Symbols <span style='color:orange;'>&#x2620; &#x2764; &#x2619;</span>", allowHtml:true}
							]},
							{kind: "moon.ExpandablePicker", content: "Pre-selected Picker", components: [
								{content: "On", active: true},
								{content: "Off"}
							]},
							{kind: "moon.ExpandablePicker", content: "Non-auto-collapsing", autoCollapseOnSelect: false, components: [
								{content: "Item 1"},
								{content: "Item 2", active: true},
								{content: "Item 3"}
							]},
							{kind: "moon.ExpandablePicker", noneText: "Nothing selected with loooooooooooooooooooooooooong text truncation", content: "Expandable Picker with looooooooooooooooooooooooooong text truncation", components: [
								{content: "Looooooooooooooooooooooooooooooooooooooooooooong Item 1"},
								{content: "Looooooooooooooooooooooooooooooooooooooooooooong Item 2"},
								{content: "Looooooooooooooooooooooooooooooooooooooooooooong Item 3"}
							]},
							{kind: "moon.ExpandablePicker", disabled:true, content: "Disabled Picker", components: [
								{content: "Item 1"},
								{content: "Item 2", active: true},
								{content: "Item 3"}
							]},
							{kind: "moon.ExpandablePicker", content: "Pre-expanded picker", open: true, components: [
								{content: "Item 1"},
								{content: "Item 2", active: true},
								{content: "Item 3"}
							]},
							{kind: "moon.ExpandableIntegerPicker", noneText: "Not Selected", autoCollapse: true, content: "Integer Picker", value: 7, min: 3, max: 15, step: 1, unit: "elephants"},
							{kind: "moon.ExpandableIntegerPicker", noneText: "Not Selected", disabled:true, autoCollapse: true, content: "Disabled Integer Picker", value: 2, min: 1, max: 15, unit: "sec"},
							{kind: "moon.DatePicker", noneText: "Pick a Date", content: "Date Picker"},
							{kind: "moon.TimePicker", noneText: "Pick a Date", content: "Time Picker"},
							{kind: "moon.ExpandableInput", noneText: "Enter text", content: "Expandable Input", placeholder: "Enter text"},
							{kind: "moon.ExpandableDataPicker", content: "Expandable Data Picker", noneText: "Nothing Selected", components: [
								{bindings: [
									{from: ".model.label", to: ".content"}
								]}
							]}
						]}
					]}
				]}
			]}
		]}
	],
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);

			var c = new enyo.Collection([
				{label: "Item 1"},
				{label: "Item 2"},
				{label: "Item 3"},
				{label: "Item 4"},
				{label: "Item 5"}
			]);

			this.$.expandableDataPicker.set("collection", c);
			this.$.expandableDataPicker2.set("collection", c);
		};
	}),
	pickerChanged: function(inSender, inEvent) {
		var value,
			picker = inEvent.originator.getContent();
		if (inEvent.originator instanceof moon.ExpandablePicker) {
			value = inEvent.content;
			inSender.setSubTitleBelow(picker + " changed to '" + value + "'");
		} else if ((inEvent.originator instanceof moon.ExpandableIntegerPicker) ||
					(inEvent.originator instanceof moon.DatePicker) ||
					(inEvent.originator instanceof moon.TimePicker) ||
					(inEvent.originator instanceof moon.ExpandableInput)) {
			value = inEvent.originator.getValue();
			inSender.setSubTitleBelow(picker + " changed to '" + value + "'");
		}
	},
	// when called, go into loop of opening/closing pickers every second
	stressTest: function() {
		var pickers = [
			"datePicker",
			"datePicker2",
			"expandableInput",
			"expandableInput2",
			"expandableIntegerPicker",
			// disabled "expandableIntegerPicker2",
			"expandableIntegerPicker3",
			// disabled "expandableIntegerPicker4",
			"expandablePicker",
			"expandablePicker2",
			"expandablePicker3",
			"expandablePicker4",
			// disabled "expandablePicker5",
			"expandablePicker6",
			"expandablePicker7",
			"expandablePicker8",
			"expandablePicker9",
			"expandablePicker10",
			// disabled "expandablePicker11",
			"expandablePicker12",
			"timePicker",
			"timePicker2",
			"expandableDataPicker",
			"expandableDataPicker2"
		];
		var index = 0;
		var opened = false;
		setInterval(this.bindSafely(function() {
			if (opened) {
				this.$[pickers[index++]].setOpen(false);
			} else {
				this.$[pickers[index]].setOpen(true);
			}
			opened = !opened;
			index = index % pickers.length;
		}), 1000);
	}
});
