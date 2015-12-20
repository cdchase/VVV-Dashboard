jQuery.fn.highlight = function (pat) {
	function innerHighlight(node, pat) {
		var skip = 0;
		if (node.nodeType == 3) {
			var pos = node.data.toUpperCase().indexOf(pat);
			if (pos >= 0) {
				var spannode = document.createElement('span');
				spannode.className = 'highlight';
				var middlebit = node.splitText(pos);
				var endbit = middlebit.splitText(pat.length);
				var middleclone = middlebit.cloneNode(true);
				spannode.appendChild(middleclone);
				middlebit.parentNode.replaceChild(spannode, middlebit);
				skip = 1;
			}
		}
		else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
			for (var i = 0; i < node.childNodes.length; ++i) {
				i += innerHighlight(node.childNodes[i], pat);
			}
		}
		return skip;
	}

	return this.each(function () {
		innerHighlight(this, pat.toUpperCase());
	});
};

jQuery.fn.removeHighlight = function () {
	function newNormalize(node) {
		for (var i = 0, children = node.childNodes, nodeCount = children.length; i < nodeCount; i++) {
			var child = children[i];
			if (child.nodeType == 1) {
				newNormalize(child);
				continue;
			}
			if (child.nodeType != 3) {
				continue;
			}
			var next = child.nextSibling;
			if (next == null || next.nodeType != 3) {
				continue;
			}
			var combined_text = child.nodeValue + next.nodeValue;
			new_node = node.ownerDocument.createTextNode(combined_text);
			node.insertBefore(new_node, child);
			node.removeChild(child);
			node.removeChild(next);
			i--;
			nodeCount--;
		}
	}

	return this.find("span.highlight").each(function () {
		var thisParent = this.parentNode;
		thisParent.replaceChild(this.firstChild, this);
		newNormalize(thisParent);
	}).end();
};

$.fn.scrollViewUp = function () {
	return this.each(function () {
		$('.sites').animate({
			scrollTop: $(this).offset().top
		}, 1000);
	});
};

$.fn.scrollViewDown = function () {
	var sites_list = $('.sites');

	var scrollBottom = $(sites_list).height() - $(sites_list).height() - $(sites_list).scrollTop();
	return this.each(function () {
		$('.sites').animate({
			scrollTop: scrollBottom
		}, 1000);
	});
};

$(function () {
	$('#text-search').bind('keyup change', function (ev) {
		// pull in the new value
		var searchTerm = $(this).val(),
			site_list = $('.sites .host');

		// remove any old highlighted terms
		$(site_list).removeHighlight();
		$('tr').removeClass('highlight');

		// disable highlighting if empty
		if (searchTerm) {
			// highlight the new term
			$(site_list).highlight(searchTerm);
		}

		// Highlight the table row
		if ($('.sites td span.highlight').length) {

			$('.sites td span.highlight').closest('tr').addClass('highlight');
		}

		if ($('.sites table tr').not('.highlight')) {
			$('.sites tr').addClass('hide');
		}

		$('.sites tr.highlight').removeClass('hide');

		if ($('#text-search').val() == '') {
			$('.sites tr').removeClass('hide');
		}

	});

	$('.create-plugin .add-post-type').on('click', function(){
		var slug = $(this).parent().find('input.plugin-slug').val();
		//console.log(slug);
		
		$(this).after('<p>' +
			'<label>Post Type Slug</label> <input class="post-type" type="text" placeholder="post_type" name="post_types[' + slug + '][]" value="" />' +
			'<span class="add-taxonomy btn btn-default btn-xs">Add Taxonomy</span>' +
			'</p>');
		return false;
	});

	$('.create-plugin').on('click', '.add-taxonomy', function(e){

		var slug = $(this).parent().find('input.post-type').val();
		console.log('Clicked');

		$(this).after('<p class="taxonomy"><label>Taxonomy Slug</label> <input type="text" placeholder="taxonomy" name="taxonomies[' + slug + '][]" value="" /></p>');
		return false;
	});
	// <p><label>Taxonomy Slug</label> <input type="text" placeholder="taxonomy" name="taxonomies[]" value="" /></p>

});

$(function () {

	if (Cookies.get('vvv_dash_sidebar') == 'hidden') {
		$("#wrapper").addClass('toggled');
	}

	$('#menu-toggle').click(function (e) {
		e.preventDefault();

		var wrapper = $('#wrapper');

		wrapper.toggleClass('toggled');

		if (wrapper.hasClass('toggled')) {
			Cookies.set('vvv_dash_sidebar', 'hidden', {expires: 7});
		} else {
			Cookies.remove('vvv_dash_sidebar');
		}
	});

});

$(function () {
	$('[data-toggle="tooltip"]').tooltip()
});
