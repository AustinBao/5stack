# 🎮 5Stack – Shared Steam Games Finder

> A simple tool that compares your Steam library with your friends’ libraries to instantly find games you can all play together.

🟢 Live at: https://5stack.online/


## 🚀 **What 5Stack Does**

**5Stack** solves the problem of “What game should we play tonight?” by showing you only the games you and your friends actually share.

### **💡 The Problem It Solves**
- Gamers often have large, overlapping Steam libraries but no quick way to find shared games
- Manually scrolling through lists of 100+ games is slow and frustrating
- Steam doesn’t provide an easy to access and intuitive “shared games finder”

### **🎯 The Solution**
- **Fast Library Comparison**: Compares up to 250 friends’ libraries in seconds

- **Smart Filtering**: Shows only games shared by selected friends

- **Quick Search**: Autocomplete helps find friends instantly

---

## 🛠️ **Tech Stack**

### **Frontend**
- **EJS**: Dynamic templating for rendering game results
- **Bootstrap**: Responsive layout and UI components
- **HTML/CSS**: Core styling and structure

### **Backend**
- **Express.js** - Lightweight server framework
- **Steam Web API** - Fetches game library and friend data

---

## 📁 **Project Structure**
```
5stack/
├── public/             # Static assets (CSS, images, client JS)
├── views/              # EJS templates for pages
├── routes/             # Express routes (home, Steam API calls, game compare)
├── app.js              # Main Express server file
├── package.json        # Dependencies and scripts
└── .env                # Steam API key (not committed)
```

---

## 🔄 **How It Works**

### **1. Enter Your Steam ID**
```
Click “Login with Steam”
    ↓
Redirect to main page with Cookie
    ↓
Fetches user’s library via Steam API
```

### **2. Add Friends**
```
Search friend's Steam usernames
    ↓
Show autocomplete friend list
    ↓
Select friend
```

### **3. View Shared Games**
```python
Compare libraries
    ↓
Show common games
    ↓
Apply filters if needed
```

---

## 🔮 **Future Enhancements**
### **Technical Improvements:**
- **Caching Steam Data** – Reduce API calls and improve speed
- **Advanced Filtering** - By genre, playtime, or release date
- **Friend Groups** - Save friend groups for quick re-checks
- **UI Improvements** - Create a light/dark mode toggle

---
## 👨‍💻 **About**

### **By:** Austin Bao  
### **Status:** Actively maintained & hosted at [https://5stack.online](https://5stack.online)


