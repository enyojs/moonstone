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
	drawer            : '&#983040;',  // \0F0000
	arrowlargedown    : '&#983041;',  // \0F0001
	arrowlargeup      : '&#983042;',  // \0F0002
	arrowlargeleft    : '&#983043;',  // \0F0003
	arrowlargeright   : '&#983044;',  // \0F0004
	arrowsmallup      : '&#983045;',  // \0F0005
	arrowsmalldown    : '&#983046;',  // \0F0006
	arrowsmallleft    : '&#983047;',  // \0F0007
	arrowsmallright   : '&#983048;',  // \0F0008
	closex            : '&#983049;',  // \0F0009
	check             : '&#10003;',   // \02713
	search            : '&#983051;',  // \0F000B
	list              : '&#983052;',  // \0F000C
	bulletlist        : '&#983053;',  // \0F000D
	denselist         : '&#983054;',  // \0F000E
	rollforward       : '&#983055;',  // \0F000F
	rollbackward      : '&#983056;',  // \0F0010
	exitfullscreen    : '&#983057;',  // \0F0011
	fullscreen        : '&#983058;',  // \0F0012
	circle            : '&#983059;',  // \0F0013
	stop              : '&#983060;',  // \0F0014
	play              : '&#983061;',  // \0F0015
	pause             : '&#983062;',  // \0F0016
	forward           : '&#983063;',  // \0F0017
	backward          : '&#983064;',  // \0F0018
	skipforward       : '&#983065;',  // \0F0019
	skipbackward      : '&#983066;',  // \0F001A
	pauseforward      : '&#983067;',  // \0F001B
	pausebackward     : '&#983068;',  // \0F001C
	pausejumpforward  : '&#983069;',  // \0F001D
	pausejumpbackward : '&#983070;',  // \0F001E
	jumpforward       : '&#983071;',  // \0F001F
	jumpbackward      : '&#983072;',  // \0F0020
	arrowextend       : '&#983073;',  // \0F0021
	arrowshrink       : '&#983074;',  // \0F0022
	flag              : '&#983075;',  // \0F0023
	funnel            : '&#983076;',  // \0F0024
	trash             : '&#983077;',  // \0F0025
	plus              : '&#43;',      // \02B
	minus             : '&#8722;',    // \02212
	star              : '&#983080;',  // \0F0028
	hollowstar        : '&#983081;',  // \0F0029
	halfstar          : '&#983082;',  // \0F002A
	gear              : '&#983083;',  // \0F002B
	plug              : '&#983084;',  // \0F002C
	lock              : '&#983085;'   // \0F002D
};

/**
* {@link module:moonstone/Icon~Icon} is a control that displays an icon image. You may specify the
* image by setting the [src]{@link module:moonstone/Icon~Icon#src} property to a URL indicating the
* image file's location.
*
* ```
* {kind: 'moon.Icon', src: 'images/search.png'}
* ```
*
* Moonstone also supports a second method for displaying icons; in addition to
* using traditional image assets specified in `src`, you may use icons that are
* stored as single characters in a special symbol font. To do this, set the
* value of the [icon]{@link module:moonstone/Icon~Icon#icon} property to a string representing an
* icon name, e.g.:
*
* ```
* {kind: 'moon.Icon', icon: 'closex'}
* ```
*
* For image-based icons, two sizes are supported: large (45x45 pixels) and small
* (32x32 pixels). Icons are small by default. To specify a large icon, set the
* [small]{@link module:moonstone/Icon~Icon#small} property to `false`:
*
* ```
* {kind: 'moon.Icon', src: 'images/search.png', small: false}
*
* {kind: 'moon.Icon', icon: 'closex', small: false}
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

		if (this.get('small')) {
			this.$.tapArea.set('content', iconEntity);
		} else {
			this.set('content', iconEntity);
		}

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
		if (this.small) {
			var ta = this.createComponent({name: 'tapArea', classes: 'small-icon-tap-area', allowHtml: this.allowHtml, isChrome: true});

			if (this.generated) {
				ta.render();
			}
		} else {
			if (this.$.tapArea) {
				this.$.tapArea.destroy();
			}
		}
		this.addRemoveClass('small', this.small);
		// Now that our content area is ready, assign the icon
		this.iconChanged();
	}
});
