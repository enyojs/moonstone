/**
	_moon.VideoPlayerInfo_ is a control that display various video information.
*/
enyo.kind({
	name: "moon.VideoPlayerInfo",
	classes: "moon-videoplayer-info",
	published: {
		datetime: "date & time",
		showname: "show name",
		channel: "channel",
		synopsys: "synopsys"
	},
	components: [
		{components: [
			{name: "datetime", classes: "moon-videoplayer-info-datetime"},
			{name: "showname", classes: "moon-videoplayer-info-showname"},
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
