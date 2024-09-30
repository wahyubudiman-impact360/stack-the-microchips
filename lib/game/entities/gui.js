ig.module('game.entities.gui')
.requires(
    'game.entities.plain'
)
.defines(function() {
    EntityGui = EntityPlain.extend({
        size:{x:40,y:40},
        pos:{x:1,y:1},
        zIndex:10,
        comboOffX:0,
        comboAlp:0,
        scoreSc:1,
        scoreAlp:0,
        bestAlp:0,
        rainbowLetters:[],
        stackerLetters:[],
        rainbow0:{},
        rainbow1:{},
        rainbow2:{},
        rainbow3:{},
        rainbow4:{},
        rainbow5:{},
        rainbow6:{},
        titleTurnIndex:0,
        titleAlp:1,
        rainbowX:[33*1.6,102*1.6,155*1.6,208*1.6,277*1.6,347*1.6,430*1.6],
        stackerX:[11,79,151,220,293,365,435],
        rainbowWidth:477,
        init:function(x,y,settings){
            this.parent(x,y,settings);

            if(ig.global.wm){return;}

            this.ctx=ig.system.context;
            this.processText();

            this.tweenF("turnLetter0");

        },
        updatePosition:function(){
            this.rainbowStart=ig.system.width/2-this.rainbowWidth/2;
            this.stackerStart=ig.system.width/2-this.rainbowWidth/2*0.95;
        },
        processText:function(){

            this.rainbowText="RAINBOW";
            this.stackerText="STACKER";
            this.rainbowWidth=477*1.6;
            this.rainbowStart=ig.system.width/2-this.rainbowWidth/2;
            var rainbowLetters=this.rainbowText.split("");
            for(var i=0;i<rainbowLetters.length;i++){
                this["rainbow"+i]={tx:rainbowLetters[i],
                                          x:this.rainbowX[i],
                                          offX:0,
                                          scX:1,
                                          scY:1,
                                          h:(i/7*360)
                                         }

                this.rainbowLetters.push(this["rainbow"+i]);
            }


            this.textSet(40,"white");
            this.stackerWidth=179;
            var stackerLetters=this.stackerText.split("");
            this.stackerGap=Math.floor((this.rainbowWidth*0.95-this.stackerWidth)/(this.stackerText.length-1));
            this.stackerStart=ig.system.width/2-this.rainbowWidth/2*0.95;

            for(var i=0;i<stackerLetters.length;i++){
                this.stackerLetters.push({tx:stackerLetters[i],
                                              x:this.stackerX[i]*1.6,
                                              offX:0,
                                              scX:1.6,
                                              scY:1.6,
                                              alp:this.titleAlp
                                         });
            }
        },
        tweenF: function(num,targ) {
            switch(num) {
                case "combo":
                        this.comboAlp=1;
                        this.comboOffX=0;
                        this.tweener("this",{comboAlp:0,comboOffX:-30},0.1,"combo3",0.3);
                break;
                case "combo3":
                        this.main.score+=this.main.combo;
                        this.tweener("this",{scoreSc:1.2},0.1,"combo4");
                break;
                case "combo4":
                        this.tweener("this",{scoreSc:1},0.2);
                break;
                case "best":
                        this.tweener("this",{bestAlp:1},0.2);
                break;
                case "score":
                        this.tweener("this",{scoreAlp:1},0.3);
                break;
                case "turnLetter0":
                        this.tweener("rainbow"+this.titleTurnIndex,{scX:-1},0.2,"turnLetter1");
                break;
                case "turnLetter1":
                        this.tweener("rainbow"+this.titleTurnIndex,{scX:1},0.3,"turnLetter2",0.2);
                break;
                case "turnLetter2":
                        var random=Math.floor(Math.random()*7);
                        if( this.titleTurnIndex==random){
                            this.titleTurnIndex=(this.titleTurnIndex+2)%7;
                        }else{
                            this.titleTurnIndex=random%7;
                        }
                        this.tweenF("turnLetter0");
                break;
                case "fadeOutTitle":
                        this.tweener("this",{titleAlp:0},0.4,"startGame");
                break;
                case "startGame":
                        this.tweenF("score");
                        this.main.startGame();
                break;
            }

        },

        update:function(){
            this.parent();
            this.updatePosition();
        },
        drawTitle:function(){
            for(var i=0;i<7;i++){
                    this.textDraw({tx:this.rainbowLetters[i].tx,
                               px:120,
                               x:this.rainbowStart+this.rainbowLetters[i].x,
                               y:ig.system.height*0.24,
                               col:'hsl('+this.rainbowLetters[i].h +',80%,80%)',
                               alp:this.titleAlp,
                               scX:this.rainbowLetters[i].scX*1.6,
                               scY:0.85*1.6
                    });
            }

            for(var i=0;i<7;i++){
                if(ig.ua.mobile){
                    var posY=ig.system.height*0.24+130;
                }else{
                    var posY=ig.system.height*0.31;
                }
                this.textDraw({tx:this.stackerLetters[i].tx,
                           px:100,
                           x:this.stackerStart+this.stackerLetters[i].x,
                           y:posY,
                           col:"white",
                           alp:this.titleAlp
                    });                    
            }
        },
        draw:function(){
            this.parent();
            if(!this.control.uiStatus) return;

            if(ig.global.wm){return;}
            this.drawTitle();
         },

    });
});
