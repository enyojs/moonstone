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
    setContent:function(inValue) {
        this.inherited(arguments);
        this._content = inValue;
    },
    _setContent:function(inValue) {
        this.content = inValue;
        this.contentChanged();
    },
    getContent:function() {
        return this._content;   
    },
    onHighlightHandler: function(inSender, inEvent) {
        this.allowHtml = true;
        var output = "",
            hlt = inEvent.highlight,
            ort = this.getContent(),
            eIdx = ort.length,
            sIdx = 0
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
        
        return true;
    },
    offHighlightHandler: function(inSender, inEvent) {
        this.allowHtml = false;
        this.setContent(this._content);
        this.render();
        return true;
    }
});