enyo.kind({
	name: "moon.sample.photos.PhotoDetailWideSample",
	kind : "moon.Panel",
	classes: "moon enyo-unselectable photo-detail",
	fit: true,
	title : "PHOTO NAME",
	titleAbove : "03",
	titleBelow : "2013-04-08",
	headerComponents : [
		{ kind : "moon.IconButton", classes : "header-icon", src : "assets/icon-favorite.png" },
		{ kind : "moon.IconButton", classes : "header-icon", src : "assets/icon-download.png"},
		{ kind : "moon.IconButton", classes : "header-icon", src : "assets/icon-next.png"}
	],
	components: [
		{kind : "enyo.Spotlight"},
		{
			kind : "FittableColumns",
			components : [
				{
					style : "width : 50%;",
					components : [
						{
							kind : "enyo.Image",
							classes : "main-photo",
							src : "assets/default-movie.png"
						}
					]
				},
				{
					style : "width : 3%;"
				},
				{
					style : "width : 47%;",
					kind : "FittableRows",
					components : [
						{
							kind: "moon.RadioButtonGroup",
							onActivate: "buttonActivated",
							components: [
								{name : "button-desc", classes : "radio-button", content: "DESCRIPTION"},
								{name : "button-comments", classes : "radio-button", content: "COMMENTS(98)"},
								{name : "button-likes", classes : "radio-button", content: "LIKES(387)"},
								{name : "button-albums", classes : "radio-button", content: "ALBUMS(5)"}
							]
						},
						{ kind : "moon.Divider", classes : "divider" },
						{
							name : "mainContent",
							components : [
								{
									name : "panels",
									arrangerKind: "CardSlideInArranger",
									kind: "Panels",
									classes: "photo-panels",
									index:0,
									fit:true,
									realtimeFit: true,
									components: [
										{
											kind : "moon.sample.photos.PhotoDetailWideSample.description"
										},
										{
											kind : "moon.sample.photos.PhotoDetailWideSample.description"
										},
										{
											kind : "moon.sample.photos.PhotoDetailWideSample.description"
										},
										{
											kind : "moon.sample.photos.PhotoDetailWideSample.description"
										}
									]
								}
							]
						}
					]
				}
			]
		}
	],

	buttonActivated: function(inSender, inEvent) {
		if ((inEvent.originator.getActive()) && (inEvent.originator.kind === "moon.RadioButton")) {
			var tName = inEvent.originator.name;

			if(tName == "button-desc"){
				this.$.panels.setIndex(0);
			} else if(tName=="button-comments"){
				this.$.panels.setIndex(1);
			} else if(tName=="button-likes"){
				this.$.panels.setIndex(2);
			} else if(tName=="button-albums"){
				this.$.panels.setIndex(3);
			}
		}
	}
});

enyo.kind({
	name : "moon.sample.photos.PhotoDetailWideSample.description",
	kind : "moon.Scroller",
	components : [
		{
			style: "text-transform:none;white-space:normal;font-align:left; font-size:32px; line-height:36px; padding : 0px 10px 0px 10px;",
			content: "Pixar genius reigns in this funny romantic comedy, which stars a robot who says absolutely nothing for a full 25 minutes yet somehow completely transfixes and endears himself to the audience within the first few minutes of the film. As the last robot left on earth, Wall-E (voiced by Ben Burtt) is one small robot--with a big, big heart--who holds the future of earth and mankind squarely in the palm of his metal hand. He's outlasted all the \"Waste Allocation Load Lifter Earth-Class\" robots that were assigned some 700 years ago to clean up the environmental mess that man made of earth while man vacationed aboard the luxury spaceship Axiom."
		}
	]
});