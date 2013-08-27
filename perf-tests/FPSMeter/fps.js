// Copyright (c) 2012 David Corvoysier http://www.kaizou.org
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// fpsmeter.js

(function(){

// We need to verify that CSS transitions are supported
var dummy = document.createElement('dummy');

var transEndEventNames = {
    'WebkitTransition' : 'webkitTransitionEnd',
    'MozTransition'    : 'transitionend',
    'OTransition'      : 'oTransitionEnd',
    'msTransition'     : 'MSTransitionEnd',
    'transition'       : 'transitionend'
};

var transitionPropertyName = null;
var transitionEventName = null;

for ( var prop in transEndEventNames ) {
    if(dummy.style[prop]!==undefined){
        transitionPropertyName = prop;
        transitionEventName = transEndEventNames[prop];
    }
}
if(!transitionPropertyName){
    return;
}

// requestAnimationFrame polyfill by Erik MÃ¶ller
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            // 16 ms is for a 60fps target
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var ref = null;
var values = null;
var storeInterval = null;

var self = window.FPSMeter = {
    run : function(duration) {
        if(document.readyState === 'complete') {
            var startIteration = function() {
                values = new Array();
                if (ref.style.left == "0px") {
                    ref.style.left = self.bodyWidth + "px";
                } else {
                    ref.style.left = "0px";
                }
                var storeValue = function () {
                    storeInterval = requestAnimationFrame(storeValue);
                    var l = GetFloatValueOfAttr(ref, 'left');
                    if(l){
                        values.push(l);
                    }
                };
                storeValue();
            };
            if(!ref) {
                self.curIterations = 0;
                self.storeTimeout = 0;
                self.bodyWidth = GetFloatValueOfAttr(document.body,'width');
                ref = document.createElement("div");
                ref.setAttribute("id", "AnimBenchRef");
                ref.style['position'] = 'absolute';
                ref.style['backgroundColor'] = 'transparent';
                ref.style['width'] = '1px';
                ref.style['height'] = '1px';
                ref.style['left'] = '0px';
                ref.style['bottom'] = '0px';
                ref.style[transitionPropertyName] = 'all 1s linear';
                var bodyRef = document.getElementsByTagName("body").item(0);
                bodyRef.appendChild(ref);
                ref.addEventListener(transitionEventName,
                    function (evt) {
                        self.curIterations++;
                        clearInterval(storeInterval);
                        self.storeTimeout = null;
                        var duplicates = 0;
                        var current = -1;
                        for (var i = 0; i < values.length; i++) {
                            var l = values[i];
                            if (l == current) {
                                duplicates++;
                            } else {
                                current = l;
                            }
                        }
                        var fps = values.length - duplicates;
                        if (!self.maxIterations || (self.curIterations < self.maxIterations)) {
                            startIteration();
                        }
                        if (storeInterval) {
                            var evt = document.createEvent("Event");
                            evt.initEvent("fps",true,true);
                            evt.fps = fps;
                            document.dispatchEvent(evt);
                        }
                    },
                    false);
            }
            self.maxIterations = duration?duration:null;
            self.curIterations = 0;
            setTimeout(
                function (evt) {
                    startIteration();
                },
                10);
        } else {
            setTimeout(
                function (evt) {
                    self.run(duration);
                },
                10);
        }
    },
    stop : function() {
        cancelAnimationFrame(storeInterval);
        storeInterval = null;
        self.maxIterations = 1;
    }
}

function GetFloatValueOfAttr (element,attr) {
    var floatValue = null;
    if (window.getComputedStyle) {
        var compStyle = window.getComputedStyle (element, null);
        try {
            var value = compStyle.getPropertyCSSValue (attr);
            var valueType = value.primitiveType;
            switch (valueType) {
              case CSSPrimitiveValue.CSS_NUMBER:
                  floatValue = value.getFloatValue (CSSPrimitiveValue.CSS_NUMBER);
                  break;
              case CSSPrimitiveValue.CSS_PERCENTAGE:
                  floatValue = value.getFloatValue (CSSPrimitiveValue.CSS_PERCENTAGE);
                  alert ("The value of the width property: " + floatValue + "%");
                  break;
              default:
                  if (CSSPrimitiveValue.CSS_EMS <= valueType && valueType <= CSSPrimitiveValue.CSS_DIMENSION) {
                      floatValue = value.getFloatValue (CSSPrimitiveValue.CSS_PX);
                  }
            }
        }
        catch (e) {
          // Opera doesn't support the getPropertyCSSValue method
          stringValue = compStyle[attr];
          floatValue = stringValue.substring(0, stringValue.length - 2);
        }
    }
    return floatValue;
}

})();