const postgres = require('postgres');
const bcrypt = require('bcryptjs');

// Database connection
const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require' });

// Sample data
const sampleUser = {
  id: 'user_123e4567-e89b-12d3-a456-426614174000',
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'password123' // Will be hashed
};

const sampleCapsule = {
  id: 'capsule_123e4567-e89b-12d3-a456-426614174001',
  title: 'Introduction to JavaScript',
  total_pages: 5,
  content: {
    meta: {
      description: 'A comprehensive introduction to JavaScript programming language',
      source_url: 'https://example.com/js-guide'
    },
    pages: [
      {
        page_title: 'Getting Started with JavaScript',
        body: '# Getting Started with JavaScript\n\nJavaScript is a versatile programming language that powers the modern web. In this lesson, we\'ll cover the basics of JavaScript syntax and fundamental concepts.\n\n## Variables and Data Types\n\nJavaScript has several primitive data types:\n- **String**: Text data\n- **Number**: Numeric values\n- **Boolean**: true/false values\n- **undefined**: Uninitialized variables\n- **null**: Intentional absence of value\n\n```javascript\nlet message = "Hello, World!";\nlet age = 25;\nlet isStudent = true;\n```'
      },
      {
        page_title: 'Functions and Control Flow',
        body: '# Functions and Control Flow\n\n## Functions\n\nFunctions are reusable blocks of code that perform specific tasks.\n\n```javascript\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconst add = (a, b) => a + b;\n```\n\n## Control Flow\n\nUse conditional statements and loops to control program execution:\n\n```javascript\nif (age >= 18) {\n  console.log("You are an adult");\n} else {\n  console.log("You are a minor");\n}\n\nfor (let i = 0; i < 5; i++) {\n  console.log(i);\n}\n```'
      },
      {
        page_title: 'Objects and Arrays',
        body: '# Objects and Arrays\n\n## Objects\n\nObjects store key-value pairs:\n\n```javascript\nconst person = {\n  name: "Alice",\n  age: 30,\n  city: "New York"\n};\n\nconsole.log(person.name); // "Alice"\n```\n\n## Arrays\n\nArrays store ordered collections:\n\n```javascript\nconst fruits = ["apple", "banana", "orange"];\nconsole.log(fruits[0]); // "apple"\nfruits.push("grape");\n```'
      },
      {
        page_title: 'DOM Manipulation',
        body: '# DOM Manipulation\n\nThe Document Object Model (DOM) allows JavaScript to interact with HTML elements.\n\n## Selecting Elements\n\n```javascript\nconst element = document.getElementById("myId");\nconst elements = document.querySelectorAll(".myClass");\n```\n\n## Modifying Content\n\n```javascript\nelement.textContent = "New text";\nelement.innerHTML = "<strong>Bold text</strong>";\nelement.style.color = "blue";\n```\n\n## Event Handling\n\n```javascript\nbutton.addEventListener("click", function() {\n  alert("Button clicked!");\n});\n```'
      },
      {
        page_title: 'Modern JavaScript Features',
        body: '# Modern JavaScript Features\n\n## ES6+ Features\n\n### Template Literals\n\n```javascript\nconst name = "World";\nconst message = `Hello, ${name}!`;\n```\n\n### Destructuring\n\n```javascript\nconst {name, age} = person;\nconst [first, second] = array;\n```\n\n### Async/Await\n\n```javascript\nasync function fetchData() {\n  try {\n    const response = await fetch("/api/data");\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error("Error:", error);\n  }\n}\n```\n\n## Conclusion\n\nCongratulations! You\'ve completed the Introduction to JavaScript. You now have a solid foundation in JavaScript fundamentals.'
      }
    ]
  },
  created_by: 'user_123e4567-e89b-12d3-a456-426614174000',
  created_at: new Date().toISOString()
};

const sampleUserCapsule = {
  id: 'uc_123e4567-e89b-12d3-a456-426614174002',
  user_id: 'user_123e4567-e89b-12d3-a456-426614174000',
  capsule_id: 'capsule_123e4567-e89b-12d3-a456-426614174001',
  last_page_read: 2,
  overall_progress: 0.4, // 40% completion (2 out of 5 pages)
  bookmarked_date: new Date().toISOString(),
  last_accessed: new Date().toISOString()
};

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');

    // Check if data already exists
    const existingUsers = await sql`SELECT id FROM users LIMIT 1`;
    if (existingUsers.length > 0) {
      console.log('⚠️  Database already contains data. Skipping seed to avoid duplicates.');
      console.log('   To re-seed, please clear the database first.');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(sampleUser.password, 10);

    // Insert sample user
    console.log('👤 Creating sample user...');
    await sql`
      INSERT INTO users (id, name, email, password) 
      VALUES (${sampleUser.id}, ${sampleUser.name}, ${sampleUser.email}, ${hashedPassword})
    `;
    console.log(`   ✅ User created: ${sampleUser.email}`);

    // Insert sample capsule
    console.log('📚 Creating sample capsule...');
    await sql`
      INSERT INTO capsules (id, title, total_pages, content, created_by, created_at)
      VALUES (
        ${sampleCapsule.id}, 
        ${sampleCapsule.title}, 
        ${sampleCapsule.total_pages}, 
        ${sql.json(sampleCapsule.content)}, 
        ${sampleCapsule.created_by}, 
        ${sampleCapsule.created_at}
      )
    `;
    console.log(`   ✅ Capsule created: ${sampleCapsule.title}`);

    // Insert sample user-capsule relationship
    console.log('🔗 Creating user-capsule relationship...');
    await sql`
      INSERT INTO user_capsules (id, user_id, capsule_id, last_page_read, overall_progress, bookmarked_date, last_accessed)
      VALUES (
        ${sampleUserCapsule.id},
        ${sampleUserCapsule.user_id},
        ${sampleUserCapsule.capsule_id},
        ${sampleUserCapsule.last_page_read},
        ${sampleUserCapsule.overall_progress},
        ${sampleUserCapsule.bookmarked_date},
        ${sampleUserCapsule.last_accessed}
      )
    `;
    console.log('   ✅ User-capsule relationship created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Seeded data summary:');
    console.log(`   User: ${sampleUser.name} (${sampleUser.email})`);
    console.log(`   Password: ${sampleUser.password}`);
    console.log(`   Capsule: ${sampleCapsule.title} (${sampleCapsule.total_pages} pages)`);
    console.log(`   Progress: ${Math.round(sampleUserCapsule.overall_progress * 100)}% complete`);
    console.log('\n🚀 You can now log in and explore the application!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

// Handle command line execution
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✨ Seed script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seed script failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };