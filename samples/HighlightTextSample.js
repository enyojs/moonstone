enyo.kind({
	name: "moon.sample.HighlightTextSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "moon.Panels", classes:"enyo-fit", controlClasses:"moon-6h", components: [
			{kind: "moon.Panel", title:"STATIC", titleBelow:"Simple items", subTitleBelow: "Case insensitive", components: [
				{kind: "moon.Scroller", fit: true, components: [
					{kind: "moon.Divider", content:"Standard highlight"},
					{kind: "moon.Item", components: [
						{kind: "moon.HighlightText", content:"Text to highlight", highlight:"text"}
					]},
					{kind: "moon.Item", components: [
						{kind: "moon.HighlightText", content:"Text to highlight", highlight:"to"}
					]},
					{kind: "moon.Item", components: [
						{kind: "moon.HighlightText", content:"Text to highlight", highlight:"highlight"}
					]},
					{kind: "moon.Divider", content:"Custom highlight classes"},
					{kind: "moon.Item", components: [
						{kind: "moon.HighlightText", content:"Text to highlight", highlight:"text", highlightClasses:"highlight-text-sample-red"}
					]},
					{kind: "moon.Item", components: [
						{kind: "moon.HighlightText", content:"Text to highlight", highlight:"to", highlightClasses:"highlight-text-sample-blue"}
					]},
					{kind: "moon.Item", components: [
						{kind: "moon.HighlightText", content:"Text to highlight", highlight:"highlight", highlightClasses:"highlight-text-sample-fancy"}
					]}
				]}
			]},
			{name: "inputPanel", kind: "moon.Panel", headerOptions: {kind: "moon.InputHeader"}, joinToPrev: true, oninput: "search", components: [
				{kind: "moon.DataList", fit: true, name:"list", components: [
					{kind: "moon.HighlightText", bindings: [
						{from: ".model.text", to:".content"},
						{from: ".controller.text", to: ".highlight"}
					]}
				]}
			], title:"SEARCH", titleBelow: "Filtered items in DataList", subTitleBelow: "Case sensitive"}
		]}
	],
	bindings: [
		{from: ".controller", to: ".$.list.controller"},
		{from: ".$.inputPanel.$.header.value", to: ".controller.text"}
	],
	create: function() {
		this.controller = new enyo.Collection(this.data, {
			// we set our available filters block
			filters: {search: "searchFilter"},
			// we want to make use of the ability to set a bindable property to
			// automatically filter on change
			filterProps: "text",
			// we designate our filter as active so it is immediately useable
			activeFilter: "search",
			// we implement our actual filter function that needs to return an array of
			// records to reset the internal data to
			searchFilter: function () {
				var text = this.text;
				// if there is no text value we ultimately need the collection to reset to
				// its original state so we need to return `true` (`true` tells it to reset)
				// otherwise we return the subset of records we want to show, the `reset` call
				// is necessary to ensure we are always filtering the entire dataset, otherwise
				// it will filter against the subset currently set by the filter
				return (text && this.reset().filter(function (record) {
					return record.get("text").indexOf(text) >= 0;
				})) || true;
			}
		});
		this.inherited(arguments);
	},
	search: function(inSender, inEvent) {
		inSender.waterfall("onHighlight", {highlight: inEvent.originator.getValue()});
	},
	data: [
		{ text: "proident irure nostrud", isFolder: false },
		{ text: "adipisicing veniam officia",isFolder: true },
		{ text: "culpa adipisicing Lorem", isFolder: false },
		{ text: "dolor ut excepteur", isFolder: false },
		{ text: "elit veniam nulla", isFolder: true },
		{ text: "irure laboris irure", isFolder: false },
		{ text: "non do consectetur", isFolder: false },
		{ text: "irure dolor laborum", isFolder: true },
		{ text: "nulla aliqua laborum", isFolder: false },
		{ text: "elit ad sit", isFolder: false },
		{ text: "aliqua voluptate nulla", isFolder: false },
		{ text: "non eiusmod nostrud", isFolder: true },
		{ text: "elit est ullamco", isFolder: true },
		{ text: "magna tempor minim", isFolder: true },
		{ text: "excepteur Lorem id", isFolder: true },
		{ text: "quis eiusmod aute", isFolder: false },
		{ text: "proident cillum elit", isFolder: false },
		{ text: "commodo dolor dolor", isFolder: false },
		{ text: "amet laborum officia", isFolder: false },
		{ text: "aute do enim", isFolder: false },
		{ text: "ut proident elit", isFolder: false },
		{ text: "ea reprehenderit velit", isFolder: false },
		{ text: "ipsum aliqua deserunt", isFolder: true },
		{ text: "ea minim incididunt", isFolder: false },
		{ text: "reprehenderit amet dolore", isFolder: false },
		{ text: "velit sunt enim", isFolder: false },
		{ text: "sunt amet esse", isFolder: false },
		{ text: "irure laboris voluptate", isFolder: false },
		{ text: "sit est dolore", isFolder: false },
		{ text: "eu sit sint", isFolder: true },
		{ text: "voluptate in ad", isFolder: false },
		{ text: "dolore ullamco in", isFolder: true },
		{ text: "incididunt mollit reprehenderit", isFolder: true },
		{ text: "cupidatat eiusmod deserunt", isFolder: false },
		{ text: "minim labore veniam", isFolder: false },
		{ text: "commodo reprehenderit irure", isFolder: false },
		{ text: "voluptate eiusmod labore", isFolder: true },
		{ text: "irure sint ullamco", isFolder: true },
		{ text: "qui cillum fugiat", isFolder: true },
		{ text: "ex ut do", isFolder: false },
		{ text: "Lorem Lorem amet", isFolder: true },
		{ text: "elit commodo consectetur", isFolder: false },
		{ text: "sit enim nisi", isFolder: false },
		{ text: "ipsum fugiat voluptate", isFolder: true },
		{ text: "nisi commodo labore", isFolder: false },
		{ text: "dolor cillum elit", isFolder: true },
		{ text: "nisi do exercitation", isFolder: true },
		{ text: "adipisicing mollit sint", isFolder: true },
		{ text: "ipsum exercitation ex", isFolder: true },
		{ text: "duis voluptate do", isFolder: false },
		{ text: "in do tempor", isFolder: true },
		{ text: "amet id anim", isFolder: true },
		{ text: "culpa voluptate sunt", isFolder: true },
		{ text: "amet do do", isFolder: true },
		{ text: "sunt fugiat consectetur", isFolder: false },
		{ text: "in sit consequat", isFolder: true },
		{ text: "voluptate dolore deserunt", isFolder: true },
		{ text: "elit sit duis", isFolder: false },
		{ text: "consectetur laboris in", isFolder: false },
		{ text: "ipsum aliquip quis", isFolder: true },
		{ text: "consectetur non ad", isFolder: true },
		{ text: "id voluptate et", isFolder: false },
		{ text: "ullamco labore ullamco", isFolder: true },
		{ text: "ipsum pariatur enim", isFolder: false },
		{ text: "ea excepteur magna", isFolder: false },
		{ text: "ullamco enim tempor", isFolder: false },
		{ text: "ex ex mollit", isFolder: false },
		{ text: "sunt aliqua cillum", isFolder: true },
		{ text: "nostrud incididunt commodo", isFolder: false },
		{ text: "officia quis ut", isFolder: false },
		{ text: "officia ipsum ipsum", isFolder: false },
		{ text: "non qui amet", isFolder: true },
		{ text: "duis quis pariatur", isFolder: false },
		{ text: "enim dolor incididunt", isFolder: true },
		{ text: "laboris Lorem anim", isFolder: false },
		{ text: "pariatur eiusmod non", isFolder: true },
		{ text: "anim commodo pariatur", isFolder: true },
		{ text: "veniam anim tempor", isFolder: false },
		{ text: "quis minim ex", isFolder: false },
		{ text: "eu aliquip adipisicing", isFolder: false },
		{ text: "labore est eiusmod", isFolder: true },
		{ text: "Lorem et eiusmod", isFolder: false },
		{ text: "voluptate est voluptate", isFolder: false },
		{ text: "et mollit pariatur", isFolder: true },
		{ text: "voluptate sunt tempor", isFolder: false },
		{ text: "enim culpa ad", isFolder: true },
		{ text: "non duis in", isFolder: true },
		{ text: "consectetur mollit deserunt", isFolder: true },
		{ text: "eiusmod laborum eu", isFolder: true },
		{ text: "nisi nulla consequat", isFolder: false },
		{ text: "voluptate qui amet", isFolder: false },
		{ text: "laborum cupidatat in", isFolder: false },
		{ text: "incididunt dolor dolore", isFolder: false },
		{ text: "irure sint sunt", isFolder: true },
		{ text: "elit duis sit", isFolder: false },
		{ text: "cillum quis commodo", isFolder: true },
		{ text: "ut elit aliqua", isFolder: false },
		{ text: "amet ipsum in", isFolder: true },
		{ text: "minim et pariatur", isFolder: false },
		{ text: "ea officia nisi", isFolder: false }
	]
});