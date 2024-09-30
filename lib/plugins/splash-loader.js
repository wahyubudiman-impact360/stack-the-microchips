ig.module('plugins.splash-loader')
    .requires(
        'impact.loader',
        'impact.animation'
    )
    .defines(function() {
        ig.SplashLoader = ig.Loader.extend({
            loaderStatus: 0,
            tapToStartDivId: "tap-to-start",

            loadingBar: new ig.Image('media/graphics/sprites/0_loading-bar.png'),
            loadingBarFill: new ig.Image('media/graphics/sprites/0_loading-bar-fill.png'),
            ctx: null,
            rainbowLetters: [],
            stackerLetters: [],
            rainbow0: {},
            rainbow1: {},
            rainbow2: {},
            rainbow3: {},
            rainbow4: {},
            rainbow5: {},
            rainbow6: {},
            titleTurnIndex: 0,
            titleAlp: 1,
            minus: true,
            h: 0,

            rainbowX: [33*1.6, 102*1.6, 155*1.6, 208*1.6, 277*1.6, 347*1.6, 430*1.6],
            stackerX: [11, 79, 151, 220, 293, 365, 435],

            init: function(gameClass, resources) {

                this.parent(gameClass, resources);

                var game = ig.domHandler.getElementById('#game');
                var webglgame = ig.domHandler.getElementById('#webgl');

                ig.domHandler.setZIndex(game, 1);
                ig.domHandler.setZIndex(webglgame, 0);

                this.processText();

                // ADS
                ig.apiHandler.run("MJSPreroll");

                this.ctx = ig.system.context;
            },

            end: function() {
                this._endParent = this.parent;
                this._drawStatus = 1;
                this.loaderStatus = 1;

                if(!wgl.game.ready){
                    // wgl.game.loadScenes();
                    this.isLoading3dScene = true;
                    // this.draw();
                    setTimeout(function(){
                        this.draw();    
                    }.bind(this), 300)                    
                }else{
                    wgl.game.setScene("forest");

                    if (_SETTINGS['TapToStartAudioUnlock']['Enabled']) {
                    this.tapToStartDiv(function() {
                            /* play game */
                            this._endParent();
                            if (typeof(ig.game) === 'undefined' || ig.game == null) {
                                ig.system.setGame(this.gameClass);
                                this.loaderStatus = 2;
                            }
                        }.bind(this));
                    } else {
                        /* play game */
                        this._endParent();
                        if (typeof(ig.game) === 'undefined' || ig.game == null) {
                            ig.system.setGame(this.gameClass);
                            this.loaderStatus = 2;
                        }
                    }
                }
            },
            tapToStartDiv: function(onClickCallbackFunction) {
                var _this = this;

                this.desktopCoverDIV = document.getElementById(this.desktopCoverDIVID);

                // singleton pattern
                if (this.desktopCoverDIV) {
                    return;
                }

                /* create DIV */
                this.desktopCoverDIV = document.createElement("div");
                this.desktopCoverDIV.id = this.desktopCoverDIVID;
                this.desktopCoverDIV.setAttribute("class", "play");
                this.desktopCoverDIV.setAttribute("style", "position: absolute; display: block; z-index: 999999; background-color: rgba(23, 32, 53, 0.7); visibility: visible; font-size: 10vmin; text-align: center; vertical-align: middle; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;");
                this.desktopCoverDIV.innerHTML = "<div style='color:white;background-color: rgba(255, 255, 255, 0.3); border: 2px solid #fff; font-size:20px; border-radius: 5px; position: relative; float: left; top: 50%; left: 50%; transform: translate(-50%, -50%);'><div style='padding:20px 50px; font-family: montserrat;'>" + _STRINGS["Splash"]["TapToStart"] + "</div></div>";


                /* inject DIV */
                var parentDIV = document.getElementById("play").parentNode || document.getElementById("ajaxbar");
                parentDIV.appendChild(this.desktopCoverDIV);

                /* reize DIV */
                try {
                    if (typeof(ig.sizeHandler) !== "undefined") {
                        if (typeof(ig.sizeHandler.coreDivsToResize) !== "undefined") {
                            ig.sizeHandler.coreDivsToResize.push(("#" + this.desktopCoverDIVID));

                            if (typeof(ig.sizeHandler.reorient) === "function") {
                                ig.sizeHandler.reorient();
                            }
                        }
                    } else if (typeof(coreDivsToResize) !== "undefined") {
                        coreDivsToResize.push(this.desktopCoverDIVID);
                        if (typeof(sizeHandler) === "function") {
                            sizeHandler();
                        }
                    }
                } catch (error) {
                    console.log(error);
                }

                /* click DIV */
                this.desktopCoverDIV.addEventListener("click", function() {
                    ig.soundHandler.unlockWebAudio();

                    /* hide DIV */
                    this.setAttribute("style", "visibility: hidden;");

                    /* end function */
                    if (typeof(onClickCallbackFunction) === "function") {
                        onClickCallbackFunction();
                    }
                });
            },
            processText: function () {

                this.rainbowText = "RAINBOW";
                this.stackerText = "STACKER";


                this.textSet(80, "white");
                this.rainbowWidth = 477*1.6;
                this.rainbowStart = ig.system.width / 2 - this.rainbowWidth / 2;


                var rainbowLetters = this.rainbowText.split("");

                for (var i = 0; i < rainbowLetters.length; i++) {

                    this["rainbow" + i] = {
                        tx: rainbowLetters[i],
                        x: this.rainbowX[i],
                        offX: 0,
                        scX: 1,
                        scY: 1,
                        h: (i / 7 * 360)
                    }

                    this.rainbowLetters.push(this["rainbow" + i]);

                }

                this.textSet(60, "white");
                this.stackerWidth = 179*1.6;

                var stackerLetters = this.stackerText.split("");

                this.stackerGap = Math.floor((this.rainbowWidth * 0.95 - this.stackerWidth) / (this.stackerText.length - 1));

                this.stackerStart = ig.system.width / 2 - this.rainbowWidth / 2 * 0.95;

                for (var i = 0; i < stackerLetters.length; i++) {

                    this.stackerLetters.push({
                        tx: stackerLetters[i],
                        x: this.stackerX[i]*1.6,
                        offX: 0,
                        scX: 1,
                        scY: 1,
                        alp: this.titleAlp
                    });

                }
            },

            drawTitle: function () {

                for (var i = 0; i < 7; i++) {

                    this.textDraw({
                        tx: this.rainbowLetters[i].tx,
                        px: 120,
                        x: this.rainbowStart + this.rainbowLetters[i].x,
                        y: ig.system.height * 0.24,
                        col: 'hsl(' + this.rainbowLetters[i].h + ',80%,80%)',
                        alp: this.titleAlp,
                        scX: this.rainbowLetters[i].scX*1.6,
                        scY: 0.85*1.6
                    });


                }

                for (var i = 0; i < 7; i++) {

                    if(ig.ua.mobile){
                        var posY=ig.system.height*0.24+130;
                    }else{
                        var posY=ig.system.height*0.31;
                    }

                    this.textDraw({
                        tx: this.stackerLetters[i].tx,
                        px: 100,
                        x: this.stackerStart + this.stackerLetters[i].x,
                        y: posY,
                        col: "white",
                        alp: this.titleAlp
                    });


                }


            },
            textSet: function (pix, col, font, ctx) {


                var ctx = ctx || ig.system.context;

                var font = font || "typo";
                this.ctxRef = ctx;
                ctx.font = pix + "px " + font;
                ctx.fillStyle = col;

            },

            textW: function (targ) {

                return this.ctxRef.measureText(targ).width;

            },


            draw: function() {

                this.ctx.fillStyle = "#46384a";
                this.ctx.fillRect(0, 0, ig.responsive.width, ig.responsive.height);

                this._drawStatus += (this.status - this._drawStatus) / 5;


                this.drawTitle();

                var anchor = ig.responsive.toAnchor(0, 320, "center-middle");

                this.ctx.drawImage(
                    this.loadingBar.data,
                    0,
                    0,
                    this.loadingBar.width,
                    this.loadingBar.height,
                    anchor.x-this.loadingBar.width/2,
                    anchor.y-this.loadingBar.height/2,
                    this.loadingBar.width,
                    this.loadingBar.height
                );

                this.ctx.drawImage(
                    this.loadingBarFill.data,
                    0,
                    0,
                    this.loadingBarFill.width*this._drawStatus,
                    this.loadingBarFill.height,
                    anchor.x-this.loadingBarFill.width/2,
                    anchor.y-this.loadingBarFill.height/2,
                    this.loadingBarFill.width*this._drawStatus,
                    this.loadingBarFill.height
                );
                this.ctx.restore();

               if(this.isLoading3dScene){
                    if(wgl.game.ready){
                        setTimeout(function(){
                            this.end();    
                        }.bind(this), 300)
                    }else{
                        this.end();
                    }
                }

                
            },


            textDraw: function (targ) {
                var rot = targ.rot ? targ.rot : 0,
                    tx = targ.tx ? targ.tx : 0,
                    dx = targ.x ? targ.x : 0,
                    dy = targ.y ? targ.y : 0,
                    scX = targ.scX == undefined ? 1 : targ.scX,
                    scY = targ.scY == undefined ? 1 : targ.scY,
                    textScX = targ.scX == undefined ? 1 : targ.scX,
                    textScY = targ.scY == undefined ? 1 : targ.scY,
                    stroke = targ.stroke ? targ.stroke : false,
                    strokeAlp = targ.strokeAlp == undefined ? 1 : targ.strokeAlp,
                    strokeColour = targ.strokeColour ? targ.strokeColour : "black",
                    alp = targ.alp == undefined ? 1 : targ.alp,
                    col = targ.col ? targ.col : this.ctx.fillStyle,
                    font = targ.font || "typo",
                    px = targ.px || 10,
                    strokeLine = targ.strokeLine || 3,
                    align = targ.align || "center";

                if (alp == 0) return;
                
                var ctx = targ.ctx || ig.system.context;
                this.ctxRef = targ.ctx || ig.system.context;

                //var ctx =ig.system.context;
                ctx.font = px + "px " + font;

                if (targ.maxWidth != undefined) {
                    if (this.textW(tx) * scX > targ.maxWidth) {

                        textScX = (targ.maxWidth) / this.textW(tx);
                        textScY = scY / scX * textScX;
                    }
                }

                if (align == "left") {
                    dx += this.textW(tx) * 0.5 * textScX;
                } else if (align == "right") {
                    dx -= this.textW(tx) * 0.5 * textScX;
                }
                ctx.save();

                var fontH = ctx.measureText('M').width * textScY;
                ctx.translate(dx, dy + fontH / 2);
                ctx.scale(textScX, textScY);

                var ang = rot ? ((2 * Math.PI) / 360) * rot : 0;
                ctx.rotate(ang);

                ctx.fillStyle = col;

                if (stroke == true) {

                    ctx.globalAlpha = strokeAlp;
                    ctx.lineWidth = strokeLine;
                    ctx.lineCap = "round";
                    ctx.strokeStyle = strokeColour;
                    ctx.strokeText(tx, -this.textW(tx) / 2, 0);
                }

                ctx.globalAlpha = alp;
                ctx.fillText(tx, -this.textW(tx) / 2, 0);
                ctx.restore();

            },

        });
    });