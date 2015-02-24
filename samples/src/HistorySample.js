var
	kind = require('enyo/kind'),
	Collection = require('enyo/Collection'),
	Control = require('enyo/Control'),
	DataRepeater = require('enyo/DataRepeater');

var
	Spotlight = require('spotlight');

var
	Button = require('moonstone/Button'),
	ChannelInfo = require('moonstone/ChannelInfo'),
	CheckboxItem = require('moonstone/CheckboxItem'),
	Clock = require('moonstone/Clock'),
	ContextualPopup = require('moonstone/ContextualPopup'),
	ContextualPopupDecorator = require('moonstone/ContextualPopupDecorator'),
	DataList = require('moonstone/DataList'),
	Divider = require('moonstone/Divider'),
	Drawers = require('moonstone/Drawers'),
	IconButton = require('moonstone/IconButton'),
	Item = require('moonstone/Item'),
	ListActions = require('moonstone/ListActions'),
	Panel = require('moonstone/Panel'),
	Panels = require('moonstone/Panels'),
	Popup = require('moonstone/Popup'),
	ToggleItem = require('moonstone/ToggleItem'),
	VideoInfoBackground = require('moonstone/VideoInfoBackground'),
	VideoInfoHeader = require('moonstone/VideoInfoHeader'),
	VideoPlayer = require('moonstone/VideoPlayer');

module.exports = kind({
	name: 'dmoon.sample.HistorySample',
	kind: Control,
	classes: 'moon enyo-fit enyo-unselectable',
	components: [
		{
			name: 'drawers',
			kind: Drawers,
			drawers: [
				{
					name: 'partialDrawer',
					open: false,
					controlsOpen: false,
					onActivate: 'partialDrawerChanged',
					onDeactivate: 'partialDrawerChanged',
					handle: {name: 'handleButton', content: 'Partial drawer with long text truncation'},
					components: [
						{kind: Panel, classes: 'enyo-fit', title: 'Partial Drawer', components: [
							{kind: Item, content: 'Item One'},
							{kind: Item, content: 'Item Two'}
						]}
					],
					controlDrawerComponents: [
						{classes: 'moon-hspacing', components: [
							{kind: Button, name: 'openMoreButton', content: 'Open More', ontap: 'openMainDrawer'},
							{kind: Button, content: 'Close', ontap: 'close'}
						]}
					]
				},
				{
					name: 'searchDrawer',
					handle: {content: 'Full drawer'},
					components: [
						{kind: Panel, classes: 'enyo-fit', title: 'Full Drawer', components: [
							{kind: Item, content: 'Item One'},
							{kind: Item, content: 'Item Two'}
						]}
					]
				}
			],
			components: [
				{name: 'player', kind: VideoPlayer, src: 'http://media.w3.org/2010/05/bunny/movie.mp4', poster: 'assets/video-poster.png', autoplay: true, showing: false, infoComponents: [
					{kind: VideoInfoBackground, orient: 'left', background: true, fit: true, components: [
						{
							kind: ChannelInfo,
							channelNo: '13',
							channelName: 'AMC',
							classes: 'moon-2h',
							components: [
								{content: '3D'},
								{content: 'Live'},
								{content: 'REC 08:22', classes: 'moon-video-player-info-redicon '}
							]
						},
						{
							kind: VideoInfoHeader,
							title: 'Downton Abbey - Extra Title',
							subTitle: 'Mon June 21, 7:00 - 8:00pm',
							subSubTitle: 'R - TV 14, V, L, SC',
							description: 'The series, set in the Youkshire country estate of Downton Abbey, depicts the lives of the aristocratic Crawley famiry and'
						}
					]},
					{kind: VideoInfoBackground, orient: 'right', background: true, components: [
						{kind: Clock}
					]}
				], components: [
					{kind: IconButton, small: false, classes: 'moon-icon-video-round-controls-style'},
					{kind: IconButton, small: false, classes: 'moon-icon-video-round-controls-style'},
					{kind: IconButton, small: false, classes: 'moon-icon-video-round-controls-style'},
					{kind: IconButton, small: false, classes: 'moon-icon-video-round-controls-style'},
					{kind: IconButton, small: false, classes: 'moon-icon-video-round-controls-style'},
					{kind: IconButton, small: false, classes: 'moon-icon-video-round-controls-style'},
					{kind: IconButton, small: false, classes: 'moon-icon-video-round-controls-style'},
					{kind: IconButton, small: false, classes: 'moon-icon-video-round-controls-style'},
					{kind: IconButton, small: false, classes: 'moon-icon-video-round-controls-style'},
					{kind: IconButton, small: false, classes: 'moon-icon-video-round-controls-style'}
				]},
				{name: 'panels', kind: Panels, pattern: 'activity', classes: 'enyo-fit', useHandle: true, onShowingChanged: 'panelsShowingChanged', components: [
					{title: 'First Panel', classes: 'moon-7h', titleBelow: 'Sub-title', subTitleBelow: 'Sub-sub title', components: [
						{kind: Item, content: 'Item One', ontap: 'next1'},
						{kind: Item, content: 'Item Two', ontap: 'next1'},
						{kind: Item, content: 'Item Three', ontap: 'next1'},
						{kind: Item, content: 'Item Four', ontap: 'next1'},
						{kind: ToggleItem, content: 'Show/Hide Side Handle', checked: true,  onchange: 'handleShowingChanged'}
					]},
					{title: 'Second Panel', classes: 'moon-7h',
						joinToPrev: true, components: [
						{kind: Item, content: 'Item One', ontap: 'next2'},
						{kind: Item, content: 'Item Two', ontap: 'next2'},
						{kind: Item, content: 'Item Three', ontap: 'next2'},
						{kind: Item, content: 'Item Four', ontap: 'next2'},
						{kind: Item, content: 'Item Five', ontap: 'next2'}
					]},
					{title: 'Third Panel', classes: 'moon-7h', titleBelow: 'Sub-title', subTitleBelow: 'Sub-sub title', components: [
						{kind: Item, content: 'Item One', ontap: 'next3'},
						{kind: Item, content: 'Item Two', ontap: 'next3'},
						{kind: Item, content: 'Item Three', ontap: 'next3'},
						{kind: Item, content: 'Item Four', ontap: 'next3'},
						{kind: Item, content: 'Item Five', ontap: 'next3'}
					]},
					{title: 'Fourth', classes: 'moon-7h', joinToPrev: true, titleBelow: 'Sub-title', subTitleBelow: 'Sub-sub title', headerComponents: [
						{kind: Button, content: 'Basic Popup', ontap: 'showPopup', popup: 'basicPopup'},
						{kind: ContextualPopupDecorator,	components:	[
							{content: 'ContextualPopup'},
							{kind: ContextualPopup, classes: 'moon-2h moon-8v', components: [
								{content: 'Item 1'},
								{content: 'Item 2'},
								{content: 'Item 3'}
							]}
						]},
						{kind: ContextualPopupDecorator,	components:	[
							{content: 'ContextualPopup'},
							{kind: ContextualPopup, classes: 'moon-2h moon-8v', components: [
								{content: 'Item 1'},
								{content: 'Item 2'},
								{content: 'Item 3'}
							]}
						]}
					], components: [
						{kind: Item, content: 'Item One', ontap: 'next4'},
						{kind: Item, content: 'Item Two', ontap: 'next4'},
						{kind: Item, content: 'Item Three', ontap: 'next4'},
						{kind: Item, content: 'Item Four', ontap: 'next4'},
						{kind: Item, content: 'Item Five', ontap: 'next4'},
						{name: 'basicPopup', kind: Popup, content: 'Popup...'},
						{name: 'directPopup', kind: Popup, autoDismiss: false, components: [
							{content: 'Direct Popup'},
							{kind: Button, content: 'Hide Direct', ontap: 'hidePopup', popup: 'directPopup', direct: true}
						]}
					]},
					{title: 'Fifth', classes: 'moon-7h', titleBelow: 'Sub-title', subTitleBelow: 'Sub-sub title', components: [
						{kind: Item, content: 'Item One', ontap: 'next5'},
						{kind: Item, content: 'Item Two', ontap: 'next5'},
						{kind: Item, content: 'Item Three', ontap: 'next5'},
						{kind: Item, content: 'Item Four', ontap: 'next5'},
						{kind: Item, content: 'Item Five', ontap: 'next5'}
					]},
					{title: 'Sixth', classes: 'moon-7h', joinToPrev: true, titleBelow: 'Sub-title', subTitleBelow: 'Sub-sub title', headerComponents: [
						//* List actions with default width
						{kind: ListActions, name: 'listActions', icon: 'drawer', proportionalWidth: true, listActions: [
							{action: 'category2', components: [
								{kind: Divider, content: 'Category 2 (DataList)'},
								{kind: DataList, name: 'list', fit: true, components: [
									{kind: CheckboxItem, bindings: [{from: '.model.name', to: '.content'}]}
								]}
							]},
							{action: 'category1', components: [
								{kind: Divider, content: 'Category 1 (DataRepeater)'},
								{kind: 'enyo.DataRepeater', containerOptions: {kind: Scroller, classes: 'enyo-fill'}, name: 'repeater', fit: true, components: [
									{kind: ToggleItem, bindings: [{from: '.model.name', to: '.content'}]}
								]}
							]}
						]}
					], components: [
						{kind: Item, content: 'Item One', ontap: 'next6'},
						{kind: Item, content: 'Item Two', ontap: 'next6'},
						{kind: Item, content: 'Item Three', ontap: 'next6'},
						{kind: Item, content: 'Item Four', ontap: 'next6'},
						{kind: Item, content: 'Item Five', ontap: 'next6'}
					]},
					{title: 'Seventh', classes: 'moon-7h', titleBelow: 'Sub-title', subTitleBelow: 'Sub-sub title', components: [
						{kind: Item, content: 'Item One'},
						{kind: Item, content: 'Item Two'},
						{kind: Item, content: 'Item Three'},
						{kind: Item, content: 'Item Four'},
						{kind: Item, content: 'Item Five'}
					]}
				]}
			]
		}
	],
	create: function () {
		Control.prototype.create.apply(this, arguments);
		this.$.list.set('collection', new Collection([
			{name: 'Red'},
			{name: 'White'},
			{name: 'Blue'},
			{name: 'Black'}
		]));
		this.$.repeater.set('collection', new Collection([
			{name: 'Santa Clara'},
			{name: 'San Francisco'},
			{name: 'Seoul'}
		]));
	},
	rendered: function () {
		Control.prototype.rendered.apply(this, arguments);
		Spotlight.spot(this.$.panels);
	},
	// custom next handler for each panel to avoid switching from one active panel
	// to another with no visible change for demo
	next1: function (sender, event) {
		this.$.panels.setIndex(2);
		return true;
	},
	next2: function (sender, event) {
		this.$.panels.setIndex(2);
		return true;
	},
	next3: function (sender, event) {
		this.$.panels.setIndex(5);
		return true;
	},
	next4: function (sender, event) {
		this.$.panels.setIndex(5);
		return true;
	},
	next5: function (sender, event) {
		this.$.panels.setIndex(7);
		return true;
	},
	next6: function (sender, event) {
		this.$.panels.setIndex(7);
		return true;
	},
	handleShowingChanged: function (sender, event) {
		this.$.panels.setHandleShowing(sender.getChecked());
	},
	panelsShowingChanged: function (sender, event) {
		// Hiding the VideoPlayer when it would be obscured by the Panels avoids UI performance
		// issues caused by the GPU being occupied rendering video frames that aren't visible.
		this.$.player.set('showing', !event.showing);
	},
	showPopup: function (sender) {
		var p = this.$[sender.popup];
		if (p) {
			if(sender.direct) {
				p.showDirect();
			} else {
				p.show();
			}
		}
	},
	close: function () {
		if (this.$.partialDrawer.getOpen()) {
			this.$.partialDrawer.setOpen(false);
		} else {
			this.$.partialDrawer.setControlsOpen(false);
		}
	}
});
