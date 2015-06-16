require('moonstone');

/**
* Contains the declaration for the {@link moon.Table} and supporting kinds.
* @module moonstone/Table
*/

var
	kind = require('enyo/kind'),
	Table = require('enyo/Table'),
	TableRow = require('enyo/TableRow'),
	TableCell = require('enyo/TableCell');

/**
* {@link moon.TableCell} extends {@link enyo.TableCell}, adding Moonstone visual
* styling.
*
* @namespace moon
* @class moon.TableCell
* @extends enyo.TableCell
* @ui
* @definedby module:moonstone/Table
* @public
*/
var TableCell = kind(
	/** @lends moon.TableCell.prototype */ {

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
* {@link moon.TableRow} extends {@link enyo.TableRow}, adding Moonstone visual
* styling.
*
* @class moon.TableRow
* @extends enyo.TableRow
* @ui
* @definedby module:moonstone/Table
* @public
*/
var TableRow = kind(
	/** @lends moon.TableRow.prototype */ {

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
* {@link moon.Table} extends {@link enyo.Table}, adding Moonstone visual styling.
*
* @class moon.Table
* @extends enyo.Table
* @ui
* @definedby module:moonstone/Table
* @public
*/
var Table = module.exports = kind(
	/** @lends moon.Table.prototype */ {

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
* Exports {@link moon.TableRow}
*/
Table.Row = TableRow;

/**
* Exports {@link moon.TableCell}
*/
Table.Cell = TableCell;
