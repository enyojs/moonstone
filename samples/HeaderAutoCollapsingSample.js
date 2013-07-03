enyo.kind({
	name: "moon.sample.HeaderAutoCollapsingSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.Panels", classes:"enyo-fit", pattern: "Activity", components: [
			{kind: "moon.Panel", collapsingHeader:true, title:"Scroll Me", titleBelow:"To test the auto-collapsing", subTitleBelow:"Feature of moon.Panel", headerComponents: [
				{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-like.png"},
				{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-next.png"}
			], components: [
				{kind:"moon.Scroller", fit:true, components: [
					{kind:"enyo.Repeater", count:50, onSetupItem:"setupItem", components: [
						{kind:"moon.Item"}
					]}
				]}
			]},
			{kind: "moon.Panel", joinToPrev:true, collapsingHeader:true, title:"Me too", titleBelow:"Another header", subTitleBelow:"That collapses on scroll", headerComponents: [
				{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-like.png"},
				{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-next.png"}
			], components: [
				{kind:"moon.Scroller", fit:true, components: [
					{kind:"enyo.Repeater", count:50, onSetupItem:"setupItem", components: [
						{kind:"moon.Item"}
					]}
				]}
			]},
			{kind: "moon.Panel", collapsingHeader:true, title:"Yet another", headerComponents: [
				{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-like.png"},
				{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-next.png"}
			], components: [
				{kind:"moon.Scroller", fit:true, components: [
					{kind:"enyo.Repeater", count:50, onSetupItem:"setupItem", components: [
						{kind:"moon.Item", ontap:"next"}
					]}
				]}
			]}
		]}
	],
	setupItem: function(inSender, inEvent) {
		inEvent.item.$.item.setContent("Scrolling content " + inEvent.index);
	},
	next: function() {
		this.$.panels.next();
	}
});