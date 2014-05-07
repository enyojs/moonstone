## 2.4.0-pre.2

Removed moon.List and moon.GridList, as they're considered deprecated.

## 2.4.0-pre.1

moon.Header: Facade dismissOnEnter to input

moon.Image: Facade new sizing and position properties to enyo.Image in chrome

moon.Panels: Add popOnBack property, to automatically pop panels when user moves back

moon.Panels: Call transitionFinished on panel instances only when transition actually completed,
giving app developers a hook to perform post-transition work in a panel.

In LESS files: Rename @moon-pink to @moon-accent



## 2.3.0-rc.20

`moon.Clock` now has an API to set the date/time statically, which prevents the clock from ticking
automatically and relies on the developer to update the date/time. This API is accessed by passing
as a parameter to the `setDate` method, an object with date/time values, i.e. something like
{year: 2014, month: 2, day: 15, hour: 11, min: 28, sec: 59}, where `month` is a 1-based month index 
(as opposed to the JavaScript 0-based month indexing) to match both ilib conventions and how 
numerical month values are normally written, in addition to how months are indexed in the target 
device services.

## 2.3.0-rc.4

Added an API to specify the horizontal and vertical positioning of the overlay icon in
moon.SelectionOverlaySupport, which can be mixed into any item used in moon.DataList or
moon.DataGridList. By default, the overlay icon is centered horizontally and vertically over the
item, but you can override the default by specifying percentage values for
_selectionOverlayHorizontalOffset_ and _selectionOverlayVerticalOffset_.

## 2.3.0-rc.1

`moon.VideoPlayer` and `moon.AudioPlayback` now handle remote control "trick play" keys by default.
To disable this behavior for apps that are already handling these controls, set
`handleRemoteControlKey:false`.

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

`moon.VideoPlayer` now automatically shows a `moon.Spinner` centered in the video area when
the video is in the playing state but is still buffering.   This can be disabled by setting
`autoShowSpinner:false`.

`moon.VideoPlayer` now automatically disables playback controls if there is no source set, and
until video metadata is loaded.  Playback controls will also be disabled if an error occurred during
video loading, e.g. URL returned 404.  This can be disabled by setting `disablePlaybackControlsOnUnload:false`.

`moon.Panel`, `moon.Panels`, and `moon.Drawers` have been updated to ensure there is exactly 20px of spacing
between all panels in all use cases.  To ensure that your app correctly meets this specification,
please make sure your full-screen `moon.Panels` instances have the `enyo-fit` class applied (instead of
`enyo-fill`, which was shown in some samples).

