COMPONENT('loading', function() {
	var self = this;
	var pointer;

	self.readonly();
	self.singleton();

	self.make = function() {
		self.aclass('ui-loading');
		self.append('<div></div>');
	};

	self.show = function() {
		clearTimeout(pointer);
		self.rclass('hidden');
		return self;
	};

	self.hide = function(timeout) {
		clearTimeout(pointer);
		pointer = setTimeout(function() {
			self.aclass('hidden');
		}, timeout || 1);
		return self;
	};
});