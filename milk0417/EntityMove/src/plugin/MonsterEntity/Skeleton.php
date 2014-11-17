<?php


namespace plugin\MonsterEntity;

use pocketmine\entity\Entity;
use pocketmine\entity\ProjectileSource;
use pocketmine\event\entity\EntityShootBowEvent;
use pocketmine\item\Item;
use pocketmine\nbt\tag\Compound;
use pocketmine\nbt\tag\Double;
use pocketmine\nbt\tag\Enum;
use pocketmine\nbt\tag\Float;
use pocketmine\nbt\tag\String;
use pocketmine\network\protocol\AddMobPacket;
use pocketmine\Player;

class Skeleton extends Monster implements ProjectileSource{
    const NETWORK_ID = 34;

    public $width = 0.6;
    public $length = 0.6;
    public $height = 1.8;

	protected function initEntity(){
		$this->namedtag->id = new String("id", "Skeleton");
	}

    public function getName(){
        return "스켈레톤";
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
			if ($this->attackDelay >= 16 && $this->distance($target) <= (mt_rand(40, 65) / 10) and mt_rand(1,19) <= 2) {
				$this->attackDelay = 0;
				$f = 1.5;
				$pt = $this->pitch + mt_rand(-40, 40) / 10;
				$yw = $this->yaw + mt_rand(-80, 80) / 10;
				$nbt = new Compound("", [
					"Pos" => new Enum("Pos", [
						new Double("", $this->x),
						new Double("", $this->y + 1.62),
						new Double("", $this->z)
					]),
					"Motion" => new Enum("Motion", [
						new Double("", -sin($yw / 180 * M_PI) * cos($pt / 180 * M_PI) * $f),
						new Double("", -sin($pt / 180 * M_PI) * $f),
						new Double("", cos($yw / 180 * M_PI) * cos($pt / 180 * M_PI) * $f)
					]),
					"Rotation" => new Enum("Rotation", [
						new Float("", $yw),
						new Float("", $pt)
					]),
				]);
				$arrow = Entity::createEntity("Arrow", $this->chunk, $nbt, $this);

				$ev = new EntityShootBowEvent($this, Item::get(Item::ARROW, 0, 1), $arrow, $f);

				$this->server->getPluginManager()->callEvent($ev);
				if($ev->isCancelled()){
					$arrow->kill();
				}else{
					$arrow->spawnToAll();
				}
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

}
