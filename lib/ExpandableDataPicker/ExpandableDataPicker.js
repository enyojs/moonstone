require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/ExpandableDataPicker~ExpandableDataPicker} kind.
* @module moonstone/ExpandableDataPicker
*/

var
	kind = require('enyo/kind'),
	DataRepeater = require('enyo/DataRepeater');

var
	ExpandablePicker = require('../ExpandablePicker');

/**
* {@link module:moonstone/ExpandableDataPicker~ExpandableDataPicker}, which extends {@link module:moonstone/ExpandablePicker~ExpandablePicker}, is
* a data-driven drop-down picker menu that solicits a choice from the user. The picker's child
* components, which are instances of {@link module:moonstone/CheckboxItem~CheckboxItem} by default, provide
* the options for the picker. They child controls are generated from the picker's
* [collection]{@link module:moonstone/ExpandableDataPicker~ExpandableDataPicker#collection}.
* 
* ```
* {name: 'picker', kind: 'moon.ExpandableDataPicker', content: 'Data Picker', components: [
* 	{bindings: [
* 		{from: '.model.label', to: '.content'}
* 	]}
* ]}
* ```
*
* @class ExpandableDataPicker
* @extends module:moonstone/ExpandablePicker~ExpandablePicker
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/ExpandableDataPicker~ExpandableDataPicker.prototype */ {
	
	/**
	* @private
	*/
	name: 'moon.ExpandableDataPicker',
	
	/**
	* @private
	*/
	kind: ExpandablePicker,
	
	/**
	* @lends module:moonstone/ExpandableDataPicker~ExpandableDataPicker.prototype
	* @private
	*/
	published: {
		/**
		* Collection of models to render as picker items
		*
		* @type {enyo.Collection}
		* @default null
		* @public
		*/
		collection: null
	},
	
	/**
	* @private
	*/
	collectionChanged: function () {
		this.$.list.set('collection', this.collection);
	},
	
	/**
	* @method
	* @private
	*/
	create: function () {
		ExpandablePicker.prototype.create.apply(this, arguments);
		this.collectionChanged();
	},
	
	/**
	* @method
	* @private
	*/
	initComponents: function () {
		var comps = this.components || this.kindComponents;
		this.components = null;

		ExpandablePicker.prototype.initComponents.apply(this, arguments);

		var list = this.getListComponent(comps);
		this.createComponent(list);
	},
	
	/**
	* Creates the configuration for the {@link module:enyo/DataRepeater~DataRepeater} that will generate the picker
	* items
	*
	* @param {Object[]} comps 	- Component configurations that will be each picker item
	* @return {Object} 			- List component configuration
	* @protected
	*/
	getListComponent: function (comps) {
		var list = {
			name: 'list',
			kind: DataRepeater,
			components: comps,
			owner: this
		};

		// could use defaultProps on the repeater but they'll also get added to the repeater's
		// container which may not be desirable
		if(comps.length === 1 && !comps[0].kind) {
			comps[0].kind = this.defaultKind;
		}

		return list;
	},
	
	/**
	* @private
	*/
	getCheckboxControls: function () {
		return this.$.list.getClientControls();
	}
});
