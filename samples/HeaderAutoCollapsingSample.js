enyo.kind({
	name: "moon.sample.HeaderAutoCollapsingSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "moon.Panels", classes:"enyo-fit", pattern: "activity", components: [
			{kind: "moon.Panel", classes:"moon-6h", collapsingHeader:true, title:"Scroll Me", titleBelow:"To test the auto-collapsing", subTitleBelow:"Feature of moon.Panel", headerComponents: [
				{kind: "moon.IconButton", icon: "check"},
				{kind: "moon.IconButton", icon: "arrowlargeright"}
			], components: [
				{kind:"moon.Scroller", fit:true, components: [
					{kind:"enyo.Repeater", count:50, onSetupItem:"setupItem", components: [
						{kind:"moon.Item", ontap:"next"}
					]}
				]}
			]},
			{kind: "moon.Panel", classes:"moon-6h", joinToPrev:true, collapsingHeader:true, title:"Me too", titleBelow:"Another header", subTitleBelow:"That collapses on scroll", headerComponents: [
				{kind: "moon.IconButton", icon: "check"},
				{kind: "moon.IconButton", icon: "arrowlargeright"}
			], components: [
				{kind:"moon.Scroller", fit:true, components: [
					{kind:"enyo.Repeater", count:50, onSetupItem:"setupItem", components: [
						{kind:"moon.Item", ontap:"next"}
					]}
				]}
			]},
			{kind: "moon.Panel", classes:"moon-6h", collapsingHeader:true, title:"Yet another", headerComponents: [
				{kind: "moon.IconButton", icon: "check"},
				{kind: "moon.IconButton", icon: "arrowlargeright"}
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
	next: function(inSender) {
		this.$.panels.setIndex(this.$.panels.getPanelIndex(inSender)+1);
	}
});