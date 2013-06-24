/**
	_moon.InputHeader_ extends <a href="#moon.Header">moon.Header</a>
	using moon.Input instead of enyo.Control for a title.
*/
enyo.kind({
	//* @public
	name: "moon.InputHeader",
	kind: "moon.Header",
	published: {
		//* the maxium size of a input text
		maxLength: 14,
	},
	events: {
		/** 
			Fires when typing a text in a moon.Input for a title

			_inEvent.keyword_ contains the title of moon.InputHeader
			which is the text in a moon.Input
		*/
		"onSearch": ""
	},
	//* @protected
	classes: "moon-header moon-input-header",
	components: [
		{name: "titleAbove", classes: "moon-header-title-above"},
		{
			kind: "moon.InputDecorator",
			onSpotlightFocus: "spotlightFocus",
			classes: 'moon-input-header-input-decorator',
			components: [
				{
					name: "title",
					kind: "moon.Input",
					oninput: "inputChanged",
					placeholder: "Search",
					attributes: {maxlength: this.maxLength},
					classes: "moon-header-title"
				},
				{name:"overlay", classes:"moon-input-header-overlay"}
			]
		},
		{name: "titleBelow", kind: "moon.Item", spotlight: false, classes: "moon-header-title-below"},
		{name: "client", classes: "moon-header-client"},
		{name: "animator", kind: "StyleAnimator", onComplete: "animationComplete"}
	],
	
	//* @public

	//* If _this.title_ changed, the placeHolder value of a moon.Input will be updated
	titleChanged: function() {
		var placeHolder = this.title || this.content;
		if(placeHolder != "") {
			this.$.title.setPlaceholder(placeHolder);
		}
	},

	//* If _this.maxLengthChanged_ changed, check the length of a input text
	maxLengthChanged: function() {
		var text = this.$.title.value;
		var textLength = text.length;
		var textLengthMax = this.maxLength;

		if(textLength > textLengthMax) {			
			if (escape(text[textLengthMax - 1]).length > 4) {
				text = text.substring(0, textLengthMax - 1);
			} else {
				text = text.substring(0, textLengthMax);
			}
			this.$.title.setValue(text);
			this.$.overlay.setContent(text);
		}
	},
	
	//* If user type a text in moon.Input, "onSearch" evnet  will be fired.
	inputChanged: function() {
		var text = this.$.title.value;
		var textLength = 0;
		var textLengthPrev = text.length;
		var textLengthMax = this.maxLength;
		var oneChar = "";
		
		for(var i = 0; i < textLengthPrev; i++) {
			oneChar = text.charAt(i);
			if (escape(oneChar).length > 4) {
				textLength += 2;
			} else {
				textLength++;
			}
		}

		if(textLength <= textLengthMax) {
			// fire "onSearch" event
			this.$.overlay.setContent(this.$.title.getValue());

			this.doSearch({"keyword": this.$.title.getValue()});
		} else {
			// keep the previous text
			this.$.title.setValue(this.$.overlay.getContent());
		}
	},

	spotlightFocus: function() {
		this.$.title.focus();
	}
});
