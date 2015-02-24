var
	kind = require('enyo/kind');

var
	Divider = require('moonstone/Divider'),
	Icon = require('moonstone/Icon'),
	Scroller = require('moonstone/Scroller'),
	Spinner = require('moonstone/Spinner');

module.exports = kind({
	name: 'moon.sample.SpinnerSample',
	classes: 'moon enyo-unselectable enyo-fit',
	kind: Scroller,
	components: [
		{kind: Divider, content: 'Spinner'},
		{kind: Spinner},
		{kind: Divider, content: 'Spinner with Content'},
		{kind: Spinner, content: 'Loading...'},
		{kind: Divider, content: 'Spinner Centered in its Container'},
		{style: 'text-align: center', components: [
			{kind: Spinner, content: 'Loading...'}
		]},
		{kind: Divider, content: 'Spinner Centered Horizontally and Vertically in its Container'},
		{classes: 'absolute-container', components: [
			{kind: Spinner, content: 'Loading...', center: true}
		]},
		{classes: 'moon-1v'},
		{kind: Divider, content: 'Spinner Only Centered Horizontally in its Container'},
		{classes: 'absolute-container', components: [
			{kind: Spinner, content: 'Loading...', center: true, middle: false}
		]},
		{classes: 'moon-1v'},
		{kind: Divider, content: 'Spinner with Looooong Content'},
		{kind: Spinner, content: 'Loading so much content... This might take some arbitrary amount of time. Could be long, could be short. Who knows?'},
		{kind: Divider, content: 'Spinner with Components Inside'},
		{kind: Spinner, components: [
			{kind: Icon, icon: 'fullscreen'},
			{content: 'Fullscreen mode is loading'},
			{kind: Icon, icon: 'exitfullscreen'}
		]}
	]
});
