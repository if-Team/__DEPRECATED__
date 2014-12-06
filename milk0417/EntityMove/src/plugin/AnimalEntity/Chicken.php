<?php

/*
 *
 *  ____            _        _   __  __ _                  __  __ ____  
 * |  _ \ ___   ___| | _____| |_|  \/  (_)_ __   ___      |  \/  |  _ \ 
 * | |_) / _ \ / __| |/ / _ \ __| |\/| | | '_ \ / _ \_____| |\/| | |_) |
 * |  __/ (_) | (__|   <  __/ |_| |  | | | | | |  __/_____| |  | |  __/ 
 * |_|   \___/ \___|_|\_\___|\__|_|  |_|_|_| |_|\___|     |_|  |_|_| 
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * @author PocketMine Team
 * @link http://www.pocketmine.net/
 * 
 *
*/

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
