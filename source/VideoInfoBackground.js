/**
	_moon.VideoInfoBackground is a control that provides a stylized background for components placed in 
	the _infoComponents_ block of a <a href="#moon.VideoPlayer">moon.VideoPlayer</a>.  It is designed as
	a decorator, such that it wraps components placed inside with the stylized background.

	Use the _orient_ property to set the orientation ("left" or "right").  
	See <a href="#moon.VideoPlayer">moon.VideoPlayer</a> for more details.
*/
enyo.kind({
	name: "moon.VideoInfoBackground",
	kind: "enyo.Control",
	classes: "moon-background-wrapper",
	published: {
		//* _orient_ sets orientation to Video InfoComponents in the background (ex. left, right).
		orient: "left",
		//* _background_ If true, it gives background color as black, otherwise will be transparent.
		background: true
	},
	components: [
		{name: "client", classes: "moon-background-wrapper-client-content", components: [
			{classes: "moon-background-wrapper-client-tri"}
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
