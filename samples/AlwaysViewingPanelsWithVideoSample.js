enyo.kind({
	name : "moon.sample.AlwaysViewingPanelsWithVideoSample",
	classes : "moon enyo-fit enyo-unselectable",
	components : [{
		name : "player",
		kind : "moon.VideoPlayer",
		src : "http://media.w3.org/2010/05/bunny/movie.mp4",
		poster : "assets/video-poster.png",
		autoplay : true,
		showInfoBackground: true,
		infoComponents : [{
			kind : "moon.VideoInfoBackground",
			orient : "left",
			background : true,
			fit : true,
			components : [{
				kind : "moon.ChannelInfo",
				channelNo : "9999-99",
				channelName : "AMC",
				classes : "moon-2h",
				components : [{
					content : "REC 08:22",
					classes : "moon-video-player-info-redicon "
				}, {
					content : "Cinema"
				}, {
					content : "Sub English"
				}, {
					content : "\u2665"
				}, {
					content : "3D"
				}, {
					content : "AD"
				}, {
					content : "CC1"
				}]
			}, {
				kind : "moon.VideoInfoHeader",
				title : "Downton Abbey - Extra Title",
				description : "The series, set in the Youkshire country estate of Downton Abbey, depicts the lives of the aristocratic Crawley famiry and",
				subTitle : "Mon June 21, 7:00 - 8:00pm",
				subtitleDivider : "|",
				subSubTitle : "R - TV 14, V, L, SC",
				components : [{
					content : "Icon 1",
					classes : "moon-video-player-info-icon"
				}, {
					content : "Icon 2",
					classes : "moon-video-player-info-icon"
				}, {
					content : "Icon 3",
					classes : "moon-video-player-info-icon"
				}]
			}]
		}, {
			kind : "moon.VideoInfoBackground",
			name : "rightInfo",
			orient : "right",
			background : true,
			components : [{
				kind : "moon.Clock",
				name : "clock"
			}]
		}],
		components : [{
			kind : "moon.IconButton",
			src : "$lib/moonstone/images/video-player/icon-placeholder.png"
		}, {
			kind : "moon.IconButton",
			src : "$lib/moonstone/images/video-player/icon-placeholder.png"
		}, {
			kind : "moon.IconButton",
			src : "$lib/moonstone/images/video-player/icon-placeholder.png"
		}, {
			kind : "moon.IconButton",
			src : "$lib/moonstone/images/video-player/icon-placeholder.png"
		}, {
			kind : "moon.IconButton",
			src : "$lib/moonstone/images/video-player/icon-placeholder.png"
		}, {
			kind : "moon.IconButton",
			src : "$lib/moonstone/images/video-player/icon-placeholder.png"
		}, {
			kind : "moon.IconButton",
			src : "$lib/moonstone/images/video-player/icon-placeholder.png"
		}, {
			kind : "moon.IconButton",
			src : "$lib/moonstone/images/video-player/icon-placeholder.png"
		}, {
			kind : "moon.IconButton",
			src : "$lib/moonstone/images/video-player/icon-placeholder.png"
		}, {
			kind : "moon.IconButton",
			src : "$lib/moonstone/images/video-player/icon-placeholder.png"
		}]
	}, {
		name : "panels",
		kind : "moon.Panels",
		pattern : "alwaysviewing",
		classes : "enyo-fit",
		showing : false,
		components : [{
			title : "First Panel",
			titleBelow : "Sub-title",
			subTitleBelow : "Sub-sub title",
			classes : "moon-7h",
			components : [{
				kind : "moon.Item",
				content : "Item One",
				ontap : "next"
			}, {
				kind : "moon.Item",
				content : "Item Two",
				ontap : "next"
			}, {
				kind : "moon.Item",
				content : "Item Three",
				ontap : "next"
			}, {
				kind : "moon.Item",
				content : "Item Four",
				ontap : "next"
			}, {
				kind : "moon.ToggleItem",
				content : "Show/Hide Side Handle",
				checked : true,
				onchange : "handleShowingChanged"
			}]
		}, {
			title : "Second Panel",
			components : [{
				kind : "moon.Item",
				content : "Item One",
				ontap : "next"
			}, {
				kind : "moon.Item",
				content : "Item Two",
				ontap : "next"
			}, {
				kind : "moon.Item",
				content : "Item Three",
				ontap : "next"
			}, {
				kind : "moon.Item",
				content : "Item Four",
				ontap : "next"
			}, {
				kind : "moon.Item",
				content : "Item Five",
				ontap : "next"
			}]
		}, {
			title : "Third Panel",
			titleBelow : "Sub-title",
			subTitleBelow : "Sub-sub title",
			classes : "moon-7h",
			components : [{
				kind : "moon.Item",
				content : "Item One",
				ontap : "next"
			}, {
				kind : "moon.Item",
				content : "Item Two",
				ontap : "next"
			}, {
				kind : "moon.Item",
				content : "Item Three",
				ontap : "next"
			}, {
				kind : "moon.Item",
				content : "Item Four",
				ontap : "next"
			}, {
				kind : "moon.Item",
				content : "Item Five",
				ontap : "next"
			}]
		}, {
			title : "Fourth",
			titleBelow : "Sub-title",
			subTitleBelow : "Sub-sub title",
			classes : "moon-7h",
			components : [{
				kind : "moon.Item",
				content : "Item One",
				ontap : "next"
			}, {
				kind : "moon.Item",
				content : "Item Two",
				ontap : "next"
			}, {
				kind : "moon.Item",
				content : "Item Three",
				ontap : "next"
			}, {
				kind : "moon.Item",
				content : "Item Four",
				ontap : "next"
			}, {
				kind : "moon.Item",
				content : "Item Five",
				ontap : "next"
			}]
		}, {
			title : "Fifth",
			joinToPrev : true,
			titleBelow : "Sub-title",
			subTitleBelow : "Sub-sub title",
			classes : "moon-7h",
			components : [{
				kind : "moon.Item",
				content : "Item One",
				ontap : "next"
			}, {
				kind : "moon.Item",
				content : "Item Two",
				ontap : "next"
			}, {
				kind : "moon.Item",
				content : "Item Three",
				ontap : "next"
			}, {
				kind : "moon.Item",
				content : "Item Four",
				ontap : "next"
			}, {
				kind : "moon.Item",
				content : "Item Five",
				ontap : "next"
			}]
		}, {
			title : "Sixth",
			titleBelow : "Sub-title",
			subTitleBelow : "Sub-sub title",
			classes : "moon-7h",
			components : [{
				kind : "moon.Item",
				content : "Item One",
				ontap : "next"
			}, {
				kind : "moon.Item",
				content : "Item Two",
				ontap : "next"
			}, {
				kind : "moon.Item",
				content : "Item Three",
				ontap : "next"
			}, {
				kind : "moon.Item",
				content : "Item Four",
				ontap : "next"
			}, {
				kind : "moon.Item",
				content : "Item Five",
				ontap : "next"
			}]
		}, {
			title : "Seventh",
			joinToPrev : true,
			titleBelow : "Sub-title",
			subTitleBelow : "Sub-sub title",
			classes : "moon-7h",
			components : [{
				kind : "moon.Item",
				content : "Item One",
				ontap : "next"
			}, {
				kind : "moon.Item",
				content : "Item Two",
				ontap : "next"
			}, {
				kind : "moon.Item",
				content : "Item Three",
				ontap : "next"
			}, {
				kind : "moon.Item",
				content : "Item Four",
				ontap : "next"
			}, {
				kind : "moon.Item",
				content : "Item Five",
				ontap : "next"
			}]
		}]
	}],
	next : function(inSender, inEvent) {
		this.$.panels.next();
		return true;
	},
	handleShowingChanged : function(inSender, inEvent) {
		this.$.panels.setHandleShowing(inSender.getChecked());
	}
}); 