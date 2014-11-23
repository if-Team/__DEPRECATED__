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
        foreach($this->hasSpawned as $p){
            if($this->distance($p) > 6 or $p->spawned === false or $p->dead === true) continue;
            $slot = $p->getInventory()->getItemInHand();
            if($slot->getID() == Item::SEEDS){
                $this->target = $p;
                break;
            }
        }
        if(!$this->target instanceof Vector3 or $this->moveTime >= mt_rand(80,500) or ($this->target instanceof Player && $this->target->dead)){
            $this->moveTime = 0;
            $this->target = new Vector3($this->x + mt_rand(-100, 100), $this->y, $this->z + mt_rand(-100, 100));
        }
        return $this->target;
    }

    public function getName(){
        return "닭";
    }

}
