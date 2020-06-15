// var cheerio = require('cheerio')
// var html = `
// <body>
// <script src="someUrl" type="text/javascript" />
// <script src="someUrl" type="text/javascript" />
// <script src="someUrl" type="text/javascript" />
// <script type="text/javascript"> var months = [6,12,24,36,408,600]; months = [6,12,24,36,48,60]; var amounts = [5000,10000,15000,20000,25000]</script>
// </body>
// `
// var str, $ = cheerio.load(html, {xmlMode: true}); // xmlMode: true is a workaround for many cheerio bugs.
// str = $('script:not([src])')[0].children[0].data
// var months = str.match(/months = (\[.*?\])/g)[1]
// console.log(months)
// // [ 6, 12, 24, 36, 48, 60 ]
// var amounts = JSON.parse(str.match(/amounts = (\[.*?\])/)[1])
// console.log(amounts)
// // [ 5000, 10000, 15000, 20000, 25000 ]

obj={};
var params= new String(`{domain:Abcd-E-Group,domaintype:com,Submit1:Search}, 
  {domain:Abcd-E-Group,domaintype:com,Submit1:Search},
  ` );

var KeyVal = params.split("}");

var i;
// for (object in KeyVal) {
// const items = KeyVal[object].split(",");

// for( i in items){
//   const key = items[1].split(':')
// }

// KeyVal[object] = KeyVal[object].split(",");

// obj[KeyVal[i][0]]=KeyVal[i][1];
// }
console.log(KeyVal)
console.log(JSON.parse(params))

KeyVal.forEach