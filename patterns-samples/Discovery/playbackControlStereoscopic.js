enyo.kind({
	name: "discovery.Sample.PlaybackStereoscopic",
	classes: "moon enyo-fit enyo-unselectable moon-video-player-sample",
	fit: true,

	components: [
		{
			name: "player",
			kind: "moon.VideoPlayer",
			// src: "http://media.w3.org/2010/05/sintel/trailer.mp4",
			src: "http://media.w3.org/2010/05/sintel/trailer.mp4", // On JCKIM's laptop
			infoComponents: [
				{kind: "moon.VideoInfoBackground", orient: "left", background: true, fit: true, components: [
					{
						kind: "moon.VideoInfoHeader",
						title: "3D Video Playing"
					}
				]}
			],
			components: [
				{name: "sendBackButton", kind: "moon.Button", small: true, content: "BACK", ontap: "buttonBack"},
				{name: "changeButton", kind: "moon.Button", small: true, content: "2D/3D", ontap: "buttonChange"}
			]
		}	
	]

});