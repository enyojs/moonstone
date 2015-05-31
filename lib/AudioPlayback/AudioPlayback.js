require('moonstone');

/**
* Contains the declaration for the {@link moon.AudioPlayback} kind.
* @module moonstone/AudioPlayback
*/

var
	kind = require('enyo/kind'),
	utils = require('enyo/utils'),
	EnyoAudio = require('enyo/Audio'),
	Signals = require('enyo/Signals'),
	EventEmitter = require('enyo/EventEmitter'),
	Model = require('enyo/Model');


var
	Drawer = require('moonstone/Drawer'),
	IconButton = require('moonstone/IconButton'),
	Image = require('moonstone/Image'),
	Slider = require('moonstone/Slider'),
	Scroller = require('moonstone/Scroller'),
	Marquee = require('moonstone/Marquee');

/**
* Fires when an audio track is added to the list
*
* @event moon.AudioPlayback#onAddAudio
* @type {Object}
* @property {Object} tracks - contains a reference to the collection of tracks
* @public
*/

/**
* Fires when an audio list item is to be removed. The list event data is passed through.
* TODO: When fixed with right list component be sure to link to event data.
*
* @event moon.AudioPlayback#onRemove
* @type {Object}
* @public
*/

/**
* `moon.AudioPlayback` is meant to be used with {@link moon.Drawers}.
* This extends a {@link moon.Drawer} by adding an audio playback control
* and playlist for the imported audio.
*
* ```
* {kind:'moon.Drawers', drawers:[
* 	{
* 		kind: 'moon.AudioPlayback',
* 	}
* ],
* components: [
* 	{content: 'Page Content'}
* ]}
* ```
*
* @class moon.AudioPlayback
* @extends moon.Drawer
* @ui
* @definedby module:moonstone/AudioPlayback
* @public
*/
module.exports = kind(
	/** @lends moon.AudioPlayback.prototype */ {

	/**
	* @private
	*/
	name: 'moon.AudioPlayback',

	/**
	* @private
	*/
	kind: Drawer,

	mixins: [ EventEmitter ],

	/**
	* @private
	*/
	classes: 'moon-audio-playback',

	/**
	* @private
	*/
	open: false,

	/**
	* @private
	*/
	controlsOpen: false,

	/**
	* @private
	*/
	controlDrawerComponents:[],

	/**
	* @private
	*/
	playheadJob: null,

	/**
	* @protected
	*/
	playheadUpdateInterval: 200,

	/**
	* @private
	*/
	previewMode: false,

	/**
	* @private
	*/
	model: null,

	/**
	* @private
	* @lends moon.AudioPlayback.prototype
	*/
	published: {
		/**
		* When 'false', audio player doesn't respond to remote controller
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		handleRemoteControlKey: true,

		/**
		* When 'true', update current time while drag slider
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		liveMode: false,

		/**
		* Amount of time (in seconds) to jump in response to jump buttons. This value is ignored
		* when [jumpStartEnd]{@link moon.VideoPlayer#jumpStartEnd} is `true`.
		*
		* @type {Number}
		* @default 5
		* @public
		*/
		jumpSec: 5,

		/**
		* If `true`, the "jump forward" and "jump back" buttons jump to the start and end of the
		* video, respectively.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		jumpStartEnd: false,

		/**
		* If `false`, the "jump forward" and "jump back" buttons are hidden.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		showJumpControls: true,

		/**
		* When `true`, the fast-forward and rewind buttons are visible.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		showFFRewindControls: true,

		/**
		* If `true`, the slider is disabled and will not be enabled when video data has
		* loaded.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		disableSlider: false,

		/**
		* If `true`, the slider and playback controls are disabled. If the user taps the
		* controls, an
		* [onPlaybackControlsTapped]{@link moon.VideoPlayer#onPlaybackControlsTapped}
		* event will be bubbled.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		disablePlaybackControls: false,

		/**
		* When `true`, playback controls are hidden when the slider is hovered over.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		hideButtonsOnSlider: false,

		/**
		* Default hash of playback states and their associated playback rates.
		* playbackRateHash: {
		*	fastForward: ['2', '4', '8', '16'],
		*	rewind: ['-2', '-4', '-8', '-16'],
		*	slowForward: ['1/4', '1/2'],
		*	slowRewind: ['-1/2', '-1']
		* }
		*
		* @public
		*/
		playbackRateHash: {
			fastForward: ['2', '4', '8', '16'],
			rewind: ['-2', '-4', '-8', '-16'],
			slowForward: ['1/4', '1/2', '1'],
			slowRewind: ['-1/2', '-1']
		}
	},

	/**
	* @private
	*/
	mediaComponents: [
		{name: 'media', kind: EnyoAudio, onStart: 'onPlayStart', onEnded: 'onPlayEnd', onError: 'onPlayError',
			onSlowforward: 'updateFeedback', onFastforward: 'updateFeedback', onSlowrewind: 'updateFeedback', onRewind: 'updateFeedback', onPlay: 'updateFeedback'},
		{kind: Signals, onkeyup: 'remoteKeyHandler', onSpotlightModeChanged: 'spotlightModeChanged'},
		{rtl: false, classes: 'moon-audio-playback-controls', spotlight: 'container', components: [
			{name: 'playbackControls', rtl: false, classes: 'moon-audio-playback-top', components: [
				{name: 'trackIcon', kind: Image, sizing: 'cover', classes: 'moon-audio-track-icon'},
				{name: 'trackInfo', mixins: [ Marquee.Support ], marqueeOnRender: true, classes: 'moon-audio-track-info', components: [
					{name: 'trackName', publish: true, kind: Marquee.Text, classes: 'moon-audio-playback-track'},
					{name: 'artistName', publish: true, kind: Marquee.Text, classes: 'moon-audio-playback-artist'}
				]},
				{name: 'commandControls', classes: 'moon-audio-control-buttons', components: [
					{name: 'btnJumpBackward', kind: IconButton, publish: true, icon: 'skipbackward', small: false, command: 'jumpBackward', classes: 'moon-audio-icon-button left', ontap: 'commandHandler', onholdpulse: 'holdBackwardHandler', onrelease: 'releaseHandler'},
					{name: 'btnRewind', kind: IconButton, publish: true, icon: 'backward', small: false, command: 'rewind', classes: 'moon-audio-icon-button left', ontap: 'commandHandler'},
					{name: 'btnPlay',  kind: IconButton, publish: true, icon: 'play', small: false, command: 'togglePlay', classes: 'moon-audio-icon-button left', ontap: 'commandHandler'},
					{name: 'btnFastForward', kind: IconButton, publish: true, icon: 'forward', small: false, command: 'fastForward', classes: 'moon-audio-icon-button left', ontap: 'commandHandler'},
					{name: 'btnJumpForward', kind: IconButton, publish: true, icon: 'skipforward', small: false, command: 'jumpForward', classes: 'moon-audio-icon-button left', ontap: 'commandHandler', onholdpulse: 'holdForwardHandler', onrelease: 'releaseHandler'}
				]},
				{kind: Scroller, hideScrollColumnsWhenFit: true, vertical: 'hidden', name: 'moreControls', classes: 'moon-audio-more-buttons'}
			]},
			{rtl: false, classes: 'moon-audio-playback-bottom', components: [
				{kind: Slider, enableJumpIncrement: false, spotlight: false, name: 'slider', classes: 'moon-audio-slider', 
				knobClasses: 'moon-audio-slider-knob', bgBarClasses: 'moon-audio-slider-bg-bar', 
				barClasses: 'moon-audio-slider-bar-bar', tapAreaClasses: 'moon-audio-slider-taparea',
				rtl: false, noPopup: true, lockBar: true, onChanging: 'sliderChanging', onAnimateFinish: 'sliderChanging',
				onmove: 'preview', onenter: 'enterTapArea', onleave: 'leaveTapArea'},
				{name: 'timePlayed', classes: 'moon-audio-play-time left', content: '0:00'},
				{name: 'timeRemaining', classes: 'moon-audio-play-time right', content: '0:00'}
			]}
		]}
	],

	/**
	* @private
	*/
	observers: [
		{method: 'modelChanged', path: ['model']}
	],

	/**
	* @private
	*/
	bindings: [
		{from: 'showJumpControls', to: '$.btnJumpBackward.showing'},
		{from: 'showJumpControls', to: '$.btnJumpForward.showing'},
		{from: 'showFFRewindControls', to: '$.btnRewind.showing'},
		{from: 'showFFRewindControls', to: '$.btnFastForward.showing'},
		{from: 'disableSlider', to: '$.slider.disabled'},
		{from: 'disablePlaybackControls', to: '$.btnJumpBackward.disabled'},
		{from: 'disablePlaybackControls', to: '$.btnJumpForward.disabled'},
		{from: 'disablePlaybackControls', to: '$.btnRewind.disabled'},
		{from: 'disablePlaybackControls', to: '$.btnFastForward.disabled'},
		{from: 'disablePlaybackControls', to: '$.btnPlay.disabled'},
		{from: 'jumpSec', to: '$.media.jumpSec'},
		{from: '$.client.open', to: 'clientOpen', oneWay: false}
	],

	/**
	* @private
	*/
	create: function () {
		this.inherited(arguments);
		this.$.controlDrawer.createComponents(this.mediaComponents, {owner: this});
		if (this.moreComponents) {
			var owner = this.hasOwnProperty('moreComponents') ? this.getInstanceOwner() : this;
			this.$.moreControls.createComponents(this.moreComponents, {owner: owner, ontap: 'commandHandler'});
		}
		this.playbackRateHashChanged();
	},

	/**
	* Facade playbackRateHash.
	* @private
	*/
	playbackRateHashChanged: function() {
		this.$.media.playbackRateHash = this.playbackRateHash;
	},

	/** preview mode */

	/**
	* @private
	*/
	enterTapArea: function (sender, event) {
		if (event.originator.name == 'tapArea') {
			this.startPreview();
			if (!this.$.slider.disabled && this.hideButtonsOnSlider) {
				this.$.playbackControls.setShowing(false);
			}
		}
	},

	/**
	* @private
	*/
	leaveTapArea: function (sender, event) {
		if (event.originator.name == 'tapArea') {
			this.endPreview();
			if (!this.$.slider.disabled && this.hideButtonsOnSlider) {
				this.$.playbackControls.setShowing(true);
			}
		}
	},

	/**
	* @private
	*/
	startPreview: function () {
		this.previewMode = true;
		if (!this.$.slider.disabled) {
			this.$.slider.addClass('visible');
		}
	},
	
	/**
	* @private
	*/
	endPreview: function () {
		this.previewMode = false;
		this.$.slider.removeClass('visible');
		this.updatePlayhead();
	},

	/**
	* @private
	*/
	preview: function (sender, event) {
		if (!this.$.slider.disabled) {
			if (!this.previewMode) {
				this.startPreview();
			}
			this.previewPos = this.$.slider.calcKnobPosition(event);
			this.updatePlayhead();
		}
	},

	/**
	* Force end preview mode when user press 5way while dragging
	* @private
	*/
	spotlightModeChanged: function (sender, event) {
		if (this.dragging && !event.pointerMode) {
			this.endPreview();
			this.updatePlayhead();
		}
	},

	/**
	* @private
	*/
	startPlayheadJob: function () {
		if (this.playheadJob === null) {
			this.playheadJob = setInterval(this.bindSafely('updatePlayhead'), this.playheadUpdateInterval);
		}
	},

	/**
	* @private
	*/
	endPlayheadJob: function () {
		clearInterval(this.playheadJob);
		this.playheadJob = null;
		this.updatePlayhead();
	},

	/**
	* Setup playing property
	*
	* Use this property to show now playing item on datalist
	*
	* @private
	*/
	modelChanged: function (prev, curr) {
		if (prev) prev.set('playing', false);
		if (curr) {
			curr.set('playing', true);
			this.setTrack(curr.get('src'), curr.get('albumArt'), curr.get('trackName'), curr.get('artistName'));
		} else {
			this.setTrack('', '', '', '');
		}
	},

	/**
	* @public
	*/
	getDuration: function () {
		return this.$.media.getDuration();
	},

	/**
	* @public
	*/
	getCurrentTime: function () {
		return this.$.media.getCurrentTime();
	},

	/**
	* @private
	*/
	updatePlayhead: function () {
		var totalTime = this.getDuration(),
			currentTime = this.getCurrentTime(),
			bufferTime = this.getBufferedTime(),
			playheadPos, bufferheadPos;

		totalTime = isNaN(totalTime) ? 0 : totalTime;
		currentTime = isNaN(currentTime) ? 0 : currentTime;

		playheadPos = (totalTime == 0) ? 0 : (currentTime * 100) / totalTime;
		bufferheadPos = (bufferTime == 0) ? 0 : (bufferTime * 100) / totalTime;

		this.$.slider.setProgress(playheadPos);
		this.$.slider.setBgProgress(bufferheadPos);

		// Calculate currentTime from cursor position in previewMode
		if (!this.$.slider.disabled && this.previewMode) {
			playheadPos = this.previewPos;
			currentTime = (playheadPos / 100) * totalTime;
		}

		this.updatePlayTime(this.toReadableTime(currentTime), this.toReadableTime(totalTime));
		this.$.slider.updateKnobPosition(playheadPos);
	},

	/**
	* @private
	*/
	getBufferedTime: function() {
		var bufferData = this.$.media.getBuffered(),
			numberOfBuffers = bufferData.length,
			highestBufferPoint = 0,
			duration = this.getDuration() || 0,
			endPoint = 0,
			i
		;

		if (duration === 0 || isNaN(duration)) {
			return 0;
		}

		// Find furthest along buffer end point and use that (only supporting one buffer range for now)
		for (i = 0; i < numberOfBuffers; i++) {
			endPoint = bufferData.end(i);
			highestBufferPoint = (endPoint > highestBufferPoint) ? endPoint : highestBufferPoint;
		}
		return highestBufferPoint;
	},

	/**
	* @private
	*/
	updatePlayTime: function (start, end) {
		this.$.timePlayed.setContent(start);
		this.$.timeRemaining.setContent(end);
	},

	/**
	* @private
	*/
	sliderChanging: function (sender, event) {
		if (!this.liveMode && event.type == 'onChanging') return;
		var totalTime = this.getDuration();
		var currentTime = (totalTime / 100) * event.value;
		this.updatePlayTime(this.toReadableTime(currentTime), this.toReadableTime(totalTime));
		this.seekTo(currentTime);
	},



	/*******      Public APIs      ******/

	/**
	* setup track information
	*
	* @public
	*/
	setTrack: function (src, albumArt, trackName, artistName) {
		this.$.media.setSrc(src);
		this.$.trackIcon.setSrc(albumArt);
		this.$.trackName.setContent(trackName);
		this.$.artistName.setContent(artistName);
		this.updatePlayhead();
		this.updatePlayTime('0:00', '0:00');
		this.$.btnPlay.setIcon('play');
	},

	/**
	* pauses audio if is playing, and plays it if it is paused
	*
	* @public
	*/
	togglePlay: function () {
		if (!this.$.media.getPaused()) {
			this.pause();
		} else {
			this.play();
		}
	},

	/**
	* plays audio
	*
	* @public
	*/
	play: function () {
		if (!this.$.media.get('src')) return;
		this.$.media.play();
		this.startPlayheadJob();
		this.$.btnPlay.setIcon('pause');
	},

	/**
	* pauses audio
	*
	* @public
	*/
	pause: function () {
		if (!this.$.media.get('src')) return;
		this.$.media.pause();
		this.endPlayheadJob();
		this.$.btnPlay.setIcon('play');
	},

	/**
	* stop audio
	*
	* @public
	*/
	stop: function () {
		if (!this.$.media.get('src')) return;
		this.$.media.pause();
		this.seekTo(0);
		this.endPlayheadJob();
		this.updatePlayhead();
		this.$.btnPlay.setIcon('play');
	},

	/**
	* seek position
	*
	* @public
	*/
	seekTo: function (value) {
		this.$.media.seekTo(value);
	},

	/**
	* plays the track previous to current track
	*
	* @public
	*/
	rewind: function () {
		if (!this.$.media.get('src')) return;
		this.$.btnPlay.setIcon('play');
		this.$.media.rewind();
		this.startPlayheadJob();
	},

	/**
	* plays the track after the current track
	*
	* @public
	*/
	fastForward: function () {
		if (!this.$.media.get('src')) return;
		this.$.btnPlay.setIcon('play');
		this.$.media.fastForward();
		this.startPlayheadJob();
	},

	/**
	* @public
	*/
	jumpBackward: function(sender, e) {
		if (!this.$.media.get('src')) return;
		if (this.jumpStartEnd) {
			this.jumpToStart(sender, e);
		} else {
			if (!sender._holding || (sender._holding && sender._sentHold !== true)) {
				this._jumpBackward(sender, e);
			}
			sender._holding = false;
		}
	},

	/**
	* @public
	*/
	jumpForward: function(sender, e) {
		if (!this.$.media.get('src')) return;
		if (this.jumpStartEnd) {
			this.jumpToEnd(sender, e);
		} else {
			if (!sender._holding || (sender._holding && sender._sentHold !== true)) {
				this._jumpForward(sender, e);
			}
			sender._holding = false;
		}
	},

	/**
	* Jumps to beginning of media [source]{@link moon.VideoPlayer#src} and sets
	* [playbackRate]{@link enyo.Video#playbackRate} to `1`.
	*
	* @public
	*/
	jumpToStart: function() {
		if (!this.$.media.get('src')) return;
		this.$.media.jumpToStart();
		this.pause();
	},

	/**
	* Jumps to end of media [source]{@link moon.VideoPlayer#src} and sets
	* [playbackRate]{@link enyo.Video#playbackRate} to `1`.
	*
	* @public
	*/
	jumpToEnd: function() {
		if (!this.$.media.get('src')) return;
		this.$.media.jumpToEnd();
		this.pause();
	},

	/**
	* @public
	*/
	registerListner: function (control, handler) {
		this.on('*', handler, control);
	},
	
	/**
	* @public
	*/
	unregisterListner: function (control, handler) {
		this.off('*', handler, control);
	},

	/********      Private functions      *******/

	/**
	* @private
	*/
	_jumpBackward: function (sender, e) {
		this.$.media.jumpBackward();
	},

	/**
	* @private
	*/
	_jumpForward: function (sender, e) {
		this.$.media.jumpForward();
	},

	/**
	* @private
	*/
	_holdPulseThreadhold: 400,

	/**
	* @private
	*/
	_holding: false,

	/**
	* @private
	*/
	_sentHold: false,

	/**
	* @private
	*/
	holdBackwardHandler: function (sender, e) {
		if (!this.jumpStartEnd) {
			if (e.holdTime > this._holdPulseThreadhold) {
				if (sender._sentHold !== true) {
					this.jumpToStart(sender, e);
					sender._sentHold = true;
					return true;
				}
			} else {
				sender._holding = true;
				sender._sentHold = false;
			}
		}
	},
	
	/**
	* @private
	*/
	holdForwardHandler: function (sender, e) {
		if (!this.jumpStartEnd) {
			if (e.holdTime > this._holdPulseThreadhold) {
				if (sender._sentHold !== true) {
					this.jumpToEnd(sender, e);
					sender._sentHold = true;
					return true;
				}
			} else {
				sender._holding = true;
				sender._sentHold = false;
			}
		}
	},

	/**
	* @private
	*/
	releaseHandler: function (sender, e) {
		if (sender._sentHold && sender._sentHold === true) sender._sentHold = false;
	},



	/********    Protected functions    *******/

	/**
	* Convert time to readable format
	*
	* @protected
	*/
	toReadableTime: function (sec) {
		var minutes = Math.floor(sec / 60).toString();
		var seconds = Math.floor(sec - minutes * 60).toString();
		if (seconds < 10) {
			seconds = '0' + seconds;
		} else if (seconds.length === 1) {
			seconds += '0';
		}
		return minutes + ':' + seconds;
	},

	/**
	* @protected
	*/
	remoteKeyHandler: function (sender, event) {
		var command;
		if (this.handleRemoteControlKey) {
			switch (event.keySymbol) {
				case 'playpause':
					command = 'togglePlay';
					break;
				case 'rewind':
					command = 'rewind';
					break;
				case 'fastforward':
					command = 'fastForward';
					break;
				default:
					command = event.keySymbol;
					break;
			}
			this.commandHandler(utils.mixin(sender, {command: command}), event );
		}
		return true;
	},

	/**
	* Decide behavior of playback command.
	* User can simply give command property on their button to change the behavior.
	*
	* @protected
	*/
	commandHandler: function (sender, event) {
		var command = sender.command;
		if (!command) return;
		this[command] && this[command](sender, event);
	},

	/**
	* Stop if reached start while rewind
	* @protected
	*/
	onPlayStart: function (sender, event) {
		if (sender.getPlaybackRate() < 0) {
			this.pause();
		}
	},

	/**
	* Stop when play ends
	* @protected
	*/
	onPlayEnd: function (sender, event) {
		this.pause();
	},

	/**
	* Handling error
	* @protected
	*/
	onPlayError: function(sender, event) {
		this.warn(event);
	}
});
