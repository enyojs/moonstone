/**
	_moon.HighlightText_ is a control that displays highlighted text.  In response
	to calling `setHighlight` or receiving `onHighlight` event, it will highlight a
    specified string if that string is found within the control's content.

	For example, let's say we have the following control:

		{kind: "moon.HighlightText", name: "myHT", content: "Hello World!"}

	In response to the event

		this.waterfall("onHighlight", {highlight: "Hello"});

    or calling the API directly:

        this.$.myHT.setHighlight("Hello");

	the word "Hello" will be highlighted.

	The highlighting will be turned off in response to an `offHighlight` event,
	e.g.:

		this.waterfall("offHighlight");

    or by setting highlight to a falsy value:

        this.$.myHT.setHighlight("");

*/
enyo.kind({
    name: "moon.HighlightText",
    //* @public
    published: {
        //* String or RegExp indicating the text or pattern to highlight.  An empty string, falsy value, or empty RegExp
        //* will disable highlighting.
        highlight: "",
        //* When true, only case-sensitive matches of the highlight string will be highlighted.  This property
        //* is ignored if a RegExp is specified to the highlight property (you may use the "i" modifier to indicate
        //* case insensitive RegExp).
        caseSensitive: false,
        //* The default CSS class to apply to highlighted content.
        highlightClasses: "moon-highlight-text-highlighted"
    },
    //* @protected
    handlers: {
        onHighlight: "onHighlightHandler",
        onUnHighlight: "unHighlightHandler"
    },
    create: function() {
        this.inherited(arguments);
        this.highlightChanged();
    },
    //* @protected
    generateInnerHtml: function() {
        if (this.search) {
            return this.content.replace(this.search, this.bindSafely(function(s) {
                return "<span style='pointer-events:none;' class='" + this.highlightClasses + "'>" + enyo.Control.escapeHtml(s) + "</span>";
            }));
        } else {
            return enyo.Control.escapeHtml(this.get("content"));
        }
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