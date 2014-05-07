enyo.kind({
	name: "moon.sample.UnicodeCharactersSample",
	kind:"FittableRows",
	classes: "moon enyo-unselectable enyo-fit moon-input-sample",
	components: [
		{kind: "moon.Divider", content: "Generated Unicode Entities and their Icons"},
		{name: "repeater", kind: "moon.DataList", components: [
			{classes: "enyo-border-box", components: [
				{kind: "moon.InputDecorator", style: "width: 20ex;", components: [
					{content: "HTML Entity"},
					{kind: "moon.Input", name: "text"}
				]},
				{kind: "moon.InputDecorator", style: "width: 20ex;", components: [
					{content: "CSS Entity"},
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
			start = parseInt("F0000", 16),
			end = start + 50,
			coll = new enyo.Collection();

		for (i = start; i < end; i++) {
			hex = i.toString(16);
			coll.add({entity: "&#x" + hex + ";", cssref: "\\0" + hex});
		}
		this.$.repeater.set("collection", coll);
	}
});
