/**
	_enyo.CardOverlayArranger_ is an <a href="#enyo.Arranger">enyo.Arranger</a>
	that displays only one active control. The non-active controls are hidden
	with _setShowing(false)_. Transitions between arrangements are handled by
	sliding the new control	over the current one.

	Note that CardOverlayArranger always slides controls in from the right. If
	you want an arranger that slides to the right and left, try
	<a href="#enyo.LeftRightArranger">enyo.LeftRightArranger</a>.

	For more information, see the documentation on
	[Arrangers](https://github.com/enyojs/enyo/wiki/Arrangers) in the Enyo
	Developer Guide.
*/
enyo.kind({
	name: "enyo.CardOverlayArranger",
	kind: "CardSlideInArranger",
	//* @protected	
	arrange: function(inC, inName) {
		var p = inName.split(".");
		var f = p[0], s= p[1], starting = (p[2] == "s");
		var b = this.containerBounds.width;
		var next = f>s ? true : false;
		
		for (var i=0, c$=this.container.getPanels(), c, v; (c=c$[i]); i++) {
			v = b;			
			if (s == i) {				
				if(next) { 
					v=0;						
				}
				else { 					
					v = starting ? 0 : b;					
				}
			}			
			if (f == i) {				
				if(next){ 
					v = starting ? b : 0;					
				}
				else { 
					v=0;					
				}				
			}
			if (s == i && s == f) {
				v = 0;
			}						
			this.arrangeControl(c, {left: v});
		}
	}	
});
