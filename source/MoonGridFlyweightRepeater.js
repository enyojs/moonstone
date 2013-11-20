enyo.kind({
	name: "moon.GridFlyWeightRepeater",
	kind: "enyo.GridFlyWeightRepeater",
	//* @protected
	//* Override to use strategy's _clientWrapper_ node.
	_generateChildHtmlEqualSizedItems: function() {
		var cw = this.owner.getScrollBounds().clientWidth;
		var cl = this.$.client, ht = "";
		var itemWidthPercent = 0, itemScaledWidth = this.itemWidth, itemScaledHeight = this.itemHeight;
		if (this.itemFluidWidth) {
			itemWidthPercent = 100/this.itemsPerRow;
			var totalMargin = 0;
			if (this.itemSpacing >= 0) {
				totalMargin = (this.itemsPerRow + 1) * this.itemSpacing;
				itemWidthPercent = 100/this.itemsPerRow - ((100 * totalMargin)/(this.itemsPerRow * cw));
			}
			itemScaledWidth = (itemWidthPercent/100)*cw;
			itemScaledHeight = itemScaledWidth * (this.itemHeight/this.itemWidth);
		}
		for (var i=this.rowOffset; i < this.rowOffset + this.count; i++) {
			// Setup each item
			cl.setAttribute("data-enyo-index", i);
			this.doSetupItem({index: i, selected: this.isSelected(i)});
			if (this.itemFluidWidth) {
				cl.addStyles("width:" + itemWidthPercent + "%;height:" + itemScaledHeight + "px;");
			} else {
				cl.addStyles("width:" + this.itemWidth + "px;height:" + this.itemHeight + "px;");
			}
			if (this.itemSpacing >= 0) {
				cl.addStyles("margin-top:" + this.itemSpacing + "px; margin-left:" + this.itemSpacing + "px;");
				cl.addStyles("margin-right: 0px;");
			}
			ht += cl.generateHtml();
			cl.teardownRender();
		}
		return ht;
	}
});