enyo.kind({
	name: "moon.sample.DynamicPanelsSample",
	classes: "moon enyo-fit enyo-unselectable",
	components: [
		{name: "panels", kind: "moon.Panels", popOnBack:true, pattern: "activity", classes: "enyo-fit"}
	],
	rendered: function () {
		this.inherited(arguments);
		this.pushSinglePanel();
	},
	pushSinglePanel: function() {
		this.$.panels.pushPanels([
			{title: "Panel " + this.$.panels.getPanels().length, classes: "moon-7h", titleBelow:"Sub-title", subTitleBelow:"Sub-sub title", components: [
				{kind: "moon.Scroller", fit:true, components: [
					{kind: "enyo.Repeater", count: 30, components: [
						{kind: "moon.Item", content: "Dummy Item", ontap:"next"}
					]}
				]}
			]}
		], {owner: this});
	},
	pushJoinedPanels: function() {
		this.$.panels.pushPanels([
			{title: "Panel " + this.$.panels.getPanels().length, classes: "moon-7h", titleBelow:"Sub-title", subTitleBelow:"Sub-sub title", components: [
				{kind: "moon.Scroller", fit:true, components: [
					{kind: "enyo.Repeater", count: 30, components: [
						{kind: "moon.Item", content: "Dummy Item", ontap:"next"}
					]}
				]}
			]},
			{joinToPrev:true, title: "Panel " + (this.$.panels.getPanels().length+1), classes: "moon-7h", titleBelow:"Sub-title", subTitleBelow:"Sub-sub title", components: [
				{kind: "moon.Scroller", fit:true, components: [
					{kind: "enyo.Repeater", count: 30, components: [
						{kind: "moon.Item", content: "Dummy Item", ontap:"next"}
					]}
				]}
			]}
		], {owner: this});
	},
	next: function() {
		var index = this.$.panels.getIndex();
		var length = this.$.panels.getPanels().length;
		if (index < (length-1)) {
			this.$.panels.next();
		} else if (length % 3 === 0) {
			this.pushSinglePanel();
		} else {
			this.pushJoinedPanels();
		}
	}
});
