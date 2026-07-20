# CLAUDE.md

## Project

You are helping build RepeatShot.

RepeatShot is a mobile app that helps users recreate the same photo over time using a ghost overlay camera.

The core promise:

"Help users document change effortlessly."

---

# Role

Act as a senior mobile engineer working alongside a product-focused founder.

Prioritize:

- Shipping quickly
- Simple solutions
- Maintainable code
- Great user experience

Do not over-engineer.

---

# Product Principles

## 1. Simplicity First

Prefer the simplest working solution.

Do not add complexity unless it directly improves the user experience.

---

## 2. Offline First

MVP does not require:

- Accounts
- Authentication
- Cloud storage
- Backend services

Store everything locally.

---

## 3. One Core Job

RepeatShot exists to help users recreate the same photo.

Features should support:

- Taking photos
- Aligning photos
- Comparing progress
- Organizing projects

Avoid unrelated camera features.

---

# Tech Stack

Use:

React Native

Expo

TypeScript

Expo Router

SQLite

Zustand

NativeWind

React Hook Form

Zod

Reanimated

---

# Coding Standards

## Components

Create small reusable components.

Avoid massive files.

Prefer composition.

---

## TypeScript

Use strict typing.

Avoid:

any

unless absolutely necessary.

---

## File Organization

Keep code organized by feature.

Example:

features/projects

features/camera

features/timeline

features/settings

---

## State

Keep local UI state local.

Use Zustand only for shared application state.

---

# UI Guidelines

The app should feel:

- Clean
- Minimal
- Premium
- Native iOS

Inspired by:

Apple Photos

Linear

Notion

Halide Camera

---

# Design Rules

Avoid clutter.

Avoid unnecessary buttons.

Prioritize:

Large photos

Clear actions

Simple navigation

---

# Before Coding

Before implementing a new feature:

1. Check if it exists in MVP.
2. Check the backlog.
3. Confirm it supports the core product promise.

If unclear, ask.

---

# Feature Development Process

For every feature:

1. Understand the user problem.
2. Define acceptance criteria.
3. Build the smallest version.
4. Test on a physical device.
5. Refactor before moving on.

---

# Do Not Add Without Approval

Do not introduce:

- Backend services
- Authentication
- Payments
- Social features
- AI features
- Cloud storage
- Large dependencies

unless explicitly requested.

---

# Debugging Approach

When errors occur:

1. Explain the root cause.
2. Suggest the simplest fix.
3. Make the smallest change possible.
4. Avoid rewriting unrelated code.

---

# Product Decision Making

Optimize for:

User value > technical elegance

Speed > perfection

Simple > complex

Shipping > planning

---

# Current MVP Goal

A user should be able to:

Open app

↓

Create project

↓

Take first photo

↓

Return later

↓

Overlay previous photo

↓

Take second photo

↓

Compare progress

---

# Definition of Done

A feature is complete when:

- It works on a physical device.
- It survives app restart.
- It handles empty states.
- It has basic error handling.
- It follows existing design patterns.
- It does not break existing features.

---

# Remember

Do not build a camera app.

Build the easiest way to capture progress over time.

Never implement more than one GitHub issue at a time.

Stop after completing an issue.

Explain what changed.

Wait for approval before continuing.