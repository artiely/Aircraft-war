import k from "../kaboom/index";
import coin_s from './coin.png'
import coin_sd from './coin.mp3'
import type {GameObj} from 'kaboom'
k.loadSound('bgm_coin',coin_sd)
k.loadSpriteAtlas(coin_s, {
  "coin": {
    "x": 0,
    "y": 0,
    "width": 256,
    "height": 32,
    "sliceX": 8,
    "anims": {
      "idle": {
        "from": 0,
        "to": 7,
        "speed": 30,
        "loop": true
      }
    }
  }
});

const spawnCoin=(p:GameObj)=>{
  k.add([
    k.sprite('coin',{ anim: "idle" }),
    k.area(),
    k.pos(p.pos),
    k.origin('center'),
    k.lifespan(10),
    k.move(p.dir,p.speed),
    'coin',
    { 
      dir:p.dir, 
      speed:p.speed, 
      destroy(){
        k.play('bgm_coin')
      }
    }
  ])
}



export default spawnCoin