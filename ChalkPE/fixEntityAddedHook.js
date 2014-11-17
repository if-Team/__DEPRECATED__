var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
var SM = net.zhuoweizhang.mcpelauncher.ScriptManager;

var th = function(f){new java.lang.Thread({run: f}).start();};
var dc = function(d, f){new java.lang.Thread({run: function(){java.lang.Thread.sleep(d);f();}}).start();}
var ui = function(f){ctx.runOnUiThread(new java.lang.Runnable({run: f}));};
var lp = function(it, f){new java.lang.Thread({run: function(){while(true){f();java.lang.Thread.sleep(it);}}}).start();};
var dp = function(dips){return Math.ceil(dips * ctx.getResources().getDisplayMetrics().density);};
var ts = function(message, isLong){ui(function(){android.widget.Toast.makeText(ctx, message, isLong ? 1 : 0).show();});};

ts("FixEntityAddedHook now started.\n\nCopyright © 2014 if(Team);\nAll rights reserved.", 1);

var lastent = 0;
var inGame = false;

function newLevel(){
    inGame = true;
}

function leaveGame(){
    inGame = false;
}

lp(50, fix);

function fix(){
    if(!inGame) return;

    var ent = SM.nativeSpawnEntity(0, 0, 0, 80, "images/mob/char.png");
    Entity.remove(ent);
    
    for(var i = lastent + 1; i < ent; i++){
        //if(SM.nativeGetEntityTypeId(i) == 0 && !Player.isPlayer(i)) continue;
        SM.callScriptMethod("entityAddedHook", i);
    }
    lastent = ent;
}
