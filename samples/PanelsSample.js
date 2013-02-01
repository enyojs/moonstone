enyo.kind({
	name: "moon.sample.PanelsSample",
	classes: "moonraker-panels-sample enyo-unselectable",
	components: [
		{kind: "enyo.Spotlight"},
		{name: "panels", kind: "moon.Panels", classes: "moonraker-panels-sample-panels", arrangerKind: "CarouselArranger", components: [
			{name: "panel1", components: [
				{tag:"h1", content:"Panel 1"},
				{name:"button1", kind:"Button", spotlight: true, content:"Button 1", ontap: "buttonTapped"},
				{name:"button2", kind:"Button", spotlight: true, content:"Next", ontap: "goNext"},
				{name:"button3", kind:"Button", spotlight: true, content:"Go next and spot button 6", ontap: "spotButtonSix"},
				{name:"setIndexButton", kind:"Button", spotlight: true, content: "Go to panel 5", ontap: "setIndexToFour"}
			]},
			{name: "panel2", components: [
				{tag:"h1", content:"Panel 2"},
				{name:"button4", kind:"Button", spotlight: true, content:"Button 4", ontap: "buttonTapped"},
				{content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit."},
				{name:"button5", kind:"Button", spotlight: true, content:"Previous", ontap: "goPrev"},
				{name:"button6", kind:"Button", spotlight: true, content: "Button 6", ontap: "buttonTapped"}
			]},
			{name: "panel3", components: [
				{tag:"h1", content:"Panel 3"},
				{content:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."},
				{name:"button7", kind:"Button", spotlight: true, content:"Button 7", ontap: "buttonTapped"}
			]},
			{name: "panel4", components: [
				{tag:"h1", content:"Panel 4"},
				{content:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."}
			]},
			{name: "panel5", components: [
				{tag:"h1", content:"Panel 5"},
				{content:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."},
				{name:"button8", kind:"Button", spotlight: true, content:"Button 8", ontap: "buttonTapped"}
			]},
			{name: "panel6", components: [
				{tag:"h1", content:"Panel 6"},
				{content:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."}
			]}
		]},
		{name: "output", classes: "moon-panels-sample-output"}
	],
	buttonTapped: function(inSender, inEvent) {
		this.$.output.setContent(inSender.getContent()+" tapped.");
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
	setIndexToFour: function(inSender, inEvent) {
		this.buttonTapped(inSender, inEvent);
		this.$.panels.setIndex(4);
	}
});