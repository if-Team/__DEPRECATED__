<?php

namespace plugin\AnimalEntity;

use pocketmine\item\Item;
use pocketmine\math\Vector3;
use pocketmine\nbt\tag\String;
use pocketmine\Player;

class Chicken extends Animal{
    const NETWORK_ID = 10;

    protected function initEntity(){
        $this->namedtag->id = new String("id", "Chicken");
    }

    public function getTarget(){
        $target = $this->target;
        if($target instanceof Player){
            $slot = $target->getInventory()->getItemInHand();
            if(!$target->dead and !$target->closed && $this->distance($target) <= 6 and $slot->getID() == Item::SEEDS) return $target;
        }
        foreach($this->hasSpawned as $p){
            if($this->distance($p) > 6 or $p->spawned === false or $target === $p) continue;
            $slot = $p->getInventory()->getItemInHand();
            if ($slot->getID() == Item::SEEDS) {
                $target = $p;
                break;
            }
        }
        if(!$target instanceof Vector3 or $this->moveTime >= mt_rand(400, 800) or ($target instanceof Player && ($target->dead or $target->closed))){
            $this->moveTime = 0;
            $this->target = new Vector3($this->x + mt_rand(-40,40), $this->y, $this->z + mt_rand(-40,40));
        }
        return $this->target = $target;
    }

    public function getName(){
        return "닭";
    }

}
