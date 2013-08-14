/**
_enyo.Scroller_ is a scroller suitable for use in both desktop and mobile
applications.

In some mobile environments, a default scrolling solution is not implemented for
DOM elements.  In such cases, _enyo.Scroller_ implements a touch-based scrolling
solution, which may be opted into either globally (by setting the flag
_enyo.Scroller.touchScrolling = true;_) or on a per-instance basis (by
specifying a _strategyKind_ of "TouchScrollStrategy").

For more information, see the documentation on
[Scrollers](https://github.com/enyojs/enyo/wiki/Scrollers) in the Enyo Developer
Guide.
*/
enyo.kind({
	name: "sun.Scroller",
	kind: "moon.Scroller",
	touch: true
});
