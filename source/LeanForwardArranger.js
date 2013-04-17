enyo.kind({
	name: "moon.LeanForwardArranger",
	kind: "enyo.DockRightArranger",
	breadcrumbWidth: 200,
	size: function() {
		var c$ = this.container.getPanels(),
			padding = this.container.hasNode() ? enyo.dom.calcPaddingExtents(this.container.node) : {},
			containerWidth = this.containerBounds.width,
			offset,
			xPos,
			join,
			currentIndex = this.container.getIndex(),
			i, j, k, m, c, _w,
			joinedPanels = [],
			breadcrumbEdge,
			tp;
		
		containerWidth -= padding.left + padding.right;
		
		// reset panel arrangement positions
		tp = {};
		
		// setup default widths for each panel
		for (i=0; (c=c$[i]); i++) {
			c.addStyles("min-width:;max-width:;");
			c.width = c.getBounds().width;
		}
		
		this.calcBreadcrumbEdges();
		
		for (var i = 0, panel; (panel = c$[i]); i++) {
			panel.setBounds({top: padding.top, bottom: padding.bottom});
			breadcrumbEdge = this.getBreadcrumbEdge(i);
			
			for (var j = 0, index; (index = c$[j]); j++) {
				
				// each active item should be at _breadcrumbEdge_
				if (i === j) {
					xPos = breadcrumbEdge;
				
				// breadcrumbed panels should be positioned to the left
				} else if (i < j) {
					xPos = breadcrumbEdge - (j - i - 1)*this.breadcrumbWidth;
				
				// upcoming panels should be layed out to the right if _joinToPrev_ is true
				} else if (i > j) {
					xPos = (j === 0) ? 0 : this.breadcrumbWidth;
					for (k = i, join = true; k > j; k--) {
						if (!c$[k].joinToPrev) {
							join = false;
							break;
						}
						xPos += c$[k-1].width;
					}
					
					// if _joinToPrev_ is false or this panel won't fit on screen, move it offscreen
					if (!join || xPos + c$[j].width > containerWidth) {
						xPos = containerWidth;
					} else {
						joinedPanels.push(i);
					}
				}
				tp[i + "." + j] = xPos;
			}
		}
		
		for (var i = 0; i < joinedPanels.length; i++) {
			for (var j = 0; j < c$.length; j++) {
				tp[j+"."+joinedPanels[i]] = tp[j+"."+(joinedPanels[i]-1)];
			}
		}
		
		this.container.transitionPositions = tp;
		this.updateWidths(containerWidth);
	},
	updateWidths: function(inContainerWidth) {
		var tp = this.container.transitionPositions;
		var panels = this.container.getPanels();
		
		for (var i = 0, panel, newWidth; (panel = panels[i]); i++) {
			var stretchPanel = null;
			var stretchIndex = null;
			var breadcrumbEdge = this.getBreadcrumbEdge(i);
			
			for (var index = i; index < panels.length; index++) {
				var thisTp = index+"."+i;
				var thisPanel = panels[index];
				if (tp[thisTp] >= breadcrumbEdge && tp[thisTp] + thisPanel.width < inContainerWidth) {
					stretchIndex = index;
				} else {
					break;
				}
			}
			
			if (stretchIndex !== null) {
				var newWidth = inContainerWidth - tp[stretchIndex+"."+i];
				panels[stretchIndex].addStyles("min-width:"+newWidth+"px;max-width:"+newWidth+"px;");
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
		var i, c;
		var c$ = this.container.getPanels();
		var s = this.container.clamp(inName);

		for (i=0; (c=c$[i]); i++) {
			var xPos = this.container.transitionPositions[i + "." + s];
			var o = 1;
			if(xPos === 0) {
				var width = c.getBounds().width;
				//o = (width > this.container.transitionPositions[i+1 + "." + s]) ? 0 : 1;
			}

			this.arrangeControl(c, {left: xPos, opacity: o});
		}
	},
	isOutOfScreen: function(inIndex) {
		return this.container.transitionPositions[inIndex+"."+this.container.getIndex()] >= this.containerBounds.width;
	},
	isBreadcrumb: function(inPanelIndex, inActiveIndex) {
		var index = inActiveIndex,
			breadcrumbEdge = this.getBreadcrumbEdge(inActiveIndex),
			tp = this.container.transitionPositions,
			tpIndex = inPanelIndex+"."+index,
			pos = tp[tpIndex];
		
		return pos < breadcrumbEdge;
	},
	calcBreadcrumbEdges: function() {
		this.breadcrumbEdges = [];
		for (var i = 0, panel; (panel = this.container.getPanels()[i]); i++) {
			this.breadcrumbEdges[i] = (i === 0 || panel.joinToPrev) ? 0 : this.breadcrumbWidth;
		}
	},
	getBreadcrumbEdge: function(inIndex) {
		return this.breadcrumbEdges[inIndex];
	}
});