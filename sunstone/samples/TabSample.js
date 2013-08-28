enyo.kind({
	name: "sun.sample.TabSample",
	kind: "FittableRows",	
	classes: "sun moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "sun.Scroller", fit:true, components: [			
			{name: "shortLabel", kind: "sun.Divider", content: "Short Label - none"},
			{name: "tabbar1", kind: "sun.TabBar", onActivate: "activate", tabItemComponents: [
				{kind: "sun.TabItem", content: "tab1"},
				{kind: "sun.TabItem", content: "tab2"},
				{kind: "sun.TabItem", content: "tab3"},
				{kind: "sun.TabItem", content: "tab4"}				
			]},
			
			{name: "withIconLabel", kind: "sun.Divider", content: "Label with icon - none",
			style: "margin-top: 100px;"},
			{name: "tabbar2", kind: "sun.TabBar", onActivate: "activate", tabItemComponents: [
				{kind: "sun.TabItem", content: "icon1", src: "./assets/1080x1920/css3-icon.png"},
				{kind: "sun.TabItem", content: "icon2", src: "./assets/1080x1920/enyo-icon.png"},
				{kind: "sun.TabItem", content: "icon3", src: "./assets/1080x1920/html5-icon.png"},
				{kind: "sun.TabItem", content: "icon4", src: "./assets/1080x1920/css3-icon.png"}
			]},
			
			{name: "longLabel", kind: "sun.Divider", content: "Long label - none", style: "margin-top: 100px;"},
			{name: "tabbar3", kind: "sun.TabBar", onActivate: "activate", tabItemComponents: [
				{kind: "sun.TabItem", content: "Somebody To Love"},
				{kind: "sun.TabItem", content: "We Will Rock You VonLichten"},
				{kind: "sun.TabItem", content: "Hungarian Rhapsody"},
				{kind: "sun.TabItem", content: "Who Wants To Live Forever"}
			]}
		]}		
	],
	activate: function(inSender, inEvnet) {	
		if(inSender.name === "tabbar1") {
			this.$.shortLabel.setContent("Short Label - " + inSender.controls[1].active.content);
		}
		else if(inSender.name === "tabbar2") {
			this.$.withIconLabel.setContent("Label with icon - " + inSender.controls[1].active.content);
		}
		else if(inSender.name === "tabbar3") {
			this.$.longLabel.setContent("Long Label - " + inSender.controls[1].active.content);
		}		
		inSender.changeActiveItem(inSender.controls[1].active.index, true);
	}
});
