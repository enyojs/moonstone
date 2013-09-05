enyo.kind({
	name: "moon.MovieImageItem",
	classes: "moon-3h moon-4v",
	spotlight: true,
	published: {
		option: {
			src: "",
			caption: ""
		}
	},
	handlers: {
		onSpotlightFocused: "focused",
		onSpotlightBlur: "released"
	},
	components: [
		{name: "caption", classes: "moon-movie-list-item-text"}
	],
	create: function() {
		this.inherited(arguments);
		this.optionChanged();
	},
	getCaption: function() {
		return this.$.caption;
	},
	optionChanged: function(inOld) {
		this.applyStyle("background-image", 'url(' + this.option.src + ')');
		this.$.caption.setContent(this.option.caption);
	},
	focused: function() {
		this.$.caption.addClass("spotlight");
		return true;
	},
	released: function() {
		this.$.caption.removeClass("spotlight");
		return true;
	}
});

enyo.kind({
	name: "moon.sample.video.BrowserMoviesWideSample",
	kind: "moon.Panel",
	titleAbove: "02",
	title: "Browse Movies",
	headerComponents: [
		{kind: "moon.IconButton", src: "../assets/icon-list.png"}
	],
	components: [
/** If you want to use this template alone with spotlight, remove this comment out.
		{kind: "enyo.Spotlight"},
*/
		{
			name: "movieList",
			/* TODO: enyo.DataGridList should be changed to moon.DataGridList to support scroll */
			kind: "enyo.DataGridList",
			components: [
				{
					classes: "moon-movie-list-item ",
					bindings: [
						{from: ".model.option", to: ".$.movieImageItem.option"}
					],
					components: [
						{
							name: "movieImageItem",
							kind: "moon.MovieImageItem",
							ontap: "changeName"
						}
					]					
				}
			]
		}
	],
	bindings: [
		{from: ".controller.albums", to: ".$.movieList.controller"}
	]
});

// Sample model

enyo.ready(function(){
	var sampleModel = new enyo.Model({
		albums: new enyo.Collection([
			{option: {src: "../assets/default-music.png", caption: "Movie Name"}},
			{option: {src: "../assets/default-music.png", caption: "Movie Name"}},
			{option: {src: "../assets/default-music.png", caption: "Movie Name"}},
			{option: {src: "../assets/default-music.png", caption: "Movie Name"}},
			{option: {src: "../assets/default-music.png", caption: "Movie Name"}},
			{option: {src: "../assets/default-music.png", caption: "Movie Name"}},
			{option: {src: "../assets/default-music.png", caption: "Movie Name"}},
			{option: {src: "../assets/default-music.png", caption: "Movie Name"}},
			{option: {src: "../assets/default-music.png", caption: "Movie Name"}},
			{option: {src: "../assets/default-music.png", caption: "Movie Name"}}
		])
	});

//  Application to render sample

	new enyo.Application({
		view: {
			classes: "enyo-unselectable moon",
			components: [
				{
					kind: "moon.sample.video.BrowserMoviesWideSample",
					controller: ".app.controllers.movieController",
					classes: "enyo-fit"
				}
			]
		},
		controllers: [
			{
				name: "movieController",
				kind: "enyo.ModelController",
				model: sampleModel,
				changeName: function(inSender, inEvent) {
					inSender.getCaption().setContent("Result");
				}
			}
		]
	});
});
