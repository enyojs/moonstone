/**
	_moon.LabeledTextItem_, which extends <a href="#moon.Item">moon.Item</a>, is a
	control that combines text content with a text label.
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
        //* The label to be displayed along with the text
        label: '',
        //* The text to be displayed in the item
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