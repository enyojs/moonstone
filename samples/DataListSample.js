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
	create: function () {
		this.inherited(arguments);
		var c = new enyo.Collection();
		for (var $i=0, r$=[]; r$.length<500; ++$i) {
			r$.push({value: (Math.floor($i/10)%2 === 0), name:"Checkbox Item " + $i});
		}
		c.add(r$);
		this.$.repeater.set("controller", c);
	}	
});
