
enyo.kind({
	name : 'moon.sample.FlexLayoutSample',
	classes: 'flex-layout-sample enyo-fit moon',
	layoutKind: 'HFlexLayout',
	textFields: ['col1', 'col2', 'col4', 'row1', 'row2', 'row3', 'row4', 'row5', 'col2_1', 'col2_2', 'col2_3'],
	components: [
		{name: 'col1', content: 'column 1', classes: 'column leaf'},
		{name: 'col2', layoutKind: 'VFlexLayout', flex: true, components: [
			{name: 'row1', content: 'row 1', classes: 'leaf', components: [
				{name: 'button1', kind: 'Button', content: 'Add content', ontap: 'appendContent1'},
				{name: 'content1'}
			]},
			{name: 'row2', flex: true, classes: 'leaf'},
			{name: 'row3', layoutKind: 'HFlexLayout', flex: true, components: [
				{name: 'col2_1', content: 'column 2_1', classes: 'column leaf'},
				{name: 'col2_2', content: 'column 2_2', classes: 'leaf', flex: true, components: [
					{name: 'button2', kind: 'Button', content: 'Add content', ontap: 'appendContent2'},
					{name: 'content2'}
				]},
				{name: 'col2_3', content: 'column 2_3', classes: 'column leaf'}
			]},
			{name: 'row4', content: 'row 4', classes: 'row leaf'},
			{name: 'row5', content: 'row 5', classes: 'row leaf'}
		], style: 'padding: 0'},
		{name: 'col3', content: 'column 3', classes: 'leaf', style: 'white-space:nowrap;', components: [
			{name: 'button3', kind: 'Button', content: 'Add content', ontap: 'appendContent3'},
			{name: 'content3', classes: 'leaf'}
		]},
		{name: 'col4', content: 'column 4', flex: true, classes: 'leaf'}
	],

	statics: {
		sLoremIpsum: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, ' +
		'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
		'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut '
	},

	appendContent1: function() {
		this.$.content1.createComponent({content:'More content LA LA LA LA LA!'}).render();
	},

	appendContent2: function() {
		this.$.content2.addContent(moon.sample.FlexLayoutSample.sLoremIpsum);
	},

	appendContent3: function() {
		this.$.content3.addContent(' Bar Foo Bar Foo Bar Foo');
	},

	rendered: function() {
		this.inherited(arguments);
		for (var s in this.textFields) {
			this.$[this.textFields[s]].setContent(moon.sample.FlexLayoutSample.sLoremIpsum);
		}
	}
});