enyo.kind({
	name: "moon.sample.video.DetailNarrowSample2",
	kind: "moon.Panel",
	classes: "enyo-unselectable moon moon-video-detail",
	fit: true,
	spotlight: false,
	title: "Movie Name",
	titleAbove: "03",
	headerComponents: [
		{
			classes: "header",
			components: [
				{kind: "moon.IconButton", src: "assets/icon-download.png"},
				{
					kind: "moon.IconButton",
					src: "assets/icon-favorite.png",
					classes: "right-button"
				},
				{
					kind: "moon.IconButton",
					src: "assets/icon-next.png",
					classes: "right-button"
				}
			]
		}
	],
	components: [
		{kind: "enyo.Spotlight"},
		{
			kind: "FittableColumns",
			classes: "client",
			fit: true,
			components: [
				{
					name: "detail",
					classes: "detail",
					components: [
						{
							name: "preview",
							classes: "preview",
							spotlight: true,
							components: [{name: "play", classes: "play-icon"}]
						},
						{
							kind: "FittableColumns",
							classes: "info",
							components: [
								{
									style: "width: 26%;",
									components: [
										{
											kind: "FittableRows",
											classes: "group",
											components: [
												{
													kind: "moon.Divider",
													classes: "divider",
													content: "Rating"
												},
												{
													tag: "b",
													classes: "big",
													content: "PG-13"
												}
											]
										},
										{
											kind: "moon.CaptionDecorator",
											side: "top",
											content: "SD",
											components: [
												{
													kind: "moon.Button",
													components: [
														{
															content: "$",
															classes: "moon-pre-text"
														},
														{
															content: "3",
															classes: "moon-large-text"
														},
														{
															content: "99",
															classes: "moon-superscript"
														}
													]
												}
											]
										}
									]
								},
								{style: "width: 11%;"},
								{
									style: "width: 26%;",
									components: [
										{
											kind: "FittableRows",
											classes: "group",
											components: [
												{
													kind: "moon.Divider",
													classes: "divider",
													content: "Release Date"
												},
												{
													tag: "b",
													classes: "big",
													content: "2013"
												}
											]
										},
										{
											kind: "moon.CaptionDecorator",
											side: "top",
											content: "HD",
											components: [
												{
													kind: "moon.Button",
													components: [
														{
															content: "$",
															classes: "moon-pre-text"
														},
														{
															content: "6",
															classes: "moon-large-text"
														},
														{
															content: "99",
															classes: "moon-superscript"
														}
													]
												}
											]
										}
									]
								},
								{style: "width: 11%;"},
								{
									style: "width: 26%;",
									components: [
										{
											kind: "FittableColumns",
											classes: "group",
											components: [
												{
													kind: "FittableRows",
													fit: true,
													components: [
														{
															kind: "moon.Divider",
															classes: "divider",
															content: "Running Time"
														},
														{
															kind: "FittableColumns",
															components: [
																{
																	tag: "b",
																	classes: "big",
																	content: "122"
																},
																{
																	content: "min",
																	classes: "sub"
																}
															]
														}
													]
												}
											]
										},
										{
											kind: "moon.CaptionDecorator",
											side: "top",
											content: "3D",
											components: [
												{
													kind: "moon.Button",
													components: [
														{
															content: "$",
															classes: "moon-pre-text"
														},
														{
															content: "7",
															classes: "moon-large-text"
														},
														{
															content: "99",
															classes: "moon-superscript"
														}
													]
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					fit: true,
					components: [
						{
							kind: "moon.Divider",
							classes: "more-divider",
							content: "More"
						},
						{kind: "Group", components: [
							{kind: "moon.SelectableItem", content: "Synopsis"},
							{kind: "moon.SelectableItem", content: "Trailers"},
							{kind: "moon.SelectableItem", content: "Also Watched"},
							{kind: "moon.SelectableItem", content: "Recommendations"},
							{kind: "moon.SelectableItem", content: "Reviews"},
							{kind: "moon.SelectableItem", content: "Cast"}
						]}
					]
				}
			]
		}
	],

	rendered: function() {
		this.inherited(arguments);
		this.resizeHandler();
	},

	resizeHandler: function() {
		var w = this.$.detail.getBounds().width;
		var h = Math.round(w * 353 / 627);
		this.$.preview.setBounds({width: w, height: h});

		w = Math.round((w - 168) * 0.5);
		h = Math.round((h - 168) * 0.5);
		this.$.play.setStyle("margin: " + h + "px 0px 0px " + w + "px;");
	}
});
