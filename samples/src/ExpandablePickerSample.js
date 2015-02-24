var
	kind = require('enyo/kind'),
	Collection = require('enyo/Collection'),
	Control = require('enyo/Control'),
	Group = require('enyo/Group');

var
	DatePicker = require('moonstone/DatePicker'),
	ExpandableDataPicker = require('moonstone/ExpandableDataPicker'),
	ExpandableInput = require('moonstone/ExpandableInput'),
	ExpandableIntegerPicker = require('moonstone/ExpandableIntegerPicker'),
	ExpandablePicker = require('moonstone/ExpandablePicker'),
	Panel = require('moonstone/Panel'),
	Panels = require('moonstone/Panels'),
	Scroller = require('moonstone/Scroller'),
	TimePicker = require('moonstone/TimePicker');

module.exports = kind({
	name: 'moon.sample.ExpandablePickerSample',
	kind: Control,
	classes: 'moon enyo-unselectable enyo-fit',
	components: [
		{kind: Panels, pattern: 'activity', classes: 'enyo-fit', components: [
			{kind: Panel, name: 'nonGroupedPanel', onChange: 'pickerChanged', title: 'Expandable', headerType: 'medium', titleBelow: 'Not grouped', style: 'width:50%;', components: [
				{kind: Scroller, horizontal: 'hidden', classes: 'enyo-fill', components: [
					{style: 'max-width: 500px;', components: [
						{kind: ExpandablePicker, noneText: 'Nothing selected', content: 'Expandable Picker', allowHtml:true, components: [
							{content: 'English'},
							{content: 'Spanish'},
							{content: 'French'},
							{content: 'German'},
							{content: 'Italian'},
							{content: 'Japanese'},
							{content: 'Symbols <span style=\'color:orange;\'>&#x2620; &#x2764; &#x2619;</span>', allowHtml:true}
						]},
						{kind: ExpandablePicker, content: 'Pre-selected Picker', components: [
							{content: 'On', active: true},
							{content: 'Off'}
						]},
						{kind: ExpandablePicker, multipleSelection: true, noneText: 'Nothing selected', content: 'Non-auto-collapsing', autoCollapseOnSelect: false, components: [
							{content: 'Item 1'},
							{content: 'Item 2', active: true},
							{content: 'Item 3', active: true}
						]},
						{kind: ExpandablePicker, noneText: 'Nothing selected with loooooooooooooooooooooooooong text truncation', content: 'Expandable Picker with looooooooooooooooooooooooooong text truncation', components: [
							{content: 'Looooooooooooooooooooooooooooooooooooooooooooong Item 1'},
							{content: 'Looooooooooooooooooooooooooooooooooooooooooooong Item 2'},
							{content: 'Looooooooooooooooooooooooooooooooooooooooooooong Item 3'}
						]},
						{kind: ExpandablePicker, disabled:true, content: 'Disabled Picker', components: [
							{content: 'Item 1'},
							{content: 'Item 2', active: true},
							{content: 'Item 3'}
						]},
						{kind: ExpandablePicker, content: 'Pre-expanded picker', open: true, components: [
							{content: 'Item 1'},
							{content: 'Item 2', active: true},
							{content: 'Item 3'}
						]},
						{kind: ExpandableIntegerPicker, autoCollapse: true, content: 'Integer Picker', value: 7, min: 3, max: 15, step: 1, unit: 'elephants'},
						{kind: ExpandableIntegerPicker, disabled:true, autoCollapse: true, content: 'Disabled Integer Picker', value: 2, min: 1, max: 15, unit: 'sec'},
						{kind: DatePicker, noneText: 'Pick a Date', content: 'Date Picker'},
						{kind: TimePicker, noneText: 'Pick a Date', content: 'Time Picker'},
						{kind: ExpandableInput, noneText: 'Enter text', content: 'Expandable Input', placeholder: 'Enter text'},
						{kind: ExpandableDataPicker, content: 'Expandable Data Picker', noneText: 'Nothing Selected', components: [
							{bindings: [
								{from: '.model.label', to: '.content'}
							]}
						]},
						{kind: ExpandablePicker, content: 'Initially Hidden Items Picker', renderItemsOnShow: true, components: [
							{content: 'Item 1'},
							{content: 'Item 2', active: true},
							{content: 'Item 3'}
						]}
					]}
				]}
			]},
			{kind: Panel, name: 'groupedPanel', onChange: 'pickerChanged', title: 'Pickers', headerType: 'medium', titleBelow: 'Grouped', joinToPrev:true, components: [
				{kind: Group, tag:null, highlander: true, components: [
					{kind: Scroller, horizontal: 'hidden', classes: 'enyo-fill', components: [
						{style: 'max-width: 500px;', components: [
							{kind: ExpandablePicker, noneText: 'Nothing selected', content: 'Expandable Picker', allowHtml:true, components: [
								{content: 'English'},
								{content: 'Spanish'},
								{content: 'French'},
								{content: 'German'},
								{content: 'Italian'},
								{content: 'Japanese'},
								{content: 'Symbols <span style=\'color:orange;\'>&#x2620; &#x2764; &#x2619;</span>', allowHtml:true}
							]},
							{kind: ExpandablePicker, content: 'Pre-selected Picker', components: [
								{content: 'On', active: true},
								{content: 'Off'}
							]},
							{kind: ExpandablePicker, content: 'Non-auto-collapsing', autoCollapseOnSelect: false, components: [
								{content: 'Item 1'},
								{content: 'Item 2', active: true},
								{content: 'Item 3'}
							]},
							{kind: ExpandablePicker, noneText: 'Nothing selected with loooooooooooooooooooooooooong text truncation', content: 'Expandable Picker with looooooooooooooooooooooooooong text truncation', components: [
								{content: 'Looooooooooooooooooooooooooooooooooooooooooooong Item 1'},
								{content: 'Looooooooooooooooooooooooooooooooooooooooooooong Item 2'},
								{content: 'Looooooooooooooooooooooooooooooooooooooooooooong Item 3'}
							]},
							{kind: ExpandablePicker, disabled:true, content: 'Disabled Picker', components: [
								{content: 'Item 1'},
								{content: 'Item 2', active: true},
								{content: 'Item 3'}
							]},
							{kind: ExpandablePicker, content: 'Pre-expanded picker', open: true, components: [
								{content: 'Item 1'},
								{content: 'Item 2', active: true},
								{content: 'Item 3'}
							]},
							{kind: ExpandableIntegerPicker, autoCollapse: true, content: 'Integer Picker', value: 7, min: 3, max: 15, step: 1, unit: 'elephants'},
							{kind: ExpandableIntegerPicker, disabled:true, autoCollapse: true, content: 'Disabled Integer Picker', value: 2, min: 1, max: 15, unit: 'sec'},
							{kind: DatePicker, noneText: 'Pick a Date', content: 'Date Picker'},
							{kind: TimePicker, noneText: 'Pick a Date', content: 'Time Picker'},
							{kind: ExpandableInput, noneText: 'Enter text', content: 'Expandable Input', placeholder: 'Enter text'},
							{kind: ExpandableDataPicker, content: 'Expandable Data Picker', noneText: 'Nothing Selected', components: [
								{bindings: [
									{from: '.model.label', to: '.content'}
								]}
							]},
							{kind: ExpandablePicker, content: 'Initially Hidden Items Picker', renderItemsOnShow: true, components: [
								{content: 'Item 1'},
								{content: 'Item 2', active: true},
								{content: 'Item 3'}
							]}
						]}
					]}
				]}
			]}
		]}
	],
	create: function () {
		Control.prototype.create.apply(this, arguments);

		var c = new Collection([
			{label: 'Item 1'},
			{label: 'Item 2'},
			{label: 'Item 3'},
			{label: 'Item 4'},
			{label: 'Item 5'}
		]);

		this.$.expandableDataPicker.set('collection', c);
		this.$.expandableDataPicker2.set('collection', c);
	},
	pickerChanged: function (sender, event) {
		var value,
			picker = event.originator.getContent();
		if (event.originator instanceof ExpandablePicker) {
			value = event.content;
			sender.setSubTitleBelow(picker + ' changed to \'' + value + '\'');
		} else if ((event.originator instanceof ExpandableIntegerPicker) ||
					(event.originator instanceof DatePicker) ||
					(event.originator instanceof TimePicker) ||
					(event.originator instanceof ExpandableInput)) {
			value = event.originator.getValue();
			sender.setSubTitleBelow(picker + ' changed to \'' + value + '\'');
		}
	},
	// when called, go into loop of opening/closing pickers every second
	stressTest: function () {
		var pickers = [
			'datePicker',
			'datePicker2',
			'expandableInput',
			'expandableInput2',
			'expandableIntegerPicker',
			// disabled 'expandableIntegerPicker2',
			'expandableIntegerPicker3',
			// disabled 'expandableIntegerPicker4',
			'expandablePicker',
			'expandablePicker2',
			'expandablePicker3',
			'expandablePicker4',
			// disabled 'expandablePicker5',
			'expandablePicker6',
			'expandablePicker7',
			'expandablePicker8',
			'expandablePicker9',
			'expandablePicker10',
			// disabled 'expandablePicker11',
			'expandablePicker12',
			'timePicker',
			'timePicker2',
			'expandableDataPicker',
			'expandableDataPicker2'
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
