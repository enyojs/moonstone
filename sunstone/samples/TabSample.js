enyo.kind({
	name: "sun.sample.TabSample",
	kind: "FittableRows",	
	classes: "sun moon enyo-unselectable enyo-fit ",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "sun.Scroller", fit:true, components: [			
			{kind: "sun.Divider", content: "Label Only"},
			{kind: "sun.TabBar",  tabItemComponents: [
				{kind: "sun.TabItem", content: "view1"},
				{kind: "sun.TabItem", content: "view2"},
				{kind: "sun.TabItem", content: "view3"},
				{kind: "sun.TabItem", content: "view4"}				
			]},
			
			{kind: "sun.Divider", content: "Label with icon", style: "margin-top: 100px;"},
			{kind: "sun.TabBar", tabItemComponents: [
				{kind: "sun.TabItem", content: "view1", src: "./assets/1080x1920/css3-icon.png"},
				{kind: "sun.TabItem", content: "view2", src: "./assets/1080x1920/enyo-icon.png"},
				{kind: "sun.TabItem", content: "view3", src: "./assets/1080x1920/html5-icon.png"},
				{kind: "sun.TabItem", content: "view4", src: "./assets/1080x1920/css3-icon.png"}
			]},
			
			{kind: "sun.Divider", content: "Long label", style: "margin-top: 100px;"},
			{kind: "sun.TabBar", tabItemComponents: [
				{kind: "sun.TabItem", content: "Somebody To Love"},
				{kind: "sun.TabItem", content: "We Will Rock You VonLichten"},
				{kind: "sun.TabItem", content: "Hungarian Rhapsody"},
				{kind: "sun.TabItem", content: "Who Wants To Live Forever"}
			]}
		]}		
	],	
});
