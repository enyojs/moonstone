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
