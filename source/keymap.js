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
	/**
	* Target object of back key.
	* It is also the last object which history.pushState() is executed.
	* When we press back key or call history.back(), it is target object.
	*
	* @private
	*/
	_currentObj: undefined,

	/**
	* Stack of Back key target.
	* This property is a plan B when history API is not allowed,
	*
	* @private
	*/
	_backKeyStack: [],

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
	* @public
	*/
	getCurrentObj: function() {
		return this._currentObj;
	},

	/**
	* Register event listener for popstate event
	* and decide whether ctx should run backKeyHandler or not
	*
	* @param {Object} ctx - function context
	* @param {function} fn - handler of back key
	* @public
	*/
	popStateHandler: function(ctx, fn) {
		if (typeof fn == "function") {
			fn = fn.bind(ctx);
		}
		// Todo: We cannot prevent popstate event triggerd from history.go() or history.forward()
		// If user call those event directly, moonstone controls may have unexpected behavior.
		window.addEventListener('popstate', enyo.bindSafely(this, function(inEvent) {
			var currentObj = this._currentObj;
			if ((!history.state && !currentObj) || currentObj != ctx.id) {
				return;
			}

			// if we press back key of remote controller, return
			if (this._ignorePopState) {
				this._ignorePopState = false;
				this._currentObj = history.state? history.state.currentObj : undefined;
				return;
			}

			fn();
		}));
	},

	/**
	* Set target object of back key
	*
	* @param {Object} id - current object id for back key
	* @param {boolean} disableBackHistoryAPI - if it is true, we do not allow to use window.history
	* @public
	*/
	setCurrentObj: function(id, disableBackHistoryAPI) {
		if (disableBackHistoryAPI) {
			this._backKeyStack.push(id);
		} else {
			history.pushState({currentObj: id}, "", "");
		}
		this._currentObj = id;
	},

	/**
	* After execute back key handler, set next target object.
	*
	* @param {boolean} disableBackHistoryAPI - if it is true, we do not allow to use window.history
	* @public
	*/
	finishBackKeyHandler: function(disableBackHistoryAPI) {
		if (disableBackHistoryAPI) {
			this._backKeyStack.pop();
			this._currentObj = this._backKeyStack[this._backKeyStack.length - 1];
		} else {
		//popstate handler could not be executed until this method is finished
		//so we should keep this._ignorePopState true until we handle popstate event
		//this._currentObj can be updated in popstate event handler
			this._ignorePopState = true;
			history.go(-1);
		}
	}
});