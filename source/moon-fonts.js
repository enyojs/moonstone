(function() {
	if (window.ilib) {
		var loc = new ilib.Locale();
		var language = loc.getLanguage();
		var region = loc.getRegion();
		var style;
		if (language === 'ur') {
			style = document.createElement("style");
			document.head.appendChild(style);
			style.innerText =
				'@font-face { ' +
				'	font-family: "LG Display";' +
				'	src: local("LG Display_Urdu");' +
				'	font-weight: normal;' +
				'	unicode-range: U+0600-U+06FF;' +
				'	unicode-range: U+FE70-U+FEFE;' +
				'	unicode-range: U+FB50-U+FDFF;' +
				'}';
		}
		else if (language === 'ja') {
			style = document.createElement("style");
			document.head.appendChild(style);
			style.innerText =
				'@font-face { ' +
				'	font-family: "LG Display";' +
				'	src: local("LG Display_JP");' +
				'	font-weight: normal;' +
				'	unicode-range: U+0000-U+00FF;' +
				'	unicode-range: U+2E80-U+2EFF;' +
				'	unicode-range: U+2F00-U+2FDF;' +
				'	unicode-range: U+3000-U+303F;' +
				'	unicode-range: U+3040-U+309F;' +
				'	unicode-range: U+30A0-U+30FF;' +
				'	unicode-range: U+3200-U+33FF;' +
				'	unicode-range: U+3400-U+4DBF;' +
				'	unicode-range: U+4E00-U+9FFF;' +
				'	unicode-range: U+E000-U+FAFF;' +
				'	unicode-range: U+FF00-U+FFEF;' +
				'}';
		}
		else if (language === 'zh' && region === 'HK') {
			style = document.createElement("style");
			document.head.appendChild(style);
			var unicodeRanges = 
				'	unicode-range: U+0000-U+00FF;' +
				'	unicode-range: U+2E80-U+2EFF;' +
				'	unicode-range: U+3000-U+303F;' +
				'	unicode-range: U+3200-U+33FF;' +
				'	unicode-range: U+3400-U+4DBF;' +
				'	unicode-range: U+4E00-U+9FFF;' +
				'	unicode-range: U+E000-U+FAFF;' +
				'	unicode-range: U+FF00-U+FFEF;';
			style.innerText =
				'@font-face { ' +
				'	font-family: "LG Display";' +
				'	src: local("LG Display_HK");' +
				'	font-weight: normal;' +
				unicodeRanges +
				'} ' +
				'@font-face { ' +
				'	font-family: "LG Display Light";' +
				'	src: local("LG Display_HK-Light");' +
				'	font-weight: normal;' +
				unicodeRanges +
				'}';
		}
	}
})();
