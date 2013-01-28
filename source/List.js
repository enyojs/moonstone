enyo.kind({
	name: "moon.List",
	kind: "enyo.List",
	classes: "moon-list",
	touch:true,
	published: {
		//* Percent of scroller client area to jump when paging
		pagePercent: 40,
		//* Hide the paging controls if a key is pressed (5 way mode)
		hidePagingOnKey: true,
		//*Only show the paging controls if user is hovering the pointer above this control
		hoverPagingOnly: false
	},
	handlers: {
		onScrollStop: "updatePageControls",
		onenter: "enter",
		onleave: "leave",
		onPaginate: "paginate"
	},
	horizonalPageControls: [
		{name: "pageLeftControl", kind: "moon.PagingControl", side: "left"},
		{name: "pageRightControl", kind: "moon.PagingControl", side: "right"}
	],
	verticalPageControls: [
		{name: "pageUpControl", kind: "moon.PagingControl", side: "top"},
		{name: "pageDownControl", kind: "moon.PagingControl", side: "bottom"}
	],
	//Are the page controls currently hidden
	pageControlsHidden: true,
	//Is the pointer hovering over this control
	hovering: false,
	components: [
		{kind: "Signals", onSpotlightModeChanged: "spotlightModeChanged"}
	],
	initComponents: function() {
		this.createPageControls();
		this.inherited(arguments);
		
		//* This should be moved to the appropriate strategy when the time is right
		this.$.strategy.animateToNode = function(inNode) {
			if(!this.scrollNode) {
				return;
			}
			
			var sb = this.getScrollBounds(),
				b = {height: inNode.offsetHeight, width: inNode.offsetWidth, top: 0, left: 0},
				n = inNode;

			while (n && n.parentNode && n.id != this.scrollNode.id) {
				b.top += n.offsetTop;
				b.left += n.offsetLeft;
				n = n.parentNode;
			}

			var xDir = b.left - sb.left > 0 ? 1 : b.left - sb.left < 0 ? -1 : 0;
			var yDir = b.top - sb.top > 0 ? 1 : b.top - sb.top < 0 ? -1 : 0;

			var y = (yDir === 0) ? sb.top  : Math.min(sb.maxTop, b.top);
			var x = (xDir === 0) ? sb.left : Math.min(sb.maxLeft, b.left);
			
			this.scrollTo(x,y);
		}
	},
	createPageControls: function() {
		if(this.getHorizontal() !== "hidden") {
			this.createChrome(this.horizonalPageControls);
		}
		if(this.getVertical() !== "hidden") {
			this.createChrome(this.verticalPageControls);
		}
	},
	rendered: function() {
		this.inherited(arguments);
		this.positionPageControls();
	},
	enter: function(){
		if (this.hoverPagingOnly) {
			this.pageControlsHidden = false;
			this.hovering = true;
			this.updatePageControls();
		}
	},
	leave: function(){
		if (this.hoverPagingOnly) {
			this.hovering = false;
			this.hidePageControls();
		}
	},
	hidePageControls: function() {
		this.pageControlsHidden = true;
		this.$.pageUpControl.hide();
		this.$.pageDownControl.hide();
		this.$.pageLeftControl.hide();
		this.$.pageRightControl.hide();
	},
	updatePageControls: function() {
		if (this.pageControlsHidden) {
			return;
		}
		
		if (this.getHorizontal() !== "hidden") {
			this.updateHorizontalPageControls();
		}
		
		if (this.getVertical() !== "hidden") {
			this.updateVerticalPageControls();
		}
	},
	updateHorizontalPageControls: function() {
		var sb = this.getScrollBounds();
		
		// Hide horizontal controls if no room to scroll
		if (sb.clientWidth >= sb.width) {
			this.$.pageLeftControl.hide();
			this.$.pageRightControl.hide();
			return;
		}
		
		this.showHidePageControls(this.getScrollLeft(), sb.maxLeft, this.$.pageLeftControl, this.$.pageRightControl);
	},
	updateVerticalPageControls: function() {
		var sb = this.getScrollBounds();
		
		// Hide vertical controls if no room to scroll
		if (sb.clientHeight >= sb.height) {
			this.$.pageUpControl.hide();
			this.$.pageDownControl.hide();
			return;
		}
		
		this.showHidePageControls(this.getScrollTop(), sb.maxTop, this.$.pageUpControl, this.$.pageDownControl);
	},
	showHidePageControls: function(inPos, inBoundary, inControlBack, inControlForward) {
		// If we are beyond the back edge, show and position back control
		if (!inControlBack.getShowing() && (inPos > 0)) {
			inControlBack.show();
			this.positionPageControl(inControlBack);
		} else if (inPos === 0) {
			inControlBack.hide();
		}
		
		// If we are beyond the forward edge, show and position forward control
		if (!inControlForward.getShowing() && (inPos < inBoundary)) {
			inControlForward.show();
			this.positionPageControl(inControlForward);	
		} else if (inPos === inBoundary) {
			inControlForward.hide();
		}
	},
	positionPageControls: function() {
		if (this.getHorizontal() !== "hidden") {
			this.positionPageControl(this.$.pageLeftControl);
			this.positionPageControl(this.$.pageRightControl);
		}
		
		if (this.getVertical() !== "hidden") {
			this.positionPageControl(this.$.pageUpControl);
			this.positionPageControl(this.$.pageDownControl);
		}
	},
	//* Position _inControl_ based on it's _side_ value (top, right, bottom, or left)
	positionPageControl: function(inControl) {
		var sb = this.getScrollBounds(),
			cb = inControl.getBounds(),
			side = inControl.getSide(),
			attribute,
			position;
		
		if (side === "top" || side === "bottom") {
			attribute = "left";
			position = sb.clientWidth/2 - cb.width/2;
		} else {
			attribute = "top";
			position = sb.clientHeight/2 - cb.height/2;
		}
		
		inControl.applyStyle(attribute,position+"px");
	},
	pageBack: function() {
		var i = this.$.generator.hasNode().querySelector('#' + this.findBoundingPageOnBack().id + " div[data-enyo-index]").getAttribute("data-enyo-index", 10),
			sb = this.getScrollBounds(),
			node,
			pageDelta,
			threshold = this.orientV ? sb.top : sb.left;
		
		for(i;i<this.count;i++) {
			node = this.$.generator.fetchRowNode(i);
			
			pageDelta = (this.orientV)
				?	(node.offsetParent.offsetTop  + node.offsetTop  + sb.clientHeight)
				:	(node.offsetParent.offsetLeft + node.offsetLeft + sb.clientWidth);
			
			//find the first node whose top/left edge will be at or past the scrollers top/left edge when scrolled
			if (pageDelta >= threshold) {
				this.getStrategy().animateToNode(node);
				return;
			}
		}
	},
	pageForward: function() {
		var i = this.$.generator.hasNode().querySelector('#' + this.findBoundingPageOnForward().id + " div[data-enyo-index]").getAttribute("data-enyo-index", 10),
			sb = this.getScrollBounds(),
			node,
			nodeEdge,
			threshold = this.orientV ? sb.top + sb.clientHeight : sb.left + sb.clientWidth;

		for(i;i<this.count;i++) {
			node = this.$.generator.fetchRowNode(i);
			nodeEdge = (this.orientV)
				?	(node.offsetParent.offsetTop  + node.offsetTop  + node.clientHeight)
				:	(node.offsetParent.offsetLeft + node.offsetLeft + node.clientWidth);
			
			//scroll to the first offscreen (or partially offscreen) node
			if (nodeEdge > threshold) {
				this.getStrategy().animateToNode(node);
				return;
			}
		}
		
		
		
		/*
		//now find the node to scroll to which keeps the previoulsy found node fully onscreen
		var j=i;
		while (j < this.count) {
			var node = this.$.generator.fetchRowNode(j);
			var nEdge = this.orientV ? (node.offsetParent.offsetTop + node.offsetTop + node.clientHeight) : 
			                            (node.offsetParent.offsetLeft + node.offsetLeft + node.clientWidth);
			var nReposition = nEdge - (this.orientV ? sb.clientHeight : sb.clientWidth);
			var scrollerEdge = this.orientV ? (sb.top + sb.clientHeight) : (sb.left + sb.clientWidth);
			
			if (nReposition <= scrollerEdge) {	
				var posDelta = this.orientV ? (nEdge - scrollerEdge) : (nEdge - scrollerEdge);
				var oReposition = (this.orientV ? (rNode.offsetParent.offsetTop + rNode.offsetTop) : (rNode.offsetParent.offsetLeft + rNode.offsetLeft)) - posDelta;
				
				if (oReposition <= (this.orientV ? sb.top : sb.left)) {
					//went a little too far, but previous node is it
					break;
				} else {
					//works but see if we can go further
					j++;
				}
			} else if (nReposition > scrollerEdge) {
				//went too far
				j--;				
				break;
			} else {
				//haven't gotten to a node far right enough yet
				j++;
			}
		}
		this.getStrategy().animateToNode(this.$.generator.fetchRowNode(j >= this.count ? this.count-1 : j));
		*/
	},
	findBoundingPageOnBack: function() {
		var sb = this.getScrollBounds(),
			coordinate = this.orientV ? sb.top - sb.clientHeight : sb.left - sb.clientWidth,
			pageInfo = this.positionToPageInfo(coordinate);

		return (pageInfo.no === this.p0) ? this.$.page0 : this.$.page1;
	},
	findBoundingPageOnForward: function() {
		var sb = this.getScrollBounds(),
			coordinate = this.orientV ? sb.top + sb.clientHeight : sb.left + sb.clientWidth,
			pageInfo = this.positionToPageInfo(coordinate);

		return (pageInfo.no === this.p0) ? this.$.page0 : this.$.page1;
	},
	spotlightModeChanged: function(inSender, inEvent) {
		if (inEvent.pointerMode && (!this.hoverPagingOnly || this.hovering)) {
			this.pageControlsHidden = false;
			this.updatePageControls();	
		} else if (this.hidePagingOnKey) {
			this.hidePageControls();			
		}
	},
	//* Handle paginate event sent from PagingControl buttons
	paginate: function(inSender, inEvent) {
		switch (inEvent.side) {
			case "top":
			case "left":
				this.pageBack();
				return;
			case "bottom":
			case "right":
				this.pageForward();
				return;
		}
	}
});