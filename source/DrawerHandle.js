/**
    _moon.DrawerHandle_ is a control designed for use with
    [moon.Drawer](#moon.Drawer) and [moon.Drawers](#moon.Drawers). It provides a
    stylized label that may be used to activate a corresponding drawer.

    _moon.DrawerHandle_ includes a _marquee_ property, which, if set to true,
    will apply a marquee animation to the handle's content.

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
		{name:"handleContent", kind: "moon.MarqueeText", classes: "moon-sub-header-text moon-drawer-handle-text"}
	],
	create: function() {
		this.inherited(arguments);
	},
	contentChanged: function() {
		this.$.handleContent.setContent(this.getContent());
	}
});