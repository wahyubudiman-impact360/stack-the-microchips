/**
 *  SoundHandler
 *
 *  Created by Justin Ng on 2014-08-19.
 *  Copyright (c) 2014 __MyCompanyName__. All rights reserved.
 */

ig.module('plugins.audio.sound-info')
.requires(
)
.defines(function () {

    SoundInfo = ig.Class.extend({
		FORMATS:{
			OGG:".ogg",
			MP3:".mp3",
		},
        
		/**
		* Define your sounds here
		* 
        */
		sfx: {
			staticSound: { path: "media/audio/play/static" },
			logosplash1: { path: "media/audio/opening/logosplash1" },
			logosplash2: { path: "media/audio/opening/logosplash2" },
			button1:{path:"media/audio/button1"},
			gameover:{path:"media/audio/combo"},
			combo1:{path:"media/audio/combo1"},
			combo2:{path:"media/audio/combo2"},
			combo3:{path:"media/audio/combo3"},
			combo4:{path:"media/audio/combo4"},
			combo5:{path:"media/audio/combo5"},
		},
		
        /**
        * Define your BGM here
        */
		bgm:{
			background:{path:'media/audio/bgm',startOgg:0,endOgg:21.463,startMp3:0,endMp3:21.463}
		}
        
		
    });

});
