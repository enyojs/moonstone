/**
	_moon.ChannelInfo_ is a control that displays channel information.  It is
	designed to be used within the _infoComponents_ block of a
	[moon.VideoPlayer](#moon.VideoPlayer).

	Example:

		{
			kind: "moon.ChannelInfo",
			no: 36,
			name: "AMC",
			components: [
				{content: "3D"},
				{content: "Live"},					
				{content: "REC 08:22", classes: "moon-video-player-info-redicon"}
			]
		}
*/
enyo.kind({
	name: "moon.ChannelInfo",
	kind: "enyo.Control",
	//* @protected
	classes: "moon-channelinfo",
	mixins: ["moon.MarqueeSupport"],
	marqueeOnSpotlight: false,
	marqueeOnHover: true,
	//* @public
	published: {
		//* The channel number
		channelNo: "",
		//* The name of the channel
		channelName: ""
	},
	//* @protected
	defaultKind: "moon.ChannelInfoBadge",
	components: [
		{kind: "moon.MarqueeText", name: "channelNo", classes: "moon-header-font moon-video-player-channel-info-no"},
		{kind: "moon.MarqueeText", name: "channelName", classes: "moon-video-player-channel-info-name"},
		{kind: "enyo.Control", name: "client", classes: "moon-video-player-channel-info-badges"}
	],
	bindings: [
		{from: ".channelName",		to: ".$.channelName.content"}
	],
	create: function() {
		this.inherited(arguments);
		this.channelNoChanged();
	},
	channelNoChanged: function() {
		this.$.channelNo.set("content", enyo.toUpperCase(this.get("channelNo")) );
	}
});

//* @public

/**
    _moon.ChannelInfoBadge_ is a simple kind used to display a badge
    containing channel info. It is the default kind for components added to
    [moon.ChannelInfo](#moon.ChannelInfo).
*/
enyo.kind({
	name: "moon.ChannelInfoBadge",
	kind: "enyo.Control",
	//* @protected
	classes: "moon-video-badge-text moon-video-player-info-icon"
});
