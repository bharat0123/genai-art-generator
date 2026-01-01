# 🏗️ Architecture Documentation

## Overview

This document describes the architecture, design patterns, and OOP principles used in the AI Art Generator application.

## Design Patterns

### 1. Singleton Pattern

**Location**: `src/config/AppConfig.ts`

**Purpose**: Ensures a single instance of configuration throughout the application lifecycle.

**Implementation**:
```typescript
export class AppConfig {
  private static instance: AppConfig;
  
  public static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }
}
```

**Benefits**:
- Single source of truth for configuration
- Lazy initialization
- Global access point

### 2. Repository Pattern

**Location**: `src/repositories/`

**Purpose**: Abstracts data access layer, allowing easy switching between storage implementations.

**Interface**: `IImageRepository`
- `save()`: Save image and metadata
- `findById()`: Retrieve image by ID
- `findAll()`: List all images
- `getImagePath()`: Get file path
- `exists()`: Check if image exists

**Implementation**: `FileImageRepository`
- File system-based storage
- Can be easily replaced with database implementation

**Benefits**:
- Separation of concerns
- Testability (can mock repository)
- Easy to swap storage backends

### 3. Strategy Pattern

**Location**: `src/strategies/`

**Purpose**: Allows switching between different image generation algorithms at runtime.

**Interface**: `IImageGenerationStrategy`
```typescript
interface IImageGenerationStrategy {
  generate(prompt: string, size: string, quality: string): Promise<string>;
}
```

**Implementation**: `LangChainImageGenerationStrategy`
- Uses LangChain for prompt enhancement
- Uses OpenAI DALL-E for image generation
- Can be extended with other strategies

**Benefits**:
- Open/Closed Principle (open for extension, closed for modification)
- Easy to add new generation methods
- Runtime strategy selection

### 4. Factory Pattern

**Location**: `src/factories/ImageGenerationServiceFactory.ts`

**Purpose**: Centralized creation of image generation strategies.

**Implementation**:
```typescript
public static createStrategy(strategyType: string): IImageGenerationStrategy {
  switch (strategyType) {
    case 'langchain':
      return new LangChainImageGenerationStrategy();
    default:
      throw new Error(`Unknown strategy: ${strategyType}`);
  }
}
```

**Benefits**:
- Encapsulates object creation
- Centralized strategy management
- Easy to extend with new strategies

### 5. Service Pattern

**Location**: `src/services/ImageGenerationService.ts`

**Purpose**: Encapsulates business logic and orchestrates operations.

**Responsibilities**:
- Coordinate between strategy and repository
- Handle business rules
- Provide clean API for controllers

**Benefits**:
- Single Responsibility Principle
- Reusable business logic
- Easy to test

### 6. Controller Pattern

**Location**: `src/controllers/ImageController.ts`

**Purpose**: Handles HTTP requests and responses, separates HTTP concerns from business logic.

**Methods**:
- `generate()`: Handle image generation requests
- `getById()`: Serve image files
- `listAll()`: List all images
- `download()`: Handle download requests

**Benefits**:
- Separation of HTTP and business logic
- Easy to test controllers independently
- Clean request/response handling

## Class Diagram

```
┌─────────────────┐
│  AppConfig      │ (Singleton)
│  -getInstance() │
└─────────────────┘
         │
         │ uses
         ▼
┌─────────────────────────┐
│  ApplicationServer      │
│  -setupMiddleware()     │
│  -setupRoutes()         │
│  -start()              │
└─────────────────────────┘
         │
         │ uses
         ▼
┌─────────────────────────┐
│  ImageController        │ (Controller)
│  -generate()           │
│  -getById()            │
│  -listAll()            │
│  -download()           │
└─────────────────────────┘
         │
         │ uses
         ▼
┌─────────────────────────┐
│  ImageGenerationService │ (Service)
│  -generateImage()       │
│  -getImageById()       │
│  -getAllImages()        │
└─────────────────────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌──────────┐ ┌──────────────────────┐
│ Strategy │ │  Repository          │
│ (uses)   │ │  (uses)              │
└──────────┘ └──────────────────────┘
    │              │
    ▼              ▼
┌──────────────────────┐ ┌──────────────────────┐
│ LangChainStrategy    │ │ FileImageRepository  │
│ -generate()          │ │ -save()              │
│ -enhancePrompt()     │ │ -findById()          │
└──────────────────────┘ │ -findAll()           │
                         └──────────────────────┘
```

## Data Flow

1. **Request Flow**:
   ```
   HTTP Request → Route → Controller → Service → Strategy/Repository
   ```

2. **Image Generation Flow**:
   ```
   User Prompt → Controller → Service → Strategy (LangChain) → 
   Prompt Enhancement → OpenAI DALL-E → Image URL → 
   Repository (Save) → Response
   ```

3. **Image Retrieval Flow**:
   ```
   HTTP Request → Controller → Service → Repository → 
   File System → Response
   ```

## OOP Principles

### Encapsulation
- Classes encapsulate related data and methods
- Private members hide implementation details
- Public interfaces expose only necessary functionality

### Abstraction
- Interfaces define contracts (`IImageRepository`, `IImageGenerationStrategy`)
- Implementation details are hidden behind abstractions
- Clients depend on abstractions, not concrete implementations

### Inheritance
- Domain models use composition and interfaces
- Classes extend base functionality where appropriate

### Polymorphism
- Strategy pattern enables runtime polymorphism
- Different strategies can be used interchangeably
- Repository pattern allows different storage implementations

### Single Responsibility Principle
- Each class has one reason to change
- `ImageController` handles HTTP only
- `ImageGenerationService` handles business logic only
- `FileImageRepository` handles storage only

### Dependency Inversion Principle
- High-level modules depend on abstractions (interfaces)
- Low-level modules implement interfaces
- Dependencies are injected, not created internally

## LangChain Integration

### Prompt Enhancement Flow

1. **User Input**: Raw prompt from user
2. **LangChain Processing**:
   - `PromptTemplate` structures the enhancement request
   - `ChatOpenAI` generates enhanced prompt
3. **Image Generation**: Enhanced prompt sent to DALL-E
4. **Result**: High-quality image based on enhanced prompt

### Benefits of LangChain

- **Prompt Engineering**: Automatic prompt enhancement
- **Extensibility**: Easy to add chains, agents, and tools
- **Consistency**: Standardized approach to LLM interactions
- **Future-Proof**: Easy to integrate new LangChain features

## Extension Points

### Adding New Image Generation Strategy

1. Implement `IImageGenerationStrategy` interface
2. Add case to `ImageGenerationServiceFactory`
3. No changes needed to existing code (Open/Closed Principle)

### Adding New Storage Backend

1. Implement `IImageRepository` interface
2. Update dependency injection in routes
3. No changes needed to business logic

### Adding New Features

- **Caching**: Add caching layer between service and repository
- **Validation**: Add validation layer in service
- **Logging**: Add logging decorator pattern
- **Rate Limiting**: Add middleware in controller

## Testing Strategy

With this architecture, testing is straightforward:

- **Unit Tests**: Test each class in isolation
- **Integration Tests**: Test service with mocked dependencies
- **Repository Tests**: Test with in-memory implementation
- **Strategy Tests**: Test each strategy independently
- **Controller Tests**: Test with mocked service

## Benefits of This Architecture

1. **Maintainability**: Clear separation of concerns
2. **Testability**: Easy to mock dependencies
3. **Extensibility**: Easy to add new features
4. **Scalability**: Can swap implementations easily
5. **Readability**: Clear structure and naming
6. **Reusability**: Components can be reused

