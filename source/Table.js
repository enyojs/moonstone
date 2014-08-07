(function (enyo, scope) {
	/**
	* `moon.Table` extends [`enyo.Table`]{@link enyo.Table}, adding Moonstone visual styling.
	*
	* @class moon.Table
	* @extends enyo.Table
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.Table.prototype */ {

		/**
		* @private
		*/
		name: 'moon.Table',

		/**
		* @private
		*/
		kind: 'enyo.Table',

		/**
		* @private
		*/
		classes: 'moon-table',

		/**
		* @private
		*/
		defaultKind: 'moon.TableRow'
	});

	/**
	* `moon.TableRow` extends [`enyo.TableRow`]{@link enyo.TableRow}, adding Moonstone visual
	* styling.
	*
	* @class moon.TableRow
	* @extends enyo.TableRow
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.TableRow.prototype */ {

		/**
		* @private
		*/
		name: 'moon.TableRow',

		/**
		* @private
		*/
		kind: 'enyo.TableRow',

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
		defaultKind: 'moon.TableCell'
	});

	/**
	* `moon.TableCell` extends [`enyo.TableCell`]{@link enyo.TableCell}, adding Moonstone visual
	* styling.
	*
	* @class moon.TableCell
	* @extends enyo.TableCell
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.TableCell.prototype */ {

		/**
		* @private
		*/
		name: 'moon.TableCell',

		/**
		* @private
		*/
		kind: 'enyo.TableCell',

		/**
		* @private
		*/
		classes: 'moon-table-cell'
	});

})(enyo, this);
