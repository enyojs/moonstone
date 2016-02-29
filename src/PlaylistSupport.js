require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/PlaylistSupport~PlaylistSupport}
* mixin.
* @wip
* @module moonstone/PlaylistSupport
*/

var
	kind = require('enyo/kind');

/**
* The {@link module:moonstone/PlaylistSupport~PlaylistSupport} {@glossary mixin}
* should be used with player controls like audio player or video player, whose
* playback order is determined by various options.
*
* @mixin
* @wip
* @public
*/

var PlaylistSupport = {

	/**
	* @private
	*/
	name: 'PlaylistSupport',

	/**
	* Valid values are `'none'`, `'one'`, and `'all'`.  When `'none'`, audio is
	* played back with no repeating; when `'one'`, one audio track is repeated;
	* when `'all'`, the entire playlist is repeated.
	*
	* @type {String}
	* @default 'none'
	* @public
	*/
	repeat: undefined,

	/**
	* When `true`, audio tracks are shuffled for playback;
	* when `false`, audio tracks are played in queue order.
	*
	* @type {Boolean}
	* @default false
	* @public
	*/
	shuffle: undefined,

	/**
	* After this amount of time, audio track is played from start.
	*
	* @type {Number}
	* @default 2
	* @public
	*/
	playPrevThreshold: undefined,

	/**
	* Playlist of tracks.
	*
	* @type {Collection}
	* @default null
	* @public
	*/
	collection: undefined,

	/**
	* Array of indices indicating playback order of tracks.
	*
	* @type {Array}
	* @default empty array
	* @private
	*/
	playOrder: [],

	/**
	* Whether to show jump controls by default.
	* Default jump control behavior is overridden for playlist.
	*
	* @type {Boolean}
	* @default true
	* @private
	*/
	showJumpControls: true,

	/**
	* When `true`, jump controls' default hold behavior is disabled.
	*
	* @type {Boolean}
	* @default true
	* @private
	*/
	jumpStartEnd: true,

	/**
	* Event handlers for playlist.
	* @private
	*/
	_playlist_Handlers: {
		onRequestAddAudio: '_addAudio',
		onRequestRemoveAudio: '_removeAudio',
		onPlayPrevious: 'previous',
		onPlayNext: 'next',
		onRequestShuffle: 'toggleShuffle',
		onRequestRepeat: 'toggleRepeat'
	},

	/**
	* @private
	*/
	observers: [
		{method: 'collectionChanged', path: ['collection']}
	],

	/**
	* Initializes properties.
	*
	* @method
	* @private
	*/
	create: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.repeat    = (this.repeat    === undefined) ? 'none' : this.repeat;
			this.shuffle    = (this.shuffle    === undefined) ? false : this.shuffle;
			this.collection   = (this.collection   === undefined) ? null : this.collection;
			this.autoPlayOnShuffle = (this.autoPlayOnShuffle === undefined) ? false : this.autoPlayOnShuffle;
			this.playPrevThreshold = (this.playPrevThreshold === undefined) ? 2 : this.playPrevThreshold;
		};
	}),

	/**
	* @method
	* @private
	*/
	dispatchEvent: kind.inherit(function (sup) {
		return function (sEventName, oEvent, oSender) {
			// Needed for proper onenter/onleave handling
			if (this.strictlyInternalEvents[sEventName] && this.isInternalEvent(oEvent)) {
				return true;
			}
			// FIXME: not sure why events can arrive without event objects, but we guard here for safety
			if (oEvent && !oEvent.delegate) {
				var handler = this._playlist_Handlers[sEventName];
				if (handler){
					this.cachePoint = true;
					if(this[handler](oSender, oEvent)) {
						return true;
					}
				}
			}
			return sup.apply(this, arguments);
		};
	}),

	/**
	* Returns a model containing information for next audio track.
	* The `repeat` and `shuffle` flags are referenced when determining the next
	* audio track to play.
	*
	* @public
	*/
	getNext: function (model) {
		var c = this.get('collection');
		if (this.repeat == 'one' || !c)
			return this.get('model');

		var	index = c.indexOf(model);
		if (index != -1) {
			index = this.shuffle ? this.playOrder.indexOf(index) : index;
			index++;
			index = this.repeat == 'all' ? index % c.length : Math.min(index, c.length-1);
		} else {
			// If it fails to find current on collection, we assume model is set directly by user.
			// We come back to collection by set first item from collection as next
			index = 0;
		}

		return this.getTrackAt(index);
	},

	/**
	* Returns a model containing information for previous audio track.
	* The `repeat` and `shuffle` flags are referenced when determining the next
	* audio track to play.
	*
	* @public
	*/
	getPrevious: function (model) {
		var c = this.get('collection');
		if (this.repeat == 'one' || !c)
			return this.get('model');

		var	index = c.indexOf(model);
		if (index != -1) {
			index = this.shuffle ? this.playOrder.indexOf(index) : index;
			index--;
			index = this.repeat == 'all' ? index % c.length : Math.max(index, 0);
		} else {
			// If it fails to find current on collection, we assume model is set directly by user.
			// We come back to collection by set first item from collection as previous
			index = 0;
		}

		return this.getTrackAt(index);
	},

	/**
	* Returns model containing information for audio track at specified index in
	* play order.
	*
	* @public
	*/
	getTrackAt: function (order) {
		var c = this.get('collection');
		return c ? c.at(this.shuffle ? this.playOrder[order] : order) : null;
	},

	/**
	* Adds audio track to playlist.
	*
	* @public
	*/
	addAudio: function (model) {
		var c = this.get('collection');
		if (c) c.add(model);
	},

	/**
	* @private
	*/
	_addAudio: function (sender, ev) {
		this.addAudio(ev.model);
	},

	/**
	* Removes audio track from playlist.
	*
	* @public
	*/
	removeAudio: function (model) {
		var c = this.get('collection');
		if (c) c.remove(model);
	},

	/**
	* @private
	*/
	_removeAudio: function (sender, ev) {
		this.removeAudio(ev.model);
	},

	/**
	* @private
	*/
	collectionChanged: function(prev, current) {
		this.shufflePlayOrder();
	},

	/**
	* Hook player default handler.
	*
	* @private
	*/
	jumpBackward: function (sender, ev) {
		this.previous(sender, ev);
	},

	/**
	* Hook player default handler.
	*
	* @private
	*/
	jumpForward: function (sender, ev) {
		this.next(sender, ev);
	},

	/**
	* Called when the Rewind or Previous button is pressed.
	* If `currentTime` is greater than `playPrevThreshold`, the play position
	* will be reset.
	*
	* @public
	*/
	previous: function (sender, ev) {
		if (this.getCurrentTime() > this.playPrevThreshold ||
			this.repeat == 'one' ||
			(this.repeat == 'none' && this.index === 0)) {
			this.seekTo(0);
			return;
		}
		var prevModel = this.getPrevious(this.get('model'));
		if (!prevModel || (this.repeat == 'none' && this.get('model') == prevModel)) {
			this.stop();
			return;
		}
		this.set('model', prevModel);
		this.play();
	},

	/**
	* Called when the Fast Forward or Next button is pressed.
	*
	* @public
	*/
	next: function (sender, ev) {
		var nextModel = this.getNext(this.get('model'));
		if (!nextModel || (this.repeat == 'none' && this.get('model') == nextModel)) {
			this.stop();
			this.emit('onPlaylistEnd', {playback: this, collection: this.collection});
			return;
		}
		this.set('model', nextModel);
		this.play();
	},

	/**
	* Called when the Shuffle button is pressed.  Toggles `shuffle` flag.
	* When the flag is set to `false`, tracks are played in queue order;
	* when it is set to `true`, tracks are played in shuffled order.
	*
	* @public
	*/
	toggleShuffle: function (shuffleOrder) {
		this.set('shuffle', !this.shuffle);
		if (this.shuffle) {
			this.shufflePlayOrder();
		}
	},

	/**
	* Shuffles play sequence.
	*
	* @protected
	*/
	shufflePlayOrder: function () {
		var c = this.get('collection'),
			length = c ? c.length : 0,
			idx = length,
			tmp, r;

		this.playOrder = [];
		for (var i=0; i<length; i++) {
			this.playOrder.push(i);
		}

		// While there remain elements to shuffle...
		while (0 !== idx) {

			// Pick a remaining element...
			r = Math.floor(Math.random() * idx);
			idx -= 1;

			// And swap it with the current element.
			tmp = this.playOrder[idx];
			this.playOrder[idx] = this.playOrder[r];
			this.playOrder[r] = tmp;
		}
	},

	/**
	* Changes value of `repeat` option referenced by `getPrevious()` and `getNext()`.
	* Valid values for `repeat`, in sequential order, are `'none'`, `'one'`, and `'all'`.
	*
	* @public
	*/
	toggleRepeat: function () {
		switch (this.repeat) {
			case 'none':
				this.set('repeat', 'one');
				break;
			case 'one':
				this.set('repeat', 'all');
				break;
			case 'all':
				this.set('repeat', 'none');
				break;
		}
	},

	/**
	* Called when playback of an audio track ends.
	* Determines whether to play next track, referencing the `repeat` flag.
	*
	* @public
	*/
	onPlayEnd: function (sender, ev) {
		if (!this.get('model')) return; // When set model as null, abort is call onEnd
		this.next();
	}
};

module.exports = PlaylistSupport;
