enyo.kind({
	name: "enyo.SimpleImageCarousel",
	kind: enyo.Panels,
	arrangerKind: "enyo.CarouselArranger",
	/**
		The default scale value to be applied to each ImageView. Can be "auto",
		"width", "height", or any positive numeric value.
	*/
	defaultScale: "auto",
	//* If true, ImageView instances are created with zooming disabled.
	disableZoom:  false,
	published: {
		//* The number of image items contained in the list
		count: 0,
		//* Initial index value in the list at creation time
		initIndex: 0
	},
	events: {
		/**
			Fires once per item at render time
			_inEvent.index_ contains the current list index
			_inEvent.image_ contains the curren image url
		*/
		onSetupItem: "",
		/** Fires at the end of a image panel transition.
			_inEvent.imageIndex contains the index of active image.
		*/
		onImageSelected: ""
	},
	//* @protected
	handlers: {
		onTransitionStart: "transitionStart",
		onTransitionFinish: "transitionFinish"
	},
	initComponents: function() {
		this.inherited(arguments);
    	for (var i=0; i < 2; i++) {
			this.createComponent({
				name: "container" + i,
				style: "height:100%; width:100%;"
			});
			this.$["container" + i].render();
		}
    },
	rendered: function() {
		this.inherited(arguments);
		if (this.$["container0"].imageIndex === undefined) {
			this.initImageViews();
		}
	},
	initImageViews: function() {
		var thumb = {};
		var image = {};

		this.preload = (this.count < 2) ? this.count : 2;
		if (this.initIndex > 0 && (this.preload + 1 <= this.count)) {
			this.preload++;
			this.createComponent({name: "container2", style: "height:100%; width:100%;"});
		}

		for (var i=0; i < this.preload; i++) {
			var imageIndex = i+this.initIndex;
			if (this.initIndex > 0) {
				imageIndex--;
			}
			this.doSetupItem({index: imageIndex, thumb: thumb, image: image});
			this.$["container" + i].createComponent({
					name: "image" + i,
					kind: "ImageView",
					scale: this.defaultScale,
					disableZoom: this.disableZoom,
					src: image.src,
					verticalDragPropagation: false,
					style: "height:100%; width:100%;"
				}, {owner: this});
			this.$["container" + i].imageIndex = imageIndex;
			this.$["image" + i].render();
		}

		this.index = this.lastIndex = 1;
	},
	transitionStart: function(inSender, inEvent) {
		if (inEvent.fromIndex === inEvent.toIndex) {
			return true; //prevent from bubbling if there's no change
		}
	},
	popPrevPanel: function(inIndex, inDirection) {
		var prev = (inDirection === "next") ? (inIndex - 2) : (inIndex + 2);
		if (prev >= 0 && prev <= this.count) {
			if (this.getPanels()[prev]) {
				this.getPanels()[prev].destroy();
				return true;
			}
		}
		return false;
	},
	pushNextPanel: function(inImageIndex, inDirection) {
		var next;
		var before = undefined;
		if (inDirection === "next") {
			next = inImageIndex + 1;
			if (next >= this.count) {
				return false;
			}
		}
		else {
			next = inImageIndex - 1;
			if (next < 0) {
				return false;
			}
			before = this.getPanels()[0];
		}

		var ps = this.getPanels();
		if (ps.length !== 0 && ps[ps.length - 1].imageIndex === next) {
			return false;
		}

		var prefix = "container" + next + "_";
		var n, i = 1;
		do {
			n = prefix + String(i);
		} while (this.$[n]);

		this.createComponent({
			name: n,
			style: "height:100%; width:100%;",
			addBefore: before
		});

		var image = {};
		var thumb = {};
		this.doSetupItem({index: next, thumb: thumb, image: image});
		this.$[n].createComponent({
				name: "image" + next + "_" + String(i),
				kind: "ImageView",
				scale: this.defaultScale,
				disableZoom: this.disableZoom,
				src: image.src,
				verticalDragPropagation: false,
				style: "height:100%; width:100%;"
			}, {owner: this});
		this.$[n].imageIndex = next;
		this.$[n].render();

		return true;
	},
	transitionFinish: function(inSender, inEvent) {
		if (inEvent.fromIndex === undefined || inEvent.fromIndex === inEvent.toIndex) {
			return true; //prevent from bubbling if there's no change
		}

		var imageIndex = this.getPanels()[inEvent.toIndex].imageIndex;
		if (inEvent.toIndex > inEvent.fromIndex) {
			this.pushNextPanel(imageIndex, "next");
			if (this.popPrevPanel(inEvent.toIndex, "next") === true) {
				this.index = this.lastIndex = inEvent.toIndex - 1;
			}
		}
		else if (inEvent.toIndex < inEvent.fromIndex) {
			this.popPrevPanel(inEvent.toIndex, "prev");
			if (this.pushNextPanel(imageIndex, "prev") === true) {
				this.index = this.lastIndex = inEvent.fromIndex;
			}
		}

		this.resized();

		this.doImageSelected({imageIndex: imageIndex});
		return true;
	},
	//* @public
	//* Returns the currently displayed ImageView.
	getActiveImage: function() {
		return this.getPanels()[this.index];
	},
	getActiveImageIndex: function() {
		return this.getPanels()[this.index].imageIndex;
	},
	//* Move panel according image index and moving direction
	moveImageByIndex: function(inIndex, inDirection) {
		if (this.$.animator.isAnimating()) {
			return false;
		}

		var imageIndex = this.getPanels()[this.index].imageIndex;
		if (imageIndex === inIndex || imageIndex > this.count - 1) {
			return false;
		}
		if (inDirection === "prev" && this.index === 0) {
			return false;
		}
		if (inDirection === undefined) {
			inDirection = "none";
		}

		if (inDirection === "none") {
			// delete next panel
			var p = this.getPanels()[this.index + 1];
			if (p !== undefined) {
				p.destroy();
			}
			var prefix = "container" + inIndex + "_";
			var n, i = 1;
			do {
				n = prefix + (++i > 1 ? String(i) : "");
			} while (this.$[n]);

			this.createComponent({
				name: n,
				style: "height:100%; width:100%;"
			});

			var thumb = {};
			var image = {};
			this.doSetupItem({index: inIndex, thumb: thumb, image: image});
			this.$[n].createComponent({
					name: "image" + inIndex + "_" + String(i),
					kind: "ImageView",
					scale: this.defaultScale,
					disableZoom: this.disableZoom,
					src: image.src,
					verticalDragPropagation: false,
					style: "height:100%; width:100%;"
				}, {owner: this});
			this.$[n].imageIndex = inIndex;
			this.$[n].render();
			this.setIndex(this.index + 1);
		}
		else if (inDirection === "next") {
			if (inIndex === 0) {
				this.carouselJob = setTimeout(enyo.bindSafely(this, function() { this.moveImageByIndex(inIndex, "none"); }), 0);
			}
			else {
				this.setIndex(this.index + 1);
			}
		}
		else if (inDirection === "prev") {
			this.setIndex(this.index - 1);
		}
	}
});
