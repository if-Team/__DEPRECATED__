var a = null;
var e = null;
var t = null;

//dbTick();
function modTick(){
//	setTimeOut(dbTick(),200)
	a = Entity.getAll();
	for(var i in a){
		e = a[i];
		t = Entity.getEntityTypeId(e);
		if(t != 64 && t != 80 && t != 66){
			if(Entity.getY(e) > 80){
		 		Entity.setFireTicks(e,100);
				if(Entity.getY(e) > 100){
		 			if(Entity.getHealth(e) > 1) Entity.setHealth(e,1);
					Entity.setVelY(e,-999*999*999);
		 		}
	 		}
	 		Entity.setVelY(e,Entity.getVelY(e)+0.1);
		}
	}
}