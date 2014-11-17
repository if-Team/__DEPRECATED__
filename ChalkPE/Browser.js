var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();

/* ----------------------------------------------------- ChalkPackage start ----------------------------------------------------- */

var META = {
    name: "Browser",
    version: 1.2
};

var UPDATER = {
    getInfo: function(silentMode){try{
        var input = new java.net.URL("https://raw.githubusercontent.com/amato17/ModPEScripts/master/data/" + META.name + ".json").openConnection().getInputStream();
        var br = new java.io.BufferedReader(new java.io.InputStreamReader(input));
        var buf = new java.lang.StringBuffer();
        var read = null;
        while(true){
            read = br.readLine();
            if(read == null) break;
            buf.append(read + "\n");
        }
        return eval("(" + buf.toString() + ")");
    }catch(e){if(!silentMode) print(e);return null;}},
    check: function(silentMode){
        var info = UPDATER.getInfo(silentMode);
        if(info == null){
            if(!silentMode) clientMessage(ChatColor.RED + "Couldn't download update information.");
            return;
        }        
        if(info.version > META.version){
            new android.app.AlertDialog.Builder(ctx)
            .setTitle("New update found: " + info.version)
            .setCancelable(false)
            .setMessage("ChangeLog - " + info.changeLog + "\n\n" + "Input /update to continue")
            .setPositiveButton("OK", null)
            .show();
            
            META.url = info.url;
            META.newVersion = info.version
        }else if(info.version == META.version){
            if(!silentMode) clientMessage(ChatColor.DARK_AQUA + "You are using latest version: " + info.version);
        }
    },
    update: function(){
        if(META.url == null){
            clientMessage(ChatColor.RED + "Please /check-update before.");
            return;
        }
        try{
            var file = new java.io.File(android.os.Environment.getExternalStorageDirectory(), META.name + "-" + META.newVersion + ".js");
            var input = new java.net.URL(META.url).openConnection().getInputStream();
            var br = new java.io.BufferedReader(new java.io.InputStreamReader(input), 4096);
            var bw = new java.io.BufferedWriter(new java.io.FileWriter(file), 4096);
            var read = null;
            while(true){
                read = br.readLine();
                if(read == null) break;
                bw.write(read); bw.newLine();
            }
            br.close(); bw.close();
            clientMessage(ChatColor.GREEN + "Downloaded to " + file.toString());
        }catch(e){
            clientMessage(ChatColor.RED + "Unable to download new update.");
            print(e);
        }
    }
};

function procCmd(str) {
    var c = str.split(" ");
    switch(c[0]){
        case "update":
        new java.lang.Thread({run: function(){UPDATER.update();}}).start();
        break;
        
        case "info":
        clientMessage(ChatColor.GOLD + META.name + " - v" + META.url);
        break;

        case "check-update":
        new java.lang.Thread({run: function(){UPDATER.check(false);}}).start();
        break;
        
        case "visit-website":
        ctx.runOnUiThread(new java.lang.Runnable({run: function(){
            var webs = new android.webkit.WebView(ctx);
            var webset = webs.getSettings();
		    webset.setJavaScriptEnabled(true);
            webs.setWebChromeClient(new android.webkit.WebChromeClient());
            webs.setWebViewClient(new android.webkit.WebViewClient());
            webs.loadUrl("https://amato17.github.io");
            new android.app.AlertDialog.Builder(ctx).setView(webs).show();
        }}));
    }
}

/* ----------------------------------------------------- ChalkPackage end ----------------------------------------------------- */

var that = this;
var density = 0;

var display = ctx.getWindowManager().getDefaultDisplay();
var root = android.os.Environment.getExternalStorageDirectory().getAbsoluteFile();
var defaultFolder = "Chalk/ModPE/Browser/";

var window = null;
var settingPanel = null;
var popup = null;

var webButton = null;
var bar = null;
var goMenu = null;
var goEdit = null;
var bookmarkButton = null;
var bookmarkListPopup = null;
var web = null;

var isDarkThemeCheckBox = null;
var homepageEdit = null;
var sizeInfo = null;

var isMaximized = false;

var gravityOptions = ["left of chat button", "bottom of chat button", "top left", "center right", "center left", "bottom right", "bottom left", "center", "free (drag)"];

var Axis = "0 0";

var Data = {
    homepage: "http://m.naver.com",
    isDarkTheme: false,
    size: 85,
    alpha: 100,
    gravity: 0
};

var Bookmark = {
    X: "none",
    A: "https://amato17.github.io",
    B: "http://m.comic.naver.com/webtoon/weekday.nhn",
    C: "http://youtu.be/pnBqpNiqJKI"
};

(function(){
    var str = ModPE.readData("axis");
    if(str != "") Axis = str;
    
    str = ModPE.readData("data");
    if(str != ""){
        var saved = JSON.parse(str);
        for(var i in saved){
            Data[i] = saved[i];
        }
    }
    
    str = ModPE.readData("bookmark");
    if(str != ""){
        var saved = JSON.parse(str);
        for(var i in saved){
            Bookmark[i] = saved[i];
        }
    }
})();

function dp(dips){
    if(!density) density = ctx.getResources().getDisplayMetrics().density;
	return Math.ceil(dips * density);
}

function getImage(path, size){
    try{
        var bitmap = android.graphics.BitmapFactory.decodeFile(path);
        var width = bitmap.getWidth(), height = bitmap.getHeight();
        var scale = (dp(size) / (width / 100));
        width *= (scale / 100); height *= (scale / 100);
        return new android.graphics.drawable.BitmapDrawable(android.graphics.Bitmap.createScaledBitmap(bitmap, parseInt(width), parseInt(height), true));
    }catch(e){
        return null;
    }
}

function getImageButton(path, size, text, callback, marginLeft){
    var button = new android.widget.ImageView(ctx);
    
    var image = getImage(root + '/' + path, size);
    if(!image){
        button = new android.widget.TextView(ctx);
        button.setText(text);
        button.setTypeface(android.graphics.Typeface.MONOSPACE);
        button.setTextColor(Data.isDarkTheme ? android.graphics.Color.LTGRAY : android.graphics.Color.DKGRAY);
        button.setTextSize(android.util.TypedValue.COMPLEX_UNIT_DIP, size/3);
    }
    else{
        button.setBackgroundDrawable(image);
    }
    
    if(marginLeft > 0){
        var params = new android.widget.LinearLayout.LayoutParams(-2, -2);
        params.leftMargin = dp(marginLeft);
        button.setLayoutParams(params);
    }
    button.setOnClickListener(new android.view.View.OnClickListener({onClick: callback}));
    return button;
}

function updateUpDown(willRemove){
    if(willRemove) bar.removeViewAt(2);
    bar.addView(getImageButton(defaultFolder + (goMenu.getVisibility() == android.view.View.VISIBLE ? "up" : "down") + ".png", 60, "Go", function(v){ //3
        goMenu.setVisibility(goMenu.getVisibility() == android.view.View.VISIBLE ? android.view.View.GONE : android.view.View.VISIBLE);
        goEdit.setText(web.getUrl());
        updateUpDown(true);
    }, 10), 2);
}

function updateMinMax(willRemove){
    if(willRemove) bar.removeViewAt(6);
    bar.addView(getImageButton(defaultFolder + "m" + (isMaximized ? "in" : "ax") + ".png", 60, isMaximized ? "Min" : "Max", function(v){
        if(isMaximized){
            popup.update(display.getWidth() * (Data.size/100), display.getHeight() * (5/6));
            isMaximized = false;
        }else{
            popup.update(display.getWidth(), display.getHeight());
            isMaximized = true;
        }
        updateMinMax(true);
    }, 10), 6);
}

function updateWindow(){
    if(window.isShowing()) window.dismiss();
    
    webButton.setOnTouchListener(Data.gravity == 8 ? new android.view.View.OnTouchListener({onTouch: function(v, event){
        if(event == null) return false;
        if(window == null) return false;
        
        var x = event.getRawX(), y = event.getRawY();
        switch(event.getAction()){
            case 0:
                
            break;
            case 2:
                window.update(x, y, -1, -1, false);
            break;
            case 1:
                Axis = x + " " + y;
                ModPE.saveData("axis", Axis);
            break;
        }
        return false;
    }}) : null);
    
    var gravity, xoff, yoff;
    switch(Data.gravity){
        default:
        case 0: //left of chat button
            gravity = android.view.Gravity.RIGHT | android.view.Gravity.TOP;
            xoff = dp(36);
            yoff = 0;
        break;
        
        case 1: //bottom of chat button
            gravity = android.view.Gravity.RIGHT | android.view.Gravity.TOP;
            xoff = 0;
            yoff = dp(36);
        break;
        
        case 2: //top left
            gravity = android.view.Gravity.LEFT | android.view.Gravity.TOP;
            xoff = 0;
            yoff = 0;
        break;
        
        case 3: //center right
            gravity = android.view.Gravity.RIGHT | android.view.Gravity.CENTER;
            xoff = 0;
            yoff = 0;
        break;
        
        case 4: //center left
            gravity = android.view.Gravity.LEFT | android.view.Gravity.CENTER;
            xoff = 0;
            yoff = 0;
        break;
        
        case 5: //bottom right
            gravity = android.view.Gravity.RIGHT | android.view.Gravity.BOTTOM;
            xoff = 0;
            yoff = 0;
        break;
        
        case 6: //bottom left
            gravity = android.view.Gravity.LEFT | android.view.Gravity.BOTTOM;
            xoff = 0;
            yoff = 0;
        break;
        
        case 7: //center
            gravity = android.view.Gravity.CENTER;
            xoff = 0;
            yoff = 0;
        break;
        
        case 8: //free
            gravity = android.view.Gravity.LEFT | android.view.Gravity.TOP;
            xoff = parseInt(Axis.split(" ")[0]);
            yoff = parseInt(Axis.split(" ")[1]);
        break;
    }
    window.showAtLocation(ctx.getWindow().getDecorView(), gravity, xoff, yoff);
}

ctx.runOnUiThread(new java.lang.Runnable({run: function(){
    new java.lang.Thread({run: function(){UPDATER.check(true);}}).start(); /* ChalkPackage - AUTO UPDATE */
    
    android.widget.Toast.makeText(ctx, "Chalk Browser - https://amato17.github.io", 1).show();
    webButton = getImageButton(defaultFolder + "web.png", 85, "Chalk", function(v){
        ctx.runOnUiThread(openWeb);
    }, 0);
    webButton.setOnLongClickListener(new android.view.View.OnLongClickListener({onLongClick: function(v){
        ctx.runOnUiThread(openSetting);
        return true;
    }}));
    
    window = new android.widget.PopupWindow(webButton);
    window.setWindowLayoutMode(-2, -2);
    window.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.TRANSPARENT));
    
    updateWindow();
}}));

var openWeb = new java.lang.Runnable({run: function(){
    if(!popup){
        webLayout = new android.widget.LinearLayout(ctx);
        webLayout.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(Data.isDarkTheme ? android.graphics.Color.DKGRAY : android.graphics.Color.LTGRAY));
        webLayout.setPadding(dp(10), dp(5), dp(10), dp(10));
        webLayout.setOrientation(android.widget.LinearLayout.VERTICAL);
        
        bar = new android.widget.LinearLayout(ctx);
        bar.setPadding(0, 0, 0, dp(5));
        bar.setLayoutParams(new android.widget.LinearLayout.LayoutParams(-1, -2));
        bar.setOrientation(android.widget.LinearLayout.HORIZONTAL);
        bar.setGravity(android.view.Gravity.RIGHT | android.view.Gravity.CENTER);
        
        goMenu = new android.widget.LinearLayout(ctx);
        goMenu.setGravity(android.view.Gravity.LEFT | android.view.Gravity.CENTER);
        goMenu.setOrientation(android.widget.LinearLayout.HORIZONTAL);
        goMenu.setVisibility(android.view.View.GONE);
        
        bar.addView(getImageButton(defaultFolder + "back.png", 60, "<-", function(v){ //1
            if(web.canGoBack()) web.goBack();
        }, 0));
        
        bar.addView(getImageButton(defaultFolder + "forward.png", 60, "->", function(v){ //2
            if(web.canGoForward()) web.goForward();
        }, 10));
        
        updateUpDown(false); //3
        
        bar.addView(getImageButton(defaultFolder + "MK.png", 60, "MK", function(v){ //4
            web.loadUrl("http://m.cafe.naver.com/minecraftpe");
        }, 10));
        
        bar.addView(getImageButton(defaultFolder + "home.png", 60, "Home", function(v){ //5
            web.loadUrl(Data.homepage);
        }, 10));
        
        bookmarkButton = getImageButton(defaultFolder + "bookmark.png", 60, "Bookmark", function(v){ //6
            if(bookmarkListPopup && bookmarkListPopup.isShowing()) return;
            
            var frame = new android.widget.LinearLayout(ctx);
            frame.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(Data.isDarkTheme ? android.graphics.Color.DKGRAY : android.graphics.Color.LTGRAY));
            frame.setPadding(0, 0, dp(12), 0);
            frame.setOrientation(android.widget.LinearLayout.HORIZONTAL);
            
            var params = new android.widget.LinearLayout.LayoutParams(-2, -2);
            params.leftMargin = dp(12);
            
            for(var i in Bookmark){
                var item = new android.widget.TextView(ctx);
                item.setText(i);
                item.setTypeface(android.graphics.Typeface.MONOSPACE);
                item.setTextColor(Data.isDarkTheme ? android.graphics.Color.LTGRAY : android.graphics.Color.DKGRAY);
                item.setTextSize(android.util.TypedValue.COMPLEX_UNIT_DIP, 28);
                item.setOnClickListener(new android.view.View.OnClickListener({onClick: function(v){
                    if(!v.getText().toString().equals("X")){
                        android.widget.Toast.makeText(ctx, "Bookmark " + v.getText().toString() + " loaded.", 0).show();
                        web.loadUrl(Bookmark[v.getText().toString()]);
                    }
                    
                    bookmarkListPopup.dismiss();
                }}));
                item.setOnLongClickListener(new android.view.View.OnLongClickListener({onLongClick: function(v){
                    Bookmark[v.getText().toString()] = web.getUrl() + "";
                    ModPE.saveData("bookmark", JSON.stringify(Bookmark));
                    
                    android.widget.Toast.makeText(ctx, "Bookmark " + v.getText().toString() + " saved to " + Bookmark[v.getText().toString() + ""], 0).show();
                    return true;
                }}));
                frame.addView(item, params);
            }
            
            bookmarkListPopup = new android.widget.PopupWindow(frame);
            bookmarkListPopup.setWindowLayoutMode(-2, -2);
            bookmarkListPopup.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.LEFT | android.view.Gravity.TOP, 
                                            bookmarkButton.getX(), 2 + bookmarkButton.getY());
        }, 10);
        bar.addView(bookmarkButton);
        
        updateMinMax(false); //7
        
        var closeButton = getImageButton(defaultFolder + "close.png", 60, "Close", function(v){ //7
            popup.dismiss();
            if(bookmarkListPopup) bookmarkListPopup.dismiss(); bookmarkListPopup = null;
        }, 10);
        closeButton.setOnLongClickListener(new android.view.View.OnLongClickListener({onLongClick: function(v){
            web.loadUrl("about:blank"); web = null;
            popup.dismiss(); popup = null;
            if(bookmarkListPopup) bookmarkListPopup.dismiss(); bookmarkListPopup = null;
            android.widget.Toast.makeText(ctx, "Closed.", 0).show();
            return true;
        }}));
        bar.addView(closeButton);
        
        goEdit = new android.widget.EditText(ctx);
        goEdit.setBackgroundDrawable(null);
        goEdit.setSingleLine(true);
        goEdit.setTypeface(android.graphics.Typeface.MONOSPACE);
        goEdit.setTextColor(Data.isDarkTheme ? android.graphics.Color.LTGRAY : android.graphics.Color.DKGRAY);
        goEdit.setTextSize(android.util.TypedValue.COMPLEX_UNIT_DIP, 18);
        goMenu.addView(goEdit, new android.widget.LinearLayout.LayoutParams(-2, -2, 1.0));
        
        goMenu.addView(getImageButton(defaultFolder + "go.png", 60, "Go", function(v){
            var url = goEdit.getText().toString();
            if(!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("file://")) web.loadUrl("http://" + url);
            else web.loadUrl(url);
            
            goMenu.setVisibility(android.view.View.GONE);
            updateUpDown(true);
        }, 10));
        
        web = new android.webkit.WebView(ctx);
        var webset = web.getSettings();
        webset.setSupportZoom(true);
        webset.setJavaScriptEnabled(true);
        webset.setAllowContentAccess(true);
        webset.setAllowFileAccess(true);
        web.setWebChromeClient(new android.webkit.WebChromeClient());
        web.setWebViewClient(new android.webkit.WebViewClient());
        web.loadUrl(Data.homepage);
        
        var barWrapper = new android.widget.HorizontalScrollView(ctx);
        barWrapper.setSmoothScrollingEnabled(true);
        barWrapper.addView(bar);
        
        var bargroup = new android.widget.LinearLayout(ctx);
        bargroup.setOrientation(android.widget.LinearLayout.HORIZONTAL);
        
        var logo = new android.widget.TextView(ctx);
        logo.setText("Chalk browser");
        logo.setSingleLine(true);
        logo.setEllipsize(android.text.TextUtils.TruncateAt.MARQUEE);
        logo.setSelected(true);
        logo.setTypeface(android.graphics.Typeface.MONOSPACE);
        logo.setTextColor(android.graphics.Color.GRAY);
        logo.setTextSize(android.util.TypedValue.COMPLEX_UNIT_DIP, 20);
        
        bargroup.addView(logo, new android.widget.LinearLayout.LayoutParams(-2, -2, 1.0)); //0
        bargroup.addView(barWrapper);
        
        webLayout.addView(bargroup); //Wrapper);
        webLayout.addView(goMenu);
        webLayout.addView(web);
        
        popup = new android.widget.PopupWindow(webLayout, display.getWidth() * (Data.size/100), display.getHeight() * (5/6), true);
    }
    
    /*
    popup.setOutsideTouchable(true);
    popup.setTouchInterceptor(new android.view.View.OnTouchListener({onTouch: function(v, event){
        return false;
    }}));
    */
    
    if(webLayout) webLayout.setAlpha(Data.alpha/100);
    popup.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.CENTER, 0, 0);
    if(!isMaximized) popup.update(display.getWidth() * (Data.size/100), display.getHeight() * (5/6));
}});

function getPreferenceScreen(view, name, value){
    var group = new android.widget.LinearLayout(ctx);
    group.setPadding(0, 0, 0, dp(10));
    group.setOrientation(android.widget.LinearLayout.HORIZONTAL);
    
    var text = new android.widget.TextView(ctx);
    text.setText(name);
    text.setTypeface(android.graphics.Typeface.MONOSPACE);
    text.setTextColor(Data.isDarkTheme ? android.graphics.Color.WHITE : android.graphics.Color.BLACK);
    text.setTextSize(android.util.TypedValue.COMPLEX_UNIT_DIP, 16);
    group.addView(text);
    
    that[view] = new android.widget.EditText(ctx);
    that[view].setPadding(dp(10), 0, 0, 0);
    that[view].setBackgroundDrawable(null);
    that[view].setText(value);
    that[view].setTypeface(android.graphics.Typeface.MONOSPACE);
    that[view].setTextColor(Data.isDarkTheme ? android.graphics.Color.LTGRAY : android.graphics.Color.DKGRAY);
    that[view].setHint(name);
    that[view].setTextSize(android.util.TypedValue.COMPLEX_UNIT_DIP, 13);
    group.addView(that[view], new android.widget.LinearLayout.LayoutParams(-2, -2, 1.0));
    
    return group;
}

function getSeekBar(view, name, value, min, max){
    var group = new android.widget.LinearLayout(ctx);
    group.setPadding(0, 0, 0, dp(10));
    group.setOrientation(android.widget.LinearLayout.HORIZONTAL);
    
    var text = new android.widget.TextView(ctx);
    text.setText(name);
    text.setTypeface(android.graphics.Typeface.MONOSPACE);
    text.setTextColor(Data.isDarkTheme ? android.graphics.Color.WHITE : android.graphics.Color.BLACK);
    text.setTextSize(android.util.TypedValue.COMPLEX_UNIT_DIP, 16);
    group.addView(text);
    
    var bar = new android.widget.SeekBar(ctx);
    bar.setMax(max - min);
    bar.setProgress(value - min);
    bar.setOnSeekBarChangeListener(new android.widget.SeekBar.OnSeekBarChangeListener({onProgressChanged:function(seekBar, progress, fromUser){
        Data[view] = progress + min;
        that[view + "Info"].setText(Data[view] + "%");
    }}));
    group.addView(bar, new android.widget.LinearLayout.LayoutParams(-2, -2, 1.0));
    
    that[view + "Info"] = new android.widget.TextView(ctx);
    that[view + "Info"].setText((bar.getProgress() + min) + "%");
    that[view + "Info"].setTypeface(android.graphics.Typeface.MONOSPACE);
    that[view + "Info"].setTextColor(Data.isDarkTheme ? android.graphics.Color.WHITE : android.graphics.Color.BLACK);
    that[view + "Info"].setTextSize(android.util.TypedValue.COMPLEX_UNIT_DIP, 16);
    group.addView(that[view + "Info"]);
    
    return group;
}

function getRadioGroup(view, name, items, selected, onclick){
    var layout = new android.widget.LinearLayout(ctx);
    layout.setOrientation(android.widget.LinearLayout.VERTICAL);
    
    var text = new android.widget.TextView(ctx);
    text.setText(name);
    text.setTypeface(android.graphics.Typeface.MONOSPACE);
    text.setTextColor(Data.isDarkTheme ? android.graphics.Color.WHITE : android.graphics.Color.BLACK);
    text.setTextSize(android.util.TypedValue.COMPLEX_UNIT_DIP, 18);
    text.setPadding(0, 0, 0, dp(5));
    layout.addView(text);
    
    var group = new android.widget.RadioGroup(ctx);
    group.setOrientation(android.widget.LinearLayout.VERTICAL);
    group.setGravity(android.view.Gravity.LEFT | android.view.Gravity.TOP);
    
    for(var i = 0; i < items.length; i++){
        var radioItem = new android.widget.RadioButton(ctx);
        radioItem.setText(items[i]);
        radioItem.setId(i);
        radioItem.setTypeface(android.graphics.Typeface.MONOSPACE);
        radioItem.setTextColor(Data.isDarkTheme ? android.graphics.Color.WHITE : android.graphics.Color.BLACK);
        radioItem.setTextSize(android.util.TypedValue.COMPLEX_UNIT_DIP, 13);
        group.addView(radioItem);
    }
    
    group.check(selected);
    group.setOnCheckedChangeListener(new android.widget.RadioGroup.OnCheckedChangeListener({onCheckedChanged: function(radioGroup, id){
        Data[view] = id;
        onclick();
    }}));
    layout.addView(group);
    return layout;
}

var openSetting = new java.lang.Runnable({run: function(){
    var layout = new android.widget.LinearLayout(ctx);
    layout.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(Data.isDarkTheme ? android.graphics.Color.DKGRAY : android.graphics.Color.LTGRAY));
    layout.setPadding(dp(10), dp(10), dp(10), dp(10));
    layout.setOrientation(android.widget.LinearLayout.VERTICAL);
    
    var title = new android.widget.TextView(ctx);
    title.setPadding(0, 0, 0, dp(10));
    title.setText("Chalk Browser");
    title.setTypeface(android.graphics.Typeface.MONOSPACE);
    title.setTextColor(Data.isDarkTheme ? android.graphics.Color.LTGRAY : android.graphics.Color.DKGRAY);
    title.setTextSize(android.util.TypedValue.COMPLEX_UNIT_DIP, 25);
    layout.addView(title);
    
    isDarkThemeCheckBox = new android.widget.CheckBox(ctx);
    isDarkThemeCheckBox.setText("Dark theme");
    isDarkThemeCheckBox.setChecked(Data.isDarkTheme == true);
    isDarkThemeCheckBox.setTypeface(android.graphics.Typeface.MONOSPACE);
    isDarkThemeCheckBox.setTextColor(Data.isDarkTheme ? android.graphics.Color.LTGRAY : android.graphics.Color.DKGRAY);
    layout.addView(isDarkThemeCheckBox);
    
    layout.addView(getSeekBar("size", "Browser width", Data.size, 30, 90));
    
    layout.addView(getSeekBar("alpha", "Browser opacity", Data.alpha, 10, 100));
    
    layout.addView(getPreferenceScreen("homepageEdit", "Homepage", Data.homepage));
    
    for(var i in Bookmark){
        if(i != "X") layout.addView(getPreferenceScreen("bookmarkEdit" + i, "Bookmark " + i, Bookmark[i]));
    }
    
    layout.addView(getRadioGroup("gravity", "Button location", gravityOptions, Data.gravity, updateWindow));
    
    var save = new android.widget.TextView(ctx);
    save.setText("Close");
    save.setGravity(android.view.Gravity.RIGHT | android.view.Gravity.CENTER);
    save.setTypeface(android.graphics.Typeface.MONOSPACE);
    save.setTextColor(Data.isDarkTheme ? android.graphics.Color.WHITE : android.graphics.Color.BLACK);
    save.setTextSize(android.util.TypedValue.COMPLEX_UNIT_DIP, 30);
    save.setOnClickListener(new android.view.View.OnClickListener({onClick: function(){
        if(isDarkThemeCheckBox.isChecked() != Data.isDarkTheme) popup = null;
        
        Data.homepage = homepageEdit.getText().toString() + "";
        Data.isDarkTheme = isDarkThemeCheckBox.isChecked();
        ModPE.saveData("data", JSON.stringify(Data));
        
        for(var i in Bookmark){
            if(i != "X") Bookmark[i] = that["bookmarkEdit" + i].getText().toString() + "";
        }
        ModPE.saveData("boomark", JSON.stringify(Bookmark));
        
        android.widget.Toast.makeText(ctx, "All data saved.", 0).show();
        settingPanel.dismiss();
    }}));
    layout.addView(save, new android.widget.LinearLayout.LayoutParams(-1, -2));
    
    var scr = new android.widget.ScrollView(ctx);
    scr.addView(layout);
    
    var display = ctx.getWindowManager().getDefaultDisplay();
    settingPanel = new android.widget.PopupWindow(scr, display.getWidth() * (4/5), display.getHeight() * (4/5), true);
    settingPanel.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.CENTER, 0, 0);
}});