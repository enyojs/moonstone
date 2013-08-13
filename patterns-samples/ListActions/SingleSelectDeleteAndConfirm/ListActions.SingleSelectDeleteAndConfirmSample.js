enyo.kind({
	name: "moon.sample.listactions.SingleSelectDeleteAndConfirmSample",
	fit: true,
	kind:"FittableRows",
	classes: "single-select-delete-and-confirm-pattern moon",
	handlers: {
		onActivate: "activateHandler"
	},
	components: [
		{kind: "enyo.Spotlight"},
		{classes:"left-panel", components:[
			{classes:"left-panel-content", components:[
				{content:"01", classes:"left-panel-number"},
				{content:"MAIN MENU", classes:"left-panel-title"}
			]}
		]},
		{classes:"right-panel", components:[
			{name: "header", kind:"moon.Header", title: "Browse Movies", titleAbove: "03", components: [
				{kind: "moon.ListActions", iconSrc:"../../../images/list-actions-activator.png", autoCollapse:true, listActions:[
					{components: [
						{kind: "moon.Divider", content:"Filter"},
						{kind: "moon.Scroller", components: [
							{kind: "Group", components: [
								{content:"New Releases", kind:"moon.CheckboxItem"},
								{content:"Most Popular", kind:"moon.CheckboxItem"},
								{content:"Action & Adventure", kind:"moon.CheckboxItem"},
								{content:"Comedy", kind:"moon.CheckboxItem"},
								{content:"Drama", kind:"moon.CheckboxItem"}
							]}
						]}
					]}
				]},
				{kind: "moon.IconButton", classes: "delete-button", src: "../assets/trash-can-icon.png", ontap: "deleteActivated"}
			]},
			{
				name: "list",
				kind: "moon.List",
				classes:"list",
				count:20,
				onSetupItem: "setupItem",
				components: [
					{name:"item", kind: "ListItem"}
				]
			}
		]}
	],
	setupItem: function(inSender, inEvent) {
		var i = inEvent.index;
		this.$.item.$.title.setContent("RECORDED TITLE " + i);
		this.$.item.$.date.setContent("3/15/2013");
		this.$.item.$.time.setContent("7:00 PM");
	},
	activateHandler: function(inSender, inEvent) {
		if (inEvent.toggledControl && inEvent.toggledControl.checked) {
			this.$.header.setTitleBelow(inEvent.toggledControl.getContent());
		}
	},
	deleteActivated: function(inSender, inEvent) {
		this.log("delete activated");
	}
});

enyo.kind({
	name: "ListItem",
	classes:"list-item",
	components: [
		{tag:"img", src:"../assets/movieImage.jpg", classes:"item-image"},
		{classes:"item-info", components:[
			{name:"title", classes:"item-title"},
			{name:"date", classes:"item-date"},
			{name:"time", classes:"item-time"}
		]}
	]
});