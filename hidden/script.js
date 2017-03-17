var http = require('http');
var fs = require('fs');

var regex = '<a href="(.+)">';

var test = http.request("http://10.11.200.155/.hidden/", response => {
  var lol = new Promise((resolve, reject) => {
    var content
    var urlInfo1 = []
    response.on("data", chunk => { content += chunk })
    response.on("end",() => {
      var contentTab = content.split('\n', -1)
      contentTab.forEach(o => { bool = new RegExp(regex, 'g'); if (bool.test(o)) { urlInfo1.push(o.slice(9, 35)) } })
      urlInfo1.pop()
      urlInfo1 = urlInfo1.slice(1)
      resolve(urlInfo1)
    })
  })

  lol.then(res => {
    var test2 = http.request("http://10.11.200.155/.hidden/"+ res[22] + '/', response => {
      var nextPromise  = new Promise((resolve, reject) => {

        var content
        var urlInfo2 = []
        response.on("data", chunk => { content += chunk })
        response.on("end",() => {
          var contentTab = content.split('\n', -1)
          contentTab.forEach(o => { bool = new RegExp(regex, 'g'); if (bool.test(o)) { urlInfo2.push(o.slice(9, 35)) } })
          urlInfo2.pop()
          urlInfo2 = urlInfo2.slice(1)
          resolve(urlInfo2)
        })
      })
      nextPromise.then(res1 => {
        console.log(res1[8]);
    //    res1.forEach(url2 => {
          var test3 = http.request("http://10.11.200.155/.hidden/"+ res[23] + '/' + res1[8] + '/', response => {
            var content
            response.on("data", chunk => { content += chunk })
            response.on("end",() => {
              var contentTab = content.split('\n', -1)
              var promiseTab = []
              contentTab.forEach((o,i) => { bool = new RegExp(regex, 'g');
              if (bool.test(o) ) {

                promiseTab.push(new Promise((resolve, reject) => {
                  var test4 = http.get("http://10.11.200.155/.hidden/"+ res[23] + '/' + res[8] + '/' + o.slice(9, 35) + '/README' , response1 => {
                    var file = fs.createWriteStream("file.txt");
                    response1.pipe(file);
                    fs.readFile('file.txt', 'utf8', (err, data) => {
                      resolve(data)
                    })
                  })
                }))
              }
            })
            Promise.all(promiseTab).then(res => {
              console.log(res);
            })
          })
        })
        test3.end()
//      })
    })
  })
  test2.end()
})
})
test.end()
