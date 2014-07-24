(function (enyo, scope) {
	/**
	* Fires when the [`SelectableItem`]{@link moon.SelectableItem} is tapped. No event-specific data
	* is sent with this event.
	*
	* @event moon.SelectableItem#onActivate
	* @type {Object}
	* @public
	*/

	/**
	* `moon.SelectableItem` is a {@link moon.Item} with a flag to track selection state.  It is
	* especially useful within the context of the [Enyo Group API]{@link enyo.Group}.
	*
	* When selected, the item appears as underlined.
	*
	* If multiple `SelectableItem`s are used in a group, only one of them may be in
	* the selected state at a given time.
	*
	* @class moon.SelectableItem
	* @extends moon.Item
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.SelectableItem.prototype */ {

		/**
		* @private
		*/
		name: 'moon.SelectableItem',

		/**
		* @private
		*/
		kind: 'moon.Item',
		
		/**
		* @private
		*/
		classes: 'moon-selectable-item',
		
		/**
		* @private
		*/
		events: {
			onActivate: ''
		},
		
		/**
		* @private
		*/
		handlers: {
			// Prevents double bubbling of _onchange_ in IE.
			onclick: ''
		},

		/**
		* @private
		* @lends moon.SelectableItem.prototype
		*/
		published: {

			/**
			* Is `true` if this item is currently selected; `false` if not.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			selected: false,

			/**
			* For use with the Enyo Group API; `true` if this item is the selected item in the
			* group. Within this kind, [`selected`]{@link moon.SelectableItem#selected} and `active`
			* appear to behave similarly; however, `active` is meant to be used by
			* {@link enyo.Group}, while `selected` is to be used for changing selection state.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			active: false
		},
		
		/**
		* @private
		*/
		components: [
			{name: 'client', kind: 'moon.MarqueeText'}
		],

		/**
		* @private
		*/
		bindings: [
			{from: '.allowHtml', to: '.$.client.allowHtml'}
		],
		
		/**
		* @method
		* @private
		*/
		create: enyo.inherit(function (sup) {
			return function() {
				sup.apply(this, arguments);
				this.contentChanged();
				this.updateSelectedValue();
			};
		}),

		/**
		* @private
		*/
		rendered: function() {
			this.inherited(arguments);
			this.updateActiveValue();
		},

		/**
		* @private
		*/
		shouldDoTransition: function(selected) {
			return selected === true;
		},

		/**
		* @private
		*/
		tap: function(sender, e) {
			if (this.disabled) {
				return true;
			}

			this.setActive(!this.getActive());
			this.bubble('onchange');
		},

		/**
		* @private
		*/
		updateSelectedValue: function() {
			var selected = this.getSelected();
			this.addRemoveClass('selected', selected);
			this.setNodeProperty('selected', selected);
			this.setAttribute('selected', selected ? 'selected' : '');
		},

		/**
		* @private
		*/
		updateActiveValue: function() {
			this.setActive(this.getSelected());
			this.resetMarquee();
		},

		/**
		* @private
		*/
		selectedChanged: function() {
			this.updateSelectedValue();
			this.updateActiveValue();
		},

		/**
		* For use with the Enyo Group API, which is supported by this object. Called when the active
		* item within the group changes. The [`active`]{@link enyo.SelectableItem#active} property
		* and [`onActivate`]{@link enyo.SelectableItem#event:onActivate} event are both part of the
		* Group API.
		*
		* @private
		*/
		activeChanged: function() {
			this.active = enyo.isTrue(this.active);
			this.setSelected(this.active);
			this.bubble('onActivate');
		},

		/**
		* @private
		*/
		contentChanged: function() {
			this.$.client.setContent(this.content);
		}
	});

})(enyo, this);
