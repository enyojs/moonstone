/**
* @name ExpandablePickerAccessibilityMixin
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	bindings: [
		{from: 'accessibilityDisabled', to: '$.client.accessibilityDisabled'},
		{from: 'accessibilityDisabled', to: '$.helpText.accessibilityDisabled'}
	]
};