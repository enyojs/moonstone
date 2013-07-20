/**
	_moon.FormCheckbox_ is a control that combines a
	<a href="#moon.Checkbox">moon.Checkbox</a> with a text label. The label text
	may be set via the _content_ property. The state of the checkbox may be
	retrieved by querying the _checked_ property.

		{kind: "moon.FormCheckbox", content: "San Francisco", onchange: "checkedChanged"}

		checkedChanged: function(inSender, inEvent) {
			var checked = inSender.get("checked");
		}

	You may place _moon.FormCheckbox_ objects inside an
	<a href="#enyo.Group">enyo.Group</a> to create a group of checkboxes in which
	only one may be checked at any given time (similar to how a RadioItemGroup
	works):

		{kind: "Group", components: [
			{kind: "moon.FormCheckbox", content: "New York"},
			{kind: "moon.FormCheckbox", content: "London"},
			{kind: "moon.FormCheckbox", content: "San Francisco"},
			{kind: "moon.FormCheckbox", content: "Beijing"}
		]}
 */
enyo.kind({
	name: "moon.FormCheckbox",
	kind: "moon.Item",
	published: {
		//* The state of the checkbox
		checked: false
	},
	events: {
/** 
    Fires when the control is either checked or unchecked.

    _inEvent.checked_ indicates whether the checkbox is currently checked.

    _inEvent.toggledControl_ contains a reference to the FormCheckbox whose
    state toggled. (Note that the originator of this event is actually the
    _moon.Checkbox_ contained within the FormCheckbox, so use this property to
    reference the FormCheckbox.)
*/
		onActivate: ""
	},
	//* @protected
	classes: "moon-formcheckbox-item",
	spotlight: false,
	handlers: {
		ontap: "tap",
		onActivate: "decorateActivateEvent"
	},
	components: [
		{classes: "moon-formcheckbox-item-label-wrapper", components: [
			{name: "input", kind: "moon.Checkbox", spotlight: false},
			{name: "label", kind: "moon.Item", classes: "moon-formcheckbox-item-label"}
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.setSpotlightPosition("");
	},
	rendered: function() {
		this.inherited(arguments);
		this.checkedChanged();
	},
	disabledChanged: function() {
		this.inherited(arguments);
		this.$.input.setDisabled(this.disabled);
	},
	contentChanged: function() {
		this.$.label.setContent(this.getContent());
	},
	checkedChanged: function() {
		this.$.input.setChecked(this.getChecked());
	},
	tap: function(inSender, inEvent) {
		this.waterfallDown("ontap", inEvent, inSender);
	},
	decorateActivateEvent: function(inSender, inEvent) {
		inEvent.toggledControl = this;
		inEvent.checked = this.checked = this.$.input.getChecked();
	}
});
