enyo.kind({
	name: "moon.sample.PanelsSample",
	fit: true,
	components: [
		{kind: "enyo.Spotlight"},
		{name:"test", spotlight:true, kind:"Button", content:"Test button", style:"margin:40px 2px;"},
		{name: "panels", kind: "moon.Panels", classes: "moonraker-panels-sample", arrangerKind: "CarouselArranger", components: [
			{name: "panel1", components: [
				{tag:"h1", content:"Panel 1"},
				{name:"button1", kind:"Button", spotlight: true, content:"Button 1", ontap: "buttonTapped"},
				{name:"button2", kind:"Button", spotlight: true, content:"Next", ontap: "goNext"},
				{name:"button3", kind:"Button", spotlight: true, content:"Go next and spot button 6", ontap: "spotButtonSix"},
				{name:"setIndexButton", kind:"Button", spotlight: true, content: "SetIndex() to 3", ontap: "setIndexToThree"}
			]},
			{name: "panel2", components: [
				{tag:"h1", content:"Panel 2"},
				{name:"button4", kind:"Button", spotlight: true, content:"Button 4", ontap: "buttonTapped"},
				{content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit."},
				{name:"button5", kind:"Button", spotlight: true, content:"Previous", ontap: "goPrev"},
				{name:"button6", kind:"Button", spotlight: true, content: "Button 6"}
			]},
			{name: "panel3", components: [
				{tag:"h1", content:"Panel 3"},
				{content:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."},
				{name:"button7", kind:"Button", spotlight: true, content:"Button 7"}
			]},
			{name: "panel4", components: [
				{tag:"h1", content:"Panel 4"},
				{content:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."}
			]},
			{name: "panel5", components: [
				{tag:"h1", content:"Panel 5"},
				{content:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."},
				{name:"button8", kind:"Button", spotlight: true, content:"Button 8"}
			]},
			{name: "panel6", components: [
				{tag:"h1", content:"Panel 6"},
				{content:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."}
			]}
		]},
		{name:"test2", spotlight:true, kind:"Button", content:"Test button 2", style:"margin:40px 2px;"},
		
		{name: "logContainer", style: "position:absolute;right:40px;top:40px;width:600px;", components: [
			{content: "Current spotlighted item:", style: "font-size:14px;"},
			{name: "currentSpot", style: "font-size:18px;border:1px solid #444;"},
			{content: "Current panel index:", style: "font-size:14px;margin-top:20px;"},
			{name: "panelIndex", style: "font-size:18px;border:1px solid #444;"},
			{content: "_lastFocused :", style: "font-size:14px;margin-top:20px;"},
			{name: "lastFocused", style: "font-size:18px;border:1px solid #444;"},
			{name: "delete2Button", kind:"Button", spotlight: true, content: "Delete Panel 2", ontap: "delete2"},
			{name: "createPanelButton", kind:"Button", spotlight: true, content: "Create New Panel", ontap: "createComponent"}
		]}
	],
	create: function() {
		this.inherited(arguments);
		setInterval(enyo.bind(this,this.updateLogs), 300);
	},
	updateLogs: function() {
		this.$.currentSpot.setContent(enyo.Spotlight.getCurrent().name);
		this.$.panelIndex.setContent(this.$.panels.getIndex());
		
		var panels = this.$.panels.getPanels();
		var lfStr = "[ ";
		for(var i=0;i<panels.length;i++) {
			if(i > 0) {
				lfStr += ", ";
			}
			if(panels[i]._lastFocused) {
				lfStr += i+": "+panels[i]._lastFocused.name;
			}
		}
		lfStr += " ]";
		this.$.lastFocused.setContent(lfStr);
	},
	
	buttonTapped: function(inSender, inEvent) {
		enyo.log(inSender.getContent()+" tapped.");
	},
	goNext: function(inSender, inEvent) {
		this.buttonTapped(inSender, inEvent);
		this.$.panels.next();
	},
	goPrev: function(inSender, inEvent) {
		this.buttonTapped(inSender, inEvent);
		this.$.panels.previous();
	},
	spotButtonSix: function(inSender, inEvent) {
		this.buttonTapped(inSender, inEvent);
		this.$.panels.next(this.$.button6);
	},
	setIndexToThree: function(inSender, inEvent) {
		this.$.panels.setIndex(3);
	},
	delete2: function(inSender, inEvent) {
		this.$.panels.getPanels()[1].destroy();
		this.$.panels.render();
	},
	createComponent: function(inSender, inEvent) {
		var p = this.$.panels.createComponent({tag: "h1", content: "I created this panel!"});
		p.render();
		this.$.panels.reflow();
	}
});