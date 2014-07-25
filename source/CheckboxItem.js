(function (enyo, scope) {
	/**
	* Fires when the control is either checked or unchecked.
	*
	* _event.toggledControl_ 	*
	* @event moon.CheckboxItem#event:onActivate
	* @type {Object}
	* @property {Boolean} checked - indicates whether the checkbox is currently checked.
	* @property {Object} toggledControl - contains a reference to the CheckboxItem whose
	*	state toggled. (Note that the originator of this event is actually the
	*	{@link moon.Checkbox} contained within the CheckboxItem, so use this property to
	*	reference the CheckboxItem.)
	*
	* @public
	*/

	/**
	* _moon.CheckboxItem_ is a control that combines a {@link moon.Checkbox} with a text label.
	* The label text may be set via the {@link enyo.Control#content} property. The state of the
	* checkbox may be retrieved by querying the {@link moon.CheckboxItem#checked} property.
	*
	* ```
	*		{kind: 'moon.CheckboxItem', content: 'San Francisco',
	*			onchange: 'checkedChanged'},
	*		...
	*		checkedChanged: function (inSender, inEvent) {
	*			var checked = inSender.get('checked');
	*		}
	* ```
	*
	* You may place {@link moon.CheckboxItem} objects inside an {@link enyo.Group}
	* to create a group of checkboxes in which only one may be checked at any given
	* time (similar to how a {@link moon.RadioItemGroup} works):
	*
	* ```
	*		{kind: 'Group', components: [
	*			{kind: 'moon.CheckboxItem', content: 'New York'},
	*			{kind: 'moon.CheckboxItem', content: 'London'},
	*			{kind: 'moon.CheckboxItem', content: 'San Francisco'},
	*			{kind: 'moon.CheckboxItem', content: 'Beijing'}
	*		]}
	* ```
	*
	* @class moon.CheckboxItem
	* @extends enyo.Control
	* @mixes moon.MarqueeSupport
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.CheckboxItem.prototype */ {

		/**
		* @private
		*/
		name: 'moon.CheckboxItem',

		/**
		* @private
		*/
		kind: 'enyo.Control',

		/**
		* @private
		*/
		mixins: ['moon.MarqueeSupport'],


		/**
		* @private
		*/
		published: /** @lends moon.CheckboxItem.prototype */ {

			/**
			* Boolean value indicating whether checkbox is currently checked
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			checked: false,

			/**
			* If true, checkbox will be displayed on the right side of the checkbox item
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			checkboxOnRight: false,

			/**
			* When true, button is shown as disabled and does not generate tap
			* events
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			disabled: false,

			/**
			* When locked is true, cannot change the value of the checked property
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			locked: false,

			/**
			* Customize the appearance of the checkbox with an icon name. Consult moon.Icon for valid values
			*
			* @type {String}
			* @default 'check'
			* @public
			*/
			icon: 'check',

			/**
			* Customize the appearance of the checkbox with an image asset.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			src: ''
		},

		/**
		* @private
		*/
		events: {

			/**
			* {@link moon.CheckboxItem#event:onActivate}
			*/
			onActivate: ''
		},

		/**
		* @private
		*/
		classes: 'moon-item moon-checkbox-item',

		/**
		* @private
		*/
		spotlight: true,

		/**
		* @private
		*/
		handlers: {
			ontap: 'tap',
			onActivate: 'decorateActivateEvent',
			onSpotlightFocused: 'spotlightFocused'
		},

		/**
		* @private
		*/
		components: [
			{name: 'client', mixins: ['moon.MarqueeItem'], classes: 'moon-checkbox-item-label-wrapper'},
			{name: 'input', kind: 'moon.Checkbox', spotlight: false}
		],

		/**
		* @private
		*/
		bindings: [
			{from: '.allowHtml', to: '.$.client.allowHtml'}
		],

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.disabledChanged();
			this.checkboxOnRightChanged();
			this.lockedChanged();
		},

		/**
		* @private
		*/
		rendered: function () {
			this.inherited(arguments);
			if (this.src || this.icon) {
				this.srcChanged();
				this.iconChanged();
			}
			this.checkedChanged();
		},

		/**
		* @private
		*/
		disabledChanged: function () {
			this.addRemoveClass('disabled', this.disabled);
			this.$.input.setDisabled(this.disabled);
		},

		/**
		* @private
		*/
		checkedChanged: function () {
			this.$.input.setChecked(this.getChecked());
		},

		/**
		* @private
		*/
		checkboxOnRightChanged: function () {
			this.addRemoveClass('left-handed', !this.getCheckboxOnRight());
		},

		/**
		* waterfall event
		* @fires enyo.Control#event:ontap
		* @private
		*/
		tap: function (inSender, inEvent) {
			if (inSender != this.$.input) {
				this.waterfallDown('ontap', inEvent, inSender);
			}
		},

		/**
		* @fires moon.CheckboxItem#event:onActivate
		* @private
		*/
		decorateActivateEvent: function (inSender, inEvent) {
			inEvent.toggledControl = this;
			this.setChecked(this.$.input.getChecked());
			inEvent.checked = this.checked;
		},

		/**
		* @fires moon.Scroller#event:onRequestScrollIntoView
		* @private
		*/
		spotlightFocused: function (inSender, inEvent) {
			if (inEvent.originator === this) {
				this.bubble('onRequestScrollIntoView');
			}
		},

		/**
		* @private
		*/
		contentChanged: function () {
			this.$.client.setContent(this.getContent());
		},

		/**
		* @private
		*/
		lockedChanged: function() {
			this.$.input.setLocked(this.locked);
		},

		/**
		* @private
		*/
		iconChanged: function() {
			this.$.input.setIcon(this.icon);
		},

		/**
		* @private
		*/
		srcChanged: function() {
			this.$.input.setSrc(this.src);
		},
	});

})(enyo, this);
