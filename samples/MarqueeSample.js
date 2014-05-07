enyo.kind({
	name: "moon.sample.MarqueeSample",
	kind:"FittableRows",
	classes: "moon enyo-unselectable enyo-fit moon-marquee-sample",
	components: [
		{kind: 'moon.Scroller', fit: true, components: [
			{classes: "moon-marquee-sample-wrapper", components: [

				{kind: "moon.Divider", content: "Marquee on start:"},
				{kind: "moon.MarqueeDecorator", marqueeOnRender: true, components: [
					{name: "marqueeStartOnRender1", kind: "moon.MarqueeText", classes: "moon-marquee-start-on-render", content: "This is first long text for marquee test which is starting marquee on page render"},
					{name: "marqueeStartOnRender2", kind: "moon.MarqueeText", classes: "moon-marquee-start-on-render", content: "This is second long text for marquee test which is syncronized with first marquee text"}
				]},
				{name: "marqueeStartOnRender3", marqueeOnRender: true, mixins: ["moon.MarqueeSupport", "moon.MarqueeItem"], classes: "moon-marquee-start-on-render", content: "This is third long text for marquee test which is not syncronized with first and second marquee text"},
				{tag: "br"},

				{kind: "moon.Divider", content: "Marquee on focus:"},
				{kind: "moon.MarqueeDecorator", marqueeOnSpotlight: true, components: [
					{name: "marqueeStartOnFocus1", kind: "moon.MarqueeText", spotlight: true, classes: "moon-marquee-start-on-focus", content: "This is first long text for marquee test which is starting marquee on focus"},
					{name: "marqueeStartOnFocus2", kind: "moon.MarqueeText", spotlight: true, classes: "moon-marquee-start-on-focus", content: "This is second long text for marquee test which is syncronized with first marquee text"}
				]},
				{name: "marqueeStartOnFocus3", marqueeOnSpotlight: true, mixins: ["moon.MarqueeSupport", "moon.MarqueeItem"], spotlight: true, classes: "moon-marquee-start-on-focus", content: "This is third long text for marquee test which is not syncronized with first and second marquee text"},
				{tag: "br"},

				{kind: "moon.Divider", content: "Marquee on content changed:"},
				{kind: "moon.InputDecorator", components: [
					{kind: "moon.Input", placeholder: "JUST TYPE", oninput:"contentChange"}

				]},
				{kind: "moon.Button", content: "Start marquee", ontap:"start"},
				{kind: "moon.Button", content: "Stop marquee", ontap:"stop"},	
				{name: "marqueeContent1", marqueeOnRender: true, mixins: ["moon.MarqueeSupport", "moon.MarqueeItem"], classes: "moon-marquee-start-on-render", content: "This is long text for marquee content change test for separate marquee case"},
				{name: "marqueeContent2", marqueeOnRender: true, mixins: ["moon.MarqueeSupport", "moon.MarqueeItem"], classes: "moon-marquee-start-on-render", centered: true, content: "Centered text for separate marquee case"},
				{name: "marqueeContainer1", mixins: ["moon.MarqueeSupport"], marqueeOnRender: true, components: [
					{name: "marqueeContent3", mixins: ["moon.MarqueeItem"], classes: "moon-marquee-start-on-render", content: "This is long text for marquee content change test for syncronized case"},
					{name: "marqueeContent4", mixins: ["moon.MarqueeItem"], classes: "moon-marquee-start-on-render", content: "This is short text for marquee"},
					{name: "marqueeContent5", mixins: ["moon.MarqueeItem"], classes: "moon-marquee-start-on-render", centered: true, content: "This is centered text for marquee"}
				]},
				{tag: "br"},

				{kind: "moon.Divider", content: "Marquee speed:"},
				{name: "marqueeSpeed", marqueeOnRender: true, marqueeSpeed: 180, mixins: ["moon.MarqueeSupport", "moon.MarqueeItem"], classes: "moon-marquee-start-on-render", content: "This is long text for fast marquee speed test which is twice faster then normal marquee"},
				{tag: "br"},

				{kind: "moon.Divider", content: "Marquee pause:"},
				{name: "marqueePause1", marqueeOnRender: true, mixins: ["moon.MarqueeSupport", "moon.MarqueeItem"], classes: "moon-marquee-start-on-render", content: "This is long text for marquee which has 1000ms pause time"},
				{name: "marqueePause2", marqueeOnRender: true, marqueePause: 2000, mixins: ["moon.MarqueeSupport", "moon.MarqueeItem"], classes: "moon-marquee-start-on-render", content: "This is long text for marquee which has 2000ms pause time"},
				{tag: "br"},

				{kind: "moon.Divider", content: "Disabled marquee:"},
				{name: "marqueeDisabled", marqueeOnRender: true, disabled: true, mixins: ["moon.MarqueeSupport", "moon.MarqueeItem"], classes: "moon-marquee-start-on-render", content: "This is long text for disabled marquee test which is having disabled property"},
				{tag: "br"},

				{kind: "moon.Divider", content: "LTR Languages:"},
				{mixins: ["moon.MarqueeSupport"], marqueeOnRender: true, components: [
					{marqueeOnRender: true, mixins: ["moon.MarqueeItem"], classes: "moon-marquee-start-on-render", content: "The quick brown fox jumped over the lazy dog.  The bean bird flies at sundown."},
					{marqueeOnRender: true, mixins: ["moon.MarqueeItem"], classes: "moon-marquee-start-on-render", content: "Η γρήγορη καφέ αλεπού πήδηξε πάνω από το μεσημέρι. Το πουλί πετά σε φασολιών δύση του ηλίου."},
					{marqueeOnRender: true, mixins: ["moon.MarqueeItem"], classes: "moon-marquee-start-on-render", content: "ਤੁਰੰਤ ਭੂਰਾ Fox ਆਲਸੀ ਕੁੱਤੇ ਨੂੰ ਵੱਧ ਗਈ. ਬੀਨ ਪੰਛੀ ਸੂਰਜ ਡੁੱਬਣ 'ਤੇ ਉਡਾਣ ਭਰਦੀ ਹੈ."},
					{marqueeOnRender: true, mixins: ["moon.MarqueeItem"], classes: "moon-marquee-start-on-render", content: "速い茶色のキツネは、怠け者の犬を飛び越えた。豆の鳥は日没で飛ぶ。"},
					{marqueeOnRender: true, mixins: ["moon.MarqueeItem"], classes: "moon-marquee-start-on-render", content: "那只敏捷的棕色狐狸跃过那只懒狗。豆鸟飞日落。"},
					{marqueeOnRender: true, mixins: ["moon.MarqueeItem"], classes: "moon-marquee-start-on-render", content: "빠른 갈색 여우가 게으른 개를 뛰어 넘었다.콩 조류 일몰에 파리."}
				]},
				{tag: "br"},

				{kind: "moon.Divider", content: "RTL Languages:"},
				{mixins: ["moon.MarqueeSupport"], marqueeOnRender: true, components: [
					{marqueeOnRender: true, mixins: ["moon.MarqueeItem"], classes: "moon-marquee-start-on-render", content: "שועל החום הזריז קפץ מעל הכלב העצלן.ציפור עפה השעועית עם שקיעה."},
					{marqueeOnRender: true, mixins: ["moon.MarqueeItem"], classes: "moon-marquee-start-on-render", content: "قفز الثعلب البني السريع فوق الكلب الكسول. الطيور تطير في الفول عند غروب الشمس."},
					{marqueeOnRender: true, mixins: ["moon.MarqueeItem"], classes: "moon-marquee-start-on-render", content: "فوری بھوری لومڑی سست کتے پر چھلانگ لگا. بین پرندوں سوریاست میں پرواز."}
				]}
			]}
		]}
	],
	contentChange: function(inSender, inEvent) {
		this.$.marqueeContent1.setContent(inSender.getValue());
		this.$.marqueeContent2.setContent(inSender.getValue());
		this.$.marqueeContent3.setContent(inSender.getValue());
	},
	start: function(inSender, inEvent) {
		this.$.marqueeContent1.startMarquee();
		this.$.marqueeContent2.startMarquee();
		this.$.marqueeContainer1.startMarquee();
	},
	stop: function(inSender, inEvent) {
		this.$.marqueeContent1.stopMarquee();
		this.$.marqueeContent2.stopMarquee();
		this.$.marqueeContainer1.stopMarquee();	
	}
});