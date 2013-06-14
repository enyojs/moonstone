/**
	_moon.ContextualPopup_ is a popup window control with Moonstone visual styling
	applied.  It extends <a href="#enyo.Popup">enyo.Popup</a> and is designed to
	be used with <a href="#moon.ContextualPopupDecorator">moon.ContextualPopupDecorator</a>.
*/
enyo.kind({
	name: "moon.ContextualPopup",
	kind: "enyo.Popup",
	layoutKind: "ContextualLayout",
	classes: "moon-contextual-popup",
	handlers: {
		onRequestShowPopup: "requestShow",
		onRequestHidePopup: "requestHide",
		onActivate: "decorateActivateEvent"
	},
	floating:true,
	//layout parameters
	vertFlushMargin:0, //vertical flush layout margin
	horizFlushMargin:0, //horizontal flush layout margin
	widePopup:200, //popups wider than this value are considered wide (for layout purposes)
	longPopup:200, //popups longer than this value are considered long (for layout purposes)
	horizBuffer:16, //do not allow horizontal flush popups past spec'd amount of buffer space on left/right screen edge
	requestShow: function(inSender, inEvent) {
		var n = inEvent.activator.hasNode();
		if (n) {
			this.activatorOffset = this.getPageOffset(n);
		}
		this.show();
		return true;
	},
	requestHide: function(inSender, inEvent) {
		this.hide();
		return true;
	},
	decorateActivateEvent: function(inSender, inEvent) {
		inEvent.sentFromPopup = this;
	},
	getPageOffset: function(inNode) {
		// getBoundingClientRect returns top/left values which are relative to the viewport and not absolute
		var r = inNode.getBoundingClientRect();

		var pageYOffset = (window.pageYOffset === undefined) ? document.documentElement.scrollTop : window.pageYOffset;
		var pageXOffset = (window.pageXOffset === undefined) ? document.documentElement.scrollLeft : window.pageXOffset;
		var rHeight = (r.height === undefined) ? (r.bottom - r.top) : r.height;
		var rWidth = (r.width === undefined) ? (r.right - r.left) : r.width;

		return {top: r.top + pageYOffset, left: r.left + pageXOffset, height: rHeight, width: rWidth};
	}
});
