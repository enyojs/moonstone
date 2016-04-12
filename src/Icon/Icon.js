require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/Icon~Icon} kind.
* @module moonstone/Icon
*/

var
	kind = require('enyo/kind'),
	ri = require('enyo/resolution'),
	path = require('enyo/pathResolver'),
	Control = require('enyo/Control');

// Static private hash of all of the valid moonstone icons
var icons = {
	plus              : '&#43;',      // \0002B plus
	minus             : '&#45;',      // \0002D hyphen
	arrowhookleft     : '&#8617;',    // \021A9 LeftArrowHook
	arrowhookright    : '&#8618;',    // \021AA RightArrowHook
	ellipsis          : '&#8943;',    // \022EF ellipsis
	check             : '&#10003;',   // \02713 checkmark
	circle            : '&#983003;',  // \0EFFDB record
	stop              : '&#983004;',  // \0EFFDC stop
	play              : '&#983005;',  // \0EFFDD play
	pause             : '&#983006;',  // \0EFFDE pause
	forward           : '&#983007;',  // \0EFFDF forward
	backward          : '&#983008;',  // \0EFFE0 rewind
	skipforward       : '&#983009;',  // \0EFFE1 skip_forward
	skipbackward      : '&#983010;',  // \0EFFE2 skip_backwards
	pauseforward      : '&#983011;',  // \0EFFE3 indicator_forward
	pausebackward     : '&#983012;',  // \0EFFE4 indicator_backward
	pausejumpforward  : '&#983013;',  // \0EFFE5 indicator_skip_forward
	pausejumpbackward : '&#983014;',  // \0EFFE6 indicator_skip_backward
	jumpforward       : '&#983015;',  // \0EFFE7 indicator_end
	jumpbackward      : '&#983016;',  // \0EFFE8 indicator_begin
	denselist         : '&#983017;',  // \0EFFE9 list_big
	bulletlist        : '&#983018;',  // \0EFFEA list_bullets
	list              : '&#983019;',  // \0EFFEB list_simple
	drawer            : '&#983020;',  // \0EFFEC list_actions
	arrowlargedown    : '&#983021;',  // \0EFFED caret_down_large
	arrowlargeup      : '&#983022;',  // \0EFFEE caret_up_large
	arrowlargeleft    : '&#983023;',  // \0EFFEF caret_left_large
	arrowlargeright   : '&#983024;',  // \0EFFF0 caret_right_large
	arrowsmallup      : '&#983025;',  // \0EFFF1 caret_up_small
	arrowsmalldown    : '&#983026;',  // \0EFFF2 caret_down_small
	arrowsmallleft    : '&#983027;',  // \0EFFF3 caret_left_small
	arrowsmallright   : '&#983028;',  // \0EFFF4 caret_right_small
	closex            : '&#983029;',  // \0EFFF5 close_x
	search            : '&#983030;',  // \0EFFF6 magnify
	rollforward       : '&#983031;',  // \0EFFF7 redo
	rollbackward      : '&#983032;',  // \0EFFF8 undo
	exitfullscreen    : '&#983033;',  // \0EFFF9 minimize
	fullscreen        : '&#983034;',  // \0EFFFA maximize
	arrowextend       : '&#983073;',  // \0F0021 arrow_left
	arrowshrink       : '&#983074;',  // \0F0022 arrow_right
	flag              : '&#983075;',  // \0F0023 flag
	funnel            : '&#983076;',  // \0F0024 filter
	trash             : '&#983077;',  // \0F0025 trash
	star              : '&#983080;',  // \0F0028 star_full
	hollowstar        : '&#983081;',  // \0F0029 star_empty
	halfstar          : '&#983082;',  // \0F002A star_half
	gear              : '&#983083;',  // \0F002B gear
	plug              : '&#983084;',  // \0F002C input
	lock              : '&#983085;'   // \0F002D lock
};

/**
* {@link module:moonstone/Icon~Icon} is a control that displays an icon image. You may specify the
* image by setting the [src]{@link module:moonstone/Icon~Icon#src} property to a URL indicating the
* image file's location.
*
* ```
* 	var
* 		kind = require('enyo/kind'),
* 		Icon = require('moonstone/Icon');
*
* 	{kind: Icon, src: '@../assets/search.png'}
* ```
*
* Moonstone also supports a second method for displaying icons; in addition to
* using traditional image assets specified in `src`, you may use icons that are
* stored as single characters in a special symbol font. To do this, set the
* value of the [icon]{@link module:moonstone/Icon~Icon#icon} property to a string representing an
* icon name, e.g.:
*
* ```
* 	{kind: Icon, icon: 'closex'}
* ```
*
* For image-based icons, two sizes are supported: large (45x45 pixels) and small
* (32x32 pixels). Icons are small by default. To specify a large icon, set the
* [small]{@link module:moonstone/Icon~Icon#small} property to `false`:
*
* ```
* 	{kind: Icon, src: '@../assets/search.png', small: false}
*
* 	{kind: Icon, icon: 'closex', small: false}
* ```
*
* In addition, both icon sizes support two states: a default (resting) state,
* and a pressed (active) state. Both states need to be included in the icon's
* associated image asset, with the resting state on top and the active state on
* the bottom.
*
* Image assets for large icons should be 75px wide and 150px high. This allows
* room for the two states, along with 15 pixels of transparent padding on all
* four sides of each 45x45 icon.
*
* Assets for small icons should be 50px wide and 100px high. This allows room
* for the two states, along with 9 pixels of transparent padding on all four
* sides of each 32x32 icon.
*
* Since asset-based icon images are applied as CSS backgrounds, the height and
* width of an icon must be set if an image of a non-standard size is used.
*
* For situations in which an icon should act like a button, use
* {@link module:moonstone/IconButton~IconButton}.
*
* @class Icon
* @extends module:enyo/Control~Control
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/Icon~Icon.prototype */ {

	/**
	* @private
	*/
	name: 'moon.Icon',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	*/
	allowHtml: true,

	/**
	* @private
	* @lends module:moonstone/Icon~Icon.prototype
	*/
	published: {

		/**
		* This property serves two purposes. One, it accepts one of the below Moonstone icon
		* names. Two, it also supports standard ascii characters or HTML entities, to directly
		* represent a glyph. By default, the font used when you specify a
		* character/entity/glyph, the font "LG Display_Dingbat" will be used. It is applied via
		* a `class`: "font-lg-icons". To apply your own dingbat font, override this class's
		* `font-family` property in your CSS.
		*
		* The following icon names are valid:
		*
		* `drawer`
		* `arrowlargedown`
		* `arrowlargeup`
		* `arrowlargeleft`
		* `arrowlargeright`
		* `arrowsmallup`
		* `arrowsmalldown`
		* `arrowsmallleft`
		* `arrowsmallright`
		* `closex`
		* `check`
		* `search`
		* `exitfullscreen`
		* `fullscreen`
		* `circle`
		* `stop`
		* `play`
		* `pause`
		* `forward`
		* `backward`
		* `skipforward`
		* `skipbackward`
		* `pauseforward`
		* `pausebackward`
		* `pausejumpforward`
		* `pausejumpbackward`
		* `jumpforward`
		* `jumpbackward`
		* `arrowextend`
		* `arrowshrink`
		*
		* @type {String}
		* @default ''
		* @public
		*/
		icon: '',

		/**
		* URL specifying path to icon image.
		*
		* @type {String|module:enyo/resolution#selectSrc~src}
		* @default ''
		* @public
		*/
		src: '',

		/**
		* If `true`, icon is shown as disabled.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		disabled: false,

		/**
		* A boolean parameter affecting the size of the icon.
		* If `true`, the icon will be 32px by 32px. If `false`, the icon will be 45px
		* by 45px. When `small` is `true`, a larger, invisible tap area will be applied
		* around the icon.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		small: true
	},

	/**
	* @private
	*/
	handlers: {
		/**
		* This is a horrible hack to prevent event bubble caching from messing up
		* moon.Tooltip positioning (BHV-13377). In short, we don't need to do anything
		* with onenter ourselves, but we need it to pass through us on the way to
		* moon.TooltipDecorator, which uses inSender to figure out who the tooltip
		* activator should be.
		*
		* TODO: Something better.
		*
		* @private
		*/
		onenter: 'doNothing'
	},

	/**
	* @returns {String} The value of the [src]{@link module:moonstone/Icon~Icon#src} property.
	* @public
	*/
	getSrc: function () {
		return this.src;
	},

	/**
	* @private
	*/
	classes: 'moon-icon',

	/**
	* @private
	*/
	create: function () {
		Control.prototype.create.apply(this, arguments);

		this.smallChanged();
		if (this.src) {
			this.srcChanged();
		}
		this.disabledChanged();
	},

	/**
	* @private
	*/
	getIconClass: function (inIconName) {
		return 'moon-icon-' + (inIconName || this.icon);
	},

	/**
	* @private
	*/
	disabledChanged: function () {
		this.addRemoveClass('disabled', this.disabled);
	},

	/**
	* @private
	*/
	srcChanged: function () {
		var src = this.src || null;
		src = ri.selectSrc(src);
		if (src) {
			if (src != 'none' && src != 'inherit' && src != 'initial') {
				src = 'url(' + path.rewrite(src) + ')';
			}
		}
		this.applyStyle('background-image', src);
	},

	/**
	* @private
	*/
	iconChanged: function (old) {
		var icon = this.get('icon') || '',
			iconEntity = icons[icon] || icon;

		// If the icon isn't in our known set, apply our custom font class
		this.addRemoveClass('font-lg-icons', !icons[icon]);

		this.set('content', iconEntity);

		if (icons[old]) {
			this.removeClass(this.getIconClass(old));
		}
		if (icons[icon]) {
			this.addClass(this.getIconClass());
		}
	},

	/**
	* @private
	*/
	smallChanged: function () {
		this.addRemoveClass('small', this.small);
		// Now that our content area is ready, assign the icon
		this.iconChanged();
	},

	// Accessibility

	/**
	* @private
	*/
	ariaObservers: [
		{path: ['accessibilityLabel', 'accessibilityHint'], method: function () {
			var label = this.accessibilityHint && this.accessibilityLabel && (this.accessibilityLabel + ' ' + this.accessibilityHint) ||
						this.accessibilityHint ||
						this.accessibilityLabel ||
						null;
			this.setAriaAttribute('aria-label', label);
		}}
	]
});
