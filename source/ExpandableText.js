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
		moreContent: moon.$L("more"),  // i18n "MORE" label in moon.ExpandableText widget
		//* Button text when content is not collapsed
		lessContent: moon.$L("less")   // i18n "LESS" label in moon.ExpandableText widget
	},
	events: {
		//* Fired when this control expands/collapses
		onExpandCollapse: ""
	},
	
	//*@protected
	components:[
		{name: "client", classes: "moon-body-text moon-expandable-text-content"},
		{name: "button", kind: "moon.ExpandableTextButton", ontap: "expandContract"}
	],
	lineHeight: 32,
	maxHeight: 96,
	contentHeight: -1,
	canCollapse: true,
	create: function() {
		this.inherited(arguments);
		this.moreContentChanged();
		this.lessContentChanged();
		this.collapsedChanged();
	},
	//* Update _this.lineHeight_ after render
	rendered: function() {
		this.inherited(arguments);
		this.calcLineHeight();
	},
	resizeHandler: function() {
		this.reflow();
	},
	//* Update _this.contentHeight_ on reflow
	reflow: function() {
		this.calcContentHeight();
	},
	//* When _this.$.button_ is tapped, toggle _this.collapsed_
	expandContract: function() {
		this.set("collapsed", !this.collapsed);
	},
	//* Facade to _this.$.client.content_
	contentChanged: function() {
		this.$.client.setContent(this.content);
		
		if (this.hasNode()) {
			this.reflow();
		}
	},
	//* Facade for _this.$.button.moreContent_
	moreContentChanged: function() {
		this.$.button.setMoreContent(this.moreContent);
	},
	//* Facade for _this.$.button.lessContent_
	lessContentChanged: function() {
		this.$.button.setLessContent(this.lessContent);
	},
	//* When _this.lineHeight_ changes, recalculate _this.maxHeight_
	lineHeightChanged: function() {
		this.calcMaxHeight();
	},
	//* When _this.maxLines_ changes, recalculate _this.maxHeight_
	maxLinesChanged: function() {
		this.calcMaxHeight();
	},
	/**
		When _this.collapse_ changes, add/remove the line clamp, and push state
		to _this.$.button_. If node has rendered, bubble _onExpandCollapse_ event.
	*/
	collapsedChanged: function() {
		this.addRemoveLineClamp(this.collapsed);
		this.$.button.setCollapsed(this.collapsed);
		if (this.hasNode()) {
			this.doExpandCollapse({collapsed: this.collapsed});
		}
	},
	//* When _this.maxHeight_ changes, update _this.canCollapse_
	maxHeightChanged: function() {
		this.calcCanCollapse();
		this.addRemoveLineClamp(this.collapsed);
	},
	//* When _this.contentHeight_ changes, update _this.canCollapse_
	contentHeightChanged: function() {
		this.calcCanCollapse();
	},
	//* When _this.canCollapse_ changes, update _this.$.button.showing_
	canCollapseChanged: function() {
		this.$.button.setShowing(this.canCollapse);
	},
	//* Update _this.maxHeight_
	calcMaxHeight: function() {
		this.set("maxHeight", this.maxLines * this.lineHeight);
	},
	//* Calculate line height of content and set _this.lineHeight_
	calcLineHeight: function() {
		var lineHeight = parseInt(enyo.dom.getComputedStyleValue(this.$.client.hasNode(), "line-height"), 10);
		this.set("lineHeight", (lineHeight > 0) ? lineHeight : null);
	},
	//* Update _this.contentHeight_ by unclamping _this.$.client_, measuring it, then returning to it's previous state
	calcContentHeight: function() {
		var contentHeight;
		this.addRemoveLineClamp(false);
		contentHeight = (this.$.client.hasNode()) ? this.$.client.hasNode().getBoundingClientRect().height : 0;
		this.addRemoveLineClamp(this.collapsed);
		this.set("contentHeight", contentHeight);
	},
	//* Determine is this control has enough content to collapse
	calcCanCollapse: function() {
		this.set("canCollapse", this.contentHeight > this.maxHeight);
	},
	//* Add/remove _webkit-line-clamp_ style based on _inAdd_
	addRemoveLineClamp: function(inAdd) {
		this.$.client.applyStyle("-webkit-line-clamp", (inAdd) ? this.maxLines : null);
	}
});

/**
	Button used in _moon.ExpandableText_
*/
enyo.kind({
	name: "moon.ExpandableTextButton",
	kind: "enyo.Control",
	published: {
		//* Button text when _this.collapsed_ is true
		moreContent: moon.$L("more"),  // i18n "MORE" label in moon.ExpandableTextButton widget
		//* Button text when _this.collapsed_ is false
		lessContent: moon.$L("less"),  // i18n "LESS" label in moon.ExpandableTextButton widget
		//* Boolean value that causes content/class changes
		collapsed: true
	},
	classes: "moon-item moon-expandable-text-button",
	spotlight: true,
	create: function() {
		this.inherited(arguments);
		this.updateContent();
	},
	moreContentChanged: function() {
		this.updateContent();
	},
	lessContentChanged: function() {
		this.updateContent();
	},
	collapsedChanged: function() {
		this.updateContent();
	},
	/**
		If collapsed, use _this.moreContent_ and add _collapsed_ css class.
		If not collapsed, use _this.lessContent_ and remove _collapsed_ css class.
	*/
	updateContent: function() {
		if (this.collapsed) {
			this.setContent(this.moreContent);
			this.addClass("collapsed");
		} else {
			this.setContent(this.lessContent);
			this.removeClass("collapsed");
		}
	}
});