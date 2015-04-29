require('moonstone');

/**
* Contains the declaration for the {@link moon.DataTable} kind.
* @module moonstone/DataTable
*/

var
	kind = require('enyo/kind'),
	DataTable = require('enyo/DataTable');

var
	TableRow = require('../TableRow');

/**
* {@link moon.DataTable} is an {@link enyo.DataTable} with Moonstone visual
* styling applied.
*
* @namespace moon
* @class moon.DataTable
* @extends enyo.DataTable
* @ui
* @definedby module:moonstone/DataTable
* @public
*/
module.exports = kind(
	/** @lends moon.DataTable.prototype */ {

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
