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










class PlayerArmorEquipmentPacket extends DataPacket{
	public static $pool = [];
	public static $next = 0;

	public $eid;
	public $slots = [];

	public function pid(){
		return Info::PLAYER_ARMOR_EQUIPMENT_PACKET;
	}

	public function decode(){
		$this->eid = (\PHP_INT_SIZE === 8 ? \unpack("N", $this->get(4))[1] << 32 >> 32 : \unpack("N", $this->get(4))[1]);
		$this->slots[0] = \ord($this->get(1));
		$this->slots[1] = \ord($this->get(1));
		$this->slots[2] = \ord($this->get(1));
		$this->slots[3] = \ord($this->get(1));
	}

	public function encode(){
		$this->reset();
		$this->buffer .= \pack("N", $this->eid);
		$this->buffer .= \chr($this->slots[0]);
		$this->buffer .= \chr($this->slots[1]);
		$this->buffer .= \chr($this->slots[2]);
		$this->buffer .= \chr($this->slots[3]);
	}

}
