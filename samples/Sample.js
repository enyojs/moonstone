enyo.kind({
	name: "moon.sample.app",
	classes: "moon enyo-unselectable enyo-fit",
	published: {
		files: null,
		filesLoaded: false,
		sample: null,
		locale: "local",
		location: function() {
			var s = this.get("sample"),
				locale = this.get("locale");
			return s + ((!locale || locale == "local") ? "" : "/" + locale);
		}
	},
	components: [
		{name: "router", kind: "moon.sample.appRouter", history: true, triggerOnStart: true}
	],
	listTools: [
		{kind: "moon.Panels", pattern: "activity", classes: "enyo-fit", components: [
			{kind: "moon.Panel", title: "Samples", headerType: "small",
				headerComponents: [
					{kind: "moon.ContextualPopupDecorator", components: [
						// {name: "caption", kind: "moon.CaptionDecorator", content: "Set Locale", side: "left", components: [
						{kind: "moon.Button", content: "Set Locale"},
						// ]},
						{name: "localePopup", kind: "moon.ContextualPopup", components: [
							{content: "Set Locale", kind: "moon.Divider"},
							{kind: "moon.Scroller", classes: "enyo-fill", components: [
								{kind: "Group", onActivate: "localeGroupChanged", components: [
									{value: "", content:'local', kind: "moon.ToggleItem", checked: true},
									{value: "en-US", content:'en-US <span style="font-family: \'MuseoSans 300\'";">- US English</span>', kind: "moon.ToggleItem", allowHtml: true},
									{value: "ko-KR", content:'ko-KR <span style="font-family: \'MuseoSans 300\'";">- Korean</span>', kind: "moon.ToggleItem", allowHtml: true},
									{value: "ar-SA", content:'ar-SA <span style="font-family: \'MuseoSans 300\'";">- RTL and standard font</span>', kind: "moon.ToggleItem", allowHtml: true},
									{value: "ur-PK", content:'ur-PK <span style="font-family: \'MuseoSans 300\'";">- RTL and custom Urdu font</span>', kind: "moon.ToggleItem", allowHtml: true},
									{value: "zh-Hant-HK", content:'zh-Hant-HK <span style="font-family: \'MuseoSans 300\';">- custom Hong Kong font</span>', kind: "moon.ToggleItem", allowHtml: true},
									{value: "ja-JP", content:'ja-JP <span style="font-family: \'MuseoSans 300\';">- custom Japanese font</span>', kind: "moon.ToggleItem", allowHtml: true}
								]}
							]}
						]}
					]}
				],
				components: [
					{name: "list", kind: "moon.DataList", components: [
						{classes: "enyo-border-box", components: [
							{name: "label", kind: "moon.Item", ontap: "doChooseSample"}
						],
						bindings: [
							{from: "model.sampleName", to: "sampleName"},
							{from: "model.label", to: "$.label.content"}
						],
						events: {
							onChooseSample: ""
						}}
					]}
				]
			}
		]}
	],
	handlers: {
		onChooseSample: "chooseSample",
		onRouteChange: "handleRoute"
	},
	computed: {
		location: ["sample", "locale"]
	},
	initComponents: function() {
		this.inherited(arguments);
		// console.log("initComponents");
		this.files = {};

		this.haijackPackage();
	},
	createList: function() {
		var fs = this.get("files"),
			sortedFiles = Object.keys(fs).sort(),
			dataList = [];
		for (var i = 0; i < sortedFiles.length; i++) {
			var file = sortedFiles[i],
				sampleName = file.replace(/\.\w+$/i, "");
			if (fs[file]) {
				dataList.push({sampleName: sampleName, label: sampleName.replace(/(Sample)$/i, " $1")});
			}
		}
		var c = new enyo.Collection(dataList);
		if (!this.$.list) {
			this.createComponents(this.listTools);
		}
		this.$.list.set("collection", c);
	},
	localeGroupChanged: function(inSender, inEvent) {
		var locale = inEvent.toggledControl.get("value");
		if (locale) {
			this.set("locale", locale);
		}
	},
	handleRoute: function(inSender, inEvent) {
		this.set("sample", inEvent.sampleName);
		this.set("locale", inEvent.locale);
	},
	localeChanged: function() {
		enyo.log("Setting Locale:", this.get("locale"));
		if (this.$.localePopup) {
			this.$.localePopup.hide();
		}
		enyo.updateLocale(this.get("locale"));
		this.$.router.trigger({location: this.get("location"), change: true});
	},
	sampleChanged: function() {
		if (this.get("sample")) {
			this.loadSample();
		} else {
			// We have no sample, just render out the list.
			enyo.log("%cList all of the Samples", "color:green");
			this.createList();
			this.renderInto(document.body);
		}
	},
	chooseSample: function(inSender, inEvent) {
		var sampleName = inEvent.originator.get("sampleName");
		this.set("sample", sampleName);
	},
	loadSample: function() {
		var s = this.get("sample"),
			fs = this.get("files"),
			jsFile = s + ".js",
			cssFile = s + ".css";

		if (Object.keys(fs).length) {
			// Check if the enyo.constructorForKind(s) throws an exception.
			try {
				enyo.constructorForKind("moon.sample." + s);
				// We haven't thrown yet, so it must have returned safely.
				this.launchSample();
				return true;
			}
			catch(err) {
				// If it does throw an exception, we haven't loaded this sample yet. Lets load it.
				if (fs[cssFile]) {
					this.appendToHead( this.createNode("link", {rel: "stylesheet", href: cssFile}) );
				}
				if (fs[jsFile]) {
					this.appendToHead( this.createNode("script", {type: "text/javascript", src: jsFile, onload: this.bindSafely(this.launchSample, null) }) );
				}
				// debugger;
				if (fs[jsFile] || fs[cssFile]) {
					return true;
				} else {
					this.createList();
					return false;
				}
			}
		}
	},
	launchSample: function(sample) {
		var s = sample || this.get("sample"),
			loc = this.get("location"),
			script = ' new moon.sample.' + s + '().renderInto(document.body); console.log("%c%s Launched.", "color:green;", "' + s + '")';
		this.$.router.trigger({location: loc, change: true});
		this.appendToHead( this.createNode("script", {type: "text/javascript", content: script}) );
	},
	haijackPackage: function() {
		// Maybe we want to save this off and restore it after we've stolen it?
		// var localDepends = enyo.depends;
		var localDepends = enyo.depends;
		enyo.depends = this.bindSafely(function() {
			var i, file,
				files = {};
			for (i = 0; i < arguments.length; i++) {
				file = arguments[i];
				files[file] = (file || "").match(/\.js$/i) && file != "package.js" && file != "Sample.js";
			}
			this.set("files", files);
			this.loadSample();
		});
		
		this.appendToHead( this.createNode("script", {
			src: "package.js",
			onload: this.bindSafely( function() {
				// Once this loads, we'll reset the enyo.depends method to what it was before to be nice.
				enyo.depends = localDepends;
			})
		}) );
	},
	// getQueryObject: function(queryString) {
	// 	queryString = queryString || window.location.search;
	// 	if (!queryString || queryString.length <= 1) {
	// 		return {};
	// 	}
	// 	queryString = queryString.replace(/^\?/, "");
	// 	var i, pair,
	// 		querystring = window.location.search.substr(1),
	// 		pairs = querystring.split(/&/) || [],
	// 		query = {};
	// 	for (i = 0; i < pairs.length; i++) {
	// 		pair = pairs[i].split(/=/);
	// 		query[pair[0]] = (pair[1] !== undefined ? decodeURIComponent(pair[1]) : null);
	// 	}
	// 	return query;
	// },
	createNode: function(tagName, attrs) {
		var key, node = document.createElement(tagName);
		if (attrs && Object.keys(attrs)) {
			for (key in attrs) {
				if (key.match(/^on\w/)) {
					node[key] = attrs[key];
				} else if (key == "content") {
					node.innerHTML = attrs[key];
				} else {
					node.setAttribute(key, attrs[key]);
				}
			}
		}
		return node;
	},
	appendToHead: function(node) {
		if (typeof node === "string") {
			document.head.insertAdjacentHTML("beforeend", node );
		} else {
			document.head.appendChild( node );
		}
	}
});

enyo.kind({
	name: "moon.sample.appRouter",
	kind: enyo.Router,
	history: true,
	routes: [
		{path: ":sampleName/:locale", handler: "handleRoute"},
		{path: ":sampleName", handler: "handleRoute"},
		{path: "/:locale", handler: "handleRouteLocaleOnly"}
	],
	events: {
		onRouteChange: ""
	},
	handleRoute: function (inSampleName, inLocale) {
		this.doRouteChange({sampleName: inSampleName, locale: inLocale});
	},
	handleRouteLocaleOnly: function (inLocale) {
		this.handleRoute({sampleName: null, locale: inLocale});
	}
});