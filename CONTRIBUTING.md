# Contributing to Luminary

Thank you for your interest in contributing to **Luminary** — an open, customizable AI chatbot starter kit for modern developers.

We welcome issues, discussions, suggestions, and pull requests! 🚀


<br />

## 🧠 Before You Start

- Familiarize yourself with the structure of the project (see `README.md`).
- Use consistent formatting (`prettier`, `eslint`, `shadcn/ui` conventions).
- Stick to **strict TypeScript**. No `any` unless absolutely required and justified.
- PRs should be atomic — fix or feature focused.
- Respect the project's minimal, modern, and dark-friendly design ethos.

<br />
<br />
<br />

## 🚀 Getting Started

1. Fork the repository.
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/luminary-ai-kit.git
   cd luminary-ai-kit
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Run the dev server:
   ```bash
   pnpm dev
   ```

5. Create a `.env.local` file from `.env.example` and add your API keys:
   ```
   OPENROUTER_API_KEY=your_key
   GROQ_API_KEY=your_key
    ```

<br />
<br />


## 📁 Code Structure Overview

- `src/app` — App routing and layout structure
- `src/components` — Core components
- `src/components/ui` — shadcn/ui-based UI primitives
- `src/lib` — Utility functions, tool logic, and code execution handlers
- `src/hooks` — Custom React hooks
- `src/store` — Persistent client-side state (via localStorage)
- `src/app/api/chat` — Main chat logic and system prompt

<br />
<br />

## 📌 Submitting Changes

- Branch off from main or dev.
- Use conventional commits (e.g. feat: add system prompt config).
- Lint and format your code before submitting:
  ```bash
  pnpm lint
  pnpm format
  ```

- Keep PRs small, focused, and clearly documented.


<br />


## 💡 Want to Add a Tool?

1. Create it in `src/lib/tools/<tool-name>.ts`.
2. Define the tool behavior and execution logic.
3. Register the tool in `src/lib/tools/index.ts`.
4. Use `zod` for input validation and UI schema generation.
5. Test locally and document usage in the source code while you're working for easier reviewing later on.

---

<br />
<br />
<br />

## 🙏 Thanks!

Thanks for helping improve Luminary! We’re excited to build something great together.
