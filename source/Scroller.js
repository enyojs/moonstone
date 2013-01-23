
enyo.kind({
	name: "moon.Scroller",
	kind: "enyo.Scroller",
	published: {
		pagePercent: 40, //Percent of scroller client area to jump when paging
		hidePagingOnKey: false, //Hide the paging controls if a key is pressed (5 way mode)
		hoverPagingOnly: false //Only show the paging controls if user is hovering the pointer above this control
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
	hovering: false, //Is pointer hovering over this control
	components: [
		{kind: "Signals", onSpotlightModeChanged: "spotlightModeChanged"}
	],
	handlers: {
		onSpotlightFocused: "_spotFocused",
		onScrollStop: "updatePageControls",
		onenter: "enter",
		onleave: "leave"		
	},
	create: function() { 
		this.orientV = this.vertical == "default";				
		this.inherited(arguments);
	},
	initComponents: function() {
		this.createChrome(this.orientV ? this.verticalPageControls : this.horizonalPageControls);
		this.inherited(arguments);
	},
	spotFocused: function(inSender, inEvent) {
		if(inEvent.originator === this) {
			return;
		}
		
		if(!this.$.strategy.isInView(inEvent.originator.hasNode())) {
			this.scrollToNode(inEvent.originator.hasNode(), true, true);
		}
	},
	spotlightModeChanged: function(inSender, inEvent) {
		if (inEvent.pointerMode) {
			this.updatePageControls();
		} else if (this.hidePagingOnKey) {
			this.$.pageBackControl.hide();
			this.$.pageForwardControl.hide();				
		}
	},
	enter: function(){
		if (this.hoverPagingOnly) {
			this.hovering = true;
			this.updatePageControls();
		}
	},
	leave: function(){
		if (this.hoverPagingOnly) {
			this.hovering = false;			
			this.$.pageBackControl.hide();
			this.$.pageForwardControl.hide();			
		}
	},
	updatePageControls: function(inSender, inEvent) {
		var sb = this.getScrollBounds();		
		var scrollPos = this.orientV ? sb.top : sb.left;
		var scrollBoundary = this.orientV ? sb.maxTop : sb.maxLeft;
		
		//if we're in hover only mode & they're not hovering, get out of here
		if (this.hoverPagingOnly && !this.hovering) {
			return;
		}
		
		//show the relevant control if we're not at the corresponding  edge
		if (!this.$.pageBackControl.showing && (scrollPos > 0)) {
			this.$.pageBackControl.show();
		} 
		if (!this.$.pageForwardControl.showing && (scrollPos < scrollBoundary)) {
			//make sure that there's room for scrolling, otherwise don't show controls at all
			if ((this.orientV ? sb.clientHeight : sb.clientWidth) < (this.orientV ? sb.height : sb.width)) {
				this.$.pageForwardControl.show();				
			}
		}
		//if we hit an edge, hide the corresponding page control
		if (scrollPos == 0) {
			this.$.pageBackControl.hide();
		} else if (scrollPos == scrollBoundary) {
			this.$.pageForwardControl.hide();
		}
	},
	scrollToNode: function(inNode) {
		this.$.strategy.animateToNode(inNode);
	},
	rendered: function() {
		this.inherited(arguments);
		this.updatePageControls();
		
		// TODO - this should be copied/pasted into ScrollStrategy.js when the time is right.
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
		};
	},
	pageBack: function() {
		var sb = this.getScrollBounds();
		if (this.orientV) {
			this.scrollTo(0,sb.top - sb.maxTop * (this.pagePercent/100));
		} else {
			this.scrollTo(sb.left - sb.maxLeft * (this.pagePercent/100),0);
		}
	},
	pageForward: function() {
		var sb = this.getScrollBounds();
		if (this.orientV) {
			this.scrollTo(0,sb.top + sb.maxTop * (this.pagePercent/100));
		} else {
			this.scrollTo(sb.left + sb.maxLeft * (this.pagePercent/100),0);
		}
	}
});