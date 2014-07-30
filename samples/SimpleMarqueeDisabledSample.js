enyo.kind({
	name: "moon.sample.SimpleMarqueeDisabledSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "moon.Scroller", classes: "enyo-fill moon-7h", components: [
			{kind: "moon.Divider", content: "Simple Marquee Disabled Sample"},
			{components: [
				{name: "ditem", kind: "moon.Item", content: "Item 3 (Disabled) with really long marqueed text", disabled:true, style: "margin-bottom: 100px;", wrapInsteadOfMarquee: true},
				{name: "button", kind: "moon.Button", content: "Toggle Wrap", contentUpperCase : false, ontap: "buttonTapped"}
			]}
		]}
	],
	buttonTapped: function(inSender, inEvent) {
		enyo.log(this.$.ditem);
		this.$.ditem.set( "wrapInsteadOfMarquee", !this.$.ditem.wrapInsteadOfMarquee);
	}
});