var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
var root = android.os.Environment.getExternalStorageDirectory().getAbsoluteFile();

var th = function(f){new java.lang.Thread({run: f}).start();};
var dc = function(d, f){new java.lang.Thread({run: function(){java.lang.Thread.sleep(d);f();}}).start();}
var ui = function(f){ctx.runOnUiThread(new java.lang.Runnable({run: f}));};
var lp = function(it, f){new java.lang.Thread({run: function(){while(true){f();java.lang.Thread.sleep(it);}}}).start();};
var dp = function(dips){return Math.ceil(dips * ctx.getResources().getDisplayMetrics().density);};
var ts = function(message, isLong){ui(function(){android.widget.Toast.makeText(ctx, message, isLong ? 1 : 0).show();});};

/******************** IMPORT PACKAGE ********************/
var JString = java.lang.String;
var File = java.io.File;

var View = android.view.View;
var Gravity = android.view.Gravity;

var AlertDialog = android.app.AlertDialog;

var DialogInterface = android.content.DialogInterface;

var TextView = android.widget.TextView;
var EditText = android.widget.EditText;
var Button = android.widget.Button;
var CheckBox = android.widget.CheckBox;
var ImageView = android.widget.ImageView;
var ProgressBar = android.widget.ProgressBar;

var LinearLayout = android.widget.LinearLayout;
var PopupWindow = android.widget.PopupWindow;

var Typeface = android.graphics.Typeface;
var Color = android.graphics.Color;
var Bitmap = android.graphics.Bitmap;
var Canvas = android.graphics.Canvas;
var Paint = android.graphics.Paint;
var BitmapFactory = android.graphics.BitmapFactory;
var ColorDrawable = android.graphics.drawable.ColorDrawable;

var DIP = android.util.TypedValue.COMPLEX_UNIT_DIP;

var MediaMetadataRetriever = android.media.MediaMetadataRetriever;
/******************** IMPORT PACKAGE ********************/

var defaultFolder = "Chalk/ModPE/MusicPlayer/";
var Icon = {
    play: "Play", //"▶",
    pause: "Pause", //"II",
    stop: "Stop ", //"■",
    next: " > ", //">",
    forward: "<",
    shuffle: "Shuffle",
};

const ALBUM_ART_WIDTH = 92;
const TEXT_SIZE = 19;

var player = new android.media.MediaPlayer();
var mp3filter = new java.io.FilenameFilter({accept: function(dir, filename){return new JString(filename).endsWith(".mp3");}});

var musicFolder = new File(root, "Music");
var musicList;
var musicListShuffle;
var musicIndex = -1;

var isShuffle = false;
var isMiniMode = false;

var Windows = {};
var Widgets = {};

function te(e){
    ts(e.name + " (" + e.lineNumber + ") - " + e.message + "\n\n" + e.stack, 1);
}

lp(200, function(){
    try{
        if(player && Widgets.progress) Widgets.progress.setProgress(player.getCurrentPosition());
    }catch(e){te(e);}
});

ui(function(){
    
    if(updateList()){
        ts("Music folder isn't exists!", 1);
        return;
    }
    
    try{
        var params = new android.widget.LinearLayout.LayoutParams(-2, -2);
        params.leftMargin = dp(10);
        
        Widgets.forward = new TextView(ctx);
        Widgets.forward.setTypeface(android.graphics.Typeface.MONOSPACE);
        Widgets.forward.setTextColor(android.graphics.Color.LTGRAY);
        Widgets.forward.setText(Icon.forward + " ");
        Widgets.forward.setTextSize(DIP, TEXT_SIZE);
        Widgets.forward.setOnClickListener(new View.OnClickListener({onClick: playForward}));
    
        Widgets.play = new TextView(ctx);
        Widgets.play.setTypeface(android.graphics.Typeface.MONOSPACE);
        Widgets.play.setTextColor(android.graphics.Color.LTGRAY);
        Widgets.play.setText(Icon.play);
        Widgets.play.setTextSize(DIP, TEXT_SIZE);
        Widgets.play.setOnClickListener(new View.OnClickListener({onClick: switchPlaying}));
        
        Widgets.stop = new TextView(ctx);
        Widgets.stop.setTypeface(android.graphics.Typeface.MONOSPACE);
        Widgets.stop.setTextColor(android.graphics.Color.LTGRAY);
        Widgets.stop.setText(Icon.stop);
        Widgets.stop.setTextSize(DIP, TEXT_SIZE);
        Widgets.stop.setOnClickListener(new View.OnClickListener({onClick: stopPlaying}));
        
        Widgets.next = new TextView(ctx);
        Widgets.next.setTypeface(android.graphics.Typeface.MONOSPACE);
        Widgets.next.setTextColor(android.graphics.Color.LTGRAY);
        Widgets.next.setText(Icon.next);
        Widgets.next.setTextSize(DIP, TEXT_SIZE);
        Widgets.next.setOnClickListener(new View.OnClickListener({onClick: playNext}));
        
        Widgets.shuffle = new TextView(ctx);
        Widgets.shuffle.setTypeface(android.graphics.Typeface.MONOSPACE);
        Widgets.shuffle.setTextColor(android.graphics.Color.LTGRAY);
        Widgets.shuffle.setText(Icon.shuffle);
        Widgets.shuffle.setTextSize(DIP, TEXT_SIZE);
        Widgets.shuffle.setOnClickListener(new View.OnClickListener({onClick: toggleShuffle}));
        
        Widgets.progress = new ProgressBar(ctx, null, android.R.attr.progressBarStyleHorizontal);
        Widgets.progress.getProgressDrawable().setColorFilter(Color.parseColor("#FF9900"), android.graphics.PorterDuff.Mode.SRC_IN);
        
        Widgets.currentTitle = new TextView(ctx);
        Widgets.currentTitle.setTypeface(android.graphics.Typeface.MONOSPACE);
        Widgets.currentTitle.setTextColor(android.graphics.Color.LTGRAY);
        Widgets.currentTitle.setSingleLine(true);
        Widgets.currentTitle.setEllipsize(android.text.TextUtils.TruncateAt.MARQUEE);
        Widgets.currentTitle.setSelected(true);
        Widgets.currentTitle.setGravity(Gravity.TOP | Gravity.LEFT);
        Widgets.currentTitle.setTextSize(DIP, TEXT_SIZE /3*2);
        Widgets.currentTitle.setText("MusicPlayer");
        Widgets.currentTitle.setOnClickListener(new View.OnClickListener({onClick: showSelectMusicDialog}));
        
        Widgets.currentArtist = new TextView(ctx);
        Widgets.currentArtist.setTypeface(android.graphics.Typeface.MONOSPACE);
        Widgets.currentArtist.setTextColor(android.graphics.Color.LTGRAY);
        Widgets.currentArtist.setSingleLine(true);
        Widgets.currentArtist.setEllipsize(android.text.TextUtils.TruncateAt.MARQUEE);
        Widgets.currentArtist.setSelected(true);
        Widgets.currentArtist.setGravity(Gravity.TOP | Gravity.LEFT);
        Widgets.currentArtist.setTextSize(DIP, TEXT_SIZE /3*2);
        Widgets.currentArtist.setText("Chalk");
        Widgets.currentArtist.setOnClickListener(new View.OnClickListener({onClick: showSelectMusicDialog}));
        
        Widgets.currentAlbum = new TextView(ctx);
        Widgets.currentAlbum.setTypeface(android.graphics.Typeface.MONOSPACE);
        Widgets.currentAlbum.setTextColor(android.graphics.Color.LTGRAY);
        Widgets.currentAlbum.setSingleLine(true);
        Widgets.currentAlbum.setEllipsize(android.text.TextUtils.TruncateAt.MARQUEE);
        Widgets.currentAlbum.setSelected(true);
        Widgets.currentAlbum.setGravity(Gravity.TOP | Gravity.LEFT);
        Widgets.currentAlbum.setTextSize(DIP, TEXT_SIZE /3*2);
        Widgets.currentAlbum.setText("Hello, world!");
        Widgets.currentAlbum.setOnClickListener(new View.OnClickListener({onClick: showSelectMusicDialog}));
        
        Widgets.albumArt = new ImageView(ctx);
        Widgets.albumArt.setOnClickListener(new View.OnClickListener({onClick: toogleWindow}));
        
        var layout = new LinearLayout(ctx);
        layout.setOrientation(LinearLayout.HORIZONTAL);
        layout.setPadding(dp(10), dp(10), dp(10), dp(10));
        layout.setBackgroundDrawable(new ColorDrawable(Color.argb(80, 80, 80, 80)));
        
        Widgets.content = new LinearLayout(ctx);
        Widgets.content.setLayoutParams(params);
        Widgets.content.setOrientation(LinearLayout.VERTICAL);
        
        var bar = new LinearLayout(ctx);
        bar.setOrientation(LinearLayout.HORIZONTAL);
        
        bar.addView(Widgets.forward);
        bar.addView(Widgets.play);
        bar.addView(Widgets.next);
        bar.addView(Widgets.stop);
        bar.addView(Widgets.shuffle);
        
        Widgets.content.addView(bar);
        Widgets.content.addView(Widgets.progress, new LinearLayout.LayoutParams(-1, -2));
        Widgets.content.addView(Widgets.currentTitle);
        Widgets.content.addView(Widgets.currentArtist);
        Widgets.content.addView(Widgets.currentAlbum);
        
        layout.addView(Widgets.albumArt);
        layout.addView(Widgets.content);
        
        Windows.main = new PopupWindow(layout);
        //Windows.main.setWindowLayoutMode(-2, -2);
        Windows.main.setWidth(dp(ALBUM_ART_WIDTH * 4 + 20))
        Windows.main.setHeight(dp(ALBUM_ART_WIDTH + 20));
        
        Windows.main.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        
        Windows.main.showAtLocation(ctx.getWindow().getDecorView(), 
        Gravity.TOP | Gravity.LEFT, dp(16), dp(32));
        
        ts("Copyright © 2014 Chalk\nAll rights reserved.");
        
        player.setOnCompletionListener(new android.media.MediaPlayer.OnCompletionListener({onCompletion: function(p){
            dc(700, playNext);
        }}));
        
        playNext();
        
    }catch(e){te(e);}
});

function updateList(){
    if(!musicFolder.exists()){
        musicFolder.mkdirs();
        return true;
    }
    
    musicList = musicFolder.list(mp3filter);    
    java.util.Arrays.sort(musicList);
}

function toogleWindow(view){
    isMiniMode = !isMiniMode;
    
    ui(updateID3);
    
    if(!isMiniMode){
        Widgets.content.setVisibility(View.VISIBLE);
        Windows.main.update(dp(ALBUM_ART_WIDTH * 4 + 20), dp(ALBUM_ART_WIDTH + 20));
    }else{
        Widgets.content.setVisibility(View.GONE);
        Windows.main.update(dp(ALBUM_ART_WIDTH / 2 + 20), dp(ALBUM_ART_WIDTH / 2 + 20));
    }
}

function switchPlaying(view){
    if(Widgets.play == null || player == null) return;
    
    if(view !== "STOP"){
        try{
            player.isPlaying() ? player.pause() : player.start();
        }catch(e){te(e);}
    }
    
    Widgets.forward.setText(Icon.forward + (player.isPlaying() ? "" : Icon.forward) + " ");
    Widgets.play.setText(player.isPlaying() ? Icon.pause : Icon.play);
}

function stopPlaying(view){
    if(Widgets.play == null || Widgets.stop == null || player == null) return;
    
    try{
        player.stop();
        player.prepare();
        player.seekTo(0);
    }catch(e){te(e);}
    
    switchPlaying("STOP");
}

function playNext(view){play(0);}
function playForward(view){play(1);}

function play(isNext){
    if(player == null) return;
    
    switch(isNext){
        case 0: nextIndex(); break;
        case 1: beforeIndex(); break;
        case 2: break;
    }
    
    try{
        
        var played = player.isPlaying();
        
        player.reset();
        player.setDataSource(root + "/Music/" + getMusic());
        player.prepare();
        
        Widgets.progress.setMax(player.getDuration());
        
        if(played) player.start();
        
        ui(updateID3);
        
    }catch(e){te(e);}
}

function getMusic(){
    return isShuffle ? musicListShuffle[musicIndex] : musicList[musicIndex];
}

function showSelectMusicDialog(view){
    new AlertDialog.Builder(ctx)
    .setItems(isShuffle ? musicListShuffle : musicList, new DialogInterface.OnClickListener({onClick: function(d, index){
        musicIndex = index;
        play(2);
    }}))
    .show();
}

function beforeIndex(){
    if(musicList.length == 1) musicIndex = 0;
    else if(musicIndex == -1 || musicIndex == 0) musicIndex = musicList.length - 1;
    else musicIndex -= 1;
}

function nextIndex(){
    if(musicList.length == 1) musicIndex = 0;
    else if(musicIndex == -1 || musicIndex == musicList.length - 1) musicIndex = 0;
    else musicIndex += 1;
}

function toggleShuffle(view){
    isShuffle = !isShuffle;
    
    if(isShuffle){
        Widgets.shuffle.setTextColor(android.graphics.Color.DKGRAY);
        
        musicIndex = 0;
        
        musicListShuffle = [];
        
        var data = [];
        for(var str in musicList){
            data.push(musicList[str]);
        }
        
        while(data.length > 0){
            var index = Math.floor(Math.random() * data.length);
            musicListShuffle.push(data.splice(index, 1)[0]);
        }
        
        //ts(musicListShuffle.join("\n"));
    }
    else Widgets.shuffle.setTextColor(android.graphics.Color.LTGRAY);
}

function updateID3(){
    var ID3 = {title: null, artist: null, album: null, albumart: null};

    try{
        var media = new MediaMetadataRetriever();
        media.setDataSource(ctx, android.net.Uri.fromFile(new File(musicFolder, getMusic())));
        
        ID3.title = media.extractMetadata(MediaMetadataRetriever.METADATA_KEY_TITLE);
        ID3.artist = media.extractMetadata(MediaMetadataRetriever.METADATA_KEY_ARTIST);
        ID3.album = media.extractMetadata(MediaMetadataRetriever.METADATA_KEY_ALBUM);
        
        ID3.albumart = media.getEmbeddedPicture(); 
    }catch(e){te(e);}
    
    Widgets.currentTitle.setText(ID3.title ? ID3.title : getMusic());
    Widgets.currentArtist.setText(ID3.artist ? ID3.artist : "Unknown artist");
    Widgets.currentAlbum.setText(ID3.album ? ID3.album : "Unknown album");
    
    var AlbumArtSize = isMiniMode ? (ALBUM_ART_WIDTH / 2) : ALBUM_ART_WIDTH;
    
    if(ID3.albumart) Widgets.albumArt.setImageBitmap(resize(BitmapFactory.decodeStream(new java.io.ByteArrayInputStream(ID3.albumart)), AlbumArtSize));        
    else Widgets.albumArt.setImageBitmap(getColorBitmap(AlbumArtSize));
}

function resize(bitmap, sizedp){
    try{
        var width = bitmap.getWidth(), height = bitmap.getHeight();
        var scale = (dp(sizedp) / (width / 100));
        width *= (scale / 100); height *= (scale / 100);
        return Bitmap.createScaledBitmap(bitmap, parseInt(width), parseInt(height), true);
    }catch(e){
        return null;
    }
}

function getColorBitmap(sizedp){
    var width = dp(sizedp);
    var height = dp(sizedp);
    
    var bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
    var canvas = new Canvas(bitmap);
    
    var paint = new Paint();
    
    for(var y = 0; y < height; y ++){
        var color = 255 - y / height * 180;
        paint.setColor(Color.rgb(color, color, color));
        canvas.drawLine(0, y, width, y, paint);
    }
    
    return bitmap;
}