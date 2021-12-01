import '../kaboom/index'
import type {Character} from 'kaboom'
type posType={
  x:number,y:number
}
// 血条
const healthPoint = (position:posType, health:number, obj:Character) => {
  const hpBar:Character = add([
    rect(width(), 24),
    pos(position.x, position.y),
    color(127, 255, 127),
    fixed(),
    layer("ui"),
    {
      max: health,
      set(hp: number) {
        hpBar.width = (width() * hp) / hpBar.max;
        hpBar.flash = true;
      },
    },
  ]);
  hpBar.action(() => {
    if (hpBar.flash) {
      hpBar.color = rgb(255, 255, 255);
      hpBar.flash = false;
    } else {
      // 绿色
      // hpBar.color = rgb(127, 255, 127);
      // rgb(255 0 0) 红色
      let p = hpBar.width / width();
      let r = parseInt(String(127 + (255 - 127) * (1 - p)));
      let g = parseInt(String(0 + 255 * p));
      let b = parseInt(String(0 + 127 * p));
      hpBar.color = rgb(r, g, b);
    }
  });

  obj.on("hurt", () => {
    hpBar.set(obj.hp());
  });
};

export default healthPoint