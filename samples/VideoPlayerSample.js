
enyo.kind({
	name: "moon.sample.VideoPlayerSample",
	classes: "enyo-fit enyo-unselectable moon moon-video-player-sample",
	fit: true,
	components: [
		{kind: "enyo.Spotlight"},
		{name: "player", kind: "moon.DefaultVideoPlayer", src: "http://media.w3.org/2010/05/video/movie_300.ogv"}
	]
});