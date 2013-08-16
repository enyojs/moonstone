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