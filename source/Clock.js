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
		refresh: 1000,
		//* Manual date. If it is undefined, _moon.Clock_ will use system date.
		date: undefined
	},
	components: [
		{kind: "enyo.Control", name: "hour", classes: "moon-clock-hour"},
		{name: "right", classes: "moon-clock-right", components: [
			{kind: "enyo.Control", name: "minute", classes: "moon-clock-minute"},
			{kind: "enyo.Control", name: "meridiem", classes: "moon-clock-meridiem"},
			{classes: "moon-click-divider"},
			{kind: "enyo.Control", name: "month", classes: "moon-clock-month"},
			{kind: "enyo.Control", name: "day", classes: "moon-clock-day"}
		]}
	],
	months: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
	_timeDiff : 0,
	create: function() {
		this.inherited(arguments);
		this.refreshJob();
	},
	refreshChanged: function() {
		this.startJob("refresh", this.bindSafely("refreshJob"), this.getRefresh());
	},
	dateChanged: function() {
		if(this.date && this.date instanceof Date) {
			this._timeDiff = this.date.getTime() - Date.now();
		} else {
			this._timeDiff = 0;
		}
		this.refreshJob();
	},
	refreshJob: function() {
		var d = new Date(Date.now() + this._timeDiff),
			h = d.getHours(),
			meridiem = "am";

		meridiem = h > 11 ? "pm" : "am";
		h = h > 12 ? h-12: h;
		this.$.hour.setContent(this._formatNumber(h));
		this.$.minute.setContent(this._formatNumber(d.getMinutes()));
		this.$.meridiem.setContent(meridiem);

		this.$.month.setContent(this.months[d.getMonth()] || "00");
		this.$.day.setContent(this._formatNumber(d.getUTCDate()));
		this.startJob("refresh", this.bindSafely("refreshJob"), this.getRefresh());
	},
	_formatNumber: function(inValue) {
		//* Fixme: use ilib
		return (inValue) ? (String(inValue).length < 2) ? "0"+inValue : inValue : "00";
	}
});