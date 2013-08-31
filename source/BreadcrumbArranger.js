/**
	_moon.BreadcrumbArranger_ is an <a href="#enyo.Arranger">enyo.Arranger</a>
	that displays the active control, along with some number of breadcrumbs on the
	right side. This is the default arranger for both the "Always Viewing" and
	"Activity" patterns; if you are using <a href="#moon.Panel">moon.Panel</a>
	with either of these patterns, you don't need to specify an arranger
	explicitly.

	The breadcrumbs reflect the sequence of panels that the user has already seen.

	Transitions between arrangements are handled by sliding the new control	in
	from the right. If the old controls can fit within the width of the	container,
	they will slide to the left; if not, they will collapse to the left.

	The control's child components may be of any kind; by default, they are
	instances of _moon.Panel_.

		{name: "panels", kind: "moon.Panels", pattern: "alwaysviewing", classes: "enyo-fit", components: [
			{title: "First", components: [
				{kind: "moon.Item", style: "margin-top:20px;", content: "Item One"},
				{kind: "moon.Item", content: "Item Two"},
				{kind: "moon.Item", content: "Item Three"},
				{kind: "moon.Item", content: "Item Four"},
				{kind: "moon.Item", content: "Item Five"}
			]},
			{title: "Second", joinToPrev: true, components: [
				{kind: "moon.Item", style: "margin-top:20px;", content: "Item One"},
				{kind: "moon.Item", content: "Item Two"},
				{kind: "moon.Item", content: "Item Three"},
				{kind: "moon.Item", content: "Item Four"},
				{kind: "moon.Item", content: "Item Five"}
			]}
		]}
*/
enyo.kind({
	name: "moon.BreadcrumbArranger",
	kind: "enyo.DockRightArranger",
	breadcrumbWidth: 220,
	debug: false,
	size: function() {
		var containerWidth = this.getContainerWidth(),
			panels = this.container.getPanels(),
			joinedPanels,
			i;

		// Set up default widths for each panel
		for (i = 0; i < panels.length; i++) {
			// If panels have already been stretched, unstretch them before doing calculations
			if (panels[i].actualWidth) {
				panels[i].applyStyle("width", panels[i].width + "px");
			}

			panels[i].actualWidth = null;
			panels[i].width = panels[i].getBounds().width;
		}

		// Calculate which panels will be joined
		joinedPanels = this.calculateJoinedPanels(containerWidth);

		// Stretch all panels to fit vertically
		this.applyVerticalFit();

		// Reset panel arrangement positions
		this.container.transitionPositions = this.calculateTransitionPositions(containerWidth, joinedPanels);
		this.adjustTransitionPositionsForJoinedPanels(joinedPanels);

		// Update individual panel widths to account for _joinedPanels_
		this.updateWidths(containerWidth, joinedPanels);
		this.applyUpdatedWidths();

		// Calculate _this.breadcrumbPositions_
		this.calcBreadcrumbPositions(joinedPanels);

		if (this.debug) {
			enyo.log("transitionPositions:", this.container.transitionPositions);
			enyo.log("breadcrumbPositions:", this.breadcrumbPositions);
		}
	},
	calculateJoinedPanels: function(inContainerWidth) {
		inContainerWidth = inContainerWidth || this.getContainerWidth();

		var panels = this.container.getPanels(),
			joinedPanels = {};

		for (var panelIndex = 0; panelIndex < panels.length; panelIndex++) {
			for (var index = 0; index < panels.length; index++) {
				if (panelIndex > index) {
					joinedPanels[panelIndex + "." + index] = this.isPanelJoined(panelIndex, index, inContainerWidth);
				}
			}
		}

		return this.formatJoinedPanels(joinedPanels);
	},
	isPanelJoined: function(inPanelIndex, inIndex, inContainerWidth) {
		inContainerWidth = inContainerWidth || this.getContainerWidth();

		var panels = this.container.getPanels(),
			xPos = this.getBreadcrumbEdge(inIndex),
			i = inPanelIndex;

		while(i > inIndex) {
			if (!panels[i].joinToPrev) {
				return false;
			}

			xPos += panels[i].width;
			i--;
		}

		if(xPos + panels[inIndex].width > inContainerWidth) {
			return false;
		}

		return true;
	},
	formatJoinedPanels: function(inJoinedPanels) {
		var panels = this.container.getPanels(),
			ret = [], i, j;

		for (i = 0; i < panels.length; i++) {
			for (j = 0; j < panels.length; j++) {
				if (!inJoinedPanels[i+"."+j]) {
					continue;
				}

				ret[i] = ret[i] || [];
				ret[i].push(j);
			}
		}

		return ret;
	},
	calculateTransitionPositions: function(inContainerWidth, inJoinedPanels) {
		var panels = this.container.getPanels(),
			tp = {};

		for (var panelIndex = 0; panelIndex < panels.length; panelIndex++) {
			for (var index = 0; index < panels.length; index++) {
				tp[panelIndex + "." + index] = this.calculateXPos(panelIndex, index, inContainerWidth, inJoinedPanels);
			}
		}

		return tp;
	},
	calculateXPos: function(inPanelIndex, inIndex, inContainerWidth, inJoinedPanels) {
		var breadcrumbEdge = this.getBreadcrumbEdge(inIndex),
			panels = this.container.getPanels(),
			xPos,
			i;

		// each active item should be at _breadcrumbEdge_
		if (inIndex === inPanelIndex) {
			return breadcrumbEdge;

		// breadcrumbed panels should be positioned to the left
		} else if (inIndex > inPanelIndex) {
			return breadcrumbEdge - (inIndex - inPanelIndex) * this.breadcrumbWidth;

		// upcoming panels should be layed out to the right if _joinToPrev_ is true
		} else {
			// If this panel is not joined at this index, put it off the screen to the right
			if (!inJoinedPanels[inPanelIndex] || inJoinedPanels[inPanelIndex].indexOf(inIndex) === -1) {
				return inContainerWidth;
			}

			xPos = breadcrumbEdge;

			i = inPanelIndex;
			while (i > inIndex) {
				if (panels[i - 1]) {
					xPos += panels[i - 1].width;
				}
				i--;
			}

			return xPos;
		}
	},
	recalculatePanelTransitionPositions: function(inPanelIndex, inContainerWidth, inJoinedPanels) {
		var panels = this.container.getPanels();
		for (var i = 0; i < panels.length; i++) {
			this.container.transitionPositions[inPanelIndex + "." + i] = this.calculateXPos(inPanelIndex, i, inContainerWidth, inJoinedPanels);
		}
	},
	adjustTransitionPositionsForJoinedPanels: function(inJoinedPanels) {
		var tp = this.container.transitionPositions,
			panels = this.container.getPanels();

		for (var i = panels.length; i >= 0; i--) {
			if (!inJoinedPanels[i]) {
				continue;
			}

			for (var j = inJoinedPanels[i].length - 1; j >= 0; j--) {
				for (var k = 0; k < panels.length; k++) {
					tp[k+"."+i] = tp[k+"."+inJoinedPanels[i][j]];
				}
			}
		}
	},
	updateWidths: function(inContainerWidth, inJoinedPanels) {
		var panels = this.container.getPanels(),
			diff,
			i, j;

		// Calculate stretched widths for panels at the end of given index
		for (i = 0; i < inJoinedPanels.length; i++) {
			if (!inJoinedPanels[i]) {
				continue;
			}

			var totalWidth = panels[i].width + this.getBreadcrumbEdge(inJoinedPanels[i][0]);

			// Add the width of each additional panel that is visible at this index
			for (j = 0; j < inJoinedPanels[i].length; j++) {
				// If this panel is joined with another one that has already been stretched, reposition
				// it so everything is kosher. TODO - this is a strange edge case, needs to be discussed.
				if (panels[inJoinedPanels[i][j]].actualWidth) {
					totalWidth += panels[inJoinedPanels[i][j]].actualWidth;
					// TODO - this.recalculatePanelTransitionPositions(i, inContainerWidth, inJoinedPanels);
				} else {
					totalWidth += panels[inJoinedPanels[i][j]].width;
				}
			}

			diff = inContainerWidth - totalWidth;
			panels[i].actualWidth = panels[i].width + diff;

			if (this.debug) {
				enyo.log(i, panels[i].width, "-->", panels[i].actualWidth);
			}
		}

		// Stretch all panels that should fill the whole width
		for (i = 0; i < panels.length; i++) {
			if (!panels[i].actualWidth) {
				var match = false;
				for (j = 0; j < inJoinedPanels.length; j++) {
					if (inJoinedPanels[j] && inJoinedPanels[j].indexOf(i) >= 0) {
						match = true;
					}
				}
				panels[i].actualWidth = (match) ? panels[i].width : inContainerWidth - this.getBreadcrumbEdge(i);
			}
		}
	},
	applyUpdatedWidths: function() {
		var panels = this.container.getPanels();
		for (var i = 0; i < panels.length; i++) {
			panels[i].applyStyle("width", panels[i].actualWidth + "px");
		}
	},
	calcBreadcrumbPositions: function(inJoinedPanels) {
		var panels = this.container.getPanels(),
			isBreadcrumb,
			index,
			i;

		this.breadcrumbPositions = {};

		for (i = 0; i < panels.length; i++) {
			for (index = 0; index < panels.length; index++) {
				isBreadcrumb = false;

				if (index > i) {
					isBreadcrumb = !(inJoinedPanels[index] && inJoinedPanels[index].indexOf(i) > -1);
				}

				this.breadcrumbPositions[i+"."+index] = isBreadcrumb;
			}
		}
	},
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
				var width = panel.getBounds().width;
				var nextTp = tp[i+1+"."+this.container.toIndex];
				if (width > nextTp) {
					hiding.push(i);
				}
			}
		}

		this.container.hiddenPanels = hiding;
	},
	arrange: function(inC, inName) {
		var c$ = this.container.getPanels();
		var s = this.container.clamp(inName);
		var i, c, xPos;

		for (i=0; (c=c$[i]); i++) {
			xPos = this.container.transitionPositions[i + "." + s];
			this.arrangeControl(c, {left: xPos});
		}
	},
	isOutOfScreen: function(inIndex) {
		return this.container.transitionPositions[inIndex+"."+this.container.getIndex()] >= this.containerBounds.width;
	},
	isBreadcrumb: function(inPanelIndex, inActiveIndex) {
		return this.breadcrumbPositions[inPanelIndex + "." + inActiveIndex];
	},
	calcBreadcrumbEdges: function() {
		this.breadcrumbEdges = [];
		for (var i = 0, panel; (panel = this.container.getPanels()[i]); i++) {
			this.breadcrumbEdges[i] = (i === 0) ? 0 : this.breadcrumbWidth;
		}
	},
	getContainerWidth: function() {
		var containerWidth = this.containerBounds.width,
			padding = this.getContainerPadding();
		return containerWidth - (padding.left + padding.right);
	},
	getBreadcrumbEdge: function(inIndex) {
		var leftMargin = this.containerBounds.width * (1 - this.container.panelCoverRatio);
		if (this.container.showFirstBreadcrumb && inIndex !== 0) {
			leftMargin += this.breadcrumbWidth;
		}
		return leftMargin;
	},
	//* Sets bounds for each panel to fit vertically.
	applyVerticalFit: function() {
		var panels = this.container.getPanels(),
			padding = this.getContainerPadding();

		for (var i = 0, panel; (panel = panels[i]); i++) {
			panel.setBounds({top: padding.top, bottom: padding.bottom});
		}
	},
	getContainerPadding: function() {
		return this.container.hasNode() ? enyo.dom.calcPaddingExtents(this.container.node) : {};
	},
	getTransitionOptions: function(fromIndex, toIndex) {
		return {isBreadcrumb: this.isBreadcrumb(fromIndex, toIndex)};
	}
});