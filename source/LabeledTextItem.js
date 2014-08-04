(function (enyo, scope) {
	/**
    * _moon.LabeledTextItem_, which extends {@link moon.Item}, is a [control]{@link enyo.Control}
    * that combines text content with a text label.
    *
    * @ui
    * @class moon.LabeledTextItem
    * @extends moon.Item
    * @public
    */
	enyo.kind(
		/** @lends moon.LabeledTextItem.prototype */ {

		/**
		* @private
		*/
		name: 'moon.LabeledTextItem',

		/**
		* @private
		*/
		kind: 'moon.Item',
		
		/**
		* @private
		*/
		classes: 'moon-labeledtextitem',

		/**
		* @private
		*/
		components:[
			{name: 'label', classes: 'moon-sub-header-text label'},
			{name: 'text', classes: 'moon-body-text text'}
		],

		/**
		* @private
		*/
		create: function() {
			this.inherited(arguments);
			this.labelChanged();
			this.textChanged();
		},
		
		/**
		* @private
		*/
		published: 
			/** @lends moon.LabeledTextItem.prototype */ {

			/** 
			* The label to be displayed along with the text.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			label: '',
			
			/** 
			* The text to be displayed in the item.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			text: ''
		},
		
		/**
		* @private
		*/
		bindings: [
			{from: '.allowHtml', to: '.$.label.allowHtml'},
			{from: '.allowHtml', to: '.$.text.allowHtml'}
		],

		/**
		* @private
		*/
		labelChanged: function() {
			this.$.label.setContent(this.label);
		},
		
		/**
		* @private
		*/
		textChanged: function() {
			this.$.text.setContent(this.text);
		}
	});

})(enyo, this);
