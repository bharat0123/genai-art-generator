# 🎨 AI Art Generator

AI Art Generator is a creative web application that leverages generative AI to transform text prompts into stunning visual art. This project allows users to input any descriptive prompt and generate high-quality artwork in real-time. The app features a user-friendly interface where users can explore, save, and download their generated artwork.

## ✨ Features

- **Text-to-Image Generation**: Transform your text prompts into beautiful artwork using OpenAI's DALL-E 3
- **AI-Powered Prompt Enhancement**: Uses LangChain with OpenAI (GPT) or Google Gemini to enhance prompts before image generation
- **Multiple Image Sizes**: Choose from square, landscape, or portrait formats
- **Image Gallery**: Browse all your generated artwork in a beautiful gallery view
- **Download & Save**: Download your creations or save them to your gallery
- **Modern UI**: Beautiful, responsive interface with smooth animations
- **Real-time Generation**: Watch your prompts come to life instantly

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd genai-art-generator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Edit the `.env` file and add your API keys:
   - **Required**: `OPENAI_API_KEY` - Get from [OpenAI Platform](https://platform.openai.com/api-keys)
   - **Optional**: `GEMINI_API_KEY` - Required only if using `PROVIDER=gemini` for prompt enhancement
   - See `.env.example` for all available configuration options

### Running the Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
genai-art-generator/
├── src/
│   ├── server.ts                    # Main server entry point (OOP ApplicationServer class)
│   ├── config/
│   │   └── AppConfig.ts             # Singleton pattern for configuration
│   ├── models/
│   │   └── ImageMetadata.ts         # Domain models (OOP classes)
│   ├── repositories/
│   │   ├── IImageRepository.ts      # Repository pattern interface
│   │   └── FileImageRepository.ts   # File-based repository implementation
│   ├── strategies/
│   │   ├── IImageGenerationStrategy.ts           # Strategy pattern interface
│   │   └── LangChainImageGenerationStrategy.ts  # LangChain-based strategy
│   ├── factories/
│   │   ├── ImageGenerationServiceFactory.ts      # Factory for image generation strategies
│   │   ├── ImageGenerationClientFactory.ts       # Factory for image generation clients
│   │   └── LLMFactory.ts                         # Factory for LLM chat models
│   ├── services/
│   │   ├── ImageGenerationService.ts            # Service pattern (business logic)
│   │   ├── IImageGenerationClient.ts            # Interface for image generation clients
│   │   ├── OpenAIImageGenerationClient.ts       # OpenAI DALL-E implementation
│   │   └── GeminiImageGenerationClient.ts       # Gemini implementation (planned)
│   ├── controllers/
│   │   └── ImageController.ts       # Controller pattern (HTTP handling)
│   └── routes/
│       └── imageRoutes.ts           # Express routes using controllers
├── public/
│   ├── index.html                   # Frontend HTML
│   ├── styles.css                   # Frontend styles
│   └── app.js                       # Frontend JavaScript
├── generated-images/                # Generated images storage (created automatically)
├── .env.example                     # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
└── ARCHITECTURE.md                  # Architecture and design patterns documentation
```

## 🎯 Usage

1. **Generate Artwork**: 
   - Enter a descriptive prompt in the text area
   - Select your preferred image size
   - Click "Generate Art" and wait for your masterpiece!

2. **View & Download**:
   - View the generated image in the result section
   - Download the image using the download button
   - Save it to your gallery

3. **Browse Gallery**:
   - Scroll down to see all your generated artwork
   - Click on any image to view it in full size
   - Download any image from the gallery

## 🔧 API Endpoints

- `POST /api/images/generate` - Generate a new image from a prompt
- `GET /api/images` - List all generated images
- `GET /api/images/:imageId` - Get a specific image
- `GET /api/images/:imageId/download` - Download a specific image

## 🛠️ Technologies Used

- **Backend**: Node.js, Express, TypeScript
- **Image Generation**: OpenAI DALL-E 3 (via OpenAI SDK)
- **Prompt Enhancement**: LangChain with OpenAI (GPT-3.5/GPT-4) or Google Gemini
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: Local file system

**Note**: Currently, image generation only supports OpenAI DALL-E. The `PROVIDER` setting controls which LLM is used for prompt enhancement. Gemini image generation is planned for future implementation.

## 🏗️ Architecture & Design Patterns

This project follows **Object-Oriented Programming (OOP)** principles and implements several **design patterns**:

### Design Patterns Implemented

1. **Singleton Pattern** (`AppConfig`)
   - Ensures a single instance of configuration throughout the application
   - Provides centralized access to environment variables

2. **Repository Pattern** (`IImageRepository`, `FileImageRepository`)
   - Abstracts data access layer
   - Allows easy switching between storage implementations (file system, database, etc.)
   - Separates business logic from data persistence

3. **Strategy Pattern** (`IImageGenerationStrategy`, `LangChainImageGenerationStrategy`)
   - Enables switching between different image generation algorithms
   - Currently implements LangChain-based generation
   - Easy to extend with other strategies (Stable Diffusion, Midjourney, etc.)

4. **Factory Pattern** 
   - `ImageGenerationServiceFactory`: Creates image generation strategies
   - `ImageGenerationClientFactory`: Creates image generation clients (OpenAI DALL-E, future: Gemini)
   - `LLMFactory`: Creates LangChain chat models (OpenAI or Gemini) for prompt enhancement
   - Encapsulates object creation logic
   - Makes it easy to add new strategies and providers

5. **Service Pattern** (`ImageGenerationService`)
   - Encapsulates business logic
   - Orchestrates interactions between strategies and repositories
   - Provides a clean API for controllers

6. **Controller Pattern** (`ImageController`)
   - Handles HTTP requests and responses
   - Separates HTTP concerns from business logic
   - Validates input and formats output

### OOP Principles Applied

- **Encapsulation**: Classes encapsulate related data and methods
- **Abstraction**: Interfaces define contracts without implementation details
- **Inheritance**: Classes extend base functionality where appropriate
- **Polymorphism**: Strategy pattern allows different implementations to be used interchangeably
- **Single Responsibility**: Each class has one clear purpose
- **Dependency Injection**: Dependencies are injected rather than created internally

### LangChain Integration

The application uses **LangChain** for:
- **Prompt Engineering**: Enhances user prompts using LangChain's prompt templates
- **Multi-LLM Support**: Supports both OpenAI (GPT-3.5/GPT-4) and Google Gemini via LangChain for prompt enhancement
- **Environment-Based Configuration**: Switch LLM providers via environment variables
- **Extensibility**: Easy to add more LangChain features (chains, agents, etc.)

The `LangChainImageGenerationStrategy` demonstrates:
- Using LangChain's `PromptTemplate` for structured prompts
- Using `LLMFactory` to create the appropriate chat model (OpenAI or Gemini) for prompt enhancement
- Using `ImageGenerationClientFactory` to create image generation clients (currently OpenAI DALL-E)
- Environment-based provider selection

**Provider Selection:**
- Set `PROVIDER=openai` to use OpenAI for both prompt enhancement and image generation
- Set `PROVIDER=gemini` to use Gemini for prompt enhancement (image generation still uses OpenAI DALL-E)
- The factory pattern automatically creates the correct LangChain model and image client based on configuration

**Current Limitations:**
- Image generation currently only supports OpenAI DALL-E
- Gemini image generation is planned for future implementation
- When using `PROVIDER=gemini`, Gemini enhances the prompt, but OpenAI DALL-E generates the image

## 📝 Environment Variables

A complete `.env.example` file is provided with all available configuration options. Copy it to `.env` and fill in your values:

```bash
cp .env.example .env
```

### Required Variables

- `OPENAI_API_KEY` - Your OpenAI API key (required for DALL-E image generation)
  - Get from: [OpenAI Platform](https://platform.openai.com/api-keys)
- `PROVIDER` - AI provider for prompt enhancement: `openai` or `gemini` (default: `openai`)
  - Note: Image generation currently only works with OpenAI DALL-E, regardless of provider setting

### Conditional Variables

- `GEMINI_API_KEY` - Required if `PROVIDER=gemini` (for prompt enhancement)
  - Get from: [Google AI Studio](https://makersuite.google.com/app/apikey)
  - Note: LangChain uses `GOOGLE_API_KEY` internally, but we map `GEMINI_API_KEY` to it

### Optional Variables

- `OPENAI_MODEL` - OpenAI model name (default: `gpt-3.5-turbo`)
  - Options: `gpt-3.5-turbo`, `gpt-4`, `gpt-4-turbo`, etc.
- `OPENAI_TEMPERATURE` - OpenAI temperature 0.0-2.0 (default: `0.7`)
- `GEMINI_MODEL` - Gemini model name for prompt enhancement (default: `gemini-pro`)
  - Options: `gemini-pro`, `gemini-2.5-flash`, etc.
  - Note: If set to an image model (contains "image"), it will be used for image generation when implemented
- `GEMINI_TEMPERATURE` - Gemini temperature 0.0-2.0 (default: `0.7`)
- `PORT` - Server port (default: `3000`)
- `NODE_ENV` - Environment mode: `development` or `production` (default: `development`)
- `STORAGE_PATH` - Path to store generated images (default: `./generated-images`)

### Quick Setup Examples

**Using OpenAI for both prompt enhancement and image generation:**
```env
PROVIDER=openai
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4
```

**Using Gemini for prompt enhancement (OpenAI for image generation):**
```env
PROVIDER=gemini
OPENAI_API_KEY=sk-your-key-here  # Required for DALL-E image generation
GEMINI_API_KEY=your-gemini-key-here  # Required for prompt enhancement
GEMINI_MODEL=gemini-pro
```

**Note**: Currently, image generation always uses OpenAI DALL-E regardless of the `PROVIDER` setting. The `PROVIDER` setting only affects which LLM is used for prompt enhancement.

For complete documentation of all environment variables, see `.env.example` file.

## ⚠️ Notes

- **Image Generation**: Currently only OpenAI DALL-E 3 is supported for image generation
- **Prompt Enhancement**: You can use either OpenAI (GPT) or Google Gemini for prompt enhancement via LangChain
- **API Keys**: OpenAI API key is always required for image generation, even when using Gemini for prompt enhancement
- **Storage**: Generated images are stored locally in the `generated-images` directory
- **Rate Limits**: DALL-E 3 has rate limits based on your OpenAI plan
- **Future**: Gemini image generation support is planned for future implementation

## 📄 License

ISC
