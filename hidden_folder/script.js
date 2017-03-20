let htp = require('request-promise')

let regex = '<a href="(.+)">';
let test = htp("http://10.11.200.155/.hidden/").then(response => {
  let urlInfo1 = []
  let contentTab = response.split('\n', -1)
  contentTab.forEach(o => { bool = new RegExp(regex, 'g'); if (bool.test(o)) { urlInfo1.push(o.slice(9, 35)) } })
  urlInfo1.pop()
  urlInfo1 = urlInfo1.slice(1)
  let test2 = htp("http://10.11.200.155/.hidden/"+ urlInfo1[22] + '/').then(response1 => {
    let urlInfo2 = []
    let contentTab = response1.split('\n', -1)
    contentTab.forEach(o => { bool = new RegExp(regex, 'g'); if (bool.test(o)) { urlInfo2.push(o.slice(9, 35)) } })
    urlInfo2.pop()
    urlInfo2 = urlInfo2.slice(1)
    urlInfo2.forEach(url2 => {
      let test3 = htp("http://10.11.200.155/.hidden/"+ urlInfo1[22] + '/' + url2 + '/').then(response2 => {
        let contentTab = response2.split('\n', -1)
        contentTab.forEach((o,i) => {
          bool = new RegExp(regex, 'g');
          if (bool.test(o)) {
            let test4 = htp("http://10.11.200.155/.hidden/"+ urlInfo1[22] + '/' + url2 + '/' + o.slice(9, 35) + '/README').then(response3 => {
              let reg = new RegExp('[0-9]', 'g')
              if (reg.test(response3)) {
                console.log("Url = http://10.11.200.155/.hidden/" + urlInfo1[22] + '/' + url2 + '/' + o.slice(9, 35) + '/README');
                console.log("Flag = " + response3)
              }
            }).catch(err => {return})
          }
        })
      })
    })
  })
})

//run the script to get the flag
