enyo.kind({
	name: "moon.MovieImageItem",
	classes: "moon-movie-list-item moon-3h moon-8v",
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
	name: "moon.ContextualLoginPopup",
	kind: "moon.ContextualPopup",
	components: [
		{
			classes: "moon-5h moon-13v", // Do not define size on ContextualPopup directly.
			components: [
				{kind: "moon.Divider", content: "Log in to Service"},
				{kind: "moon.InputDecorator", spotlight: true, components: [
					{kind: "moon.Input", placeholder: "E-mail", onchange:""}
				]},
				{kind: "moon.InputDecorator", spotlight: true, components: [
					{kind: "moon.Input", type:"password", placeholder: "Password", onchange:""}
				]},
				{content: "Log in setting Menu asdf "},
				{kind: "moon.Button", classes: "moon-light-gray", content: "Log in"},
				{content: "or Connected with"},
				{kind: "moon.Button", classes: "moon-light-gray", content: "FACEBOOK"},
				{kind: "moon.Button", classes: "moon-light-gray", content: "TWITTER"}
			]
		}
	]
});

// Sample view

enyo.kind({
	name: "moon.sample.login.ContextualPopupSample",
	components: [{
		kind: "moon.Panels",
		pattern: "activity",
		classes: "enyo-fill",
		components: [
			{title: "Main Menu", classes:"moon-6h",	components: [
				{
					name: "menuList", 
					kind: "moon.DataList", 
					components: [
						{
							bindings: [
								{from: ".model.menuItem", to: ".$.panelItem.content"}
							],
							components: [
								{name: "panelItem", kind: "moon.Item", ontap: "changePanel"}
							]
						}
					]
				}
			]},
			{joinToPrev: true, components: [
				{kind: "moon.Scroller", fit: true, components: [
					{classes:"moon-vspacing", components: [
						{name: "contentList", kind: "enyo.DataGridList", scrollerOptions: { kind:"moon.Scroller"}, classes: "moon-3v", components: [
							{kind: "moon.MovieImageItem", bindings: [
								{from: ".model.itemOption", to: ".option"}
							]}
						]},
						{kind: "moon.ContextualPopupDecorator", components: [
							{kind: "moon.ContextualPopupButton", classes: "moon-3h", components: [
								{tag: "img", attributes: {src: "../assets/icon-half-like.png"}},
								{content: "Like"}
							]},
							{kind: "moon.ContextualLoginPopup"}
						]},
						{kind: "moon.ContextualPopupDecorator", components: [
							{classes: "moon-3h", content: "Share"},
							{kind: "moon.ContextualLoginPopup"}
						]}
					]}
				]}
			]}
		]
	}],

	bindings: [
		{from: ".controller.menus", to: ".$.menuList.controller"},
		{from: ".controller.contents", to: ".$.contentList.controller"}
	]
});

// Sample model

enyo.ready(function() {
	var sampleModel = new enyo.Model({
		menus: new enyo.Collection([
			{menuItem: "Browse Movies"},
			{menuItem: "Browse TV Shows"},
			{menuItem: "Queue"},
			{menuItem: "Search"}
		]),
		contents: new enyo.Collection([
			{itemOption: {src: "../assets/default-movie-vertical.png"}},
			{itemOption: {src: "../assets/default-movie-vertical.png"}},
			{itemOption: {src: "../assets/default-movie-vertical.png"}},
			{itemOption: {src: "../assets/default-movie-vertical.png"}}
		])
	});

//  Application to render sample

	new enyo.Application({
		view: {
			kind: "moon.sample.login.ContextualPopupSample",
			controller: ".app.controllers.movieController",
			classes: "moon enyo-fit enyo-unselectable"
		},
		controllers: [
			{
				name: "movieController",
				kind: "enyo.ModelController",
				model: sampleModel,
				changePanel: function(inSender, inEvent) {
					enyo.log("Item: " + inEvent.originator.parent.controller.model.get("menuItem"));
				}
			}
		]
	});
	
	console.clear();
});