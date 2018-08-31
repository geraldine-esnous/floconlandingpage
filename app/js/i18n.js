$(document).ready(function () {
	jQuery(function ($) {
		$.i18n().load({
			'en': './js/i18n/en.json',
			'fr': './js/i18n/fr.json'
		}).done(function () {
			console.log('[I18N] Done !');
			$('body').i18n();

			$('#menu #switch-locale').on('click', 'a', function (e) {
				e.preventDefault();
				$.i18n().locale = $(this).data('locale');
				$('body').i18n();
			});
		});
	});
});