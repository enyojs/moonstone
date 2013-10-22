enyo.kind({
	name: "moon.ScrollThumb",
	kind: "enyo.ScrollThumb",
	published: {
		sizeRatio: 1
	},
	classes: "moon-thumb matrix3dsurface",
	position: 0,
	create: function() {
		this.inherited(arguments);
		this.positionProp = (this.axis === "v") ? "scrollTop" : "scrollLeft";
		this.accel = enyo.dom.canAccelerate();
		this.transformProp = enyo.dom.getCssTransformProp();
		this.transitionProp = enyo.dom.transition;
	},
	//* Syncs the scroll indicator bar to the scroller size and position,
	//* as determined by the passed-in scroll strategy.
	sync: function(inStrategy, inDuration) {
		this.scrollBounds = inStrategy._getScrollBounds();
		this.timingFunction = inStrategy.timingFunction;
		this.transitionDuration = inDuration || 0.5;
		this.update(inStrategy);
	},
	update: function(inStrategy) {
		if (!this.showing || !this.scrollBounds || !this.hasNode()) {
			return;
		}
		
		this.updateSize();
		this.updatePosition(inStrategy);
	},
	updateSize: function() {
		var scrollerBounds = this.scrollBounds[this.sizeDimension],
			scrollerDimension = this.scrollBounds[this.dimension],
			size = Math.max(this.minSize, Math.floor(scrollerBounds * scrollerBounds * this.getSizeRatio() / scrollerDimension));
		
		if (size === this.size) {
			return;
		}
		
		this.hasNode().style[this.dimension] = this.domStyles[this.dimension] = size + "px";
		this.size = size;
	},
	updatePosition: function(inStrategy) {
		var scrollBounds = this.scrollBounds[this.sizeDimension],
			scrollDimension = this.scrollBounds[this.dimension],
			scrollPosition = inStrategy[this.positionProp],
			position = Math.max(0, Math.floor(scrollBounds * scrollPosition * this.getSizeRatio() / scrollDimension));
		
		if (position === this.position) {
			return;
		}
		
		this.addStyles(this.generateTransitionStyleString() + this.generateTransformStyleString(position));
		this.position = position;
	},
	show: function() {
		this.cancelDelayHide();
		this.removeClass("hidden");
	},
	hide: function() {
		this.addClass("hidden");
	},
	generateTransitionStyleString: function() {
		return this.transitionProp + ": " + this.transformProp + " " + this.transitionDuration + "s " + this.timingFunction + "; ";
	},
	generateTransformStyleString: function(inPosition) {
		return this.transformProp + ": " + this.translation + "("  + inPosition + "px); ";
	}
});