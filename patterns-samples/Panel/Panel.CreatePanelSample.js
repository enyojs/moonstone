enyo.kind({
	name: "myPanel",
	kind: "moon.Panel",
	defaultSpotlightControl: "second",
	headerComponents:[
		{kind: "moon.IconButton", src: "../assets/icon-list.png"},
		{kind: "moon.IconButton", src: "../assets/icon-list.png"},
		{kind: "moon.ListActions", autoCollapse:true, iconSrc:"../assets/icon-list.png", listActions: [
			{
				action: "category",
				components: [
					{kind: "moon.Divider", content:"Category"},
					{kind: "moon.Scroller", fit:true, components: [
						{content:"Action", kind:"moon.CheckboxItem", checked:true},
						{content:"Comedy", kind:"moon.CheckboxItem"},
						{content:"Drama", kind:"moon.CheckboxItem"},
						{content:"Action", kind:"moon.CheckboxItem"},
						{content:"Comedy", kind:"moon.CheckboxItem"},
						{content:"Drama", kind:"moon.CheckboxItem"},
						{content:"Action", kind:"moon.CheckboxItem"},
						{content:"Comedy", kind:"moon.CheckboxItem"},
						{content:"Drama", kind:"moon.CheckboxItem"},
						{content:"Action", kind:"moon.CheckboxItem"},
						{content:"Comedy", kind:"moon.CheckboxItem"}
					]}
				]
			},
			{
				components: [
					{kind: "moon.Divider", content:"Category"},
					{kind: "moon.Scroller", fit:true, horizontal: "hidden", components: [
						{content:"Action", kind:"moon.ToggleItem"},
						{content:"Comedy", kind:"moon.ToggleItem"},
						{content:"Drama", kind:"moon.ToggleItem"}
					]}
				]
			}
		]}
	],
	components:[
		{kind: "moon.Item", content: "Item One"},
		{name: "second", kind: "moon.Item", content: "Item Two"},
		{kind: "moon.Item", content: "Item Three"},
		{kind: "moon.Item", content: "Item Four"},
		{kind: "moon.Item", content: "Item Five"}
	]
});

enyo.kind({
	name: "moon.sample.panel.CreatePanelSample",
	classes: "moon enyo-fit enyo-unselectable",
	components: [
		{name: "panels", kind: "moon.Panels", pattern: "alwaysviewing", classes: "enyo-fit",
			components: [
			{title: "First", classes:'moon-5h',
				components: [
				{kind: "moon.Item", content: "Item One", ontap: "next"},
				{kind: "moon.Item", content: "Item Two", ontap: "next"},
				{kind: "moon.Item", content: "Item Three", ontap: "next"},
				{kind: "moon.Item", content: "Item Four", ontap: "next"},
				{kind: "moon.Item", content: "Item Five", ontap: "next"}
			]}
		]}
	],

	next: function(inSender, inEvent) {
		// Example of Current panel drives next panel.
		// The better way is using static panels and change content only based on item selection.
		if (!this.$.panels.inTransition() && this.$.panels.getPanelIndex(inSender) == this.$.panels.getIndex()) {
			this.$.panels.replacePanel(1, {kind: 'myPanel', title: inSender.getContent()});
			this.$.panels.next();
		}
		return true;
	}
});