# MCP CLI Chat


An intelligent command-line interface powered by Model Context Protocol (MCP) that demonstrates how AI agents can interact with external tools and resources. This project showcases document management, real-time tool execution, and natural language command processing using Google's Gemini models.

## Features

- **Interactive Chat:** Natural conversation with an AI agent that can use tools and access resources
- **Document Management:** Read, edit, and format documents through MCP tools and resources
- **Smart Commands:** Slash commands with validation, auto-completion, and error handling
- **Real-time Feedback:** Live tool execution monitoring with progress indicators
- **Document References:** Use `@document.pdf` syntax to include document content in queries
- **Advanced CLI:** Rich terminal interface with validation, suggestions, and error recovery

## Architecture

The application demonstrates MCP's three core concepts:
- **Tools**: Functions the AI can execute (read_doc_contents, edit_document, help)
- **Resources**: Data the AI can access (document listings and content)
- **Prompts**: Templates that guide AI behavior (format, summarize)

## Prerequisites

- Python 3.10+
- `uv` package manager
- Google Gemini API key

## Setup

1. **Install dependencies:**
   ```bash
   uv install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual Gemini API key
   ```

## Usage

Start the application:
```bash
uv run main.py
```

### Available Commands

- **`/help`** - Show all available commands and descriptions
- **`/format <doc_id>`** - Format a document into clean markdown
- **`/summarize <doc_id>`** - Generate a summary of a document
- **`/call <tool_name> [json_args]`** - Directly execute MCP tools
- **`/clear`** - Clear conversation history
- **`exit`** or **`Ctrl+C`** - Quit the application

### Document References

Use `@` to reference documents in natural language:
```
> What are the key findings in @report.pdf?
> Compare @deposition.md with @financials.docx
> Summarize the main points from @plan.md
```

### Example Session

```bash
> /help
Available Commands:
- /format <doc_id>: Formats the contents of the document into markdown
- /summarize <doc_id>: Summarizes the contents of the document

> /format report.pdf
Thinking...
Calling tool: read_doc_contents
Tool input: {'doc_id': 'report.pdf'}
# Report Summary
The report details the state of a 20m condenser tower...

> What issues are mentioned in @deposition.md?
Thinking...
The deposition covers the testimony of Angela Smith, P.E. regarding...
```

## Available Documents

The application includes sample documents:
- `deposition.md` - Legal testimony document
- `report.pdf` - Technical report on condenser tower
- `financials.docx` - Project budget and expenditures
- `outlook.pdf` - System performance projections
- `plan.md` - Implementation plan
- `spec.txt` - Technical specifications

## MCP Components

This project demonstrates all three MCP concepts:

### Tools
- `read_doc_contents` - Read document content
- `edit_document` - Modify document text
- `help` - List available commands

### Resources  
- `docs://documents` - List all documents
- `docs://documents/{doc_id}` - Access specific document

### Prompts
- `format` - Document formatting instructions
- `summarize` - Document summarization guidance

## Contributing

This is an example project for blog demonstrations. See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Related

- 📝 [Blog Post: Building Intelligent CLI with MCP](https://jash-naik-blogs.vercel.app/blog/mcp-protocol-a-practical-guide)
- 🔗 [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- 📚 [More Examples](https://github.com/Infernus007/jash-naik-blogs/examples)