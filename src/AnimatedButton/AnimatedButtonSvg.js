require('moonstone');

var
	kind = require('enyo/kind'),
	EventEmitter = require('enyo/EventEmitter');

var
	SvgRoot = require('svg/Root'),
	SvgPath = require('svg/Path'),
	SvgAnimate = require('svg/Animate');

module.exports = kind({
	name: 'moon.AnimatedButtonSvg',
	kind: SvgRoot,
	mixins: [EventEmitter],
	viewBox: '0 0 100 100',
	classes: 'moon-button-animated-root',
	_focused: false,
	components: [
		// Path to be animated
		{name: 'path', kind: SvgPath, classes: 'moon-button-animated-path', components: [
			// Animation
			{name: 'animation', kind: SvgAnimate, fill: 'freeze', keyframeLibrary: {
				focus: [
					'M-10,60c0.6-3.3,2.3,0.7,0-10c-1.3-5.9-4-15.5,0-20c6.5-7.4,10,30,10,30v40h2c0,0-17,0.6-12-10 C-6.7,83-10.9,65-10,60z',
					'M40,60c-2.3-14.3-2.3-13.9-10-30C22.8,15,12.3-1.3-7,0c-9.8,0.7,7,60,7,60v40h20c0,0,1.9-1.4,10-10 C35,84.7,42,72.2,40,60z',
					'M70,60c-9.3-17.2-24.4-30.5-40-40C17.7,12.5,4.8,8.2-7,10c-9.7,1.5,7,50,7,50v40h60c0,0,3.7,0,10-10 C75.2,81.8,75.8,70.6,70,60z',
					'M90,60c-16.8-25.2-30.5-5.2-50-10C27.6,46.9,10,15.7-7,20c-9.5,2.4,7,40,7,40v40h100c0,0,1-2.8,0-10 C99,82.8,96.9,70.3,90,60z',
					'M80,20c-6.6,36.3-26.3,51-40,40C30,52,14.8,13.5-7,20c-9.4,2.8,7,40,7,40v40h100c0,0,1-82.8,0-90 C99,2.8,83.8-1.2,80,20z',
					'M60,20c-2.7,13.2-10.2,27-20,40c-4.8,6.3-12.7,10.3-20,10C10.2,69.6,0,60,0,60v40h100c0,0,2.6-83.2,0-90 C94.5-4.5,64.3-1.1,60,20z',
					'M50,30c-4.1,7.2-11.2,9-20,10C11.8,42,5.5,26.6,0,30c-8.3,5.2,0,30,0,30v40h100c0,0,1.7-63,0-70 C95,8.8,64.2,4.8,50,30z',
					'M50,0c-7.3-1-21-1-30,0C16.2,0.4,5.7-0.8,0,0c-10.4,1.5,0,10,0,10v90h100c0,0,0-90.8,0-100 C100-15.6,53.9,0.5,50,0z'
				],
				blur: [
					'M100,0c0,0-40-0.3-50,0C40.1,0.3,0,0,0,0v100h100V0z',
					'M100,0C80.5,13.6,71.1,21.2,50,20C33.5,19.1,22.9,14.9,0,0v100h100V0z',
					'M100,10C74.2,71.1,68.9,35.2,50,40C26.3,46,26,77,0,10v90h100V10z',
					'M100,70C86.3,87.1,68.6,93.5,50,90C26.9,85.6,7.8,92,0,70v30h100V70z',
					'M100,99c0,0-39.9-0.2-50,0c-9.8,0.2-50,0-50,0v1h100V99z'
				]
			}}
		]}
	],
	events: {
		onEnd: ''
	},
	bindings: [
		{from: 'pathStyle', to: '$.path.style'},
		{from: 'duration', to: '$.animation.dur'}
	],
	create: function () {
		this.inherited(arguments);
		this.$.animation.on('end', function() { this.doEnd({focused: this._focused}); }, this);
	},
	startFocus: function () {
		this.$.animation.checkout('focus');
		this._focused = true;
		this.$.animation.start();
	},
	startBlur: function () {
		this.$.animation.checkout('blur');
		this._focused = false;
		this.$.animation.start();
	}
});
