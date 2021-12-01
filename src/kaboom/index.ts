import kaboom from 'kaboom'
import type {Vec2} from 'kaboom'
import boom_s from './boom.png'
import boom_j from './boom.json'
const H:number = 890;
const W:number = 564;
const k = kaboom({
  width: W,
  height: H,
  scale: 1,
  debug: true,
  background: [0, 0, 0, 1],
});
k.W=W;
k.H=H;


k.loadSpriteAtlas(boom_s, boom_j);

k.grow=(rate:number)=> {
  return {
    update(this:any) {
      const n = rate * dt();
      this.scale.x += n;
      this.scale.y += n;
    },
  };
}
k.addExplode=(p:Vec2, n:number, rad:number, size: number) =>{
  // p 位置 n 爆炸的个数 rad 范围 size 大小
  for (let i = 0; i < n; i++) {
    k.wait(k.rand(n * 0.1), () => {
      for (let i = 0; i < 2; i++) {
        k.add([
          k.pos(p.add(k.rand(vec2(-rad), k.vec2(rad)))),
          k.sprite("boom", { anim: "idle" }),
          k.scale(1 * size, 1 * size),
          k.lifespan(0.2),
          k.grow(rand(48, 72) * size),
          k.origin("center"),
        ]);
      }
    });
  }
}


export default k