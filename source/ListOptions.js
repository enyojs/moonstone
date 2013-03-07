/**
	_moon.ListOptions is a drop down menu that presents potentially multiple menu lists to a user.
*/
		//TODO: handle stacked situation onSpotlightDown
		//TODO: figure out what's up with stacked drawer open/focus behavior	
		//TODO: any other unusual focus issues				
enyo.kind({
	name: "moon.ListOptions",
	classes: "moon-list-options",
	published: {
		//* If true, the drawer is expanded, showing this item's contents.
		open: false,
		/**
			If true, the drawer will automatically close when the user
			selects a menu item & replace the current action with the selected value. 
			If false, the drawer does not automatically close when the user
			selects a menu item & the current action will add or remove each selected value.
		*/
		autoCollapse: false,
		listOptions: []
	},
	handlers: {
		onActivate: "optionSelected"
	},
	selectedOptions: [], //keeps track of the control ids & values that are selected in the list of options
	components:[
	 	{kind:"moon.Header", components: [
			{name:"currentValue", kind: "moon.Item", spotlight: false, content:"", classes:"moon-list-options-current-value"},
			{components:[
				{kind:"enyo.Button", classes:"moon-list-options-activator", spotlight:true, ontap: "expandContract", onSpotlightSelect: "expandContract"},
				{name:"client", classes:"moon-list-options-client", spotlight: false}
			]}
		]},
		{name: "drawer", kind: "enyo.Drawer", onStep: "drawerAnimationStep", onEnd: "drawerAnimationEnd", components: [
			{name: "listOptions", kind: "moon.Scroller", classes:"moon-list-options-scroller", onSpotlightFocus:"listOptionsFocus", components:[
				{name:"listOptionsContainer", classes:"moon-list-options-container", onSpotlightDown:"spotlightDown", onSpotlightUp:"spotlightUp", onRequestScrollIntoView:"scrollIntoView"}
			]}
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.$.listOptionsContainer.createComponents(this.listOptions);
		this.openChanged();
		this.listOptionsChanged();
	},
	//* Facade for header content
	contentChanged: function() {
		this.$.header.setTitle(this.getContent());
	},
	listOptionsChanged: function() {
		for (option in this.listOptions) {
			this.$.listOptionsContainer.createComponents([
				{
					classes: "moon-list-options-menu",
					components: this.listOptions[option]
				}
			])
		}
	},
	//If an option was selected then add or remove it to the list of selected options. 
	//Note that this currently only allows for items conforming to either moon.LabeledCheckbox or moon.LabeledToggleButton interfaces
	optionSelected: function(inSender, inEvent) {
		if (inEvent.toggledControl && inEvent.toggledControl.checked) {
			if (this.autoCollapse) {
				//single select just replaces current value & closes drawer
				this.selectedOptions[0] = {id:inEvent.toggledControl.id, content:inEvent.toggledControl.getContent()};
				setTimeout(enyo.bind(this, function() {
					this.setOpen(false);
					this.resetScrollers();					
					enyo.Spotlight.spot(this.$.button);
				}), 300);
			} else {
				//make sure it's not already selected
				var selected = false;
				for (var i=0;i<this.selectedOptions.length;i++) {
					if (this.selectedOptions[i].id == inEvent.toggledControl.id) {
						selected = true;
						break;
					}
				}
				if (!selected) {
					this.selectedOptions.push({id:inEvent.toggledControl.id, content:inEvent.toggledControl.getContent()});	
				}
			}
		} else if (inEvent.toggledControl && !inEvent.toggledControl.checked) {
			//remove the item if it's being unchecked
			for (var i=0;i<this.selectedOptions.length;i++) {
				if (this.selectedOptions[i].id == inEvent.toggledControl.id) {
					this.selectedOptions.splice(i,1);
					break;
				}
			}
		}
		var selections = "";
		for (var i=0;i<this.selectedOptions.length;i++) {
			selections += (selections == "" ? "":" / ") + this.selectedOptions[i].content;
		}
		this.$.currentValue.setContent(selections);
	},
	//* If closed, open drawer and highlight first spottable child
	expandContract: function() {
		if (this.disabled)
				return true;
		if(!this.getOpen()) {
			this.setOpen(true);			
			//focus on the first menu option but make sure we're not focusing on a moon.Scroller (unless menus are stacked)
			enyo.Spotlight.spot(this.filterScrollers(enyo.Spotlight.getFirstChild(this.$.listOptionsContainer)));
		} else {
			this.setOpen(false);
		}
		this.resetScrollers();
		return true;
	},
	filterScrollers: function(control) {
		//if menus are not stacked, get the first child from the scroller (if there is one)
		//Why is this needed?
		if (!this.stacked && control.kind == "moon.Scroller") {
			return enyo.Spotlight.getFirstChild(control);
		}
		return control;
	},
	resetScrollers: function() {
		//if stacked scroll to the top of the main drawer scroller, otherwise scroll to the top of the individual menu scrollers
		if (this.stacked) {
			this.$.listOptions.scrollTo(0,0);
		} else {
			var optionGroup = this.$.listOptionsContainer.getControls();
			for (var i=0;i<optionGroup.length;i++) {
				var controls = optionGroup[i].getControls();
				for (var j=0;j<controls.length;j++) {
					if (controls[j].kind == "moon.Scroller") {
						controls[j].scrollTo(0,0);		
					}
				}
			}			
		}		
	},
	//* Facade for drawer
	openChanged: function() {
		this.$.drawer.setOpen(this.getOpen());
		this.refresh();
	},
	/**
		Everytime the drawer animates, bubble the requestScrollIntoView event.
		This makes for a smoother expansion animation when inside of a scroller,
		as the height of the scroller changes with the drawer expansion.
	*/
	drawerAnimationStep: function() {
		this.bubble("onRequestScrollIntoView");
	},
	drawerAnimationEnd: function() {
		//refresh the list option menus when the drawer opens
		if (this.$.drawer.hasNode() && this.open) {
			this.refresh();
		}
	},
	resizeHandler: function() {
		//don't refresh while animating
		if (!this.$.drawer.$.animator.isAnimating()){
			this.refresh();
			this.$.listOptions.render();
		}
	},
	refresh: function() {
		if (this.$.drawer.hasNode()) {
			var br = this.$.drawer.hasNode().getBoundingClientRect();		  

			//get the total width of all option menus
			var width = 0;
			var optionGroup = this.$.listOptionsContainer.getControls();
			for (var i=0;i<optionGroup.length;i++) {
				width += optionGroup[i].hasNode().getBoundingClientRect().width;
			}

			//if the option menus don't all fit horizontally, stack them & allow the main drawer scroller to scroll all of them
			if (width > br.width) {
				for (var i=0;i<optionGroup.length;i++) {
					optionGroup[i].applyStyle("display","block");
					var controls = optionGroup[i].getControls();
					for (var j=0;j<controls.length;j++) {
						if (controls[j].kind == "moon.Scroller") {
							controls[j].applyStyle("max-height", "none");
						}
					}
				}
				this.stacked = true;		
			} else {
				//if all the menus fit horizontally, then give their individual scrollers a scroll height of the drawer so they self scroll
				for (var i=0;i<optionGroup.length;i++) {
					optionGroup[i].applyStyle("display","inline-block");
					var controls = optionGroup[i].getControls();
					for (var j=0;j<controls.length;j++) {
						if (controls[j].kind == "moon.Scroller") {
							controls[j].applyStyle("max-height", (br.height - (controls[j].hasNode().getBoundingClientRect().top - br.top)) + "px");
						}
					}
				}
				this.stacked = false;
			}
		}		
	},
	//* When spotlight reaches the bottom or top of an option menu, prevent user from continuing downward.
	spotlightDown: function(inSender, inEvent) {
		var s = enyo.Spotlight.getSiblings(inEvent.originator);
		if (!this.stacked && s.selfPosition == (s.siblings.length-1)) {
			return true;
		}
	},
	spotlightUp: function(inSender, inEvent) {
		var s = enyo.Spotlight.getSiblings(inEvent.originator);
		//if current item is at the top of a menu OR is an expandable picker
		if (inEvent.originator.kind == "moon.ExpandablePicker" || s.selfPosition == 0) {
			//if the menus are not stacked OR the current item is the first in the stacked menu overall, close the drawer & focus the activator
			if (!this.stacked || inEvent.originator == this.filterScrollers(enyo.Spotlight.getFirstChild(this.$.listOptionsContainer))) {
				this.setOpen(false);
				this.resetScrollers();					
				enyo.Spotlight.spot(this.$.button);
				return true;	
			}
		}		
	},
	//when menus are laid out horizontally prevent the onRequestScrollIntoView event from bubbling past the menus container 
	//- prevents scroll bouncing for scroller in scroller
	scrollIntoView: function(inSender, inEvent) {
		if (!this.stacked) {
			return true;			
		}
	}
});