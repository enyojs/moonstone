/**
    _moon.DrawerHandle_ is a control designed for use with
    <a href="#moon.Drawer">moon.Drawer</a> and <a href="#moon.Drawers">moon.Drawers</a>.
    It provides a stylized label that may be used in combination with the
    aforementioned controls to activate a corresponding drawer.

    It includes a _marquee_ property, which will highlight the handle's content
    if set to true.

        {
            name: "musicDrawer",
            kind: "moon.Drawer",
            handle: {kind: "moon.DrawerHandle", content: "Handle"},
            components: [
                {content: "Drawer Content"}
            ],
            controlDrawerComponents: [
                {content: "Controls"}
            ]
        }
*/
enyo.kind({
	name: "moon.DrawerHandle",
	kind:"enyo.Control",
	classes: "moon-drawer-handle",
	spotlight:true,
	published: {
		//* If true, the handle's content is highlighted
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
		this.$.handleContent.setContent(this.getContent());
	},
	marqueeChanged: function() {
		this.$.handleContent.addRemoveClass("marquee",this.marquee);
	}
});