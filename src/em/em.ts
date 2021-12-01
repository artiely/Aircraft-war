import em_s from "./em.png";
import k from "../kaboom/index";
import bullet_em from "./bullet-em.png";
import type { GameObj } from "kaboom";

k.loadSprite("em", em_s);
k.loadSprite("bullet_em", bullet_em);
// 炮灰
const EM_SPEED = 200;
const SPRITE_W = 97;
const SPRITE_H = 75;
const BULLET_SPEED = EM_SPEED*1.5;
function spawnBullet(em: GameObj) {
  k.add([
    k.sprite("bullet_em"),
    k.area(),
    k.pos(em.pos),
    k.origin("center"),
    k.move(k.DOWN, BULLET_SPEED),
    "bullet-em",
    {
      dir:DOWN,
      speed: BULLET_SPEED,
    },
    k.cleanup(),
    k.lifespan(2),
  ]);
 
}

k.onUpdate('bullet-em',(b) => {
  b.move(b.dir.scale(k.insaneMode ? EM_SPEED * 2 : EM_SPEED));
});

function spawnEm() {
  const x = k.rand(0, k.width());
  const speed = k.rand(EM_SPEED * 0.6, EM_SPEED * 1.2);
  k.add([
    k.sprite("em"),
    k.area({ width: SPRITE_W, height: SPRITE_H / 2 }),
    k.pos(x, 0),
    k.health(10),
    k.origin("center"),
    k.layer("ui"),
    "em",
    k.move(DOWN, speed),
    k.cleanup(),
    {
      dir: DOWN,
      speed: speed,
      add() {},
      load(this: GameObj) {
        this.cancelBulletLoop= k.loop(1, () => {
          spawnBullet(this)
        });
      },
      draw() {
      },
      inspect() {},
      update(this: GameObj) {
       
      },
      destroy(this: GameObj) {
        this.cancelBulletLoop()
      },
    },
  ]);
}
k.onUpdate('em',(e) => {
  e.move(e.dir.scale(k.insaneMode ? EM_SPEED * 2 : EM_SPEED));
});



export default spawnEm;
