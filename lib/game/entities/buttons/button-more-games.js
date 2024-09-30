ig.module('game.entities.buttons.button-more-games')
.requires(
	'game.entities.buttons.button'
	,'plugins.clickable-div-layer'
)
.defines(function() {
	EntityButtonMoreGames = EntityButton.extend({
		type:ig.Entity.TYPE.A,
		gravityFactor:0,
        icon:new ig.Image('media/graphics/sprites/0_btn-moregames.png'),
        size: new BABYLON.Vector2(140, 160),
		clickableLayer:null,
		link:null,
		newWindow:false,
		div_layer_name:"more-games",
		name:"moregames",
		value:null,
		init:function(x,y,settings){

            if(ig.ua.mobile){
                this.size=new BABYLON.Vector2(180, 200);
            }else{
                this.size=new BABYLON.Vector2(140, 160);
            }

			this.parent(x,y,settings);

            //ig.soundHandler.unmuteAll(true);
			// this.posx=this.pos.x;
			// this.posy=this.pos.y;

			if(ig.global.wm)
			{
				return;
			}

			if(settings.div_layer_name)
			{
				//console.log('settings found ... using that div layer name')
				this.div_layer_name = settings.div_layer_name;
			}
			else
			{
				this.div_layer_name = 'more-games'
			}

			if(_SETTINGS.MoreGames.Enabled)
			{
				// this.anims.idle = new ig.Animation(this.logo,0,[0], true);
				// this.currentAnim = this.anims.idle;

				if(_SETTINGS.MoreGames.Link)
				{
					this.link=_SETTINGS.MoreGames.Link;
				}
				if(_SETTINGS.MoreGames.NewWindow)
				{
					this.newWindow = _SETTINGS.MoreGames.NewWindow;
				}
				this.clickableLayer = new ClickableDivLayer(this);
			}
			else
			{
				this.kill();
			}

            ig.game.sortEntitiesDeferred();
		},
		draw:function(){
			this.parent();

            if(!this.control.uiStatus) return;

            var ctx=ig.system.context;
            ctx.strokeStyle='rgba(0,0,0,1)';

            ctx.save();
            ctx.drawImage(
            	this.icon.data,
                0,
                0,
                this.icon.width,
                this.icon.height,
                this.pos.x,
                this.pos.y,
                this.size.x,
                this.size.y
            );
            ctx.restore();

		},
		update:function(){
			this.parent();
			// this.pos.x=this.posx;
			// this.pos.y=this.posy;
			if(this.clickableLayer){
				this.clickableLayer.update(this.pos.x,this.pos.y,this.size.x,this.size.y);
			}
		},
        show:function()
        {
            var elem = ig.domHandler.getElementById("#"+this.div_layer_name);
            if (elem) { ig.domHandler.show(elem); }
        },
        hide:function()
        {
            var elem = ig.domHandler.getElementById("#"+this.div_layer_name);
            if (elem) { ig.domHandler.hide(elem); }
        },
		clicked:function()
		{	
			if(ig.game.pausedStatus) return;
	        ig.game.buttonSfx();

		},
		clicking:function()
		{

		},
		released:function()
		{

		}
	});
});