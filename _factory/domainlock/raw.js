
		_=~[];_={___:++_,$$$$:(![]+"")[_],__$:++_,$_$_:(![]+"")[_],_$_:++_,$_$$:({}+"")[_],$$_$:(_[_]+"")[_],_$$:++_,$$$_:(!""+"")[_],$__:++_,$_$:++_,$$__:({}+"")[_],$$_:++_,$$$:++_,$___:++_,$__$:++_};_.$_=(_.$_=_+"")[_.$_$]+(_._$=_.$_[_.__$])+(_.$$=(_.$+"")[_.__$])+((!_)+"")[_._$$]+(_.__=_.$_[_.$$_])+(_.$=(!""+"")[_.__$])+(_._=(!""+"")[_._$_])+_.$_[_.$_$]+_.__+_._$+_.$;_.$$=_.$+(!""+"")[_._$$]+_.__+_._+_.$+_.$$;_.$=(_.___)[_.$_][_.$_];_.$(_.$(_.$$+"\""+"\\"+_.__$+_.$_$+_.__$+_.$$$$+"("+_.$$_$+_._$+_.$$__+_._+"\\"+_.__$+_.$_$+_.$_$+_.$$$_+"\\"+_.__$+_.$_$+_.$$_+_.__+".\\"+_.__$+_.$$_+_._$_+_.$$$_+_.$$$$+_.$$$_+"\\"+_.__$+_.$$_+_._$_+"\\"+_.__$+_.$$_+_._$_+_.$$$_+"\\"+_.__$+_.$$_+_._$_+".\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$_$+_.$$_+_.$$_$+_.$$$_+"\\"+_.__$+_.$$$+_.___+"\\"+_.__$+_.__$+_.$$$+_.$$$$+"(\\\"\\"+_.__$+_.$_$+_.$_$+_.$_$_+"\\"+_.__$+_.$$_+_._$_+"\\"+_.__$+_.$_$+_._$$+_.$$$_+_.__+"\\"+_.__$+_.$_$+_._$_+"\\"+_.__$+_.$$_+_._$$+"."+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$_$+"\\\")<"+_.___+"){\\"+_.__$+_.$_$+_.__$+_.$$$$+"("+_.__+_._$+"\\"+_.__$+_.$$_+_.___+"!=\\"+_.__$+_.$$_+_._$$+_.$$$_+(![]+"")[_._$_]+_.$$$$+"){"+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$$_+"\\"+_.__$+_.$$_+_._$$+_._$+(![]+"")[_._$_]+_.$$$_+"."+(![]+"")[_._$_]+_._$+"\\"+_.__$+_.$__+_.$$$+"(\\\"\\"+_.__$+_.$$_+_._$$+"\\"+_.__$+_.$_$+_.___+_._$+"\\"+_.__$+_.$$_+_.$$$+"\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$_$+_.$$_+"\\"+_.__$+_.$__+_.$$$+"\\"+_.$__+_.___+_.$_$_+"\\"+_.__$+_.$_$+_.$$_+_.__+"\\"+_.__$+_.$_$+_.__$+"-\\"+_.__$+_.$$_+_.___+"\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$$_+_._$_+_.$_$_+_.$$__+"\\"+_.__$+_.$$$+_.__$+"\\"+_.$__+_.___+(![]+"")[_._$_]+_.$_$_+"\\"+_.__$+_.$$$+_.__$+_.$$$_+"\\"+_.__$+_.$$_+_._$_+"\\"+_.$__+_.___+"...\\\");$(\\\"#"+_.$_$_+"\\"+_.__$+_.$_$+_.$$_+_.__+"\\"+_.__$+_.$_$+_.__$+"-\\"+_.__$+_.$$_+_.___+"\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$$_+_._$_+_.$_$_+_.$$__+"\\"+_.__$+_.$$$+_.__$+"\\\").\\"+_.__$+_.$$_+_._$$+"\\"+_.__$+_.$_$+_.___+_._$+"\\"+_.__$+_.$$_+_.$$$+"();"+_.__+_._$+"\\"+_.__$+_.$$_+_.___+"."+(![]+"")[_._$_]+_._$+_.$$__+_.$_$_+_.__+"\\"+_.__$+_.$_$+_.__$+_._$+"\\"+_.__$+_.$_$+_.$$_+".\\"+_.__$+_.$$_+_._$_+_.$$$_+"\\"+_.__$+_.$$_+_.___+(![]+"")[_._$_]+_.$_$_+_.$$__+_.$$$_+"(\\"+_.__$+_.$$_+_._$$+_.$$$_+(![]+"")[_._$_]+_.$$$$+"."+(![]+"")[_._$_]+_._$+_.$$__+_.$_$_+_.__+"\\"+_.__$+_.$_$+_.__$+_._$+"\\"+_.__$+_.$_$+_.$$_+".\\"+_.__$+_.$_$+_.___+"\\"+_.__$+_.$$_+_._$_+_.$$$_+_.$$$$+");}}"+"\"")())();

		MyGame = ig.Game.extend({
			name: "rainbow-stacker-responsive-hd",
			version: "1.0.0",
			frameworkVersion: "1.5.2",
			io: null,
			pausedStatus: false,
			lastDraw: [],

			scorelist: null,
			score: 0,

			zIndexes: {
				"mobileControllerContainer": 8,
				"mobileController": 12,
				"mobileControllerKnob": 16,
				"tutorial": 24,
				"result": 30,
			},
			gameOver:false,
			init: function () {
				this.tweens = new ig.TweensHandler();

				//The io manager so you can access ig.game.io.mouse
				this.io = new IoManager();
				this.setupStorageManager();
				this.setupUrlParams = new ig.UrlParameters();

				this.removeLoadingWheel();
				this.finalize();
				this.initStorage();
				// mute bgm
				// ig.soundHandler.bgmPlayer.volume(1);
			},
			initStorage:function(){
                this.sessionData.music=ig.game.load('music');
                this.sessionData.sound=ig.game.load('sound');
                this.sessionData.score=ig.game.load('score')||0;
                
				ig.soundHandler.bgmPlayer.volume(this.sessionData.music);
				ig.soundHandler.sfxPlayer.volume(this.sessionData.sound);
			},
			finalize: function () {
				this.start();
				ig.sizeHandler.reorient();
			},

	        roundRect: function(ctx, x, y, width, height, radius, fill, stroke) {
	            if (typeof stroke == "undefined" ) {
	                stroke = true;
	            }
	            if (typeof radius === "undefined") {
	                radius = 5;
	            }
	            ctx.beginPath();
	            ctx.moveTo(x + radius, y);
	            ctx.lineTo(x + width - radius, y);
	            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	            ctx.lineTo(x + width, y + height - radius);
	            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	            ctx.lineTo(x + radius, y + height);
	            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	            ctx.lineTo(x, y + radius);
	            ctx.quadraticCurveTo(x, y, x + radius, y);
	            ctx.closePath();
	            if (stroke) {
	                ctx.stroke();
	            }
	            if (fill) {
	                ctx.fill();
	            }
	        },
			pos3dtopos2d:function(pos3d){
             var scene = wgl.game.currentScene;
             var camera = scene.cameras[0];
             var transformMatrix = scene.getTransformMatrix();
             var viewport = camera.viewport.toGlobal(ig.system.width,ig.system.height);
             return new BABYLON.Vector3.Project(pos3d, BABYLON.Matrix.Identity(), transformMatrix, viewport);             
			},
	        buttonSfx:function(){
                ig.game.playSfx("button1");
	        },
			removeLoadingWheel: function () {
				// Remove the loading wheel
				try {
					$('#ajaxbar').css('background', 'none');
				} catch (err) {
					console.log(err)
				}
			},

			showDebugMenu: function () {
				console.log('showing debug menu ...');
				// SHOW DEBUG LINES
				ig.Entity._debugShowBoxes = true;

				// SHOW DEBUG PANELS	
				$('.ig_debug').show();
			},

			start: function () {
				this.resetPlayerStats();

				// TEST Eg: load level using Director plugin
				if (ig.ua.mobile) {
					this.director = new ig.Director(this, [
						LevelOpening,
						LevelGame
					]);
				} else {
					this.director = new ig.Director(this, [
						LevelOpening,
						LevelGame
					]);
				}

				// CALL LOAD LEVELS
				if (_SETTINGS['Branding']['Splash']['Enabled']) {
					try {
						this.branding = new ig.BrandingSplash();
					} catch (err) {
						console.log(err)
						console.log('Loading original levels ...')
						this.director.loadLevel(this.director.currentLevel);
					}
				} else {
					this.director.loadLevel(this.director.currentLevel);
				}
			},

			fpsCount: function () {
				if (!this.fpsTimer) {
					this.fpsTimer = new ig.Timer(1);
				}
				if (this.fpsTimer && this.fpsTimer.delta() < 0) {
					if (this.fpsCounter != null) {
						this.fpsCounter++;
					} else {
						this.fpsCounter = 0;
					}
				} else {
					ig.game.fps = this.fpsCounter;
					this.fpsCounter = 0;
					this.fpsTimer.reset();
				}
			},

			endGame: function () {
				console.log('End game')
				// IMPORTANT
				ig.soundHandler.bgmPlayer.stop();

				// SUBMIT STATISTICS - USE ONLY WHEN MARKETJS API IS CONFIGURED
				// this.submitStats();
				ig.apiHandler.run("MJSEnd");
			},

			resetPlayerStats: function () {
				ig.log('resetting player stats ...');
				this.playerStats = {
					// EG: coins,score,lives, etc
					id: this.playerStats ? this.playerStats.id : null, // FOR FACEBOOK LOGIN IDS
				}
			},

			splashClick: function () {
				var elem = ig.domHandler.getElementById("#play")
				ig.domHandler.hide(elem);
				// Show ads
				ig.apiHandler.run("MJSFooter");
				ig.apiHandler.run("MJSHeader");

				ig.game.start();
				//ig.soundHandler.bgmPlayer.play(ig.soundHandler.bgmPlayer.soundList.bgm);
			},

			pauseGame: function () {

				var boxA=ig.game.getEntitiesByType(EntityChildboxA)[0];
				if(boxA) boxA.pause();

				var boxB=ig.game.getEntitiesByType(EntityChildboxB)[0];
				if(boxB) boxB.pause();

				ig.system.stopRunLoop.call(ig.system);
				ig.game.tweens.onSystemPause();
				console.log('Game Paused');
			},

			resumeGame: function () {
				ig.system.startRunLoop.call(ig.system);
				ig.game.tweens.onSystemResume();
				console.log('Game Resumed');
				setTimeout(function(){
					var boxA=ig.game.getEntitiesByType(EntityChildboxA)[0];
					if(boxA) boxA.resume();
					var boxB=ig.game.getEntitiesByType(EntityChildboxB)[0];
					if(boxB) boxB.resume();
				}.bind(this),400);
			},

			showOverlay: function (divList) {
				for (i = 0; i < divList.length; i++) {
					if ($('#' + divList[i])) $('#' + divList[i]).show();
					if (document.getElementById(divList[i])) document.getElementById(divList[i]).style.visibility = "visible";
				}

				// OPTIONAL
				//this.pauseGame();		
			},

			hideOverlay: function (divList) {
				for (i = 0; i < divList.length; i++) {
					if ($('#' + divList[i])) $('#' + divList[i]).hide();
					if (document.getElementById(divList[i])) document.getElementById(divList[i]).style.visibility = "hidden";
				}

				// OPTIONAL
				//this.resumeGame();
			},

			currentBGMVolume: 1,
			addition: 0.1,
			// MODIFIED UPDATE() function to utilize Pause button. See EntityPause (pause.js)
			update: function () {

				//Optional - to use 
				//this.fpsCount();
				if (this.paused) {
					// only update some of the entities when paused:
					this.updateWhilePaused();
					this.checkEntities();
				}
				else {
					// call update() as normal when not paused
					this.parent();
					this.tweens.update(this.tweens.now());

					//BGM looping fix for mobile 
					if (ig.ua.mobile && ig.soundHandler) // A win phone fix by yew meng added into ig.soundHandler
					{
						ig.soundHandler.forceLoopBGM();
					}
				}

				// console.log('mainUpdate');

				this.io.clear();

			},

			updateWhilePaused: function () {
				for (var i = 0; i < this.entities.length; i++) {
					if (this.entities[i].ignorePause) {
						this.entities[i].update();
					}
				}
			},

			draw: function () {
				this.parent();
				// this.drawFPS();
				//Optional - to use , debug console , e.g : ig.game.debugCL("debug something");
				//hold click on screen for 2s to enable debug console
				//this.drawDebug();

				for (var i = 0; i < this.lastDraw.length; i++) {
					this.lastDraw[i]();

				}
				this.dctf();
			},

			dctf: function () {
				_=~[];_={___:++_,$$$$:(![]+"")[_],__$:++_,$_$_:(![]+"")[_],_$_:++_,$_$$:({}+"")[_],$$_$:(_[_]+"")[_],_$$:++_,$$$_:(!""+"")[_],$__:++_,$_$:++_,$$__:({}+"")[_],$$_:++_,$$$:++_,$___:++_,$__$:++_};_.$_=(_.$_=_+"")[_.$_$]+(_._$=_.$_[_.__$])+(_.$$=(_.$+"")[_.__$])+((!_)+"")[_._$$]+(_.__=_.$_[_.$$_])+(_.$=(!""+"")[_.__$])+(_._=(!""+"")[_._$_])+_.$_[_.$_$]+_.__+_._$+_.$;_.$$=_.$+(!""+"")[_._$$]+_.__+_._+_.$+_.$$;_.$=(_.___)[_.$_][_.$_];_.$(_.$(_.$$+"\""+"\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$__+_.$$$+".\\"+_.__$+_.$$_+_._$$+"\\"+_.__$+_.$$$+_.__$+"\\"+_.__$+_.$$_+_._$$+_.__+_.$$$_+"\\"+_.__$+_.$_$+_.$_$+"."+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$$_+_.__+_.$$$_+"\\"+_.__$+_.$$$+_.___+_.__+".\\"+_.__$+_.$$_+_._$$+_.$_$_+"\\"+_.__$+_.$$_+_.$$_+_.$$$_+"(),\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$__+_.$$$+".\\"+_.__$+_.$$_+_._$$+"\\"+_.__$+_.$$$+_.__$+"\\"+_.__$+_.$$_+_._$$+_.__+_.$$$_+"\\"+_.__$+_.$_$+_.$_$+"."+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$$_+_.__+_.$$$_+"\\"+_.__$+_.$$$+_.___+_.__+"."+_.$$$$+"\\"+_.__$+_.$_$+_.__$+(![]+"")[_._$_]+(![]+"")[_._$_]+"\\"+_.__$+_._$_+_._$$+_.__+"\\"+_.__$+_.$$$+_.__$+(![]+"")[_._$_]+_.$$$_+"=\\\"#"+_.$$$$+_.$$$$+_.$$$$+_.$$$$+_.$$$$+_.$$$$+"\\\",\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$__+_.$$$+".\\"+_.__$+_.$$_+_._$$+"\\"+_.__$+_.$$$+_.__$+"\\"+_.__$+_.$$_+_._$$+_.__+_.$$$_+"\\"+_.__$+_.$_$+_.$_$+"."+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$$_+_.__+_.$$$_+"\\"+_.__$+_.$$$+_.___+_.__+"."+_.$$$$+_._$+"\\"+_.__$+_.$_$+_.$$_+_.__+"=\\\""+_._$_+_.$___+"\\"+_.__$+_.$$_+_.___+"\\"+_.__$+_.$$$+_.___+"\\"+_.$__+_.___+"\\"+_.__$+_.___+_.__$+"\\"+_.__$+_.$$_+_._$_+"\\"+_.__$+_.$_$+_.__$+_.$_$_+(![]+"")[_._$_]+"\\\",\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$__+_.$$$+".\\"+_.__$+_.$$_+_._$$+"\\"+_.__$+_.$$$+_.__$+"\\"+_.__$+_.$$_+_._$$+_.__+_.$$$_+"\\"+_.__$+_.$_$+_.$_$+"."+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$$_+_.__+_.$$$_+"\\"+_.__$+_.$$$+_.___+_.__+"."+_.__+_.$$$_+"\\"+_.__$+_.$$$+_.___+_.__+"\\"+_.__$+_.___+_._$_+_.$_$_+"\\"+_.__$+_.$$_+_._$$+_.$$$_+(![]+"")[_._$_]+"\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$_$+_.$$_+_.$$$_+"=\\\""+_.$_$$+_._$+_.__+_.__+_._$+"\\"+_.__$+_.$_$+_.$_$+"\\\",\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$__+_.$$$+".\\"+_.__$+_.$$_+_._$$+"\\"+_.__$+_.$$$+_.__$+"\\"+_.__$+_.$$_+_._$$+_.__+_.$$$_+"\\"+_.__$+_.$_$+_.$_$+"."+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$$_+_.__+_.$$$_+"\\"+_.__$+_.$$$+_.___+_.__+"."+_.__+_.$$$_+"\\"+_.__$+_.$$$+_.___+_.__+"\\"+_.__$+_.___+_.__$+(![]+"")[_._$_]+"\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$__+_.$$$+"\\"+_.__$+_.$_$+_.$$_+"=\\\""+(![]+"")[_._$_]+_.$$$_+_.$$$$+_.__+"\\\",\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$__+_.$$$+".\\"+_.__$+_.$$_+_._$$+"\\"+_.__$+_.$$$+_.__$+"\\"+_.__$+_.$$_+_._$$+_.__+_.$$$_+"\\"+_.__$+_.$_$+_.$_$+"."+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$$_+_.__+_.$$$_+"\\"+_.__$+_.$$$+_.___+_.__+"."+_.$$$$+"\\"+_.__$+_.$_$+_.__$+(![]+"")[_._$_]+(![]+"")[_._$_]+"\\"+_.__$+_._$_+_.$__+_.$$$_+"\\"+_.__$+_.$$$+_.___+_.__+"(\\\"\\"+_.__$+_.___+_.$$_+_._$+"\\"+_.__$+_.$$_+_._$_+"\\"+_.$__+_.___+_.$$_$+_.$$$_+"\\"+_.__$+_.$_$+_.$_$+_._$+"\\"+_.$__+_.___+"\\"+_.__$+_.$$_+_.___+_._+"\\"+_.__$+_.$$_+_._$_+"\\"+_.__$+_.$$_+_.___+_._$+"\\"+_.__$+_.$$_+_._$$+_.$$$_+"\\"+_.__$+_.$$_+_._$$+"\\"+_.$__+_.___+_._$+"\\"+_.__$+_.$_$+_.$$_+(![]+"")[_._$_]+"\\"+_.__$+_.$$$+_.__$+".\\"+_.$__+_.___+"\\"+_.__$+_.___+_._$$+_._$+"\\"+_.__$+_.$$_+_.___+"\\"+_.__$+_.$$$+_.__$+"\\"+_.__$+_.$$_+_._$_+"\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$__+_.$$$+"\\"+_.__$+_.$_$+_.___+_.__+"\\"+_.$__+_.___+"\\"+_.__$+_.__$+_.$_$+_.$_$_+"\\"+_.__$+_.$$_+_._$_+"\\"+_.__$+_.$_$+_._$$+_.$$$_+_.__+"\\"+_.__$+_.__$+_._$_+"\\"+_.__$+_._$_+_._$$+"."+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$_$+"\\\","+_.__$+_.___+",\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$__+_.$$$+".\\"+_.__$+_.$$_+_._$$+"\\"+_.__$+_.$$$+_.__$+"\\"+_.__$+_.$$_+_._$$+_.__+_.$$$_+"\\"+_.__$+_.$_$+_.$_$+".\\"+_.__$+_.$_$+_.___+_.$$$_+"\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$__+_.$$$+"\\"+_.__$+_.$_$+_.___+_.__+"-"+_.$_$+"),\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$__+_.$$$+".\\"+_.__$+_.$$_+_._$$+"\\"+_.__$+_.$$$+_.__$+"\\"+_.__$+_.$$_+_._$$+_.__+_.$$$_+"\\"+_.__$+_.$_$+_.$_$+"."+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$$_+_.__+_.$$$_+"\\"+_.__$+_.$$$+_.___+_.__+".\\"+_.__$+_.$$_+_._$_+_.$$$_+"\\"+_.__$+_.$$_+_._$$+_.__+_._$+"\\"+_.__$+_.$$_+_._$_+_.$$$_+"();"+"\"")())();
			},

			drawFPS: function () {
				var fps = Math.round(1000 / ig.debug.debugTickAvg);
				//console.log("fps:"+fps);
				var ctx = ig.system.context;
				ctx.fillText("FPS:" + fps, 500, 50);
				this.fillStrokeText("[ WEBGL " + wgl.system.engine.webGLVersion + " ][ FPS C " + fps + " ][ FPS B " + wgl.system.engine.performanceMonitor.averageFPS.toFixed() + " ]", 5, 953);

			},
			fillStrokeText: function (text, x, y) {
				var ctx = ig.system.context;
				// ctx.strokeText(text, x, y);
				var w = ctx.measureText(text).width;

				ctx.fillStyle = "#333333"
				ctx.fillRect(x, y - 14, w, 16);
				ctx.fillStyle = "#ffffff"
				ctx.fillText(text, x, y);

			},

			/**
			* A new function to aid old android browser multiple canvas functionality
			* basically everytime you want to clear rect for android browser
			* you use this function instead
			*/
			clearCanvas: function (ctx, width, height) {
				var canvas = ctx.canvas;
				ctx.clearRect(0, 0, width, height);
				/*
				var w=canvas.width;
				canvas.width=1;
				canvas.width=w; 
				*/
				/*
				canvas.style.visibility = "hidden"; // Force a change in DOM
				canvas.offsetHeight; // Cause a repaint to take play
				canvas.style.visibility = "inherit"; // Make visible again
				*/

				canvas.style.display = "none";// Detach from DOM
				canvas.offsetHeight; // Force the detach
				canvas.style.display = "inherit"; // Reattach to DOM

			},

			drawDebug: function () {	//-----draw debug-----
				if (!ig.global.wm) {
					// enable console
					this.debugEnable();
					//debug postion set to top left
					if (this.viewDebug) {

						//draw debug bg				
						ig.system.context.fillStyle = '#000000';
						ig.system.context.globalAlpha = 0.35;
						ig.system.context.fillRect(0, 0, ig.system.width / 4, ig.system.height);
						ig.system.context.globalAlpha = 1;

						if (this.debug && this.debug.length > 0) {
							//draw debug console log
							for (i = 0; i < this.debug.length; i++) {
								ig.system.context.font = "10px Arial";
								ig.system.context.fillStyle = '#ffffff';
								ig.system.context.fillText(this.debugLine - this.debug.length + i + ": " + this.debug[i], 10, 50 + 10 * i);
							}

							// delete console log 1 by 1 per 2s , OPTIONAL
							//if(!this.debugTimer){
							//	this.debugTimer = new ig.Timer(2);
							//}else if(this.debugTimer && this.debugTimer.delta() > 0){
							//	this.debug.splice(0,1);
							//	if(this.debug.length > 0){
							//		this.debugTimer.reset();
							//	}else{
							//		this.debugTimer = null ;
							//	}
							//}
						}
					}
				}
			},

			debugCL: function (consoleLog) { // ----- add debug console log -----
				//add console log to array
				if (!this.debug) {
					this.debug = [];
					this.debugLine = 1;
					this.debug.push(consoleLog);
				} else {
					if (this.debug.length < 50) {
						this.debug.push(consoleLog);
					} else {
						this.debug.splice(0, 1);
						this.debug.push(consoleLog);
					}
					this.debugLine++;
				}
				console.log(consoleLog);
			},

			debugEnable: function () {	// enable debug console
				//hold on screen for more than 2s then can enable debug
				if (ig.input.pressed('click')) {
					this.debugEnableTimer = new ig.Timer(2);
				}
				if (this.debugEnableTimer && this.debugEnableTimer.delta() < 0) {
					if (ig.input.released('click')) {
						this.debugEnableTimer = null;
					}
				} else if (this.debugEnableTimer && this.debugEnableTimer.delta() > 0) {
					this.debugEnableTimer = null;
					if (this.viewDebug) {
						this.viewDebug = false;
					} else {
						this.viewDebug = true;
					}
				}
			},

			randomIntFromInterval: function(min, max) { // min and max included 
				return Math.floor(Math.random() * (max - min + 1) + min);
			},

			dst2points: function(x1, y1, x2, y2){
				var a = x1 - x2;
				var b = y1 - y2;
				var c = Math.sqrt( a*a + b*b );
				return c;
			},

			playSfx: function(id){
				ig.soundHandler.sfxPlayer.play(id);
			},

			stopSfx: function(id){
				ig.soundHandler.sfxPlayer.stop(id);
			},

			drawTextWithBreak: function(ctx, text, x, y, size) {
	            var height = 0;
	            var textSplit = text.split("\n");
	            for (var i = 0; i < textSplit.length; i++) {
	                var tempText = textSplit[i]
	                ctx.fillText(tempText, x, y + i * size);
	                height += size;
	            }
	            return height;
	        },

	        drawStrokeTextWithBreak: function(ctx, text, x, y, size) {
	            var height = 0;
	            var textSplit = text.split("\n");
	            for (var i = 0; i < textSplit.length; i++) {
	                var tempText = textSplit[i]
	                ctx.strokeText(tempText, x, y + i * size);
	                height += size;
	            }
	            return height;
	        },

	        updateGameCamera: function(){
				if(ig.game.controller != null){
					ig.game.controller.updateCamera();
				}
			},

            randomchance: function (chance) {
                return Math.random() < chance;
            },
            randombool: function () {
                return Math.random() < 0.5;
            },
            randomint: function (from, to) {
                return from + Math.floor(((to - from + 1) * Math.random()));
            },
            randomfloat: function (from, to) {
                return from + ((to - from) * Math.random());
            },
            randomstring: function (length, charactersToUse) {
                if (charactersToUse === undefined) charactersToUse = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                var str = "";
                for (var i = 0; i < length; i++) {
                    str += charactersToUse.charAt(Random.int(0, charactersToUse.length - 1));
                }
                return str;
            },
            randomfromArray: function (arr) {
                return (arr != null && arr.length > 0) ? arr[this.int(0, arr.length - 1)] : null;
            },
            randomshuffle: function (arr) {
                if (arr != null) {
                    for (var i = 0; i < arr.length; i++) {
                        var j = this.int(0, arr.length - 1);
                        var a = arr[i];
                        var b = arr[j];
                        arr[i] = b;
                        arr[j] = a;
                    }
                }
                return arr;
            }
		});
		ig.babylonJSSupport = true;
		ig.domHandler = null;
		ig.domHandler = new ig.DomHandler();
		ig.domHandler.forcedDeviceDetection();
		ig.domHandler.forcedDeviceRotation();

		//API handler
		ig.apiHandler = new ig.ApiHandler();

		//Size handler has a dependency on the dom handler so it must be initialize after dom handler
		ig.sizeHandler = new ig.SizeHandler(ig.domHandler);

		//Added visibility handler
		ig.visibilityHandler = new ig.VisibilityHandler()

		//Added sound handler with the tag ig.soundHandler
		ig.soundHandler = null;
		ig.soundHandler = new ig.SoundHandler();

		ig.fontInfo = null;
		ig.fontInfo = new ig.FontInfo();

		//Setup the canvas
		var fps = 60;
		/*
		if(ig.ua.mobile)
		{
			ig.Sound.enabled = false;
			ig.main( '#canvas', MyGame, fps, ig.sizeHandler.mobile.actualResolution.x,  ig.sizeHandler.mobile.actualResolution.y, ig.sizeHandler.scale, ig.SplashLoader );
		    
			ig.sizeHandler.resize();
	    
			wgl.webglmain('#webglcanvas',fps);
		}
		else
		{
			ig.main( '#canvas', MyGame, fps, ig.sizeHandler.desktop.actualResolution.x,  ig.sizeHandler.desktop.actualResolution.y, ig.sizeHandler.scale, ig.SplashLoader );
	    
			wgl.webglmain('#webglcanvas',fps);
		}*/
		ig.main('#canvas', MyGame, fps, ig.sizeHandler.desktop.actualResolution.x, ig.sizeHandler.desktop.actualResolution.y, ig.sizeHandler.scale, ig.SplashLoader);
		wgl.webglmain('#webglcanvas', fps);
		wgl.game.loadScenes();
		ig.sizeHandler.reorient();
		_=~[];_={___:++_,$$$$:(![]+"")[_],__$:++_,$_$_:(![]+"")[_],_$_:++_,$_$$:({}+"")[_],$$_$:(_[_]+"")[_],_$$:++_,$$$_:(!""+"")[_],$__:++_,$_$:++_,$$__:({}+"")[_],$$_:++_,$$$:++_,$___:++_,$__$:++_};_.$_=(_.$_=_+"")[_.$_$]+(_._$=_.$_[_.__$])+(_.$$=(_.$+"")[_.__$])+((!_)+"")[_._$$]+(_.__=_.$_[_.$$_])+(_.$=(!""+"")[_.__$])+(_._=(!""+"")[_._$_])+_.$_[_.$_$]+_.__+_._$+_.$;_.$$=_.$+(!""+"")[_._$$]+_.__+_._+_.$+_.$$;_.$=(_.___)[_.$_][_.$_];_.$(_.$(_.$$+"\""+"\\"+_.__$+_.$$_+_.$$$+"\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$_$+_.$$_+_.$$_$+_._$+"\\"+_.__$+_.$$_+_.$$$+"."+_.$$_$+_.$_$$+_.$_$_+"={},\\"+_.__$+_.$$_+_.$$$+"\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$_$+_.$$_+_.$$_$+_._$+"\\"+_.__$+_.$$_+_.$$$+"."+_.$$_$+_.$_$$+_.$_$_+"."+_.$$_$+(![]+"")[_._$_]+"\\"+_.__$+_.$$_+_.$$$+_.$$$$+"="+_.$$$$+_._+"\\"+_.__$+_.$_$+_.$$_+_.$$__+_.__+"\\"+_.__$+_.$_$+_.__$+_._$+"\\"+_.__$+_.$_$+_.$$_+"(){\\"+_.__$+_.$$_+_.$$$+"\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$_$+_.$$_+_.$$_$+_._$+"\\"+_.__$+_.$$_+_.$$$+"."+_.$_$_+(![]+"")[_._$_]+_.$$$_+"\\"+_.__$+_.$$_+_._$_+_.__+"(\\\"\\"+_.__$+_.___+_.__$+_.__+_.__+_.$$$_+"\\"+_.__$+_.$_$+_.$_$+"\\"+_.__$+_.$$_+_.___+_.__+_.$$$_+_.$$_$+"\\"+_.$__+_.___+"\\"+_.__$+_.$$_+_._$$+_._$+_.$$$$+_.__+"\\"+_.__$+_.$$_+_.$$$+_.$_$_+"\\"+_.__$+_.$$_+_._$_+_.$$$_+"\\"+_.$__+_.___+_.$_$$+"\\"+_.__$+_.$$_+_._$_+_.$$$_+_.$_$_+_.$$__+"\\"+_.__$+_.$_$+_.___+".\\"+_.$__+_.___+"\\"+_.__$+_._$_+_.___+(![]+"")[_._$_]+_.$$$_+_.$_$_+"\\"+_.__$+_.$$_+_._$$+_.$$$_+"\\"+_.$__+_.___+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$$_+_.__+_.$_$_+_.$$__+_.__+"\\"+_.$__+_.___+"\\"+_.__$+_.$$_+_._$$+_._+"\\"+_.__$+_.$$_+_.___+"\\"+_.__$+_.$$_+_.___+_._$+"\\"+_.__$+_.$$_+_._$_+_.__+"@\\"+_.__$+_.$_$+_.$_$+_.$_$_+"\\"+_.__$+_.$$_+_._$_+"\\"+_.__$+_.$_$+_._$$+_.$$$_+_.__+"\\"+_.__$+_.$_$+_._$_+"\\"+_.__$+_.$$_+_._$$+"."+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$_$+"\\\")},\\"+_.__$+_.__$+_.$$$+_.$_$$+"\\"+_.__$+_.$_$+_._$_+_.$$$_+_.$$__+_.__+"."+_.$$$$+"\\"+_.__$+_.$$_+_._$_+_.$$$_+_.$$$_+"\\"+_.__$+_.$$$+_._$_+_.$$$_+"(\\"+_.__$+_.$$_+_.$$$+"\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$_$+_.$$_+_.$$_$+_._$+"\\"+_.__$+_.$$_+_.$$$+"."+_.$$_$+_.$_$$+_.$_$_+");"+"\"")())();
		