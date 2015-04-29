require('moonstone');

var
	kind = require('enyo/kind');
var
	Image = require('../Image'),
	Icon = require('../Icon');

/**
* {@link moon.BadgeOverlaySupport} is a [mixin]{@glossary mixin} that may be applied
* to any {@link moon.DataList} or {@link moon.DataGridList} item to provide an overlay
* that is activated when the list contains items of type Video/Audio/Image.
*
* The BadgeOverlaySupport purpose is to show an icon badge on top of item to indicate
* the type of item. Like for Video/Audio it will show a default play icon and for Image
* there is nothing by default.
*
* The item has to define a
* [badgeType]{@link moon.BadgeOverlaySupport#badgeType} MIME type of this
* item. Possible values are 'video', 'audio' , 'image'. Defaulted as 'image'.
*
* ```javascript
* {name: 'list', kind: 'moon.DataList', components: [
*	{mixins: ['moon.BadgeOverlaySupport'], badgeType: 'video',
*		kind: 'moon.ImageItem', bindings: [
*			{from: '.model.title', to: '.label'},
*			{from: '.model.description', to: '.text'},
*			{from: '.model.coverSource', to: '.source'}
*		]
*	}
* ]}
* ```
*
* The item may define a
* [badgeSrc]{@link moon.BadgeOverlaySupport#badgeSrc} URL to
* override the default icon.
*
* ```javascript
* {name: 'list', kind: 'moon.DataList', components: [
*	{mixins: ['moon.BadgeOverlaySupport'], badgeType: 'video', badgeSrc: 'assets/my-icon.png',
*		kind: 'moon.ImageItem', bindings: [
*			{from: '.model.title', to: '.label'},
*			{from: '.model.description', to: '.text'},
*			{from: '.model.coverSource', to: '.source'}
*		]
*	}
* ]}
* ```
*
* The item may define a
* [position]{@link moon.BadgeOverlaySupport#position} to
* specify position of badge. Possible values are 'top' or 'bottom'. Defaulted as 'bottom'.
*
* ```javascript
* {name: 'list', kind: 'moon.DataList', components: [
*	{mixins: ['moon.BadgeOverlaySupport'], badgeType: 'video', position: 'top',
*		kind: 'moon.ImageItem', bindings: [
*			{from: '.model.title', to: '.label'},
*			{from: '.model.description', to: '.text'},
*			{from: '.model.coverSource', to: '.source'}
*		]
*	}
* ]}
* ```
*
* @mixin moon.BadgeOverlaySupport
* @public
*/
BadgeOverlaySupport = exports.Support = {

	/**
	* @private
	*/
	name: 'moon.BadgeOverlaySupport',

	/**
	* @private
	*/
	classes: 'moon-badge-overlay-support',

	/**
	* Identifies the MIME type of badge.
	* Possible values are "image", "audio" or "video".
	* Defaulted as 'image'.
	*
	* @name moon.BadgeOverlaySupport#badgeType
	* @type {String}
	* @default undefined
	* @public
	*/
	badgeType: undefined,

	/**
	* Font icon to be used in place of default icon.
	*
	* @name moon.BadgeOverlaySupport#badgeIcon
	* @type {String}
	* @default undefined
	* @public
	*/
	badgeIcon: undefined,

	/**
	* Url for icon to be used in place of default icon.
	*
	* @name moon.BadgeOverlaySupport#badgeSrc
	* @type {String}
	* @default undefined
	* @public
	*/
	badgeSrc: undefined,

	/**
	* Sepcifies the alignment position of badge.
	* Possible values are 'top' or 'bottom'.
	* Defaulted as 'bottom'.
	*
	* @name moon.BadgeOverlaySupport#position
	* @type {String}
	* @default undefined
	* @public
	*/
	position: undefined,

	/**
	* Sepcifies the alignment position of badge icon.
	* Possible values are 'left' or 'right'.
	* Defaulted as 'left'.
	*
	* @name moon.BadgeOverlaySupport#badgeIconPosition
	* @type {String}
	* @default left
	* @public
	*/
	badgeIconPosition: 'left',

	/**
	* Sepcifies whether badge should be transparent or not.
	* Possible values are 'true' or 'false'.
	* Defaulted as 'false'.
	*
	* @name moon.BadgeOverlaySupport#transparency
	* @type {String}
	* @default undefined
	* @public
	*/
	transparency: false,


	/**
	* @private
	*/
	events: {
		onBadgeTap: '',
		onBadgeIconTap: ''
	},

	/**
	* @method
	* @private
	*/
	create: kind.inherit(function (sup) {
		return function () {
			this.kindComponents = enyo.Component.overrideComponents(this.kindComponents, this._badgeOverride);
			sup.apply(this, arguments);
			this.positionChanged();
			this.badgeTypeChanged();
			this.badgeIconPositionChanged();
			if (this.badgeSrc) {
				this.$.badgeScrimIcon.set('icon','');
			}
			this.transparencyChanged();
		};
	}),

	/**
	* @private
	*/
	bindings: [
		{from: 'badgeSrc', to: '$.badgeScrimIcon.src'},
		{from: 'badgeIcon', to: '$.badgeScrimIcon.icon', transform: function(val){ return val ? val : 'play';}}
	],

	/**
	* @private
	*/
	_badgeOverride: {
		image: {kind: Image, components:[{
				name: 'badgeScrimIcon', kind: Icon, small: true, icon: 'play', spotlight: false
			}]
		}
	},

	/**
	* @private
	*/
	positionChanged: function () {
		this.addRemoveClass('top', this.position == 'top');
	},

	/**
	* @private
	*/
	badgeIconPositionChanged: function() {
		this.addRemoveClass('right', this.badgeIconPosition == 'right');
	},

	/**
	* @private
	*/
	badgeTypeChanged: function () {
		var image = this.$.image;
		image.destroyClientControls();
		if(this.badgeType && this.badgeType != 'image') {
			image.createComponent(this._badgeOverride.image.components[0]);
		}
	},

	/**
	* @private
	*/
	transparencyChanged: function() {
		this.addRemoveClass('moon-badge-overlay-transparent', this.transparency);
	},

	/**
	* @method
	* @private
	*/
	dispatchEvent: enyo.inherit(function (sup) {
		return function (sEventName, oEvent, oSender) {
			if (oEvent && !oEvent.delegate) {
				if (sEventName == 'ontap') {
					if (this.badgeTap(oSender, oEvent)) {
						return true;
					}
				}
			}
			return sup.apply(this, arguments);
		};
	}),

	/**
	* @method
	* @private
	*/
	badgeTap: function (inSender, inEvent) {
		if (inEvent && inEvent.dispatchTarget) {
			var target = inEvent.dispatchTarget;
			if (target.isDescendantOf(inSender.$.badgeScrimIcon)) {
				this.bubble('onBadgeIconTap', inEvent);
				return true;
			} else if (target.isDescendantOf(this.$.image)) {
				this.bubble('onBadgeTap', inEvent);
				return true;
			}
		}
		return false;
	}
};
