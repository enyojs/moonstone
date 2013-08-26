enyo.kind({
	name: "sun.sample.HeaderSample",
	kind: "FittableRows",
	handlers: {onHeaderLeftTapped: "arrowTapped"},
	classes: "sun moon enyo-unselectable enyo-fit sun-header-sample",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "sun.Scroller", fit:true, components: [
			{components: [
				{kind: "sun.Divider", content: "Basic Header"},
				{kind: "sun.Header", content: "Header", components: [
					{kind: "sun.IconButton", src: "assets/1080x1920/small-icon-close-button.png", small: true}
				]},
				{tag: "br"},
				
				{kind: "sun.Divider", content: "Optional Header"},
				{kind: "sun.Header", Toast: "buttonToast", content: "Header", arrowIcon: true, loading: true, progress: "33", components: [
					{kind: "sun.IconButton", src: "assets/1080x1920/small-icon-close-button.png", small: true},
					{kind: "sun.IconButton", src: "assets/1080x1920/small-icon-close-button.png", small: true},
					{name: "loading", kind: "sun.LoadingIconButton", src: "assets/1080x1920/small-icon-close-button.png", small: true, loading: true, ontap: "loadingButtonTapped"}
				]},
				{tag: "br"},
				
				{kind: "sun.Divider", content: "Sub Header & Arrow Icon"},
				{kind: "sun.Header", content: "Header", components: [
					{kind: "sun.IconButton", src: "assets/1080x1920/small-icon-close-button.png", small: true}
				]},
				{kind: "sun.Header", content: "Header", arrowIcon: true, components: [
					{kind: "sun.IconButton", src: "assets/1080x1920/small-icon-close-button.png", small: true}
				]},
				{kind: "sun.Header", content: "Small Header", titleBelow: "Sub Header", components: [
					{kind: "sun.IconButton", src: "assets/1080x1920/small-icon-close-button.png", small: true}
				]},
				{kind: "sun.Header", content: "Small Header", titleBelow: "Sub Header", arrowIcon: true, components: [
					{kind: "sun.IconButton", src: "assets/1080x1920/small-icon-close-button.png", small: true}
				]},
				{tag: "br"},
				
				{kind: "sun.Divider", content: "Input Header"},
				{kind: "sun.InputHeader", title:"Input Header", oninput:"handleInput", onchange:"handleChange",
				components: [
					{kind: "sun.IconButton", src: "assets/1080x1920/small-icon-close-button.png", small: true},
					{kind: "sun.IconButton", src: "assets/1080x1920/small-icon-close-button.png", small: true}
				]},
				{kind: "sun.InputHeader", title: "Small Header", titleBelow: "Sub Header", oninput:"handleInput", onchange:"handleChange",
				components: [
					{kind: "sun.IconButton", src: "assets/1080x1920/small-icon-close-button.png", small: true},
					{kind: "sun.IconButton", src: "assets/1080x1920/small-icon-close-button.png", small: true}
				]}
			]}
		]},
		{name: "arrowToast", kind: "sun.Toast", content: "Arrow Icon Tapped!!!"}
	],
	loadingButtonTapped: function(inSender, inEvent) {
		this.$.loading.setLoading(!this.$.loading.getLoading());
	},
	arrowTapped: function(inSender, inEvent) {
		this.$.arrowToast.hide();
		this.$.arrowToast.show();
	}
});
