#!/usr/bin/env tsx

import { orchestratorService } from "./workers/orchestrator/src/index.js";

const brief = process.argv[2] || "I'm a Jatt father looking for names that would complement my own (Ajay) and my wife's (Yamini)";

console.log("Starting baby name generation pipeline...");
console.log("Brief:", brief);
console.log("\n" + "=".repeat(80) + "\n");

const run = orchestratorService.startRun(brief, "parallel");

// Subscribe to all events
orchestratorService.subscribe(run.id, (event) => {
  switch (event.t) {
    case "activity":
      console.log(`[${event.agent}] ${event.msg}`);
      break;
    case "start":
      console.log(`[${event.agent}] Starting research on: ${event.name}`);
      break;
    case "done":
      console.log(`[${event.agent}] Completed: ${event.name}`);
      break;
    case "log":
      console.log(`[${event.agent}] LOG: ${event.msg}`);
      break;
    case "partial":
      if (event.field === "card" && event.name) {
        console.log(`[${event.agent}] ✓ Generated NameCard for: ${event.name}`);
      }
      break;
    case "result":
      console.log(`[${event.agent}] ✓ Stage complete`);
      break;
    case "error":
      console.error(`[${event.agent}] ERROR: ${event.msg}`);
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
    console.log("\n" + "=".repeat(80));
    console.log("PIPELINE COMPLETE!");
    console.log("=".repeat(80) + "\n");

    if (currentRun.result) {
      console.log("RESULTS:");
      console.log(JSON.stringify(currentRun.result, null, 2));
    }
    process.exit(0);
  } else if (currentRun.status === "failed") {
    clearInterval(checkCompletion);
    console.error("\n" + "=".repeat(80));
    console.error("PIPELINE FAILED!");
    console.error("Error:", currentRun.error);
    console.error("=".repeat(80));
    process.exit(1);
  }
}, 100);