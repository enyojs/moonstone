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
		date: undefined,
		/**
			ilib locale info instance. It gives information about the paarticular locale.
		*/
		ilibLocaleInfo: null,
		/**
			Current locale used for formatting. May be set after the control is
			created, in which case the control will be updated to reflect the
			new value.  Only valid if ilib is loaded.
		*/
		locale: "",
		/**
			When true, the picker uses a 12-hour clock (this value is ignored when ilib
			is loaded, since the meridiem will be set by the current locale)
		*/
		meridiemEnable: true
	},
	components: [
		{kind: "enyo.Control", name: "hour", classes: "moon-clock-hour"},
		{name: "right", classes: "moon-clock-right", components: [
			{kind: "enyo.Control", name: "minute", classes: "moon-clock-minute"},

			{kind: "enyo.Control", name: "meridiem", classes: "moon-clock-meridiem"},
			{classes: "moon-clock-divider"},
			{kind: "enyo.Control", name: "monthDay", classes: "moon-clock-month-day"}
		]}
	],
	months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
	meridiems: ["am","pm"],
	_timeDiff: 0,
	create: function() {
		this.inherited(arguments);
		this.initDefaults();
		this.refreshJob();
	},
	initILib: function() {
		this.ilibLocaleInfo = new ilib.LocaleInfo(this.locale || undefined);
		var clockPref = this.ilibLocaleInfo.getClock();
		var clock = clockPref !== "locale" ? clockPref : undefined;

		var fmtHourParams = {
			locale: this.locale,
			type: "time",
			time: "h",
			clock: clock,
			timezone: "local"
		};
		var fmtMinuteParams = {
			locale: this.locale,
			type: "time",
			time: "m",
			clock: clock,
			timezone: "local"
		};
		var fmtMonthDayParams = {
			locale: this.locale,
			type: "date",
			date: "md",
			length: "long",
			timezone: "local"
		};
		
		this._hf = new ilib.DateFmt(fmtHourParams);
		this._mf = new ilib.DateFmt(fmtMinuteParams);
		this._mdf = new ilib.DateFmt(fmtMonthDayParams);
		this.meridiemEnable = (clockPref == '12');

		// Get localized meridiem values
		if (this.meridiemEnable) {
			var fmtParams = {
				locale: this.locale,
				template: "a",
				clock: clock,
				timezone: "local"
			};
			var merFormatter = new ilib.DateFmt(fmtParams);
			var am = new ilib.Date.GregDate({hour:1});
			var pm = new ilib.Date.GregDate({hour:13});
			this.meridiems = [merFormatter.format(am), merFormatter.format(pm)];
		}
	},
	initDefaults: function() {
		// Attempt to use the ilib lib
		if (typeof ilib !== "undefined") {
			this.initILib();
		}
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
		var d = new Date(Date.now() + this._timeDiff);
		this.updateHour(d);
		this.updateMinute(d);
		this.updateMonthDay(d);
		this.startJob("refresh", this.bindSafely("refreshJob"), this.getRefresh());
	},
	_formatNumber: function(inValue) {
		// Used when ilib is not present
		return (inValue) ? (String(inValue).length < 2) ? "0"+inValue : inValue : "00";
	},
	localeChanged: function() {
		this._refresh();
	},
	_refresh: function() {
		if (this._hf) {
			delete this._hf;
		}
		if (this._mf) {
			delete this._mf;
		}
		if (this._mdf) {
			delete this._mdf;
		}
		this.initDefaults();
	},
	updateHour: function(inDate) {
		var h = inDate.getHours(), hour, m, i;
		if (this.meridiemEnable) {
			i = h > 11 ? 1 : 0;
			m = this.meridiems[i];
		} else {
			m = "";
		}
		h = h > 12 ? h-12: h;
		hour = this._hf ? this._hf.format(new ilib.Date.GregDate({unixtime: inDate.getTime(), timezone:"UTC"})) : h;
		this.$.hour.setContent(hour);
		this.$.meridiem.setContent(m);
	},
	updateMinute: function(inDate) {
		var m = this._mf ? this._mf.format(new ilib.Date.GregDate({unixtime: inDate.getTime(), timezone:"UTC"})) : this._formatNumber(inDate.getMinutes());
		this.$.minute.setContent(m);
	},
	updateMonthDay: function(inDate) {
		var md = this._mdf ? this._mdf.format(new ilib.Date.GregDate({unixtime: inDate.getTime(), timezone:"UTC"})) : this.months[inDate.getMonth()] + " " + this._formatNumber(inDate.getUTCDate());
		this.$.monthDay.setContent(md);
	}
});