enyo.kind({
	name: "moon.FullScreenDrawer",
	kind: "enyo.Drawer",
	classes: "moon-audio-playback-drawer",
	handlers: {
		onResizeDrawer: "resizeDrawer"
	},
	open: false,
	drawerProps: {},
	openChanged: function() {
		this.$.client.show();
		if (this.hasNode()) {
			if (this.$.animator.isAnimating()) {
				this.$.animator.reverse();
			} else {
				var v = this.orient == "v";
				var d = v ? "height" : "width";
				var p = v ? "top" : "left";
				var s = this.drawerProps.height;
				// unfixing the height/width is needed to properly
				// measure the scrollHeight/Width DOM property, but
				// can cause a momentary flash of content on some browsers
				this.applyStyle(d, null);

				if (this.animated) {
					this.$.animator.play({
						startValue: this.open ? 0 : s,
						endValue: this.open ? s : 0,
						dimension: d,
						position: p
					});
				} else {
					// directly run last frame if not animating
					this.animatorEnd();
				}
			}
		} else {
			this.$.client.setShowing(this.open);
		}
	},
	animatorEnd: function() {
		if (!this.open) {
			this.$.client.hide();
		} else {
			// save changes to this.domCssText --> see ENYO-1561
			this.$.client.domCssText = enyo.Control.domStylesToCssText(this.$.client.domStyles);
			// at end of open animation, clean limit on height/width
			var v = (this.orient == "v");
			var d = v ? "height" : "width";
			var p = v ? "top" : "left";
			var cn = this.$.client.hasNode();
		}
		if (this.container) {
			this.container.resized();
		}
	},
	resizeDrawer: function(inSender, inProps) {
		this.drawerProps = inProps;
		if ((this.open) && (!this.$.animator.isAnimating())) {
			this.applyStyle("height", inProps.height + "px");
		}
		return true;
	}
});
