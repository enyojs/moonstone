enyo.kind({
	name: "moon.sample.SpinnerCompareSample",
	classes: "moon enyo-unselectable enyo-fit",
	published: {
		overloadIterations: 10000,
		iterationCount: 0
	},
	components: [
		{kind: "moon.Panels", name: "panels", pattern: "activity", classes: "enyo-fit", components: [
			{kind: "moon.Panel", title: "Tools", smallHeader: true, components: [
				{kind: "moon.Button", ontap: "systemOverload", classes: "extra-wide", components: [
					{kind: "moon.Icon", src: "../images/skull.png"},
					{content: "SYSTEM OVERLOAD"}
				]},
				{kind: "moon.BodyText", content: "Simulate a completely overloaded CPU."},
				{classes: "stick-to-bottom", components: [
					{kind: "moon.Divider", content: "Iterations"},
					{kind: "moon.BodyText", name: "output"}
				]},
				{kind: "moon.Button", content: "Reload", ontap: "reload"},
				{kind: "moon.Divider", content: "Spinner Control"},
				{kind: "moon.Button", content: "Stop", ontap: "forceStopSpinners"},
				{kind: "moon.Button", content: "Start", ontap: "forceStartSpinners"}
			]},
			{kind: "moon.Panel", title: "Spinners", smallHeader: true, joinToPrev: true, headerComponents: [
				{kind: "moon.IconButton", icon: "arrowlargeright", ontap: "goToCustom1"}
			], components: [
				{kind: "moon.Divider", content: "Spinner"},
				{kind: "moon.Spinner"},
				{kind: "moon.Divider", content: "Spinner with Content"},
				{kind: "moon.Spinner", content: "Loading..."},

				{kind: "moon.Divider", content: "GIF Spinner"},
				{kind: "moon.SpinnerGif"},
				{kind: "moon.Divider", content: "GIF Spinner with Content"},
				{kind: "moon.SpinnerGif", content: "Loading..."}
			]},
			{kind: "moon.Panel", title: "Customized Spinners", smallHeader: true, headerComponents: [
				{kind: "moon.Button", content: "Stop", ontap: "forceStopSpinners"},
				{kind: "moon.Button", content: "Start", ontap: "forceStartSpinners"}
			], components: [
				{classes: "column two-column col1", components: [
					{kind: "moon.Divider", content: "Spinner"},
					{kind: "moon.Spinner"},
					{kind: "moon.Spinner", transparent: true},

					{kind: "moon.Divider", content: "Custom Colors"},
					{kind: "moon.Spinner", classes: "custom-colors1"},
					{kind: "moon.Spinner", classes: "custom-colors2"},

					{kind: "moon.Divider", content: "Custom Animation"},
					{kind: "moon.Spinner", classes: "propeller"},

					{kind: "moon.Divider", content: "Custom Shape"},
					{kind: "moon.Spinner", classes: "custom-balls rice"},
					{kind: "moon.Spinner", classes: "custom-balls planets"},

					{kind: "moon.Divider", content: "Custom Animation & Shape"},
					{kind: "moon.Spinner", classes: "custom-balls propeller sticks"},
					{kind: "moon.Spinner", classes: "custom-balls propeller vectors"},
					{kind: "moon.Spinner", classes: "custom-balls propeller rotary"},
					{kind: "moon.Spinner", classes: "custom-balls propeller rotary2"}
				]},
				{classes: "column two-column col2", components: [
					{kind: "moon.Divider", content: "Huge Spinner!"},
					{kind: "moon.Spinner", classes: "huge"},
					{kind: "moon.Spinner", classes: "huge", transparent: true},
					{kind: "moon.Spinner", classes: "huge picture-bg"}
				]}
			]}
		]}
	],
	bindings: [
		{from: ".iterationCount", to: ".$.output.content"}
	],
	reload: function(inSender, inEvent) {
		window.location.reload();
		return true;
	},
	next: function(inSender, inEvent) {
		this.$.panels.next();
		return true;
	},
	goToCustom1: function(inSender, inEvent) {
		this.$.panels.setIndex(2);
		return true;
	},
	systemOverload: function() {
		var count = this.get("iterationCount");
		for (var i = 0; i < this.get("overloadIterations"); i++) {
			// console.count("Overload System Count");
			count++;
			this.set("iterationCount", count);
		}
	},
	forceSyncSpinners: function() {
	},
	forceStopSpinners: function() {
		var sps = document.getElementsByClassName("moon-spinner");
		enyo.forEach(sps, function(elem, index) {
			var ed = enyo.$[elem.id];
			ed.removeClass("running");
		}, this);

		var spbs = document.getElementsByClassName("moon-spinner-ball");
		enyo.forEach(spbs, function(elem, index) {
			var ed = enyo.$[elem.id];
			ed.applyStyle("-webkit-animation-name", "dummyname");
		}, this);
	},
	forceStartSpinners: function() {
		var sps = document.getElementsByClassName("moon-spinner");
		enyo.forEach(sps, function(elem, index) {
			var ed = enyo.$[elem.id];
			ed.addClass("running");
		}, this);
		
		var spbs = document.getElementsByClassName("moon-spinner-ball");
		enyo.forEach(spbs, function(elem, index) {
			var ed = enyo.$[elem.id];
			ed.applyStyle("-webkit-animation-name", null);
		}, this);
	}
});

enyo.kind({
	name: "moon.SpinnerGif",
	//* @protected
	classes: "moon-spinner-gif",
	//* @public
	//* Hides the animating spinner.
	stop: function() {
		this.setShowing(false);
	},
	//* Shows the spinner with animation.
	start: function() {
		this.setShowing(true);
	},
	/** Toggle existing state of spinner.
		If spinner is visible it will be removed and viceversa.
	*/
	toggle: function() {
		this.setShowing(!this.getShowing());
	},
	//* @protected
	contentChanged: function() {
		this.inherited(arguments);
		this.addRemoveClass("content", !!this.content);
	}
});
