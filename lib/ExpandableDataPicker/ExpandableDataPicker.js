require('moonstone');

var
	kind = require('enyo/kind'),
	DataRepeater = require('enyo/DataRepeater');

var
	ExpandablePicker = require('../ExpandablePicker');

/**
* {@link moon.ExpandableDataPicker}, which extends {@link moon.ExpandablePicker}, is
* a data-driven drop-down picker menu that solicits a choice from the user. The picker's child
* components, which are instances of {@link moon.CheckboxItem} by default, provide
* the options for the picker. They child controls are generated from the picker's
* [collection]{@link moon.ExpandableDataPicker#collection}.
* 
* ```
* {name: 'picker', kind: 'moon.ExpandableDataPicker', content: 'Data Picker', components: [
* 	{bindings: [
* 		{from: '.model.label', to: '.content'}
* 	]}
* ]}
* ```
*
* @class moon.ExpandableDataPicker
* @extends moon.ExpandablePicker
* @ui
* @public
*/
module.exports = kind(
	/** @lends moon.ExpandableDataPicker.prototype */ {
	
	/**
	* @private
	*/
	name: 'moon.ExpandableDataPicker',
	
	/**
	* @private
	*/
	kind: ExpandablePicker,
	
	/**
	* @lends moon.ExpandableDataPicker.prototype
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
	* Creates the configuration for the {@link enyo.DataRepeater} that will generate the picker
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