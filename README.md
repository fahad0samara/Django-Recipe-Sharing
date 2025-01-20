# Recipe Sharing Website

A modern, feature-rich recipe sharing platform built with Django and JavaScript. Share, discover, and organize your favorite recipes with a beautiful and intuitive interface.

## Features

### Core Features
- **Recipe Management**
  - Create, edit, and delete recipes
  - Rich text editor for recipe instructions
  - Image upload support
  - Categorize recipes by cuisine type and dietary preferences
  - Add preparation time, cooking time, difficulty level, and servings

### User Experience
- **Dark/Light Mode**
  - Toggle between dark and light themes
  - Automatic system preference detection
  - Persistent theme selection

- **Recipe Tools**
  - Recipe scaling calculator
  - Unit conversion (metric/imperial)
  - Print-friendly version
  - Cooking timers
  - Shopping list generator

- **Search & Discovery**
  - Advanced search functionality
  - Recipe filtering by category
  - Auto-complete search suggestions
  - Popular recipes showcase

### Social Features
- **User Interactions**
  - Recipe ratings and reviews
  - Comments and discussions
  - Recipe sharing via social media
  - Save favorite recipes
  - Follow other users

### UI Components
- **Modern Interface**
  - Responsive design for all devices
  - Loading animations
  - Toast notifications
  - Back to top button
  - Progress indicators

## Technology Stack

### Frontend
- HTML5
- CSS3 (with Tailwind CSS)
- JavaScript (ES6+)
- Custom UI components
- Responsive design principles

### Backend
- Django web framework
- SQLite database
- Django REST framework
- User authentication system
- File upload handling

## Getting Started

### Prerequisites
- Python 3.8 or higher
- Node.js and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Install JavaScript dependencies:
```bash
npm install
```

5. Set up the database:
```bash
python manage.py migrate
```

6. Create a superuser:
```bash
python manage.py createsuperuser
```

7. Run the development server:
```bash
python manage.py runserver
```

Visit `http://127.0.0.1:8000/` to access the website.

## Project Structure

```
project/
├── manage.py
├── requirements.txt
├── static/
│   ├── css/
│   │   ├── base.css
│   │   ├── landing.css
│   │   ├── recipe-detail.css
│   │   └── recipe-tools.css
│   ├── js/
│   │   ├── home.js
│   │   ├── recipe.js
│   │   ├── recipe-tools.js
│   │   └── ui.js
│   └── img/
├── templates/
│   ├── base.html
│   └── recipes/
│       ├── home.html
│       ├── recipe_detail.html
│       └── recipe_form.html
└── recipes/
    ├── models.py
    ├── views.py
    ├── urls.py
    └── forms.py
```

## Features in Detail

### Recipe Management
- Create detailed recipes with ingredients, instructions, and metadata
- Support for multiple measurement units
- Recipe categorization and tagging
- Image upload and management
- Recipe version history

### User Features
- User profiles with favorite recipes
- Personal recipe collections
- Shopping list generation
- Meal planning tools
- Email notifications

### Search and Discovery
- Full-text search functionality
- Filter by dietary restrictions
- Sort by popularity, rating, or date
- Related recipes suggestions
- Trending recipes section

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons by FontAwesome
- UI components inspired by Tailwind UI
- Recipe scaling logic adapted from standard culinary practices
- Unit conversion formulas from international cooking standards