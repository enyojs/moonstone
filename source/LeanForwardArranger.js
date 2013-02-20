enyo.kind({
	name: "moon.LeanForwardArranger",
	kind: "enyo.DockRightArranger",
	start: function() {
		this.inherited(arguments);
		
		var tp = this.container.transitionPositions;
		var panels = this.container.getPanels();
		var panel;
		var opacity;
		var hiding = [];
		for(var i=0;(panel = panels[i]);i++) {
			opacity = panel.domStyles.opacity;
			if (tp[i+"."+this.container.toIndex] === 0) {
				width = panel.getBounds().width;
				var nextTp = tp[i+1+"."+this.container.toIndex];
				if (width > nextTp) {
					hiding.push(i);
				}
			}
		}
		
		this.container.hiddenPanels = hiding;
	},
	arrange: function(inC, inName) {
		var i, c;
		var c$ = this.container.getPanels();
		var s = this.container.clamp(inName);
		
		for (i=0; (c=c$[i]); i++) {
			var xPos = this.container.transitionPositions[i + "." + s];
			var o = 1;
			if(xPos === 0) {
				var width = c.getBounds().width;
				o = (width > this.container.transitionPositions[i+1 + "." + s]) ? 0 : 1;
			}
			
			this.arrangeControl(c, {left: xPos, opacity: o});
		}
	}
})