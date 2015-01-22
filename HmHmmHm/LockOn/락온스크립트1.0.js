var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
var root = new java.io.File(android.os.Environment.getExternalStorageDirectory().getAbsoluteFile(), "games/com.mojang/minecraftResource/LOCK1.0");

function runOnThread(func){
	new java.lang.Thread({run: func}).start();
};

function runOnUiThread(func){
	ctx.runOnUiThread(new java.lang.Runnable({run: func}));
};

var Resources = {
		mediaPlayer: null,

		startMusic: function(musicName){
			var file = new java.io.File(root, musicName);
			if(file.exists() === false){
				clientMessage("음악 파일이 존재하지 않습니다.");
				return;
			}

			try{
				if(Resources.mediaPlayer.isPlaying()){
					Resources.mediaPlayer.pause();
				}
				Resources.mediaPlayer.reset();
				Resources.mediaPlayer.setDataSource(file.getAbsolutePath());
				Resources.mediaPlayer.prepare();
				Resources.mediaPlayer.start();
			}catch(e){
				clientMessage("음악 파일 재생에 실패했습니다. \n" + e.getMessage());
			}
		},

		finishMusic: function(){
			runOnUiThread(function(){
				if(Resources.mediaPlayer !== null){
					Resources.mediaPlayer.release();
					Resources.mediaPlayer = null;
				}
			});
		}
};

var GUI = {
		window: null,
		imageViewA: null,

		create: function(){runOnUiThread(function(){
			try{
				var layout = new android.widget.FrameLayout(ctx);
				layout.setLayoutParams(new android.widget.FrameLayout.LayoutParams(android.widget.FrameLayout.LayoutParams.MATCH_PARENT, android.widget.FrameLayout.LayoutParams.MATCH_PARENT));

				GUI.imageViewA = new android.widget.ImageView(ctx);
				GUI.imageViewA.setLayoutParams(new android.widget.FrameLayout.LayoutParams(android.widget.FrameLayout.LayoutParams.WRAP_CONTENT, android.widget.FrameLayout.LayoutParams.WRAP_CONTENT));

				layout.addView(GUI.imageViewA);

				GUI.window = new android.widget.PopupWindow(layout, ctx.getWindowManager().getDefaultDisplay().getWidth(), ctx.getWindowManager().getDefaultDisplay().getHeight(), true);
				GUI.window.setTouchable(false);
				GUI.window.setFocusable(false);
				GUI.window.setOutsideTouchable(true);
				GUI.window.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.CENTER, 0, 0);
			}catch(e){
				clientMessage("GUI 생성에 실패했습니다. \n" + e.getMessage());
			}
		});},

		remove: function(){runOnUiThread(function(){
			if(GUI.window !== null){
				GUI.window.dismiss();
				GUI.window = null;
			}
		});},

		createDrawable: function(drawableName){
			var file = new java.io.File(root, drawableName);
			if(file.exists() === false){
				clientMessage("이미지 파일이 존재하지 않습니다.");
				return null;
			}

			return android.graphics.drawable.Drawable.createFromPath(file.getAbsolutePath());
		}
};

function init(){runOnThread(function(){
	Resources.mediaPlayer = new android.media.MediaPlayer();

	Resources.LOCKREADY = GUI.createDrawable("LOCKREADY.png");
	Resources.NOSCREEN = GUI.createDrawable("NOSCREEN.png");

	Resources.ANIMATED_DRAWABLE = new android.graphics.drawable.AnimationDrawable();
	for(var index = 0; index < 60; index++){
		Resources.ANIMATED_DRAWABLE.addFrame(GUI.createDrawable("LOCKON/LOCK" + index + ".png"), 32);
	}
});}

function finalize(){
	GUI.remove();
	Resources.finishMusic();
}





function killEntity(ent){
	Entity.setHealth(ent, 1);
	Entity.setFireTicks(ent, 15);

	var blockId = Level.getTile(Entity.getX(ent), Entity.getY(ent), Entity.getZ(ent));
	if(Entity.getEntityTypeId(ent) === 36 || (blockId === 8 || blockId === 9)){
		Entity.setHealth(ent, 0);
	}

	Level.playSound(Entity.getX(ent), Entity.getY(ent), Entity.getZ(ent), "random.explode", 2, 1);
}





function newLevel(){
	init();
}

function leaveGame(){
	finalize();
}