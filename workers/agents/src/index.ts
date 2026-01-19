export interface AgentCallConfig {
  model: string;
  temperature?: number;
}

export interface AgentTask {
  id: string;
  name: string;
  instructionPath: string;
  config: AgentCallConfig;
}

/**
 * Placeholder registry for agent definitions. Wire to actual LLM runners when ready.
 */
export const agentRegistry: AgentTask[] = [
  {
    id: "brief-parser",
    name: "Brief Parser",
    instructionPath: "packages/prompts/brief-parser.md",
    config: { model: "anthropic/claude-3.5-sonnet", temperature: 0.2 },
  },
  {
    id: "name-generator",
    name: "Name Generator",
    instructionPath: "packages/prompts/name-generator.md",
    config: { model: "openai/gpt-4.1", temperature: 0.6 },
  },
];
