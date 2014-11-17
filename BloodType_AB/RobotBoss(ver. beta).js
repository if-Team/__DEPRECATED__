/////플레이어관련 상수&변수/////
var hp=0;
const maxHp=350;

var savePos={x:0, y:0, z:0};

var isLoading=false;
var isDungeon=false;

/////보스관련 상수&변수////
var bossEnt;
var bossHp=0;
const bossMaxHp=400;
var bossState=0;
var bossSpawn=false;
var swordEntAry=[];

var actCheck=0;

const none=0;
const move=1;
const wave=2;
const laser=3;
const missile=4;
const mMissile=5;
const gatling=6;
const bomb=7;

var coolTime={wave: 400, laser: 1000, missile: 400, mMissile: 800, gatling: 750, bomb: 460};
var maxCoolTime={wave: 400, laser: 1000, missile: 400, mMissile: 800, gatling: 750, bomb: 460 };

var dungeonBlock_Robot;

/////렌더링관련 변수/////
var holdArmRender;
var laserRender=new Array(100);
var gatlingRender=new Array(100);
var mGunRender= new Array(100);
var missileRender;
var bombRender;
var swordRender;

/////GUI관련 상수&변수/////
const ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
var hpWindow=null;
var hpBgWindow=null;
var hpView=null;
var maxHpWidth=dip2px(330);
var maxHpHeight=dip2px(40);

var bossHpWindow=null;
var bossHpProgBar=null;

/*------------------------------------
ModPE관련 자체 함수들(기존에 존재하던 함수들)
------------------------------------*/
function newLevel(hasLevel){
	/*hp= Entity.getHealth(Player.getEntity());
	hpGUI();
	updateHpGUI();*/
	isLoading=false;
	isDungeon=false;
	bossState=0;
	dungeonBlock_Robot=make3DAry(27, 22, 27);
for(var i=0;i< dungeonBlock_Robot.length;i++ ){
	for(var j=0;j< dungeonBlock_Robot[i].length;j++ ){
		for(var k=0;k< dungeonBlock_Robot[i][j].length;k++ ){
			if(i>0&&i<26&&j>0&&j<21&&k>0&&k<26){
				dungeonBlock_Robot[i][j][k]=0;
			}else if((j>5&&j<10)||(j>15&&j<20)){
				dungeonBlock_Robot[i][j][k]=89;
			}else if( (j==21||j==0)&& (i==k||i+k==26||i==13 ||k==13) ){
				dungeonBlock_Robot[i][j][k]=89;
			}else{
				dungeonBlock_Robot[i][j][k]=155;
			}
		}
	}
}
	Block.defineBlock( 174,"Portal", 
[["emerald_block", 0], ["emerald_block", 0], ["emerald_block", 0], ["emerald_block", 0], ["emerald_block", 0], ["emerald_block", 0]]);
	Block.setDestroyTime(174, 1);
	Item.addCraftRecipe(174, 1, 0, [265,  9, 0]);
}
function leaveGame(){
	closeWindow(hpWindow);
	closeWindow(hpBgWindow);
	closeWindow(bossHpWindow);
}
function useItem(x, y, z, itemId, blockId, side, itemDamage, blockDamage){
	if(itemId==280&&blockId==174){
		if( Level.getGameMode()==1 ){
			cm("본 스크립트는 크리에이티브 모드에서 사용이 불가능합니다 .");
			return;
		}
		new java.lang.Thread(new java.lang.Runnable({run: function(){
			try{
			cm("던전으로 이동합니다...");
			savePos.x=Player.getX();
			savePos.y=Player.getY();
			savePos.z=Player.getZ();
			for(var i=0;i< dungeonBlock_Robot.length;i++ ){
				for(var j=0;j< dungeonBlock_Robot[i].length;j++ ){
					for(var k=0;k< dungeonBlock_Robot[i][j].length;k++ ){
						Level.setTile(i, j, k, dungeonBlock_Robot[i][j][k]);
					}
				}
			}
			Entity.setPosition(Player.getEntity(), 13, 5.6, 13);
			isDungeon=true;
			cm("로딩중입니다...\n잠시 기다려주세요.\n로딩이 완료되면 보스가 등장합니다.");
			rendering();
			}catch(e){
				cme(e);
			}
		}})).start();
	}
	if(isDungeon){
		preventDefault();
	}
}
function destroyBlock(x, y, z, side){
	if(isDungeon){
		preventDefault();
	}
}
function entityAddedHook(entity){
	if( Entity.getEntityTypeId(entity)==80 &&isDungeon){
		Entity.remove(entity);
	}
}
function entityRemovedHook(entity){
	
}
function attackHook(attacker, victim){
	if(victim!=bossEnt&&isDungeon){
		preventDefault();
	}
}
function deathHook(attacker, victim){
	if(victim==bossEnt){
		closeWindow(bossHpWindow);
		bossSpawn=false;
		isDungeon=false;
		cm("보스를 처치했습니다!\n잠시 후 원래 장소로 이동합니다.");
		new java.lang.Thread(new java.lang.Runnable({run: function(){
			java.lang.Thread.sleep(5000);
			Entity.setHealth(Player.getEntity(), 20);
			Entity.setPosition(Player.getEntity(), savePos.x, savePos.y, savePos.z);
			closeWindow(hpWindow);
			closeWindow(hpBgWindow);
		}})).start();
		//Entity.setHealth(victim, 100);
	}
}
function modTick(){
	if(hp!= Entity.getHealth(Player.getEntity()) &&bossSpawn){
		updateHpGUI();
		hp= Entity.getHealth(Player.getEntity()) ;
	}
	if(bossHp!=Entity.getHealth(bossEnt)){
		bossHp=Entity.getHealth(bossEnt);
		updateProgBar(bossHpProgBar, bossHp, null)
	}
	if(bossSpawn){
		if(bossHp<(bossMaxHp*3/4) &&bossState==0){
			bossState=1;
			var swordEnt= Level.spawnMob(Entity.getX(bossEnt), Entity.getY(bossEnt)+4, Entity.getZ(bossEnt) , 11);
			Entity.setHealth(swordEnt, 1000);
			swordEntAry.push(swordEnt);
			Entity.setRenderType(swordEnt, swordRender.renderType);
			flyingSword(swordEnt, 4);
		}else if(bossHp<(bossMaxHp*1/2) &&bossState==1){
			bossState=2;
			var swordEnt= Level.spawnMob( Entity.getX(bossEnt), Entity.getY(bossEnt)+5, Entity.getZ(bossEnt) , 11);
			Entity.setHealth(swordEnt, 1000);
			swordEntAry.push(swordEnt);
			Entity.setRenderType(swordEnt, swordRender.renderType);
			flyingSword(swordEnt, 5);
		}else if(bossHp<(bossMaxHp*1/4) &&bossState==2){
			bossState=3;
			var swordEnt= Level.spawnMob( Entity.getX(bossEnt), Entity.getY(bossEnt)+6, Entity.getZ(bossEnt) , 11);
			Entity.setHealth(swordEnt, 1000);
			swordEntAry.push(swordEnt);
			Entity.setRenderType(swordEnt, swordRender.renderType);
			flyingSword(swordEnt, 6);
			var swordEnt2= Level.spawnMob( Entity.getX(bossEnt), Entity.getY(bossEnt)+7, Entity.getZ(bossEnt) , 11);
			Entity.setHealth(swordEnt2, 1000);
			swordEntAry.push(swordEnt2);
			Entity.setRenderType(swordEnt2, swordRender.renderType);
			flyingSword(swordEnt2, 7);
		}
	}
}
/*------------------------------------
ModPE관련 사용자 지정 함수들
------------------------------------*/
//보스 패턴
function bossPattern(ent){
	new java.lang.Thread(new java.lang.Runnable({run: function(){
	try{
		var sin, cos, tan, pcos;
		var pos={x:Entity.getX(ent), y: Entity.getY(ent) , z: Entity.getZ(ent) };
		var stopYaw;
		var newAngle, dist;
		var newYaw;
		var moveCount=0;
		var skillCount=0;
		var renderIndex=0;
		var newEnt;
		while(bossSpawn){
			if(actCheck==none){
				if( isClose2D(Player.getX(), Player.getZ(), Entity.getX(ent), Entity.getZ(ent), 7)&&coolTime.bomb==0 &&bossState>=2){
					actCheck=bomb;
				}else if( isClose2D(Player.getX(), Player.getZ(), Entity.getX(ent), Entity.getZ(ent), 10)&&coolTime.missile==0 ){
					actCheck=missile;
					Entity.setRenderType(ent, holdArmRender.renderType);
					Entity.setMobSkin(ent, "mob/char.png" );
					stopYaw= getAngleToPlayer(ent).yaw;
				}else if( isClose2D(Player.getX(), Player.getZ(), Entity.getX(ent), Entity.getZ(ent), 7)&&coolTime.gatling==0 ){
					actCheck=gatling;
					stopYaw= getAngleToPlayer(ent).yaw;
				}else if( isClose2D(Player.getX(), Player.getZ(), Entity.getX(ent), Entity.getZ(ent), 7)&&coolTime.mMissile==0 ){
					actCheck=mMissile;
					stopYaw= getAngleToPlayer(ent).yaw;
				}else if( isClose2D(Player.getX(), Player.getZ(), Entity.getX(ent), Entity.getZ(ent), 10)&&coolTime.laser==0 ){
					actCheck=laser;
					stopYaw=Entity.getYaw(ent);
				}else if(!(isClose2D(Player.getX(), Player.getZ(), Entity.getX(ent), Entity.getZ(ent), 15))){
					newYaw= getAngleToPlayer(ent).yaw;
					actCheck=move;
				}else{
					newYaw=Math.random()*360;
					actCheck=move;
				}
			}else if(actCheck==move){
				sin=-Math.sin(newYaw/180*Math.PI);
				cos=Math.cos(newYaw/180*Math.PI);
				if((Level.getTile(pos.x+sin, pos.y+0.1, pos.z+cos)!=0|| Level.getTile(pos.x+sin*2, pos.y+0.1, pos.z+cos*2)!=0 || Level.getTile(pos.x+sin*3, pos.y+0.1, pos.z+cos*3)!=0 )||moveCount>80 ){
					actCheck=none;
					moveCount=0;
					Level.addParticle (ParticleType.cloud, pos.x, pos.y+0.2 , pos.z , 0, 0, 0, 5);
				}else{
					newAngle=getAngleToPlayer(ent);
					pos.x+=sin*0.12;
					pos.z+=cos*0.12;
					dist=getDist2D(Player.getX (), Player.getZ(), Entity.getX(ent),  Entity.getZ(ent) );
					setVelEnt(ent, (Entity.getX(Player.getEntity())- Entity.getX(ent))/(dist)*0.5 , 0, (Entity.getZ(Player.getEntity())- Entity.getZ(ent))/(dist)*0.5);
					Entity.setPosition(ent, pos.x, pos.y, pos.z);
					Entity.setRot(ent, newAngle.yaw, 0);
					moveCount++;
					if( isClose2D(Player.getX(), Player.getZ(), Entity.getX(ent), Entity.getZ(ent), 3)&&coolTime.wave==0 ){
						actCheck=wave;
						moveCount=0;
						coolTime.wave=maxCoolTime.wave;
					}
				}
			}else if(actCheck==wave){
				if(skillCount==0){
					setVelEnt(Player.getEntity(), (Player.getX()-Entity.getX(ent))/ getDist2D(Player.getX(), Player.getZ(), Entity.getX(ent),  Entity.getZ(ent) )*2 *(1+0.5*bossState) , 0, (Player.getZ()-Entity.getZ(ent))/ getDist2D(Player.getX(), Player.getZ(), Entity.getX(ent),  Entity.getZ(ent) )*2 *(1+0.5*bossState) );
					playerHurt(3);
				}
				skillCount++;
				if(skillCount>12){
					skillCount=0;
					actCheck=none;
				}else if(skillCount%3==0){
					for(var i=0;i<30;i++){
						sin=-Math.sin(i*12/180*Math.PI);
						cos=Math.cos(i*12/180*Math.PI);
						Level.addParticle (ParticleType.crit, pos.x+sin*skillCount/3, pos.y+1 , pos.z+cos*skillCount/3 , sin*2, 0.1, cos*2, 3);
					}
				}
			}else if(actCheck==laser){
				sin=-Math.sin(stopYaw/180*Math.PI);
				cos=Math.cos(stopYaw/180*Math.PI);
				setVelEnt(ent, cos*0.1 , 0, sin*0.1);
				Entity.setPosition(ent, pos.x, pos.y, pos.z);
				Entity.setRot(ent, stopYaw, 0);
				if(renderIndex<30){
					Entity.setRenderType(ent, laserRender[renderIndex].renderType);
					java.lang.Thread.sleep(20);
					renderIndex++;
				}else if(renderIndex<60){
					Entity.setRenderType(ent, laserRender[renderIndex].renderType);
					java.lang.Thread.sleep(20);
					renderIndex++;
				}else if(renderIndex<80){
					Entity.setRenderType(ent, laserRender[renderIndex].renderType);
					java.lang.Thread.sleep(25);
					renderIndex++;
				}else if(renderIndex<90){
					Entity.setRenderType(ent, laserRender[renderIndex].renderType);
					java.lang.Thread.sleep(25);
					renderIndex++;
					if(renderIndex==90&&skillCount<3){
						renderIndex=80;
						skillCount++;
					}
				}else if(renderIndex==90){
					Entity.setRenderType(ent, laserRender[renderIndex].renderType);
					skillCount++;
					if(Math.abs ((getAngleToPlayer(ent).yaw%360) -(stopYaw%360))<7){
						playerHurt(2);
					}
					stopYaw+=3;
					if(skillCount>100){
						skillCount=0;
						renderIndex++;
					}
				}else if(renderIndex==91){
					if(Math.abs ((getAngleToPlayer(ent).yaw%360) -(stopYaw%360))<13){
						playerHurt(3);
					}
					newYaw= getAngleToPlayer(ent).yaw;
					if((stopYaw)> newYaw){
						if((stopYaw-newYaw)<180){
							stopYaw-=2;
						}else{
							stopYaw+=2;
						}
					}else{
						if((newYaw-stopYaw)<180){
							stopYaw+=2;
						}else{
							stopYaw-=2;
						}
					}
					Entity.setRenderType(ent, laserRender[renderIndex].renderType);
					skillCount++;
					if(skillCount>100){
						skillCount=0;
						renderIndex=0;
						coolTime.laser=maxCoolTime.laser;
						actCheck=none;
						Entity.setRenderType(ent, 3);
						Entity.setMobSkin(ent, "mob/char.png" );
					}
				}
			}else if(actCheck==missile){
				skillCount++;
				Entity.setPosition(ent, pos.x, pos.y, pos.z);
				sin=-Math.sin(stopYaw/180*Math.PI);
				cos=Math.cos(stopYaw/180*Math.PI);
				setVelEnt(ent, cos*0.1 , 0, sin*0.1);
				if(skillCount>40){
					for(var i=-1*(bossState+1) ;i<=(bossState+1);i++){
					sin=-Math.sin ((stopYaw+i*20)/180*Math.PI);
					cos=Math.cos ((stopYaw+i*20)/180*Math.PI);
					newEnt =Level.spawnMob(pos.x+sin, pos.y, pos.z+cos, 11);
					Entity.setRenderType(newEnt, missileRender.renderType);
					Entity.setMobSkin(newEnt, "mob/char.png" );
					shotMissile(newEnt, stopYaw+i*30, 0.5);
					}
					skillCount=0;
					coolTime.missile=maxCoolTime.missile;
					actCheck=none;
					Entity.setRenderType(ent, 3);
					Entity.setMobSkin(ent, "mob/char.png" );
				}
			}else if(actCheck==mMissile){
				renderIndex++;
				Entity.setPosition(ent, pos.x, pos.y, pos.z);
				sin=-Math.sin(stopYaw/180*Math.PI);
				cos=Math.cos(stopYaw/180*Math.PI);
				setVelEnt(ent, cos*0.1 , 0, sin*0.1);
				Entity.setRot(ent, stopYaw, 0);
				if(renderIndex<30){
					Entity.setRenderType(ent, mGunRender[renderIndex].renderType);
					java.lang.Thread.sleep(25);
				}else if(renderIndex==70){
					for(var i=-1*(bossState+2) ;i<=(bossState+2);i++){
					sin=-Math.sin ((stopYaw+i*20)/180*Math.PI);
					cos=Math.cos ((stopYaw+i*20)/180*Math.PI);
					newEnt =Level.spawnMob(pos.x+sin, pos.y, pos.z+cos, 11);
					Entity.setRenderType(newEnt, missileRender.renderType);
					Entity.setMobSkin(newEnt, "mob/char.png" );
					shotMissile(newEnt, stopYaw+i*30, 0.5);
					}
				}else if(renderIndex==(100-bossState*5) &&skillCount<(2+bossState)){
					renderIndex=69;
					skillCount++;
					stopYaw=getAngleToPlayer(ent).yaw;
				}else if(skillCount==(2+bossState)){
					renderIndex=0;
					skillCount=0;
					coolTime.mMissile =maxCoolTime.mMissile;
					actCheck=none;
					Entity.setRenderType(ent, 3);
					Entity.setMobSkin(ent, "mob/char.png" );
				}
			}else if(actCheck==gatling){
				Entity.setPosition(ent, pos.x, pos.y, pos.z);
				sin=-Math.sin(stopYaw/180*Math.PI);
				cos=Math.cos(stopYaw/180*Math.PI);
				setVelEnt(ent, cos*0.1 , 0, sin*0.1);
				Entity.setRot(ent, stopYaw, 0);
				if(renderIndex<30){
					Entity.setRenderType(ent, gatlingRender[renderIndex].renderType);
					renderIndex++;
					java.lang.Thread.sleep(25);
				}else if(renderIndex<35){
					Entity.setRenderType(ent, gatlingRender[renderIndex].renderType);
					for(var i=-1*bossState;i<bossState+1 ;i++){
						shotBullet(pos.x, pos.y, pos.z, stopYaw+i*10, 2+2*(renderIndex-30));
						shotBullet(pos.x, pos.y, pos.z, stopYaw+i*10, 2+2*(renderIndex-30+1));
					}
					renderIndex++;
					java.lang.Thread.sleep(25);
					if(renderIndex==35&&skillCount<20){
						renderIndex=30;
						skillCount++;
						newYaw= getAngleToPlayer(ent).yaw;
						if((stopYaw)> newYaw){
							if((stopYaw-newYaw)<180){
								stopYaw-=((stopYaw)- (newYaw))/(8-bossState)*1.4;
							}else{
								stopYaw-=((stopYaw-360)- (newYaw))/(8-bossState)*1.4;
							}
						}else{
							if((newYaw-stopYaw)<180){
								stopYaw-=((stopYaw)- (newYaw))/(8-bossState)*1.4;
							}else{
								stopYaw-=((stopYaw)- (newYaw-360))/(8-bossState)*1.4;
							}
						}
					}else if(skillCount==20){
						skillCount=0;
						renderIndex=0;
						coolTime.gatling =maxCoolTime.gatling;
						actCheck=none;
						Entity.setRenderType(ent, 3);
						Entity.setMobSkin(ent, "mob/char.png" );
					}
				}
			}else if(actCheck==bomb){
				dropBomb(Math.random()*25+1, Player.getY()-1.62, Math.random()*25+1, 0.8, 40+Math.floor(Math.random()*40));
				//dropBomb(Player.getX(), Player.getY()-1.62, Player.getZ(), 0.8, 60);
				if(bossState==3){
					dropBomb(Math.random()*25+1, Player.getY()-1.62, Math.random()*25+1, 0.8, 40 +Math.floor(Math.random()*40) );
				}
				coolTime.bomb =maxCoolTime.bomb;
				actCheck=none;
			}
			if(coolTime.wave>0){
				coolTime.wave--;
			}
			if(coolTime.laser>0){
				coolTime.laser--;
			}
			if(coolTime.missile>0){
				coolTime.missile--;
			}
			if(coolTime.mMissile>0){
				coolTime.mMissile--;
			}
			if(coolTime.gatling>0){
				coolTime.gatling--;
			}
			if(coolTime.bomb>0){
				coolTime.bomb--;
			}
			java.lang.Thread.sleep(25);
		}
	}catch(e){
		cme(e);
	}
	}})).start();
}
//렌더링 만들기 함수
function rendering(){
	new java.lang.Thread(new java.lang.Runnable({run: function(){
		try{
		if(!(isLoading)){
			isLoading=true;
			Entity.setHealth(Player.getEntity(), maxHp);
			hp= Entity.getHealth(Player.getEntity());
			hpGUI();
			var sin, cos;
			var body, head, rightArm, leftArm, rightLeg, leftLeg;
			var num=0;
		//////////
		holdArmRender= Renderer.createHumanoidRenderer();
		holdArm(holdArmRender);
		//////////
		for(var i=0;i<100;i++){
			laserRender[i]= Renderer.createHumanoidRenderer();
			holdArm(laserRender[i]);
		}
		for( var i=0;i<100;i++ ){
			body = laserRender[i] .getModel().getPart("body");
			for( var j=0;j<24;j++ ){
				sin=Math.sin(15*j/180*Math.PI);
				cos=Math.cos(15*j/180*Math.PI);
				body.setTextureOffset (43, 19);
				for(var n=0;n<=i;n++){
					if(n>=30){
						break;
					}
					body.addBox (-6+cos*num/10, 2+sin*num/10, -11-n, 1, 1, 1);
					if(n<5){
						num+=(12-n*2);
					}else if(n<30){
						num+=0.2;
					}
				}
				num=0;
				if(i<30){
					for( var k=1;k<=30;k++ ){
						if(i+k<30&&j%4==0){
							sin=Math.sin ((15*j+5*k)/180*Math.PI);
							cos=Math.cos ((15*j+5*k)/180*Math.PI);
							body.addBox (-6+cos*(i+k+2)/10+cos*(0.2+k*0.05*(i/30-Math.floor(i/30)))*k, 2+sin*(i+k+2)/10+sin*(0.2+k*0.05*(i/30 -Math.floor(i/30)+1))*k, -11-i-7 *(0.2+k*0.25*(i/30-Math.floor(i/30))) , 1, 1, 1);
						}
					}
				}
			}
			body.setTextureOffset (43, 19);
			if(i<60&&i>=30){
				for(var n=0;n<i-30;n++){
					body.addBox (-7+5+0.75*n, 2, -11-(n+7), 2, 2, 2);
					body.addBox (-6-5-0.75*n, 2, -11-(n+7), 2, 2, 2);
				}
			}else if(i<80 &&i>=60 ){
				for(var n=0;n<10;n++){
					body.addBox (-7+5+0.75*n, 2, -11-(n+7), 2, 2, 2);
					body.addBox (-6-5-0.75*n, 2, -11-(n+7), 2, 2, 2);
				}
				for(var n=10;n<29;n++){
					body.addBox (-7+5+(0.75-0.03*(i-60)*(n-8)/24)*n, 2, -11-(n+7), 2, 2, 2);
					body.addBox (-6-5-(0.75-0.03*(i-60)*(n-8)/24)*n, 2, -11-(n+7), 2, 2, 2);
				}
			}else if(i<90 &&i>=80 ){
				for(var n=0;n<10;n++){
					body.addBox (-7+5+0.75*n, 2, -11-(n+7), 2, 2, 2);
					body.addBox (-6-5-0.75*n, 2, -11-(n+7), 2, 2, 2);
				}
				for(var n=10;n<29;n++){
					body.addBox (-7+5+(0.75-0.03*(20)*(n-8)/24)*n, 2, -11-(n+7), 2, 2, 2);
					body.addBox (-6-5-(0.75-0.03*(20)*(n-8)/24)*n, 2, -11-(n+7), 2, 2, 2);
				}
				for(var n=0;n<9;n++){
					body.addBox (-7+5+(0.75-0.03*(20)*(15)/24)*23-n, 2.5, -11-29, 1, 1, 3);
					body.addBox (-6-5-(0.75-0.03*(20)*(15)/24)*23+n, 2.5, -11-29, 1, 1, 3);
				}
				for(var n=0;n<(90-i);n++){
					for(var l=0;l<4;l++){
						sin=Math.sin ((l*90+n*10+(i-80)*5)/180*Math.PI);
						cos=Math.cos ((l*90+n*10+(i-80)*5)/180*Math.PI);
						body.addBox (-6+cos*(n+1)*5, 2+sin*(n+1)*5, -11-32, 1, 1, 1);
					}
				}
			}else if(i==90){
				for(var n=0;n<10;n++){
					body.addBox (-7+5+0.75*n, 2, -11-(n+7), 2, 2, 2);
					body.addBox (-6-5-0.75*n, 2, -11-(n+7), 2, 2, 2);
				}
				for(var n=10;n<29;n++){
					body.addBox (-7+5+(0.75-0.03*(20)*(n-8)/24)*n, 2, -11-(n+7), 2, 2, 2);
					body.addBox (-6-5-(0.75-0.03*(20)*(n-8)/24)*n, 2, -11-(n+7), 2, 2, 2);
				}
				for(var n=0;n<9;n++){
					body.addBox (-7+5+(0.75-0.03*(20)*(15)/24)*23-n, 2.5, -11-29, 1, 1, 3);
					body.addBox (-6-5-(0.75-0.03*(20)*(15)/24)*23+n, 2.5, -11-29, 1, 1, 3);
				}
				for(var n=0;n<30;n++){
					body.setTextureOffset (100, 0);
					body.addBox (-6, 2, -11-35-8*n, 1, 1, 8);
				}
			}else if(i==91){
				for(var n=0;n<10;n++){
					body.addBox (-7+5+0.75*n, 2, -11-(n+7), 2, 2, 2);
					body.addBox (-6-5-0.75*n, 2, -11-(n+7), 2, 2, 2);
				}
				for(var n=10;n<29;n++){
					body.addBox (-7+5+(0.75-0.03*(20)*(n-8)/24)*n, 2, -11-(n+7), 2, 2, 2);
					body.addBox (-6-5-(0.75-0.03*(20)*(n-8)/24)*n, 2, -11-(n+7), 2, 2, 2);
				}
				for(var n=0;n<9;n++){
					body.addBox (-7+5+(0.75-0.03*(20)*(15)/24)*23-n, 2.5, -11-29, 1, 1, 3);
					body.addBox (-6-5-(0.75-0.03*(20)*(15)/24)*23+n, 2.5, -11-29, 1, 1, 3);
				}
				for(var n=0;n<30;n++){
					body.setTextureOffset (100, 0);
					body.addBox (-6-4, 2-4, -11-43-8*n, 8, 8, 8);
				}
			}
		}
		/////////
		for(var i=0;i<100;i++){
			gatlingRender[i]= Renderer.createHumanoidRenderer();
			holdArm(gatlingRender[i]);
		}
		num=0;
		for( var i=0;i<100;i++ ){
			body = gatlingRender[i] .getModel().getPart("body");
			for( var j=0;j<30;j++ ){
				sin=Math.sin(15*j/180*Math.PI);
				cos=Math.cos(15*j/180*Math.PI);
				body.setTextureOffset (43, 19);
				for(var n=0;n<=i;n++){
					if(n>=30){
						break;
					}
					if(j%5==0){
						body.addBox (-6+cos*num/15, 2+sin*num/15, -11-n, 1, 1, 1);
					}
					if( n==23|| n==24||n==25|| n==9||n==10 ){
						body.addBox (-6+cos*num/12, 2+sin*num/12, -11-n, 1, 1, 1);
					}
					if(n<5){
						num+=(12-n*2);
					}else if(n<30){
						num+=0.2;
					}
				}
				num=0;
				if(i<30){
					for( var k=1;k<=30;k++ ){
						if(i+k<30&&j%4==0){
							sin=Math.sin ((15*j+5*k)/180*Math.PI);
							cos=Math.cos ((15*j+5*k)/180*Math.PI);
							body.addBox (-6+cos*(i+k+2)/15+cos*(0.2+k*0.05*(i/30-Math.floor(i/30)))*k, 2+sin*(i+k+2)/15+sin*(0.2+k*0.05*(i/30 -Math.floor(i/30)+1))*k, -11-i-7 *(0.2+k*0.25*(i/30-Math.floor(i/30))) , 1, 1, 1);
						}
					}
				}else if(i<35){
					for( var j=0;j<30;j++ ){
						sin=Math.sin(15*j/180*Math.PI);
						cos=Math.cos(15*j/180*Math.PI);
						for(var n=0;n<30;n++){
							if(j%5==(i-30)){
								body.setTextureOffset (43, 19);
								body.addBox (-6+cos*num/15, 2+sin*num/15, -11-n, 1, 1, 1);
							}
							if( n==23|| n==24||n==25|| n==9||n==10 ){
								body.setTextureOffset (100, 0);
								body.addBox (-6+cos*num/12, 2+sin*num/12, -11-n, 1, 1, 1);
							}
							if(n<5){
								num+=(12-n*2);
							}else if(n<30){
								num+=0.2;
							}
						}
						num=0;
					}
				}
			}
		}
		//////////
		missileRender= Renderer.createHumanoidRenderer();
		leftArm = missileRender .getModel().getPart("leftArm");
		leftArm.clear();
		rightArm = missileRender .getModel().getPart("rightArm");
		rightArm.clear();
		leftLeg = missileRender .getModel().getPart("leftLeg");
		leftLeg.clear();
		rightLeg = missileRender .getModel().getPart("rightLeg");
		rightLeg.clear();
		head = missileRender .getModel().getPart("head");
		head.clear();
		body = missileRender .getModel().getPart("body");
		body.clear();
		num=15;
		for(var i=0;i<10;i++){
			for(var j=0;j<18;j++){
				sin=Math.sin(20*j/180*Math.PI);
				cos=Math.cos(20*j/180*Math.PI);
				body.setTextureOffset (100, 0);
				body.addBox (0+cos*num/5, 0+sin*num/5, 0-i, 1, 1, 1);
			}
			if(i>=5){
				num-=(i-4);
			}
		}
		//////////
		for(var i=0;i<100;i++){
			mGunRender[i]= Renderer.createHumanoidRenderer();
			holdArm(mGunRender[i]);
		}
		num=0;
		for( var i=0;i<100;i++ ){
			body = mGunRender[i] .getModel().getPart("body");
			for( var j=0;j<90;j++ ){
				sin=Math.sin(4*j/180*Math.PI);
				cos=Math.cos(4*j/180*Math.PI);
				body.setTextureOffset (43, 19);
				for(var n=0;n<=i;n++){
					if(n>=20){
						break;
					}
					if((Math.floor(j/9)%6)%2==0){
						body.addBox (-6+cos*num/15, 2+sin*num/15, -11-n, 1, 1, 1);
					}
					if(n<5){
						num+=(12-n*2);
					}
				}
				num=0;
				if(i<20){
					for( var k=1;k<=30;k++ ){
						if(i+k<20&&j%4==0){
							sin=Math.sin ((15*j+5*k)/180*Math.PI);
							cos=Math.cos ((15*j+5*k)/180*Math.PI);
							body.addBox (-6+cos*(i+k+2)/15+cos*(0.2+k*0.05*(i/20-Math.floor(i/20)))*k, 2+sin*(i+k+2)/15+sin*(0.2+k*0.05*(i/20 -Math.floor(i/20)+1))*k, -11-i-7 *(0.2+k*0.25*(i/20-Math.floor(i/20))) , 1, 1, 1);
						}
					}
				}else if(i<30){
					for(var n=0;n<20;n++){
						if((Math.floor(j/9)%6)%2==0){
							body.addBox (-6+cos*num/15, 2+sin*num/15, -11-n, 1, 1, 1);
						}
						if(n<5){
							num+=(12-n*2);
						}else{
							num+=7*(i-20)/10;
						}
					}
				}
				num=0;
			}
		}
		//////////
		swordRender= Renderer.createHumanoidRenderer();
		leftArm = swordRender .getModel().getPart("leftArm");
		leftArm.clear();
		rightArm = swordRender .getModel().getPart("rightArm");
		rightArm.clear();
		leftLeg = swordRender .getModel().getPart("leftLeg");
		leftLeg.clear();
		rightLeg = swordRender .getModel().getPart("rightLeg");
		rightLeg.clear();
		head = swordRender .getModel().getPart("head");
		head.clear();
		body = swordRender .getModel().getPart("body");
		body.clear();
		num=10;
		for(var i=0;i<20;i++){
			for(var j=0;j<num;j++){
				body.setTextureOffset (100, 0);
				body.addBox (0-num/4+j*0.5, -10*-1+i*1, 0-i*0.5, 1, 1, 1);
			}
			if(i>=0){
				num-=0.5;
			}
		}
		for( var i=0;i<6;i++ ){
			for( var j=0;j<2;j++ ){
				body.setTextureOffset (100, 0);
				body.addBox (0-1+j, 10-i, i*0.5, 1, 1, 1);
			}
		}
		//////////
		bombRender= Renderer.createHumanoidRenderer();
		leftArm = bombRender .getModel().getPart("leftArm");
		leftArm.clear();
		rightArm = bombRender .getModel().getPart("rightArm");
		rightArm.clear();
		leftLeg = bombRender .getModel().getPart("leftLeg");
		leftLeg.clear();
		rightLeg = bombRender .getModel().getPart("rightLeg");
		rightLeg.clear();
		head = bombRender .getModel().getPart("head");
		head.clear();
		body = bombRender .getModel().getPart("body");
		body.clear();
		num=15;
		for(var i=0;i<40;i++){
			for(var j=0;j<18;j++){
				sin=Math.sin(20*j/180*Math.PI);
				cos=Math.cos(20*j/180*Math.PI);
				body.setTextureOffset (100, 0);
				body.addBox (0+cos*num/5, -20+i, 0+sin*num/5, 1, 1, 1);
			}
			if(i>=35){
				num-=(i-34);
			}
		}
		for(var i=0;i<8;i++){
			for(var j=i;j<8;j++){
				sin=Math.sin(90/180*Math.PI);
				cos=Math.cos(90/180*Math.PI);
				body.setTextureOffset (100, 0);
				body.addBox (0+cos*15/5, -18+i, 0+sin*15/5+8-j, 1, 1, 1);
				sin=Math.sin(180/180*Math.PI);
				cos=Math.cos(180/180*Math.PI);
				body.setTextureOffset (100, 0);
				body.addBox (0+cos*15/5-8+j, -18+i, 0+sin*15/5, 1, 1, 1);
				sin=Math.sin(270/180*Math.PI);
				cos=Math.cos(270/180*Math.PI);
				body.setTextureOffset (100, 0);
				body.addBox (0+cos*15/5, -18+i, 0+sin*15/5-8+j, 1, 1, 1);
				sin=Math.sin(360/180*Math.PI);
				cos=Math.cos(360/180*Math.PI);
				body.setTextureOffset (100, 0);
				body.addBox (0+cos*15/5+8-j, -18+i, 0+sin*15/5, 1, 1, 1);
			}
		}
		//////////
			cm("로딩 완료 !");
			for(var i=0;i<swordEntAry.length;i++){
				Entity.remove(swordEntAry[i]);
			}
			swordEntAry=[];
			var ent=Level.spawnMob(13, 1, 13, 11);
			Entity.setRenderType(ent, 3);
			Entity.setMobSkin(ent, "mob/char.png" );
			Entity.setNameTag(ent, "BOSS");
			Entity.setHealth(ent, bossMaxHp);
			bossSpawn=true;
			bossHp=bossMaxHp;
			bossState=0;
			if(bossEnt==null){
				bossPattern(ent);
			}
			bossEnt=ent;
			bossHpGUI();
			cm("로봇 보스가 등장하였습니다.");
		}else{
			cm("이미 로딩이 완료된 상태이므로 잠시 후 바로 시작합니다.");
			for(var i=0;i<swordEntAry.length;i++){
				Entity.remove(swordEntAry[i]);
			}
			swordEntAry=[];
			Entity.setHealth(Player.getEntity(), maxHp);
			hp= Entity.getHealth(Player.getEntity());
			hpGUI();
			java.lang.Thread.sleep(5000);
			var ent=Level.spawnMob(13, 1, 13, 11);
			Entity.setRenderType(ent, 3);
			Entity.setMobSkin(ent, "mob/char.png" );
			Entity.setNameTag(ent, "BOSS");
			Entity.setHealth(ent, bossMaxHp);
			bossHp=bossMaxHp;
			bossSpawn=true;
			bossState=0;
			bossPattern(ent);
			bossEnt=ent;
			bossHpGUI();
			cm("로봇 보스가 등장하였습니다.");
		}
		}catch(e){
			cme(e);
		}
	}})).start();	
}
//렌더링 변경 함수
function changeRender(){
	new java.lang.Thread(new java.lang.Runnable({run: function(){
		try{
		while(true){
			renderIndex++;
			if(renderIndex==30){
				renderIndex=0;
				//Entity.setRenderType (Player.getEntity(), laserRender[79].renderType);
				java.lang.Thread.sleep(2000);
			}else if( renderIndex==30 ){
				java.lang.Thread.sleep(200);
			}else if( renderIndex==60 ){
				java.lang.Thread.sleep(200);
			}else if( renderIndex==91 ){
				java.lang.Thread.sleep(2000);
			}
			if( renderIndex>30 ){
				java.lang.Thread.sleep(20);
			}
			Entity.setRenderType(Player.getEntity(), mGunRender[renderIndex].renderType);
			java.lang.Thread.sleep(50);
		}
		}catch(e){
			cme(e);
		}
	}})).start();
}
//팔 들기 렌더링
function holdArm(render){	
	var rightArm=render .getModel().getPart("rightArm");
	rightArm.clear();
	var body = render .getModel().getPart("body");
	for(var i=0;i<4;i++){
		for(var j=0;j<12;j++){
			body.setTextureOffset (43-i,19+j);
			body.addBox(-8, 0+i, 1-j, 0, 1, 1);
			body.setTextureOffset (44+i,20+j);
			body.addBox(-8+i, 0, 1-j, 1, 0, 1);
			body.setTextureOffset (48+i,19+j);
			body.addBox(-4, 0+i, 1-j, 0, 1, 1);
			body.setTextureOffset (53-i,20+j);
			body.addBox(-8+i, 4, 1-j, 1, 0, 1);
		}
	}
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			body.setTextureOffset (43+i,19-j);
			body.addBox(-8+i, 0+j, 2, 1, 1, 0);
			body.setTextureOffset (48+i,16+j);
			body.addBox(-8+i, 0+j, -10, 1, 1, 0);
		}
	}
}
//미사일 발사 함수
function shotMissile(ent, yaw, vel){
	new java.lang.Thread(new java.lang.Runnable({run: function(){
	try{
		var sin, cos;
		var pos={x:Entity.getX(ent), y: Entity.getY(ent) , z: Entity.getZ(ent) };
		sin=-Math.sin(yaw/180*Math.PI);
		cos=Math.cos(yaw/180*Math.PI);
		while(true){
			if(Level.getTile(pos.x+sin*vel, pos.y+0.1, pos.z+cos*vel)!=0){
				Entity.remove(ent);
				break;
			}
			pos.x+=sin*vel;
			pos.z+=cos*vel;
			Entity.setPosition(ent, pos.x, pos.y, pos.z);
			setVelEnt(ent, sin*0.1, 0, cos*0.1);
			Entity.setRot(ent, yaw, 0);
			if( isClose2D(Player.getX(), Player.getZ(), Entity.getX(ent), Entity.getZ(ent), 1) ){
				setVelEnt(Player.getEntity(), (Player.getX()-pos.x)*2, 0, (Player.getZ()-pos.z)*2);
				Entity.remove(ent);
				playerHurt(10);
				break;
			}
			java.lang.Thread.sleep(50);
		}
	catch(e){
		cme(e);
	}
	}})).start();
}
//총 발사 함수
function shotBullet(entX, entY, entZ, yaw, dist){
	try{
	var sin, cos;
	sin=-Math.sin(yaw/180*Math.PI);
	cos=Math.cos(yaw/180*Math.PI);
	Level.addParticle (ParticleType.cloud, entX+sin*dist, entY , entZ+cos*dist, 0, 0.05, 0, 3);
	Level.addParticle (ParticleType.smoke, entX+sin*dist, entY , entZ+cos*dist, 0, 0.1, 0, 0);
	if( isClose2D(Player.getX(), Player.getZ(), entX+sin*dist, entZ+cos*dist , 1) ){
		playerHurt(1);
	}
	catch(e){
		cme(e);
	}
}
//폭탄 투하 함수
function dropBomb(xCoord, yCoord, zCoord, vel, delay){
	new java.lang.Thread(new java.lang.Runnable({run: function(){
	try{
		var ent=Level.spawnMob(xCoord+0.5, yCoord+1, zCoord+0.5, 11);
		Entity.setRenderType(ent, bombRender.renderType);
		var count=0;
		var pos={x:xCoord, y: yCoord+10 , z: zCoord };
		while(count<delay){
			count++;
			Entity.setPosition(ent, pos.x, pos.y, pos.z);
			setVelEnt(ent, 0, 0, 0.05);
			Entity.setRot(ent, 0, 0);
			if((count%5)==0&&count<=(delay-20)){
				Level.addParticle (ParticleType.redstone, xCoord, yCoord+0.2, zCoord, 0, 0, 0, 5);
				Level.addParticle (ParticleType.redstone, xCoord+1, yCoord+0.2, zCoord+1, 0, 0, 0, 5);
				Level.addParticle (ParticleType.redstone, xCoord+1, yCoord+0.2, zCoord-1, 0, 0, 0, 5);
				Level.addParticle (ParticleType.redstone, xCoord-1, yCoord+0.2, zCoord+1, 0, 0, 0, 5);
				Level.addParticle (ParticleType.redstone, xCoord-1, yCoord+0.2, zCoord-1, 0, 0, 0, 5);
			}
			java.lang.Thread.sleep(50);
		}
		while( Level.getTile(pos.x, pos.y+1, pos.z)==0){
			pos.y-=vel;
			Entity.setPosition(ent, pos.x, pos.y, pos.z);
			Entity.setRot(ent, 0, 0);
			setVelEnt(ent, 0, 0, 0.2);
			java.lang.Thread.sleep(50);
		}
		if( isClose2D(Player.getX(), Player.getZ(), Entity.getX(ent), Entity.getZ(ent), 5) ){
			playerHurt(25);
			setVelEnt(Player.getEntity(), 0, 0, 0);
		}
		Entity.remove(ent);		
		pos.y++;
		var sin, cos;
		for(var i=0;i<5;i++){
			for(var j=0;j<20;j++){
				sin=-Math.sin(j*18/180*Math.PI);
				cos=Math.cos(j*18/180*Math.PI);
				Level.addParticle (ParticleType.crit, pos.x+sin*i, pos.y+1 , pos.z+cos*i , sin*2, 0.1, cos*2, 3);
			}
			java.lang.Thread.sleep(50);
		}
	catch(e){
		cme(e);
	}
	}})).start();
}
//날아다니는 칼 패턴 함수
function flyingSword(ent, height){
	new java.lang.Thread(new java.lang.Runnable({run: function(){
	try{
		var swordCoolTime=400;
		var swordMaxCoolTime=200;
		var pos={x:Entity.getX(ent), y: Entity.getY(ent) , z: Entity.getZ(ent) };
		var sin, cos, yaw;
		var chaseCoord={x:0, y:0, z:0};
		var count=100;
		var skillCount=0;
		while(isDungeon){
			if(swordCoolTime!=-1){
				if(count<100){
					count++;
				}			
				if(count==100||Level.getTile (pos.x+chaseCoord.x, pos.y, pos.z+chaseCoord.z)!=0){
					if( isClose2D(Player.getX(), Player.getZ(), Entity.getX(ent), Entity.getZ(ent), 5) &&swordCoolTime==0){
						swordCoolTime=-1;
						chaseCoord.x=(Player.getX()-pos.x)/(getDist3D(Player.getX(), Player.getY()-1.6, Player.getZ(), pos.x, pos.y, pos.z)*1);
						chaseCoord.y=(Player.getY()-pos.y)/(getDist3D(Player.getX(), Player.getY()-1.6, Player.getZ(), pos.x, pos.y, pos.z)*1);
						chaseCoord.z=(Player.getZ()-pos.z)/(getDist3D(Player.getX(), Player.getY()-1.6, Player.getZ(), pos.x, pos.y, pos.z)*1);
					}else{
						chaseCoord.x=(Player.getX()-pos.x+Math.random()*6-3)/(getDist2D(Player.getX(), Player.getZ(), pos.x, pos.z)*15+Math.random()*6-3);
						chaseCoord.z=(Player.getZ()-pos.z)/(getDist2D(Player.getX(), Player.getZ(), pos.x, pos.z)*15);
					}
					count=0;
				}
				pos.x+=chaseCoord.x;
				pos.z+=chaseCoord.z;
			}else{
				if(count<height*10){
					count++;
					if(count%10==0){
						Level.addParticle (ParticleType.cloud, pos.x, pos.y , pos.z , 0, -0.1, 0, 5);
					}
				}else if(count>=height*10 &&count<height*10*2){
					if(Level.getTile(pos.x, pos.y, pos.z)==0){
						pos.x+=chaseCoord.x;
						pos.y+=chaseCoord.y;
						pos.z+=chaseCoord.z;
						skillCount++;
					}else{
						if(count==height*10){
							for(var i=0;i<20;i++){
								sin=-Math.sin(i*18/180*Math.PI);
								cos=Math.cos(i*18/180*Math.PI);
								Level.addParticle (ParticleType.crit, pos.x+sin, pos.y+1 , pos.z+cos , sin, 0.1, cos, 3);
							}
							if( isClose2D(Player.getX(), Player.getZ(), Entity.getX(ent), Entity.getZ(ent), 4) ){
								playerHurt(15);
								setVelEnt(Player.getEntity(), 0, 0, 0);
							}
						}
						count++;
					}
				}else if(count==height*10*2 &&skillCount>0){
					skillCount--;
					pos.x-=chaseCoord.x;
					pos.y-=chaseCoord.y;
					pos.z-=chaseCoord.z;
				}else if( count==height*10*2 &&skillCount==0 ){
					count=100;
					swordCoolTime=swordMaxCoolTime;
				}
			}
			if(swordCoolTime>0){
				swordCoolTime--;
			}
			yaw=getAngleToPlayer(ent).yaw;
			sin=-Math.sin(yaw/180*Math.PI);
			cos=Math.cos(yaw/180*Math.PI);
			Entity.setPosition(ent, pos.x, pos.y, pos.z);
			setVelEnt(ent, sin*0.1, 0, cos*0.1);
			Entity.setRot(ent, yaw, 0);
			java.lang.Thread.sleep(25);
		}
		Entity.remove(ent);
	catch(e){
		cme(e);
	}
	}})).start();
}
//setVel축약
function setVelEnt(ent, xAmount, yAmount, zAmount){
	Entity.setVelX(ent, xAmount);
	Entity.setVelY(ent, yAmount);
	Entity.setVelZ(ent, zAmount);
}
//엔티티가 보는 각도 구하기
function getAngleAToB(ent1, ent2){
		var diffX=Entity.getX(ent1)- Entity.getX(ent2);
		var diffY=Entity.getY(ent1)- Entity.getY(ent2);
		var diffZ=Entity.getZ(ent1)- Entity.getZ(ent2);
		var diffXZ=Math.sqrt (diffX*diffX+ diffZ*diffZ );
		var newYaw= -1*(Math.atan2(diffX, diffZ)/Math.PI*180);
		var newPitch= -1*(Math.atan(diffY/ diffXZ)/Math.PI*180);
		if(newYaw<0){
			newYaw+=360;
		}
		var newAngle={yaw:newYaw, pitch:newPitch};
		return newAngle;
}
function getAngleToPlayer(ent1){
	var newAngle={yaw:0, pitch:0};
	newAngle=getAngleAToB (Player.getEntity(), ent1);
	return newAngle;
}
//플레이어 체력 감소 함수
function playerHurt(amount){
	 if( ((Entity.getHealth(Player.getEntity())-amount)<=0 )&&bossSpawn ){
		cm("보스와의 전투에서 사망하셨습니다.\n다시 도전해보세요 !");
		isDungeon=false;
		closeWindow(bossHpWindow);
		closeWindow(hpWindow);
		closeWindow(hpBgWindow);
		bossSpawn=false;
		bossState=0;
		actCheck=none;
		skillCount=0;
		renderIndex=0;
		coolTime.wave=maxCoolTime.wave;
		coolTime.laser=maxCoolTime.laser;
		coolTime.missile=maxCoolTime.missile;
		coolTime.mMissile=maxCoolTime.mMissile;
		coolTime.gatling=maxCoolTime.gatling;
		coolTime.bomb=maxCoolTime.bomb;
		bossHp=bossMaxHp;
		Entity.remove(bossEnt);
		for(var i=0;i<swordEntAry.length;i++){
			Entity.remove(swordEntAry[i]);
		}
	}
	Entity.setHealth(Player.getEntity(), Entity.getHealth(Player.getEntity())-amount);
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
//3차원배열 만들기
function make3DAry(length1, length2, length3){
	var new3DAry=new Array(length1);
	for(var i=0;i<new3DAry.length; i++ ){
		new3DAry[i]=new Array(length2);
		for(var j=0;j<new3DAry[i] .length;j++){
			new3DAry[i][j]=new Array(length3);
		}
	}
	return new3DAry;
}
//clientMessage 축약
function cm(message){
	clientMessage(message.toString());
}
//try문에서의 에러 표시
function cme(error){
	clientMessage(ChatColor.RED + error.name + ' (' + error.lineNumber + ') - ' + error.message + '\n' + error.stack);
}
/*------------------------------------
GUI관련 기본적인 함수들
------------------------------------*/
function dip2px(dips){
	return Math.ceil(dips * ctx.getResources().getDisplayMetrics().density);
}
function showToast(message) {
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
/*------------------------------------
GUI관련 사용자 지정 함수들
------------------------------------*/
//체력바 생성&조절 함수
function hpGUI(){
	ctx.runOnUiThread(new java.lang.Runnable({run: function() {
		try {
			var layout = new android.widget.LinearLayout(ctx);
			var bgLayout = new android.widget.LinearLayout(ctx);
			hpView = new android.widget.ImageView(ctx);
			var hpBgView = new android.widget.ImageView(ctx);
			hpWindow = new android.widget.PopupWindow(layout);
			hpBgWindow = new android.widget.PopupWindow(layout);
			var bitmap = android.graphics.Bitmap.createBitmap( maxHpWidth , maxHpHeight , android.graphics.Bitmap.Config.ARGB_8888);
			var canvas = new android.graphics.Canvas(bitmap);
			var color = new android.graphics.Paint();
			color.setARGB(255, 255, 0, 0);
			canvas.drawRect(0, 0, maxHpWidth*hp/maxHp, maxHpHeight, color);
			var drawable = new android.graphics.drawable.BitmapDrawable(bitmap);
			hpView. setBackgroundDrawable(drawable);
			layout.addView(hpView);
			bitmap = android.graphics.Bitmap.createBitmap( maxHpWidth , maxHpHeight , android.graphics.Bitmap.Config.ARGB_8888);
			canvas = new android.graphics.Canvas(bitmap);
			color.setARGB(255, 255, 255, 255);
			canvas.drawRect(0, 0, maxHpWidth, maxHpHeight, color);
			drawable = new android.graphics.drawable.BitmapDrawable(bitmap);
			hpBgView. setBackgroundDrawable(drawable);
			bgLayout.addView(hpBgView);
			hpBgWindow.setContentView(bgLayout);
			hpBgWindow.setTouchable(false);
			hpBgWindow.setWidth (android.widget.LinearLayout.LayoutParams.WRAP_CONTENT);
			hpBgWindow.setHeight (android.widget.LinearLayout.LayoutParams.WRAP_CONTENT);
			hpBgWindow.showAtLocation (ctx.getWindow().getDecorView(), android.view.Gravity.LEFT | android.view.Gravity.TOP, dip2px(2), dip2px(2));
			hpWindow.setContentView(layout);
			hpWindow.setTouchable(false);
			hpWindow.setWidth (android.widget.LinearLayout.LayoutParams.WRAP_CONTENT);
			hpWindow.setHeight (android.widget.LinearLayout.LayoutParams.WRAP_CONTENT);
			hpWindow.showAtLocation (ctx.getWindow().getDecorView(), android.view.Gravity.LEFT | android.view.Gravity.TOP, dip2px(2), dip2px(2));
		}
		catch(error) {
			cme(error);
		}
	}}));
}
function updateHpGUI(){
	ctx.runOnUiThread(new java.lang.Runnable({ run: function() {
		try{
			var bitmap = android.graphics.Bitmap.createBitmap( maxHpWidth , maxHpHeight , android.graphics.Bitmap.Config.ARGB_8888);
			var canvas = new android.graphics.Canvas(bitmap);
			var color = new android.graphics.Paint();
			color.setARGB(255, 255, 0, 0);
			canvas.drawRect(0, 0, maxHpWidth*hp/maxHp, maxHpHeight, color);
			var drawable = new android.graphics.drawable.BitmapDrawable(bitmap);
			hpView. setBackgroundDrawable(drawable);
		}catch(e){
			cme(e);
		}
	}}));
}
function bossHpGUI(){
	ctx.runOnUiThread(new java.lang.Runnable({run: function(){
		try{
			bossHpWindow = new android.widget.PopupWindow();
			bossHpProgBar= newProgBar(null, null, bossMaxHp, bossHp, null);
			bossHpWindow.setContentView (bossHpProgBar);
			bossHpWindow. setWidth( ctx.getResources().getDisplayMetrics().widthPixels-dip2px(230));
			bossHpWindow. setHeight(dip2px(10));
			bossHpWindow. setBackgroundDrawable (new android.graphics.drawable. ColorDrawable(android.graphics.Color. TRANSPARENT));
			bossHpWindow.showAtLocation(ctx. getWindow().getDecorView(), android.view.Gravity.RIGHT |
android.view.Gravity.TOP,  ctx.getResources().getDisplayMetrics().widthPixels/16 , dip2px(10) );
		}catch(e){
			 cme(e);
		}
	}}));
}