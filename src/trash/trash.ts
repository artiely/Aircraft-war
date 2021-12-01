import k from "../kaboom/index";
import trash_s from "./trash.png";
import bomb from "./bomb.mp3";
import bgm_s from "./bgm.mp3";
import {GameObj} from 'kaboom'

k.loadSprite("trash", trash_s);

k.loadSound("bomb", bomb);
k.loadSound("bgm", bgm_s);
// 自杀式
const TRASH_SPEED = 180;

k.trashBgm = k.play("bgm", { speed: 3, seek: 100,loop:true });
function spawnTrash() {
  const x = k.rand(0, k.width());
    k.add([
      k.sprite("trash"),
      k.area(),
      k.pos(x, 0),
      k.health(10),
      k.origin("center"),
      k.cleanup(),
      k.move(DOWN,100),
      "trash",
      {
        add() {
        },
        update(e:GameObj) {
          // console.log(e)
          e.moveTo(
            k.player.pos.x,
            k.player.pos.y,
            TRASH_SPEED
          );
        },
        destroy() {
          
        },
      },
    ]);

    
}
// k.onUpdate("trash", (e) => {
//   console.log("trash",e)
//   e.moveTo(
//     k.player.pos.x,
//     k.player.pos.y,
//     k.rand(TRASH_SPEED * 0.5, TRASH_SPEED * 1.5)
//   );
// });



export default spawnTrash;
