# 🧱 Angry Birds Bricks

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Technology](https://img.shields.io/badge/HTML5-Canvas-orange)
![Technology](https://img.shields.io/badge/JavaScript-jQuery-yellow)
![Technology](https://img.shields.io/badge/CSS3-Flexbox-blue)

> **Angry Birds Bricks** is a fun, fast-paced web arcade game that merges classic Arkanoid/Breakout mechanics with beloved Angry Birds aesthetics. Built with HTML5 Canvas, JavaScript, and jQuery, it features dynamic difficulty, physics-based paddle bouncing, upgradable power-ups, and a polished UI design.

## ✨ Key Features

### 🎮 Arcade Mechanics with a Twist
* **Physics-Based Paddle:** The angle of the bird's bounce changes dynamically based on where it hits the paddle, allowing for precise targeting.
* **Pig System:** Pigs act as bricks with varying health points (Normal, Strong, Boss). Defeating them drops collectable gold coins that fall down the screen.
* **In-Game Shop:** Spend your collected gold on powerful upgrades:
  * 🔥 **Fireball:** The bird becomes engulfed in an orange glow, piercing through 5 pigs without bouncing back.
  * 🪞 **Mirror:** Spawns a secondary paddle at the top of the screen to save the bird from escaping upwards.
* **High Score Tracking:** Your best score is automatically saved directly to your browser using `localStorage`.

### ⚙️ Technical Highlights
* **Classic Game Loop:** Runs on a smooth `setInterval` rendering loop for consistent frame updates and collision checks.
* **AABB Collision Detection:** Uses precise Axis-Aligned Bounding Box calculations for accurate bird-to-pig physics.
* **Dynamic Canvas Rendering:** Leverages the Canvas API with real-time CSS context filters (`hue-rotate`, `brightness`) to dynamically create multiple enemy variants from a single lightweight sprite image.
* **jQuery Integration:** Utilizes jQuery for efficient DOM manipulation, UI state updates, and streamlined keyboard event handling.

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

The game offers intuitive keyboard controls mixed with simple UI interactions for upgrades.

| Key / Button | Action |
| :--- | :--- |
| **⬅ / ➡ Arrows** | Move the wooden paddle left or right across the screen. |
| **▶ Start** | Initiates the physics engine and starts the timer. |
| **⏸ Pause** | Pauses the game loop, ball movement, and the timer. |
| **↺ Reset** | Reloads the current session. |
| **Shop Upgrades** | Click the Fireball or Mirror buttons to buy power-ups with collected gold. |

**Objective:** Bounce the bird off the paddle, destroy all the pigs on the grid, catch the falling gold coins, and prevent the bird from falling off the bottom of the screen!

---

## 📂 Project Structure

```text
angry-birds-bricks/
├── assets/
│   ├── angry-birds.png  # Favicon/Logo image
│   └── pigs.png         # Base sprite image used for rendering all enemies
├── js/
│   └── script.js        # Core game loop, physics, and jQuery logic
├── styles/
│   └── style.css        # UI styling, flexbox layouts, and animations
├── LICENSE              # Project license file
├── index.html           # Main UI layout, menus, shop, and modals
└── README.md            # Project documentation
