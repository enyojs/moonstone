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
			{title: "Panel " + this.$.panels.getPanels().length, titleBelow: "Sub-title", subTitleBelow: "Sub-sub title", components: [
				{kind: "moon.Scroller", fit:true, components: [
					{kind: "enyo.Repeater", count: 30, components: [
						{kind: "moon.Item", content: "Dummy Item", ontap: "next"}
					]}
				]}
			], headerComponents: [
				{kind:"moon.TooltipDecorator", components: [
					{kind:"moon.Tooltip", position:"above", content:"Test Dynamic Lists"},
					{kind: "moon.ListActions", icon:"drawer", listActions: [
						{action:"category3", components: [
							{kind: "moon.Divider", content: "Dynamic List Action"},
							{kind: "moon.Item", content: "Dummy Item 1"},
							{kind: "moon.Item", content: "Dummy Item 2"}
						]}
					]}
				]}
			]}
		], {owner: this});
	},
	pushTwoPanels: function() {
		this.$.panels.pushPanels([
			{title: "Panel " + this.$.panels.getPanels().length, titleBelow: "Panel 1", subTitleBelow: "Sub-sub title", components: [
				{kind: "moon.Scroller", fit:true, components: [
					{kind: "enyo.Repeater", count: 30, components: [
						{kind: "moon.Item", content: "Dummy Item", ontap: "next"}
					]}
				]}
			]},
			{title: "Panel " + (this.$.panels.getPanels().length+1), titleBelow: "Panel 2", subTitleBelow: "Sub-sub title", components: [
				{kind: "moon.Scroller", fit:true, components: [
					{kind: "enyo.Repeater", count: 30, components: [
						{kind: "moon.Item", content: "Dummy Item", ontap: "next"}
					]}
				]}
			]}
		], {owner: this});
	},
	pushThreePanels: function() {
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
			this.pushThreePanels();
		} else if (length % 3 === 0) {
			this.pushTwoPanels();
		} else {
			this.pushSinglePanel();
		}
	}
});
