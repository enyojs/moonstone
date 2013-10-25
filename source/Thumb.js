enyo.kind({
	name: "moon.ScrollThumb",
	kind: "enyo.ScrollThumb",
	published: {
		sizeRatio: 1
	},
	//* @protected
	classes: "moon-thumb matrix3dsurface",
	position: 0,
	scrollBounds: null,
	timingFunction: "linear",
	transitionDuration: 0.5,
	defaultTransitionDuration: 0.5,
	create: function() {
		this.inherited(arguments);
		this.positionProp = (this.axis === "v") ? "targetTop" : "targetLeft";
		this.fallbackPositionProp = (this.axis === "v") ? "scrollTop" : "scrollLeft";
		this.accel = enyo.dom.canAccelerate();
		this.transformProp = enyo.dom.getCssTransformProp();
		this.transitionProp = enyo.dom.transition;
	},
	//* Syncs the scroll indicator bar to the scroller size and position, as determined by the passed-in scroll strategy.
	sync: function(inStrategy, inDuration) {
		this.scrollBounds = inStrategy._getScrollBounds();
		this.timingFunction = inStrategy.generateTimingFunctionString();
		this.transitionDuration = Math.round(100*inDuration/1000)/100 || this.defaultTransitionDuration;
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
			scrollPosition = (inStrategy[this.positionProp] !== null) ? inStrategy[this.positionProp] : inStrategy[this.fallbackPositionProp];
		
		this.position = Math.max(0, Math.floor(scrollBounds * scrollPosition * this.getSizeRatio() / scrollDimension));
		this.effectPosition();
	},
	show: function() {
		this.cancelDelayHide();
		this.removeClass("hidden");
	},
	hide: function() {
		this.addClass("hidden");
	},
	twiddle: function() {
		this.addStyles(this.generateTransformStyleString(this.position-1));
	},
	effectPosition: function() {
		this.addStyles(this.generateTransitionStyleString() + this.generateTransformStyleString(this.position));
	},
	generateTransitionStyleString: function() {
		return this.transitionProp + ": " + this.transformProp + " " + this.transitionDuration + "s " + this.timingFunction + "; ";
	},
	generateTransformStyleString: function(inPosition) {
		return this.transformProp + ": " + this.translation + "(" + inPosition + "px); ";
	}
});