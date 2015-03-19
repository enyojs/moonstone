/**
	_moon.MoonArranger_ is an [enyo.Arranger](#enyo.Arranger) that
	displays the active control. The active control is positioned on the right
	side of the container and the breadcrumbs are laid out to the left.

	For more information, see the documentation on
	[Arrangers](building-apps/layout/arrangers.html) in the Enyo Developer Guide.
*/
enyo.kind({
	name: "moon.MoonArranger",
	kind: "Arranger",
	
	//* @protected
	size: function() {
		var container = this.container,
			panels = container.getPanels(),
			length = panels ? panels.length : 0;

		container.transitionPositions = {};

		for (var i=0; i<length; i++) {
			for (var j=0; j<length; j++) {
				container.transitionPositions[j + "." + i] = (j - i);
			}
		}
	},
	arrange: function(controls, index) {
		var container = this.container,
			panels = container.getPanels(),
			active = container.clamp(index),
			control, xPos;

		for (var i=0; (control=panels[i]); i++) {
			xPos = container.transitionPositions[i + "." + active];
			this.arrangeControl(control, {left: xPos*100});
		}
	},
	flowArrangement: function () {
		this.flowPanel();
		this.flowBreadcrumb();
	},
	flowPanel: function() {
		var container = this.container,
			arrangements = container.arrangement,
			panels = container.getPanels(),
			control, i;

		if (arrangements && arrangements['panel']) {
			// Flow panel
			for (i=0; (control=panels[i]) && (arrangements['panel'][i]); i++) {
				this.flowControl(control, arrangements['panel'][i]);
			}
		}
	},
	flowBreadcrumb: function() {
		var container = this.container,
			arrangements = container.arrangement,
			panels = container.getPanels(),
			breadcrumbs = container.getBreadcrumbs(),
			active = this.container.index,
			start, end, arrangement, control, i;

		if (arrangements && arrangements['breadcrumb']) {

			/** To support fly weight pattern, we use a concept of a window.
			    If we are seeing maximum 1 breadcrumb on screen (case of activity pattern),
			    we arrange 2 breadcrumbs at a time (current and previous) to show animation.
			    If we move forward from index 2 to 3 (active is 3), the window can be [2, 3].
			*/
			end = active;
			start = end - breadcrumbs.length;

			// If we move backward from index 4 to 3 (active is 3), the window can be [3, 4].
			if (container.fromIndex > container.toIndex) {
				start = start+1;
				end = end+1;
			}

			// Flow breadcrumb
			for (i=start; i<end; i++) {
				// Select breadcrumb to arrange for the given panel index
				// If we have a window of [2, 3] then we choose breadcrumb [0, 1].
				// If we have a window of [3, 4] then we choose breadcrumb [1, 0].
				control = breadcrumbs[this.wrap(i, breadcrumbs.length)];

				// For the first panel, we arrange all breadcrumb to offscreen area.
				arrangement = (i>=0) ? arrangements['breadcrumb'][i] : {left: 0};
				
				this.flowControl(control, arrangement);

				// Set proper index to breadcrumb to show label
				control.set('index', i);
			}
		}
	},
	wrap: function(value, length) {
		return (value+length)%length;
	},
	flowControl: function(control, arrangement) {
		enyo.Arranger.positionControl(control, arrangement, '%');
	},
	destroy: enyo.inherit(function(sup) {
		return function() {
			var panels = this.container.getPanels();
			for (var i=0, control; (control=panels[i]); i++) {
				enyo.Arranger.positionControl(control, {left: null, top: null});
				control.applyStyle("top", null);
				control.applyStyle("bottom", null);
				control.applyStyle("left", null);
				control.applyStyle("width", null);
			}
			sup.apply(this, arguments);
		};
	})
});
