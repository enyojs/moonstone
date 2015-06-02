require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/ExpandableText~ExpandableText} kind.
* @module moonstone/ExpandableText
*/

var
	kind = require('enyo/kind'),
	dom = require('enyo/dom'),
	Control = require('enyo/Control');

var
	$L = require('../i18n');


/**
* {@link module:moonstone/ExpandableText~ExpandableTextButton} is a control used inside of {@link module:moonstone/ExpandableText~ExpandableText}.
*
* @class ExpandableTextButton
* @extends module:enyo/Control~Control
* @ui
* @private
*/
var ExpandableTextButton = kind(
	/** @lends module:moonstone/ExpandableText~ExpandableTextButton.prototype */ {

	/**
	* @private
	*/
	name: 'moon.ExpandableTextButton',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	* @lends module:moonstone/ExpandableText~ExpandableTextButton.prototype
	*/
	published: {

		/**
		* Button text when [collapsed]{@link module:moonstone/ExpandableText~ExpandableTextButton#collapsed} is `true`.
		*
		* @type {String}
		* @default 'more'
		* @public
		*/
		moreContent: $L('more'),		// i18n 'MORE' label in moon.ExpandableTextButton widget

		/**
		* Button text when [collapsed]{@link module:moonstone/ExpandableText~ExpandableTextButton#collapsed} is `false`.
		*
		* @type {String}
		* @default 'less'
		* @public
		*/
		lessContent: $L('less'),		// i18n 'LESS' label in moon.ExpandableTextButton widget

		/**
		* Boolean value that causes content/class changes.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		collapsed: true
	},

	/**
	* @private
	*/
	handlers: {

		/**
		* {@link module:enyo/Spotlight~Spotlight#onSpotlightFocus}, the handler bubbles a
		* [requestScrollIntoView]{@link module:moonstone/Scroller~Scroller#requestScrollIntoView} event.
		*/
		onSpotlightFocused	: 'spotFocused'

	},

	/**
	* @private
	*/
	classes: 'moon-body-text moon-expandable-text-button',

	/**
	* @private
	*/
	spotlight: true,

	/**
	* @private
	*/
	create: function () {
		Control.prototype.create.apply(this, arguments);
		this.updateContent();
	},

	/**
	* Bubbles a [requestScrollIntoView]{@link module:moonstone/Scroller~Scroller#requestScrollIntoView}
	* event.
	*
	* @fires module:moonstone/Scroller~Scroller#requestScrollIntoView
	* @private
	*/
	spotFocused: function (inSender, inEvent) {
		if (inEvent.originator === this) {
			this.bubble('onRequestScrollIntoView');
		}
	},

	/**
	* @private
	*/
	moreContentChanged: function () {
		this.updateContent();
	},

	/**
	* @private
	*/
	lessContentChanged: function () {
		this.updateContent();
	},

	/**
	* @private
	*/
	collapsedChanged: function () {
		this.updateContent();
	},

	/**
	* If control is collapsed, sets [content]{@link module:moonstone/ExpandableText~ExpandableTextButton#content} to 
	* [moreContent]{@link module:moonstone/ExpandableText~ExpandableTextButton#moreContent} and adds `collapsed` CSS class;
	* otherwise, sets content to [lessContent]{@link module:moonstone/ExpandableText~ExpandableTextButton#lessContent} and
	* removes `collapsed` CSS class.
	*
	* @private
	*/
	updateContent: function () {
		if (this.collapsed) {
			this.setContent(this.moreContent);
			this.addClass('collapsed');
		} else {
			this.setContent(this.lessContent);
			this.removeClass('collapsed');
		}
	}
});

/**
* Fires when this control expands or collapses.
*
* @event module:moonstone/ExpandableText~ExpandableText#onExpandCollapse
* @type {Object}
* @property {Boolean} collapsed - Whether the control is currently collapsed.
* @public
*/

/**
* {@link module:moonstone/ExpandableText~ExpandableText} is a control that allows long bodies of text to be
* expanded and collapsed.
*
* ```
* {kind: 'moon.ExpandableText', collapsed: true, maxLines: 3,
* content: 'I left my heart in San Francisco.'}
* ```
*
* The [onExpandCollapse]{@link module:moonstone/ExpandableText~ExpandableText#onExpandCollapse} event is fired
* when the control is either expanded or collapsed.
*
* @class ExpandableText
* @extends module:enyo/Control~Control
* @ui
* @public
*/

var ExpandableText = module.exports = kind(
	/** @lends module:moonstone/ExpandableText~ExpandableText.prototype */ {

	/**
	* @private
	*/
	name: 'moon.ExpandableText',

	/**
	* @private
	*/
	kind: Control,

	//* @protected
	/**
	* @private
	*/
	classes: 'moon-expandable-text',

	/**
	* @private
	* @lends module:moonstone/ExpandableText~ExpandableText.prototype
	*/
	published: {

		/**
		* When `true`, content is collapsed.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		collapsed: true,

		/**
		* Maximum number of lines of content to show in collapsed state.
		*
		* @type {Number}
		* @default 3
		* @public
		*/
		maxLines: 3,

		/**
		* Button text when content is collapsed (i.e., 'more' label). Default is
		* locale-aware.
		* @type {String}
		* @default 'more'
		* @public
		*/
		moreContent: $L('more'),

		/**
		* Button text when content is expanded (i.e., 'less' label). Default is
		* locale-aware.
		*
		* @type {String}
		* @default 'less'
		* @public
		*/
		lessContent: $L('less')
	},

	/**
	* @private
	*/
	events: {

		/**
		* {@link module:moonstone/ExpandableText~ExpandableText#onExpandCollapse}
		*/
		onExpandCollapse: ''
	},

	/**
	* @private
	*/
	components:[
		{name: 'client', kind: Control, classes: 'moon-body-text moon-expandable-text-content'},
		{name: 'button', kind: ExpandableTextButton, ontap: 'expandContract'}
	],

	/**
	* @private
	*/
	lineHeight: 32,

	/**
	* @private
	*/
	maxHeight: 96,

	/**
	* @private
	*/
	contentHeight: -1,

	/**
	* @private
	*/
	canCollapse: true,

	/**
	* @private
	*/
	create: function () {
		Control.prototype.create.apply(this, arguments);
		this.moreContentChanged();
		this.lessContentChanged();
		this.collapsedChanged();
	},

	/**
	* Updates [lineHeight]{@link module:moonstone/ExpandableText~ExpandableText#lineHeight} after render.
	*
	* @private
	*/
	rendered: function () {
		Control.prototype.rendered.apply(this, arguments);
		this.calcLineHeight();
	},

	/**
	* @private
	*/
	handleResize: function () {
		this.reflow();
	},

	/**
	* Updates [contentHeight]{@link module:moonstone/ExpandableText~ExpandableText#contentHeight} on reflow.
	*
	* @private
	*/
	reflow: function () {
		this.calcContentHeight();
	},

	/**
	* Toggles value of [collapsed]{@link module:moonstone/ExpandableText~ExpandableText#collapsed} when
	* `this.$.button` is tapped.
	*
	* @private
	*/
	expandContract: function () {
		this.set('collapsed', !this.collapsed);
	},

	/**
	* Facades `this.$.client.content`.
	*
	* @private
	*/
	contentChanged: function () {
		this.$.client.setContent(this.content);

		if (this.hasNode()) {
			this.reflow();
		}
	},

	/**
	* Facades `this.$.button.moreContent`.
	*
	* @private
	*/
	moreContentChanged: function () {
		this.$.button.setMoreContent(this.moreContent);
	},

	/**
	* Facades `this.$.button.lessContent`.
	*
	* @private
	*/
	lessContentChanged: function () {
		this.$.button.setLessContent(this.lessContent);
	},

	/**
	* Recalculates [maxHeight]{@link module:moonstone/ExpandableText~ExpandableText#maxHeight} when
	* [lineHeight]{@link module:moonstone/ExpandableText~ExpandableText#lineHeight} changes.
	*
	* @private
	*/
	lineHeightChanged: function () {
		this.calcMaxHeight();
	},

	/**
	* Recalculates [maxHeight]{@link module:moonstone/ExpandableText~ExpandableText#maxHeight} when
	* [maxLines]{@link module:moonstone/ExpandableText~ExpandableText#maxLines} changes.
	*
	* @private
	*/
	maxLinesChanged: function () {
		this.calcMaxHeight();
	},

	/**
	* When [collapsed]{@link module:moonstone/ExpandableText~ExpandableText#collapsed} changes, adds/removes the
	* line clamp, and pushes state to `this.$.button`. If the node has rendered, bubbles
	* [onExpandCollapse]{@link module:moonstone/ExpandableText~ExpandableText#onExpandCollapse} event.
	*
	* @fires module:moonstone/ExpandableText~ExpandableText#onExpandCollapse
	* @fires module:moonstone/Scroller~Scroller#onRequestScrollIntoView
	* @private
	*/
	collapsedChanged: function () {
		this.addRemoveLineClamp(this.collapsed);
		this.$.button.setCollapsed(this.collapsed);
		if (this.hasNode()) {
			this.doExpandCollapse({collapsed: this.collapsed});
		}
		this.bubble('onRequestScrollIntoView', {scrollInPointerMode: true});
	},

	/**
	* Updates [canCollapse]{@link module:moonstone/ExpandableText~ExpandableText#canCollapse} when
	* [maxHeight]{@link module:moonstone/ExpandableText~ExpandableText#maxHeight} changes.
	*
	* @private
	*/
	maxHeightChanged: function () {
		this.calcCanCollapse();
		this.addRemoveLineClamp(this.collapsed);
	},

	/**
	* Updates [canCollpase]{@link module:moonstone/ExpandableText~ExpandableText#canCollapse} when
	* [contentHeight]{@link module:moonstone/ExpandableText~ExpandableText#contentHeight} changes.
	*
	* @private
	*/
	contentHeightChanged: function () {
		this.calcCanCollapse();
	},

	/**
	* Updates `this.$.button.showing` when
	* [canCollapse]{@link module:moonstone/ExpandableText~ExpandableText#canCollapse} changes.
	*
	* @private
	*/
	canCollapseChanged: function () {
		this.$.button.setShowing(this.canCollapse);
	},

	/**
	* Updates [maxHeight]{@link module:moonstone/ExpandableText~ExpandableText#maxHeight}.
	*
	* @private
	*/
	calcMaxHeight: function () {
		this.set('maxHeight', this.maxLines * this.lineHeight);
	},

	/**
	* Calculates line height of content and sets
	* [lineHeight]{@link module:moonstone/ExpandableText~ExpandableText#lineHeight}.
	*
	* @private
	*/
	calcLineHeight: function () {
		var lineHeight = parseInt(dom.getComputedStyleValue(this.$.client.hasNode(), 'line-height'), 10);
		this.set('lineHeight', (lineHeight > 0) ? lineHeight : null);
	},

	/**
	* Updates [contentHeight]{@link module:moonstone/ExpandableText~ExpandableText#contentHeight} by unclamping
	* `this.$.client` and measuring it, before returning it to its previous state.
	*
	* @private
	*/
	calcContentHeight: function () {
		var contentHeight;
		this.addRemoveLineClamp(false);
		contentHeight = (this.$.client.hasNode()) ? this.$.client.hasNode().getBoundingClientRect().height : 0;
		this.addRemoveLineClamp(this.collapsed);
		this.set('contentHeight', contentHeight);
	},

	/**
	* Determines whether this control has enough content to collapse.
	*
	* @private
	*/
	calcCanCollapse: function () {
		this.set('canCollapse', this.contentHeight > this.maxHeight);
	},

	/**
	* @param {Boolean} inAdd Whether to add or remove `webkit-line-clamp` style.
	* @private
	*/
	addRemoveLineClamp: function (inAdd) {
		this.$.client.applyStyle('-webkit-line-clamp', (inAdd) ? this.maxLines : null);
	}
});

/**
* Kind definition for {@link module:moonstone/ExpandableText~ExpandableTextButton}
*/
ExpandableText.ExpandableTextButton = ExpandableTextButton;
