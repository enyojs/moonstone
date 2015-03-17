/**
	_enyo.DockRightArranger_ is an [enyo.Arranger](#enyo.Arranger) that
	displays the active control, along with some number of inactive controls to
	fill the available space. The active control is positioned on the right
	side of the container and the rest of the views are laid out to the right.

	For best results with DockRightArranger, you should set a minimum width
	for each control via a CSS style, e.g., _min-width: 25%_ or
	_min-width: 250px_.

	Transitions between arrangements are handled by sliding the new control	in
	from the right. If the width of the old control(s) can fit within the
	container, they will slide to the left. If not, the old control(s) will
	collapse to the left.

	For more information, see the documentation on
	[Arrangers](building-apps/layout/arrangers.html) in the Enyo Developer Guide.
*/
enyo.kind({
	name: "moon.MoonArranger",
	kind: "Arranger",
	debug: false,
	
	//* @protected
	size: function() {
		var c$ = this.container.getPanels(), i, c;
		// panel arrangement positions
		this.container.transitionPositions = {};

		for (i=0; (c=c$[i]); i++) {
			this.calcTransitionPositions(i);
		}
	},
	calcTransitionPositions: function(i) {
		var c$ = this.container.getPanels(), j, c;
		for (j=0; (c=c$[j]); j++) {
			this.container.transitionPositions[j + "." + i] = (j - i);
			if (this.debug) {
				console.log('transitionPositions [' + j + '.' + i + '] ' + this.container.transitionPositions[j + '.' + i]);
			}
		}
	},
	arrange: function(inC, inName) {
		var i, c;
		var c$ = this.container.getPanels();
		var s = this.container.clamp(inName);

		for (i=0; (c=c$[i]); i++) {
			var xPos = this.container.transitionPositions[i + "." + s],
				inArrangement = {left: xPos*100, top: 0};
			if (this.debug) {
				console.log('arrangeControl [' + i + '.' + s + '] ', inArrangement);
			}
			this.arrangeControl(c, inArrangement); // Remember left position on each Panel
			
		}
	},
	flowArrangement: function () {
		var a$ = this.container.arrangement,
			c = this.container;
		if (a$) {
			this._flowArrangement(a$['panel'], c.getPanels());
			this._flowArrangement(a$['breadcrumb'], c.getBreadcrumbs());
		}
	},
	_flowArrangement: function(a, c$) {
		for (var i=0, c; (c=c$[i]) && (a[i]); i++) {
			this.flowControl(c, a[i]);
			if (this.debug) {
				console.log('flowArrangement [' + i + '] ', a[i].left);
			}
		}
	},
	flowControl: function(inControl, inArrangement) {
		enyo.Arranger.positionControl(inControl, inArrangement, '%');
	},
	destroy: enyo.inherit(function(sup) {
		return function() {
			var c$ = this.container.getPanels();
			for (var i=0, c; (c=c$[i]); i++) {
				enyo.Arranger.positionControl(c, {left: null, top: null});
				c.applyStyle("top", null);
				c.applyStyle("bottom", null);
				c.applyStyle("left", null);
				c.applyStyle("width", null);
			}
			sup.apply(this, arguments);
		};
	})
});
