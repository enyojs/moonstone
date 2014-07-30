enyo.kind({
	name: "moon.sample.SimplePickerSample",
	kind: "FittableRows",
	classes:"moon moon-sample-padded enyo-unselectable enyo-fit",
	components:[
		{kind:"moon.Scroller", fit:true, components: [

			{kind: "moon.Divider", content:"Picker 1 & 2: Animated"},
			{kind:"moon.SimplePicker", name:"picker1", onChange:"changed", components: [
				{content:"San Francisco Airport Terminal Gate 1", active: true},
				{content:"Boston Airport Terminal Gate 2"},
				{content:"Tokyo Airport Terminal Gate 3"},
				{content:"נמל התעופה בן גוריון טרמינל הבינלאומי"}
			]},
			{kind:"moon.SimplePicker", name:"picker2", onChange:"changed", components: [
				{content:"Level 1"},
				{content:"Level 2", active: true},
				{content:"Level 3"},
				{content:"Level 4"}
			]},
			{classes:"moon-1v"},

			{kind: "moon.Divider", content:"Picker 3: Non-animated"},
			{kind:"moon.SimplePicker", block:true, name:"picker3", animate:false, onChange:"changed", components: [
				{content:"Hotmail"},
				{content:"GMail"},
				{content:"Yahoo Mail", active: true},
				{content:"AOL Mail"},
				{content:"Custom IMAP"}
			]},
			{classes:"moon-1v"},

			{kind: "moon.Divider", content:"Picker 4: Wrapping"},
			{kind:"moon.SimplePicker", block:true, name:"picker4", animate:false, wrap:true, onChange:"changed", components: [
				{content:"Mars"},
				{content:"Venus"},
				{content:"Earth"},
				{content:"Mercury"},
				{content:"Jupiter"},
				{content:"Saturn"},
				{content:"Uranus"},
				{content:"Neptune"},
				{content:"Pluto"}
			]},
			{classes:"moon-1v"},

			{kind: "moon.Divider", content:"Picker 5: Disabled"},
			{kind:"moon.SimplePicker", block:true, name:"picker5", disabled: true, components: [
				{content:"Enyo"},
				{content:"Sencha"}
			]},
			{classes:"moon-1v"},

			{kind: "moon.Divider", content:"Picker 6: Hidden"},
			{kind:"moon.SimplePicker", name:"picker6", onChange:"changed", showing:false, components: [
				{content:"San Francisco Airport Terminal Gate 1"},
				{content:"Boston Airport Terminal Gate 2", active: true},
				{content:"Tokyo Airport Terminal Gate 3"}
			]},
			{kind:"moon.Button", content:"Toggle Showing", small:true, ontap:"toggleShowing"}
		]},
		{classes:"moon-1v"},
		{classes:"moon-hspacing", components: [
			{components: [
				{kind:"moon.Divider", content:"Modify picker:"},
				{kind:"moon.SimplePicker", name:"which", components: [
					{content:"1"},
					{content:"2"},
					{content:"3"},
					{content:"4"},
					{content:"5"},
					{content:"6"}
				]}
			]},
			{components: [
				{kind:"moon.Divider", content:"Add item:"},
				{classes:"moon-hspacing", components: [
					{kind:"moon.InputDecorator", components: [
						{kind:"moon.Input", name:"addInput", placeholder:"content", classes:"moon-2h"}
					]},
					{kind:"moon.Button", content:"Add", small:true, ontap:"addItem"}
				]}
			]},
			{components: [
				{kind:"moon.Divider", content:"Set index:"},
				{classes:"moon-hspacing", components: [
					{kind:"moon.InputDecorator", components: [
						{kind:"moon.Input", name:"changeInput", placeholder:"index", classes:"moon-1h"}
					]},
					{kind:"moon.Button", content:"Go", small:true, ontap:"changeItem"}
				]}
			]},
			{components: [
				{kind:"moon.Divider", content:"Delete current item:"},
				{kind:"moon.Button", content:"Delete", small:true, ontap:"destroyItem"}
			]}
		]},
		{components: [
			{kind: "moon.Divider", content:"Result"},
			{kind: "moon.BodyText", name:"result", content:"No change yet"}
		]}
	],
	toggleShowing: function() {
		this.$.picker6.setShowing(!this.$.picker6.showing);
	},
	changed: function(inSender, inEvent) {
		this.$.result.setContent(inSender.name + " changed to " + inEvent.content + " (" + inEvent.index + ")");
	},
	changeItem: function(inSender, inEvent) {
		var picker = this.$["picker" + (this.$.which.getSelectedIndex()+1)];
		var val = parseInt(this.$.changeInput.getValue(),10);
		var len = picker.getClientControls().length - 1;
		if (isNaN(val) || val < 0 || val > len) {
			this.$.result.setContent(picker.name + " value must be an integer between 0-" + len);
		} else {
			picker.setSelectedIndex(val);
		}
	},
	addItem: function(inSender, inEvent) {
		if (!this.$.addInput.getValue()) {
			this.$.result.setContent("Please insert content value.");
			return;
		}
		var picker = this.$["picker" + (this.$.which.getSelectedIndex()+1)];
		picker.createComponent({content:this.$.addInput.getValue()}).render();
		this.$.result.setContent("'" + this.$.addInput.getValue() + "' is added to " + picker.name);
	},
	destroyItem: function(inSender, inEvent) {
		var picker = this.$["picker" + (this.$.which.getSelectedIndex()+1)];
		var sel = picker.getSelected();
		if (sel) {
			sel.destroy();
		}
	}
});