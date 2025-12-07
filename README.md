# PressRadar  - Intelligent News Tracking & Research Tool

## Overview
I developed this project to solve a specific problem: tracking niche news topics efficiently. When conducting research or market analysis, manually checking different newspapers and e-papers is time-consuming. **PressRadar AI** automates this process.

This tool scans the web to find the latest news regarding any topic I provide. The best part is its multilingual capability—it can generate summaries in English, Hindi, and Marathi.

## Why I Built This?
Personally, I needed a utility that could daily monitor my specific research topics (like stock market fluctuations or political updates) without me having to manually visit 10 different websites every morning.

## Key Features
- **Smart Tracking:** Scans web sources and e-papers to extract relevant news.
- **Multilingual Summaries:** Summarizes results in Hindi, Marathi, or English based on preference.
- **Source Verification:** Provides original source links with every news item to maintain credibility.
- **Research Focused:** Prioritizes factual accuracy over opinion pieces.

## Tech Stack
I used the following technologies to build this project:
- **Frontend:** React.js (for fast and responsive UI development)
- **Styling:** Tailwind CSS (for a clean, modern aesthetic)
- **AI Intelligence:** Gemini API (Leveraging Google Search Grounding to fetch real-time data)

## How It Works
1. **Topic Input:** I simply enter my topic (e.g., "Tata Motors Share Price").
2. **AI Processing:** The backend AI model (Gemini 2.5 Flash) performs a live web search.
3. **Data Extraction:** Relevant articles and sources are extracted.
4. **Summary Generation:** A clean summary is generated in the selected language.

## Future Plans
- Add a "Saved Stories" feature to archive past research.
- Integrate email notifications for daily alerts.

---
*Created for personal research and news aggregation purposes.*
