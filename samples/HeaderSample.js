enyo.kind({
	name: 'moon.sample.HeaderSample',
	kind: 'FittableRows',
	classes: 'moon enyo-unselectable enyo-fit moon-header-sample',
	components: [
		{kind: 'moon.Scroller', fit:true, components: [
			{kind: 'moon.Header', name: 'largeHeader', content: 'Large Header', titleAbove: '02', titleBelow: 'Sub Header', subTitleBelow: 'Sub-sub Header', components: [
				{kind: 'moon.Button', small: true, content: 'Description', ontap: 'describeLarge'},
				{kind: 'moon.Button', small: true, content: 'How to use', ontap: 'howToUseLarge'}
			]},
			{classes: 'moon-1v'},
			{kind: 'moon.Header', name: 'mediumHeader', content: 'Medium Header', type: 'medium', titleAbove: '03', titleBelow: 'Sub Header', subTitleBelow: '', components: [
				{kind: 'moon.Button', small: true, content: 'Description', ontap: 'describeMedium'},
				{kind: 'moon.Button', small: true, content: 'How to use', ontap: 'howToUseMedium'}
			]},
			{classes: 'moon-1v'},
			{kind: 'moon.Header', name: 'rtlMediumHeader', content: 'رأس المتوسطة', type: 'medium', titleAbove: '04', titleBelow: 'هذا هو العنوان الفرعي جدا جدا طويلة جدا طالما أنها سوف سرادق وأنه لا ينبغي أن تتداخل مع عنصر رأس', subTitleBelow: 'هذا هو جدا جدا جدا طويلة لقب آخر الباطن طالما أنها سوف سرادق وأنه لا ينبغي أن تتداخل مع العنصر رأس وأنا أستخدم يقم هامش لوضع نفسي', components: [
				{kind: 'moon.Button', small: true, content: 'Description', ontap: 'describeRtlMedium'},
				{kind: 'moon.Button', small: true, content: 'How to use', ontap: 'howToUseRtlMedium'}
			]},
			{classes: 'moon-1v'},
			{kind: 'moon.Header', name: 'smallHeader', content: 'LTR Small Header add it very very long very long', type: 'small', titleAbove: '05', subTitle: "LTR Sub Title", titleBelow: 'This is a very long subtitle', subTitleBelow: 'Sub-sub Header', components: [
				{kind: 'moon.Button', content: 'Description', ontap: 'describeSmall'},
				{kind: 'moon.Button', small: true, content: 'How to use', ontap: 'howToUseSmall'}
			]},
			{classes: 'moon-1v'},
			{kind: 'moon.Header', name: 'rtlSmallHeader', content: 'رأس صغير', type: 'small', titleAbove: '04', subTitle: "العنوان الفرعي", titleBelow: 'مرحبا اسمي بروك.', subTitleBelow: 'الباطن رأس', components: [
				{kind: 'moon.Button', content: 'Description', ontap: 'describeRtlSmall'},
				{kind: 'moon.Button', small: true, content: 'How to use', ontap: 'howToUseRtlSmall'}
			]},
			{classes: 'moon-1v'},
			{kind: 'moon.Header', content: 'Varied Alignment', titleAbove: '02', titleBelow: 'Panel actions can be positioned on left or right', components: [
				{kind: 'moon.Button', small:true, content: 'Left', classes: 'moon-header-left'},
				{kind: 'moon.Button', small:true, content: 'aligned', classes: 'moon-header-left'},
				{kind: 'moon.Button', small:true, content: 'Right'},
				{kind: 'moon.Button', small:true, content: 'Aligned'}
			]},
			{classes: 'moon-1v'},
			{kind: 'moon.Header', name: 'switchHeader', content: 'Static Title', placeholder: 'Type Here', titleAbove: '03', titleBelow: 'Header title can be changed to an input', subTitleBelow: 'Press "Switch Mode" button, which sets `inputMode:true`.', components: [
				{kind: 'moon.Button', small:true, content: 'Switch Mode', ontap: 'switchMode', header: 'switchHeader'}
			]},
			{kind: 'moon.Header', name: 'inputHeaderDismiss', inputMode: true, dismissOnEnter: true, content: 'Input-style Header', placeholder: 'Dismiss on Enter', titleAbove: '03', titleBelow: 'InputHeader blurs-focus when pressing Enter.', subTitleBelow: '', onchange: 'handleChange'},
			{classes: 'moon-1v'},
			{kind: 'moon.Header', name: 'imageHeader', content: 'Header with Image', subTitle: "Sub title can be seen only in small header. And can flow with title when marquee starts.", titleAbove: '02', titleBelow: 'Sub Header', subTitleBelow: 'Sub-sub Header', fullBleedBackground: false, backgroundSrc: 'http://lorempixel.com/g/1920/360/abstract/2/', components: [
				{kind: 'moon.ToggleButton', small: true, toggleOnLabel: 'Full Bleed: true', toggleOffLabel: 'Full Bleed: false', ontap: 'handleToggle', classes: 'moon-header-left'},
				{kind: 'moon.Button', small: true, content: 'large', ontap: 'resizeImageHeader'},
				{kind: 'moon.Button', small: true, content: 'medium', ontap: 'resizeImageHeader'},
				{kind: 'moon.Button', small: true, content: 'small', ontap: 'resizeImageHeader'}
			]},
			{classes: 'moon-1v'},
			{kind: 'moon.Header', name: 'marqueeHeader', content: 'Header   헤더    ヘッダ    ylätunniste    כותרת    رأس    Kopfzeile  ẫ Ẫ گ Ů <span style="text-transform:none">j p q g</span>', allowHtml:true, titleAbove: '02', titleBelow: 'Header   헤더    ヘッダ    ylätunniste    כותרת    رأس    Kopfzeile  ẫ Ẫ گ Ů <span style="text-transform:none">j p q g</span> Header   헤더    ヘッダ    ylätunniste    כותרת    رأس    Kopfzeile  ẫ Ẫ گ Ů <span style="text-transform:none">j p q g</span>   Header   헤더    ヘッダ    ylätunniste    כותרת    رأس    Kopfzeile  ẫ Ẫ گ Ů <span style="text-transform:none">j p q g</span>   Header   헤더    ヘッダ    ylätunniste    כותרת    رأس    Kopfzeile  ẫ Ẫ گ Ů <span style="text-transform:none">j p q g</span>', subTitleBelow: 'Titles will truncate/marquee', components: [
				{kind: 'moon.Button', small:true, content: 'Switch Mode', ontap: 'switchMode', header: 'marqueeHeader'}
			]},
			{classes: 'moon-1v'},
			{kind: 'moon.Header', name: 'marqueeHeaderSmall', small:true, content: 'Header   헤더    ヘッダ    ylätunniste    כותרת    رأس    Kopfzeile  ẫ Ẫ گ Ů <span style="text-transform:none">j p q g</span>', allowHtml:true, titleAbove: '02', titleBelow: 'Header   헤더    ヘッダ    ylätunniste    כותרת    رأس    Kopfzeile  ẫ Ẫ گ Ů <span style="text-transform:none">j p q g</span> Header   헤더    ヘッダ    ylätunniste    כותרת    رأس    Kopfzeile  ẫ Ẫ گ Ů <span style="text-transform:none">j p q g</span>   Header   헤더    ヘッダ    ylätunniste    כותרת    رأس    Kopfzeile  ẫ Ẫ گ Ů <span style="text-transform:none">j p q g</span>   Header   헤더    ヘッダ    ylätunniste    כותרת    رأس    Kopfzeile  ẫ Ẫ گ Ů <span style="text-transform:none">j p q g</span>', subTitleBelow: 'Titles will truncate/marquee', components: [
				{kind: 'moon.Button', small:true, content: 'Switch Mode', ontap: 'switchMode', header: 'marqueeHeaderSmall'}
			]}
		]}
	],
	describeLarge: function(inSender, inEvent) {
		this.$.largeHeader.setTitleBelow('This is the default header.');
	},
	howToUseLarge: function(inSender, inEvent) {
		this.$.largeHeader.setSubTitleBelow('Large (default) header will be used if you don\'t specify the `type` property.');
	},
	describeMedium: function(inSender, inEvent) {
		this.$.mediumHeader.setTitleBelow('Medium header flattens the button area and the titleBelow areas together for a more compact header.');
	},
	describeRtlMedium: function(inSender, inEvent) {
		this.$.rtlMediumHeader.setTitleBelow('Add class enyo-locale-right-to-left on body the RTL Medium Header will look correct!');
	},
	howToUseRtlMedium: function(inSender, inEvent) {
		this.$.rtlMediumHeader.setSubTitleBelow('titleBelow and subTitleBelow are warpped in marquee, its direction is taken care of in marquee.js and control.js');
	},
	describeSmall: function(inSender, inEvent) {
		this.$.smallHeader.setTitle('Small header flattens the buttons down to the title area, uses a smaller title font, and has no `titleBelow`.');
	},
	describeRtlSmall: function(inSender, inEvent) {
		this.$.rtlSmallHeader.setTitle('رأس صغير يسطح الأزرار وصولا الى منطقة العنوان، يستخدم خط لقب أصغر، وليس لديه لقب تحت ارتفاع رأس صغير أقل بكثير من متوسط ​​رأس ورأس كبير');
	},
	howToUseSmall: function(inSender, inEvent) {
		this.$.smallHeader.setTitle('Set `type` property to "small" to use the small header.');
	},
	howToUseRtlSmall: function(inSender, inEvent) {
		this.$.rtlSmallHeader.setTitle('تعيين الخاصية نوع للمشاريع الصغيرة لاستخدام رأس صغير.');
	},
	handleToggle: function(inSender, inEvent) {
		this.$.imageHeader.setFullBleedBackground(inSender.value);
	},
	resizeImageHeader: function(inSender, inEvent) {
		this.$.imageHeader.setType(inSender.content);
	},
	switchMode: function(inSender, inEvent) {
		var header = this.$[inSender.header];
		header.setInputMode(!header.getInputMode());
	},
	handleChange: function(inSender, inEvent) {
		this.$.inputHeaderDismiss.set('subTitleBelow', 'Changed: ' + inSender.getValue());
	}
});
