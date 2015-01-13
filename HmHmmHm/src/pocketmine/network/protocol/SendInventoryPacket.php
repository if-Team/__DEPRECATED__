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

namespace pocketmine\network\protocol;

use pocketmine\utils\Binary;










class SendInventoryPacket extends DataPacket{
	public static $pool = [];
	public static $next = 0;

	public $eid;
	public $windowid;
	public $slots = [];
	public $armor = [];

	public function pid(){
		return Info::SEND_INVENTORY_PACKET;
	}

	public function decode(){
		$this->eid = (\PHP_INT_SIZE === 8 ? \unpack("N", $this->get(4))[1] << 32 >> 32 : \unpack("N", $this->get(4))[1]);
		$this->windowid = \ord($this->get(1));
		$count = \unpack("n", $this->get(2))[1];
		for($s = 0; $s < $count and !$this->feof(); ++$s){
			$this->slots[$s] = $this->getSlot();
		}
		if($this->windowid === 1){ //Armor is sent
			for($s = 0; $s < 4; ++$s){
				$this->armor[$s] = $this->getSlot();
			}
		}
	}

	public function encode(){
		$this->reset();
		$this->buffer .= \pack("N", $this->eid);
		$this->buffer .= \chr($this->windowid);
		$this->buffer .= \pack("n", \count($this->slots));
		foreach($this->slots as $slot){
			$this->putSlot($slot);
		}
		if($this->windowid === 1 and \count($this->armor) === 4){
			for($s = 0; $s < 4; ++$s){
				$this->putSlot($this->armor[$s]);
			}
		}
	}

}
