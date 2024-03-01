//Server
import http from "http";
import { app } from "./wed";

const port = process.env.PORT  || 3000;
//app
const server = http.createServer(app);


server.listen(port, () => {
    console.log("Server is started ");
  });

  server.listen(port, () => {
    console.log("Server is started ");
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

