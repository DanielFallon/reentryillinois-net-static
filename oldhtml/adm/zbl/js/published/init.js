/* This is javascript that is required by published pages in order for module classes to work correctly.
   It is designed to be a lightweight javascript base that the published pages can use without having to include
   the entirety of the javascript the editor needs to function. */

$(document).ready(function() {

    // Really useful function for rescoping "this"
    var createRef = function(obj, method) {
        return function() {
            method.apply(obj, arguments);
        }
    }

    // Instantiate every module on the page
    ModuleLoader.instantiateModules();

    var mm_audio = $('.audioAddon');
    if( mm_audio.length > 0 )
    {
        $.getScript( "http://scripts.lycos.com/JWPlayer/JWPlayerKey.js", function( response ) {
            $.getScript( "http://jwpsrv.com/library/VKVoePgbEeK2uSIACusDuQ.js", function( response ) {
                jwplayer.key = jwplayerKey;
                $.each( mm_audio, function() {
                    var src = $(this).attr("zbl-data");
                    var id = $( $(this).find( "div[id^='zbl-audio']" ).get(0) ).attr("id");
                    console.log( src, id );
                    jwplayer( id ).setup( {
                        file: src,
                        width: "100%",
                        height: 30
                    });
                });
            });
        });
    }



    var mm_video = $('div[id^="mm_video"]');
    if( mm_video.length > 0 )
    {
        $.getScript( "http://scripts.lycos.com/JWPlayer/JWPlayerKey.js", function( response ) {
            $.getScript( "http://jwpsrv.com/library/VKVoePgbEeK2uSIACusDuQ.js", function( response ) {
                jwplayer.key = jwplayerKey;
                $.each( mm_video, function() {
                    var src = $('.video_url', this).val();
                    var id = $( "div[id^='zbl-video']", this ).attr("id");
                    jwplayer( id ).setup( {
                        file: src,
                        width: "100%",
                        height: "100%",
                        aspectratio: "16:9",
                        primary: "html5"
                    });
                });
            });
        });
    }
});
