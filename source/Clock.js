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
	observers: {
		modeChanged: ["mode"]
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
	/** 
		Define clock mode.
		If date is assinged with JS Date object or null, it will be "normal".
		If date is assinged with JS object that indicating the exact time components
		to be formatted into the clock, it will be "direct".
	*/
	mode: "normal",
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
			timezone: (this.mode === "normal") ? "local" : "Etc/UTC"
		};
		var fmtMinuteParams = {
			locale: this.locale,
			type: "time",
			time: fmtMin,
			clock: clock,
			timezone: (this.mode === "normal") ? "local" : "Etc/UTC"
		};
		var fmtMonthDayParams = {
			locale: this.locale,
			type: "date",
			date: "md",
			length: dateLen,
			timezone: (this.mode === "normal") ? "local" : "Etc/UTC"
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
		if (this.date && !(this.date instanceof Date)) {
			this.set("mode", "direct");
		} else if(this.date && this.date instanceof Date) {
			this.set("mode", "normal");
			this._timeDiff = (this.date.getTime() - Date.now()) || 0;
		} else {
			this.set("mode", "normal");
			this._timeDiff = 0;			
		}
		this.refreshJob();
	},
	modeChanged: function() {
		this.initDefaults();
		// reinitialize data format to use timezone: Etc/UTC
	},
	refreshJob: function() {
		var d, h;
		if (this.mode === "normal") {
			d = new Date(Date.now() + this._timeDiff);
			h = d.getHours();
		} else {
			d = this.date;
			h = (this.date.hour) ? this.date.hour : 0;
		}		
		this.updateHour(d, h);
		this.updateMinute(d, h);
		this.updateMonthDay(d);
		if (this.mode === "normal") {
			this.startJob("refresh", this.bindSafely("refreshJob"), this.getRefresh());	
		}		
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
	/**	
		If user sets time without using JS Date object, 
		it should be parsed into array for ilib.Date object.
	*/
	parseDirectDate: function(inDate) {
		return {
			year: (inDate.year !== undefined) ? inDate.year : 0,
			month: (inDate.month !== undefined) ? inDate.month : 0,
			day: (inDate.day !== undefined) ? inDate.day : 0,
			hour: (inDate.hour !== undefined) ? inDate.hour : 0,
			minute: (inDate.min !== undefined) ? inDate.min : 0,
			second: (inDate.sec !== undefined) ? inDate.sec : 0,
			timezone: "Etc/UTC"
		};
	},
	updateHour: function(inDate, inHour) {
		inHour = (inHour > 12 ? inHour-12: inHour) || 12;
		
		var hour = this._hf ? this._hf.format((this.mode === "normal")	? ilib.Date.newInstance({unixtime: inDate.getTime(), timezone:"Etc/UTC"})
																		: ilib.Date.newInstance(this.parseDirectDate(inDate)))
							: inHour;
		this.$.hour.setContent(hour);
	},
	updateMinute: function(inDate, inHour) {
		var time = this._mf ? this._mf.format((this.mode === "normal")	? ilib.Date.newInstance({unixtime: inDate.getTime(), timezone:"Etc/UTC"})
																		: ilib.Date.newInstance(this.parseDirectDate(inDate))) 
							: (this.mode === "normal")	? this._formatNumber(inDate.getMinutes())
														: this._formatNumber(inDate.min);
		var meridiem = "";
		if (!this.ilibLocaleInfo || this.ilibLocaleInfo.locale.spec === "en-US") {
			meridiem = inHour > 11 ? "pm" : "am";
		}
		this.$.top.setContent(time);
		this.$.meridiem.setContent(meridiem);
	},
	updateMonthDay: function(inDate) {
		var md = this._mdf	? this._mdf.format((this.mode === "normal") ? ilib.Date.newInstance({unixtime: inDate.getTime(), timezone:"Etc/UTC"})
																		: ilib.Date.newInstance(this.parseDirectDate(inDate))) 
							: (this.mode === "normal")	? this.months[inDate.getMonth()] + " " + this._formatNumber(inDate.getUTCDate())
														: ((inDate.month !== undefined) ? this.months[inDate.month] : 0) + " " + this._formatNumber(inDate.day);
		this.$.bottom.setContent(md);
	},
	handleLocaleChangeEvent: function() {
		this._refresh();
	}
});