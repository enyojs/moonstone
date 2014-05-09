enyo.kind({
	name: "moon.sample.UnicodeCharactersSample",
	kind:"FittableRows",
	classes: "moon enyo-unselectable enyo-fit moon-input-sample",
	components: [
		{kind: "moon.Divider", content: "Generated Unicode Entities"},
		{kind: "moon.InputDecorator", components: [
			{content: "Start at", classes: "input-label"},
			{kind: "moon.Input", name: "startAt", placeholder: "F0000", value: "F0000", onchange: "generateCharacters"}
		]},
		{kind: "moon.InputDecorator", components: [
			{content: "Count", classes: "input-label"},
			{kind: "moon.Input", name: "count", placeholder: "50", value: 50, onchange: "generateCharacters"}
		]},
		{kind: "moon.Divider", content: "Unicode Entities and their Icons"},
		{content: "HTML Entity", classes: "group-heading"},
		{content: "CSS Entity", classes: "group-heading"},
		{name: "repeater", fit: true, kind: "moon.DataList", components: [
			{classes: "enyo-border-box", components: [
				{kind: "moon.InputDecorator", components: [
					{kind: "moon.Input", name: "text"}
				]},
				{kind: "moon.InputDecorator", components: [
					{kind: "moon.Input", name: "css"}
				]},
				{name: "icon", classes: "moon-icon", allowHtml: true}
			], bindings: [
				{from: ".model.entity", to: ".$.text.value"},
				{from: ".model.cssref", to: ".$.css.value"},
				{from: ".model.entity", to: ".$.icon.content"}
			]}
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.generateCharacters();
	},
	generateCharacters: function() {
		var i, hex,
			start = parseInt(this.$.startAt.get("value"), 16),
			end = start + Number(this.$.count.get("value")),
			coll = new enyo.Collection();

		for (i = start; i < end; i++) {
			hex = i.toString(16);
			coll.add({entity: "&#x" + hex + ";", cssref: "\\0" + hex});
		}
		this.$.repeater.set("collection", coll);
	}
});
