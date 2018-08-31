(function($, viewport) {
 
	/**
	*   FUNCTION
	**/
		// => Search all section and comment this
			function searchAndComment(hiddenClass) {
				$.each(hiddenClass, function (hKeys, hValues) {
					$('.section').each(function (keys, values) {
						if ($(values).hasClass(hValues) === true) {
							$(values).wrap(function () {
								return '<!-- {sm} ' + this.outerHTML + '-->';
							});
						}
					});
				});
			}
		// => Search all section and uncomment this
			function searchAndUncomment(visibleClass) {
				$.each(visibleClass, function (vKeus, vValues) {
					$('#fullpage').contents()
						.filter(function () {
							if (this.nodeType === 8) {
								if (this.data.includes("{sm}")) {
									return this.nodeType === 8;
								}
							}
						})
						.replaceWith(function () {
							this.data = this.data.replace("{sm} ", "");
							return this.data;
						})
				});
			}
		// => Section Manager
			function sectionManager() {
				if (viewport.is('xs')) {
					searchAndUncomment(['hidden-xs', 'visible-sm', 'visible-md', 'visible-lg']);
					searchAndComment(['hidden-xs', 'visible-sm', 'visible-md', 'visible-lg']);
				} else if (viewport.is('sm')) {
					searchAndUncomment(['hidden-sm', 'visible-xs', 'visible-md', 'visible-lg']);
					searchAndComment(['hidden-sm', 'visible-xs', 'visible-md', 'visible-lg']);
				} else if (viewport.is('md')) {
					searchAndUncomment(['hidden-md', 'visible-xs', 'visible-sm', 'visible-lg']);
					searchAndComment(['hidden-md', 'visible-xs', 'visible-sm', 'visible-lg']);
				} else if (viewport.is('lg')) {
					searchAndUncomment(['hidden-lg', 'visible-xs', 'visible-sm', 'visible-md']);
					searchAndComment(['hidden-lg', 'visible-xs', 'visible-sm', 'visible-md']);
				}
			}
 
/* Couple functions to defer YouTube videos loading */

			function labnolThumb(id) {
				var thumb = '<img src="https://img.youtube.com/vi/ID/maxresdefault.jpg">',
					play = '<div class="play"></div>';
				return thumb.replace("ID", id) + play;
			}

			function labnolIframe() {
				var iframe = document.createElement("iframe");
				var embed = "https://www.youtube.com/embed/ID?autoplay=1";
				iframe.setAttribute("src", embed.replace("ID", this.dataset.id));
				iframe.setAttribute("frameborder", "0");
				iframe.setAttribute("allowfullscreen", "1");
				this.parentNode.replaceChild(iframe, this);
			}

	$(document).ready(function () {
		/* Init anchors */         
			var anchorsArray = [];
			function initAnchor () {
				if (viewport.is('xs')) {
					anchorsArray = ['title', 'concept1', 'concept2', 'snacks', 'fabrication', 'equipe', 'croquez', 'presse', 'instagram', 'legal'];
				} else {
					anchorsArray = ['title', 'concept1', 'snacks', 'fabrication', 'equipe', 'croquez', 'presse', 'instagram'];
				}
			}
			initAnchor();
 
		/* Search all section and comment this with check viewport */
			$.when(fullPageInit(), sectionManager()).done(function () {
				console.log('[CORE] Finished.');
			});
		/* If window is resize, then search all section comment and uncomment */

		/* This code should work when the framework will fix the reBuild bug */
			// $(window).resize(
			// 	viewport.changed(function () {
			// 		$.when(
			// 		sectionManager(),
			// 		initAnchor()
			// 		).done(function () {
			// 			$.fn.fullpage.reBuild();
			// 		});
			// 	})
			// );

		/* This will refresh the page until the framework gets fixed */
			if (viewport.is('sm') || viewport.is('md') || viewport.is('lg')) {
				$(window).resize(
					viewport.changed(function () {
						if (viewport.is('xs')) {
							location.reload();
						}
					})
				);
			} else if (viewport.is('xs')) {
				$(window).resize(
					viewport.changed(function () {
						if (!(viewport.is('xs'))) {
							location.reload();
						}
					})
				);
			}
 
		/* Trigger */
			$('#legal-btn').on('click', function () {
				$.fn.fullpage.moveSectionDown();
			});
 
			// => Main nav (navigation bar)
				var onClickElement = [window, '#menu .navbar-collapse li a', '#menu .navbar-collapse h1 span'];
				function closeNav () {
					if ($('#menu .navbar-collapse').hasClass('in')) {
						$('#menu .navbar-toggle').click();
					}
				}
				onClickElement.forEach(function (values) {
					$(values).on('click', function () {
						closeNav();
					});
				});
				$('#menu .navbar-collapse').on('click', function (event) {
					event.stopPropagation();
				});
 
			// => Modal listener
				var modalArray = ['#ModalNews', '#ModalSnack', '#ModalSuperfood', '#ModalLegal'];
				modalArray.forEach(function (values) {
					$(values).on('shown.bs.modal', function () {
						$.fn.fullpage.setAllowScrolling(false);
					});
					$(values).on('hidden.bs.modal', function () {
						$.fn.fullpage.setAllowScrolling(true);
					});
				});
 
			// => Snack Nav
				$('#snackMenu .item').on('click', function () {
					// Remove active class
						$('#snackMenu .item.active').removeClass('active');
						$('#content .item.active').removeClass('active');
						$('#ModalSnack .item.active').removeClass('active');
						$('#bottom .item.active').removeClass('active');
						var color = $('#bottom').attr('class');
						$('#ModalSnack').removeClass(color);
						$('#bottom').removeClass(color);
						$('#ModalSnack .modal-content').removeClass(color);
						$('#ModalSnack .modal-body.active').removeClass('active');
					// Add active class
						$(this).addClass('active');
						var index = $('#snackMenu .item.active').index();
						$($('#content .item')[index]).addClass('active');
						$('#ModalSnack').addClass('color' + [index + 1]);
						$('#bottom').addClass('color' + [index + 1]);
						$($('#bottom .item')[index]).addClass('active');
						$('#ModalSnack .modal-content').addClass('color' + [index + 1]);
						$($('#ModalSnack .modal-body')[index]).addClass('active');
				});

			// => Hidden controlArrow (for every browser except Firefox)
				if (typeof InstallTrigger == 'undefined') {
					$('#section1 .hidden-xs .fp-controlArrow').css('opacity', '0');
				}

			// => Navbar active scroll
				$('nav.navbar ul.navbar-nav li').on('click', function () {
					console.log($(this));
					if ($(this).data('menuanchor') != "concept1" && $(this).data('menuanchor') != null) {
						$('#fullpage').off("mousewheel");
					}					
				});


/* FULLPAGE SETTINGS */
		var currentSlide = 0;
		var loaded = false;
		function fullPageInit() {
			$('#fullpage').fullpage({
				anchors: anchorsArray,
				menu: '#menu',
				scrollingSpeed: 1000,
				scrollOverflow: true,
				sectionSelector: '.section:visible',
				fixedElements: '#nav',
				css3: false,
				loopHorizontal: false,
				scrollBar: false,
				touchSensitivity: 5,
				afterRender: function () {
					setTimeout(function () {
						$("#loader").fadeOut('slow', function () {
							$("#fullpage").fadeIn('slow', function () {
								// console.log('Page ready');
								// Code to defer YouTube js loading
								var div, n,
								v = document.getElementsByClassName("youtube-player");
									for (n = 0; n < v.length; n++) {
									div = document.createElement("div");
									div.setAttribute("data-id", v[n].dataset.id);
									div.innerHTML = labnolThumb(v[n].dataset.id);
									div.onclick = labnolIframe;
									v[n].appendChild(div);
								}
							});
							$('#menu').animate({opacity: 1});
						});
					}, 1500);

				


				},
				afterLoad: function (anchorLink, index) {
					// Animation of the navigation background and navigation blocker
					// for specific cases
					var nav = $('#menu');
					var navBg = $('#navBg');
					if (anchorLink == 'instagram') {
						$.fn.fullpage.setAllowScrolling(false, 'down');
						$.fn.fullpage.setKeyboardScrolling(false, 'down');
					} else if (anchorLink != 'instagram') {
						$.fn.fullpage.setAllowScrolling(true, 'down');
						$.fn.fullpage.setKeyboardScrolling(true, 'down');
					}
					if (anchorLink != 'title') {
						if (navBg.hasClass('fadeOutUp')) {
							navBg.removeClass('fadeOutUp');
						}
						navBg.addClass('fadeInDown');
					} else if (anchorLink == 'title') {
						if (navBg.hasClass('fadeInDown')) {
							navBg.removeClass('fadeInDown');
						}
						navBg.addClass('fadeOutUp');
						if ($('.navbar-collapse').hasClass('in')) {
							$('.navbar-toggle').click();
						}
					}
					loaded = true;
					// ModalNews opener
					// Comment and uncomment to let the 
					setTimeout(function () {
						if (!viewport.is('xs') && (index == 1)) {
							$('#ModalNews').modal('show');
						}
					}, 4000);
				},
				afterSlideLoad: function (anchorLink, index, slideAnchor, slideIndex) {
					currentSlide = slideIndex;
					loaded = true;
 					// Concept package display handler
					if (slideIndex == 2) {
						$('.bioVegetalNaturelFrance').animate({opacity: 0});
						$('#package-content .package-left').animate({opacity: 0, bottom: -250});
						$('#package-content .package-right').animate({opacity: 0, bottom: -100});
					} else {
						$('.bioVegetalNaturelFrance').animate({opacity: 1});
						$('#package-content .package-left').animate({bottom: [-170, "easeOutBounce"], opacity: [1, "swing"]}, 600);
						$('#package-content .package-right').animate({bottom: [-26, "easeOutBounce"], opacity: [1, "swing"]}, 600);
					}
				},
				onLeave: function(index, nextIndex, direction) {
					if (viewport.is('sm') || viewport.is('md') || viewport.is('lg')) {
						loaded = false;
						if (nextIndex == 2) {
						// Tablets: blocks the section scroll for desktop concept1 and triggers the slide scrolls
							// if (typeof InstallTrigger == 'undefined') {
							// 	$.fn.fullpage.setAllowScrolling(false, 'all');
							// 	$('#fullpage').swipe({
							// 		swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
							// 			if (loaded) {
							// 				loaded = false;
							// 				if (direction == "up" || direction == "left") { // Scroll down
							// 					if (currentSlide === 2) { // If last slide
							// 						$.fn.fullpage.setAllowScrolling(true, 'down');
							// 						$.fn.fullpage.moveSectionDown();
							// 					} else {
							// 						$.fn.fullpage.moveSlideRight(); // *** doesn't do anything ***
							// 					}
							// 				} else if (direction == "down" || direction == "right") { // Scroll up
							// 					if (currentSlide === 0) { // Is first slide
							// 						$.fn.fullpage.setAllowScrolling(true, 'up');
							// 						$.fn.fullpage.moveSectionUp();
							// 					} else {
							// 						$.fn.fullpage.moveSlideLeft();
							// 					}
							// 				}
							// 			}
							// 		}
							// 	});
							// }
							// Desktop: blocks the section scroll for desktop concept1 and triggers the slide scrolls
							// $('#fullpage').on('mousewheel', function (e) {
							// 	if (loaded) {
							// 		loaded = false;
							// 		var delta = e.originalEvent.deltaY;
								   
							// 		if (delta>0){ // Scroll down                                   
							// 			if (currentSlide === 2) { // If last slide
							// 				$('#fullpage').off("mousewheel");
							// 				$.fn.fullpage.setAllowScrolling(true, 'all');
							// 			} else {
							// 				$.fn.fullpage.moveSlideRight();
							// 				e.preventDefault();
							// 				e.stopPropagation();
							// 			}
							// 		} else { // Scroll up
							// 			if (currentSlide === 0){ // If first slide
							// 				$('#fullpage').off("mousewheel");
							// 				$.fn.fullpage.setAllowScrolling(true, 'all');
							// 			} else {
							// 				$.fn.fullpage.moveSlideLeft();
							// 				e.preventDefault();
							// 				e.stopPropagation();
							// 			}
							// 		}
							// 	} else { // Slide still loading, don't scroll
							// 		e.preventDefault();
							// 		e.stopPropagation();
							// 	}
							// });
						} else {
							$.fn.fullpage.setAllowScrolling(true, 'all');
							$('#fullpage').swipe("destroy");
						}
					}
				}
			});
		}
	});
})(jQuery, ResponsiveBootstrapToolkit);