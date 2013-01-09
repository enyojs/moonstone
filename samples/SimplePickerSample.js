enyo.kind({
	name: "moon.sample.SimplePickerSample",
	fit: true,
	classes:"moon moon-sample-padded",
	components:[
		{kind:"enyo.Spotlight"},
		{classes:"moon-sample-divider", content:"Picker 1: Animated"},
		{kind:"moon.SimplePicker", name:"picker0", onChange:"changed", components: [
			{content:"San Francisco"},
			{content:"Boston"},
			{content:"Tokyo"}
		]},
		{tag:"br"},{tag:"br"},
		{classes:"moon-sample-divider", content:"Picker 2: Non-animated"},
		{kind:"moon.SimplePicker", name:"picker1", animate:false, onChange:"changed", components: [
			{content:"Hotmail"},
			{content:"GMail"},
			{content:"Yahoo Mail"},
			{content:"AOL Mail"},
			{content:"Custom IMAP"}
		]},
		{tag:"br"},{tag:"br"},
		{name:"result"},
		{tag:"br"},
		{kind:"moon.SimplePicker", name:"which", components: [
			{content:"Picker 1"},
			{content:"Picker 2"}
		]},
		{kind:"Input", spotlight:true},
		{kind:"Button", content:"Change", spotlight:true, ontap:"changeItem"},
		{kind:"Button", content:"Add", spotlight:true, ontap:"addItem"},
		{kind:"Button", content:"Delete", spotlight:true, ontap:"destroyItem"}
	],
	changed: function(inSender, inEvent) {
		this.$.result.setContent(inSender.name + " changed to " + inEvent.content + " (" + inEvent.index + ")");
	},
	changeItem: function(inSender, inEvent) {
		var picker = this.$["picker" + this.$.which.getSelectedIndex()];
		picker.setSelectedIndex(parseInt(this.$.input.getValue(),10));
	},
	addItem: function(inSender, inEvent) {
		var picker = this.$["picker" + this.$.which.getSelectedIndex()];
		picker.createComponent({content:this.$.input.getValue()}).render();
		picker.reflow();
	},
	destroyItem: function(inSender, inEvent) {
		var picker = this.$["picker" + this.$.which.getSelectedIndex()];
		picker.getSelected().destroy();
		picker.reflow();
	}
});