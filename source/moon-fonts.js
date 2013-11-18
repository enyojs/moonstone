(function() {
    var loc = new ilib.Locale();
    var language = loc.getLanguage();
    var style = document.createElement("style");
    if (language === 'ur') {
        document.head.appendChild(style);
        style.innerText =
            '@font-face { ' +
            '        font-family: "LG Display;' +
            '        src: local("LG Display_Urdu");' +
            '        font-weight: normal;' +
            '        unicode-range: U+0600-U+06FF;' +
            '        unicode-range: U+FE70-U+FEFE;' +
            '        unicode-range: U+FB50-U+FDFF;' +
            '}';
    }
    else if (language === 'ja') {
        document.head.appendChild(style);
        style.innerText =
            '@font-face { ' +
            '        font-family: "LG Display";' +
            '        src: local("LG Display_JP");' +
            '        font-weight: normal;' +
            '        unicode-range: U+0000-U+00FF;' +
            '        unicode-range: U+2E80-U+2EFF;' +
            '        unicode-range: U+2F00-U+2FDF;' +
            '        unicode-range: U+3000-U+303F;' +
            '        unicode-range: U+3040-U+309F;' +
            '        unicode-range: U+30A0-U+30FF;' +
            '        unicode-range: U+3200-U+33FF;' +
            '        unicode-range: U+3400-U+4DBF;' +
            '        unicode-range: U+4E00-U+9FFF;' +
            '        unicode-range: U+E000-U+FAFF;' +
            '        unicode-range: U+FF00-U+FFEF;' +
            '}';
    }
})();
