(function (enyo, scope) {
	/**
	* Registers key mappings for webOS-specific device keys related to media control.
	*
	* @private
	*/
	if (enyo.platform.webos >= 4) {
		// Table of default keyCode mappings for webOS device
		enyo.dispatcher.registerKeyMap({
			415 : 'play',
			413 : 'stop',
			19  : 'pause',
			412 : 'rewind',
			417 : 'fastforward',
			461	: 'back'
		});
	}
	/**
		temporal code to testify in PC
		Todo: remove following block.
	*/
	enyo.dispatcher.registerKeyMap({
		66 : 'b'
	});

})(enyo, this);

enyo.singleton({
	name: 'moon.BackKeySupport',
	published: {
		/**
		* Last object which history.pushState() is executed.
		* When popstate event is fired, we can find what was target object
		* of back key.
		* @public
		*/
		currentObj: ""
	},
	/**
	* history.forward() and history.go() can fire popstate event
	* as does history.back().
	* However we should accept popstate event only came from history.back().
	* When it is true, we will skip popstate event.
	*
	* @private
	*/
	_ignorePopState: false,

	/**
	* @public
	*/
	getIgnorePopState: function() {
		return this._ignorePopState;
	},

	/**
	* @private
	*/
	pushStateToHistory: function(currentObj) {
		history.pushState({currentObj: currentObj}, "", "");
		this.currentObj = currentObj;
	},
	/**
	* @private
	*/
	popStateToHistory: function() {
		this._ignorePopState = true;
		history.go(-1);
		this.currentObj = history.state.currentObj;
		this._ignorePopState = false;
	}
});