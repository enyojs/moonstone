/**
	_moon.Accordion_ is a <a href="#moon.ExpandableListItem">moon.ExpandableListItem</a>
	with an arrow button to the right of the header and additional margin space to
	the left of the item list. 

	To open or close the drawer, tap on the header text or navigate (via 5-way)
	back to the top of the drawer.

	The control's child components may be of any kind; by default, they are
	instances of <a href="#moon.Item">moon.Item</a>.

		{kind: "moon.Accordion", content: "This is an accordion", components: [
			{content: "Item One"},
			{content: "Item Two"}
		]},
		{kind: "moon.Accordion", content: "This is another accordion", components: [
			{content: "Item Three"},
			{content: "Item Four"}
		]}

	When multiple Accordions are used in a group, only one may be open at a given time.

		{kind: "Group", highlander: true, components: [
			{kind: "moon.Accordion",  active: true, content: "This is a grouped accordion", components: [
				{content: "Item One"},
				{content: "Item Two"}
			]},
			{kind: "moon.Accordion", content: "This is another grouped accordion", components: [
				{content: "Item Three"},
				{content: "Item Four"}
			]},
			{kind: "moon.Accordion", content: "This is yet another grouped accordion", components: [
				{content: "Item Five"},
				{content: "Item Six"}
			]}
		]}
*/
enyo.kind({
	name: "moon.Accordion",
	kind: "moon.ExpandableListItem",
	classes: "moon-accordion",
	//* @protected
	componentOverrides: {
		header: {classes: "moon-accordion-arrow"}
	},
	//* Facade for drawer
	openChanged: function() {
		this.updateArrowDirection(this.getOpen());
		this.inherited(arguments);
	},
	//* Update arrow direction based on _this.open_
	updateArrowDirection: function(open) {
		// this.$.header.addRemoveClass('up', open);
	}
});