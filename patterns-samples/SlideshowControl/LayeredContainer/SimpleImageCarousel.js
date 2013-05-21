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
		//* The number of image items contained in the list */
		count: 0
	},
	events: {
		/**
			Fires once per item at render time
			_inEvent.index_ contains the current list index
			_inEvent.image_ contains the curren image url
		*/
		onSetupItem: ""
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
		for (var index=0; index < this.preload; index++) {
			this.doSetupItem({index: index, thumb: thumb, image: image});
			this.$["container" + index].createComponent({
					name: "image" + index,
					kind: "ImageView",
					scale: this.defaultScale,
					disableZoom: this.disableZoom,
					src: image.src,
					verticalDragPropagation: false,
					style: "height:100%; width:100%;"
				}, {owner: this});
			this.$["container" + index].imageIndex = index;
			this.$["image" + index].render();
		}
	},
	transitionStart: function(inSender, inEvent) {
		if (inEvent.fromIndex==inEvent.toIndex) {
			return true; //prevent from bubbling if there's no change
		}
	},
	popPrevPanel: function(inIndex, inDirection) {
		var prev = (inDirection == "next") ? (inIndex - 2) : (inIndex + 2);
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
		if (inDirection == "next") {
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

		if (this.$["container" + next]) {
			return false;
		}

		this.createComponent({
			name: "container" + next,
			style: "height:100%; width:100%;",
			addBefore: before
		});

		var image = {};
		var thumb = {};
		this.doSetupItem({index: next, thumb: thumb, image: image});
		this.$["container" + next].createComponent({
				name: "image" + next,
				kind: "ImageView",
				scale: this.defaultScale,
				disableZoom: this.disableZoom,
				src: image.src,
				verticalDragPropagation: false,
				style: "height:100%; width:100%;"
			}, {owner: this});
		this.$["container" + next].imageIndex = next;
		this.$["container" + next].render();

		return true;
	},
	transitionFinish: function(inSender, inEvent) {
		if (inEvent.fromIndex === undefined || inEvent.fromIndex==inEvent.toIndex) {
			return true; //prevent from bubbling if there's no change
		}

		var imageIndex = this.getPanels()[inEvent.toIndex].imageIndex;
		if (inEvent.toIndex > inEvent.fromIndex) {
			this.pushNextPanel(imageIndex, "next");
			if (this.popPrevPanel(inEvent.toIndex, "next") == true) {
				this.index = this.lastIndex = inEvent.toIndex - 1;
			}
		}
		else if (inEvent.toIndex < inEvent.fromIndex) {
			this.popPrevPanel(inEvent.toIndex, "prev");
			if (this.pushNextPanel(imageIndex, "prev") == true) {
				this.index = this.lastIndex = inEvent.fromIndex;
			}
		}

		this.resized();
		return true;
	},
	//* @public
	//* Returns the currently displayed ImageView.
//	getActiveImage: function() {
//		return this.getImageByIndex(this.index);
//	},
	//* Returns the ImageView with the specified index.
//	getImageByIndex: function(index) {
//		return this.$["image" + index] || this.loadImageView(index);
//	}

	moveImageByIndex: function(inIndex, inDirection) {
		var imageIndex = this.getPanels()[this.index].imageIndex;
		if (imageIndex == inIndex || imageIndex > this.count - 1) {
			return false;
		}
		if (inDirection == "prev" && this.index == 0) {
			return false;
		}
		if (inDirection === undefined) {
			inDirection = "none";
		}

		if (inDirection == "none") {
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
				style: "height:100%; width:100%;"//,
				//addBefore: before
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
		else if (inDirection == "next") {
			if (inIndex == 0) {
				this.carouselJob = setTimeout(enyo.bind(this, function() { this.moveImageByIndex(inIndex, "none"); }), 0);
			}
			else {
				this.setIndex(this.index + 1);
			}
		}
		else if (inDirection == "prev") {
			this.setIndex(this.index - 1);
		}
	}
});
