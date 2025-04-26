# 📦 Calendar Drag and Drop Project

This is a React + TypeScript project where users can **drag and drop event cards** into different day columns.  
It supports **desktop** and **mobile touch devices** using `react-dnd`, `MultiBackend`, and `TailwindCSS` for styling.

---

## 🚀 Project Setup and Run Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)  
   (App should auto-refresh as you edit.)

---

## 🛠️ Tech Stack

| Technology            | Purpose                           |
|-----------------------|-----------------------------------|
| React + TypeScript    | Frontend framework and typing    |
| TailwindCSS           | Styling                          |
| React DnD             | Drag-and-drop support            |
| React DnD MultiBackend | Drag & Drop with Desktop + Mobile support |
| React DnD Touch Backend | Touch-based drag support (mobile) |
| Date-fns              | Date formatting and handling     |
| Framer Motion              | Event card animations     |


---

## 📚 Key Features

- 🗖 Weekly Calendar View
- 🧹 Drag and Drop Events across days
- 📱 Mobile Touch Drag and Drop Supported
- 🎨 TailwindCSS Styled Components
- 🔄 Live Updates on Drag-Drop
- 🌐 Responsive UI
- ✨ Clean and Structured TypeScript Code

---

## 📂 Project Structure

```plaintext
/src
  ├── components
  │   ├── Calendar.tsx            # Calendar grid component
  │   ├── DayColumn.tsx            # Day column with droppable area
  │   └── EventCard.tsx            # Draggable event card
  ├── types
  │   └── index.ts                 # TypeScript types/interfaces
  ├── utils
  │   ├── backendOptions.ts        # MultiBackend drag options
  │   └── currentDate.ts           # Date utilities
  ├── App.tsx                      # Main App entry
  ├── index.css                    # Tailwind base styles
  └── main.tsx                     # React DOM render
```

---

## 📦 Dependencies

```json
"dependencies": {
  "react": "^18.x",
  "react-dom": "^18.x",
  "react-dnd": "^16.x",
  "react-dnd-html5-backend": "^16.x",
  "react-dnd-touch-backend": "^16.x",
  "react-dnd-multi-backend": "^16.x",
  "date-fns": "^2.x",
  "tailwindcss": "^3.x",
  "typescript": "^5.x"
}
```

Make sure all `react-dnd` packages are on the **same major version** (`16.x`) to avoid conflicts!

---

## 🧹 How Drag and Drop Works

- **Desktop**: Uses `HTML5Backend` (native HTML5 drag events).
- **Mobile**: Uses `TouchBackend` with `TouchTransition`.
- **MultiBackend**: Dynamically switches between desktop and mobile backends based on user device.

Configured inside `DndProvider`:

```tsx
<DndProvider backend={MultiBackend} options={{
  backends: [
    {
      id: "html5",
      backend: HTML5Backend,
      transition: undefined,
    },
    {
      id: "touch",
      backend: TouchBackend,
      options: { enableMouseEvents: true },
      preview: true,
      transition: TouchTransition,
    },
  ]
}}>
  {/* App content */}
</DndProvider>
```

---

## 📜 Scripts

| Script           | Purpose                         |
|------------------|----------------------------------|
| `npm run dev`    | Start development server         |
| `npm run build`  | Build project for production     |
| `npm run preview`| Preview production build         |

---

## 🖌️ TailwindCSS Usage

- Fully customized using utility classes
- Mobile responsive design
- Hover, focus, and drag states styled cleanly

Example:

```tsx
<div className="p-4 rounded-lg bg-white shadow-md hover:bg-gray-100 cursor-pointer">
  {event.title}
</div>
```

---

## 🗓 Example Event Data

```ts
export interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  time: string;
}
```

---

## 🛡️ Best Practices Followed

- Clean and modular folder structure
- Reusable and typed components
- Mobile-first responsive UI
- Separation of concerns (components, utils, types)
- Drag-and-drop support across all devices
- Optimized for performance

---

## 🔥 Future Improvements (Optional Ideas)

- Add weekly/monthly view switch
- Add ability to create new events
- Persist dragged events in localStorage or backend
- Animation on drag start and drop

---

## 👨‍💼 Author

- **Name**: Madhav Kabra
- **LinkedIn**: [madhavkabra](https://www.linkedin.com/in/madhavkabra/)

---

# 🚀 Let's create more beautiful experience!

---