<?php

namespace plugin\MonsterEntity;

use plugin\EntityMove;
use pocketmine\event\entity\EntityDamageByEntityEvent;
use pocketmine\event\entity\EntityDamageEvent;
use pocketmine\item\Item;
use pocketmine\nbt\tag\String;
use pocketmine\network\protocol\AddMobPacket;
use pocketmine\Player;

class Zombie extends Monster{
	const NETWORK_ID = 32;

	public $width = 0.6;
	public $length = 0.6;
	public $height = 1.8;

	protected function initEntity(){
		$this->namedtag->id = new String("id", "Zombie");
	}

	public function getName(){
		return "좀비";
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

        if ($this->knockBackCheck()) return true;
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
			if ($this->attackDelay >= 16 && $this->distance($target) <= 0.8) {
				$this->attackDelay = 0;
				$damage = [0, 3, 4, 6];
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

	public function getDrops(){
		$drops = [
			Item::get(Item::FEATHER, 0, 1)
		];
		if($this->lastDamageCause instanceof EntityDamageByEntityEvent and $this->lastDamageCause->getEntity() instanceof Player){
			if(mt_rand(0, 199) < 5){
				switch(mt_rand(0, 2)){
					case 0:
						$drops[] = Item::get(Item::IRON_INGOT, 0, 1);
						break;
					case 1:
						$drops[] = Item::get(Item::CARROT, 0, 1);
						break;
					case 2:
						$drops[] = Item::get(Item::POTATO, 0, 1);
						break;
				}
			}
		}

		return $drops;
	}
}
