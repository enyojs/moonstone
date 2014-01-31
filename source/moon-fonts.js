(function() {
	if (window.ilib) {

		var funEnyoLocaleChanged = enyo.updateLocale,
			funLocaleSpecificFonts = null;

		funLocaleSpecificFonts = function() {
			var loc = new ilib.Locale(),
				language = loc.getLanguage(),
				region = loc.getRegion(),
				styleId = "enyo-locale-font-override",
				styleElem = document.getElementById(styleId),
				fontDefinitionCss = "",
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
				document.head.appendChild(styleElem);
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

			styleElem.innerHTML = fontDefinitionCss;
		};

		enyo.updateLocale = function() {
			funEnyoLocaleChanged.apply(this,arguments);
			funLocaleSpecificFonts();
		};

		funLocaleSpecificFonts();
	}
})();
