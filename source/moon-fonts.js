(function() {
	if (window.ilib) {
		var loc = new ilib.Locale(),
			language = loc.getLanguage(),
			region = loc.getRegion(),
			styleContent = '';

		if (language === 'ur') {
			styleContent =
				'@font-face { ' +
				'  font-family: "Moonstone LG Display";' +
				'  src: local("LG Display_Urdu");' +
				'  font-weight: normal;' +
				'  unicode-range: ' +
				'U+0600-U+06FF, ' +
				'U+FE70-U+FEFE, ' +
				'U+FB50-U+FDFF;' +
				'}';
		}
		else if (language === 'ja') {
			styleContent =
				'@font-face { ' +
				'  font-family: "Moonstone LG Display";' +
				'  src: local("LG Display_JP");' +
				'  font-weight: normal;' +
				'  unicode-range: ' +
				'U+0000-U+00FF, ' +
				'U+2E80-U+2EFF,' +
				'U+2F00-U+2FDF,' +
				'U+3000-U+303F,' +
				'U+3040-U+309F,' +
				'U+30A0-U+30FF,' +
				'U+3200-U+33FF,' +
				'U+3400-U+4DBF,' +
				'U+4E00-U+9FFF,' +
				'U+E000-U+FAFF,' +
				'U+FF00-U+FFEF;' +
				'}';
		}
		else if (language === 'zh' && region === 'HK') {
			var unicodeRanges = 
				'U+0000-U+00FF,' +
				'U+2E80-U+2EFF,' +
				'U+3000-U+303F,' +
				'U+3200-U+33FF,' +
				'U+3400-U+4DBF,' +
				'U+4E00-U+9FFF,' +
				'U+E000-U+FAFF,' +
				'U+FF00-U+FFEF';
			styleContent =
				'@font-face { ' +
				'  font-family: "Moonstone LG Display";' +
				'  src: local("LG Display GP4_HK"), local("LG Display_HK-Regular");' +
				'  font-weight: normal;' +
				'  unicode-range: ' + unicodeRanges + ';' +
				'} ' +
				'@font-face { ' +
				'  font-family: "Moonstone LG Display Light";' +
				'  src: local("LG Display GP4_HK Light"), local("LG Display_HK-Light");' +
				'  font-weight: normal;' +
				'  unicode-range: ' + unicodeRanges + ';' +
				'}';
		}

		if (styleContent) {
			var style = document.createElement("style");
			style.setAttribute("class", "enyo-localization-font-override");
			document.head.appendChild(style);
			style.innerText = styleContent;	
		}
	}
})();
