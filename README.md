# Pipeline Anatomy

An interactive visualizer for exploring a CI/CD pipeline: hover a node to see what it does, click a phase to jump to the written explanation, watch the pipeline build itself step by step if you want to see the flow in motion.

The written reference this is built on lives in a separate repo: [CICD-pipeline-anatomy](https://github.com/nikhilvirdi/CICD-pipeline-anatomy). Read that if you just want the explanation. Use this if you want to explore it.

Scope right now is CI/CD only. Other pipeline types get added later as they're learned, without needing a rewrite.

**Live site:** coming soon.

## Stack

React, Vite, xyflow for the diagram, Motion for the animations, Tailwind for styling, Zustand for shared state. Plain JavaScript, no TypeScript.

## Status

In development. Setup and run instructions land here once there's a working build.