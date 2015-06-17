var
	kind = require('enyo/kind');

var
	BodyText = require('./BodyText'),
	Button = require('./Button'),
	ContextualPopup = require('./ContextualPopup'),
	ContextualPopupButton = require('./ContextualPopupButton'),
	ContextualPopupDecorator = require('./ContextualPopupDecorator'),
	Divider = require('./Divider'),
	Drawers = require('./Drawers'),
	FormCheckbox = require('./FormCheckbox'),
	ImageItem = require('./ImageItem'),
	Img = require('./Image'),
	LabeledTextItem = require('./LabeledTextItem'),
	Panels = require('./Panels'),
	ProgressBar = require('./ProgressBar'),
	SelectableItem = require('./SelectableItem'),
	Spinner = require('./Spinner'),
	ToggleButton = require('./ToggleButton'),
	ToggleItem = require('./ToggleItem'),
	Tooltip = require('./Tooltip'),
	TooltipDecorator = require('./TooltipDecorator');

var ContainerInitializer = kind({
	components: [
		{kind: Drawers, drawers: [{}], components: [
			{kind: Panels, pattern: 'activity', components: [
				{components: [
					{kind: TooltipDecorator, components: [{kind: Button},{kind: Tooltip}]},
					{kind: ToggleButton},
					{kind: ToggleItem},
					{kind: FormCheckbox},
					{kind: Img},
					{kind: SelectableItem},
					{kind: ProgressBar},
					{kind: Spinner},
					{kind: BodyText},
					{kind: LabeledTextItem},
					{kind: ImageItem},
					{kind: Divider},
					{kind: ContextualPopupDecorator, components: [
						{kind: ContextualPopupButton},
						{kind: ContextualPopup, components: [{}]}
					]}
				]}
			]}
		]}
	]
});

module.exports = function initContainer () {
	var initializer = new ContainerInitializer();
	initializer.renderInto(document.body, true);
	initializer.destroy();
};