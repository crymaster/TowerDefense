var Effects = {
	getName : function(value)
	{
		for(var x in this)
		{
			if(this[x] == value)
				return x;
		}
		return null;
	},
	NONE : 0,
	POISON : 1,	
	FREEZE : 2
	
};
var TowerTypes = [
	{
		name: "Machine Gun",
		effect: Effects.NONE,
		price : 150,	
		color : "Wheat",
		damage : 40,
		shootingRange : 100,
		fireDelay : 225,
		rotationSpeed : 5,
		upgradePrice : 25
	},
	{
		name: "Dual Machine Gun",
		effect: Effects.NONE,
		price : 250,	
		color : "Wheat",
		damage : 50,
		shootingRange : 120,
		fireDelay : 150,
		rotationSpeed : 4,
		upgradePrice : 25
	},
	{
		name: "Cannon",
		effect: Effects.NONE,
		price : 600,	
		color : "Indigo",
		damage : 450,
		shootingRange : 200,
		fireDelay : 600,
		rotationSpeed : 2.5,
		upgradePrice : 70
	},{
		name: "Poison Injector",
		effect: Effects.POISON,
		price : 175,	
		color : "Green",
		damage : 50,
		shootingRange : 80,
		fireDelay : 400,
		rotationSpeed : 3,
		upgradePrice : 30
	},
	{
		name: "Poison Injector 2",
		effect: Effects.POISON,
		price : 275,	
		color : "Green",
		damage : 100,
		shootingRange : 100,
		fireDelay : 300,
		rotationSpeed : 4,
		upgradePrice : 50
	},
	{
		name: "Poison Injector 3",
		effect: Effects.POISON,
		price : 450,	
		color : "Green",
		damage : 250,
		shootingRange : 125,
		fireDelay : 250,
		rotationSpeed : 3,
		upgradePrice : 75
	}
	,{
		name: "Refrigerator",
		effect: Effects.FREEZE,
		price : 150,	
		color : "Blue",
		damage : 40,
		shootingRange : 80,
		fireDelay : 450,
		rotationSpeed : 3,
		upgradePrice : 25
	},
	{
		name: "Refrigerator 2",
		effect: Effects.FREEZE,
		price : 250,	
		color : "Blue",
		damage : 80,
		shootingRange : 85,
		fireDelay : 400,
		rotationSpeed : 3.5,
		upgradePrice : 40
	},
	{
		name: "Refrigerator 3",
		effect: Effects.FREEZE,
		price : 350,	
		color : "Blue",
		damage : 120,
		shootingRange : 90,
		fireDelay : 350,
		rotationSpeed : 4,
		upgradePrice : 55
	}
];
var TowerFactory = {};

TowerFactory.createTower = function(index){
	var tower = new Tower(_sprites.sprites["tower"+index]);	
	var data = TowerTypes[index];
	tower.name = data.name;
	tower.effect = data.effect;
	tower.price = data.price;
	tower.color = data.color
	tower.damage = data.damage;
	tower.shootingRange = data.shootingRange;
	tower.fireDelay = data.fireDelay;
	tower.rotationSpeed = tower.rotationSpeed * data.rotationSpeed;
	tower.upgradePrice = data.upgradePrice;
	
	return tower;
};