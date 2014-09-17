(function (enyo, scope) {
	/**
	* Fires when the control is either checked or unchecked.
	*
	* @event moon.CheckboxItem#onActivate
	* @type {Object}
	* @property {Boolean} checked - Whether the checkbox is currently checked.
	* @property {Object} toggledControl - A reference to the {@link moon.CheckboxItem}
	*	whose state changed. (Note that the originator of this event is actually the
	*	{@link moon.Checkbox} contained within the `CheckboxItem`, so use this property
	* to reference the `CheckboxItem`.)
	*
	* @public
	*/

	/**
	* {@link moon.CheckboxItem} is a control that combines a {@link moon.Checkbox} with
	* a text label. The label text may be set via the [content]{@link enyo.Control#content}
	* property. The state of the checkbox may be retrieved by querying the
	* [checked]{@link moon.CheckboxItem#checked} property.
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
	* You may place CheckboxItem objects inside an {@link enyo.Group} to create a group
	* of checkboxes in which only one may be checked at any given time (similar to how a
	* [RadioItemGroup]{@link moon.RadioItemGroup} behaves):
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
		* @lends moon.CheckboxItem.prototype
		*/
		published: {

			/**
			* Boolean value indicating whether checkbox is currently checked.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			checked: false,

			/**
			* Boolean value indicating whether checkbox is currently active item in group.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			active: false,

			/**
			* If `true`, checkbox will be displayed on the right side of the checkbox item;
			* otherwise, it will be displayed on the left side.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			checkboxOnRight: false,

			/**
			* If `true`, checkbox is shown as disabled and does not generate tap events.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			disabled: false,

			/**
			* If `true`, the value of the [checked]{@link moon.CheckboxItem#checked} property
			* cannot be changed through user input.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			locked: false,

			/**
			* Name of a font-based icon to use when displaying the checkbox. Consult
			* {@link moon.Icon} for valid values.
			*
			* @type {String}
			* @default 'check'
			* @public
			*/
			icon: 'check',

			/**
			* Optional path to an image asset. May be used to customize checkbox appearance.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			src: '',
			
			/**
			* If used as the base control within a {@link moon.DataList} or {@glossary subkind},
			* this should be set to `false` so that selection support can be synchronized to the
			* checked state of this control.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			handleTapEvent: true
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
			{from: '.allowHtml', to: '.$.client.allowHtml'},
			{from: '.active', to: '.$.input.active', oneWay: false}
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
			if (this.hasOwnProperty('src') || this.hasOwnProperty('icon')) {
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
		* @fires enyo.Control#ontap
		* @private
		*/
		tap: function (inSender, inEvent) {
			if (this.handleTapEvent) {
				if (inSender != this.$.input) {
					this.waterfallDown('ontap', inEvent, inSender);
				}
			}
		},

		/**
		* @fires moon.CheckboxItem#onActivate
		* @private
		*/
		decorateActivateEvent: function (inSender, inEvent) {
			inEvent.toggledControl = this;
			this.setChecked(this.$.input.getChecked());
			inEvent.checked = this.checked;
		},

		/**
		* @fires moon.Scroller#onRequestScrollIntoView
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
		}
	});

})(enyo, this);
