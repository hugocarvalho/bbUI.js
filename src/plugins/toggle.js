bb.toggle = {

	apply: function(elements) {
		if (bb.device.isBB10) {
			var i, 
				res,
				table,
				tr,
				td,
				color = bb.options.bb10ControlsDark ? 'dark' : 'light',
				res = (bb.device.isPlayBook) ? 'lowres' : 'hires';

			for (i = 0; i < elements.length; i++) {
				outerElement = elements[i];
				outerElement.checked = false;
				outerElement.buffer = (bb.device.isPlayBook) ? 35 : 70;
				outerElement.isActivated = false;
				outerElement.initialXPos = 0;
				outerElement.currentXPos = 0;
				outerElement.transientXPos = 0;
				outerElement.movedWithSlider = false;
				outerElement.startValue = false;
				// Set our styling and create the inner divs
				outerElement.className = 'bb-bb10-toggle-'+res;
				outerElement.outer = document.createElement('div');
				outerElement.outer.setAttribute('class','outer bb-bb10-toggle-outer-' + color);
				outerElement.appendChild(outerElement.outer);
				outerElement.fill = document.createElement('div');
				outerElement.fill.className = 'fill';
				outerElement.fill.style.background = outerElement.fill.dormant;
				outerElement.outer.appendChild(outerElement.fill);
				// Our inner area that will contain the text
				outerElement.inner = document.createElement('div');
				outerElement.inner.className = 'inner';
				outerElement.inner.outerElement = outerElement;
				outerElement.fill.appendChild(outerElement.inner);
				// Create our table holder for the captions
				table = document.createElement('table');
				table.className = 'table';
				tr = document.createElement('tr');
				table.appendChild(tr);
				outerElement.inner.appendChild(table);
				// The yes option
				td = document.createElement('td');
				td.className = 'left';
				tr.appendChild(td);
				outerElement.yes = document.createElement('div');
				outerElement.yes.className = 'yes';
				outerElement.yes.innerHTML = outerElement.getAttribute('data-bb-on');
				td.appendChild(outerElement.yes);
				// Center section where the indicator will hover over
				td = document.createElement('td');
				td.className = 'center';
				tr.appendChild(td);
				// The no option
				td = document.createElement('td');
				td.className = 'right';
				tr.appendChild(td);
				outerElement.no = document.createElement('div');
				outerElement.no.className = 'no';
				outerElement.no.innerHTML = outerElement.getAttribute('data-bb-off');
				td.appendChild(outerElement.no);
				// Indicator container
				outerElement.container = document.createElement('div');
				outerElement.container.className = 'indicator-container';
				outerElement.appendChild(outerElement.container);
				// Create the Halo
				outerElement.halo = document.createElement('div');
				outerElement.halo.className = 'halo';
				outerElement.halo.style.background = '-webkit-gradient(radial, 50% 50%, 0, 50% 50%, 43, from(rgba('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +', 0.15)), color-stop(0.8, rgba('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +', 0.15)), to(rgba('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +', 0.7)))';
				outerElement.container.appendChild(outerElement.halo);
				// Create the indicator
				outerElement.indicator = document.createElement('div');
				outerElement.indicator.setAttribute('class','indicator bb-bb10-toggle-indicator-' + color);
				outerElement.container.appendChild(outerElement.indicator);
				// Get our onchange event if any
				if (outerElement.hasAttribute('onchange')) {
					outerElement.onchangeEval = outerElement.getAttribute('onchange');
					outerElement.onchange = function() {
									eval(this.onchangeEval);
								};
				}			
				
				// Setup our touch events
				outerElement.inner.animateBegin = function(event) {
										if (this.outerElement.isActivated === false) {
											this.outerElement.startValue = this.outerElement.checked;
											this.outerElement.movedWithSlider = false;
											this.outerElement.isActivated = true;
											this.outerElement.initialXPos = event.touches[0].pageX;	
											this.outerElement.halo.style['-webkit-transform'] = 'scale(1)';
											this.outerElement.halo.style['-webkit-animation-name'] = 'explode';
											this.outerElement.indicator.setAttribute('class','indicator bb-bb10-toggle-indicator-' + color+ ' indicator-hover-'+color);
											this.outerElement.indicator.style.background = '-webkit-linear-gradient(top, rgb('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +') 0%, rgb('+ (bb.options.shades.R + 16) +', '+ (bb.options.shades.G + 16) +', '+ (bb.options.shades.B + 16) +') 100%)';
										}
									};
				outerElement.inner.animateBegin = outerElement.inner.animateBegin.bind(outerElement.inner);
				outerElement.inner.addEventListener("touchstart", outerElement.inner.animateBegin, false);
				outerElement.container.addEventListener("touchstart", outerElement.inner.animateBegin, false);
				outerElement.inner.animateEnd = function () {
										if (this.outerElement.isActivated === true) {
											this.outerElement.isActivated = false;
											this.outerElement.currentXPos = this.outerElement.transientXPos;
											this.outerElement.halo.style['-webkit-transform'] = 'scale(0)';
											this.outerElement.halo.style['-webkit-animation-name'] = 'implode';
											this.outerElement.indicator.setAttribute('class','indicator bb-bb10-toggle-indicator-' + color);   
											this.outerElement.indicator.style.background = '';	
											this.outerElement.positionButton();
											if (this.outerElement.movedWithSlider) {
												if (this.outerElement.startValue != this.outerElement.checked) {
													if (this.outerElement.onchange) {
														this.outerElement.onchange();
													}
												}
											}
										}
									};
				outerElement.inner.animateEnd = outerElement.inner.animateEnd.bind(outerElement.inner);
				outerElement.addEventListener('touchend', outerElement.inner.animateEnd, false);
				
				// Handle moving the toggle
				outerElement.moveToggle = function (event) {
									if (this.isActivated === true) {
										this.movedWithSlider = true;
										event.stopPropagation();
										event.preventDefault();
										var endPos = parseInt(window.getComputedStyle(this.fill).width) - this.buffer,
											percent;
										this.transientXPos = this.currentXPos + event.touches[0].pageX - this.initialXPos;
										this.transientXPos = Math.max(0, Math.min(this.transientXPos, endPos));
										this.inner.style['-webkit-transform'] = 'translate3d(' + this.transientXPos + 'px,0px,0px)';
										this.container.style['-webkit-transform'] = 'translate3d(' + this.transientXPos + 'px,0px,0px)';
										
										// Set our checked state
										percent = this.transientXPos/endPos;
										this.checked = (percent > 0.5);
									}
								};
				outerElement.moveToggle = outerElement.moveToggle.bind(outerElement);
				
				// Handle the click of a toggle
				outerElement.doClick = function() {
									if (!this.movedWithSlider) {
										this.setChecked(!this.checked);
									} 
								};
				outerElement.doClick = outerElement.doClick.bind(outerElement);
				outerElement.addEventListener('click', outerElement.doClick, false);
				
				// Position the button
				outerElement.positionButton = function() {
							var location = (this.checked) ? parseInt(window.getComputedStyle(this.fill).width) - this.buffer : 0;
						
							// Set our animations
							this.inner.style['-webkit-transform'] = 'translate3d(' + location + 'px,0px,0px)';
							this.inner.style['-webkit-transition-duration'] = '0.1s';
							this.inner.style['-webkit-transition-timing-function'] = 'linear';
							this.inner.addEventListener('webkitTransitionEnd', function() { 
										this.style['-webkit-transition'] = '';
									});
							this.container.style['-webkit-transform'] = 'translate3d(' + location + 'px,0px,0px)';
							this.container.style['-webkit-transition-duration'] = '0.1s';
							this.container.style['-webkit-transition-timing-function'] = 'linear';
							this.container.addEventListener('webkitTransitionEnd', function() { 
										this.style['-webkit-transition'] = '';
									});
									
							if (this.checked) {
								this.indicator.style['background-image'] = '-webkit-linear-gradient(top, '+ bb.options.bb10HighlightColor +' 0%, '+ bb.options.shades.darkHighlight +' 100%)';
							} else {
								this.indicator.style['background-image'] = '';
							}
							
							this.currentXPos = location;
						};
				outerElement.positionButton = outerElement.positionButton.bind(outerElement);
				
				// Add our setChecked function
				outerElement.setChecked = function(value) {
							if (value != this.checked) {
								this.checked = value;
								if (this.onchange) {
									this.onchange();
								}
							}
							this.positionButton();
						};
				outerElement.setChecked = outerElement.setChecked.bind(outerElement);
				
				// Add our getChecked function
				outerElement.getChecked = function() {
							return this.checked;
						};
				outerElement.getChecked = outerElement.getChecked.bind(outerElement);
				
				// set our checked state
				outerElement.checked = (outerElement.hasAttribute('data-bb-checked')) ? outerElement.getAttribute('data-bb-checked').toLowerCase() == 'true' : false;
				setTimeout(outerElement.positionButton,0);
				
				// Assign our document event listeners
				document.addEventListener('touchmove', outerElement.moveToggle, false);
				document.addEventListener('touchend', outerElement.inner.animateEnd, false);
			}
		} 
	}
};