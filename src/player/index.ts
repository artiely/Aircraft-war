import k from "../kaboom/index";
import player_s from "./player.png";
import bullet_s from "./bullet.png";
import hit_sd from "./hit.mp3";
import shoot_sd from "./shoot.mp3";
import beu_sd from "./beu.mp3";
import laser_s from "./laser.png";
import fire_j from "./fire.json";
import fire_s from "./fire.png";
import bgm_sd from "./bgm.mp3";
import healthPoint from "../healthPoint/index";
import type { GameObj, EventCanceller,Vec2 } from "kaboom";
import spawnEm from "../em/em"
import spawnTrash from "../trash/trash"
import enemy from '../enemy/enemy'
import spawnCoin from '../coin/coin'
import warning from './warning.png'
import warning_sd from './warning.mp3'

loadSprite("warning", warning);
loadSound("bgm", bgm_sd);
loadSound("hit", hit_sd);
loadSound("shoot", shoot_sd);
loadSound("beu", beu_sd);
loadSound("warning_sd", warning_sd);
loadSprite("player", player_s);
loadSprite("bullet", bullet_s);
loadSprite("laser", laser_s);
loadSpriteAtlas(fire_s, fire_j);

const playerSpriteW = 120;
const playerSpriteH = 79;

const PLAYER_SPEED = 320;
const PLAYER_HP = 1000;
const BULLET_SPEED = 1000;

const bgm = k.play("bgm", { loop: true });
const grow = (rate: number) => {
  return {
    update(this: any) {
      const n = rate * k.dt();
      if (this.scale.x < 10) {
        this.scale.x += n * 0.1;
      }
      if (this.scale.y < 200) {
        this.scale.y += n * 1;
        if (this.scale.y > 5) {
          this.opacity = 0.9;
        }
      }
    },
  };
};

function addTrick(p: { x: number; y: number }, size: number) {
  // p 位置  size 大小
  k.add([
    k.pos(p.x, p.y),
    k.sprite("laser"),
    k.area({ width: k.width() / 2, height: k.height() }),
    k.scale(1 * size, 1 * size),
    k.lifespan(2),
    k.origin("bot"),
    // k.move(k.UP,1000),
    grow(rand(48, 72) * size),
    "laser",
  ]);
}
let cancelSpawnTrashLoop:EventCanceller
let cancelEmLoop:EventCanceller
let isWarning:boolean = false
let isBig:boolean = false
export default () => {
  // 计分
  k.scoreComp=add([text(`score 0`,{size:40}),pos(0,0),fixed(),z(10),{ value: 0 }])
  // 警告
  const warning = () => {
    k.add([
      k.sprite("warning"),
      k.origin("center"),
      k.pos(k.width() / 2, k.height() / 2),
      k.lifespan(5),
    ]);
  };


  const player: GameObj = k.add([
    k.sprite("player", {}),
    k.pos(k.width() / 2, k.height() - playerSpriteH * 2),
    k.area({ width: playerSpriteW, height: playerSpriteH / 2 }),
    k.origin("center"),
    k.health(PLAYER_HP),
    k.z(2),
    "player",
    {
      add() {},
      load(this:GameObj) {
        // if(k.isTouch()){
        //   cancelLoop = k.loop(0.2, () => {
        //     spawnBullet(player.pos.sub(16, 20));
        //     spawnBullet(player.pos.add(16, -20));
        //     k.play("shoot", {
        //       volume: 0.3,
        //       detune: k.rand(-1200, 1200),
        //     });
        //   });
        // }
        cancelEmLoop=k.loop(k.insaneMode ? .5 : 1, spawnEm);
        cancelSpawnTrashLoop=k.loop(1,()=>spawnTrash())
        
      },
      draw() {},
      inspect() {
      },
      update() {
        if(k.scoreComp.value==10&&!isWarning){
          isWarning=true
          warning()
          let warning_sd = k.play("warning_sd",{loop:true});
          setTimeout(() => {
            warning_sd.stop()
            enemy()
          },4000)
        }
        if(k.scoreComp.value%10==0){
          isBig=true
        }
      },
      destroy(this:GameObj) {
        // cancelLoop();
        cancelEmLoop();
        cancelSpawnTrashLoop()
        k.go('win')
      },
    },
  ]);
  k.player=player;
  // 尾焰
  const offset: Vec2 = player.pos.sub(player.pos.x, player.pos.y-playerSpriteH+25)
  const fire: GameObj = k.add([
    k.sprite("fire", { anim: "idle" }),
    k.origin("center"),
    k.scale(0.5, 0.5),
    k.z(1),
    "fire",
    k.follow(player, offset),
    k.pos(player.pos.x, player.pos.y),
  ]);

  // 玩家子弹
  function spawnBullet(p:Vec2) {
    k.add([
      k.sprite("bullet"),
      k.area({ width: 12, height: 48 }),
      k.pos(p),
      k.scale(0.5, 0.5),
      k.origin("center"),
      k.move(UP, BULLET_SPEED),
      "bullet",
      k.cleanup()
    ]);
  }

  // 按键操作
  k.keyPress("r", () => {
    k.play("beu");
    addTrick(player.pos, 1);
  });
  k.keyPress("space", () => {
    spawnBullet(player.pos.sub(16, 20));
    spawnBullet(player.pos.add(16, -20));
    k.play("shoot", {
      volume: 0.3,
      detune: rand(-1200, 1200),
    });
  });
  k.keyDown(["up", "w"], () => {
    bgm.speed(2);
    fire.scale.x = 0.5;
    fire.scale.y = 1;
    k.insaneMode = true;
  });
  k.keyRelease(["up", "w"], () => {
    bgm.speed(1);
    fire.scale.x = 0.5;
    fire.scale.y = 0.5;
    k.insaneMode = false;
  });

  k.keyDown(["left", "a"], () => {
    player.moveTo(
      0,
      player.pos.y,
      k.insaneMode ? PLAYER_SPEED * 2 : PLAYER_SPEED
    );
  });

  k.keyDown(["right", "d"], () => {
    player.moveTo(
      width(),
      player.pos.y,
      k.insaneMode ? PLAYER_SPEED * 2 : PLAYER_SPEED
    );
  });
  // 血槽
  healthPoint({ x: 0, y: height() - 24 }, PLAYER_HP, player);
  const gameOver = (e:GameObj) => {
    bgm.stop();
    k.destroy(player);
    k.destroy(fire);
    k.addExplode(e.pos, 1, 1, 1);
  };
  // 碰撞
  // 小敌机
  player.collides("em", (e:GameObj) => {
    k.play("hit");
    k.destroy(e);
    player.hurt(1);
    shake(10);
    k.addExplode(e.pos, 1, 1, 0.15);
    if (player.hp() <= 0) {
      gameOver(e);
    }
  });
  player.collides("trash", (e:GameObj) => {
    k.play("hit");
    k.destroy(e);
    player.hurt(10);
    shake(10);
    k.addExplode(e.pos, 1, 1, 0.15);
    if (player.hp() <= 0) {
      gameOver(e);
    }
  });
 
  // 敌方子弹
  player.collides("bullet2", (b:GameObj) => {
    k.play("hit");
    k.destroy(b);
    player.hurt(1);
    shake(1);
    k.addExplode(b.pos, 1, 2, 0.1);
    if (player.hp() <= 0) {
      gameOver(b);
    }
  });
  // 导弹
  player.collides("missile", (m:GameObj) => {
    k.play("hit");
    k.destroy(m);
    player.hurt(10);
    k.shake(10);
    k.addExplode(m.pos, 1, 1, 0.15);
    if (player.hp() <= 0) {
      gameOver(m);
    }
  });
  player.collides('coin',(e:GameObj)=>{
    k.destroy(e)
    k.scoreComp.value +=1
    console.log('',k.scoreComp.value)
    k.scoreComp.text=`score ${k.scoreComp.value}`
  })

  //子弹
  k.onCollide("bullet", "bullet2", (l, e) => {
    k.play("hit");
    k.destroy(l);
    k.destroy(e);
    k.shake(1);
    k.addExplode(e.pos, 1, 1, 0.15);
  });
  k.onCollide("bullet", "bullet-em", (l, e) => {
    k.play("hit");
    k.destroy(l);
    k.destroy(e);
    k.shake(1);
    k.addExplode(e.pos, 1, 1, 0.15);
  });
  k.onCollide("bullet", "em", (l, e) => {
    k.play("hit");
    k.destroy(l);
    k.destroy(e);
    k.shake(1);
    e.hurt(10);
    k.addExplode(e.pos, 1, 1, 0.2);
    spawnCoin(e)
  });
  k.onCollide("bullet", "enemy", (l, e) => {
    k.play("hit");
    k.destroy(l);
    k.shake(1);
    e.hurt(1);
    k.addExplode(e.pos, 1, 1, 0.2);
    if(e.hp() <= 0){
      console.log('毁灭吧')
      cancelEmLoop();
      cancelSpawnTrashLoop()
    }
  });

  k.onCollide("bullet", "trash", (b, t) => {
    k.play("hit");
    k.destroy(b);
    k.destroy(t);
    k.shake(1);
    k.addExplode(b.pos, 1, 1, 0.2);
  });

 

  //激光
  k.onCollide("laser", "em", (l, e) => {
    k.play("hit");
    k.destroy(e);
    k.shake(1);
    e.hurt(10);
    k.addExplode(e.pos, 1, 1, 0.15);
    
  });

  k.onCollide("laser", "trash", (l, e) => {
    k.play("hit");
    k.destroy(e);
    k.shake(1);
    e.hurt(10);
    k.addExplode(e.pos, 1, 1, 0.2);
  });

  k.onCollide("laser", "missile", (l, m) => {
    k.play("hit");
    k.destroy(m);
    k.shake(1);
    k.addExplode(m.pos, 1, 1, 0.15);
  });
  k.onCollide("laser", "bullet2", (l, b) => {
    k.play("hit");
    k.destroy(b);
    k.shake(1);
    k.addExplode(b.pos, 1, 1, 0.15);
  });

  k.onCollide("laser", "bullet-em", (l, b) => {
    k.play("hit");
    k.destroy(b);
    k.shake(1);
    k.addExplode(b.pos, 1, 1, 0.15);
  });

  k.onCollide("laser", "enemy", (l, e) => {
    k.play("hit");
    e.hurt(10);
    if (e.hp() <= 0) {
      k.shake(5);
      k.addExplode(e.pos, 1, 24, 1);
      k.destroy(e);
      k.destroyAll("bullet2");
      k.destroyAll("em");
      // 胜利
      if(e.hp() <= 0){
        console.log('毁灭吧',cancelEmLoop)
        cancelEmLoop();
        cancelSpawnTrashLoop()
      }
    }
    k.addExplode(e.pos, 1, 2, 0.1);
  });

  return player;
};
