<?php

namespace plugin\MonsterEntity;

use plugin\EntityMove;
use pocketmine\event\entity\EntityDamageByEntityEvent;
use pocketmine\event\entity\EntityDamageEvent;
use pocketmine\nbt\tag\String;
use pocketmine\network\protocol\AddMobPacket;
use pocketmine\Player;

class Spider extends Monster{
    const NETWORK_ID = 35;

    public $width = 0.8;
    public $length = 0.8;
    public $height = 1.12;

    public function getName(){
        return "거미";
    }

    public function spawnTo(Player $player){
        $pk = new AddMobPacket();
        $pk->eid = $this->getID();
        $pk->type = self::NETWORK_ID;
        $pk->x = $this->x;
        $pk->y = $this->y;
        $pk->z = $this->z;
        $pk->yaw = $this->yaw;
        $pk->pitch = $this->pitch;
        $pk->metadata = $this->getData();
        $player->dataPacket($pk);

        parent::spawnTo($player);
    }

    public function onUpdate($currentTick){
        if ($this->closed === true) {
            return false;
        }

        $this->moveTime++;
        $this->attackDelay++;

        if ($this->knockBackCheck()) return;
		
		$target = $this->getTarget();
		$x = $target->x - $this->x;
		$y = $target->y - $this->y;
		$z = $target->z - $this->z;
		$atn = atan2($z, $x);
		if ($this->onGround) {
			$this->move(cos($atn) * 0.12, 0, sin($atn) * 0.12);
		} else {
			$this->move(cos($atn) * 0.1, -0.241, sin($atn) * 0.1);
		}
		$this->setRotation(rad2deg($atn - M_PI_2), rad2deg(-atan2($y, sqrt(pow($x, 2) + pow($z, 2)))));
		if ($target instanceof Player) {
			if($this->attackDelay >= 16 && $this->distance($target) <= 1.1){
				$this->attackDelay = 0;
				$damage = [0, 2, 2, 3];
				$ev = new EntityDamageByEntityEvent($this, $target, EntityDamageEvent::CAUSE_ENTITY_ATTACK, $damage[EntityMove::core()->getDifficulty()]);
				$target->attack($ev->getFinalDamage(), $ev);
			}
		} else {
			if ($this->distance($target) <= 1) {
				$this->moveTime = 500;
			} elseif ($this->x === $this->lastX or $this->z === $this->lastZ) {
				$this->moveTime += 20;
			}
		}

        $this->entityBaseTick();
        $this->updateMovement();
        return true;
    }

	protected function initEntity(){
		$this->namedtag->id = new String("id", "Spider");
	}
}
