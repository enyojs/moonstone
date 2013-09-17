/**
	_moon.Scrim_ provides an overlay that will prevent taps from propagating to
	the controls that it covers. A scrim may be "floating" or "non-floating". A
	floating scrim will fill the entire viewport, while a non-floating scrim
	will be constrained	by the dimensions of its container.

	The scrim should have a CSS class of _"moon-scrim-transparent"_,
	_"moon-scrim-translucent"_,	or any other class that has
	_"pointer-events: auto"_ in its style properties.

	You may specify the z-index at which you want the scrim to appear by calling
	_showAtZIndex()_; if you do so, you must call _hideAtZIndex()_ with the same
	value to hide the scrim.
*/

enyo.kind({
	name: "moon.Scrim",
	//* Current visibility state of the scrim
	showing: false,
	classes: "moon-scrim enyo-fit",
	/**
		If true, the scrim is rendered in a floating layer outside of other
		controls. This can be used to guarantee that the scrim will be shown on top
		of other controls.
	*/
	floating: false,
	//* @protected
	create: enyo.inherit(function(sup) {
		return function() {
			sup.apply(this, arguments);
			this.zStack = [];
			if (this.floating) {
				this.setParent(enyo.floatingLayer);
			}
		};
	}),
	showingChanged: enyo.inherit(function(sup) {
		return function() {
		// auto render when shown.
			if (this.floating && this.showing && !this.hasNode()) {
				this.render();
			}
			sup.apply(this, arguments);
			//this.addRemoveClass(this.showingClassName, this.showing);
		};
	}),
	//* @protected
	addZIndex: function(inZIndex) {
		if (enyo.indexOf(inZIndex, this.zStack) < 0) {
			this.zStack.push(inZIndex);
		}
	},
	removeZIndex: function(inControl) {
		enyo.remove(inControl, this.zStack);
	},
	//* @public
	//* Shows scrim at the specified z-index. Note: If you use _showAtZIndex()_,
	//* you must call _hideAtZIndex()_ to properly unwind the z-index stack.
	showAtZIndex: function(inZIndex) {
		this.addZIndex(inZIndex);
		if (inZIndex !== undefined) {
			this.setZIndex(inZIndex);
		}
		this.show();
	},
	//* Hides scrim at the specified z-index.
	hideAtZIndex: function(inZIndex) {
		this.removeZIndex(inZIndex);
		if (!this.zStack.length) {
			this.hide();
		} else {
			var z = this.zStack[this.zStack.length-1];
			this.setZIndex(z);
		}
	},
	//* @protected
	// Set scrim to show at `inZIndex`
	setZIndex: function(inZIndex) {
		this.zIndex = inZIndex;
		this.applyStyle("z-index", inZIndex);
	},
	make: function() {
		return this;
	}
});

//* @protected
//
// Scrim singleton exposing a subset of Scrim API;
// it is replaced with a proper _enyo.Scrim_ instance.
//
enyo.kind({
	name: "moon.scrimSingleton",
	kind: null,
	constructor: function(inName, inProps) {
		this.instanceName = inName;
		enyo.setPath(this.instanceName, this);
		this.props = inProps || {};
	},
	make: function() {
		var s = new moon.Scrim(this.props);
		enyo.setPath(this.instanceName, s);
		return s;
	},
	showAtZIndex: function(inZIndex) {
		var s = this.make();
		s.showAtZIndex(inZIndex);
	},
	// in case somebody does this out of order
	hideAtZIndex: enyo.nop,
	show: function() {
		var s = this.make();
		s.show();
	}
});

new moon.scrimSingleton("moon.scrim", {floating: true, classes: "moon-scrim-translucent"});
new moon.scrimSingleton("moon.scrimTransparent", {floating: true, classes: "moon-scrim-transparent"});
