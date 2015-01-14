var ctx=com.mojang.minecraftpe.MainActivity.currentMainActivity.get();

function dip2px(dips){
    return Math.ceil(dips*ctx.getResources().getDisplayMetrics().density);
}

var version="1.0"
var copyrighter="netherTNT";
var copyright="Copyright (c) 2015 "+copyrighter+" all rights reserved.";

var source="105 102 40 99 111 112 121 114 105 103 104 116 101 114 61 61 34 110 101 116 104 101 114 84 78 84 34 41 123 105 102 40 104 97 115 76 101 118 101 108 41 123 115 101 116 80 111 114 116 97 108 40 41 59 125 101 108 115 101 123 112 114 105 110 116 40 34 49436 48260 50640 49436 45716 32 51060 32 49828 53356 47549 53944 47484 32 49324 50857 54624 49688 32 50630 49845 45768 45796 33 34 41 59 125 125 101 108 115 101 123 112 114 105 110 116 40 34 51200 51089 44428 51088 44032 32 50732 48148 47476 51648 32 50506 49845 45768 45796 46 34 41 59 125 32 32".split(" ");

//import android.graphics.*;
var drawable=android.graphics.drawable;
var Bitmap=android.graphics.Bitmap;
var Canvas=android.graphics.Canvas;
var Color=android.graphics.Color
var Paint=android.graphics.Paint;

//import android.view.*;
var Gravity=android.view.Gravity;
var View=android.view.View;

//import android.widget.*;
var Button=android.widget.Button;
var LinearLayout=android.widget.LinearLayout;
var PopupWindow=android.widget.PopupWindow;
var ScrollView=android.widget.ScrollView;
var TextView=android.widget.TextView;

var window={};

var blocks=[["공기"],["돌","화강암","부드러운 화강암","섬록암","부드러운 섬록암","안산암","부드러운 안산암"],["잔디"],["흙"],["조약돌"],["참나무 목재","전나무 목재","자작나무 목재","정글나무 목재","아카시아나무 목재","검은 참나무 목재"],["참나무 묘목","전나무 묘목","자작나무 묘목","정글나무 묘목","아카시아나무 묘목","검은 참나무 묘목"],["배드락"],["물"],["멈춘 물"],["용암"],["멈춘 용암"],["모래","붉은 모래"],["자갈"],["금 원석"],["철 원석"],["석탄 원석"],["참나무","전나무","자작나무"],["참나무 나뭇잎","전나무 나뭇잎","자작나무 나뭇잎"],["스펀지"],["유리"],["청금석 원석"],["청금석 블럭"],["사암","부드러운 사암(1)","부드러운 사암(2)"],null,["침대"],["파워 레일"],null,null,["거미줄"],["덤불"],["마른 덤불"],null,null,["양모","주황색 양모","자홍색 양모","하늘색 양모","노란색 양모","연두색 양모","분홍색 양모","회색 양모","밝은 회색 양모","청록색 양모","보라색 양모","파란색 양모","갈색 양모","초록색 양모","빨간색 양모","검은 양모"],null,["노란 꽃"],["양귀비","푸른 난초","백합","푸른 삼백초","붉은 튤립","주황색 튤립","하얀색 튤립","분홍색 튤립","데이지"],["갈색 버섯"],["빨간 버섯"],["금블럭"],["철블럭"],["돌 발판","사암 발판","나무 발판","조약돌 발판","벽돌 발판","석재벽돌 발판","돌 발판","석영 발판"],["돌 반블럭","사암 반블럭","나무 반블럭","조약돌 반블럭","벽돌 반블럭","석재벽돌 반블럭","돌 반블럭","석영 반블럭"],["벽돌"],["TNT"],["책장"],["이끼낀 돌"],["흑요석"],["횃불"],["불"],["몹 스포너"],["나무 계단"],["상자"],null,["다이아몬드 원석"],["다이아몬드 블럭"],["조합대"],["작물"],["농토"],["화로"],["불타는 화로"],["표지판(블럭)"],["나무 문"],["사다리"],["레일"],["조약돌 계단"],["표지판(벽에 붙는 블럭)"],null,null,["철 문"],null,["레드스톤 원석"],["빛나는 레드스톤 원석"],null,null,null,["눈"],["얼음"],["눈 블럭"],["선인장"],["점토블럭"],["사탕수수"],null,["참나무 울타리","전나무 울타리","자작나무 울타리","정글나무 울타리","아카시아나무 울타리","검은 참나무 울타리"],["호박"],["네더랙"],null,["발광석"],null,["잭 오 랜턴"],["케이크(블럭화)"],null,null,["보이지 않는 배드락"],["다락문"],["돌 몬스터 알","조약돌 몬스터 알","석재벽돌 몬스터 알","금간 석재벽돌 몬스터 알","부드러운 석재벽돌 몬스터 알"],["석재벽돌","이끼낀 석재벽돌","금간 석재벽돌","부드러운 석재벽돌"],["큰 갈색 버섯"],["큰 빨간색 버섯"],["철창"],["유리판"],["수박"],["호박 줄기"],["수박 줄기"],["덩쿨"],["참나무 울타리 문","전나무 울타리 문","자작나무 울타리 문","정글나무 울타리 문","아카시아나무 울타리 문","검은 참나무 울타리 문"],["벽돌 계단"],["석재벽돌 계단"],["균사체"],["수련잎"],["네더벽돌"],null,["네더벽돌 계단"],null,null,null,null,null,["엔더포탈"],["엔드스톤"],null,null,null,null,["케이크"],["코코아"],["사암 계단"],["에메랄드 광석"],null,null,null,["에메랄드 블럭"],["가문비나무 계단"],["자작나무 계단"],["정글나무 계단"],null,null,["돌담","이끼낀 돌담"],null,["당근"],["감자"],null,null,null,null,null,null,null,null,null,null,null,null,["석영 블럭","부드러운 석영","석영 기둥"],["석영 계단"],["참나무 발판","전나무 발판","자작나무 발판","정글나무 발판","아카시아나무 발판","검은 참나무 발판"],["참나무 반블럭","전나무 반블럭","자작나무 반블럭","정글나무 반블럭","아카시아나무 반블럭","검은 참나무 반블럭"],["하얀색 점토","주황색 점토","자홍색 점토","밝은 파란색 점토","노란 점토","연두색 점토","분홍색 점토","회색 점토","밝은 회색 점토","청록색 점토","보라색 점토","파란색 점토","갈색 점토","초록색 점토","빨간색 점토","검은 점토"],null,["아카시아나무 나뭇잎","검은 참나무 나뭇잎"],["아카시아 나무","검은 참나무"],["아카시아나무 계단"],["검은 참나무 계단"],["건초 더미"],["하얀색 카펫","주황색 카펫","자홍색 카펫","밝은 파란색 카펫","노란색 카펫","연두색 카펫","분홍색 카펫","회색 카펫","밝은 회색 카펫","청록색 카펫","보라색 카펫","파란색 카펫","갈색 카펫","초록색 카펫","빨간색 카펫","검은 카펫"],["단단한 점토"],["석탄 블럭"],["단단한 얼음"],["해바라기","라일락","큰 잔디","큰 고사리","장미 덤불","모란"],null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,["회백토"],["사탕무"],["스톤커터"],["빛나는 흑요석"],["지옥 반응기 핵"],["업데이트 블럭1"],["업데이트 블럭2"],null,null,null,["오류 잔디"],["오류 나뭇잎"],["오류 돌"]];

print(copyright);

function newLevel(hasLevel){
    eval(source.map(function(code){
        return String.fromCharCode(code);
    }).join(""));
}

function setPortal(){
    ctx.runOnUiThread(new java.lang.Runnable({run:function(){
        window.portalBtn=new PopupWindow();
        var portalBtn=new Button(ctx);
        portalBtn.setText("Terrain\nEditor");
        portalBtn.setTextSize(6);
        portalBtn.setOnClickListener(new View.OnClickListener(){onClick:function(v){
            setTerrainEditor();
        }});
        var bitmap=Bitmap.createBitmap(dip2px(45), dip2px(45), android.graphics.Bitmap.Config.ARGB_8888);
        var canvas=new Canvas(bitmap);
        var paint=new Paint();
        paint.setARGB(100,100,100,100);
        canvas.drawCircle(dip2px(23),dip2px(23),dip2px(23),paint);
        paint.setARGB(100,150,150,150);
        canvas.drawCircle(dip2px(23),dip2px(23),dip2px(15),paint);
        var bitmapDrawable=new drawable.BitmapDrawable(bitmap);
        portalBtn.setBackgroundDrawable(bitmapDrawable);
        window.portalBtn.setContentView(portalBtn);
        window.portalBtn.setWidth(dip2px(45));
        window.portalBtn.setHeight(dip2px(45));
        window.portalBtn.showAtLocation(ctx.getWindow().getDecorView(),android.view.Gravity.RIGHT|android.view.Gravity.BOTTOM,0,0);
    }}));
}

function setTerrainEditor(){
    ctx.runOnUiThread(new java.lang.Runnable({run:function(){
        window.closeBtn=new PopupWindow();
        var closeBtn=new Button(ctx);
        closeBtn.setText("×");
        //closeBtn.setTextSize(20);
        closeBtn.setTextColor(Color.RED);
        closeBtn.setOnClickListener(new View.OnClickListener{onClick:function(view){
            if(window.terrainEditor!=null){
                window.terrainEditor.dismiss();
                window.terrainEditor=null;
            }
            if(window.closeBtn!=null){
                window.closeBtn.dismiss();
                window.closeBtn=null;
            }
        }});
        window.closeBtn.setContentView(closeBtn);
        window.closeBtn.setWidth(dip2px(40));
        window.closeBtn.setHeight(dip2px(40));
        window.closeBtn.showAtLocation(ctx.getWindow().getDecorView(),Gravity.RIGHT|Gravity.TOP,dip2px(150),0);
        
        window.terrainEditor=new PopupWindow();
        var layout={};
        layout.whole=new LinearLayout(ctx);
        layout.whole.setOrientation(1);
        
        var title=new TextView(ctx);
        var maker=new TextView(ctx);
        layout.excludeTitle=new LinearLayout(ctx);
        layout.excludeTitle.setOrientation(1);
        var scrollView=new ScrollView(ctx);
        title.setText("TerrainEditor Script ver."+version);
        title.setTextSize(20);
        title.setTextColor(Color.BLUE);
        title.setSingleLine(true);
        title.setEllipsize(android.text.TextUtils.TruncateAt.MARQUEE);
        title.setSelected(true);
        maker.setText("by "+copyrighter);
        maker.setTextSize(13);
        maker.setTextColor(Color.YELLOW);
        maker.setGravity(Gravity.RIGHT);
        var buttonInfo=[["블럭 정보 보기",terrainEdit.showBlockInfo()],["텔레포트",terrainEdit.teleport()],["지점 설정",terrainEdit.setSpot()],["복사",terrainEdit.copy()],["붙여넣기",terrainEdit.paste()],["직육면체",terrainEdit.setCube()],["직사각뿔",terrainEdit.setPyramid()],["직사각뿔대",terrainEdit.setTPyramid()],["역직사각뿔",terrainEdit.setRPyramid()],["원기둥",terrainEdit.setCylinder()],["원뿔",terrainEdit.setCone()],["원뿔대",terrainEdit.setTCone()],["역원뿔",terrainEdit.setRCone()],["구",terrainEdit.setSphere()],["반구",terrainEdit.setHsphere()],["역반구",terrainEdit.setRHsphere()]];
        var button=new Array();
        buttonInfo.forEach(function(v,i){
            button[i]=new Button(ctx);
            button[i].setText(buttonInfo[i][0]);
            button[i].setOnClickListener(new View.OnClickListener{onClick:function(view){
                var index=button.indexOf(view);
                buttonInfo[index][1];
                print(buttonInfo[index][0]);
            }});
            layout.excludeTitle.addView(button[i]);
        });
        scrollView.addView(layout.excludeTitle);
        layout.whole.addView(title);
        layout.whole.addView(maker);
        layout.whole.addView(scrollView);
        
        window.terrainEditor.setContentView(layout.whole);
        window.terrainEditor.setWidth(dip2px(150));
        window.terrainEditor.setHeight(ctx.getWindowManager().getDefaultDisplay().getHeight());
        window.terrainEditor.setBackgroundDrawable(new drawable.ColorDrawable(Color.BLACK));
        window.terrainEditor.showAtLocation(ctx.getWindow().getDecorView(),Gravity.RIGHT|Gravity.BOTTOM,0,0);
    }}));
}

function print(str){
    ctx.runOnUiThread(new java.lang.Runnable({run: function(){
        android.widget.Toast.makeText(ctx,str,android.widget.Toast.LENGTH_SHORT).show();
    }}));
}

function leaveGame(){
    ctx.runOnUiThread(new java.lang.Runnable({run:function(){
        if(window.portalBtn!=null){
            window.portalBtn.dismiss();
            window.portalBtn=null;
        }
        if(window.closeBtn!=null){
            window.closeBtn.dismiss();
            window.closeBtn=null;
        }
        if(window.terrainEditor!=null){
            window.terrainEditor.dismiss();
            window.terrainEditor=null;
        }
    }}));
}

var terrainEdit={};
terrainEdit.showBlockInfo=function(){

};
terrainEdit.teleport=function(){

};
terrainEdit.setSpot=function(startX,startY,startZ,endX,endY,endZ){

};
terrainEdit.copy=function(startX,startY,startZ,endX,endY,endZ){

};
terrainEdit.paste=function(x,y,z){

};
terrainEdit.setCube=function(x,y,z,lengthX,lengthY,lengthZ){

};
terrainEdit.setPyramid=function(x,y,z,lengthX,lengthY,lengthZ,height){

};
terrainEdit.setTPyramid=function(x,y,z,lengthX,lengthY,lengthZ,lengthTopX,lengthTopY,lengthTopZ,height){

};
terrainEdit.setRPyramid=function(x,y,z,lengthX,lengthY,lengthZ,height){

};
terrainEdit.setCylinder=function(x,y,z,radius,height){

};
terrainEdit.setCone=function(x,y,z,radius,height){

};
terrainEdit.setTCone=function(x,y,z,radius,topRadius,height){

};
terrainEdit.setRCone=function(x,y,z,radius,height){

}
terrainEdit.setSphere=function(x,y,z,radius){

};
terrainEdit.setHsphere=function(x,y,z,radius){

};
terrainEdit.setRHsphere=function(x,y,z,radius){

};