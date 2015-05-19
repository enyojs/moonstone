require('moonstone');

/**
* Contains the declaration for the {@link moon.InputHeader} kind.
* @module moonstone/InputHeader
*/

var
	kind = require('enyo/kind');

var
	Header = require('../Header');

/**
* {@link moon.InputHeader} is a header that uses an input for the title. While this
* was initially created as an independent subkind of {@link moon.Header}, its unique
* functionality has since been folded back into the latter kind, making the current
* incarnation of `moon.InputHeader` simply a `moon.Header` whose
* [inputMode]{@link moon.Header#inputMode} is set to `true`. We continue to offer
* `moon.InputHeader` as a separate kind for reasons of convenience and backward
* compatibility.
*
* The [title]{@link moon.Header#title} property is used as the input placeholder,
* while the [value]{@link moon.Header#value} property contains the contents of the
* input. Developers may listen for
* [onInputHeaderInput]{@link moon.Header#onInputHeaderInput} and
* [onInputHeaderChange]{@link moon.Header#onInputHeaderChange} events from the
* embedded input to respond to changes.
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
* @namespace moon
* @class moon.InputHeader
* @extends moon.Header
* @ui
* @definedby module:moonstone/InputHeader
* @public
*/
module.exports = kind(
	/** @lends moon.InputHeader.prototype */ {

	/**
	* @private
	*/
	name: 'moon.InputHeader',

	/**
	* @private
	*/
	kind: Header,

	/**
	* @private
	*/
	classes: 'moon-input-header',

	/**
	* @private
	*/
	inputMode: true
});
