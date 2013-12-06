enyo.kind({
	name: "myListPanel",
	kind: "moon.Panel",
	titleBelow: "DataList below has artifically long render delay",
	subTitleBelow: "It should become focused after rendering",
	defaultSpotlightControl: "dataList",
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
		{kind: "moon.DataList", name:"dataList", renderDelay:2000, fit:true, components: [
			{kind:"moon.Item", bindings: [
				{from:".model.text", to:".content"}
			]}
		]}
	],
	create: function() {
		this.inherited(arguments);
		var r = [];
		for (var i=0; i<100; i++) {
			r.push({text: "Item " + i});
		}
		this.$.dataList.set("collection", new enyo.Collection(r));
	}
});

enyo.kind({
	name: "myGridPanel",
	kind: "myListPanel",
	componentOverrides: {
		dataList: {kind:"moon.DataGridList"}
	}
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
			var kind = (inSender.indexInContainer() % 2) === 0 ? "myListPanel" : "myGridPanel";
			this.$.panels.replacePanel(1, {kind: kind, title: inSender.getContent()});
			this.$.panels.next();
		}
		return true;
	}
});