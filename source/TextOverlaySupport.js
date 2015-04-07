(function (enyo, scope) {

	moon.TextOverlaySupport = {

	name: 'moon.TextOverlay',

	create: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				//for marquee mode, create components w/ moon.MarqueeText kind
				if(this.useoverlaytextmarquee===true){
					this.createChrome(this._textMarqueeScrim);

				}
				//for not marquee mode, create just div
				else if(this.useoverlaytextmarquee===false){
					this.createChrome(this._textScrim);
				}
				//for handling, one-line / two-line / three-line requirement
				if(this.$.overLayText){
					this.$.overLayText.addClass('moon-text-overlay-support-line'+this.overlaytextLineNum);
				}
			};
		}),

	bindings: [
		{from: 'model.url', to: 'source'},
		{from: 'model.text', to: '$.overLayText.content'},
		{from: 'model.text', to: '$.overLayMarqueeText.content'},
		{from: 'model.id', to: '$.overLaySubText.content'}
	],

	_textScrim: [
		{name:'textScrim', classes: 'enyo-fit moon-text-overlay-support-scrim', components: [
				{name:'overLayTextContainer', classes: 'enyo-fit moon-text-overlay-support-scrim-center', components: [
					{name:'overLayText', classes:'moon-text-overlay-upperText'},
					{name:'overLaySubText', classes:'moon-text-overlay-bottomText'}]
				}	
			]}	
		],

		_textMarqueeScrim: [
		{name:'textMarqueeScrim', classes: 'enyo-fit moon-text-overlay-support-scrim', components: [
				{name:'overLayTextContainer', classes: 'enyo-fit moon-text-overlay-support-scrim-center', components: [
					{name:'overLayMarqueeText', kind: "moon.MarqueeText", classes:'moon-text-overlay-marquee'},
					{name:'overLaySubText', classes:'moon-text-overlay-bottomText'}]
				}	
			]}	
		]
};
})(enyo, this);