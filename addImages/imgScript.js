$(function(){

	 var params = {
		videoWrapper : $('#videoWrapper'),
		videoLink : '<iframe src="https://www.youtube.com/embed/78uiyqaFLo4?rel=0&amp;controls=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>',
		imgCont : $('#backgroundImage'),
		imgPath_Desktop : 'images/mb_background.png',
		imgPath_Mobile : 'images/mb_background_mobile.png'
	 }
	
	
	
	//---------------------------------------------------------------------
	$.fn.addImage = function(imageArray, settings){ 
		var base = $(this);				
		preload = {
			imgs : imageArray,
			base : base,
			events : {
				images : '',
				parent : this,
				addClass : '',
				addId : '',
				addAttr : '',
				onMouseOver : function(){},
				onMouseOut : function(){},
				beforeLoad : function(){},
				afterLoad: function(){}	
			},
			
			getImgs : function(arr){
				var images = [], loadedimages = 0
				var postaction = function (){}
				var scopeTo = this;
				var arr = (typeof arr != "object" ) ? [arr] : arr
				function imageloadpost(){
					loadedimages++
					if(loadedimages == arr.length){
						postaction(images)
					}
				}			
				for ( var i = 0; i < arr.length; i++){
					images[i] = new Image()
					images[i].src = arr[i]
					images[i].onload = function(){
						//Attribute Settings for image objects
						if(scopeTo.events.addClass != ''){
							this.className = scopeTo.events.addClass;
						}
						if(scopeTo.events.addId != ''){
							this.id = scopeTo.events.addId;
						}
						this.onmouseover = scopeTo.events.onMouseOver;
						this.onmouseout = scopeTo.events.onMouseOut;
						
						var attrArray = scopeTo.events.addAttr.split(',');
						if( attrArray != '' ){
							this.setAttribute(attrArray[0], attrArray[1]);
						}
						
						imageloadpost()
						
					}
					images[i].onerror = function(){
						imageloadpost()
					}
				}
	
				return { //return blank object with done() method
					done: function(f){ postaction = f || postaction },
				}
			},		
			loadImages : function(){
				var base = this.base;
				var scopeTo = this;
				var split = imageArray.split(',');
				for ( var i = 0; i < split.length; i++){
					this.getImgs(split[i]).done(function(imgs){
						//call before image load event
						scopeTo.events.beforeLoad(); 
						
						//where image array is added to dom
						base.prepend(imgs);
						
						//set the event.images reference here	
						scopeTo.events.images = imgs;
						
						//call after image load event
						scopeTo.events.afterLoad();
					});
				}
			}
		} 
		
		if (settings) { $.extend(preload.events, settings) }; 
		preload.loadImages();		
    }	
	function addImage(imageArray, settings, selector){
		var querySelector = selector != null ? selector : $('[data-load]');
		console.log(querySelector);
		querySelector.addImage(imageArray, settings);
	}
	
	//---------------------------------------------------------------------
		// add image paths here
		var mobileImage = params.imgPath_Mobile;
		var desktopImage = 	params.imgPath_Desktop;
		
		// window resize functions to call so desktop and
		// mobile images will be called. also there is a resize function
		$(window).resize(function(){
			params.imgCont.children().find('[data-adjust]').remove();
			setBackgroundImage();
		});	
		setBackgroundImage();	
		function setBackgroundImage(){
			if( $(window).width() > 768 ){
				
				addBackgroundImage(desktopImage);
			}else{

				addBackgroundImage(mobileImage);
			}
		}
			
		function addBackgroundImage(image){	
			// call the addImage plugin here
			params.imgCont.addImage(image,{
				addAttr : "data-adjust,",
				addClass : 'backgroundImg',
				beforeLoad: function(){
					params.imgCont.children().remove();
				},
				afterLoad: function(){
					var set = new settings();
					var selector = $('[data-adjust]');
					set.adjustImgHeight(selector);
				}
			});
		}
		
	
	//----------------------------------------------------------------------
	
//	settings.responsiveIframe();
	
	//this is a settings object created to adjust the height of the background images based
	//on a selector parameter given
	function settings(){
		
			this.adjustImgHeight = function(selector){
				// Height Ajustment Script for the main image
				var ajustImageHeight = function(e){
					var windowWidth = $(window).width(), value;	
					if( windowWidth > 767 ){
						value = e.css({ 'height' : windowWidth * 0.47, 'width' : 'auto' });
					}else{
						value = e.css({ 'width' : '100%' , 'height' : 'auto' });
					}
					return value;
				}
				var makeAjustment = function(){
					selector.each(function(){
						var e = $(this);
						ajustImageHeight(e)	 //call adjustment function	
					});		
				}
				//initiate everything
				makeAjustment()
				$(window).resize(makeAjustment);	
			}

	
	//----------------------------------------------------------------------
			this.responsiveIframe = function(){
				var responsiveIframe = function(the_iframe){
					var width = the_iframe.width();
					var setHeight = the_iframe.css({ 'height' : (width * 9)/16 });
					return setHeight;
				}
				var setHeight = function(){
					$('[data-iframe]').find('iframe').each(function(){
						var e = $(this);
						e.parent().css('height', responsiveIframe(e));
						responsiveIframe(e)
						e.parent().height(e.height());
					});
				}
				//initiate everything
				setHeight()
				$(window).resize(setHeight);
			}
			

	}
	
	//----------------------------------------------------------------------
	
	
});