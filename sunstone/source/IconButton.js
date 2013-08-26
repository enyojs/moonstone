//* @public
/**
	_sun.IconButton_ is an <a href="#sun.IconButton">sun.IconButton</a> with Mobile
	styling applied. 
*/

enyo.kind({
	name: "sun.IconButton",
	kind: "moon.IconButton",
	published: {
		//* If true, the moon-small-icon-button css class will be applied to this button
		small: false
	},
	create: function() {
		this.inherited(arguments);
		this.smallChanged();
	},
	//* @protected
	smallChanged: function() {
		this.addRemoveClass("moon-small-icon-button", this.getSmall());
	}
});

enyo.kind({
	name: "sun.LoadingIconButton",
	kind: "sun.IconButton",
	published: {
		loading: false
	},
	create: function() {
		this.inherited(arguments);
		this.loadingChanged();
	},
	loadingChanged: function() {
		this.addRemoveClass("moon-loading-icon-button", this.getLoading());
		if(this.getLoading()) {
			this.applyStyle("background-image","");
		} else {
			this.srcChanged();
		}
	}
});
