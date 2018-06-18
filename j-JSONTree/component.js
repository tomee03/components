COMPONENT('jsontree', function(self, config){

	var item = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABoSURBVEiJ7dSxDYAwDETRO4vBsk22QBFTJNuExXKp6CgMKBKFf23rdUcAhLNaayG5Ayg558P7Z97DLwUSSCA/QbY3TyRTa809R48QM4MkSEoA0hJkjAGSINklnUuQK0k9VjiQQAK5bwLU3xq8lh5dEwAAAABJRU5ErkJggg==';
	var itemlast = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABnSURBVEiJ7ZSxDYAwDAQvyHvBNhkjyhgeJ5swSAqaFKmCMQ1CPum7f11jOQEJI6pagALUnHO17jZr8Q0hCUlIPiIR5+5Q1WVhfjteyT6ywifpvTcRacA5YiLx4At7+c91hSQkIbnnAlzgEDui0adaAAAAAElFTkSuQmCC';
	var spacer = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAA2SURBVEiJ7c1BDQBACMTAcmaRQZCBWyyQ3Ld972YCCI7NTAEFdGb29feuw59ERERERERERERYWZ4FM3XRVJ0AAAAASUVORK5CYII=';
	var spacerempty = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAZSURBVEiJ7cEBDQAAAMKg909tDwcUAAA3BgndAAF85o4iAAAAAElFTkSuQmCC';
	var $tree, $textarea;

	self.onClick = NOOP;

	self.configure = function(key, value, init, prev) {
		switch (key) {
			case 'click':
				self.onClick = window[value];
				break;
		}
	};

	self.make = function(){
		var title = self.element.html();
		self.empty();
		self.aclass('jsontree');
		self.element.append('<div class="jsontree-label"><i class="fa fa-code-fork fa-rotate-90"></i>&nbsp;{0}<button class="button button-small">Clear</button></div>'.format(title || 'JSON tree'));
		self.element.append('<div class="jsontree-textarea"><div data-jc="textarea" data-jc-noscope="true" data-jc-path="{0}" data-jc-config="height:400"></div></div>'.format(self.path));
		self.element.append('<div class="jsontree-tree hidden"></div>');
		$textarea = self.element.find('.jsontree-textarea');
		$tree = self.element.find('.jsontree-tree');
		
		self.event('click', 'span', function(){
			var path = $(this).parent().attrd('path');
			self.onClick(path);
		});
		
		self.event('click', 'button', function(){
			self.set('');
		});
	};

	self.setter = function(value) {

		if (!value || typeof value !== 'string') {
			$tree.tclass('hidden', true);
			$textarea.tclass('hidden', false);
			return $tree.html('<div style="color:grey;width:100%;text-align:center;">INCORRECT OR NO DATA</div>');
		}

		var parsed = PARSE(value);
		if (!parsed) {
			$tree.tclass('hidden', true);
			$textarea.tclass('hidden', false);
			return $tree.html('<div style="color:grey;width:100%;text-align:center;">PARSING ERROR</div>');
		}

		$textarea.tclass('hidden', true);
		$tree.html(self.tree(parsed, ''));
		$tree.tclass('hidden', false);
	};

	self.tree = function(obj, path, spacers) {
		var temp = '';
		var keys = Object.keys(obj);
		var kl = keys.length;
		var sp = [].concat(spacers || []);
		var isArr = obj instanceof Array; 		
		for (var i = 0; i < kl; i++) {
			var isNum = !isNaN(keys[i]) && !isArr;
			var p = path + (isArr || isNum ? '[{0}'.format(isNum ? '\'' : '') : path === '' ? path : '.') + keys[i] + (isArr || isNum ? '{0}]'.format(isNum ? '\'' : '') : '');
			var item = obj[keys[i]];
			var last = i === kl - 1;
			var s = spacers ? sp.concat([last]) : [];
			temp += self.treeitem(p, last, keys[i], s);
			if (typeof item === 'object')
				temp += self.tree(item, p, s);
		}
		return temp;
	};

	self.treeitem = function(path, last, key, s) {
		var img = s.length ? '<img src="{0}"/>'.format(last ? itemlast : item) : '';
		return '<div class="treeitem">' + self.spacer(s) + '<div data-path="{0}" title="{0}">{1}<span>'.format(path, img) + key + '<span></div></div>\n'
	};

	self.spacer = function(s) {
		var d = '';
		for (var i = 0; i < s.length - 1; i++)
			d += '<div class="spacer"><img src="{0}"/></div>'.format(s[i] ? spacerempty : spacer);
		return d;
	};
});