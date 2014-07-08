/**
	_moon.DrawerHandle_ is a control designed for use with
	[moon.Drawer](#moon.Drawer) and [moon.Drawers](#moon.Drawers). It provides a
	stylized label that may be used to activate a corresponding drawer.

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
	kind: "moon.Item",
	//* @protected
	classes: "moon-drawers-handle"
});