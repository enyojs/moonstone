enyo.kind({
	name: "moon.sample.ActivityPanelsSample",
	classes: "moon enyo-fit enyo-unselectable",
	components: [
		{name: "panels", kind: "moon.Panels", pattern: "activity", classes: "enyo-fit", style: "z-index: 1000;", components: [
			{title: "First Panel", classes: "moon-7h", titleBelow:"Sub-title", subTitleBelow:"Sub-sub title", components: [
				{kind: "moon.Scroller", fit:true, components: [
					{kind: "moon.Item", content: "Item One", ontap: "next1"},
					{kind: "moon.Item", content: "Item Two", ontap: "next1"},
					{kind: "moon.Item", content: "Item Three", ontap: "next1"},
					{kind: "moon.Item", content: "Item Four", ontap: "next1"},
					{kind: "moon.Item", content: "Item Five", ontap: "next1"},
					{kind: "moon.Item", content: "Item Six", ontap: "next1"},
					{kind: "moon.Item", content: "Item Seven", ontap: "next1"},
					{kind: "moon.Item", content: "Item Eight", ontap: "next1"},
					{kind: "moon.Item", content: "Item Nine", ontap: "next1"},
					{kind: "moon.Item", content: "Item Ten", ontap: "next1"}
				]}
			]},
			{title: "Second Panel", defaultSpotlightControl: "defaultControl", classes: "moon-7h", joinToPrev: true, components: [
				{kind: "moon.Item", content: "Item One", ontap: "next2"},
				{kind: "moon.Item", content: "Item Two", ontap: "next2"},
				{name: "defaultControl", kind: "moon.Item", content: "Item Three (default focus for panel)", ontap: "next2"},
				{kind: "moon.Item", content: "Item Four", ontap: "next2"},
				{kind: "moon.Item", content: "Item Five", ontap: "next2"}
			]},
			{title: "Third Panel", classes: "moon-7h", titleBelow:"Type 'go' to transition", headerOptions: {inputMode:true}, onInputHeaderChange:"inputChanged", subTitleBelow:"Sub-sub title", components: [
				{kind: "moon.Item", content: "Item One", ontap: "next3"},
				{kind: "moon.Item", content: "Item Two", ontap: "next3"},
				{kind: "moon.Item", content: "Item Three", ontap: "next3"},
				{kind: "moon.Item", content: "Item Four", ontap: "next3"},
				{kind: "moon.Item", content: "Item Five", ontap: "next3"}
			]},
			{title: "Fourth", classes: "moon-7h", joinToPrev: true, titleBelow:"Sub-title", subTitleBelow:"Sub-sub title", components: [
				{kind: "moon.Item", content: "Item One", ontap: "next4"},
				{kind: "moon.Item", content: "Item Two", ontap: "next4"},
				{kind: "moon.Item", content: "Item Three", ontap: "next4"},
				{kind: "moon.Item", content: "Item Four", ontap: "next4"},
				{kind: "moon.Item", content: "Item Five", ontap: "next4"}
			]},
			{title: "Fifth", classes: "moon-7h", titleBelow:"Sub-title", subTitleBelow:"Sub-sub title", components: [
				{kind: "moon.Item", content: "Item One", ontap: "next5"},
				{kind: "moon.Item", content: "Item Two", ontap: "next5"},
				{kind: "moon.Item", content: "Item Three", ontap: "next5"},
				{kind: "moon.Item", content: "Item Four", ontap: "next5"},
				{kind: "moon.Item", content: "Item Five", ontap: "next5"}
			]},
			{title: "Sixth Panel with a very long title", classes: "moon-7h", joinToPrev: true, titleBelow:"Sub-title", subTitleBelow:"Sub-sub title", components: [
				{kind: "moon.Item", content: "Item One", ontap: "next6"},
				{kind: "moon.Item", content: "Item Two", ontap: "next6"},
				{kind: "moon.Item", content: "Item Three", ontap: "next6"},
				{kind: "moon.Item", content: "Item Four", ontap: "next6"},
				{kind: "moon.Item", content: "Item Five", ontap: "next6"}
			]},
			{title: "Seventh", classes: "moon-7h", titleBelow:"Sub-title", subTitleBelow:"Sub-sub title", components: [
				{kind: "moon.Item", content: "Item One"},
				{kind: "moon.Item", content: "Item Two"},
				{kind: "moon.Item", content: "Item Three"},
				{kind: "moon.Item", content: "Item Four"},
				{kind: "moon.Item", content: "Item Five"}
			]}
		]}
	],
	// custom next handler for each panel to avoid switching from one active panel
	// to another with no visible change for demo
	next1: function(inSender, inEvent) {
		this.$.panels.setIndex(2);
		return true;
	},
	next2: function(inSender, inEvent) {
		this.$.panels.setIndex(2);
		return true;
	},
	next3: function(inSender, inEvent) {
		this.$.panels.setIndex(5);
		return true;
	},
	next4: function(inSender, inEvent) {
		this.$.panels.setIndex(5);
		return true;
	},
	next5: function(inSender, inEvent) {
		this.$.panels.setIndex(7);
		return true;
	},
	next6: function(inSender, inEvent) {
		this.$.panels.setIndex(7);
		return true;
	},
	inputChanged: function(inSender, inEvent) {
		if (inEvent.originator.getValue() == "go") {
			this.next3();
		}
	}
});
