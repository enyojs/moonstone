
enyo.kind({
	name: "moon.sample.ChannelBannerSample",
	classes: "moon enyo-fit enyo-unselectable moon-video-player-sample",
	fit: true,
	components: [
		{
			name: "player",
			kind: "moon.VideoPlayer",
			src: "http://media.w3.org/2010/05/bunny/movie.mp4",
			poster: "assets/video-poster.png",
			autoplay: false,
			onPlaybackControlsTapped: "controlsTapped",
			showInfoBackground: true,
			shakeAndWake: true,
			showInfo: true,
			autoCloseTimeout: 999999,
			infoComponents: [
				{kind: "moon.VideoInfoBackground", name:"leftInfo", orient: "left", background: true, fit: true, components: [
					{
						kind: "moon.ChannelInfo",
						name: "channelInfo",
						channelNo: "9999-99",
						channelName: "AMC",
						components: [
							{content: "3D"}
						]
					},
					{
						kind: "moon.VideoInfoHeader",
						name: "videoInfo",
						title: "Downton Abbey - Extra Title",
						subTitle: "Mon June 21, 7:00 - 8:00pm",
						subTitleDivider:"|",
						subSubTitle: "R - TV 14, V, L, SC",
						description: "Lorem ipsum dolor sit amet.",
						components: [
							{content: "Icon 1", classes: "moon-video-player-info-icon"},
							{content: "Icon 2", classes: "moon-video-player-info-icon"},
							{content: "Icon 3", classes: "moon-video-player-info-icon"}
						]
					}
				]},
				{kind: "moon.VideoInfoBackground", name:"rightInfo", orient: "right", background: true, components: [
					{kind:"moon.Clock", name:"clock"}
				]}
			],
			components: [
				{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"},
				{kind: "moon.ContextualPopupDecorator", components: [
					{kind: "moon.Button", content:"Locale"},
					{kind: "moon.ContextualPopup", components: [
						{kind: "Group", name: "localeGroup", onActivate: "handleLocaleChange", components: [
							{kind: "moon.SelectableItem", content:"English", value: "en-US"},
							{kind: "moon.SelectableItem", content:"Portuguese", value: "pt-PT"},
							{kind: "moon.SelectableItem", content:"Punjabi", value: "pa-IN"},
							{kind: "moon.SelectableItem", content:"Korean", value: "ko-KR"},
							{kind: "moon.SelectableItem", content:"Traditional Chinese", value: "zh-Hant-HK"},
							{kind: "moon.SelectableItem", content:"Japanese", value: "ja-JP"}
						]}
					]}
				]},
				{kind: "moon.ContextualPopupDecorator", components: [
					{kind: "moon.Button", content:"Header Parts"},
					{kind: "moon.ContextualPopup", components: [
						{kind: "moon.SelectableItem", name:"chToggleButton", content:"Channel Area"},
						{kind: "moon.SelectableItem", name:"infoToggleButton", content:"Title Area"},
						{kind: "moon.SelectableItem", name:"rightToggleButton", content:"Clock Area"}
					]}
				]},
				{kind: "moon.ContextualPopupDecorator", components: [
					{kind: "moon.Button", content:"Modes"},
					{kind: "moon.ContextualPopup", components: [
						{kind: "moon.SelectableItem", name:"leftToggleButton", content:"Channel + Title"},
						{kind: "moon.SelectableItem", name:"bgToggleButton", content:"Background"}
					]}
				]},
				{kind: "moon.ContextualPopupDecorator", components: [
					{kind: "moon.Button", content:"Content"},
					{kind: "moon.ContextualPopup", components: [
						{kind: "moon.Divider", content: "Channel Badges"},
						{kind: "moon.SimpleIntegerPicker", name:"badgesPicker", fit: true, value:4, min:0, max:10, step: 1, unit: "badges", onChange: "handleBadgesChange"},
						{kind: "moon.Divider", content: "Title Length"},
						{kind:"moon.SimplePicker", block:true, name:"titlesPicker", animate:false, wrap:true, components: [
							{content:"House"},
							{content:"Firefly"},
							{content:"Downton Abbey"},
							{content:"Arrested Development"},
							{content:"Gordon Ramsay's Ultimate Cookery Course - And Complete Guide to Long Show Titles"}
						]},
						{kind: "moon.Divider", content: "Description Length"},
						{kind: "moon.SimpleIntegerPicker", name:"sentencesPicker", value:2, min:0, max:12, step: 1, unit: "sentences", onChange: "handleSentencesChange"}
					]}
				]},
				{kind: "moon.ContextualPopupDecorator", components: [
					{kind: "moon.Button", content:"Video Components"},
					{kind: "moon.ContextualPopup", components: [
						{kind: "moon.ToggleButton", name:"controlsToggleButton", content:"Controls"},
						{kind: "moon.ToggleButton", name:"ffrewToggleButton", content:"FF/Rewind"},
						{kind: "moon.Button", content:"Unload Video", ontap:"unload"},
						{kind: "moon.Button", content:"Reload Video", ontap:"load"}
					]}
				]}
			]
		},
		{kind:"moon.Dialog", name:"tapDialog", title:"The controls were tapped.", message:"Press OK to dismiss", components: [
			{kind:"moon.Button", content:"OK", ontap:"dismissTapDialog"}
		]}
	],
	bindings: [
		{from:".$.player.disablePlaybackControls", to:".$.controlsToggleButton.value", oneWay:false},
		{from:".$.player.showFFRewindControls", to:".$.ffrewToggleButton.value", oneWay:false},
		{from:".$.player.showInfoBackground", to:".$.bgToggleButton.selected", oneWay:false},
		{from:".$.leftInfo.showing", to:".$.leftToggleButton.selected", oneWay:false},
		{from:".$.channelInfo.showing", to:".$.chToggleButton.selected", oneWay:false},
		{from:".$.videoInfo.showing", to:".$.infoToggleButton.selected", oneWay:false},
		{from:".$.titlesPicker.selected.content", to:".$.videoInfo.title", oneWay:true},
		{from:".$.rightInfo.showing", to:".$.rightToggleButton.selected", oneWay:false}
	],
	create: function() {
		this.inherited(arguments);
		this.setChannelBadgesLength(this.$.badgesPicker.value);
		this.setDescriptionLength(this.$.sentencesPicker.value);
	},
	handleLocaleChange: function(inSender, inEvent) {
		enyo.updateLocale(inEvent.originator.value);
	},
	handleSentencesChange: function(inSender, inEvent) {
		this.setDescriptionLength(inEvent.originator.value);
	},
	handleBadgesChange: function(inSender, inEvent) {
		this.setChannelBadgesLength(inEvent.originator.value);
	},
	setDescriptionLength: function(inSentenceCount) {
		var filler = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sodales metus eget diam sollicitudin luctus et vitae magna. Nunc eu iaculis libero. Vestibulum mollis, diam quis tempor molestie, dui justo pulvinar nisl, vel pharetra nunc turpis nec neque. Curabitur ac pretium orci. Nam consequat mattis lorem, in ultricies massa. Duis eu lacinia turpis. Mauris sit amet tristique justo, vel dictum mauris. Cras libero magna, consequat eget justo vitae, dictum bibendum mi. Nulla blandit porta fermentum. Mauris et arcu tellus. Nulla ultrices purus non nisl porta, in varius velit gravida",
			sentences = filler.split(". "),
			outString = sentences.slice(0,inSentenceCount).join(". ");
		this.$.videoInfo.set("description", (outString ? outString + "." : ""));
	},
	setChannelBadgesLength: function(inBadgeCount) {
		var allBadges = [
				{content: "DTV"},
				{content: "\u266B"},
				{content: "amc", classes: "moon-video-player-info-default-icon"},
				{content: "REC 08:22", classes: "moon-video-player-info-redicon "},
				{content: "Cinema"},
				{content: "Sub English"},
				{content: "\u2665"},	
				{content: "3D"},
				{content: "AD"},
				{content: "CC1"}									
			],
			badgesSubset = allBadges.slice(0,inBadgeCount);
		this.$.channelInfo.destroyClientControls();
		this.$.channelInfo.createComponents(badgesSubset);
		this.$.channelInfo.render();
	},
	controlsTapped: function() {
		this.$.tapDialog.show();
	},
	dismissTapDialog: function() {
		this.$.tapDialog.hide();
	},
	unload: function() {
		this.$.player.unload();
	},
	load: function() {
		this.$.player.unload();
		this.$.player.setSrc("http://media.w3.org/2010/05/bunny/movie.mp4");
	}
});
