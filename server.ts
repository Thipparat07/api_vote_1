//Server
import http from "http";
import { app } from "./wed";

const port = process.env.PORT || 3000;
//app
const server = http.createServer(app);


server.listen(port, () => {
    console.log("Server is started");
  });


