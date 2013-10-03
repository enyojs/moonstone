enyo.kind({
	name: "moon.sample.DataListSample",
	classes: "moon enyo-fit",
	components: [
		{name: "repeater", kind: "moon.DataList", components: [
			{kind: "moon.CheckboxItem", bindings: [
				{from: ".model.name", to: ".content"},
				{from: ".model.value", to: ".checked", oneWay:false}
			]}
		]}
	],
	rendered: function () {
		this.inherited(arguments);
		var c = new enyo.Collection();
		for (var i=0, r=[]; r.length<150; ++i) {
			r.push({value: (Math.floor(i/10)%2 === 0), name: "Checkbox Item " + i});
		}
		this.$.repeater.set("controller", c);
		c.add(r);
	}
});
