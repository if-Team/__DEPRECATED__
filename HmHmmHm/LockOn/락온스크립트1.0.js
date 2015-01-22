var sdcardPath = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
var LockOnPath = sdcardPath + "/games/com.mojang/minecraftResource/LOCK1.0/";

var mPlayer = 0;

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

var mobis = 0;
var imageViewA = 0;

var mobs = new Array();
var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();

function LOOK_XYZ(){
	px = Math.floor(getPlayerX());
	py = Math.floor(getPlayerY());
	pz = Math.floor(getPlayerZ());
	pe = getPlayerEnt();
	yaw = Math.floor(getYaw());
	pitch = Math.floor(getPitch());
	sin = -Math.sin(yaw / 180 * Math.PI);
	cos = Math.cos(yaw / 180 * Math.PI);
	tan = -Math.sin(pitch / 180 * Math.PI);
	pcos = Math.cos(pitch / 180 * Math.PI);
	
	look_x = Math.floor(px + ep * sin * pcos);
	look_y = Math.floor(py + ep * tan);
	look_z = Math.floor(pz + ep * cos * pcos);

	return [look_x, look_y, look_z];
}


function LOCKON() {
	var detect = 0;
	var LOCK_XYZ = LOOK_XYZ();
	var X=0, Y=1, Z=2;
	
	for (var ep = 0; ep <= 100; ep++) {
		if (Level.getTile(LOCK_XYZ[X], LOCK_XYZ[Y], LOCK_XYZ[Z]) != 0) {
			detect = 1;
			break;
		} else {
			detect = 0;
			Detective = 0;
		}
	}
	if (detect == 1) {
		mobis = 0;
		for (var i = 0; i < mobs.length; i++) {
			if (Math.floor(Math.abs(LOCK_XYZ[X] - Entity.getX(mobs[i]))) <= 2)
				if (Math.floor(Math.abs(LOCK_XYZ[Y] - Entity.getY(mobs[i]))) <= 3)
					if (Math.floor(Math.abs(LOCK_XYZ[Z] - Entity.getZ(mobs[i]))) <= 2) {
						if (pe != mobs[i])
							mobis = mobs[i];
						break;
					}
		}
		if (mobis != 0)
			Detective = 1;
		else
			Detective = 0;
	}
}

function newLevel() {
	mPlayer = new android.media.MediaPlayer();
}

function modTick() {
	if (ldelay == 0) {
		scaledbitmap_ready = decodePNG(LockOnPath, "LOCKREADY.png");
		noscreen = decodePNG(LockOnPath, "NOSCREEN.png");

		setGUI(1, noscreen);
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
			if (LOCKON_PAGE <= 59)
				LOCKON_PAGE++;

			setBGM("lockon.mp3", LockOnPath);
			SoundPlaying = 1;
		}
		if (LockonEnable == 1 && Detective == 0) {
			if (mPlayer.isPlaying())
				mPlayer.pause();
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
			if (LOCKON_PAGE <= 59)
				LOCKON_PAGE++;
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
	var mob_data = [10, 11, 12, 13, 32, 33, 34, 35, 36];

	if (mob_data.indexOf(ID) != -1)
		mobs.push(ent)

		if (ID == 80) {
			if (LockonEnable == 1 && Detective == 1) {
				Entity.setHealth(mobis, 1);
				Entity.setFireTicks(mobis, 15);
				if (Level.getTile(Entity.getX(mobis), Entity.getY(mobis), Entity.getZ(mobis)) == 8)
					Entity.setHealth(mobis, 0);
				if (Level.getTile(Entity.getX(mobis), Entity.getY(mobis), Entity.getZ(mobis)) == 9)
					Entity.setHealth(mobis, 0);
				if (ID == 36)
					Entity.setHealth(mobis, 0);
				Level.playSound(Entity.getX(mobis), Entity.getY(mobis), Entity.getZ(mobis), "random.explode", 2, 1);
				mobis = 0;
				Entity.remove(ent);
			}
		}
}

function entityRemovedHook(ent) {
	var ID = Entity.getEntityTypeId(ent);
	var mob_data = [10, 11, 12, 13, 32, 33, 34, 35, 36];

	if (mob_data.indexOf(ID) != -1) {
		for (var i = 0; i < mobs.length; i++) {
			if (ent == mobs[i])
				mobs.splice(i, 1)
		}
	}
}

function decodePNG(url, filename) {
	var file = java.io.File(url + filename);
	if (file.exists() == false) {
		clientMessage("<setGUI> " + filename + " 이미지파일이 존재하지않습니다!");
		return 0;
	}
	try {
		var option = android.graphics.BitmapFactory.Options();
		option.inSampleSize = 4;
		var bitmap = android.graphics.BitmapFactory.decodeFile(url + filename, option);
		var bitmap_width = Math.ceil((bitmap.getWidth()) * ctx.getResources().getDisplayMetrics().density);
		var bitmap_height = Math.ceil((bitmap.getHeight()) * ctx.getResources().getDisplayMetrics().density);
		scaledbitmap = android.graphics.Bitmap.createScaledBitmap(bitmap, bitmap_width, bitmap_height, false);
	} catch (e) {
		clientMessage("<setGUI>" + filename + " 화면해상도가 호환되지않습니다! :" + e);
		return 0;
	}
	return scaledbitmap;
}

function changeGUI(bitmap) {
	ctx.runOnUiThread(new java.lang.Runnable({
			run : function () {
				try {
					imageViewA.setImageBitmap(bitmap);
				} catch (e) {}
			}
		}));
}

function setGUI(touchable, scaledbitmap) {
	ctx.runOnUiThread(new java.lang.Runnable({
			run : function () {
				try {
					var flayout = new android.widget.FrameLayout(ctx);
					flayout.setLayoutParams(new android.widget.FrameLayout.LayoutParams
						(android.widget.FrameLayout.LayoutParams.MATCH_PARENT, android.widget.FrameLayout.LayoutParams.MATCH_PARENT));

					var imageParams = new android.widget.FrameLayout.LayoutParams
						(android.widget.FrameLayout.LayoutParams.WRAP_CONTENT, android.widget.FrameLayout.LayoutParams.WRAP_CONTENT);

					imageViewA = new android.widget.ImageView(ctx);
					imageViewA.setLayoutParams(imageParams);
					imageViewA.setImageBitmap(scaledbitmap);

					flayout.addView(imageViewA);

					GUIWindow = new android.widget.PopupWindow(flayout, ctx.getWindowManager().
							getDefaultDisplay().getWidth(), ctx.getWindowManager().getDefaultDisplay().getHeight(), true);

					if (touchable == 1) {
						GUIWindow.setTouchable(false);
						GUIWindow.setFocusable(false);
						GUIWindow.setOutsideTouchable(true);
					}

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