# Copilot Assistant - React App

## Overview
Copilot Assistant is a chat-based Salesforce Copilot built using React. It interacts with the user by providing responses to various commands, such as fetching weather data, telling jokes, and navigating Salesforce records. The app integrates with external APIs for dynamic responses.

## Features

- **Command Handling**: Responds to specific commands like `/help`, `/info`, `/plugin weather`, and `/plugin joke`.
- **Weather Plugin**: Fetches weather data for a city (no API key required).
- **Joke Plugin**: Fetches multiple jokes from the JokeAPI (no API key required).
- **Salesforce Record Navigation**: Allows users to open Salesforce records via record IDs.

## Sample Testing Inputs

### ✅ **General Greetings**
| Input        | Expected Copilot Response                          |
|--------------|----------------------------------------------------|
| `hello`      | 👋 Hello! How can I assist you today?              |
| `hi`         | 👋 Hello! How can I assist you today?              |
| `hey there`  | 👋 Hello! How can I assist you today?              |

---

### ❓ **Help & Info Commands**
| Input        | Expected Copilot Response                                      |
|--------------|----------------------------------------------------------------|
| `/help`      | Try: /info, /plugin weather, or enter a Salesforce Record ID. |
| `/info`      | 🤖 I am your Salesforce Copilot Assistant.                     |
| `/unknown`   | ❓ Unknown command. Try /help.                                  |

---

### 🌤️ **Weather Plugin**
| Input              | Expected Behavior                                              |
|--------------------|----------------------------------------------------------------|
| `weather Delhi`     | Fetches and shows current weather in Delhi                   |
| `/plugin weather`  | Shows funny weather-themed response                           |
| `weather`          | Does nothing or shows error (no city provided)               |

---

### 😂 **Joke Plugin**
| Input        | Expected Behavior                                         |
|--------------|-----------------------------------------------------------|
| `joke`       | Fetches 3 two-part jokes using JokeAPI                    |
| `/plugin joke` | Not supported — returns ❓ Unknown command               |

---

### 🔍 **Salesforce Record ID**
| Input                      | Expected Copilot Response                                      |
|----------------------------|---------------------------------------------------------------|
| `001XXXXXXXXXXXXXXX`       | Shows button to open record, logs ID                          |
| `003ABCDEF123456XYZ`       | Same as above                                                 |

---

### 🧠 **Other Text**
| Input                  | Expected Copilot Response                                    |
|------------------------|--------------------------------------------------------------|
| `random input text`    | 🤖 You said: "random input text". Need help? Try /help.      |

---

## Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd <repo-folder>
2. Install Node Modules 
   ```bash 
   npm install
   npm start
3. Production build 
   ```bash 
   npm run build
   npm install -g serve
   serve -s build

4. Select all files under build folder and create zip file
5. Upload to static resource in salesforce name as "reactcopilot"