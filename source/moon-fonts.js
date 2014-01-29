(function() {
	if (window.ilib) {

		var funEnyoLocaleChanged = enyo.updateLocale,
			funLocaleSpecificFonts = null;

		funLocaleSpecificFonts = function() {
			var loc = new ilib.Locale(),
				language = loc.getLanguage(),
				region = loc.getRegion(),
				fontFamilyRegular = 'LG Display-Light',
				fontFamilyBold    = 'LG Display-Regular',
				fontFamilyLight   = 'LG Display-Light',
				unicodeRanges = '',
				styleId = "enyo-localization-font-override",
				styleElem = document.getElementById(styleId);

			if (!styleElem) {
				styleElem = document.createElement("style");
				styleElem.setAttribute("id", styleId);
				document.head.appendChild(styleElem);
			}

			if (language === 'ur') {
				fontFamilyRegular = 'LG Display_Urdu';
				fontFamilyBold    = 'LG Display_Urdu';
				fontFamilyLight   = 'LG Display_Urdu';
				unicodeRanges = 
					'U+0600-U+06FF, ' +
					'U+FE70-U+FEFE, ' +
					'U+FB50-U+FDFF';
			}
			else if (language === 'ja') {
				fontFamilyRegular = 'LG Display_JP';
				fontFamilyBold    = 'LG Display_JP';
				fontFamilyLight   = 'LG Display_JP';
				unicodeRanges = 
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
					'U+FF00-U+FFEF';
			}
			else if (language === 'zh' && region === 'HK') {
				fontFamilyRegular = 'LG Display GP4_HK-Light';
				fontFamilyBold    = 'LG Display GP4_HK-Regular';
				fontFamilyLight   = 'LG Display GP4_HK-Light';
				unicodeRanges = 
					'U+0000-U+00FF,' +
					'U+2E80-U+2EFF,' +
					'U+3000-U+303F,' +
					'U+3200-U+33FF,' +
					'U+3400-U+4DBF,' +
					'U+4E00-U+9FFF,' +
					'U+E000-U+FAFF,' +
					'U+FF00-U+FFEF';
			}

			if (unicodeRanges) {
				styleElem.innerHTML = 
					'@font-face { ' +
					'  font-family: "Moonstone LG Display";' +
					'  src: local("' + fontFamilyRegular + '");' +
					'  font-weight: normal;' +
					'  unicode-range: ' + unicodeRanges + ';' +
					'} ' +
					'@font-face { ' +
					'  font-family: "Moonstone LG Display Bold";' +
					'  src: local("' + fontFamilyBold + '");' +
					'  font-weight: normal;' +
					'  unicode-range: ' + unicodeRanges + ';' +
					'} ' +
					'@font-face { ' +
					'  font-family: "Moonstone LG Display Light";' +
					'  src: local("' + fontFamilyLight + '");' +
					'  font-weight: normal;' +
					'  unicode-range: ' + unicodeRanges + ';' +
					'}';
			}
			else {
				styleElem.innerHTML = '';
			}
		}

		enyo.updateLocale = function() {
			funEnyoLocaleChanged.apply(this,arguments);
			funLocaleSpecificFonts();
		};

		funLocaleSpecificFonts();
	}
})();
