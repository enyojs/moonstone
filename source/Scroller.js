
enyo.kind({
	name: "moon.Scroller",
	kind: "enyo.Scroller",
	published: {
		pagePercent: 40
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
	handlers: {
		onSpotlightFocused: "_spotFocused",
		onScrollStop: "scrollStop"
	},
	create: function() { 
		this.orientV = this.vertical == "default";				
		this.inherited(arguments);
	},
	initComponents: function() {
		this.createChrome(this.orientV ? this.verticalPageControls : this.horizonalPageControls);
		this.inherited(arguments);
	},
	_spotFocused: function(inSender, inEvent) {
		if(inEvent.originator === this) {
			return;
		}
		
		if(!this.$.strategy.isInView(inEvent.originator.hasNode())) {
			this.scrollToNode(inEvent.originator.hasNode(), true, true);
		}
	},
	scrollStop: function(inSender, inEvent) {
		var scrollPos = this.orientV ? inEvent.originator.y : inEvent.originator.x;
		var scrollBoundary = this.orientV ? inEvent.originator.bottomBoundary : inEvent.originator.rightBoundary;
		var sb = this.getScrollBounds();
		
		//show the relevant control if we're not at the cooresponding extreme edge
		if (!this.$.pageBackControl.showing && (scrollPos < 0)) {
			this.$.pageBackControl.show();
		} else if (!this.$.pageForwardControl.showing && (scrollPos > scrollBoundary)) {
			//make sure that there's room for scrolling, otherwise don't show controls at all
			if ((this.orientV ? sb.clientHeight : sb.clientWidth) < (this.orientV ? sb.height : sb.width)) {
				this.$.pageForwardControl.show();				
			}
		}
		//if we hit an edge, hide the cooresponding page control
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
	updatePageControls: function() {
		if ((this.orientV ? this.getScrollBounds().clientHeight : this.getScrollBounds().clientWidth) < 
			(this.orientV ? this.getScrollBounds().height : this.getScrollBounds().width)) {
			this.$.pageForwardControl.show();				
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
