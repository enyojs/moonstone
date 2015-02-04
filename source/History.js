(function (enyo, scope) {

	/**
	* {@link moon.History} is a {@glossary mixin} that enables support for custom history. In its
	* current implementation, "back" actions are implemented, which allows for controls to override
	* and customize the behavior that occurs when the back key is pressed or the `window.history` is
	* utilized.
	*
	* @mixin moon.HistorySupport
	* @public
	*/

	/** @lends moon.HistorySupport.prototype */
	moon.HistorySupport = {

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
		*/
		pushBackHistory: enyo.inherit(function (sup) {
			// When you use a mixin, it will override existing properties and methods. If a control,
			// which uses `moon.HistorySupport`, has implemented the `pushBackHistory` method, the
			// method will be replaced with the following method. To ensure that the control's
			// implementation of `pushBackHistory` is executed, we allow it to run and subsequently
			// examine its return value.
			return function() {
				// check whether this control's `pushBackHistroy` method has effectively handled
				// the call, or whether it wants the inherited method to execute
				if (!sup.apply(this, arguments)) {
					moon.History.pushBackHistory(this, this.backKeyHandler);
				}
				return true;
			};
		}),

		/**
		* Handler for whenever a "back" action is triggered. The default behavior is to hide the
		* control if it is showing.
		*
		* Most controls will want to override this behavior. If the default behavior should not be
		* executed, ensure that the `backKeyHandler` method in the control signifies it has handled
		* the necessary behavior by returning `true`.
		*
		* @method
		* @public
		*/
		backKeyHandler: enyo.inherit(function (sup) {
			return function() {
				if (!sup.apply(this, arguments)) {
					if (this.showing) this.hide();
				}
				return true;
			};
		})
	};

	/**
	* The `moon.History` singleton provides an abstract way of handling historical state in an app,
	* working in tandem with the native window.history mechanism. The current implementation has
	* built-in support for handling "back" actions.
	*
	* @name moon.History
	* @public
	*/
	enyo.singleton({

		/**
		* @private
		*/
		name: 'moon.History',

		/**
		* The stack of "back" action targets and handlers.
		*
		* @private
		*/
		_backHistoryStack: [],

		/**
		* If pushstate() is called during popstate is in progress,
		* we pushed it into this queue.
		*
		* @private
		*/
		_pushBackQueue: [],

		/**
		* Represents whether or not we handle "back" actions with respect to history. If the value
		* of "disableBackHistoryAPI" in appinfo.json is set to `true`, this property will be set to
		* `false`.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		enableBackHistoryAPI: true,

		/**
		* @private
		*/
		components: [
			{kind: 'enyo.Signals',  onkeyup: 'remoteBackKeyHandler'}
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
				onComplete: '_getAppIDHandler'
			},
			{
				name:       'getAppInfo',
				kind:       'enyo.LunaService',
				service:    'luna://com.webos.applicationManager/',
				method:     'getAppInfo',
				subscribe:  true,
				onComplete: '_getAppInfoHandler'
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
					this._getAppID();
				}
			};
		}),

		/**
		* When our platform is "PalmSystem", we need the appID to access the proper appinfo.json.
		*
		* @private
		*/
		_getAppID: function () {
			if(scope.PalmSystem) {
				var param = {'extraInfo': true};
				this.$.getAppID.send(param);
			}
		},

		/**
		* After LunaService returns the appId, we can retrieve the necessary app information.
		*
		* @private
		*/
		_getAppIDHandler: function (inSender, inResponse) {
			if(inResponse.foregroundAppInfo != null && inResponse.foregroundAppInfo !== undefined) {
				var foregroundAppInfo = inResponse.foregroundAppInfo;
				var appID = '';
				for(var i=0; i<foregroundAppInfo.length; i++) {
					if(foregroundAppInfo[i].appId !== undefined && foregroundAppInfo[i].windowType === '_WEBOS_WINDOW_TYPE_CARD') {
						appID = foregroundAppInfo[i].appId;
						break;
					}
				}
				if(appID !== ''){
					this._getAppInfo(appID);
				}
			}
		},

		/**
		* Retrieve properties from appinfo.json.
		*
		* @private
		*/
		_getAppInfo: function (appID) {
			if(scope.PalmSystem) {
				var param = {};
				param.id = appID;
				this.$.getAppInfo.send(param);
			}
		},

		/**
		* Determine the appropriate value of `enableBackHistoryAPI` from the app information.
		*
		* @private
		*/
		_getAppInfoHandler: function (inSender, inResponse) {
			if(inResponse.appInfo !== undefined) {
				this.enableBackHistoryAPI = !inResponse.appInfo.disableBackHistoryAPI;
			}
		},

		/**
		* Retrieve the [control]{@link enyo.Control} for the current "back" action.
		*
		* @returns {Object} - The current control whose "back" actions we are handling.
		* @public
		*/
		getCurrentObj: function() {
			return this._currentObj;
		},

		/**
		* Sets the target object and handler for the current "back" action.
		*
		* @param {Object} ctx - The current control that the "back" action should be applied to.
		* @param {Function} fn - Handler for the "back" action.
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
		* Store the "back" action request to our history. If we are currently handling a `popstate`
		* event, we wait until the current event handling is complete.
		*
		* @param {Object} ctx - The current control that the "back" action should be applied to.
		* @param {function} fn - Handler for the "back" action.
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
		* When we press the "back" key, `window.history` should be back 1 step. In synchronizing
		* `window.history` and `_backHistoryStack`, we do not want to trigger the "back" key
		* handler.
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
		* If our current control has a custom "back" key handler, we execute this handler at the
		* appropriate time.
		*
		* @private
		*/
		_callBackKeyHandler: function() {
			this._handlingBackAction = true;
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
		_popBackHistory: function() {
			var bStack = this._backHistoryStack;
			bStack.pop();
			if (bStack.length) {
				this._currentObj = bStack[bStack.length - 1].currentObj;
				this._handler = bStack[bStack.length - 1].handler;
			} else {
				this._currentObj = this._handler = null;
			}

			this._handlingBackAction = false;
		},

		/**
		* Any calls to `pushstate()` are pushed into a queue when the `popstate` event is currently
		* being handled. After the event has been handled, we can dequeue `_pushBackQueue`.
		*
		* @private
		*/
		_dequeuePushBack: function() {
			var queue = this._pushBackQueue,
				length = queue.length,
				item;
			for (var i = 0; i < length; i++) {
				item = queue.pop();
				this._pushBackHistory(item.currentObj, item.handler);
			}
		},

		/**
		* There are 3 kinds of `popstate` event triggers: `history.back()`, `history.forward()`, and
		* `history.go()`. For our purposes, we only want {@link moon.History} to only handle
		* `history.back()` and ignore the other triggers.
		*
		* @public
		*/
		popStateHandler: function() {
			this._isPopStateInProgress = false;
			// TODO: We cannot prevent popstate event triggerd from history.go() or history.forward()
			// If user call those event directly, moonstone controls may have unexpected behavior.
			var state = !this._currentObj ? 'empty'
						: (this._ignorePopState || scope.ignoreFirstPopupEvent) ? 'silence'
						: !this._currentObj.getShowing() ? 'invisible'
						: 'active';

			switch (state) {
			case 'empty':
				break;
			case 'silence':
			//Popstate event should be ignored on following 2 conditions.
			//1. When App is loaded, onpopstate event fired with null state.
			//2. history.go(-1) triggers onpopstate event but it should be ignored.
				scope.ignoreFirstPopupEvent = false;
				this._ignorePopState = false;
				this._popBackHistory();
				break;
			case 'invisible':
			//Current back key target is on history and have handler too.
			//However it is invisible.
			//At this point, we should skip calling back key hanlder and restore history.
				history.pushState({currentObjId: this._backHistoryStack[this._backHistoryStack.length - 1].currentObj.id}, '', '');
				break;
			case 'active':
				this._callBackKeyHandler();
				this._popBackHistory();
				break;
			}

			this._dequeuePushBack();
			return;
		},

		/**
		* Determines whether or not we are currently handling a "back" action.
		*
		* @returns {Boolean} Is `true` if we are currently handling a "back" action, and `false`
		*	otherwise.
		* @public
		*/
		isHandlingBackAction: function () {
			return this._handlingBackAction;
		},

		/**
		* @private
		*/
		remoteBackKeyHandler: function (inSender, inEvent) {
			if (inEvent.keySymbol == 'back' && this._currentObj && this._currentObj.getShowing()) {
				this._callBackKeyHandler();
				this.ignorePopState();
			}
			return true;
		}
	});
})(enyo, this);