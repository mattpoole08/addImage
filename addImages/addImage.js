/*
*	Name: AddImage
*	Author: Matt Poole
*	Credit: http://www.javascriptkit.com/javatutors/preloadimagesplus.shtml
*	Description: jQuery Plugin that preloads via the Image() javascript object an array of images.
* 	Version: 1.5
*/

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
					done: function(f){ postaction = f || postaction }
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