require('moonstone');

var
	Component = require('enyo/Component'),
	EnyoHistory = require('enyo/History'),
	kind = require('enyo/kind');

var
	Support = require('../HistorySupport');

/**
* The `History` singleton provides an abstract way of handling historical state in an app,
* working in tandem with the native window.history mechanism. The current implementation has
* built-in support for handling "back" actions.
*
* @module moonstone/History
* @public
* @deprecated History API moved into {@link module:enyo/History} and mixin into
* 	{@link module:moonstone/HistorySupport}
*/
var MoonHistory = module.exports = kind.singleton(
	/** @lends module:moonstone/History */ {

	/**
	* @private
	*/
	kind: Component,

	/**
	* Represents whether or not we handle "back" actions with respect to history. If the value
	* of "disableBackHistoryAPI" in appinfo.json is set to `true`, this property will be set to
	* `false`.
	*
	* @type {Boolean}
	* @default true
	* @public
	* @deprecated Replaced by {@link module:enyo/History#enabled}
	*/
	enableBackHistoryAPI: true,

	/**
	* @private
	*/
	enableBackHistoryAPIChanged: function () {
		EnyoHistory.set('updateHistory', this.enableBackHistoryAPI);
	},

	/**
	* Retrieve the [control]{@link module:enyo/Control~Control} for the current "back" action.
	*
	* @returns {Object} - The current control whose "back" actions we are handling.
	* @public
	* @deprecated Replaced by {@link module:enyo/History#peek}
	*/
	getCurrentObj: function () {
		var current = EnyoHistory.peek();
		return current && current.context;
	},

	/**
	* Determines whether or not we are currently handling a "back" action.
	*
	* @returns {Boolean} Is `true` if we are currently handling a "back" action, and `false`
	*	otherwise.
	* @public
	* @deprecated Replaced by {@link module:enyo/History#isProcessing}
	*/
	isHandlingBackAction: function () {
		return EnyoHistory.isProcessing();
	},

	/**
	* Pushes a default state to the back history, consisting of a reference to our handler for
	* any "back" actions.
	*
	* If the default `pushBackHistory` behavior is to be overridden, ensure that the control's
	* implementation of `pushBackHistory` signifies it has handled the necessary behavior by
	* returning `true`.
	*
	* @example
	* pushBackHistory: function() {
	*	// perform custom operations here
	*	return true;
	* }
	*
	* @method
	* @public
	* @deprecated Replaced by {@link module:enyo/History#push}
	*/
	pushBackHistory: function (ctx, fn) {
		EnyoHistory.push({context: ctx, handler: fn});
	},

	/**
	* When we press the "back" key, `window.history` should be back 1 step. In synchronizing
	* `window.history` and `_backHistoryStack`, we do not want to trigger the "back" key
	* handler.
	*
	* @public
	* @deprecated Replaced by {@link module:enyo/History#drop}
	*/
	ignorePopState: function () {
		EnyoHistory.drop();
	}
});


/**
* The {@link module:moonstone/HistorySupport~HistorySupport} mixin.
*/
MoonHistory.HistorySupport = Support;