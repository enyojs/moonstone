enyo.kind({
	name: 'moon.sample.ScrollerHorizontalSample',
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "moon.Divider", content: "Horizontal Scroller"},
		{kind: 'moon.Scroller', vertical: "hidden", spotlight: "container", style:"white-space: nowrap;", components: [
			{kind: "enyo.Repeater", count:"50", components: [
				{kind: "moon.Item", classes:"moon-scroller-sample-item enyo", style:"display:inline-block;", components: [
					{kind: "moon.ImageMultiRez", src:"$lib/moonstone/images/enyo-icon.png"}
				]}
			]}
		]}
	]
});
