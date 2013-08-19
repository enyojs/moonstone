enyo.kind({
	name: "sun.sample.ToastSample",
	classes: "sun moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.Divider", content: "Toasts"},

		{classes: "moon-hspacing", components: [
			{kind: "moon.Button", content: "Basic Toast", ontap: "showToast", Toast: "basicToast"},			
			{kind: "moon.Button", content: "Button in Toast", ontap: "showToast", Toast: "buttonToast"}
		]},

		{name: "basicToast", kind: "sun.Toast", content: "Toast..."},
		{name: "buttonToast", kind: "sun.Toast", components: [
			{kind: "moon.Divider", content: "Buttons in Toast example"},
			{classes: "moon-hspacing", components: [
				{kind: "moon.Button", content: "Hello"},
				{kind: "moon.Button", content: "Goodbye"},
				{kind: "moon.ToggleButton", content: "SpotlightModal", ontap: "buttonToggled"}
			]}
		]}
	],
	ToastActivator: null,
	showToast: function(inSender) {
		this.hideToasts();
		var p = this.$[inSender.Toast];
		if (p) {
			p.show();
		}
	},
	hideToasts: function() {
		this.$.basicToast.hide();
		this.$.buttonToast.hide();
	}
});