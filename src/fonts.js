/**
* This module loads Moonstone specific fonts. It has no exports and is not inteded to be directly
* included by external developers.
*
* @private
* @module moonstone/fonts
*/

var
	i18n = require('enyo/i18n');

var
	Locale = require('enyo-ilib/Locale');

/**
* `moon-fonts` is the locale-specific font generator, allowing any locale to have its own custom
* font. Each locale-font from the configuration block (defined in this file) is generated at
* run-time. If the locale you're currently in is in the locale-font list an additional
* `@font-face` rule will be generated that will override the standard "Moonstone LG Display"
* font.
*
* Below is example genarated-output of the Urdu ("ur") locale-font.
*
* ```css
* &#64;font-face {
* 	font-family: 'Moonstone LG Display ur';
* 	font-weight: normal;
* 	src: local('LG Display_Urdu');
* 	unicode-range: U+0600-U+06FF, U+FE70-U+FEFE, U+FB50-U+FDFF;
* }
* &#64;font-face {
* 	font-family: 'Moonstone LG Display ur Bold';
* 	font-weight: normal;
* 	src: local('LG Display_Urdu');
* 	unicode-range: U+0600-U+06FF, U+FE70-U+FEFE, U+FB50-U+FDFF;
* }
* &#64;font-face {
* 	font-family: 'Moonstone LG Display ur Light';
* 	font-weight: normal;
* 	src: local('LG Display_Urdu');
* 	unicode-range: U+0600-U+06FF, U+FE70-U+FEFE, U+FB50-U+FDFF;
* }
* ```
*
* @name International Fonts
* @public
*/

function funLocaleSpecificFonts () {
	var loc = new Locale(),
		language = loc.getLanguage(),
		region = loc.getRegion(),
		styleId = 'enyo-localization-font-override',
		styleElem = document.getElementById(styleId),
		fontDefinitionCss = '',
		// Locale Configuration Block
		fonts = {
			'NonLatin': {
				regular: 'LG Display-Light',
				bold:    'LG Display-Regular'
			},
			'ja': {
				regular: 'LG Display_JP'
			},
			'en-JP': {
				regular: 'LG Display_JP'
			},
			'ur': {
				regular: 'LG Display_Urdu',
				unicodeRanges:
					'U+600-6FF,' +
					'U+FE70-FEFE,' +
					'U+FB50-FDFF'
			},
			'zh-HK': {
				regular: 'LG Display GP4_HK-Light',
				bold:    'LG Display GP4_HK-Regular',
				unicodeRanges:
					'U+0-FF,' +
					'U+2E80-2EFF,' +
					'U+3000-303F,' +
					'U+3200-33FF,' +
					'U+3400-4DBF,' +
					'U+4E00-9FFF,' +
					'U+E000-FAFF,' +
					'U+FF00-FFEF'
			}
		};

	// Duplications and alternate locale names
	fonts['zh-TW'] = fonts['zh-HK'];

	// Generate a single font-face rule
	this.buildFont = function(inOptions) {
		if (!inOptions && !inOptions.name) {
			return '';
		}
		var strOut = '@font-face { \n' +
			'  font-family: "' + inOptions.name + '";\n' +
			'  font-weight: ' + ( inOptions.weight || 'normal' ) + ';\n';

		if (inOptions.localName) {
			strOut+= '  src: local("' + inOptions.localName + '");\n';
		}
		if (inOptions.unicodeRanges) {
			strOut+= '  unicode-range: ' + inOptions.unicodeRanges + ';\n';
		}
		strOut+= '} \n';
		return strOut;
	};

	// Generate a collection of font-face rules, in multiple font-variants
	this.buildFontSet = function(strLang, bitDefault) {
		var strOut = '',
			name = (bitDefault) ? '' : ' ' + strLang;

		if (fonts[strLang].regular) {
			// Build Regular
			strOut+= this.buildFont({
				name: 'Moonstone LG Display' + name,
				localName: fonts[strLang].regular,
				unicodeRanges: fonts[strLang].unicodeRanges
			});

			// Build Bold
			strOut+= this.buildFont({
				name: 'Moonstone LG Display' + name + ' Bold',
				localName: fonts[strLang].bold || fonts[strLang].regular,
				unicodeRanges: fonts[strLang].unicodeRanges
			});

			// Build Light
			strOut+= this.buildFont({
				name: 'Moonstone LG Display' + name + ' Light',
				localName: fonts[strLang].light || fonts[strLang].regular,
				unicodeRanges: fonts[strLang].unicodeRanges
			});
		}
		return strOut;
	};

	if (!styleElem) {
		styleElem = document.createElement('style');
		styleElem.setAttribute('id', styleId);
		document.head.appendChild(styleElem);
	}

	// Build all the fonts so they could be explicitly called
	for (var lang in fonts) {
		fontDefinitionCss+= this.buildFontSet(lang);
	}

	// Set up the override so "Moonstone LG Display" becomes the local-specific font.
	if (language === 'ja') {
		fontDefinitionCss+= this.buildFontSet('ja', true);
	}
	else if (language === 'en' && region === 'JP') {
		fontDefinitionCss+= this.buildFontSet('en-JP', true);
	}
	else if (language === 'ur') {
		fontDefinitionCss+= this.buildFontSet('ur', true);
	}
	else if (language === 'zh' && region === 'HK') {
		fontDefinitionCss+= this.buildFontSet('zh-HK', true);
	}
	else if (language === 'zh' && region === 'TW') {
		fontDefinitionCss+= this.buildFontSet('zh-TW', true);
	}

	styleElem.innerHTML = fontDefinitionCss;
}

i18n.updateLocale.extend(function (sup) {
	return function() {
		sup.apply(this, arguments);
		funLocaleSpecificFonts();
	};
});

funLocaleSpecificFonts();
