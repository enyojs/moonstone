enyo.kind({
	name: "discovery.Sample.PlaybackStereoscopic",
	classes: "moon enyo-fit enyo-unselectable moon-video-player-sample",
	fit: true,

	src: [],

	components: [
		{
			name: "player",
			kind: "moon.VideoPlayer",
			src: "http://media.w3.org/2010/05/sintel/trailer.mp4", // On JCKIM's laptop
			infoComponents: [
				{kind: "moon.VideoInfoBackground", orient: "left", background: true, fit: true, components: [
					{
						kind: "moon.VideoInfoHeader",
						title: "3D Video Playing"
					}
				]}
			],
			components: [
				{name: "sendBackButton", kind: "moon.Button", small: true, content: "BACK", ontap: "buttonBack"},
				{name: "changeButton", kind: "moon.Button", small: true, content: "2D/3D", ontap: "buttonChange"}
			]
		}	
	]

});

enyo.kind({
	name: "moon.CalendarPickerWeek",
	classes: "moon-calendar-picker-week",
	days: [],
	colors: [],
	create: function() {
		this.inherited(arguments);
		this.setupLayout();
	},
	setupLayout: function() {
		for (var i = 0; i < 7; i++) {
			this.createComponent({kind: "moon.CalendarPickerDate"});
		}
	},
	fillDate: function(days, colors) {
		this.days = days;
		this.colors = colors;

		for (var i = 0; i < this.days.length; i++) {
			var value = this.days[i],
				color = this.colors[i];
			this.controls[i].setValue(new Date(value.getFullYear(), value.getMonth(), value.getDate()));
			this.controls[i].setColor(color);
		}
	}
});