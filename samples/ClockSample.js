enyo.kind({
	name: "moon.sample.ClockSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "moon.Clock", name:"clock"},
		{classes:"moon-1v"},
		{classes:"moon-hspacing", components: [
			{kind: "moon.InputDecorator", components: [
				{kind: "moon.Input", name:"input", value:"Jan 01 2013 11:22:59"}
			]},
			{kind: "moon.Button", small:true, content:"Set Time", ontap:"setTime"},
			{kind: "moon.Button", small:true, content:"Set Static Time", ontap:"setStaticTime"},
			{kind: "moon.Button", small:true, content:"Reset to Current", ontap:"resetTime"}
		]},
		{classes:"moon-1v"},
		{kind: 'moon.Scroller', fit: true, components: [
			{classes: "moon-5h", components: [
				{name: "localePicker", kind: "moon.ExpandablePicker", noneText: $L("No Locale Selected"), content: "Choose Locale", onChange:"pickerHandler", components: [
					{content: 'Use Default Locale', active: true},
					{content: 'en-US'},
					{content: 'ko-KR'},
					{content: "th-TH"},	//Thailand
					{content: 'en-CA'},
					{content: 'en-IE'},
					{content: 'en-GB'},
					{content: 'en-MX'},
					{content: 'de-DE'},
					{content: 'fr-FR'},
					{content: 'fr-CA'},
					{content: 'it-IT'},
					{content: 'es-ES'},
					{content: 'es-MX'},
					{content: 'es-US'}
				]}
			]}
		]}
	],
	create: function(){
		this.inherited(arguments);
		if (!window.ilib) {
			this.$.localePicker.hide();
			this.log("iLib not present -- hiding locale picker");
		}
	},
	pickerHandler: function(inSender, inEvent){
		var opt = inEvent.selected.content,
			val = (opt == "Use Default Locale") ? null : opt;
		this.$.clock.setLocale(val);
		return true;
	},
	setTime: function() {
		this.$.clock.setDate(new Date(this.$.input.getValue()));
	},
	setStaticTime: function() {
		var d = this.$.input.getValue() ? new Date(this.$.input.getValue()) : new Date();
		// We increment the JS month value so that it is 1-based
		this.$.clock.setDate({year: d.getFullYear(), month: d.getMonth()+1, day: d.getDate(), hour: d.getHours(), min: d.getMinutes(), sec: d.getSeconds()});
	},
	resetTime: function() {
		this.$.clock.setDate(null);
	}
});