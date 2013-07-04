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
        content: ""
	},
	handlers: {
		onHighlight: "onHighlightHandler",
        offHighlight: "offHighlightHandler"
	},
	//* @protected
	create: function() {
		this.inherited(arguments);
        this._content = this.content;
        this.allowHtml = true;
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
		var hlt = inEvent.highlight;
		var ort  = this.getContent();
        var sIdx = ort.indexOf(hlt);
        if(sIdx !== -1) {
            var text = ort.slice(0, sIdx) + "<span class=\"moon-highlight-text-highlighted\">" + ort.slice(sIdx, sIdx+hlt.length) + "</span>" + ort.slice(sIdx+hlt.length, ort.length);
            this._setContent(text);
        }
        return true;
	},
    offHighlightHandler: function(inSender, inEvent) {
        this.setContent(this._content);
        this.render();
        return true;
    }
});