# Technology Choices

## **Technology Stack Justification**

### Frontend framework reasoning

-   **Next.js, MUI Material Design**
    -   SEO, SSR/SSG/CSR freedom/flexbility. Quick web building with design templates out of the box. Balance complexity compared to other frameworks.

### Backend language/framework decision

-   **Node.js**
    -   Coupled end in the same stack, which is nextjs' default. With full on JavaScript in frontend & backend, development is simplified.

### Database choice rationale

-   **PostgreSQL**
    -   Naturally strong relationship mapping for tables/schemas like users and contents. We do not really need NoSQL's flexibility like MongoDB.

### What alternatives did you consider?

-   **Frontend**

    -   React, which is what Next.js is build on top of. But we do not get the benefits of SEO, and the different rendering strategies for performance improvements. Vue is lighter and has smaller ecosystem. Angular is a bit overkill. Next.js seem to have the right balance.

-   **Backend**

    -   Express.js has more control and highly customizable. But outside of current projects scope.

-   **Database**
    -   NoSQL databases such as MongoDB was eliminated early. The choice was between MySQL, SQLite, and PostgreSQL. SQLite do not fit with the project in terms of scale. MySQL is compatible for almost any situation. But I thought PostgreSQL is best because if we are planning to scale the application, we can leverage it's advanced features later.
    -   Several other options also popped up during my researchLike Cassandra, Elasticsearch, and Prisma. But again, they are outside of the project's scope.

## **API Design Philosophy**

### How did you structure your API endpoints?

-   The public API endpoints is structured based on hierarchy as follows:

```
/api/health             - System health monitoring
/api/capsules           - Public capsule discovery
/api/capsules/{id}      - Individual capsule access
/api/capsule/create     - Capsule generation from URLs
/api/capsule/progress   - User progress tracking
/api/capsule/bookmark   - Bookmark management
```

### What external APIs did you integrate and why?

I integrated one external API: Deepseek API. This API is used to generate capsules. Initially, the project was planned to integrate with multiple API around software development such as Medium, Dev.to, Hashnode, etc. The MVP was set to only integrate with one of them. But it quickly appear to be unviable. So instead, what if we can simply consume learning resources from any website, but convert it as a guide/tutorial. This is where Deepseek comes in: to create a step by step guide for learners.

### How do you handle API failures and rate limits?

Failures are gracefully handled by try and catch block. However, currently Deepseek pose no API limit, which in turn might potentially unintentionally abused by users. Therefor, the web do not allow queing creation and only let one users to create one capsule at a time.

### What's your authentication/authorization strategy?

-   **Authentication**

    -   Use JWT token and store in cookies with HttpOnly cookies to prevent XSS attacks, secure flag enabled, 'lax' same site for CSRF protection, and HS256 algorithm for JWT signing.
    -   Password is also secured with bcrypt hashing, and use minium 8 chars with symbol, number, uppercase, and lowercase.
    -   Authentication flow:
        -   Login: Email/password validation → bcrypt comparison → JWT session creation → redirect to dashboard
        -   Signup: Input validation → duplicate email check → password hashing → user creation → auto-login
        -   Logout: Session deletion → redirect to login

-   **Authorization**
    -   Use a middleware to protect routes. Only authenticated users can access certain routes.
    -   Different part has different permission, for example: creating capsules requires login, exploring and viewing capsules dont. Bookmarking a capsule and saving learning progress also requires login.

## **Performance & Scalability Considerations**

### How would your system handle increased load?

-   **Caching**
    -   Next.js automatic static optimization for public pages
    -   PostgreSQL query result caching
-   **Database Indexing**
    -   Input validation and pagination limit
-   **JS Bundles**
    -   Import individual components instead of destructuring for faster initial load
    -   Use Next.js' experimental optimizePackageImports to load only the actual used modules
### What are the bottlenecks in your current design?

-   **Capsule Generation**
    -   DeepSeek API calls for generating a capsule can take 60-180 seconds on average.
    -   Core platform feature, creating capsule, relies heavily on the API.

### How do you optimize API calls and database queries?

-   Use caching headers
-   Uses Next.js' cache revalidation when data changes:
