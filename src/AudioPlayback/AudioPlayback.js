require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/AudioPlayback~AudioPlayback}
* kind.
* @wip
* @module moonstone/AudioPlayback
*/

var
	kind = require('enyo/kind'),
	utils = require('enyo/utils'),
	EnyoAudio = require('enyo/Audio'),
	Signals = require('enyo/Signals'),
	EventEmitter = require('enyo/EventEmitter');


var
	Drawer = require('moonstone/Drawers').Drawer,
	IconButton = require('moonstone/IconButton'),
	MoonImage = require('moonstone/Image'),
	Slider = require('moonstone/Slider'),
	Marquee = require('moonstone/Marquee');

/**
* Fires when an audio track is added to the list
*
* @event module:moonstone/AudioPlayback~AudioPlayback#onAddAudio
* @type {Object}
* @property {Object} tracks - contains a reference to the collection of tracks
* @public
*/

/**
* Fires when an audio list item is to be removed. The list event data is passed through.
* TODO: When fixed with right list component be sure to link to event data.
*
* @event module:moonstone/AudioPlayback~AudioPlayback#onRemove
* @type {Object}
* @public
*/

/**
* {@link module:moonstone/AudioPlayback~AudioPlayback} is meant to be used
* with {@link module:moonstone/Drawers~Drawers}. It extends
* {@link module:moonstone/Drawers/Drawer~Drawer} by adding an audio playback control
* and playlist for the imported audio.
*
* ```
* var
* 	kind = require('enyo/kind'),
* 	AudioPlayback = require('moonstone/AudioPlayback'),
* 	Drawers = require('moonstone/Drawers');
*
* {kind: Drawers,
* 	drawers: [
* 		{kind: AudioPlayback}
* 	],
* 	components: [
*			{content: 'Page Content'}
* 	]
* }
* ```
*
* @class AudioPlayback
* @extends module:moonstone/Drawers~Drawer
* @ui
* @wip
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/AudioPlayback~AudioPlayback.prototype */ {

	/**
	* @private
	*/
	name: 'moon.AudioPlayback',

	/**
	* @private
	*/
	kind: Drawer,

	/**
	* @private
	*/
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
	* @lends module:moonstone/AudioPlayback~AudioPlayback.prototype
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
		* When 'true', update current time on every drag or key event on slider.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		liveSeekMode: false,

		/**
		* Amount of increment (in percentage) on seek by 5way key press.
		*
		* @type {number}
		* @default 5
		* @public
		*/
		increment: 5,

		/**
		* Amount of time (in seconds) to jump in response to jump buttons. This value is ignored
		* when [jumpStartEnd]{@link module:moonstone/VideoPlayer~VideoPlayer#jumpStartEnd}
		* is `true`.
		*
		* @type {Number}
		* @default 3
		* @public
		*/
		jumpSec: 3,

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
		* [onPlaybackControlsTapped]{@link module:moonstone/VideoPlayer~VideoPlayer#onPlaybackControlsTapped}
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
		*
		* @type {Object}
		* @default
		*	fastForward: ['2', '4', '8', '16'],
		*	rewind: ['-2', '-4', '-8', '-16'],
		*	slowForward: ['1/4', '1/2'],
		*	slowRewind: ['-1/2', '-1']
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
		{name: 'playbackControls', rtl: false, spotlight: 'container', classes: 'moon-audio-playback-top moon-hspacing', components: [
			{name: 'trackIcon', kind: MoonImage, sizing: 'cover', classes: 'moon-audio-track-icon'},
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
			{name: 'moreControls', classes: 'moon-audio-more-buttons moon-hspacing'}
		]},
		{rtl: false, classes: 'moon-audio-playback-bottom', components: [
			{kind: Slider, name: 'slider', classes: 'moon-audio-slider',
			knobClasses: 'moon-audio-slider-knob', bgBarClasses: 'moon-audio-slider-bg-bar',
			barClasses: 'moon-audio-slider-bar-bar', tapAreaClasses: 'moon-audio-slider-taparea',
			rtl: false, noPopup: true, lockBar: true, onChanging: 'sliderChanging', onAnimateFinish: 'sliderChanging',
			onmove: 'preview', onenter: 'enterTapArea', onleave: 'leaveTapArea'},
			{name: 'timePlayed', classes: 'moon-audio-play-time left', content: '0:00'},
			{name: 'timeRemaining', classes: 'moon-audio-play-time right', content: '0:00'}
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
		{from: 'autoplay', to: '$.media.autoplay'},
		{from: '$.media.src', to: 'src'}, // This is for detecting media src status from playback
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
		{from: 'increment', to: '$.slider.increment'}
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
		this.enable5waySeek();
	},

	/**
	* Enable seek by left and right key press on slider
	* @private
	*/
	enable5waySeek: function () {
		this.$.slider.spotFocused = utils.nop;
		this.$.slider.spotSelect = utils.nop;
		this.$.slider.spotBlur = utils.nop;
		this.$.slider.selected = true;
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
	enterTapArea: function (sender, ev) {
		if (ev.originator.name == 'tapArea') {
			this.startPreview();
			if (!this.$.slider.disabled && this.hideButtonsOnSlider) {
				this.$.playbackControls.set('showing', false);
			}
		}
	},

	/**
	* @private
	*/
	leaveTapArea: function (sender, ev) {
		if (ev.originator.name == 'tapArea') {
			this.endPreview();
			if (!this.$.slider.disabled && this.hideButtonsOnSlider) {
				this.$.playbackControls.set('showing', true);
			}
		}
	},

	/**
	* @private
	*/
	startPreview: function () {
		this.previewMode = true;
	},

	/**
	* @private
	*/
	endPreview: function () {
		this.previewMode = false;
		this.updatePlayhead();
	},

	/**
	* @private
	*/
	preview: function (sender, ev) {
		if (!this.$.slider.disabled) {
			if (!this.previewMode) {
				this.startPreview();
			}
			this.previewPos = this.$.slider.calcKnobPosition(ev);
			this.updatePlayhead();
		}
	},

	/**
	* Force end preview mode when user press 5way while dragging
	* @private
	*/
	spotlightModeChanged: function (sender, ev) {
		if (this.dragging && !ev.pointerMode) {
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
		this.emit('trackChanged', {prev: prev, current: curr});
	},

	/**
	* Update disabled status from src
	*
	* @private
	*/
	srcChanged: function (prev, curr) {
		this.set('disableSlider', !curr);
		this.set('disablePlaybackControls', !curr);
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

		playheadPos = (!totalTime) ? 0 : (currentTime * 100) / totalTime;
		bufferheadPos = (!bufferTime) ? 0 : (bufferTime * 100) / totalTime;

		this.$.slider.set('progress', playheadPos);
		this.$.slider.set('bgProgress', bufferheadPos);

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

		if (!duration || isNaN(duration)) {
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
		this.$.timePlayed.set('content', start);
		this.$.timeRemaining.set('content', end);
	},

	/**
	* @private
	*/
	sliderChanging: function (sender, ev) {
		if (!this.liveSeekMode && ev.type == 'onChanging') return;
		var totalTime = this.getDuration();
		var currentTime = (totalTime / 100) * ev.value;
		this.updatePlayTime(this.toReadableTime(currentTime), this.toReadableTime(totalTime));
		this.seekTo(currentTime);
	},


	/**
	* Setup track information.
	* Use model to set media instead of this.
	*
	* @private
	*/
	setTrack: function (src, albumArt, trackName, artistName) {
		this.$.media.set('src', src);
		this.$.trackIcon.set('src', albumArt);
		this.$.trackName.set('content', trackName);
		this.$.artistName.set('content', artistName);
		this.updatePlayhead();
		this.updatePlayTime('0:00', '0:00');
		this.$.btnPlay.set('icon', 'play');
	},



	/*******      Public APIs      ******/


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
		this.$.btnPlay.set('icon', 'pause');
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
		this.$.btnPlay.set('icon', 'play');
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
		this.$.btnPlay.set('icon', 'play');
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
		this.$.btnPlay.set('icon', 'play');
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
		this.$.btnPlay.set('icon', 'pause'); // Fix-me: rewind and fastForward behavior is different.
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
	* Jumps to beginning of media [source]{@link module:moonstone/VideoPlayer~VideoPlayer#src}
	* and sets [playbackRate]{@link module:enyo/Video~Video#playbackRate} to `1`.
	*
	* @public
	*/
	jumpToStart: function() {
		if (!this.$.media.get('src')) return;
		this.$.media.jumpToStart();
		this.pause();
	},

	/**
	* Jumps to end of media [source]{@link module:moonstone/VideoPlayer~VideoPlayer#src}
	* and sets [playbackRate]{@link module:enyo/Video~Video#playbackRate} to `1`.
	*
	* @public
	*/
	jumpToEnd: function() {
		if (!this.$.media.get('src')) return;
		this.$.media.jumpToEnd();
		this.pause();
	},

	/********      Private functions      *******/

	/**
	* @private
	*/
	_jumpBackward: function (sender, e) {
		this.$.media.jumpBackward();
		if (this.$.media.isPaused()) this.updatePlayhead();	// Force update playhead
	},

	/**
	* @private
	*/
	_jumpForward: function (sender, e) {
		this.$.media.jumpForward();
		if (this.$.media.isPaused()) this.updatePlayhead();	// Force update playhead
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
	remoteKeyHandler: function (sender, ev) {
		var command;
		if (this.handleRemoteControlKey) {
			switch (ev.keySymbol) {
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
					command = ev.keySymbol;
					break;
			}
			this.commandHandler(utils.mixin(sender, {command: command}), ev );
		}
		return true;
	},

	/**
	* Decide behavior of playback command.
	* User can simply give command property on their button to change the behavior.
	*
	* @protected
	*/
	commandHandler: function (sender, ev) {
		var command = sender.command;
		if (this[command]) this[command](sender, ev);
		return true;
	},

	/**
	* Stop if reached start while rewind
	* @protected
	*/
	onPlayStart: function (sender, ev) {
		if (sender.getPlaybackRate() < 0) {
			this.pause();
		}
	},

	/**
	* Stop when play ends
	* @protected
	*/
	onPlayEnd: function (sender, ev) {
		this.pause();
	},

	/**
	* Handling error
	* @protected
	*/
	onPlayError: function(sender, ev) {
		this.warn(ev);
	}
});
