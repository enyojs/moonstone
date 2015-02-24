var
	kind = require('enyo/kind'),
	drag = require('enyo/drag'),
	Collection = require('enyo/Collection');

var
	ri = require('moonstone/resolution'),
	Button = require('moonstone/Button'),
	CheckboxItem = require('moonstone/CheckboxItem'),
	ContextualPopup = require('moonstone/ContextualPopup'),
	ContextualPopupButton = require('moonstone/ContextualPopupButton'),
	ContextualPopupDecorator = require('moonstone/ContextualPopupDecorator'),
	DataList = require('moonstone/DataList'),
	DataGridList = require('moonstone/DataGridList'),
	GridListImageItem = require('moonstone/GridListImageItem'),
	Item = require('moonstone/Item'),
	Panel = require('moonstone/Panel'),
	Panels = require('moonstone/Panels'),
	RadioItemGroup = require('moonstone/RadioItemGroup'),
	Scroller = require('moonstone/Scroller')
	SelectionOverlaySupport = require('moonstone/SelectionOverlaySupport'),
	ToggleButton = require('moonstone/ToggleButton');



var GridSampleItem = kind({
	name: 'moon.sample.GridSampleItem',
	kind: 'moon.GridListImageItem',
	mixins: [SelectionOverlaySupport],
	selectionOverlayVerticalOffset: 35,
	subCaption: 'Sub Caption',
	bindings: [
		{from: '.model.text', to: '.caption'},
		{from: '.model.subText', to: '.subCaption'},
		{from: '.model.url', to: '.source'}
	]
});

var DataGridListSample = module.exports = kind({
	name: 'moon.sample.DataGridListSample',
	kind: Panels,
	pattern: 'activity',
	classes: 'moon enyo-fit enyo-unselectable',
	components: [
		{kind: Panel, classes: 'moon-6h', title: 'Menu', components: [
			{kind: Item, content: 'Scroll'},
			{kind: Item, content: 'the'},
			{kind: Item, content: 'Data Grid List'},
			{kind: Item, content: 'to'},
			{kind: Item, content: 'the'},
			{kind: Item, content: 'Right!'}
		]},
		{kind: Panel, joinToPrev: true, title: 'Data Grid List', headerComponents: [
			{kind: ToggleButton, content: 'Selection', name: 'selectionToggle'},
			{kind: ContextualPopupDecorator, components: [
				{kind: ContextualPopupButton, content: 'Selection Type'},
				{kind: ContextualPopup, classes: 'moon-4h', components: [
					{kind: RadioItemGroup, name: 'selectionTypeGroup', components: [
						{content: 'Single', value: 'single', selected: true},
						{content: 'Multiple', value: 'multi'},
						{content: 'Group', value: 'group'}
					]}
				]}
			]},
			{kind: Button, content: 'Refresh', ontap: 'refreshItems'},
			{kind: ContextualPopupDecorator, components: [
				{kind: ContextualPopupButton, content: 'Popup List'},
				{kind: ContextualPopup, classes: 'moon-6h moon-8v', components: [
					{kind:DataList, components: [
						{kind:CheckboxItem, bindings: [
							{from: '.model.text', to: '.content'},
							{from: '.model.selected', to: '.checked', oneWay: false}
						]}
					]}
				]}
			]}
		], components: [
			{name: 'gridList', fit: true, spacing: 20, minWidth: 180, minHeight: 270, kind: DataGridList, scrollerOptions: { kind: Scroller, vertical: 'scroll', horizontal: 'hidden', spotlightPagingControls: true }, components: [
				{ kind: GridSampleItem }
			]}
		]}
	],
	bindings: [
		{from: '.collection', to: '.$.dataList.collection'},
		{from: '.collection', to: '.$.gridList.collection'},
		{from: '.$.selectionTypeGroup.active', to: '.$.gridList.selectionType',
			transform: function (selected) {
				return selected && selected.value;
			}
		},
		{from: '.$.selectionToggle.value', to: '.$.gridList.selection', oneWay: false}
	],
	create: function () {
		Panels.prototype.create.apply(this, arguments);
		// we set the collection that will fire the binding and add it to the list
		this.set('collection', new Collection(this.generateRecords()));
	},
	generateRecords: function () {
		var records = [],
			idx     = this.modelIndex || 0;
		for (; records.length < 500; ++idx) {
			var title = (idx % 8 === 0) ? ' with long title' : '';
			var subTitle = (idx % 8 === 0) ? 'Lorem ipsum dolor sit amet' : 'Subtitle';
			records.push({
				selected: false,
				text: 'Item ' + idx + title,
				subText: subTitle,
				url: 'http://placehold.it/300x300/' + Math.floor(Math.random()*0x1000000).toString(16) + '/ffffff&text=Image ' + idx
			});
		}
		// update our internal index so it will always generate unique values
		this.modelIndex = idx;
		return records;
	},
	refreshItems: function () {
		// we fetch our collection reference
		var collection = this.get('collection');
		// we now remove all of the current records from the collection
		collection.remove(collection.models);
		// and we insert all new records that will update the list
		collection.add(this.generateRecords());
	}
});