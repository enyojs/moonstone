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
				{kind: "moon.Button", ontap: "systemOverload", classes: "extra-wide moon-header-left", components: [
					{kind: "moon.Icon", src: "../images/skull.png"},
					{content: "SYSTEM OVERLOAD"}
				]},
				{kind: "moon.Button", content: "Stop Spinner", classes:"moon-header-left", ontap: "forceStopSpinners"},
				{kind: "moon.Button", content: "Start Spinner", classes:"moon-header-left", ontap: "forceStartSpinners"},
				{kind: "moon.Button", content: "Reload App", ontap: "reload"}
			], components: [
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
			]}
		]}
	],
	reload: function(inSender, inEvent) {
		window.location.reload();
		return true;
	},
	systemOverload: function() {
		var count = this.get("iterationCount");
		for (var i = 0; i < this.get("overloadIterations"); i++) {
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
