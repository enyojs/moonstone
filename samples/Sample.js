(function (enyo, scope) {

	var locales = [
		{locale: 'local', title: '', selected: true},
		{locale: 'en-US', title: '<span class="light">- US English</span>'},
		{locale: 'ko-KR', title: '<span class="light">- Korean</span>'},
		{locale: 'th-TH', title: '<span class="light">- Thai, with tall characters</span>'},
		{locale: 'ar-SA', title: '<span class="light">- Arabic, RTL and standard font</span>'},
		{locale: 'ur-PK', title: '<span class="light">- Urdu, RTL and custom Urdu font</span>'},
		{locale: 'zh-Hant-HK', title: '<span class="light">- Traditional Chinese, custom Hant font</span>'},
		{locale: 'ja-JP', title: '<span class="light">- Japanese, custom Japanese font</span>'}
	];

	/**
	* _Moonstone Sample_ is a tool for displaying and interacting with sample code in the Moonstone
	* user interface library. This tool can display a list of all samples and load individual
	* samples. The URL to access samples accepts a sample-name and an optional internationalization
	* locale to load the sample in. When browsing through and running the samples, the URL will
	* automatically update as necessary.
	*
	* Some example URLs:
	* * Sample.html
	* * Sample.html#ButtonSample
	* * Sample.html#ButtonSample/ar-SA
	*
	* If you'd like to add a sample to the list, you'll need to include it, and any related files,
	* in the _package.js_ file in this directory. Be sure to name your file the same as your
	* sample's kind.
	*
	* **Example:** _ContextualPopupSample.js_
	* ```
	* enyo.kind({
	*     name: 'moon.sample.ContextualPopupSample',
	*     ...
	* });
	* ```
	*
	* @namespace moon.sample
	*/
	enyo.kind({
		name: 'moon.sample.app',
		classes: 'moon enyo-unselectable enyo-fit',
		themes: {
			'dark': 'moonstone-dark.css',
			'light': 'moonstone-light.css'
		},
		published: {
			files: null,
			filesLoaded: false,
			sample: null,
			locale: 'local',
			theme: 'dark',
			location: function () {
				var s = this.get('sample'),
					locale = this.get('locale');
				return s + ((!locale || locale == 'local') ? '' : '/' + locale);
			}
		},
		components: [
			{classes: 'moon-sample-persistant-hotspot', components: [
				{classes: 'moon-sample-persistant-frame', spotlight: 'container', components: [
					{kind: 'moon.Button', content: 'Reload', small: true, spotlight: false, classes: 'moon-sample-persistant-locale-button', ontap: 'reload'},
					{kind: 'moon.Button', content: 'Back to List', small: true, spotlight: false, classes: 'moon-sample-persistant-locale-button', ontap: 'backToList'},
					{kind: 'moon.ContextualPopupDecorator', components: [
						{kind: 'moon.Button', content: 'Set Locale', small: true, spotlight: false, classes: 'moon-sample-persistant-locale-button'},
						{name: 'localePopup', kind: 'moon.ContextualPopup', classes: 'moon-sample-locale-popup', components: [
							{content: 'Set Locale', kind: 'moon.Divider'},
							{name: 'localeRepeater', kind: 'enyo.DataRepeater', ontap: 'localeListTapped', selection: true, groupSelection: true, selectionProperty: 'selected', containerOptions: {kind: 'moon.Scroller', classes: 'enyo-fill'}, fit: true, components: [
								{kind: 'moon.sample.LocaleItem', allowHtml: true, bindings: [
									{from:'model.locale', to: 'locale'},
									{from:'model.title', to: 'title'},
									{from:'model.selected', to: 'checked'}
								]}
							]}
						]}
					]},
					{kind: 'moon.ToggleButton', toggleOffLabel: 'Dark Theme', toggleOnLabel: 'Light Theme', small: true, ontap: 'handleThemeTap'}
				]}
			]},
			{name: 'home'},
			{name: 'router', kind: 'moon.sample.appRouter', history: true, triggerOnStart: true}
		],
		bindings: [
			{from: 'locales', to: '$.localeRepeater.collection'}
		],
		listTools: [
			{kind: 'moon.Panels', pattern: 'activity', classes: 'enyo-fit', components: [
				{kind: 'moon.Panel', title: 'Samples', headerType: 'small',
					components: [
						{name: 'list', kind: 'moon.DataList', components: [
							{classes: 'enyo-border-box', components: [
								{name: 'label', kind: 'moon.Item', ontap: 'doChooseSample'}
							],
							bindings: [
								{from: 'model.sampleName', to: '$.label.sampleName'},
								{from: 'model.label', to: '$.label.content'}
							],
							events: {
								onChooseSample: ''
							}}
						]}
					]
				}
			]}
		],
		handlers: {
			onChooseSample: 'chooseSample',
			onRouteChange: 'handleRoute'
		},
		computed: {
			location: ['sample', 'locale']
		},
		initComponents: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				this.files = {};
				this.haijackPackage();
			};
		}),
		create: enyo.inherit(function (sup) {
			return function () {
				this.locales = new enyo.Collection(locales);
				sup.apply(this, arguments);

				this.findThemeNode();
			};
		}),
		createList: function () {
			var fs = this.get('files'),
				sortedFiles = Object.keys(fs).sort(),
				dataList = [];
			for (var i = 0; i < sortedFiles.length; i++) {
				var file = sortedFiles[i],
					sampleName = file.replace(/\.\w+$/i, '');
				if (fs[file]) {
					dataList.push({sampleName: sampleName, label: sampleName.replace(/(Sample)$/i, ' $1')});
				}
			}
			if (!this.$.home.$.list) {
				this.$.home.createComponents(this.listTools);
			}
			this.render();
			if (dataList.length) {
				var c = new enyo.Collection(dataList);
				this.$.home.$.list.set('collection', c);
			}
		},
		localeListTapped: function (sender, ev) {
			var locale = ev.model.get('locale');
			if (locale) {
				this.set('locale', locale);
			}
		},
		handleRoute: function (sender, ev) {
			this.set('sample', ev.sampleName);
			this.set('locale', ev.locale);
		},
		localeChanged: function (oldLocale, newLocale) {
			enyo.log('Setting Locale:', newLocale);
			if (this.$.localePopup && this.$.localePopup.get('showing')) {
				this.$.localePopup.hide();
			}
			this.locales.find(function(elem) { return elem.get('locale') == newLocale; }).set('selected', true);
			enyo.updateLocale(newLocale);
			this.$.router.trigger({location: this.get('location'), change: true});
		},
		sampleChanged: function () {
			if (this.get('sample')) {
				this.openSample();
			} else {
				// We have no sample, just render out the list.
				this.activateList();
			}
		},
		activateList: function () {
			enyo.log('%cList all of the Samples', 'color:green');
			this.disableAllStylesheets();
			if (this.$.sample) {
				this.$.sample.destroy();
			}
			this.$.home.show();
			if (!this.$.home.hasNode() || !this.$.home.hasNode().children.length) {
				// We've never been generated, lets fix that.
				this.createList();
			}
			this.render();
		},
		backToList: function () {
			this.set('sample', '');
			this.$.router.trigger({location: this.get('location'), change: true});
		},
		reload: function () {
			window.location.reload();
		},
		chooseSample: function (sender, ev) {
			var sampleName = ev.originator.get('sampleName');
			this.set('sample', sampleName);
		},
		openSample: function () {
			var s = this.get('sample'),
				fs = this.get('files');

			// Check if the key exists. We don't really care what the value is for this right now
			if (Object.keys(fs).length) {
				this.disableAllStylesheets();

				if (s) {
					// Check if the enyo.constructorForKind(s) throws an exception.
					try {
						enyo.constructorForKind('moon.sample.' + s);
						// We haven't thrown yet, so it must have returned safely.

						// Enable the stylesheet
						this.enableStylesheet(s);

						this.launchSample();
						return true;
					}
					catch(err) {
						// It threw an exception, so that sample isn't loaded.
						return this.loadSample();
					}
				}
				this.createList();
				return false;
			}
		},
		loadSample: function () {
			var s = this.get('sample'),
				fs = this.get('files'),
				jsFile = s + '.js',
				cssFile = s + '.css',
				// Do we have JS and CSS
				hasJs = (typeof fs[jsFile] != 'undefined'),
				hasCss = (typeof fs[cssFile] != 'undefined');

			if (hasCss) {
				// Enable the stylesheet if it's already here. If it isn't, load it.
				if (!this.enableStylesheet(s)) {
					this.appendToHead( this.createNode('link', {'class': 'sample-style ' + s, rel: 'stylesheet', href: cssFile, type: 'text/css'}) );
				}
			}
			if (hasJs) {
				this.appendToHead( this.createNode('script', {type: 'text/javascript', src: jsFile, onload: this.bindSafely(this.launchSample, null) }) );
			}

			if (hasJs || hasCss) {
				return true;
			} else {
				this.createList();
				return false;
			}
		},
		enableStylesheet: function (name) {
			var i, sheets = document.getElementsByClassName(name);
			for (i = 0; i < sheets.length; i++) {
				sheets[i].disabled = false;
			}
			return sheets.length;
		},
		disableAllStylesheets: function () {
			var sheets = document.getElementsByClassName('sample-style');
			for (var i = 0; i < sheets.length; i++) {
				sheets[i].disabled = true;
			}
		},
		launchSample: function (sample) {
			var s = sample || this.get('sample'),
				loc = this.get('location'),
				script = ' enyo.$.app.$.home.hide(); enyo.$.app.createComponent({name: "sample", kind: "moon.sample.' + s + '"}).render(); console.log(\'%c%s Launched.\', \'color:green;\', \'' + s + '\')';
			this.$.router.trigger({location: loc, change: true});
			this.appendToHead( this.createNode('script', {type: 'text/javascript', content: script}) );
		},
		haijackPackage: function () {
			// Maybe we want to save this off and restore it after we've stolen it?
			var localDepends = enyo.depends;
			enyo.depends = this.bindSafely(function() {
				var i, file,
					files = {};
				for (i = 0; i < arguments.length; i++) {
					file = arguments[i];
					files[file] = (file || '').match(/\.js$/i) && file != 'package.js' && file != 'Sample.js';
				}
				this.set('files', files);
				this.openSample();
			});

			this.appendToHead( this.createNode('script', {
				src: 'package.js',
				onload: this.bindSafely( function() {
					// Once this loads, we'll reset the enyo.depends method to what it was before to be nice.
					enyo.depends = localDepends;
				})
			}) );
		},
		// getQueryObject: function (queryString) {
		// 	queryString = queryString || window.location.search;
		// 	if (!queryString || queryString.length <= 1) {
		// 		return {};
		// 	}
		// 	queryString = queryString.replace(/^\?/, '');
		// 	var i, pair,
		// 		pairs = queryString.split(/&/) || [],
		// 		query = {};
		// 	for (i = 0; i < pairs.length; i++) {
		// 		pair = pairs[i].split(/=/);
		// 		// Allow for and differentiate params that are == '' vs not equal to anything.
		// 		// ?param1=value1   vs.  ?param1=     vs.  ?param1
		// 		// {param1:value1}       {param1:''}       {param:null}
		// 		query[pair[0]] = (pair[1] !== undefined ? decodeURIComponent(pair[1]) : null);
		// 	}
		// 	return query;
		// },
		findThemeNode: function () {
			var i,
				theme = this.get('theme'),
				cs = document.getElementsByTagName('link');

			for (i = 0; i < cs.length; i++) {
				if (cs[i].href.indexOf(this.themes[theme]) > 0) {
					this._themeNode = cs[i];
					return this._themeNode;
				}
			}
		},
		changeLink: function (from, to) {
			if (from == to) return;

			var themeNode = this._themeNode || this.findThemeNode();

			if (themeNode.href.indexOf(from) > 0) {
				themeNode.href = themeNode.href.replace(from, to);
			}
		},
		themeChanged: function (oldTheme, newTheme) {
			this.changeLink(this.themes[oldTheme], this.themes[newTheme]);
		},
		handleThemeTap: function (sender, ev) {
			this.set('theme', ev.originator.owner.get('value') ? 'light' : 'dark');
		},
		createNode: function (tagName, attrs) {
			var key, node = document.createElement(tagName);
			if (attrs && Object.keys(attrs)) {
				for (key in attrs) {
					if (key.match(/^on\w/)) {
						node[key] = attrs[key];
					} else if (key == 'content') {
						node.innerHTML = attrs[key];
					} else {
						node.setAttribute(key, attrs[key]);
					}
				}
			}
			return node;
		},
		appendToHead: function (node) {
			if (typeof node == 'string') {
				document.head.insertAdjacentHTML('beforeend', node );
			} else {
				document.head.appendChild( node );
			}
		}
	});

	enyo.kind({
		name: 'moon.sample.LocaleItem',
		kind: 'moon.ToggleItem',
		handleTapEvent: false,
		observers: {
			updateTitle: ['locale', 'title']
		},
		updateTitle: function() {
			this.set('content', this.locale + ' ' + this.title);
		}
	});

	enyo.kind({
		name: 'moon.sample.appRouter',
		kind: enyo.Router,
		history: true,
		routes: [
			{path: ':sampleName/:locale', handler: 'handleRoute'},
			{path: ':sampleName', handler: 'handleRoute'},
			{path: '/:locale', handler: 'handleRouteLocaleOnly'}
		],
		events: {
			onRouteChange: ''
		},
		handleRoute: function (sampleName, locale) {
			this.doRouteChange({sampleName: sampleName, locale: locale || 'local'});
		},
		handleRouteLocaleOnly: function (locale) {
			this.handleRoute({sampleName: null, locale: locale});
		}
	});

})(enyo, this);
