(function (enyo, scope) {
	/**
	* Fires when the contextual popup is to be shown.
	*
	* @event moon.ContextualPopup#onRequestShowPopup
	* @type {Object}
	* @property {Object} activator - A reference to the activating object.
	* @public
	*/
	
	/**
	* Fires when the contextual popup is to be hidden. No additional data is included
	* with this event.
	*
	* @event moon.ContextualPopup#onRequestHidePopup
	* @type {Object}
	* @public
	*/
	
	/**
	* Fires when the contextual popup is activated. Extends {@link enyo.Popup#event:onActivate}.
	*
	* @event moon.ContextualPopup#onActivate
	* @type {Object}
	* @property {Object} sentFromPopup - A reference to the popup.
	* @public
	*/
	
	/**
	* {@link moon.ContextualPopup} is a popup window control with Moonstone visual
	* styling applied. It extends {@link enyo.Popup} and is designed to be used with
	* {@link moon.ContextualPopupDecorator}.
	*
	* @class moon.ContextualPopup
	* @extends enyo.Popup
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.ContextualPopup.prototype */ {

		/**
		* @private
		*/
		name : 'moon.ContextualPopup',

		/**
		* @private
		*/
		kind : 'enyo.Popup',

		/**
		* @private
		*/
		layoutKind : 'ContextualLayout',

		/**
		* @private
		*/
		classes    : 'moon-body-text moon-contextual-popup',

		/**
		* @private
		*/
		handlers: {
			onRequestShowPopup        : 'requestShow',
			onRequestHidePopup        : 'requestHide',
			onActivate                : 'decorateActivateEvent',
			onRequestScrollIntoView   : '_preventEventBubble',
			onSpotlightContainerLeave : 'onLeave'
		},

		/**
		* @private
		*/
		eventsToCapture: {
			onSpotlightKeyDown: 'capturedKeyDown'
		},

		/**
		* @private
		* @lends moon.ContextualPopup.prototype
		*/
		published: {

			/**
			* If `true`, focus cannot leave the constraints of the popup unless the
			* popup is explicitly closed.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			spotlightModal: false,

			/**
			* If `false`, the close button is hidden; if `true`, it is shown. When this
			* property is set to `'auto'` (the default), the close button is shown when
			* [spotlightModal]{@link moon.ContextualPopup#spotlightModal} is `true`.
			*
			* @type {String}
			* @default 'auto'
			* @public
			*/
			showCloseButton: 'auto'
		},

		/**
		* @private
		*/
		spotlight: 'container',

		/**
		* @private
		*/
		floating:true,

		/**
		* Determines whether a scrim will appear when the popup is modal.
		* Note that modal scrims are transparent, so you won't see them.
		*
		* @private
		*/
		scrimWhenModal: true,

		// Layout parameters

		/**
		* Vertical flush layout margin.
		*
		* @private
		*/
		vertFlushMargin:0,

		/**
		* Horizontal flush layout margin.
		*
		* @private
		*/
		horizFlushMargin:0,

		/**
		* Popups wider than this value are considered wide (for layout purposes).
		*
		* @private
		*/
		widePopup: 200,

		/**
		* Popups longer than this value are considered long (for layout purposes).
		*
		* @private
		*/
		longPopup: 200,

		/**
		* Do not allow horizontal flush popups past spec'd amount of buffer space on left/right
		* screen edge.
		*
		* @private
		*/
		horizBuffer: 16,

		/**
		* @private
		*/
		activator: null,

		/**
		* @private
		*/
		tools: [
			{name: 'client', classes: 'moon-neutral moon-contextual-popup-client'},
			{name: 'closeButton', kind: 'moon.IconButton', icon: 'closex', classes: 'moon-popup-close', ontap: 'closePopup', spotlight: false}
		],

		/**
		* Creates chrome components.
		*
		* @private
		*/
		initComponents: function () {
			this.createChrome(this.tools);
			this.inherited(arguments);
		},

		/**
		* Renders the contextual popup.
		*
		* @private
		*/
		render: function () {
			this.allowHtmlChanged();
			this.contentChanged();
			this.inherited(arguments);
		},

		/**
		* Performs control-specific tasks before/after showing {@link moon.ContextualPopup}.
		*
		* @private
		*/
		requestShow: function (inSender, inEvent) {
			var n = inEvent.activator.hasNode();
			this.activator = inEvent.activator;
			if (n) {
				this.activatorOffset = this.getPageOffset(n);
			}
			this.show();
			this.configCloseButton();
			if (enyo.Spotlight.isSpottable(this)) {
				enyo.Spotlight.spot(this);
			}
			return true;
		},

		/**
		* @fires enyo.Popup#onActivate
		* @private
		*/
		decorateActivateEvent: function (inSender, inEvent) {
			inEvent.sentFromPopup = this;
		},

		/**
		* @private
		*/
		getPageOffset: function (inNode) {
			// getBoundingClientRect returns top/left values which are relative to the viewport and
			// not absolute
			var r = inNode.getBoundingClientRect();

			var pageYOffset = (window.pageYOffset === undefined) ? document.documentElement.scrollTop : window.pageYOffset;
			var pageXOffset = (window.pageXOffset === undefined) ? document.documentElement.scrollLeft : window.pageXOffset;
			var rHeight = (r.height === undefined) ? (r.bottom - r.top) : r.height;
			var rWidth = (r.width === undefined) ? (r.right - r.left) : r.width;

			return {top: r.top + pageYOffset, left: r.left + pageXOffset, height: rHeight, width: rWidth, bottom: r.top + pageYOffset + rHeight, right: r.left + pageXOffset + rWidth};			
		},

		/**
		* @private
		*/
		resetDirection: function () {
			this.removeClass('right');
			this.removeClass('left');
			this.removeClass('high');
			this.removeClass('low');
			this.removeClass('below');
			this.removeClass('above');
		},

		/**
		* Alters the direction of the popup.
		*
		* @private
		*/
		alterDirection: function () {
			if (this.showing) {
				var clientRect = this.getBoundingRect(this.node);
				var viewPortHeight = enyo.dom.getWindowHeight();
				var viewPortWidth = enyo.dom.getWindowWidth();
				var offsetHeight = (clientRect.height - this.activatorOffset.height) / 2;
				var offsetWidth = (clientRect.width - this.activatorOffset.width) / 2;
				var popupMargin = 20;

				var bounds = {top: null, left: null};

				if(this.direction === 'left') {
					if(clientRect.width + popupMargin < this.activatorOffset.left) { 
						this.resetDirection();
						this.addClass('right');

						if(this.activatorOffset.top < offsetHeight) {
							this.addClass('high');
							bounds.top = this.activatorOffset.top;
						} else if(viewPortHeight - this.activatorOffset.bottom < offsetHeight) {
							this.addClass('low');
							bounds.top = this.activatorOffset.bottom - clientRect.height;
						} else {
							bounds.top = this.activatorOffset.top - offsetHeight;
						}

						bounds.left = this.activatorOffset.left - clientRect.width;
					}
				} else if(this.direction === 'right') {
					if(viewPortWidth > this.activatorOffset.right + clientRect.width + popupMargin) {
						this.resetDirection();
						this.addClass('left');

						if(this.activatorOffset.top < offsetHeight) {
							this.addClass('high');
							bounds.top = this.activatorOffset.top;
						} else if(viewPortHeight - this.activatorOffset.bottom < offsetHeight) {
							this.addClass('low');
							bounds.top = this.activatorOffset.bottom - clientRect.height;
						} else {
							bounds.top = this.activatorOffset.top - offsetHeight;
						}

						bounds.left = this.activatorOffset.right;
					}
				} else if(this.direction === 'top') {
					if(clientRect.height + popupMargin < this.activatorOffset.top) {
						this.resetDirection();
						this.addClass('above');

						if(this.activatorOffset.left < offsetWidth) {
							this.addClass('right');
							bounds.left = this.activatorOffset.left;
						} else if(viewPortWidth - this.activatorOffset.right < offsetWidth) {
							this.addClass('left');
							bounds.left = this.activatorOffset.right - clientRect.width;
						} else {
							bounds.left = this.activatorOffset.left - offsetWidth;
						}

						bounds.top = this.activatorOffset.top - clientRect.height;
					}
				} else if(this.direction === 'bottom') {
					if(viewPortHeight > this.activatorOffset.bottom + clientRect.height + popupMargin) {
						this.resetDirection();
						this.addClass('below');

						if(this.activatorOffset.left < offsetWidth) {
							this.addClass('right');
							bounds.left = this.activatorOffset.left;
						} else if(viewPortWidth - this.activatorOffset.right < offsetWidth) {
							this.addClass('left');
							bounds.left = this.activatorOffset.right - clientRect.width;
						} else {
							bounds.left = this.activatorOffset.left - offsetWidth;
						}

						bounds.top = this.activatorOffset.bottom;
					}
				}

				this.setBounds(bounds);
			}
		},

		/**
		* @private
		*/
		getBoundingRect: function (node) {
			// getBoundingClientRect returns top/left values which are relative to the viewport and not absolute
			var o = node.getBoundingClientRect();
			if (!o.width || !o.height) {
				return {
					left: o.left,
					right: o.right,
					top: o.top,
					bottom: o.bottom,
					width: o.right - o.left,
					height: o.bottom - o.top
				};
			}
			return o;
		},

		/**
		* Dismisses popup if Escape keypress is detected.
		*
		* @private
		*/
		keydown: function (inSender, inEvent) {
			if (this.showing && this.autoDismiss && inEvent.keyCode == 27 /* escape */) {
				enyo.Spotlight.spot(this.activator);
				this.hide();
			}
		},

		/**
		* @private
		*/
		closePopup: function (inSender, inEvent) {
			enyo.Spotlight.spot(this.activator);
			this.$.closeButton.removeClass('pressed');
			this.hide();
		},

		/**
		* Determines whether to display close button.
		*
		* @private
		*/
		configCloseButton: function () {
			if (this.showCloseButton === true || (this.spotlightModal && this.showCloseButton !== false)) {
				this.$.closeButton.show();
				this.$.closeButton.spotlight = true;
				this.addClass('reserve-close');
			} else {
				this.$.closeButton.hide();
				this.$.closeButton.spotlight = false;
				this.removeClass('reserve-close');
			}
		},

		/**
		* @private
		*/
		contentChanged: function () {
			this.$.client.setContent(this.content);
		},

		/**
		* @private
		*/
		allowHtmlChanged: function () {
			this.$.client.setAllowHtml(this.allowHtml);
		},

		/**
		* Called when [spotlightModal]{@link moon.ContextualPopup#spotlightModal} changes.
		*
		* @private
		*/
		spotlightModalChanged: function () {
			this.configCloseButton();
		},

		/**
		* Called when [showCloseButton]{@link moon.ContextualPopup#showCloseButton} changes.
		*
		* @private
		*/
		showCloseButtonChanged: function () {
			this.configCloseButton();
		},

		/**
		* @private
		*/
		capturedKeyDown: function (inSender, inEvent) {
			if (inEvent.keyCode == 13) {
				this.downEvent = inEvent;
			}
			return this.modal;
		},

		/**
		* @private
		*/
		capturedTap: function (inSender, inEvent) {
			// If same activator tapped sequentially, we notice that this popup is already activeted.
			if (inEvent.dispatchTarget.isDescendantOf(this.activator)) {
				this.popupActived = true;
			} else {
				this.popupActived = false;
			}
			this.inherited(arguments);
		},

		/**
		* @private
		*/
		onLeave: function (oSender, oEvent) {
			if (oEvent.originator == this) {
				enyo.Spotlight.spot(this.activator);
				this.hide();
			}
		},

		/**
		* @private
		*/
		_preventEventBubble: function (inSender, inEvent) {
			return true;
		},

		/**
		* @private
		*/
		showHideScrim: function (inShow) {
			if (this.floating && (this.scrim || (this.modal && this.scrimWhenModal))) {
				var scrim = this.getScrim();
				if (inShow && this.modal && this.scrimWhenModal) {
					// move scrim to just under the popup to obscure rest of screen
					var i = this.getScrimZIndex();
					this._scrimZ = i;
					scrim.showAtZIndex(i);
				} else {
					scrim.hideAtZIndex(this._scrimZ);
				}
				enyo.call(scrim, 'addRemoveClass', [this.scrimClassName, scrim.showing]);
			}
		},

		/**
		* @private
		*/
		getScrimZIndex: function () {
			// Position scrim directly below popup
			return this.findZIndex()-1;
		},

		/**
		* @private
		*/
		getScrim: function () {
			// show a transparent scrim for modal popups if
			// {@link moon.ContextualPopup#scrimWhenModal} is `true`, else show a
			// regular scrim.
			if (this.modal && this.scrimWhenModal) {
				return moon.scrimTransparent.make();
			}
			return moon.scrim.make();
		},

		/**
		* @private
		*/
		findZIndex: function () {
			// a default z value
			var z = this.defaultZ;
			if (this._zIndex) {
				z = this._zIndex;
			} else if (this.hasNode()) {
				// Re-use existing zIndex if it has one
				z = Number(enyo.dom.getComputedStyleValue(this.node, 'z-index')) || z;
			}
			this._zIndex = z;
			return this._zIndex;
		},

		/**
		* @private
		*/
		showingChanged: function () {
			this.inherited(arguments);
			this.alterDirection();
			this.showHideScrim(this.showing);
		},

		/**
		* @private
		*/
		directionChanged: function () {
			this.alterDirection();
		}
	});

})(enyo, this);
