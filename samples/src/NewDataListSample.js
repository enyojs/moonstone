var
	kind = require('enyo/kind'),
	Collection = require('enyo/Collection'),
	Control = require('enyo/Control'),
	Img = require('enyo/Image');

var
	GridListImageItem = require('moonstone/GridListImageItem'),
	SelectionOverlaySupport = require('moonstone/SelectionOverlaySupport'),
	Button = require('moonstone/Button'),
	ExpandablePicker = require('moonstone/ExpandablePicker'),
	NewDataList = require('moonstone/NewDataList'),
	Panel = require('moonstone/Panel'),
	Panels = require('moonstone/Panels'),
	Scroller = require('moonstone/Scroller');

var ImageItem = kind({
	kind: GridListImageItem,
	mixins: [SelectionOverlaySupport],
	selectionOverlayVerticalOffset: 35,
	subCaption: 'Sub Caption',
	style: 'box-sizing: border-box;',
	bindings: [
		{from: 'model.text', to: 'caption'},
		{from: 'model.subText', to: 'subCaption'},
		{from: 'model.url', to: 'source'}
	]});

var NoImageItem = kind({
	kind: ImageItem,
	bindings: [
		{from: 'model.bgColor', to: 'bgColor'}
	],
	componentOverrides: {
		image: {kind: Control, style: 'width: 194px; height: 194px; background: gray;'}
	},
	imageSizingChanged: function(){},
	bgColorChanged: function() {
		this.$.image.applyStyle('background', this.bgColor);
	}
});

var
	buttonComponents = [
		{
			kind: Button,
			style: 'display: block; position: absolute;',
			selectedClass: 'active',
			bindings: [
				{from: 'model.text', to: 'content'}
			]
		}
	],
	imageComponents = [
		{kind: ImageItem, style: 'position: absolute;'}
	],
	noImageComponents = [
		{kind: NoImageItem, style: 'position: absolute;'}
	],
	plainImageComponents = [
		{
			kind: Img,
			bindings: [
				{from: 'model.url', to: 'src'}
			]
		}
	];

function selectedValue (selected) {
	return selected && selected.value;
}

module.exports = kind({
	name: 'moon.sample.NewDataListSample',
	kind: Panels,
	pattern: 'activity',
	classes: 'moon enyo-fit enyo-unselectable',
	components: [
		{
			kind: Panel, classes:'moon-6h', title:'Menu',
			components: [
				{
					kind: Scroller, 
					components: [
						{
							name: 'itemPicker', kind: ExpandablePicker, content: 'Items',
							components: [
								{content: 'Image Items', value: imageComponents, active: true},
								{content: 'No-Image Items', value: noImageComponents},
								{content: 'Plain Images', value: plainImageComponents},
								{content: 'Buttons', value: buttonComponents}
							]
						},
						{
							name: 'directionPicker', kind: ExpandablePicker, content: 'Direction',
							components: [
								{content: 'Vertical', value: 'vertical', active: true},
								{content: 'Horizontal', value: 'horizontal'}
							]
						},
						{
							name: 'selectionPicker', kind: ExpandablePicker, content: 'Selection',
							components: [
								{content: 'On', value: true},
								{content: 'Off', value: false, active: true}
							]
						},
						{
							name: 'selectionTypePicker', kind: ExpandablePicker, content: 'Selection Type',
							components: [
								{content: 'Single', value: 'single', active: true},
								{content: 'Multiple', value: 'multi'},
								{content: 'Group', value: 'group'}
							]
						}
					]
				}
			]
		},
		{
			kind: Panel, joinToPrev: true, title:'New Data List',
			headerComponents: [
				{kind: Button, content:'Refresh', ontap:'refreshItems'}
			],
			components: [
			{
				name: 'list',
				kind: NewDataList,
				minItemHeight: 270,
				minItemWidth: 180,
				spacing: 20,
				columns: 6,
				rows: 1,
				components: imageComponents
			}
		]}
	],
	bindings: [
		{from: 'collection', to: '$.list.collection'},
		{from: '$.itemPicker.selected', to: '$.list.components', transform: selectedValue},
		{from: '$.directionPicker.selected', to: '$.list.direction', transform: selectedValue},
		{from: '$.selectionPicker.selected', to: '$.list.selection', transform: selectedValue},
		{from: '$.selectionPicker.selected', to: '$.selectionTypePicker.showing', transform: selectedValue},
		{from: '$.selectionTypePicker.selected', to: '$.list.selectionType', transform: selectedValue}
	],
	create: function () {
		Panels.prototype.create.apply(this, arguments);
		this.set('collection', new Collection(this.generateRecords()));
	},
	generateRecords: function () {
		var records = [],
			idx     = this.modelIndex || 0,
			title, subTitle, color;
		for (; records.length < 500; ++idx) {
			title = (idx % 8 === 0) ? ' with long title' : '';
			subTitle = (idx % 8 === 0) ? 'Lorem ipsum dolor sit amet' : 'Subtitle';
			color = Math.floor(Math.random()*0x1000000).toString(16);

			records.push({
				selected: false,
				text: 'Item ' + idx + title,
				subText: subTitle,
				// url: 'http://placehold.it/300x300/9037ab/ffffff&text=Image'
				url: 'http://placehold.it/300x300/' + color + '/ffffff&text=Image ' + idx,
				bgColor: '#' + color
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