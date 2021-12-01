import k from "../kaboom/index";
import bg_s from "./bg.png";
import type {Character} from 'kaboom'
k.loadSprite("bg", bg_s);
// 地图
const createMap = () => {
  let map_speed:number = 100;
  const MAP_WIDTH:number = 564;
  const MAP_HEIGHT:number = 890
  const posY:number = -k.height();
  const bg:Character = k.add([
    k.sprite("bg", { tiled:true, width: MAP_WIDTH, height: MAP_HEIGHT * 2 }),
    k.area({ width: MAP_WIDTH, height: MAP_HEIGHT*2}),
    k.layer("bg"),
    k.move(k.DOWN, map_speed),
    k.pos(0, posY),
    {
      update() {
        if (bg.pos.y >= 0) {
          bg.pos.y = posY;
        }
      }
    },
  ]);
  k.keyPress(["up","w"], () => {
    map_speed = 400;
  });
  k.keyRelease(["up","w"], () => {
    map_speed = 100;
  });
  bg.action(() => {
    bg.moveTo(0, 0, map_speed);
  });
};

export default createMap