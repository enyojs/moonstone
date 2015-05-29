require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/Table~Table} and supporting kinds.
* @module moonstone/Table
*/

var
	kind = require('enyo/kind'),
	Table = require('enyo/Table'),
	TableRow = require('enyo/TableRow'),
	TableCell = require('enyo/TableCell');

/**
* {@link module:moonstone/TableCell~TableCell} extends {@link module:enyo/TableCell~TableCell}, adding Moonstone visual
* styling.
*
* @class TableCell
* @extends module:enyo/TableCell~TableCell
* @ui
* @public
*/
var TableCell = kind(
	/** @lends module:moonstone/TableCell~TableCell.prototype */ {

	/**
	* @private
	*/
	name: 'moon.TableCell',

	/**
	* @private
	*/
	kind: TableCell,

	/**
	* @private
	*/
	classes: 'moon-table-cell'
});

/**
* {@link module:moonstone/TableRow~TableRow} extends {@link module:enyo/TableRow~TableRow}, adding Moonstone visual
* styling.
*
* @class TableRow
* @extends module:enyo/TableRow~TableRow
* @ui
* @public
*/
var TableRow = kind(
	/** @lends module:moonstone/TableRow~TableRow.prototype */ {

	/**
	* @private
	*/
	name: 'moon.TableRow',

	/**
	* @private
	*/
	kind: TableRow,

	/**
	* @private
	*/
	classes: 'moon-table-row',

	/**
	* @private
	*/
	spotlight: true,

	/**
	* @private
	*/
	defaultKind: TableCell
});

/**
* {@link module:moonstone/Table~Table} extends {@link module:enyo/Table~Table}, adding Moonstone visual styling.
*
* @class Table
* @extends module:enyo/Table~Table
* @ui
* @public
*/
var Table = module.exports = kind(
	/** @lends module:moonstone/Table~Table.prototype */ {

	/**
	* @private
	*/
	name: 'moon.Table',

	/**
	* @private
	*/
	kind: Table,

	/**
	* @private
	*/
	classes: 'moon-table',

	/**
	* @private
	*/
	defaultKind: TableRow
});

/**
* Exports {@link module:moonstone/TableRow~TableRow}
*/
Table.Row = TableRow;

/**
* Exports {@link module:moonstone/TableCell~TableCell}
*/
Table.Cell = TableCell;
