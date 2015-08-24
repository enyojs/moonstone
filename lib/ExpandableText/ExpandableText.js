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
	$L = require('../i18n'),
	ClampedText = require('../ClampedText');


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
		* Maximum number of lines of content to show in collapsed state.
		*
		* @type {Number}
		* @default 3
		* @public
		*/
		maxLines: 3,

		/**
		* When `true`, content is collapsed.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		collapsed: true,

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
		{name: 'client', kind: ClampedText, classes: 'moon-body-text moon-expandable-text-content'},
		{name: 'button', kind: ExpandableTextButton, ontap: 'expandContract'}
	],

	/**
	* @private
	*/
	create: function () {
		Control.prototype.create.apply(this, arguments);
		this.moreContentChanged();
		this.lessContentChanged();
		this.maxLinesChanged();
		this.collapsedChanged();
		this.observe('$.client.canCollapse', 'canCollapseChanged');
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
	* [maxLines]{@link module:moonstone/ExpandableText~ExpandableText#maxLines} changes.
	*
	* @private
	*/
	maxLinesChanged: function () {
		this.$.client.set('maxLines', this.maxLines);
	},

	contentChanged: function () {
		this.$.client.set('content', this.content);
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
		this.$.client.set('clamped', this.collapsed);
		this.$.button.setCollapsed(this.collapsed);
		if (this.hasNode()) {
			this.doExpandCollapse({collapsed: this.collapsed});
		}
		this.bubble('onRequestScrollIntoView', {scrollInPointerMode: true});
	},

	/**
	* Updates `this.$.button.showing` when
	* [canCollapse]{@link module:moonstone/ExpandableText~ExpandableText#canCollapse} changes.
	*
	* @private
	*/
	canCollapseChanged: function (was, is) {
		this.$.button.setShowing(is);
	}
});

/**
* Kind definition for {@link module:moonstone/ExpandableText~ExpandableTextButton}
*/
ExpandableText.ExpandableTextButton = ExpandableTextButton;
