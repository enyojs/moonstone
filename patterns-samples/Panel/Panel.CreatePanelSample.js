enyo.kind({
	name: "myPanel",
	kind: "moon.Panel",
	handlers: {
		onPanelsPostTransitionFinished: "initSpot"
	},
	headerComponents:[
        {kind: "moon.IconButton", src: "../assets/icon-list.png"},
        {kind: "moon.IconButton", src: "../assets/icon-list.png"},
		{kind: "moon.ListActions", autoCollapse:true, iconSrc:"../assets/icon-list.png", listActions: [
			{
				action: "category",						
				components: [
				    {kind: "moon.Divider", content:"Category"},
				    {kind: "moon.Scroller", components: [
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
				    {kind: "moon.Scroller", horizontal: "hidden", components: [
				        {content:"Action", kind:"moon.ToggleItem"},
				        {content:"Comedy", kind:"moon.ToggleItem"},
				        {content:"Drama", kind:"moon.ToggleItem"}
				    ]}
				],						
			}		
		]}
	],
	components:[
		{name: "firstItem", kind: "moon.Item", content: "Item One", ontap: "next"},
		{kind: "moon.Item", content: "Item Two", ontap: "next"},
		{kind: "moon.Item", content: "Item Three", ontap: "next"},
		{kind: "moon.Item", content: "Item Four", ontap: "next"},
		{kind: "moon.Item", content: "Item Five", ontap: "next"}
	],
	initSpot: function(inSender, inEvent) {
		if(inEvent.active === inEvent.index) {
			enyo.Spotlight.spot(enyo.Spotlight.getFirstChild(this.$.panelBody));
		}
	}
});

enyo.kind({
    name: "moon.sample.panel.CreatePanelSample",
    classes: "moon enyo-fit enyo-unselectable",
    components: [
        {kind: "enyo.Spotlight"},
        {name: "panels", kind: "moon.Panels", pattern: "alwaysviewing", classes: "enyo-fit",
        	/* 5:9 layout. */ 
			onPanelTransitionFinish: 'onPanelsTransit',
			components: [
            {title: "First", classes:'moon-5h',
            	components: [
				{kind: "moon.Item", content: "Item One", ontap: "next"},
				{kind: "moon.Item", content: "Item Two", ontap: "next"},
				{kind: "moon.Item", content: "Item Three", ontap: "next"},
				{kind: "moon.Item", content: "Item Four", ontap: "next"},
				{kind: "moon.Item", content: "Item Five", ontap: "next"}
			]}
        ]},
    ],

    next: function(inSender, inEvent) {
    	// Example of Current panel drives next panel.
    	// The better way is using static panels and change content only based on item selection.
		if(this.$.panels.getPanelIndex(inSender) == this.$.panels.getIndex()) {
			this.$.panels.replacePanel(this.$.panels.getIndex()+1, {
				kind: 'myPanel',
				title: inSender.getContent()
			});
			this.$.panels.next();
		}
    	return true;
    }
});