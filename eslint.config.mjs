import nextConfig from "eslint-config-next"

const eslintConfig = [
  { ignores: ["coverage/**", "**/coverage/**", ".worktrees/**", ".claude/worktrees/**", ".playwright-mcp/**"] },
  ...nextConfig,
  {
    rules: {
      // These are valid React patterns; downgrade React Compiler strictness to warnings
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]

export default eslintConfig
