var
	kind = require('enyo/kind');

var
	FittableRows = require('layout/FittableRows');

var
	Button = require('moonstone/Button'),
	Header = require('moonstone/Header'),
	Scroller = require('moonstone/Scroller'),
	ToggleButton = require('moonstone/ToggleButton');

module.exports = kind({
	name: 'moon.sample.HeaderSample',
	kind: FittableRows,
	classes: 'moon enyo-unselectable enyo-fit moon-header-sample',
	components: [
		{kind: Scroller, fit:true, components: [
			{kind: Header, name: 'largeHeader', content: 'Large Header', titleAbove: '02', titleBelow: 'Sub Header', subTitleBelow: 'Sub-sub Header', components: [
				{kind: Button, small: true, content: 'Description', ontap: 'describeLarge'},
				{kind: Button, small: true, content: 'How to use', ontap: 'howToUseLarge'}
			]},
			{classes: 'moon-1v'},
			{kind: Header, name: 'mediumHeader', content: 'Medium Header', type: 'medium', titleAbove: '03', titleBelow: 'Sub Header', subTitleBelow: '', components: [
				{kind: Button, small: true, content: 'Description', ontap: 'describeMedium'},
				{kind: Button, small: true, content: 'How to use', ontap: 'howToUseMedium'}
			]},
			{classes: 'moon-1v'},
			{kind: Header, name: 'smallHeader', content: 'Small Header', type: 'small', titleAbove: '04', subTitle: 'Sub Title', titleBelow: 'Sub Header', subTitleBelow: 'Sub-sub Header', components: [
				{kind: Button, content: 'Description', ontap: 'describeSmall'},
				{kind: Button, small: true, content: 'How to use', ontap: 'howToUseSmall'},
				{kind: Button, small: true, content: 'RTL content', ontap: 'rtlSmall'}
			]},
			{classes: 'moon-1v'},
			{kind: Header, content: 'Varied Alignment', titleAbove: '02', titleBelow: 'Panel actions can be positioned on left or right', components: [
				{kind: Button, small:true, content: 'Left', classes: 'moon-header-left'},
				{kind: Button, small:true, content: 'aligned', classes: 'moon-header-left'},
				{kind: Button, small:true, content: 'Right'},
				{kind: Button, small:true, content: 'Aligned'}
			]},
			{classes: 'moon-1v'},
			{kind: Header, name: 'switchHeader', content: 'Static Title', placeholder: 'Type Here', titleAbove: '03', titleBelow: 'Header title can be changed to an input', subTitleBelow: 'Press \'Switch Mode\' button, which sets `inputMode:true`.', components: [
				{kind: Button, small:true, content: 'Switch Mode', ontap: 'switchMode', header: 'switchHeader'}
			]},
			{kind: Header, name: 'inputHeaderDismiss', inputMode: true, dismissOnEnter: true, content: 'Input-style Header', placeholder: 'Dismiss on Enter', titleAbove: '03', titleBelow: 'InputHeader blurs-focus when pressing Enter.', subTitleBelow: '', onchange: 'handleChange'},
			{classes: 'moon-1v'},
			{kind: Header, name: 'imageHeader', content: 'Header with Image', subTitle: 'Sub title can be seen only in small header. And can flow with title when marquee starts.', titleAbove: '02', titleBelow: 'Sub Header', subTitleBelow: 'Sub-sub Header', fullBleedBackground: false, backgroundSrc: 'http://lorempixel.com/g/1920/360/abstract/2/', components: [
				{kind: ToggleButton, small: true, toggleOnLabel: 'Full Bleed: true', toggleOffLabel: 'Full Bleed: false', ontap: 'handleToggle', classes: 'moon-header-left'},
				{kind: Button, small: true, content: 'large', ontap: 'resizeImageHeader'},
				{kind: Button, small: true, content: 'medium', ontap: 'resizeImageHeader'},
				{kind: Button, small: true, content: 'small', ontap: 'resizeImageHeader'}
			]},
			{classes: 'moon-1v'},
			{kind: Header, name: 'marqueeHeader', content: 'Header   헤더    ヘッダ    ylätunniste    כותרת    رأس    Kopfzeile  ẫ Ẫ گ Ů <span style=\'text-transform:none\'>j p q g</span>', allowHtml:true, titleAbove: '02', titleBelow: 'Header   헤더    ヘッダ    ylätunniste    כותרת    رأس    Kopfzeile  ẫ Ẫ گ Ů <span style=\'text-transform:none\'>j p q g</span> Header   헤더    ヘッダ    ylätunniste    כותרת    رأس    Kopfzeile  ẫ Ẫ گ Ů <span style=\'text-transform:none\'>j p q g</span>   Header   헤더    ヘッダ    ylätunniste    כותרת    رأس    Kopfzeile  ẫ Ẫ گ Ů <span style=\'text-transform:none\'>j p q g</span>   Header   헤더    ヘッダ    ylätunniste    כותרת    رأس    Kopfzeile  ẫ Ẫ گ Ů <span style=\'text-transform:none\'>j p q g</span>', subTitleBelow: 'Titles will truncate/marquee', components: [
				{kind: Button, small:true, content: 'Switch Mode', ontap: 'switchMode', header: 'marqueeHeader'}
			]},
			{classes: 'moon-1v'},
			{kind: Header, name: 'marqueeHeaderSmall', small:true, content: 'Header   헤더    ヘッダ    ylätunniste    כותרת    رأس    Kopfzeile  ẫ Ẫ گ Ů <span style=\'text-transform:none\'>j p q g</span>', allowHtml:true, titleAbove: '02', titleBelow: 'Header   헤더    ヘッダ    ylätunniste    כותרת    رأس    Kopfzeile  ẫ Ẫ گ Ů <span style=\'text-transform:none\'>j p q g</span> Header   헤더    ヘッダ    ylätunniste    כותרת    رأس    Kopfzeile  ẫ Ẫ گ Ů <span style=\'text-transform:none\'>j p q g</span>   Header   헤더    ヘッダ    ylätunniste    כותרת    رأس    Kopfzeile  ẫ Ẫ گ Ů <span style=\'text-transform:none\'>j p q g</span>   Header   헤더    ヘッダ    ylätunniste    כותרת    رأس    Kopfzeile  ẫ Ẫ گ Ů <span style=\'text-transform:none\'>j p q g</span>', subTitleBelow: 'Titles will truncate/marquee', components: [
				{kind: Button, small:true, content: 'Switch Mode', ontap: 'switchMode', header: 'marqueeHeaderSmall'}
			]}
		]}
	],
	describeLarge: function (sender, event) {
		this.$.largeHeader.setTitleBelow('This is the default header.');
	},
	howToUseLarge: function (sender, event) {
		this.$.largeHeader.setSubTitleBelow('Large (default) header will be used if you don\'t specify the `type` property.');
	},
	describeMedium: function (sender, event) {
		this.$.mediumHeader.setTitleBelow('Medium header flattens the button area and the titleBelow areas together for a more compact header.');
	},
	howToUseMedium: function (sender, event) {
		this.$.mediumHeader.setSubTitleBelow('Set `type` property to \'medium\' to use the medium header and long very subTitleBelow.');
	},
	describeSmall: function (sender, event) {
		this.$.smallHeader.setTitle('Small header flattens the buttons down to the title area, uses a smaller title font, and has no `titleBelow`.');
	},
	howToUseSmall: function (sender, event) {
		this.$.smallHeader.setTitle('Set `type` property to \'small\' to use the small header.');
	},
	rtlSmall: function (sender, event) {
		this.$.smallHeader.set('title', 'כותרת Small Header');
		this.$.smallHeader.set('titleBelow', 'כתוביות למטה');
	},
	handleToggle: function (sender, event) {
		this.$.imageHeader.setFullBleedBackground(sender.value);
	},
	resizeImageHeader: function (sender, event) {
		this.$.imageHeader.setType(sender.content);
	},
	switchMode: function (sender, event) {
		var header = this.$[sender.header];
		header.setInputMode(!header.getInputMode());
	},
	handleChange: function (sender, event) {
		this.$.inputHeaderDismiss.set('subTitleBelow', 'Changed: ' + sender.getValue());
	}
});