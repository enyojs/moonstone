require('moonstone');

var
	kind = require('enyo/kind'),
	Control = require('enyo/Control');

var
	Marquee = require('moonstone/Marquee'),
	MarqueeText = Marquee.Text;

module.exports = {

	name: 'moon.TextOverlay',

	/**
	* When `true`, the overlay scrim will be marquee
	*
	* @name moon.TextOverlaySupport#useoverlaytextmarquee
	* @type {Boolean}
	* @default undefinded
	* @public
	*/
	useoverlaytextmarquee: undefined,

	/**
	* When 1, 2, or 3, the overlay text line number can be set
	*
	* @name moon.TextOverlaySupport#overlaytextLineNum
	* @type {Number}
	* @default undefinded
	* @public
	*/
	overlaytextLineNum: undefined,

	/**
	* upper text in scrim
	*
	* @name moon.TextOverlaySupport#overlayText
	* @type {String}
	* @default ''
	* @public
	*/
	overLayText: '',

	/**
	* bottom text in scrim
	*
	* @name moon.TextOverlaySupport#overlaySubText
	* @type {String}
	* @default ''
	* @public
	*/
	overLaySubText: '',

	/**
	* When `true`, the overlay scrim will be shown
	*
	* @name moon.TextOverlaySupport#showScrim
	* @type {Boolean}
	* @default undefinded
	* @public
	*/
	showScrim: undefined,

	/**
	* When `true`, the overlay scrim will be shown only when hover 
	*
	* @name moon.TextOverlaySupport#useSpotLightOverlayText
	* @type {Boolean}
	* @default undefinded
	* @public
	*/
	useSpotLightOverlayText: undefined,

	create: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.useoverlaytextmarqueeChanged();	
			this.overlaytextLineNumChanged();
			this.overLayTextChanged();
			this.overLaySubTextChanged();
			this.showScrimChanged();
			this.useSpotLightOverlayTextChanged();		
		};
	}),
	
	useoverlaytextmarqueeChanged: function(){
		//initial creation
		if(this.$.textScrim===undefined){
		this.createComponent({name:'textScrim', classes: 'enyo-fit moon-text-overlay-support-scrim',  kind: Control, components: [
				{name:'overLayTextContainer', classes: 'enyo-fit moon-text-overlay-support-scrim-center',  kind: Control, components: [
					{name:'overLayText', kind: this.useoverlaytextmarquee ? MarqueeText : Control,  classes: this.useoverlaytextmarquee ?  undefined : 'moon-text-overlay-upperText'},
					{name:'overLaySubText', classes:'moon-text-overlay-bottomText', kind: Control}]
				}
		]}, {owner: this});
		}
		//to deal with runtime change
		else{
			this.$.overLayText.destroy();
			this.$.overLayTextContainer.createComponent({name:'overLayText', kind: this.useoverlaytextmarquee ? MarqueeText : Control,  classes: this.useoverlaytextmarquee ?  undefined : 'moon-text-overlay-upperText', addBefore: null}, {owner: this});
			this.overLayTextChanged();
			this.$.overLayText.render();
			
		}

	},
	overlaytextLineNumChanged: function(){
		this.useoverlaytextmarquee !== true && this.$.overLayText.applyStyle('-webkit-line-clamp', this.overlaytextLineNum);
	},
	overLayTextChanged: function () {
		this.$.overLayText.setContent( this.overLayText );
	},

	overLaySubTextChanged: function () {
		this.$.overLaySubText.setContent( this.overLaySubText );
	},
	showScrimChanged: function () {
		this.useSpotLightOverlayText !== true && this.$.textScrim.applyStyle('visibility', this.showScrim ? 'visible' : 'hidden');
	},
	useSpotLightOverlayTextChanged: function () {	
		this.addRemoveClass('moon-text-overlay-support', this.useSpotLightOverlayText);
	}
};
