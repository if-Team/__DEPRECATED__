<?php

namespace plugin;

use pocketmine\item\ItemBlock;
use pocketmine\Player;
use pocketmine\Server;
use pocketmine\item\Item;
use pocketmine\math\Vector3;
use pocketmine\event\Listener;
use pocketmine\command\Command;
use pocketmine\utils\TextFormat;
use pocketmine\plugin\PluginBase;
use pocketmine\command\CommandSender;
use pocketmine\event\block\BlockBreakEvent;
use pocketmine\event\player\PlayerInteractEvent;

class RevivalBlock extends PluginBase implements Listener{

    public $path;
    public $pos = [];
    public $revi = [];
    public $rand = [];

    public static function core(){
        return Server::getInstance();
    }
    
    public function onEnable(){
        $this->path = self::core()->getDataPath()."plugins/RevivalBlock/";
        if($this->isPhar() === true){
            $this->loadYamlData();
            self::core()->getPluginManager()->registerEvents($this, $this);
            self::core()->getLogger()->info(TextFormat::GOLD . "[RevivalBlock]플러그인이 활성화 되었습니다");
        }else{
            self::core()->getLogger()->info(TextFormat::GOLD . "[RevivalBlock]플러그인을 Phar파일로 변환해주세요");
        }
    }
    
    public function onDisable(){
        if($this->isPhar() === true) $this->saveYamlData();
    }

    public function yaml($file){
        return preg_replace("#^([ ]*)([a-zA-Z_]{1}[^\:]*)\:#m", "$1\"$2\":", file_get_contents($file));
    }

    public function saveYamlData(){
        if($this->isPhar() !== true) return;
        file_put_contents($this->path."RandData.yml", yaml_emit($this->rand, YAML_UTF8_ENCODING));
        file_put_contents($this->path."RevivalData.yml", yaml_emit($this->revi, YAML_UTF8_ENCODING));
    }

    public function loadYamlData(){
        if($this->isPhar() !== true) return;
        @mkdir($this->path);
        if(file_exists($this->path."RevivalData.yml")){
            $this->revi = yaml_parse($this->yaml($this->path . "RevivalData.yml"));
        }else{
            file_put_contents($this->path."RevivalData.yml", yaml_emit([], YAML_UTF8_ENCODING));
        }
        if(file_exists($this->path."RandData.yml")){
            $this->rand = yaml_parse($this->yaml($this->path."RandData.yml"));
        }else{
            $data = [
                "normal" => "1/7",
                Item::STONE => [
                    Item::STONE => "1/2",
                    Item::COAL_ORE => "1/52",
                    Item::IRON_ORE => "1/175",
                    Item::REDSTONE_ORE => "1/98",
                    Item::GOLD_ORE => "1/200",
                    Item::DIAMOND_ORE => "1/300",
                    Item::EMERALD_ORE => "1/250"
                ]
            ];
            file_put_contents($this->path."RandData.yml", yaml_emit($data, YAML_UTF8_ENCODING));
        }
    }
    
    public function PlayerTouchBlock(PlayerInteractEvent $ev){
        if($this->isPhar() !== true) return;
        $t = $ev->getBlock();
        $p = $ev->getPlayer();
        if($ev->getItem()->getID() == Item::STICK){
            $this->pos[strtolower($p->getName())]['pos2'] = [$t->x, $t->y, $t->z];
            $p->sendMessage("[소생블럭]Pos2지점을 선택했습니다(".$t->x.",".$t->y.",".$t->z.")");
            $ev->setCancelled();
            return;
        }
    }
    
    public function PlayerBreakBlock(BlockBreakEvent $ev){
        if($this->isPhar() !== true) return;
        $i = $ev->getItem();
        $t = $ev->getBlock();
        $p = $ev->getPlayer();
        $pu = strtolower($p->getName());
        $x = $t->x;
        $y = $t->y;
        $z = $t->z;
        if($i->getID() == Item::STICK){
            $this->pos[$pu]['pos1'] = [$x, $y, $z];
            $p->sendMessage("[소생블럭]Pos1지점을 선택했습니다($x,$y,$z)");
            $ev->setCancelled();
        }else if(isset($this->revi[$x.":".$y.":".$z])){
            if($this->revi["$x:$y:$z"] == true){
                $as = explode("/", $this->rand["normal"]);
                if(mt_rand(1, $as[1]) <= $as[0]){
                    $ev->setCancelled();
                    return;
                }
                foreach($t->getDrops($i) as $d) $p->getInventory()->addItem(Item::get($d[0], $d[1], $d[2]));
            }else{
                $block = Item::fromString($this->revi["$x:$y:$z"]);
                if($i->isPickaxe() === false){
                    $p->sendMessage("[소생블럭]곡괭이를 사용해주세요");
                    $ev->setCancelled();
                    return;
                } elseif($t->getID() == $block->getID() and $t->getDamage() == $block->getDamage()){
                    $item = Item::get(Item::AIR);
                    foreach($this->rand[$block->getID()] as $string => $as){
                        $as = explode("/", $as);
                        if(mt_rand(1, $as[1]) <= $as[0]){
                            if(($d = Item::fromString($string)) instanceof ItemBlock){
                                $item = $d;
                            }else{
                                unset($this->rand[$block->getID()][$string]);
                            }
                        }
                    }
                    if($item->getID() !== Item::AIR){
                        if($block->getID() == $item->getID() and $block->getDamage() == $item->getDamage()){
                            foreach ($t->getDrops($i) as $drops){
                                $p->getInventory()->addItem(Item::get(...$drops));
                            }
                            return;
                        }
                        $p->getLevel()->setBlock(new Vector3($x,$y,$z), $item->getBlock(), true);
                    }
                }else{
                    foreach ($t->getDrops($i) as $d){
                        $p->getInventory()->addItem(Item::get($d[0], $d[1], $d[2]));
                    }
                    $p->getLevel()->setBlock(new Vector3($x,$y,$z), $block->getBlock(), true);
                }
            }
            $slot = $p->getInventory()->getItemInHand();
            if($slot->isTool() && !$p->isCreative()){
                if($slot->useOn($t) and $slot->getDamage() >= $slot->getMaxDurability()) $slot->count -= 1;
                $p->getInventory()->setItemInHand($slot);
            }
            $ev->setCancelled();
            return;
        }
    }

    public function onCommand(CommandSender $i, Command $cmd, $label, array $sub){
        if($this->isPhar() !== true or !$i instanceof Player) return true;
        $pu = strtolower($i->getName());
        $output = "[소생블럭]";
        if(!isset($this->pos[$pu]['pos1']) or !isset($this->pos[$pu]['pos2'])){
            $output .= "소생블럭화 할 블럭을 먼저 선택해주세요";
            $i->sendMessage($output);
            return true;
        }
        $sx = min($this->pos[$pu]['pos1'][0], $this->pos[$pu]['pos2'][0]);
        $sy = min($this->pos[$pu]['pos1'][1], $this->pos[$pu]['pos2'][1]);
        $sz = min($this->pos[$pu]['pos1'][2], $this->pos[$pu]['pos2'][2]);
        $ex = max($this->pos[$pu]['pos1'][0], $this->pos[$pu]['pos2'][0]);
        $ey = max($this->pos[$pu]['pos1'][1], $this->pos[$pu]['pos2'][1]);
        $ez = max($this->pos[$pu]['pos1'][2], $this->pos[$pu]['pos2'][2]);
        for($x = $sx; $x <= $ex; ++$x){
            for($y = $sy; $y <= $ey; ++$y){
                for($z = $sz; $z <= $ez; ++$z){
                    if($cmd->getName() == "revi"){
                        $this->revi[$x.":".$y.":".$z] = isset($sub[0]) ? $i->getLevel()->getBlock(new Vector3($x, $y, $z))->getId() : true;
                    }else{
                        unset($this->revi[$x.":".$y.":".$z]);
                    }
                }
            }
        }
        $output .= $cmd->getName() == "revi" ? "소생블럭으로 만드는데 성공했어요" : "선택하신 블럭은 더이상 소생블럭이 아니에요";
        $i->sendMessage($output);
        return true;
    }
}
