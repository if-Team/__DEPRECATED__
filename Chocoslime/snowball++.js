//if-Team | Choseul

var typeId = Entity.getEntityTypeId;
var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
var s = {
  c:false, 
  e:false, 
  t:false, 
  f:false, 
  h:false
};
var read = ModPE.readData;

function chatHook(c) {
  var m=c.split(" ");
  if(m[0]=="@home") {
    Entity.setPosition(getPlayerEnt(), read("x"), read("y"), read("z"));
  }
}

function entityRemovedHook(ent) {
  var x = Entity.getX(ent);
  var y = Entity.getY(ent);
  var z = Entity.getZ(ent);
  if(typeId(ent) == 81 && s.e == true) {
    explode(x, y +1, z, 6);
  } else if(typeId(ent) == 81 && s.t == true) {
    Entity.setPosition(getPlayerEnt(), x, y +2, z);
  } else if(typeId(ent) == 81 && s.f == true) {
    for(var i=0; i<5; i++) {
      Level.setTile(x -i, y +1, z, 51);
      Level.setTile(x +i, y +1, z, 51);
      Level.setTile(x, y +1, z +i, 51);
      Level.setTile(x, y +1, z -i, 51);
    }
  } else if(typeId(ent) == 81 && s.h == true) {
    var x = Entity.getX(ent);
    var y = Entity.getY(ent) +2;
    var z = Entity.getZ(ent);
    ModPE.saveData("x", x);
    ModPE.saveData("y", y);
    ModPE.saveData("z", z);
    toast("home이 설정되었습니다.");
  }
}

function useItem(x, y, z, i, b) {
  if(i == 332) {
    showMainDialog();
  }
}

function showMainDialog() {
  ctx.runOnUiThread(new java.lang.Runnable( {
    run:function() {
      try {
          var dialog = new android.app.AlertDialog.Builder(ctx);
          var rg = new android.widget.RadioGroup(ctx);
          var rb1 = new android.widget.RadioButton(ctx);
          var rb2 = new android.widget.RadioButton(ctx);
          var rb3 = new android.widget.RadioButton(ctx);
          var rb4 = new android.widget.RadioButton(ctx);
          rb1.setText("explosion_snowball");
          rb2.setText("teleport_snowball");
          rb3.setText("fire_snowball");
          rb4.setText("home set_snowball");
          rg.addView(rb1);
          rg.addView(rb2);
          rg.addView(rb3);
          rg.addView(rb4);
          rb1.setId(0);
          rb2.setId(1);
          rb3.setId(2);
          rb4.setId(3);
          rg.setOnCheckedChangeListener(new android.widget.RadioGroup.OnCheckedChangeListener({
            onCheckedChanged:function(g,c) {
              if(c == 0) {
                toast("눈덩이를 던지면 폭발합니다.");
                s = {c:true, e:true, t:false, f:false, h:false};
              } else if(c == 1) {
                toast("눈덩이를 던지면 그 곳으로 텔레포트 합니다.");
                s = {c:true, e:false, t:true, f:false, h:false};
              } else if(c == 2) {
                toast("눈덩이를 던지면 불이 생성됩니다.");
                s = {c:true, e:false, t:false, f:true, h:false};
              } else if(c == 3) {
                toast("눈덩이를 던진 곳이 home으로 설정됩니다.");
                s = {c:true, e:false, t:false, f:false, h:true}
              }
            }
          }));
          dialog.setPositiveButton("설정", null);
          dialog.setNegativeButton("닫기", new android.content.DialogInterface.OnClickListener({
            onClick: function() {
              if(s.c != true) {
                showMainDialog();
                toast("먼저 눈덩이의 종류를 선택하여 주세요.");
              }
              s = {c:false, e:false, t:false, f:false, h:false};
            }
          }));
          dialog.setTitle("snowball ++");
          dialog.setView(rg);
          dialog.setCancelable(false);
          dialog.show();
      }
      catch(e) {
          toast(e);
      }
    }
  }));
}

function showHomeSetDialog() {
  ctx.runOnUiThread(new java.lang.Runnable( {
    run:function() {
      try {
        var dialog = new android.app.AlertDialog.Builder(ctx);
      }
      catch(e) {
          toast(e);
      }
    }
  }));
}

function toast(msg) {
  ctx.runOnUiThread(new java.lang.Runnable({run: function(){
    android.widget.Toast.makeText(ctx, "개발자의 말 : "+msg, android.widget.Toast.LENGTH_SHORT).show();
    }
  }));
}

/*
생각날 때마다 적는 아이디어

일단은 매우 간단한 스크립트지만 아이디어가 없으므로 이 것을 대작으로 만들 것임.
엔티티 터치하면 엔티티관련 눈덩이, 블럭 터치하면 블럭관련 눈덩이. (블럭관련엔 텔포 포함)

블럭 터치시 눈덩이 종류 ********************
폭발, 텔포, 셋홈, 파이어

엔티티 터치시 눈덩이 종류 *******************
엔티티 위치 조정, 엔티티 복제 - 추가예정

이스터 에그 ********************
추가예정

*/