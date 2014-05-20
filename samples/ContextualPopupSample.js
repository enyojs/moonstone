enyo.kind({
	name: "moon.sample.ContextualPopupSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{
			kind: "moon.ContextualPopupDecorator",
			style:"position: absolute; left: 0px; top: 0px;",
			components:
			[
				{content: "Average"},
				{
					kind: "moon.ContextualPopup",
					classes: "moon-2h moon-8v",
					components: [
						{content:"Item 1"},
						{content:"Item 2"},
						{content:"Item 3"}
					]
				}
			]
		},
		{kind: "moon.ContextualPopupDecorator", style:"position: absolute; right: 0px; top: 0px;", components: [
			{content:"Small", small:true},
			{kind: "moon.ContextualPopup"}
		]},
		{kind: "moon.ContextualPopupDecorator", style:"position: absolute; left: 0px; top: 25%;", components: [
			{content: "Left"},
			{
				kind: "moon.ContextualPopup",
				classes: "moon-3h moon-4v",
				components: [
					{content:"Item 1"},
					{content:"Item 2"},
					{content:"Item 3"}
				]
			}
		]},
		{kind: "moon.ContextualPopupDecorator", style:"position: absolute; right: 0px; top: 25%;", components: [
			{content:"Right", small:true},
			{kind: "moon.ContextualPopup", components: [
				{content:"Outside scroller", kind: "moon.Item"},
				{classes: "moon-8h moon-6v", components: [
					{kind: "moon.Scroller", classes: "enyo-fill", components: [
						{content:"testing 1", kind: "moon.Item"},
						{content:"testing 2", kind: "moon.Item"},
						{content:"testing 3", kind: "moon.Item"},
						{content:"testing 4", kind: "moon.Item"},
						{content:"testing 5", kind: "moon.Item"},
						{content:"testing 6", kind: "moon.Item"},
						{content:"testing 7", kind: "moon.Item"},
						{content:"testing 8", kind: "moon.Item"},
						{content:"testing 9", kind: "moon.Item"},
						{content:"testing 10", kind: "moon.Item"},
						{content:"testing 12", kind: "moon.Item"},
						{content:"testing 13", kind: "moon.Item"},
						{content:"testing 14", kind: "moon.Item"},
						{content:"testing 15", kind: "moon.Item"},
						{content:"testing 16", kind: "moon.Item"},
						{content:"testing 17", kind: "moon.Item"},
						{content:"testing 18", kind: "moon.Item"},
						{content:"testing 19", kind: "moon.Item"}
					]}

				]}
			]}
		]},
		{kind: "moon.ContextualPopupDecorator", style:"position: absolute; left: 0px; top: 45%;", components: [
			{content: "Wide"},
			{kind: "moon.ContextualPopup", classes: "moon-6h moon-4v", components: [
				{kind: "moon.Scroller", classes: "enyo-fill", components:[
					{content:"testing 1"},
					{content:"testing 2"}
				]}
			]}
		]},
		{kind: "moon.ContextualPopupDecorator", style:"position: absolute; right: 0px; top: 45%;", components: [
			{content:"Long but Small Button with truncation", small:true},
			{kind: "moon.ContextualPopup", components: [
				{content:"Outside scroller", kind: "moon.Item"},
				{classes: "moon-16v", components: [
					{kind: "moon.Scroller", classes: "enyo-fill", components: [
						{content:"testing 1", kind: "moon.Item"},
						{content:"testing 2", kind: "moon.Item"},
						{content:"testing 3", kind: "moon.Item"},
						{content:"testing 4", kind: "moon.Item"},
						{content:"testing 5", kind: "moon.Item"},
						{content:"testing 6", kind: "moon.Item"},
						{content:"testing 7", kind: "moon.Item"},
						{content:"testing 8", kind: "moon.Item"},
						{content:"testing 9", kind: "moon.Item"},
						{content:"testing 10", kind: "moon.Item"},
						{content:"testing 12", kind: "moon.Item"},
						{content:"testing 13", kind: "moon.Item"},
						{content:"testing 14", kind: "moon.Item"},
						{content:"testing 15", kind: "moon.Item"},
						{content:"testing 16", kind: "moon.Item"},
						{content:"testing 17", kind: "moon.Item"},
						{content:"testing 18", kind: "moon.Item"},
						{content:"testing 19", kind: "moon.Item"}
					]}

				]}
			]}
		]},
		{kind: "moon.ContextualPopupDecorator", style: "position: absolute; left: 0px; bottom: 0px;", components: [
			{content: "Spotlight Modal"},
			{
				kind: "moon.ContextualPopup",
				name: "buttonPopup",
				classes: "moon-8h moon-8v",
				modal: true,
				autoDismiss: false,
				spotlightModal: true,
				components: [
					{kind: "moon.Scroller", horizontal: "auto", classes: "enyo-fill", components: [
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
			{content: "Spottable", small:true},
			{
				kind: "moon.ContextualPopup",
				classes: "moon-9h moon-4v",
				components: [
					{kind: "moon.Scroller", horizontal: "auto", classes: "enyo-fill", components: [
						{kind: "moon.Button", content: "Button 1"},
						{kind: "moon.Button", content: "Button 2"},
						{kind: "moon.Button", content: "Button 3"}
					]}
				]
			}
		]},
		{kind: "moon.ContextualPopupDecorator", style:"position: absolute; left: 0px; top: 65%;", components: [
			{content: "Deactivated", disabled:true},
			{kind: "moon.ContextualPopup", classes: "moon-6h moon-4v", components: [
				{kind: "moon.Scroller", classes: "enyo-fill", components:[
					{content:"testing 1"},
					{content:"testing 2"}
				]}
			]}
		]},
		{kind: "moon.ContextualPopupDecorator", style:"position: absolute; right: 0px; top: 65%;", components: [
			{content: "Small Deactivated", small:true, disabled:true},
			{kind: "moon.ContextualPopup", classes: "moon-6h moon-4v", components: [
				{kind: "moon.Scroller", classes: "enyo-fill", components:[
					{content:"testing 1"},
					{content:"testing 2"}
				]}
			]}
		]}
	],
	buttonToggled: function(inSender, inEvent) {
		this.$.buttonPopup.setSpotlightModal(inSender.getActive());
		this.$.buttonPopup.setAutoDismiss(!inSender.getActive());
	}
});