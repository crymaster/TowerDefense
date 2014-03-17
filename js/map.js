function Map(){		

	this.level = _selectedLevel;
	this.difficulty = _selectedDifficulty;
	
	// land buffer
	this.land_buffer = document.createElement("canvas");
	this.land_buffer.width = WIDTH;
	this.land_buffer.height = HEIGHT;
	
	this.land_context = this.land_buffer.getContext("2d");
	this.land_bufferData;
	
	// towers buffer
	this.towers_buffer = document.createElement("canvas");
	this.towers_buffer.width = WIDTH;
	this.towers_buffer.height = HEIGHT;
	
	this.towers_context = this.towers_buffer.getContext("2d");
	this.towers_bufferData;
	
	this.enemies;
	this.towers;
	this.lastAddEnemy = 0;
	this.addEnemyDelay = 1000;
	this.selectedTower = new Tower(0, 0);	
	
	// event
	this.onReset;
	this.onFinishedWave; 
	this.onFinishedLevel;
	this.onFinishedGame;
	
	// show message function
	this.message;
	this.messageStartTime;
	this.messageDelay = 2000;
	this.onMessageClosed;
}
Map.prototype.showMessage = function(message, onMessageClosed){
	this.message = message;
	this.messageStartTime = (new Date()).getTime();	
	this.onMessageClosed = onMessageClosed;
}
Map.prototype.nextWave = function(){
	if(this.wavesCounter < this.levelData.numWaves)
	{
		this.wavesType = Math.floor(Math.random()*4);
		this.waveHP = Math.ceil((this.levelData.HP + this.wavesCounter * 85 + this.level * 10 + 40)*(4+this.difficulty)/4*(8 - this.wavesType)/7);
		this.waveSpeed = 1 + this.wavesCounter*0.05 + this.difficulty/4 + this.wavesType/5 - 0.5;		
		this.enemiesCounter = 0;
		this.wavesCounter ++;
	}
}
Map.prototype.containTower = function(x, y){
	for(var i in this.towers)
	{		
		if(this.towers[i].contain(x, y))
		{
			this.selectedTower = this.towers[i];
			return true;
		}
	}
	return false;
}
Map.prototype.onmousemove = function(x, y){
	// if selected tower wasn't placed on the map, change it's position
	if(this.selectedTower && !this.selectedTower.isPlaced){
		this.selectedTower.setPosition(x - HALF_UNIT_SIZE, y - HALF_UNIT_SIZE);		
	}
}
Map.prototype.onmousedown = function(x, y){
		
	if(this.containTower(x, y))
	{ }
	// check if tower can be placed here
	else if(this.selectedTower
	&& !this.selectedTower.isPlaced 
	&& this.money >= this.selectedTower.price
	&& this.contain(this.land_bufferData,this.selectedTower.cx, this.selectedTower.cy)
	&& !this.contain(this.towers_bufferData,this.selectedTower.cx, this.selectedTower.cy)){
		
		// draw a circle place-holder for tower 
		this.towers_context.fillStyle = "blue";
		this.towers_context.beginPath();
		this.towers_context.arc(x, y, UNIT_SIZE, 0 , 2 * Math.PI, false);
		this.towers_context.fill();	
		this.towers_bufferData = this.towers_context.getImageData(0,0,WIDTH,HEIGHT);
		
		this.towers.push(this.selectedTower);
		this.money -= this.selectedTower.price;
		this.selectedTower.isPlaced = true;		
		this.selectedTower = null;
		
		
	}else
		this.selectedTower = null;		
}
Map.prototype.reset = function(ignoreEvent){	
	
	if(this.level == MAPS.length)
		this.level = _selectedLevel;
			
	this.selectedTower = null;
	this.waveHP = NaN;
	this.waveSpeed = NaN;
	this.playerLife = 15 - _selectedDifficulty * 3;
	_selectedCategory = 0;
	this.levelData = MapFactory.getData(this.level);// MAPS[this.level];	
	this.money = 600 - _selectedDifficulty * 50;
	this.enemies = [];
	this.towers = [];
	
	this.wavesCounter = 0;
	this.enemiesCounter = -1;
	
	this.towers_context.clearRect(0, 0, WIDTH, HEIGHT);	
	this.towers_bufferData = this.towers_context.getImageData(0,0,WIDTH,HEIGHT);
	
	//this.land_context.fillStyle = "Sienna";
	//this.land_context.fillRect(0, 0, WIDTH, HEIGHT);
	switch (_selectedLevel) {
		case 0:	this.land_context.drawImage(_images.stone_texture,0,0); break;
		case 1: this.land_context.drawImage(_images.grass_texture,0,0); break;
		case 2: this.land_context.drawImage(_images.sand_texture,0,0); break;
	}
	this.land_context.save();
	this.land_context.strokeStyle = "rgba(126,18,128,1)";
	this.land_context.globalCompositeOperation = "destination-out";

	this.land_context.lineWidth = UNIT_SIZE * 1.75;
	this.land_context.lineJoin = "round";
	
	for(var i = 0; i < this.levelData.roadsX.length; i++)
	{
		this.land_context.beginPath();
		
		var roadX = this.levelData.roadsX[i];
		var roadY = this.levelData.roadsY[i];
		this.land_context.moveTo(roadX[0], roadY[0]);
		for(var j = 1;j < roadX.length; j++)
		{
			this.land_context.lineTo(roadX[j],roadY[j]);	
		}
		
		this.land_context.stroke();
	}
	this.land_context.restore();	
	
	this.land_bufferData = this.land_context.getImageData(0,0,WIDTH,HEIGHT);
	
	if(!ignoreEvent && this.onReset)
		this.onReset();
}


Map.prototype.draw = function(context){
	
	context.drawImage(this.land_buffer,0,0);
	
	for(x in this.towers)
		this.towers[x].draw(context);	
	
	for(var i = this.enemies.length - 1; i >= 0; i--)
		this.enemies[i].draw(context);			
	
	// draw the shooting range of selected tower	
	if(this.selectedTower && (this.selectedTower.isPlaced || this.selectedTower.price <= this.money)){
		var x = this.selectedTower.cx;
		var y = this.selectedTower.cy;
		
		this.selectedTower.draw(context);
		
		if(this.selectedTower.isPlaced)
			context.fillStyle = "rgba(255,255,255,0.3)";
		else if(this.contain(this.land_bufferData, x, y) && 
			!this.contain(this.towers_bufferData, x, y))
			context.fillStyle = "rgba(255,255,0,0.3)";
		else
			context.fillStyle = "rgba(255,0,0,0.3)";
		context.beginPath();
		context.arc(x, y, this.selectedTower.shootingRange, 0 , 2 * Math.PI, false);
		context.fill();
	}
	
	// draw message
	if(this.message)
	{
		context.save();
		context.fillStyle = "rgba(255,255,255,0.8)";
		context.fillRect(10,40,WIDTH-20,HEIGHT-80);
		context.fillStyle = "black";
		context.font = "20px Calibri";
		context.textAlign = "center";
		context.fillText(this.message, WIDTH/2,HEIGHT/2);
		context.restore();
	}
}
Map.prototype.update = function(){
	if(this.playerLife == 0)
		return;
		
	// check to close the message popup
	var tick = (new Date()).getTime();
	if(this.message && tick - this.messageStartTime >= this.messageDelay)
	{
		this.message = null;
		if(this.onMessageClosed)
			this.onMessageClosed();
	}
	
	var self = this;
	if(this.wavesCounter <= this.levelData.numWaves &&  this.enemiesCounter != -1)
	{		
		
		if(this.enemiesCounter < this.levelData.numEnemies)
		{
			// generate new	enemy
			if(tick - this.lastAddEnemy >= this.addEnemyDelay)
			{
				this.lastAddEnemy = tick;
				var roadIndex = Math.floor(Math.random()*this.levelData.roadsX.length);
				var e = new Enemy(this.wavesType, this.waveHP, this.waveSpeed, this.levelData.roadsX[roadIndex], this.levelData.roadsY[roadIndex], 
							this.levelData.lengths[roadIndex]);
				e.onReachedGoal = function(){					
					self.playerLife --;
					if(self.playerLife == 0)
					{
	
						if(confirm("Game Over! \n Do you want to try again?"))
							self.reset();
						else
						{						
							if(self.onFinishedGame)
								self.onFinishedGame();
						}
						
					}
				};
				this.enemies.push(e);				
				this.enemiesCounter ++;
			}
		}
		// finish a wave
		else if(this.enemies.length == 0)
		{		
			this.enemiesCounter = -1;		
			if(this.wavesCounter == this.levelData.numWaves)
			{				
				if(this.onFinishedLevel)				
					this.onFinishedLevel();	
				this.level ++;
				
				/* if(this.level == MAPS.length)
				{	 */			
					var a = confirm("You have finished all levels!\n Do you want to try again?");	
					if(a)
					{
						this.level = 0;
						this.reset();
					}else
						if(this.onFinishedGame)
							this.onFinishedGame();
				/* }
				else
				{
					this.showMessage("Level " + this.level + " Completed!",this.reset);											
				} */
				return;
			}else
				if(this.onFinishedWave)
					{
						this.money += 15 + this.wavesCounter*2 - this.difficulty;
						this.onFinishedWave();						
					}
			
		}
	}
	var i = 0;
	var length = this.enemies.length;
	
	while(i < length)
	{	
		if(!this.enemies[i])
			break;
		else if(this.enemies[i].isDisposed)
		{
			if(this.enemies[i].isDead)
				this.money += 7 + this.wavesCounter + this.wavesType + this.difficulty;
			var e = this.enemies.splice(i,1);
			
			delete e;
			e = null;
			
			length --;
		}else
		{			
			this.enemies[i++].update();			
		}
	}
	
	for(var x in this.towers)
		this.towers[x].update(this.enemies);	
}
Map.prototype.contain = function(imageData, x, y){

	if(!imageData)
		return false;
	var index = Math.floor((x+y*WIDTH)*4+3);
	return imageData.data[index]!=0;
}
