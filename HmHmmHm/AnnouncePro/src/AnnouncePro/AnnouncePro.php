<?php

namespace AnnouncePro;

use pocketmine\plugin\PluginBase;
use pocketmine\event\Listener;
use pocketmine\command\CommandSender;
use pocketmine\command\Command;
use pocketmine\utils\Config;
use pocketmine\utils\TextFormat;
use pocketmine\scheduler\CallbackTask;

class AnnouncePro extends PluginBase implements Listener {
	public $config, $configData;
	public $callback, $before = 1;
	public function onEnable() {
		@mkdir ( $this->getDataFolder () );
		$this->getServer ()->getPluginManager ()->registerEvents ( $this, $this );
		$this->config = new Config ( $this->getDataFolder () . "announce.yml", Config::YAML, [ 
				"enable" => true,
				"repeat-time" => 5,
				"prefix" => "[ 서버 ]",
				"suffix" => "",
				"announce" => [ ] 
		] );
		$this->configData = $this->config->getAll ();
		$this->callback = $this->getServer ()->getScheduler ()->scheduleRepeatingTask ( new CallbackTask ( [ 
				$this,
				"AnnouncePro" 
		] ), $this->configData ["repeat-time"] * 20 );
	}
	public function onDisable() {
		$this->config->setAll ( $this->configData );
		$this->config->save ();
	}
	public function onCommand(CommandSender $player, Command $command, $label, Array $args) {
		if (! isset ( $args [0] )) {
			$this->helpPage ( $player );
			return true;
		}
		switch ($args [0]) {
			case "활성화" :
				$this->configData ["enable"] = true;
				$player->sendMessage ( TextFormat::DARK_AQUA . "공지를 활성화 했습니다 !" );
				break;
			case "비활성화" :
				$this->configData ["enable"] = false;
				$player->sendMessage ( TextFormat::DARK_AQUA . "공지를 비활성화 했습니다 !" );
				break;
			case "추가" :
				array_shift ( $args );
				$text = $this->replaceColor ( implode ( " ", $args ) );
				if($text == "" or $text == " "){
					$player->sendMessage(TextFormat::DARK_AQUA . "/공지 추가 <번호>");
					break;
				}
				$this->configData ["announce"] [] = $text;
				$player->sendMessage ( TextFormat::DARK_AQUA . "해당 공지를 추가했습니다 !" );
				break;
			case "삭제" :
				if (! isset ( $args [1] )) {
					$player->sendMessage ( TextFormat::RED . "/공지 삭제 <번호>" );
					break;
				}
				if (! is_numeric ( $args [1] )) {
					$player->sendMessage ( TextFormat::DARK_AQUA . "공지번호는 숫자만 적을 수있습니다 !" );
					break;
				}
				if (isset ( $this->configData ["announce"] [$args [1]] )) {
					unset ( $this->configData ["announce"] [$args [1]] );
					ksort ( $this->configData ["announce"] );
					$match_new = array ();
					$keys = array_keys ( $this->configData ["announce"] );
					while ( $aaa = each ( $keys ) )
						$match_new [] = $this->configData ["announce"] [$aaa [1]];
					$this->configData ["announce"] = $match_new;
					unset ( $match_new );
					$player->sendMessage ( TextFormat::DARK_AQUA . "해당 공지를 삭제했습니다 !" );
				}
				break;
			case "리스트" :
				if (isset ( $args [1] ) and is_numeric ( $args [1] )) {
					$this->AnnounceList ( $player, $args [1] );
				} else {
					$this->AnnounceList ( $player );
				}
				break;
			case "반복" :
				if (! is_numeric ( $args [1] )) {
					$player->sendMessage ( TextFormat::DARK_AQUA . "시간초는 숫자만 적을 수있습니다 !" );
					break;
				}
				$this->configData ["repeat-time"] = $args [1];
				$this->callback->remove ();
				$this->callback = $this->getServer ()->getScheduler ()->scheduleRepeatingTask ( new CallbackTask ( [ 
						$this,
						"AnnouncePro" 
				] ), $this->configData ["repeat-time"] * 20 );
				$player->sendMessage ( TextFormat::DARK_AQUA . "해당 시간초만큼 반복을 설정했습니다 !" );
				break;
			case "접두사" :
				if (! isset ( $args [1] )) {
					$player->sendMessage ( TextFormat::RED . "/공지 접두사 <내용>" );
					break;
				}
				$this->configData ["prefix"] = $args [1];
				$player->sendMessage ( TextFormat::DARK_AQUA . "해당 접두사를 설정했습니다 !" );
				break;
			case "접미사" :
				if (! isset ( $args [1] )) {
					$player->sendMessage ( TextFormat::RED . "/공지 접미사 <내용>" );
					break;
				}
				$this->configData ["suffix"] = $args [1];
				$player->sendMessage ( TextFormat::DARK_AQUA . "해당 접미사를 설정했습니다 !" );
				break;
			default :
				$this->helpPage ( $player );
				break;
		}
		return true;
	}
	public function AnnouncePro() {
		if ($this->configData ["enable"] != true)
			return;
			// TODO 이전공지일경우 안뜨게 조치
		if (isset ( $this->configData ["announce"] ))
			$rand = rand ( 0, count ( $this->configData ["announce"] ) - 1 );
		if (count ( $this->configData ["announce"] ) > 3)
			while ( $rand == $this->before )
				$rand = rand ( 0, count ( $this->configData ["announce"] ) - 1 );
		$this->before = $rand;
		if (isset ( $rand ))
			if (isset ( $this->configData ["announce"] [$rand] ))
				foreach ( $this->getServer ()->getOnlinePlayers () as $player )
					$player->sendMessage ( $this->configData ["prefix"] . " " . $this->configData ["announce"] [$rand] . " " . $this->configData ["suffix"] );
	}
	public function replaceColor($text) {
		for($i = 0; $i <= 9; $i ++)
			$text = str_replace ( "&" . $i, "§" . $i, $text );
		for($i = 'a'; $i <= 'f'; $i ++)
			$text = str_replace ( "&" . $i, "§" . $i, $text );
		return $text;
	}
	public function AnnounceList(CommandSender $player, $index = 1) {
		$once_print = 5;
		$target = $this->configData ["announce"];
		
		$index_count = count ( $target );
		$index_key = array_keys ( $target );
		$full_index = floor ( $index_count / $once_print );
		
		if ($index_count > $full_index * $once_print)
			$full_index ++;
		
		if ($index <= $full_index) {
			$player->sendMessage ( TextFormat::DARK_AQUA . "*공지리스트를 표시합니다 ! ({$index}/{$full_index}) 총: {$index_count}개" );
			$message = null;
			for($for_i = $once_print; $for_i >= 1; $for_i --) {
				$now_index = $index * $once_print - $for_i;
				if (! isset ( $index_key [$now_index] ))
					break;
				$now_key = $index_key [$now_index];
				$message .= TextFormat::DARK_AQUA . "[" . $now_key . "] : " . $target [$now_key] . "\n";
			}
			$player->sendMessage ( $message );
		} else {
			$player->sendMessage ( TextFormat::RED . "해당하는 리스트가 없습니다 !" );
			return false;
		}
	}
	public function helpPage(CommandSender $player) {
		$player->sendMessage ( TextFormat::DARK_AQUA . "/공지 활성화|비활성화 - 공지를 활성|비활성화 합니다" );
		$player->sendMessage ( TextFormat::DARK_AQUA . "/공지 추가 <내용> - 공지를 추가합니다" );
		$player->sendMessage ( TextFormat::DARK_AQUA . "/공지 삭제 <번호> - 공지를 삭제합니다" );
		$player->sendMessage ( TextFormat::DARK_AQUA . "/공지 리스트 <내용> - 공지 리스트를 보여줍니다." );
		$player->sendMessage ( TextFormat::DARK_AQUA . "/공지 반복 <시간초> - 공지 반복시간을 수정합니다." );
		$player->sendMessage ( TextFormat::DARK_AQUA . "/공지 색상표 - 공지에 사용가능한 색상표를 출력합니다" );
		$player->sendMessage ( TextFormat::DARK_AQUA . "/공지 접두사|접미사 <내용>  - 공지 앞뒤에 단어를 추가합니다. " );
	}
}
?>