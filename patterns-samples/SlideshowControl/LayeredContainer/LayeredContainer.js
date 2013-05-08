enyo.kind({
	name: "moon.sample.slideshow.LayeredSample",
	classes: "slideshow-layered-sample enyo-unselectable",
	components: [
		{kind: "moon.Divider", content: "Click Image!"},
		{
			components: [
				{
					kind: "moon.ImageItem",
					source: "../assets/breaking_bad.png",
					label: "Breaking Bad",
					text: "A struggling high school chemistry teacher who is diagnosed with inoperable lung cancer turns to a life of crime, producing and selling methamphetamine with a former student",
					ontap: "tapHandler"
				}
			]
		}
	],
	create: function() {
		this.inherited(arguments);
		this.createComponent({name: "slideShow", kind:"moon.sample.slideshow.PhotoSlideshow"});
		this.$.slideShow.render();
		this.$.slideShow.requestShow("../assets/the-lorax-pic08.jpg");// test
	},
	tapHandler: function(inSender, inEvent) {
		this.$.slideShow.requestShow("../assets/the-lorax-pic08.jpg");
	}
});

enyo.kind({
	name: "moon.sample.slideshow.PhotoSlideshow",
	kind: "moon.PhotoSlideshow"
});
