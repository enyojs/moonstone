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
				{name: "marqueeContainer1", mixins: ["moon.MarqueeSupport"], marqueeOnRender: true, components: [
					{name: "marqueeContent2", mixins: ["moon.MarqueeItem"], classes: "moon-marquee-start-on-render", content: "This is long text for marquee content change test for syncronized case"},
					{name: "marqueeContent3", mixins: ["moon.MarqueeItem"], classes: "moon-marquee-start-on-render", content: "This is short text for marquee"}
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
				{tag: "br"}

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
		this.$.marqueeContainer1.startMarquee();
	},
	stop: function(inSender, inEvent) {
		this.$.marqueeContent1.stopMarquee();
		this.$.marqueeContainer1.stopMarquee();	
	}
});