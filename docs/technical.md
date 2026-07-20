# Technical Architecture

Last Updated: July 18, 2026

---

# Philosophy

RepeatShot is built to be:

- Fast
- Offline-first
- Native-feeling
- Privacy-focused
- Simple to maintain

Version 1 intentionally avoids unnecessary complexity.

No backend.

No authentication.

No cloud sync.

Everything is stored locally on the user's device.

---

# Tech Stack

## Framework

React Native

Expo

TypeScript

---

## Navigation

Expo Router

---

## Local Storage

Expo SQLite

Purpose:

- Store projects
- Store photo metadata
- Store settings

---

## Image Storage

Expo FileSystem

Store all captured images locally.

Images are referenced by URI inside SQLite.

---

## Camera

Expo Camera

Future:

Possible migration to react-native-vision-camera if advanced camera controls become necessary.

---

## State Management

Zustand

Reason:

Simple

Minimal boilerplate

Easy for AI agents to understand

---

## Forms

React Hook Form

Zod validation

---

## Animations

React Native Reanimated

Gesture Handler

---

## Image Rendering

Expo Image

Reason:

Better caching

Better performance

---

## Styling

NativeWind (Tailwind for React Native)

Design tokens stored centrally.

---

## Icons

Lucide React Native

---

## Date Handling

date-fns

---

## Future Services (Not MVP)

Supabase

Cloud Backup

Authentication

Shared Projects

Push Notifications

AI Alignment

Analytics

---

# Folder Structure

/app

/components

/features

/lib

/hooks

/assets

/docs

---

# Core Principles

Offline First

Simple Architecture

No unnecessary abstractions

Small reusable components

Single responsibility

Composition over inheritance

---

# Performance Goals

Launch <2 seconds

Camera opens <1 second

Image capture <500ms

Smooth scrolling

60 FPS animations

---

# Security

No user accounts

No cloud storage

No third-party image processing

No image leaves the device

Privacy first

---

# Development Standards

Use TypeScript everywhere.

Avoid large components.

Prefer reusable components.

One responsibility per component.

Keep business logic out of UI components.

Use custom hooks when appropriate.

Every feature should include loading, empty, and error states.

---

# Out of Scope (MVP)

Android optimization

Cloud sync

Authentication

Payments

AI image alignment

AR anchors

Video editing

Widgets

Social features