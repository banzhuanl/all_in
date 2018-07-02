module.exports={
    url: 'mongodb://127.0.0.1:27017/shuc',
    session:{
        name: 'shuc',
        secret: 'shuc',
        cookie: {
			httpOnly: true,       //浏览器不允许脚本操作 document.cookie 去更改 cookie,避免xss攻击
		    secure:   false,      //可靠的，为true只能用https协议发送cookie
		    maxAge:   60 * 24 * 60 * 60 * 1000,
		}
    }
}