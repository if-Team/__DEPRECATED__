<?php
// This Plugin is Made by DeBe (hu6677@naver.com)
namespace DeBePlugins\MoveCommand;

use pocketmine\plugin\PluginBase;
use pocketmine\command\Command;
use pocketmine\command\CommandSender;
use pocketmine\utils\TextFormat;
use pocketmine\utils\Config;
use pocketmine\math\Vector3;
use pocketmine\Player;
use pocketmine\scheduler\CallbackTask;

class MoveCommand extends PluginBase{

	public function onCommand(CommandSender $sender, Command $cmd, $label, array $sub){
		if(!isset($sub[3])) return false;
		$mm = "[Move] ";
		$ik = $this->isKorean();
		if(is_numeric($x = $sub[0]) && is_numeric($y = $sub[1]) && is_numeric($z = $sub[2]) && (!isset($sub[3]) or $sub[3] === "") && $sender instanceof Player) $player = $sender;
		elseif(!$player = $this->getServer()->getPlayer(strtolower($sub[0]))) $r = $sub[0] . ($ik ? "는 잘못된 플레이어명입니다.": "is invalid player");
		elseif(!(is_numeric($x = $sub[1]) && is_numeric($y = $sub[2]) && is_numeric($z = $sub[3]))) $r = "<X> or <Y> or <Z> " . ($ik ? "중 하나가 숫자가 아닙니다.": "is not number");
		if(isset($r)) $sender->sendMessage($mm . $r);
		elseif(!($x || $y || $z)) return ture;
		elseif(isset($sub[4]) && $sub[4] == "%"){
			$d = (isset($sub[5]) && is_numeric($sub[5]) && $sub[5] >= 0) ? $sub[5] : (max($x,$y,$z) > 0 ? max($x,$y,$z) : -min($x,$y,$z));
			$this->move($player,(new Vector3($x*0.4, $y*0.4 + 0.1, $z*0.4))->multiply(1.11 / $d),$d,isset($sub[6]) && is_numeric($sub[6]) ? $sub[6] : 0.15);
		}else $player->setMotion((new Vector3($x,$y,$z))->multiply(0.4));
		return true;
	}

	public function onPlayerKick(PlayerKickEvent $event){
		if(strpos($event->getReason(),"Flying") !== false) $event->setCancelled();
	}

	public function move(Player $p, Vector3 $m, $t, $tt = false,$cool = 0.15){
		if(!$tt) $tt = 0;
		if($t - $tt < 1){
			return;
		}else{
			$tt++;
			$p->setMotion($m);
			if($t - $tt > 0) $this->getServer()->getScheduler()->scheduleDelayedTask(new CallbackTask([$this,"move"], [$p,$m,$t,$tt]), $cool*20);
		}
	}

	public function isKorean(){
		@mkdir($this->getServer()->getDataPath() . "/plugins/! DeBePlugins/");
		if(!isset($this->ik)) $this->ik = (new Config($this->getServer()->getDataPath() . "/plugins/! DeBePlugins/" . "! Korean.yml", Config::YAML, ["Korean" => false]))->get("Korean");
		return $this->ik;
	}
}