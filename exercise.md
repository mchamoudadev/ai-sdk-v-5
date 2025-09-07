# �� **AI SDK Exercise: Database Chat, Movie Database & Dad Jokes Tools**

## **Exercise Requirements**

### **Part 1: Database Chat Tool** 🗄️
**Objective:** Create a tool that converts natural language queries into database operations

**Requirements:**
- Choose either **MySQL** or **MongoDB** as your database
- Set up database connection and schema
- Create tables/collections for: `movies`, `users`, `reviews`
- Implement natural language to SQL/NoSQL query conversion
- Handle basic queries like:
  - "Show me all sci-fi movies"
  - "Find users over 25"
  - "Get movies with rating above 8.5"
  - "Count total movies by genre"
- Add query validation and error handling
- Return structured results with metadata

**Database Schema Requirements:**
- **Movies:** id, title, year, genre, rating, director, description
- **Users:** id, name, email, age, favorite_genre
- **Reviews:** id, movie_id, user_id, rating, comment, date

---

### **Part 2: Movie Database Tool** 🎬
**Objective:** Integrate with external movie API to fetch detailed movie information

**Requirements:**
- Use **OMDb API** (free tier: 1000 requests/day)
- Get free API key from omdbapi.com
- Implement movie search by title and year
- Fetch movie details: plot, cast, ratings, poster, runtime
- Handle API errors and rate limiting
- Add movie recommendations based on genre/year
- Cache results in your chosen database
- Support partial title matching

**API Integration:**
- Search endpoint: `http://www.omdbapi.com/?t={title}&y={year}&apikey={key}`
- Handle "Movie not found" responses
- Implement fallback for API failures

---

### **Part 3: Dad Jokes Tool** 😄
**Objective:** Create entertainment tool with random joke generation

**Requirements:**
- Use **icanhazdadjoke.com** API (free, no API key needed)
- Implement random joke fetching
- Add joke categories: dad jokes, programming jokes, general jokes
- Store jokes in your database for offline access
- Handle API failures with local joke fallback
- Add joke rating system (thumbs up/down)
- Implement joke search by keywords

**API Endpoints:**
- Random joke: `https://icanhazdadjoke.com/`
- Headers: `Accept: application/json`
- Fallback to local joke database if API fails

---

### **Part 4: Database Choice & Setup** ��

**Option A: MySQL**
- Install MySQL server
- Use Prisma ORM or raw SQL
- Create database schema with proper relationships
- Implement connection pooling
- Add database migrations

**Option B: MongoDB**
- Install MongoDB (local or cloud)
- Use Mongoose ODM or native driver
- Design document schemas
- Implement proper indexing
- Add data validation

**Database Requirements:**
- Store conversation history
- Cache API responses
- User preferences and settings
- Tool usage analytics
- Implement data backup strategy

---

### **Part 5: Frontend Integration** ✨
**Objective:** Display tool responses with proper formatting

**Requirements:**
- Update message rendering for all new tools
- Add loading states for database queries
- Implement error handling UI
- Create responsive design for different tool responses
- Add tool response formatting:
  - Database results in tables
  - Movie info with posters
  - Jokes with proper styling
- Implement tool usage statistics
- Add clear/reset functionality

---

### **Part 6: Error Handling & Validation** ⚠️
**Requirements:**
- Validate all user inputs
- Handle database connection errors
- Implement API rate limiting
- Add retry mechanisms for failed requests
- Create user-friendly error messages
- Log errors for debugging
- Implement circuit breaker pattern for external APIs

---

### **Part 7: Performance & Optimization** ��
**Requirements:**
- Implement database query optimization
- Add response caching
- Optimize API calls (batch requests)
- Implement pagination for large results
- Add database indexing
- Monitor tool performance
- Implement lazy loading for images

---

### **Part 8: Testing & Documentation** ��
**Requirements:**
- Write unit tests for all tools
- Test database operations
- Test API integrations
- Create integration tests
- Document API endpoints
- Write user guide for tools
- Create troubleshooting guide

---

### **Deliverables:**
1. **Working application** with all three tools
2. **Database setup** with sample data
3. **API integration** with error handling
4. **Frontend updates** with proper styling
5. **Documentation** including setup instructions
6. **Test cases** for critical functionality
7. **Performance report** with optimization recommendations

### **Timeline:**
- **Week 1:** Database setup and basic tools
- **Week 2:** API integration and frontend
- **Week 3:** Testing, optimization, and documentation

### **Evaluation Criteria:**
- **Functionality:** All tools work correctly
- **Code Quality:** Clean, maintainable code
- **Error Handling:** Robust error management
- **Performance:** Fast response times
- **Documentation:** Clear setup and usage instructions
- **Testing:** Comprehensive test coverage

**Choose your database (MySQL or MongoDB) and implement all requirements according to your selected technology stack.**