(function (enyo, scope) {

	moon.TextOverlaySupport = {

	name: 'moon.TextOverlay',

	/**
	* @private
	*/
	_textTag: undefined,
	_textClass: 'moon-text-overlay-upperText',

	published: {

		/**
		* upper text in scrim
		*
		* @name moon.TextOverlaySupport#overlayText
		* @type {String}
		* @default ''
		* @public
		*/
		overlayText: '',

		/**
		* bottom text in scrim
		*
		* @name moon.TextOverlaySupport#overlaySubText
		* @type {String}
		* @default ''
		* @public
		*/
		overlaySubText: '',

		/**
		* When `true`, the overlay scrim will be shown
		*
		* @name moon.TextOverlaySupport#showScrim
		* @type {Boolean}
		* @default ''
		* @public
		*/

		showScrim: ''
	},

	/**
	* @private
	*/
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			
			//to handle upperText is marquee or not
			this.useOverlayTextMarqueeChanged();	

			this.createComponent({name:'textScrim', classes: 'enyo-fit moon-text-overlay-support-scrim', components: [
				{name:'overlayTextContainer', classes: 'enyo-fit moon-text-overlay-support-scrim-center', components: [
					{name:'overlayText', kind: this._textTag,  classes: this._textClass},
					{name:'overlaySubText', classes:'moon-text-overlay-bottomText'}]
				}
			]});

			//to handle not marquee case
			//apply '-webkit-line-clamp' with this.overlayTextLineNum user provids
			if(this._textTag === undefined){
				this.$.overlayText.addClass('moon-text-overlay-upperText-length'+this.overlayTextLineNum);
			}
			////to handle spotlightOverlayText
			this.addRemoveClass('moon-text-overlay-support', this.useSpotlightOverlayText);
			
		};
	}),
	
	useOverlayTextMarqueeChanged: function(){
		//to handle upperText is marquee or not
		this._textTag = this.useOverlayTextMarquee ? 'moon.MarqueeText' : undefined;
		this._textClass = this.useOverlayTextMarquee ?  undefined : 'moon-text-overlay-upperText';
	},

	overlayTextChanged: function () {
			this.$.overlayText.setContent( this.overlayText );
	},

	overlaySubTextChanged: function () {
			this.$.overlaySubText.setContent( this.overlaySubText );
	},

	showScrimChanged: function () {	
		//only if this.useSpotlightOverlayText is false
		if(this.useSpotlightOverlayText===false){
			this.$.textScrim.applyStyle('visibility', this.showScrim ? 'visible' : 'hidden');
		}
	}
};
})(enyo, this);