// const http = require('http');
// const fs = require('fs');
// const url = require('url');
// const slugify = require('slugify');
// const importing = require('./modules/function');
// console.log(importing);
// const readfile = fs.readFileSync(`${__dirname}/json/app.json`, 'utf-8');
// const objectData = JSON.parse(readfile);
// const arr = objectData.map(el=>slugify(el.name , {replacement:'-' , remove : undefined ,lower:true}));
// console.log(arr);
// const Server = http.createServer((req, res) => {
//     const { query, pathname } = url.parse(req.url, true);
//     if (pathname === '/' || pathname === '/overview')
//         res.end("This is the overview here!");
//     else if (pathname === '/product') {
//         console.log(query);
//         res.end("Thsi is the product here!");
//     }
//     else if (pathname === '/api') {
//         res.writeHead(200, {
//             'Content-type': 'application/json'
//         })
//         res.end(readfile);
//     }
//     else {
//         res.writeHead('404', {
//             'Content-type': 'text/html',
//             'My-own-header': 'Hello World',
//             'Name': 'anwar tarek'
//         }) 
//         res.end("<h1>This page is not found !</h1>");
//     }
// })
// Server.listen(8000, '127.0.0.1', () => {
//     console.log("The server is listening on port 8000!");
// })
const { readFileSync } = require('fs');
const http = require('http');
const url = require('url');
let replaceTemplate = (card , obj)=>{
    let output = '';
    output = card.replace(/{% emoji %}/ig,obj.image);
    output = output.replace(/{% card_title %}/ig,obj.productName);
    output = output.replace(/{% quantity %}/ig,obj.quantity);
    output = output.replace(/{% price %}/ig,obj.price);
    output = output.replace(/{% product_id %}/ig , obj.id);
    output = output.replace(/{% country %}/ig,obj.from);
    output = output.replace(/{% nutrients %}/ig, obj.nutrients);
    output = output.replace(/{% quantity %}/ig,obj.quantity);
    output = output.replace(/{%overview%}/ig,'/overview');
    output = output.replace(/{% description %}/ig,obj.description);
    if(!obj.organic)
        output = output.replace(/{% not_organic %}/ig ,'Not_organic');

    return output;
}
// serve json data
const Data = readFileSync(`${__dirname}/json/data.json`,'utf-8');
// parse data into javascript object
const objectData = JSON.parse(Data);
// serve figure file to take data from json file
const figure = readFileSync(`${__dirname}/templates/figure.html`,'utf-8');
// serve overview file
const overview = readFileSync(`${__dirname}/templates/overview.html`,'utf-8');
// serve the detail proguct for each product
const product = readFileSync(`${__dirname}/templates/product.html`,'utf-8');
// The server
const server = http.createServer((req , res)=>{
    const {query , pathname} = url.parse(req.url,true);
    if(pathname === '/' || pathname === '/overview')
    {
        res.writeHead(200,{
            'Content-type':'text/html',
            'My-own-connect':'Hello world'
        })
        const dataMap = objectData.map(ele => replaceTemplate(figure , ele)).join("");
        const serve_overview = overview.replace(/{% figure_overview %}/ig , dataMap);
        res.end(serve_overview);
    }
    else if(pathname === '/product')
    {
        res.writeHead(200,{
            'Content-type':'text/html',
            'My-own-connect':'Hello world',
            "author":'anwar tarek'
        })
        const serve_product =  replaceTemplate(product , objectData[query.id]);
        res.end(serve_product);
    }
    else
    {
        res.end("This page not found!");
    }
    
})

server.listen(8000, "127.0.0.1" ,()=>{
    console.log("Server is listening!");
})