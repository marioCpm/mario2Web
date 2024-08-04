// middleware/errorHandler.js
export default function errorHandler(handler) {
    return async (req, res) => {
      try {
        await handler(req, res);
      } catch (error) {
        console.log("Error from error handler!!");
        console.log("Error from error handler!!");
        console.log(error);
        console.log("Error from error handler!!");
        console.log("Error from error handler!!");

        if (error.code === 'ERR_EXPIRED_ACCESS_TOKEN') {
          //console.log("Redirecting to login!!");
          res.status(200).json({ message: "EXPIRED_ACCESS_TOKEN" });

        }
        if (error.status == 500){
          //console.log("wakeUp Starts here");
          res.status(200).json({ message: "SERVER_SLEEP" });
        } 
        else {
          res.status(error.status || 500).json({ message: error.message });
        }
      }
    };
  }
  