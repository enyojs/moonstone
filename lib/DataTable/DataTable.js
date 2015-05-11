require('moonstone');

var
	kind = require('enyo/kind'),
	DataTable = require('enyo/DataTable');

var
	TableRow = require('../TableRow');

/**
* {@link moon.DataTable} is an {@link enyo.DataTable} with Moonstone visual
* styling applied.
*
* @class moon.DataTable
* @extends enyo.DataTable
* @ui
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