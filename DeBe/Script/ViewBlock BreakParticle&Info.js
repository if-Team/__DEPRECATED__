function modTick(){
Block.setLightLevel(2,0);
 	yaw = getYaw();
	pitch = getPitch();
	yawSin = -Math.sin(yaw/180 *Math.PI);
	yawCos = Math.cos(yaw/180*Math.PI);
	pitchCos = Math.cos(pitch/180*Math.PI);
	x = getPlayerX();
	y = getPlayerY();
	z = getPlayerZ();
	 xx = 0;	yyy = 0;	 zz = 0;
 	size = 1;
	max = 20;
 	for(i=0; i<max*2; i++){
 		xx = x - Math.sin(yaw/180 *Math.PI)*pitchCos/2;
 		yy = y - Math.sin(pitch/180*Math.PI)/2;
 		zz = z + Math.cos(yaw/180*Math.PI)*pitchCos/2;
 		if(Level.getTile(xx, yy, zz) !== 0 || i == max*2-1){
			if(size < 1.2){
				x = xx;
				y = yy;
				z = zz;
				size += 0.1;
			}
 			y += 0.2;
  		break;
  	}
 		x = xx;
 		y = yy;
 		z = zz;
 		size += 0.05;
	}
	id = Level.getTile(xx,yy,zz);
	mt = Level.getData(xx,yy,zz);
	if(id == 0) Level.addParticle(5,x,y,z,0,0,0,size);	
	else Level.addParticle(15,x,y,z,0,0,0,id,mt);	
	ModPE.showTipMessage("X:" + Math.floor(xx) + " Y:" + Math.floor(yy) + " Z:" + Math.floor(zz) + " ID:" + id + ":" + mt);
}