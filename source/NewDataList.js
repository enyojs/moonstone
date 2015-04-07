(function (enyo, moon, scope) {
	var MoonScrollable = moon.Scrollable;

	enyo.kind({
		name: 'moon.NewDataList',
		kind: 'enyo.NewDataList',
		scrollControls: [{kind: 'moon.ScrollControls'}],
		touch: false,
		mixins: [MoonScrollable]
	});

})(enyo, moon, this);