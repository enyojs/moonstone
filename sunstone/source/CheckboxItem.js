/**
	_moon.CheckboxItem_ is a control that combines a
	<a href="#moon.Checkbox">moon.Checkbox</a> with a text label. The label text
	may be set via the _content_ property. The state of the checkbox may be
	retrieved by querying the _checked_ property.

		{kind: "moon.CheckboxItem", content: "San Francisco", onchange: "checkedChanged"}

		checkedChanged: function(inSender, inEvent) {
			var checked = inSender.get("checked");
		}

	You may place _moon.CheckboxItem_ objects inside an [enyo.Group](#enyo.Group)
	to create a group of checkboxes in which only one may be checked at any given
	time (similar to how a [RadioItemGroup](#moon.RadioItemGroup)	works):

		{kind: "Group", components: [
			{kind: "moon.CheckboxItem", content: "New York"},
			{kind: "moon.CheckboxItem", content: "London"},
			{kind: "moon.CheckboxItem", content: "San Francisco"},
			{kind: "moon.CheckboxItem", content: "Beijing"}
		]}
 */
enyo.kind({
	name: "sun.CheckboxItem",
	kind: "moon.CheckboxItem"
});
