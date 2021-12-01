import k from "../kaboom/index";
import enemy_s from "./enemy.png";
import bullet2_s from "./bullet2.png";
import { GameObj, Vec2 } from 'kaboom'
import healthPoint from "../healthPoint/index"
k.loadSprite("enemy", enemy_s);
k.loadSprite("bullet2", bullet2_s);


const enemySpriteW = 259;
const enemySpriteH = 196;
const BOSS_HEALTH = 1000;
const BOSS_SPEED = 100;
const BULLET_SPEED = 1000;

const boss = () => {
  const enemy: GameObj = k.add([
    k.sprite("enemy", {}),
    k.health(BOSS_HEALTH),
    k.pos(width() / 2, enemySpriteH),
    k.area({ width: enemySpriteW, height: enemySpriteH / 1.3 }),
    k.origin("center"),
    "enemy",
    {
      dir: 1,
      destroy(this: GameObj) {
        k.go('lose')
      },
    },
  ]);
  function spawnBullet(p: Vec2) {
    k.add([
      k.sprite("bullet2"),
      k.area({ width: 70, height: 142 }),
      k.pos(p),
      k.origin("center"),
      k.scale(.2, .2),
      k.move(DOWN, BULLET_SPEED / 4),
      "bullet2",
      k.cleanup()
    ]);

  }

  function spawnBulletDouble() {
    spawnBullet(enemy.pos.sub(-enemySpriteW / 4, -enemySpriteH / 1.3));
    spawnBullet(enemy.pos.sub(enemySpriteW / 4, -enemySpriteH / 1.3));
  }

  k.loop(1, () => {
    if (enemy.hp() > 0) {
      spawnBulletDouble()
    }
    if (enemy.hp() <= 50 && enemy.hp() > 0) {
      // warning();
      k.wait(0.5, () => {
        spawnBulletDouble()
      });
    }
  });
  // 敌机移动
  enemy.action(() => {
    enemy.move(BOSS_SPEED * enemy.dir, 0);
    if (enemy.dir === 1 && enemy.pos.x >= k.width() - enemySpriteW / 2) {
      enemy.dir = -1;
    }
    if (enemy.dir === -1 && enemy.pos.x <= enemySpriteW / 2) {
      enemy.dir = 1;
    }
    if (enemy.hp() / BOSS_HEALTH <= 0.9) {
      // emitter.emit("warning");
    }
    if (enemy.hp() <= 0) {
      k.destroy(enemy)
      // 清除
      destroyAll('em')
      destroyAll('bullet-em')
      destroyAll('trash')
    }
  });

  healthPoint({ x: 0, y: 0 }, BOSS_HEALTH, enemy);
};
export default boss