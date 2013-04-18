enyo.kind({
    name: "moon.Sample.Photo.Albums",
	kind: "moon.Panels",
	classes: "photo-album",
	title: "Albums",
	components: [
		//{kind: "enyo.Spotlight"},
		{name: "Albums", title: "Albums", layoutKind: "enyo.FittableColumsLayout", components: [
			{
				kind: "moon.List", 
				spotlight: true, 
				orient:"v", 
				count: 5, 
				onSetupItem: "setupItem", 
				components: [
					{
						name: "item", 
						kind: "moon.ImageItem", 
						source: "assets/album.png", 
						label: "ALBUM NAME", 
						spotlight: true
					}
				]
			}			
		]}	    
	],
	setupItem: function(inSender, inEvent) {
		// this is the row we're setting up
		var i = inEvent.index;
		this.$.item.setStyle("width: 131px; height:93px");
	},
	decorateTapEvent: function(inSender, inEvent) {
		inEvent = enyo.mixin(inEvent, {
			title: inSender.getContent(),
			url:   inSender.url
		});
	}
});
