define(["jquery", "velocity"], function($, velocity){
    $.fn.simpleSlide = function(btn){

        var el = $(this),
            button = $(btn);

        bindButton();
        // el.velocity('slideOutUp', {duration:0});

        function bindButton(){
            // bind button click event
            button.on('click',function(event){
                // hide element
                unhide(el);
                el.velocity('slideOutUp', {duration:0});
                el.velocity('slideInDown', {duration:100});

                // unbind button click event for now
                $(this).unbind(event);
                //wait a millisec or two so clicks don't conflict
                setTimeout(function(){
                    // bind window click event
                    button.on('click', function(event){
                        // check for click outside element
                        if(!$(event.target).parents().addBack().is(el)){
                            // hide element
                            el.velocity('slideOutUp', {duration: 100,
                                complete: function(){
                                    hide(el)
                                    // unbind window click event
                                    $(this).unbind(event);
                                    // (re)bind button click event
                                    bindButton();
                                }
                            });
                        }
                    });
                }, 2);
            });
        }
        
    }
});