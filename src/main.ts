import createMap from './map/index'
import './style.css'
import createPlayer from './player/index'
import k from './kaboom/index'


k.scene('start', () => {
  k.add([k.text('Press to start', { size: 24 }), k.area(), k.origin('center'), k.pos(k.W / 2, k.H / 2), 'begin'])
  k.onClick('begin', () => {
    k.go("game")
  })
})

k.scene('lose', () => {
  k.trashBgm.stop()
  k.add([k.text('You lose! Press to restart', { size: 24 }), k.area(), k.origin('center'), k.pos(k.W / 2, k.H / 2), 'lose'])
  k.onClick('lose', () => {
    k.go("game")
  })
})

k.scene('win', () => {
  k.trashBgm.stop()
  k.add([k.text('You Win! Press to restart', { size: 24 }), k.area(), k.origin('center'), k.pos(k.W / 2, k.H / 2), 'win'])
  k.onClick('win', () => {
    k.go("game")
  })
})

k.scene('game', () => {
  createMap()
  createPlayer()
  
})



k.go('start')
