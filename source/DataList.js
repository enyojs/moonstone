(function (enyo, scope) {
	/**
	* {@link moon.DataListSpotlightSupport} is a {@glossary mixin} that provides
	* {@glossary Spotlight} handling code for use by {@link moon.DataList} and
	* {@link moon.DataGridList}. Since both of these [kinds]{@glossary kind} inherit
	* from their respective Enyo counterparts, this mixin provides the common add-on
	* code needed for proper spotlight handling.
	*
	* @mixin moon.DataListSpotlightSupport
	* @private
	*/
	moon.DataListSpotlightSupport = {

		/**
		* @private
		* @lends moon.DataListSpotlightSupport.prototype
		*/
		published: {
			/**
			* The index of the item to focus at render time, or `-1` for no focused item.
			*
			* @type {Number}
			* @default -1
			* @public
			*/
			initialFocusIndex: -1
		},

		/**
		* @private
		*/
		handlers: {
			onSpotlightUp    : '_spotlightPrev',
			onSpotlightLeft  : '_spotlightPrev',
			onSpotlightDown  : '_spotlightNext',
			onSpotlightRight : '_spotlightNext'
		},

		/**
		* @private
		*/
		focusOnIndex: function (inIndex, inSubChild) {
			var c = this.collection,
				child,
				subChild;
			if (c && c.length && this.hasRendered) {  // Give focus if list is rendered
				inIndex = inIndex < 0 ? 0 : (inIndex >= c.length ? c.length - 1 : inIndex);
				child = this.childForIndex(inIndex);
				if (!child) {
					this.scrollToIndex(inIndex);
					child = this.childForIndex(inIndex);
				}
				subChild = inSubChild ? enyo.Spotlight.getChildren(child)[inSubChild] : child;
				enyo.Spotlight.spot(subChild);
			} else {
				this._indexToFocus = inIndex;
				this._subChildToFocus = inSubChild;
			}
		},

		/**
		* @private
		*/
		getFocusedIndex: function () {
			var focusedChild = this.getFocusedChild();
			return focusedChild ? this.getIndexFromChild(focusedChild) : -1;
		},

		/**
		* @private
		*/
		getFocusedChild: function () {
			var current = enyo.Spotlight.getCurrent();
			return (current && current.isDescendantOf(this.$.active)) ? current : null;
		},

		/**
		* @private
		*/
		_indexToFocus: -1,

		/**
		* @private
		*/
		_subChildToFocus: null,

		/**
		* @private
		*/
		didRender: function () {
			// Lists are set to spotlight:true by default, which allows them to receive focus before
			// children are rendered; once rendred, it becomes spotlight:false, and the code below
			// ensures spotlight is transferred inside the list once rendering is complete
			this.spotlight = false;
			// If there is a queued index to focus (or an initialFocusIndex), focus that item now that
			// the list is rendered
			var index = (this._indexToFocus > -1) ? this._indexToFocus : this.initialFocusIndex;
			if (index > -1) {
				this.focusOnIndex(index);
				this._indexToFocus = -1;
			} else {
				// Otherwise, check if the list was focused and if so, transfer focus to the first
				// spottable child inside
				if (enyo.Spotlight.getCurrent() == this) {
					enyo.Spotlight.spot(this);
				}
			}
		},

		/**
		* @private
		* @method
		*/
		didScroll: enyo.inherit(function (sup) {
			return function () {
				// When scrolling in pointer mode, we unspot the last focused child, to prevent it from
				// looping as new pages come up
				var spot;
				if (enyo.Spotlight.getPointerMode() &&
					((spot = enyo.Spotlight.getCurrent()) && (spot === this || spot.isDescendantOf(this.$.active)))) {
					enyo.Spotlight.unspot();
					this._unspotSinceSpot = true;
				}
				return sup.apply(this, arguments);
			};
		}),

		/**
		* @private
		*/
		_spotlightNext: function (inSender, inEvent) {
			return this._spotlightSelect(inEvent, 1);
		},

		/**
		* @private
		*/
		_spotlightPrev: function (inSender, inEvent) {
			return this._spotlightSelect(inEvent, -1);
		},

		/**
		* Spots the next/previous control. Handles the case where this control may not be
		* generated yet; otherwise, the default behavior occurs and is handled by Spotlight.
		*
		* @private
		*/
		_spotlightSelect: function (inEvent, inDirection) {
			var pages = this.delegate.pagesByPosition(this),
				spottableControl;

			// If there are no spottable items generated in the current pages, generate the subsequent page(s)
			// based on the current direction
			if (!this.getNextSpottableChild(inDirection)) {
				// Find the next spottable control in the appropriate direction
				if (inDirection === 1) {
					spottableControl = this.findSpottableControl(inDirection, pages.firstPage, pages.lastPage.index + 1);
				} else if (inDirection === -1) {
					spottableControl = this.findSpottableControl(inDirection, pages.lastPage, pages.firstPage.index - 1);
				}

				if (spottableControl) {
					// Explicitly handle spotting of the control we found
					enyo.Spotlight.spot(spottableControl);
					return true;
				}
			} else if (this.needToAdjustPages) {
				// Sometimes after models added, page adjustment might be required.
				var pagesForIndex = this.delegate.pageForIndex(this, inEvent.index),
					pageCount = this.delegate.pageCount(this),
					lastPageIndex = pages.lastPage.index;
			
				// If current selected index is lastPage and there is no page
				// then lower bound of scrollThreshold is undefined because it is useless
				// However after models are added then more pages could be generated
				// We need to check whether current list's position passes scrollThreshold or not.
				if (pagesForIndex === lastPageIndex && pageCount -1 !== lastPageIndex) {
					this.didScroll(this, {scrollBounds: {left: null, top: null, xDir: 1, yDir: 1}});
					this.needToAdjustPages = false;
				}
			}
		},

		/**
		* Finds the next/previous spottable control, the page to generate the next
		* page worth of controls in, and the index of the next page to generate.
		*
		* @private
		*/
		findSpottableControl: function (inDirection, inPage, inPageIndex) {
			if ((inPageIndex > this.delegate.pageCount(this) - 1) || inPageIndex < 0) {
				return null;
			}
			this.delegate.generatePage(this, inPage, inPageIndex);
			this.delegate.adjustPagePositions(this);
			this.delegate.adjustBuffer(this);

			var pages = this.delegate.pagesByPosition(this),
				control = this.getNextSpottableChild(inDirection);

			if (!control) {
				if (inDirection === 1) {
					return this.findSpottableControl(inDirection, inPage === pages.firstPage ? pages.lastPage : pages.firstPage, inPageIndex + 1);
				} else if (inDirection === -1) {
					return this.findSpottableControl(inDirection, inPage === pages.firstPage ? pages.lastPage : pages.firstPage, inPageIndex - 1);
				}
			}
			return control;
		},

		/**
		* @private
		*/
		previewDomEvent: function (inEvent) {
			// When spotlight is being applied back to the list after being unspotted, check that the child being
			// focused is visible and if not, spot the first visible child that is
			if ((inEvent.type == 'onSpotlightFocus') && this._unspotSinceSpot) {
				if (enyo.Spotlight.getPointerMode()) {
					this._unspotSinceSpot = false;
				} else {
					var target = inEvent.originator;
					if (target != this) {
						// Calculate the target bounds, relative to the scrollBounds
						var tb = target.getBounds();
						var p = target.isDescendantOf(this.$.page1) ? this.$.page1 : this.$.page2;
						var pb = p.getBounds();
						// Need to add page offset to target bounds
						tb.top += pb.top;
						tb.left += pb.left;
						var sb = this.$.scroller.getScrollBounds();
						// Check if target is inside the current scrollBounds
						if ((tb.top < sb.top) ||
							(tb.left < sb.left) ||
							((tb.top + tb.height) > (sb.top + sb.clientHeight)) ||
							((tb.left + tb.width) > (sb.left + sb.clientWidth))) {
							// Not in view, so find and spot the first visible child
							var vc = this.getFirstVisibleChild(sb);
							if (vc) {
								this._unspotSinceSpot = false;
								enyo.Spotlight.spot(vc);
							}
							return true;
						} else {
							this._unspotSinceSpot = false;
						}
					}
				}
			}
		},

		/**
		* @private
		*/
		getFirstVisibleChild: function (inScrollBounds) {
			// Loop through the pages in top-down order
			var pages = (this.$.page1.index < this.$.page2.index) ?
				[this.$.page1, this.$.page2] :
				[this.$.page2, this.$.page1],
				pageIdx,
				page,
				pb,
				i,
				c,
				cb;

			for (pageIdx = 0; pageIdx < pages.length; pageIdx++) {
				page = pages[pageIdx];
				pb = page.getBounds();
				// Loop through children in each page top-down
				for (i=0; i<page.children.length; i++) {
					c = page.children[i];
					cb = c.getBounds();
					// Need to add page offset to target bounds
					cb.top += pb.top;
					cb.left += pb.left;
					// Return the first spottable child whose top/left are inside the viewport
					if ((cb.top >= inScrollBounds.top) && ((this.rtl ? (inScrollBounds.width - (cb.left + cb.width)) : cb.left) >= inScrollBounds.left)) {
						if (enyo.Spotlight.isSpottable(c)) {
							return c;
						}
						c = enyo.Spotlight.getFirstChild(c);
						if (c) {
							return c;
						}
					}
				}
			}

			return null;
		},

		/**
		* Retrieves the next/previous spottable child from the generated controls,
		* starting from the given index.
		*
		* @private
		*/
		getNextSpottableChild: function (inDirection, inFocusedIndex) {
			var i,
				page,
				pageIndex,
				control,
				controlIndex,
				focusedIndex = this.getFocusedIndex(),
				pages = (inDirection === 1 && this.$.page1.index < this.$.page2.index || inDirection === -1 && this.$.page1.index > this.$.page2.index)
					? [this.$.page1, this.$.page2] : [this.$.page2, this.$.page1];

			// Explore the controls in the current pages
			for (pageIndex = 0; pageIndex < pages.length; pageIndex++) {
				page = pages[pageIndex];
				if (inDirection === 1) {
					// Loop through children in each page top-down
					for (i = 0; i < page.children.length; i++) {
						control = page.children[i];
						controlIndex = this.getIndexFromChild(control);
						// If we have already passed our current item or no item is selected, we can return the next spottable control
						if (controlIndex > focusedIndex || focusedIndex < 0) {
							if (enyo.Spotlight.isSpottable(control, false)) {
								return control;
							}
							control = enyo.Spotlight.getFirstChild(control);
							if (control) {
								return control;
							}
						}
					}
				} else if (inDirection === -1) {
					// Loop through children in each page bottom-up
					for (i = page.children.length - 1; i >= 0; i--) {
						control = page.children[i];
						controlIndex = this.getIndexFromChild(control);
						// If we have already passed our current item or no item is selected, we can return the next spottable control
						if (controlIndex < focusedIndex || focusedIndex < 0) {
							if (enyo.Spotlight.isSpottable(control, false)) {
								return control;
							}
							control = enyo.Spotlight.getFirstChild(control);
							if (control) {
								return control;
							}
						}
					}
				}
			}
			return null;
		},

		/**
		* @private
		*/
		getItemFromChild: function (oControl) {
			while (oControl) {
				if (oControl.index !== undefined) {
					return oControl;
				}
				oControl = oControl.parent;
			}
			return null;
		},

		/**
		* @private
		*/
		getIndexFromChild: function (oControl) {
			var item = this.getItemFromChild(oControl);
			return item ? item.index : -1;
		},

		/**
		* @private
		*/
		unspotAndRememberFocus: function () {
			var current = this.getFocusedChild(),
				focusedItem;
			if (current) {
				focusedItem = this.getItemFromChild(current);
				this._indexToFocus = focusedItem.index;
				this._subChildToFocus = focusedItem === current ? null : enyo.Spotlight.getChildren(focusedItem).indexOf(current);
				enyo.Spotlight.unspot();
			}
		},

		/**
		* @private
		*/
		restoreFocus: function () {
			var index = this._indexToFocus,
				subChild = this._subChildToFocus,
				c = this.collection;
			if (c && c.length && (index > -1)) {
				this.focusOnIndex(index, subChild);
				this._indexToFocus = -1;
				this._subChildToFocus = null;
			}
		},

		/**
		* @method
		* @private
		*/
		didResize: enyo.inherit(function (sup) {
			return function (sender, event) {
				this.unspotAndRememberFocus();
				sup.apply(this, arguments);
				this.restoreFocus();
			};
		}),

		/**
		* @method
		* @private
		*/
		modelsAdded: enyo.inherit(function (sup) {
			return function (c, e, props) {
				this.unspotAndRememberFocus();
				sup.apply(this, arguments);
				this.restoreFocus();
				// For specific case, page adjusting is required after models added
				this.needToAdjustPages = true;
			};
		}),

		/**
		* @method
		* @private
		*/
		modelsRemoved: enyo.inherit(function (sup) {
			return function (c, e, props) {
				this.unspotAndRememberFocus();
				sup.apply(this, arguments);
				this.restoreFocus();
			};
		})
	};

	/**
	* {@link moon.DataList} is an {@link enyo.DataList} with Moonstone styling
	* applied.  It uses {@link moon.Scroller} as its default scroller.
	*
	* @class moon.DataList
	* @extends enyo.DataList
	* @mixes moon.DataListSpotlightSupport
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.DataList.prototype */ {

		/**
		* @private
		*/
		name: 'moon.DataList',

		/**
		* @private
		*/
		kind: 'enyo.DataList',

		/**
		* @private
		*/
		mixins: ['moon.DataListSpotlightSupport'],

		/**
		* @private
		*/
		noDefer: true,

		/**
		* @private
		*/
		allowTransitions: false,

		/**
		* @private
		*/
		spotlight: true,

		/**
		* @private
		*/
		scrollerOptions: { kind: 'moon.Scroller', horizontal: 'hidden' }
	});

	/**
	* Overload the delegate strategy to incorporate measurements for our scrollers
	* when they are visible.
	*
	* @private
	*/
	(function (enyo, moon) {
		moon.DataList.delegates.vertical   = enyo.clone(moon.DataList.delegates.vertical);
		moon.DataList.delegates.horizontal = enyo.clone(moon.DataList.delegates.horizontal);
		var exts = {

			/**
			* @method
			* @private
			*/
			refresh: enyo.inherit(function (sup) {
				return function (list) {
					sup.apply(this, arguments);
					list.$.scroller.resize();
				};
			}),

			/**
			* @private
			*/
			scrollToIndex: enyo.inherit(function (sup) {
				return function(list, i) {
					var scrollerArgs = [false, false, true];
					sup.call(this, list, i, scrollerArgs);
				};
			})
		};
		enyo.kind.extendMethods(moon.DataList.delegates.vertical, exts, true);
		enyo.kind.extendMethods(moon.DataList.delegates.vertical, {

			/**
			* @method
			* @private
			*/
			reset: enyo.inherit(function (sup) {
				return function (list) {
					sup.apply(this, arguments);
					if (list.$.scroller.getVertical() != 'scroll') {
						this.updateBounds(list);
						list.refresh();
					}
					list.$.scroller.scrollTo(0, 0, false);
				};
			}),

			/**
			* @method
			* @private
			*/
			updateBounds: enyo.inherit(function (sup) {
				return function (list) {
					sup.apply(this, arguments);
					var w = list.boundsCache.width,
						b = list.$.scroller.getScrollBounds(),
						v = list.$.scroller.$.strategy.$.vColumn;
					if (v && (list.$.scroller.getVertical() == 'scroll' || (b.height > b.clientHeight))) {
						list.boundsCache.width = w-v.hasNode().offsetWidth;
					}
				};
			})
		}, true);
		enyo.kind.extendMethods(moon.DataList.delegates.horizontal, exts, true);
		enyo.kind.extendMethods(moon.DataList.delegates.horizontal, {

			/**
			* @method
			* @private
			*/
			reset: enyo.inherit(function (sup) {
				return function (list) {
					sup.apply(this, arguments);
					if (list.$.scroller.getHorizontal() != 'scroll') {
						this.updateBounds(list);
						list.refresh();
					}
					list.$.scroller.scrollTo(0, 0, false);
				};
			}),

			/**
			* @method
			* @private
			*/
			updateBounds: enyo.inherit(function (sup) {
				return function (list) {
					sup.apply(this, arguments);
					var w = list.boundsCache.height,
						b = list.$.scroller.getScrollBounds(),
						n = list.$.scroller.$.strategy.$.hColumn.hasNode();
					if (list.$.scroller.getVertical() == 'scroll' || (b.width > b.clientWidth)) {
						list.boundsCache.height = w-n.offsetHeight;
					}
				};
			})
		}, true);
	})(enyo, moon);
})(enyo, this);
