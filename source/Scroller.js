
enyo.kind({
	name: "moon.Scroller",
	kind: "enyo.Scroller",
	spotlight: "container",
	published: {
		//* Percent of scroller client area to jump when paging
		pagePercent: 40,
		//* Hide the paging controls if a key is pressed (5 way mode)
		hidePagingOnKey: false,
		//* Only show the paging controls if user is hovering the pointer above this control
		hoverPagingOnly: false
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
	// Is pointer hovering over this control
	hovering: false,
	components: [
		{kind: "Signals", onSpotlightModeChanged: "spotlightModeChanged"}
	],
	handlers: {
		onSpotlightFocused: "spotFocused",
		onRequestScrollIntoView: "requestScrollIntoView",
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
	rendered: function() {
		this.inherited(arguments);
		this.updatePageControls();
	},
	spotFocused: function(inSender, inEvent) {
		if(inEvent.originator === this) {
			return;
		}
		if(!this.$.strategy.isInView(inEvent.originator.hasNode())) {
			this.animateToControl(inEvent.originator);
		}
	},
	requestScrollIntoView: function(inSender, inEvent) {
		var side = inEvent.side;
		// If the node is not in view, scroll it in
		this.animateToControl(inEvent.originator);
		return true;
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
	animateToControl: function(inControl) {
		var controlBounds = enyo.Spotlight.Util.getAbsoluteBounds(inControl),
			absoluteBounds = enyo.Spotlight.Util.getAbsoluteBounds(this),
			scrollBounds = this.$.strategy.getScrollBounds(),
			offsetTop = controlBounds.top - absoluteBounds.top,
			offsetLeft = controlBounds.left - absoluteBounds.left,
			offsetHeight = controlBounds.height,
			offsetWidth = controlBounds.width,
			xDir,
			yDir,
			x,
			y;
		
		// 0: currently visible, 1: right of viewport, -1: left of viewport
		xDir = (offsetLeft >= scrollBounds.left && offsetLeft + offsetWidth <= scrollBounds.left + scrollBounds.clientWidth)
			?	0
			:	offsetLeft - scrollBounds.left > 0 ? 1 : offsetLeft - scrollBounds.left < 0 ? -1 : 0;
		// 0: currently visible, 1: below viewport, -1: above viewport
		yDir = (offsetTop >= scrollBounds.top && offsetTop + offsetHeight <= scrollBounds.top + scrollBounds.clientHeight)
			?	0
			:	offsetTop - scrollBounds.top > 0 ? 1 : offsetTop - scrollBounds.top < 0 ? -1 : 0;
		
		switch(xDir) {
			case 0:
				x = this.getScrollLeft();
				break;
			case 1:
				x = (offsetWidth > scrollBounds.clientWidth) ? offsetLeft : offsetLeft - scrollBounds.clientWidth + offsetWidth;
				break;
			case -1:
				x = offsetLeft;
				break;
		}
		
		switch(yDir) {
			case 0:
				y = this.getScrollTop();
				break;
			case 1:
				y = (offsetHeight > scrollBounds.clientHeight) ? offsetTop : offsetTop - scrollBounds.clientHeight + offsetHeight;
				break;
			case -1:
				y = offsetTop;
				break;
		}
		
		// If x or y changed, scroll to new position
		if(x !== this.getScrollLeft() || y !== this.getScrollTop()) {
			this.scrollTo(x,y);
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