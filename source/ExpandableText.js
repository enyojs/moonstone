/**
	_moon.ExpandableText_ is a control that allows long bodies of text to be
	expanded and collapsed.

		{kind: "moon.ExpandableText", collapsed: true, maxLines: 3,
			content: "I left my heart in San Francisco."}

	The _onExpandCollapse_ event is fired when the control is either expanded or
	collapsed.
*/

enyo.kind({
	name: "moon.ExpandableText",
	//* @protected
	classes: "moon-expandable-text",
	//* @public
	published: {
		//* When true, content is collapsed
		collapsed: true,
		//* Maximum number of lines of content to show in collapsed state
		maxLines: 3,
		//* Button text when content is collapsed
		moreContent: moon.$L("more"),  // i18n "MORE" label in moon.ExpandableText widget
		//* Button text when content is not collapsed
		lessContent: moon.$L("less")   // i18n "LESS" label in moon.ExpandableText widget
	},
	events: {
		/**
			Fires when this control expands or collapses.

			_inEvent.collapsed_ contains a boolean indicating whether the control is
			currently collapsed.
		*/
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
	//* Updates _this.lineHeight_ after render.
	rendered: function() {
		this.inherited(arguments);
		this.calcLineHeight();
	},
	resizeHandler: function() {
		this.reflow();
	},
	//* Updates _this.contentHeight_ on reflow.
	reflow: function() {
		this.calcContentHeight();
	},
	//* Toggles value of _this.collapsed_ when _this.$.button_ is tapped.
	expandContract: function() {
		this.set("collapsed", !this.collapsed);
	},
	//* Facades _this.$.client.content_.
	contentChanged: function() {
		this.$.client.setContent(this.content);

		if (this.hasNode()) {
			this.reflow();
		}
	},
	//* Facades _this.$.button.moreContent_.
	moreContentChanged: function() {
		this.$.button.setMoreContent(this.moreContent);
	},
	//* Facades _this.$.button.lessContent_.
	lessContentChanged: function() {
		this.$.button.setLessContent(this.lessContent);
	},
	//* Recalculates _this.maxHeight_ when _this.lineHeight_ changes.
	lineHeightChanged: function() {
		this.calcMaxHeight();
	},
	//* Recalculates _this.maxHeight_ when _this.maxLines_ changes.
	maxLinesChanged: function() {
		this.calcMaxHeight();
	},
	/**
		When _this.collapse_ changes, adds/removes the line clamp, and pushes state
		to _this.$.button_. If the node has rendered, bubbles _onExpandCollapse_
		event.
	*/
	collapsedChanged: function() {
		this.addRemoveLineClamp(this.collapsed);
		this.$.button.setCollapsed(this.collapsed);
		if (this.hasNode()) {
			this.doExpandCollapse({collapsed: this.collapsed});
		}
		this.bubble("onRequestScrollIntoView", {scrollInPointerMode: true});
	},
	//* Updates _this.canCollapse_ when _this.maxHeight_ changes.
	maxHeightChanged: function() {
		this.calcCanCollapse();
		this.addRemoveLineClamp(this.collapsed);
	},
	//* Updates _this.canCollapse_ when _this.contentHeight_ changes.
	contentHeightChanged: function() {
		this.calcCanCollapse();
	},
	//* Updates _this.$.button.showing_ when _this.canCollapse_ changes.
	canCollapseChanged: function() {
		this.$.button.setShowing(this.canCollapse);
	},
	//* Updates _this.maxHeight_.
	calcMaxHeight: function() {
		this.set("maxHeight", this.maxLines * this.lineHeight);
	},
	//* Calculates line height of content and sets _this.lineHeight_.
	calcLineHeight: function() {
		var lineHeight = parseInt(enyo.dom.getComputedStyleValue(this.$.client.hasNode(), "line-height"), 10);
		this.set("lineHeight", (lineHeight > 0) ? lineHeight : null);
	},
	/**
		Updates _this.contentHeight_ by unclamping _this.$.client_ and measuring it,
		before returning it to its previous state.
	*/
	calcContentHeight: function() {
		var contentHeight;
		this.addRemoveLineClamp(false);
		contentHeight = (this.$.client.hasNode()) ? this.$.client.hasNode().getBoundingClientRect().height : 0;
		this.addRemoveLineClamp(this.collapsed);
		this.set("contentHeight", contentHeight);
	},
	//* Determines whether this control has enough content to collapse.
	calcCanCollapse: function() {
		this.set("canCollapse", this.contentHeight > this.maxHeight);
	},
	//* Adds/removes _webkit-line-clamp_ style based on _inAdd_.
	addRemoveLineClamp: function(inAdd) {
		this.$.client.applyStyle("-webkit-line-clamp", (inAdd) ? this.maxLines : null);
	}
});

/**
	_moon.ExpandableTextButton_ is a control used inside of _moon.ExpandableText_.
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
	handlers: {
		//* _onSpotlightFocus_ bubble _requestScrollIntoView_ event
		onSpotlightFocused	: "spotFocused"
	},
	classes: "moon-item moon-expandable-text-button",
	spotlight: true,
	create: function() {
		this.inherited(arguments);
		this.updateContent();
	},
	//* Bubble _requestScrollIntoView_ event
	spotFocused: function(inSender, inEvent) {
		if (inEvent.originator === this) {
			this.bubble("onRequestScrollIntoView");
		}
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
		If control is collapsed, sets _content_ to _this.moreContent_ and adds
		_collapsed_ CSS class' otherwise, sets content to _this.lessContent_ and
		removes _collapsed_ CSS class.
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