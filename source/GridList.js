/*
 * moon.ImageGrid extends enyo.ImageGrid to add moonraker specific confiuguration, styling, decorators and focus-state management
 * 
 * @author: Surya Vakkalanka
 * @date: January 2013
 * 
*/

enyo.kind(
    {
        name: "moon.GridList", 
        kind: "enyo.GridList", 
        classes: "moon-gridlist", 
        multiSelect: true, 
        spotlight: true, 
        itemSpacing: 8, 
        itemMinWidth: 180, 
        itemMinHeight: 180, 
        itemWidth: 180, 
        itemHeight: 180
    }
);