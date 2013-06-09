enyo.kind({
	name: "moon.sample.DrawerSample",
	classes: "moon moon-sample moon-input-sample enyo-fit",
    fit: true,
    components: [
        {kind: "enyo.Spotlight"},
		{
			kind:"moon.Drawers", 
			style:"position:relative;", 
			drawers:[
				{name:"musicDrawer", kind: "moon.Drawer", classes:"music-drawer", open:false, controlsOpen:false,
					handle: {kind:"moon.DrawerHandle", content:"TRACK NAME BY ARTIST", marquee:true},
					components: [
						{kind:"Tracks"}
					],
					controlDrawerComponents: [
						{kind:"FittableColumns", components:[
							{classes:"drawer-components", fit:true, components:[
								{classes:"player-controls", components: [
									{tag:"img", src:"$/assets/back.png", classes:"back-button"},
									{tag:"img", src:"$/assets/pause.png", classes:"pause-button"},
									{tag:"img", src:"$/assets/forward.png", classes:"forward-button"}
								]},
								{kind: "moon.Slider"}
							]},
							{kind:"moon.Button",content:"OPEN", classes:"player-controls-open-button", spotlight:true, ontap:"openMainDrawer"}
						]}
					]
				},
				{name:"searchDrawer", kind:"moon.Drawer", classes:"search-drawer",
					handle: {kind:"moon.DrawerHandle", content:"SEARCH"},
					components: [{content:"drawer content goes here", classes:"search-drawer-content"}]
				}
			],
			components: [
		        {name: "panels", kind: "moon.Panels", arrangerKind: "moon.BreadcrumbArranger", classes: "enyo-fit", components: [
			        {title: "First", components: [
						{kind: "moon.Item", classes:"basic-panels", content: "Item One"},
						{kind: "moon.Item", content: "Item Two"},
						{kind: "moon.Item", content: "Item Three"},
						{kind: "moon.Item", content: "Item Four"},
						{kind: "moon.Item", content: "Item Five"}
					]},
		            {title: "Second", components: [
						{kind: "moon.Item", classes:"basic-panels", content: "Item One"},
						{kind: "moon.Item", content: "Item Two"},
						{kind: "moon.Item", content: "Item Three"},
						{kind: "moon.Item", content: "Item Four"},
						{kind: "moon.Item", content: "Item Five"}
					]}	    
			]}			

		]}	
    ],
	openMainDrawer: function() {
		this.$.musicDrawer.setOpen(true);
	}
});

//View for the first drawer
enyo.kind({
    name: "Tracks",
    kind: "moon.Panel",
	classes: "enyo-unselectable music-tracks",
	fit:true,
    title: "Browse Tracks",
    titleAbove: "02",
    titleBelow: "15 Tracks",
    headerComponents: [
        {
            classes: "header",
            components: [
                {kind: "moon.IconButton", src: "assets/icon-album.png"},
                {
                    kind: "moon.IconButton",
                    src: "assets/icon-list.png",
                    classes: "right-button"
                }
            ]
        }
    ],
	components:[
		{
			kind: "moon.List",
			fit:true,
		    count: 15,
		    multiSelect: false,
		    onSetupItem: "setupItem",
		    components: [
		        {
		            kind: "enyo.FittableColumns",
		            classes: "item",
		            fit: true,
		            components: [
		                {
		                    name: "preview",
		                    classes: "preview",
		                    fit: true,
		                    components: [{classes: "play-icon"}]
		                },
		                {style: "display: table-cell; width: 20px;"},
		                {classes: "label", components: [
		                    {name: "track", classes: "content"}
		                ]},
		                {classes: "label", components: [
		                    {name: "artist", classes: "content"}
		                ]},
		                {classes: "label", components: [
		                    {name: "album", classes: "content"}
		                ]},
		                {name: "time", classes: "time"}
		            ]
		        }
		    ]
		}
    ],
    setupItem: function(inSender, inEvent) {
        var url = "assets/default-music.png";
		this.$.preview.setStyle("background-image: url(" + url + ");");
		this.$.track.setContent("Track Name");
		this.$.artist.setContent("Artist Name");
		this.$.album.setContent("Album Name");
		this.$.time.setContent("3:40");
	}
});