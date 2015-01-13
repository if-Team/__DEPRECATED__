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










class AddPlayerPacket extends DataPacket{
	public static $pool = [];
	public static $next = 0;

	public $clientID;
	public $username;
	public $eid;
	public $x;
	public $y;
	public $z;
	public $pitch;
	public $yaw;
	public $item;
	public $meta;
	public $metadata;

	public function pid(){
		return Info::ADD_PLAYER_PACKET;
	}

	public function decode(){

	}

	public function encode(){
		$this->reset();
		$this->buffer .= Binary::writeLong($this->clientID);
		$this->putString($this->username);
		$this->buffer .= \pack("N", $this->eid);
		$this->buffer .= (\ENDIANNESS === 0 ? \pack("f", $this->x) : \strrev(\pack("f", $this->x)));
		$this->buffer .= (\ENDIANNESS === 0 ? \pack("f", $this->y) : \strrev(\pack("f", $this->y)));
		$this->buffer .= (\ENDIANNESS === 0 ? \pack("f", $this->z) : \strrev(\pack("f", $this->z)));
		$this->buffer .= \chr((int) ($this->yaw * (256 / 360)));
		$this->buffer .= \chr((int) ($this->pitch * (256 / 360)));
		$this->buffer .= \pack("n", $this->item);
		$this->buffer .= \pack("n", $this->meta);
		$this->buffer .= Binary::writeMetadata($this->metadata);
	}

}
