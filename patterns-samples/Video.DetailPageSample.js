enyo.kind({
    name: "moon.videoDetailPageSample",
    kind: "FittableRows",
    style: "background: #eaeaea;",
    classes: "moon enyo-unselectable",
    fit: true,
    inTransition: false,
    handlers: {
        onTransitionStart	 : "transitionStart",
        onTransitionFinish	 : "transitionFinish",
        onSpotlightRight	 : "onNavigate",
        ontap				 : "onNavigate"
    },
    components: [
        {kind: "enyo.Spotlight"},
        {
            components: [
                {
                    name: "breadcrumb", 
                    kind: "moon.BreadcrumbDecorator", 
                    fit: true,
                    classes: "enyo-fit",
                    onSetupBreadcrumb: "setupBreadcrumb",
                    breadcrumbComponents: [
                        {
                            kind: "moon.Item",
                            spotlight: true,
                            style: "-webkit-transform: translateY(76px);",
                            components: [
                                {name: "titleAbove", classes: "moon-breadcrumb-title-above"},
                                {name: "title", style: "padding: 5px 0px 0px 0px;"}
                            ]
                        }
                    ], 
                    components: [
                        {
                            name: "panels",
                            kind: "moon.Panels",
                            arrangerKind: "moon.LeanForwardArranger", 
                            realtimeFit: true,
                            index: 2,
                            classes: "enyo-fit",
                            components: [
                                {kind: "HomePanel", spotlight: "container"},
                                {kind: "MoviesPanel", spotlight: "container"},
                                {kind: "MovieDetailPanel", spotlight: "container"}
                            ]
                        }
                    ]
                }
            ]
        }
    ],

    setupBreadcrumb: function(inSender, inEvent) {
        var bc = inEvent.breadcrumb;
        bc.$.titleAbove.setContent(this.$.panels.children[bc.index].titleAbove);
        bc.$.title.setContent(this.$.panels.children[bc.index].title);
    },
    
    onNavigate: function(inSender, inEvent) {
        if (this.inTransition) { return; }
        
        if (inEvent.originator instanceof moon.Button || inEvent.originator instanceof moon.Item || inEvent.originator instanceof enyo.Image) {
            if (inEvent.type == "ontap" || inEvent.type == "tap") {
                this.$.panels.next();
            }
        }
    },

    transitionStart: function(inSender, inEvent) {
        this.inTransition = true;
    },
    
    transitionFinish: function(inSender, inEvent) {
        this.$.breadcrumb.panelIndexChanged(inSender, inEvent);
        this.inTransition = false;
    }
});

enyo.kind({
    name: "HomePanel",
    layoutKind: "enyo.FittableRowsLayout",
	style: "padding: 20px 50px 20px 50px; width: 100%;",
    fit: true,
    title: "Main Menu",
    titleAbove: "01",
    handler: {onresize: "resizeHandler"},
    components: [
        {kind: "moon.Header", content: "Main Menu", titleAbove: "01"},
        {
            name: "columns",
            kind: "FittableColumns",
            components: [
                {
                    style: "width: 15%;",
                    components: [
                        {kind: "moon.Item", content: "Browser Movies", spotlight: true},
                        {kind: "moon.Item", content: "Browser TV Shows", spotlight: true},
                        {kind: "moon.Item", content: "Queue", spotlight: true},
                        {kind: "moon.Item", content: "Search", spotlight: true}
                    ]
                },
                {
                    name: "content",
                    fit: true,
                    style: "padding-top: 5px",
                    components: [
                        {
                            name: "branding",
                            fit: true,
                            classes: "moon-activitypatternpanel2-branding",
                            content: "branding"
                        }
                    ]
                }
            ]
        }
    ],
    
    rendered: function() {
        this.inherited(arguments);
        this.resizeHandler();
    },
    
    resizeHandler: function() {
        var w = this.$.content.node.offsetWidth;
        var h = window.innerHeight - this.$.columns.node.offsetTop - 15;
        if (this.w !== w || this.h !== h) {
            this.$.branding.setStyle("width: " + w + "px; height: " + h + "px;");
            this.w = w;
            this.h = h;
        }
    }
});

enyo.kind({
    name: "MoviesPanel",
    layoutKind: "enyo.FittableRowsLayout",
	style: "padding: 20px 50px 0px 20px; width: 85%",
    fit: true,
    title: "Browser Movies",
    titleAbove: "02",
    components: [
        {
            kind: "moon.Header",
            content: "Browser Movies",
            titleAbove: "02",
            components: [
                {
                    style: "width: 100%; text-align: right; margin: 125px 0px 0px 0px;",
                    components: [{kind: "moon.IconButton", src: "assets/icon-list.png", style: "border: none;"}]
                }
            ]
        },
        {
			name: "gridlist",
			kind: "moon.GridList",
            style: "padding: 5px 0px 0px 0px;",
            fit: true,
			onSetupItem: "setupItem",
            touch: true,
            itemWidth: 270,
			itemHeight: 202,
			itemSpacing: 35,
			components: [
				{name: "item", kind: "moon.GridList.ImageItem"}
			]
		}
    ],
    
    rendered: function() {
        this.inherited(arguments);
        this.search();
    },
    
    search: function() {
		var params = {
			method: "flickr.photos.search",
			format: "json",
			api_key: "2a21b46e58d207e4888e1ece0cb149a5",
			per_page: 50,
			page: 0,
			text: "korean sushi",
			sort: "date-posted-desc",
			extras: "url_m"
		};
		new enyo.JsonpRequest({url: "http://api.flickr.com/services/rest/", callbackName: "jsoncallback"}).response(this, "processFlickrResults").go(params);
	},
    
	processFlickrResults: function(inRequest, inResponse) {
		this.results = inResponse.photos.photo;
		this.$.gridlist.show(this.results.length);
	},
    
	setupItem: function(inSender, inEvent) {
		var i = inEvent.index;
		var item = this.results[i];
		if (!item.url_m) {
			return;
		}
		this.$.item.setSource(item.url_m);
		this.$.item.setCaption(item.title);
		this.$.item.setSelected(this.$.gridlist.isSelected(i));
	}
});

enyo.kind({
    name: "MovieDetailPanel",
    layoutKind: "enyo.FittableRowsLayout",
	style: "padding: 20px 50px 0px 20px; width: 85%",
    fit: true,
    title: "Movie Name",
    titleAbove: "03",
    handler: {onresize: "resizeHandler"},
    components: [
        {
            kind: "moon.Header",
            content: "Movie Name",
            titleAbove: "03",
            components: [
                {
                    style: "width: 100%; text-align: right; margin: 125px 0px 0px 0px;",
                    components: [
                        {kind: "moon.IconButton", src: "assets/icon-download.png", style: "border: none;"},
                        {kind: "moon.IconButton", src: "assets/icon-favorite.png", style: "border: none; margin: 0px 0px 0px 20px;"},
                        {kind: "moon.IconButton", src: "assets/icon-next.png", style: "border: none; margin: 0px 0px 0px 20px;"}
                    ]
                }
            ]
        },
        {
            name: "container",
            kind: "FittableColumns",
            fit: true,
            components: [
                {
                    name: "detail",
                    style: "width: 40%;",
                    components: [
                        {name: "movie", kind: "enyo.Image", src: "assets/default-movie.png", style: "width: 100%; padding: 28px 0px 0px 0px;"},
                        {
                            name: "info",
                            kind: "FittableColumns",
                            components: [
                                {
                                    style: "width: 26%;",
                                    components: [
                                        {
                                            kind: "moon.CaptionDecorator",
                                            side: "top",
                                            content: "SD",
                                            components: [
                            					{
                            						kind: "moon.Button",
                            						ontap: "buttonTapped",
                            						components: [
                            							{content: "$", classes: "moon-pre-text"},
                            							{content: "3", classes: "moon-large-text"},
                            							{content: "99", classes: "moon-superscript"}
                            						]
                            					}
                                            ]
                                        }
                                    ]
                                },
                                {style: "width: 11%;"},
                                {
                                    style: "width: 26%;",
                                    components: [
                                        {
                                            kind: "moon.CaptionDecorator",
                                            side: "top",
                                            content: "HD",
                                            components: [
                            					{
                            						kind: "moon.Button",
                            						ontap: "buttonTapped",
                            						components: [
                            							{content: "$", classes: "moon-pre-text"},
                            							{content: "6", classes: "moon-large-text"},
                            							{content: "99", classes: "moon-superscript"}
                            						]
                            					}
                                            ]
                                        }
                                    ]
                                },
                                {style: "width: 11%;"},
                                {
                                    style: "width: 26%;",
                                    components: [
                                        {
                                            kind: "moon.CaptionDecorator",
                                            side: "top",
                                            content: "3D",
                                            components: [
                            					{
                            						kind: "moon.Button",
                            						ontap: "buttonTapped",
                            						components: [
                            							{content: "$", classes: "moon-pre-text"},
                            							{content: "7", classes: "moon-large-text"},
                            							{content: "99", classes: "moon-superscript"}
                            						]
                            					}
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {name: "play", kind: "moon.IconButton", src: "assets/icon-big-play.png", classes: "moon-play-icon"}
                    ]
                },
                {style: "width: 5%;"},
                {
                    name: "synopsis",
                    style: "width: 30%;",
                    components: [
                        {
                            kind: "FittableRows",
                            components: [
                                {
                                    kind: "FittableColumns",
                                    style: "margin: 28px 0px 0px 0px; font-size: 28px;",
                                    components: [
                                        {
                                            kind: "FittableRows",
                                            style: "width: 30%;",
                                            components: [
                                                {kind: "moon.Divider", style: "margin: 0px 0px 15px 0px; font-size: 28px;", content: "Rating"},
                                                {tag: "b", content: "PG-13", style: "font-size: 57px; color: #4b4b4b;"}
                                            ]
                                        },
                                        {style: "width: 5%;"},
                                        {
                                            kind: "FittableRows",
                                            style: "width: 30%;",
                                            components: [
                                                {kind: "moon.Divider", style: "margin: 0px 0px 15px 0px; font-size: 28px;", content: "Release Date"},
                                                {tag: "b", content: "2013", style: "font-size: 57px; color: #4b4b4b;"}
                                            ]
                                        },
                                        {style: "width: 5%;"},
                                        {
                                            kind: "FittableRows",
                                            style: "width: 30%;",
                                            components: [
                                                {kind: "moon.Divider", style: "margin: 0px 0px 15px 0px; font-size: 28px;", content: "Running Time"},
                                                {
                                                    kind: "FittableColumns",
                                                    components: [
                                                        {tag: "b", content: "122", style: "font-size: 57px; color: #4b4b4b;"},
                                                        {content: "min", style: "color: #4b4b4b; vertical-align: bottom; padding: 0px 0px 7px 0px;"}
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {kind: "moon.Divider", style: "margin: 70px 0px 5px 0px; font-size: 28px;", content: "Synopsis"},
                                {
                                    style: "text-transform: none; font-size: 28px; color: #4b4b4b;",
                                    components: [
                                        {allowHtml: true, content: "<b>Staring: </b>Actor Name, Actor Name, and Actor Name"},
                                        {tag: "br"},
                                        {
                                            content: "Pixar genius reigns in this funny romantic comedy, which stars a robot who says absolutely nothing for a full 25 minutes yet somehow completely transfixes and endears himself to the audience within the first few minutes of the film. As the last robot left on earth, Wall-E (voiced by Ben Burtt) is one small robot--with a big, big heart--who holds the future of earth and mankind squarely in the palm of his metal hand. He's outlasted all the \"Waste Allocation Load Lifter Earth-Class\" robots that were assigned some 700 years ago to clean up the environmental mess that man made of earth while man vacationed aboard the luxury spaceship Axiom."
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {style: "width: 5%;"},
                {
                    name: "more",
                    style: "width: 20%;",
                    components: [
                        {kind: "moon.Divider", style: "margin: 28px 0px 5px 0px; font-size: 28px;", content: "More"},
                        {kind: "Group", components: [
                            {kind: "moon.SelectableItem", content: "Trailers", spotlight: true},
                            {kind: "moon.SelectableItem", content: "Also Watched", spotlight: true},
                            {kind: "moon.SelectableItem", content: "Recommendations", spotlight: true},
                            {kind: "moon.SelectableItem", content: "Reviews", spotlight: true},
                            {kind: "moon.SelectableItem", content: "Cast", spotlight: true}
                        ]}
                    ]
                }
            ]
        }
    ],
    
    rendered: function() {
        this.inherited(arguments);
        this.resizeHandler();
    },
    
    resizeHandler: function() {
        var h = window.innerHeight - this.$.container.node.offsetTop;
        this.$.container.applyStyle("height: " + h + "px;");
        this.$.detail.applyStyle("height: " + h + "px;");
        this.$.synopsis.applyStyle("height: " + h + "px;");
        this.$.more.applyStyle("height: " + h + "px;");
        
        h = Math.round(this.$.movie.node.offsetWidth * 353 / 627);
        this.$.movie.applyStyle("height: " + h + "px;");
        
        var x = Math.round((this.$.movie.node.offsetWidth - 160) * 0.5);
        var y = Math.round((h + 160) * -0.5) - this.$.info.node.offsetHeight;
        this.$.play.setStyle("-webkit-transform: translateX(" + x + "px) translateY(" + y + "px);");
    }
});
