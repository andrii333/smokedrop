

// CAPSULEFOR <angularjs_frame;OPEN>
app = angular.module("app",['ui.router'])





app.config(function($stateProvider, $urlRouterProvider,$anchorScrollProvider,$uiViewScrollProvider)
	{
	$uiViewScrollProvider.useAnchorScroll();
	$urlRouterProvider.otherwise('/home')
	$stateProvider
		.state('home',
			{
			templateUrl:"./static/tmp/home.html",
			controller:"HomeController",
			url:"/home"
			})
		.state('article',
			{
			templateUrl:"./static/tmp/article.html",
			controller:"ArticleController",
			url:"/article"
			})
		.state('contact',
			{
			templateUrl:'./static/tmp/contact.html',
			controller:'ContactController',
			url:'/contact'
			})


	})


app.controller("MainController",function($scope)
	{


	$scope.l = ['q','w','e'];
	

	})



app.controller('HomeController',function($scope)
	{
	$(window).scrollTop(0); //after loading page little scrolled


	})

app.controller('ArticleController',function($scope)
	{

	$(window).scrollTop(0); //after loading page little scrolled
	$window = $(window);



	//mouse move img
	$('.article_img').ready(function()
		{
		var d = document.getElementById('scene');
	//	Par(window,document);
		$scope.parallax = new Parallax(d);
		})

	//determine scroll top positions
	$scope.determine_tops = function()
		{
		$scope.tops = {};
		$('.right_col h3').each(function()
			{
			$scope.tops[this.id] = $(this).offset()['top'];
//			$scope.tops[this.id] = this.getBoundingClientRect()['top']+$window.scrollTop();
			})
		
		}

	$scope.cur_menu = 'about_script';
	$scope.determine_tops();


	//determine screen width

	$scope.width_determine = function()
		{
		if ($('.screen_').length==0)  //insert screen block
			{
			var d = document.createElement('div');
			d.style['position'] = 'absolute';
			d.style['width'] = '100%';
			d.style['height'] = '100%';
			d.style['zIndex'] = '-1';
			d.className = 'screen_';
			$('body').prepend(d);				
			};
		
		$scope.sc_w = $('.screen_')[0].getBoundingClientRect()['width'];
		}
	//close creating block for height and width dimensions

	$scope.width_determine();

	$window.scroll(function()
		{
			
/*		//obtain real left_col position	
		var left_col = $('.article_container .left_col');

		if (left_col.length==0)
			{
			return false;
			}

		var block_cont = $('.block_container');
		var top_pos_left_col = left_col[0].getBoundingClientRect()['top'];
		var block_cont_pos = block_cont[0].getBoundingClientRect()['top'];
		

		if (block_cont_pos<100&&$scope.sc_w>768)
			{
			left_col.css('position','fixed');
			left_col.css('top','99px');	
			}
		else
			{
			if ($scope.sc_w<768)
				{
				left_col.css('position','relative')
				left_col.css('top','0px');			
				}
			else
				{
				left_col.css('position','absolute')
				left_col.css('top','0px');
				}
			}

	
		
		var tmp_dict = {};
		for (var each in $scope.tops)
			{
			var tp = $scope.tops[each];
			var dist = $window.scrollTop() - tp;
			if (dist>-300)
				{
				tmp_dict[dist] = each;	
				}
			}
		var keys_list = Object.keys(tmp_dict);
		var sort_dict = [];
		for (var i=0;i<keys_list.length;i=i+1)
			{
			sort_dict[i] = parseFloat(keys_list[i]);
			}
		function sortNumber(a,b)
			{
			return a-b;
			}
	
		sort_dict = sort_dict.sort(sortNumber);
		if (sort_dict.length!=0)
			{
			$scope.cur_menu = tmp_dict[sort_dict[0]];
			}
		$scope.$apply();
*/
		})

	$(window).resize(function()
		{
		//if it is not - after resizing - position yet old
		$scope.width_determine();
		var left_col = $('.article_container .left_col');
		if ($scope.sc_w<768)
			{
			left_col.css('position','relative')
			left_col.css('top','0px');
			}
		else
			{
			left_col.css('position','absolute')
			left_col.css('top','0px');
			}

		$scope.determine_tops();
		$scope.parallax.updateDimensions();	
		})


	$scope.go_to = function(el_id)
		{
		d = $('.right_col');
		var top_level = d.offset()['top'];
		$el = $('#'+el_id);
//		$('html,body').animate({scrollTop:($scope.tops[el_id]-(top_level-400))},500);
		$('html,body').animate({scrollTop:$scope.tops[el_id]-80},500);
//		$('html,body').animate({scrollTop:500},500);
		
		}


	})


app.service('decorators',function($window)
	{
	$window.timings = {};
	this.active = true;

	function create_funct_obj()
		{
		return{
			storage:[],
			get count()
			   {
			   return this.storage.length;
			   },
			get duration()
			   {
			   var total = 0;
			   this.storage.forEach(function(el)
				{
				total = total+el;
				})
			   return total/this.count;
			   },
			get max()
			   {
			   return Math.max.apply(null,this.storage);

			   }
		    };  

		}

	
	//registration (create key for dictionary and decorate function)
	this.registr = function(scope,name)
		{
		if (this.active==false){return false}
		//we need to check existence of this section, because we can reuse directive in diferent views
		
		if ($window.timings[name]===undefined)
			{
			$window.timings[name] = {};  //create for new module section in timings
			$window.timings.print = function()
				{
				for (var each in $window.timings)
					{
					console.log('----'+each+'------');
					for (var fn_name in $window.timings[each])
						{
						console.log(fn_name+': #'+$window.timings[each][fn_name]['count']+', DURATION '+$window.timings[each][fn_name]['duration']+', MAX '+this[each][fn_name].max);
						}
					}
				}
			}

		for (var each in scope)
			{
			if (typeof(scope[each])==='function')
				{
				if (each.indexOf('$')==-1)
					{
					function factory(scope,name,each)
					   {
					   //create function array
				 	   if ($window.timings[name][each]===undefined)
						{

						//CREATE OBJECT
						$window.timings[name][each] = create_funct_obj()
						}


					   
					   var fn = scope[each];

					   scope[each] = function(each,name,fn)
						{
						return function()
							{
							var ky = name+":"+each;
							$window.performance.mark('mark:'+ky);
							fn.apply(null,arguments);
							$window.performance.measure(ky,'mark:'+ky);
							var obj = $window.performance.getEntriesByName(ky)[0];
							$window.timings[name][each]['storage'].push(obj['duration']);
							if ($window.timings[name][each]['storage'].length>100000)
								{
								$window.timings[name][each]['storage'] = $window.timings[name][each]['storage'].splice(50000,99000);
								}

							$window.performance.clearMarks('mark:'+ky);
							$window.performance.clearMeasures(ky);
							}
						}(each,name,fn);
					};
					factory(scope,name,each);
				      }
			        }
		 	} //close for each in scope
		}  //close registr


	this.start = function(section_name,function_name)
		{
		var ky = section_name+':'+function_name;
		$window.timings[section_name] = $window.timings[section_name]===undefined?{}:$window.timings[section_name];
		if ($window.timings[section_name][function_name]===undefined)
			{
			$window.timings[section_name][function_name] = create_funct_obj();
			}

		$window.performance.mark('mark:'+ky);	
		}

	this.stop = function(section_name,function_name)
		{
		var ky = section_name+':'+function_name;
		$window.performance.measure(ky,'mark:'+ky);
		var obj = $window.performance.getEntriesByName(ky)[0];
		$window.timings[section_name][function_name]['storage'].push(obj['duration']);
	
		//because of error 'maximum exceed'	
		if ($window.timings[section_name][function_name]['storage'].length>100000)
			{
			$window.timings[section_name][function_name]['storage'] = $window.timings[section_name][function_name]['storage'].splice(50000,99000);
			}

		$window.performance.clearMarks('mark:'+ky);
		$window.performance.clearMeasures(ky);
		}

	


	})  //close decorators

app.controller('ContactController',function($scope)
	{
	$(window).scrollTop(0); //after loading page little scrolled
	
	})

//CAPSULEFOR <angularjs_frame;CLOSE>


app.directive('cropImg',function()
	{
	return {
		scope:{},
		link:function(scope,element,attr)
			{
			scope.get_dimensions = get_dimensions;
			
			$(window).on('resize',scope.get_dimensions);
			element.on('load',scope.get_dimensions);


			//scope.get_dimensions();	
			function get_dimensions()
				{
				var parent_element = element.parent();	
				//!!! not conventional case - for safe case get transform property, cache it, remove, and return after all dimensions will be ready
				var cache_transform = parent_element.css('transform');
				parent_element.css(
					{
					'transform':'',
					'visibility':'hidden'
					});
				var parent_dimensions = parent_element[0].getBoundingClientRect();
				var h = parent_dimensions['height'];
				console.log($('.bgimg_hand')[0].getBoundingClientRect()['height']);
				//debugger;	
				var w = parent_dimensions['width'];
				var img_dimensions = element[0].getBoundingClientRect();
				var h_img = img_dimensions['height'];
				var w_img = img_dimensions['width'];
				var koef = w/w_img;
				console.log(h_img*koef,w_img*(h/h_img));				
				//debugger;
				if (h_img*koef>h)
					{
					element.css(
						{
						'width':'100%',
						'height':'auto',
						'margin-left':'0%'
						});
					element.css({'width':'100%','height':'auto'});
					}
				else
					{
					var new_w_img = w_img*(h/h_img);
					var rate = (1-new_w_img/w)/2*100;
					
					//debugger;
					element.css(
						{
						'width':'auto',
						'height':'100%',
						'margin-left':rate+'%'
						});
					}
				
				console.log(h,w,h_img,w_img,rate,new_w_img);
				//debugger;	
				//return previous state (transforms and visibility)
				parent_element.css(
					{
					'transform':cache_transform,
					'visibility':'visible'
					});
				//debugger;
				}

			}
	

	}


	})










/**
 *
 *@directive
 * isolated directive for moving element on every scroll event
 *
 */

app.directive('parallax',function($window,$timeout,decorators,$rootScope)
	{
	return {
		scope:{},
		link:function(scope,element,attr)
			{
			scope.init = init;
			scope.getDimensions = getDimensions;
			scope.onScroll = onScroll;
			scope.draw = draw;
			scope.ease = cubic_in_out;


			//decorators.registr(scope,'parallax');
	

			scope.viewportHeight = 0;
			scope.final_relative = 0;

			scope.TOP = attr['parallaxTop']==undefined?false:true;			
			scope.LEFT = attr['parallaxLeft']==undefined?false:true;			
			scope.SCALE = attr['parallaxScale']==undefined?false:true;			
			scope.ROTATEX = attr['parallaxRotateX']==undefined?false:true;			
			scope.ROTATEY = attr['parallaxRotateY']==undefined?false:true;			
			scope.ROTATE = attr['parallaxRotate']==undefined?false:true;			


			
			scope.DURATION = attr['parallaxDuration']===undefined?20:attr['parallaxDuration'];
			scope.MARGIN_DISTANCE_TOP = scope.TOP?parseInt(attr['parallaxTop'].replace('%','')):undefined;
			scope.MARGIN_DISTANCE_LEFT = scope.LEFT?parseInt(attr['parallaxLeft'].replace('%','')):undefined;

			if (scope.SCALE)
				{
				scope.SCALE_MIN = parseInt(attr['parallaxScale'].split(':')[0]);
				scope.SCALE_MAX = parseInt(attr['parallaxScale'].split(':')[1]);
				scope.MARGIN_DISTANCE_SCALE = scope.SCALE_MAX - scope.SCALE_MIN;
				}

			if (scope.ROTATEX)
				{
				scope.ROTATEX_MIN = parseInt(attr['parallaxRotateX'].split(':')[0]);
				scope.ROTATEX_MAX = parseInt(attr['parallaxRotateX'].split(':')[1]);
				scope.MARGIN_DISTANCE_ROTATEX = scope.ROTATEX_MAX - scope.ROTATEX_MIN;
				}


			if (scope.ROTATEY)
				{
				scope.ROTATEY_MIN = parseInt(attr['parallaxRotateY'].split(':')[0]);
				scope.ROTATEY_MAX = parseInt(attr['parallaxRotateY'].split(':')[1]);
				scope.MARGIN_DISTANCE_ROTATEY = scope.ROTATEY_MAX - scope.ROTATEY_MIN;
				}

			if (scope.ROTATE)
				{
				scope.ROTATE_MIN = parseInt(attr['parallaxRotate'].split(':')[0]);
				scope.ROTATE_MAX = parseInt(attr['parallaxRotate'].split(':')[1]);
				scope.MARGIN_DISTANCE_ROTATE = scope.ROTATE_MAX - scope.ROTATE_MIN;
				}

			scope.init();
			$(window).on('scroll',scope.onScroll);


			function init()
				{
				scope.getDimensions();
				scope.st = false;
				scope.onScroll();

				}


			function cubic_in_out (t, b, c, d) 
				{
				t /= d/2;
				if (t < 1)
					 return c/2*t*t*t + b;
				t -= 2;
				return c/2*(t*t*t + 2) + b;
				};



			//getDimensions - function calculate key measures of viewport and parentElement to understand the status of scrolling and actual values of all properties
			function getDimensions()
				{
				scope.viewportHeight = $window.innerHeight;
				scope.parentElementHeight = element[0].parentElement.getBoundingClientRect()['height'];
				scope.distY = scope.viewportHeight+scope.parentElementHeight;
				scope.prev_scroll_dist = 0;
				}


			function onScroll(e)
				{
				if (scope.st==true){return false}

				scope.st = true;  //flag for marking runnig requestanimationframes
				window.requestAnimationFrame(scope.draw);
				}

			function draw()
				{
				//get parent element
				var top_pos = element[0].parentElement.getBoundingClientRect()['top'];
				//determine viewport location
				if (top_pos>scope.viewportHeight&&top_pos>0)
					{
					scope.st = false;
					return false;
					}
				if (top_pos<0&&(scope.parentElementHeight+top_pos)<0)
					{
					scope.st = false;
					return false;
					}


				var distCurY = top_pos+scope.parentElementHeight;
				var relative = parseInt(distCurY/scope.distY*100);
			//debugger;
				relative = (1-relative/100);
			//debugger;
			//	relative = relative*10000;
			//debugger;
			//	relative = scope.ease(relative,0,100,10000)
			//debugger;
			//	relative = relative/100;	
				//console.log(relative);
				//delta - it is real distance for moving, which is deviding by duration
				var delta = relative - scope.final_relative;
				if (Math.abs(delta)>0.01)
					{
					var t = delta/scope.DURATION;
					if (t>=0)
						t = t<=0.00001?0.00001:t;
					else
						t = t>-0.00001?-0.00001:t;
					scope.final_relative = scope.final_relative+t;

/*
					if (element[0].className.indexOf('bgimg_hand')==0||element[0].className.indexOf('question')!=-1)
						{
						console.log(scope.final_relative,element[0].className);
						}
*/

					}
				else
					{
					scope.st = false;
					return false;
					}
				
				

				value = '';
	
				//POSITION TOP
				if (scope.TOP)
					scope.distance_top = scope.final_relative*scope.MARGIN_DISTANCE_TOP;
				else
					scope.distance_top = 0;

				//POSITION LEFT
				if (scope.LEFT)
					scope.distance_left = scope.final_relative*scope.MARGIN_DISTANCE_LEFT;
				else
					scope.distance_left = 0;

				
				var value = 'translate3d('+scope.distance_left+'%,'+scope.distance_top+'%,0)';

				//SCALE
				if (scope.SCALE)
					{
					scope.scale_transform = scope.SCALE_MIN+scope.final_relative*scope.MARGIN_DISTANCE_SCALE;
					value = value+' scale('+scope.scale_transform/100+')';
					}
			
				//ROTATEX
				if (scope.ROTATEX)
					{
					scope.distance_rotateX = scope.ROTATEX_MIN+scope.final_relative*scope.MARGIN_DISTANCE_ROTATEX;
					value = value+' rotateX('+scope.distance_rotateX+'deg)';	
					}
			

				//ROTATEY
				if (scope.ROTATEY)
					{
					scope.distance_rotateY = scope.ROTATEY_MIN+scope.final_relative*scope.MARGIN_DISTANCE_ROTATEY;
					value = value+' rotateY('+scope.distance_rotateY+'deg)';	
					}
	
				//ROTATE
				if (scope.ROTATE)
					{
					scope.distance_rotate = scope.ROTATE_MIN+scope.final_relative*scope.MARGIN_DISTANCE_ROTATE;
					value = value+' rotate('+scope.distance_rotate+'deg)';	
					//console.log(scope.ROTATE_MIN,scope.final_relative,scope.MARGIN_DISTANCE_ROTATE);
					}
				
				value = value+' translateZ(0)';
				element.css({'transform':value});
				window.requestAnimationFrame(scope.draw);


				}


			}

	

	}
	
	})








app.directive('scroll',function($window,$timeout,decorators,$rootScope,$timeout)
	{
	return {
		scope:{},
		link:function(scope,element,attr)
			{
			//cancel scroll handler for every browser except chrome
			//if (navigator.vendor.toLowerCase().indexOf('google')==-1)
			//	return false;


			scope.init = init;
			scope.onScroll = onScroll;


			scope.DURATION = 10;   //duration in frames
			scope.TRASHHOLD = 1000;  //number ov events to handle   !50
			scope.DISTANCE = parseInt(screen.height/5);  //number of pixels to scroll for one event
			scope.DECREASE = -1;  //decrease * kolvo_e - as many events - so shorter distance !0.1
			scope.DURATION_INCREASE = 5;  //increase up to trashhold in * times   !1.8
			
			//decorators.registr(scope,'scroll');
			
			scope.init();
			

			function init()
				{
				$(window).on('mousewheel MozMousePixelScroll',scope.onScroll);
				scope.events = [];
				}


			function ease_quad_out(t,b,c,d)
				{
				t /= d;
				return -c * t*(t-2) + b;
				}

		
			function ease_quadratic(t,b,c,d)
				{
				t /= d;
				t--;
				return c*(t*t*t*t*t + 1) + b;
				}

			function linear(t,b,c,d)
				{
				return c*t/d + b;
				}

			function onScroll(e)
				{


				if (!e){e = window.event}
				e.preventDefault();
				//for mozilla
				if (e['originalEvent']['deltaY']===undefined)
					{
					e['originalEvent']['deltaY'] = e['originalEvent']['detail'];
					}
		
				var distance = e['originalEvent']['deltaY'];
				//console.log(e);
				
				//check on direction changes
				var sign_minus = scope.events.filter(function(el){return el['Distance']<0});
				var sign_plus = scope.events.filter(function(el){return el['Distance']>0});
				if (distance>0&&sign_minus.length>0)
					{
					window.cancelAnimationFrame(scope.frame);
					scope.events = [];
					}

				if (distance<0&&sign_plus.length>0)
					{
					window.cancelAnimationFrame(scope.frame);
					scope.events = [];
					}
				//abort if kolvo event more then trashhold	
				if (scope.events.length>scope.TRASHHOLD)
					{
					return false;
					}

				//abort if there was an event in this frame
				var kolvo_e = scope.events.length;
				if (kolvo_e!=0)
					{
					if (scope.events[kolvo_e-1]['EllapsedFrames']==0)
						{
						return false;
						}

					}	
				if (scope.events.length==0)
					{
					scope.frame = window.requestAnimationFrame(draw);
					}
				
				var evt = {};
				evt['PrevDistance'] = 0;
				//var dur = parseInt(scope.DURATION*(1+(kolvo_e/scope.TRASHHOLD)*scope.DURATION_INCREASE))
			//	evt['Duration'] = (scope.DURATION*scope.DURATION)/parseInt(ease_quadratic(kolvo_e,scope.DURATION,scope.DURATION*scope.DURATION_INCREASE,scope.TRASHHOLD));
				//evt['Duration'] = parseInt(ease_quadratic(kolvo_e,scope.DURATION,scope.DURATION*scope.DURATION_INCREASE,scope.TRASHHOLD));
				evt['EllapsedFrames'] = 0;
				//var dis = scope.DISTANCE*(1-scope.DECREASE*(kolvo_e/scope.TRASHHOLD));
				//console.log('dis',dis);
				if (Math.abs(distance)>scope.DISTANCE)
					var dis = distance>0?scope.DISTANCE:-scope.DISTANCE;
				else
					var dis = distance;
				
				var dur = parseInt(Math.abs(dis)/5);
				dur = dur>7?7:dur;
				evt['Duration'] = dur;
				evt['Distance'] = dis;
				scope.events.push(evt);
				console.log(dis,scope.DISTANCE);
				console.log(scope.events);
				function draw(ts)
					{
	
					if (scope.events.length==0)
						{
						window.cancelAnimationFrame(scope.frame);
						return false;
						}

					//control frame length
					scope.events[0]['LastFrame'] = scope.events[0]['LastFrame']===undefined?0:scope.events[0]['LastFrame'];
					var delta = ts - scope.events[0]['LastFrame'];
					//var kolvo_frames = parseInt(delta/16);	
					//if (isNaN(delta)==true){kolvo_frames = 1};
					//kolvo_frames = kolvo_frames>2?2:kolvo_frames;

					var kolvo_frames = 1;

					//scope.prev_t = scope.prev_t===undefined?0:scope.prev_t;
					//console.log(ts-scope.prev_t,delta);
					//scope.prev_t = ts;
					scope.count = scope.count===undefined?0:scope.count;
					scope.count = scope.count+1;
					//console.log(scope.count);
				
	
					if (delta<1000/80)
						{
						window.cancelAnimationFrame(scope.frame);
						scope.frame = window.requestAnimationFrame(draw);
						return false;
						};
					
					//for safe case - cancel animation if no events
					scope.frame = window.requestAnimationFrame(draw);	
					

					//decorators.start('scroll','draw');
					var final_scroll = 0;

					//var frames = [];
					for (var each in scope.events)
						{
						scope.events[each]['LastFrame'] = ts;
						scope.events[each]['EllapsedFrames'] = scope.events[each]['EllapsedFrames']+kolvo_frames;
						var share = scope.events[each]['EllapsedFrames']/scope.events[each]['Duration'];
						var total_scroll = parseInt(share*scope.events[each]['Distance']);
						final_scroll = final_scroll+(total_scroll - scope.events[each]['PrevDistance']);
						//frames.push(scope.events[each]['EllapsedFrames']);
						scope.events[each]['PrevDistance'] = total_scroll;
						}
					//console.log(frames.join(':'));
					scope.events = scope.events.filter(function(el)
						{
						return el['Duration']>=el['EllapsedFrames']
						})
				//	if (Math.abs(final_scroll)>50)
				//		final_scroll=final_scroll>0?50:-50;
				//	console.log(final_scroll);
					window.scrollBy(0,final_scroll);

					}  //close draw function

				}  //close scroll


			}

	

	}
	
	})






app.directive('parallaxScroll',function()
	{
	return { 
		link: function(scope,element,attrs)
			{
/*
			element.ready(function()
				{
				//cache the window object
				$window = $(window);

 
				var $scroll = $(element[0]);
				$scroll.top = $scroll.offset()['top'];
				$scroll.move_begin = attrs['parallaxScroll'];
				$window.scroll(function() 
					{
					var el = $('#'+$scroll[0].id).length;
					if (el==0)
						{
						return false;
						}
					var dist = $window.scrollTop()-$scroll.top;
					var add = parseInt($scroll.move_begin);
					if (dist>-add)
						{
						yPos = -(dist+add) / $scroll.data('speed'); 	
						}
					else
						{
						yPos = 0;
						}
		
				
					// background position
					var coords = '50% '+ yPos + 'px';
						
					//calculate yPos in %% to vp height
					$scroll.css({ backgroundPosition: coords });    	

		
        
					}); // end window scroll


				//set reccal of top when resizing
				$window.resize(function()
					{
					var el = $('#'+$scroll[0].id).length;
					if (el==0)
						{
						return false;
						}
					$scroll.top = $scroll.offset()['top'];		
					})

				});  // end section function				
*/

			}

		}
	})





app.directive('menuScroll',function()
	{
	return {
		link:function(scope,element,attrs)
			{
			
			$(window).on('scroll',function()
				{
				var time_border = attrs['menuScroll'];
				var scroll_y = window.scrollY;
				if (scroll_y>time_border)
					{
					element.addClass('after_scroll');
					}
				else
					{
					element.removeClass('after_scroll');
					}
				
				})


			}

		}


	})




app.directive('animateScroll',function($window)
	{
	return {
		scope:{},
		link: function(scope,element,attrs)
			{

			scope.init = init;
			scope.getDimensions = getDimensions;
			var el = element[0];

			scope.init();

			function getDimensions()
				{
				scope.elemTopPos = element[0].getBoundingClientRect()['top'];
				scope.viewportHeight = $window.innerHeight;
				}

			function init()
				{
				scope.getDimensions();
		//		el.style['opacity'] = '0';
				scope.finished = false; //animation is finished (prevent scrol handling)
				}


			//determine when to fire animation
			$(window).scroll(function()
				{
				if (scope.finished==true){return false;}
				var dist = -$(window).scrollTop() + scope.elemTopPos;
				if (dist/scope.viewportHeight<0.7)
					{
				//	el.style['opacity'] = '1'; //show element
					$(el).addClass(attrs['animateScroll']); //set animated class
					scope.finished = true;
					scope.$apply();
					}		
				})

				

			}
		

		}


	})

















