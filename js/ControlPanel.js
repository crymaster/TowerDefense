var COUNTDOWN_SECS = 20;
var COLORS = ["Wheat", "Green", "Blue", "Indigo"];

function ControlPanel(left, top, width, height, map){	
	this.map = map;
	
	this.towerButtons = [];
	this.actionButtons = [];
	
	this.selectedItem = null;
	
	this.left = left || 0;
	this.top = top || 0;	
	this.width = width;
	this.height = height;
	
	this.countDownSeconds = COUNTDOWN_SECS;
	
	var reset = function(){
		self.countDownSeconds = COUNTDOWN_SECS;	
	};
	var self = this;
	// add tower types button
	for(var i = 0;i < 4; i++)
	{		
		this.addItem(50 * i + 5, 10, 40, 30, COLORS[i], COLORS[i]);		
	}
	
	
	// action buttons
	this.map.onFinishedWave = function(){
		
		reset();		
	};
	this.map.onFinishedLevel = function(){
	
		reset();		
	};
	this.map.onReset = function(){	
	
		reset();		
	};
	
	var width =  80;
	// upgrade button
	this.addItem(10, 320, width, 20, "gray", "Upgrade", function(){
		if(map.selectedTower && map.selectedTower.isPlaced && map.money >= map.selectedTower.upgradePrice)
		{
			var price = map.selectedTower.upgradePrice
			if(map.selectedTower.upgrade())
				map.money -= price;
			
		}
	});
	
	// sell button
	this.addItem(100, 320, width, 20, "gray", "Sell", function(){
		alert("Not yet implemented!");
	});
	
	// next wave button
	this.addItem(10, 370, width, 20, "gray", "Next Wave", function(){
		// alert("Not yet implemented!");
		if(self.countDownSeconds > 0)
		{
			self.countDownSeconds = 0;
			self.map.nextWave();
		}
	});	
	// Reset button
	this.addItem(100, 370, width, 20, "gray", "Reset", function(){		
		self.countDownSeconds = COUNTDOWN_SECS;	
		reset();
		self.map.reset(true);
	});	
	this.updateDelay = 1000;
	this.lastUpdate = 0;
}
ControlPanel.prototype.update = function() {
	if(this.countDownSeconds == 0)
		return;
	var tick = (new Date()).getTime();
	if(tick - this.lastUpdate >= this.updateDelay)
	{
		this.lastUpdate = tick;
		this.countDownSeconds --;
		if(this.countDownSeconds == 0)
			this.map.nextWave();
	}
};
ControlPanel.prototype.draw = function(context) {	
	context.fillStyle = "LightGray";
	context.fillRect(this.left, this.top, this.width, this.height);
	context.save();
	context.font = "10px Arial";
    for (var i = this.towerButtons.length-1; i>=0; i--) {
		var button = this.towerButtons[i];
		/*context.fillStyle = button.color;
		context.fillRect(button.x, button.y, button.width, button.height);
		*/
		var sprite = _sprites.sprites["tower"+i];
		
		sprite.draw(context, button.x, button.y, button.width, button.height);
		if(button.isSelected)
		{
			context.save();
			context.strokeStyle = "red";
			context.strokeRect(button.x,button.y,button.width,button.height);
			context.restore();
		}
		context.beginPath();
		/*context.fillStyle = "white";
		
		context.fillText(button.text, button.x + 5, button.y + 10);
		context.fill();
		*/
    }
	for (var i = this.actionButtons.length-1; i>=0; i--) {
		var button = this.actionButtons[i];
		context.fillStyle = button.color;
		context.fillRect(button.x, button.y, button.width, button.height);
				
		context.beginPath();
		context.fillStyle = "white";
		context.fillText(button.text, button.x + 5, button.y + 10);
		context.fill();
		
    }
	context.restore();
	
	context.fillStyle = "lightyellow";
	context.fillRect(this.left + 10, this.top + 200, this.width - 20, 110)
	context.fillStyle = "black";
	context.fillText("Map Level: " + (this.map.level + 1), this.left + 10, this.top + 220);
	context.fillText("Life: " + this.map.playerLife, this.left + 10, this.top + 240);
	context.fillText("Money: " + this.map.money + "$", this.left + 10, this.top + 260);
	context.fillText("Wave: " + this.map.wavesCounter, this.left + 10, this.top + 280);
	context.fillText("HP: " + this.map.waveHP, this.left + 10, this.top + 300);
	context.fillText("Speed: " + this.map.waveSpeed * 10, this.left + 90, this.top + 300);
	if(this.countDownSeconds > 0)
	{
		
		context.fillText("Remaining: " + this.countDownSeconds + " seconds", this.left + 10, this.top + 360);
	}
	
	if(this.map.selectedTower)
		this.drawTowerInfo(context, this.map.selectedTower);
	
}
ControlPanel.prototype.drawTowerInfo = function(context, tower){		
	
	context.fillStyle = "black";	
	var left = this.left + 10;
	context.fillText("Effect: " + Effects.getName(tower.effect), left, this.top + 60);
	context.fillText("Level: " + tower.level, left, this.top + 80);
	context.fillText("Range: " + tower.shootingRange, left, this.top + 100);
	context.fillText("Rate of Fire: " + Math.floor((1000 / tower.fireDelay) * 10), left, this.top + 120);
	context.fillText("Damage: " + tower.damage, left, this.top + 140);
	context.fillText("Rotation Speed: " + Math.floor(tower.rotationSpeed * 100), left, this.top + 160);
	context.fillText("Price: " + tower.price , left, this.top + 180);
}
ControlPanel.prototype.onmousedown = function(x, y){
	this.selectAt(x, y);			
	
}
ControlPanel.prototype.addItem = function(x, y, width, height, color, text, onclick){
	var button = new Button;
	button.x = x + this.left;
	button.y = y + this.top;
	button.width = width;
	button.height = height;
	button.color = color;
	button.text = text;
	button.onclick = onclick;
	if(onclick)
		this.actionButtons.push(button);
	else
		this.towerButtons.push(button);
}
// select by index
ControlPanel.prototype.select = function(i){

	this.selectedItem = this.towerButtons[i];			
	this.towerButtons[i].isSelected = true;
	
	
	this.map.selectedTower = TowerFactory.createTower(i);			
}
// select by position
ControlPanel.prototype.selectAt = function(x,y){
	if(this.selectedItem)
		this.selectedItem.isSelected = false;
	this.selectedItem = null;
	for (var i = 0; i < this.towerButtons.length; i++) {
		var button = this.towerButtons[i];
		
		if(button.contain(x, y))
		{			
			this.select(i);
			break;
		}
    }
	
	for (var i = 0; i < this.actionButtons.length; i++) {
		var button = this.actionButtons[i];
		
		if(button.contain(x, y))
		{
			if(button.onclick)
				button.onclick();			
			break;
		}
    }
}
