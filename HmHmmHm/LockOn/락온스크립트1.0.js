var LockOnPath = "/sdcard/games/com.mojang/minecraftResource/LOCK1.0/";

var mPlayer;

var LockonEnable = 0;
var before_Detective = 0;
var Detective = 0;
var SoundPlaying = 0;

var lock_x = 0;
var lock_y = 0;
var lock_z = 0;
var ldelay = 0;

var LOCKON_PAGE = 0;
var lockon_delay = 0;

var imageViewA = 0;

var mobs = [];
var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();

function LOCKON() {
	var mobis = Player.getPointedEntity();
	if (mobis != null) Detective = 1;
	else Detective = 0;
}

function newLevel() {
	mPlayer = new android.media.MediaPlayer();
}

function modTick() {
	if (ldelay == 0) {
		scaledbitmap_ready = decodePNG(LockOnPath, "LOCKREADY.png");
		noscreen = decodePNG(LockOnPath, "NOSCREEN.png");

		setGUI(noscreen);
		ldelay++;
	}
	if (getCarriedItem() == 261) {
		if (LockonEnable != 1) {
			changeGUI(scaledbitmap_ready);
			LockonEnable = 1;
		}
	} else {
		if (LockonEnable != 0) {
			changeGUI(noscreen);
			LockonEnable = 0;
		}
	}

	if (LockonEnable == 1)
		LOCKON();
	if (before_Detective != Detective) {
		if (LockonEnable == 1 && Detective == 1) {
			//LOCKON_PAGE
			scaledbitmap_on = decodePNG(LockOnPath + "LOCKON/", "LOCK" + LOCKON_PAGE + ".png");
			changeGUI(scaledbitmap_on);
			if (LOCKON_PAGE <= 59) LOCKON_PAGE++;

			setBGM("lockon.mp3", LockOnPath);
			SoundPlaying = 1;
		}
		if (LockonEnable == 1 && Detective == 0) {
			if (mPlayer.isPlaying()) mPlayer.pause();
			changeGUI(scaledbitmap_ready);
			SoundPlaying = 0;
			LOCKON_PAGE = 0;
		}
	}
	if (before_Detective == Detective) {
		if (LockonEnable == 1 && Detective == 1) {
			if (lockon_delay == 10) {
				scaledbitmap_on = decodePNG(LockOnPath + "LOCKON/", "LOCK" + LOCKON_PAGE + ".png");
				changeGUI(scaledbitmap_on);
				lockon_delay = 0;
			}
			if (LOCKON_PAGE <= 59) LOCKON_PAGE++;
			lockon_delay++;
		}
	}
	if (SoundPlaying == 1)
		if (!(mPlayer.isPlaying()))
			setBGM("lockon.mp3", LockOnPath);
	before_Detective = Detective;

	if (SoundPlaying == 1 && getCarriedItem() != 261) {
		before_Detective = 0;
		Detective = 0;
		SoundPlaying = 0;
		if (mPlayer.isPlaying())
			mPlayer.pause();
	}
}

function leaveGame() {
	LockonEnable = 0;
	before_Detective = 0;
	Detective = 0;
	ldelay = 0;
	endGUI();
	endBGM();
}

function entityAddedHook(ent) {
	var ID = Entity.getEntityTypeId(ent);
	if (ID == 80 && LockonEnable == 1 && Detective == 1) {
		var mobis = Player.getPointedEntity();
		Entity.setHealth(mobis, 1);
		Entity.setFireTicks(mobis, 15);
		if (ID == 36 || Level.getTile(Entity.getX(mobis), Entity.getY(mobis), Entity.getZ(mobis)) || Level.getTile(Entity.getX(mobis), Entity.getY(mobis), Entity.getZ(mobis)) == 8) Entity.setHealth(mobis, 0);
		Level.playSound(Entity.getX(mobis), Entity.getY(mobis), Entity.getZ(mobis), "random.explode", 2, 1);
		Entity.remove(ent);
	}
}

function decodePNG(url, filename) {
	var file = java.io.File(url + filename);
	if (file.exists() == false) {
		clientMessage("<setGUI> " + filename + " 이미지파일이 존재하지않습니다!");
		return 0;
	}
	return android.graphics.drawable.Drawable.createFromPath(file.getAbsolutePath());
}

function changeGUI(drawable) {
	ctx.runOnUiThread(new java.lang.Runnable({
		run : function () {
			try {
				imageViewA.setBackground(drawable);
			}catch (e){}
		}
	}));
}

function setGUI(scaledbitmap) {
	ctx.runOnUiThread(new java.lang.Runnable({
		run : function () {
			try {
				var flayout = new android.widget.FrameLayout(ctx);
				flayout.setLayoutParams(new android.widget.FrameLayout.LayoutParams(android.widget.FrameLayout.LayoutParams.MATCH_PARENT, android.widget.FrameLayout.LayoutParams.MATCH_PARENT));

				imageViewA = new android.widget.ImageView(ctx);
				imageViewA.setLayoutParams(new android.widget.FrameLayout.LayoutParams(android.widget.FrameLayout.LayoutParams.WRAP_CONTENT, android.widget.FrameLayout.LayoutParams.WRAP_CONTENT));
				imageViewA.setBackgroundDrawable(scaledbitmap);

				flayout.addView(imageViewA);

				GUIWindow = new android.widget.PopupWindow(flayout, ctx.getWindowManager().getDefaultDisplay().getWidth(), ctx.getWindowManager().getDefaultDisplay().getHeight(), true);
				GUIWindow.setTouchable(false);
				GUIWindow.setFocusable(false);
				GUIWindow.setOutsideTouchable(true);
				GUIWindow.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.CENTER, 0, 0);
			} catch (e) {
				clientMessage("<setGUI> 로딩실패: " + e);
				return 0;
			}
		}
	}));
}

function endGUI() {
	ctx.runOnUiThread(new java.lang.Runnable({
		run : function () {
			try {
				if (GUIWindow != null) {
					GUIWindow.dismiss();
					GUIWindow = null;
				}
			} catch (e) {}
		}
	}));
}

function setBGM(sndname, BGMPath) {
	var file = java.io.File(BGMPath + sndname);
	if (file.exists() == false) {
		clientMessage(sndname + "<setGUI> 음악파일이 존재하지않습니다!");
		return 0;
	}

	var path = BGMPath + sndname;
	try {
		if (mPlayer.isPlaying())
			mPlayer.pause();
		mPlayer.reset();
		mPlayer.setDataSource(path);
		mPlayer.prepare();
		mPlayer.start();
	} catch (err) {
		clientMessage("지원되지않는 음악파일입니다!");
	}
}

function endBGM() {
	ctx.runOnUiThread(new java.lang.Runnable({
		run : function () {
			try {
				if (mPlayer != null) {
					mPlayer.release();
					mPlayer = null;
				}
			} catch (e) {}
		}
	}));
}
