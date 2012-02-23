//X carousel
//License: http://creativecommons.org/licenses/by-sa/3.0/
//Site: https://github.com/jonathan-fielding/X-Carousel - DO NOT REMOVE AS PER LICENCE AGREEMENT

(function( $ ){

  $.fn.xCarousel = function( options ) {  

    var settings = {
		'width'  : 'css',
		'pager_type'  : 'dots',
		'pager_title' : '',
		'pager_position' : 'outside', // Can occur once outside the items or within every item for greater flexibility
		'pager_content' : 'number', // Can be number or title
		'pager_template' : '',
		'fullscreen_width': false,
		'callback_onsetup' : function(){},
		'callback_onnext' : function(){},
		'callback_onprev' : function(){},
		'visible_items' : 1
    };
    
    return this.each(function() {        
      // If options exist, lets merge them
      // with our default settings
      if ( options ) { 
        $.extend( settings, options );
      }
		//Buffer the this object
		var this_obj = $(this)
		
		//Create html buffer
		var html_buffer = "";
		
		//Get how many items are in the carousel
		$(this_obj).attr('data-item-count',$(this_obj).find('ul li').length);
		
		//set current_visible_item
		$(this_obj).attr('data-item',0);
	
		//Get the id of the carousel, if it isnt set create it.
		if($(this).attr('id')){
			var this_id = $(this).attr('id');
		}
		else{
			var this_id = 'carousel' + Math.floor(Math.random()*9999);
			$(this).attr('id',this_id);
		}
		
		//Get all the items in the carousel
		var items_obj = $(this_obj).find('ul:first-child')
		var items = $(items_obj).html();
		
		var pager_items = "";
		
		$(items_obj).find('li').each(function(index) {
			if(settings.pager_content == 'title'){
				pager_items += '<li><a href="#" rel="'+index+'">' + $(this).attr('title') + '</a></li>';
			}else if(settings.pager_content == 'number'){
				pager_items += '<li><a href="#" rel="'+index+'">' + (index + 1) + '</a></li>';
			}
		});
		
		//get the width of each item
		$(this_obj).attr('data-item-width',$(this_obj).find('ul li').outerWidth());
		
		//Slider width
		$(this_obj).attr('data-slider-width',parseInt($(this_obj).attr('data-item-width')) * parseInt($(this_obj).attr('data-item-count')));
		
		//Maximum negative width
		$(this_obj).attr('data-max-neg-wid',(0 - (parseInt($(this_obj).attr('data-slider-width')) * 3)) + parseInt($(this_obj).attr('data-item-width')));
		
		//remove the items from the dom so we can wrap it up.
		$(this_obj).find('ul').remove();
		
		if((parseInt($(this_obj).attr('data-item-count')) > settings.visible_items) && settings.visible_items !=1){
			var items_multiple = 4;
			var carousel_items = items + items + items + items;
			var items_left = parseInt($(this_obj).attr('data-slider-width'))
		}
		else if((parseInt($(this_obj).attr('data-item-count')) > settings.visible_items) && settings.visible_items == 1){
			var items_multiple = 3;
			var carousel_items = items + items + items;
			var items_left = parseInt($(this_obj).attr('data-slider-width'))
		}
		else{
			var items_multiple = 1;
			var carousel_items = items;
			var items_left = '0';
		}
		
		//Wrap the items and read them to the DOM with previous and next
		
		if(((parseInt($(this_obj).attr('data-item-count')) > settings.visible_items) && settings.visible_items == 1) || (settings.visible_items != 1 && parseInt($(this_obj).attr('data-item-count')) > settings.visible_items)){
			html_buffer += '<a href="#" class="navLeft"></a>';
		}
		
		html_buffer += '<div class="carousel_contents clearfix" style="width: '+ $(this_obj).width() +'px;"><ul class="carousel_slider" style="left:-'+items_left+'px">' + carousel_items + '</ul></div>';
		
		if(((parseInt($(this_obj).attr('data-item-count')) > settings.visible_items) && settings.visible_items == 1) || (settings.visible_items != 1 && parseInt($(this_obj).attr('data-item-count')) > settings.visible_items)){
			html_buffer += '<a href="#" class="navRight"></a>';
		}
		
		$(this_obj).append(html_buffer)
		
		if(settings.visible_items === 1){
			var li_width = parseInt($(this_obj).find('.carousel_contents').width()) - parseInt($(this_obj).find('ul li').css('padding-left')) - parseInt($(this_obj).find('ul li').css('padding-right'))
			$(this_obj).find('ul li').css('width', li_width);
		}
		
		//Clear the buffer
		html_buffer = "";
		
		//Set initial position
		$(this_obj).attr('data-initial-position','-' + parseInt($(this_obj).attr('data-slider-width')));
		
		$(this_obj).find('.carousel_contents ul').css('width',parseInt($(this_obj).attr('data-slider-width'))*items_multiple);
		
		$(this_obj).find('ul li').addClass('slider_item');
		$(this_obj).css('height',$(this).find('.carousel_slider').height());
		$(this_obj).find('.carousel_contents').css('height',$(this).find('.carousel_slider').height());
		
		//Build the pager
		
		if(settings.pager_type == 'dots'){
			html_buffer += '<ul class="pager clearfix">';
			html_buffer += pager_items;
			html_buffer += '</ul>';
		}
		else if(settings.pager_type == 'list' && settings.pager_template == ''){
			html_buffer += '<div class="pager">'
				if(settings.pager_title != ''){
					html_buffer += settings.pager_title;
				}
					html_buffer += '<ul>'
					html_buffer += pager_items;
				html_buffer += '</ul>'
			html_buffer += '</div>'
		}else if(settings.pager_template != ''){
			html_buffer += settings.pager_template.replace('%%ITEMS%%',pager_items);
		}
		
		if(settings.pager_position == 'inside'){
			$(this_obj).find('ul.carousel_slider li .wrapper').append(html_buffer);
		}
		else{
			$(this_obj).append(html_buffer);
		}
		
		$(this_obj).find('.navLeft').click(function(){
			var thewidth = parseInt($(this_obj).attr('data-initial-position'));
			var left = thewidth + parseInt($(this_obj).attr('data-item-width'));
			
			$('#'+this_id).attr('data-initial-position',left);
			
			if(left <= 0){
			$('#'+this_id+' ul.carousel_slider').animate({
				left: "+=" + parseInt($(this_obj).attr('data-item-width'))
			  }, 500, function() {
				if(left >= 0){
					$(this).css('left','-' + parseInt($(this_obj).attr('data-slider-width')) + 'px');
					$('#'+this_id).attr('data-initial-position','-' + parseInt($(this_obj).attr('data-slider-width')))
				}
				
				if(parseInt($(this_obj).attr('data-item')) == 0){
					$(this_obj).attr('data-item',parseInt($(this_obj).attr('data-item-count')) - 1);
				}
				else if(parseInt($(this_obj).attr('data-item')) > 0){
					$(this_obj).attr('data-item',parseInt($(this_obj).attr('data-item')) - 1);
				}
				
				$('#'+this_id + ' .pager li a.active').removeClass('active');
				
				$(this_obj).find('.pager').each(function(index) {
				    $(this).find('li a').eq(parseInt($(this_obj).attr('data-item'))).addClass('active');
				})
				
			  });
			}
		
			return false;
		});
			
		$(this_obj).find('.navRight').click(function(){
			var thewidth = parseInt($(this_obj).attr('data-initial-position'));
			var left = thewidth - parseInt($(this_obj).attr('data-item-width'));
			
			var check_position = - left;
			
			$('#'+this_id).attr('data-initial-position',left)
			
			if(parseInt($(this_obj).attr('data-max-neg-wid')) <= left){
				$('#'+this_id+' ul.carousel_slider').animate({
					left: "-=" + parseInt($(this_obj).attr('data-item-width'))
				  }, 500, function() {
				  	
				  
					if(parseInt($(this_obj).attr('data-max-neg-wid')) >= left){
						$(this).css('left','-' + (parseInt($(this_obj).attr('data-slider-width')) - parseInt($(this_obj).attr('data-item-width'))) + 'px');
						$('#'+this_id).attr('data-initial-position','-' + (parseInt($(this_obj).attr('data-slider-width')) - parseInt($(this_obj).attr('data-item-width'))))
					}
					
					if(parseInt($(this_obj).attr('data-item')) == (parseInt($(this_obj).attr('data-item-count')) - 1)){
						$(this_obj).attr('data-item',0);
					}
					else {
						$(this_obj).attr('data-item',parseInt($(this_obj).attr('data-item')) + 1);
					}
					
					$('#'+this_id + ' .pager li a.active').removeClass('active');
					  
					$(this_obj).find('.pager').each(function(index) {
					    $(this).find('li a').eq(parseInt($(this_obj).attr('data-item'))).addClass('active');
					});  
					
					  
				  });
			
			}
		
			return false;
		});
		
		
		$(this_obj).find('.pager').delegate('a','click',function(event){
			var left = -( parseInt($(this_obj).attr('data-slider-width'))  + ($(this_obj).attr('data-item-width') * parseInt(event.currentTarget.rel)));
			
			
			$(this_obj).attr('data-item',event.currentTarget.rel);
			
			$('#'+this_id).attr('data-item',parseInt($(this_obj).attr('data-item')));
			
			$('#'+this_id + ' .pager li a').removeClass('active');
			
			$('#'+this_id + ' .pager li a[rel="'+ event.currentTarget.rel +'"]').addClass('active');
			
			$('#'+this_id).attr('data-initial-position',left)
			
			$('#'+this_id+' ul.carousel_slider').animate({
				left: left
			  }, 500, function() {
			});
			  	  
			return false;
		})
		
		$(this_obj).find('.pager').each(function(index) {
		    $(this).find('li a').eq(0).addClass('active');
		});
		
		settings.callback_onsetup();
		
		var startX;
    	 var startY;
		 var isMoving = false;

    	 function cancelTouch() {
    		 this.removeEventListener('touchmove', onTouchMove);
    		 startX = null;
    		 isMoving = false;
    	 }	
    	 
    	 function onTouchMove(e) {
    		
    		 if(isMoving) {
	    		 var x = e.touches[0].pageX;
	    		 var y = e.touches[0].pageY;
	    		 var dx = startX - x;
	    		 var dy = startY - y;
	    		 if(Math.abs(dx) >= 50) {
	    			cancelTouch();
	    			if(dx > 0) {
	    				$('#'+this_id + ' .navRight').eq(0).click();
	    				//console.log('test');
	    			}
	    			else {
	    				
						$('#'+this_id + ' .navLeft').eq(0).click();
						//console.log('test');
	    			}
	    		 }
	    		 else if(Math.abs(dy) >= 20) {
		    			return false
		    		 }
    		 }
    	 }
    	 
    	 function onTouchStart(e)
    	 {
    		 if (e.touches.length == 1) {
    			 startX = e.touches[0].pageX;
    			 startY = e.touches[0].pageY;
    			 isMoving = true;
    			 this.addEventListener('touchmove', onTouchMove, false);
    		 }
    	 }    	
		  
    	 if ('ontouchstart' in document.documentElement) {
    		 this.addEventListener('touchstart', onTouchStart, false);
    	 }
		

    });

  };
})( jQuery );