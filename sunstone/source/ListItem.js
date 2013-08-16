enyo.kind({
    name: "sun.ListItemSingle",
    published: {
        selected: false,
        icon: "",
        label: "",
        text: "",
        extraInfo: "",
        extraInfoIcon: "",
    },
    classes: "debug sun-listitem-item",
    components: [
        {name: "icon", kind: "sun.IconButton", classes: "debug sun-listitem-icon", showing: false},
        {name: "label", classes: "debug sun-listitem-subject"},
        {classes: "debug sun-listitem-extracontainer", components: [
            {name: "extraInfoIcon", kind: "sun.IconButton", classes: "debug sun-listitem-extrainfoicon", showing: false},
            {name: "extraInfo", classes: "debug sun-listitem-extrainfo"},
        ]}
    ],

    labelChanged: function() {
        this.$.label.setContent(this.label);
    },
    selectedChanged: function() {
        this.addRemoveClass("sun-listitem-selected", this.selected);
    },
    extraInfoChanged: function() {
        this.$.extraInfo.setContent(this.extraInfo);
    },
    iconChanged: function() {
        if (!this.icon || this.icon === '') {
           this.$.icon.hide();
        }
        else {
           this.$.icon.addStyles("background-image:url(" + this.icon + ");");
           this.$.icon.show();
        }
    },
    extraInfoIconChanged: function() {
        if (!this.extraInfoIcon || this.extraInfoIcon === '') {
           this.$.extraInfoIcon.hide();
        }
        else {
           this.$.extraInfoIcon.addStyles("background-image:url(" + this.extraInfoIcon + ");");
           this.$.extraInfoIcon.show();
        }
    },

});
