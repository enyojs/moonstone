enyo.kind({
	name: "moon.sample.SimpleMarqueeDisabledSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{classes:"moon-6h", components: [
			{
				components: [
					{name: "disabledButton", kind: "moon.Button", disabled: true, content: "Disabled Button with long text to marquee with", ontap: "buttonTapped"},
				]
			}
		]}
	]
});