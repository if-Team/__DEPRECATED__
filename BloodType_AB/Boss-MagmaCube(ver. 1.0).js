/*마그마큐브 보스 스크립트
제작자: 멸종위기의 AB형(ehddnjs9719@naver.com)
무단 배포와 수정을 금지합니다*/

////////////////////
const bossMaxHP=300;
const bossFireCoolTime=350;
const bossRushCoolTime=380;
const arrowSkillCoolTime=230;
const skillNumber=2;
const attackMobMaxHP=10;
const recoverMobMaxHP=5;
//마그마큐브 상태 지정
const none=1;
const jump=2;
const attack=3;
const revenge=4;
const attackMobSpawn=5;
const recoverMobSpawn=6;
const fire=7;
const fireArrow=8;
const lavaArrow=9;
const death=10;
var i, j, k;
////////////////////
//마그마큐브 관련
var check=false;
var bossSpawnTime=0;
var bossSpawnCheck=false;
var bossHpCheck=0;
var size1=5;
var px1=0;
var py1=0;
var pz1=0;
var count1=0;
var dam=0;
var jumpdist=0;
var hp1=0;
var attackDelay1=0;	
var canAttack=false;
var attackedDelay=0;
var canAttacked=false;
var blockExisting=true;
var revengeCoolTime1=0;
var revengeTime1=0;
var attackCoolTime1=0;
var fireCoolTime1=0;
var moveTime1=0;
var actTime1=0;
var skillTime=0;
var skillCheck=0;
var skillNum=0;
var revengeRepeat1=0;
var arrowCoolTime=0;
var bossJumpCheck=0;
var actCheck=0;
var actCoord1=[0, 0, 0, 0, 0, 0, 0, 0];
//엔티티블럭 관련
var tntTimer=-30;
var wantEntTnt=new Array();
//소환몹 관련
var attackMobHp=0;
var recoverMobHp=0;
var attackMob=0;
var recoverMob=0;
var tntCoord=[];
var attackMobY=0;
var recoverMobY=0;
var attackTime=0;
var attackItem=new Array(2);
attackItem[0]=new Array();
attackItem[1]=new Array();
var attackItemDist=new Array();
var attackItemCheck=0;
var recoverTime=0;
var recoverEffect=0;
var recoverCheck=0;
var angle1=0;
var angle2=0;
var mobTime1=0;
var mobTime2=0;
//플레이어화살관련
var pArrowAry=[];
var pArrowCount=[];
var pArrowCheck=false;
//플레이어 위치 저장
var savePlayerPos={x:0, y:0, z:0};
//보스화살관련
var bArrowAry=new Array(10);
var bArrowSaveAry=new Array();
var bArrowCount=new Array();
var bArrowPosition=new Array(10);
var bArrowDist=new Array(10);
for(i=0;i<bArrowAry.length;i++){
	bArrowPosition[i]={x:0, y:0, z:0};
	bArrowDist[i]={x:0, y:0, z:0};
}
//보스스킬관련
var playerPos=new Array(5);
for(i=0;i<playerPos.length;i++){
	playerPos[i]={x:0, y:0, z:0};
}
var lavaBlock=[];
var lavaCount=[];
//GUI관련
var ctx=null;
var hpWindow=null;
var bossNameWindow=null;
var bossNameText=null;
var hpProgBar=null;
//던전 블럭 배열
var dungeonBlock_MagmaCube;
var dungeonBlock_MagmaCube=make3DAry(32, 22, 32);
for(i=0;i< dungeonBlock_MagmaCube.length;i++ ){
	for(j=0;j< dungeonBlock_MagmaCube[i].length;j++ ){
		for(k=0;k< dungeonBlock_MagmaCube[i][j].length;k++ ){
			if(i>0&&i<31&&j>0&&j<21&&k>0&&k<31){
				dungeonBlock_MagmaCube[i][j][k]=0;
			}else if(j>5&&j<10){
				dungeonBlock_MagmaCube[i][j][k]=89;
			}else if(j===0&&(i==k||i+k==31||i==15 ||i==16||k==15||k==16)){
				dungeonBlock_MagmaCube[i][j][k]=112;
			}else if( j==21&&(i==k||i+k==31||i==15 ||i==16||k==15||k==16) ){
				dungeonBlock_MagmaCube[i][j][k]=89;
			}else{
				dungeonBlock_MagmaCube[i][j][k]=87;
			}
		}
	}
}
////////////////////
function newLevel(){
	cm("§7보스 스크립트 제작: 멸종위기의 AB형(ehddnjs9719@naver.com)\n§7PERK-PE Revolution in Korea");
	ctx = com.mojang.minecraftpe.MainActivity. currentMainActivity.get();
}
function leaveGame(){
	ctx.runOnUiThread(new java.lang.Runnable({run: function(){
		if( hpWindow ){
			try{
				hpWindow.dismiss();
				hpWindow = null;
			}catch( error ) { } 
		}
		if( bossNameWindow ){
			try{
				bossNameWindow.dismiss();
				bossNameWindow = null;
			}catch( error ) { } 
		}
	}}));
	ctx=null;
}
function useItem(x, y, z, itemId, blockId, side, itemDamage, blockDamage){
	if( Level.getGameMode()==1 ){
		print("크리에이티브 모드에서는 스크립트를 사용할 수 없습니다.\n맵에서 퇴장합니다");
		ModPE.leaveGame();
	}
	if(itemId==280&&!(check)&&side==1&& !bossSpawnCheck&&actCheck!=death){
		var bossPortalCheck=true;
		for(i=-1;i<2;i++){
			for(j=-1;j<2;j++){
				if(!(i===0&&j===0)){
					if( Level.getTile(x+i, y, z+j)!=49 ){
						bossPortalCheck=false;
					}
				}
			}
		}
		if(blockId==87&&bossPortalCheck){
			px1=12;
			py1=1;
			pz1=12;
			cm("§6<system>\n§6던전으로 이동합니다");
			bossSpawnCheck=true;
		}
	}
	if(blockId==87||blockId==112 ||blockId==49&&check){
if((x>=px1&&x<px1+size1)&&(y>=py1&&y<py1+size1)&&(z>=pz1&&z<pz1+size1)){
			preventDefault();
			if(blockId==87){
				hp1=bossDamage(hp1, itemId);
			}else if(blockId==112){
				hp1=bossDamage(hp1, itemId)+1;
			}else if(blockId==49){
				hp1=bossDamage(hp1, 2000);
			}
		}
	}
	if(y==1&&x>=15&&x<=16 &&z>=15&&z<=16 &&actCheck==death){
		Entity.setPosition(Player.getEntity(), savePlayerPos.x, savePlayerPos.y+1, savePlayerPos.z);
		cm("§6<system>\n§6원래 장소로 이동합니다");
		actCheck=none;
		attackItem=new Array(2);
		attackItem[0]=new Array();
		attackItem[1]=new Array();
		attackItemDist=new Array();
		lavaBlock=[];
		lavaCount=[];
		bossHpCheck=0;
		attackMob=0;
		recoverMob=0;
		tntTimer=-30;
	}
	if(check|| actCheck==death ){
		preventDefault();
	}
}
function destroyBlock(x, y, z, side){
	if(check|| actCheck==death ){
		preventDefault();
	}
}
function deathHook(attacker, victim){
	if(Entity.getEntityTypeId(victim)===0){
		check=false;
		cm("§6<system>\n§6보스와 전투하는 도중 사망하셨습니다");
		changeBossBlock(px1, py1, pz1, size1, 0, 0);
		for(i=0;i<wantEntTnt.length;i++){
			for(j=0;j<wantEntTnt[i].length; j++){
				moveEntTnt(wantEntTnt[i][j], 128, 256, 128);
			}
		}
		attackItem=new Array(2);
		attackItem[0]=new Array();
		attackItem[1]=new Array();
		attackItemDist=new Array();
		lavaBlock=[];
		lavaCount=[];
		tntTimer=-30;
		bossHpCheck=0;
		attackMob=0;
		recoverMob=0;
		leaveGame();
		ctx = com.mojang.minecraftpe.MainActivity. currentMainActivity.get();
	}
}
function entityAddedHook(entity){
	if(Entity.getEntityTypeId(entity)==80 &&pArrowCheck){
		pArrowAry.push(entity);
		pArrowCount.push(20);
	}
	if( Entity.getEntityTypeId(entity)==64 &&attackItemCheck==1 ){
		attackItem[0].push(entity);
		attackItemDist.push ({x:(Math.random()-0.5)/2, y:-1*Math.random()/2, z:(Math.random()-0.5)/2});
	}
}
function modTick(){
	if(bossSpawnCheck){
		if(tntTimer<22&&tntTimer>=0){
			for(i=0;i<32;i++){
				for(k=0;k<32;k++){
					Level.setTile(i, tntTimer, k, dungeonBlock_MagmaCube[i][tntTimer][k] );
				}
			}
		}
		if(tntTimer==30){
			savePlayerPos.x=Player.getX();
			savePlayerPos.y=Player.getY();
			savePlayerPos.z=Player.getZ();
			Entity.setPosition(Player.getEntity(), 15, 5.6, 25);
			Block.setLightLevel(87, 8);
			Entity.setHealth(Player.getEntity(), 20);
			cm("§6<system>\n§6잠시 후 보스가 소환됩니다...");
		}
		makeEntTnt();
		if(tntTimer>100){
			bossSpawnCheck=false;
			check=true;
			showGUI();
			cm("§4<warning>\n§4보스가 소환되었습니다");
			hp1=bossMaxHP;
			bossStart();
			pArrowCheck=true;
			changeBossBlock(px1, py1, pz1, size1, 87, 0);
			setTile(px1+1, py1+3, pz1, 51);
			setTile(px1+3, py1+3, pz1, 51);
			setTile(px1, py1+3, pz1+1, 51);
			setTile(px1, py1+3, pz1+3, 51);
			setTile(px1+1, py1+3, pz1+4, 51);
			setTile(px1+3, py1+3, pz1+4, 51);
			setTile(px1+4, py1+3, pz1+1, 51);
			setTile(px1+4, py1+3, pz1+3, 51);
		}
	}
	if(!(check)){
		return;
	}
	if(!canAttack){
		attackDelay1++;
		if(attackDelay1==10){
			canAttack=true;
			attackDelay1=0;
		}
	}
	if(!canAttacked){
		attackedDelay++;
		if(attackedDelay==10){
			canAttacked=true;
			attackedDelay=0;
		}
	}
	//소환몹 관리
	bossSpawnMobFunction();
	//보스의 공격스킬 관리
	bossSkills();
	//보스 불뿜기
	if(attackDist(px1, py1, pz1, size1, actCheck, fireCoolTime1, bossFireCoolTime)&&actCheck==none){
		actCheck=fire;
		actTime1=0;
		actCoord1=slimeAggCoord(px1, py1, pz1, size1, actCoord1);
		changeBossBlock(px1, py1, pz1, size1, 112, 0);
	}
	if(fireCoolTime1<bossFireCoolTime){
		fireCoolTime1++;
	}
	if(actCheck==fire){
		if(actTime1==30){
			actCheck=none;
			actTime1=0;
			fireCoolTime1=0;
			moveTime1=0;
		}
		if(actTime1>=20){
			fireExplosion(actCoord1[2], py1, actCoord1[3], 2, 2, 2);
			actCoord1[2]= actCoord1[2]+actCoord1[4];
			actCoord1[3]= actCoord1[3]+actCoord1[5];
		}
		if(actTime1<30){
			actTime1++;
		}
	}
	//보스 돌진공격
	if(attackDist(px1, py1, pz1, size1, actCheck, attackCoolTime1, bossRushCoolTime)&&actCheck==none){
		actCheck=attack;
		actCoord1=slimeAggCoord(px1, py1, pz1, size1, actCoord1);
	}
	if(attackCoolTime1< bossRushCoolTime){
		attackCoolTime1++;
	}
	if(actCheck==attack){
		if(actTime1<7){
			actTime1++;	
		}
		if(actTime1==5){
			if(attackCoordReading(actCoord1, size1)){
				if(blockExist(px1, py1, pz1, size1, Math.floor(actCoord1[2]+actCoord1[4])-Math.floor(actCoord1[2]), Math.floor(actCoord1[3]+actCoord1[5])-Math.floor(actCoord1[3]), Math.ceil(size1/4))){
					slimeMove(px1, py1, pz1, size1, Math.floor(actCoord1[2]+actCoord1[4])-Math.floor(actCoord1[2]), Math.ceil(size1/4), Math.floor(actCoord1[3]+actCoord1[5])-Math.floor(actCoord1[3]));
				px1=px1+Math.floor(actCoord1[2]+ actCoord1[4])-Math.floor(actCoord1[2]);
				pz1=pz1+Math.floor(actCoord1[3]+ actCoord1[5])-Math.floor(actCoord1[3]);
				py1=changePy(py1, Math.ceil(size1/4));
				 actCoord1[2]= actCoord1[2]+actCoord1[4];
				actCoord1[3]= actCoord1[3]+actCoord1[5];
				 actCoord1[6]=actCoord1[2];
				 actCoord1[7]=actCoord1[3];
				}
				else{
					actCheck=none;
					actTime1=0;
					attackCoolTime1=0;
					moveTime1=0;
				}
			}
			else{
				actTime1=4;
				 actCoord1[2]= actCoord1[2]+actCoord1[4];
				actCoord1[3]= actCoord1[3]+actCoord1[5];
			}
		}
		if(actTime1==7){
			while(!(isFloor(px1, py1, pz1, size1))){
				slimeMove(px1, py1, pz1, size1, 0, -1, 0);
			py1=changePy(py1, -1);
			}
			actTime1=0;
		}
	}
	if(actCheck==attack&& Math.abs(actCoord1[2]-actCoord1[0])<Math.ceil(size1/4)&& Math.abs(actCoord1[3]-actCoord1[1])<Math. ceil(size1/4)&&actTime1===0){
		actCheck=revenge;
		actCoord1=slimeAggCoord(px1, py1, pz1, size1, actCoord1);
		attackCoolTime1=0;
		moveTime1=0;
		actTime1=0;
	}
	//일정 횟수마다 보스가 플레이어 쪽으로
	if(bossJumpCheck==3&& actCheck==none){
		actCheck=revenge;
		actCoord1=slimeAggCoord(px1, py1, pz1, size1, actCoord1);
		bossJumpCheck=0;
	}
	//보스가 플레이어쪽으로 이동
	if(actCheck==revenge){
		if(actTime1<13){
			actTime1++;		
		}
		if(actTime1==9){
			if(attackCoordReading(actCoord1, size1)){
				if(blockExist(px1, py1, pz1, size1, Math.floor(actCoord1[2]+actCoord1[4])-Math.floor(actCoord1[2]), Math.floor(actCoord1[3]+actCoord1[5])-Math.floor(actCoord1[3]), Math.ceil(size1/4))){
					slimeMove(px1, py1, pz1, size1, Math.floor(actCoord1[2]+actCoord1[4])-Math.floor(actCoord1[2]), Math.ceil(size1/4), Math.floor(actCoord1[3]+actCoord1[5])-Math.floor(actCoord1[3]));
				px1=px1+Math.floor(actCoord1[2]+ actCoord1[4])-Math.floor(actCoord1[2]);
				pz1=pz1+Math.floor(actCoord1[3]+ actCoord1[5])-Math.floor(actCoord1[3]);
				py1=changePy(py1, Math.ceil(size1/4));
				 actCoord1[2]= actCoord1[2]+actCoord1[4];
				actCoord1[3]= actCoord1[3]+actCoord1[5];
				 actCoord1[6]=actCoord1[2];
				 actCoord1[7]=actCoord1[3];
				}
				else{
					actCheck=none;
					actTime1=0;
					attackCoolTime1=0;
					moveTime1=0;
				}
			}
			else{
				actTime1=8;
				 actCoord1[2]= actCoord1[2]+actCoord1[4];
				actCoord1[3]= actCoord1[3]+actCoord1[5];
			}
		}
		if(actTime1==13){
			while(!(isFloor(px1, py1, pz1, size1))){
				slimeMove(px1, py1, pz1, size1, 0, -1, 0);
			py1=changePy(py1, -1);
			}
			actTime1=0;
			revengeRepeat1++;
		}
	}
	if(actCheck==revenge&& revengeRepeat1==3){
		actCheck=none;
		actTime1=0;
		moveTime1=0;
		revengeRepeat1=0;
	}
	//보스의 이동(기본적인 움직임)
	if(moveTime1==9&&actCheck==none){
		var randomNumX= randomNumber(0);
		var randomNumZ=randomNumber(0);
		if(!(randomNumX===0&& randomNumZ===0)){
			if(blockExist(px1, py1, pz1, size1, randomNumX, randomNumZ, Math.ceil(size1/4))){
				actCheck=jump;
				slimeMove( px1, py1, pz1, size1, randomNumX*Math.ceil(size1/4), Math.ceil(size1/4), randomNumZ*Math.ceil(size1/4));
				px1=px1+randomNumX* Math.ceil(size1/4);
				pz1=pz1+randomNumZ* Math.ceil(size1/4);
				py1=changePy(py1, Math.ceil(size1/4));
				bossJumpCheck++;
			}else{
				moveTime1=8;
			}
		}else{
			moveTime1=8;
		}
	}
	if(moveTime1==13&&actCheck==jump){
		while(!(isFloor(px1, py1, pz1, size1))){
			slimeMove(px1, py1, pz1, size1, 0, -1, 0);
			py1=changePy(py1, -1);
		}
		actCheck=none;
		moveTime1=0;
	}
	if(moveTime1<20){
		moveTime1++;
	}
	if(attackedDist(px1, py1, pz1, size1)){
		 attackedDamage(px1, pz1, size1);
	}
	//플레이어화살체크
	pArrowFunction(px1, py1, pz1, size1);
	//용암블럭체크
	lavaFunction();
	//불화살체크
	fireArrowFunction();
}
//블럭체크
function blockExist(px, py, pz, size, dx, dz, dist){
	dist=dist-1;
	jumpdist=Math.ceil(size/4);
	blockExisting=true;
	if(dx>0&&dz===0){
		for(i=jumpdist;i<size+1+dist;i++){
			for(k=0;k<size;k++){
				if(Level.getTile(px+i, py+size, pz+k)!==0&&Level.getTile(px+i, py+size, pz+k)!=51&& Level.getTile(px+i, py+size, pz+k)!=10&&Level.getTile(px+i, py+size, pz+k)!=11 ){
					blockExisting=false;
				}
			}
		}
		for(i=0;i<dist+1;i++){
			for(j=jumpdist;j<size;j++){
				for(k=0;k<size;k++){
					if(Level.getTile(px+size+i, py+j, pz+k)!==0&& Level.getTile(px+size+i, py+j, pz+k)!=51&& Level.getTile(px+size+i, py+j, pz+k)!=10&& Level.getTile(px+size+i, py+j, pz+k)!=11 ){
						blockExisting=false;
					}
				}
			}
		}
	}
	 if( dx>0&&dz>0 ){
		for(i=jumpdist;i<size+1+dist;i++){
			for(k=jumpdist;k<size+1+dist;k++){
				if(Level.getTile(px+i, py+size, pz+k)!==0&& Level.getTile(px+i, py+size, pz+k)!=51&& Level.getTile(px+i, py+size, pz+k)!=10&& Level.getTile(px+i, py+size, pz+k)!=11 ){
					blockExisting=false;
				}
			}
		}
		for(k=0;k<dist+1;k++){
			for(i=0;i<size;i++){
				for(j=jumpdist;j<size;j++){
					if(Level.getTile(px+i, py+j, pz+size+k)!==0&& Level.getTile(px+i, py+j, pz+size+k)!=51&& Level.getTile(px+i, py+j, pz+size+k)!=10&& Level.getTile(px+i, py+j, pz+size+k)!=11 ){
						blockExisting=false;
					}
				}
			}
		}
		for(i=0;i<dist+1;i++){
			for(j=jumpdist;j<size;j++){
				for(k=0;k<size+1+dist;k++){
					if(Level.getTile(px+size+i, py+j, pz+k)!==0&& Level.getTile(px+size+i, py+j, pz+k)!=51 && Level.getTile(px+size+i, py+j, pz+k)!=10&& Level.getTile(px+size+i, py+j, pz+k)!=11){
						blockExisting=false;
					}
				}
			}
		}
	}
	if( dx===0&&dz>0 ){
		for(i=0;i<size;i++){
			for(k=jumpdist;k<size+1+dist;k++){
				if(Level.getTile(px+i, py+size, pz+k)!==0&& Level.getTile(px+i, py+size, pz+k)!=51 && Level.getTile(px+i, py+size, pz+k)!=10&& Level.getTile(px+i, py+size, pz+k)!=11){
					blockExisting=false;
				}
			}
		}
		for(k=0;k<dist+1;k++){
			for(i=0;i<size;i++){
				for(j=jumpdist;j<size;j++){
					if(Level.getTile(px+i, py+j, pz+size+k)!==0&& Level.getTile(px+i, py+j, pz+size+k)!=51&& Level.getTile(px+i, py+j, pz+size+k)!=10&& Level.getTile(px+i, py+j, pz+size+k)!=11 ){
						blockExisting=false;
					}
				}
			}
		}
	}
	if( dx<0&&dz>0 ){
		for(i=-1-dist;i<size-jumpdist;i++){
			for(k=jumpdist;k<size+1+dist;k++){
				if(Level.getTile(px+i, py+size, pz+k)!==0&& Level.getTile(px+i, py+size, pz+k)!=51&& Level.getTile(px+i, py+size, pz+k)!=10&& Level.getTile(px+i, py+size, pz+k)!=11 ){
					blockExisting=false;
				}
			}
		}
		for(k=0;k<dist+1;k++){
			for(i=0;i<size;i++){
				for(j=jumpdist;j<size;j++){
					if(Level.getTile(px+i, py+j, pz+size+k)!==0&& Level.getTile(px+i, py+j, pz+size+k)!=51&& Level.getTile(px+i, py+j, pz+size+k)!=10&& Level.getTile(px+i, py+j, pz+size+k)!=11 ){
						blockExisting=false;
					}
				}
			}
		}
		for(i=-dist;i<1;i++){
			for(j=jumpdist;j<size;j++){
				for(k=0;k<size+1+dist;k++){
					if(Level.getTile(px-1+i, py+j, pz+k)!==0&& Level.getTile(px-1+i, py+j, pz+k)!=51 && Level.getTile(px-1+i, py+j, pz+k)!=10&& Level.getTile(px-1+i, py+j, pz+k)!=11){
						blockExisting=false;
					}
				}
			}
		}
	}
	if( dx<0&&dz===0 ){
		for(i=-1-dist;i<size-jumpdist;i++){
			for(k=0;k<size;k++){
				if(Level.getTile(px+i, py+size, pz+k)!==0&& Level.getTile(px+i, py+size, pz+k)!=51&& Level.getTile(px+i, py+size, pz+k)!=10&& Level.getTile(px+i, py+size, pz+k)!=11 ){
					blockExisting=false;
				}
			}
		}
		for(i=-dist;i<1;i++){
			for(j=jumpdist;j<size;j++){
				for(k=0;k<size;k++){
					if(Level.getTile(px-1+i, py+j, pz+k)!==0&& Level.getTile(px-1+i, py+j, pz+k)!=51&& Level.getTile(px-1+i, py+j, pz+k)!=10&& Level.getTile(px-1+i, py+j, pz+k)!=11 ){
						blockExisting=false;
					}
				}
			}
		}
	}
	if( dx<0&&dz<0 ){
		for(i=-1-dist;i<size-jumpdist;i++){
			for(k=-1-dist;k<size-jumpdist;k++){
				if(Level.getTile(px+i, py+size, pz+k)!==0&& Level.getTile(px+i, py+size, pz+k)!=51&& Level.getTile(px+i, py+size, pz+k)!=10&& Level.getTile(px+i, py+size, pz+k)!=11 ){
					blockExisting=false;
				}
			}
		}
		for(k=-dist;k<1;k++){
			for(i=0;i<size;i++){
				for(j=jumpdist;j<size;j++){
					if(Level.getTile(px+i, py+j, pz-1+k)!==0&& Level.getTile(px+i, py+j, pz-1+k)!=51&& Level.getTile(px+i, py+j, pz-1+k)!=10&& Level.getTile(px+i, py+j, pz-1+k)!=11 ){
						blockExisting=false;
					}
				}
			}
		}
		for(i=-dist;i<1;i++){
			for(j=jumpdist;j<size;j++){
				for(k=-1-dist;k<size;k++){
					if(Level.getTile(px-1+i, py+j, pz+k)!==0&& Level.getTile(px-1+i, py+j, pz+k)!=51&& Level.getTile(px-1+i, py+j, pz+k)!=10&& Level.getTile(px-1+i, py+j, pz+k)!=11 ){
						blockExisting=false;
					}
				}
			}
		}
	}
	if( dx===0&&dz<0 ){
		for(i=0;i<size+1;i++){
			for(k=-1-dist;k<size-jumpdist;k++){
				if(Level.getTile(px+i, py+size, pz+k)!==0&& Level.getTile(px+i, py+size, pz+k)!=51&& Level.getTile(px+i, py+size, pz+k)!=10&& Level.getTile(px+i, py+size, pz+k)!=11 ){
					blockExisting=false;
				}
			}
		}
		for(k=-dist;k<1;k++){
			for(i=0;i<size;i++){
				for(j=jumpdist;j<size;j++){
					if(Level.getTile(px+i, py+j, pz-1+k)!==0&& Level.getTile(px+i, py+j, pz-1+k)!=51&& Level.getTile(px+i, py+j, pz-1+k)!=10&& Level.getTile(px+i, py+j, pz-1+k)!=11 ){
						blockExisting=false;
					}
				}
			}
		}
	}
	if( dx>0&&dz<0){
		for(i=jumpdist;i<size+1+dist;i++){
			for(k=-1-dist;k<size-jumpdist;k++){
				if(Level.getTile(px+i, py+size, pz+k)!==0&& Level.getTile(px+i, py+size, pz+k)!=51&& Level.getTile(px+i, py+size, pz+k)!=10&& Level.getTile(px+i, py+size, pz+k)!=11 ){
					blockExisting=false;
				}
			}
		}
		for(k=-dist;k<1;k++){
			for(i=0;i<size;i++){
				for(j=jumpdist;j<size;j++){
					if(Level.getTile(px+i, py+j, pz-1+k)!==0&& Level.getTile(px+i, py+j, pz-1+k)!=51&& Level.getTile(px+i, py+j, pz-1+k)!=10&& Level.getTile(px+i, py+j, pz-1+k)!=11 ){
						blockExisting=false;
					}
				}
			}
		}
		for(i=0;i<dist+1;i++){
			for(j=jumpdist;j<size;j++){
				for(k=-1-dist;k<size;k++){
					if(Level.getTile(px+size+i, py+j, pz+k)!==0&& Level.getTile(px+size+i, py+j, pz+k)!=51&& Level.getTile(px+size+i, py+j, pz+k)!=10&& Level.getTile(px+size+i, py+j, pz+k)!=11 ){
						blockExisting=false;
					}
				}
			}
		}
	}
	return blockExisting;
}
//바닥에 블럭이 있는지 체크
function isFloor(px, py, pz, size){
	blockExisting=false;
	for(i=0;i<size;i++){
		for(k=0;k<size;k++){
			if(Level.getTile(px+i, py-1, pz+k)!==0&&Level.getTile(px+i, py-1, pz+k)!=51&& Level.getTile(px+i, py-1, pz+k)!=10&&Level.getTile(px+i, py-1, pz+k)!=11 ){
				blockExisting=true;
			}else if( Level.getTile(px+i, py-1, pz+k)==10||Level.getTile(px+i, py-1, pz+k)==11 ){
				hp1=bossRecover(hp1, Math.floor(Math.random()*3));
				Level.setTile( px+i, py-1, pz+k, 0 );
			}
		}
	}
	return blockExisting;
}
//보스 이동(점프, 떨어지기...)
function slimeMove(px, py, pz, size, dx, dy , dz){
	var possibility;
	if(size==5){
		for(i=0;i<5;i++){
			for(j=0;j<5;j++){
				for(k=0;k<5;k++){
					setTile(px+i, py+j, pz+k, 0);
				}
			}
		}
		for(i=0;i<5;i++){
			for(k=0;k<5;k++){
			possibility= Math.floor(Math.random()*100);
				if(Level.getTile(px+i, py, pz+k)==0&&dy>0&&possibility>70){
					setTile(px+i, py, pz+k, 51);
				}
			}
		}
		for(i=dx;i<dx+5;i++){
			for(j=dy;j<dy+5;j++){
				for(k=dz;k<dz+5;k++){
					setTile(px+i, py+j, pz+k, 87);
				}
			}
		}
		setTile(px+dx+1, py+dy+3, pz+dz, 51);
		setTile(px+dx+3, py+dy+3, pz+dz, 51);
		setTile(px+dx, py+dy+3, pz+dz+1, 51);
		setTile(px+dx, py+dy+3, pz+dz+3, 51);
		setTile(px+dx+1, py+dy+3, pz+dz+4, 51);
		setTile(px+dx+3, py+dy+3, pz+dz+4, 51);
		setTile(px+dx+4, py+dy+3, pz+dz+1, 51);
		setTile(px+dx+4, py+dy+3, pz+dz+3, 51);
	}else{
		return;
	}
}
//보스 기준좌표변경
function changePy(y, num){
	return y+Math.floor(num);
}
function randomNumber(num){
	num=Math.random()*3;
	if(num<=1){
		return -1;
	}else if(num<=2){
		return 0;
	}else{
		return 1;
	}
}
//피격 거리 판정
function attackedDist(px, py, pz, size){
	if((Player.getX()>=px-1&&Player.getX()<px+size+1)&&(Player.getY()>=py-size&&Player.getY()-1.6<py+2*size-1)&&(Player.getZ()>=pz-1&&Player.getZ()<pz+size+1)){
		return true;
	}
	else{
		return false;
	}
}
//피격 넉백&대미지
function attackedDamage(px, pz, size){
	Entity.setVelX(Player.getEntity(), (Player.getX()-px-size/2)/2);
	Entity.setVelZ(Player.getEntity(), (Player.getZ()-pz-size/2)/2);
	fakeExplosion(Player.getX(), Player.getY(), Player.getZ(), 2, 2);
	canAttaked=false;
}
//공격시작 거리 판정
function attackDist(px, py, pz, size, act, attackCoolTime, coolTime){
	if(Math.sqrt((Player.getX()-(px+size/2))*(Player.getX()-(px+size/2))+(Player.getZ()-(pz+size/2))*(Player.getZ()-(pz+size/2)))<=50&&act==none&& attackCoolTime==coolTime&& Player.getY()>=py&&Player.getY() <=py+size){
		return true;
	}
	else{
		return false;
	}
}
//공격성 행동 좌표 설정
function slimeAggCoord(px, py, pz, size, actCoord){
	actCoord[0]=Player.getX();
	actCoord[1]=Player.getZ();
	actCoord[2]=px+size/2;
	actCoord[3]=pz+size/2;
	actCoord[4]= Math.ceil(size/4)* (actCoord[0]-actCoord[2])/Math.sqrt((Player.getX()-(px+size/2))*(Player.getX()-(px+size/2))+(Player.getZ()-(pz+size/2))*(Player.getZ()-(pz+size/2)));
	actCoord[5]= Math.ceil(size/4)* (actCoord[1]-actCoord[3])/Math.sqrt((Player.getX()-(px+size/2))*(Player.getX()-(px+size/2))+(Player.getZ()-(pz+size/2))*(Player.getZ()-(pz+size/2)));
	actCoord[6]=actCoord[2];
	actCoord[7]=actCoord[3];
	return actCoord;
}
//공격하는 좌표 읽기(선택된 좌표가 원래 좌표와 다른지 판정)
function attackCoordReading(actCoord, size){
	if(Math.abs(Math.floor(actCoord[6])-Math.floor(actCoord[2]+actCoord[4]))>Math.ceil(size/4)||Math.abs(Math.floor(actCoord[7])-Math.floor(actCoord[3]+actCoord[5]))>Math.ceil(size/4)){
		return true;
	}
	else{
		return false;
	}
}
//불 발사
function fireExplosion(px, py, pz, dx, dy, dz){
	var possibility;
	for(i=-dx;i<dx+1;i++){
		for(j=-dy;j<dy+1;j++){
			for(k=-dz;k<dz+1;k++){
				possibility= Math.floor(Math.random()*100);
				if(Level.getTile(px+i, py+j-1, pz+k)!==0&&Level.getTile(px+i, py+j, pz+k)===0&&possibility>80){
					setTile(px+i, py+j, pz+k, 51);
				}
			}
		}
	}
}
//보스의 블럭 바꾸기
function changeBossBlock(px, py, pz, size, blockId, blockDamage){
	for(i=0;i<size;i++){
		for(j=0;j<size;j++){
			for(k=0;k<size;k++){
				if(Level.getTile(px+i, py+j, pz+k)!=51){
					setTile(px+i, py+j, pz+k, blockId, blockDamage);
				}
			}
		}
	}
}
//보스에게 대미지
function bossDamage(hp, damageItemId){
	if(actCheck==attackMobSpawn|| actCheck==recoverMobSpawn||!(canAttack)){
		return hp;
	}
	canAttack=false;
	var damageAmount=0;
	switch(damageItemId){
		case 268://나무칼
			damageAmount+= 3+Math.floor(Math.random()*3);
			break;
		case 283://금칼
			damageAmount+= 3+Math.floor(Math.random()*4);
			break;
		case 272://돌칼
			damageAmount+= 4+Math.floor(Math.random()*4);
			break;
		case 267://철칼
			damageAmount+= 5+Math.floor(Math.random()*5);
			break;
		case 276://다이아칼
			damageAmount+= 6+Math.floor(Math.random()*6);
			break;
		case 1000://화살
			damageAmount+= 2+Math.floor(Math.random()*7);
			break;
		case 2000://옵시디언상태시 공격
			damageAmount+=1;
			break;
		default://그 외
			damageAmount+= 1+Math.floor(Math.random()*3);
	}
	if( hp-damageAmount<=0 ){
		hp=0;
		damageAmount=0;
		bossDead(px1, py1, pz1, size1);
	}
	 ctx.runOnUiThread(new java.lang.Runnable({run: function(){
		try{
			hpProgBar.setProgress (Math.floor(hpProgBar.getMax()*(hp-damageAmount)/bossMaxHP));
		}catch(error){
			clientMessage("§4error!\n"+error);
		}
	}}));
	return (hp-damageAmount);
}
//보스 회복
function bossRecover(hp, recoverAmount){
	var recoverA=hp+recoverAmount;
	if(recoverA>bossMaxHP){
		recoverA=bossMaxHP;
	}
	ctx.runOnUiThread(new java.lang.Runnable({run: function(){
		try{
			hpProgBar.setProgress (Math.floor(hpProgBar.getMax()*hp1/bossMaxHP));
		}catch(error){
			cm("§4error!\n"+error);
		}
	}}));
	return recoverA;
}
//보스 처치
function bossDead(px, py, pz, size){
	actCheck=death;
	changeBossBlock(px, py, pz, size, 0, 0);
	for(i=0;i<wantEntTnt.length;i++){
		for(j=0;j<wantEntTnt[i].length; j++){
			Entity.remove(wantEntTnt[i][j]);
		}
	}
	Level.explode(px+size/2, py+size/2, pz+size/2, size/2-1);
	cm("§6<system>\n§6보스를 처치했습니다\n§6중앙의 블럭을 터치하면 밖으로 이동합니다");
	for(i=1;i<=30;i++){
		for(k=1;k<=30;k++){
			Level.setTile(i, 1, k, 0);
		}
	}
	for(i=14;i<=17;i++){
		for(k=14;k<=17;k++){
			if(i>=15&&i<=16&&k>=15&&k<=16){
				Level.setTile(i, 1, k, 87);
			}else{
				Level.setTile(i, 1, k, 49);
			}
		}
	}
	Level.dropItem(px+size/2, py+size/2, pz+size/2, 1, 264, 64, 0);
	check=false;
	leaveGame();
	ctx = com.mojang.minecraftpe.MainActivity. currentMainActivity.get();
}
//가상의 폭발
function fakeExplosion(x, y, z, r, dam){
	if(!(isClose3D(Player.getX(), Player.getY(), Player.getZ(), x, y, z, r))){
		return;
	}
	var newHealth=Entity.getHealth (Player.getEntity())-dam;
	if(newHealth<=0){
		newHealth=0;
		deathHook(null, Player.getEntity());
	}
	Level.explode(Player.getX(), Player.getY(), Player.getZ(), 0.1);
	Entity.setHealth(Player.getEntity(), newHealth);
}
//3차원배열 만들기
function make3DAry(length1, length2, length3){
	var new3DAry=new Array(length1);
	for(i=0;i<new3DAry.length; i++ ){
		new3DAry[i]=new Array(length2);
		for(j=0;j<new3DAry[i] .length;j++){
			new3DAry[i][j]=new Array(length3);
		}
	}
	return new3DAry;
}
//블럭엔티티만들기
function makeEntTnt(){
	if(tntTimer>100){
		return;
	}
	tntTimer++;
	if(!tntTimer){
		wantEntTnt[0]=new Array(4);
		wantEntTnt[1]=new Array(5);
		wantEntTnt[2]=new Array(4);
		wantEntTnt[3]=new Array(7);
		wantEntTnt[4]=new Array(15);
		wantEntTnt[5]=new Array(5);
		for(i=0;i<wantEntTnt.length;i++){
			for(j=0;j<wantEntTnt[i].length;j++){
				wantEntTnt[i][j]= Level.spawnMob(128, 256, 128, 65);
				Entity.setRenderType (wantEntTnt[i][j], 20);
			}
		}
	}
	if(tntTimer<80&&tntTimer>=0){
		for(i=0;i<wantEntTnt.length;i++){
			for(j=0;j<wantEntTnt[i].length;j++){
				setVelEnt(wantEntTnt[i][j], 0, 0, 0);
				Entity.setPosition(wantEntTnt[i][j], 128, 256, 128);
			}
		}
	}
	switch(tntTimer){
		case 0:
			for(i=1;i<7;i++){
				Entity.rideAnimal (wantEntTnt[3][i], wantEntTnt[3][i]);
			}
			break;
		case 23:
			Entity.rideAnimal (wantEntTnt[3][0], wantEntTnt[3][0]);
			break;
		case 31:
			for(i=0;i<4;i++){
				Entity.rideAnimal (wantEntTnt[0][i], wantEntTnt[0][i]);
			}
			for(i=0;i<15;i++){
				if(i%3==0){
					Entity.rideAnimal (wantEntTnt[4][i], wantEntTnt[4][i]);
				}
			}
			for(i=0;i<5;i++){
				Entity.rideAnimal (wantEntTnt[5][i], wantEntTnt[5][i]);
			}
			break;
		case 38:
			for(i=0;i<4;i++){
				Entity.rideAnimal (wantEntTnt[2][i], wantEntTnt[2][i]);
			}
			for(i=0;i<15;i++){
				if(i%3!=0){
					Entity.rideAnimal (wantEntTnt[4][i], wantEntTnt[4][i]);
				}
			}
			break;
		case 39:
			Entity.rideAnimal (wantEntTnt[1][0], wantEntTnt[1][0]);
			break;
		case 60:
			for(i=1;i<5;i++){
				Entity.rideAnimal (wantEntTnt[1][i], wantEntTnt[1][i]);
			}
			break;
	}
}
//블럭엔티티이동
function moveEntTnt(ent, x, y, z){
	pArrowCheck=false;
	var newMob=Level.spawnMob(x, y, z, 80);
	Entity.setRenderType(newMob, 21);
	setVelEnt(newMob, 0, 0, 0);
	Entity.rideAnimal(ent, newMob);
	Entity.remove(newMob);
	Entity.rideAnimal(ent, ent);
	pArrowCheck=true;
}
//엔티티이동
function setVelEnt(ent, xAmount, yAmount, zAmount){
	Entity.setVelX(ent, xAmount);
	Entity.setVelY(ent, yAmount);
	Entity.setVelZ(ent, zAmount);
}
//clientMessage 줄이기
function cm(content){
	clientMessage(content);
}
//거리관련 함수
function isClose2D(x1, z1, x2, z2, dist){
	if(Math.sqrt((x1-x2)* (x1-x2)+ (z1-z2)* (z1-z2))<=dist ){
		return true;
	}else{
		return false;
	}
}
function getDist2D( x1, z1, x2, z2 ){
	return Math.sqrt((x1-x2)* (x1-x2)+ (z1-z2)* (z1-z2));
}
function isClose3D(x1, y1, z1, x2, y2, z2, dist){
	if(Math.sqrt((x1-x2)* (x1-x2)+ (y1-y2)* (y1-y2) + (z1-z2)* (z1-z2))<=dist ){
		return true;
	}else{
		return false;
	}
}
function getDist3D( x1, y1, z1, x2, y2, z2 ){
	return Math.sqrt((x1-x2)* (x1-x2)+ (y1-y2)* (y1-y2) + (z1-z2)* (z1-z2));
}
function particleEffect(x, y, z, blockId, blockDamage){
	var saveCheck=false;
	if( Level.getTile(x, y, z)!==0){
		var saveBlock={id: Level.getTile(x, y, z), damage: Level.getData(x, y, z)};
		saveCheck=true;
	}
	Level.setTile(x, y, z, blockId, blockDamage);
	Level.destroyBlock(x, y, z, false);
	if(saveCheck){
		Level.setTile(x, y, z, saveBlock.id, saveBlock.damage);
	}
}
//엔티티 위치 구하기
function getEntPosition(ent){
	var entPos={x:0, y:0, z:0};
	entPos.x=Entity.getX(ent);
	entPos.y=Entity.getY(ent);
	entPos.z=Entity.getZ(ent);
	return entPos;
}
//보스관련값 리셋
function bossStart(){
	actTime1=0;
	moveTime1=0;
	attackDelay1=0;
	canAttack=true;
	canAttacked=true;
	revengeRepeat1=0;
	actCheck=none;
}
//플레이어가 쏜 화살 체크
function pArrowFunction(px, py, pz, size){
	for(i=0;i<pArrowCount.length;i++){
	 	if( (Entity.getX( pArrowAry[i] )>=px-0.5&& Entity.getX( pArrowAry[i] )<px+size+0.5)&& (Entity.getY( pArrowAry[i] )>=py-0.5 &&Entity.getY( pArrowAry[i] )<py+size+0.5) &&(Entity.getZ( pArrowAry[i] )>=pz-0.5 &&Entity.getZ( pArrowAry[i] )<pz+size+0.5) ){
			if(Level.getTile(px1, py1, pz1)==49){
				hp1=bossDamage(hp1, 2000);
			}else{
				hp1=bossDamage(hp1, 1000);
			}
			Entity.remove(pArrowAry[i]);
			pArrowAry.splice(i,1);
			pArrowCount.splice(i,1);
			i--;
		}
	}
	for(i=0;i<pArrowCount.length;i++){
		pArrowCount[i]--;
	 	if(pArrowCount[i]<=0){
			Entity.remove(pArrowAry[i]);
			pArrowAry.splice(i,1);
			pArrowCount.splice(i,1);
			i--;
		}
	}
}
//보스의 스킬 관리 함수
function bossSkills(){
	if(arrowCoolTime<arrowSkillCoolTime){
		arrowCoolTime++;
		return;
	}else if(arrowCoolTime== arrowSkillCoolTime&&actCheck==none){
		var possibility=Math.floor (Math.random()*(skillNumber));
		changeBossBlock(px1, py1, pz1, size1, 49, 0);
		switch(possibility){
			case 0://fireArrow
				pArrowCheck=false;
				for(i=0;i<4+bossHpCheck;i++){
					bArrowAry[i]=Level.spawnMob (px1+size1/2, py1+13+0.1*i, pz1+size1/2, 80);
				}
				pArrowCheck=true;
				actCheck=fireArrow;
				break;
			case 1://lavaArrow
				actCheck=lavaArrow;
				for(i=0;i<3+Math.floor (bossHpCheck/2);i++){
					moveEntTnt(wantEntTnt[5][i], px1+size1/2, py1+6, pz1+size1/2);
				}
				break;
		}
	}else if(actCheck==fireArrow){
		skillTime++;
		if(skillTime==10){
			for(i=0;i<4+bossHpCheck;i++){
				bArrowPosition[i]= getEntPosition(bArrowAry[i]);
				Entity.setFireTicks(bArrowAry[i], 10);
			}
		}
		if(skillTime%10==0){
			bArrowDist[ skillTime/10-1].x= Player.getX()-Entity.getX( bArrowAry[skillTime/10-1]);
			bArrowDist[ skillTime/ 10-1 ].y= Player.getY()-Entity.getY (bArrowAry[ skillTime/10-1 ]);
			bArrowDist[ skillTime/ 10-1 ].z= Player.getZ()-Entity.getZ (bArrowAry[skillTime/ 10-1]);
		}
		if(skillTime>10){
			for(i=Math.floor(skillTime/10)-1  ;i<4+bossHpCheck;i++){
				setVelEnt(bArrowAry[i], 0, 0, 0);
				Entity.setPosition(bArrowAry[i], bArrowPosition[i].x, bArrowPosition[i].y, bArrowPosition[i].z);
			}
			if(skillTime%10==0){
				var newDist= getDist3D(Player.getX(), Player.getY(), Player.getZ(), Entity.getX(bArrowAry[skillTime/10-2]), Entity.getY(bArrowAry[skillTime/10-2]), Entity.getZ(bArrowAry[skillTime/10-2]));
				Entity.remove(bArrowAry[ skillTime/ 10-2 ]);
				pArrowCheck=false;
				bArrowAry[ skillTime/ 10-2]= Level.spawnMob( bArrowPosition [skillTime/ 10-2 ].x, bArrowPosition [skillTime/ 10-2 ].y, bArrowPosition [skillTime/ 10-2 ].z, 80 );
				bArrowSaveAry.push (bArrowAry[skillTime/ 10-2] );
				bArrowCount.push(400);
				pArrowCheck=true;
				setVelEnt(bArrowAry[skillTime/ 10-2], bArrowDist[ skillTime/ 10-2 ].x/newDist*5, bArrowDist[ skillTime/ 10-2 ].y/newDist*5, bArrowDist[ skillTime/ 10-2 ].z/newDist*5);
				skillCheck++;
				particleEffect( bArrowPosition [skillTime/ 10-2 ].x, bArrowPosition [skillTime/ 10-2 ].y, bArrowPosition [skillTime/ 10-2 ].z, 87, 0);
			}
			if(skillCheck>=4+bossHpCheck){
				skillTime=0;
				skillCheck=0;
				bossStart();
				arrowCoolTime=0;
			}
		}
	}else if(actCheck==lavaArrow){
		skillTime++;
		if(skillTime<20){
			for(i=0;i<3+Math.floor (bossHpCheck/2);i++){
				moveEntTnt(wantEntTnt[5][i], px1+size1/2+skillTime*0.2* Math.cos(i/ (3+Math.floor(bossHpCheck/2))*2*Math.PI), py1+6+skillTime*0.2, pz1+size1/2+skillTime*0.2*Math.sin(i/ (3+Math.floor(bossHpCheck/2))*2*Math.PI ));
			}
		}else if(skillTime>=20){
			if(skillTime%20==0&& skillTime<=20* (3+Math.floor(bossHpCheck/2)) ){
				var newDist=getDist3D (Player.getX(), Player.getY(), Player.getZ(), Entity.getX(wantEntTnt[5][skillTime/20-1] ), Entity.getY(wantEntTnt[5][ skillTime/20-1 ] ), Entity.getZ(wantEntTnt[5][ skillTime/20 -1] ));
				playerPos[skillTime/20-1]= {x: (Player.getX()- Entity.getX(wantEntTnt[5][ skillTime/20 -1] ))/newDist*0.8, y: (Player.getY()-1.5- Entity.getY( wantEntTnt[5][ skillTime/20 -1] ))/newDist*0.8 , z: (Player.getZ()- Entity.getZ( wantEntTnt[5][ skillTime/20 -1] ))/newDist*0.8};
				skillNum++;
			}
			for(i=0;i<skillNum;i++){
				if(Level.getTile( Entity.getX(wantEntTnt[5][i]), Entity.getY( wantEntTnt[5][i] ), Entity.getZ( wantEntTnt[5][i] ))===0|| Level.getTile(Entity.getX(wantEntTnt[5][i]), Entity.getY( wantEntTnt[5][i] ), Entity.getZ( wantEntTnt[5][i] ))==51 || Level.getTile(Entity.getX(wantEntTnt[5][i]), Entity.getY( wantEntTnt[5][i] ), Entity.getZ( wantEntTnt[5][i] ))==49){
					moveEntTnt(wantEntTnt[5][i], Entity.getX( wantEntTnt[5][i] )+ playerPos[i].x, Entity.getY (wantEntTnt[5][i] )+playerPos[i].y-1, Entity.getZ( wantEntTnt[5][i] )+ playerPos[i].z);
				}else{
					if(Level.getTile( Entity.getX( wantEntTnt[5][i] ), Entity.getY (wantEntTnt[5][i] )+1, Entity.getZ( wantEntTnt[5][i] ) )===0|| Level.getTile( Entity.getX( wantEntTnt[5][i] ), Entity.getY (wantEntTnt[5][i] )+1, Entity.getZ( wantEntTnt[5][i] ) )==51 ){
						Level.setTile( Entity.getX( wantEntTnt[5][i] ), Entity.getY (wantEntTnt[5][i] )+1, Entity.getZ( wantEntTnt[5][i] ), 11 );
						lavaBlock.push({ x:Entity.getX( wantEntTnt[5][i] ), y:Entity.getY (wantEntTnt[5][i] )+1, z:Entity.getZ( wantEntTnt[5][i] ) });
						lavaCount.push(600);
					}
					moveEntTnt(wantEntTnt[5][i], 128, 256, 128);
					skillCheck++;
				}
			}
			if(skillCheck>=3+Math.floor (bossHpCheck/2)||skillTime>200){
				for(i=0;i<3+Math.floor (bossHpCheck/2);i++){
					moveEntTnt(wantEntTnt[5][i], 128, 256, 128);
				}
				skillTime=0;
				skillCheck=0;
				arrowCoolTime=0;
				skillNum=0;
				bossStart();
			}
		}
	}
}
//보스가 소환한 몹 관리 함수
function bossSpawnMobFunction(){
	if(actCheck==none){
		if(bossHpCheck===0&& hp1<bossMaxHP/6*5){
			bossHpCheck=1;
		}else if(bossHpCheck==1&& hp1<bossMaxHP/6*4){
			changeBossBlock(px1, py1, pz1, size1, 246, 0);
			bossHpCheck=2;
			attackMob=1;
			tntCoord[0]={x:px1+size1/2, y:py1+6.5, z:pz1+size1/2};
			attackMobY=py1+6.5;
			actCheck=attackMobSpawn;
		}else if(bossHpCheck==2&& hp1<bossMaxHP/6*3){
			bossHpCheck=3;
		}else if(bossHpCheck==3&& hp1<bossMaxHP/6*2){
			changeBossBlock(px1, py1, pz1, size1, 246, 0);
			bossHpCheck=4;
			recoverMob=1;
			tntCoord[1]={ x:px1+size1/2, y:py1+7.5, z:pz1+size1/2 };
			recoverMobY=py1+7.5;
			actCheck=recoverMobSpawn;
		}else if(bossHpCheck==4&& hp1<bossMaxHP/6){
			bossHpCheck=5;
		}
	}
	if(attackMob==1){
		for(i=0;i<4;i++){
			moveEntTnt(wantEntTnt[0][i], tntCoord[0].x+ 2*Math.cos((angle1+90*i)/180*Math.PI), tntCoord[0].y, tntCoord[0].z+ 2*Math.sin((angle1+90*i)/180*Math.PI));
		}
		angle1+=10;
		if(angle1%60==0){
			particleEffect( tntCoord[0].x, tntCoord[0].y, tntCoord[0].z, 35, 14 );
		}
		if(angle1>720){
			moveEntTnt(wantEntTnt[1][0], tntCoord[0].x, attackMobY, tntCoord[0].z);
			attackMobY+=0.1;
			if(attackMobY>=3+ tntCoord[0].y ){
				attackMob=2;
				tntCoord[0].y=attackMobY;
				 moveEntTnt(wantEntTnt[0][0], 128, 256, 128);
				moveEntTnt(wantEntTnt[0][1], 128, 256, 128);
				moveEntTnt(wantEntTnt[0][2], 128, 256, 128);
				moveEntTnt(wantEntTnt[0][3], 128, 256, 128);
				Entity.setFireTicks( wantEntTnt[1][0], 5);
				bossStart();
				attackMobHp=attackMobMaxHP;
				cm("§6<system>\n§6공격 소환몹이 소환되었습니다\n§6소환몹은 화살로 공격 가능합니다");
			}
		}
	}else if(attackMob==2&& attackMobHp>0){
		moveEntTnt(wantEntTnt[1][0], tntCoord[0].x, tntCoord[0].y, tntCoord[0].z);
		moveEntTnt(wantEntTnt[1][1], tntCoord[0].x+2*Math.cos(angle1/180*Math.PI), tntCoord[0].y+2*Math.sin(angle1/180*Math.PI), tntCoord[0].z+2*Math.cos(angle1/180*Math.PI));
		moveEntTnt(wantEntTnt[1][2], tntCoord[0].x+2*Math.cos((angle1+180)/180*Math.PI), tntCoord[0].y+2*Math.sin((angle1+180)/180*Math.PI), tntCoord[0].z-2*Math.cos((angle1+180)/180*Math.PI));
		moveEntTnt(wantEntTnt[1][3], tntCoord[0].x+2*Math.cos((angle1+90)/180*Math.PI), tntCoord[0].y+2*Math.sin((angle1+90)/180*Math.PI), tntCoord[0].z);
		moveEntTnt(wantEntTnt[1][4], tntCoord[0].x, tntCoord[0].y+2*Math.sin((angle1+270)/180*Math.PI), tntCoord[0].z +2*Math.cos((angle1+270)/180*Math.PI));
		angle1+=10;
		if(angle1>360){
			angle1-=360;
		}
		if(!(isClose2D(Player.getX(), Player.getZ(), tntCoord[0].x, tntCoord[0].z, 10))){
			tntCoord[0].x+=(Player.getX()- tntCoord[0].x)/ getDist2D(Player.getX(), Player.getZ(), tntCoord[0].x, tntCoord[0].z) *0.125;
			tntCoord[0].z+= (Player.getZ()- tntCoord[0].z)/ getDist2D(Player.getX(), Player.getZ(), tntCoord[0].x, tntCoord[0].z) *0.125;
		}
		attackTime++;
		if(attackTime%80==0){
			attackItemCheck=1;
			Level.dropItem( tntCoord[0].x, tntCoord[0].y, tntCoord[0].z, 0, 351, 0, 1);
			attackItemCheck=0;
		}
		if(attackItem==240){
			attackItem=0;
		}
		for(i=0;i<attackItem[0].length;i++){
			setVelEnt(attackItem[0][i], 0, 0, 0);
			Entity.setPosition( attackItem[0][i], Entity.getX(attackItem[0][i])+attackItemDist[i].x, Entity.getY( attackItem[0][i] )+attackItemDist[i].y, Entity.getZ(attackItem[0][i] )+attackItemDist[i].z );
			if(Level.getTile (Entity.getX(attackItem[0][i])+attackItemDist[i].x, Entity.getY( attackItem[0][i])+ attackItemDist[i].y-1, Entity.getZ(attackItem[0][i])+ attackItemDist[i].z )!==0){
				Entity.remove( attackItem[0][i] );
				Level.setTile (Entity.getX(attackItem[0][i])+attackItemDist[i].x, Entity.getY( attackItem[0][i])+ attackItemDist[i].y, Entity.getZ(attackItem[0][i])+ attackItemDist[i].z, 11, 0);
				lavaBlock.push({ x:Entity.getX(attackItem[0][i])+attackItemDist[i].x, y:Entity.getY( attackItem[0][i])+ attackItemDist[i].y, z:Entity.getZ(attackItem[0][i])+ attackItemDist[i].z });
				lavaCount.push(200);
				attackItem[0].splice(i, 1);
				attackItemDist.splice(i, 1);
				i--;
			}
		}
		for(i=0;i<pArrowAry.length;i++){
			if(isClose3D(Entity.getX (pArrowAry[i]), Entity.getY (pArrowAry[i]), Entity.getZ (pArrowAry[i]), tntCoord[0].x, tntCoord[0].y, tntCoord[0].z, 1)){
				Entity.remove(pArrowAry[i]);
				pArrowAry.splice(i,1);
				pArrowCount.splice(i,1);
				i--;
				attackMobHp--;
				if(attackMobHp>0){
					cm("공격 소환몹 HP : " +attackMobHp +"/ "+ attackMobMaxHP );
				}else{
					cm("§6<system>\n§6공격 소환몹이 잠시 무력화됩니다");
					for(i=0;i<wantEntTnt[1].length; i++){
						moveEntTnt(wantEntTnt[1][i], 128, 256, 128);
					}
				}
			}
			for(j=1;j<5;j++){
				if(isClose3D(Entity.getX (pArrowAry[i]), Entity.getY (pArrowAry[i]), Entity.getZ (pArrowAry[i]), Entity.getX (wantEntTnt[1][j]), Entity.getY (wantEntTnt[1][j]), Entity.getZ (wantEntTnt[1][j]), 1.5)){
					Entity.remove(pArrowAry[i]);
					pArrowAry.splice(i,1);
					pArrowCount.splice(i,1);
					i--;
				}
			}
		}
	}else if( attackMob==2&& attackMobHp<=0 ){
		mobTime1++;
		if(mobTime1>200){
			mobTime1=0;
			attackMobHp=attackMobMaxHP;
			attackTime=0;
			cm("§6<system>\n§6공격 소환몹이 다시 활성화됩니다");
		}
		moveEntTnt(wantEntTnt[1][0], tntCoord[0].x, tntCoord[0].y, tntCoord[0].z);
		if(!(isClose2D(Player.getX(), Player.getZ(), tntCoord[0].x, tntCoord[0].z, 10))){
			tntCoord[0].x+=(Player.getX()- tntCoord[0].x)/ getDist2D(Player.getX(), Player.getZ(), tntCoord[0].x, tntCoord[0].z) *0.125;
			tntCoord[0].z+= (Player.getZ()- tntCoord[0].z)/ getDist2D(Player.getX(), Player.getZ(), tntCoord[0].x, tntCoord[0].z) *0.125;
		}
	}
	if(recoverMob==1){
		for(i=0;i<4;i++){
			moveEntTnt(wantEntTnt[2][i], tntCoord[1].x+ 2*Math.cos((angle2+i*90)/180*Math.PI), tntCoord[1].y, tntCoord[1].z+ 2*Math.sin((angle2+i*90)/180*Math.PI));
		}
		angle2+=10;
		if(angle2%60==0){
			particleEffect( tntCoord[1].x, tntCoord[1].y, tntCoord[1].z, 35, 5 );
		}
		if(angle2>720){
			moveEntTnt(wantEntTnt[3][0], tntCoord[1].x, recoverMobY, tntCoord[1].z);
			recoverMobY+=0.2;
			if(recoverMobY>=5+ tntCoord[1].y ){
				recoverMob=2;
				tntCoord[1].y=recoverMobY;
				 moveEntTnt(wantEntTnt[2][0], 128, 256, 128);
				moveEntTnt(wantEntTnt[2][1], 128, 256, 128);
				moveEntTnt(wantEntTnt[2][2], 128, 256, 128);
				moveEntTnt(wantEntTnt[2][3], 128, 256, 128);
				Entity.setFireTicks( wantEntTnt[3][0], 5);
				bossStart();
				recoverMobHp=recoverMobMaxHP;
				cm("§6<system>\n§6회복 소환몹이 소환되었습니다\n§6소환몹은 화살로 공격 가능합니다");
			}
		}
	}else if(recoverMob==2 &&recoverMobHp>0){
		moveEntTnt(wantEntTnt[3][0], tntCoord[1].x, tntCoord[1].y, tntCoord[1].z);
		for(i=0;i<3;i++){
			moveEntTnt(wantEntTnt[3][i+1], tntCoord[1].x+2*Math.cos((angle2+120*i)/180*Math.PI), tntCoord[1].y+2*Math.sin((angle2+120*i)/180*Math.PI), tntCoord[1].z+2*Math.cos((angle2+120*i)/180*Math.PI));
			moveEntTnt(wantEntTnt[3][i+4], tntCoord[1].x+2*Math.cos((angle2+60+120*i)/180*Math.PI), tntCoord[1].y+2*Math.sin((angle2+60+120*i)/180*Math.PI), tntCoord[1].z-2*Math.cos((angle2+60+120*i)/180*Math.PI));
		}
		angle2+=10;
		if(angle2>360){
			angle2-=360;
		}
		if(!(isClose2D(px1+size1/2, pz1+size1/2, tntCoord[1].x, tntCoord[1].z, 5))){
			tntCoord[1].x+=( px1+size1/2 - tntCoord[1].x)/ getDist2D( px1+size1/2, pz1+size1/2 , tntCoord[1].x, tntCoord[1].z) *0.25;
			tntCoord[1].z+= ( pz1+size1/2 - tntCoord[1].z)/ getDist2D( px1+size1/2, pz1+size1/2 , tntCoord[1].x, tntCoord[1].z) *0.25;
		}
		if(recoverCheck==0){
			recoverTime++;
			if(recoverTime==200){
				recoverCheck=1;
				recoverTime=0;
			}
		}else if(recoverCheck==1){
			if(getDist3D( tntCoord[1].x, tntCoord[1].y, tntCoord[1].z, px1+size1/2, recoverMobY-9, pz1+size1/2 )<20){
				for(i=3;i< Math.floor(getDist3D( tntCoord[1].x, tntCoord[1].y, tntCoord[1].z, px1+size1/2, recoverMobY-9, pz1+size1/2 ));i++){
					moveEntTnt(wantEntTnt[4][i-recoverEffect], tntCoord[1].x+i*( px1+size1/2 - tntCoord[1].x )/ getDist3D( tntCoord[1].x, tntCoord[1].y, tntCoord[1].z, px1+size1/2, recoverMobY-9, pz1+size1/2 ) , tntCoord[1].y +i*( recoverMobY-9 - tntCoord[1].y )/ getDist3D( tntCoord[1].x, tntCoord[1].y, tntCoord[1].z, px1+size1/2, recoverMobY-9, pz1+size1/2 ) , tntCoord[1].z +i*( pz1+size1/2 - tntCoord[1].z )/ getDist3D( tntCoord[1].x, tntCoord[1].y, tntCoord[1].z, px1+size1/2, recoverMobY-9, pz1+size1/2 ) );
				}
				for(i= Math.floor(getDist3D( tntCoord[1].x, tntCoord[1].y, tntCoord[1].z, px1+size1/2, recoverMobY-9, pz1+size1/2 )) -recoverEffect ;i<15;i++ ){
					moveEntTnt(wantEntTnt[4][i], 128, 256, 128);
				}
			}else{
				for(i=0;i<15;i++){
					moveEntTnt(wantEntTnt[4][i], 128, 256, 128);
				}
			}
			recoverTime++;
			if(recoverTime%3==0){
				recoverEffect++;
				if(hp1<(bossMaxHP/2)){
					hp1=bossRecover(hp1, 1);
				}
			}
			if(recoverEffect==3){
				recoverEffect=0;
			}
			if(recoverTime==100){
				recoverCheck=0;
				recoverTime=0;
				recoverEffect=0;
				for(i=0;i<15;i++){
					moveEntTnt(wantEntTnt[4][i], 128, 256, 128);
				}
			}
		}
		for(i=0;i<pArrowAry.length;i++){
			if(isClose3D(Entity.getX (pArrowAry[i]), Entity.getY (pArrowAry[i]), Entity.getZ (pArrowAry[i]), tntCoord[1].x, tntCoord[1].y, tntCoord[1].z, 1.5)){
				Entity.remove(pArrowAry[i]);
				pArrowAry.splice(i,1);
				pArrowCount.splice(i,1);
				i--;
				recoverMobHp--;
				if(recoverMobHp>0){
					cm( "회복 소환몹 : "+recoverMobHp +"/ "+ recoverMobMaxHP );
				}else{
					cm("§6<system>\n§6회복 소환몹이 잠시 무력화됩니다");
					for(i=0;i<wantEntTnt[3].length; i++){
						moveEntTnt(wantEntTnt[3][i], 128, 256, 128);
					}
					for(i=0;i<15;i++){
						moveEntTnt(wantEntTnt[4][i], 128, 256, 128);
					}
				}
			}
			for(j=1;j<7;j++){
				if(isClose3D(Entity.getX (pArrowAry[i]), Entity.getY (pArrowAry[i]), Entity.getZ (pArrowAry[i]), Entity.getX (wantEntTnt[3][j]), Entity.getY (wantEntTnt[3][j]), Entity.getZ (wantEntTnt[3][j]), 1.5)){
					Entity.remove(pArrowAry[i]);
					pArrowAry.splice(i,1);
					pArrowCount.splice(i,1);
					i--;
				}
			}
		}
	}else if( recoverMob==2 &&recoverMobHp<=0 ){
		mobTime2++;
		if(mobTime2>200){
			mobTime2=0;
			recoverMobHp=recoverMobMaxHP;
			cm("§6<system>\n§6회복 소환몹이 다시 활성화됩니다");
		}
		moveEntTnt(wantEntTnt[3][0], tntCoord[1].x, tntCoord[1].y, tntCoord[1].z);
		if(!(isClose2D(px1+size1/2, pz1+size1/2, tntCoord[1].x, tntCoord[1].z, 5))){
			tntCoord[1].x+=( px1+size1/2 - tntCoord[1].x)/ getDist2D( px1+size1/2, pz1+size1/2 , tntCoord[1].x, tntCoord[1].z) *0.25;
			tntCoord[1].z+= ( pz1+size1/2 - tntCoord[1].z)/ getDist2D( px1+size1/2, pz1+size1/2 , tntCoord[1].x, tntCoord[1].z) *0.25;
		}
	}
}
//용암 관리
function lavaFunction(){
	for(i=0;i<lavaBlock.length;i++){
		lavaCount[i]--;
		if(lavaCount[i]<0){
			Level.setTile(lavaBlock[i].x, lavaBlock[i].y, lavaBlock[i].z, 11, 1);
			lavaBlock.splice(i, 1);
			lavaCount.splice(i, 1);
		}
	}
}
function fireArrowFunction(){
	for(i=0;i<bArrowSaveAry.length;i++){
		bArrowCount[i]--;
		if(bArrowCount[i]==100){
			Entity.setFireTicks (bArrowSaveAry[i], 10);
		}
		if(bArrowCount[i]<0){
			fakeExplosion(Entity.getX (bArrowSaveAry[i]), Entity.getY (bArrowSaveAry[i]), Entity.getZ (bArrowSaveAry[i]), 3, 2);
			Entity.remove( bArrowSaveAry[i] );
			bArrowSaveAry.splice(i, 1);
			bArrowCount.splice(i, 1);
			i--;
		}
	}
}
function showGUI(){
	ctx.runOnUiThread(new java.lang.Runnable({run: function(){
		try{
			var layout = new android.widget.LinearLayout( ctx );
			layout.setOrientation( 1 );
			bossNameWindow = new android.widget.PopupWindow();
			bossNameText= new android.widget.TextView(ctx);
			bossNameText.setTextSize(20);
			bossNameText.setTextColor (android.graphics.Color.RED);
			bossNameText.setText("<보스-마그마큐브>");
			layout.addView(bossNameText);
			bossNameWindow. setContentView(layout);
			bossNameWindow.setHeight ( dip2px(ctx,25) );
			bossNameWindow.setWidth( dip2px(ctx,200) );
			bossNameWindow. setBackgroundDrawable (new android.graphics.drawable. ColorDrawable(android.graphics.Color. TRANSPARENT));
			bossNameWindow.showAtLocation(ctx. getWindow().getDecorView(), android.view.Gravity.RIGHT |
android.view.Gravity.TOP, dip2px(ctx,50) , 0);
		}catch(error){
			cm("§4error!\n"+error);
		}
		try{
			hpWindow = new android.widget.PopupWindow();
			hpProgBar=new android.widget.ProgressBar(ctx, null, android.R.attr.progressBarStyleHorizontal);
			hpProgBar.setMax(bossMaxHP);
			hpProgBar.setProgress (Math.floor(hpProgBar.getMax()*hp1/bossMaxHP));
			hpWindow.setContentView(hpProgBar);
			hpWindow. setWidth( ctx.getResources().getDisplayMetrics().widthPixels-150);
			hpWindow. setHeight(dip2px(ctx,10));
			hpWindow. setBackgroundDrawable (new android.graphics.drawable. ColorDrawable(android.graphics.Color. TRANSPARENT));
			hpWindow.showAtLocation(ctx. getWindow().getDecorView(), android.view.Gravity.LEFT |
android.view.Gravity.TOP,  ctx.getResources().getDisplayMetrics().widthPixels/20 , dip2px(ctx,25) );
		}catch(error){
			 m("§4error!\n"+error);
		}
	}}));
}
function dip2px(ctx, dips){
	return Math.ceil(dips * ctx.getResources().getDisplayMetrics().density);
}