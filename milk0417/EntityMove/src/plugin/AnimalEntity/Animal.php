<?php

namespace plugin\AnimalEntity;

use pocketmine\event\entity\EntityDamageByEntityEvent;
use pocketmine\event\entity\EntityDamageEvent;
use pocketmine\math\Vector3;
use pocketmine\Player;
use pocketmine\network\protocol\EntityEventPacket;
use pocketmine\network\protocol\MovePlayerPacket;
use pocketmine\network\protocol\RemoveEntityPacket;
use pocketmine\entity\Animal as AnimalEntity;
use pocketmine\scheduler\CallbackTask;
use pocketmine\Server;

abstract class Animal extends AnimalEntity{

    public $moveTime = 0;

    public $target = null;

    public $hphit = [false, 0];

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

    public function attack($damage, $source = EntityDamageEvent::CAUSE_MAGIC){
        parent::attack($damage, $source);
        if(
            !$this->hphit[0] instanceof Player
            and $source instanceof EntityDamageByEntityEvent
            and $this->getLastDamageCause() === $source
        ){
            $this->hphit = [$source->getDamager(), 3];
        }
    }

    public function onUpdate($currentTick){
        if($this->closed === true){
            return false;
        }

        $this->moveTime++;

        if($this->hphit[0] instanceof Player){
            if($this->hphit[1] > 0){
                $this->hphit[1]--;
            }else{
                $this->hphit = [false, 0];
            }

            $x = $this->hphit[0]->x - $this->x;
            $y = $this->hphit[0]->y - $this->y;
            $z = $this->hphit[0]->z - $this->z;
            $atn = atan2($z, $x);
            $this->move(cos($atn) * -0.7, 0.54, sin($atn) * -0.7);
            $this->setRotation(rad2deg(atan2($z, $x) - M_PI_2), rad2deg(-atan2($y, sqrt(pow($x, 2) + pow($z, 2)))));
        }else{
            $target = $this->getTarget();
            $x = $target->x - $this->x;
            $y = $target->y - $this->y;
            $z = $target->z - $this->z;
            $dXZ = sqrt(pow($x, 2) + pow($z, 2));
            $atn = atan2($z, $x);
            if ($this->onGround) {
                $this->move(cos($atn) * 0.1, 0, sin($atn) * 0.1);
            } else {
                $this->move(cos($atn) * 0.09, -0.241, sin($atn) * 0.09);
            }
            $this->setRotation(rad2deg($atn - M_PI_2), rad2deg(-atan2($y, $dXZ)));
            if($target instanceof Player){
                if($this->distance($target) <= 2){
                    $this->pitch = 22;
                    $this->x = $this->lastX;
                    $this->y = $this->lastY;
                    $this->z = $this->lastZ;
                }
            }else{
                if ($this->distance($target) <= 1) {
                    $this->moveTime = 800;
                } else if ($this->x === $this->lastX or $this->z === $this->lastZ) {
                    $this->moveTime += 20;
                }
            }
        }

        $this->entityBaseTick();
        $this->updateMovement();
        return true;
    }

    /**
     * @return Player|Vector3
     */
    public abstract function getTarget();
    
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
