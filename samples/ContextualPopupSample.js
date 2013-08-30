enyo.kind({
	name: "moon.sample.ContextualPopupSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{
			kind: "moon.ContextualPopupDecorator",
			style:"position: absolute; left: 0px; top: 0px;",
			components:
			[
				{content: "Average"},
				{
					kind: "moon.ContextualPopup",
					classes: "moon-2h moon-1v",
					components: [
						{content:"Item 1"},
						{content:"Item 2"},
						{content:"Item 3"}
					]
				}
			]
		},
		{kind: "moon.ContextualPopupDecorator", style:"position: absolute; right: 0px; top: 0px;", components: [
			{content:"Small"},
			{kind: "moon.ContextualPopup"}
		]},
		{kind: "moon.ContextualPopupDecorator", style:"position: absolute; left: 0px; top: 45%;", components: [
			{content: "Wide"},
			{kind: "moon.ContextualPopup", classes: "moon-6h moon-1v", components: [
				{kind: "moon.Scroller", classes: "enyo-fill", components:[
					{content:"testing 1"},
					{content:"testing 2"}
				]}
			]}
		]},
		{kind: "moon.ContextualPopupDecorator", style:"position: absolute; right: 0px; top: 45%;", components: [
			{content:"Long Button with truncation"},
			{kind: "moon.ContextualPopup", components: [
				{classes: "moon-3h moon-4v", components: [
					{kind: "moon.Scroller", classes: "enyo-fill", components: [
						{content:"testing 1"},
						{content:"testing 2"},
						{content:"testing 3"},
						{content:"testing 4"},
						{content:"testing 5"},
						{content:"testing 6"},
						{content:"testing 7"},
						{content:"testing 9"},
						{content:"testing 10"},
						{content:"testing 11"},
						{content:"testing 12"},
						{content:"testing 13"},
						{content:"testing 14"},
						{content:"testing 15"},
						{content:"testing 16"},
						{content:"testing 17"},
						{content:"testing 18"},
						{content:"testing 19"},
						{content:"testing 20"},
						{content:"testing 21"},
						{content:"testing 22"},
						{content:"testing 23"},
						{content:"testing 24"},
						{content:"testing 25"},
						{content:"testing 26"},
						{content:"testing 27"},
						{content:"testing 28"},
						{content:"testing 29"},
						{content:"testing 30"},
						{content:"testing 31"},
						{content:"testing 32"},
						{content:"testing 33"},
						{content:"testing 34"},
						{content:"testing 35"}
					]}
				]}
			]}
		]},
		{kind: "moon.ContextualPopupDecorator", style: "position: absolute; left: 0px; bottom: 0px;", components: [
			{content: "Spotlight Modal"},
			{
				kind: "moon.ContextualPopup",
				name: "buttonPopup",
				classes: "moon-6h moon-2v",
				modal: true,
				autoDismiss: false,
				spotlightModal: true,
				components: [
					{kind: "Scroller", horizontal: "auto", touch: true, thumb: false, classes: "enyo-fill", components: [
						{kind: "moon.Button", content: "Button"},
						{kind: "moon.ToggleButton", content: "SpotlightModal", active: true, ontap: "buttonToggled"},
						{tag: "br"},
						{tag: "br"},
						{kind: "moon.InputDecorator", spotlight: true, components: [
							{kind: "moon.Input", placeholder: "USERNAME"}
						]}
					]}
				]
			}
		]},
		{kind: "moon.ContextualPopupDecorator", style: "position: absolute; right: 0px; bottom: 0px;", components: [
			{content: "Spottable"},
			{
				kind: "moon.ContextualPopup",
				classes: "moon-6h moon-2v",
				style: "height:270px;",
				components: [
					{kind: "Scroller", horizontal: "auto", touch: true, thumb: false, classes: "enyo-fill", components: [
						{kind: "moon.Button", content: "Button 1"},
						{kind: "moon.Button", content: "Button 2"},
						{kind: "moon.Button", content: "Button 3"}
					]}
				]
			}
		]}
	],
	buttonToggled: function(inSender, inEvent) {
		this.$.buttonPopup.setSpotlightModal(inSender.getActive());
	}
});