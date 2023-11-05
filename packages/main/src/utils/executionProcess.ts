import {type ChildProcess, spawn, type SpawnOptions} from 'child_process';
import { SupportedLanguages} from '@shared/utils/enums/supportedLanguagesEnum';
import {path} from 'path';

export default class ExecutionProcess {
  executionProcess: ChildProcess;
  clientScriptsDir: string = 'storage/client/scripts'; //check that it will work on different platforms.
  processConfig: SpawnOptions = {
    windowsHide: true,
    // signal:
    // shell: true,
    timeout: 5000,
  };

  constructor(language: SupportedLanguages, clientId: string) {
    const executionCommand = this.getExecutionCommand(language, clientId);
    this.executionProcess = spawn(executionCommand, this.processConfig);
    this.setupProcessListener();
  }


  private getExecutionCommand(language: SupportedLanguages, clientId: string): string {
    const clientScriptFile = this.getClientFile(clientId);
    switch(language) {
      case SupportedLanguages.JAVASCRIPT:
        return `node ${clientScriptFile}`;
        break;
      case SupportedLanguages.PYTHON:
        return `python ${clientScriptFile}`;
        break;
      case SupportedLanguages.PHP:
        return ``;
        break;
      case SupportedLanguages.CPP:
        // return `g++ ${clientScriptFile}`;
        break;
      default:
        break;
    }
  }


  private getClientFile(clientId: string): string {
    return path(__dirname, this.clientScriptsDir, clientId);
  }

  private setupProcessListener(): void {
    this.executionProcess?.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    this.executionProcess?.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    this.executionProcess.on('close', (code) => {
      console.log(`Child process exited with code ${code}`);
    });

  }

  public killProcess(): boolean {
    const result = this.executionProcess.kill();
    if (result) {
      console.log('Process Killed Successfully ...');
    } else {
      console.log('Process Kill Attempt Failed.');
    }
    return result;
     //appearently its not as straightforward...
  }
}

// const cmdCommand = 'your-command-here';
// const cmdArgs = cmdCommand.split(' ');
// const childProcess = spawn('cmd.exe', ['/c', ...cmdArgs], { shell: true });

// Listen for stdout and stderr data from the child process
