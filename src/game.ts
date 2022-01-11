import * as ui from '@dcl/ui-scene-utils'

import { getConnectedPlayers } from '@decentraland/Players'
import { getCurrentRealm } from '@decentraland/EnvironmentAPI'

let visiblePlayers: string[] = []

getConnectedPlayers().then((players) => {
  players.forEach((player) => {
    visiblePlayers.push(player.userId)
  })
  playerCounter.set(visiblePlayers.length)
})

onPlayerConnectedObservable.add((player) => {
  visiblePlayers.push(player.userId)
  playerCounter.set(visiblePlayers.length)
  log('player CONNECTED: ', player, ' FULL LIST: ', visiblePlayers)
})
onPlayerDisconnectedObservable.add((player) => {
  log('USER DISCONNECTED: ', player.userId)

  const index = visiblePlayers.indexOf(player.userId, 0)
  if (index > -1) {
    visiblePlayers.splice(index, 1)
  }
  playerCounter.set(visiblePlayers.length)
})

let playerLabel = new ui.CornerLabel('Players connected', -150, 300)
let playerCounter = new ui.UICounter(0, -20, 300)

let islandLabel = new ui.CornerLabel('Island: undefined', -150, 350)

const realm = getCurrentRealm().then((realmData) => {
  islandLabel.set('Island: ' + realmData?.displayName)
})

onRealmChangedObservable.add((realmData) => {
  if (!realmData.room) {
    log('NO ROOM DATA')
    return
  }
  islandLabel.set('Island: ' + realmData?.displayName)
  log('PLAYER CHANGED ISLAND TO ', realmData.room)
})
