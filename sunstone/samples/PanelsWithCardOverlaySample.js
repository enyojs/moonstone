enyo.kind({
    name: "sun.sample.PanelsWithCardArrangerSample",
    classes: "sun moon enyo-fit",    
    handlers: {ontap: "panelChange"},
    components: [        
        {name: "panels", kind: "moon.Panels", arrangerKind: "CardOverlayArranger", classes: "enyo-fit", components: [        
            {
            	title: "First", 
            	style: "background-color: red;",
            	headerComponents: [
			    	{
			    		name: "next", 			    		
				    	kind: "moon.IconButton", 
				    	src: "$lib/moonstone/patterns-samples/assets/icon-next.png", 
				    	ontap: "panelChange"
			    	},
			        {
			        	name: "previous", 
			        	kind: "moon.IconButton", 
			        	src: "$lib/moonstone/patterns-samples/assets/icon-download.png", 
			        	disabled: true,
			        	ontap: "panelChange"
			        }
				],
				components: [	            
				{kind: "moon.Item", content: "Item One"},
				{kind: "moon.Item", content: "Item Two"},
				{kind: "moon.Item", content: "Item Three"},
				{kind: "moon.Item", content: "Item Four"},
				{kind: "moon.Item", content: "Item Five"}
			]},
            {
            	title: "Second", 
            	style: "background-color: green;",
            	headerComponents: [
			    	{
			    		name: "next", 
				    	kind: "moon.IconButton", 
				    	src: "$lib/moonstone/patterns-samples/assets/icon-next.png", 
				    	ontap: "panelChange"
			    	},
			        {
			        	name: "previous", 
			        	kind: "moon.IconButton", 
			        	src: "$lib/moonstone/patterns-samples/assets/icon-download.png", 
			        	ontap: "panelChange"
			        }
				],
				components: [	            
				{kind: "moon.Item", content: "Item One"},
				{kind: "moon.Item", content: "Item Two"},
				{kind: "moon.Item", content: "Item Three"},
				{kind: "moon.Item", content: "Item Four"},
				{kind: "moon.Item", content: "Item Five"}
			]},
            {
            	title: "Third", 
            	style: "background-color: yellow;",
            	headerComponents: [
			    	{
			    		name: "next", 
				    	kind: "moon.IconButton", 
				    	src: "$lib/moonstone/patterns-samples/assets/icon-next.png", 
				    	ontap: "panelChange"
			    	},
			        {
			        	name: "previous", 
			        	kind: "moon.IconButton", 
			        	src: "$lib/moonstone/patterns-samples/assets/icon-download.png", 
			        	ontap: "panelChange"
			        }
				],
				components: [	            
				{kind: "moon.Item", content: "Item One"},
				{kind: "moon.Item", content: "Item Two"},
				{kind: "moon.Item", content: "Item Three"},
				{kind: "moon.Item", content: "Item Four"},
				{kind: "moon.Item", content: "Item Five"}
			]},
            {
            	title: "Fourth", 
            	style: "background-color: blue;",
            	joinToPrev: true, 
            	headerComponents: [
			    	{
			    		name: "next", 
				    	kind: "moon.IconButton", 
				    	src: "$lib/moonstone/patterns-samples/assets/icon-next.png", 
				    	ontap: "panelChange"
			    	},
			        {
			        	name: "previous", 
			        	kind: "moon.IconButton", 
			        	src: "$lib/moonstone/patterns-samples/assets/icon-download.png", 
			        	ontap: "panelChange"
			        }
				],
				components: [	            
				{kind: "moon.Item", content: "Item One"},
				{kind: "moon.Item", content: "Item Two"},
				{kind: "moon.Item", content: "Item Three"},
				{kind: "moon.Item", content: "Item Four"},
				{kind: "moon.Item", content: "Item Five"}
			]},
            {
            	title: "Fifth",
            	style: "background-color: gray;",
            	joinToPrev: true,             	
				headerComponents: [
			    	{
			    		name: "next", 
				    	kind: "moon.IconButton", 
				    	src: "$lib/moonstone/patterns-samples/assets/icon-next.png", 
				    	ontap: "panelChange"
			    	},
			        {
			        	name: "previous", 
			        	kind: "moon.IconButton", 
			        	src: "$lib/moonstone/patterns-samples/assets/icon-download.png", 
			        	ontap: "panelChange"
			        }
				],
				components: [	            
				{kind: "moon.Item", content: "Item One"},
				{kind: "moon.Item", content: "Item Two"},
				{kind: "moon.Item", content: "Item Three"},
				{kind: "moon.Item", content: "Item Four"},
				{kind: "moon.Item", content: "Item Five"}
			]},
            {
            	title: "Sixth", 
            	style: "background-color: purple;",
            	headerComponents: [
			    	{
			    		name: "next", 
				    	kind: "moon.IconButton", 
				    	src: "$lib/moonstone/patterns-samples/assets/icon-next.png", 
				    	ontap: "panelChange"
			    	},
			        {
			        	name: "previous", 
			        	kind: "moon.IconButton", 
			        	src: "$lib/moonstone/patterns-samples/assets/icon-download.png", 
			        	ontap: "panelChange"
			        }
				],
				components: [	            
				{kind: "moon.Item", content: "Item One"},
				{kind: "moon.Item", content: "Item Two"},
				{kind: "moon.Item", content: "Item Three"},
				{kind: "moon.Item", content: "Item Four"},
				{kind: "moon.Item", content: "Item Five"}
			]},
            {
            	title: "Seventh", 
            	style: "background-color: olive;",
            	joinToPrev: true, 
            	headerComponents: [
			    	{
			    		name: "next", 
				    	kind: "moon.IconButton", 
				    	src: "$lib/moonstone/patterns-samples/assets/icon-next.png", 
				    	disabled: true,
				    	ontap: "panelChange"
			    	},
			        {
			        	name: "previous", 
			        	kind: "moon.IconButton", 
			        	src: "$lib/moonstone/patterns-samples/assets/icon-download.png", 
			        	ontap: "panelChange"
			        }
				],
				components: [	            
				{kind: "moon.Item", content: "Item One"},
				{kind: "moon.Item", content: "Item Two"},
				{kind: "moon.Item", content: "Item Three"},
				{kind: "moon.Item", content: "Item Four"},
				{kind: "moon.Item", content: "Item Five"}
			]},
        ]},
    ],
    panelChange: function(inSender, inEvent) {
    	if(inEvent.originator.name =="next")   
    		this.$.panels.next();
    	else if(inEvent.originator.name =="previous")
    		this.$.panels.previous();

    	return true;
    }
});