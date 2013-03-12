/**
    _moon.LabeledTextItem_ 
*/

enyo.kind({
    name: "moon.LabeledTextItem",
    kind: "moon.Item", 
    classes: "moon-labeledtextitem",
    components:[
        {name: "label", classes: "label"},
        {name: "text", classes: "text"}
    ],
    create: function() {
        this.inherited(arguments);
        this.labelChanged();
        this.textChanged();
    },
    published: {
        //* Sets the label to be displayed along with the text
        label: '',
        //* Sets the text to be displayed in the item
        text: ''
    },
    //* @protected
    labelChanged: function() {
        this.$.label.setContent(this.label);
    },
    //* @protected
    textChanged: function() {
        this.$.text.setContent(this.text);
    }
});