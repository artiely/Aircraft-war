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
import type { Character } from "kaboom";

loadSound("bgm", bgm_sd);
loadSound("hit", hit_sd);
loadSound("shoot", shoot_sd);
loadSound("beu", beu_sd);
loadSprite("player", player_s);
loadSprite("bullet", bullet_s);
loadSprite("laser", laser_s);
loadSpriteAtlas(fire_s, fire_j);

const playerSpriteW = 120;
const playerSpriteH = 79;

const PLAYER_SPEED = 320;
const PLAYER_HP = 1000;
const BULLET_SPEED = 1000;

const bgm = play("bgm", { loop: true });
const grow = (rate: number) => {
  return {
    update(this: any) {
      const n = rate * k.dt();
      if (this.scale.x < 4) {
        this.scale.x += n * 0.1;
      }
      if (this.scale.y < 10) {
        this.scale.y += n * 1;
        if (this.scale.y > 5) {
          this.opacity = 0.9;
        }
      } else {
      }
    },
  };
};

function addTrick(p: { x: number; y: number }, size: number) {
  // p 位置  size 大小
  const laser: Character = k.add([
    k.pos(p.x, p.y),
    k.sprite("laser"),
    k.area({ width: k.width() / 2, height: k.height() }),
    // k.area(k.width()/2,k.height()),
    k.scale(1 * size, 1 * size),
    k.lifespan(2),
    k.origin("center"),
    grow(rand(48, 72) * size),
    "laser",
  ]);
  laser.action(() => {
    if (laser.scale.y > 10) {
      k.destroy(laser);
    }
  });
}

export default () => {
  // bgm.play();

  const player = k.add([
    k.sprite("player", {}),
    k.pos(k.width() / 2, k.height() - playerSpriteH * 2),
    k.area({ width: playerSpriteW, height: playerSpriteH / 2 }),
    k.origin("center"),
    k.health(PLAYER_HP),
    k.z(2),
    "player",
  ]);
  k.playerPlane = player;
  // 尾焰
  const offset:{x: number,y: number} ={ x: 0, y: playerSpriteH - 25 }
  const fire: Character = k.add([
    k.sprite("fire", { anim: "idle" }),
    k.origin("center"),
    k.scale(0.5, 0.5),
    k.z(1),
    "fire",
    k.follow(player, offset),
    k.pos(player.pos.x, player.pos.y),
  ]);

  // 玩家子弹
  function spawnBullet(p) {
    const bullet = add([
      sprite("bullet"),
      area({ width: 12, height: 48 }),
      pos(p),
      scale(0.5, 0.5),
      origin("center"),
      move(UP, BULLET_SPEED),
      "bullet",
    ]);
    bullet.action((b) => {
      if (b.pos.y < 0) {
        destroy(b);
      }
    });
  }

  // 按键操作
  keyPress("r", () => {
    play("beu");
    addTrick(player.pos, 1);
  });
  keyPress("space", () => {
    spawnBullet(player.pos.sub(16, 20));
    spawnBullet(player.pos.add(16, -20));
    play("shoot", {
      volume: 0.3,
      detune: rand(-1200, 1200),
    });
  });
  keyDown(["up", "w"], () => {
    bgm.speed(2);
    fire.scale.x = 0.5;
    fire.scale.y = 1;
    K.insaneMode = true;
  });
  keyRelease(["up", "w"], () => {
    bgm.speed(1);
    fire.scale.x = 0.5;
    fire.scale.y = 0.5;
    K.insaneMode = false;
  });

  keyDown(["left", "a"], () => {
    player.moveTo(
      0,
      player.pos.y,
      K.insaneMode ? PLAYER_SPEED * 2 : PLAYER_SPEED
    );
  });

  keyDown(["right", "d"], () => {
    player.moveTo(
      width(),
      player.pos.y,
      K.insaneMode ? PLAYER_SPEED * 2 : PLAYER_SPEED
    );
  });
  // 血槽
  healthPoint({ x: 0, y: height() - 24 }, PLAYER_HP, player);
  const gameOver = (e) => {
    bgm.stop();
    destroy(player);
    destroy(fire);
    K.addExplode(e.pos, 1, 1, 1);
  };
  // 碰撞
  // 小敌机
  player.collides("em", (e) => {
    play("hit");
    destroy(e);
    player.hurt(1);
    shake(10);
    k.addExplode(e.pos, 1, 1, 0.15);
    // play("bomb", { speed: 3 });
    K.emDestoryCount++;
    if (player.hp() <= 0) {
      gameOver(e);
    }
  });
  player.collides("trash", (e) => {
    play("hit");
    destroy(e);
    player.hurt(10);
    shake(10);
    K.addExplode(e.pos, 1, 1, 0.15);
    if (player.hp() <= 0) {
      gameOver(e);
    }
  });
  // 敌方子弹
  player.collides("bullet2", (b) => {
    play("hit");
    destroy(b);
    player.hurt(1);
    shake(1);
    K.addExplode(b.pos, 1, 2, 0.1);
    if (player.hp() <= 0) {
      gameOver(b);
    }
  });
  // 导弹
  player.collides("missile", (m) => {
    play("hit");
    destroy(m);
    player.hurt(10);
    shake(10);
    K.addExplode(m.pos, 1, 1, 0.15);
    if (player.hp() <= 0) {
      gameOver(m);
    }
  });
  //子弹
  collides("bullet", "bullet2", (l, e) => {
    play("hit");
    destroy(l);
    destroy(e);
    shake(1);
    K.addExplode(e.pos, 1, 1, 0.15);
  });
  collides("bullet", "bullet-em", (l, e) => {
    play("hit");
    destroy(l);
    destroy(e);
    shake(1);
    K.addExplode(e.pos, 1, 1, 0.15);
  });
  collides("bullet", "em", (l, e) => {
    play("hit");
    destroy(l);
    destroy(e);
    shake(1);
    e.hurt(10);
    K.addExplode(e.pos, 1, 1, 0.2);
    K.emDestoryCount++;
  });

  collides("bullet", "trash", (b, t) => {
    play("hit");
    destroy(b);
    destroy(t);
    shake(1);
    K.addExplode(b.pos, 1, 1, 0.2);
  });

  //激光
  collides("laser", "em", (l, e) => {
    play("hit");
    destroy(e);
    shake(1);
    e.hurt(10);
    K.addExplode(e.pos, 1, 1, 0.15);
    K.emDestoryCount++;
  });

  collides("laser", "trash", (l, e) => {
    play("hit");
    destroy(e);
    shake(1);
    e.hurt(10);
    K.addExplode(e.pos, 1, 1, 0.2);
  });

  collides("laser", "missile", (l, m) => {
    play("hit");
    destroy(m);
    shake(1);
    K.addExplode(m.pos, 1, 1, 0.15);
  });
  collides("laser", "bullet2", (l, b) => {
    play("hit");
    destroy(b);
    shake(1);
    K.addExplode(b.pos, 1, 1, 0.15);
  });

  collides("laser", "bullet-em", (l, b) => {
    play("hit");
    destroy(b);
    shake(1);
    K.addExplode(b.pos, 1, 1, 0.15);
  });

  collides("laser", "enemy", (l, e) => {
    play("hit");
    e.hurt(10);
    if (e.hp() <= 0) {
      shake(5);
      K.addExplode(e.pos, 1, 24, 1);
      destroy(e);
      destroyAll("bullet2");
      destroyAll("em");
      win();
    }
    K.addExplode(e.pos, 1, 2, 0.1);
  });

  return player;
};
