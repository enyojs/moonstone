## 2.3.0-pre.11

Previous to pre.11, `moon.TooltipDecorator` and `moon.ContextualPopupDecorator` were block-level 
elements.  However, since tooltips and popups are most commonly used with inline-block activators 
such as `moon.Button` and `moon.Icon`, these decorators were changed to be an inline-block element by 
default.  This avoids requiring a "display: inline-block;" style to be applied to the decorator to
achieve correct popup positioning when wrapping an inline-block element, which is the biggest use 
case.  When wrapping a block-level element, simply add a "display: block;" to the decorator's inline
style or CSS class.  Tooltips and ContextualPopups used as components of `moon.Header` are not
affected, since header children are forced to `display: inline-block` by default.

`moon.CalendarPicker` was renamed to `moon.Calendar`.

`moon.Popup` and `moon.Dialog` now animate on/off screen by default.  To prevent this behavior, set
`animate:false`.

`moon.Input` now has an optional `dismissOnEnter` flag, which will blur the input (and dismiss the
VKB, if present) when the Enter key is pressed.

`moon.Spinner` used to require classes `moon-light` or `moon-dark`, depending on the background
it was placed on.  `moon.Spinner` now comes with a solid background color, and so those classes
no longer have any effect and may be removed.

`moon.Spinner` can now take a `content` property to add a message inside the spinner control.
See the SpinnerSample.html for example.