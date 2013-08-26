/**
	_moon.Clock_ is a control that displays system clock information. 

	Example:
		{kind:"moon.Clock"}
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
		var d = new Date(), 
			h = d.getHours(),
			meridian = "am";

		meridian = h > 11 ? "pm" : "am";
		h = h > 12 ? h-12: h;
		this.$.hour.setContent(this._formatNumber(h));
		this.$.minute.setContent(this._formatNumber(d.getMinutes()));
		this.$.meridian.setContent(meridian);

		this.$.month.setContent(this.months[d.getMonth()]);
		this.$.day.setContent(this._formatNumber(d.getUTCDate()));
		this.startJob("refresh", this.bindSafely("refreshJob"), this.getRefresh());
	},
	_formatNumber: function(inValue) {
		//* Fixme: use ilib
		return (inValue) ? (String(inValue).length < 2) ? "0"+inValue : inValue : "00";
	}
});