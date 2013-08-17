/**
	_moon.BackgroundWrapper_ is a control that align. 
	It is designed to be used within the _infoComponents_ block of a
	<a href="#moon.VideoPlayer">moon.VideoPlayer</a>.

	Example:

		{
			kind: "moon.ChennelInfo",
			no: 36,
			name: "AMC",
			components: [
				{content: "3D"},
				{content: "Live"},					
				{content: "REC 08:22", classes: "moon-video-player-info-redicon"}
			]
		}
*/
enyo.kind({
	name: "moon.BackgroundWrapper",
	kind: "enyo.Control",
	classes: "moon-background-wrapper",
	published: {
		orient: "left",
		background: true
	},
	handlers: {
		onresize: "resizeHandler"
	},
	initComponents: function() {
		if (this.$.decorate) { this.$.decorate.destroy(); }
		if (this.orient === 'left') {
			this.createComponents([{name: "client", classes: "moon-background-wrapper-client"},{name: "decorate", classes: "moon-background-wrapper-left"}]);
			this.$.client.addRemoveClass("right", false);
			this.$.client.addRemoveClass("left", true);
		} else {
			this.createComponents([{name: "decorate", classes: "moon-background-wrapper-right"}, {name: "client", classes: "moon-background-wrapper-client"}]);
			this.$.client.addRemoveClass("right", true);
			this.$.client.addRemoveClass("left", false);
		}
		
		this.$.client.addRemoveClass("bg", this.background);
		this.$.decorate.addRemoveClass("bg", this.background);
		
		this.inherited(arguments);
	},
	resizeHandler: function() {
		this.inherited(arguments);
		var height = this.getBounds().height;
		if (this.$.client && this.$.decorate && height) {
			this.$.client.applyStyle("height", height + "px");
			if (this.orient === 'left') {
				this.$.decorate.applyStyle("border-bottom-width", height + "px");
				this.$.decorate.applyStyle("border-left-width", height/4 + "px");
			} else {
				this.$.decorate.applyStyle("border-top-width", height + "px");
				this.$.decorate.applyStyle("border-right-width", height/4 + "px");
			}
		}
	}
});
