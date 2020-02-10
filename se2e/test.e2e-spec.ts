import { Application } from "spectron";
import { expect } from "chai";
import * as path from "path";

describe("E2E Tests", () => {
  let app;
  before(async () => {
    let electronPath = path.join(
      __dirname,
      "../node_modules",
      ".bin",
      "electron"
    );
    const appPath = path.join(__dirname, "..");
    if (process.platform === "win32") {
      electronPath += ".cmd";
    }

    app = new Application({
      path: electronPath,
      args: [appPath],
      env: {
        ELECTRON_ENABLE_LOGGING: true,
        ELECTRON_ENABLE_STACK_DUMPING: true,
        NODE_ENV: "development"
      },
      chromeDriverArgs: ["--disable-extensions"],
      startTimeout: 20000,
      chromeDriverLogPath: "../chromedriverlog.txt"
    });

    await app.start();
    await app.client.waitUntilWindowLoaded();

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const bounds = await app.browserWindow.getBounds();

    console.log('Window Size:', bounds.width, bounds.height);
    app.browserWindow.maximize();

    const maxBounds = await app.browserWindow.getBounds();
    console.log('Max Window Size:', maxBounds.width, maxBounds.height);

    await app.browserWindow.setSize(1500, 900);
    const myBounds = await app.browserWindow.getBounds();
    console.log('Set Window Size:', myBounds.width, myBounds.height);


  });

  after(() => {
    if (app && app.isRunning()) {
      app.stop();
    }
  });

  it("Should launch the application and open a window", async () => {
    const count = await app.client.getWindowCount();
    expect(count).to.equal(1);
  });

  it("should find new component span", async () => {
    expect(await app.client.$("[e2e=new-component]")).to.be.an("object");
  });
});
