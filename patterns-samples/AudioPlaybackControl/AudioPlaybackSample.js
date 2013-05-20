enyo.kind({
	name: "moon.sample.AudioPlayback",
	classes: "enyo-unselectable moon sample-audio-playback",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.AudioPlayback", audioFiles: [
			{artistName: "Joe Satriani", trackName: "Made of Tears", src: "assets/audio/made-of-tears.mp3", iconSrc: "assets/default-music-sm.png"},
			{artistName: "Marcus Miller", trackName: "Power of Soul", src: "assets/audio/power-of-soul.mp3", iconSrc: "assets/default-music-sm.png"}
		], components: [
			{kind: "moon.sample.music.TrackOneColumnWideSample"}
		], drawerComponents: [
			{kind: "moon.sample.AudioPlaybackDrawerContent"}
		]}
	]
});

enyo.kind({
	name: "moon.sample.AudioPlaybackDrawerContent",
	components: [
		{classes: "moon-audio-playback-sample-drawer-wrapper", style: "padding-top:20px;", spotlight: "container", components: [
			{components: [
				{kind: "moon.Item", classes:"sample-audio-playback-item-image"},
				{classes: "sample-audio-playback-item-track", content: "Track Name"},
				{classes: "sample-audio-playback-item-artist", content: "Artist Name"},
				{classes: "sample-audio-playback-item-time", content: "3:40"},
				{kind: "moon.IconButton", classes: "moon-audio-playback-icon-button", src: "assets/icon-favorite.png"}
			]},{tag: "br"},
			{components: [
				{kind: "moon.Item", classes:"sample-audio-playback-item-image"},
				{classes: "sample-audio-playback-item-track", content: "Track Name"},
				{classes: "sample-audio-playback-item-artist", content: "Artist Name"},
				{classes: "sample-audio-playback-item-time", content: "3:40"},
				{kind: "moon.IconButton", classes: "moon-audio-playback-icon-button", src: "assets/icon-favorite.png"}
			]},{tag: "br"},
			{components: [
				{kind: "moon.Item", classes:"sample-audio-playback-item-image"},
				{classes: "sample-audio-playback-item-track", content: "Track Name"},
				{classes: "sample-audio-playback-item-artist", content: "Artist Name"},
				{classes: "sample-audio-playback-item-time", content: "3:40"},
				{kind: "moon.IconButton", classes: "moon-audio-playback-icon-button", src: "assets/icon-favorite.png"}
			]}
		]}
	]
});
