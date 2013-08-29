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
		/**
			Current locale used for formatting. May be set after the control is
			created, in which case the control will be updated to reflect the
			new value.
		*/
		locale: null
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
	ilibLocaleInfo: null,
	create: function() {
		this.inherited(arguments);
		if (this._isIlibLoaded()) {
			this.setLocale({ locale : new ilib.LocaleInfo().info.locale });
		} else {
			this.refreshJob();
		}	
	},
	refreshChanged: function() {
		this.startJob("refresh", this.bindSafely("refreshJob"), this.getRefresh());
	},
	refreshJob: function() {
		var d = new Date(), 
			h = d.getHours(),
			date = ilib.Date.newInstance(),
			meridian = "am";

		meridian = h > 11 ? "pm" : "am";
		h = h > 12 ? h-12: h;
		this.$.hour.setContent(this._getTimeValue("hour"));
		this.$.minute.setContent(this._getTimeValue("min"));
		this.$.meridian.setContent(this._getMeridian());

		this.$.month.setContent(this._getDateValue("month"));
		this.$.day.setContent(this._getDateValue("day"));
		this.startJob("refresh", this.bindSafely("refreshJob"), this.getRefresh());
	},
	_formatNumber: function(inValue) {
		//* Fixme: use ilib
		return (inValue) ? (String(inValue).length < 2) ? "0"+inValue : inValue : "00";
	},
	_isIlibLoaded: function () {
		return typeof ilib !== "undefined";
	},
	_getMeridian: function () {
		var meridian = "";
		if (this._isIlibLoaded()) {
			var fmt = new ilib.DateFmt({ locale: this.ilibLocaleInfo, type: "time", time : "ah" }),
				ah = fmt.format(ilib.Date.newInstance()),
				ahArray = (ah) ? ah.split(" ") : [];

			if (ahArray.length > 0) {
				meridian = ahArray[0];
			}
		}
		
		if (meridian === "") {
			var h = new Date().getHours();
			meridian = (h > 11) ? "pm" : "am";
		}		
			this._getDateValue("m");	
		return meridian;
	},
	_getDateValue: function (type) {
		var result = "";
		if (this._isIlibLoaded()) {
			var fmt = new ilib.DateFmt({ locale: this.ilibLocaleInfo, type: "date", date : "md", length: "long" }),
				fmtResult = fmt.format(ilib.Date.newInstance()),
				fmtArray = (fmtResult) ? fmtResult.split(" ") : [];

			if (fmtArray.length > 0) {
				result = fmtArray[type === "month" ? 0 : 1];
			}
		}

		if (result === "") {
			result = type === "month"? this.months[new Date().getMonth()] : this._formatNumber(new Date().getUTCDate());
		}

		return result;
	},
	_getTimeValue: function (type) {
		var d = new Date();
		if (type === "hour") {
			var h = d.getHours();
			return this._formatNumber(h > 12 ? h-12: h);
		} else if (type === "min") {
			return this._formatNumber(d.getMinutes());
		}
	},
	localeChanged: function (inSender, inEvent) {
		this.ilibLocaleInfo = inEvent.locale;//this.ilibLocaleInfo = "en";
		this.refreshJob();
	}
});