/**
	_moon.ImageItem_, which derives from [moon.Item](#moon.Item), is a control
	that combines an [enyo.Image](#enyo.Image) with a
	[moon.LabeledTextItem](#moon.LabeledTextItem). By default, the image is
	displayed to the left of the text; to display the image on the right, set
	_imageAlignRight: true_.
*/

enyo.kind({
    name: "moon.ImageItem",
    classes: "moon-imageitem",
		//* @protected
    kind: "moon.Item",
    components:[
        {name: 'image', kind: 'enyo.Image'},
        {name: 'textItem', kind: 'moon.LabeledTextItem', spotlight: false}
    ],
    //* @public
    published: {
        //* The absolute URL path to the image
        source: '',
        //* The label to be displayed along with the text
        label: '',
        //* The text to be displayed in the item
        text: '',
        //* Set to true to align image to right of text
        imageAlignRight: false
    },
    //* @protected
    bindings: [
        {from: ".allowHtml", to: ".$.textItem.allowHtml"}
    ],
    create: function() {
        this.inherited(arguments);
        this.sourceChanged();
        this.labelChanged();
        this.textChanged();
        this.imageAlignRightChanged();
    },
    //* @protected
    sourceChanged: function() {
        if (!this.source || this.source === '') {
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