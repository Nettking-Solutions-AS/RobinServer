import express from "express";
import bodyParser from "body-parser";
import { getDailyStats } from "../methods/spot/getDailyStats";
import { getCapitalConfigs } from "../methods/spot/getCapitalConfigs";
import { getLiveCandleDataFeed } from "../methods/websocket/getLiveCandleDataFeed";
import { db } from "../../../firebase/Config";

const router = express.Router();

const jsonParser = bodyParser.json();

router.post("/getLiveCandleDataFeed", jsonParser, async (req, res) => {
  if (req.body) {
    const userID = req.body.userID;

    let apiKey, apiSecret;

    // Her kan du hente ut req.body.userID og bruke den videre for å hente accountInformation til den brukeren.
    if (!userID) {
      res.send(404);
    }

    try {
      const userRef = db.collection("users").doc(userID);
      const doc = await userRef.get();
      if (!doc.exists) {
        console.log("No such document!");
      } else {
        apiKey = doc.data().APIKey;
        apiSecret = doc.data().APISecret;

        res.send(await getLiveCandleDataFeed(apiKey, apiSecret));
      }
    } catch (e) {
      console.error(e);
      res.send({ error: e, code: 500 });
    }
  } else {
    res.status(500).send("Body is required");
  }
});

//This API call is resource expensive
router.post("/getDailyStats", jsonParser, async (req, res) => {
  if (req.body) {
    const apiKey = req.body.apiKey;
    const apiSecret = req.body.apiSecret;

    console.log({ apiKey, apiSecret });

    if (!apiKey || !apiSecret) {
      res.send(404);
    } else {
      res.send(await getDailyStats(apiKey, apiSecret));
    }
  }
});

router.post("/getCapitalConfigs", jsonParser, async (req, res) => {
  if (req.body) {
    const apiKey = req.body.apiKey;
    const apiSecret = req.body.apiSecret;

    // Her kan du hente ut req.body.userID og bruke den videre for å hente accountInformation til den brukeren.
    if (!apiKey || !apiSecret) {
      res.send(404);
    }

    try {
      res.send(await getCapitalConfigs(apiKey, apiSecret));
    } catch (e) {
      console.error(e);
      res.send({ error: e, code: 500 });
    }
  } else {
    res.status(500).send("Body is required");
  }
});

router.post("/getExchanges", jsonParser, async (req, res) => {
  if (req.body) {
    const userID = req.body.userID;

    // Her kan du hente ut req.body.userID og bruke den videre for å hente accountInformation til den brukeren.
    if (!userID) {
      res.send(404);
    }

    try {
      const exchangesRef = db
        .collection("exchanges")
        .where("userIds", "array-contains", userID);
      const doc = await exchangesRef.get();
      const exchanges = doc.docs.map((d) => d.data());

      res.send(exchanges);
    } catch (e) {
      console.error(e);
      res.send({ error: e, code: 500 });
    }
  } else {
    res.status(500).send("Body is required");
  }
});

export default router;
