enyo.kind({
    name: "moon.sample.AlwaysViewingPanelsWithVideoSample",
    classes: "moon enyo-fit enyo-unselectable",
    components: [
        {name: "player", kind: "moon.VideoPlayer", src: "http://media.w3.org/2010/05/bunny/movie.mp4", poster: "assets/video-poster.png", autoplay: true, showInfoBackground: true, infoComponents: [
			{kind: "moon.VideoInfoBackground", orient: "left", background: true, fit: true, components: [
				{
					kind: "moon.ChannelInfo",
					channelNo: "9999-99",
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
			{kind: "moon.TooltipDecorator", components: [
				{kind: "moon.ContextualPopupDecorator", components: [
					{kind: "moon.Button", content: "Popup"},
					{
						kind: "moon.ContextualPopup",
						classes: "moon-3h moon-6v",
						components: [
							{kind: "moon.Item", content:"Item 1"},
							{kind: "moon.Item", content:"Item 2"},
							{kind: "moon.Item", content:"Item 3"}
						]
					}
				]},
				{kind: "moon.Tooltip", floating:true, content: "I'm a tooltip for a button."}
			]},
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
        {name: "panels", kind: "moon.Panels", pattern: "alwaysviewing", classes: "enyo-fit", showing: false, components: [
            {title: "First Panel", titleBelow:"Sub-title", subTitleBelow:"Sub-sub title", classes: "moon-7h", components: [
				{kind: "moon.Item", content: "Item One", ontap: "next"},
				{kind: "moon.Item", content: "Item Two", ontap: "next"},
				{kind: "moon.Item", content: "Item Three", ontap: "next"},
				{kind: "moon.Item", content: "Item Four", ontap: "next"},
				{kind: "moon.ToggleItem", content: "Show/Hide Side Handle", checked: true,  onchange: "handleShowingChanged"}
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
	},
	handleShowingChanged : function(inSender, inEvent) {
		this.$.panels.setHandleShowing(inSender.getChecked());
	}
}); 
