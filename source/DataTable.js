(function (enyo, scope) {
	/**
	* `moon.DataTable` is an {@link enyo.DataTable} with Moonstone visual styling applied.
	*
	* @class moon.DataTable
	* @extends enyo.DataTable
	* @ui
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
