/**
	_moon.VideoPlayerInfo_ is a control that displays various information about a
	video using a standard layout. It is intended for use within the
	_infoComponents_ block of _moon.VideoPlayer_.

	Example:

		{
			kind: "moon.VideoPlayerInfo", 
			datetime: "CURRENT DATE & TIME", 
			showname: "SHOW NAME", 
			channel: "CHANNEL - AIR DATE & TIME SLOT", 
			synopsys: "SHORT SYNOPSIS OF THE CURRENT SHOW",
			components: [
				{content: "SUB ENGLISH", classes: "moon-videoplayer-info-icon"},
				{content: "CINEMA", classes: "moon-videoplayer-info-icon"},
				{content: "3D", classes: "moon-videoplayer-info-icon"},
				{content: "REC 00:00", classes: "moon-videoplayer-info-icon moon-videoplayer-info-redicon"}
			]
		}

*/
enyo.kind({
	name: "moon.VideoPlayerInfo",
	classes: "moon-videoplayer-info",
	//@public
	published: {
		//* Date/time information for the current video
		datetime: "date & time",
		//* Name of the current video
		showname: "show name",
		//* Channel of the current video
		channel: "channel",
		//* Synopsis of the current video
		synopsys: "synopsys"
	},
	//@protected
	components: [
		{components: [
			{name: "datetime", classes: "moon-header-font moon-videoplayer-info-datetime"},
			{name: "showname", classes: "moon-header-font moon-videoplayer-info-showname"},
			{name: "channel", classes: "moon-videoplayer-info-channel"},
			{name: "synopsys", classes: "moon-videoplayer-info-synopsys"}
		]},
		{name: "client", classes: "moon-videoplayer-info-client"}
	],
	create: function() {
		this.inherited(arguments);
		this.datetimeChanged();
		this.shownameChanged();
		this.channelChanged();
		this.synopsysChanged();
	},
	datetimeChanged: function() {
		this.$.datetime.setContent(this.datetime);
	},
	shownameChanged: function() {
		this.$.showname.setContent(this.showname);
	},
	channelChanged: function() {
		this.$.channel.setContent(this.channel);
	},
	synopsysChanged: function() {
		this.$.synopsys.setContent(this.synopsys);
	}
});
