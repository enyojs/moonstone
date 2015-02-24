var
	kind = require('enyo/kind'),
	Collection = require('enyo/Collection'),
	DataRepeater = require('enyo/DataRepeater')
	Group = require('enyo/Group');

var
	BodyText = require('moonstone/BodyText'),
	Button = require('moonstone/Button'),
	CheckboxItem = require('moonstone/CheckboxItem'),
	DataList = require('moonstone/DataList'),
	Divider = require('moonstone/Divider'),
	ListActions = require('moonstone/ListActions'),
	Panel = require('moonstone/Panel'),
	Panels = require('moonstone/Panels'),
	Scroller = require('moonstone/Scroller'),
	SelectableItem = require('moonstone/SelectableItem'),
	ToggleButton = require('moonstone/ToggleButton'),
	ToggleItem = require('moonstone/ToggleItem'),
	Tooltip = require('moonstone/Tooltip'),
	TooltipDecorator = require('moonstone/TooltipDecorator');

module.exports = kind({
	name: 'moon.sample.ListActionsSample',
	kind: Panels,
	pattern: 'activity',
	classes: 'moon enyo-unselectable enyo-fit',
	handlers: {
		onActivate: 'activateHandler'
	},
	components: [
		{kind: Panel, headerType: 'medium', title: 'List Actions Sample', headerComponents: [
			{kind: TooltipDecorator, components: [
				{kind: Tooltip, position: 'above', content: 'Test Dynamic Lists'},

				//* List actions with default width
				{kind: ListActions, disabled: true, name: 'listActions', icon: 'drawer', listActions: [
					{action: 'category3', components: [
						{kind: Divider, content: 'Category 3 (DataList)'},
						{kind: DataList, name: 'list', fit:true, components: [
							{kind: CheckboxItem, bindings: [{from: '.model.name', to: '.content'}]}
						]}
					]},
					{action: 'category2', components: [
						{kind: Divider, content: 'Category 2 (DataRepeater)'},
						{kind: DataRepeater, containerOptions:{kind: Scroller, classes: 'enyo-fill'}, name: 'repeater', fit:true, components: [
							{kind: ToggleItem, bindings: [{from: '.model.name', to: '.content'}]}
						]}
					]},
					{action: 'category1', components: [
						{kind: Divider, content: 'Category 1 (Static)'},
						{kind: Scroller, fit: true, components: [
							{kind: Group, name: 'group', highlander: true, defaultKind: SelectableItem, components: [
								{content: 'Just Released'},
								{content: 'Recommended'},
								{content: 'Top Rated'}
							]}
						]}
					]}
				]}
			]},
			{kind: TooltipDecorator, components: [
				{kind: Tooltip, position: 'above', content: 'Dummy List Actions'},

				//* List actions with proportional width
				{kind: ListActions, proportionalWidth: true, iconSrc: 'assets/icon-list.png', listActions: [
					{action: 'Cost', components: [
						{kind: Divider, content: 'Cost'},
						{kind: Scroller, defaultKind: ToggleItem, fit: true, components: [
							{content: '$'},
							{content: '$$'},
							{content: '$$$'}
						]}
					]},
					{action: 'Flavor', components: [
						{kind: Divider, content: 'Flavor'},
						{kind: Scroller, defaultKind: CheckboxItem, fit: true, components: [
							{content: 'Spicy'},
							{content: 'Sweet'},
							{content: 'Sour'},
							{content: 'Salty', checked: true},
							{content: 'Savory'},
							{content: 'Bland'},
							{content: 'Umami'},
							{content: 'Bitter'}
						]}
					]}
				]}
			]},
			{kind: TooltipDecorator, components: [
				{kind: Tooltip, position: 'above', content: 'Test Auto Collapse'},

				//* List actions with auto-collapsing
				{kind: ListActions, autoCollapse: true, iconSrc: 'assets/icon-list.png', listActions: [
					{action: 'AutoCollapseTest', components: [
						{kind: Divider, content: 'Try Auto-collapse'},
						{kind: Scroller, fit: true, components: [
							{kind: Group, highlander: true, defaultKind: CheckboxItem, components: [
								{content: 'Select'},
								{content: 'One'},
								{content: 'To'},
								{content: 'Auto'},
								{content: 'Collapse'},
								{content: 'This'},
								{content: 'List'},
								{content: 'Actions'},
								{content: 'Menu'}
							]}
						]}
					]}
				]}
			]}
		], components: [
			{components: [
				{kind: Button, small:true, content: 'Add Option to Category 1', ontap: 'addToStatic'},
				{kind: Button, small:true, content: 'Add Option to Category 2', ontap: 'addToRepeater'},
				{kind: Button, small:true, content: 'Add Option to Category 3', ontap: 'addToList'},
				{classes: 'moon-1v'},
				{kind: Button, small:true, content: 'Breadcrumb Panel', ontap: 'toggleBreadcrumb'},
				{kind: ToggleButton, small: true, toggleOnLabel: 'Header Type: Small', toggleOffLabel: 'Header Type: Medium', ontap: 'toggleHeaderSize'},
				{name: 'toggleDisabledListActions', kind: ToggleButton, small: true, toggleOnLabel: 'ListActions: Disabled', toggleOffLabel: 'ListActions: Enabled', value: true}
			]},
			{fit: true},
			{kind: Divider, content: 'List Action Event'},
			{kind: BodyText, name: 'console', content: 'Event'}
		]},
		{kind: Panel, title: 'Header', components: [
			{kind: Button, small:true, content: 'Go Back', ontap: 'toggleBreadcrumb'}
		]}
	],
	bindings: [
		{from: '$.toggleDisabledListActions.value', to: '$.listActions.disabled'}
	],
	activateHandler: function (sender, event) {
		if (event && event.action) {
			if (event.originator instanceof SelectableItem) {
				this.$.console.setContent(
					event.action + ': ' +
					event.originator.getContent() + ' was ' +
					(event.originator.getSelected() ? 'selected' : 'unselected')
				);
			} else {	// moon.CheckboxItem or moon.ToggleItem
				this.$.console.setContent(
					event.action + ': ' +
					event.toggledControl.getContent() + ' was ' +
					(event.originator.getChecked() ? 'selected' : 'unselected')
				);
			}
		}

		// Log the active state of the ListAction drawer
		if (event.originator instanceof ListActions) {
			this.$.console.setContent(event.originator.name + ' is now ' + (event.originator.getOpen() ? 'open' : 'closed'));
		}
	},
	addToStatic: function () {
		this.optionNumber = (this.optionNumber || 0) + 1;
		this.$.group.createComponent({content: 'Option ' + this.optionNumber}).render();
	},
	addToList: function () {
		this.optionNumber = (this.optionNumber || 0) + 1;
		this.$.list.collection.add({name: 'Option ' + this.optionNumber});
	},
	addToRepeater: function () {
		this.optionNumber = (this.optionNumber || 0) + 1;
		this.$.repeater.collection.add({name: 'Option ' + this.optionNumber});
	},
	toggleBreadcrumb: function () {
		this.setIndex(this.getIndex() > 0 ? 0 : 1);
	},
	toggleHeaderSize: function () {
		this.getActive().setHeaderType(this.getActive().getHeaderType() == 'small' ? 'medium': 'small');
	},
	create: function () {
		Panels.prototype.create.apply(this, arguments);
		this.$.list.set('collection', new Collection([
			{name: 'SAT 1'},
			{name: 'SAT 2'},
			{name: 'SAT 3'},
			{name: 'OTHER S1'},
			{name: 'OTHER S2'}
		]));
		this.$.repeater.set('collection', new Collection([
			{name: 'Comedy'},
			{name: 'Action'},
			{name: 'Drama'},
			{name: 'Family'},
			{name: 'Fantasy'},
			{name: 'Science Fiction'}
		]));
	}
});