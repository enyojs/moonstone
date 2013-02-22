/**
    _moon.ImageItem_ uses _moon.LabeledTextItem_ to add a image to the left or right (configurable)
*/

enyo.kind({
    name: "moon.ImageItem",
    classes: "moon-imageitem",
    components:[
        {name: 'image', kind: 'enyo.Image'},
        {name: 'textItem', kind: 'moon.LabeledTextItem'}
    ],
    published: {
        //* Sets the absolute URL path to the image
        source: '',
        //* Sets the label to be displayed along with the text
        label: '',
        //* Sets the text to be displayed in the item
        text: '',
        //* Set to true to align image to right
        imageAlignRight: false
    },
    create: function() {
        this.inherited(arguments);
        this.sourceChanged();
        this.labelChanged();
        this.textChanged();
        this.imageAlignRightChanged();
    },
    //* @protected
    sourceChanged: function() {
        if (!this.source || this.source == '') {
            return;
        }
        this.$.image.setAttribute('src', this.source);
    },
    //* @protected
    labelChanged: function() {
        this.$.textItem.setLabel(this.label);
    },
    //* @protected
    textChanged: function() {
        this.$.textItem.setText(this.text);
    },
    //* @protected
    imageAlignRightChanged: function() {
        this.addRemoveClass('align-right', this.imageAlignRight);
    }
});