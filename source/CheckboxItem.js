/**
	_moon.CheckboxItem_ is a control that combines a
	<a href="#moon.Checkbox">moon.Checkbox</a> with a text label. The label text
	may be set via the _content_ property. The state of the checkbox may be
	retrieved by querying the _checked_ property.

		{kind: "moon.CheckboxItem", content: "San Francisco", onchange: "checkedChanged"}

		checkedChanged: function(inSender, inEvent) {
			var checked = inSender.get("checked");
		}

	You may place _moon.CheckboxItem_ objects inside an
	<a href="#enyo.Group">enyo.Group</a> to create a group of checkboxes in which
	only one may be checked at any given time (similar to how a RadioItemGroup
	works):

		{kind: "Group", components: [
			{kind: "moon.CheckboxItem", content: "New York"},
			{kind: "moon.CheckboxItem", content: "London"},
			{kind: "moon.CheckboxItem", content: "San Francisco"},
			{kind: "moon.CheckboxItem", content: "Beijing"}
		]}
 */
enyo.kind({
	name: "moon.CheckboxItem",
	kind: "moon.Item",
	published: {
		//* The state of the checkbox
		checked: false
	},
	events: {
/**
    Fires when the control is either checked or unchecked.

    _inEvent.checked_ indicates whether the checkbox is currently checked.

    _inEvent.toggledControl_ contains a reference to the CheckboxItem whose
    state toggled. (Note that the originator of this event is actually the
    _moon.Checkbox_ contained within the CheckboxItem, so use this property to
    reference the CheckboxItem.)
*/
		onActivate: ""
	},
	//* @protected
	classes: "moon-checkbox-item",
	spotlight: true,
	handlers: {
		ontap: "tap",
		onActivate: "decorateActivateEvent"
	},
	components: [
		{classes: "moon-checkbox-item-label-wrapper", components: [
			{name: "label", classes: "moon-checkbox-item-label"}
		]},
		{name: "input", kind: "moon.Checkbox", spotlight: false}
	],
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