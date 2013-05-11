/**
	_moon.GridList_ extends <a href="#enyo.GridList">enyo.GridList</a>, adding
	Moonstone-specific configuration, styling, decorators, and Spotlight/focus-state
	management.

		enyo.kind({
			...
			components: [
				{kind: "enyo.Spotlight"},
				{
					kind: "moon.GridList",
					onSetupItem: "setupItem",
					toggleSelected: true,
						components: [
							{name: "item", kind: "moon.GridList.ImageItem"}
						]
					}
			],
			...
			results: [],
			setupItem: function(inSender, inEvent) {
				var i = inEvent.index;
				var item = this.results[i];
				this.$.item.setSource(item.BoxArt.LargeUrl);
				this.$.item.setCaption(item.Name);
				this.$.item.setSelected(this.$.gridlist.isSelected(i));
			},
			...
		});
*/

enyo.kind(
    {
        name: "moon.GridList",
        kind: "enyo.GridList",
        classes: "moon-gridlist",
        spotlight: true,
        itemSpacing: 64,
        itemMinWidth: 180,
        itemMinHeight: 180,
        itemWidth: 180,
        itemHeight: 180,
        itemFluidWidth: true,
        events: {
            //* @protected
            ontap: "tap"
        },
        //* @protected
        tap: function(inSender, inEvent) {
            enyo.Spotlight.spot(this);
        }
    }
);