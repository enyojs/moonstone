/**
	_moon.Clock_ is a control that displays system clock information.

	Example:

		{kind: "moon.Clock"}
*/
enyo.kind({
	name: "moon.Clock",
	kind: "enyo.Control",
	//* @protected
	classes: "moon-clock moon-header-font",
	//* @public
	published: {
		//* Refresh time in milliseconds
		refresh: 1000,
		//* User-provided date; if undefined, system date is used
		date: undefined,
		/**
			Current locale used for formatting. May be set after the control is
			created, in which case the control will be updated to reflect the
			new value.  Only valid if _ilib_ is loaded.
		*/
		locale: ""
	},
	//* @protected
	components: [
		{kind: "enyo.Control", name: "hour", classes: "moon-header-text moon-clock-hour"},
		{name: "right", classes: "moon-clock-right", components: [
			{kind: "enyo.Control", name: "top", classes: "moon-header-font moon-clock-top"},
			{name: "meridiem", classes: "moon-bold-text moon-clock-meridiem"},
			{name: "divider", classes: "moon-clock-divider"},
			{kind: "enyo.Control", name: "bottom", classes: "moon-body-text moon-clock-bottom"}
		]},
		{kind: "enyo.Signals", onlocalechange: "handleLocaleChangeEvent"}
	],
	months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
	_timeDiff: 0,
	//* _ilib_ locale info instance; it contains information about the particular locale
	ilibLocaleInfo: null,
	create: function() {
		this.inherited(arguments);
		this.initDefaults();
		this.refreshJob();
	},
	initILib: function() {
		this.ilibLocaleInfo = new ilib.LocaleInfo(this.locale || undefined);
		var clockPref = this.ilibLocaleInfo.getClock();
		var clock = clockPref !== "locale" ? clockPref : undefined;
		var dateLen, fmtMin;

		if (this.ilibLocaleInfo.locale.spec === "en-US") {
			dateLen = "long";
			fmtMin = "m";
			this.$.right.addRemoveClass("mini", false);
			this.$.hour.show();
			this.$.meridiem.show();
		} else {
			dateLen = "full";
			fmtMin = "hma";
			this.$.right.addRemoveClass("mini", true);
			this.$.hour.hide();
			this.$.meridiem.hide();
		}

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
			time: fmtMin,
			clock: clock,
			timezone: "local"
		};
		var fmtMonthDayParams = {
			locale: this.locale,
			type: "date",
			date: "md",
			length: dateLen,
			timezone: "local"
		};

		this._hf = new ilib.DateFmt(fmtHourParams);
		this._mf = new ilib.DateFmt(fmtMinuteParams);
		this._mdf = new ilib.DateFmt(fmtMonthDayParams);
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
			this._timeDiff = (this.date.getTime() - Date.now()) || 0;
		} else {
			this._timeDiff = 0;
		}
		this.refreshJob();
	},
	refreshJob: function() {
		var d = new Date(Date.now() + this._timeDiff);
		var h = d.getHours();
		this.updateHour(d, h);
		this.updateMinute(d, h);
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
		this.refreshJob();
	},
	updateHour: function(inDate, inHour) {
		inHour = (inHour > 12 ? inHour-12: inHour) || 12;
		var hour = this._hf ? this._hf.format(ilib.Date.newInstance({unixtime: inDate.getTime(), timezone:"Etc/UTC"})) : inHour;
		this.$.hour.setContent(hour);
	},
	updateMinute: function(inDate, inHour) {
		var time = this._mf ? this._mf.format(ilib.Date.newInstance({unixtime: inDate.getTime(), timezone:"Etc/UTC"})) : this._formatNumber(inDate.getMinutes());
		var meridiem = "";
		if (!this.ilibLocaleInfo || this.ilibLocaleInfo.locale.spec === "en-US") {
			meridiem = inHour > 11 ? "pm" : "am";
		}
		this.$.top.setContent(time);
		this.$.meridiem.setContent(meridiem);
	},
	updateMonthDay: function(inDate) {
		var md = this._mdf ? this._mdf.format(ilib.Date.newInstance({unixtime: inDate.getTime(), timezone:"Etc/UTC"})) : this.months[inDate.getMonth()] + " " + this._formatNumber(inDate.getUTCDate());
		this.$.bottom.setContent(md);
	},
	handleLocaleChangeEvent: function() {
		this._refresh();
	}
});