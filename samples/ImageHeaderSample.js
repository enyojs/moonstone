enyo.kind({
	name: "moon.sample.ImageHeaderSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit moon-header-sample",
	components: [
			{kind: "moon.Header", name:"imageHeader", content: "Image Header", titleAbove: "02", titleBelow: "Sub Header", subTitleBelow:"Sub-sub Header", backgroundSrc: "./assets/imageheader.jpg", classes:"moon-image-header-sample", components: [
				{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-like.png", ontap:"likeBig"},
				{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-next.png", ontap:"shareBig"}
			]}
	    ],
	    likeBig: function(inSender, inEvent) {
		this.$.imageHeader.setSubTitleBelow("Thanks for liking Enyo.");
	    },
	    shareBig: function(inSender, inEvent) {
		this.$.imageHeader.setSubTitleBelow("Please share Enyo.");
	    }
    });
