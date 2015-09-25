require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/InputHeader~InputHeader} kind.
* @module moonstone/InputHeader
* @deprecated
*/

var
	kind = require('enyo/kind');

var
	Header = require('./Header');

/**
* {@link module:moonstone/InputHeader~InputHeader} is a header that uses an input for the title. While this
* was initially created as an independent subkind of {@link module:moonstone/Header~Header}, its unique
* functionality has since been folded back into the latter kind, making the current
* incarnation of `InputHeader` simply a `Header` whose
* [inputMode]{@link module:moonstone/Header~Header#inputMode} is set to `true`. This kind
* is now deprecated.
*
* The [title]{@link module:moonstone/Header~Header#title} property is used as the input placeholder,
* while the [value]{@link module:moonstone/Header~Header#value} property contains the contents of the
* input. Developers may listen for
* [onInputHeaderInput]{@link module:moonstone/Header~Header#onInputHeaderInput} and
* [onInputHeaderChange]{@link module:moonstone/Header~Header#onInputHeaderChange} events from the
* embedded input to respond to changes.
*
* ```
* var InputHeader = require('moonstone/InputHeader'),
*     IconButton = require('moonstone/IconButton');
* ...
* {
* 	kind: InputHeader,
* 	title: 'Input Header',
* 	titleAbove: '02',
* 	titleBelow: 'Sub Header',
* 	subTitleBelow: 'Sub-sub Header',
* 	components: [
* 		{kind: IconButton, src: 'assets/icon-like.png'},
* 		{kind: IconButton, src: 'assets/icon-next.png'}
* 	]
* }
* ```
*
* @class InputHeader
* @extends module:moonstone/Header~Header
* @ui
* @public
* @deprecated
*/
module.exports = kind(
	/** @lends module:moonstone/InputHeader~InputHeader.prototype */ {

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
	inputMode: true
});
