//* @public
/**
	_sun.Tooltip_ is an <a href="#moon.Tooltip">moon.Tooltip</a> with Mobile
	styling applied. 
*/

enyo.kind({
	name: "sun.Tooltip",
	kind: "moon.Tooltip",	
	published: {		
		position: {vertical: undefined, horizontal: undefined},
	},
	tools: [
		{name: "client", classes: "sun moon-tooltip-label moon-header-font"}
	],
	adjustPosition: function(belowActivator) {
		
		if (this.showing && this.hasNode()) {
			var b = this.node.getBoundingClientRect();
			var v = "", h = "";

			// vertical
			if(this.position.vertical != undefined){
				v = this.position.vertical;				
			}
			else {
				//when the tooltip bottom goes below the window height move it above the decorator
				if (b.top + b.height > window.innerHeight) {
					v = "above";					
				}
				else {
					v = "below";					
				}
			}			
			
			if(v == "above") {					
				this.addRemoveClass("below", false);	
				this.addRemoveClass("above", true);
				this.applyStyle("top", -b.height + "px");
			}
			else {
				this.addRemoveClass("above", false);
				this.addRemoveClass("below", true);
				this.applyStyle("top", "100%");	
			}			

			// horizontal
			if(this.position.horizontal != undefined){
				h = this.position.horizontal;
			}
			else {
				//when the tooltip's right edge is out of the window, align its right edge with the decorator left edge (approx)
				if (b.left + b.width > window.innerWidth) {
					h = "right";
				}
				else {
					h = "left";
				}
			}

			if(h == "right") {
				//use the right-arrow
				this.applyPosition({'margin-left': -b.width});
				this.addRemoveClass("left-arrow", false);
				this.addRemoveClass("right-arrow", true);
				this.$.client.addRemoveClass("right-arrow", true);
			}
		}
	}
});