var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
var dip = Math.ceil(ctx.getResources().getDisplayMetrics().density)*50;
showMainButton();

function showMainButton(){
	ctx.runOnUiThread(new java.lang.Runnable({
		run : function(){
			try{
				button = getButton("TP",[100,150,150,50],getDrawable(255,0,255,0));
				button.setOnClickListener(new android.view.View.OnClickListener({
					onClick:function(v){
						yaw = getYaw();
						pitch = getPitch();
						yawSin = -Math.sin(yaw/180 *Math.PI);
						yawCos = Math.cos(yaw/180*Math.PI);
						pitchCos = Math.cos(pitch/180*Math.PI);
						x = getPlayerX();
						y = getPlayerY();
						z = getPlayerZ();
						max = 50;
						for(i=0; i<max*2; i++){
							xx = x - Math.sin(yaw/180 *Math.PI)*pitchCos/2;
							yy = y - Math.sin(pitch/180*Math.PI)/2;
							zz = z + Math.cos(yaw/180*Math.PI)*pitchCos/2;
							if(Level.getTile(xx, yy, zz) !== 0 || i == max*2-1){
								if(size < 1.2){
									x = xx;
									y = yy;
									z = zz;
								}
								break;
							}
						}
						setVelX(getPlayerEnt(), (x - getPlayerX()) /3);
						setVelY(getPlayerEnt(), (y - getPlayerY()) /3);
						setVelZ(getPlayerEnt(), (z - getPlayerZ()) /3);

//						setPosition(getPlayerEnt(), x, y+0.5, z);
					}
				}));
				layout = new android.widget.RelativeLayout(ctx);
				layout.addView(button);
 				window = getWindow(null,dip,dip/2,[layout],[50,0]);
				}catch(err){
					print(err);				
				}
			}
		}
	));
}

function dip2px(dips){
	return Math.ceil(dips*ctx.getResources().getDisplayMetrics().density);
}

function getDrawable(a,r,g,b){
	bitmap = android.graphics.Bitmap.createBitmap(dip2px(45), dip2px(45), android.graphics.Bitmap.Config.ARGB_8888);
	canvas = new android.graphics.Canvas(bitmap);
	paint = new android.graphics.Paint();
	for(i=1; i<23; i++){
		paint.setARGB(a/i,r,g,b);
		canvas.drawCircle(dip2px(23),dip2px(23),dip2px(i),paint);
	}
	return new android.graphics.drawable.BitmapDrawable(bitmap);
}

function getButton(t,c,d){
	button = new android.widget.Button(ctx);
	if(t != null) 	button.setText(t);
	if(c != null) button.setTextColor(android.graphics.Color.argb(c[0],c[1],c[2],c[3]));
	if(d != null) button.setBackgroundDrawable(d);
	return button;
}

function getWindow(d,w,h,v,l){
	window = new android.widget.PopupWindow();
	if(d != null)	window.setBackgroundDrawable(d);
	if(w != null) window.setWidth(w);
	if(h != null) window.setHeight(h);
	if(v != null){
		for(var i in v) window.setContentView(v[i]);
	}
	if(l) window.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.LEFT | android.view.Gravity.TOP, l[0], l[1]);
	return window;
}

function modTick(){
 	yaw = getYaw();
	pitch = getPitch();
	yawSin = -Math.sin(yaw/180 *Math.PI);
	yawCos = Math.cos(yaw/180*Math.PI);
	pitchCos = Math.cos(pitch/180*Math.PI);
	x = getPlayerX();
	y = getPlayerY();
	z = getPlayerZ();
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
	ModPE.showTipMessage("X:" + Math.floor(xx) + " Y:" + Math.floor(yy) + " Z:" + Math.floor(zz) + " ID:" + id + ":" + mt + "  (" + Player.getCarriedItem() + ":" + Player.getCarriedItemData() +  ")");
}