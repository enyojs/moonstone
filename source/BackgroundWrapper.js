/**
	_moon.BackgroundWrapper_ is a control that align. 
	It is designed to be used within the _infoComponents_ block of a
	<a href="#moon.VideoPlayer">moon.VideoPlayer</a>.
*/
enyo.kind({
	name: "moon.BackgroundWrapper",
	kind: "enyo.Control",
	classes: "moon-background-wrapper",
	published: {
		orient: "left",
		background: true
	},
	components: [
		{name: "client", classes: "moon-background-wrapper-client-content", components: [
			{classes: "moon-background-wrapper-client-tri", chrome: true}
		]}
	],
	initComponents: function() {
		this.inherited(arguments);
		this.orientChanged();
		this.backgroundChanged();
	},
	orientChanged: function() {
		this.$.client.addRemoveClass("right", this.orient != 'left');
		this.$.client.addRemoveClass("left", this.orient == 'left');
	},
	backgroundChanged: function() {
		this.$.client.addRemoveClass("bg", this.background);
	}
});
