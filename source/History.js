(function (enyo, scope) {
	/**
	* {@link moon.History} is a decorator that eables back key feature..
	* When the object get back key input like pressing back key in R/C
	* or history.back() with window.history object, it calls back key handler.
	*
	*
	*/
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
		* If pushstate() is called during popstate is in progress,
		* we pushed it into this queue.
		*
		* @private
		*/
		_pushBackQueue: [],

		/**
		* Flag for popstate event is bubbling
		*
		* @private
		*/
		_isPopStateInProgress: false,

		/**
		* If "disableBackHistoryAPI" in AppInfo.json is set to true, this property
		* should be false
		*
		* @type {Bollean}
		* @default true
		* @public
		*/
		enableBackHistoryAPI: true,

		published: {
			/**
			* Flag for back key handler progress
			*
			* @public
			*/
			isBackInProgress: false
		},

		events: {
			onPopBackHistory:  ''
		},

		handlers: {
			onPopBackHistory: 'popBackHistory'
		},

		/**
		* @private
		*/
		components: [
			{kind: 'enyo.Signals', onkeyup:'backKeyHandler'}
		],

		/**
		* @private
		*/
		lunaServiceComponents: [
			{
				name:       'getAppID',
				kind:       'enyo.LunaService',
				service:    'palm://com.webos.applicationManager/',
				method:     'getForegroundAppInfo',
				subscribe:  true,
				onComplete: 'getAppIDHandler'
			},
			{
				name:       'getAppInfo',
				kind:       'enyo.LunaService',
				service:    'luna://com.webos.applicationManager/',
				method:     'getAppInfo',
				subscribe: true,
				onComplete: 'getAppInfoHandler'
			}
		],

		/**
		* @private
		*/
		create: enyo.inherit(function(sup) {
			return function(props) {
				sup.apply(this, arguments);
				scope.onpopstate = enyo.bind(this, function(inEvent) {this.popStateHandler();});
				if (enyo.LunaService) {
					this.createChrome(this.lunaServiceComponents);
					this.getAppID();
				}
			};
		}),

		/**
		* @private
		*/
		getAppID: function () {
			if(scope.PalmSystem) {
				var param = {'extraInfo': true};
				this.$.getAppID.send(param);
			}
		},

		/**
		* @private
		*/
		getAppIDHandler: function (inSender, inResponse) {
			if(inResponse.foregroundAppInfo != null && inResponse.foregroundAppInfo !== undefined) {
				var foregroundAppInfo = inResponse.foregroundAppInfo;
				var appID = '';
				for(var i=0; i<foregroundAppInfo.length; i++) {
					if(foregroundAppInfo[i].appId !== undefined && foregroundAppInfo[i].windowType === '_WEBOS_WINDOW_TYPE_CARD') {
						this.appID = foregroundAppInfo[i].appId;
						break;
					}
				}
				if(appID !== ''){
					this.getAppInfo(appID);
				}
			}
		},

		/**
		* @private
		*/
		getAppInfo: function (appID) {
			if(scope.PalmSystem) {
				var param = {};
				param.id = appID;
				this.$.getAppInfo.send(param);
			}
		},

		/**
		* @private
		*/
		getAppInfoHandler: function (inSender, inResponse) {
			if(inResponse.appInfo !== undefined) {
				this.enableBackHistoryAPI = !inResponse.appInfo.disableBackHistoryAPI;
			}
		},

		/**
		* @public
		*/
		getCurrentObj: function() {
			return this._currentObj;
		},

		/**
		* Set target object and handler of back key
		*
		* @param {Object} ctx - current object for back key
		* @param {function} fn - handler of back key
		* @private
		*/
		_pushBackHistory: function(ctx, fn) {
			if (this.enableBackHistoryAPI) {
				history.pushState({currentObjId: ctx.id}, '', '');
			}
			this._backHistoryStack.push({currentObj: ctx, handler: fn});
			this._currentObj = ctx;
			this._handler = fn;
		},

		/**
		* Store back key request to history.
		* If popstate is in progress, it delays until former work is done
		*
		* @param {Object} ctx - current object for back key
		* @param {function} fn - handler of back key
		* @public
		*/
		pushBackHistory: function(ctx, fn) {
			if (this._isPopStateInProgress) {
				this._pushBackQueue.push({currentObj: ctx, handler: fn});
			} else {
				this._pushBackHistory(ctx, fn);
			}
		},

		/**
		* When we press back key of R/C, window.history should be back 1 step.
		* With synchronizing window.history and _backHistoryStack
		* we do not want to run back key handler.
		*
		* @public
		*/
		ignorePopState: function() {
			if (this.enableBackHistoryAPI) {
				this._ignorePopState = true;
				this._isPopStateInProgress = true;
				history.go(-1);
			}
		},

		/**
		* @private
		*/
		callBackKeyHandler: function() {
			this.isBackInProgress = true;
			if (this._currentObj && this._handler) {
				var fn = this._handler;
				if (typeof fn == 'function') {
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

			this.isBackInProgress = false;
		},

		/**
		* Dequeue _pushBackQueue
		*
		* @privae
		*/
		_dePushBackQueue: function() {
			var queue = this._pushBackQueue,
				length = queue.length,
				item;
			for (var i = 0; i < length; i++) {
				item = queue.pop();
				this._pushBackHistory(item.currentObj, item.handler);
			}
		},

		/**
		* Decide whether this popstate event should call handler or shouldn't.
		*
		* @public
		*/
		popStateHandler: function() {
			this._isPopStateInProgress = false;
			// Todo: We cannot prevent popstate event triggerd from history.go() or history.forward()
			// If user call those event directly, moonstone controls may have unexpected behavior.
			var state = !this._currentObj ? "empty"
						: (this._ignorePopState || scope.ignoreFirstPopupEvent) ? "silence"
						: !this._currentObj.getShowing() ? "invisible"
						: "active";

			switch (state) {
			case 'empty':
				break;
			case 'silence':
			//Popstate event should be ignored on following 2 conditions.
			//1. When App is loaded, onpopstate event fired with null state.
			//2. history.go(-1) triggers onpopstate event but it should be ignored.
				scope.ignoreFirstPopupEvent = false;
				this._ignorePopState = false;
				this.doPopBackHistory();
				break;
			case 'invisible':
			//Current back key target is on history and have handler too.
			//However it is invisible.
			//At this point, we should skip calling back key hanlder and restore history.
				history.pushState({currentObjId: this._backHistoryStack[this._backHistoryStack.length - 1].currentObj.id}, '', '');
				break;
			case 'active':
				this.callBackKeyHandler();
				this.doPopBackHistory();
				break;
			}

			this._dePushBackQueue();
			return;
		},

		/**
		* @private
		*/
		backKeyHandler: function (inSender, inEvent) {
			switch (inEvent.keySymbol) {
			case 'back':
				if (this._currentObj && this._currentObj.getShowing()) {
					this.callBackKeyHandler();
					this.ignorePopState();
				}
				break;
			}
			return true;
		}
	});
})(enyo, this);