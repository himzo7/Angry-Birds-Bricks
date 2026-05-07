# 🧱 Angry Birds Bricks

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Technology](https://img.shields.io/badge/HTML5-Canvas-orange)
![Technology](https://img.shields.io/badge/JavaScript-Vanilla-yellow)
![Technology](https://img.shields.io/badge/CSS3-Flexbox-blue)

> **Angry Birds Bricks** is a fun, fast-paced web arcade game that merges classic Arkanoid/Breakout mechanics with beloved Angry Birds aesthetics. Built entirely with HTML5 Canvas and Vanilla JavaScript, it features multiple difficulty levels, dynamic physics-based paddle bouncing, and a polished UI design.

## ✨ Key Features

### 🎮 Arcade Mechanics with a Twist
* **Physics-Based Paddle:** The angle of the bird's bounce changes dynamically based on where it hits the paddle, allowing for precise targeting.
* **Dynamic Difficulty Levels:** Choose between Easy (3x6 grid), Medium (4x8 grid), and Hard (5x10 grid) modes. Higher difficulties introduce stronger pigs that require multiple hits.
* **Pig Health System:** Pigs act as bricks with varying health points. Stronger pigs change their visual appearance dynamically using canvas filters.
* **High Score Tracking:** Your best score is automatically saved directly to your browser using `localStorage`.

### ⚙️ Technical Highlights
* **Vanilla JavaScript:** Built entirely without external libraries or frameworks (no jQuery) for optimal performance and lightweight execution.
* **Classic Game Loop:** Runs on a smooth `setInterval` rendering loop for consistent frame updates and collision checks.
* **Dynamic Canvas Rendering:** Leverages the Canvas API with real-time CSS context filters (`hue-rotate`, `brightness`, `saturate`, `sepia`) to dynamically create multiple enemy variants from a single lightweight sprite image.
* **Grid-Based Collision Detection:** Uses efficient row and column math calculations for precise and instantaneous bird-to-pig physics.

---

## 🚀 Installation & Setup

Since this project relies on front-end web technologies, no server environment is required.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/angry-birds-bricks.git](https://github.com/your-username/angry-birds-bricks.git)
    ```
2.  **Open the project folder.**
3.  **Run the application:**
    Simply double-click `index.html` to open it in your default web browser.

---

## 🕹️ How to Play

The game offers intuitive keyboard controls mixed with simple UI interactions.

| Key / Button | Action |
| :--- | :--- |
| **⬅ / ➡ Arrows** | Move the wooden paddle left or right across the screen. |
| **▶ Start** | Initiates the physics engine and starts the timer. |
| **⏸ Pause** | Pauses the game loop, ball movement, and the timer. |
| **↺ Reset** | Reloads the current session. |
| **Level Selection** | Choose your difficulty (Easy, Medium, Hard) before starting the game. |

**Objective:** Bounce the bird off the paddle, destroy all the pigs on the grid, and prevent the bird from falling off the bottom of the screen!

---

## 📂 Project Structure

```text
angry-birds-bricks/
├── assets/
│   ├── angry-birds.png  # Favicon/Logo image (optional)
│   └── pigs.png         # Base sprite image used for rendering all enemies
├── js/
│   └── script.js        # Core game loop, physics, and Vanilla JS logic
├── styles/
│   └── style.css        # UI styling, flexbox layouts, and animations
├── LICENSE              # Project license file
├── index.html           # Main UI layout, menus, and modals
└── README.md            # Project documentation
