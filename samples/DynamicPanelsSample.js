enyo.kind({
	name: "moon.sample.DynamicPanelsSample",
	classes: "moon enyo-fit enyo-unselectable",
	components: [
		{name: "panels", kind: "moon.Panels", popOnBack:true, wrap: true, pattern: "activity", classes: "enyo-fit"}
	],
	rendered: function () {
		this.inherited(arguments);
		this.pushSinglePanel();
	},
	pushSinglePanel: function() {
		this.$.panels.pushPanels([
			{title: "Panel " + this.$.panels.getPanels().length, classes: "moon-7h", titleBelow: "Sub-title", subTitleBelow: "Sub-sub title", components: [
				{kind: "moon.Scroller", fit:true, components: [
					{kind: "enyo.Repeater", count: 30, components: [
						{kind: "moon.Item", content: "Dummy Item", ontap: "next"}
					]}
				]}
			]}
		], {owner: this});
	},
	pushJoinedPanels: function() {
		this.$.panels.pushPanels([
			{title: "Panel " + this.$.panels.getPanels().length, classes: "moon-7h", titleBelow: "Joined Panel 1", subTitleBelow: "Sub-sub title", components: [
				{kind: "moon.Scroller", fit:true, components: [
					{kind: "enyo.Repeater", count: 30, components: [
						{kind: "moon.Item", content: "Dummy Item", ontap: "next"}
					]}
				]}
			]},
			{joinToPrev:true, title: "Panel " + (this.$.panels.getPanels().length+1), classes: "moon-7h", titleBelow: "Joined Panel 2", subTitleBelow: "Sub-sub title", components: [
				{kind: "moon.Scroller", fit:true, components: [
					{kind: "enyo.Repeater", count: 30, components: [
						{kind: "moon.Item", content: "Dummy Item", ontap: "next"}
					]}
				]}
			]}
		], {owner: this});
	},
	pushSeveralPanels: function() {
		this.$.panels.pushPanels([
			{title: "Panel " + this.$.panels.getPanels().length, titleBelow: "1 of 3 Panels", subTitleBelow: "Sub-sub title", components: [
				{kind: "moon.Scroller", fit:true, components: [
					{kind: "enyo.Repeater", count: 5, components: [
						{kind: "moon.Item", content: "Dummy Item", ontap: "next"}
					]}
				]}
			]},
			{title: "Panel " + (this.$.panels.getPanels().length+1), titleBelow: "2 of 3 Panels", subTitleBelow: "Sub-sub title", components: [
				{kind: "moon.Scroller", fit:true, components: [
					{kind: "enyo.Repeater", count: 10, components: [
						{kind: "moon.Item", content: "Dummy Item", ontap: "next"}
					]}
				]}
			]},
			{title: "Panel " + (this.$.panels.getPanels().length+2), titleBelow:"3 of 3 Panels", subTitleBelow:"Sub-sub title", components: [
				{kind: "moon.Scroller", fit:true, components: [
					{kind: "enyo.Repeater", count: 15, components: [
						{kind: "moon.Item", content: "Dummy Item", ontap: "next"}
					]}
				]}
			]}
			// targetIndex with a negative value works in conjunction with the wrap:true property.
			// Negative values count backward from the end while indices greater than the length
			// wrap around and start counting again from the beginning.
		], {owner: this}, {targetIndex: -1});
	},
	next: function() {
		var index = this.$.panels.getIndex();
		var length = this.$.panels.getPanels().length;
		if (index < (length-1)) {
			this.$.panels.next();
		} else if (length % 5 === 0) {
			this.pushSeveralPanels();
		} else if (length % 3 === 0) {
			this.pushJoinedPanels();
		} else {
			this.pushSinglePanel();
		}
	}
});
