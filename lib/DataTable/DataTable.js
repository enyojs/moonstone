require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/DataTable~DataTable} kind.
* @module moonstone/DataTable
*/

var
	kind = require('enyo/kind'),
	DataTable = require('enyo/DataTable');

var
	TableRow = require('../TableRow');

/**
* {@link module:moonstone/DataTable~DataTable} is an {@link module:enyo/DataTable~DataTable} with Moonstone visual
* styling applied.
*
* @class DataTable
* @extends module:enyo/DataTable~DataTable
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/DataTable~DataTable.prototype */ {

	/**
	* @private
	*/
	name: 'moon.DataTable',

	/**
	* @private
	*/
	kind: DataTable,

	/**
	* @private
	*/
	defaultKind: TableRow,

	/**
	* @method
	* @private
	*/
	reset: function () {
		DataTable.prototype.reset.apply(this, arguments);
		this.container.resize();
	}
});
