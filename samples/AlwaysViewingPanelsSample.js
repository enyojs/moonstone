enyo.kind({
    name: "moon.sample.AlwaysViewingPanelsSample",
    classes: "moon enyo-fit enyo-unselectable",
    style: "background: gray url('http://lorempixel.com/1920/1080/')",
    components: [
        {name: "panels", kind: "moon.Panels", pattern: "alwaysviewing", classes: "enyo-fit", useHandle: false, components: [
            {title: "First Panel", titleBelow:"Sub-title", subTitleBelow:"Sub-sub title", classes: "moon-7h", components: [
				{kind: "moon.Item", content: "Item One", ontap: "next"},
				{kind: "moon.Item", content: "Item Two", ontap: "next"},
				{kind: "moon.Item", content: "Item Three", ontap: "next"},
				{kind: "moon.Item", content: "Item Four", ontap: "next"},
				{kind: "moon.Item", content: "Item Five", ontap: "next"}
			]},
			{title: "Second Panel", components: [
				{kind: "moon.Item", content: "Item One", ontap: "next"},
				{kind: "moon.Item", content: "Item Two", ontap: "next"},
				{kind: "moon.Item", content: "Item Three", ontap: "next"},
				{kind: "moon.Item", content: "Item Four", ontap: "next"},
				{kind: "moon.Item", content: "Item Five", ontap: "next"}
			]},
            {title: "Third Panel", titleBelow:"Sub-title", subTitleBelow:"Sub-sub title", classes: "moon-7h", components: [
				{kind: "moon.Item", content: "Item One", ontap: "next"},
				{kind: "moon.Item", content: "Item Two", ontap: "next"},
				{kind: "moon.Item", content: "Item Three", ontap: "next"},
				{kind: "moon.Item", content: "Item Four", ontap: "next"},
				{kind: "moon.Item", content: "Item Five", ontap: "next"}
			]},
            {title: "Fourth", titleBelow:"Sub-title", subTitleBelow:"Sub-sub title", classes: "moon-7h", components: [
				{kind: "moon.Item", content: "Item One", ontap: "next"},
				{kind: "moon.Item", content: "Item Two", ontap: "next"},
				{kind: "moon.Item", content: "Item Three", ontap: "next"},
				{kind: "moon.Item", content: "Item Four", ontap: "next"},
				{kind: "moon.Item", content: "Item Five", ontap: "next"}
			]},
            {title: "Fifth", joinToPrev: true, titleBelow:"Sub-title", subTitleBelow:"Sub-sub title", classes: "moon-7h", components: [
				{kind: "moon.Item", content: "Item One", ontap: "next"},
				{kind: "moon.Item", content: "Item Two", ontap: "next"},
				{kind: "moon.Item", content: "Item Three", ontap: "next"},
				{kind: "moon.Item", content: "Item Four", ontap: "next"},
				{kind: "moon.Item", content: "Item Five", ontap: "next"}
			]},
            {title: "Sixth", titleBelow:"Sub-title", subTitleBelow:"Sub-sub title", classes: "moon-7h", components: [
				{kind: "moon.Item", content: "Item One", ontap: "next"},
				{kind: "moon.Item", content: "Item Two", ontap: "next"},
				{kind: "moon.Item", content: "Item Three", ontap: "next"},
				{kind: "moon.Item", content: "Item Four", ontap: "next"},
				{kind: "moon.Item", content: "Item Five", ontap: "next"}
			]},
            {title: "Seventh", joinToPrev: true, titleBelow:"Sub-title", subTitleBelow:"Sub-sub title", classes: "moon-7h", components: [
				{kind: "moon.Item", content: "Item One"},
				{kind: "moon.Item", content: "Item Two"},
				{kind: "moon.Item", content: "Item Three"},
				{kind: "moon.Item", content: "Item Four"},
				{kind: "moon.Item", content: "Item Five"}
			]}
		]}
	],
	next: function(inSender, inEvent) {
		this.$.panels.next();
		return true;
	}
});