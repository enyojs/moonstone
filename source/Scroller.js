
enyo.kind({
	name: "moon.Scroller",
	kind: "enyo.Scroller",
	handlers: {
		onSpotlightFocused: "_spotFocused"
	},
	_spotFocused: function(inSender, inEvent) {
		if(inEvent.originator === this) {
			return;
		}
		
		if(!this.$.strategy.isInView(inEvent.originator.hasNode())) {
			this.scrollToNode(inEvent.originator.hasNode(), true, true);
		}
	},
	scrollToNode: function(inNode) {
		this.$.strategy.animateToNode(inNode);
	},
	rendered: function() {
		this.inherited(arguments);
		
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
	}
});
