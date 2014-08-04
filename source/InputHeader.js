(function (enyo, scope) {
	/**
	* `moon.InputHeader` is a header that uses an input for the title. While this
	* was initially created as an independent subkind of [`moon.Header`]{@link moon.Header},
	* its unique functionality has since been folded back into the latter kind,
	* making the current {@link moon.InputHeader} simply a {@link moon.Header} for which
	* [`inputMode`]{@link moon.Header#inputMode} is set to `true`. We continue to offer
	* `moon.InputHeader` as a separate kind for reasons of convenience and backward compatibility.
	*
	* The [`title`]{@link moon.Header#title} property is used as the input placeholder, while the
	* [`value`]{@link moon.Header#value} property contains the contents of the input. Developers may
	* listen for [`onInputHeaderInput`]{@link moon.Header#event:onInputHeaderInput} and
	* [`onInputHeaderChange`]{@link moon.Header#event:onInputHeaderChange} events from the embedded
	* input to respond to changes.
	*
	* ```
	* {
	* 	kind: 'moon.InputHeader',
	* 	title: 'Input Header',
	* 	titleAbove: '02',
	* 	titleBelow: 'Sub Header',
	* 	subTitleBelow: 'Sub-sub Header',
	* 	components: [
	* 		{kind: 'moon.IconButton', src: 'assets/icon-like.png'},
	* 		{kind: 'moon.IconButton', src: 'assets/icon-next.png'}
	* 	]
	* }
	* ```
	*
	* @class moon.InputHeader
	* @extends moon.Header
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.InputHeader.prototype */ {

 		/**
 		* @private
 		*/
		name: 'moon.InputHeader',

 		/**
 		* @private
 		*/
		kind: 'moon.Header',

 		/**
 		* @private
 		*/
		classes: 'moon-input-header',

 		/**
 		* @private
 		*/
		inputMode: true
	});

})(enyo, this);
