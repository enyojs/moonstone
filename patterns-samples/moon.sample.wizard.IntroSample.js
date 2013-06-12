enyo.kind({
    name: "moon.sample.wizard.IntroSample",
    kind: "Sample.Wizard.Panel",
    components: [
		{kind: "moon.Scroller", fit: true, components: [
		
			{classes: "wizard-nav-button-container", components: [
				{name: "post", kind: "moon.Button", classes: "wizard-button-top", ontap: "doNext", content: "Next"}
			]},
			
			{kind: "FittableColumns", components: [
			    {name: "imgmenu", kind: "enyo.Image", style:"width:480px;height:320px;"},
			    {fit: true, components: [
			       {name: "headline", classes: "wizard-instruction"},
			       {name: "detail"}
			    ]}
			]},
			
			{name: "cancel", kind: "moon.Button", classes: "wizard-button-bottom", ontap: "doCancel", content: "Cancel"}
		]}
    ],
    initialSetting: function() {
        var idx = this.$.header.getTitleAbove()-1;
        var collection = this.controller.get("wizContainer");
		
        this.$.header.setTitleBelow(collection.at(idx).get("id") + ". " + collection.at(idx).get("subtitle"));
        this.$.imgmenu.set("src", collection.at(idx).get("imgsrc")); 
        this.$.headline.set("content", collection.at(idx).get("instruction")); 
        this.$.detail.set("content", collection.at(idx).get("detail"));
    },
});

