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
		var c$ = this.container.getPanels(),
			p_len = c$ ? c$.length : 0;

		this.container.transitionPositions = {};

		for (var i=0; i<p_len; i++) {
			this.calcTransitionPositions(p_len, i);
		}
	},
	calcTransitionPositions: function(p_len, active) {
		var i;
		for (i=0; i<p_len; i++) {
			this.container.transitionPositions[i + "." + active] = (i - active);
			if (this.debug) {
				console.log('transitionPositions [' + i + '.' + active + '] ' + this.container.transitionPositions[i + '.' + active]);
			}
		}
	},
	arrange: function(inC, inName) {
		var i, c, xPos, inArrangement;
		var c$ = this.container.getPanels();
		var active = this.container.clamp(inName);

		for (i=0; (c=c$[i]); i++) {
			xPos = this.container.transitionPositions[i + "." + active];
			inArrangement = {left: xPos*100};
			if (this.debug) {
				console.log('arrangeControl [' + i + '.' + active + '] ', inArrangement);
			}
			this.arrangeControl(c, inArrangement); // Remember left position on each Panel
		}
	},
	flowArrangement: function () {
		var con = this.container,
			a$ = con.arrangement,
			ps = con.getPanels(),
			bs = con.getBreadcrumbs(),
			active = this.container.index,
			start = active-bs.length,
			end = active,
			index, i, a, c;

		if (a$) {
			// Adjust index for direction
			if (con.fromIndex > con.toIndex) {
				start = start+1;
				end = end+1;
			}
			// Flow panel
			for (i=0; (c=ps[i]) && (a$['panel'][i]); i++) {
				this.flowControl(c, a$['panel'][i]);
			}
			// Flow breadcrumb
			for (i=start; i<end; i++) {
				c = bs[this.wrap(i,bs.length)];
				a = a$['breadcrumb'][this.wrap(i, ps.length)];
				this.flowControl(c, a);

				// Adjust breadcrumb label
				c.set('index', this.wrap(i, ps.length)); 
			}
		}
	},
	wrap: function(value, length) {
		return (value+length)%length;
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
