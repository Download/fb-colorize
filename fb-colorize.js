(function fb_colorize(){
	if (window['console']) console.info('fb-colorize: Starting...');
	function byId(id) {return document.getElementById(id);}
	var formPreview = byId('preview');
	formPreview.addEventListener('submit', preview, false);
	var formColorize = byId('colorize');
	formColorize.addEventListener('submit', apply, false);
	$('.preset').on('click', function() {
		if (window['console']) console.info('fb-colorize: Applying preset...');
		var radix = $(this).find('i')[0].innerText;
		colorize(radix);
	});
	$('#input-fbc-slider').slider().on('slide', slide);
	if (window['console']) console.info('fb-colorize: Started.');
	
	function preview(evt){
		if (window['console']) console.info('fb-colorize: Updating.');
		if (window['FB']) {
			delete window.FB;
			var old = document.getElementById('facebook-jssdk');
			old.parentNode.removeChild(old);
		}
		update('code-fb-button', 'container-fb-button', 'HTML');
		update('code-fb-sdk', 'container-fb-sdk', 'HTML');
		evt.preventDefault();
	}
	
	function slide(evt) {
		if (window['console']) console.info('fb-colorize: Sliding...');
		var slider = byId('input-fbc-slider');
		colorize(slider.value);
	}
	
	function apply(evt) {
		if (evt && window['console']) console.info('fb-colorize: Applying colorize filter.');
		colorize();
		if (evt) evt.preventDefault();
	}
	
	function colorize(radix) {
		if (radix) {
			var code = byId('code-fbc-filter');
			code.value = '<svg height="0" width="0">\n' +
					'\t<filter id="fb-filter">\n' +
					'\t\t<feColorMatrix type="hueRotate" values="' + radix + '"/>\n' +
					'\t</filter>\n' +
					'</svg>';
		}
		update('code-fbc-filter', 'container-fbc-filter', 'HTML');
		update('code-fbc-filter', 'paste-fbc-filter', 'Text');
	}
	
	function update(src, dst, type) {
		if (window['console']) console.info('updating ' + dst + '...');
		var source = byId(src);
		var dest = byId(dst);
		if (dest) {
			var idx, data = source.value || source['inner' + type], text = dest['inner' + type];
			if (text && ((idx = text.indexOf('<style')) != -1))
				data = data + '\n' + text.substring(idx);
			dest['inner' + type] = data;
			if (type == 'HTML') {
				for (var i=0, elem; elem=dest.children[i]; i++) {
					if (elem.tagName && elem.tagName.toLowerCase() == 'script')
						execScript(elem);
				}
			}
		}
	}
	
	function execScript(elem) {
		var data = elem.text || elem.textContent || elem.innerHTML || "";
			head = document.getElementsByTagName("head")[0] || document.documentElement,
			script = document.createElement("script");

		try {
		  // doesn't work on ie...
		  script.appendChild(document.createTextNode(data));      
		} catch(e) {
		  // IE has funky script nodes
		  script.text = data;
		}

		head.insertBefore(script, head.firstChild);
		head.removeChild(script);
	};
})();