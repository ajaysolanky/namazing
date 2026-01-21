#!/usr/bin/env tsx

import { orchestratorService } from "./workers/orchestrator/src/index.js";
import ora from 'ora';
import chalk from 'chalk';

const brief = process.argv[2] || "I'm a Jatt father looking for names that would complement my own (Ajay) and my wife's (Yamini)";

console.log(chalk.bold.blue("\nNamazing Pipeline"));
console.log(chalk.dim("=".repeat(60)));
console.log(chalk.bold("Brief: ") + brief);
console.log(chalk.dim("=".repeat(60)) + "\n");

const run = orchestratorService.startRun(brief, "parallel");

const AGENT_DISPLAY_NAMES: Record<string, string> = {
  "brief-parser": "Parsing Brief",
  "generator": "Generating Names",
  "researcher": "Researching Names",
  "expert-selector": "Selecting Finalists",
  "report-composer": "Composing Report"
};

let currentSpinner = ora('Initializing...').start();
let currentAgent = '';

// Subscribe to all events
orchestratorService.subscribe(run.id, (event) => {
  // Update spinner prefix if agent changes
  if (event.agent && event.agent !== currentAgent && AGENT_DISPLAY_NAMES[event.agent]) {
    if (currentAgent) {
      // We don't necessarily want to succeed the previous one here, 
      // as agents might interleave or run in parallel in theory,
      // but for this pipeline they are mostly sequential stages.
      // Let's just update the text for now.
    }
    currentAgent = event.agent;
    currentSpinner.text = `${chalk.bold(AGENT_DISPLAY_NAMES[event.agent])}: Starting...`;
  }

  switch (event.t) {
    case "activity":
      if (AGENT_DISPLAY_NAMES[event.agent]) {
         currentSpinner.text = `${chalk.bold(AGENT_DISPLAY_NAMES[event.agent])}: ${event.msg}`;
      }
      break;
      
    case "start":
      // Specifically for researcher which starts items
      if (event.agent === 'researcher') {
        currentSpinner.text = `${chalk.bold(AGENT_DISPLAY_NAMES[event.agent])}: Researching ${chalk.cyan(event.name)}...`;
      }
      break;

    case "done":
       // Individual item completion
       if (event.agent === 'researcher') {
         // Optional: print a checkmark for each name without stopping spinner
         // currentSpinner.stopAndPersist({ symbol: chalk.green('✔'), text: `Researched ${event.name}` });
         // currentSpinner.start();
       }
      break;

    case "log":
      // Debug logs, maybe skip in default view or show as dim
      // currentSpinner.stopAndPersist({ symbol: chalk.dim('ℹ'), text: chalk.dim(event.msg) });
      // currentSpinner.start();
      break;

    case "partial":
      if (event.field === "card" && event.name) {
        // Stop spinner momentarily to print the found name
        currentSpinner.stopAndPersist({
            symbol: chalk.green('✔'), 
            text: `${chalk.bold(event.name)}` 
        });
        currentSpinner.start();
        currentSpinner.text = `${chalk.bold(AGENT_DISPLAY_NAMES[event.agent])}: Continuing research...`;
      }
      break;

    case "result":
      if (AGENT_DISPLAY_NAMES[event.agent]) {
          currentSpinner.succeed(`${chalk.bold(AGENT_DISPLAY_NAMES[event.agent])}: Complete`);
          currentSpinner.start(); // Start new spinner for next steps or just idle
      }
      break;

    case "error":
      currentSpinner.fail(`${chalk.bold(AGENT_DISPLAY_NAMES[event.agent] || event.agent)}: ${event.msg}`);
      break;
  }
});

// Wait for completion
const checkCompletion = setInterval(() => {
  const currentRun = orchestratorService.getRun(run.id);
  if (!currentRun) {
    clearInterval(checkCompletion);
    return;
  }

  if (currentRun.status === "completed") {
    clearInterval(checkCompletion);
    currentSpinner.stop();
    
    console.log(chalk.bold.green("\n" + "=".repeat(60)));
    console.log(chalk.bold.green("PIPELINE COMPLETE!"));
    console.log(chalk.bold.green("=".repeat(60)) + "\n");

    if (currentRun.result) {
      const { selection, report } = currentRun.result;
      
      console.log(chalk.bold.magenta("Finalists:"));
      console.table(selection.finalists.map((f: any) => ({
          Name: f.name,
          Why: f.why.substring(0, 50) + (f.why.length > 50 ? '...' : ''),
          Combo: f.combo ? `${f.combo.first} ${f.combo.middle}` : ''
      })));

      console.log(chalk.bold.blue("\nSummary:"));
      console.log(chalk.italic(report.summary));
      
      if (selection.near_misses && selection.near_misses.length > 0) {
          console.log(chalk.bold.yellow("\nNear Misses:"));
          selection.near_misses.forEach((nm: any) => {
              console.log(`- ${chalk.bold(nm.name)}: ${nm.reason}`);
          });
      }
    }
    process.exit(0);
  } else if (currentRun.status === "failed") {
    clearInterval(checkCompletion);
    currentSpinner.fail("Pipeline Failed");
    console.error(chalk.red("\n" + "=".repeat(60)));
    console.error(chalk.bold.red("PIPELINE FAILED!"));
    console.error(chalk.red("Error:"), currentRun.error);
    console.error(chalk.red("=".repeat(60)));
    process.exit(1);
  }
}, 100);
