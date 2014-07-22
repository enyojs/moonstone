(function (enyo, scope) {
	/**
	* _moon.DataTable_ is an {@link enyo.DataTable} with Moonstone visual
	* styling applied.
	*
	* @ui
	* @class moon.DataTable
	* @extends enyo.DataTable
	* @public
	*/
	enyo.kind(
		/** @lends moon.DataTable.prototype */ {

		/**
		* @private
		*/
		name: 'moon.DataTable',

		/**
		* @private
		*/
	   kind: 'enyo.DataTable',

		/**
		* @private
		*/
	   defaultKind: 'moon.TableRow',

		/**
		* @method
		* @private
		*/
		reset: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				this.container.resize();
			};
		})
	});

})(enyo, this);
