module.exports = {
  init
}

const steem = require('steem')

function init (authors, percentage) {
  var authors = authors
  var percentage = percentage
  steem.api.setOptions({ url: 'wss://steemd.privex.io' });
  console.log('Initialization of Steem', authors, percentage)
  steem.api.streamOperations(function (err, op) {
    if (op[0] != 'comment') return
    if (op[1].parent_author.length > 0) return
    if (op[1].parent_permlink != 'dtube') return

    console.log(op[1])
    try {
      var a = JSON.parse(op[1].json_metadata)
      if (a && a.video && a.video.content && a.video.content.magnet) {
        var magnet = a.video.content.magnet
        if (authors && authors.indexOf(op[1].author) > -1) {
          window.dispatch('addTorrent', magnet)
          console.log('Added torrent from authors')
          return
        }
        if (percentage && percentage > Math.random()) {
          window.dispatch('addTorrent', magnet)
          console.log('Added torrent from random percentage')
          return
        }
        console.log('ignored torrent')
      } else {
        console.log('ignored video (no magnet)')
      }
    } catch (e) {
      console.log(e)
    }
  });
}
