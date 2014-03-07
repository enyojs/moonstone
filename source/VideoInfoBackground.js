/**
	_moon.VideoInfoBackground_ is a control that provides a stylized background
	for components placed in the _infoComponents_ block of a
	[moon.VideoPlayer](#moon.VideoPlayer).  It is designed as a decorator,
	wrapping components placed inside with the stylized background.

	Use the _orient_ property to set the orientation ("left" or "right").

	For more details, see [moon.VideoPlayer](#moon.VideoPlayer).
*/
enyo.kind({
	name: "moon.VideoInfoBackground",
	kind: "FittableColumns",
	//* @protected
	classes: "moon-background-wrapper",
	//* @public
	published: {
		//* Orientation of the control; valid values are "left" and "right"
		orient: "left",
		/**
			If true, background color is set to black; otherwise, background is
			transparent
		*/
		background: true
	},
	//* @protected
	components: [
		{name: "client", classes: "moon-background-wrapper-client-content", components: [
			{classes: "moon-background-wrapper-client-tri-frame", components: [
				{classes: "moon-background-wrapper-client-tri"}
			]}
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
		// this.addRemoveClass("right", this.orient != 'left');
		// this.addRemoveClass("left", this.orient == 'left');
	},
	backgroundChanged: function() {
		this.$.client.addRemoveClass("bg", this.background);
	}
});
