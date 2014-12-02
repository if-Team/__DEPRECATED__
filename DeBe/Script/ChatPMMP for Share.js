var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
var dip = Math.ceil(ctx.getResources().getDisplayMetrics().density)*50;
var messageM = "";
var editTextM = null;
var send = true;
showMainButton();

function showMainButton(){
	ctx.runOnUiThread(new java.lang.Runnable({
		run : function(){
			try{
				editTextM = getEditText(messageM,"Main Message",android.text.InputType.TYPE_CLASS_TEXT);
				buttonS = getButton("Send",[150,255,255,255],getDrawable(255,0,200,255));
				buttonS.setOnClickListener(new android.view.View.OnClickListener({
					onClick:function(v){
 						sendMessage();
					}
				}));
				buttonC = getButton("Close");
				buttonC.setOnClickListener(new android.view.View.OnClickListener({
					onClick:function(v){
						saveMessage();
						send = true;
						dialog.dismiss();
					}
				}));
 				dialog = getDialog("ChatPMMP for Share",[getLayout(1,null,[editTextM,buttonS,buttonC])],true);
				buttonM = getButton("Chat",[100,50,50,50],getDrawable(255,0,255,0));
				buttonM.setOnClickListener(new android.view.View.OnClickListener({
					onClick:function(v){
						if(send) sendMessage();
					}
				}));
				buttonM.setOnLongClickListener(new android.view.View.OnLongClickListener({
					onLongClick:function(v){
						send = false;
						dialog.show();
						return false;
					}
				}));
				layout = new android.widget.RelativeLayout(ctx);
				layout.addView(buttonM);
				window = getWindow(null,dip,dip/2,[layout],[0,150]);
				}catch(err){
					print(err);				
				}
			}
		}
	));
}

function saveMessage(){
	messageM = editTextM.getText();
}

function sendMessage(){
	saveMessage();
	Server.sendChat(messageM);
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

function getLayout(o,d,v){
	layout = new android.widget.LinearLayout(ctx);
	if(o != null) layout.setOrientation(o);
	layout.setBackgroundDrawable(d);
	if(v != null){
		for(var i in v) layout.addView(v[i]);
	}
	return layout;
}

function getDialog(t,v,b){
	dialog = new android.app.Dialog(ctx);
	if(t != null) dialog.setTitle(t);
	if(v != null){
		for(var i in v) dialog.setContentView(v[i]);
	}
	if(b) dialog.setCancelable(false);
	return dialog;
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

function getEditText(t,h,it){
	editText = new android.widget.EditText(ctx);
	if(t != null) editText.setText(t);
	if(h != null) editText.setHint(h);
	if(it != null) editText.setInputType(it);
	return editText;
}
