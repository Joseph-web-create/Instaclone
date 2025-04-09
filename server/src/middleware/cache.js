import NodeCache from "node-cache";

export const cache = new NodeCache({
  stdTTL: 600,
  checkperiod: 620, //
  useClones: false, // better performance
});

export const cacheMiddleware =
  (key, ttl = 600) =>
  async (req, res, next) => {
    //create a unique key based out api routes and qury parameter

    const cacheKey = `${key}_${req.originalUrl}_${JSON.stringify(req.query)}`;

    try {
      const cacheData = cache.get(cacheKey); //retrive key/save data

      if (cacheData) {
        console.log(`Cache key for:"${cacheKey}`);
        return res.json(cacheData); //sending saved response back to client
      }

      //try to save response
      const originalUrl = res.json;
      //overide res.json method to cache the response

      res.json = function (data) {
        //cache the response data

        cache.set(cacheKey, data, ttl);
        console.log(`Cache set for key: ${cacheKey}`);
        //call the original json method

        return originalUrl.call(this, data);
      };
      next();
    } catch (error) {
      console.error("Cache error", error);
      next();
    }
  };

export const clearCache = (pattern = null, clearAll = false) => {
  const keys = cache.keys();
  // clears all cached data from node memory

  if (clearAll) {
    keys.forEach((key) => cache.del(key));
    console.log(`Cleared all cache entries`);
    return;
  }

  //this will ckear cached data based on matched keys

  const matchingKeys = pattern
    ? keys.filter((key) => key.includes(pattern))
    : keys;

  matchingKeys.forEach((key) => cache.del(key));
  console.log(`Cleared ${matchingKeys.length} cache entries`);
};
