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
	name: "moon.Clock",
	kind: "enyo.Control",
	classes: "moon-clock moon-header-font",
	published: {
		//* Refresh time in sec.
		refresh: 1000
	},
	components: [
		{kind: "enyo.Control", name: "hour", classes: "moon-clock-hour"},
		{name: "right", classes: "moon-clock-right", components: [
			{kind: "enyo.Control", name: "minute", classes: "moon-clock-minute"},
			{kind: "enyo.Control", name: "meridian", classes: "moon-clock-meridian"},
			{classes: "moon-click-divider"},
			{kind: "enyo.Control", name: "month", classes: "moon-clock-month"},
			{kind: "enyo.Control", name: "day", classes: "moon-clock-day"}
		]}
	],
	months: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
	create: function() {
		this.inherited(arguments);
		this.refreshJob();
	},
	refreshChanged: function() {
		this.startJob("refresh", this.bindSafely("refreshJob"), this.getRefresh());
	},
	refreshJob: function() {
		var d = new Date();
		this.$.hour.setContent(d.getHours());
		this.$.minute.setContent(d.getMinutes());
		if(d.getHours() > 11){
			this.$.meridian.setContent("pm");
		} else {
			this.$.meridian.setContent("am");
		}
		this.$.month.setContent(this.months[d.getMonth()]);
		this.$.day.setContent(d.getUTCDate());
		this.startJob("refresh", this.bindSafely("refreshJob"), this.getRefresh());
	}
});