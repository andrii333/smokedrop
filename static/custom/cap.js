

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
		Par(window,document);
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
			
		//obtain real left_col position	
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


app.controller('ContactController',function($scope)
	{
	$(window).scrollTop(0); //after loading page little scrolled
	
	})

//CAPSULEFOR <angularjs_frame;CLOSE>




app.directive('parallax',function($window)
	{
	return {
		scope:{},
		link:function(scope,element,attr)
			{
			console.log('Srabotalo');
			scope.init = init;
			scope.getDimensions = getDimensions;
			scope.onScroll = onScroll;


			scope.viewportHeight = 0;

			
			scope.init();

			$($window).on('scroll',scope.onScroll);

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
				
				}


			function onScroll()
				{
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

				var distCurY = top_pos+scope.parentElementHeight;
				var relative = parseInt(distCurY/scope.distY*100);
				console.log(relative,distCurY,scope.distY,scope.velocityY,element);
				relative = (1-relative/100)*scope.velocityY;
				element.css({'transform':'translate3d(0%,-'+relative+'%,0)'});
		
				}

			
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

			scope.init = init;
			scope.getDimensions = getDimensions;
			var el = element[0];

			scope.init();

			function getDimensions()
				{
				scope.elemTopPos = element[0].getBoundingClientRect()['top'];
				scope.viewportHeight = $window.innerHeight;
console.log(scope.elemTopPos)
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

				

			}
		

		}


	})

















