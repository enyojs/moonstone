enyo.kind({
	name: "moon.sample.ContextualPopupSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.ContextualPopupDecorator", style:"position: absolute; left: 0px; top: 0px;", components: [
			{content: "Average"},
			{kind: "moon.ContextualPopup", classes: "moon-2h moon-1v",
				components: [
					{content:"Item 1"},
					{content:"Item 2"},
					{content:"Item 3"},
					// {content:"Item 4"},
					// {content:"Item 5"}
				]
			}
		]},
		{kind: "moon.ContextualPopupDecorator", style:"position: absolute; right: 0px; top: 0px;", components: [
			{content:"Small"},
			{kind: "moon.ContextualPopup"}
		]},
		{kind: "moon.ContextualPopupDecorator", style:"position: absolute; left: 0px; top: 45%;", components: [
			{content: "Wide"},
			{kind: "moon.ContextualPopup", classes: "moon-6h moon-1v",
				components: [
					{kind: "Scroller", horizontal:"auto",  touch:true, thumb:false, classes: "enyo-fill", components:[
						{content:"testing 1"},
						{content:"testing 2"}
					]}
				]
			}
		]},
		{kind: "moon.ContextualPopupDecorator", style:"position: absolute; right: 0px; top: 45%;", components: [
			{content:"Long"},
			{kind: "moon.ContextualPopup",
				components: [
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
					{content:"testing 30"}
				]
			}
		]},
		{kind: "moon.ContextualPopupDecorator", style:"position: absolute; left: 0px; bottom: 0px;", components: [
			{content: "Press Me"},
			{kind: "moon.ContextualPopup", classes: "moon-3h",
				components: [
					{content:"testing 1"},
					{content:"testing 2"},
					{content:"testing 3"},
					{content:"testing 4"},
					{content:"testing 5"},
					{content:"testing 6"},
					{content:"testing 7"},
					{content:"testing 9"},
					{content:"testing 10"}
				]
			}
		]},
		{kind: "moon.ContextualPopupDecorator", style:"position: absolute; right: 0px; bottom: 0px;", components: [
			{content:"Try Me"},
			{kind: "moon.ContextualPopup", classes: "moon-3h",
				components: [
					{content:"Item 1"},
					{content:"Item 2"},
					{content:"Item 3"},
					{content:"Item 4"},
					{content:"Item 5"}
				]
			}
		]}
	]
});