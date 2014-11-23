<?php

namespace plugin\AnimalEntity;

use pocketmine\entity\Colorable;
use pocketmine\item\Item;
use pocketmine\math\Vector3;
use pocketmine\nbt\tag\String;
use pocketmine\Player;

class Cow extends Animal{
    const NETWORK_ID = 11;

    protected function initEntity(){
        $this->namedtag->id = new String("id", "Cow");
    }

    public function getTarget(){
        foreach($this->hasSpawned as $p){
            if($this->distance($p) > 7.2 or $p->spawned === false or $p->dead === true) continue;
            $slot = $p->getInventory()->getItemInHand();
            if ($slot->getID() == Item::WHEAT) {
                $this->target = $p;
                break;
            }
        }
        if(!$this->target instanceof Vector3 or $this->moveTime >= mt_rand(80,500) or ($this->target instanceof Player && $this->target->dead)){
            $this->moveTime = 0;
            $this->target = new Vector3($this->x + mt_rand(-40,40), $this->y, $this->z + mt_rand(-40,40));
        }
        return $this->target;
    }

    public function getName(){
        return "소";
    }

}
