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
	mixins: ["moon.MarqueeSupport"],
	spotlight:true,
	components: [
		{name:"handleContent", kind: "moon.MarqueeText", clipInsidePadding: true, classes: "moon-drawer-handle-text"}
	],
	create: function() {
		this.inherited(arguments);
	},
	contentChanged: function() {
		this.$.handleContent.setContent(this.getContent());
	}
});