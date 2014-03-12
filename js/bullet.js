function Bullet(range,startX,startY,directionX,directionY,effect){
	
    var speed = 4;    
    var radius = 2;
        	
    var speedX = directionX * speed;
    var speedY = directionY * speed;

	// the distance between current position and the starting point
	var distance = 0; 
    this.cx = startX;
    this.cy = startY;
	
	this.isDisposed = false;	
	
	this.draw = function(context){    		
		context.beginPath();    			
		context.arc(this.cx,this.cy,radius,0,Math.PI*2,true);		
		context.fill();
	};
	this.update = function(){

		this.cx += speedX;
		this.cy += speedY;
		distance += speed;
		
		if(distance >= range)
			this.isDisposed = true;
	};
	
	this.collide = function(damage, enemies){
		for(var i = 0; i < enemies.length; i++) 
		{
			var e = enemies[i];
			
			if(!e.isDisposed && e.contain(this.cx, this.cy))
			{
				if(effect && effect != Effects.None)
				{
					e.setEffect(effect);					
				}
				e.hp -= damage;				
				this.isDisposed = true;
				return;
				
			}
		}
	};
}
