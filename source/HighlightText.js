/** 
	_moon.HighlightText_ is a control that displays highlighted text. In response
	to an `onHighlight` event, it will highlight a specified string if that string
	is found within the control's content.

	For example, let's say we have the following control:
	
		{kind: "moon.HighlightText", name: "myHT", content: "Hello World!"}

	In response to the event

		this.waterfall("onHighlight", {highlight: "Hello"}); 

	the word "Hello" will be highlighted.

	The highlighting will be turned off in response to an `offHighlight` event,
	e.g.:

		this.waterfall("offHighlight");
*/
enyo.kind({
    name: "moon.HighlightText",
    published: {
        //* control's content.
        content: "",
        //* on _highlight_ _true_ Highlighting for content will be turned on.
        highlight: false,
        //* on _caseSensitive_ _true_ highlight the content with exect match of string.
        caseSensitive: false,
        /** Add _highlightClasses_ to the content when _highlight_ is _true_ 
            which will highlight the content with some predefined color.
        **/
        highlightClasses: "moon-highlight-text-highlighted"
    },
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
            return this.content.replace(this.search, enyo.bind(this, function(s) {
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
                if (this.caseSensitive) {
                    this.search = this.highlight;
                } else {
                    // Escape string for use in regex (standard regex escape from google)
                    var escaped = this.highlight.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                    this.search = new RegExp(escaped, "ig");
                }
            }
        } else {
            this.search = false;
        }
        if (this.hasNode()) {
            this.contentChanged();
        }
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