# Copilot Assistant - React Copilot

## Overview
Copilot Assistant is a chat-based using React. It interacts with the user by providing responses to various commands, such as fetching weather data, telling jokes, and navigating Salesforce records. The app integrates with external APIs for dynamic responses.

## Key Benefits of Integration
- Enhanced User Experience: By embedding the React app in Salesforce, users can access advanced chat-based functionality directly within their Salesforce workspace.
- Dynamic Responses: The integration of external APIs allows the app to provide real-time, dynamic responses to user commands.
- Seamless Navigation: The ability to navigate Salesforce records directly from the app streamlines workflows and improves productivity.

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

## Salesforce Lightning Container Integration

To embed the React Copilot app in Salesforce, use the Lightning Container Component. This allows the app to communicate with Salesforce using the `postMessage` API.

### Steps to Integrate

1. **Create a Lightning Component**:
   ```xml
   <aura:component implements="flexipage:availableForAllPageTypes" access="global">
       <lightning:container src="{!$Resource.reactcopilot + '/index.html'}"
                            onmessage="{!c.handleMessage}"
                            aura:id="reactContainer" />
   </aura:component>
   ```

2. **Add a Controller to Handle Messages**:
   ```javascript
   ({
       handleMessage: function(component, event, helper) {
           const message = event.getParam("message");
           console.log("Message received from React app:", message);

           // Example: Handle Salesforce record navigation
           if (message.type === "navigateToRecord") {
               const recordId = message.recordId;
               const navService = component.find("navigationService");
               navService.navigate({
                   type: "standard__recordPage",
                   attributes: {
                       recordId: recordId,
                       actionName: "view"
                   }
               });
           }
       }
   })
   ```

3. **Send Messages from React App**:
   Use the `postMessage` API in your React app to communicate with Salesforce:
   ```javascript
   const sendMessageToSalesforce = (message) => {
       window.parent.postMessage(message, "*");
   };

   // Example: Send a record navigation message
   sendMessageToSalesforce({
       type: "navigateToRecord",
       recordId: "001XXXXXXXXXXXXXXX"
   });
   ```

4. **Test the Integration**:
   - Deploy the Lightning Component to Salesforce.
   - Add it to a Lightning page.
   - Interact with the React app and verify communication via `postMessage`.

### Example PostMessage Payload
```json
{
   "type": "navigateToRecord",
   "recordId": "001XXXXXXXXXXXXXXX"
}
```

This payload instructs Salesforce to navigate to the specified record ID.