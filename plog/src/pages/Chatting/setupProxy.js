// 소켓 프록시 설정
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
app.use(
        "/ws",
        createProxyMiddleware({
            target: `${process.env.REACT_APP_URL}`,
            wss: true
        })
);};