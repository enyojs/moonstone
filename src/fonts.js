var
	i18n = require('enyo/i18n'),
	platform = require('enyo/platform');

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
				regular: 'LG Display_JP',
				unicodeRanges:
					'U+0-FF,' +
					'U+2E80-2EFF,' +
					'U+2F00-2FDF,' +
					'U+3000-303F,' +
					'U+3040-309F,' +
					'U+30A0-30FF,' +
					'U+3200-33FF,' +
					'U+3400-4DBF,' +
					'U+4E00-9FFF,' +
					'U+E000-FAFF,' +
					'U+FF00-FFEF'
			},
			'en-JP': {
				regular: 'LG Display_JP',
				unicodeRanges:
					'U+20-7E,U+A0-FF,U+131,U+141-142,U+152-153,U+160-161,U+178,U+17D-17E,U+391-3A1,' +
					'U+3A3-3A9,U+3B1-3C1,U+3C3-3C9,U+2010,U+2012-2015,U+2018-201A,U+201C-201E,' +
					'U+2020-2022,U+2025-2026,U+2030,U+2032-2033,U+2039-203C,U+203E,U+2044,U+2049,' +
					'U+2103,U+2109-210A,U+2113,U+2116,U+2121-2122,U+212B,U+213B,U+2200,U+2202-2203,' +
					'U+2207-2208,U+220B,U+2211-2212,U+221A,U+221D-2220,U+2225,U+2227-222E,' +
					'U+2234-2235,U+223C-223D,U+2252,U+2260-2261,U+2266-2267,U+226A-226B,' +
					'U+2282-2283,U+2286-2287,U+22A5,U+22BF,U+22EF,U+2312,U+E040-E04B,U+E080-E095,' +
					'U+E0C9-E0CE,U+E0D0-E0D3,U+E0D8-E0D9,U+E0DC-E0F0,U+E0F5-E0FF,U+E180-E19C,' +
					'U+E1A7-E1D7,U+E285-E2C6,U+E2CA-E2E2,U+E2E5-E2F7,U+E2F9-E2FB,U+E2FF,' +
					'U+E380-E3A5,U+E3A7-E3A8,U+FB01-FB02'
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
		if (platform.ie === 8) {
			// ENYO-3944: Using getElementsByTagName('head') for IE8 Sampler support
			document.getElementsByTagName('head')[0].appendChild(styleElem);
		} else {
			document.head.appendChild(styleElem);
		}
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

	// ENYO-3944: IE8 Sampler support - IE8 does not allow innerHTML modification of <style> elements
	if (platform.ie !== 8) {
		styleElem.innerHTML = fontDefinitionCss;
	}
}

i18n.updateLocale.extend(function (sup) {
	return function() {
		sup.apply(this, arguments);
		funLocaleSpecificFonts();
	};
});

funLocaleSpecificFonts();