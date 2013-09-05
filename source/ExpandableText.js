/**
	_moon.ExpandableText_ is a control that allows long bodies of text to be expanded/collapsed.

	Usage:

	{kind: "moon.ExpandableText", collapsed: true, maxLines: 3, content: "I left my heart in San Francisco."}

	Events:
	
	The _onExpandCollapse_ event is fired when the control is expanded/collapsed.
*/

enyo.kind({
	name: "moon.ExpandableText",
	classes: "moon-expandable-text",
	published: {
		//* When true, content is collapsed
		collapsed: true,
		//* Max line number to show content when it is collapsed.
		maxLines: 3,
		//* Button text when content is collapsed
		moreContent: $L("more"),
		//* Button text when content is not collapsed
		lessContent: $L("less")
	},
	events: {
		//* Fired when this control expands/collapses
		onExpandCollapse: ""
	},
	components:[
		{name: "client", classes: "moon-body-text moon-expandable-text-content"},
		{name: "collapseButton", kind: "enyo.Control", classes: "moon-item moon-expandable-text-collapse-button", spotlight: true, ontap: "expandContract"}
	],
	bindings: [
		{from: ".content", to: ".$.client.content"},
		{from: ".buttonContent", to: ".$.collapseButton.content"}
	],
	lineHeight: 32,

	//*@protected
	rendered: function() {
		this.inherited(arguments);
		this.calcLineHeight();
		this.collapsedChanged();
	},
	reflow: function() {
		this.inherited(arguments);
		this.updateContentHeight();
	},
	resizeHandler: function() {
		this.updateContentHeight();
	},
	lineHeightChanged: function() {
		this.updateButtonVisibility();
	},
	maxLinesChanged: function() {
		this.updateButtonVisibility();
	},
	moreContentChanged: function() {
		if(this.collapsed) {
			this.set("buttonContent", this.moreContent);
		}
	},
	lessContentChanged: function() {
		if(!this.collapsed) {
			this.set("buttonContent", this.lessContent);
		}
	},
	collapsedChanged: function() {
		if (this.collapsed) {
			this.$.client.applyStyle("-webkit-line-clamp", this.maxLines);
			this.removeClass('expanded');
			this.set("buttonContent", this.moreContent);
		} else {
			this.$.client.applyStyle("-webkit-line-clamp", null);
			this.addClass('expanded');
			this.set("buttonContent", this.lessContent);
		}
	},
	//* When _expandContract_ button is tapped, toggle _this.collapsed_ and fire _change_ event
	expandContract: function() {
		this.set("collapsed", !this.collapsed);
		this.doExpandCollapse({collapsed: this.collapsed});
	},
	//* Call _reflow()_ when user programatically sets _this.content_
	setContent: function() {
		this.inherited(arguments);
		this.reflow();
	},
	updateContentHeight: function() {
		this.calcContentHeight();
		this.updateButtonVisibility();
	},
	updateButtonVisibility: function() {
		if (!this.hasNode()) {
			return;
		}
		if(this.contentHeight - 1 > this.calcMaxHeight()) {
			this.$.collapseButton.removeClass("hidden");
			this.collapsedChanged();
		} else {
			this.$.collapseButton.addClass("hidden");
			this.set("collapsed", false);
		}
	},
	calcMaxHeight: function() {
		return this.maxLines * this.lineHeight;
	},
	calcLineHeight: function() {
		var lineHeight = parseInt(enyo.dom.getComputedStyleValue(this.$.client.hasNode(), "line-height"), 10);
		this.set("lineHeight", (lineHeight > 0) ? lineHeight : null);
	},
	//* Calculate height of _this.$.client_. Strangely we have to add 1 px - when clamped the height is one less than line-height.
	calcContentHeight: function() {
		this.contentHeight = (this.$.client.hasNode()) ? this.$.client.hasNode().getBoundingClientRect().height + 1 : null;
	}
});