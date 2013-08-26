/**
	_moon.FormCheckbox_ is a labeled checkbox designed for use
	in form layouts. Unlike _moon.CheckboxItem_, _moon.FormCheckbox_
	provides a circular "hit target" that is always visible,
	regardless of whether the checkbox is currently checked.
 */

enyo.kind({
	name: "moon.FormCheckbox",
	kind: "moon.CheckboxItem",
	classes: "moon-formcheckbox-item"
});