enyo.kind({
	name: "moon.sample.ActivityPanelsWithVideoSample",
	classes: "moon enyo-fit enyo-unselectable",
	components: [
        {name: "player", kind: "moon.VideoPlayer", src: "http://media.w3.org/2010/05/bunny/movie.mp4", poster: "$lib/moonstone/samples/assets/video-poster.png", autoplay: true, showing: false, infoComponents: [
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
			{kind: "moon.IconButton", small: false, classes: "moon-icon-video-round-controls-style"},
			{kind: "moon.IconButton", small: false, classes: "moon-icon-video-round-controls-style"},
			{kind: "moon.IconButton", small: false, classes: "moon-icon-video-round-controls-style"},
			{kind: "moon.IconButton", small: false, classes: "moon-icon-video-round-controls-style"},
			{kind: "moon.IconButton", small: false, classes: "moon-icon-video-round-controls-style"},
			{kind: "moon.IconButton", small: false, classes: "moon-icon-video-round-controls-style"},
			{kind: "moon.IconButton", small: false, classes: "moon-icon-video-round-controls-style"},
			{kind: "moon.IconButton", small: false, classes: "moon-icon-video-round-controls-style"},
			{kind: "moon.IconButton", small: false, classes: "moon-icon-video-round-controls-style"},
			{kind: "moon.IconButton", small: false, classes: "moon-icon-video-round-controls-style"}
		]},
		{name: "panels", kind: "moon.Panels", pattern: "activity", classes: "enyo-fit", useHandle: true, onShowingChanged: 'panelsShowingChanged', components: [
			{title: "First Panel", classes: "moon-7h", titleBelow:"Sub-title", subTitleBelow:"Sub-sub title", components: [
				{kind: "moon.Item", content: "Item One", ontap: "next1"},
				{kind: "moon.Item", content: "Item Two", ontap: "next1"},
				{kind: "moon.Item", content: "Item Three", ontap: "next1"},
				{kind: "moon.Item", content: "Item Four", ontap: "next1"},
				{kind: "moon.ToggleItem", content: "Show/Hide Side Handle", checked: true,  onchange: "handleShowingChanged"}
			]},
			{title: "Second Panel", classes: "moon-7h",
				joinToPrev: true, components: [
				{kind: "moon.Item", content: "Item One", ontap: "next2"},
				{kind: "moon.Item", content: "Item Two", ontap: "next2"},
				{kind: "moon.Item", content: "Item Three", ontap: "next2"},
				{kind: "moon.Item", content: "Item Four", ontap: "next2"},
				{kind: "moon.Item", content: "Item Five", ontap: "next2"}
			]},
			{title: "Third Panel", classes: "moon-7h", titleBelow:"Sub-title", subTitleBelow:"Sub-sub title", components: [
				{kind: "moon.Item", content: "Item One", ontap: "next3"},
				{kind: "moon.Item", content: "Item Two", ontap: "next3"},
				{kind: "moon.Item", content: "Item Three", ontap: "next3"},
				{kind: "moon.Item", content: "Item Four", ontap: "next3"},
				{kind: "moon.Item", content: "Item Five", ontap: "next3"}
			]},
			{title: "Fourth", classes: "moon-7h", joinToPrev: true, titleBelow:"Sub-title", subTitleBelow:"Sub-sub title", components: [
				{kind: "moon.Item", content: "Item One", ontap: "next4"},
				{kind: "moon.Item", content: "Item Two", ontap: "next4"},
				{kind: "moon.Item", content: "Item Three", ontap: "next4"},
				{kind: "moon.Item", content: "Item Four", ontap: "next4"},
				{kind: "moon.Item", content: "Item Five", ontap: "next4"}
			]},
			{title: "Fifth", classes: "moon-7h", titleBelow:"Sub-title", subTitleBelow:"Sub-sub title", components: [
				{kind: "moon.Item", content: "Item One", ontap: "next5"},
				{kind: "moon.Item", content: "Item Two", ontap: "next5"},
				{kind: "moon.Item", content: "Item Three", ontap: "next5"},
				{kind: "moon.Item", content: "Item Four", ontap: "next5"},
				{kind: "moon.Item", content: "Item Five", ontap: "next5"}
			]},
			{title: "Sixth", classes: "moon-7h", joinToPrev: true, titleBelow:"Sub-title", subTitleBelow:"Sub-sub title", components: [
				{kind: "moon.Item", content: "Item One", ontap: "next6"},
				{kind: "moon.Item", content: "Item Two", ontap: "next6"},
				{kind: "moon.Item", content: "Item Three", ontap: "next6"},
				{kind: "moon.Item", content: "Item Four", ontap: "next6"},
				{kind: "moon.Item", content: "Item Five", ontap: "next6"}
			]},
			{title: "Seventh", classes: "moon-7h", titleBelow:"Sub-title", subTitleBelow:"Sub-sub title", components: [
				{kind: "moon.Item", content: "Item One"},
				{kind: "moon.Item", content: "Item Two"},
				{kind: "moon.Item", content: "Item Three"},
				{kind: "moon.Item", content: "Item Four"},
				{kind: "moon.Item", content: "Item Five"}
			]}
		]}
	],
	rendered: function() {
		this.inherited(arguments);
		enyo.Spotlight.spot(this.$.panels);
	},
	// custom next handler for each panel to avoid switching from one active panel
	// to another with no visible change for demo
	next1: function(inSender, inEvent) {
		this.$.panels.setIndex(2);
		return true;
	},
	next2: function(inSender, inEvent) {
		this.$.panels.setIndex(2);
		return true;
	},
	next3: function(inSender, inEvent) {
		this.$.panels.setIndex(5);
		return true;
	},
	next4: function(inSender, inEvent) {
		this.$.panels.setIndex(5);
		return true;
	},
	next5: function(inSender, inEvent) {
		this.$.panels.setIndex(7);
		return true;
	},
	next6: function(inSender, inEvent) {
		this.$.panels.setIndex(7);
		return true;
	},
	handleShowingChanged: function(inSender, inEvent) {
		this.$.panels.setHandleShowing(inSender.getChecked());
	},
	panelsShowingChanged: function (sender, event) {
		// Hiding the VideoPlayer when it would be obscured by the Panels avoids UI performance
		// issues caused by the GPU being occupied rendering video frames that aren't visible.
		this.$.player.set('showing', !event.showing);
	}
});
