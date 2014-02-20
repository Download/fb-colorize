(function fb_colorize(){
	if (window['console']) console.log('fb-colorize: Starting...');
	
	if (window['console']) console.log('fb-colorize: Activating colorize slider...');
	$('#input-fbc-slider').slider().on('slide', function slide(evt) {colorize(this.value);});
	if (window['console']) console.log('fb-colorize: Activated colorize slider.');
	
	if (window['console']) console.log('fb-colorize: Activating colorize presets...');
	$('.preset').on('click', function preset() {colorize($(this).find('i')[0].innerHTML);});
	if (window['console']) console.log('fb-colorize: Activated colorize presets.');
	
	if (window['console']) console.log('fb-colorize: Activating colorize filter...');
	$('#colorize').on('submit', function filter(evt) {colorize(); return false;});
	if (window['console']) console.log('fb-colorize: Activated colorize filter.');
	
	if (window['console']) console.log('fb-colorize: Activating preview editor...');
	$('#preview').on('submit', preview);
	if (window['console']) console.log('fb-colorize: Activated preview editor.');
	
	if (window['console']) console.info('fb-colorize: Started.');
	
	function colorize(radix) {
		if (radix) {
			var code = $('#code-fbc-filter')[0];
			code.value = '<svg height="0" width="0">\n' +
					'  <filter id="fb-filter">\n' +
					'    <feColorMatrix type="hueRotate" values="' + radix + '"/>\n' +
					'  </filter>\n' +
					'</svg>';
			$('#input-fbc-slider').slider('setValue', radix);
			$('#input-fbc-slider')[0].value = radix;
		}
		update('#code-fbc-filter', '#container-fbc-filter', 'HTML');
		update('#code-fbc-filter', '#paste-fbc-filter', 'TEXT');
	}
	
	function preview(evt){
		if (window['console']) console.info('fb-colorize: Updating preview button...');
		if (window['FB']) {
			delete window.FB;
			var old = document.getElementById('facebook-jssdk');
			old.parentNode.removeChild(old);
		}
		update('#code-fb-button', '#container-fb-button', 'HTML');
		update('#code-fb-sdk', '#container-fb-sdk', 'HTML');
		evt.preventDefault();
	}
	
	function update(src, dst, type) {
		if (window['console']) console.log('fb-colorize: Updating ' + dst + '...');
		var source = $(src)[0];
		var dest = $(dst)[0];
		if (dest) {
			var idx, text, data = get(source, "TEXT");
			if (type == "TEXT") text = get(dest, "TEXT");
			if (text && ((idx = text.indexOf('<style')) != -1))
				data = data + '\n' + text.substring(idx);
			
			set(dest, type, data);

		}
	}
	
	function set(elem, type, value) {
		elem[acc(elem, type)] = value;
		if (type == "HTML") {
			for (var i=0, e; e=elem.children[i]; i++) {
				if (e.tagName && e.tagName.toLowerCase() == 'script')
					execScript(e);
			}
		}
	}
	
	function get(elem, type) {
		return elem[acc(elem, type)];
	}
	
	function acc(elem, type) {
		return elem.nodeName.toLowerCase() == 'pre' ? 
			"textContent" : (type == 'HTML' ? "innerHTML" : "value");
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