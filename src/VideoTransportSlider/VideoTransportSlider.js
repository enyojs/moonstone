/**
* Contains the declaration for the {@link module:moonstone/VideoTransportSlider~VideoTransportSlider} kind.
* @module moonstone/VideoTransportSlider
*/

require('moonstone');

var
	kind = require('enyo/kind'),
	dom = require('enyo/dom'),
	ri = require('enyo/resolution'),
	Control = require('enyo/Control'),
	Popup = require('enyo/Popup');

var
	Spotlight = require('spotlight');

var
	DurationFmt = require('enyo-ilib/DurationFmt'),
	Locale = require('enyo-ilib/Locale');

var
	Slider = require('moonstone/Slider'),
	VideoFeedback = require('../VideoFeedback');

var
	$L = require('../i18n'),
	defaultKnobIncrement = '5%';

/**
* The parameter [object]{@glossary Object} used when displaying a {@link module:moonstone/VideoFeedback~VideoFeedback}
* control.
*
* @typedef {Object} module:moonstone/VideoTransportSlider~VideoTransportSlider~FeedbackParameterObject
* @property {Number} [playbackRate] - The playback rate.
* @property {Number} [jumpSize] - The jump size.
* @public
*/

/**
* Fires when user starts dragging the video position knob. No additional data is
* provided in this event.
*
* @event module:moonstone/VideoTransportSlider~VideoTransportSlider#onSeekStart
* @type {Object}
* @public
*/

/**
* Fires when user changes the video position by tapping the bar.
*
* @event module:moonstone/VideoTransportSlider~VideoTransportSlider#onSeek
* @type {Object}
* @property {Number} value - The position to seek to.
* @public
*/

/**
* Fires when user stops dragging the video position knob.
*
* @event module:moonstone/VideoTransportSlider~VideoTransportSlider#onSeekFinish
* @type {Object}
* @property {Number} value - The position to seek to.
* @public
*/

/**
* Fires when cursor enters the tap area.
* Note. this event will be deprecated and replaced with #onSpotlightFocused
*
* @event module:moonstone/VideoTransportSlider~VideoTransportSlider#onEnterTapArea
* @type {Object}
* @public
*/

/**
* Fires when cursor leaves the tap area.
* Note. this event will be deprecated and replaced with #onSpotlightBlur
*
* @event module:moonstone/VideoTransportSlider~VideoTransportSlider#onLeaveTapArea
* @type {Object}
* @public
*/

/**
* {@link module:moonstone/VideoTransportSlider~VideoTransportSlider} extends {@link module:moonstone/Slider~Slider}, adding specialized
* behavior related to video playback.
*
* ```javascript
* var VideoTransportSlider = require('moonstone/VideoTransportSlider');
*
* {kind: VideoTransportSlider, value: 30}
* ```
*
* The [onSeekStart]{@link module:moonstone/VideoTransportSlider~VideoTransportSlider#onSeekStart} event is fired while
* the control knob is being dragged, the
* [onSeekFinish]{@link module:moonstone/VideoTransportSlider~VideoTransportSlider#onSeekFinish} event is fired when the
* drag finishes, and the [onSeek]{@link module:moonstone/VideoTransportSlider~VideoTransportSlider#onSeek} event is fired
* when the position is set by tapping the bar.
*
* @class VideoTransportSlider
* @extends module:moonstone/Slider~Slider
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/VideoTransportSlider~VideoTransportSlider.prototype */ {

	/**
	* @private
	*/
	name: 'moon.VideoTransportSlider',

	/**
	* @private
	*/
	kind: Slider,

	/**
	* @private
	*/
	classes: 'moon-video-player-transport-slider',

	/**
	* @private
	* @lends module:moonstone/VideoTransportSlider~VideoTransportSlider.prototype
	*/
	published: {

		/**
		* Starting point of slider.
		*
		* @type {Number}
		* @default 0
		* @public
		*/
		rangeStart: 0,

		/**
		* Ending point of slider.
		*
		* @type {Number}
		* @default 100
		* @public
		*/
		rangeEnd: 100,

		/**
		* Controls the slider draw.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		syncTick: true,

		/**
		* When `true`, label is shown at the start and end positions.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		showTickText: true,

		/**
		* When `true`, progress may extend past the hour markers.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		liveMode: false,

		/**
		* CSS classes to apply to background progress bar.
		*
		* @type {String}
		* @default 'bg-bar'
		* @public
		*/
		bgBarClasses: 'bg-bar',

		/**
		* CSS classes to apply to progress bar.
		*
		* @type {String}
		* @default 'bar-bar'
		* @public
		*/
		barClasses: 'bar-bar',

		/**
		* CSS classes to apply to popup label.
		*
		* @type {String}
		* @default 'popup-label'
		* @public
		*/
		popupLabelClasses: 'popup-label',

		/**
		* CSS classes to apply to knob.
		*
		* @type {String}
		* @default 'knob'
		* @public
		*/
		knobClasses: 'knob',

		/**
		* Color of value popup
		*
		* @type {String}
		* @default '#fff'
		* @public
		*/
		popupColor: '#4B4B4B',

		/**
		* Popup offset in pixels.
		*
		* @type {Number}
		* @default 144 - controls height(132) + margin (12)
		* @public
		*/
		popupOffset: 144,

		/**
		* Threshold value (percentage) for using animation effect on slider progress change.
		*
		* @type {Number}
		* @default 1
		* @public
		*/
		smallVariation: 1,

		/**
		* Popup height in pixels.
		*
		* @type {Number}
		* @default 67
		* @public
		*/
		popupHeight: 48,

		/**
		* Sliders will increase or decrease as much as knobIncrement in either direction
		* when left or right key is pressed in 5-way mode.
		* If you'd like to use a specific value instead of a percentage,
		* specify the value in this property when you instantiate the VideoPlayer.
		*
		* @type {Number|String}
		* @default '5%'
		* @public
		*/
		knobIncrement: defaultKnobIncrement
	},

	/**
	* @private
	*/
	handlers: {
		onresize: 'handleResize',
		onSpotlightKeyDown: 'spotlightKeyDownHandler',
		onmove: 'preview'
	},

	/**
	* @private
	*/
	events: {
		onSeekStart: '',
		onSeek: '',
		onSeekFinish: '',
		onEnterTapArea: '',
		onLeaveTapArea: ''
	},

	/**
	* @private
	*/
	tickComponents: [
		{name: 'startWrapper', classes: 'indicator-wrapper start', components: [
			{name: 'beginTickText', classes: 'indicator-text left', content: '00:00'}
		]},
		{name: 'endWrapper', classes: 'indicator-wrapper end', components: [
			{name: 'endTickText', classes: 'indicator-text right', content: '00:00'}
		]}
	],

	/**
	* @private
	*/
	popupComponents: [
		{name: 'popup', kind: Popup, classes: 'moon-slider-popup above status-indicator', accessibilityDisabled: true, components: [
			{name: 'popupLabel', classes: 'moon-slider-popup-center' }
		]}
	],
	/**
	* @private
	*/
	popupLabelComponents: [
		{name: 'feedback', kind: VideoFeedback, showing:false},
		{name: 'popupLabelText', kind: Control}
	],

	/**
	* @private
	*/
	_previewMode: false,

	/**
	* @private
	*/
	_enterEnable: false,

	/**
	* @private
	*/
	createPopup: function () {
		this.createComponents(this.popupComponents);
	},

	/**
	* @private
	*/
	create: function () {
		Slider.prototype.create.apply(this, arguments);
		this.$.popup.setAutoDismiss(false);		//* Always showing popup
		this.$.popup.captureEvents = false;		//* Hot fix for bad originator on tap, drag ...

		//* Extend components
		this.createTickComponents();
		this.createPopupLabelComponents();
		this.showTickTextChanged();
		this.knobIncrementChanged();

		this.durfmt = new DurationFmt({length: 'medium', style: 'clock', useNative: false});
		this.$.beginTickText.setContent(this.formatTime(0));

		var loc = new Locale(),
			language = loc.getLanguage(),
			// Hash of languages and the additional % widths they'll need to not run off the edge.
			langWidths = {
				ja: 0.05,
				pt: 0.05,
				vi: 0.02
			};

		if (langWidths[language]) {
			//Todo. Instead of adjust begin or end postion, find proper way tpo conpensate language matter
			//move begin position to right as much as langWidths[language]
			//move end position to left as much as langWidths[language] );
		}
	},

	/**
	* Ugly to need to do this but avoid the overhead of calculations used wastefully by this
	* method in ProgressBar (not needed since this kind overloads the child components).
	*
	* @private
	*/
	drawToCanvas: function () {
		// nop
	},

	/**
	* @private
	*/
	createTickComponents: function () {
		this.createComponents(this.tickComponents, {owner: this, addBefore: this.$.knob});
	},

	/**
	* @private
	*/
	createPopupLabelComponents: function () {
		this.$.popupLabel.createComponents(this.popupLabelComponents, {owner: this});
		this.currentTime = 0;
	},

	/**
	* If user presses enter on `this.$.tapArea`, seeks to that point.
	*
	* @private
	*/
	spotlightKeyDownHandler: function (sender, e) {
		var val;
		if (this.tappable && !this.disabled && e.keyCode == 13) {
			this.set('knobSelected', true);
			this.startJob('simulateTapEnd', function () {
				this.set('knobSelected', false);
			}, 200);
			val = this.transformToVideo(this.knobPosValue);
			this.sendSeekEvent(val);
			this.set('_enterEnable', true);
			return true;
		}
	},

	/**
	* @private
	*/
	spotFocused: function (sender, e) {
		Slider.prototype.spotFocused.apply(this, arguments);
		if (!this.disabled) {
			this.spotSelect();
			// this.knobPosValue will be used for knob positioning.
			this.knobPosValue = this.get('value');
			// Todo: visible does not mean slider is visible. it means knob is visible
			// we'd better change its name to preview or more intuitive name
			this.addClass('visible');
			//fires enyo.VideoTransportSlider#onEnterTapArea
			this.doEnterTapArea();
		}

		// if slider is in preview mode, preview() will update knobPosition
		if (!Spotlight.getPointerMode()) {
			this._updateKnobPosition(this.knobPosValue);
		}
		this.startPreview();
	},

	/**
	* @private
	*/
	spotSelect: function () {
		this.selected = true;
		return true;
	},

	/**
	* @private
	*/
	spotBlur: function () {
		this.set('_enterEnable', false);
		this.selected = false;
		this.removeClass('visible');
		this.endPreview();
		//fires enyo.VideoTransportSlider#onLeaveTapArea
		this.doLeaveTapArea();
	},

	/**
	* @private
	*/
	spotLeft: function (sender, e) {
		if (this.selected && this.knobPosValue > this.min) {
			// If in the process of animating, work from the previously set value
			var v = this.clampValue(this.min, this.max, this.knobPosValue || this.getValue());
			v = (v - this._knobIncrement < this.min) ? this.min : v - this._knobIncrement;
			this._updateKnobPosition(v);
			this.set('knobPosValue', v);
			this.set('_enterEnable', false);
		}
		return true;
	},

	/**
	* @private
	*/
	spotRight: function (sender, e) {
		if (this.selected && this.knobPosValue < this.max - 1) {
			var value = (typeof this.knobPosValue != 'undefined') ? this.knobPosValue : this.getValue(),
				v = this.clampValue(this.min, this.max, value);
			v = (v + this._knobIncrement > this.max) ? this.max - 1 : v + this._knobIncrement;
			this._updateKnobPosition(v);
			this.set('knobPosValue', v);
			this.set('_enterEnable', false);
		}
		return true;
	},

	/**
	* @private
	*/
	knobIncrementChanged: function () {
		var increment = this.knobIncrement || defaultKnobIncrement;

		if (typeof increment == 'number' && increment > 0) {
			this._knobIncrement = increment;
		} else {
			if (typeof increment != 'string' || increment.charAt(increment.length - 1) != '%') {
				increment = defaultKnobIncrement;
			}
			this._knobIncrement = (this.max - this.min) * increment.substr(0, increment.length - 1) / 100;
		}
	},

	/**
	* onmove event handler. When mouse moves on slider, it will update knob's position
	*
	* @private
	*/
	preview: function (sender, e) {
		if (!this.disabled && !this.dragging) {
			if (!this._previewMode) {
				this.startPreview();
			}
			var v = this.knobPosValue = this.calcKnobPosition(e);
			this.currentTime = this.transformToVideo(v);
			this._updateKnobPosition(this.currentTime);
		}
	},

	/**
	* @private
	*/
	startPreview: function (sender, e) {
		this._previewMode = true;
		this.$.feedback.setShowing(false);
	},

	/**
	* @private
	*/
	endPreview: function (sender, e) {
		this._previewMode = false;
		this.updatePopupLabel(this.value);
		if (this.$.feedback.isPersistShowing()) {
			this.$.feedback.setShowing(true);
		}
	},

	/**
	* @private
	*/
	isInPreview: function (sender, e) {
		return this._previewMode;
	},

	/**
	* @private
	*/
	handleResize: function () {
		Slider.prototype.handleResize.apply(this, arguments);
		this.updateSliderRange();
	},

	/**
	* @private
	*/
	updateSliderRange: function () {
		this.setRangeStart(this.min);
		this.setRangeEnd(this.max);

		if (this.dragging || !this.isInPreview()) {
			this._updateKnobPosition(this.value);
		}
	},

	/**
	* @private
	*/
	setMin: function () {
		Slider.prototype.setMin.apply(this, arguments);
		this.knobIncrementChanged();
		this.updateSliderRange();
	},

	/**
	* @private
	*/
	setMax: function () {
		Slider.prototype.setMax.apply(this, arguments);
		this.knobIncrementChanged();
		this.updateSliderRange();
	},

	/**
	* @private
	*/
	setRangeStart: function (val) {
		this.rangeStart = this.clampValue(this.getMin(), this.getMax(), val);
		this.rangeStartChanged();
	},

	/**
	* @private
	*/
	setRangeEnd: function (val) {
		this.rangeEnd = this.clampValue(this.getMin(), this.getMax(), val);
		this.rangeEndChanged();
	},

	/**
	* @private
	*/
	knobSelectedChanged: function () {
		Slider.prototype.knobSelectedChanged.apply(this, arguments);
		this.addRemoveClass('pressed', this.knobSelected);
	},

	/**
	* @private
	*/
	showTickTextChanged: function () {
		this.$.beginTickText.setShowing(this.getShowTickText());
		this.$.endTickText.setShowing(this.getShowTickText());
	},

	/**
	* @private
	*/
	rangeStartChanged: function () {
		this.updateInternalProperty();
		var p = this._calcPercent(this.rangeStart),
			property = 'margin-left';
		if (this.liveMode) {
			property = 'padding-left';
		}
		this.$.bar.applyStyle(property, p + '%');
		this.$.bgbar.applyStyle(property, p + '%');
	},

	/**
	* @private
	*/
	rangeEndChanged: function () {
		this.updateInternalProperty();
	},

	/**
	* @private
	*/
	updateInternalProperty: function () {
		this.updateScale();
		this.progressChanged();
		this.bgProgressChanged();
	},
	//* Sets value of hidden variable, _scaleFactor_.
	updateScale: function () {
		this.scaleFactor = (this.rangeEnd-this.rangeStart)/(this.max-this.min);
	},

	/**
	* @private
	*/
	calcPercent: function (val) {
		return (this.calcRatio(val) * 100) * this.scaleFactor;
	},

	/**
	* @private
	*/
	_calcPercent: function (val) {
		return this.calcRatio(val) * 100;
	},

	/**
	* @private
	*/
	calcVariationRatio: function (val, currentVal) {
		return (val - currentVal) / (this.max - this.min);
	},

	/**
	* @private
	*/
	calcVariationPercent: function (val, currentVal) {
		return this.calcVariationRatio(val, currentVal) * 100;
	},

	/**
	* Override Slider.updateKnobPosition to only update the popupLabelText
	*
	* @private
	*/
	updateKnobPosition: function (val) {
		if (this.dragging) {
			this.updatePopupLabel(this.currentTime);
		} else if (!this.isInPreview()) {
			this.updatePopupLabel(val);
		}
	},

	/**
	* Calculate slider knob's position and apply it.
	*
	* @private
	*/
	_updateKnobPosition: function (val) {
		// If knob is visible, we need update its current position
		if (this.hasClass('visible')) {
			var p = this.clampValue(this.min, this.max, val);
			p = this._calcPercent(p);
			var slider = this.inverseToSlider(p);
			this.$.knob.applyStyle('left', slider + '%');
		}

		this.updatePopupLabel(val);
	},

	/**
	* Override default behavior
	*
	* @private
	*/
	updatePopupLabel: function (timeVal) {
		if (Spotlight.getCurrent() === this) {
			this.$.popupLabelText.setContent(this.formatTime(timeVal));
		} else if (this.currentTime !== undefined) {
			this.$.popupLabelText.setContent(this.formatTime(this.currentTime));
		}
	},

	/**
	* @private
	*/
	inverseToSlider: function (percent) {
		var val = this.scaleFactor * percent + this._calcPercent(this.rangeStart);
		return val;
	},

	/**
	* @private
	*/
	transformToVideo: function (val) {
		val = this.clampValue(this.getMin(), this.getMax(), val);
		return (val - this.rangeStart) / this.scaleFactor;
	},

	/**
	* If user presses `slider`, seeks to that point.
	*
	* @private
	*/
	tap: function (sender, e) {
		var val;
		if (this.tappable && !this.disabled) {
			val = this.transformToVideo(this.calcKnobPosition(e));
			this.sendSeekEvent(val);
			return true;
		}
	},

	/**
	* @private
	*/
	setValue: function (val) {
		this.currentTime = val;
		if (Math.abs(this.calcVariationPercent(val, this.value)) > this.smallVariation ||
			this.calcVariationPercent(this.max, val) < this.smallVariation) {
			Slider.prototype.setValue.apply(this, arguments);
		} else {
			this._setValue(val);
		}
		this._updateBeginText(val);
	},

	/**
	* @private
	*/
	_updateBeginText: function (val) {
		var v = this.clampValue(this.min, this.max, val);
		this.$.beginTickText.setContent(this.formatTime(v));
	},

	/**
	* If `dragstart`, bubbles [onSeekStart]{@link module:moonstone/VideoTransportSlider~VideoTransportSlider#onSeekStart}
	* event.
	*
	* @fires module:moonstone/VideoTransportSlider~VideoTransportSlider#onSeekStart
	* @private
	*/
	dragstart: function (sender, e) {
		if (this.disabled) {
			return; // return nothing
		}

		// the call to the super class freezes spotlight, so it needs to be unfrozen in dragfinish
		var dragstart = Slider.prototype.dragstart.apply(this, arguments);
		if (dragstart) {
			this.doSeekStart();
		}

		return true;
	},

	/**
	* If `drag`, bubbles [onSeek]{@link module:moonstone/VideoTransportSlider~VideoTransportSlider#onSeek} event and
	* overrides parent `drag` handler.
	*
	* @private
	*/
	drag: function (sender, e) {
		if (this.dragging) {
			var v = this.calcKnobPosition(e);

			//* Default behavior to support elastic effect
			v = this.transformToVideo(v);
			if (this.constrainToBgProgress === true) {
				v = (this.increment) ? this.calcConstrainedIncrement(v) : v;
				var ev = this.bgProgress + (v-this.bgProgress)*0.4;
				v = this.clampValue(this.min, this.bgProgress, v);
				this.elasticFrom = (this.elasticEffect === false || this.bgProgress > v) ? v : ev;
				this.elasticTo = v;
			} else {
				v = (this.increment) ? this.calcIncrement(v) : v;
				v = this.clampValue(this.min, this.max, v);
				this.elasticFrom = this.elasticTo = v;
			}
			this.currentTime = v;
			this._updateKnobPosition(this.elasticFrom);

			if (this.lockBar) {
				this.setProgress(this.elasticFrom);
				this.sendChangingEvent({value: this.elasticFrom});
				this.sendSeekEvent(this.elasticFrom);
			}
			return true;
		}
	},

	/**
	* @private
	*/
	dragfinish: function (sender, e) {
		if (this.disabled) {
			return;
		}
		this.cleanUpDrag(e);
		e.preventTap();
		return true;
	},

	/**
	* @fires module:moonstone/VideoTransportSlider~VideoTransportSlider#onSeekFinish
	* @private
	*/
	cleanUpDrag: function (ev) {
		var v, z;
		if (this.get('dragging')) {
			if (ev) {
				v = this.calcKnobPosition(ev);
				v = this.transformToVideo(v);
			} else { // use the last known-good time value (i.e. from the last drag event)
				v = this.currentTime;
			}
			z = this.elasticTo;
			if (this.constrainToBgProgress === true) {
				z = (this.increment) ? this.calcConstrainedIncrement(z) : z;
				this.animateTo(this.elasticFrom, z);
				v = z;
			} else {
				v = (this.increment) ? this.calcIncrement(v) : v;
				this._setValue(v);
			}
			this.doSeekFinish({value: v});
			Spotlight.unfreeze();

			this.endPreview();

			this.$.knob.removeClass('active');
			this.set('dragging', false);
		}
	},

	/**
	* @private
	*/
	showingChangedHandler: function (sender, ev) {
		Slider.prototype.showingChangedHandler.apply(this, arguments);
		if (!ev.showing) {
			this.cleanUpDrag(); // clean-up any in-progress drags, if we (or an ancestor) is hidden
		}
	},

	/**
	* Sends [onSeek]{@link module:moonstone/VideoTransportSlider~VideoTransportSlider#onSeek} event.
	*
	* @fires module:moonstone/VideoTransportSlider~VideoTransportSlider#onSeek
	* @private
	*/
	sendSeekEvent: function (val) {
		this.doSeek({value: val});
	},

	/**
	* During time update, updates buffered progress, canvas and video currentTime
	*
	* @private
	*/
	timeUpdate: function (val) {
		if (!this.dragging && this.isInPreview()) { return; }
		this.currentTime = val;
	},

	/**
	* @private
	*/
	durationUpdate: function (val) {
		this.duration = val;
		this.$.endTickText.setContent(this.formatTime(this.duration));
	},

	/**
	* Properly formats time.
	*
	* @private
	*/
	formatTime: function (val) {
		var hour = Math.floor(val / (60*60));
		var min = Math.floor((val / 60) % 60);
		var sec = Math.floor(val % 60);
		var time = {minute: min, second: sec};
		if (hour) {
			time.hour = hour;
		}
		return this.durfmt.format(time);
	},

	/**
	* Time formatting helper.
	*
	* @private
	*/
	padDigit: function (val) {
		return (val) ? (String(val).length < 2) ? '0'+val : val : '00';
	},

	/**
	* Sends current status to [feedback]{@link module:moonstone/VideoFeedback~VideoFeedback} control in response to
	* user input.
	*
	* @param {String} msg - The string to display.
	* @param {module:moonstone/VideoTransportSlider~VideoTransportSlider~FeedbackParameterObject} params - A
	*	[hash]{@glossary Object} of parameters that accompany the message.
	* @param {Boolean} persist - If `true`, the [feedback]{@link module:moonstone/VideoFeedback~VideoFeedback} control will
	*	not be automatically hidden.
	* @param {String} leftSrc - The source url for the image displayed on the left side of
	*	the feedback control.
	* @param {String} rightSrc - The source url for the image displayed on the right side
	*	of the feedback control.
	* @public
	*/
	feedback: function (msg, params, persist, leftSrc, rightSrc) {
		this.showKnobStatus();
		this.$.feedback.feedback(msg, params, persist, leftSrc, rightSrc, this.isInPreview());
	},

	/**
	* Override of [updatePopup]{@link module:moonstone/ProgressBar~ProgressBar#updatePopup}
	* this method is called when progess updated but from Slider, we use value instead of progress
	*
	* @private
	*/
	updatePopup: function (val) {
		return true;
	},

	/**
	* @private
	*/
	updatePopupHeight: function () {
		var h = this.getPopupHeight();
		this.$.popupLabel.applyStyle('height', dom.unit(ri.scale(h), 'rem'));
	},

	/**
	* @private
	*/
	updatePopupOffset: function () {
		this.$.popup.applyStyle('top', dom.unit(-(ri.scale(this.getPopupHeight() + this.getPopupOffset())), 'rem'));
	},

	// Accessibility

	/**
	* When `true`, VoiceReadout will be prevented.
	*
	* @default true
	* @type {Boolean}
	* @public
	*/
	accessibilityDisabled: true,

	/**
	* @private
	*/
	ariaObservers: [
		{path: 'selected', method: function() {
			if (this.selected) {
				this.set('accessibilityRole', 'slider');
				this.set('accessibilityLive', null);
				this.set('accessibilityHint', null);
			} else {
				this.setAriaAttribute('aria-valuetext', null);
			}
		}},
		{path: ['$.popupLabelText.content', '_enterEnable'], method: 'ariaValue'}
	],

	/**
	* Overriding {@link module:moonstone/ProgressBar~ProgressBar#ariaValue} to guard updating value
	* when dragging.
	*
	* @private
	*/
	ariaValue: function () {
		var valueText;
		if (this.showing && !Spotlight.getPointerMode() && this.$.popupLabelText && this.$.popupLabelText.content && this.selected) {
			valueText = this._enterEnable ? this.$.popupLabelText.content : $L('jump to ') + this.$.popupLabelText.content;
			// Screen reader should read valueText when slider is only spotlight focused, but there is a timing issue between spotlight focus and observed
			// popupLabelText's content, so Screen reader reads valueText twice. We added below timer code for preventing this issue.
			setTimeout(this.bindSafely(function(){
				this.set('accessibilityDisabled', false);
				this.setAriaAttribute('aria-valuetext', valueText);
			}), 0);
		} else {
			this.set('accessibilityDisabled', true);
		}
	}
});
