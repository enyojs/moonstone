enyo.kind({
	name: "enyo.TransitionThumb",
	kind: "enyo.ScrollThumb",
	published: {
		sizeRatio: 1
	},
	//* @protected
	classes: "enyo-transition-thumb matrix3dsurface",
	position: 0,
	scrollBounds: null,
	timingFunction: "linear",
	transitionDuration: 0.5,
	defaultTransitionDuration: 0.5,
	create: function() {
		this.inherited(arguments);
		this.positionProp = (this.axis === "v") ? "targetTop" : "targetLeft";
		this.fallbackPositionProp = (this.axis === "v") ? "scrollTop" : "scrollLeft";
		this.maxProp = (this.axis === "v") ? "maxTop" : "maxLeft";
		this.accel = enyo.dom.canAccelerate();
		this.transformProp = enyo.dom.getCssTransformProp();
		this.transitionProp = enyo.dom.transition;
	},
	//* Syncs the scroll indicator bar to the scroller size and position, as determined by the passed-in scroll strategy.
	sync: function(inStrategy, inDuration) {
		if (!inDuration) {
			this.directSync(inStrategy);
			return;
		}
		
		this.scrollBounds = inStrategy.getScrollBounds(true);
		this.timingFunction = inStrategy.generateTimingFunctionString();
		this.transitionDuration = Math.round(100*inDuration/1000)/100 || this.defaultTransitionDuration;
		this.update(inStrategy);
	},
	//* Sync directly with no transition time
	directSync: function(inStrategy) {
		this.scrollBounds = inStrategy.getScrollBounds(true);
		this.transitionDuration = 0;
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
		var scrollerSize = this.scrollBounds[this.sizeDimension],
			containerSize = this.calcContainerSize(),
			scrollDistance = scrollerSize + this.scrollBounds[this.maxProp],
			size = Math.max(this.minSize, Math.round(scrollerSize * containerSize / scrollDistance));
		
		if (size === this.size) {
			return;
		}

		this.size = size;
		this.effectSize();
	},
	updatePosition: function(inStrategy) {
		var scrollerSize = this.scrollBounds[this.sizeDimension],
			containerSize = this.calcContainerSize(),
			scrollPosition = (inStrategy[this.positionProp] !== null) ? inStrategy[this.positionProp] : inStrategy[this.fallbackPositionProp],
			scrollDistance = this.scrollBounds[this.maxProp],
			completeRatio = scrollPosition / scrollDistance,
			usableWidth = containerSize - this.size;
			
		this.position = usableWidth * completeRatio;
		this.effectPosition();
	},
	calcContainerSize: function() {
		return this.scrollBounds[this.sizeDimension];
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
	effectSize: function() {
		this.applyStyle(this.dimension, this.size + "px");
	},
	generateTransitionStyleString: function() {
		return this.transitionProp + ": " + this.transformProp + " " + this.transitionDuration + "s " + this.timingFunction + "; ";
	},
	generateTransformStyleString: function(inPosition) {
		return this.transformProp + ": " + this.translation + "(" + inPosition + "px); ";
	}
});