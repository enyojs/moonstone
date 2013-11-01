/**
	_moon.VideoInfoBackground is a control that provides a stylized background for
	components placed in the _infoComponents_ block of a
	[moon.VideoPlayer](#moon.VideoPlayer).  It is designed as a decorator,
	wrapping components placed inside with the stylized background.

	Use the _orient_ property to set the orientation ("left" or "right").  
	See <a href="#moon.VideoPlayer">moon.VideoPlayer</a> for more details.
*/
enyo.kind({
	name: "moon.VideoInfoBackground",
	kind: "enyo.Control",
	classes: "moon-background-wrapper",
	published: {
		//* Orientation of the control; valid values are "left" and "right"
		orient: "left",
		/**
			If true, background color is set to black; otherwise, background is
			transparent
		*/
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
