//// Temp..
enyo.kind({
	name: "UI.Name",
	classes: "moon-controls-headline-wrapper",
	allowHtml: true
});

enyo.kind({
	name: "UI.Below",
	classes: "moon-controls-subine-wrapper",
	allowHtml: true
});

enyo.kind({
	name: "moon.sample.OnePageControlSample",
	kind: "moon.Scroller",
	horizontal: "hidden",
	published: {
		flag: true
	},
	classes: "moon enyo-unselectable",
	components: [
		{kind: "enyo.Spotlight"},
		{style: "background-color: black; padding 5px; height: 60px; width: 100%; z-index: 10;", components: [
			{name: "classesButton", kind: "moon.RadioButtonGroup", onActivate: "buttonActivated", components: [
				{content: "moon-light-gray", active: true},
				{content: "moon-dark-gray"}
			]}
		]},
		{kind: "enyo.Image", style: "width:100%", src: "./assets/Header.png"},

		{kind: "FittableColumns", components: [
			// LEFT COLUMN
			{classes: "moon-control-sample-body-wrapper",
				components: [
					//////////////////////////////////
					// ITEM
					{kind: "UI.Name", content: "ITEM"},
					{kind: "Group", classes: "moon-controls-item-wrapper subitem",
						components: [
							{name: "item1", kind: "moon.SelectableItem", content: "Vanilla" },
							{name: "item2", kind: "moon.SelectableItem", content: "Chocolate"},
							{name: "item3", kind: "moon.SelectableItem", content: "Strawberry"}
					]},
					//////////////////////////////////
					// SELECTABLE ITEM EX VIEW
					{kind: "UI.Name", content: "SELECTABLE ITEM"},
					{classes: "moon-controls-item-wrapper subitem",
						components: [
							{name: "item4", kind: "moon.SelectableItem", content: "Vanilla"},
							{name: "item5", kind: "moon.SelectableItem", content: "Chocolate"},
							{name: "item6", kind: "moon.SelectableItem", content: "Strawberry"}
					]},
					// SELECTABLE ITEM with COLOR FADES EX VIEW
					{kind: "UI.Name", content: "SELECTABLE ITEM"},
					{kind: "UI.Below", content: "AFTER SELECTION COLOR FADES TO GRAY"},
					{classes: "moon-controls-item-wrapper subitem",
						components: [
							{name: "item7", kind: "moon.SelectableItem", content: "Vanilla"},
							{name: "item8", kind: "moon.SelectableItem", content: "Chocolate"},
							{name: "item9", kind: "moon.SelectableItem", content: "Strawberry"}
					]},
					// CHECKBOX ITEM EX VIEW
					{kind: "UI.Name", content: "CHECKBOX ITEM"},
					{classes: "moon-controls-item-wrapper subitem adjust",
						components: [
							{name: "check1", kind: "moon.LabeledCheckbox", content: "Vanilla"},
							{name: "check2", kind: "moon.LabeledCheckbox", content: "Chocolate"	},
							{name: "check3", kind: "moon.LabeledCheckbox", content: "Strawberry"},
							{name: "check4", kind: "moon.LabeledCheckbox", content: "Rocky Road"}
					]},
					//////////////////////////////////
					// EXPANDABLE PICKER ITEM
					{kind: "UI.Name", content: "EXPANDABLE PICKER"},
					{name: "expicker1", kind: "moon.ExpandablePicker", classes: "moon-controls-item-wrapper adjust",
						content: "Select Your Flavors",
						components: [
							{name: "exItem1", content: "Vanilla"},
							{name: "exItem2", content: "Chocolate"},
							{name: "exItem3", content: "Strawberry"}
					]},
					// EXPANDABLE PICKER ITEM EX VIEW
					{name: "expicker2", kind: "moon.ExpandablePicker", classes: "moon-controls-item-wrapper adjust",
						content: "Select a flavor",
						components: [
							{name: "exItem4", content: "Vanilla"},
							{name: "exItem5", content: "Chocolate"},
							{name: "exItem6", content: "Strawberry"}
					]},
					//////////////////////////////////
					// DIVIDER ITEM
					{kind: "UI.Name", content: "DIVIDER"},
					{classes: "moon-controls-item-wrapper adjust", components: [
							{kind: "moon.Divider", content: "Dogs"},
							{name: "divitem1", kind: "moon.Item", content: "Bulldoc"},
							{name: "divitem2", kind: "moon.Item", content: "Cocker Spaniel"},
							{name: "divitem3", kind: "moon.Item", content: "Foxhound"}
					]},
					// DIVIDER ITEM EX VIEW
					{classes: "moon-controls-item-wrapper adjust", components: [
							{kind: "moon.Divider", content: "Cats"},
							{name: "divitem4", kind: "moon.Item", content: "Bengal"},
							{name: "divitem5", kind: "moon.Item", content: "Bobtail"},
							{name: "divitem6", kind: "moon.Item", content: "Cornish Rex"}
					]},
					//////////////////////////////////
					// ACCORDION ITEM
					{kind: "UI.Name", content: "ACCORDION"},
					{name: "accGroup1", kind: "Group", classes: "moon-controls-item-wrapper subitem",
					 	components: [		
			        		{name: "accord1", kind: "moon.Accordion", content: "Lyrics", components: [
			                	{content: "--"},
			                	{content: "--"}
			            	]},
			            	{name: "accord2", kind: "moon.Accordion", content: "Artist", components: [
			              		{content: "--"},
			                	{content: "--"}
			            	]},
			            	{name: "accord3", kind: "moon.Accordion", content: "Album", components: [
			              		{content: "Hometown Glory"},
			                	{content: "Sweet 21"},
			                	{content: "Running To Nowhere But Home"}
			            	]},
			            	{name: "accord4", kind: "moon.Accordion", content: "Stuff", components: [
			              		{content: "--"},
			                	{content: "--"}
			            	]},
			            	{name: "accord5", kind: "moon.Accordion", content: "Whatever", components: [
			              		{content: "--"},
			                	{content: "--"}
			            	]}
					]},
					// ACCORDION ITEM EX VIEW
					{name: "accGroup2", kind: "Group", classes: "moon-controls-item-wrapper subitem",
						components: [
			            	{name: "accord6", kind: "moon.Accordion", content: "Lyrics", components: [
			                	{content: "--"},
			                	{content: "--"}
			            	]},
			            	{name: "accord7", kind: "moon.Accordion", content: "Artist", components: [
			              		{content: "--"},
			                	{content: "--"}
			            	]},
			            	{name: "accord8", kind: "moon.Accordion", content: "Album", components: [
			              		{name: "accItem1", content: "Hometown Glory"},
			                	{name: "accItem2", content: "Sweet 21"},
			                	{name: "accItem3", content: "Running To Nowhere But Home"}
			            	]},
			            	{name: "accord9", kind: "moon.Accordion", content: "Stuff", components: [
			              		{content: "--"},
			                	{content: "--"}
			            	]},
			            	{name: "accord10", kind: "moon.Accordion", content: "Whatever", components: [
			              		{content: "--"},
			                	{content: "--"}
			            	]}
				    ]},
				    //////////////////////////////////
					// TOGGLE ITEM
					{kind: "UI.Name", content: "TOGGLE ITEM"},
					{classes: "moon-controls-item-wrapper adjust", components: [
							{name: "toggItem1", kind: "moon.LabeledToggleButton", content: "Vanilla"},
							{name: "toggItem2", kind: "moon.LabeledToggleButton", content: "Chocolate"},
							{name: "toggItem3", kind: "moon.LabeledToggleButton", content: "Strawberry"}
					]},
					//////////////////////////////////
					// TOGGLE BUTTON ITEM : TO BE ADDED 
					{kind: "UI.Name", content: "TOGGLE BUTTON"},
					{classes: "enyo-children-inline moon-controls-spacing subitem",	components: [
							{kind: "moon.ToggleButton", content: "ITEM:OFF"},
							{kind: "moon.ToggleButton", content: "ITEM:ON"}
					]},
					//////////////////////////////////
					// RADIO CONTROL GROUP
					{kind: "UI.Name", content: "RADIO ITEM GROUP"},
					{classes: "moon-controls-item-wrapper subitem", components: [
						{name: "radioCtrl1", kind: "moon.RadioButtonGroup",  components: [
							{name: "radioItem1", content: "All"},
							{name: "radioItem2", content: "Online"},
							{name: "radioItem3", content: "Skype"}
						]},
						// RADIO CONTROL GROUP EX VIEW
						{name: "radioCtrl2", kind: "moon.RadioButtonGroup", components: [
							{name: "radioItem4", content: "All"},
							{name: "radioItem5", content: "Online"},
							{name: "radioItem6", content: "Skype"}
						]},
						{name: "radioCtrl3", kind: "moon.RadioButtonGroup", components: [
							{name: "radioItem7", content: "All"},
							{name: "radioItem8", content: "Online"},
							{name: "radioItem9", content: "Skype"}
						]}
					]}
				]
			},
			// CENTER COLUMN
			{classes: "moon-control-sample-body-wrapper",
				components: [
					//////////////////////////////////
					// SIMPLE PICKER
					{kind: "UI.Name", content: "SIMPLE PICKER"},
					{name: "picker1", kind:"moon.SimplePicker", 
					classes: "moon-controls-item-wrapper adjust",
						components: [
							{content:"Supercalifragilistice"},
							{content:"Supercalifragilistice"},
							{content:"Supercalifragilistice"}
					]},
					{tab: "br"},
					{name: "picker2", kind:"moon.SimplePicker", 
					classes: "moon-controls-item-wrapper adjust",
						components: [
							{content:"Supercalifragilistice"},
							{content:"Supercalifragilistice"},
							{content:"Supercalifragilistice"}
					]},
					{tab: "br"},
					//////////////////////////////////
					// DATE PICKER
					{kind: "UI.Name", content: "DATE PICKER"},
					{name: "datePicker1", classes: "moon-controls-item-wrapper adjust", kind: "moon.DatePicker", content: "Select a Date"},
					{tag:"br"},	
					{name: "datePicker2", classes: "moon-controls-item-wrapper adjust", kind: "moon.DatePicker", content: "Select a Date"},
					//////////////////////////////////
					// CALENDAR PICKER
					{kind: "UI.Name", content: "CALENDAR PICKER"},
					{kind: "moon.Calendar", classes: "moon-controls-item-wrapper subitem", content: "Calendar"},
					{tag:"br"},
					{tag:"br"},
					//////////////////////////////////
					// SLIDER/PROGRESS BAR
					{kind: "UI.Name", content: "SLIDER/PROGRESS BAR"},
					{classes:"moon-controls-item-wrapper adjust subitem", components: [
						//////////////////////////////////
						// PROGRESS BAR
						{kind: "UI.Name", content: "PROGRESS BAR"},
						{name: "sldctrl1", kind: "moon.ProgressBar", progress: 65, bgProgress: 85, popupColor: "@moon-dark-gray"},
						//////////////////////////////////
						// SLIDER BAR
						{kind: "UI.Name", content: "SLIDER/NO FOCUS"},
						{name: "sldctrl2", kind: "moon.Slider", barClasses: ".moon-slider-knob",
						 	lockBar: true, value: 65, bgProgress: 85, progress: 65, popupColor: "@moon-dark-gray"},
						//////////////////////////////////
						// Silder Control ex
						{kind: "UI.Name", content: "SLIDER/SELECTED STATE (5WAY)"},
						{name: "sldctrl3", kind: "moon.Slider", barClasses: ".moon-slider-knob",
						 	lockBar: true, value: 65, bgProgress: 85, progress: 65, popupColor: "@moon-dark-gray"},
						// Silder Control ex
						{kind: "UI.Name", content: "SLIDER/FOCUS (ON PRESS)"},
						{kind: "UI.Below", content: "INDICATOR IN OPTIONAL"},
						{name: "sldctrl4", kind: "moon.Slider", barClasses: ".moon-slider-knob",
						 	lockBar: false, value: 65, bgProgress: 85, progress: 65, popupColor: "@moon-dark-gray"},
					]},
					//////////////////////////////////
					// INPUT Single line
					{kind: "UI.Name", content: "INPUT (SINGLE LINE)"},
					{classes:"moon-controls-item-wrapper subitem", components: [
						{name: "indeco1", kind: "moon.InputDecorator", components: [
							{name: "intext1", kind: "moon.Input", placeholder: "just type"},
							{kind: "Image", src: "./assets/search-input-search.png"}
						]},
						{tag: "br"},
						{tag: "br"},
						{name: "indeco2", kind: "moon.InputDecorator", components: [
							{name: "intext2", kind: "moon.Input", placeholder: "just type"},
							{kind: "Image", src: "./assets/search-input-search.png"}
						]},	
						{tag: "br"},
						{tag: "br"},
						{name: "indeco3", kind: "moon.InputDecorator", components: [
							{name: "intext3", kind: "moon.Input"},
							{kind: "Image", src: "./assets/search-input-search.png"}
						]}
					]},
					//////////////////////////////////
					// Text area (Multiple Line)
					{kind: "UI.Name", content: "TEXT AREA (MULTIPLE LINE)"},
					{classes:"moon-controls-item-wrapper subitem", components: [
						{kind: "UI.Name", content: "NORMAL"},
						{tag:"br"},	
						{name: "indeco4", kind: "moon.InputDecorator", components: [
        					{name: "intext4",kind: "moon.RichText", 
        						value: "Lorem ipsum dolor sit amet, consect <br>\
										etur adipis icing elit, sed do eiusmod <br>\
										tempor incididunt utre labore et dolor"}
						]},
						{tag:"br"},	
						{tag:"br"},	
						{kind: "UI.Name", content: "FOCUS (HOVER)"},
						{tag:"br"},	
						{name: "indeco5", kind: "moon.InputDecorator", components: [
        					{name: "intext5",  kind: "moon.RichText", 
        						value: "Lorem ipsum dolor sit amet, consect <br>\
										etur adipis icing elit, sed do eiusmod <br>\
										tempor incididunt utre labore et dolor"}
						]},
						{tag:"br"},	
						{tag:"br"},	
						{kind: "UI.Name", content: "ACTIVE (TEXT ENTRY W/CURSOR AND SCROLL INDICATOR"},
						{tag:"br"},	
						{name: "indeco6", kind: "moon.InputDecorator", components: [
							{name: "intext6", kind: "moon.RichText",
								value: "Lorem ipsum dolor sit amet, consect <br>\
										etur adipis icing elit, sed do eiusmod <br>\
										tempor incididunt utre labore et dolor"}
						]},
						{tag:"br"},
						{tag:"br"}
					]},
					//////////////////////////////////
					// Tool Tip
					{kind: "UI.Name", content: "TOOL TIP"},
					{classes: "enyo-children-inline moon-controls-spacing", components: [
						//	{kind: "moon.Tooltip", content: "6 NEW MESSAGES"},
						//	{kind: "moon.Tooltip", content: "21"}
							{kind: "enyo.Popup", classes: "moon-slider-popup", popupColor: "@moon-dark-gray", content: "6 NEW MESSAGES"},
							{kind: "enyo.Popup", classes: "moon-slider-popup", popupColor: "@moon-dark-gray", content: "21"}
					]},	
					{tag: "br"},			
					{tag: "br"},
					//////////////////////////////////
					// HEADER	
					{kind: "UI.Name", content: "HEADER"},	
					{tag: "br"},
					{kind: "moon.Divider", classes: "moon-controls-item-wrapper adjust"},
					{classes: "moon-controls-item-wrapper adjust", components: [				
				    	{name: "header", kind:"moon.Header", title: "Header", titleAbove: "01", components: [
				            {kind: "moon.IconButton", src: "./assets/icon-list.png"}
				        ]},
				     	{
							kind: "moon.ImageItem",
							source: "./assets/movie-brazil.png",
							label: "Brazil",
							text: "Sam Lowry is low-level bureaucrat trapped in a needlessly inefficient near-future society."
						},
						{
							kind: "moon.ImageItem",
							source: "./assets/movie-coffee-and-cigarettes.png",
							label: "Coffe and Cigarettes",
							text: "A series of vignettes directed by Jim Jarmusch. With Roberto Benigni, Tom Waits, RZA, Bill Murray."
						},
						{
							kind: "moon.ImageItem",
							source: "./assets/movie-the-cremaster-cycle.png",
							label: "The Cremaster Cycle",
							text: "The Cremaster Cycle is an art project consisting of five films with related sculptures, pho-tographs and drawings."
						}
					]}
			]},
			// 
			{classes: "moon-control-sample-body-wrapper",
				components: [
					//////////////////////////////////
					// BUTTON-LARGE : TO BE ADDED
					{kind: "UI.Name", content: "BUTTON-LARGE"},
					{classes: "enyo-children-inline moon-controls-spacing", 
						components: [
							{name: "bLarge1", kind: "moon.Button", content: "ABC"},
							{name: "bLarge2", kind: "moon.Button", content: "ABCDEFGHIJKLMNOPQ"},
							{kind: "UI.Below", content: "Normal"}
					]},
					{tag: "br"},		
					{classes: "enyo-children-inline moon-controls-spacing", 
						components: [
							{name: "bLarge3", kind: "moon.Button", content: "ABC"},
							{name: "bLarge4", kind: "moon.Button", content: "ABCDEFGHIJKLMNOPQ"},
							{kind: "UI.Below", content: "Focus"}
					]},
					{classes: "enyo-children-inline moon-controls-spacing", 
						components: [
							{name: "bLarge5", kind: "moon.Button", content: "ABC"},
							{name: "bLarge6", kind: "moon.Button", content: "ABCDEFGHIJKLMNOPQ"},
							{kind: "UI.Below", content: "Selected"}
					]},
					{classes: "enyo-children-inline moon-controls-spacing", 
						components: [
							{name: "bLarge7",kind: "moon.Button", content: "ABC", disabled: true},
							{name: "bLarge8",kind: "moon.Button", content: "ABCDEFGHIJKLMNOPQ", disabled: true},
							{kind: "UI.Below", content: "Deactivated"}
					]},
					{classes: "enyo-children-inline moon-controls-spacing", 
						components: [
							{kind: "moon.CaptionDecorator", side: "top", content: "Caption", 
								components: [
									{name: "bLarge9", kind: "moon.Button", content: "ABC"}
							]},
							{kind: "UI.Below", allowHtml: true,
							 content: "Note: Captions are optional and can <br> \
										be placed top, right, bottom or left."}
					]},
					//////////////////////////////////
					// BUTTON-SMALL : TO BE ADDED
					{kind: "UI.Name", content: "BUTTON-SMALL"},
					{classes: "enyo-children-inline moon-controls-spacing", 
						components: [
							{name: "bSmall1",kind: "moon.Button", content: "ABC"},
							{name: "bSmall2",kind: "moon.Button", content: "ABCDEFGH"},
							{kind: "UI.Below", content: "Normal"}
					]},	
					{classes: "enyo-children-inline moon-controls-spacing",
						components: [
							{name: "bSmall3", kind: "moon.Button", content: "ABC"},
							{name: "bSmall4", kind: "moon.Button", content: "ABCDEFGH"},
							{kind: "UI.Below", content: "Focus"}
					]},
					{classes: "enyo-children-inline moon-controls-spacing",
						components: [
							{name: "bSmall5", kind: "moon.Button", content: "ABC"},
							{name: "bSmall6", kind: "moon.Button", content: "ABCDEFGH"},
							{kind: "UI.Below", content: "Selected"}
					]},
					{classes: "enyo-children-inline moon-controls-spacing",
						components: [
							{name: "bSmall7", kind: "moon.Button", content: "ABC", disabled: true},
							{name: "bSmall8", kind: "moon.Button", content: "ABCDEFGH", disabled: true},
							{kind: "UI.Below", content: "Deactivated", disabled: true}
					]},
					{classes: "enyo-children-inline moon-controls-spacing",
						components: [
							{kind: "moon.CaptionDecorator", side: "top", allowHtml: true,
								content: "Caption", 
									components: [
										{name: "bSmall9", kind: "moon.Button", content: "ABC"}
							]},
							{kind: "UI.Below", allowHtml: true,
							 content: "Note: Small buttons are 60px in diameter but have a<br> \
									   78px target area. Buttons must be spaced to<br> \
									   accomodate the target area."}
					]},
					//////////////////////////////////
					// ICON BUTTONS
					{kind: "UI.Name", content: "ICON BUTTONS"},
					{components: [
						{
							classes: "enyo-children-inline moon-controls-spacing", 
							components: [
								{name: "bIcon1",kind: "moon.IconButton", src: "./assets/icon-favorite.png"},
								{name: "bIcon2",kind: "moon.IconButton", src: "./assets/icon-next.png"},
								{content: "Normal"}
						]},	
						{
							classes: "enyo-children-inline moon-controls-spacing", 
							components: [
								{name: "bIcon3", kind: "moon.IconButton", src: "./assets/icon-favorite.png"},
								{name: "bIcon4", kind: "moon.IconButton", src: "./assets/icon-next.png"},
								{content: "Focus"}
						]},
						{
							classes: "enyo-children-inline moon-controls-spacing", 
							components: [
								{name: "bIcon5", kind: "moon.IconButton", src: "./assets/icon-favorite.png"},
								{name: "bIcon6", kind: "moon.IconButton", src: "./assets/icon-next.png"},
								{content: "Selected"}
						]},
						{
							classes: "enyo-children-inline moon-controls-spacing", 
								components: [
									{name: "bIcon7", kind: "moon.IconButton", src: "./assets/icon-favorite.png", disabled: true},
									{name: "bIcon8", kind: "moon.IconButton", src: "./assets/icon-next.png", disabled: true},
									{content: "Deactivated"}
							]
						}
					]},
					{tag: "br"},
					{tag: "br"},	
					//////////////////////////////////
					// Contextual Popup Sample
					{kind: "UI.Name", content: "CONTEXTUAL POPUP AND BUTTON"},
			        {tag: "br"},
			        {tag: "br"},
					{kind: "moon.ContextualPopupDecorator", components: [
						{content:"BUTTON"},
						{name: "ctxPopup1", kind: "moon.ContextualPopup", 
							components: [
								{content:"Sub-Header"},
								{content:"Sub-Sub-Header"},
								{kind: "enyo.Image", style: "width:30%", src: "./assets/contextpopup.png"},
								{allowHtml: true, classes: "enyo-unselectable", content:
									"Lorem ipsum dolor sit<br>\
									amet, consect etur adipis<br>\
									icing elit, sed do eiusmod<br>\
									tempor incididunt utre<br>\
									labore et dolor magna<br>\
									aliqua. Ut enim ad minim<br>\
									veniam, quis nostrud."}
							]
						}
					]},
					{tag: "br"},
			        {tag: "br"},
			        //////////////////////////////////
					// Contextual Popup Sample
					{kind: "moon.ContextualPopupDecorator", components: [
						{content:"BUTTON"},
						{name: "ctxPopup2", kind: "moon.ContextualPopup", 
							components: [
								{content:"Sub-Header"},
								{content:"Sub-Sub-Header"},
								{kind: "enyo.Image", style: "width:30%", src: "./assets/contextpopup.png"},
								{allowHtml: true, content:
									"Lorem ipsum dolor sit<br>\
									amet, consect etur adipis<br>\
									icing elit, sed do eiusmod<br>\
									tempor incididunt utre<br>\
									labore et dolor magna<br>\
									aliqua. Ut enim ad minim<br>\
									veniam, quis nostrud."}
							]
						}
					]},
					{tag: "br"},
					{tag: "br"},
					//////////////////////////////////
					// LIST action	
					{kind: "UI.Name", content: "LIST ACTIONS"},	
					{tag: "br"},
					{tag: "br"},
					{components: [
						{kind: "moon.Divider", classes: "moon-controls-item-wrapper adjust"},
						{classes: "moon-controls-item-wrapper adjust", components: [				
							{name: "listact", kind:"moon.Header", title: "LIST ACTIONS", titleAbove: "02", components: [
						    	{kind: "moon.ListActions", iconSrc:"./assets/list-actions-activator.png", listActions: [
								{	
									action: "category",		
									components: [
									    {kind: "moon.Divider", content:"Sort"},
									    {kind: "moon.Scroller",  classes: "list-action-wrapper", horizontal: "hidden", components: [
									        {content:"Alphabetical (A-Z)", kind:"moon.LabeledCheckbox"},
									        {content:"Release Date", kind:"moon.LabeledCheckbox"}
									    ]},
									    {kind: "moon.Divider", content:"Filters"},
									    {kind: "moon.Scroller",  classes: "list-action-wrapper", horizontal: "hidden", components: [
									        {content:"New Release", kind:"moon.LabeledCheckbox"},
									        {content:"Most Popular", kind:"moon.LabeledCheckbox"},
									        {content:"Action", kind:"moon.LabeledCheckbox"}
									    ]}
									]						
								}
							]}
						]},
						{components: [
								{
									kind: "moon.ImageItem",
									source: "./assets/movie-brazil.png",
									label: "Brazil",
									text: "Sam Lowry is low-level bureaucrat trapped in a needlessly inefficient near-future society."
								},
								{
									kind: "moon.ImageItem",
									source: "./assets/movie-coffee-and-cigarettes.png",
									label: "Coffe and Cigarettes",
									text: "A series of vignettes directed by Jim Jarmusch. With Roberto Benigni, Tom Waits, RZA, Bill Murray."
								},
								{
									kind: "moon.ImageItem",
									source: "./assets/movie-the-cremaster-cycle.png",
									label: "The Cremaster Cycle",
									text: "The Cremaster Cycle is an art project consisting of five films with related sculptures, pho-tographs and drawings."
								}
							]
						}
					]}
				]}
			]}
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.flagChanged();
	},
	flagChanged: function() {
		var tmp = this.flag;
		// ITEM CTRL
		this.$.item4.addRemoveClass("spotlight", tmp);
		this.$.item8.addRemoveClass("spotlight", tmp);
		this.$.item5.$.textUnderline.addRemoveClass("moon-underline", tmp);
		this.$.item8.$.textUnderline.addRemoveClass("moon-underline", tmp);
		this.$.item8.$.textUnderline.addRemoveClass("moon-overlay", tmp);
		this.$.item4.spotlight = !tmp;
		this.$.item5.spotlight = !tmp;
		this.$.item6.spotlight = !tmp;
		this.$.item7.spotlight = !tmp;
		this.$.item8.spotlight = !tmp;
		this.$.item9.spotlight = !tmp;
		// ITEM CHECK
		this.$.check1.checked = tmp;
		this.$.check3.checked = tmp;
		this.$.check4.checked = tmp;
		this.$.check1.addRemoveClass("spotlight", tmp);
		this.$.check1.$.input.createComponent({name: "overlay", classes: "moon-overlay"});
		// ExPANDABLE PICKER, noneText: "Vanilla, Strawberry",
		this.$.expicker2.$.header.bubble("ontap");
		this.$.exItem5.checked = tmp;
		this.$.expicker1.setNoneText("Vanilla, Strawberry");
		this.$.expicker1.addRemoveClass("spotlight", tmp);
		this.$.expicker2.spotlight = !tmp;
		this.$.expicker2.$.header.spotlight = !tmp;
		this.$.exItem4.spotlight = !tmp; 
		this.$.exItem5.spotlight = !tmp;
		this.$.exItem6.spotlight = !tmp;
		// DIVIDER ITEM
		this.$.divitem1.addRemoveClass("spotlight", tmp);
		// ACCORDION
		this.$.accord8.$.header.bubble("ontap");
		this.$.accord6.spotlight = !tmp;
		this.$.accord6.$.arrow.spotlight = !tmp;
		this.$.accord7.spotlight = !tmp;
		this.$.accord7.$.arrow.spotlight = !tmp;
		this.$.accord8.spotlight = !tmp;
		this.$.accord8.$.header.spotlight = !tmp;
		this.$.accord8.$.arrow.spotlight = !tmp;
		this.$.accItem1.spotlight = !tmp;
		this.$.accItem2.spotlight = !tmp;
		this.$.accItem3.spotlight = !tmp;
		this.$.accord9.spotlight = !tmp;
		this.$.accord9.$.arrow.spotlight = !tmp;
		this.$.accord10.spotlight = !tmp;
		this.$.accord10.$.arrow.spotlight = !tmp;
		// TOGGLE ITEM
		this.$.toggItem1.checked = tmp;
		this.$.toggItem1.active = tmp;
		this.$.toggItem2.checked = tmp;
		this.$.toggItem1.addRemoveClass("spotlight", tmp);
		// RADIO ITEM
		this.$.radioItem4.spotlight = !tmp;
		this.$.radioItem5.spotlight = !tmp;
		this.$.radioItem6.spotlight = !tmp;
		this.$.radioItem7.spotlight = !tmp;
		this.$.radioItem8.spotlight = !tmp;
		this.$.radioItem9.spotlight = !tmp;
		this.$.radioItem5.addRemoveClass("spotlight", tmp);
		this.$.radioItem5.bubble("ontap");
		this.$.radioItem7.addRemoveClass("spotlight", tmp);
		this.$.radioItem8.bubble("ontap");
		// SIMPLE PICKER
		this.$.picker2.$.buttonLeft.spotlight = !tmp;
		this.$.picker2.$.buttonRight.spotlight  = !tmp;
		this.$.picker2.$.buttonLeft.addRemoveClass("spotlight", tmp);
		this.$.picker2.$.buttonRight.addRemoveClass("spotlight", tmp);
		// DATE PICKER
		this.$.datePicker2.$.header.bubble("ontap");
		this.$.datePicker2.spotlight = !tmp;
		this.$.datePicker2.$.header.spotlight = !tmp; 
		this.$.datePicker2.$.day.spotlight = !tmp;
		this.$.datePicker2.$.month.spotlight = !tmp;
		this.$.datePicker2.$.year.spotlight = !tmp;
		// SLIDER CONTROL
		this.$.sldctrl3.addRemoveClass("spotlight", tmp);
		this.$.sldctrl4.addRemoveClass("spotlight", tmp);
		this.$.sldctrl3.bubble("onSpotlightSelect");
		this.$.sldctrl3.spotlight = !tmp;
		this.$.sldctrl4.bubble("onSpotlightSelect");
		this.$.sldctrl4.spotlight = !tmp;
		// INPUT TEXT
		this.$.indeco2.addRemoveClass("spotlight", tmp);
		this.$.indeco2.spotlight = !tmp;
		this.$.indeco3.spotlight = !tmp;
		this.$.indeco5.addRemoveClass("spotlight", tmp);
		this.$.indeco5.spotlight = !tmp;
		this.$.indeco6.spotlight = !tmp;
		// BUTTON
		this.$.bLarge3.addRemoveClass("spotlight", tmp);
		this.$.bLarge3.spotlight = !tmp;
		this.$.bLarge4.addRemoveClass("spotlight", tmp);
		this.$.bLarge4.spotlight = !tmp;
		this.$.bLarge5.addRemoveClass("active", tmp);
		this.$.bLarge5.spotlight = !tmp;
		this.$.bLarge6.addRemoveClass("active", tmp);
		this.$.bLarge6.spotlight = !tmp;
		this.$.bSmall3.addRemoveClass("spotlight", tmp);
		this.$.bSmall3.spotlight = !tmp;
		this.$.bSmall4.addRemoveClass("spotlight", tmp);
		this.$.bSmall4.spotlight = !tmp;
		this.$.bSmall5.addRemoveClass("active", tmp);
		this.$.bSmall5.spotlight = !tmp;
		this.$.bSmall6.addRemoveClass("active", tmp);
		this.$.bSmall6.spotlight = !tmp;
		// ICON BUTTON
		this.$.bIcon3.addRemoveClass("spotlight", tmp);
		this.$.bIcon3.spotlight = !tmp;
		this.$.bIcon4.addRemoveClass("spotlight", tmp);
		this.$.bIcon4.spotlight = !tmp;
		this.$.bIcon5.addRemoveClass("active", tmp);
		this.$.bIcon5.spotlight = !tmp;
		this.$.bIcon6.addRemoveClass("active", tmp);
		this.$.bIcon6.spotlight = !tmp;

		return true; 
	},
	buttonActivated: function(inSender, inEvent) {
		if ((inEvent.originator.getActive()) && (inEvent.originator.kind === "moon.RadioButton")) {
			this.addRemoveClass("moon-dark-gray", (inEvent.originator.getContent() == "moon-dark-gray"));
			this.addRemoveClass("moon-light-gray", (inEvent.originator.getContent() == "moon-light-gray"));
		} else {
			//
		}

	}
});