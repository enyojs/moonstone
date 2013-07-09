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

    Not only can highlight directly using highlightOver highlightBlur function but also
    published variable for highlight.
*/
enyo.kind({
    name: "moon.HighlightText",
    published: {
        content: "",
        highlight: "",
        highlightClasses: "moon-highlight-text-highlighted"
    },
    handlers: {
        onHighlight: "onHighlightHandler",
        offHighlight: "offHighlightHandler"
    },
    //* @protected
    create: function() {
        this.inherited(arguments);
        this._content = this.content;
    },
    setContent: function(inValue) {
        this.inherited(arguments);
        this._content = inValue;
    },
    _setContent: function(inValue) {
        this.content = inValue;
        this.contentChanged();
    },
    getContent:function() {
        return this._content;   
    },
    highlightChanged: function(inValue) {
        if(inValue==="") {
            this.highlightBlur();
        } else {
            this.highlightOver(inValue);
        }
    },
    onHighlightHandler: function(inSender, inEvent) {
        this.highlightOver(inEvent.highlight);
        return true;
    },
    offHighlightHandler: function(inSender, inEvent) {
        this.highlightBlur();
        return true;
    },
    //* @public
    highlightOver: function(inText) {
        this.allowHtml = true;
        var output = "",
            hlt = inText,
            ort = this.getContent(),
            sIdx = 0,
            eIdx = ort.length
        ;
        while(sIdx !== -1) {
            sIdx = ort.search(hlt);           
            if(sIdx !== -1) {
                output += ort.slice(0, sIdx) + "<span class=" + this.highlightClasses + ">";
                output += ort.slice(sIdx, sIdx+hlt.length) + "</span>";
                sIdx = sIdx+hlt.length;
                ort = ort.slice(sIdx, eIdx);
            }
        }
        output += ort;
        this._setContent(output);
    },
    highlightBlur: function() {
        this.allowHtml = false;
        this.setContent(this._content);
        this.render();
    }
});