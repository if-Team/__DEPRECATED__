 //인챈트 효과 관련 변수&상수

var arrowCheck=true;
var arrowTimer=0;

var isPlayerArrow=false;
var arrowArray=new Array();
var arrowCount=new Array();
var mobArrow=new Array();
var mobArray=new Array();
var slowMobArray=new Array();
var slowMobCount=new Array();

//인챈트 관련 변수&상수

var normalEnchant={
name : ["power", "sharp", "knockBack", "upper", "critical", "induction", "rapidFire", "fire", "slow", "efficiency"],
krName : ["힘", "날카로움", "넉백", "띄우기", "치명타", "유도", "연사", "화염", "슬로우", "효율"],
use : [false, false, false, false, false, false, false, false, false, false],
level : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
maxLevel : [10, 5, 5, 5, 10, 1, 1, 10, 10, 10],
durability : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
maxDurability : [100, 100, 100, 100, 100, 100, 100, 100, 100, 1],
info : ["화살의 속도와 공격력이 증가합니다. 레벨이 높아질수록 공격력이 더 많이 증가합니다.\n최대 레벨 : 10",
"화살의 공격력이 증가하며 속도는 증가하지 않습니다. 레벨이 높아질수록 공격력이 더 많이 증가합니다.\n최대 레벨 : 5",
"화살에 맞은 적을 일정 거리 밀어냅니다. 레벨이 높아질수록 미는 힘이 증가하며 y축으로는 밀쳐내지 않습니다.\n최대 레벨 : 5",
"화살에 맞은 적을 위로 띄웁니다. 레벨이 높아질수록 띄우는 힘이 증가합니다.\n최대 레벨 : 5",
"일정 확률로 화살에 맞은 적에게 추가데미지를 줍니다. 레벨이 높아질수록 확률과 데미지량이 증가합니다.\n최대 레벨 : 10",
"화살이 날라가는 중 일정 범위 내에 있는 적에게로 방향을 바꿉니다.\n최대 레벨 : 1",
"활시위를 조금만 당겨도 최대로 당긴 속도의 화살이 발사됩니다.\n최대 레벨 : 1",
"화살에 맞은 적을 일정 시간동안 불타게 합니다. 레벨이 높아질수록 적이 불타는 시간이 증가합니다.\n최대 레벨 : 10",
"화살에 맞은 적의 이동속도를 일정 시간동안 느려지게 합니다. 레벨이 높아질수록 적이 느려지는 시간이 증가합니다.\n최대 레벨 : 10",
"일정 확률로 다른 인챈트의 내구도가 감소되지 않습니다. 이 인챈트는 내구도가 1로 고정됩니다. 레벨이 높아질수록 확률이 증가합니다.\n최대 레벨 : 10" ]
}
var arrowNumEnchant={
name : [ "doubleShot", "multiShot", "infinite"],
krName : ["더블샷", "멀티샷", "무한"],
use : [false, false, false],
level : [0, 0, 0],
maxLevel : [1, 10, 10],
durability : [0, 0, 0],
maxDurability : [100, 100, 100],
info : ["화살을 한 번 발사하면 두 개의 화살이 발사됩니다. 화살이 더 소모되지는 않습니다.\n최대 레벨 : 1",
"화살을 발사할 때마다 일정 확률로 여러개의 화살이 발사되며 동시에 플레이어는 뒤로 넉백이 됩니다. 레벨이 높아질수록 확률과 추가적으로 날라가는 화살 개수가 증가하며 넉백 거리가 소폭 감소됩니다. 화살이 더 소모되지는 않습니다.\n최대 레벨 : 10",
"화살을 발사할 때 일정 확률로 화살이 소모되지 않습니다. 레벨이 높아질수록 확률이 증가합니다.\n최대 레벨 : 10"]
}
var additionalEnchant={
name : ["teleport", "explosion", "lava", "water", "dig"],
krName : ["순간이동", "폭발", "용암", "물", "굴착"],
use : [false, false, false, false, false],
level : [0, 0, 0, 0, 0],
maxLevel : [1, 10, 3, 3, 5],
durability : [0, 0, 0, 0, 0],
maxDurability : [10, 10, 10, 10, 10],
info : ["화살이 박힌 위치로 플레이어가 순간이동합니다.\n최대 레벨 : 1",
"화살이 박힌 곳에 폭발이 일어납니다. 레벨이 높아질수록 폭발의 강도가 늘어납니다.\n최대 레벨 : 10",
"화살이 박힌 곳에 용암이 생성됩니다. 레벨이 높아질수록 용암이 설치되는 범위가 늘어납니다.\n최대 레벨 : 3",
"화살이 박힌 곳에 물이 생성됩니다. 레벨이 높아질수록 물이 설치되는 범위가 늘어납니다.\n최대 레벨 : 3",
"화살이 박힌 곳 주변의 블럭을 아이템화합니다. 돌, 흙, 자갈, 광물 원석만 아이템화 할 수 있습니다. 레벨이 높아질수록 범위가 늘어납니다.\n최대 레벨 : 5"]
}

var enchantInv=[];

//경험치 관련 변수

var enchantExp=0;

//히든업적 관련 변수

var hiddenAchv={
name : ["인챈트 수집가", "인챈트는 사치일 뿐", "이스터에그 발견!"], 
get : [false, false, false],
enchant : [true, false, false],
msg : ["보상 : <히든 인챈트-신기전>", "보상 : 20000XP", "보상 : 10000XP" ],
index : [0, -1, -1],
enchantInfo : ["한번에 화살을 9발씩 날리며 이 화살들은 기존의 화살보다 빠르게 날라갑니다.\n내구도는 따로 존재하지 않습니다.", null, null],
enchantUse : [false, false, false]
};

//난이도 관련 변수&상수

const normal=0;
const hard=10;
const hell=20;
var difficulty=normal;

//GUI관련 변수&상수

const ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
var mainBtnWindow=null;
var expWindow=null;
var expText=null;

const HOLO_DARK=2;
const HOLO_LIGHT=3;
var dialogTheme=2;

/*------------------------------------
ModPE관련 자체 함수들(기존에 존재하던 함수들)
------------------------------------*/

function newLevel(){
	normalEnchant.use= [false, false, false, false, false, false, false, false, false, false];
	normalEnchant.level= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	normalEnchant.durability= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	arrowNumEnchant.use= [false, false, false];
	arrowNumEnchant.level= [0, 0, 0];
	arrowNumEnchant.durability= [0, 0, 0];
	additionalEnchant.use= [false, false, false, false, false];
	additionalEnchant.level= [0, 0, 0, 0, 0];
	additionalEnchant.durability= [0, 0, 0, 0, 0];
	enchantInv=[];
	enchantExp=0;
	hiddenAchv.get= [false, false, false];
	Block.defineBlock( 174,"Bow Enchant Table", 
[["emerald_block", 0], ["emerald_block", 0], ["emerald_block", 0], ["emerald_block", 0], ["emerald_block", 0], ["emerald_block", 0]]);
	Block.setDestroyTime(174, 1);
	Item.addCraftRecipe(174, 1, 0, [264,  2, 0, 351, 2, 4, 266, 2, 0, 265, 2, 0]);
	mobFunction();
	makeMainBtn();
	makeExp();
	if(ModPE.readData("dialogTheme")){
		dialogTheme= parseInt(ModPE.readData("dialogTheme"));
	}
	if(ModPE.readData(""+ Level.getWorldDir()+"/"+ Level.getWorldName()+"_Normal")){
		var normalSubData;
		var normalData= ModPE.readData(""+ Level.getWorldDir()+"/"+ Level.getWorldName()+"_Normal").split("|");
		for(var i=0;i<normalData.length-1;i++){
			normalSubData=normalData[i].split("/");
			if(normalSubData[0]=="1"){
				normalEnchant.use[i]=true;
			}else if(normalSubData[0]=="0"){
				normalEnchant.use[i]=false;
			}
			normalEnchant.level[i]= parseInt(normalSubData[1]);
			normalEnchant.durability[i]= parseInt(normalSubData[2]);
		}
	}
	if(ModPE.readData(""+ Level.getWorldDir()+"/"+ Level.getWorldName()+"_ArrowNum")){
		var arrowNumSubData;
		var arrowNumData= ModPE.readData(""+ Level.getWorldDir()+"/"+ Level.getWorldName()+"_ArrowNum").split("|");
		for(var i=0;i<arrowNumData.length-1;i++){
			arrowNumSubData= arrowNumData[i].split("/");
			if(arrowNumSubData[0]=="1"){
				arrowNumEnchant.use[i]=true;
			}else if(arrowNumSubData[0]=="0"){
				arrowNumEnchant.use[i]=false;
			}
			arrowNumEnchant.level[i]= parseInt(arrowNumSubData[1]);
			arrowNumEnchant.durability[i]= parseInt(arrowNumSubData[2]);
		}
	}
	if(ModPE.readData(""+ Level.getWorldDir()+"/"+ Level.getWorldName()+"_Additional")){
		var additionalSubData;
		var additionalData= ModPE.readData(""+ Level.getWorldDir()+"/"+ Level.getWorldName()+"_Additional").split("|");
		for(var i=0;i<additionalData.length-1;i++){
			additionalSubData= additionalData[i].split("/");
			if(additionalSubData[0]=="1"){
				additionalEnchant.use[i]=true;
			}else if(additionalSubData[0]=="0"){
				additionalEnchant.use[i]=false;
			}
			additionalEnchant.level[i]= parseInt(additionalSubData[1]);
			additionalEnchant.durability[i]= parseInt(additionalSubData[2]);
		}
	}
	if( Level.getGameMode()!=1 ){
		if( ModPE.readData(""+ Level.getWorldDir()+"/"+ Level.getWorldName()+"_Inv") ){
			var invData= ModPE.readData(""+ Level.getWorldDir()+"/"+ Level.getWorldName()+"_Inv").split("|");
			for(var i=0;i<invData.length-1;i++){
				enchantInv.push(invData[i]);
			}
		}
		if( ModPE.readData(""+ Level.getWorldDir()+"/"+ Level.getWorldName()+"_HiddenAchv") ){
			var hiddenAchvData= ModPE.readData(""+ Level.getWorldDir()+"/"+ Level.getWorldName()+"_HiddenAchv").split("|");
			for(var i=0;i<hiddenAchvData.length-1 ;i++){
				if(hiddenAchvData[i]=="1"){
					hiddenAchv.get[i]=true;
				}else if( hiddenAchvData[i]=="0" ){
					hiddenAchv.get[i]=false;
				}
			}
		}
		var achvCheck=true;
		if(!(hiddenAchv.get[0])){
			for(var i in normalEnchant.level){
				if(normalEnchant.level[i]!=1){
					achvCheck=false;
				}
			}
			for(var i in arrowNumEnchant.level){
				if(arrowNumEnchant.level[i]!=1){
					achvCheck=false;
				}
			}
			for(var i in additionalEnchant.level){
				if(additionalEnchant.level[i]!=1){
					achvCheck=false;
				}
			}
			if(achvCheck){
				hiddenAchv.get[0]=true;
				toast("히든업적 획득!");
			}
		}
		achvCheck=true;
		if(!(hiddenAchv.get[1])){
			for(var i in normalEnchant.level){
				if(!(normalEnchant.level[i]== normalEnchant.maxLevel[i]&& !(normalEnchant.use[i])) ){
					achvCheck=false;
				}
			}
			for(var i in arrowNumEnchant.level){
				if( !(arrowNumEnchant.level[i]== arrowNumEnchant.maxLevel[i]&& !(arrowNumEnchant.use[i])) ){
					achvCheck=false;
				}
			}
			for(var i in additionalEnchant.level){
				if( !(additionalEnchant.level[i]== additionalEnchant.maxLevel[i]&& !(additionalEnchant.use[i])) ){
					achvCheck=false;
				}
			}
			if(achvCheck){
				hiddenAchv.get[1]=true;
				toast("히든업적 획득!");
				changeExp(20000);
			}
		}
		if( ModPE.readData(""+ Level.getWorldDir()+"/"+ Level.getWorldName()+"_Exp") ){
			enchantExp=parseInt( ModPE.readData(""+ Level.getWorldDir()+"/"+ Level.getWorldName()+"_Exp") );
		}
	}
}
function leaveGame(){
	closeWindow(mainBtnWindow);
	closeWindow(expWindow);
	ModPE.saveData("dialogTheme", ""+dialogTheme);
	var normalData="";
	for(var i in normalEnchant.name){
		if(normalEnchant.use[i]){
			normalData+="1/";
		}else{
			normalData+="0/";
		}
		normalData+=normalEnchant.level[i]+"/";
		normalData+= normalEnchant.durability[i];
		normalData+="|";
	}
	ModPE.saveData( Level.getWorldDir()+"/"+ Level.getWorldName()+"_Normal", normalData);
	var arrowNumData="";
	for(var i in arrowNumEnchant.name){
		if(arrowNumEnchant.use[i]){
			arrowNumData+="1/";
		}else{
			arrowNumData+="0/";
		}
		arrowNumData+= arrowNumEnchant.level[i]+"/";
		arrowNumData+= arrowNumEnchant.durability[i];
		arrowNumData+="|";
	}
	ModPE.saveData( Level.getWorldDir()+"/"+ Level.getWorldName()+"_ArrowNum", arrowNumData);
	var additionalData="";
	for(var i in additionalEnchant.name){
		if(additionalEnchant.use[i]){
			additionalData+="1/";
		}else{
			additionalData+="0/";
		}
		additionalData+= additionalEnchant.level[i]+"/";
		additionalData+= normalEnchant.durability[i];
		additionalData+="|";
	}
	ModPE.saveData( Level.getWorldDir()+"/"+ Level.getWorldName()+"_Additional", additionalData);
	if( Level.getGameMode()!=1 ){
		var invData="";
		for(var i in enchantInv){
			invData+=enchantInv[i]+"|";
		}
		ModPE.saveData( Level.getWorldDir()+"/"+ Level.getWorldName()+"_Inv", invData);
		var hiddenAchvData="";
		for(var i in hiddenAchv.get){
			if(hiddenAchv.get[i]){
				hiddenAchvData+="1";
			}else{
				hiddenAchvData+="0";
			}
			hiddenAchvData+="|";
		}
		ModPE.saveData( Level.getWorldDir()+"/"+ Level.getWorldName()+"_HiddenAchv", hiddenAchvData);
		ModPE.saveData( Level.getWorldDir()+"/"+ Level.getWorldName()+"_Exp", ""+enchantExp);
	}
}
function useItem(x, y, z, itemId, blockId, side, itemDamage, blockDamage){
	if(blockId==174&& Player.getCarriedItem()==261&& Level.getGameMode()!=1 ){//서바이벌에서 활로 인챈트 테이블을 터치
		makeEnchantPickMenu();
	}
}
function destroyBlock(x, y, z, side){
	if(Level.getTile(x, y, z)==174){
		preventDefault();
		Level.destroyBlock(x, y, z, true);
	}
}
function entityAddedHook(entity){
	switch(Entity.getEntityTypeId(entity)){
		case 32://좀비
			Entity.setHealth(entity, Entity.getHealth(entity)*(1+3*difficulty/10));
			break;
		case 33://크리퍼
			Entity.setHealth(entity, Entity.getHealth(entity)*(1+3*difficulty/10));
			break;
		case 34://스켈레톤
			Entity.setHealth(entity, Entity.getHealth(entity)*(1+3*difficulty/10));
			break;
		case 35://거미
			Entity.setHealth(entity, Entity.getHealth(entity)*(1+3*difficulty/10));
			break;
		case 36://좀비피그맨
			Entity.setHealth(entity, Entity.getHealth(entity)*(1+3*difficulty/10));
			break;
	}
	if( Math.floor(Entity.getEntityTypeId (entity)/10)==3 ){
		mobArray.push(entity)
	}
	if(arrowCheck){
		return;
	}
	if(Entity.getEntityTypeId(entity)==80&& getDist3D(Player.getX(), Player.getY(), Player.getZ(), Entity.getX(entity), Entity.getY(entity), Entity.getZ(entity))<0.162 ){
		arrowArray.push(entity);
		mainArrow(entity);
		subArrow(entity);
		if(isActive("infinite")){
			var pos=Math.random()*100;
			if(pos<4*getLevel("infinite")){
				Player.addItemInventory(262, 1, 0);
			}
			decDurability("infinite");
		}
		var yaw=Entity.getYaw(Player.getEntity());
		var pitch=Entity.getPitch (Player.getEntity());
		var sin, cos, tan, pcos;
		sin=-Math.sin(yaw/180*Math.PI);
		cos=Math.cos(yaw/180*Math.PI);
		tan=-Math.sin(pitch/180*Math.PI);
		pcos=Math.cos(pitch/180*Math.PI);
		var arrowVel=getVel(entity);
		var arrowVelInc=1;
		if( isActive("rapidFire") ){
			arrowVelInc=3;
			decDurability("rapidFire");
		}
		if( isActive("power") ){
			arrowVelInc*=(1+ 0.1*getLevel("power"));
			decDurability("power");
		}
		if(arrowVelInc!=1){
			Entity.setVelX(entity, Entity.getVelX(entity)/arrowVel*arrowVelInc);
			Entity.setVelY(entity, Entity.getVelY(entity)/arrowVel* arrowVelInc );
			Entity.setVelZ(entity, Entity.getVelZ(entity)/arrowVel* arrowVelInc );
		}
		var newYaw, newPitch, arrow;
		if( isActive("doubleShot") ){
			arrow=spawnArrow (Player.getX()+sin*pcos*2, Player.getY()+tan*2, Player.getZ()+cos*pcos*2);
			Entity.setVelX(arrow, Entity.getVelX(entity));
			Entity.setVelY(arrow, Entity.getVelY(entity));
			Entity.setVelZ(arrow, Entity.getVelZ(entity));
			decDurability("doubleShot");
		}else if( isActive("multiShot") ){
			var pos=Math.random()*100;
			if(pos<10+200*getLevel("multiShot")){
				newPitch, newYaw;
				arrow;
				var arrowPos;
				if(getLevel("multiShot")<=3){
					arrowPos=[[-1, 0]];
				}else if( getLevel("multiShot")<=6 ){
					arrowPos=[[-1, 0], [1, 0] ];
				}else if( getLevel("multiShot")<=9 ){
					arrowPos=[[-1, 0], [1, 0], [0, -1] ];
				}else if( getLevel("multiShot")==10 ){
					arrowPos=[[-1, 0], [1, 0], [0, -1], [0, 1]];
				}
				for(var i=0;i<arrowPos.length;i++){
					newYaw=yaw+arrowPos[i][0]*5;
					newPitch=pitch+ arrowPos[i][1] *5;
					if(newPitch>90){
						newPitch=180-newPitch;
					}else if(newPitch<-1*90){
						newPitch=-180-newPitch;
					}
					sin=-Math.sin(newYaw/180*Math.PI);
					cos=Math.cos(newYaw/180*Math.PI);
					tan=-Math.sin(newPitch/180*Math.PI);
					pcos=Math.cos(newPitch/180*Math.PI);
					arrow=spawnArrow( Player.getX()+sin*pcos*2, Player.getY()+tan*2, Player.getZ()+cos*pcos*2 );
					Entity.setVelX(arrow, sin*pcos*arrowVel);
					Entity.setVelY(arrow, tan*arrowVel);
					Entity.setVelZ(arrow, cos*pcos*arrowVel);
				}
				sin=-Math.sin(yaw/180*Math.PI);
				cos=Math.cos(yaw/180*Math.PI);
				pcos=Math.cos(pitch/180*Math.PI);
				Entity.setVelX(Player.getEntity(), -1*sin*pcos*(2.5-0.2*getLevel("multiShot")));
				Entity.setVelX(Player.getEntity(), -1*sin*pcos				*(2.5-0.2*getLevel("multiShot")));
				Entity.setVelZ(Player.getEntity(), -1*cos*pcos*(2.5-0.2*getLevel("multiShot")));
			}
			decDurability("multiShot");
		}
		if(hiddenAchv.enchantUse[0]){
			for(var i=-1;i<=1;i++){
				for(var j=-1;j<=1;j++){
					newYaw=yaw+i*5;
					newPitch=pitch+j*5;
					if(newPitch>90){
						newPitch=180-newPitch;
					}else if(newPitch<-1*90){
						newPitch=-180-newPitch;
					}
					sin=-Math.sin(newYaw/180*Math.PI);
					cos=Math.cos(newYaw/180*Math.PI);
					tan=-Math.sin(newPitch/180*Math.PI);
					pcos=Math.cos (newPitch/180*Math.PI);
					arrow=spawnArrow( Player.getX()+sin*pcos*2, Player.getY()+tan*2, Player.getZ()+cos*pcos*2 );
				Entity.setVelX(arrow, sin*pcos*arrowVel*2);
				Entity.setVelY(arrow, tan*arrowVel*2);
				Entity.setVelZ(arrow, cos*pcos*arrowVel*2);
				}
			}
		}
	}else if( Entity.getEntityTypeId(entity)==80&& isPlayerArrow ){
		arrowArray.push(entity);
		subArrow(entity);
	}else{
		mobArrow.push(entity);
	}
}
function entityRemovedHook(entity){
	if( Math.floor(Entity.getEntityTypeId (entity)/10)==3 ){
		mobArray.splice(mobArray.indexOf(entity), 1);
	}
	if( Entity.getEntityTypeId (entity)==80&& arrowArray.indexOf(entity)!=-1 ){
		var closeMobDist=2;
		var closeMob=-1;
		var yDist=0;
		for(var i=0;i<mobArray.length;i++){
			if(closeMobDist>getDist2D (Entity.getX(entity), Entity.getZ(entity), Entity.getX(mobArray[i]), Entity.getZ(mobArray[i])) &&Entity.getY(entity)> Entity.getY(mobArray[i])-1 &&Entity.getY(entity)< Entity.getY(mobArray[i])+2 ){
				closeMobDist= getDist2D (Entity.getX(entity), Entity.getZ(entity), Entity.getX(mobArray[i]), Entity.getZ(mobArray[i]) );
				closeMob=i;
				yDist= Entity.getY(entity)- Entity.getY(mobArray[i]);
			}
		}
		if(closeMob!=-1&&closeMobDist<2){
			var hp;
			if( isActive("sharp") ){
				hp=Entity.getHealth ( mobArray[closeMob] );
				if(hp!=0){
					hp-=getLevel("sharp");
					if(hp<=0){
						hp=0;
						deathHook(Player.getEntity(), mobArray[closeMob] );
					}
					Entity.setHealth (mobArray[closeMob], hp);
					decDurability("sharp");
				}
			}
			if( isActive("knockBack") ){
				var yaw=-1*Entity.getYaw(entity);
				var pitch=-1*Entity.getPitch(entity);
				var sin, cos, pcos;
				sin=-Math.sin(yaw/180*Math.PI);
				cos=Math.cos(yaw/180*Math.PI);
				pcos=Math.cos(pitch/180*Math.PI);
				Entity.setVelX( mobArray[closeMob], sin*pcos*(0.7+getLevel("knockBack")*0.3));
				Entity.setVelZ( mobArray[closeMob], cos*pcos*(0.7+getLevel("knockBack")*0.3));
				decDurability("knockBack");
			}
			if(isActive("upper")){
				Entity.setVelY( mobArray[closeMob], 1+getLevel("upper")*0.3 );
				decDurability("upper");
			}
			if( isActive("critical") ){
				var pos=Math.random()*100;
				hp=Entity.getHealth ( mobArray[closeMob] );
				if(hp!=0&&pos<10+getLevel("critical")){
					hp-=Math.floor (getLevel("critical")*1.6);
					if(hp<=0){
						hp=0;
						deathHook(Player.getEntity(), mobArray[closeMob] );
					}
					Entity.setHealth (mobArray[closeMob], hp);
				}
			decDurability("critical");
			}
			if(isActive("fire")){
				Entity.setFireTicks(mobArray[closeMob], 1+getLevel("fire")*0.4);
				decDurability("fire");
			}
			if( isActive("slow") ){
				slowMobArray.push(mobArray[closeMob]);
				slowMobCount.push (getLevel("slow")*10);
				decDurability("slow");
			}
		}
		arrowArray.splice (arrowArray.indexOf(entity), 1);
	}else if( Entity.getEntityTypeId (entity)==80&& mobArrow.indexOf(entity)!=-1 ){
		if( getDist2D (Entity.getX(entity), Entity.getZ(entity), Player.getX(), Player.getZ())<3 ){
		}
		mobArrow.splice (mobArrow.indexOf(entity), 1);
	}
}
function attackHook(attacker, victim){
	
}
function deathHook(attacker, victim){
	if(attacker==Player.getEntity()|| Entity.getEntityTypeId (attacker)==80 ){
		switch(Entity.getEntityTypeId(victim)){
			case 32://좀비
				changeExp (80 *(1+1*difficulty/10) );
				break;
			case 33://크리퍼
				changeExp(150 *(1+1*difficulty/10) );
				break;
			case 34://스켈레톤
				changeExp(120 *(1+1*difficulty/10) );
				break;
			case 35://거미
				changeExp(100 *(1+1*difficulty/10) );
				break;
			case 36://좀비피그맨
				changeExp(1000*(1+1*difficulty/10));
				break;
		}
	}
}
function modTick(){
	if(arrowCheck){
		arrowTimer++;
		if(arrowTimer>20){
			arrowCheck=false;
		}
	}
}

/*------------------------------------
ModPE관련 사용자 지정 함수들
------------------------------------*/

//clientMessage 축약
function cm(message){
	clientMessage(message.toString());
}
//try문에서의 에러 표시
function cme(error){
	clientMessage(ChatColor.RED + error.name + ' (' + error.lineNumber + ') - ' + error.message + '\n' + error.stack);
}
//거리 구하기 함수
function getDist2D( x1, z1, x2, z2 ){
	return Math.sqrt((x1-x2)* (x1-x2)+ (z1-z2)* (z1-z2));
}
function getDist3D( x1, y1, z1, x2, y2, z2 ){
	return Math.sqrt((x1-x2)* (x1-x2)+ (y1-y2)* (y1-y2) + (z1-z2)* (z1-z2));
}
//엔티티의 속도 구하는 함수
function getVel(entity){
	return Math.sqrt(Entity.getVelX(entity)* Entity.getVelX(entity)+ Entity.getVelY(entity)* Entity.getVelY(entity) + Entity.getVelZ(entity)* Entity.getVelZ(entity) );
}
function get2DVel(entity){
	return Math.sqrt(Entity.getVelX(entity)* Entity.getVelX(entity)+ Entity.getVelZ(entity)* Entity.getVelZ(entity));
}
//특정 아이템 소지갯수 구하는 함수
function getInvSlotItem(itemId, itemDamage){
	var count=0;
	for(var i=9;i<45;i++){
		if(Player.getInventorySlot(i) == itemId&& Player.getInventorySlotData(i) == itemDamage ){
			count+= Player.getInventorySlotCount(i);
		}
	}
	return count;
}
//화살 스폰 함수
function spawnArrow(x, y, z){
	isPlayerArrow=true;
	var arrow= Level.spawnMob(x, y, z, 80);
	isPlayerArrow=false;
	return arrow;
}
//몹전체 없애기
function clearMob(){
	for(var i=0;i<mobArray.length;i++){
		Entity.remove(mobArray[i]);
		mobArray.splice(i, 1);
		i--;
	}		
}
//메인화살 함수(직접 발사한 화살에 적용)
function mainArrow(arrow){
	new java.lang.Thread(new java.lang.Runnable({run: function(){
		while( !(Entity.getVelX(arrow)==0&& Entity.getVelY(arrow)==0&& Entity.getVelZ(arrow)==0) ){
			java.lang.Thread.sleep(50);
		}
		if( !(Entity.getX(arrow)==0&& Entity.getY(arrow)==0&& Entity.getZ(arrow)==0) ){
			if(isActive("teleport")){
				var yaw=-1*Entity.getYaw(arrow);
				var pitch=-1*Entity.getPitch(arrow);
				var sin, cos, tan, pcos;
				sin=-Math.sin(yaw/180*Math.PI);
				cos=Math.cos(yaw/180*Math.PI);
				tan=-Math.sin(pitch/180*Math.PI);
				pcos=Math.cos(pitch/180*Math.PI);
				Entity.setPosition(Player.getEntity(), Entity.getX(arrow)-sin*pcos*2, Entity.getY(arrow)-tan*2+1.62, Entity.getZ(arrow)-cos*pcos*2);
				decDurability("teleport");
			}else if(isActive("explosion")){
				Level.explode(Entity.getX(arrow), Entity.getY(arrow), Entity.getZ(arrow), 2+0.3*getLevel("explosion"));
				decDurability("explosion");
			}else if(isActive("lava")){
				var start=0;
				var end=0;
				if(getLevel("lava")==1){
					start=0;
					end=0;
				}else if(getLevel("lava")==2){
					start=0;
					end=1;
				}else if(getLevel("lava")==3){
					start=-1;
					end=1;
				}
				for(var i=start ;i<=end;i++){
					for( var j=start ;j<=end;j++ ){
						for( var k=start ;k<=end;k++ ){
							Level.setTile( Entity.getX(arrow)+i, Entity.getY(arrow)+j, Entity.getZ(arrow)+k, 11);
						}
					}
				}
				decDurability("lava");
			}else if(isActive("water")){
				var start=0;
				var end=0;
				if(getLevel("water")==1){
					start=0;
					end=0;
				}else if(getLevel("water")==2){
					start=0;
					end=1;
				}else if(getLevel("water")==3){
					start=-1;
					end=1;
				}
				for(var i=start ;i<=end;i++){
					for( var j=start ;j<=end;j++ ){
						for( var k=start ;k<=end;k++ ){
							Level.setTile( Entity.getX(arrow)+i, Entity.getY(arrow)+j, Entity.getZ(arrow)+k, 9);
						}
					}
				}
				decDurability("water");
			}else if(isActive("dig")){
				var start=0;
				var end=0;
				if(getLevel("dig")==1){
					start=0;
					end=0;
				}else if(getLevel("dig")==2){
					start=0;
					end=1;
				}else if(getLevel("dig")==3){
					start=-1;
					end=1;
				}else if(getLevel("dig")==4){
					start=-1;
					end=2;
				}else if(getLevel("dig")==5){
					start=-2;
					end=2;
				}
				var getTile;
				for(var i=start ;i<=end;i++){
					for( var j=start ;j<=end;j++ ){
						for( var k=start ;k<=end;k++ ){
							getTile=Level.getTile( Entity.getX(arrow)+i, Entity.getY(arrow)+j-1, Entity.getZ(arrow)+k)
							if( getTile==1|| getTile==2|| getTile==3|| getTile==4|| getTile==13|| getTile==14|| getTile==15|| getTile==16|| getTile==21|| getTile==56|| getTile==73|| getTile==74 ){
								Level.destroyBlock( Entity.getX(arrow)+i, Entity.getY(arrow)+j-1, Entity.getZ(arrow)+k, true );
							}
						}
					}
				}
				decDurability("dig");
			}
			arrowArray.splice (arrowArray.indexOf(arrow), 1);
		}
	}})).start();
}
//보조화살 함수(모든 화살에 적용)
function subArrow(arrow){
	new java.lang.Thread(new java.lang.Runnable({run: function(){
		var closeMobDist, closeMob;
		java.lang.Thread.sleep(100);
		while( !(Entity.getVelX(arrow)==0&& Entity.getVelY(arrow)==0&& Entity.getVelZ(arrow)==0) ){
			closeMob=-1;
			closeMobDist=10;
			for(var i=0;i<mobArray.length;i++){
				if(closeMobDist>getDist3D (Entity.getX(arrow), Entity.getY(arrow), Entity.getZ(arrow), Entity.getX(mobArray[i]), Entity.getY(mobArray[i])+1, Entity.getZ(mobArray[i]) )){
					closeMobDist= getDist3D (Entity.getX(arrow), Entity.getY(arrow), Entity.getZ(arrow), Entity.getX(mobArray[i]), Entity.getY(mobArray[i])+1, Entity.getZ(mobArray[i]) );
					closeMob=i;
				}
			}
			if(closeMob!=-1){
				var newDist=getDist3D (Entity.getX(arrow), Entity.getY(arrow), Entity.getZ(arrow), Entity.getX(mobArray[closeMob]), Entity.getY(mobArray[closeMob])+1, Entity.getZ(mobArray[closeMob]) );
				var arrowVel=getVel(arrow);
				if(isActive("induction")){
					Entity.setVelX(arrow, (Entity.getX(mobArray[closeMob]) -Entity.getX(arrow) )/newDist*arrowVel);
					Entity.setVelY(arrow, (Entity.getY(mobArray[closeMob])+1 -Entity.getY(arrow) )/newDist*arrowVel);
					Entity.setVelZ(arrow, (Entity.getZ(mobArray[closeMob]) -Entity.getZ(arrow) )/newDist*arrowVel);
					decDurability("induction");
				}
				break;
			}
			java.lang.Thread.sleep(50);
		}
	}})).start();
}
//몹 관련 쓰레드
function mobFunction(){
	new java.lang.Thread(new java.lang.Runnable({run: function(){
		while(true){
			for(var i=0;i<slowMobArray.length;i++){
				if( slowMobCount[i]%5==0 ){
					Entity.setVelX(slowMobArray[i], 0);
					Entity.setVelZ(slowMobArray[i], 0);
				}
				slowMobCount[i]--;
				if( slowMobCount[i]==0 ){
					slowMobArray.splice(i, 1);
					slowMobCount.splice(i, 1);
					i--;
				}
			}
			java.lang.Thread.sleep(50);
		}
	}})).start();
}
//인챈트 사용 여부 반환 함수
function isActive(name){
	var index;
	if(normalEnchant.name.indexOf(name)!=-1){
		index= normalEnchant.name.indexOf(name);
		if( normalEnchant.durability [index] >0&& normalEnchant.use [index] ){
		return true;
		}
	}else if(arrowNumEnchant.name .indexOf(name)!=-1){
		index= arrowNumEnchant.name .indexOf(name);
		if( arrowNumEnchant.durability [index] >0&& arrowNumEnchant.use [index] ){
		return true;
		}
	}else if(additionalEnchant.name .indexOf(name)!=-1){
		index= additionalEnchant.name .indexOf(name);
		if( additionalEnchant.durability [index] >0&& additionalEnchant.use [index] ){
		return true;
		}
	}
	return false;
}
//인챈트 레벨 반환 함수
function getLevel(name){
	var index;
	var level;
	if(normalEnchant.name.indexOf(name)!=-1){
		index= normalEnchant.name.indexOf(name);
		level=normalEnchant.level[index];
	}else if(arrowNumEnchant.name .indexOf(name)!=-1){
		index= arrowNumEnchant.name .indexOf(name);
		level=arrowNumEnchant.level[index];
	}else if(additionalEnchant.name .indexOf(name)!=-1){
		index= additionalEnchant.name .indexOf(name);
		level=additionalEnchant.level[index];
	}
	return level;
}
//인챈트 내구도 감소 함수
function decDurability(name){
	var index;
	if(normalEnchant.use[ normalEnchant.name.indexOf("efficiency") ]){
		var pos=Math.random()*100;
		if(pos< normalEnchant.level[ normalEnchant.name.indexOf("efficiency") ]*3 ){
			return;
		}
	}
	if(normalEnchant.name.indexOf(name)!=-1){
		index= normalEnchant.name.indexOf(name);
		normalEnchant.durability[index]--;
		if( normalEnchant.durability[index]==0 ){
			normalEnchant.use[index]=false;
			toast("내구도가 0인 인챈트가 있습니다.");
		}
	}else if(arrowNumEnchant.name .indexOf(name)!=-1){
		index= arrowNumEnchant.name .indexOf(name);
		arrowNumEnchant.durability[index]--;
		if( arrowNumEnchant.durability[index]==0){
			arrowNumEnchant.use[index]=false;
			toast("내구도가 0인 인챈트가 있습니다.");
		}
	}else if(additionalEnchant.name .indexOf(name)!=-1){
		index= additionalEnchant.name .indexOf(name);
		additionalEnchant.durability[index]--;
		if( additionalEnchant.durability[index]==0 ){
			additionalEnchant.use[index]=false;
			toast("내구도가 0인 인챈트가 있습니다.");
		}
	}
}

/*------------------------------------
GUI관련 사용자 지정 함수들
------------------------------------*/

//기본적인 지정 함수들
function dip2px(dips){
	return Math.ceil(dips * ctx.getResources().getDisplayMetrics().density);
}
function toast(message) {
	ctx.runOnUiThread(new java.lang.Runnable({run: function() {
		try {
			android.widget.Toast.makeText(ctx, message.toString(), android.widget.Toast.LENGTH_LONG).show();
		} catch(error) { 
			cme(error);
		} 
	}}));
}

function newButton(text, width, height, textSize, textColor, bgColor, listener) {
	var btn = new android.widget.Button(ctx);
	btn.setText(text.toString());
	if(width != null && height != null){
		btn.setLayoutParams(new android.widget.LinearLayout.LayoutParams(width, height));
	}
	if(textColor != null){
		btn.setTextColor(textColor);
	}
	if(textSize != null){
		btn.setTextSize(android.util.TypedValue .COMPLEX_UNIT_PX, dip2px(textSize));
	}
	if(bgColor != null){
		btn.setBackgroundColor(bgColor);
	}
	if(listener != null){
		btn.setOnClickListener(listener);
	}
	btn.setGravity( android.view. Gravity.CENTER );
	return btn;
}

function updateButton(btn, content) {
	ctx.runOnUiThread(new java.lang.Runnable({ run: function() {
		try {
			btn.setText(content.toString());
		}catch(error){
			cme(error);
		}
	}}));
}

function newText(content, textSize, color, margins, padding) {
	var tv = new android.widget.TextView(ctx);
	var params = new android.widget.LinearLayout.LayoutParams(-2, -2);
	tv.setText(content.toString());
	tv.setTextSize(android.util.TypedValue. COMPLEX_UNIT_PX, dip2px(textSize));
	if(color != null){
		tv.setTextColor(color);
	}
	if(margins != null){
		params.setMargins(margins[0], margins[1], margins[2], margins[3]);
	}
	if(padding != null){
		tv.setPadding(padding[0], padding[1], padding[2], padding[3]);
	}
	tv.setLayoutParams(params);
	return tv;
}

function updateText(tv, content) {
	ctx.runOnUiThread(new java.lang.Runnable({ run: function() {
		try {
			tv.setText(content.toString());
		}catch(error){
			cme(error);
		}
	}}));
}

function newEditText(text, textSize, hint, type, color, hintColor, width, height, margins, padding) {
	var editText = new android.widget.EditText(ctx);
	var params = new android.widget.LinearLayout.LayoutParams(-2, -2);
	editText.setText(text.toString());
	editText.setTextSize (android.util.TypedValue. COMPLEX_UNIT_PX, dip2px(textSize));
	if(type != null){
		editText.setInputType(type);
	}
	if(hint != null){
		editText.setHint(hint.toString());
	}
	if(color != null){
		editText.setTextColor(color);
	}
	if(hintColor != null){
		editText.setHintTextColor(hintColor);
	}
	if(width != null && height != null){
		editText.setWidth(width);
		editText.setHeight(height);
	}
	if(margins != null){
		params.setMargins(margins[0], margins[1], margins[2], margins[3]);
	}
	if(padding != null){
		editText.setPadding(padding[0], padding[1], padding[2], padding[3]);
	}
	editText.setLayoutParams(params);
	editText.setGravity( android.view. Gravity.CENTER );
	return editText;
}

function newToggle(textOn, textOff, textSize, width, height, check) {
	var tgl = new android.widget.ToggleButton(ctx);
	tgl.setTextOn(textOn.toString());
	tgl.setTextOff(textOff.toString());
	if(textSize != null){
		tgl.setTextSize(textSize);
	}
	if(width != null && height != null){
		tgl.setLayoutParams(new android.widget.LinearLayout.LayoutParams(width, height));
	}
	if(check != null){
		tgl.setChecked(check);
	}
	/*tgl.setOnCheckedChangeListener(new android.widget.CompoundButton.OnCheckedChangeListener({ onCheckedChanged: function(toggle, isChecked){

	}}));*/
	
	return tgl;
}

function newSpace(width, height) {
	var space = new android.widget.Space(ctx);
	if(width != null && height != null){
		space.setLayoutParams(new android.widget.LinearLayout.LayoutParams(width, height));
	}
	return space;
}

function newProgBar(width, height, progMax, firstValue, secondValue){
	var progBar=new android.widget.ProgressBar(ctx, null, android.R.attr.progressBarStyleHorizontal);
	var params = new android.widget.LinearLayout.LayoutParams(-2, -2);
	if( width != null && height != null ){
		progBar.setLayoutParams(new android.widget.LinearLayout.LayoutParams(width, height));
	}
	progBar.setMax(progMax);
	if(firstValue!=null){
		progBar.setProgress(firstValue);
	}
	if(secondValue!=null){
		progBar.setSecondaryProgress (secondValue);
	}
	
	return progBar;
}

function updateProgBar(progBar, firstValue, secondValue){
	ctx.runOnUiThread(new java.lang.Runnable({ run: function() {
		try {
			if(firstValue!=null){
				progBar.setProgress(firstValue);
			}
			if(secondValue!=null){
				progBar.setSecondaryProgress (secondValue);
			}
		}catch(error){
			cme(error);
		}
	}}));
}

function alertDialog(title, content) {
	var dialog = new android.app.AlertDialog.Builder(ctx, dialogTheme);
	dialog.setTitle(title.toString());
	dialog.setMessage(content.toString());
	dialog.setPositiveButton("확인", new android.content.DialogInterface.OnClickListener({ onClick: function() {
		null;
	}}));
	dialog.show();
	return dialog;
}

function closeWindow(window) {
	ctx.runOnUiThread(new java.lang.Runnable({ run: function() {
		if(window != null) {
			window.dismiss();
			return null;
		}else{
			return window;
		}
	}}));
}
//경험치 표시 함수
function makeExp(){
	if( Level.getGameMode()==1 ){
		return;
	}
	ctx.runOnUiThread(new java.lang.Runnable({ run: function() {
	try{
		var layout = new android.widget.LinearLayout( ctx );
		layout.setOrientation( 1 );
		expText=newButton(""+enchantExp, -2, -2, 20, android.graphics.Color.WHITE,  android.graphics.Color.BLACK, 
		new android.view.View.OnClickListener( { onClick: function( view ) { 
			null;
		}}));
		expText.setAlpha(0.4);
		layout.addView(expText);
		expWindow = new android.widget.PopupWindow();
		expWindow.setContentView(layout);
		expWindow.setHeight (android.widget.LinearLayout.LayoutParams.WRAP_CONTENT);
		expWindow.setWidth (android.widget.LinearLayout.LayoutParams.WRAP_CONTENT);
		expWindow.setBackgroundDrawable (new android.graphics.drawable. ColorDrawable(android.graphics.Color. TRANSPARENT));
		expWindow.showAtLocation(ctx. getWindow().getDecorView(), android.view.Gravity.CENTER |
android.view.Gravity.BOTTOM, 0 , ctx. getWindowManager().getDefaultDisplay(). getHeight()*1/8 );
		}catch(error){
			cme(error);
		}
	}}));
}
//경험치 수 변경
function changeExp(amount){
	if( Level.getGameMode()==1 ){
		return;
	}
	ctx.runOnUiThread(new java.lang.Runnable({ run: function() {
		try{
			expText.setText ((enchantExp+amount)+"");
			enchantExp+=amount;
		}catch(error){
			cme(error);
		}
	}}));
}
//메인버튼 함수
function makeMainBtn(){
	ctx.runOnUiThread(new java.lang.Runnable({ run: function() {
	try{
		var layout = new android.widget.LinearLayout( ctx );
		layout.setOrientation( 1 );
		var mainBtn=newButton("<", dip2px(30), dip2px(30), 20, android.graphics.Color.GRAY,  android.graphics.Color.BLUE, 
		new android.view.View.OnClickListener( { onClick: function( view ) { 
			makeMainMenu();
		}}));
		layout.addView(mainBtn);
		mainBtnWindow = new android.widget.PopupWindow();
		mainBtnWindow.setContentView(layout);
		mainBtnWindow.setHeight (android.widget.LinearLayout.LayoutParams.WRAP_CONTENT);
		mainBtnWindow.setWidth (android.widget.LinearLayout.LayoutParams.WRAP_CONTENT);
		mainBtnWindow.setBackgroundDrawable (new android.graphics.drawable. ColorDrawable(android.graphics.Color. TRANSPARENT));
		mainBtnWindow.showAtLocation(ctx. getWindow().getDecorView(), android.view.Gravity.RIGHT |
android.view.Gravity.TOP, 0, dip2px(50));
		}catch(error){
			cme(error);
		}
	}}));
}
//메인메뉴 만들기
function makeMainMenu(){
	ctx.runOnUiThread(new java.lang.Runnable({ run: function() {
		try {
			var layout= new android.widget.LinearLayout( ctx );
			layout.setOrientation( 1 );
			layout.setPadding(dip2px(20), dip2px(20), dip2px(20), dip2px(20));
			layout.setGravity (android.view.Gravity.CENTER );
			var enchBtn=newButton("인챈트 설정", -1 , -2, 20, android.graphics.Color.WHITE,  android.graphics.Color.GRAY, 
			new android.view.View.OnClickListener( { onClick: function( view ) {
				dialog.dismiss();
				makeEnchantMenu();
			}}));
			layout.addView(enchBtn);
			layout.addView(newSpace( -1, dip2px(10)));
			if( Level.getGameMode()!=1 ){
				var invBtn=newButton("인챈트 보관함", -1 , -2, 20, android.graphics.Color.WHITE,  android.graphics.Color.GRAY, 
				new android.view.View.OnClickListener( { onClick: function( view ) {
					dialog.dismiss();
					makeEnchantInv();
				}}));
				layout.addView(invBtn);
				layout.addView(newSpace( -1, dip2px(10)));
				var achvBtn=newButton("히든 도전과제", -1 , -2, 20, android.graphics.Color.WHITE,  android.graphics.Color.GRAY, 
				new android.view.View.OnClickListener( { onClick: function( view ) {
					dialog.dismiss();
					makeAchvMenu();
				}}));
				layout.addView(achvBtn);
				layout.addView(newSpace( -1, dip2px(10)));
				var diffBtn=newButton("난이도 설정", -1 , -2, 20, android.graphics.Color.WHITE,  android.graphics.Color.GRAY, 
				new android.view.View.OnClickListener( { onClick: function( view ) {
					dialog.dismiss();
					makeDiffMenu();
				}}));
				layout.addView(diffBtn);
				layout.addView(newSpace( -1, dip2px(10)));
			}
			var infoBtn=newButton("스크립트 설명&제작자", -1 , -2, 20, android.graphics.Color.WHITE,  android.graphics.Color.GRAY, 
			new android.view.View.OnClickListener( { onClick: function( view ) {
				dialog.dismiss();
				var explainDialog= new android.app.AlertDialog.Builder(ctx, dialogTheme) .setTitle("<스크립트 설명&제작자>") /*.setMessage( "▶스크립트 설명\n이 스크립트는 플레이어의 활에 인챈트 효과를 부여해줍니다. 인챈트를 부여하기 위해서는 인챈트 테이블과 경험치가 필요합니다. 인챈트 테이블(Bow Enchant Table)은 스톤커터에서 조합할 수 있고 경험치는 적대적 몹을 잡으면 올라가며 아래쪽에 그 수치가 표기됩니다(경험치의 단위는 XP입니다).\n인챈트 테이블을 활로 터치하면 인챈트 뽑기가 가능하며 하급, 중급, 상급으로 나뉘어져 있습니다. 각 등급마다 인챈트가 나오는 레벨과 종류의 범위가 다르며 높은 등급일수록 좋은 인챈트가 나올 확률이 높고 경험치 소모량이 많습니다.\n오른쪽 위에 표시되는 파란색 바탕의 버튼이 메인 메뉴를 여는 버튼이며 메인 메뉴를 열면 각 항목의 버튼이 나타납니다. 서바이벌, 크리에이티브에 따라서 나오는 버튼의 종류가 다릅니다.\n인챈트 설정은 인챈트의 정보를 보고 설정을 할 수 있는 메뉴입니다. 버튼을 클릭하면 다른 메뉴가 열리며 버튼을 통해 사용 유무를 결정할 수 있고 옆의 info버튼을 누르면 상세한 정보를 보여주는 창이 나타납니다. 서바이벌 모드의 경우에는 이 창에서 강화, 수리, 추출이 가능합니다. 강화는 일정 XP를 소모하여 일정 확률로 인챈트를 다음 레벨로 올려줍니다. 강화가 성공하면 내구도가 다시 가득 차며 실패하면 아무런 변화가 없습니다. 수리는 일정 XP를 소모하여 인챈트의 내구도를 가득 채워줍니다. 내구도가 0인 인챈트는 사용할 수 없기 때문에 제 시기에 수리를 진행하는 것이 좋습니다. 기본적으로 내구도는 한 번에 1씩 줄어듭니다. 추출은 인챈트를 없애고 레벨에 따라 일정 XP를 획득하는 것입니다.\n인챈트의 종류는 크게 일반 인챈트, 화살 개수 관련 인챈트, 부가 인챈트가 있으며 화살 개수 관련 인챈트와 부가 인챈트의 경우에는 한번에 한 개의 인챈트만 사용할 수 있습니다.\n인챈트 보관함은 서바이벌 모드에서 인챈트 테이블을 이용해 뽑은 인챈트가 보관되는 곳입니다. 이곳에서 인챈트를 적용 할 수 있으며 이미 같은 종류의 인챈트가 있다면 적용되지 않습니다. 이런 경우에는 추출을 통해 기존의 인챈트를 없애 주어야 적용이 가능합니다.\n히든 도전과제는 특정한 조건을 달성시 열리는 과제를 볼 수 있는 메뉴입니다. 히든 도전과제의 보상으로는 XP와 히든 인챈트가 있으며 특정 도전과제는 조건을 만족한 후 맵을 나갔다 들어와야 달성됩니다. 히든 도전과제를 열심히 찾아보세요!(생각보다 가까운 곳에 있을 수 있어요)\n난이도 설정은 몹의 난이도를 설정하는 메뉴입니다. 난이도를 바꿀 시 기존의 몹들은 모두 사라지며 난이도에 따라 몹의 체력과 획득 경험치가 달라집니다.\n인챈트 관리자는 크리에이티브 모드에서 인챈트의 수치를 조절할 수 있는 메뉴입니다. 메뉴에서 원하는 인챈트를 선택하면 인챈트의 사용 유무, 내구도, 레벨을 조절할 수 있습니다.\n테마 설정은 메뉴 다이얼로그의 테마를 바꾸는 것으로 Dark와 Light가 있으며 본 스크립트는 Dark에 최적화되어 있습니다.(Light 테마의 경우에는 버튼 색이 바탕 색과 어울리지 않을 수 있습니다.)\n\n▶제작 : 멸종위기의 AB형")*/ .setPositiveButton("확인", new android.content.DialogInterface.OnClickListener({ onClick: function() {
					null;
}})) .setCancelable(false).create();
				var count=0;
				var layout= new android.widget.LinearLayout( ctx );
				layout.setOrientation( 1 );
				layout.setPadding(dip2px(20), dip2px(20), dip2px(20), dip2px(20));
				layout.setGravity (android.view.Gravity.CENTER );
				var text= newText( "▶스크립트 설명\n이 스크립트는 플레이어의 활에 인챈트 효과를 부여해줍니다. 인챈트를 부여하기 위해서는 인챈트 테이블과 경험치가 필요합니다. 인챈트 테이블(Bow Enchant Table)은 스톤커터에서 조합할 수 있고 경험치는 적대적 몹을 잡으면 올라가며 아래쪽에 그 수치가 표기됩니다(경험치의 단위는 XP입니다).\n인챈트 테이블을 활로 터치하면 인챈트 뽑기가 가능하며 하급, 중급, 상급으로 나뉘어져 있습니다. 각 등급마다 인챈트가 나오는 레벨과 종류의 범위가 다르며 높은 등급일수록 좋은 인챈트가 나올 확률이 높고 경험치 소모량이 많습니다.\n오른쪽 위에 표시되는 파란색 바탕의 버튼이 메인 메뉴를 여는 버튼이며 메인 메뉴를 열면 각 항목의 버튼이 나타납니다. 서바이벌, 크리에이티브에 따라서 나오는 버튼의 종류가 다릅니다.\n인챈트 설정은 인챈트의 정보를 보고 설정을 할 수 있는 메뉴입니다. 버튼을 클릭하면 다른 메뉴가 열리며 버튼을 통해 사용 유무를 결정할 수 있고 옆의 info버튼을 누르면 상세한 정보를 보여주는 창이 나타납니다. 서바이벌 모드의 경우에는 이 창에서 강화, 수리, 추출이 가능합니다. 강화는 일정 XP를 소모하여 일정 확률로 인챈트를 다음 레벨로 올려줍니다. 강화가 성공하면 내구도가 다시 가득 차며 실패하면 아무런 변화가 없습니다. 수리는 일정 XP를 소모하여 인챈트의 내구도를 가득 채워줍니다. 내구도가 0인 인챈트는 사용할 수 없기 때문에 제 시기에 수리를 진행하는 것이 좋습니다. 기본적으로 내구도는 한 번에 1씩 줄어듭니다. 추출은 인챈트를 없애고 레벨에 따라 일정 XP를 획득하는 것입니다.\n인챈트의 종류는 크게 일반 인챈트, 화살 개수 관련 인챈트, 부가 인챈트가 있으며 화살 개수 관련 인챈트와 부가 인챈트의 경우에는 한번에 한 개의 인챈트만 사용할 수 있습니다.\n인챈트 보관함은 서바이벌 모드에서 인챈트 테이블을 이용해 뽑은 인챈트가 보관되는 곳입니다. 이곳에서 인챈트를 적용 할 수 있으며 이미 같은 종류의 인챈트가 있다면 적용되지 않습니다. 이런 경우에는 추출을 통해 기존의 인챈트를 없애 주어야 적용이 가능합니다.\n히든 도전과제는 특정한 조건을 달성시 열리는 과제를 볼 수 있는 메뉴입니다. 히든 도전과제의 보상으로는 XP와 히든 인챈트가 있으며 특정 도전과제는 조건을 만족한 후 맵을 나갔다 들어와야 달성됩니다. 히든 도전과제를 열심히 찾아보세요!(생각보다 가까운 곳에 있을 수 있어요)\n난이도 설정은 몹의 난이도를 설정하는 메뉴입니다. 난이도를 바꿀 시 기존의 몹들은 모두 사라지며 난이도에 따라 몹의 체력과 획득 경험치가 달라집니다.\n인챈트 관리자는 크리에이티브 모드에서 인챈트의 수치를 조절할 수 있는 메뉴입니다. 메뉴에서 원하는 인챈트를 선택하면 인챈트의 사용 유무, 내구도, 레벨을 조절할 수 있습니다.\n테마 설정은 메뉴 다이얼로그의 테마를 바꾸는 것으로 Dark와 Light가 있으며 본 스크립트는 Dark에 최적화되어 있습니다.(Light 테마의 경우에는 버튼 색이 바탕 색과 어울리지 않을 수 있습니다.)\n\n▶제작 : 멸종위기의 AB형" , 20, android.graphics.Color.GRAY, [0, 0, 0, 0], [ 0, 0, 0, 0 ] );
				layout.addView(text);
				var newBtn= newButton("", -1, -2, 20, android.graphics.Color.TRANSPARENT,  android.graphics.Color.TRANSPARENT, 
				new android.view.View.OnClickListener( { onClick: function( view ) { 
					if( Level.getGameMode()!=1&&count<10 && !(hiddenAchv.get[2]) ){
							 count++;
					}
					if(count==10){
						toast("히든업적 획득!");
						hiddenAchv.get[2]=true;
						changeExp(10000);
						count++;
					}
				}}));
				layout.addView(newBtn);
				var sv = new android.widget.ScrollView(ctx);
				sv.addView(layout);
				explainDialog.setView(sv);
				explainDialog.show();
			}}));
			layout.addView(infoBtn);
			if( Level.getGameMode()==1 ){
				layout.addView(newSpace( -1, dip2px(10)));
				var configBtn=newButton("인챈트 관리자", -1 , -2, 20, android.graphics.Color.WHITE,  android.graphics.Color.GRAY, 
				new android.view.View.OnClickListener( { onClick: function( view ) {
					dialog.dismiss();
					makeControlMenu();
				}}));
				layout.addView(configBtn);
			}
			layout.addView(newSpace( -1, dip2px(10)));
			var themeBtn=newButton("테마 설정", -1 , -2, 20, android.graphics.Color.WHITE,  android.graphics.Color.GRAY, 
			new android.view.View.OnClickListener( { onClick: function( view ) {
				dialog.dismiss();
				var themeDialog=new android.app.AlertDialog.Builder(ctx, dialogTheme) .setTitle("<테마 설정>") .setNegativeButton("Dark", new android.content.DialogInterface.OnClickListener({ onClick: function() {
					dialogTheme=HOLO_DARK;
				}})) .setPositiveButton("Light", new android.content.DialogInterface.OnClickListener({ onClick: function() {
					dialogTheme=HOLO_LIGHT;
				}})) .setMessage("Dark, White중 원하는 테마를 선택해주세요.") .setCancelable(false).create();
				themeDialog.show();
			}}));
			layout.addView(themeBtn);
			var menuSv = new android.widget.ScrollView(ctx);
			menuSv.addView(layout);
			menuSv.setLayoutParams(new android.widget.LinearLayout.LayoutParams (-1, -1));
			var dialog = new android.app.AlertDialog.Builder(ctx, dialogTheme) .setTitle("<메인 메뉴>") .setNegativeButton("취소", new android.content.DialogInterface.OnClickListener({ onClick: function() {
				null;
			}})).setView(menuSv) .setCancelable(false).create();
			dialog.show();
		}catch(error){
			cme(error);
		}
	}}));
}
//인챈트메뉴 만들기
function makeEnchantMenu(){
	var menuLayout = new android.widget.LinearLayout( ctx );
	menuLayout.setOrientation( 1 );
	
	 var categoryLayout = new android.widget.LinearLayout( ctx );
	categoryLayout.setOrientation( 1 );
	categoryLayout.setPadding(dip2px(10), dip2px(5), dip2px(10), dip2px(5));
	categoryLayout.setGravity (android.view.Gravity.CENTER );
	
	var normalCategory=newText("일반 인챈트", 10, android.graphics.Color.WHITE, [0, 0, 0, 0], [ dip2px(10), dip2px(5), dip2px(10), dip2px(5) ] );
	categoryLayout.addView(normalCategory);
	var tglBtn=null;
	var progBar=null;
	var infoBtn=null;
	var horLayout=null;
	var normalArray=new Array(normalEnchant.name.length);
	var normalTglArray=new Array(normalEnchant.name.length);
	var arrowNumArray=new Array(arrowNumEnchant.name.length);
	var arrowNumTglArray=new Array(arrowNumEnchant.name.length);
	var additionalArray=new Array(additionalEnchant.name.length);
	var additionalTglArray=new Array(additionalEnchant.name.length);
	for(var i in normalEnchant.name){
		if(normalEnchant.level[i]>0){
			horLayout = new android.widget.LinearLayout( ctx );
			horLayout.setOrientation( 0 );
			horLayout.setPadding(dip2px(10), dip2px(5), dip2px(10), dip2px(5));
			horLayout.setGravity (android.view.Gravity.CENTER );
			tglBtn=newToggle (normalEnchant.krName[i]+" Level "+ normalEnchant.level[i] , normalEnchant.krName[i]+" Level "+ normalEnchant.level[i] , 20, ctx. getWindowManager().getDefaultDisplay(). getWidth()*2/5 , -2, normalEnchant.use[i] );
			horLayout.addView(tglBtn)
			tglBtn.setOnCheckedChangeListener(new android.widget.CompoundButton.OnCheckedChangeListener({ onCheckedChanged: function(toggle, isChecked){
				if( normalEnchant.durability[ normalTglArray.indexOf(toggle) ]>0 ){
					normalEnchant.use[ normalTglArray.indexOf(toggle) ]=isChecked;
				}else{
					toast("내구도가 없습니다.");
					toggle.setChecked(false);
				}
			}}));
			normalTglArray[i]=tglBtn;
			infoBtn= newButton("info", -2, -2, 20, android.graphics.Color.GRAY,  android.graphics.Color.WHITE, 
			new android.view.View.OnClickListener( { onClick: function( view ) { 
				enchantInfoDialog("normal", normalArray.indexOf(view));
				dialog.dismiss();
			}}));
			normalArray[i]=infoBtn;
			horLayout.addView(infoBtn);
			categoryLayout.addView(horLayout);
			progBar=newProgBar( ctx.  getWindowManager().getDefaultDisplay(). getWidth()*1/2 , dip2px(5), normalEnchant.maxDurability[i], normalEnchant.durability[i], null);
			categoryLayout.addView(progBar);
			categoryLayout.addView(newSpace( dip2px(250), dip2px(10)));
		}
	}
	
	var arrowNumCategory=newText("화살 개수 관련 인챈트", 10, android.graphics.Color.WHITE, [0, 0, 0, 0], [ dip2px(10), dip2px(20), dip2px(10), dip2px(5) ] );
	categoryLayout.addView (arrowNumCategory);
	for(var j in arrowNumEnchant.name){
		if(arrowNumEnchant.level[j]>0){
			horLayout = new android.widget.LinearLayout( ctx );
			horLayout.setOrientation( 0 );
			horLayout.setPadding(dip2px(10), dip2px(5), dip2px(10), dip2px(5));
			horLayout.setGravity (android.view.Gravity.CENTER );
			tglBtn=newToggle (arrowNumEnchant.krName[j]+" Level "+ arrowNumEnchant.level[j] , arrowNumEnchant.krName[j]+" Level "+ arrowNumEnchant.level[j] , 20, ctx. getWindowManager().getDefaultDisplay(). getWidth()*2/5 , -2, arrowNumEnchant.use[j] );
			horLayout.addView(tglBtn);
			tglBtn.setOnCheckedChangeListener(new android.widget.CompoundButton.OnCheckedChangeListener({ onCheckedChanged: function(toggle, isChecked){
				if( arrowNumEnchant.durability[ arrowNumTglArray.indexOf(toggle)]>0 ){
					arrowNumEnchant.use[ arrowNumTglArray.indexOf(toggle)] =isChecked;
					if(isChecked){
						for(var i in arrowNumTglArray){
							if(i!= arrowNumTglArray.indexOf(toggle) ){
								arrowNumTglArray[i] .setChecked(false);
								arrowNumEnchant.use[i]=false;
							}
						}
					}
				}else{
					toast("내구도가 없습니다.");
					toggle.setChecked(false);
				}
			}}));
			arrowNumTglArray[j]=tglBtn;
			infoBtn= newButton("info", -2, -2, 20, android.graphics.Color.GRAY,  android.graphics.Color.WHITE, 
			new android.view.View.OnClickListener( { onClick: function( view ) { 
				enchantInfoDialog("arrowNum", arrowNumArray.indexOf(view) );
				dialog.dismiss();
			}}));
			arrowNumArray[j]=infoBtn;
			horLayout.addView(infoBtn);
			categoryLayout.addView(horLayout);
			progBar=newProgBar( ctx. getWindowManager().getDefaultDisplay(). getWidth()*1/2 , dip2px(5), arrowNumEnchant.maxDurability[j], arrowNumEnchant.durability[j], null);
			categoryLayout.addView(progBar);
			categoryLayout.addView(newSpace( dip2px(250), dip2px(10)));
		}
	}
	
	var additionalCategory=newText("부가 인챈트", 10, android.graphics.Color.WHITE, [0, 0, 0, 0], [ dip2px(10), dip2px(20), dip2px(10), dip2px(5) ] );
	categoryLayout.addView (additionalCategory);
	for(var k in additionalEnchant.name){
		if(additionalEnchant.level[k]>0){
			horLayout = new android.widget.LinearLayout( ctx );
			horLayout.setOrientation( 0 );
			horLayout.setPadding(dip2px(10), dip2px(5), dip2px(10), dip2px(5));
			horLayout.setGravity (android.view.Gravity.CENTER );
			tglBtn=newToggle (additionalEnchant.krName[k]+" Level "+ additionalEnchant.level[k] , additionalEnchant.krName[k]+" Level "+ additionalEnchant.level[k] , 20, ctx. getWindowManager().getDefaultDisplay(). getWidth()*2/5 , -2, additionalEnchant.use[k] );
			horLayout.addView(tglBtn);
			tglBtn.setOnCheckedChangeListener(new android.widget.CompoundButton.OnCheckedChangeListener({ onCheckedChanged: function(toggle, isChecked){
				if( additionalEnchant.durability[ additionalTglArray.indexOf(toggle)]>0 ){
					additionalEnchant.use[ additionalTglArray.indexOf(toggle)] =isChecked;
					try{
					if(isChecked){
						for(var j in additionalTglArray){
							if(j!= additionalTglArray.indexOf(toggle) ){
								additionalTglArray[j] .setChecked(false);
								additionalEnchant.use[j]=false;
							}
						}
					}
					}catch(e){
						cme(e);
					}
				}else{
					toast("내구도가 없습니다.");
					 toggle.setChecked(false);
				}
			}}));
			additionalTglArray[k]=tglBtn;
			infoBtn= newButton("info", -2, -2, 20, android.graphics.Color.GRAY,  android.graphics.Color.WHITE, 
			new android.view.View.OnClickListener( { onClick: function( view ) { 
				enchantInfoDialog("additional", additionalArray.indexOf(view) );
				dialog.dismiss();
			}}));
			additionalArray[k]=infoBtn;
			horLayout.addView(infoBtn);
			categoryLayout.addView(horLayout);
			progBar=newProgBar( ctx. getWindowManager().getDefaultDisplay(). getWidth()*1/2 , dip2px(5), additionalEnchant.maxDurability[k], additionalEnchant.durability[k], null);
			categoryLayout.addView(progBar);
			categoryLayout.addView(newSpace( dip2px(250), dip2px(10)));
		}
	}
	
	var mainMenuSv = new android.widget.ScrollView(ctx);
	mainMenuSv.addView(categoryLayout);
	mainMenuSv.setLayoutParams(new android.widget.LinearLayout.LayoutParams (-1, -1));
	
	var mainMenuLayout= new android.widget.RelativeLayout( ctx );
	mainMenuLayout.addView(mainMenuSv);
	
	menuLayout.addView(mainMenuLayout);
	
	var dialog = new android.app.AlertDialog.Builder(ctx, dialogTheme) .setTitle("<인챈트 설정>") .setNegativeButton("취소", new android.content.DialogInterface.OnClickListener({ onClick: function() {
		null;
	}})).setView(menuLayout) .setCancelable(false).create();
	dialog.show();
}
//인챈트 정보창 만들기
function enchantInfoDialog(category, which){
	var dialog = new android.app.AlertDialog.Builder(ctx, dialogTheme) .setNegativeButton("취소", new android.content.DialogInterface.OnClickListener({ onClick: function() {
		null;
	}}))
.setCancelable(false).create();
	var layout= new android.widget.LinearLayout( ctx );
	layout.setOrientation( 1 );
	layout.setPadding(dip2px(20), dip2px(20), dip2px(20), dip2px(20));
	layout.setGravity (android.view.Gravity.CENTER );
	var durLayout= new android.widget.LinearLayout( ctx );
	durLayout.setOrientation( 0 );
	durLayout.setGravity (android.view.Gravity.CENTER );
	var btnLayout= new android.widget.LinearLayout( ctx );
	btnLayout.setOrientation( 0 );
	btnLayout.setGravity (android.view.Gravity.CENTER );
	var layoutSv = new android.widget.ScrollView(ctx);
	var enchantText, durText, durProgBar, infoText, strBtn, repBtn, extBtn;
	if(category=="normal"){
		dialog.setTitle( "인챈트 - "+normalEnchant.krName[which] );
		if( normalEnchant.use[which] ){
			enchantText= newText( normalEnchant.krName[which] +" Level "+ normalEnchant.level[which]+"《활성화》", 20, android.graphics.Color.GRAY, [0, 0, 0, 0], [ dip2px(10), dip2px(5), dip2px(10), dip2px(5) ] );
		}else{
			enchantText= newText( normalEnchant.krName[which] +" Level "+ normalEnchant.level[which]+"《비활성화》", 20, android.graphics.Color.GRAY, [0, 0, 0, 0], [ dip2px(10), dip2px(5), dip2px(10), dip2px(5) ] );
		}
		layout.addView(enchantText);
		durText= newText( normalEnchant. durability[which] +" / "+ normalEnchant.maxDurability[which] , 20, android.graphics.Color.GRAY, [0, 0, 0, 0], [ dip2px(0), dip2px(0), dip2px(0), dip2px(0) ] );
		durProgBar=newProgBar(dip2px(200), dip2px(10), normalEnchant. maxDurability[which] , normalEnchant.durability[which], null);
		durLayout.addView(durText);
		durLayout.addView(newSpace( dip2px(10), dip2px(10)));
		durLayout.addView(durProgBar);
		layout.addView(durLayout);
		infoText=newButton (normalEnchant.info[which], dip2px(300), dip2px(100), 15, android.graphics.Color.GRAY,  android.graphics.Color.WHITE, 
		null);
		if( Level.getGameMode()!=1 ){
			strBtn= newButton("강화", -2, -2, 20, android.graphics.Color.WHITE,  android.graphics.Color.GRAY, 
			new android.view.View.OnClickListener( { onClick: function( view ) {
				dialog.dismiss();
				if(normalEnchant.level[which] ==normalEnchant.maxLevel[which]){
					toast("이미 최대 레벨입니다.");
				}else{
					var strDialog= new android.app.AlertDialog.Builder(ctx, dialogTheme) .setNegativeButton("취소", new android.content.DialogInterface.OnClickListener({ onClick: function() {
						null;
					}})) .setPositiveButton("강화 시작", new android.content.DialogInterface.OnClickListener({ onClick: function() {
						if(enchantExp< normalEnchant.level[which]*100 ){
							toast("경험치가 부족합니다.");
						}else{
							changeExp(-1* normalEnchant.level[which]*100 );
							makeProgDialog("strength", normalEnchant.name[which]);
						}
					}}))
.setCancelable(false)
.setTitle("인챈트 강화").setMessage( normalEnchant.krName[which]+ " Level "+ normalEnchant.level[which] + " 을 강화하는데 경험치 "+normalEnchant.level[which]*100+" XP가 소모됩니다.\n강화를 시작하시겠습니까?").create();
					strDialog.show();
				}
			}}));
			repBtn= newButton("수리", -2, -2, 20, android.graphics.Color.WHITE,  android.graphics.Color.GRAY, 
			new android.view.View.OnClickListener( { onClick: function( view ) {
				dialog.dismiss();
				if( normalEnchant. durability[which]== normalEnchant.maxDurability[which] ){
					toast("이미 내구도가 최대입니다.");
				}else{
					var repDialog= new android.app.AlertDialog.Builder(ctx, dialogTheme) .setNegativeButton("취소", new android.content.DialogInterface.OnClickListener({ onClick: function() {
						null;
					}})) .setPositiveButton("수리 시작", new android.content.DialogInterface.OnClickListener({ onClick: function() {
						if(enchantExp< normalEnchant.level[which]*10 ){
							toast("경험치가 부족합니다.");
						}else{
							changeExp(-1* normalEnchant.level[which]*10 );
							makeProgDialog("repair", normalEnchant.name[which]);
						}
					}}))
.setCancelable(false)
.setTitle("인챈트 수리").setMessage( normalEnchant.krName[which]+ " Level "+ normalEnchant.level[which] + " 을 수리하는데 경험치 "+normalEnchant.level[which]*10+" XP가 소모됩니다.\n수리를 시작하시겠습니까?").create();
					repDialog.show();
				}
			}}));
			extBtn= newButton("추출", -2, -2, 20, android.graphics.Color.WHITE,  android.graphics.Color.GRAY, 
			new android.view.View.OnClickListener( { onClick: function( view ) {
				dialog.dismiss();
				var extDialog= new android.app.AlertDialog.Builder(ctx, dialogTheme) .setNegativeButton("취소", new android.content.DialogInterface.OnClickListener({ onClick: function() {
					null;
				}})) .setPositiveButton("추출 시작", new android.content.DialogInterface.OnClickListener({ onClick: function() {
					makeProgDialog("extract", normalEnchant.name[which]);
				}}))
.setCancelable(false)
.setTitle("인챈트 추출").setMessage( normalEnchant.krName[which]+ " Level "+ normalEnchant.level[which] + " 을 추출하면 경험치 "+normalEnchant.level[which]*50+" XP를 획득합니다.\n추출을 시작하시겠습니까?").create();
				extDialog.show();
			}}));
			layout.addView(newSpace( dip2px(20), dip2px(20)));
			btnLayout.addView(strBtn);
			btnLayout.addView(newSpace( dip2px(50), dip2px(50)));
			btnLayout.addView(repBtn);
			btnLayout.addView(newSpace( dip2px(50), dip2px(50)));
			btnLayout.addView(extBtn);
		}
		layout.addView(infoText);
		layout.addView(newSpace( dip2px(20), dip2px(20)));
		if( Level.getGameMode()!=1 ){
			layout.addView(btnLayout);
		}
		layoutSv.addView(layout);
		dialog.setView(layoutSv);
	}else if(category=="arrowNum"){		
		dialog.setTitle( "인챈트 - "+arrowNumEnchant.krName[which] );
		if( arrowNumEnchant.use[which] ){
			enchantText= newText( arrowNumEnchant.krName[which] +" Level "+ arrowNumEnchant.level[which]+"《활성화》", 20, android.graphics.Color.GRAY, [0, 0, 0, 0], [ dip2px(10), dip2px(5), dip2px(10), dip2px(5) ] );
		}else{
			enchantText= newText( arrowNumEnchant.krName[which] +" Level "+ arrowNumEnchant.level[which]+"《비활성화》", 20, android.graphics.Color.GRAY, [0, 0, 0, 0], [ dip2px(10), dip2px(5), dip2px(10), dip2px(5) ] );
		}
		layout.addView(enchantText);
		durText= newText( arrowNumEnchant. durability[which] +" / "+ arrowNumEnchant.maxDurability[which] , 20, android.graphics.Color.GRAY, [0, 0, 0, 0], [ 0, 0, 0, 0 ] );
		durProgBar=newProgBar(dip2px(200), dip2px(10), arrowNumEnchant. maxDurability[which] , arrowNumEnchant.durability[which], null);
		durLayout.addView(durText);
		durLayout.addView(newSpace( dip2px(10), dip2px(10)));
		durLayout.addView(durProgBar);
		layout.addView(durLayout);
		infoText=newButton (arrowNumEnchant.info[which], dip2px(300), dip2px(100), 15, android.graphics.Color.GRAY,  android.graphics.Color.WHITE, null);
		if( Level.getGameMode()!=1 ){
			strBtn= newButton("강화", -2, -2, 20, android.graphics.Color.WHITE,  android.graphics.Color.GRAY, 
			new android.view.View.OnClickListener( { onClick: function( view ) {
				dialog.dismiss();
				if(normalEnchant.level[which] ==arrowNumEnchant.maxLevel[which]){
					toast("이미 최대 레벨입니다.");
				}else{
					var strDialog= new android.app.AlertDialog.Builder(ctx, dialogTheme) .setNegativeButton("취소", new android.content.DialogInterface.OnClickListener({ onClick: function() {
						null;
					}})) .setPositiveButton("강화 시작", new android.content.DialogInterface.OnClickListener({ onClick: function() {
						if(enchantExp< arrowNumEnchant.level[which]*100+300 ){
								toast("경험치가 부족합니다.");
							}else{
								changeExp(-1* arrowNumEnchant.level[which]*100 );
								makeProgDialog("strength", arrowNumEnchant.name[which]);
							}
					}}))
.setCancelable(false)
.setTitle("인챈트 강화").setMessage( arrowNumEnchant.krName[which]+ " Level "+ arrowNumEnchant.level[which] + " 을 강화하는데 경험치 "+(arrowNumEnchant.level[which]*100 +300)+" XP가 소모됩니다.\n강화를 시작하시겠습니까?").create();
					strDialog.show();
				}
			}}));
			repBtn= newButton("수리", -2, -2, 20, android.graphics.Color.WHITE,  android.graphics.Color.GRAY, 
			new android.view.View.OnClickListener( { onClick: function( view ) {
				dialog.dismiss();
				if( arrowNumEnchant. durability[which]== arrowNumEnchant.maxDurability[which] ){
					toast("이미 내구도가 최대입니다.");
				}else{
					var repDialog= new android.app.AlertDialog.Builder(ctx, dialogTheme) .setNegativeButton("취소", new android.content.DialogInterface.OnClickListener({ onClick: function() {
						null;
					}})) .setPositiveButton("수리 시작", new android.content.DialogInterface.OnClickListener({ onClick: function() {
						if(enchantExp< arrowNumEnchant.level[which]*10+300 ){
							toast("경험치가 부족합니다.");
						}else{
							changeExp(-1* arrowNumEnchant.level[which]*10 );
							makeProgDialog("repair", arrowNumEnchant.name[which]);
						}
					}}))
.setCancelable(false)
.setTitle("인챈트 수리").setMessage( arrowNumEnchant.krName[which]+ " Level "+ arrowNumEnchant.level[which] + " 을 수리하는데 경험치 "+(arrowNumEnchant.level[which]*10+300)+" XP가 소모됩니다.\n수리를 시작하시겠습니까?").create();
					repDialog.show();
				}
			}}));
			extBtn= newButton("추출", -2, -2, 20, android.graphics.Color.WHITE,  android.graphics.Color.GRAY, 
			new android.view.View.OnClickListener( { onClick: function( view ) {
				dialog.dismiss();
				var extDialog= new android.app.AlertDialog.Builder(ctx, dialogTheme) .setNegativeButton("취소", new android.content.DialogInterface.OnClickListener({ onClick: function() {
					null;
				}})) .setPositiveButton("추출 시작", new android.content.DialogInterface.OnClickListener({ onClick: function() {
					makeProgDialog("extract", arrowNumEnchant.name[which]);
				}}))
.setCancelable(false)
.setTitle("인챈트 추출").setMessage( arrowNumEnchant.krName[which]+ " Level "+ arrowNumEnchant.level[which] + " 을 추출하면 경험치 "+arrowNumEnchant.level[which]*100+" XP를 획득합니다.\n추출을 시작하시겠습니까?").create();
				extDialog.show();
			}}));
			layout.addView(newSpace( dip2px(20), dip2px(20)));
			btnLayout.addView(strBtn);
			btnLayout.addView(newSpace( dip2px(50), dip2px(50)));
			btnLayout.addView(repBtn);
			btnLayout.addView(newSpace( dip2px(50), dip2px(50)));
			btnLayout.addView(extBtn);
		}
		layout.addView(infoText);
		layout.addView(newSpace( dip2px(20), dip2px(20)));
		if( Level.getGameMode()!=1 ){
			layout.addView(btnLayout);
		}
		layoutSv.addView(layout);
		dialog.setView(layoutSv);
	}else if(category=="additional"){
		try{
		dialog.setTitle( "인챈트 - "+additionalEnchant.krName[which] );
		if( additionalEnchant.use[which] ){
			enchantText= newText( additionalEnchant.krName[which] +" Level "+ additionalEnchant.level[which]+"《활성화》", 20, android.graphics.Color.GRAY, [0, 0, 0, 0], [ dip2px(10), dip2px(5), dip2px(10), dip2px(5) ] );
		}else{
			enchantText= newText( additionalEnchant.krName[which] +" Level "+ additionalEnchant.level[which]+"《비활성화》", 20, android.graphics.Color.GRAY, [0, 0, 0, 0], [ dip2px(10), dip2px(5), dip2px(10), dip2px(5) ] );
		}
		layout.addView(enchantText);
		durText= newText( additionalEnchant. durability[which] +" / "+ additionalEnchant.maxDurability[which] , 20, android.graphics.Color.GRAY, [0, 0, 0, 0], [ 0, 0, 0, 0 ] );
		durProgBar=newProgBar(dip2px(200), dip2px(10), additionalEnchant. maxDurability[which] , additionalEnchant.durability[which], null);
		durLayout.addView(durText);
		durLayout.addView(newSpace( dip2px(10), dip2px(10)));
		durLayout.addView(durProgBar);
		layout.addView(durLayout);
		infoText=newButton (additionalEnchant.info[which], dip2px(300), dip2px(100), 15, android.graphics.Color.GRAY,  android.graphics.Color.WHITE, null);
		if( Level.getGameMode()!=1 ){
			strBtn= newButton("강화", -2, -2, 20, android.graphics.Color.WHITE,  android.graphics.Color.GRAY, 
			new android.view.View.OnClickListener( { onClick: function( view ) {
				dialog.dismiss();
				if(additionalEnchant.level[which] ==additionalEnchant.maxLevel[which]){
					toast("이미 최대 레벨입니다.");
				}else{
					var strDialog= new android.app.AlertDialog.Builder(ctx, dialogTheme) .setNegativeButton("취소", new android.content.DialogInterface.OnClickListener({ onClick: function() {
						null;
					}})) .setPositiveButton("강화 시작", new android.content.DialogInterface.OnClickListener({ onClick: function() {
						if(enchantExp< additionalEnchant.level[which]*100 ){
								toast("경험치가 부족합니다.");
							}else{
								changeExp(-1* additionalEnchant.level[which]*100 );
								makeProgDialog("strength", additionalEnchant.name[which]);
							}
					}}))
.setCancelable(false)
.setTitle("인챈트 강화").setMessage( additionalEnchant.krName[which]+ " Level "+ additionalEnchant.level[which] + " 을 강화하는데 경험치 "+additionalEnchant.level[which]*100+" XP가 소모됩니다.\n강화를 시작하시겠습니까?").create();
					strDialog.show();
				}
			}}));
			repBtn= newButton("수리", -2, -2, 20, android.graphics.Color.WHITE,  android.graphics.Color.GRAY, 
			new android.view.View.OnClickListener( { onClick: function( view ) {
				dialog.dismiss();
				if( additionalEnchant. durability[which]== additionalEnchant.maxDurability[which] ){
					toast("이미 내구도가 최대입니다.");
				}else{
					var repDialog= new android.app.AlertDialog.Builder(ctx, dialogTheme) .setNegativeButton("취소", new android.content.DialogInterface.OnClickListener({ onClick: function() {
						null;
					}})) .setPositiveButton("수리 시작", new android.content.DialogInterface.OnClickListener({ onClick: function() {
						if(enchantExp< additionalEnchant.level[which]*10 ){
							toast("경험치가 부족합니다.");
						}else{
							changeExp(-1* additionalEnchant.level[which]*10 );
							makeProgDialog("repair", additionalEnchant.name[which]);
						}
					}}))
.setCancelable(false)
.setTitle("인챈트 수리").setMessage( additionalEnchant.krName[which]+ " Level "+ additionalEnchant.level[which] + " 을 수리하는데 경험치 "+additionalEnchant.level[which]*10+" XP가 소모됩니다.\n수리를 시작하시겠습니까?").create();
					repDialog.show();
				}
			}}));
			extBtn= newButton("추출", -2, -2, 20, android.graphics.Color.WHITE,  android.graphics.Color.GRAY, 
			new android.view.View.OnClickListener( { onClick: function( view ) {
				dialog.dismiss();
				var extDialog= new android.app.AlertDialog.Builder(ctx, dialogTheme) .setNegativeButton("취소", new android.content.DialogInterface.OnClickListener({ onClick: function() {
					null;
				}})) .setPositiveButton("추출 시작", new android.content.DialogInterface.OnClickListener({ onClick: function() {
					makeProgDialog("extract", additionalEnchant.name[which]);
				}}))
.setCancelable(false)
.setTitle("인챈트 추출").setMessage( additionalEnchant.krName[which]+ " Level "+ additionalEnchant.level[which] + " 을 추출하면 경험치 "+additionalEnchant.level[which]*70+" XP를 획득합니다.\n추출을 시작하시겠습니까?").create();
				extDialog.show();
			}}));
			layout.addView(newSpace( dip2px(20), dip2px(20)));
			btnLayout.addView(strBtn);
			btnLayout.addView(newSpace( dip2px(50), dip2px(50)));
			btnLayout.addView(repBtn);
			btnLayout.addView(newSpace( dip2px(50), dip2px(50)));
			btnLayout.addView(extBtn);
		}
		layout.addView(infoText);
		layout.addView(newSpace( dip2px(20), dip2px(20)));
		if( Level.getGameMode()!=1 ){
			layout.addView(btnLayout);
		}
		layoutSv.addView(layout);
		dialog.setView(layoutSv);
		}catch(e){
			cme(e);
		}
	}
	dialog.show();
}
//인챈트 보관함 만들기
function makeEnchantInv(){
	var content=[];
	for( var i in enchantInv ){
		content.push(enchantInv[i]);
	}
	var dialog = new android.app.AlertDialog.Builder(ctx, dialogTheme);
	dialog.setTitle("<인챈트 보관함>");
	dialog.setItems(content, new android.content.DialogInterface. OnClickListener({ onClick: function(dialog, which){
		makeSubEnchantInv(which);
	}}));
	dialog.setNegativeButton("취소", new android.content.DialogInterface.OnClickListener({ onClick: function() {
		null;
	}}));
	dialog.setCancelable(false);
	dialog.show();
}
//인챈트 보관함 서브메뉴 만들기
function makeSubEnchantInv(which){
	var dialog = new android.app.AlertDialog.Builder(ctx, dialogTheme);
	var enchantNum;
	dialog.setTitle("<인챈트 보관함>");
	dialog.setMessage(enchantInv[which]+" 인챈트를 적용하시겠습니까?");
	dialog.setPositiveButton("인챈트 적용", new android.content.DialogInterface.OnClickListener({ onClick: function() {
		if(normalEnchant.krName.indexOf (enchantInv[which].split(" ")[0])!=-1 ){
			enchantNum= normalEnchant.krName.indexOf (enchantInv[which].split(" ")[0]);
			if( normalEnchant.level[enchantNum]==0 ){
				normalEnchant.level[enchantNum]= parseInt( enchantInv[which].split(" ")[1] );
				normalEnchant.durability[enchantNum]= normalEnchant.maxDurability[enchantNum];
				toast( enchantInv[which]+" 인챈트가 적용되었습니다." );
				enchantInv.splice(which, 1);
			}else{
				toast("이미 존재하는 인챈트입니다.");
			}
		}else if( arrowNumEnchant.krName.indexOf (enchantInv[which].split(" ")[0])!=-1 ){
			enchantNum= arrowNumEnchant.krName.indexOf (enchantInv[which].split(" ")[0]);
			if( arrowNumEnchant .level[enchantNum]==0 ){
				arrowNumEnchant.level[enchantNum]= parseInt( enchantInv[which].split(" ")[1] );
				arrowNumEnchant .durability[enchantNum]= arrowNumEnchant .maxDurability[enchantNum];
				toast( enchantInv[which]+" 인챈트가 적용되었습니다." );
				enchantInv.splice(which, 1);
			}else{
				toast("이미 존재하는 인챈트입니다.");
			}
		}else if(additionalEnchant.krName.indexOf (enchantInv[which].split(" ")[0])!=-1 ){
			enchantNum= additionalEnchant.krName.indexOf (enchantInv[which].split(" ")[0]);
			if( additionalEnchant .level[enchantNum]==0 ){
				additionalEnchant .level[enchantNum]= parseInt( enchantInv[which].split(" ")[1] );
				additionalEnchant .durability[enchantNum]= additionalEnchant .maxDurability[enchantNum];
				toast( enchantInv[which]+" 인챈트가 적용되었습니다." );
				enchantInv.splice(which, 1);
			}else{
				toast("이미 존재하는 인챈트입니다.");
			}
		}
	}}));
	dialog.setNegativeButton("취소", new android.content.DialogInterface.OnClickListener({ onClick: function() {
		null;
	}}));
	dialog.setCancelable(false);
	dialog.show();
}
//히든업적 메뉴 만들기
function makeAchvMenu(){
	var content=[];
	for( var i in hiddenAchv.name ){
		if(hiddenAchv.get[i]){
			content.push(hiddenAchv.name[i]);
		}else{
			content.push("???????");
		}
	}
	var dialog = new android.app.AlertDialog.Builder(ctx, dialogTheme);
	dialog.setTitle("<히든 업적>");
	dialog.setItems(content, new android.content.DialogInterface. OnClickListener({ onClick: function(dialog, which){
	makeAchvInfoMenu(which);
	}}));
	dialog.setNegativeButton("취소", new android.content.DialogInterface.OnClickListener({ onClick: function() {
		null;
	}}));
	dialog.setCancelable(false);
	dialog.show();
}
//히든업적 정보창 만들기
function makeAchvInfoMenu(which){
	var dialog = new android.app.AlertDialog.Builder(ctx, dialogTheme);
	dialog.setPositiveButton("확인", new android.content.DialogInterface.OnClickListener({ onClick: function() {
		null;
	}}));
	if(hiddenAchv.get[which]){
		dialog.setTitle ("<"+hiddenAchv.name[which]+">");
		dialog.setMessage(hiddenAchv. msg[which]);
		if(hiddenAchv.enchant[which]){
			dialog.setNeutralButton("인챈트 확인", new android.content.DialogInterface. OnClickListener({ onClick: function() {
				try{
				if(true){
					var layout= new android.widget.LinearLayout( ctx );
					layout.setOrientation( 1 );
					layout.setPadding(dip2px(20), dip2px(20), dip2px(20), dip2px(20));
					layout.setGravity (android.view.Gravity.CENTER );
					var tgl =newToggle ("《활성화》", "《비활성화》" , 20, -1 , -2, hiddenAchv.enchantUse[which] );
					tgl.setOnCheckedChangeListener(new android.widget.CompoundButton.OnCheckedChangeListener({ onCheckedChanged: function(toggle, isChecked){
						hiddenAchv.enchantUse[which] =isChecked;
					}}));
					layout.addView(tgl);
					var infoText =newButton (hiddenAchv.enchantInfo[which], dip2px(300), dip2px(100), 15, android.graphics.Color.GRAY,  android.graphics.Color.WHITE, 
		null);
		layout.addView(newSpace( dip2px(20), dip2px(20)));
		layout.addView(infoText);
					var enchantDialog= new android.app.AlertDialog.Builder(ctx, dialogTheme).setTitle("<히든 인챈트-신기전>") .setCancelable(false).setView(layout) .setPositiveButton("확인", new android.content.DialogInterface.OnClickListener({ onClick: function() {
		null;
	}})).create();
					enchantDialog.show();
				}
			}catch(e){
				cme(e);
			}
			}}));
		}
	}else{
		dialog.setTitle ("<???????>");
		dialog.setMessage("아직 히든업적을 찾지 못했습니다.");
	}
	dialog.setCancelable(false);
	dialog.show();
}
//난이도 설정창 만들기
function makeDiffMenu(){
	var layout= new android.widget.LinearLayout( ctx );
	layout.setOrientation( 1 );
	layout.setPadding(dip2px(20), dip2px(20), dip2px(20), dip2px(20));
	layout.setGravity (android.view.Gravity.CENTER );
	layout.addView(newSpace( -1, dip2px(20)));
	var normalBtn=newButton("normal", -1 , -2, 20, android.graphics.Color.WHITE,  android.graphics.Color.GRAY, 
	new android.view.View.OnClickListener( { onClick: function( view ) { 
		difficulty=normal;
		clearMob();
		dialog.dismiss();
	}}));
	layout.addView(normalBtn);
	layout.addView(newSpace( -1, dip2px(10)));
	var hardBtn=newButton("hard", -1 , -2, 20, android.graphics.Color.WHITE,  android.graphics.Color.GRAY, 
	new android.view.View.OnClickListener( { onClick: function( view ) { 
		difficulty=hard;
		clearMob();
		dialog.dismiss();
	}}));
	layout.addView(hardBtn);
	layout.addView(newSpace( -1, dip2px(10)));
	var hellBtn=newButton("hell", -1 , -2, 20, android.graphics.Color.WHITE,  android.graphics.Color.GRAY, 
	new android.view.View.OnClickListener( { onClick: function( view ) { 
		difficulty=hell;
		clearMob();
		dialog.dismiss();
	}}));
	layout.addView(hellBtn);
	layout.addView(newSpace( -1, dip2px(20)));
	var dialog = new android.app.AlertDialog.Builder(ctx, dialogTheme) .setTitle("<난이도 설정>") .setNegativeButton("취소", new android.content.DialogInterface.OnClickListener({ onClick: function() {
		null;
	}})).setCancelable(false).setView(layout) .create();
	dialog.show();
}
//크리에이티브에서 인챈트 조정 메뉴
function makeControlMenu(){
	var content=[];
	for( var i in normalEnchant.name ){
		content.push(normalEnchant.krName[i]);
	}
	for( var i in arrowNumEnchant.name ){
		content.push (arrowNumEnchant.krName[i]);
	}
	for( var i in additionalEnchant.name ){
		content.push (additionalEnchant.krName[i]);
	}
	var dialog = new android.app.AlertDialog.Builder(ctx, dialogTheme);
	dialog.setTitle("<인챈트 관리자-크리에이티브 전용>\n원하는 인챈트를 선택하세요");
	dialog.setItems(content, new android.content.DialogInterface. OnClickListener({ onClick: function(dialog, which){
		makeSubControlMenu( which );
	}}));
	dialog.setNegativeButton("취소", new android.content.DialogInterface.OnClickListener({ onClick: function() {
		null;
	}}));
	dialog.setCancelable(false);
	dialog.show();
}
//크리에이티브 인챈트 조정 서브메뉴
function makeSubControlMenu(which){
	var whichEnchant=["normal", 0];
	if(which<normalEnchant.name.length){
		whichEnchant[0]="normal";
		whichEnchant[1]=which;
	}else if(which< (normalEnchant.name.length+ arrowNumEnchant.name.length) ){
		whichEnchant[0]="arrowNum";
		whichEnchant[1]=which- normalEnchant.name.length ;
	}else if(which< (normalEnchant.name.length+ arrowNumEnchant.name.length+ additionalEnchant.name.length) ){
		whichEnchant[0]="additional";
		whichEnchant[1]=which- normalEnchant.name.length- arrowNumEnchant.name.length ;
	}
	var enchantInfo={krName: "", use: "", level: "", maxLevel: "", durability: "", maxDurability: ""};
	switch( whichEnchant[0] ){
		case "normal":
			enchantInfo.krName= normalEnchant.krName [whichEnchant[1]];
			enchantInfo.use= normalEnchant.use [whichEnchant[1]];
			enchantInfo.level= normalEnchant.level [whichEnchant[1]];
			enchantInfo.maxLevel= normalEnchant.maxLevel [whichEnchant[1]];
			enchantInfo.durability= normalEnchant.durability [whichEnchant[1]];
			enchantInfo.maxDurability= normalEnchant.maxDurability [whichEnchant[1]];
			break;
		case "arrowNum":
			enchantInfo.krName= arrowNumEnchant.krName [whichEnchant[1]];
			enchantInfo.use= arrowNumEnchant.use [whichEnchant[1]];
			enchantInfo.level= arrowNumEnchant.level [whichEnchant[1]];
			enchantInfo.maxLevel= arrowNumEnchant.maxLevel [whichEnchant[1]];
			enchantInfo.durability= arrowNumEnchant.durability [whichEnchant[1]];
			enchantInfo.maxDurability= arrowNumEnchant.maxDurability [whichEnchant[1]];
			break;
		case "additional":
			enchantInfo.krName= additionalEnchant.krName [whichEnchant[1]];
			enchantInfo.use= additionalEnchant.use [whichEnchant[1]];
			enchantInfo.level= additionalEnchant.level [whichEnchant[1]];
			enchantInfo.maxLevel= additionalEnchant.maxLevel [whichEnchant[1]];
			enchantInfo.durability= additionalEnchant.durability [whichEnchant[1]];
			enchantInfo.maxDurability= additionalEnchant.maxDurability [whichEnchant[1]];
			break;
	}
	var topLayout = new android.widget.LinearLayout( ctx );
	topLayout.setOrientation( 1 );
	topLayout.setPadding(dip2px(10), dip2px(5), dip2px(10), dip2px(5));
	topLayout.setGravity (android.view.Gravity.CENTER );
	var tgl= newToggle("인챈트 활성화", "인챈트 비활성화", 20, -1, -2, enchantInfo.use);
	topLayout.addView(tgl);
	
	var middleLayout = new android.widget.LinearLayout( ctx );
	middleLayout.setOrientation( 0 );
	middleLayout.setPadding(dip2px(10), dip2px(5), dip2px(10), dip2px(5));
	middleLayout.setGravity (android.view.Gravity.CENTER );
	var levelText=newText("Level : ", 20, android.graphics.Color.GRAY, [0, 0, 0, 0], [ dip2px(10), dip2px(5), dip2px(10), dip2px(5) ] );
	var plusBtn= newButton("+", dip2px(30), dip2px(30), 20, android.graphics.Color.WHITE,  android.graphics.Color.GRAY, 
	new android.view.View.OnClickListener( { onClick: function( view ) { 
		if( enchantInfo.level< enchantInfo.maxLevel ){
			enchantInfo.level++;
			levelValue.setText( enchantInfo.level .toString() );
		}
	}}));
	var levelValue=newText(enchantInfo.level, 30, android.graphics.Color.GRAY, [0, 0, 0, 0], [ dip2px(10), dip2px(5), dip2px(10), dip2px(5) ] );
	var minusBtn= newButton("-", dip2px(30), dip2px(30), 20, android.graphics.Color.WHITE,  android.graphics.Color.GRAY, 
	new android.view.View.OnClickListener( { onClick: function( view ) { 
		if( enchantInfo.level>0 ){
			enchantInfo.level--;
			levelValue.setText( enchantInfo.level .toString() );
		}
	}}));
	middleLayout.addView(levelText);
	middleLayout.addView(minusBtn);		
	middleLayout.addView(levelValue);
	middleLayout.addView(plusBtn);
	topLayout.addView(middleLayout);
	var bottomLayout = new android.widget.LinearLayout( ctx );
	bottomLayout.setOrientation( 0 );
	bottomLayout.setPadding(dip2px(10), dip2px(5), dip2px(10), dip2px(5));
	bottomLayout.setGravity (android.view.Gravity.CENTER );
	var durabilityText=newText("내구도 : ", 20, android.graphics.Color.GRAY, [0, 0, 0, 0], [ dip2px(10), dip2px(5), dip2px(10), dip2px(5) ] );
	var editText= newEditText(enchantInfo.durability, 20, "내구도", android.text.InputType. TYPE_CLASS_NUMBER, android.graphics.Color.WHITE, android.graphics.Color.BLUE,  dip2px(80), dip2px(40), [0, 0, 0, 0], [0, 0, 0, 0]);
	var maxDurabilityText=newText(" / "+enchantInfo.maxDurability, 20, android.graphics.Color.GRAY, [0, 0, 0, 0], [ dip2px(10), dip2px(5), dip2px(10), dip2px(5) ] );
	bottomLayout.addView(durabilityText);
	bottomLayout.addView(editText);
	bottomLayout.addView (maxDurabilityText);
	topLayout.addView(bottomLayout);
	var dialog = new android.app.AlertDialog.Builder(ctx, dialogTheme);
	dialog.setTitle("<인챈트 - "+enchantInfo.krName+">");
	 dialog.setPositiveButton("확인", new android.content.DialogInterface.OnClickListener({ onClick: function() {
		if(parseInt(editText.getText()) > enchantInfo.maxDurability){
			toast("잘못된 값입니다");
		}else if( parseInt(editText.getText())==0&& tgl.isChecked() ){
			toast("내구도가 0인 상태로 인챈트를 활성화시킬 수 없습니다.");
		}else{
			switch( whichEnchant[0] ){
				case "normal":
					normalEnchant.use [whichEnchant[1]]= tgl.isChecked();
					normalEnchant.level [whichEnchant[1]]= enchantInfo.level;
					normalEnchant.durability [whichEnchant[1]] =parseInt(editText.getText());
					break;
				case "arrowNum":
					arrowNumEnchant.use [whichEnchant[1]]= tgl.isChecked();
					arrowNumEnchant.level [whichEnchant[1]]= enchantInfo.level;
					arrowNumEnchant.durability [whichEnchant[1]] = parseInt(editText.getText());
					if(tgl.isChecked()){
						for(var i in arrowNumEnchant.name){
							if(i!= whichEnchant[1] ){
								arrowNumEnchant.use[i]=false;
							}
						}
					}
					break;
				case "additional":
					additionalEnchant.use [whichEnchant[1]]= tgl.isChecked();
					additionalEnchant.level [whichEnchant[1]]= enchantInfo.level;
					additionalEnchant.durability [whichEnchant[1]] = parseInt(editText.getText());
					if(tgl.isChecked()){
						for(var i in additionalEnchant.name){
							if(i!= whichEnchant[1] ){
								additionalEnchant.use[i]=false;
							}
						}
					}
					break;
			}
		}
	}}));
	dialog.setNegativeButton("취소", new android.content.DialogInterface.OnClickListener({ onClick: function() {
		null;
	}}));
	dialog.setView(topLayout);
	dialog.setCancelable(false);
	dialog.show();
}
//인챈트 테이블 터치 시 인챈트 
function makeEnchantPickMenu(){
	ctx.runOnUiThread(new java.lang.Runnable({ run: function() {
		try {
			var layout= new android.widget.LinearLayout( ctx );
			layout.setOrientation( 1 );
			layout.setGravity (android.view.Gravity.CENTER );
			layout.addView(newSpace( -1, dip2px(20)));
			var lowRankPickBtn=newButton("하급 인챈트 부여", ctx. getWindowManager().getDefaultDisplay(). getWidth()*1/2 , -2, 20, android.graphics.Color.WHITE,  android.graphics.Color.GRAY, 
			new android.view.View.OnClickListener( { onClick: function( view ) {
				dialog.dismiss();
				enchantPickInfo("pick.low")
			}}));
			layout.addView(lowRankPickBtn);
			layout.addView(newSpace( -1, dip2px(10)));
			var midRankPickBtn=newButton("중급 인챈트 부여", ctx. getWindowManager().getDefaultDisplay(). getWidth()*1/2 , -2, 20, android.graphics.Color.WHITE,  android.graphics.Color.GRAY, 
			new android.view.View.OnClickListener( { onClick: function( view ) {
				dialog.dismiss();
				enchantPickInfo("pick.mid")
			}}));
			layout.addView(midRankPickBtn);
			layout.addView(newSpace( -1, dip2px(10)));
			var highRankPickBtn=newButton("상급 인챈트 부여", ctx. getWindowManager().getDefaultDisplay(). getWidth()*1/2 , -2, 20, android.graphics.Color.WHITE,  android.graphics.Color.GRAY, 
			new android.view.View.OnClickListener( { onClick: function( view ) {
				dialog.dismiss();
				enchantPickInfo("pick.high")
			}}));
			layout.addView(highRankPickBtn);
			layout.addView(newSpace( -1, dip2px(20)));
			var menuSv = new android.widget.ScrollView(ctx);
			menuSv.addView(layout);
			menuSv.setLayoutParams(new android.widget.LinearLayout.LayoutParams (-1, -1));
			var dialog = new android.app.AlertDialog.Builder(ctx, dialogTheme) .setTitle("<인챈트 테이블>") .setNegativeButton("취소", new android.content.DialogInterface.OnClickListener({ onClick: function() {
				null;
			}})).setView(menuSv) .setCancelable(false).create();
			dialog.show();
		}catch(error){
			cme(error);
		}
	}}));
}
//인챈트 뽑기 확인
function enchantPickInfo(rank){
	var dialog = new android.app.AlertDialog.Builder(ctx, dialogTheme)
.setPositiveButton("인챈트 부여 시작", new android.content.DialogInterface.OnClickListener({ onClick: function() {
		if(rank=="pick.low"&&enchantExp>=200){
			changeExp(-200);
			makeProgDialog(rank, null);
		}else if(rank=="pick.mid"&& enchantExp>=500){
			changeExp(-500);
			makeProgDialog(rank, null);
		}else if(rank=="pick.high"&& enchantExp>=1000){
			changeExp(-1000);
			makeProgDialog(rank, null);
		}else{
			toast("경험치가 부족합니다.");
		}
	}}))
.setNegativeButton("취소", new android.content.DialogInterface. OnClickListener({ onClick: function() {
		null;
	}})).setCancelable(false).create();
	if(rank=="pick.low"){
		dialog.setTitle ("<하급 인챈트 부여>");
		dialog.setMessage("경험치 200 XP가 소모됩니다.");
	}else if(rank=="pick.mid"){
		dialog.setTitle ("<중급 인챈트 부여>");
		dialog.setMessage("경험치 500 XP가 소모됩니다.");
	}else if(rank=="pick.high"){
		dialog.setTitle ("<상급 인챈트 부여>");
		dialog.setMessage("경험치 1000 XP가 소모됩니다.");
	}
	dialog.show();
}
//프로그래스 다이얼로그
function makeProgDialog(which, name){
	var dialog = new android.app.ProgressDialog(ctx, dialogTheme);
	dialog.setProgressStyle(1);
	dialog.setMax(100);
	dialog.setCancelable(false);
	if(which=="pick.low"){
		dialog.setTitle("하급 인챈트 뽑기 중입니다...");
		dialog.show();
		new java.lang.Thread(new java.lang.Runnable({run: function(){
			for(var i=0;i<=100;i++){
				dialog.setProgress(i);
				java.lang.Thread.sleep(50);
			}
			dialog.dismiss();
			makeResultDialog(which, null);
		}})).start();
	}else if(which=="pick.mid"){
		dialog.setTitle("중급 인챈트 뽑기 중입니다...");
		dialog.show();
		new java.lang.Thread(new java.lang.Runnable({run: function(){
			for(var i=0;i<=100;i++){
				dialog.setProgress(i);
				java.lang.Thread.sleep(50);
			}
			dialog.dismiss();
			makeResultDialog(which, null);
		}})).start();
	}else if(which=="pick.high"){
		dialog.setTitle("상급 인챈트 뽑기 중입니다...");
		dialog.show();
		new java.lang.Thread(new java.lang.Runnable({run: function(){
			for(var i=0;i<=100;i++){
				dialog.setProgress(i);
				java.lang.Thread.sleep(50);
			}
			dialog.dismiss();
			makeResultDialog(which, null);
		}})).start();
	}else if(which=="strength"){
		dialog.setTitle("인챈트 강화 중입니다...");
		dialog.show();
		new java.lang.Thread(new java.lang.Runnable({run: function(){
			for(var i=0;i<=100;i++){
				dialog.setProgress(i);
				java.lang.Thread.sleep(50);
			}
			dialog.dismiss();
			makeResultDialog(which, name);
		}})).start();
	}else if(which=="repair"){
		dialog.setTitle("인챈트 수리 중입니다...");
		dialog.show();
		new java.lang.Thread(new java.lang.Runnable({run: function(){
			for(var i=0;i<=100;i++){
				dialog.setProgress(i);
				java.lang.Thread.sleep(50);
			}
			dialog.dismiss();
			makeResultDialog(which, name);
		}})).start();
	}else if(which=="extract"){
		dialog.setTitle("인챈트 추출 중입니다...");
		dialog.show();
		new java.lang.Thread(new java.lang.Runnable({run: function(){
			for(var i=0;i<=100;i++){
				dialog.setProgress(i);
				java.lang.Thread.sleep(50);
			}
			dialog.dismiss();
			makeResultDialog(which, name);
		}})).start();
	}
}
//결과 표시 다이얼로그
function makeResultDialog(which, name){
	ctx.runOnUiThread(new java.lang.Runnable({ run: function() {
		try{
			var pos=0;
			var enName=0;
			var enLevel=0;
			var enchantIndex=-1;
			var dialog = new android.app.AlertDialog.Builder(ctx, dialogTheme) .setPositiveButton("확인", new android.content.DialogInterface.OnClickListener({ onClick: function() {
				null;
			}})).setCancelable(false).create();
			if(which=="pick.low"){
				pos=Math.floor(Math.random()* normalEnchant.name.length);
				dialog.setTitle("하급 인챈트 부여 결과");
				dialog.setMessage(normalEnchant .krName[pos]+" Level 1 (이)가 부여되었습니다.\n부여된 인챈트는 인챈트 보관함으로 이동합니다.");
				enchantInv.push( normalEnchant .krName[pos]+" 1" );
				dialog.show();
			}else if(which=="pick.mid"){
				pos=Math.random()*100;
				if(pos>85){
					pos=Math.floor(Math.random()* arrowNumEnchant.name.length);
					enName= arrowNumEnchant .krName[pos];
					enLevel=Math.ceil(Math.random()*3);
					if(enLevel>arrowNumEnchant .maxLevel[pos]){
						enLevel= arrowNumEnchant .maxLevel[pos];
					}
				}else if(pos>60){
					pos=Math.floor(Math.random()* additionalEnchant.name.length);
					enName= additionalEnchant .krName[pos];
					enLevel=Math.ceil(Math.random()*3);
					if(enLevel>additionalEnchant .maxLevel[pos]){
						enLevel= additionalEnchant .maxLevel[pos];
					}
				}else{
					pos=Math.floor(Math.random()* normalEnchant.name.length);
					enName= normalEnchant .krName[pos];
					enLevel=Math.ceil(Math.random()*3);
					if(enLevel>normalEnchant .maxLevel[pos]){
						enLevel= normalEnchant .maxLevel[pos];
					}
				}
				dialog.setTitle("중급 인챈트 부여 결과");
				dialog.setMessage(enName+" Level "+enLevel+" (이)가 부여되었습니다.\n부여된 인챈트는 인챈트 보관함으로 이동합니다.");
				enchantInv.push( enName+" "+enLevel );
				dialog.show();
			}else if(which=="pick.high"){
				pos=Math.random()*100;
				if(pos>85){
					pos=Math.floor(Math.random()* arrowNumEnchant.name.length);
					enName= arrowNumEnchant .krName[pos];
					enLevel=Math.ceil(Math.random()*5)+2;
					if(enLevel>arrowNumEnchant .maxLevel[pos]){
						enLevel= arrowNumEnchant .maxLevel[pos];
					}
				}else if(pos>60){
					pos=Math.floor(Math.random()* additionalEnchant.name.length);
					enName= additionalEnchant .krName[pos];
					enLevel=Math.ceil(Math.random()*3)+2;
					if(enLevel>additionalEnchant .maxLevel[pos]){
						enLevel= additionalEnchant .maxLevel[pos];
					}
				}else{
					pos=Math.floor(Math.random()* normalEnchant.name.length);
					enName= normalEnchant .krName[pos];
					enLevel=Math.ceil(Math.random()*3)+2;
					if(enLevel>normalEnchant .maxLevel[pos]){
						enLevel= normalEnchant .maxLevel[pos];
					}
				}
				dialog.setTitle("상급 인챈트 부여 결과");
				dialog.setMessage(enName+" Level "+enLevel+" (이)가 부여되었습니다.\n부여된 인챈트는 인챈트 보관함으로 이동합니다.");
				enchantInv.push( enName+" "+enLevel );
				dialog.show();
			}else if(which=="strength"){
				dialog.setTitle("인챈트 강화 결과");
				pos=(Math.random())*100;
				if(normalEnchant.name. indexOf(name)!=-1){
					enchantIndex= normalEnchant.name. indexOf(name);
					if(pos>10+normalEnchant.level [enchantIndex]*6){
						dialog.setMessage (normalEnchant.krName[enchantIndex]+" Level "+ normalEnchant.level[enchantIndex] +" 의 강화가 성공하였습니다.\n"+"Level "+ normalEnchant.level[enchantIndex]+" → "+ (normalEnchant.level[enchantIndex]+1) );
						normalEnchant.level[enchantIndex]++;
						normalEnchant.durability [enchantIndex]= normalEnchant.maxDurability[enchantIndex];
					}else{
						dialog.setMessage (normalEnchant.krName[enchantIndex]+" Level "+ normalEnchant.level[enchantIndex] +" 의 강화가 실패하였습니다.\n"+"Level "+ normalEnchant.level[enchantIndex]+" → "+ normalEnchant.level[enchantIndex] );
					}
				}else if( arrowNumEnchant.name. indexOf(name)!=-1 ){
					enchantIndex= arrowNumEnchant.name. indexOf(name);
		 			if(pos>50+ arrowNumEnchant.level[enchantIndex]*3 ){
						dialog.setMessage (arrowNumEnchant.krName[enchantIndex]+" Level "+ arrowNumEnchant.level[enchantIndex] +" 의 강화가 성공하였습니다.\n"+"Level "+ arrowNumEnchant.level[enchantIndex]+" → "+ (arrowNumEnchant.level[enchantIndex]+1) );
						arrowNumEnchant.level [enchantIndex]++;
						arrowNumEnchant.durability [enchantIndex]= arrowNumEnchant.maxDurability[enchantIndex];
					}else{
						dialog.setMessage (arrowNumEnchant.krName[enchantIndex]+" Level "+ arrowNumEnchant.level[enchantIndex] +" 의 강화가 실패하였습니다.\n"+"Level "+ arrowNumEnchant.level[enchantIndex]+" → "+ arrowNumEnchant.level[enchantIndex] );
					}
				}else if( additionalEnchant.name. indexOf(name)!=-1 ){
					enchantIndex= additionalEnchant.name. indexOf(name);
					if(pos>30+ additionalEnchant.level[enchantIndex]*5 ){
						dialog.setMessage (additionalEnchant.krName[enchantIndex]+" Level "+ additionalEnchant.level[enchantIndex] +" 의 강화가 성공하였습니다.\n"+"Level "+ additionalEnchant.level[enchantIndex]+" → "+ (additionalEnchant.level[enchantIndex]+1) );
						additionalEnchant.level [enchantIndex]++;
						additionalEnchant.durability [enchantIndex]= additionalEnchant.maxDurability[enchantIndex];
					}else{
						dialog.setMessage (additionalEnchant.krName[enchantIndex]+" Level "+ additionalEnchant.level[enchantIndex] +" 의 강화가 실패하였습니다.\n"+"Level "+ additionalEnchant.level[enchantIndex]+" → "+ additionalEnchant.level[enchantIndex] );
					}
				}
				dialog.show();
			}else if(which=="repair"){
				if(normalEnchant.name. indexOf(name)!=-1){
					enchantIndex= normalEnchant.name. indexOf(name);
					dialog.setMessage( normalEnchant.krName[enchantIndex]+" 의 수리가 완료되었습니다." );
					normalEnchant.durability [enchantIndex]= normalEnchant.maxDurability[enchantIndex];
				}else if( arrowNumEnchant.name. indexOf(name)!=-1 ){
					enchantIndex= arrowNumEnchant.name. indexOf(name);
					dialog.setMessage( arrowNumEnchant.krName[enchantIndex]+" 의 수리가 완료되었습니다." );
					arrowNumalEnchant.durability [enchantIndex]= arrowNumEnchant.maxDurability [enchantIndex];
				}else if( additionalEnchant.name. indexOf(name)!=-1 ){
					enchantIndex= additionalEnchant.name. indexOf(name);
					dialog.setMessage( additionalEnchant.krName[enchantIndex]+" 의 수리가 완료되었습니다." );
					additionalEnchant.durability [enchantIndex]= additionalEnchant.maxDurability [enchantIndex];
				}
				dialog.show();
			}else if(which=="extract"){
				if(normalEnchant.name. indexOf(name)!=-1){
					enchantIndex= normalEnchant.name. indexOf(name);
					dialog.setMessage( normalEnchant.krName[enchantIndex]+" 의 추출이 완료되었습니다." );
					changeExp( normalEnchant.level[enchantIndex]*50 );
					normalEnchant.level [enchantIndex]=0;
					normalEnchant.durability [enchantIndex]=0;
				}else if( arrowNumEnchant.name. indexOf(name)!=-1 ){
					enchantIndex= arrowNumEnchant.name. indexOf(name);
					dialog.setMessage( arrowNumEnchant.krName[enchantIndex]+" 의 추출이 완료되었습니다." );
					changeExp( arrowNumEnchant.level[enchantIndex]*100 );
					arrowNumEnchant.level [enchantIndex]=0;
					arrowNumEnchant.durability [enchantIndex]=0;
				}else if( additionalEnchant.name. indexOf(name)!=-1 ){
					enchantIndex= additionalEnchant.name. indexOf(name);
					dialog.setMessage( additionalEnchant.krName[enchantIndex]+" 의 추출이 완료되었습니다." );
					changeExp( additionalEnchant.level[enchantIndex]*70 );
					additionalEnchant.level [enchantIndex]=0;
					additionalEnchant.durability [enchantIndex]=0;
				}
				dialog.show();
			}
		}catch(error){
			cme(error);
		}
	}}));
}