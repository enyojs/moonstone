# Contributions

Contributions are welcome for Enyo and its associated libraries.

Please see [Contributing to Enyo](http://enyojs.com/community/contribute/) for details
on our contribution policy and guidelines for use of the Enyo-DCO-1.1-Signed-off-by
line in your commits and pull requests.

If you're interested in introducing new kinds, you might also consider hosting your own repo
and contributing to the [Enyo community gallery](http://enyojs.com/gallery).

Below are specific guidelines to follow when contributing to the Moonstone library.

## Internationalization

Moonstone uses the [ilib](http://jedlsoft.com/index.html) internationalization library loaded via
the [enyo-ilib](https://github.com/enyojs/enyo-ilib) wrapper) for localizing any strings used inside
controls, as well as any locale-specific date, time, and number formatting.

All user-visible strings in Moonstone controls should be wrapped with the localization wrapper
function available in the `moonstone/i18n` submodule.  This will ensure localized strings are loaded
from Moonstone resource files (as opposed to app-specific resource files when using the Enyo core
localization wrapper from `enyo/hooks`.

Any formatting of date, time, or numbers should use ilib.

## Modifications to CSS

Moonstone CSS is defined using parameterized LESS files. In general, each control should have its
own `MyControl.less` file which contains CSS rules pertaining to the control in question, with
parameters useful for themability defined as descriptive symbolic variables in one of the variable
files described below. If a control has a LESS file, this file should be declared within the `style`
array within the control's `package.json`.

The following is detail around the structure and rules that should be followed to ensure all
Moonstone controls support several different required variations:

### Color variations: _Dark, Light, and Neutral_

Virtually all Moonstone controls must support `dark`, `light`, and `neutral` color themes.  

Currently, an app may choose between the dark or light themes at build time by setting the
`@moon-theme` LESS variable from within their application's LESS stylesheet.
`moonstone-variables.less` will then include the correct theme's variable fill (either
`moonstone-variables-dark.less` or `moonstone-variables-light.less`) based on the value of that
variable. While the light and dark themes are mutually exclusive and rely on different compiled CSS,
contols must adapt themselves at runtime to use the neutral theme when placed inside of certain
containers (Popup, ContextualPopup, Drawer, ListActions, etc.), through the application of the
`.moon-neutral` class.

Any color value (for `color`, `background-color`, `border-color`, etc.) should be defined in a
variable in the `moonstone-light.less` and `moonstone-dark.less` files, rather than directly in the
widget file (regardless of whether the value actually differs today between the light and dark
themes).  For example:

_Button.less_
	
```
.moon-button {
	...
	background-color: @moon-button-background-color;
	color: @moon-button-text-color;
}
.moon-neutral .moon-button * {
	background-color: @moon-neutral-button-background-color;
	color: @moon-neutral-button-text-color;
}
```
_moonstone-variables-dark.less_

```
@moon-button-background-color: #404040;
@moon-button-text-color: #a6a6a6;
```

_moonstone-variables-light.less_

```
@moon-button-background-color: #FFFFFF;
@moon-button-text-color: #4B4B4B;
```

_moonstone-variables.less_

```
@moon-neutral-button-background-color: #404040;
@moon-neutral-button-text-color: #a6a6a6;
```


### Font variations: _Latin and Non-Latin_

Moonstone controls are rendered using two different font sets, depending on the runtime-selected
locale of the system. 

For "latin" locales (locales that predominantly use the latin alphabet, such as English, French,
Spanish, etc.) are rendered using "Miso" (primarily for Header, Button, and Tooltip) and Museo Sans
(for all other text).  These fonts are included in the moonstone library as web fonts, loaded via
`@font-face` rules included in `moonstone-fonts.less` if the fonts are not found on the system.

Since Miso/Museo Sans are not full-unicode fonts, all other non-Latin locales will be rendered using
`LG Display` if present on the system, or the default system font otherwise.

The `ilib` library will automatically apply `.enyo-locale-non-latin` to `<body>` when the system
locale is a non-latin locale.  Thus, font classes should be defined to use Miso/Museo Sans by
default, and include overrides to use `LG Display` when the `.enyo-locale-non-latin` class is
applied.

Individual controls have two options of supporting this requirement to change fonts at runtime.

1. **Use standard font classes in JS**: 

	The `moonstone-rules.less` file includes a number of standard font classes that may be applied
	directly to controls via their `classes` property.  These classes have `.enyo-locale-non-latin`
	variants which select the correct font automatically.  This is the preferred approach.  Example:

	```
var kind = require('enyo/kind');

kind({
	name: Divider,
	classes: 'moon-divider moon-divider-text',  // moon-divider-text will automatically change font based on locale
	...
});
	```
	Refer to the `FontSample.html` for a list and examples of these font classes.

2. **Mixin standard font classes in LESS**

	Alternatively, there are cases (especially when sub-kinding) where CSS specificity requires you
	to define a more specific selector in order for the correct style to be applied.  In this case,
	you may "mixin" a standard text class into your new rule, using the LESS mixin feature (simply
	include the class name including dot, followed by a semicolon).  However, note that when mixing
	in a class, that effectively copies the content of the class into the new rule.  As such, you
	will lose the ability for the font to change automatically based on locale.  So, when using font
	class mixins, you must always define an additional rule adding an `.enyo-locale-non-latin`
	selector, which mixes in the `.enyo-locale-non-latin` version of the standard text class.
	Example:

	```	
.moon-expandable-input.open .moon-expandable-input-header {
	.moon-divider-text;
	...
}
.enyo-locale-non-latin .moon-expandable-input.open .moon-expandable-input-header {
	.enyo-locale-non-latin .moon-divider-text;
}
	```

IMPORTANT: Moonstone is a typographic-centered UI library, and thus it is important to limit the
number of font variations to a small set for consistency and visual harmony.  Individual control
CSS should avoid defining one-off `font-face` or `font-size` rules, and insetad should only select
from the menu of standard font classes, using one of the two options above.

### Direction variations: _LTR_ and _RTL_

All Moonstone controls must support "right-to-left" (RTL) layout, in addition to the default
"left-to-right" layout. 

Similar to fonts, the `ilib` library will apply an `.enyo-locale-right-to-left` class to `<body>`
for this purpose.  The standard `.moon` class used on every Moonstone app will automatically set the
`direction:rtl;` CSS property, which reverses the HTML layout flow direction and applies other
specific text flow rules accordingly.  Native browser support for the `direction` property covers
90% of the work of supporting RTL.

However, in most cases, any control CSS that specifically sets a `left` or `right` property
asymmetrically will need to be reversed in RTL.  The following is a list of common properties that
need reversing:

* padding-left/right
* margin-left/right
* border-left/right
* left/right (absolute/relative positioning)
* float: left/right
* text-align: left/right
* background-position: left/right

This can be simply accomplished by defining a second rule that resets the default property, and sets
the opposite.  Examples:

```
.moon-header-left {
  float: left;
}
.enyo-locale-right-to-left .moon-header-left {
  float: right;
}
```

```
.moon-toggle-text-text {
  position: absolute;
  right: 0px;
  ...
}
.enyo-locale-right-to-left .moon-toggle-text-text {
  right: auto;
  left: 0px;
}
```

```
.moon-item.moon-formcheckbox-item {
  ...
  padding-left: 10px;
  ...
}
.enyo-locale-right-to-left .moon-item.moon-formcheckbox-item {
  padding-left: 0;
  padding-right: 10px;
}

```

#### RTL: When CSS isn't enough

There are a few rare cases where JS logic needs to be aware of whether the control is rendered in
RTL or LTR.  Rather than sniffing the computed style for `direction` or checking for the
`.enyo-locale-right-to-left` class on body (which would be bad for performance), we have added a
`rtl` property to the enyo.Control prototype which will also be set to `true`  by `ilib` when
applying the `.enyo-locale-right-to-left` class.  enyo.Control sub-kinds can simply check `this.rtl`
on their instance to determine whether the control is in RTL or LTR mode.

## Samples

Every new control should be accompanied by at least one sample, pluggable into the library's
internal sampler located in `samples/src/index.js`.

Guidelines for samples:

* Should live in `moonstone/samples/src`,
* Should exercise useful API's and events of the control in the sample,
* Should include more than one instance in the sample when one or more significantly different or
  interesting configurations of the control are available,
* Should be updated ensure the original bug and resolution are testable when resolving a bug
	
## Testing Samples

Samples should be tested both using their standalone `html` file, as well as in the Enyo 2 Sampler,
in all variations described above.

To toggle the non-latin and RTL classes/settings at runtime, which is useful for testing your
control in the variations described above, you can apply these classes via the inspector like this:

```
// To turn on non-latin (caching previous value, for easy switching):
var orig = document.body.className; document.body.className += " enyo-locale-non-latin"
// To turn off non-latin:
document.body.className = orig;
```

```
// To turn on RTL (caching previous value, for easy switching):
var orig = document.body.className; document.body.className += " enyo-locale-right-to-left"

// To turn off RTL:
document.body.className = orig;
```

Note, the above RTL code only sets the CSS class on body; it does not set `enyo.Control`'s `rtl`
flag, which is needed by a small number of controls to operate properly (Slider, FittableLayout,
MarqueeText, etc.).  In this case, you would need to set a breakpoint before the control is rendered
to force the flag to true, so that it is properly rendered in the new mode.
