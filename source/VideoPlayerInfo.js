/**
	_moon.VideoPlayerInfo_ is a control that display various video information using a
	standard layout.  For use within the _infoComponents_ block of _moon.VideoPlayer_.

	Sample:

		{
			kind: "moon.VideoPlayerInfo", 
			datetime: "CURRENT DATE & TIME", 
			showname: "SHOW NAME", 
			channel: "CHANNEL - AIR DATE & TIME SLOT", 
			synopsys: "SHORT SYNOPSYS ABOUT THE CURRENT SHOW",
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
		//* Field for displaying date/time information about the current video
		datetime: "date & time",
		//* Field for displaying the name of the current video
		showname: "show name",
		//* Field for displaying the channel of the current video
		channel: "channel",
		//* Field for displaying the synopsis of the current video
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
