enyo.kind({
	name: "moon.List",
	kind: "enyo.List",
	classes: "moon-list",
	touch:true,
	handlers: {
		onScrollStop: "scrollStop"
	},
	horizonalPageControls: [
		{name:"pageBackControl", classes: "moon-page-left", showing:false, components: [
			{kind: "onyx.IconButton", classes: "button", spotlight:true, src: "../images/leftArrow.png", ontap:"pageBack"}
		]},
		{name:"pageForwardControl", classes: "moon-page-right", showing:false, components: [		
			{kind: "onyx.IconButton", classes: "button", spotlight:true, src: "../images/rightArrow.png", ontap:"pageForward"}
		]}
	],	
	verticalPageControls: [
		{name:"pageBackControl", classes: "moon-page-up", showing:false, components: [
			{kind: "onyx.IconButton", classes: "button", spotlight:true, src: "../images/upArrow.png", ontap:"pageBack"}
		]},
		{name:"pageForwardControl", classes: "moon-page-down", showing:false, components: [		
			{kind: "onyx.IconButton", classes: "button", spotlight:true, src: "../images/downArrow.png", ontap:"pageForward"}
		]}
	],
	initComponents: function() {
		this.createChrome(this.orientV ? this.verticalPageControls : this.horizonalPageControls);
		this.inherited(arguments);
		
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

			// Only scroll far enough to reveal _inNode_
			var y = (yDir === 0)
				?	sb.top
				:	Math.min(sb.maxTop, (yDir === 1) ? b.top - sb.clientHeight + b.height : b.top);
			var x = (xDir === 0)
				?	sb.left
				:	Math.min(sb.maxLeft, (xDir === 1) ? b.left - sb.clientWidth + b.width : b.left);

			this.scrollTo(x,y);
		}
	},
	scrollStop: function(inSender, inEvent) {
		var scrollPos = this.orientV ? inEvent.originator.y : inEvent.originator.x;
		var sb = this.orientV ? inEvent.originator.bottomBoundary : inEvent.originator.rightBoundary;
		
		//show the relevant control if we're not at the cooresponding extreme edge
		if (!this.$.pageBackControl.showing && (scrollPos < 0)) {
			this.$.pageBackControl.show();
		} else if (!this.$.pageForwardControl.showing && (scrollPos > sb)) {
			//make sure that there's room for scrolling, otherwise don't show controls at all
			if (this.scrollerSize < this.portSize) {
				this.$.pageForwardControl.show();				
			}
		}

		//if we hit an edge, hide the cooresponding page control
		if (scrollPos == 0) {
			this.$.pageBackControl.hide();
		} else if (scrollPos == sb) {
			this.$.pageForwardControl.hide();
		}
	},
	pageBack: function() {
		var i = document.querySelector('#' +  this.findBoundingPageOnBack().id + " div[data-enyo-index]").getAttribute("data-enyo-index", 10);
		var sb = this.getScrollBounds();
		
		while (i < this.count) {
			var node = this.$.generator.fetchRowNode(i);
			var pageDelta = this.orientV ? (node.offsetParent.offsetTop + node.offsetTop + sb.clientHeight) :
			 							   (node.offsetParent.offsetLeft + node.offsetLeft + sb.clientWidth);
			//find the first node whose left edge will be at or past the scrollers left edge when scrolled
			if (pageDelta >= (this.orientV ? sb.top : sb.left)) {
				this.getStrategy().animateToNode(node);
				break;
			} else {
				i++;
			}
		}
	},
	pageForward: function() {
		var i = document.querySelector('#' +  this.findBoundingPageOnForward().id + " div[data-enyo-index]").getAttribute("data-enyo-index", 10);
		var sb = this.getScrollBounds();	
					
		var rNode;
		while (i < this.count) {
			var rNode = this.$.generator.fetchRowNode(i);
			var nodeEdge = this.orientV ? (rNode.offsetParent.offsetTop + rNode.offsetTop + rNode.clientHeight) : 
			                              (rNode.offsetParent.offsetLeft + rNode.offsetLeft + rNode.clientWidth);
			//scroll to the first offscreen (or partially offscreen) node
			if (nodeEdge > (this.orientV ? (sb.top + sb.clientHeight) : (sb.left + sb.clientWidth))) {
				break;
			} else {
				i++;
			}
		}
		
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
	},
	findBoundingPageOnBack: function() {
		var page0Bounds = this.$.page0.getBounds();
		var sb = this.getScrollBounds();		
		var scrollEdge = this.orientV ? (sb.top - sb.clientHeight) : (sb.left - sb.clientWidth);

		//find the page that bounds the area to the left of the scrollers current visible area
		if ((scrollEdge < 0) || ((this.orientV ? page0Bounds.top : page0Bounds.left) <= scrollEdge)) {
			return this.$.page0;
		} else {
			return this.$.page1;
		}			
	},
	findBoundingPageOnForward: function() {
		var page0Bounds = this.$.page0.getBounds();
		var scrollEdge = this.orientV ? this.getScrollTop() : this.getScrollLeft();
		var page0Edge = this.orientV ? (page0Bounds.top + page0Bounds.height) : (page0Bounds.left + page0Bounds.width);
		
		//find the page that bounds the scrollers left edge
		if ((page0Bounds.left <= scrollEdge) && (page0Edge > scrollEdge)) {
			return this.$.page0;
		} else {
			return this.$.page1;			
		}			
	}	
});