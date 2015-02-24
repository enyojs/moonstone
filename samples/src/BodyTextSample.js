var
	kind = require('enyo/kind');

var
	FittableRows = require('layout/FittableRows');

var
	BodyText = require('moonstone/BodyText'),
	Divider = require('moonstone/Divider')
	Scroller = require('moonstone/Scroller');

module.exports = kind({
	name: 'moon.sample.BodyLargeTextSample',
	kind: FittableRows,
	classes: 'moon enyo-unselectable enyo-fit',
	components: [
		{kind: Scroller, fit: true, components: [
			{kind: Divider, content: 'Options'},
			{kind: ToggleButton, small: true, content: 'Large Body Text', ontap: 'largeTapped'},

			{kind: Divider, content: 'BodyText', style: 'margin-top: 1rem'},
			{kind: BodyText, content: 'Pixar genius reigns in this funny romantic comedy, which stars a robot who says absolutely nothing for a full 25 minutes yet somehow completely transfixes and endears himself to the audience within the first few minutes of the film. As the last robot left on earth, Wall-E (voiced by Ben Burtt) is one small robot--with a big, big heart--who holds the future of earth and mankind squarely in the palm of his metal hand. He\'s outlasted all the \'Waste Allocation Load Lifter Earth-Class\' robots that were assigned some 700 years ago to clean up the environmental mess that man made of earth while man vacationed aboard the <a href=\'\'>luxury spaceship Axiom</a>.'},
			{kind: BodyText, content: 'Pixar genius reigns in this funny romantic comedy, which stars a robot who says absolutely nothing for a full 25 minutes yet somehow completely transfixes and endears himself to the audience within the first few minutes of the film. As the last robot left on earth, Wall-E (voiced by Ben Burtt) is one small robot--with a big, big heart--who holds the future of earth and mankind squarely in the palm of his metal hand. He\'s outlasted all the \'Waste Allocation Load Lifter Earth-Class\' robots that were assigned some 700 years ago to clean up the environmental mess that man made of earth while man vacationed aboard the luxury spaceship Axiom.'},
			{kind: BodyText, centered: true, content: 'Pixar genius reigns in this funny romantic comedy, which stars a robot who says absolutely nothing for a full 25 minutes yet somehow completely transfixes and endears himself to the audience within the first few minutes of the film. As the last robot left on earth, Wall-E (voiced by Ben Burtt) is one small robot--with a big, big heart--who holds the future of earth and mankind squarely in the palm of his metal hand. He\'s outlasted all the \'Waste Allocation Load Lifter Earth-Class\' robots that were assigned some 700 years ago to clean up the environmental mess that man made of earth while man vacationed aboard the luxury spaceship Axiom.'},
			{kind: BodyText, content: 'גאון פיקסאר שולט בקומדיה הרומנטית המצחיק הזה, שמככב רובוט שאומר דבר וחצי דבר לעשרים וחמש דקות מלאים עדיין מתחברת איכשהו לחלוטין ומרתק את עצמו לקהל בכמה מסרטי דקות הראשונות. כמו הרובוט האחרון שנותר על פני כדור הארץ, וול-E (קולו של בן בארט) היא רובוט קטן אחד - עם לב גדול, גדול - מי מחזיק את עתידו של כדור הארץ והאנושות ישר בכף יד המתכת שלו. הוא שרד את כל \'טען ההקצאה פסולת מרים כדור הארץ הכיתה\' הרובוטים שחולקו לפני כשבע מאה שנים כדי לנקות את הבלגן הסביבתי שאדם עשוי מאדמה ואילו אדם נפש על סיפונה של חללית אקסיומת יוקרה.'},
			{kind: BodyText, content: 'بيكسار عبقرية يسود في هذه الكوميديا ​​الرومانسية مضحك، التي النجوم الروبوت الذي يقول شيئا على الإطلاق للحصول على كامل خمسة وعشرين دقيقة بعد تولي بطريقة أو بأخرى تماما ويسحر نفسه للجمهور في غضون الدقائق القليلة الأولى من الفيلم. عندما خرج الروبوت الماضي على وجه الأرض، الحائط-E (التي عبر عنها بن بيرت) هو روبوت صغير واحد - مع كبير، القلب الكبير - الذي يخبئه المستقبل من الأرض والجنس البشري بشكل مباشر في كف يده المعدنية. انه تغلب جميع \'تحميل النفايات تخصيص كهربائية الدرجة الأرض الروبوتات التي تم تعيينها قبل بعض سبعمائة سنوات لتنظيف الفوضى البيئية التي من صنع الإنسان من الأرض في حين اجازتها رجل على متن سفينة الفضاء اكسيوم الفاخرة.'}
		]}
	],
	largeTapped: function (sender, event) {
		var enabled = sender.value;
		this.$.scroller.getClientControls().forEach(function (control) {
			if (control.kind === BodyText) {
				control.addRemoveClass('moon-body-large-text', enabled);
			}
		});
	}
});