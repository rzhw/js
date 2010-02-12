/**
 * glyr 0.4.9
 * Copyright (c) 2009-2010 a2h
 * http://github.com/a2h/js
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var glyrCounter = 0; // to track which gallery
var glyrTimers = {}; // to track the gallery update timers
var glyrBaseStyles = {}; // to track which prefixes have the base styles

(function($) {	
	$.fn.glyr = function(options) {
		if (options.todo != 'update') // creating the gallery
		{
			// tracking
			var curimg = 0;
			
			// default settings
			var settings = $.extend({
				prefix: '',
				images: [],
				statusPosition: 'after', // either 'hide', 'after', 'before', 'bottom' or 'top'
				showTabs: true,
				showCaption: true,
				baseStyle: true,
				allowClick: true,
				speed: 500,
				delay: 3000
			}, options);
			
			var csssource = options.css;
			
			// errors to check for
			var errors = [];
			if (!settings.images.length)
			{
				errors.push('<code>options.images</code> is either not an array or is empty');
			}
			if (options.prefix == 'glyr-prefix')
			{
				errors.push('<code>options.prefix</code> cannot be set to <code>\'glyr-prefix\'</code>');
			}
			
			// default styling
			if (settings.baseStyle)
			{
				if (!glyrBaseStyles[settings.prefix])
				{
					glyrBaseStyles[settings.prefix] = true;
					
					var defaultcss = [
						{
							selector: ".glyr",
							css: {
								'background': '#808080',
								'color': '#fff',
								'width': '640px',
								'height': '480px',
								'padding': '6px'
							}
						},
						{
							selector: "." + settings.prefix + "tabs",
							css: {
								'float': 'left'
							}
						},
						{
							selector: "." + settings.prefix + "tab",
							css: {
								'float': 'left',
								'width': '48px',
								'height': '16px'
							}
						},
						{
							selector: "." + settings.prefix + "tab-on",
							css: {
								'background': '#74A3E0'
							}
						},
						{
							selector: "." + settings.prefix + "tab-off",
							css: {
								'background': '#C5D7F7'
							}
						},
						{
							selector: "." + settings.prefix + "caption",
							css: {
								'float': 'right',
								'height': '16px'
							}
						}
					];
					
					var defaultcsshtml = '<style type="text/css">';
					
					$.each(defaultcss, function(i, v) {
						defaultcsshtml += v.selector + '{';
						$.each(v.css, function(j, w) {
							defaultcsshtml += j + ':' + w + ';';
						});
						defaultcsshtml += '}';
					});
					
					defaultcsshtml += '</style>';
					
					$("head").prepend(defaultcsshtml);
				}
			}
			
			// create the container and give it its id
			var glyr = $(this).addClass('glyr').attr('data-id', glyrCounter);
			glyrCounter++;
			
			// make the container height auto to let the status area fit in
			var glyrImages = $('<div class="' + settings.prefix + 'images"></div>').css('overflow', 'hidden').appendTo(glyr);
			var glyrWidth = $(glyrImages).css('width');
			var glyrHeight = $(glyrImages).css('height');
			
			$(glyr).css({
				'position': 'relative',
				'width': glyrWidth,
				'height': 'auto'
			});
			
			// got errors?
			if (!errors.length)
			{				
				// the status area
				var glyrStatus = $('<div class="' + settings.prefix + 'status">'
					+ '<div class="' + settings.prefix + 'tabs"></div>'
					+ '<div class="' + settings.prefix + 'caption" style="float:right;"></div>'
					+ '<div style="clear:both;"></div></div>').appendTo(glyr);
				
				// margin to status
				if (settings.statusPosition == 'before')
				{
					$(glyrStatus).css('margin-bottom', $(glyr).css('padding-top'));
				}
				if (settings.statusPosition == 'after')
				{
					$(glyrStatus).css('margin-top', $(glyr).css('padding-bottom'));
				}
				if (settings.statusPosition == 'top')
				{
					$(glyrStatus).css({
					
						'position': 'absolute',
						'top': $(glyr).css('padding-top').replace('px','')
					});
				}
				if (settings.statusPosition == 'bottom')
				{
					$(glyrStatus).css({
						'position': 'absolute',
						'bottom': $(glyrStatus).height()
					});
				}
				if (settings.statusPosition == 'top' || settings.statusPosition == 'bottom')
				{
					$(glyrStatus).css({
						'width': $(glyrImages).width()
								- $(glyrStatus).css('margin-left').replace('px','')
								- $(glyrStatus).css('margin-right').replace('px','')
								- $(glyrStatus).css('padding-left').replace('px','')
								- $(glyrStatus).css('padding-right').replace('px','')
					});
				}
				
				// variables to carry on
				$('<div class="' + settings.prefix + 'current">0</div>').appendTo(glyr).hide();
				$('<div class="' + settings.prefix + 'speed">' + settings.speed + '</div>').appendTo(glyr).hide();
				$('<div class="' + settings.prefix + 'delay">' + settings.delay + '</div>').appendTo(glyr).hide();
				$('<div class="glyr-prefix">' + settings.prefix + '</div>').appendTo(glyr).hide();
				
				// extra variables for extra stuff
				var glyrTabs = $(glyr).find("." + settings.prefix + "tabs");
				var glyrCaption = $(glyr).find("." + settings.prefix + "caption");
				
				// resize the image container
				$(glyrImages).css({
					'position': 'relative',
					'width': glyrWidth,
					'height': glyrHeight
				});
				
				// resize the bottom containers				
				var imgcount = settings.images.length;
				for (i = 0; i < imgcount; i++)
				{
					// create all the tabs
					var temptab = $('<div>').appendTo(glyrTabs).addClass(
						(settings.prefix + 'tab')
						+ ' ' + (settings.prefix + 'tab-' + i)
						+ ' ' + (i == 0 ? settings.prefix + 'tab-on' : settings.prefix + 'tab-off')
					).attr(
						'data-id', i
					).css({
						'font-size': 0,
						'margin-right': $(glyr).css('padding-bottom') // allow this to be customised?
					});
					
					if (settings.allowClick)
					{
						$(temptab).css(
							'cursor', 'pointer'
						).click(function() {
							var tochange = $(this).closest(".glyr");
							$(tochange).glyr({
								todo: 'update',
								to: $(this).attr('data-id')
							});
						});
					}
					
					temptab = null;
					
					// create all the images
					$('<img>').appendTo(glyrImages).attr(
						settings.images[i]
					).addClass(
						settings.prefix + 'image'
						+ ' ' + settings.prefix + 'image-' + i
					).css({
						'position': 'absolute',
						'display': i == 0 ? 'block' : 'none',
						'margin-top': 0,
						'width': glyrWidth,
						'height': glyrHeight
					});
					
					if (settings.images[i].alt)
					{
						$(glyr).find("." + settings.prefix + "image-"+i).attr('alt', settings.images[i].alt);
						if (i == 0)
						{
							$(glyrCaption).html(settings.images[i].alt);
						}
					}
				}
				
				// what if we don't want tabs or the caption?
				if (settings.statusPosition == 'hide' || (!settings.showTabs && !settings.showCaption))
				{
					$(glyr).find("." + settings.prefix + "bottom").hide();
				}
				if (!settings.showTabs && settings.showCaption)
				{
					$(glyrTabs).hide();
				}
				if (!settings.showCaption && settings.showTabs)
				{
					$(glyrCaption).hide();
				}
				
				// update the gallery!
				if (settings.images.length > 1)
				{
					setTimeout(function() {
						$(glyr).glyr({
							todo: 'update',
							to: 1
						});
					}, settings.delay);
				}
			}
			else
			{
				var errorsstr = '';
				$.each(errors, function(i,v) {
					errorsstr += '<li>' + v + '</li>';
				});
				$(glyr).html('<strong>Oops, glyr encountered errors! Fix them and you should be good to go.</strong><ul>' + errorsstr + '</ul>');
			}
		}
		else // updating the gallery
		{
			// some variables
			var id = $(this).attr('data-id'),
				prefix = $(this).find(".glyr-prefix").text(),
				speed = parseInt($(this).find("." + prefix + "speed").text()),
				cur = parseInt($(this).find("." + prefix + "current").text()),
				delay = parseInt($(this).find("." + prefix + "delay").text()),
				next = options.to,
				nextnext = next == $(this).find("." + prefix + "image").length - 1 ? 0 : next + 1;
			
			// remove highlight from original tab
			$(this).find("." + prefix + "tab-"+cur).removeClass(prefix + "tab-on");
			$(this).find("." + prefix + "tab-"+cur).addClass(prefix + "tab-off");
			
			// hide original image
			$(this).find("." + prefix + "image-"+cur).fadeOut(speed); // CHANGE OVER ON/OFF CLASSES
			
			// now show the next image
			$(this).find("." + prefix + "image-"+next).fadeIn(speed);
			
			// add highlight to tab
			$(this).find("." + prefix + "tab-"+next).removeClass(prefix + "tab-off");
			$(this).find("." + prefix + "tab-"+next).addClass(prefix + "tab-on");
			
			// change the caption
			$(this).find("." + prefix + "caption").html($(this).find("." + prefix + "image-"+next).attr('alt'));
			
			// update the current image counter
			$(this).find("." + prefix + "current").text(next);
			
			// timer
			var tochange = this;
			if (glyrTimers[id]) // reset the timer if it already exists
			{
				clearTimeout(glyrTimers[id]);
			}
			
			glyrTimers[id] = setTimeout(function() {
				$(tochange).glyr({
					todo: 'update',
					to: nextnext
				});
			}, delay);
		}
	}
})(jQuery);