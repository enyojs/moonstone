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

	enyo.singleton({
		name: 'moon.History',
		/**
		* Target object of back key.
		* It is also the last object which history.pushState() is executed.
		* When we press back key or call history.back(), it is target object.
		*
		* @private
		*/
		_currentObj: null,

		/**
		* Stack of Back key target and handler
		*
		* @private
		*/
		_backHistoryStack: [],

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
		* If "disableBackHistoryAPI" in AppInfo.json is set to true, this property
		* should be true
		* It should be binded with AppInfo.json. Will be replaced using enyo.LunaService
		*
		* @type {Bollean}
		* @default false
		* @public
		*/
		disableBackHistoryAPI: false,

		/**
		* @private
		*/
		components: [
			{kind: "enyo.Signals", onkeyup:'backKeyHandler'}
		],

		/**
		* @private
		*/
		create: enyo.inherit(function(sup) {
			return function(props) {
				sup.apply(this, arguments);
				window.onpopstate = enyo.bind(this, function(inEvent) {this.popStateHandler();});
			};
		}),

		/**
		* @public
		*/
		getCurrentObj: function() {
			return this._currentObj;
		},

		/**
		* Set target object of back key
		*
		* @param {Object} ctx - current object for back key
		* @param {function} fn - handler of back key
		* @public
		*/
		pushBackHistory: function(ctx, fn) {
			if (!this.disableBackHistoryAPI) {
				history.pushState({currentObjId: ctx.id}, "", "");
			}
			this._backHistoryStack.push({currentObj: ctx, handler: fn});
			this._currentObj = ctx;
			this._handler = fn;
		},

		/**
		* When we press back key of R/C, window.history should be back 1 step.
		* With synchronizing window.history and _backHistoryStack
		* we do not want to run back key handler.
		*
		* @public
		*/
		ignorePopState: function() {
			if (!this.disableBackHistoryAPI) {
				this._ignorePopState = true;
				history.go(-1);
			}
		},

		/**
		* @private
		*/
		callBackKeyHandler: function() {
			if (this._currentObj && this._handler) {
				var fn = this._handler;
				if (typeof fn == "function") {
					fn = fn.bind(this._currentObj);
				}
				fn();
			}
		},

		/**
		* @private
		*/
		popBackHistory: function() {
			var bStack = this._backHistoryStack;
			bStack.pop();
			if (bStack.length) {
				this._currentObj = bStack[bStack.length - 1].currentObj;
				this._handler = bStack[bStack.length - 1].handler;
			} else {
				this._currentObj = this._handler = null;
			}
		},

		/**
		* Decide whether this popstate event calls backKeyHandler or doesn't.
		*
		* @public
		*/
		popStateHandler: function() {
			// Todo: We cannot prevent popstate event triggerd from history.go() or history.forward()
			// If user call those event directly, moonstone controls may have unexpected behavior.
			if (!this._currentObj) {
				return;
			}

			if (!this._currentObj.getShowing()) {
				//restore history
				history.pushState({currentObjId: this._backHistoryStack[this._backHistoryStack.length - 1].currentObj.id}, "", "");
				return;
			}

			//Popstate event should be ignored on following 2 conditions.
			//1. When App is loaded, onpopstate event fired with null state.
			//2. history.go(-1) triggers onpopstate event but it should be ignored.
			if (this._ignorePopState || window.ignoreFirstPopupEvent) {
				window.ignoreFirstPopupEvent = false;
				this._ignorePopState = false;
				return;
			}

			this.callBackKeyHandler();
			this.popBackHistory();
		},

		/**
		* @private
		*/
		backKeyHandler: function (inSender, inEvent) {
			switch (inEvent.keySymbol) {
			case 'b':
				if (this._currentObj && this._currentObj.getShowing()) {
					this.callBackKeyHandler();
					this.ignorePopState();
					this.popBackHistory();
				}
				break;
			}
			return true;
		}
	});
})(enyo, this);