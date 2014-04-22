enyo.kind({
	name: "moon.sample.SpinnerCompareDemoSample",
	classes: "moon enyo-unselectable enyo-fit",
	published: {
		overloadIterations: 100000,
		iterationCount: 0
	},
	components: [
		{kind: "moon.Panels", name: "panels", pattern: "activity", classes: "enyo-fit", components: [
			{kind: "moon.Panel", title: "Spinner Comparison", smallHeader: false, headerComponents: [
				// {kind: "moon.Button", content: "   SYSTEM OVERLOAD", classes: "skull-button", ontap: "systemOverload"},
				{kind: "moon.Button", ontap: "systemOverload", classes: "extra-wide moon-header-left", components: [
					{kind: "moon.Icon", src: "../images/skull.png"},
					{content: "SYSTEM OVERLOAD"}
				]},
				{kind: "moon.Button", content: "Stop Spinner", classes:"moon-header-left", ontap: "forceStopSpinners"},
				{kind: "moon.Button", content: "Start Spinner", classes:"moon-header-left", ontap: "forceStartSpinners"},
				{kind: "moon.Button", content: "Reload App", ontap: "reload"}
				// {kind: "moon.BodyText", content: "Simulate a completely overloaded CPU."},
				// {classes: "stick-to-bottom", components: [
					// {kind: "moon.Divider", content: "Iterations"},
					// {kind: "moon.BodyText", name: "output"}
				// ]},
				// {kind: "moon.Divider", content: "Spinner Control"},
			],components: [
				{classes: "column two-thin-column col1", components: [
					{kind: "moon.Divider", content: "GIF Spinner"},
					{kind: "moon.SpinnerGif"},
					{kind: "moon.Divider", content: "GIF Spinner with Content"},
					{kind: "moon.SpinnerGif", content: "Loading..."}
				]},

				{classes: "column two-thin-column col2", components: [
					{kind: "moon.Divider", content: "Spinner"},
					{kind: "moon.Spinner"},
					{kind: "moon.Divider", content: "Spinner with Content"},
					{kind: "moon.Spinner", content: "Loading..."}
				]}
			// ]},
			// {kind: "moon.Panel", title: "Customized Spinners", smallHeader: true, headerComponents: [
			// 	{kind: "moon.Button", content: "Stop", ontap: "forceStopSpinners"},
			// 	{kind: "moon.Button", content: "Start", ontap: "forceStartSpinners"}
			// ], components: [
			// 	{classes: "column two-column col1", components: [
			// 		{kind: "moon.Divider", content: "Spinner"},
			// 		{kind: "moon.Spinner"},

			// 		{kind: "moon.Divider", content: "Custom Colors"},
			// 		{kind: "moon.Spinner", classes: "custom-colors1"},
			// 		{kind: "moon.Spinner", classes: "custom-colors2"},

			// 		{kind: "moon.Divider", content: "Custom Animation"},
			// 		{kind: "moon.Spinner", classes: "propeller"},

			// 		{kind: "moon.Divider", content: "Custom Shape"},
			// 		{kind: "moon.Spinner", classes: "custom-balls rice"},
			// 		{kind: "moon.Spinner", classes: "custom-balls planets"},

			// 		{kind: "moon.Divider", content: "Custom Animation & Shape"},
			// 		{kind: "moon.Spinner", classes: "custom-balls propeller sticks"},
			// 		{kind: "moon.Spinner", classes: "custom-balls propeller vectors"},
			// 		{kind: "moon.Spinner", classes: "custom-balls propeller rotary"},
			// 		{kind: "moon.Spinner", classes: "custom-balls propeller rotary2"}
			// 	]},
			// 	{classes: "column two-column col2", components: [
			// 		{kind: "moon.Divider", content: "Huge Spinner!"},
			// 		{kind: "moon.Spinner", classes: "huge"}
			// 	]}
			]}
		]}
	],
	// bindings: [
	// 	{from: ".iterationCount", to: ".$.output.content"}
	// ],
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
		var sps = document.getElementsByClassName("moon-spinner-ball");
		enyo.forEach(sps, function(elem, index) {
			var ed = enyo.$[elem.id];
			ed.applyStyle("-webkit-animation-name", "dummyname");
		}, this);
	},
	forceStartSpinners: function() {
		var sps = document.getElementsByClassName("moon-spinner-ball");
		enyo.forEach(sps, function(elem, index) {
			var ed = enyo.$[elem.id];
			ed.applyStyle("-webkit-animation-name", "inherit");
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
