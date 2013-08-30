/**
    _moon.ExpandableText is a control that displaying more or less text inline.

    {
        kind: "moon.ExpandableText",
        collapsed: true,
        maxLines: 3,
        content: "At the heart of Enyo is a simple but powerful encapsulation model, which helps you factor application functionality into self-contained building blocks that are easy to reuse and maintain."
    }

    the _onChange_ event is fired when the button(more/less) is tapped.

*/
enyo.kind({
    name: "moon.ExpandableText",
    classes: "moon-expandable-text",
    published: {
        //* When true, content is collapsed
        collapsed: true,
        //* Max line number to show content when it is collapsed.
        maxLines: 3,
        //* Button text when content is collapsed
        moreContent: $L("more"),
        //* Button text when content is not collapsed
        lessContent: $L("less")
    },
    events: {
        onChange: ""
    },
    components:[
        {name: "content", classes: "moon-body-text moon-expandable-text-content"},
        {name: "moreLessButton", kind: "moon.Button", small: true, classes: "moon-expandable-text-button", ontap: "buttonTapped"}
    ],
    _lineHeight: "31",

    //*@protected
    initComponents: function() {
        this.inherited(arguments);
        this._updateLineHeight();
    },
    rendered: function() {
        this.inherited(arguments);
        this._updateButtonVisibility();
        this.updateCollapsed();
        this.isRendered = true;
    },
    contentChanged: function() {
        this.$.content.setContent(this.content);
        this._updateButtonVisibility();
    },
    collapsedChanged: function() {
        this.updateCollapsed(this.collapsed);
        this.updateButtonContent();
        this.doChange({collapsed: this.collapsed});
    },
    maxLinesChanged: function() {
        this._updateButtonVisibility();
    },
    moreContentChanged: function() {
        this.updateButtonContent();
    },
    lessContentChanged: function() {
        this.updateButtonContent();
    },
    buttonTapped: function() {
        this.setCollapsed(!this.collapsed);
    },
    updateButtonContent: function() {
        this.$.moreLessButton.setContent((this.collapsed) ? this.moreContent : this.lessContent);
    },
    updateCollapsed: function() {
        if(this.collapsed) {
            this.$.content.applyStyle("-webkit-line-clamp", this.maxLines);
            this.addClass('collapse', this.collapsed);
        } else {
            this.$.content.applyStyle("-webkit-line-clamp", null);
            this.removeClass('collapse');
        } 
    },
    _updateLineHeight: function() {
        this.$.content.applyStyle("line-Height", this._lineHeight + "px");  
    },
    _updateButtonVisibility: function() {
        if(this.$.content.hasNode()) {
            if(this.isRendered) {
                this.setCollapsed(false);
            }
            this.$.moreLessButton.addRemoveClass("hidden", !(this._getContentHeight() > this._calMaxHeight()));
            this.updateButtonContent();
        }
    },
    _calMaxHeight: function() {
        return this.maxLines * this._lineHeight;
    },
    _getContentHeight: function() {
        return this.$.content.hasNode().getBoundingClientRect().height;
    }
});
