/**
	_sun.Header_ is a Moonstone-styled control with a large title and an area for
	additional controls.
*/
enyo.kind({
	name: "sun.Header",
	handlers: {ontap: "onComponentTap"},
	events: {"onHeaderLeftTapped":""},
	published: {
		//* Title of the header
		title: '',
		//* Text below the header
		titleBelow: '',
		//* If true, the sun-arrow-header css class will be applied to this header
		arrowIcon: false,
		//* If true, onHeaderLeftTapped event won't be generated
		arrowIconDisable: false,
		//* If true, loading bar will be applied to this header
		loading: false,
		//* loading bar progress
		progress: 0
	},
	classes: "sun-header moon-header",
	components: [
		{kind: "FittableColumns", components:[
			{name: "texts", fit: true, classes: "sun-header-container", components: [
				{name: "title", classes: "sun-header-font sun-header-title"},
				{name: "titleBelow", classes: "sun-header-title-below"},
				{name: "mask", classes: "sun-header-title-mask"}
			]},
			{name: "client", classes: "sun-header-client"}
		]},
		{name: "arrowIcon", classes: "sun-arrow-icon", ontap: "headerLeftTapped"},
		{name: "loading", kind: "sun.ProgressBar", progress: 0, classes: "sun-header-loading"}
	],
	create: function() {
		this.inherited(arguments);
		this.arrowIconChanged();
		this.arrowIconDisableChanged();
		this.titleChanged();
		this.titleBelowChanged();
		this.loadingChanged();
		this.progressChanged();
	},
	//* @protected
	contentChanged: function() {
		this.$.title.setContent(this.title || this.content);
	},
	//* @protected
	// For backward-compatibility with original API
	titleChanged: function() {
		this.contentChanged();
	},
	//* @protected
	titleBelowChanged: function() {
		this.$.titleBelow.setContent(this.titleBelow || '');
		this.addRemoveClass("sun-two-lines-header", this.titleBelow);
	},
	arrowIconChanged: function() {
		this.addRemoveClass("sun-arrow-header", this.getArrowIcon());
		if(!this.getArrowIcon()) {
			this.$.arrowIcon.hide();
		} else {
			this.$.arrowIcon.show();
		}
	},
	arrowIconDisableChanged: function() {
		this.$.arrowIcon.disable = this.getArrowIconDisable();
	},
	loadingChanged: function() {
		this.progressChanged();
	},
	progressChanged: function() {
		if(this.getLoading()) {
			this.$.loading.setProgress(this.progress);
		} else {
			this.$.loading.setProgress(0);
		}
	},
	headerLeftTapped: function() {
		if(this.getArrowIconDisable() == false) {
		this.doHeaderLeftTapped();

			return false;
		} else {
			return true;
		}
	}
});
