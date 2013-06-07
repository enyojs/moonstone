/**
	_moon.DrawerHandle_ is meant to be used with <a href="#moon.Drawer">moon.Drawer</a> and
	<a href="#moon.Drawers">moon.Drawers</a>. It provides a stylized label which when used with
	the mentioned controls will activate a corresponding drawer.

	It includes a marquee property which will marquee the content of the handle when set to true.

	{name:"musicDrawer", kind: "moon.Drawer",
		handle: {kind:"moon.DrawerHandle", content:"Handle"},
		components: [
			{content:"Drawer Content"}
		],
		controlDrawerComponents: [
			{content:"Controls"}
		]}
	}
*/
enyo.kind({
	name: "moon.DrawerHandle",
	kind:"enyo.Control",
	classes: "moon-drawer-handle",
	spotlight:true,
	published: {
		marquee: false
	},
	components: [
		{name:"handleContent", tag: "p", classes: "moon-drawer-handle-text moon-drawer-handle-text"}
	],
	create: function() {
		this.inherited(arguments);
		this.marqueeChanged();
	},
	contentChanged: function() {
		this.$.handleContent.setContent(this.getContent())
	},
	marqueeChanged: function() {
		this.$.handleContent.addRemoveClass("marquee",this.marquee);
	}
});