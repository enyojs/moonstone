enyo.kind({
    name: "moon.sample.RTL",
    kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
    
    components: [
        {kind: "moon.Scroller", fit: true, components: [
            /* Header with selecting locale */
            {kind: "ilib.sample.ChooseLocale", onSelectedLocale: "setLocale"},
            {tag: "br"},
               
            {kind: "ilib.moon.sample.RTL"},
                              
            {tag: "br"}, {tag: "br"}, {tag: "br"}, {tag: "br"}, {tag: "br"}, {tag: "br"}, {tag: "br"}, {tag: "br"}, {tag: "br"}, {tag: "br"}, {tag: "br"}, {tag: "br"},
            {tag: "br"}, {tag: "br"}, {tag: "br"}, {tag: "br"}, {tag: "br"}, {tag: "br"}, {tag: "br"}, {tag: "br"}, {tag: "br"}, {tag: "br"}, {tag: "br"}, {tag: "br"}
        ]},
        
        {name: "rtlStatus", kind: "moon.ToggleItem", content: "RTL", checked: false, disabled: true}
    ],
    
    create: function() {
        this.inherited(arguments);
        this.$.rtlStatus.setChecked(new ilib.ScriptInfo(new ilib.LocaleInfo().getScript()).getScriptDirection() === "rtl");
    },
           
    setLocale: function(inSender, inEvent) {
        ilib.setLocale(inEvent.content);
        this.$.rtlStatus.setChecked(new ilib.ScriptInfo(new ilib.LocaleInfo().getScript()).getScriptDirection() === "rtl");
        ilib.updateBodyClasses();
    }    
});
