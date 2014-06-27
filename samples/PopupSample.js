enyo.kind({
	name: "moon.sample.PopupSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "moon.Divider", content: "Popups"},

		{classes: "moon-hspacing", components: [
			{kind: "moon.Button", content: "Basic Popup", ontap: "showPopup", popup: "basicPopup"},
			{kind: "moon.Button", content: "Long Popup", ontap: "showPopup", popup: "longPopup"},
			{kind: "moon.Button", content: "Scroller Popup", ontap: "showPopup", popup: "scrollerPopup"},
			{kind: "moon.Button", content: "Button in Popup", ontap: "showPopup", popup: "buttonPopup"},
			{kind: "moon.Button", content: "Panels in Popup", ontap: "showPopup", popup: "panelsPopup"}
		]},

		{name: "basicPopup", kind: "moon.Popup", content: "Popup...", components: [
			{kind: "moon.Button", content: "Hide Direct", ontap: "hidePopup", popup: "basicPopup"}
		]},
		{name: "longPopup", kind: "moon.Popup", allowHtml: true, content: "Don't go changing, to try and please me  <br>You never let me down before  <br>Don'timagine you're too familiar  <br>And I don't see you anymore  <br>I wouldn't leave you in times of trouble  <br>We never could have come this far I took the good times, I'll take the bad times I'll take you just the way you are Don't go trying some new fashion Don't change the color of your hair You always have my unspoken passion Although I might not seem to care I don't want clever conversation I never want to work that hard I just want someone that I can talk to I want you just the way you are. I need to know that you will always be The same old someone that I knew What will it take till you believe in me The way that I believe in you."},
		{name: "scrollerPopup", kind: "moon.Popup", components: [
			{kind: "moon.Button", content: "Button Outside Scroller"},
			{kind: "moon.Scroller", style: "height:170px;margin-top:10px;", components: [
				{kind: "moon.Item", content: "Test Item 1"},
				{kind: "moon.Item", content: "Test Item 2"},
				{kind: "moon.Item", content: "Test Item 3"},
				{kind: "moon.Item", content: "Test Item 4"},
				{kind: "moon.Item", content: "Test Item 5"},
				{kind: "moon.Item", content: "Test Item 6"},
				{kind: "moon.Item", content: "Test Item 7"},
				{kind: "moon.Item", content: "Test Item 8"},
				{kind: "moon.Item", content: "Test Item 9"},
				{kind: "moon.Item", content: "Test Item 10"}
			]}
		]},
		{name: "buttonPopup", kind: "moon.Popup", floating:true, components: [
			{kind: "moon.Divider", content: "Buttons in popup example"},
			{classes: "moon-hspacing", components: [
				{kind: "moon.Button", content: "Hello"},
				{kind: "moon.Button", content: "Goodbye"},
				{kind: "moon.ToggleButton", content: "SpotlightModal", ontap: "buttonToggled"}
			]}
		]},
		{name: "panelsPopup", kind: "moon.Popup", floating:true, components: [
			{kind: "moon.Panels", name:"panels", defaultKind: "enyo.FittableRows", arrangerKind:"CardArranger", animate:false, classes:"moon-12v", components: [
				{components: [
					{kind:"moon.Divider", content:"Step 1: Terms of Service"},
					{kind:"moon.Scroller", fit:true, spotlightPagingControls:true, horizontal:"hidden", style:"margin-bottom:20px;", components: [
						{kind:"moon.BodyText", content:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
					]},
					{kind:"FittableColumns", components: [
						{fit:true, components: [
							{kind:"moon.FormCheckbox", content:"I agree", style:"display:inline-block;"}
						]},
						{kind: "moon.ToggleButton", content: "SpotlightModal", ontap: "panelsToggled"},
						{kind:"moon.Button", content:"Sign me Up!", ontap:"panelNext"}
					]}
				]},
				{components: [
					{kind: "moon.Divider", content:"Step 2"},
					{kind:"moon.BodyText", fit: true, content: "All done.  Thanks for signing up!"},
					{kind:"moon.Button", content:"Previous", ontap:"panelPrev"}
				]}
			]}
		]}
	],
	popupActivator: null,
	showPopup: function(inSender) {
		this.hidePopups();
		var p = this.$[inSender.popup];
		if (p) {
			// for testing, not meant to be merged
			p.showDirect();
		}
	},
	hidePopup: function() {
		this.$.basicPopup.hideDirect();
	},
	hidePopups: function() {
		this.$.basicPopup.hide();
		this.$.longPopup.hide();
		this.$.buttonPopup.hide();
	},
	buttonToggled: function(inSender, inEvent) {
		this.$.buttonPopup.setSpotlightModal(inSender.getActive());
		this.$.buttonPopup.setAutoDismiss(!inSender.getActive());
	},
	panelsToggled: function(inSender, inEvent) {
		this.$.panelsPopup.setSpotlightModal(inSender.getActive());
		this.$.panelsPopup.setAutoDismiss(!inSender.getActive());
	},
	panelNext: function() {
		this.$.panels.next();
	},
	panelPrev: function() {
		this.$.panels.previous();
	}
});