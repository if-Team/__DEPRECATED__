var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
var dip = Math.ceil(ctx.getResources().getDisplayMetrics().density)*50;
showMainButton();

function showMainButton(){
	ctx.runOnUiThread(new java.lang.Runnable({
		run : function(){
			try{
				button = getButton("IC",[100,150,150,50],getDrawable(255,0,255,0));
				button.setOnClickListener(new android.view.View.OnClickListener({
					onClick:function(v){
						Server.sendChat("/ItemCase Add " + Player.getCarriedItem() + ":" + Player.getCarriedItemData());
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
	ModPE.showTipMessage("ID: " + Player.getCarriedItem() + ":" + Player.getCarriedItemData());
}