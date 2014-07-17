(function (enyo, scope) {
	/**
	* _moon.DrawerHandle_ is a control designed for use with
	* {@link moon.Drawer} and {@link moon.Drawers}. It provides a
	* stylized label that may be used to activate a corresponding drawer.
	*
	* ```
	* 		{
	* 			name: 'musicDrawer',
	* 			kind: 'moon.Drawer',
	* 			handle: {kind: 'moon.DrawerHandle', content: 'Handle'},
	* 			components: [
	* 				{content: 'Drawer Content'}
	* 			],
	* 			controlDrawerComponents: [
	* 				{content: 'Controls'}
	* 			]
	* 		}
	* ```
	*
	* @ui
	* @class moon.DrawerHandle
	* @extends moon.Item
	* @public

	*/
	enyo.kind(
		/** @lends moon.DrawerHandle.prototype */ {

		/**
		* @private
		*/
		name: 'moon.DrawerHandle',

		/**
		* @private
		*/
		kind: 'moon.Item',

		/**
		* @private
		*/
		classes: 'moon-drawer-handle'
	});

})(enyo, this);