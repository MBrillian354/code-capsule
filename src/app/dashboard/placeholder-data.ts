export interface CapsuleProgress {
    id: string;
    title: string;
    description: string;
    overall_progress: number;
}

export interface SavedCapsule {
    id: string;
    title: string;
    description: string;
}

export interface Capsule {
    id: string;
    title: string;
    description: string;
    content: { page: number; body: string }[];
    last_page_read?: number;
    overall_progress?: number;
    bookmarked_date?: string;
}

export const continueLearningSample: CapsuleProgress = {
    id: "0",
    title: "Intro to Typescript",
    description:
        "A concise guide to get you started with TypeScript — types, interfaces, and tooling.",
    overall_progress: 24.6,
};

export const recentlySavedSamples: SavedCapsule[] = [
    {
        id: "1",
        title: "Setting Up a React Project",
        description:
            "A comprehensive guide to setting up a new React project from scratch.",
    },
    {
        id: "2",
        title: "React Hooks Guide",
        description:
            "Learn how to use useState, useEffect, and other hooks in React applications.",
    },
    {
        id: "3",
        title: "Node.js Best Practices",
        description:
            "Essential tips for building scalable and secure Node.js applications.",
    },
];

export const userCapsuleContentSamples: Capsule[] = [
    {
        id: "1",
        title: "Setting Up a React Project",
        description:
            "A comprehensive guide to setting up a new React project from scratch.",
        content: [
            {
                page: 1,
                body: "# Step 1: Prerequisites and Tools\n\n1. **Install Node.js and npm**:  \n   - Download Node.js (includes npm) from [nodejs.org](https://nodejs.org)  \n   - Verify installation:  \n     ```bash\n     node -v\n     npm -v\n     ```\n\n2. **Choose a Code Editor**:  \n   - Use VS Code (recommended) or any editor of your choice",
            },
            {
                page: 2,
                body: "# Step 2: Create the React Project\n\n1. **Initialize the Project**:  \n   Open a terminal and run:  \n   ```bash\n   npx create-react-app my-app\n   cd my-app\n   ```  \n   *(Replace `my-app` with your project name.)*\n\n2. **Start the Development Server**:  \n   ```bash\n   npm start\n   ```  \n   - Your app will open at `http://localhost:3000`",
            },
            {
                page: 3,
                body: "# Step 3: Project Structure Overview\n\n```\nmy-app/\n├── public/\n│   ├── index.html\n│   └── favicon.ico\n├── src/\n│   ├── components/    (Create this folder)\n│   ├── App.js\n│   ├── App.css\n│   └── index.js\n├── package.json\n└── README.md\n```",
            },
            {
                page: 4,
                body: "# Step 4: Customize the Structure\n\n1. **Create a `components` Folder**:  \n   - Inside `src/`, create a `components` folder to organize reusable UI elements\n\n2. **Clean Up Boilerplate Code**:  \n   - Remove unused code/logos in `App.js` and `App.css`\n\n3. **Create Your First Component**:  \n   - In `src/components/`, create `Header.js`:  \n     ```jsx\n     import React from 'react';\n\n     const Header = () => {\n       return <h1>Welcome to My React App</h1>;\n     };\n\n     export default Header;\n     ```\n   - Import it into `App.js`:  \n     ```jsx\n     import Header from './components/Header';\n\n     function App() {\n       return (\n         <div>\n           <Header />\n         </div>\n       );\n     }\n     ```",
            },
            {
                page: 5,
                body: "# Step 5: Styling and Assets\n\n1. **Add CSS**:  \n   - Create `App.css` or use CSS modules for component-specific styles\n\n2. **Import Images**:  \n   - Place images in `src/assets/` (create the folder) and import them:  \n     ```jsx\n     import logo from './assets/logo.png';\n     ```",
            },
            {
                page: 6,
                body: "# Step 6: Final Steps\n\n1. **Test Your Setup**:  \n   - Ensure the dev server is running (`npm start`) and check for errors\n\n2. **Build for Production**:  \n   ```bash\n   npm run build\n   ```  \n   - Creates an optimized build in the `build/` folder\n\n3. **Next Steps**:  \n   - Install routers (e.g., `react-router-dom`), state managers (e.g., Redux), or UI libraries (e.g., Material-UI) as needed\n\n**Notes**:  \n- Use `npm install` to add new dependencies  \n- Always use `export default` for components  \n- Restart the dev server after installing new packages",
            },
        ],
        last_page_read: 2,
        overall_progress: 40.0,
        bookmarked_date: "2024-10-01",
    },
];
