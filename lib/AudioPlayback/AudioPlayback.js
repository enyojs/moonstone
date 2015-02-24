require('moonstone');

(function (enyo, scope) {
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
	* FIXME! THIS KIND IS BROKEN.  We removed moon.List as part of code cleanup in
	* 2.4, and this code hasn't yet been updated to use {@link moon.DataList}.
	*
	* `moon.AudioPlayback` is meant to be used with {@link moon.Drawers}.
	* This extends a {@link moon.Drawer} by adding an audio playback control
	* and playlist for the imported audio.
	*
	* ```
	* {kind:'moon.Drawers', drawers:[
	* 	{
	* 		kind: 'moon.AudioPlayback',
	* 		handle: {
	* 			kind: 'moon.DrawerHandle',
	* 			marquee: true
	* 		}
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
	* @public
	*/

	enyo.kind(
		/** @lends moon.AudioPlayback.prototype */ {

		/**
		* @private
		*/
		name: 'moon.AudioPlayback',

		/**
		* @private
		*/
		kind: 'moon.Drawer',

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
		handlers: {
			onAudioEnd: 'audioEnd'
		},

		/**
		* @private
		*/
		audioTracks: [],

		/**
		* @private
		*/
		index: null,

		/**
		* @private
		*/
		controlDrawerComponents:[],

		/**
		* @private
		*/
		playheadJob: null,

		/**
		* @private
		*/
		queueList: null,

		/**
		* @private
		* @lends moon.AudioPlayback.prototype
		*/
		published: {

			/**
			* Whether to play the audio on repeat
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			repeat: false,

			/**
			* When `false`, audio player doesn't respond to remote controller
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			handleRemoteControlKey: true
		},

		/**
		* @private
		*/
		audioComponents: [
			{name: 'audio', kind: 'enyo.Audio', onEnded: 'audioEnd'},
			{kind: 'enyo.Signals', onkeyup:'remoteKeyHandler'},
			{kind: 'FittableColumns', rtl: false, noStretch:true, classes: 'moon-audio-playback-controls', spotlight: 'container', components: [
				{name: 'trackIcon', classes: 'moon-audio-playback-track-icon'},
				{classes: 'moon-audio-play-controls', fit: true, components: [
					{kind: 'FittableColumns', rtl: false, classes: 'moon-audio-top', components: [
						{classes: 'moon-audio-track-info', components: [
							{name: 'trackName', content: 'Track Name', classes: 'moon-audio-playback-track'},
							{name: 'artistName', content: 'Artist Name', classes: 'moon-audio-playback-artist'}
						]},
						{classes: 'moon-audio-control-buttons', fit: true, components: [
							// _src_ property will need to be updated with images from UX
							{kind: 'moon.IconButton', classes: 'moon-audio-icon-button left', src: 'assets/icon-rew-btn.png', ontap: 'playPrevious'},
							{kind: 'moon.IconButton', name: 'btnPlay', classes: 'moon-audio-icon-button left', src: 'assets/icon-play-btn.png', ontap: 'togglePlay'},
							{kind: 'moon.IconButton', classes: 'moon-audio-icon-button left', src: 'assets/icon-fwd-btn.png', ontap: 'playNext'},
							{kind: 'moon.IconButton', classes: 'moon-audio-icon-button right', src: '../assets/icon-album.png', ontap: 'toggleTrackDrawer'}
						]}
					]},
					{kind: 'FittableColumns', rtl: false, classes: '', components: [
						{name: 'timePlayed', classes: 'moon-audio-play-time left', content: '0:00'},
						{classes: 'moon-audio-slider-container enyo-inline', fit: true, components: [
							{kind: 'moon.Slider', name: 'slider', classes: 'moon-audio-slider', rtl: false, noPopup: true, lockBar: true, onChanging: 'sliderChanging', onAnimateFinish: 'sliderChanging'}
						]},
						{name: 'timeRemaining', classes: 'moon-audio-play-time right', content: '0:00'}
					]}
				]}
			]}
		],

		/**
		* @private
		*/
		initComponents: function () {
			this.components = [{kind: 'moon.AudioPlaybackQueue'}];
			this.inherited(arguments);
			this.components = null;
		},

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.$.controlDrawer.createComponents(this.audioComponents, {owner:this});
		},

		/**
		* @private
		*/
		toggleTrackDrawer: function () {
			this.$.client.setOpen(!this.$.client.getOpen());
		},

		/**
		* @private
		*/
		endPlayheadJob: function () {
			clearInterval(this.playheadJob);
			this.playheadJob = null;
		},

		/**
		* @private
		*/
		audioEnd: function () {
			if ((this.index === (this.audioTracks.length-1)) && (!this.repeat)) {
				this.$.btnPlay.applyStyle('background-image', 'url(assets/icon-play-btn.png)');
			} else {
				this.playNext();
			}
		},

		/**
		* @private
		*/
		updateTrackCount: function () {
			var l = this.audioTracks.length;
			if (l === 1) {
				this.index = 0;
				this.updateTrackIndex(this.index);
			}
		},

		/**
		* @private
		*/
		updateTrackIndex: function (inIndex) {
			var a = this.audioTracks[inIndex];
			this.$.trackName.setContent(a.trackName);
			this.$.artistName.setContent(a.artistName);
			this.$.audio.setSrc(a.src);
			this.updatePlayTime('0:00', '0:00');
			this.$.trackIcon.applyStyle('background-image', 'url(../assets/default-music.png)');
			// moon.Drawer needs a method for updating marquee content
			this.owner.$.drawers.$.drawerHandle.setContent(a.trackName + ' by ' + a.artistName);
		},

		/**
		* @private
		*/
		updatePlayhead: function () {
			var duration = this.$.audio.getDuration();
			var totalTime = isNaN(duration) ? 0 : duration;
			var currentTime = this.$.audio.getCurrentTime();
			var playheadPos = (currentTime * 100) / totalTime;
			this.updatePlayTime(this.toReadableTime(currentTime), this.toReadableTime(totalTime));
			this.$.slider.updateKnobPosition(playheadPos);
			this.$.slider.setProgress(playheadPos);
		},

		/**
		* @private
		*/
		updatePlayTime: function (inStart, inEnd) {
			this.$.timePlayed.setContent(inStart);
			this.$.timeRemaining.setContent(inEnd);
		},

		/**
		* @private
		*/
		toReadableTime: function (inValue) {
			var minutes = Math.floor(inValue / 60).toString();
			var seconds = Math.floor(inValue - minutes * 60).toString();
			if (seconds < 10) {
				seconds = '0' + seconds;
			} else if (seconds.length === 1) {
				seconds += '0';
			}
			return minutes + ':' + seconds;
		},

		/**
		* @private
		*/
		sliderChanging: function (inSender, inEvent) {
			var totalTime = this.$.audio.getDuration();
			var currentTime = (totalTime / 100) * inEvent.value;
			this.updatePlayTime(this.toReadableTime(currentTime), this.toReadableTime(totalTime));
			this.$.audio.seekTo(currentTime);
		},

		/**
		* pauses audio if is playing, and plays it if it is paused
		*
		* @public
		*/
		togglePlay: function () {
			if (this.$.audio.getPaused()) {
				this.play();
			} else {
				this.pause();
			}
		},

		/**
		* plays audio
		*
		* @public
		*/
		play: function () {
			this.$.audio.play();
			if (this.playheadJob === null) {
				this.playheadJob = setInterval(this.bindSafely('updatePlayhead'), 500);
			}
			this.$.btnPlay.applyStyle('background-image', 'url(assets/icon-pause-btn.png)');
		},

		/**
		* pauses audio
		*
		* @public
		*/
		pause: function () {
			this.$.audio.pause();
			this.endPlayheadJob();
			this.$.btnPlay.applyStyle('background-image', 'url(assets/icon-play-btn.png)');
		},

		/**
		* plays the track previous to current track
		*
		* @public
		*/
		playPrevious: function () {
			this.index = (this.index === 0) ? this.audioTracks.length - 1 : this.index - 1;
			this.updateTrackIndex(this.index);
			this.play();
		},

		/**
		* plays the track after the current track
		*
		* @public
		*/
		playNext: function () {
			this.index = (this.audioTracks.length > (this.index + 1)) ? this.index + 1 : 0;
			this.updateTrackIndex(this.index);
			this.play();
		},

		/**
		* plays the track at the specified index
		*
		* @param {Number} inIndex  The index of the track to play
		* @public
		*/
		playAtIndex: function (inIndex) {
			this.index = (this.audioTracks.length > inIndex) ? inIndex : 0;
			this.updateTrackIndex(this.index);
			this.play();
		},

		/**
		* Adds an audio track to the list
		*
		* @fires moon.AudioPlayback#onAddAudio
		* @param {String} src  The url of the audio track to be added
		* @param {String} trackName  Track name
		* @param {String} artistName  Artist na me
		* @param {String} albumName  Album name
		* @param {String} duration  String specifying duration eg. '0:22'
		* @public
		*/
		addAudioTrack: function (inSrc, inTrack, inArtist, inAlbum, inDuration) {
			var a = {
				src: inSrc,
				trackName: inTrack,
				artistName: inArtist,
				albumName: inAlbum,
				duration: inDuration
			};
			this.audioTracks[this.audioTracks.length] = a;
			this.updateTrackCount();
			this.waterfall('onAddAudio', {tracks: this.audioTracks});
		},

		/**
		* @private
		*/
		remoteKeyHandler: function (inSender, inEvent) {
			if (this.handleRemoteControlKey) {
				switch (inEvent.keySymbol) {
				case 'play':
					this.play();
					break;
				case 'pause':
					this.pause();
					break;
				case 'rewind':
					this.playPrevious();
					break;
				case 'fastforward':
					this.playNext();
					break;
				case 'stop':
					this.pause();
					this.$.audio.seekTo(0);
					this.updatePlayhead();
					break;
				}
			}
			return true;
		}
	});

	/**
	* @ui
	* @class moon.AudioPlaybackQueue
	* @extends layout.FittableRows
	* @protected
	*/
	enyo.kind(
		/** @lends moon.AudioPlaybackQueue.prototype */ {

		/**
		* @private
		*/
		name: 'moon.AudioPlaybackQueue',

		/**
		* @private
		*/
		kind: 'FittableRows',

		/**
		* @private
		*/
		classes: 'enyo-fit moon-audio-playback-queue',

		/**
		* @private
		*/
	   handlers: {
			onAddAudio: 'addAudio'
	   },

		/**
		* @private
		*/
		components: [
			{kind: 'moon.Header', name: 'queueHeader', title: 'Music Queue', titleBelow: '2 Tracks'},
			{
				kind: 'moon.List',
				name: 'list',
				classes: 'enyo-unselectable',
				fit: true,
				multiSelect: false,
				onSetupItem: 'setupItem',
				components: [
					{name: 'item', kind: 'moon.AudioListItem', classes: 'moon-audio-queue-list enyo-border-box', onRemove: 'removeTap'}
				]
			}
	   ],

		/**
		* @private
		*/
		tracks: [],

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.parent.applyStyle('height', '100%');
		},

		/**
		* @private
		*/
		addAudio: function (inSender, inEvent) {
			var i = this.$.list.getCount() + 1;
			this.tracks = inEvent.tracks;
			this.$.list.setCount( i );
			this.$.list.reset();
			this.$.queueHeader.setTitleBelow(i + ' Tracks');
		},

		/**
		* @private
		*/
		setupItem: function (inSender, inEvent) {
			var i = inEvent.index;
			var t = this.tracks[i];
			var item = {artistName: t.artistName, trackName: t.trackName, src: '', albumName: t.albumName, duration: t.duration};
			this.$.item.setTrack(item);
			this.$.item.setSelected(inSender.isSelected(i));
			return true;
		}
	});

	/**
	* @class moon.AudioListItem
	* @extends enyo.Control
	* @ui
	* @protected
	*/
	enyo.kind(
		/** @lends moon.AudioListItem.prototype */ {

		/**
		* @private
		*/
		name: 'moon.AudioListItem',

		/**
		* @private
		*/
		events: {

			/**
			* {@link moon.AudioListItem#event:onRemove}
			*/
			onRemove: ''
		},

		/**
		* @private
		*/
		components: [
			{name: 'albumArt', kind: 'Image', classes: 'moon-audio-queue-album-art', src: 'assets/default-music-sm.png'},
			{components: [
				{name: 'trackName'},
				{name: 'artistName'}
			]}
		],

		/**
		* @private
		*/
		setTrack: function (inAudio) {
			this.$.trackName.setContent(inAudio.trackName);
			this.$.artistName.setContent(inAudio.artistName + ' - ' + inAudio.albumName);
			this.$.albumArt.setSrc(inAudio.src);
		},

		/**
		* @private
		*/
		setSelected: function (inSelected) {
			this.addRemoveClass('moon-audio-queue-list-selected', inSelected);
		},

		/**
		* @fires moon.AudioListItem#onRemove
		* @private
		*/
		removeTap: function (inSender, inEvent) {
			this.doRemove(inEvent);
			return true;
		}
	});

})(enyo, this);
