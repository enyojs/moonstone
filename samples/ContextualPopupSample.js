enyo.kind({
	name: "moon.sample.ContextualPopupSample",
	kind: "FittableRows",
	classes: "enyo enyo-fit",
	components: [
		{kind: "onyx.Toolbar", name:"topToolbar", classes: "onyx-menu-toolbar", style:"background-color:lightgray", components: [
			{kind:"FittableColumns", style:"width:100%;", components:[
				{kind: "onyx.MenuDecorator", components: [
					{kind:onyx.IconButton, src: "assets/menu-icon-bookmark.png"},
					{kind: "moon.ContextualPopup",
						components: [
							{content:"testing 1"},
							{content:"testing 2"}
						]
					}
				]},
				{kind: "onyx.MenuDecorator", fit:true, style:"position:absolute;right:0;", components: [
					{kind:onyx.IconButton, src: "assets/menu-icon-bookmark.png"},
					{kind: "moon.ContextualPopup",
						components: [
							{content:"testing 1"},
							{content:"testing 2"},
							{content:"testing 3"},
							{content:"testing 4"},
							{content:"testing 5"},
							{content:"testing 6"}
						]
					}
				]}
			]}
		]},
		{kind: "Scroller", fit: true, thumb:false, components:[
			{name:"buttonContainer", kind:"FittableRows", classes:"onyx-contextualpopup-button-container enyo-fit", components:[
				//Top row of buttons
				{components:[
					{kind: "onyx.MenuDecorator", style:"display:inline-block", components: [
						{name:"test", content: "Average"},
						{kind: "moon.ContextualPopup",
							components: [
								{content:"Item 1"},
								{content:"Item 2"},
								{content:"Item 3"},
								{content:"Item 4"},
								{content:"Item 5"}
							]
						}
					]},

					{kind: "onyx.MenuDecorator", style:"display:inline-block;float:right", components: [
						{content:"Small"},
						{kind: "moon.ContextualPopup"}
					]}
				]},
				//Center row of buttons
				{fit:true, style:"padding-top:15%;padding-bottom:15%;", components:[
					{kind: "onyx.MenuDecorator", style:"display:inline-block;", components: [
						{content: "Wide"},
						{kind: "moon.ContextualPopup",
							style:"width:300px",
							components: [
								{kind: "Scroller", style:"min-width:150px;", horizontal:"auto",  touch:true, thumb:false,  components:[
									{content:"testing 1"},
									{content:"testing 2"}
								]}
							]
						}
					]},
					{kind: "onyx.MenuDecorator", style:"display:inline-block;float:right", components: [
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
					]}
				]},
				//Bottom row of buttons
				{components:[
					{kind: "onyx.MenuDecorator", style:"display:inline-block;", components: [
						{content: "Press Me"},
						{kind: "moon.ContextualPopup",
							style:"width:200px",
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
					{kind: "onyx.MenuDecorator", style:"display:inline-block;float:right", components: [
						{content:"Try Me"},
						{kind: "moon.ContextualPopup",
							style:"width:250px",
							components: [
								{content:"Item 1"},
								{content:"Item 2"},
								{content:"Item 3"},
								{content:"Item 4"},
								{content:"Item 5"}
							]
						}
					]}
				]}
			]}
		]},
		{kind: "onyx.Toolbar", name:"bottomToolbar", classes: "onyx-menu-toolbar", style:"background-color:lightgray", components: [
			{kind:"FittableColumns", style:"width:100%;", components:[
				{kind: "onyx.MenuDecorator", components: [
					{kind:onyx.IconButton, src: "assets/menu-icon-bookmark.png"},
					{kind: "moon.ContextualPopup",
						components: [
							{content:"testing 1"},
							{content:"testing 2"},
							{content:"testing 3"},
							{content:"testing 4"},
							{content:"testing 5"},
							{content:"testing 6"}
						]
					}
				]},
				{kind: "onyx.MenuDecorator", fit:true, style:"position:absolute;right:0;", components: [
					{kind:onyx.IconButton, src: "assets/menu-icon-bookmark.png"},
					{kind: "moon.ContextualPopup", name:"facebook",
						components: [
							{content:"testing 1"},
							{content:"testing 2"},
							{content:"testing 3"},
							{content:"testing 4"},
							{content:"testing 5"},
							{content:"testing 6"}
						]
					}
				]}
			]}
		]}
	],
	create: function(){
		this.inherited(arguments);
	}
});