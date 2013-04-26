/**
	_moon.ImageItem_, which derives from <a href="#moon.Item">moon.Item</a>, is a
	control that combines an <a href="#enyo.Image">enyo.Image</a>	with a
	<a href="#moon.LabeledTextItem">moon.LabeledTextItem</a>. By default,	the
	image is displayed to the left of the text; to display the image on the	right,
	set _imageAlignRight: true_.
*/

enyo.kind({
    name: "moon.ImageItem",
    classes: "moon-imageitem",
    kind: "moon.Item",
    components:[
        {name: 'image', kind: 'enyo.Image'},
        {name: 'textItem', kind: 'moon.LabeledTextItem', spotlight: false}
    ],
    published: {
        //* The absolute URL path to the image
        source: '',
        //* The label to be displayed along with the text
        label: '',
        //* The text to be displayed in the item
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