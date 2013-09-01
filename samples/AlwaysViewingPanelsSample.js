enyo.kind({
    name: "moon.sample.AlwaysViewingPanelsSample",
    classes: "moon enyo-fit enyo-unselectable",
    components: [
        {name: "player", kind: "moon.VideoPlayer", src: "http://media.w3.org/2010/05/bunny/movie.mp4", autoplay: true, infoComponents: [
			{kind: "moon.VideoInfoBackground", orient: "left", background: true, fit: true, components: [
				{
					kind: "moon.ChannelInfo",
					channelNo: "13",
					channelName: "AMC",
					classes: "moon-2h", 
					components: [
						{content: "3D"},
						{content: "Live"},
						{content: "REC 08:22", classes: "moon-video-player-info-redicon "}
					]
				},
				{
					kind: "moon.VideoInfoHeader",
					title: "Downton Abbey - Extra Title",
					subTitle: "Mon June 21, 7:00 - 8:00pm",
					subSubTitle: "R - TV 14, V, L, SC",
					description: "The series, set in the Youkshire country estate of Downton Abbey, depicts the lives of the aristocratic Crawley famiry and"
				}
			]},
			{kind: "moon.VideoInfoBackground", orient: "right", background: true, components: [
				{kind:"moon.Clock"}
			]}
		], components: [
			{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"},
			{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"},
			{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"},
			{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"},
			{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"},
			{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"},
			{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"},
			{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"},
			{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"},
			{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"}
		]},
        {name: "panels", kind: "moon.Panels", pattern: "alwaysviewing", classes: "enyo-fit", components: [
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
				{kind: "moon.Item", content: "Item One", ontap: "next"},
				{kind: "moon.Item", content: "Item Two", ontap: "next"},
				{kind: "moon.Item", content: "Item Three", ontap: "next"},
				{kind: "moon.Item", content: "Item Four", ontap: "next"},
				{kind: "moon.Item", content: "Item Five", ontap: "next"}
			]}
		]}
	],
	next: function(inSender, inEvent) {
		this.$.panels.next();
		return true;
	}
});