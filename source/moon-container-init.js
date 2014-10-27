(function (enyo, scope) {
	enyo.kind({
		name: 'moon.ContainerInitializer',
		components: [
			{kind: 'moon.Drawers', drawers: [{}], components: [
				{kind: 'moon.Panels', pattern: 'activity', components: [
					{components: [
						{kind: 'moon.TooltipDecorator', components: [{kind: 'moon.Button'},{kind: 'moon.Tooltip'}]},
						{kind: 'moon.ToggleButton'},
						{kind: 'moon.ToggleItem'},
						{kind: 'moon.FormCheckbox'},
						{kind: 'moon.Image'},
						{kind: 'moon.SelectableItem'},
						{kind: 'moon.ProgressBar'},
						{kind: 'moon.Spinner'},
						{kind: 'moon.BodyText'},
						{kind: 'moon.LabeledTextItem'},
						{kind: 'moon.ImageItem'},
						{kind: 'moon.Divider'},
						{kind: 'moon.ContextualPopupDecorator', components: [
							{kind: 'moon.ContextualPopupButton'},
							{kind: 'moon.ContextualPopup', components: [{}]}
						]}
					]}
				]}
			]}
		]
	});

	window.moon = window.moon || {};

	moon.initContainer = function () {
		var initializer = new moon.ContainerInitializer();
		initializer.renderInto(document.body);
		initializer.destroy();
	};	
})(enyo, this);
