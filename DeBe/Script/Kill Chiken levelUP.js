var lev = 0;    

function deathHook(m,v){    
	if(m == getPlayerEnt() && Entity.getEntityTypeId(v)==10){
		r = random(1,3);
		lev += r;
		ModPE.showTipMessage("Lv." + lev + "  (+" + r + ")");
	}
}

function random(a,b){
	return a >= b ? b : Math.floor(a+1 + (Math.random() * b - a));
}