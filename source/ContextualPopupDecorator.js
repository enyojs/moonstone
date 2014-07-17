(function (enyo, scope) {
	/**
	* _moon.ContextualPopupDecorator_ is a control that activates a
	* {@link moon.ContextualPopup}. It loosely couples the popup
	* with an activating control, which may be a button or any other control that
	* fires an {@link enyo.Control#event:onActivate event. The decorator surrounds both the activating
	* control and the contextual popup.
	*
	* When the control is activated, the popup shows itself in the correct position
	* relative to the activator.
	*
	* ```
	*		{kind: 'moon.ContextualPopupDecorator', components: [
	*			{content: 'Show Popup'},
	*			{kind: 'moon.ContextualPopup',
	*				components: [
	*					{content:'Sample component in popup'}
	*				]
	*			}
	*		]}
	* ```
	*
	* @ui
	* @class moon.ContextualPopupDecorator
	@ @extends enyo.Control
	* @public
	*/
	enyo.kind(
		/** @lends moon.ContextualPopupDecorator.prototype */ {

		/**
		* @private
		*/
		name: 'moon.ContextualPopupDecorator',

		/**
		* @private
		*/
		defaultKind: 'moon.ContextualPopupButton',

		/**
		* selection on ios prevents tap events, so avoid.
		*
		* @private
		*/
		classes: 'moon-contextual-popup-decorator',

		/**
		* @private
		*/
		handlers: {
			onActivate: 'activated',
			onShow: 'popupShown',
			onHide: 'popupHidden'
		},

		/**
		* @fires enyo.Control#event:onActivate
		* @private
		*/
		activated: function (inSender, inEvent) {
			// Don't process activate events that came from inside this decorator
			if (inEvent.sentFromPopup && inEvent.sentFromPopup.isDescendantOf(this)) {
				return;
			}

			this.requestHidePopup();
			if (inEvent.originator.active) {
				this.activator = inEvent.originator;
				// if this ContextualPopup is already activated
				if (this.popupActived) {
					inEvent.originator.active = false;
					this.popupActived = false;
				} else {
					this.activator.addClass('active');
					this.requestShowPopup();
				}
			}
		},

		/**
		* onShow event handler.
		* Due to popup being a 'client control' of decorator
		* we should provide connector between them.
		*
		*
		* @param {inSender} the component that most recently propagated onShow event
		* @param {inEvent} an object which contains event information
		* @private
		*/
		popupShown: function (inSender, inEvent) {
			if (this.popup === undefined) {
				this.popup = inEvent.originator;
			}
		},

		/**
		* If you tap out of popup control, {@link enyo.Popup} closes it
		*
		* @private
		*/
		popupHidden: function () {
			if (this.activator) {
				this.popupActived = this.popup.popupActived;
				this.activator.active = false;
				this.activator.removeClass('active');
				this.activator.removeClass('pressed');
			}
		},

		/**
		* event waterfalls down
		* @fires moon.ContextualPopup#event:onRequestShowPopup
		* @private
		*/
		requestShowPopup: function () {
			this.waterfallDown('onRequestShowPopup', {activator: this.activator});
		},

		/**
		* event waterfalls down
		* @fires moon.ContextualPopup#event:onRequestHidePopup
		* @private
		*/
		requestHidePopup: function () {
			this.waterfallDown('onRequestHidePopup');
		}
	});

})(enyo, this);