// Override the default holdpulse config to account for greater delays between keydown and keyup
// events in Moonstone with certain input devices.
if (enyo && enyo.gesture && enyo.gesture.drag) {
	enyo.gesture.drag.configureHoldPulse({
		frequency: 200,
		events: [{name: 'hold', time: 400}],
		resume: false,
		moveTolerance: 16,
		endHold: 'onMove'
	});
}