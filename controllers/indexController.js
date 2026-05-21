const IndexController = (app) => {
  app.get("/", (req, res) => {
    res.send(`
          <h1>Rubi Keys API</h1>
          `);
  });
};

export default IndexController;
