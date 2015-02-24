var
	kind = require('enyo/kind');

var
	FittableRows = require('layout/FittableRows');

var
	Button = require('moonstone/Button'),
	Divider = require('moonstone/Divider'),
	Input = require('moonstone/Input'),
	InputDecorator = require('moonstone/InputDecorator'),
	Marquee = require('moonstone/Marquee'),
	MarqueeDecorator = Marquee.Decorator,
	MarqueeItem = Marquee.Item,
	MarqueeSupport = Marquee.Support,
	MarqueeText = Marquee.Text,
	Scroller = require('moonstone/Scroller');

module.exports = kind({
	name: 'moon.sample.MarqueeSample',
	kind: FittableRows,
	classes: 'moon enyo-unselectable enyo-fit moon-marquee-sample',
	components: [
		{kind: Scroller, fit: true, components: [
			{classes: 'moon-marquee-sample-wrapper', components: [

				{kind: Divider, content: 'Marquee on start:'},
				{kind: MarqueeDecorator, marqueeOnRender: true, components: [
					{name: 'marqueeStartOnRender1', kind: MarqueeText, classes: 'moon-marquee-start-on-render', content: 'This is first long text for marquee test which is starting marquee on page render'},
					{name: 'marqueeStartOnRender2', kind: MarqueeText, classes: 'moon-marquee-start-on-render', content: 'This is second long text for marquee test which is syncronized with first marquee text'}
				]},
				{name: 'marqueeStartOnRender3', marqueeOnRender: true, mixins: [MarqueeSupport, MarqueeItem], classes: 'moon-marquee-start-on-render', content: 'This is third long text for marquee test which is not syncronized with first and second marquee text'},
				{tag: 'br'},

				{kind: Divider, content: 'Marquee on focus:'},
				{kind: MarqueeDecorator, marqueeOnSpotlight: true, components: [
					{name: 'marqueeStartOnFocus1', kind: MarqueeText, spotlight: true, classes: 'moon-marquee-start-on-focus', content: 'This is first long text for marquee test which is starting marquee on focus'},
					{name: 'marqueeStartOnFocus2', kind: MarqueeText, spotlight: true, classes: 'moon-marquee-start-on-focus', content: 'This is second long text for marquee test which is syncronized with first marquee text'}
				]},
				{name: 'marqueeStartOnFocus3', marqueeOnSpotlight: true, mixins: [MarqueeSupport, MarqueeItem], spotlight: true, classes: 'moon-marquee-start-on-focus', content: 'This is third long text for marquee test which is not syncronized with first and second marquee text'},
				{tag: 'br'},

				{kind: Divider, content: 'Marquee on Hover:'},
				{kind: MarqueeDecorator, marqueeOnHover: true, marqueeOnSpotlight: false, components: [
					{name: 'marqueeStartOnHover1', kind: MarqueeText, classes: 'moon-marquee-start-on-hover', content: 'This is first long text for marquee test which is starting marquee on mouse hover'},
					{name: 'marqueeStartOnHover2', kind: MarqueeText, classes: 'moon-marquee-start-on-hover', content: 'This is second long text for marquee test which is syncronized with first marquee text'}
				]},
				{name: 'marqueeStartOnHover3', marqueeOnHover: true, marqueeOnSpotlight: false, mixins: [MarqueeSupport, MarqueeItem], classes: 'moon-marquee-start-on-hover', content: 'This is third long text for marquee test which is not syncronized with first and second marquee text'},
				{tag: 'br'},


				{kind: Divider, content: 'Marquee on content changed:'},
				{kind: InputDecorator, components: [
					{kind: Input, placeholder: 'JUST TYPE', oninput: 'contentChange'}

				]},
				{kind: Button, content: 'Start marquee', ontap: 'start'},
				{kind: Button, content: 'Stop marquee', ontap: 'stop'},	
				{name: 'marqueeContent1', marqueeOnRender: true, mixins: [MarqueeSupport, MarqueeItem], classes: 'moon-marquee-start-on-render', content: 'This is long text for marquee content change test for separate marquee case'},
				{name: 'marqueeContent2', marqueeOnRender: true, mixins: [MarqueeSupport, MarqueeItem], classes: 'moon-marquee-start-on-render', centered: true, content: 'Centered text for separate marquee case'},
				{name: 'marqueeContainer1', mixins: [MarqueeSupport], marqueeOnRender: true, components: [
					{name: 'marqueeContent3', mixins: [MarqueeItem], classes: 'moon-marquee-start-on-render', content: 'This is long text for marquee content change test for syncronized case'},
					{name: 'marqueeContent4', mixins: [MarqueeItem], classes: 'moon-marquee-start-on-render', content: 'This is short text for marquee'},
					{name: 'marqueeContent5', mixins: [MarqueeItem], classes: 'moon-marquee-start-on-render', centered: true, content: 'This is centered text for marquee'}
				]},
				{tag: 'br'},

				{kind: Divider, content: 'Marquee speed:'},
				{name: 'marqueeSpeed', marqueeOnRender: true, marqueeSpeed: 180, mixins: [MarqueeSupport, MarqueeItem], classes: 'moon-marquee-start-on-render', content: 'This is long text for fast marquee speed test which is twice faster then normal marquee'},
				{tag: 'br'},

				{kind: Divider, content: 'Marquee pause:'},
				{name: 'marqueePause1', marqueeOnRender: true, mixins: [MarqueeSupport, MarqueeItem], classes: 'moon-marquee-start-on-render', content: 'This is long text for marquee which has 1000ms pause time'},
				{name: 'marqueePause2', marqueeOnRender: true, marqueePause: 2000, mixins: [MarqueeSupport, MarqueeItem], classes: 'moon-marquee-start-on-render', content: 'This is long text for marquee which has 2000ms pause time'},
				{tag: 'br'},

				{kind: Divider, content: 'Disabled marquee:'},
				{name: 'marqueeDisabled', marqueeOnRender: true, disabled: true, mixins: [MarqueeSupport, MarqueeItem], classes: 'moon-marquee-start-on-render', content: 'This is long text for disabled marquee test which is having disabled property'},
				{tag: 'br'},

				{kind: Divider, content: 'Disabled Wrap Instead Of Marquee:'},
				{name: 'marqueeDisabledWrap', wrapInsteadOfMarquee: true, disabled: true, mixins: [MarqueeSupport, MarqueeItem], classes: 'moon-marquee-start-on-render', content: 'This is long text for disabled text which wraps because wrapInsteadOfMarquee is set to true'},
				{tag: 'br'},

				{kind: Divider, content: 'LTR Languages:'},
				{mixins: [MarqueeSupport], marqueeOnRender: true, components: [
					{marqueeOnRender: true, mixins: [MarqueeItem], classes: 'moon-marquee-start-on-render', content: 'The quick brown fox jumped over the lazy dog.  The bean bird flies at sundown.'},
					{marqueeOnRender: true, mixins: [MarqueeItem], classes: 'moon-marquee-start-on-render', content: 'Η γρήγορη καφέ αλεπού πήδηξε πάνω από το μεσημέρι. Το πουλί πετά σε φασολιών δύση του ηλίου.'},
					{marqueeOnRender: true, mixins: [MarqueeItem], classes: 'moon-marquee-start-on-render', content: 'ਤੁਰੰਤ ਭੂਰਾ Fox ਆਲਸੀ ਕੁੱਤੇ ਨੂੰ ਵੱਧ ਗਈ. ਬੀਨ ਪੰਛੀ ਸੂਰਜ ਡੁੱਬਣ \'ਤੇ ਉਡਾਣ ਭਰਦੀ ਹੈ.'},
					{marqueeOnRender: true, mixins: [MarqueeItem], classes: 'moon-marquee-start-on-render', content: '速い茶色のキツネは、怠け者の犬を飛び越えた。豆の鳥は日没で飛ぶ。'},
					{marqueeOnRender: true, mixins: [MarqueeItem], classes: 'moon-marquee-start-on-render', content: '那只敏捷的棕色狐狸跃过那只懒狗。豆鸟飞日落。'},
					{marqueeOnRender: true, mixins: [MarqueeItem], classes: 'moon-marquee-start-on-render', content: '빠른 갈색 여우가 게으른 개를 뛰어 넘었다.콩 조류 일몰에 파리.'}
				]},
				{tag: 'br'},

				{kind: Divider, content: 'RTL Languages:'},
				{mixins: [MarqueeSupport], marqueeOnRender: true, components: [
					{marqueeOnRender: true, mixins: [MarqueeItem], classes: 'moon-marquee-start-on-render', content: 'שועל החום הזריז קפץ מעל הכלב העצלן.ציפור עפה השעועית עם שקיעה.'},
					{marqueeOnRender: true, mixins: [MarqueeItem], classes: 'moon-marquee-start-on-render', content: 'قفز الثعلب البني السريع فوق الكلب الكسول. الطيور تطير في الفول عند غروب الشمس.'},
					{marqueeOnRender: true, mixins: [MarqueeItem], classes: 'moon-marquee-start-on-render', content: 'فوری بھوری لومڑی سست کتے پر چھلانگ لگا. بین پرندوں سوریاست میں پرواز.'}
				]}
			]}
		]}
	],
	contentChange: function (sender, event) {
		this.$.marqueeContent1.setContent(sender.getValue());
		this.$.marqueeContent2.setContent(sender.getValue());
		this.$.marqueeContent3.setContent(sender.getValue());
	},
	start: function (sender, event) {
		this.$.marqueeContent1.startMarquee();
		this.$.marqueeContent2.startMarquee();
		this.$.marqueeContainer1.startMarquee();
	},
	stop: function (sender, event) {
		this.$.marqueeContent1.stopMarquee();
		this.$.marqueeContent2.stopMarquee();
		this.$.marqueeContainer1.stopMarquee();	
	}
});