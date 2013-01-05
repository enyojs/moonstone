enyo.kind({
	name: "moon.sample.PanelsSample",
	fit: true,
	components: [
		{kind: "enyo.Spotlight"},
		{name:"test", spotlight:true, kind:"Button", content:"Test button", style:"margin:40px 0px;"},
		{name: "panels", kind: "moon.Panels", classes: "moonraker-panels-sample", components: [
			{name: "panel1", components: [
				{tag:"h1", content:"Panel 1"},
				{name:"button1", kind:"Button", spotlight: true, content:"Button 1", ontap: "buttonTapped"},
				{name:"button2", kind:"Button", spotlight: true, content:"Next", ontap: "goNext"}
			]},
			{name: "panel2", components: [
				{tag:"h1", content:"Panel 2"},
				{name:"button3", kind:"Button", spotlight: true, content:"Button 3", ontap: "buttonTapped"},
				{content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit."},
				{name:"button4", kind:"Button", spotlight: true, content:"Previous", ontap: "goPrev"}
			]},
			{components: [
				{tag:"h1", content:"Panel 3"},
				{content:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."}
			]},
			{components: [
				{tag:"h1", content:"Panel 4"},
				{content:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."}
			]}
		]}
	],
	buttonTapped: function(inSender, inEvent) {
		enyo.log(inSender.getContent()+" tapped.");
	},
	goNext: function() {
		this.$.panels.next();
	},
	goPrev: function() {
		this.$.panels.previous();
	}
});