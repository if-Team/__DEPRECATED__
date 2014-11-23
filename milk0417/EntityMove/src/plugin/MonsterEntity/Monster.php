<?php

namespace plugin\MonsterEntity;

use pocketmine\event\entity\EntityDamageByEntityEvent;
use pocketmine\event\entity\EntityDamageEvent;
use pocketmine\math\Vector3;
use pocketmine\Player;
use pocketmine\network\protocol\EntityEventPacket;
use pocketmine\network\protocol\MovePlayerPacket;
use pocketmine\network\protocol\RemoveEntityPacket;
use pocketmine\entity\Monster as MonsterEntity;
use pocketmine\entity\Entity;
use pocketmine\scheduler\CallbackTask;
use pocketmine\Server;

abstract class Monster extends MonsterEntity{

    /** @var Vector3|Player */
    public $target = null;

    public $moveTime = 0;
    public $bombTime = 0;

    protected $attackDelay = 0;

    /** @var Entity|null */
    protected $attacker = null;

    public function updateMovement(){
        $this->lastX = $this->x;
        $this->lastY = $this->y;
        $this->lastZ = $this->z;

        $this->lastYaw = $this->yaw;
        $this->lastPitch = $this->pitch;

        $pk = new MovePlayerPacket();
        $pk->eid = $this->id;
        $pk->x = $this->x;
        $pk->y = $this->y;
        $pk->z = $this->z;
        $pk->yaw = $this->yaw;
        $pk->pitch = $this->pitch;
        $pk->bodyYaw = $this->yaw;

        Server::broadcastPacket($this->getViewers(), $pk);
    }

    public function despawnFrom(Player $player){
        if(isset($this->hasSpawned[$player->getID()])){
            $pk = new EntityEventPacket();
            $pk->eid = $this->id;
            $pk->event = 3;
            $player->dataPacket($pk);

            $pk = new RemoveEntityPacket();
            $pk->eid = $this->id;
            $this->server->getScheduler()->scheduleDelayedTask(new CallbackTask([$player, "dataPacket"], [$pk]), 23);
            unset($this->hasSpawned[$player->getID()]);
        }
    }

    public function knockBack(Entity $attacker, $damage, $x, $z){

    }

    public function attack($damage, $source = EntityDamageEvent::CAUSE_MAGIC){
        if($this->attacker instanceof Entity) return;
        parent::attack($damage, $source);
        if($source instanceof EntityDamageByEntityEvent and !$source->isCancelled()){
            $this->moveTime = 4;
            $this->attacker = $source->getDamager();
        }
    }

    public function knockBackCheck(){
        if (!$this->attacker instanceof Entity) return false;

        $this->moveTime--;
        $target = $this->attacker;

        $x = $target->x - $this->x;
        $y = $target->y - $this->y;
        $z = $target->z - $this->z;
        $atn = atan2($z, $x);
        $this->move(cos($atn) * -0.8, 0.6, sin($atn) * -0.8);
        $this->setRotation(rad2deg(atan2($z, $x) - M_PI_2), rad2deg(-atan2($y, sqrt($x ** 2 + $z ** 2))));

        $this->entityBaseTick();
        $this->updateMovement();
        if($this->moveTime <= 0) $this->attacker = null;
        return true;
    }

    /**
     * return Player|Vector3
     */
    public function getTarget(){
        $target = $this->target;
        $nearDistance = PHP_INT_MAX;
        if($target instanceof Player and !$target->dead and !$target->closed && $this->distance($target) <= 7.2){
            return $target;
        }
        foreach($this->hasSpawned as $p){
            if(($distance = $this->distance($p)) <= 7.2 and $p->spawned and $p->isSurvival()){
                if($distance < $nearDistance){
                    $nearDistance = $distance;
                    $target = $p;
                }
            }
        }
        if($target instanceof Player && !$target->dead and !$target->closed){
            return $this->target = $target;
        }elseif($this->moveTime >= mt_rand(400, 800) or !$target instanceof Vector3){
            $this->moveTime = 0;
            return $this->target = new Vector3($this->x + mt_rand(-100, 100), $this->y, $this->z + mt_rand(-100,100));
        }
        return $target;
    }
    
    public function getData(){
        $flags = 0;
        $flags |= $this->fireTicks > 0 ? 1 : 0;

        return [
            0 => ["type" => 0, "value" => $flags],
            1 => ["type" => 1, "value" => $this->airTicks],
            16 => ["type" => 0, "value" => 0],
            17 => ["type" => 6, "value" => [0, 0, 0]],
        ];
    }
}

?>
