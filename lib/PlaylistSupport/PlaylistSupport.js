require('moonstone');

var
	kind = require('enyo/kind'),
	utils = require('enyo/utils'),
	Collection = require('enyo/Collection');


/**
* The {@link moon.PlaylistSupport} [mixin]{@glossary mixin} should be used with player controls
* like audio player or video player whose play sequence should be decided by various options.
*
* @mixin moon.PlaylistSupport
* @public
*/

/** @lends moon.PlaylistSupport.prototype */
exports.Support = {

	/**
	* @private
	*/
	name: 'PlaylistSupport',

	/**
	* When 'none', no repeat after play audio.
	* Set 'one' for repeat one audio, 'all' for repeat all audio.
	*
	* @type {String}
	* @default none
	* @public
	*/
	repeat: undefined,

	/**
	* When 'true', play audio in shuffle order.
	* When 'false', play audio in queue order.
	*
	* @type {String}
	* @default none
	* @public
	*/
	shuffle: undefined,

	/**
	* After playPrevThreshold time, play from start
	* 
	* @type {Number}
	* @default 2
	* @public
	*/
	playPrevThreshold: undefined,

	/**
	* When 'true', auto play audio after turn shuffle on.
	*
	* @type {Boolean}
	* @default false
	* @public
	*/
	autoPlayOnShuffle: undefined,

	/**
	* Playlist.
	*
	* @type {Collection}
	* @default null
	* @public
	*/
	collection: undefined,

	/**
	* Disable jump controls by default.
	* And, we override default rewind and fastforward behavior on playlist.
	* @private
	*/
	showJumpControls: false,

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
	* Return a model contains next audio information.
	* When decide next audio, repeat and shuffle flag are referenced. 
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

		return c.at(this.shuffle ? this.playOrder[index] : index);
	},

	/**
	* Return a model contains previous audio information.
	* When decide next audio, repeat and shuffle flag are referenced. 
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

		return c.at(this.shuffle ? this.playOrder[index] : index);
	},

	/**
	* Add audio into playlist.
	* 
	* @public
	*/
	addAudio: function (model) {
		var c = this.get('collection');
		c && c.add(model);
	},

	/**
	* @private
	*/
	_addAudio: function (sender, event) {
		this.addAudio(event.model);
	},

	/**
	* Remote audio from playlist.
	* 
	* @public
	*/
	removeAudio: function (model) {
		var c = this.get('collection');
		c && c.remove(model);
	},

	/**
	* @private
	*/
	_removeAudio: function (sender, event) {
		this.removeAudio(event.model);
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
	rewind: function (sender, event) {
		this.previous(sender, event);
	},

	/**
	* Hook player default handler.
	* 
	* @private
	*/
	fastForward: function (sender, event) {
		this.next(sender, event);
	},

	/**
	* Called when press rewind or previous button.
	* When currentTime is 
	* 
	* @public
	*/
	previous: function (sender, event) {
		if (this.getCurrentTime() > this.playPrevThreshold ||
			this.repeat == 'one' ||
			(this.repeat == 'none' && this.index == 0)) {
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
	* Called when press fastforward or next button.
	* 
	* @public
	*/
	next: function (sender, event) {
		var nextModel = this.getNext(this.get('model'));
		if (!nextModel || (this.repeat == 'none' && this.get('model') == nextModel)) {
			this.stop();
			this.onLastPlayEnd && this.onLastPlayEnd(sender, event);
			return;
		}
		this.set('model', nextModel);
		this.play();		
	},

	/**
	* Called when press shuffle button and toggle shuffle flag.
	* When shuffle is false, play in queue sequence.
	* When shuffle is true, play in shuffled order.
	* When autoPlayOnShuffle is true, play after shuffle order.
	* @public
	*/
	toggleShuffle: function () {
		this.set('shuffle', !this.shuffle);
		if (this.shuffle) {
			this.shufflePlayOrder();
			if (this.autoPlayOnShuffle) {
				this.play();
				// Force play from start even when the first shuffled audio is the same as current
				this.seekTo(0);
			}
		}
	},

	/**
	* Shuffle play sequence.
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

		if (c && this.playOrder[0] !== undefined) {
			this.set('model', c.at(this.shuffle ? this.playOrder[0] : 0));
		}
	},

	/**
	* Repeat is an option referenced by getPrevious and getNext.
	* Option sequence: 'none', 'one', 'all'
	* @public
	*/
	toggleRepeat: function () {
		switch (this.repeat) {
			case 'none': this.set('repeat', 'one'); break;
			case 'one': this.set('repeat', 'all'); break;
			case 'all': this.set('repeat', 'none'); break;
			default: break;
		}
	},

	/**
	* Called when play is ended.
	* Decide play next or not by referencing repeat flag.
	* @public
	*/
	onPlayEnd: function (sender, event) {
		if (!this.get('model')) return; // When set model as null, abort is call onEnd
		this.next();
	}
};