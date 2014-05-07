/**

	_moon-fonts_ is the locale-specific font generator, allowing any locale to
	have its own font. Each locale-font in the configuration block is generated
	at run-time. If the locale you're currently in is in the locale-font list,
	an additional font-face rule will be generated that will override the
	standard "Moonstone LG Display" font.

	Below is example genarated-output of the "ur", Urdu locale-font.

@font-face { 
  font-family: "Moonstone LG Display ur";
  font-weight: normal;
  src: local("LG Display_Urdu");
  unicode-range: U+0600-U+06FF, U+FE70-U+FEFE, U+FB50-U+FDFF;
} 
@font-face { 
  font-family: "Moonstone LG Display ur Bold";
  font-weight: normal;
  src: local("LG Display_Urdu");
  unicode-range: U+0600-U+06FF, U+FE70-U+FEFE, U+FB50-U+FDFF;
} 
@font-face { 
  font-family: "Moonstone LG Display ur Light";
  font-weight: normal;
  src: local("LG Display_Urdu");
  unicode-range: U+0600-U+06FF, U+FE70-U+FEFE, U+FB50-U+FDFF;
} 

 */

(function() {
	if (window.ilib) {

		var funEnyoUpdateLocale = enyo.updateLocale,
			funLocaleSpecificFonts = null;

		funLocaleSpecificFonts = function() {
			var loc = new ilib.Locale(),
				language = loc.getLanguage(),
				region = loc.getRegion(),
				styleId = "enyo-localization-font-override",
				styleElem = document.getElementById(styleId),
				fontDefinitionCss = "",
				// Locale Configuration Block
				fonts = {
					"NonLatin": {
						regular: "LG Display-Light",
						bold:    "LG Display-Regular"
					},
					"ja": {
						regular: "LG Display_JP",
						unicodeRanges:
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
							'U+FF00-U+FFEF'
					},
					"ur": {
						regular: "LG Display_Urdu",
						unicodeRanges:
							'U+0600-U+06FF, ' +
							'U+FE70-U+FEFE, ' +
							'U+FB50-U+FDFF'
					},
					"zh-HK": {
						regular: "LG Display GP4_HK-Light",
						bold:    "LG Display GP4_HK-Regular",
						unicodeRanges:
							'U+0000-U+00FF,' +
							'U+2E80-U+2EFF,' +
							'U+3000-U+303F,' +
							'U+3200-U+33FF,' +
							'U+3400-U+4DBF,' +
							'U+4E00-U+9FFF,' +
							'U+E000-U+FAFF,' +
							'U+FF00-U+FFEF'
					}
				};

			// Duplications and alternate locale names
			fonts["zh-TW"] = fonts["zh-HK"];

			// Generate a single font-face rule
			this.buildFont = function(inOptions) {
				if (!inOptions && !inOptions.name) {
					return "";
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
				var strOut = "",
					name = (bitDefault) ? "" : " " + strLang;

				if (fonts[strLang].regular) {
					// Build Regular
					strOut+= this.buildFont({
						name: "Moonstone LG Display" + name,
						localName: fonts[strLang].regular,
						unicodeRanges: fonts[strLang].unicodeRanges
					});

					// Build Bold
					strOut+= this.buildFont({
						name: "Moonstone LG Display" + name + " Bold",
						localName: fonts[strLang].bold || fonts[strLang].regular,
						unicodeRanges: fonts[strLang].unicodeRanges
					});

					// Build Light
					strOut+= this.buildFont({
						name: "Moonstone LG Display" + name + " Light",
						localName: fonts[strLang].light || fonts[strLang].regular,
						unicodeRanges: fonts[strLang].unicodeRanges
					});
				}
				return strOut;
			};

			if (!styleElem) {
				styleElem = document.createElement("style");
				styleElem.setAttribute("id", styleId);
				if (enyo.platform.ie === 8) {
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
			if (language === "ja") {
				fontDefinitionCss+= this.buildFontSet("ja", true);
			}
			else if (language === "ur") {
				fontDefinitionCss+= this.buildFontSet("ur", true);
			}
			else if (language === "zh" && region === "HK") {
				fontDefinitionCss+= this.buildFontSet("zh-HK", true);
			}
			else if (language === "zh" && region === "TW") {
				fontDefinitionCss+= this.buildFontSet("zh-TW", true);
			}

			// ENYO-3944: IE8 Sampler support - IE8 does not allow innerHTML modification of <style> elements
			if (enyo.platform.ie !== 8) {
				styleElem.innerHTML = fontDefinitionCss;
			}
		};

		enyo.updateLocale = function() {
			funEnyoUpdateLocale.apply(this, arguments);
			funLocaleSpecificFonts();
		};

		funLocaleSpecificFonts();
	}
})();
