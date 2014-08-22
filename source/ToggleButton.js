(function (enyo, scope) {
	/**
	* Fires when the value of the toggle button changes.
	*
	* @event moon.ToggleButton:onChange
	* @type {Object}
	* @property {Boolean} value - Current state of the ToggleButton.
	* @public
	*/

	/**
	* {@link moon.ToggleButton}, which extends {@link moon.Button}, is a button with two
	* states, 'on' and 'off'. When the toggle button is tapped, it switches its state
	* and fires an [onChange]{@link moon.ToggleButton#event:onChange} event.
	*
	* You may show the same text for both toggle states (via the
	* [content]{@link enyo.Control#content} property), or different text for each state,
	* using the [toggleOnLabel]{@link moon.ToggleButton#toggleOnLabel} and
	* [toggleOffLabel]{@link moon.ToggleButton#toggleOffLabel} properties. Note that both
	* `toggleOnLabel` and `toggleOffLabel` must be set in order to display different labels;
	* otherwise, the `content` property will be used.
	*
	* @class moon.ToggleButton
	* @extends moon.Button
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.ToggleButton.prototype */ {

		/**
		* @private
		*/
		name: 'moon.ToggleButton',

		/**
		* @private
		*/
		kind: 'moon.Button',

		/**
		* @private
		* @lends moon.ToggleButton.prototype
		*/
		published: {

			/**
			* Boolean indicating whether toggle button is currently in the 'on' state.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			value: false,

			/**
			* Button text displayed in the 'on' state. If not specified, the
			* [content]{@link enyo.Control#content} property will be used as button text.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			toggleOnLabel: '',

			/**
			* Button text displayed in the 'off' state. If not specified, the
			* [content]{@link enyo.Control#content} property will be used as button text.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			toggleOffLabel: ''
		},

		/*
		* @private
		*/
		events: {
			onChange: ''
		},

		/*
		* @private
		*/
		_rendered: false,

		/*
		* @private
		*/
		classes: 'moon-toggle-button',

		/*
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.updateContent();
			this.updateVisualState();
		},

		/*
		* @private
		*/
		rendered: function () {
			this.inherited(arguments);
			this.setActive(this.value);
			this.fireChangeEvent();
			this._rendered = true;
		},

		/*
		* @private
		*/
		updateVisualState: function () {
			this.addRemoveClass('moon-toggle-button-on', this.value && !this.disabled);
		},

		/*
		* @private
		*/
		disabledChanged: function () {
			this.inherited(arguments);
			this.updateVisualState();
		},

		/*
		* @private
		*/
		valueChanged: function () {
			this.updateContent();
			this.updateVisualState();
			this.setActive(this.value);
			this.fireChangeEvent();
		},

		/*
		* @private
		*/
		toggleOnLabelChanged: function () {
			this.updateContent();
		},

		/*
		* @private
		*/
		toggleOffLabelChanged: function () {
			this.updateContent();
		},

		/*
		* We override the inherited `activeChanged()` method.
		*
		* @private
		*/
		activeChanged: function () {
			if (this._rendered) {
				this.active = enyo.isTrue(this.active);
				this.setValue(this.active);
			}
			this.bubble('onActivate');
		},

		/*
		* we override the inherited `tap()` method.
		*
		* @private
		*/
		tap: function () {
			if (this.disabled) {
				return true;
			} else {
				this.setValue(!this.value);
			}
		},

		/*
		* @private
		*/
		updateContent: function () {
			if (!this.toggleOnLabel || !this.toggleOffLabel) {
				this.setContent(this.content);
			} else {
				this.setContent(this.value ? this.toggleOnLabel : this.toggleOffLabel);
			}
		},

		/*
		* @private
		*/
		fireChangeEvent: function () {
			this.doChange({value: this.value});
		}
	});

})(enyo, this);
