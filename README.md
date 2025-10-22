# restaurant-deadlock
🍳 Restaurant Kitchen Deadlock Simulator
An interactive web-based educational tool that demonstrates operating system deadlock concepts using a familiar restaurant kitchen analogy.

🎯 Project Overview
This simulator visualizes deadlock in operating systems through an intuitive restaurant kitchen scenario where chefs (processes) need utensils (resources) to cook. When circular wait occurs, the kitchen "freezes" - demonstrating deadlock in action!

📚 Educational Value
Concepts Demonstrated:

Four Necessary Conditions for Deadlock:
Mutual Exclusion - Only one chef can use a utensil at a time
Hold and Wait - Chefs hold one utensil while waiting for another
No Preemption - Utensils cannot be forcefully taken
Circular Wait - Chef A waits for Chef B, who waits for Chef C, who waits for Chef D, who waits for Chef A
Deadlock Prevention Methods:

Resource Ordering (Numbered utensil request protocol)
Timeout Method (Release resources after waiting too long)
Banker's Algorithm (Safe state verification before allocation)
✨ Features
Interactive Drag-and-Drop: Assign utensils to chefs by dragging
Real-Time Deadlock Detection: Algorithm detects circular wait automatically
Visual Feedback: Kitchen "freezes" with red alert when deadlock occurs
Prevention Method Explanations: Learn three different prevention strategies
Automatic Deadlock Scenario: Click button to see deadlock form step-by-step
Status Tracking: Real-time display of all four deadlock conditions
🚀 Live Demo
👉 Try it Live!

🛠️ Technologies Used
HTML5 - Structure
CSS3 - Styling with animations (gradients, keyframes, transitions)
Vanilla JavaScript - All logic (no frameworks!)
HTML5 Drag and Drop API - Interactive utensil assignment
Developed by:
Dheeraj Sai (RA2411003011911) - Algorithm Implementation Hema Sree (RA2411003011916) - UI/UX Design & Visualization Sai Varun (RA2411003011928) - Testing & Documentation
