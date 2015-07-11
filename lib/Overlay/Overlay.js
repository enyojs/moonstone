/**
* moonstone/Overlay contains a set of mixins that support providing a layer of controls contextually
* displayed over another control.
* 
* {@link moonstone/Overlay.Support} provides the generic support for overlays. With it, you can
* add arbitrary {@link moonstone/Overlay.Support#overlayComponents} and configured their position
* and formatting.
* 
* There are 3 supplementary mixins for common use cases ({@link moonstone/Overlay.Selection},
* {@link moonstone/Overlay.Text}, and {@link moonstone/Overlay.Marquee}). These mixins preconfigure
* the overlay with components and expose additional properties to further configure the mixin.
* Unlike most mixins, these three do little on their own and must be using in conjunction with
* {@link moonstone/Overlay.Support}.
*
* ```
* // A control with a default Selection overlay
* {kind: Control, mixins: [Overlay.Support, Overlay.Selection]}
* 
* // A control with a Selection overlay and customized position and components
* {kind: Control, mixins: [Overlay.Support, Overlay.Selection],
*	overlayPosition: 'left', overlayComponents: [
*		{kind: Icon, icon: 'check', small: true}
*	]
* }
* ```
*
* @module moonstone/Overlay
*/

require('moonstone');

var
	kind = require('enyo/kind'),
	utils = require('enyo/utils'),
	Binding = require('enyo/Binding');

var
	Icon = require('moonstone/Icon'),
	Marquee = require('moonstone/Marquee');

/**
* Maps the value of `overlayAlign` to the appropriate CSS class
*
* @param	{String}	value	Alignment value
* @return	{String}			CSS Class
*
* @private
*/
function mapAlign (value) {
	return	value == 'left' && 'align-left' ||
			value == 'right' && 'align-right' ||
			value == 'start' && (this.rtl ? 'align-right' : 'align-left') ||
			value == 'end' && (this.rtl ? 'align-left' : 'align-right') ||
			'';
}

/**
* Maps the value of `overlayTransparent` to the appropriate CSS class
*
* @param	{String}	value	Transparency value
* @return	{String}			'transparent'
*
* @private
*/
function mapTransparent (value) {
	return 'transparent';
}

/**
* Maps the value of `overlayPosition` to the appropriate CSS class
*
* @param	{String}	value	Position value
* @return	{String}			CSS Class
*
* @private
*/
function mapPosition (value) {
	return value == 'centered' ? value : 'position-' + value;
}

/**
* Does nothing but used to enable a single observer for property -> class changes
*
* @param	{String}	value	CSS classes
* @return	{String}			The same CSS classes
*
* @private
*/
function mapClasses (value) {
	return value;
}

/**
* Maps the value of `overlayShowing` to the appropriate CSS class
*
* @param	{String}	value	Showing value
* @return	{String}			CSS Class
*
* @private
*/
function mapShowing (showing) {
	return	(showing === true || showing === false) && 'show' ||
			showing == 'spotlight' && 'show-on-spotlight' ||
			showing == 'hover' && 'show-on-hover' ||
			'';
}

/**
* Bound to an overlay container, forwards a changed property value to the container's
* {@link moon.OverlayContainerSupport#overlayTarget}.
*
* @param  {Any}		was		Previous property value
* @param  {Any}		is		Current property value
* @param  {String}	prop	Property name
*
* @private
*/
function forwardPropertyChange (was, is, prop) {
	var target = this.$[this.overlayTarget];
	if (target) {
		// Special handling for overlayComponents to ensure the component ownership is correct
		if (prop == 'overlayComponents') {
			is = updateOwnership(is, this.getInstanceOwner());
		}
		target.set(prop, is);
	}
}

/**
* Iterates over `components` to update the `owner`. Note that `components` is not cloned and is
* updated in place and returned.
*
* @param  {Object[]}		components	Component configs
* @param  {enyo.Control}	owner		Owner of components
* @return {Object[]}					Updated component configs
*
* @private
*/
function updateOwnership (components, owner) {
	var control, i;
	if (components) {
		for (i = components.length - 1; i >= 0; --i) {
			control = components[i];
			control.owner = control.owner || owner;
		}
	}
	return components;
}

/**
* {@link moon.OverlaySupport} adds an overlay to show additional controls over the control using
* the mixin. Display of the overlay is controlled by {@link moon.OverlaySupport#overlayShowing}
* which supports displaying manually, on spotlight, or on hover.
*
* ```
* {kind: Image, src: 'assets/movie.png', mixins: [Overlay.Support],
* 	overlayShowing: 'hover', overlayPosition: 'bottom', overlayAlign: 'right', overlayComponents: [
*		{kind: Icon, src: 'assets/icon-recommended.png'},
*		{kind: Icon, icon: 'star'},
*		{kind: Icon, src: 'assets/icon-new.png'}
* 	]
* }
* ```
*
* @mixin moon.OverlaySupport
* @public
*/
module.exports.Support = {

	/**
	* @private
	*/
	name: 'moon.OverlaySupport',

	/**
	* Controls display of the overlay.
	*
	* `true`		Showing
	* `false`		Not showing
	* `'spotlight'`	Showing when an ancestor control is spotted
	* `'hover'`		Showing when its parent is hovered by the pointer
	*
	* @name overlayShowing
	* @type {String|Boolean}
	* @default undefined
	* @public
	*/

	/**
	* The overlay is absolutely positioned over the control on which it is applied. By default, it
	* will cover the entire area but can be configured using this property or by overriding the CSS
	* class `moon-overlay-container`.
	*
	* * `centered`
	*   Contents are vertically and horizontally centered
	* * `top`
	*   Anchored to the top of the container with the natural height of its contents
	* * `bottom`
	*   Anchored to the bottom of the container with the natural height of its contents
	* * `left`
	*   Anchored to the left of the container with the natural width of its contents
	* * `right`
	*   Anchored to the right of the container with the natural width of its contents
	*
	* @name overlayPosition
	* @type {String}
	* @default undefined
	* @public
	*/

	/**
	* Aligns the contents of the overlay.
	*
	* * `left`
	*   Controls are aligned to the left
	* * `right`
	*   Controls are aligned to the left
	* * `start`
	*   Same as `left` for left-to-right languages and `right` for right-to-left languages
	* * `end`
	*   Same as `right` for left-to-right languages and `left` for right-to-left languages
	*
	* @name overlayAlign
	* @type {String}
	* @default undefined
	* @public
	*/

	/**
	* By default, the background of the overlay is black at 50% opacity. Setting this property to
	* `true` makes it transparent.
	*
	* @name overlayTransparent
	* @type {Boolean}
	* @default false
	* @public
	*/

	/**
	* Additional CSS classes that will be applied to the overlay container.
	*
	* @name overlayClasses
	* @type {String}
	* @default undefined
	* @public
	*/

	/**
	* @private
	*/
	create: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.addClass('moon-overlay');
			this.overlayShowing = utils.exists(this.overlayShowing) ? this.overlayShowing : false;

			this.overlayComponentsChanged();

			// Property observers that map property changes to CSS classes
			this.observe('overlayClasses', this.bindSafely(this.overlayPropertyToClass, mapClasses));
			this.observe('overlayPosition', this.bindSafely(this.overlayPropertyToClass, mapPosition));
			this.observe('overlayAlign', this.bindSafely(this.overlayPropertyToClass, mapAlign));
			this.observe('overlayTransparent', this.bindSafely(this.overlayPropertyToClass, mapTransparent));
			this.observe('overlayShowing', this.bindSafely(this.overlayPropertyToClass, mapShowing));
		};
	}),

	/**
	* @private
	*/
	overlayComponentsChanged: function () {
		if (!this.overlayComponents) {
			if (this.$.overlayContainer) this.$.overlayContainer.destroy();
			return;
		}

		if (!this.$.overlayContainer) {
			var classes = ['moon-overlay-container'];
			if (this.overlayClasses) classes.push(this.overlayClasses);
			if (this.overlayPosition) classes.push(mapPosition(this.overlayPosition));
			if (this.overlayAlign) classes.push(mapAlign(this.overlayAlign));
			if (this.overlayTransparent) classes.push(mapTransparent(this.overlayTransparent));
			if (this.overlayShowing) classes.push(mapShowing(this.overlayShowing));

			this.createComponent({name: 'overlayContainer', classes: classes.join(' ')});
		}

		// wrapper should be owned by this but client controls should be owned by the instance owner
		this.$.overlayContainer.createComponent({
			classes: 'moon-overlay-component',
			components: updateOwnership(this.overlayComponents, this.getInstanceOwner()),
			owner: this
		});
	},

	/**
	* Observer that maps a property value to a CSS class and adds or removes it as necessary
	*
	* @private
	*/
	overlayPropertyToClass: function (map, was, is) {
		var c = this.$.overlayContainer;
		if (c) {
			if (was) c.removeClass(map.call(this, was));
			if (is) c.addClass(map.call(this, is));
		}
	}
};

/**
* Binding that expects an array of component configs which will be updated during transform to be
* owned by the binding owner's instance owner.
*
* @class moon.OverlayComponentsBinding
* @module moonstone/Overlay
* @public
*/
module.exports.ComponentsBinding = kind({

	/**
	* @private
	*/
	name: 'moon.OverlayComponentsBinding',

	/**
	* @private
	*/
	kind: Binding,

	/**
	* @private
	*/
	transform: function (overlayComponents) {
		return updateOwnership(overlayComponents, this.getInstanceOwner());
	}
});

/**
* Adds observers for the known overlay properties which forward the property changes to the
* contained control with @{link moon.OverlaySupport} identified by
* {@linke moon.OverlayContainerSupport#overlayTarget}
*
* @mixin moon.OverlayContainerSupport
* @module moonstone/Overlay
* @public
*/
module.exports.Container = {

	/**
	* @private
	*/
	name: 'moon.OverlayContainerSupport',

	/**
	* Name of the contained control with {@link moon.OverlaySupport}
	*
	* @name overlayTarget
	* @type {String}
	* @default undefined
	* @public
	*/

	/**
	* List of overlay properties to forward to this container's
	* {@link moon.OverlayContainerSupport#overlayTarget}
	*
	* @private
	*/
	overlayPropertyBindings: [
		'overlayComponents',
		'overlayShowing',
		'overlayClasses',
		'overlayIcon',
		'overlayTitle',
		'overlaySubtitle',
		'overlayPosition',
		'overlayAlign',
		'overlayTransparent'
	],

	/**
	* @private
	*/
	create: kind.inherit(function (sup) {
		return function () {
			var i, prop;
			sup.apply(this, arguments);

			var fn = this.bindSafely(forwardPropertyChange);
			for (i = this.overlayPropertyBindings.length - 1; i >= 0; --i) {
				prop = this.overlayPropertyBindings[i];
				this.observe(prop, fn);
				if (utils.exists(this[prop])) fn(null, this[prop], prop);
			}
		};
	})
};

/**
* Sets the default configuration and components for selection overlay. Requires that the control to
* which it is applied also applies {@link moon.OverlaySupport} or contains a control that does and
* applies {@link moon.OverlayContainerSupport}.
*
* SelectionOverlaySupport adds the styling for a centered icon that can be shown when the `selected`
* class is applied to the overlaid control.
*
* ```
* {kind: Image, src: 'assets/movie.png', mixins: [Overlay.Support, Overlay.Selection],
* 	overlayShowing: 'spotlight', overlayComponents: [
*		{kind: Icon, icon: 'check'}
* 	]
* }
* ```
*
* @mixin moon.SelectionOverlaySupport
* @module moonstone/Overlay
* @public
*/
module.exports.Selection = {

	/**
	* @private
	*/
	name: 'moon.SelectionOverlaySupport',

	/**
	* @private
	*/
	overlayClasses: 'moon-overlay-selection',

	/**
	* @private
	*/
	overlayTransparent: true,

	/**
	* @private
	*/
	overlayPosition: 'centered',

	/**
	* Icon to be displayed when selected. May either be a URL to an image or the valid name of an
	* {@link moon.Icon#icon}.
	*
	* @name overlayIcon
	* @type {String}
	* @default undefined
	* @public
	*/
	overlayIcon: 'check',

	/**
	* @private
	*/
	bindings: [
		// to reduce API surface area, we'll only expose overlayIcon and map that to both src and
		// icon ensuring that only 1 is valued based on the presence of a `.` to indicate a URL
		{from: 'overlayIcon', to: '$.overlayIcon.icon', transform: function (icon) {
			return (!icon || icon.indexOf('.') >= 0) ? null : icon;
		}},
		{from: 'overlayIcon', to: '$.overlayIcon.src', transform: function (icon) {
			return (!icon || icon.indexOf('.') == -1) ? null : icon;
		}}
	],

	/**
	* @private
	*/
	create: kind.inherit(function (sup) {
		return function () {
			this.overlayComponents = this.overlayComponents || [
				{name: 'overlayIcon', kind: Icon, small: false, owner: this}
			];
			sup.apply(this, arguments);
		};
	})
};

/**
* Sets the default configuration and components for fixed text overlay. Requires that the control to
* which it is applied also applies {@link moon.OverlaySupport} or contains a control that does and
* applies {@link moon.OverlayContainerSupport}.
* 
* TextOverlaySupport styles controls with the `moon-overlay-text-title` and
* `moon-overlay-text-subtitle` classes
*
* ```
* {kind: Image, src: 'assets/movie.png', mixins: [Overlay.Support, Overlay.Selection],
* 	overlayShowing: 'spotlight', overlayComponents: [
*		{kind: Marquee.Text, content: 'Title', classes: 'moon-overlay-text-title'},
*		{kind: Marquee.Text, content: '12', classes: 'moon-overlay-text-subtitle'}
* 	]
* }
* ```
*
* @mixin moon.TextOverlaySupport
* @module moonstone/Overlay
* @public
*/
module.exports.Text = {

	/**
	* @private
	*/
	name: 'moon.TextOverlaySupport',

	/**
	* @private
	*/
	overlayClasses: 'moon-overlay-text',

	/**
	* @private
	*/
	overlayPosition: 'centered',

	/**
	* Text to be displayed on top of the overlay with the `moon-overlay-text-title` class applied
	*
	* @name overlayTitle
	* @type {String}
	* @default undefined
	* @public
	*/

	/**
	* Text to be displayed on bottom of the overlay with the `moon-overlay-text-subtitle` class
	* applied
	*
	* @name overlaySubtitle
	* @type {String}
	* @default undefined
	* @public
	*/

	/**
	* @private
	*/
	bindings: [
		{from: 'overlayTitle', to: '$.overlayTitle.content'},
		{from: 'overlaySubtitle', to: '$.overlaySubtitle.content'}
	],

	/**
	* @private
	*/
	create: kind.inherit(function (sup) {
		return function () {
			this.overlayComponents = this.overlayComponents || [
				{name: 'overlayTitle', classes: 'moon-overlay-text-title', owner: this},
				{name: 'overlaySubtitle', classes: 'moon-overlay-text-subtitle', owner: this}
			];
			sup.apply(this, arguments);
		};
	})
};


/**
* Sets the default configuration and components for marqueed text overlay. Requires that the control
* to which it is applied also applies {@link moon.OverlaySupport} or contains a control that does
* and applies {@link moon.OverlayContainerSupport}.
*
* @mixin moon.MarqueeOverlaySupport
* @module moonstone/Overlay
* @public
*/
module.exports.Marquee = {

	/**
	* @private
	*/
	name: 'moon.MarqueeOverlaySupport',

	/**
	* @private
	*/
	overlayClasses: 'moon-overlay-text',

	/**
	* @private
	*/
	overlayPosition: 'centered',

	/**
	* Text to be displayed on top of the overlay with the `moon-overlay-text-title` class applied
	*
	* @name overlayTitle
	* @type {String}
	* @default undefined
	* @public
	*/

	/**
	* Text to be displayed on bottom of the overlay with the `moon-overlay-text-subtitle` class
	* applied
	*
	* @name overlaySubtitle
	* @type {String}
	* @default undefined
	* @public
	*/

	/**
	* @private
	*/
	bindings: [
		{from: 'overlayTitle', to: '$.overlayTitle.content'},
		{from: 'overlaySubtitle', to: '$.overlaySubtitle.content'}
	],

	/**
	* @private
	*/
	create: kind.inherit(function (sup) {
		return function () {
			this.overlayComponents = this.overlayComponents || [
				{name: 'overlayTitle', kind: Marquee.Text, centered: true, classes: 'moon-overlay-text-title', owner: this},
				{name: 'overlaySubtitle', kind: Marquee.Text, centered: true, classes: 'moon-overlay-text-subtitle', owner: this}
			];
			sup.apply(this, arguments);
		};
	})
};