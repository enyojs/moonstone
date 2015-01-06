enyo.kind({
	name: 'moon.sample.ContextualPopupSample',
	classes: 'moon enyo-unselectable enyo-fit',
	components: [
		{
			kind: 'moon.ContextualPopupDecorator',
			style:'position: absolute; left: 0px; top: 0px;',
			components:
			[
				{content: 'Average'},
				{
					kind: 'moon.ContextualPopup',
					classes: 'moon-2h moon-8v',
					components: [
						{content:'Item 1'},
						{content:'Item 2'},
						{content:'Item 3'}
					]
				}
			]
		},
		{kind: 'moon.ContextualPopupDecorator', style:'position: absolute; right: 0px; top: 0px;', components: [
			{content:'Small', small:true},
			{kind: 'moon.ContextualPopup'}
		]},
		{kind: 'moon.ContextualPopupDecorator', style:'position: absolute; right: 0px; top: 13%;', components: [
			{content:'Nested Radio', small:true},
				{name:'nestedRadioPopup', kind: 'moon.ContextualPopup', components:[
					{name:'nestedRadioGroup', kind: 'moon.RadioItemGroup', components: [
						{content: 'Creek', selected: true},
						{content: 'River'},
						{content: 'Ocean'}
					]},
					{components:[
						{content: 'Radio Group Value'},
						{name: 'nestedRadioValue'}
					]},
					{name: 'nestedRadioDismissButton',
					 kind: 'moon.ToggleButton',
					 style:'margin-top:5px',
					 small: true,
					 toggleOnLabel: 'select dismiss on',
					 toggleOffLabel: 'select dismiss off'
					}
				]}
			]
		},
		{kind: 'moon.ContextualPopupDecorator', style:'position: absolute; left: 0px; top: 25%;', components: [
			{content: 'Left'},
			{
				kind: 'moon.ContextualPopup',
				classes: 'moon-3h moon-4v',
				components: [
					{content:'Item 1'},
					{content:'Item 2'},
					{content:'Item 3'}
				]
			}
		]},
		{kind: 'moon.ContextualPopupDecorator', style:'position: absolute; right: 0px; top: 25%;', components: [
			{content:'Right', small:true},
			{kind: 'moon.ContextualPopup', components: [
				{content:'Outside scroller', kind: 'moon.Item'},
				{classes: 'moon-8h moon-6v', components: [
					{kind: 'moon.Scroller', classes: 'enyo-fill', components: [
						{content:'testing 1', kind: 'moon.Item'},
						{content:'testing 2', kind: 'moon.Item'},
						{content:'testing 3', kind: 'moon.Item'},
						{content:'testing 4', kind: 'moon.Item'},
						{content:'testing 5', kind: 'moon.Item'},
						{content:'testing 6', kind: 'moon.Item'},
						{content:'testing 7', kind: 'moon.Item'},
						{content:'testing 8', kind: 'moon.Item'},
						{content:'testing 9', kind: 'moon.Item'},
						{content:'testing 10', kind: 'moon.Item'},
						{content:'testing 12', kind: 'moon.Item'},
						{content:'testing 13', kind: 'moon.Item'},
						{content:'testing 14', kind: 'moon.Item'},
						{content:'testing 15', kind: 'moon.Item'},
						{content:'testing 16', kind: 'moon.Item'},
						{content:'testing 17', kind: 'moon.Item'},
						{content:'testing 18', kind: 'moon.Item'},
						{content:'testing 19', kind: 'moon.Item'}
					]}

				]}
			]}
		]},
		{kind: 'moon.ContextualPopupDecorator', style:'position: absolute; left: 0px; top: 45%;', components: [
			{content: 'Wide'},
			{kind: 'moon.ContextualPopup', classes: 'moon-6h moon-4v', components: [
				{kind: 'moon.Scroller', classes: 'enyo-fill', components:[
					{content:'testing 1'},
					{content:'testing 2'}
				]}
			]}
		]},
		{kind: 'moon.ContextualPopupDecorator', style:'position: absolute; right: 0px; top: 45%;', components: [
			{content:'Long but Small Button with truncation', small:true},
			{kind: 'moon.ContextualPopup', components: [
				{content:'Outside scroller', kind: 'moon.Item'},
				{classes: 'moon-16v', components: [
					{kind: 'moon.Scroller', classes: 'enyo-fill', components: [
						{content:'testing 1', kind: 'moon.Item'},
						{content:'testing 2', kind: 'moon.Item'},
						{content:'testing 3', kind: 'moon.Item'},
						{content:'testing 4', kind: 'moon.Item'},
						{content:'testing 5', kind: 'moon.Item'},
						{content:'testing 6', kind: 'moon.Item'},
						{content:'testing 7', kind: 'moon.Item'},
						{content:'testing 8', kind: 'moon.Item'},
						{content:'testing 9', kind: 'moon.Item'},
						{content:'testing 10', kind: 'moon.Item'},
						{content:'testing 12', kind: 'moon.Item'},
						{content:'testing 13', kind: 'moon.Item'},
						{content:'testing 14', kind: 'moon.Item'},
						{content:'testing 15', kind: 'moon.Item'},
						{content:'testing 16', kind: 'moon.Item'},
						{content:'testing 17', kind: 'moon.Item'},
						{content:'testing 18', kind: 'moon.Item'},
						{content:'testing 19', kind: 'moon.Item'}
					]}

				]}
			]}
		]},
		{kind: 'moon.ContextualPopupDecorator', style:'position: absolute; left: 0px; top: 65%;', components: [
			{content: 'Deactivated', disabled:true},
			{kind: 'moon.ContextualPopup', classes: 'moon-6h moon-4v', components: [
				{kind: 'moon.Scroller', classes: 'enyo-fill', components:[
					{content:'testing 1'},
					{content:'testing 2'}
				]}
			]}
		]},
		{kind: 'moon.ContextualPopupDecorator', style:'position: absolute; right: 0px; top: 65%;', components: [
			{content: 'Small Deactivated', small:true, disabled:true},
			{kind: 'moon.ContextualPopup', classes: 'moon-6h moon-4v', components: [
				{kind: 'moon.Scroller', classes: 'enyo-fill', components:[
					{content:'testing 1'},
					{content:'testing 2'}
				]}
			]}
		]},
		{kind: 'moon.ContextualPopupDecorator', style: 'position: absolute; left: 0px; bottom: 0px;', components: [
			{content: 'Spotlight Modal'},
			{
				kind: 'moon.ContextualPopup',
				name: 'buttonPopup',
				classes: 'moon-8h moon-8v',
				modal: true,
				autoDismiss: false,
				spotlightModal: true,
				components: [
					{kind: 'moon.Scroller', horizontal: 'auto', classes: 'enyo-fill', components: [
						{kind: 'moon.Button', content: 'Button'},
						{kind: 'moon.ToggleButton', content: 'SpotlightModal', value: true, ontap: 'buttonToggled'},
						{tag: 'br'},
						{tag: 'br'},
						{kind: 'moon.InputDecorator', spotlight: true, components: [
							{kind: 'moon.Input', placeholder: 'USERNAME'}
						]}
					]}
				]
			}
		]},
		{kind: 'moon.ContextualPopupDecorator', style: 'position: absolute; right: 0px; bottom: 0px;', components: [
			{content: 'Spottable', small:true},
			{
				kind: 'moon.ContextualPopup',
				classes: 'moon-9h moon-4v',
				components: [
					{kind: 'moon.Scroller', horizontal: 'auto', classes: 'enyo-fill', components: [
						{kind: 'moon.Button', content: 'Button 1'},
						{kind: 'moon.Button', content: 'Button 2'},
						{kind: 'moon.Button', content: 'Button 3'}
					]}
				]
			}
		]},
		{style: 'position: absolute; left: 30%; top: 25%;', components: [
			{kind: 'moon.Divider', content: 'Button Position', classes: 'radioItemFont'},
			{kind: moon.InputDecorator, components: [
				{kind: 'moon.Input', style: 'width: 120px', name:'leftInput', placeholder: 'left (px or %)', classes: 'radioItemFont'}
			]},
			{kind: 'moon.InputDecorator', components: [
				{kind: 'moon.Input', style: 'width: 120px', name:'topInput', placeholder: 'top (px or %)', classes: 'radioItemFont'}
			]},
			{kind: 'moon.Button', small: true, content: 'Set Position', ontap: 'setPosition'}
		]},
		{style: 'position: absolute; left: 30%; top: 50%; ', components: [
			{kind: 'moon.Divider', content: 'Popup Direction', classes: 'radioItemFont'},
			{kind: 'moon.RadioItemGroup', onActivate: 'groupChanged', components: [
				{content: 'none', classes: 'radioItemFont'},
				{content: 'left', classes: 'radioItemFont'},
				{content: 'right', classes: 'radioItemFont'},
				{content: 'top', classes: 'radioItemFont'},
				{content: 'bottom', classes: 'radioItemFont'}
			]}
		]},
		{kind: 'moon.ContextualPopupDecorator', name: 'directionButton', style: 'position: absolute; left: 40%; top: 70%;', components: [
			{content: 'Direction'},
			{
				kind: 'moon.ContextualPopup',
				name: 'directionContext',
				classes: 'moon-4v',
				components: [
					{kind: moon.Scroller, horizontal: 'auto', classes: 'enyo-fill', components: [
						{kind: moon.Button, content: 'Button 1'},
						{kind: moon.Button, content: 'Button 2'}
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
		if(this.$.nestedRadioDismissButton.value) this.$.nestedRadioPopup.closePopup();
	},
	setPosition: function(){
		this.$.directionButton.applyStyle('left', this.$.leftInput.getValue() === '' ? '40%' : this.$.leftInput.getValue());
		this.$.directionButton.applyStyle('top', this.$.topInput.getValue() === '' ? '70%' : this.$.topInput.getValue());
	},
	groupChanged: function(inSender, inEvent) {
		if(inEvent.originator.getActive() && inEvent.originator.kind === 'moon.RadioItem') {
			var selected = inEvent.originator.getContent();
			this.$.directionContext.set('direction', selected);
		}
	}
});