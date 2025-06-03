# 📖 Devotio

[![Netlify Status](https://api.netlify.com/api/v1/badges/b8617661-4b06-47ee-9123-4ee1fc7a996e/deploy-status)](https://app.netlify.com/projects/devotio-app/deploys)
[![Angular v17](https://img.shields.io/badge/Angular-17-red)](https://angular.io/)
[![Ionic v7](https://img.shields.io/badge/Ionic-7-blue)](https://ionicframework.com/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Status: In Progress](https://img.shields.io/badge/status-in--development-yellow)]()

> A mobile-first devotional app for Reformed Christians, built with Angular 17 and Ionic. Stay connected to your spiritual walk through personalized devotionals, prayer tracking, and community features.

---

## 📚 Table of Contents

- [Overview](#-overview)
- [Project Structure](#-project-structure)
- [Technologies](#-technologies)
- [Getting Started](#-getting-started)
- [Building for Production](#-building-for-production)
- [Generating Native Apps](#-generating-native-apps)
- [License](#-license)
- [Author](#-author)

---

## 📱 Overview

Devotio is a progressive web and mobile app designed to enhance the devotional life of Reformed believers. It combines modern UI with features such as:

- ✝️ Daily devotionals powered by biblical APIs
- 🙏 Prayer tracking and reminders
- 🤝 Community and feed interaction
- 🎶 Traditional music and radio streaming
- 📊 Personalized insights based on user behavior
- 🔒 Local data storage with optional sync

---

## 🏗 Project Structure


---

## 🧱 Technologies

- Angular 17 (with Standalone Components)
- Ionic Framework v7
- RxJS
- TypeScript + SCSS
- PWA (Progressive Web App) with service workers
- Capacitor (for Android/iOS deployment)

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run in development mode

```bash
ionic serve
```

### 3. Or directly with Angular CLI

```bash
ng serve
```

### 📦 Building for Production

```bash
ionic build --prod
```

### 📲 Generating Native Apps

Ensure Capacitor is properly configured:

```bash
ionic cap add android
ionic cap sync
ionic cap build android
```

For iOS:

```bash
ionic cap add ios
ionic cap open ios
```

### 📄 License

Made with ❤️, code & purpose by ZapfCorp
“Soli Deo Gloria”
