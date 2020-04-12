import { cleanDirectory, getCLIRunner, initDirectory } from '../utils/command';

const logger = console;
const defaultAngularCliVersion = 'latest';

let angularCliVersions = process.argv.slice(2);

if (!angularCliVersions || angularCliVersions.length === 0) {
  angularCliVersions = [defaultAngularCliVersion];
}

angularCliVersions.forEach(async (angularVersion) => {
  logger.info(`📡 Starting E2E for Angular ${angularVersion}`);

  const basePath = `${__dirname}/tests-run-angular-${angularVersion}`;
  const appName = 'e2e-test-application';
  const testAppPath = `${basePath}/${appName}`;

  const runInE2EFolder = getCLIRunner(basePath);
  const runInTestAppFolder = getCLIRunner(`${testAppPath}`);

  await initDirectory(basePath);

  // Generate Angular app
  await generateAngularAppWithAngularCLI(angularVersion);

  // Init SB
  logger.info(`🎨 Adding Storybook with @storybook/cli@next`);
  await runInTestAppFolder('npx -p @storybook/cli sb init --skip-install --yes');

  // FIXME: Move this deps to @storybook/angular
  logger.info(`🌍 Adding needed deps & installing all deps`);
  await runInTestAppFolder(
    'yarn add -D react react-dom http-server cypress @cypress/webpack-preprocessor concurrently'
  );

  await setupCypressTests();

  logger.info(`👷 Building SB`);
  await runInTestAppFolder('yarn build-storybook');

  logger.info(`🤖 Executing Cypress tests`);
  await runInTestAppFolder(
    'yarn concurrently --success first --kill-others "cypress run" "yarn http-server ./storybook-static -p 8001 --silent"'
  );

  logger.info(`🗑 Cleaning test dir for Angular ${angularVersion}`);
  await cleanDirectory(basePath);

  logger.info(`🎉 Storybook is working great with Angular ${angularVersion}!`);

  /**
   *
   * @param packageVersion
   */
  function generateAngularAppWithAngularCLI(packageVersion = 'v8-lts'): Promise<void> {
    logger.info(`🏗 Bootstraping Angular project with @angular/cli@${packageVersion}`);

    return (
      runInE2EFolder('echo "{}" > package.json')
        .then(() => runInE2EFolder(`yarn add @angular/cli@${packageVersion}`))
        .then(() =>
          runInE2EFolder(
            `yarn ng new ${appName} --routing=true --minimal=true --style=scss --skipInstall=true`
          )
        )
        // .then(() =>
        //   logger.info(
        //     `✅  Successfully bootstrap Angular project with @angular/cli@${packageVersion}`
        //   )
        // )
        .catch((e) => {
          logger.error(`Error during Angular App bootstrapping for ${packageVersion}`);
          throw e;
        })
    );
  }

  function setupCypressTests() {
    logger.info(`🎛 Setup Cypress tests`);

    return (
      runInTestAppFolder('echo "{}" > cypress.json')
        .then(() => runInTestAppFolder('cp -R ../../../cypress-tests cypress'))
        // .then(() => logger.info(`✅  Successfully setup Cypress tests`))
        .catch((e) => {
          logger.error(`Error during Cypress tests setup`);
          throw e;
        })
    );
  }
});
