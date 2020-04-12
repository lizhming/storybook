import { exec, spawn, SpawnOptions } from 'child_process';
import { statSync } from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { remove, ensureDir, pathExists } from 'fs-extra';

const logger = console;

export function getCLIRunner(path: string): (command: string) => Promise<void> {
  return async (command: string) => {
    return execCustom(command, [], { cwd: path }).then(() => {});
  };
}

// return new Promise((resolve, reject) => {
//   exec(
//     command,
//     {
//       cwd: path,
//     },
//     (e) => {
//       if (e !== null) {
//         reject(e.toLocaleString());
//       }
//       logger.log(`Successfully Ran command: "${command}"`);
//       resolve();
//     }
//   );
// });

const execCustom = async (command: string, args: string[] = [], options: SpawnOptions = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      ...options,
      stdio: 'inherit',
      shell: true,
    });

    child
      .on('close', (code) => {
        if (code) {
          reject();
        } else {
          resolve();
        }
      })
      .on('error', (e) => {
        logger.error(e);
        reject();
      });
  });

export async function initDirectory(path: string): Promise<void> {
  if (await pathExists(path)) {
    await cleanDirectory(path);
  }

  return ensureDir(path);
}

export function cleanDirectory(path: string): Promise<void> {
  return remove(path);
}
