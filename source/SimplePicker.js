(function (enyo, scope) {
	/**
	* Fires when the currently selected item changes. The following shows the event-specific data:
	*
	* ```javascript
	* {
	*	selected: [object Object],	// Reference to selected item
	*	content: "San Francisco",	// Content of selected item
	*	index: 1					// Index of selected item
	* }
	* ```
	* 
	* @event moon.SimplePicker#event:onChange
	* @type {Object}
	* @property {enyo.Control} selected - A reference to the currently selected item.
	* @property {String} content - The content of the currently selected item.
	* @property {Number} index - The index of the currently selected item.
	* @public
	*/

	/**
	* _moon.SimplePicker_ is a [control]{@link enyo.Control} that solicits a choice from the user by
	* cycling through a list of options. The picker's child [components]{@link enyo.Component}, 
	* typically simple {@link enyo.Control} [objects]{@glossary Object} with text content, become 
	* the options for the picker.
	*
	* ```javascript
	* {kind: 'moon.SimplePicker', onChange: 'changed', selectedIndex: 1, components: [
	*	{content: 'San Francisco'},
	*	{content: 'Boston'},
	*	{content: 'Tokyo'}
	* ]}
	* ```
	* 
	* The picker may be changed programmatically by calling 
	* [_previous()_]{@link moon.SimplePicker#previous} or [_next()_]{@link moon.SimplePicker#next}, 
	* or by modifying the [_selectedIndex_]{@link moon.SimplePicker#selectedIndex} published 
	* property by calling `set('selectedIndex', <value>)`.
	* 
	* The picker options may be modified programmatically in the standard manner, by calling
	* `createComponent().render()` or `destroy()`.
	*
	* ```javascript
	* // Add new items to picker
	* this.$.picker.createComponent({"New York"}).render();
	* this.$.picker.createComponent({"London"}).render();
	* 
	* // Remove currently selected item from picker
	* this.$.picker.getSelected().destroy();
	* ```
	*
	* @ui
	* @class moon.SimplePicker
	* @extends enyo.Control
	* @mixes moon.MarqueeSupport
	* @public
	*/
	enyo.kind(
		/** @lends moon.SimplePicker.prototype */ {

		/**
		* @private
		*/
		name: 'moon.SimplePicker',

		/**
		* @private
		*/
		kind: 'enyo.Control',
		
		/**
		* @private
		*/
		classes: 'moon-simple-picker',

		/**
		* @private
		*/
		mixins: ['moon.MarqueeSupport'],
		
		/**
		* @private
		*/
		events: {
			onChange: ''
		},

		/**
		* @private
		*/
		published: 
			/** @lends moon.SimplePicker.prototype */ {

			/** 
			* Reference to currently selected item, if any.
			*
			* @type {enyo.Control}
			* @default ''
			* @public
			*/
			selected: '',
			
			/** 
			* Index of currently selected item, if any.
			*
			* @type {Number}
			* @default 0
			* @public
			*/
			selectedIndex: 0,
			
			/** 
			* When `true`, picker transitions animate left/right.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			animate: true,
			
			/** 
			* When `true`, button is shown as disabled and does not generate tap events.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			disabled: false,
			
			/** 
			* When `true`, picker will wrap around from last item to first.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			wrap: false,
			
			/** 
			* By default, [SimplePicker]{@link moon.SimplePicker} is an inline-block element; 
			* setting `block: true` makes it a block element.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			block: false
		},
		
		/**
		* @private
		*/
		defaultKind:'moon.MarqueeText',
		
		/**
		* @private
		*/
		handlers: {
			onSpotlightFocused: 'scrollIntoView'
		},

		/**
		* @private
		*/
		components: [
			{name: 'buttonLeft',  kind: 'moon.IconButton', noBackground:true, classes: 'moon-simple-picker-button left', icon:'arrowlargeleft', onSpotlightKeyDown:'configureSpotlightHoldPulse', onSpotlightSelect: 'left', ondown: 'downLeft', onholdpulse:'left', defaultSpotlightDisappear: 'buttonRight'},
			{kind: 'enyo.Control', name: 'clientWrapper', classes:'moon-simple-picker-client-wrapper', components: [
				{kind: 'enyo.Control', name: 'client', classes: 'moon-simple-picker-client'}
			]},
			{name: 'buttonRight', kind: 'moon.IconButton', noBackground:true, classes: 'moon-simple-picker-button right', icon:'arrowlargeright', onSpotlightKeyDown:'configureSpotlightHoldPulse', onSpotlightSelect: 'right', ondown: 'downRight', onholdpulse:'right', defaultSpotlightDisappear: 'buttonLeft'}
		],

		/**
		* @private
		*/
		create: function() {
			this.inherited(arguments);
			this.animateChanged();
			this.initializeActiveItem();
			this.disabledChanged();
			this.selectedIndexChanged();
			this.updateMarqueeDisable();
			this.blockChanged();
			this.showHideNavButtons();
		},

		/**
		* @private
		*/
		scrollIntoView: function() {
			this.bubble('onRequestScrollIntoView');
		},

		/**
		* @fires moon.SimplePicker#event:onChange
		* @private
		*/
		fireChangedEvent: function() {
			if (!this.generated) {
				return;
			}

			this.doChange({
				selected:   this.selected,
				content:    this.selected && this.selected.content,
				index:      this.selected && this.selectedIndex
			});
		},

		/**
		* @private
		*/
		blockChanged: function() {
			this.addRemoveClass('block', this.block);
		},
		
		/** 
		* Shows/hides previous/next buttons based on current index.
		*
		* @private
		*/
		showHideNavButtons: function() {
			var index = this.getSelectedIndex(),
				maxIndex = this.getClientControls().length - 1;
			var prevButton = this.rtl ? this.$.buttonRight : this.$.buttonLeft;
			var nextButton = this.rtl ? this.$.buttonLeft : this.$.buttonRight;

			if (this.disabled) {
				this.hideNavButton(prevButton);
				this.hideNavButton(nextButton);
			// Always show buttons if _this.wrap_ is _true_
			} else if (this.wrap) {
				this.showNavButton(prevButton);
				this.showNavButton(nextButton);
			// If we have one or less options, always show no buttons
			} else if (maxIndex <= 0) {
				this.hideNavButton(prevButton);
				this.hideNavButton(nextButton);
			// If we are on the first option, hide the left button
			} else if (index <= 0) {
				this.showNavButton(nextButton);
				this.hideNavButton(prevButton);
			// If we are on the last item, hide the right button
			} else if (index >= maxIndex) {
				this.showNavButton(prevButton);
				this.hideNavButton(nextButton);
			// Otherwise show both buttons
			} else {
				this.showNavButton(prevButton);
				this.showNavButton(nextButton);
			}
		},

		/**
		* @private
		*/
		destroy: function() {
			this.destroying = true;
			this.inherited(arguments);
		},

		/**
		* @private
		*/
		addControl: function(ctl) {
			this.inherited(arguments);
			var addedIdx = this.getClientControls().indexOf(ctl);
			var selectedIdx = this.selectedIndex;
			if (this.generated) {
				if ((selectedIdx < 0) || (addedIdx < selectedIdx)) {
					this.setSelectedIndex(selectedIdx + 1);
				} else if (selectedIdx == addedIdx) {
					// Force change handler, since the currently selected item actually changed
					this.selectedIndexChanged();
				}
				this.showHideNavButtons();
			}
		},

		/**
		* @private
		*/
		removeControl: function(ctl) {
			if (!this.destroying) {
				var removedIdx = this.getClientControls().indexOf(ctl);
				var selectedIdx = this.selectedIndex;
				var wasLast = (removedIdx == this.getClientControls().length-1);

				this.inherited(arguments);

				// If removedIdx is -1, that means that the Control being removed is
				// not one of our picker items, so we don't need to update our state.
				// Probably, we're being torn down.
				if (removedIdx !== -1) {
					if ((removedIdx < selectedIdx) || ((selectedIdx == removedIdx) && wasLast)) {
						this.setSelectedIndex(selectedIdx - 1);
					} else if (selectedIdx == removedIdx) {
						// Force change handler, since the currently selected item actually changed
						this.selectedIndexChanged();
					}
					this.showHideNavButtons();
				}
			} else {
				this.inherited(arguments);
			}
		},
		
		/** 
		* Hides _inControl_ and disables spotlight functionality.
		*
		* @private
		*/
		hideNavButton: function(ctl) {
			ctl.setDisabled(true);
		},
		
		/** 
		* Shows _inControl_ and enables spotlight functionality.
		*
		* @private
		*/
		showNavButton: function(ctl) {
			ctl.setDisabled(false);
		},

		/**
		* @private
		*/
		disabledChanged: function() {
			this.$.client.addRemoveClass('disabled', this.disabled);
			if (this.generated) {
				this.showHideNavButtons();
			}
		},

		/**
		* @private
		*/
		animateChanged: function() {
			this.$.client.addRemoveClass('animated', this.animate);
		},

		/**
		* @private
		*/
		selectedChanged: function() {
			var idx = this.getClientControls().indexOf(this.selected);
			if (idx >= 0) {
				this.setSelectedIndex(idx);
			}
		},
		/*
		* When the picker is initialized, looks for any items with an `active:true` flag; if one is 
		* found, it is set as the currently selected item. This is done without triggering an 
		* [_onChange_]{@link moon.SimplePicker#event:onChange} event, as it happens during 
		* initialization.
		*
		* @private
		*/
		initializeActiveItem: function() {
			var controls = this.getClientControls();
			for(var i=0;i<controls.length;i++) {
				if(controls[i].active) {
					this.selectedIndex = i;
					this.selected = controls[i];
					return;
				}
			}
		},

		/**
		* @private
		*/
		selectedIndexChanged: function() {
			enyo.dom.transform(this.$.client, {translateX: (this.selectedIndex * 100 * (this.rtl ? 1 : -1)) + '%'});
			this.updateMarqueeDisable();
			this.setSelected(this.getClientControls()[this.selectedIndex]);
			this.fireChangedEvent();
			this.showHideNavButtons();
			this.startMarquee();
		},

		/**
		* @private
		*/
		updateMarqueeDisable: function() {
			this.stopMarquee();
			var i,
				c = this.getClientControls();
			for (i=0; i<c.length; i++) {
				if (i == this.selectedIndex) {
					c[i].disabled = false;
				} else {
					c[i].disabled = true;
				}
			}
		},

		/**
		* @private
		*/
		left: function(sender, e) {
			if (e && e.sentHold) { return; }
			if (this.rtl) {
				this.next(sender, e);
			} else {
				this.previous(sender, e);
			}
		},

		/**
		* @private
		*/
		right: function(sender, e) {
			if (e && e.sentHold) { return; }
			if (this.rtl) {
				this.previous(sender, e);
			} else {
				this.next(sender, e);
			}
		},

		/**
		* @private
		*/
		downLeft: function(sender, e) {
			e.configureHoldPulse({endHold: 'onLeave', delay: 300});
			this.left(sender, e);
		},

		/**
		* @private
		*/
		downRight: function(sender, e) {
			e.configureHoldPulse({endHold: 'onLeave', delay: 300});
			this.right(sender, e);
		},

		/**
		* @private
		*/
		configureSpotlightHoldPulse: function(sender, e) {
			if (e.keyCode === 13) {
				e.configureHoldPulse({endHold: 'onLeave', delay: 300});
			}
		},

		/** 
		* Cycles the selected item to the one before the currently selected item.
		*
		* @public
		*/
		previous: function(sender, e) {
			if (!this.disabled) {
				var idx = this.selectedIndex - 1;
				if (idx < 0) {
					idx = this.wrap ? this.getClientControls().length - 1 : 0;
				}
				if (!this.wrap && idx === 0 && e && e.cancelHoldPulse) {
					e.cancelHoldPulse();
				}
				this.setSelectedIndex(idx);
			}
		},

		/** 
		* Cycles the selected item to the one after the currently selected item.
		*
		* @public
		*/
		next: function(sender, e) {
			if (!this.disabled) {
				var idx = this.selectedIndex + 1;
				if (idx > this.getClientControls().length - 1) {
					idx = this.wrap ? 0 : this.getClientControls().length - 1;
				}
				if (!this.wrap && idx === this.getClientControls().length - 1 
					&& e && e.cancelHoldPulse) {
					e.cancelHoldPulse();
				}
				this.setSelectedIndex(idx);
			}
		}
	});

})(enyo, this);
