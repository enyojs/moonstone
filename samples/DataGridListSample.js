enyo.kind({
	name: 'moon.sample.GridSampleItem',
	kind: 'moon.GridListImageItem',
	mixins: ['moon.SelectionOverlaySupport'],
	selectionOverlayVerticalOffset: 35,
	subCaption: 'Sub Caption',
	bindings: [
		{from: 'model.text', to: 'caption'},
		{from: 'model.subText', to: 'subCaption'},
		{from: 'model.url', to: 'source'},
		{from: 'model.selected', to: 'selected', oneWay: false}
	]
});

enyo.kind({
	name: 'moon.HorizontalGridListImageItem',
	kind: 'moon.GridListImageItem',
	mixins: ['moon.SelectionOverlaySupport'],

	selectionOverlayVerticalOffset: 50,
	selectionOverlayHorizontalOffset: 95,
	centered: false,

	bindings: [
		{from: 'model.text', to: 'caption'},
		{from: 'model.subText', to: 'subCaption'},
		{from: 'model.url', to: 'source'}
	],

	classes: 'horizontal-gridList-image-item'
});

enyo.kind({
	name: 'moon.HorizontalGridListItem',
	kind: 'moon.GridListImageItem',
	mixins: ['moon.SelectionOverlaySupport'],

	selectionOverlayVerticalOffset: 50,
	selectionOverlayHorizontalOffset: 5,
	centered: false,

	components: [
		{name: 'caption', classes: 'caption'},
		{name: 'subCaption', classes: 'sub-caption'}
	],

	bindings: [
		{from: 'model.text', to: 'caption'},
		{from: 'model.subText', to: 'subCaption'}
	],

	classes: 'horizontal-gridList-item',

	imageSizingChanged: function() {
		return true;
	}
});

enyo.kind({
	name: 'moon.sample.DataGridListSample',
	kind: 'moon.Panels',
	pattern: 'activity',
	classes: 'moon enyo-fit enyo-unselectable',
	components: [
		{name: 'listPanel', kind: 'moon.Panel', joinToPrev: true, title:'Data Grid List', headerComponents: [
			{kind: 'moon.ToggleButton', content:'Selection', name:'selectionToggle', onChange: 'selectionChanged'},
			{kind: 'moon.ContextualPopupDecorator', components: [
				{kind: 'moon.ContextualPopupButton', content:'Selection Type'},
				{kind: 'moon.ContextualPopup', classes:'moon-4h', components: [
					{kind: 'moon.RadioItemGroup', name: 'selectionTypeGroup', onActiveChanged: 'selectionTypeChanged', components: [
						{content: 'Single', value: 'single', selected: true},
						{content: 'Multiple', value: 'multi'},
						{content: 'Group', value: 'group'}
					]}
				]}
			]},
			{kind: 'moon.ContextualPopupDecorator', components: [
				{kind: 'moon.ContextualPopupButton', content:'Item Type'},
				{kind: 'moon.ContextualPopup', classes:'moon-6h', components: [
					{kind: 'moon.RadioItemGroup', name: 'itemTypeGroup', onActiveChanged: 'itemTypeChanged', components: [
						{content: 'ImageItem', value: 'GridListImageItem', selected: true},
						{content: 'HorizontalImageItem', value: 'HorizontalGridListImageItem'},
						{content: 'HorizontalItem', value: 'HorizontalGridListItem'}
					]}
				]}
			]},
			{kind: 'moon.Button', content:'Refresh', ontap:'refreshItems'},
			{kind: 'moon.ContextualPopupDecorator', components: [
				{kind: 'moon.ContextualPopupButton', content:'Popup List'},
				{kind: 'moon.ContextualPopup', classes:'moon-6h moon-8v', components: [
					{kind:'moon.DataList', components: [
						{kind:'moon.CheckboxItem', bindings: [
							{from:'.model.text', to:'.content'},
							{from:'.model.selected', to: '.checked', oneWay: false}
						]}
					]}
				]}
			]}
		]}
	],
	bindings: [
		{from: 'collection', to: '$.dataList.collection'}
	],
	create: function () {
		this.inherited(arguments);
		this.generateDataGridList('GridListImageItem');
	},
	generateRecords: function (amount) {
		var records = [],
			idx     = this.modelIndex || 0;
		for (; records.length < amount; ++idx) {
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
	generateDataGridList: function(itemType) {
		if (this.$.gridList) {
			this.$.gridList.destroy();
		}

		var moreProps = {};

		switch (itemType) {
		case 'HorizontalGridListImageItem':
			moreProps = {minWidth: 600, minHeight: 100,
				components: [{
					kind: 'moon.HorizontalGridListImageItem',
					bindings: [
						{from: 'model.text', to: 'caption'},
						{from: 'model.subText', to: 'subCaption'},
						{from: 'model.url', to: 'source'},
						{from: 'model.selected', to: 'selected', oneWay: false}
					]
				}]
			};
			break;
		case 'HorizontalGridListItem':
			moreProps = {minWidth: 600, minHeight: 100,
				components: [{
					kind: 'moon.HorizontalGridListItem',
					bindings: [
						{from: 'model.text', to: 'caption'},
						{from: 'model.subText', to: 'subCaption'},
						{from: 'model.selected', to: 'selected', oneWay: false}
					]
				}]
			};
			break;
		default:
			break;
		}

		var props = enyo.mixin({}, [this.dataListDefaults, moreProps]);
		var c = this.$.listPanel.createComponent(props, {owner: this});
		c.render();
		this.set('collection', new enyo.Collection(this.generateRecords(40)));

		this.$.gridList.set('collection', this.collection);
		this.$.gridList.set('selection', this.$.selectionToggle.value);
		if (this.$.selectionTypeGroup.active) {
			this.$.gridList.set('selectionType', this.$.selectionTypeGroup.active.value);
		}
	},
	selectionChanged: function(inSender, inEvent) {
		this.$.gridList.set('selection', inSender.value);
	},
	itemTypeChanged: function(inSender, inEvent) {
		this.generateDataGridList(inSender.active.value);
	},
	selectionTypeChanged: function(inSender, inEvent) {
		this.$.gridList.set('selectionType', inSender.active.value);
	},
	refreshItems: function () {
		// we fetch our collection reference
		var collection = this.get('collection');
		// we now remove all of the current records from the collection
		collection.remove(collection.models);
		// and we insert all new records that will update the list
		collection.add(this.generateRecords(100));
	},
	dataListDefaults: {name: 'gridList', kind: 'moon.DataGridList', selection: false, fit: true, spacing:20, minHeight: 270, minWidth: 180, scrollerOptions: { kind: 'moon.Scroller', vertical:'scroll', horizontal: 'hidden', spotlightPagingControls: true }, components: [
		{kind: 'moon.sample.GridSampleItem'}
	]}
});