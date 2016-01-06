require('moonstone');

/**
* Mixin that enables support for custom history.
*
* @module moonstone/HistorySupport
*/

var
	EnyoHistory = require('enyo/History'),
	kind = require('enyo/kind');

/**
* {@link module:moonstone/HistorySupport} is a {@glossary mixin} that enables
* support for custom history. In its current iteration, "back" actions are
* implemented, allowing controls to override and customize the behavior that
* occurs when the back key is pressed or the `window.history` is utilized.
*
* @mixin
* @public
*/
var HistorySupport = {

	/**
	* @private
	*/
	name: 'HistorySupport',

	/**
	* @private
	*/
	published: {

		/**
		* When `true`, pressing the back key will result in control-specific behavior that
		* corresponds to a "back" action.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		allowBackKey: true
	},

	/**
	* Pushes a default state to the back history, consisting of a reference to our
	* handler for any "back" actions.
	*
	* If the default `pushBackHistory()` behavior is to be overridden, make sure
	* that the control's implementation of `pushBackHistory()` signifies that it
	* has handled the necessary behavior by returning `true`, e.g.:
	*
	* ```javascript
	* 	pushBackHistory: function() {
	* 		// perform custom operations here
	* 		return true;
	* 	}
	* ```
	*
	* @method
	* @public
	*/
	pushBackHistory: kind.inherit(function (sup) {
		// When you use a mixin, it will override existing properties and methods. If a control
		// that uses `moonstone/HistorySupport` has implemented the `pushBackHistory()` method, the
		// method will be replaced with the following method. To ensure that the control's
		// implementation of `pushBackHistory()` is executed, we allow it to run and subsequently
		// examine its return value.
		return function () {
			// check whether this control's `pushBackHistroy` method has effectively handled
			// the call, or whether it wants the inherited method to execute
			if (!sup.apply(this, arguments)) {
				EnyoHistory.push({context: this, handler: this.backKeyHandler});
			}
			return true;
		};
	}),

	/**
	* Handler for whenever a "back" action is triggered. The default behavior is to hide the
	* control if it is showing.
	*
	* Most controls will want to override this behavior. If the default behavior should not be
	* executed, ensure that the `backKeyHandler()` method in the control signifies that it has
	* handled the necessary behavior by returning `true`.
	*
	* @method
	* @public
	*/
	backKeyHandler: kind.inherit(function (sup) {
		return function () {
			if (!sup.apply(this, arguments)) {
				if (this.showing) this.hide();
			}
			return true;
		};
	})
};

module.exports = HistorySupport;
