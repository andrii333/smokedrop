

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




app.directive('parallax',function($window,$timeout,decorators,$rootScope)
	{
	return {
		scope:{},
		link:function(scope,element,attr)
			{
			scope.init = init;
			scope.getDimensions = getDimensions;
			scope.onScroll = onScroll;
			
			//decorators.registr(scope,'parallax');
	

			scope.viewportHeight = 0;

			
			scope.init();

			$(window).on('scroll',scope.onScroll);

			function init()
				{
				scope.getDimensions();
				}
			


			function getDimensions()
				{
				scope.viewportHeight = $window.innerHeight;
				scope.parentElementHeight = element[0].parentElement.getBoundingClientRect()['height'];
				scope.distY = scope.viewportHeight+scope.parentElementHeight;
				scope.velocityY = parseInt(attr['parallax'].replace('%',''));
				var scale = scope.parentElementHeight/element[0].getBoundingClientRect()['height']; //determien scale koef to recalc velocity, because translate3d shift elem relative to its height but parent
				scope.velocityY = scope.velocityY*scale;
				
				scope.prev_scroll_dist = 0;
				scope.anim_run = false;
				}

			function onScroll(e)
				{
//console.log('cdcd');
			/*	if (!e){e = window.event}
				//get parent element
				var top_pos = element[0].parentElement.getBoundingClientRect()['top'];
				//determine viewport location
				if (top_pos>scope.viewportHeight&&top_pos>0)
					{
					return false;
					}
				if (top_pos<0&&(scope.parentElementHeight+top_pos)<0)
					{
					return false;
					}
				//if (element[0].className.indexOf('bgimg')!=-1){console.log(element)};

				var distCurY = top_pos+scope.parentElementHeight;
				var relative = parseInt(distCurY/scope.distY*100);
				relative = (1-relative/100)*scope.velocityY;
				
				window.requestAnimationFrame(function()
					{
					element.css({'transform':'translate3d(0%,-'+relative+'%,0)'});
					})
*/
				}

			
			}

	

	}
	
	})








app.directive('scroll',function($window,$timeout,decorators,$rootScope)
	{
	return {
		scope:{},
		link:function(scope,element,attr)
			{
			scope.init = init;
			scope.onScroll = onScroll;



			scope.DURATION = 500;
			scope.MAX_DURATION = 1000;
			scope.MAX_EVENTS = 30;
			scope.TRASHHOLD = 10000;
			scope.SCROLL_DECREASE = 2;
			scope.LAST_DURATION = 3000;  //duration for last event;		
	
			//decorators.registr(scope,'scroll');
			
			scope.init();
			

			function init()
				{
				$(window).on('mousewheel MozMousePixelScroll',scope.onScroll);
				scope.events = [];
				scope.anim_run = false;
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

			scope.anim_run = false;
			scope.last_event = false;
			function onScroll(e)
				{
				if (!e){e = window.event}
				e.preventDefault();
				//for mozilla
				if (e['originalEvent']['deltaY']===undefined)
					{
					e['originalEvent']['deltaY'] = e['originalEvent']['detail'];
					}
				var kolvo_e = scope.events.length;
				//get last value to obtain the sign (means direction)
				if (kolvo_e!=0)
					{
					var dif_ts = -scope.events[kolvo_e-1]['StartTime'] + e['timeStamp'];
					}
				else
					{
					var dif_ts = 0;
					}
				//var dif = e['originalEvent']['deltaY'];
				var dif = e['originalEvent']['deltaY'];
				dif = dif<0?-50:50;  //to fix constant move distance
				if (dif_ts>scope.TRASHHOLD)
					{
					scope.events = [];
					scope.kolvo_draw = 0;
					scope.anim_run = false;
					scope.last_event = false;
					window.cancelAnimationFrame(scope.anim_run);
					}
				
				//check on direction changes
				var sign_minus = scope.events.filter(function(el){return el['Distance']<0});
				var sign_plus = scope.events.filter(function(el){return el['Distance']>0});
				if (dif>0&&sign_minus.length>0)
					{
					window.cancelAnimationFrame(scope.anim_run);
					scope.anim_run = false;
					scope.events = [];
					}

				if (dif<0&&sign_plus.length>0)
					{
					window.cancelAnimationFrame(scope.anim_run);
					scope.anim_run = false;
					scope.events = [];
					}
		
				
				var evt = {};
				evt['Distance'] = dif*scope.SCROLL_DECREASE;
				evt['StartTime'] = (new Date()).getTime(); 
				evt['PrevDistance'] = 0;
				kolvo_e = kolvo_e>scope.MAX_EVENTS?scope.MAX_EVENTS:kolvo_e;
				//console.log(kolvo_e,'kolvo_e');
				evt['Duration'] = ease_quad_out(kolvo_e,scope.DURATION,scope.MAX_DURATION,scope.MAX_EVENTS);
				scope.events.push(evt);
				function draw(ts)
					{
					//scope.prev_num = scope.prev_num===undefined?0:scope.prev_num;	
					//scope.cur_num = parseInt(((new Date()).getTime())*1000/60);
					//if (scope.cur_num===scope.prev_num){return false};
					//scope.prev_num = scope.cur_num;
					//console.log(scope.cur_num);
					
					scope.prev_t = scope.prev_t===undefined?0:scope.prev_t;
					var del = ts - scope.prev_t;
					if (del<16)
						{
						window.cancelRequestAnimationFrame(scope.anim_run);
						scope.anim_run = window.requestAnimationFrame(draw);
						return false;
						}
					
					if (scope.anim_run==false){return false;}
					scope.anim_run = window.requestAnimationFrame(draw);
					decorators.start('scroll','draw');
					var total_scroll = 0;
					var cur_ts = (new Date()).getTime();

					scope.events = scope.events.filter(function(el)
						{
						var delta = cur_ts - el['StartTime']-el['Duration'];
						return delta<0;
						})

					if (scope.events.length==0)
						{
						window.cancelAnimationFrame(scope.anim_run);
						scope.anim_run = false;
						return false;
						}

					scope.events = scope.events.map(function(el)
						{
						
						var time_pos = cur_ts - el['StartTime'];
					//	console.log(time_pos,cur_ts,cur_ts - scope.prev_ts);
						scope.prev_ts = cur_ts;
					//	var position = ease_quadratic(time_pos,0,el['Distance'],el['Duration']);			
						var position = linear(time_pos,0,el['Distance'],el['Duration']);			
						var scroll_dist = position-el['PrevDistance'];
						total_scroll = total_scroll+scroll_dist;
						el['PrevDistance'] = position;
						return el;
						})
					window.scrollBy(0,total_scroll);

					}  //close draw function
				scope.anim_run = window.requestAnimationFrame(draw);
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










app.directive('animateScroll',function($window)
	{
	return {
		scope:{},
		link: function(scope,element,attrs)
			{
/*
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
				el.style['opacity'] = '0';
				scope.finished = false; //animation is finished (prevent scrol handling)
				}


			//determine when to fire animation
			$(window).scroll(function()
				{
				if (scope.finished==true){return false;}
				var dist = -$(window).scrollTop() + scope.elemTopPos;
				if (dist/scope.viewportHeight<0.7)
					{
					el.style['opacity'] = '1'; //show element
					$(el).addClass(attrs['animateScroll']); //set animated class
					scope.finished = true;
					scope.$apply();
					}		
				})

			*/	

			}
		

		}


	})

















