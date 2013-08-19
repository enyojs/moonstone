enyo.kind({
    name: "sun.ListItem",
    classes: "sun-listitem-item",
    published: {
        selected: false,
        item: ""
    },
    events: {
        onIconTap: "",
        onThumbnailTap: "",
        onCommandTap: "",
        onListItemTap: ""
    },
    handlers: {
        ontap: "listItemTapped"
    },
    components: [
        {name: "icon", kind: "sun.IconButton", classes: "sun-listitem-icon", small: true, ontap: "iconTapped"},
        {name: "thumbnail", kind: "enyo.Image", classes: "sun-listitem-thumbnail", ontap: "thumbailTapped"},

        {name: "subject", classes: "sun-listitem-subject"},
        {name: "textItem1", classes: "sun-listitem-textitem1"},
        {name: "textItem2", classes: "sun-listitem-textitem2"},

        {name: "command", kind: "sun.IconButton", classes: "sun-listitem-command", small: true, ontap: "commandTapped"},
        {name: "extraInfo", classes: "sun-listitem-extrainfo"}
    ],

    itemChanged: function() {
        var item = this.item;

        this.removeClass("sun-listitem-icon-attached");
        this.removeClass("sun-listitem-thumbnail-attached");
        this.$.icon.hide();
        this.$.thumbnail.hide();
        if (item.icon && item.icon != "") {
            this.$.icon.addStyles("background-image:url(" + item.icon + ");");
            this.$.icon.show();
            this.addClass("sun-listitem-icon-attached");
        }
        else if (item.thumbnail && item.thumbnail != "") {
            this.$.thumbnail.setAttribute('src', enyo.path.rewrite(item.thumbnail));
            this.$.thumbnail.show();
            this.addClass("sun-listitem-thumbnail-attached");
        }

        this.$.textItem1.hide();
        this.$.textItem2.hide();
        if (item.subject && item.subject != "") {
            this.$.subject.setContent(item.subject);
        }
        if (item.item1 && item.item1 != "") {
            this.$.textItem1.setContent(item.item1);
            this.$.textItem1.show();
        }
        if (item.item2 && item.item2 != "") {
            this.$.textItem2.setContent(item.item2);
            this.$.textItem2.show();
        }

        this.removeClass("sun-listitem-command-attached");
        this.$.command.hide();
        if (item.command && item.command != "") {
            this.$.command.addStyles("background-image:url(" + item.command + ");");
            this.$.command.show();
            this.addClass("sun-listitem-command-attached");
        }

        this.removeClass("sun-listitem-extrainfo-attached");
        this.$.extraInfo.hide();
        if (item.extraInfo && item.extraInfo != "") {
            this.$.extraInfo.setContent(item.extraInfo);
            this.$.extraInfo.show();
            this.addClass("sun-listitem-extrainfo-attached");
        }

        this.removeClass("sun-listitem-singlelined");
        this.removeClass("sun-listitem-doublelined");
        this.removeClass("sun-listitem-triplelined");
        if (item.item2) {
            this.addClass("sun-listitem-triplelined");
        }
        else if (item.item1) {
            this.addClass("sun-listitem-doublelined");
        }
        else {
            this.addClass("sun-listitem-singlelined");
        }
    },

    selectedChanged: function() {
        this.addRemoveClass("sun-listitem-selected", this.selected);
    },

    iconTapped: function(inSender, inEvent) {
        this.doIconTap();
    },

    thumbailTapped: function(inSender, inEvent) {
        this.doThumbnailTap();
    },

    commandTapped: function(inSender, inEvent) {
        this.doCommandTap();
    },

    listItemTapped: function(inSender, inEvent) {
        this.doListItemTap();
    }
});
