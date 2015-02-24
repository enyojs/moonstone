var
	kind = require('enyo/kind');

var
	Button = require('moonstone/Button'),
	ContextualPopup = require('moonstone/ContextualPopup'),
	ContextualPopupDecorator = require('moonstone/ContextualPopupDecorator'),
	Divider = require('moonstone/Divider'),
	Input = require('moonstone/Input'),
	InputDecorator = require('moonstone/InputDecorator'),
	Item = require('moonstone/Item'),
	RadioItem = require('moonstone/RadioItem'),
	RadioItemGroup = require('moonstone/RadioItemGroup'),
	Scroller = require('moonstone/Scroller'),
	ToggleButton = require('moonstone/ToggleButton');

module.exports = kind({
	name: 'moon.sample.ontextualPopupSample',
	classes: 'moon enyo-unselectable enyo-fit',
	components: [
		{
			kind: ContextualPopupDecorator,
			style: 'position: absolute; left: 0px; top: 0px;',
			components:
			[
				{content: 'Average'},
				{
					kind: ContextualPopup,
					classes: 'moon-2h moon-8v',
					components: [
						{content: 'Item 1'},
						{content: 'Item 2'},
						{content: 'Item 3'}
					]
				}
			]
		},
		{kind: ContextualPopupDecorator, style: 'position: absolute; right: 0px; top: 0px;', components: [
			{content: 'Small', small:true},
			{kind: ContextualPopup}
		]},
		{kind: ContextualPopupDecorator, style: 'position: absolute; right: 0px; top: 13%;', components: [
			{content: 'Nested Radio', small:true},
				{name: 'nestedRadioPopup', kind: ContextualPopup, components:[
					{name: 'nestedRadioGroup', kind: RadioItemGroup, components: [
						{content: 'Creek', selected: true},
						{content: 'River'},
						{content: 'Ocean'}
					]},
					{components:[
						{content: 'Radio Group Value'},
						{name: 'nestedRadioValue'}
					]},
					{name: 'nestedRadioDismissButton',
					 kind: ToggleButton,
					 style: 'margin-top:5px',
					 small: true,
					 toggleOnLabel: 'select dismiss on',
					 toggleOffLabel: 'select dismiss off'
					}
				]}
			]
		},
		{kind: ContextualPopupDecorator, style: 'position: absolute; left: 0px; top: 25%;', components: [
			{content: 'Left'},
			{
				kind: ContextualPopup,
				classes: 'moon-3h moon-4v',
				components: [
					{content: 'Item 1'},
					{content: 'Item 2'},
					{content: 'Item 3'}
				]
			}
		]},
		{kind: ContextualPopupDecorator, style: 'position: absolute; right: 0px; top: 25%;', components: [
			{content: 'Right', small:true},
			{kind: ContextualPopup, components: [
				{content: 'Outside scroller', kind: Item},
				{classes: 'moon-8h moon-6v', components: [
					{kind: Scroller, classes: 'enyo-fill', components: [
						{content: 'testing 1', kind: Item},
						{content: 'testing 2', kind: Item},
						{content: 'testing 3', kind: Item},
						{content: 'testing 4', kind: Item},
						{content: 'testing 5', kind: Item},
						{content: 'testing 6', kind: Item},
						{content: 'testing 7', kind: Item},
						{content: 'testing 8', kind: Item},
						{content: 'testing 9', kind: Item},
						{content: 'testing 10', kind: Item},
						{content: 'testing 12', kind: Item},
						{content: 'testing 13', kind: Item},
						{content: 'testing 14', kind: Item},
						{content: 'testing 15', kind: Item},
						{content: 'testing 16', kind: Item},
						{content: 'testing 17', kind: Item},
						{content: 'testing 18', kind: Item},
						{content: 'testing 19', kind: Item}
					]}

				]}
			]}
		]},
		{kind: ContextualPopupDecorator, style: 'position: absolute; left: 0px; top: 45%;', components: [
			{content: 'Wide'},
			{kind: ContextualPopup, classes: 'moon-6h moon-4v', components: [
				{kind: Scroller, classes: 'enyo-fill', components:[
					{content: 'testing 1'},
					{content: 'testing 2'}
				]}
			]}
		]},
		{kind: ContextualPopupDecorator, style: 'position: absolute; right: 0px; top: 45%;', components: [
			{content: 'Long but Small Button with truncation', small:true},
			{kind: ContextualPopup, components: [
				{content: 'Outside scroller', kind: Item},
				{classes: 'moon-16v', components: [
					{kind: Scroller, classes: 'enyo-fill', components: [
						{content: 'testing 1', kind: Item},
						{content: 'testing 2', kind: Item},
						{content: 'testing 3', kind: Item},
						{content: 'testing 4', kind: Item},
						{content: 'testing 5', kind: Item},
						{content: 'testing 6', kind: Item},
						{content: 'testing 7', kind: Item},
						{content: 'testing 8', kind: Item},
						{content: 'testing 9', kind: Item},
						{content: 'testing 10', kind: Item},
						{content: 'testing 12', kind: Item},
						{content: 'testing 13', kind: Item},
						{content: 'testing 14', kind: Item},
						{content: 'testing 15', kind: Item},
						{content: 'testing 16', kind: Item},
						{content: 'testing 17', kind: Item},
						{content: 'testing 18', kind: Item},
						{content: 'testing 19', kind: Item}
					]}

				]}
			]}
		]},
		{kind: ContextualPopupDecorator, style: 'position: absolute; left: 0px; top: 65%;', components: [
			{content: 'Deactivated', disabled:true},
			{kind: ContextualPopup, classes: 'moon-6h moon-4v', components: [
				{kind: Scroller, classes: 'enyo-fill', components:[
					{content: 'testing 1'},
					{content: 'testing 2'}
				]}
			]}
		]},
		{kind: ContextualPopupDecorator, style: 'position: absolute; right: 0px; top: 65%;', components: [
			{content: 'Small Deactivated', small:true, disabled:true},
			{kind: ContextualPopup, classes: 'moon-6h moon-4v', components: [
				{kind: Scroller, classes: 'enyo-fill', components:[
					{content: 'testing 1'},
					{content: 'testing 2'}
				]}
			]}
		]},
		{kind: ContextualPopupDecorator, style: 'position: absolute; left: 0px; bottom: 0px;', components: [
			{content: 'Spotlight Modal'},
			{
				kind: ContextualPopup,
				name: 'buttonPopup',
				classes: 'moon-8h moon-8v',
				modal: true,
				autoDismiss: false,
				spotlightModal: true,
				components: [
					{kind: Scroller, horizontal: 'auto', classes: 'enyo-fill', components: [
						{kind: Button, content: 'Button'},
						{kind: ToggleButton, content: 'SpotlightModal', value: true, ontap: 'buttonToggled'},
						{tag: 'br'},
						{tag: 'br'},
						{kind: InputDecorator, spotlight: true, components: [
							{kind: Input, placeholder: 'USERNAME'}
						]}
					]}
				]
			}
		]},
		{kind: ContextualPopupDecorator, style: 'position: absolute; right: 0px; bottom: 0px;', components: [
			{content: 'Spottable', small:true},
			{
				kind: ContextualPopup,
				classes: 'moon-9h moon-4v',
				components: [
					{kind: Scroller, horizontal: 'auto', classes: 'enyo-fill', components: [
						{kind: Button, content: 'Button 1'},
						{kind: Button, content: 'Button 2'},
						{kind: Button, content: 'Button 3'}
					]}
				]
			}
		]},
		{style: 'position: absolute; left: 30%; top: 25%;', components: [
			{kind: Divider, content: 'Button Position', classes: 'radioItemFont'},
			{kind: InputDecorator, components: [
				{kind: Input, style: 'width: 120px', name: 'leftInput', placeholder: 'left (px or %)', classes: 'radioItemFont'}
			]},
			{kind: InputDecorator, components: [
				{kind: Input, style: 'width: 120px', name: 'topInput', placeholder: 'top (px or %)', classes: 'radioItemFont'}
			]},
			{kind: Button, small: true, content: 'Set Position', ontap: 'setPosition'}
		]},
		{style: 'position: absolute; left: 30%; top: 50%; ', components: [
			{kind: Divider, content: 'Popup Direction', classes: 'radioItemFont'},
			{kind: RadioItemGroup, onActivate: 'groupChanged', components: [
				{content: 'none', classes: 'radioItemFont'},
				{content: 'left', classes: 'radioItemFont'},
				{content: 'right', classes: 'radioItemFont'},
				{content: 'top', classes: 'radioItemFont'},
				{content: 'bottom', classes: 'radioItemFont'}
			]}
		]},
		{kind: ContextualPopupDecorator, name: 'directionButton', style: 'position: absolute; left: 40%; top: 70%;', components: [
			{content: 'Direction'},
			{
				kind: ContextualPopup,
				name: 'directionContext',
				classes: 'moon-4v',
				components: [
					{kind: Scroller, horizontal: 'auto', classes: 'enyo-fill', components: [
						{kind: Button, content: 'Button 1'},
						{kind: Button, content: 'Button 2'}
					]}
				]
			}
		]}
	],
	bindings: [
		{from: '.$.nestedRadioGroup.active.content', to: '.$.nestedRadioValue.content', transform: function(val){
			this.dismissRadioSelection();
			return val;
		}}
	],
	buttonToggled: function(inSender, inEvent) {
		this.$.buttonPopup.setSpotlightModal(inSender.getActive());
		this.$.buttonPopup.setAutoDismiss(!inSender.getActive());
	},
	dismissRadioSelection: function(){
		if(this.$.nestedRadioDismissButton.value) this.$.nestedRadioPopup.hide();
	},
	setPosition: function(){
		this.$.directionButton.applyStyle('left', this.$.leftInput.getValue() === '' ? '40%' : this.$.leftInput.getValue());
		this.$.directionButton.applyStyle('top', this.$.topInput.getValue() === '' ? '70%' : this.$.topInput.getValue());
	},
	groupChanged: function(inSender, inEvent) {
		if(inEvent.originator.getActive() && inEvent.originator.kind === RadioItem) {
			var selected = inEvent.originator.getContent();
			this.$.directionContext.set('direction', selected);
		}
	}
});