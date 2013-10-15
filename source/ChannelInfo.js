/**
	_moon.ChannelInfo_ is a control that displays channel information. 
	It is designed to be used within the _infoComponents_ block of a
	<a href="#moon.VideoPlayer">moon.VideoPlayer</a>.

	Example:

		{
			kind: "moon.ChennelInfo",
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
	classes: "moon-channelinfo",
	published: {
		//* sets the content with the ChannelNo.
		channelNo: "",
		//* sets the content with the ChannelName.
		channelName: ""
	},
	defaultKind: "moon.ChannelInfoBadge",
	components: [
		{kind: "enyo.Control", name: "channelNo", classes: "moon-header-font moon-video-player-channel-info-no"},
		{kind: "enyo.Control", name: "channelName", classes: "moon-video-player-channel-info-name"},
		{kind: "enyo.Control", name: "client", classes: "moon-video-player-channel-info-badges"}
	],
	bindings: [
		{from: ".channelNo",		to: ".$.channelNo.content"},
		{from: ".channelName",		to: ".$.channelName.content"}
	]
});

/**
    _moon.ChannelInfoBadge_ is a simple kind used to display a badge
    containing channel info. It is the default kind for components added to
    [moon.ChannelInfo](#moon.ChannelInfo).
*/
enyo.kind({
	name: "moon.ChannelInfoBadge",
	kind: "enyo.Control",
	classes: "moon-video-badge-text moon-video-player-info-icon"
});
