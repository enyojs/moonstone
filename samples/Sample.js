enyo.kind({
	name: "moon.sample.app",
	classes: "moon enyo-unselectable enyo-fit",
	published: {
		query: null,
		files: null,
		sample: null,
		locale: "local"
	},
	listTools: [
		{kind: "moon.Panels", pattern: "activity", classes: "enyo-fit", components: [
			{kind: "moon.Panel", title: "Samples", headerType: "small",
				headerComponents: [
					{kind: "moon.ContextualPopupDecorator", components: [
						// {name: "caption", kind: "moon.CaptionDecorator", content: "Set Locale", side: "left", components: [
						{kind: "moon.Button", content: "Set Locale"},
						// ]},
						{kind: "moon.ContextualPopup", components: [
							{content: "Set Locale", kind: "moon.Divider"},
							{kind: "moon.Scroller", classes: "enyo-fill", components: [
								{kind: "Group", onActivate: "localeGroupChanged", components: [
									{content:"local", kind: "moon.ToggleItem", checked: true},
									{content:"en-US", kind: "moon.ToggleItem"},
									{content:"ko-KR", kind: "moon.ToggleItem"},
									{content:"zh-Hant-HK", kind: "moon.ToggleItem"}
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
		onChooseSample: "chooseSample"
	},
	create: function() {
		this.inherited(arguments);
		this.files = {};
		this.query = this.getQueryObject();
		this.setSampleFromQuery();

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
				dataList.push({sampleName: sampleName, label: sampleName.replace(/Sample$/i, "")});
			}
		}
		var c = new enyo.Collection(dataList);
		this.createComponents(this.listTools);
		this.render();
		this.$.list.set("collection", c);
	},
	localeGroupChanged: function(inSender, inEvent) {
		if (inEvent.toggledControl.getChecked()) {
			var selected = inEvent.toggledControl.getContent();
			this.set("locale", selected );
		}
	},
	localeChanged: function() {
		if (this.get("locale")) {
			enyo.log("Setting Locale:", this.get("locale"));
			enyo.updateLocale(this.get("locale"));
		}
	},
	sampleChanged: function() {
		if (this.get("sample")) {
			enyo.log("Setting Sample:", this.get("sample"));
			this.loadSample();
		}
	},
	setSampleFromQuery: function() {
		this.set("sample", this.get("query").s);
		this.set("locale", this.get("query").locale);
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
			if (fs[cssFile]) {
				this.appendToHead( this.createNode("link", {rel: "stylesheet", href: cssFile}) );
			}
			if (fs[jsFile]) {
				this.appendToHead( this.createNode("script", {type: "text/javascript", src: jsFile, onload: this.bindSafely(this.launchSample) }) );
			}

			if (fs[jsFile] || fs[cssFile]) {
				return true;
			} else {
				this.createList();
				return false;
			}
		}
	},
	launchSample: function() {
		var s = this.get("sample");
		this.appendToHead( this.createNode("script", {type: "text/javascript", content: ' new moon.sample.' + s + '().renderInto(document.body); enyo.log("'+s+' Launched.")'}) );
	},
	getQueryObject: function() {
		if (!window.location.search || !window.location.search.substr(1)) {
			return {};
		}
		var i, pair,
			querystring = window.location.search.substr(1),
			pairs = querystring.split(/&/) || [],
			query = {};
		for (i = 0; i < pairs.length; i++) {
			pair = pairs[i].split(/=/);
			query[pair[0]] = (pair[1] !== undefined ? decodeURIComponent(pair[1]) : null);
		}
		return query;
	},
	haijackPackage: function() {
		// Maybe we want to save this off and restore it after we've stolen it?
		// var localDepends = enyo.depends;
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
		
		this.appendToHead( this.createNode("script", {src: "package.js"}) );
	},
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