/** 
	_moon.HighlightText_ is a control that displays an highlighted text. 
	Identified string or chracter in content can be highlighted by onHighlight event.
	if content don't have any identical string, there is no change in display. 

		{kind: "moon.HighlightText", content: "Hello World!"}

	Examples) 

	_moon.HighlightText_ get event like below, then the "Hello" is highlighted.
		this.waterfall("onHighlight", {highlight: "Hello"}); 

	_moon.HighlightText_ get event like below, then the highlighted text is disapeared.
		this.waterfall("offHighlight");

*/
enyo.kind({
    name: "moon.HighlightText",
    published: {
        content: "",
        highlight: false,
        caseSensitive: false,
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