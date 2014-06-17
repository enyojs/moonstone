(function (enyo, scope) {
	
	var HTMLStringDelegate = enyo.HTMLStringDelegate,
		HighlightTextDelegate = Object.create(HTMLStringDelegate);
		
	HighlightTextDelegate.generateInnerHtml = function (control) {
		if (control.search) {
			return control.content.replace(control.search, control.bindSafely(function(s) {
				return "<span style='pointer-events:none;' class='" + this.highlightClasses + "'>" + enyo.dom.escape(s) + "</span>";
			}));
		} else {
			return enyo.dom.escape(control.get("content"));
		}
	};
	
	/**
		_moon.HighlightText_ is a control that displays highlighted text.  When
		_setHighlight()_ is called or an _onHighlight_ event is received, it will
		highlight a specified string if that string is found within the control's
		content.

		For example, let's say we have the following control:

			{kind: "moon.HighlightText", name: "myHT", content: "Hello World!"}

		In response to the event

			this.waterfall("onHighlight", {highlight: "Hello"});

		or the direct API call

			this.$.myHT.setHighlight("Hello");

		the word "Hello" will be highlighted.

		The highlighting will be turned when an _offHighlight_ event is received

			this.waterfall("offHighlight");

		or when _setHighlight()_ is passed a falsy value

			this.$.myHT.setHighlight("");
	*/
	enyo.kind({
		name: "moon.HighlightText",
		//* @public
		published: {
			//* String or regular expression specifying the text or pattern to
			//* highlight. Setting this to an empty string, falsy value, or empty
			//* regex will disable highlighting.
			highlight: "",
			//* When true, only case-sensitive matches of the string to highlight
			//* will be highlighted.  This property will be ignored if the
			//* _highlight_ property is set to a regular expression (you may use the
			//* "i" modifier to create a case-insensitive regex).
			caseSensitive: false,
			//* The default CSS class to apply to highlighted content
			highlightClasses: "moon-highlight-text-highlighted"
		},
		//* @protected
		renderDelegate: HighlightTextDelegate,
		handlers: {
			onHighlight: "onHighlightHandler",
			onUnHighlight: "unHighlightHandler"
		},
		create: function() {
			this.inherited(arguments);
			this.highlightChanged();
		},
		//* @protected
		highlightChanged: function() {
			if (this.highlight) {
				if (this.highlight instanceof RegExp) {
					// Make sure the regex isn't empty
					this.search = ("".match(this.highlight)) ? null : this.highlight;
				} else {
					// Escape string for use in regex (standard regex escape from google)
					var escaped = this.highlight.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
					this.search = new RegExp(escaped, this.caseSensitive ? "g" : "ig");
				}
			} else {
				this.search = false;
			}
			if (this.hasNode()) {
				this.contentChanged();
			}
		},
		//* @protected
		caseSensitiveChanged: function () {
			this.highlightChanged();
		},
		//* @protected
		onHighlightHandler: function(inSender, inEvent) {
			this.setHighlight(inEvent.highlight);
			return true;
		},
		//* @protected
		unHighlightHandler: function(inSender, inEvent) {
			this.setHighlight(false);
			return true;
		}
	});
})(enyo, this);