## System Architecture

```mermaid
graph TD
    A[React Chat UI] -->|User Input| B[Node.js Backend]
    B -->|Query| C[Search Module]
    C -->|Lookup| D[(Document Database docs.json)]
    D -->|Match Found| C
    C -->|Processed Data| B
    B -->|JSON Response| A

    style A fill:#61dbfb,stroke:#333,stroke-width:2px
    style B fill:#3c873a,stroke:#333,stroke-width:2px,color:#fff
    style C fill:#f39c12,stroke:#333,stroke-width:2px
    style D fill:#e74c3c,stroke:#333,stroke-width:2px,color:#fff
```

## Architecture Components

| Component | Responsibility |
|----------|---------------|
| React Chat UI | Handles user interaction and chat message rendering |
| Node.js Backend | Receives queries and manages API requests |
| Search Module | Processes queries and performs similarity search |
| docs.json | Stores knowledge base documents used for retrieval |

## RAG Workflow

1. User sends a question through the chat interface.
2. The frontend sends the request to the Node.js backend.
3. The backend passes the query to the search module.
4. The search module finds relevant document chunks.
5. The most relevant information is returned to the frontend.
6. The chat interface displays the response.

## Note on LLM Integration

This project demonstrates the architecture of a Retrieval-Augmented Generation (RAG) system.

Due to API cost restrictions, OpenAI GPT models are not currently integrated.

The backend implements the retrieval layer and can easily be extended to connect with an LLM such as:

- OpenAI GPT
- Local LLMs
- HuggingFace models

The focus of this prototype is demonstrating the retrieval pipeline and system architecture.
## Screenshots

### Chat Interface

![Chat Interface](screenshots/pic1.png)

### Backend Response / Search Result

![Backend Result](screenshots/pic2.png)