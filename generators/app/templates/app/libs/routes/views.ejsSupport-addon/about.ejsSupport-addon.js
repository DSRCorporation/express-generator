const app = require('express')();

app.set('views', 'routes').
app.set('view engine', 'ejs');
app.get('/about', function(req, res){
    res.render('about',{title: "Great User", message:"homepage"});
});