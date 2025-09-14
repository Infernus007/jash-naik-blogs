from typing import List, Optional
from prompt_toolkit import PromptSession
from prompt_toolkit.completion import Completer, Completion
from prompt_toolkit.key_binding import KeyBindings
from prompt_toolkit.styles import Style
from prompt_toolkit.history import InMemoryHistory
from prompt_toolkit.auto_suggest import AutoSuggest, Suggestion
from prompt_toolkit.document import Document
from prompt_toolkit.buffer import Buffer
from prompt_toolkit.patch_stdout import patch_stdout
from rich.console import Console
from rich.markdown import Markdown
from prompt_toolkit.validation import Validator, ValidationError

from core.cli_chat import CliChat


class CommandValidator(Validator):
    def __init__(self, resources: list[str]):
        self.resources = resources

    def update_resources(self, resources: list[str]):
        self.resources = resources

    def validate(self, document):
        text = document.text.strip()
        if not text:
            return

        words = text.split()
        command = words[0]

        if command in ["/summarize", "/format"]:
            if len(words) < 2:
                raise ValidationError(
                    message="Error: Please specify a document ID",
                    cursor_position=len(text),
                )

            doc_id = words[1]
            if doc_id not in self.resources:
                raise ValidationError(
                    message=f"Error: Document '{doc_id}' not found",
                    cursor_position=len(text),
                )


class CommandAutoSuggest(AutoSuggest):
    def __init__(self, prompts: List):
        self.prompts = prompts
        self.prompt_dict = {prompt.name: prompt for prompt in prompts}

    def get_suggestion(
        self,
        buffer: Buffer,
        document: Document,
    ) -> Optional[Suggestion]:
        text = document.text

        if not text.startswith("/"):
            return None

        parts = text[1:].split()

        if len(parts) == 1:
            cmd = parts[0]

            if cmd in self.prompt_dict:
                prompt = self.prompt_dict[cmd]
                return Suggestion(f" {prompt.arguments[0].name}")

        return None


class UnifiedCompleter(Completer):
    def __init__(self):
        self.prompts = []
        self.prompt_dict = {}
        self.resources = []

    def update_prompts(self, prompts: List):
        self.prompts = prompts
        self.prompt_dict = {prompt.name: prompt for prompt in prompts}

    def update_resources(self, resources: List):
        self.resources = resources

    def get_completions(self, document, complete_event):
        text = document.text
        text_before_cursor = document.text_before_cursor

        if "@" in text_before_cursor:
            last_at_pos = text_before_cursor.rfind("@")
            prefix = text_before_cursor[last_at_pos + 1 :]

            for resource_id in self.resources:
                if resource_id.lower().startswith(prefix.lower()):
                    yield Completion(
                        resource_id,
                        start_position=-len(prefix),
                        display=resource_id,
                        display_meta="Resource",
                    )
            return

        if text.startswith("/"):
            parts = text[1:].split()

            if len(parts) <= 1 and not text.endswith(" "):
                cmd_prefix = parts[0] if parts else ""

                for prompt in self.prompts:
                    if prompt.name.startswith(cmd_prefix):
                        yield Completion(
                            prompt.name,
                            start_position=-len(cmd_prefix),
                            display=f"/{prompt.name}",
                            display_meta=prompt.description or "",
                        )
                return

            if len(parts) == 1 and text.endswith(" "):
                cmd = parts[0]

                if cmd in self.prompt_dict:
                    for id in self.resources:
                        yield Completion(
                            id,
                            start_position=0,
                            display=id,
                        )
                return

            if len(parts) >= 2:
                doc_prefix = parts[-1]

                for resource in self.resources:
                    if "id" in resource and resource["id"].lower().startswith(
                        doc_prefix.lower()
                    ):
                        yield Completion(
                            resource["id"],
                            start_position=-len(doc_prefix),
                            display=resource["id"],
                        )
                return


class CliApp:
    def __init__(self, agent: CliChat):
        self.agent = agent
        self.resources = []
        self.prompts = []
        self.console = Console()

        self.completer = UnifiedCompleter()

        self.command_autosuggester = CommandAutoSuggest([])

        self.kb = KeyBindings()

        @self.kb.add("/")
        def _(event):
            buffer = event.app.current_buffer
            if buffer.document.is_cursor_at_the_end and not buffer.text:
                buffer.insert_text("/")
                buffer.start_completion(select_first=False)
            else:
                buffer.insert_text("/")

        @self.kb.add("@")
        def _(event):
            buffer = event.app.current_buffer
            buffer.insert_text("@")
            if buffer.document.is_cursor_at_the_end:
                buffer.start_completion(select_first=False)

        @self.kb.add(" ")
        def _(event):
            buffer = event.app.current_buffer
            text = buffer.text

            buffer.insert_text(" ")

            if text.startswith("/"):
                parts = text[1:].split()

                if len(parts) == 1:
                    buffer.start_completion(select_first=False)
                elif len(parts) == 2:
                    arg = parts[1]
                    if (
                        "doc" in arg.lower()
                        or "file" in arg.lower()
                        or "id" in arg.lower()
                    ):
                        buffer.start_completion(select_first=False)

        @self.kb.add("c-m")
        def _(event):
            buffer = event.app.current_buffer
            if buffer.complete_state:
                buffer.apply_completion(buffer.complete_state.current_completion)
            else:
                # Check if validation would fail and handle it
                text = buffer.text.strip()
                if text.startswith("/"):
                    words = text.split()
                    command = words[0]
                    if command in ["/summarize", "/format"] and len(words) < 2:
                        # Pre-populate with doc_id placeholder
                        buffer.text = f"{command} <doc_id>"
                        buffer.cursor_position = len(buffer.text)
                        return
                buffer.validate_and_handle()

        self.history = InMemoryHistory()
        self.validator = CommandValidator(self.resources)
        self.session = PromptSession(
            completer=self.completer,
            history=self.history,
            key_bindings=self.kb,
            style=Style.from_dict(
                {
                    "prompt": "#aaaaaa",
                    "completion-menu.completion": "bg:#222222 #ffffff",
                    "completion-menu.completion.current": "bg:#444444 #ffffff",
                    "validation-toolbar": "bg:#aa0000 #ffffff bold",
                }
            ),
            complete_while_typing=True,
            complete_in_thread=True,
            auto_suggest=self.command_autosuggester,
            validator=self.validator,
            validate_while_typing=True,
        )

    def print_welcome_message(self):
        self.console.print("[bold green]Welcome to MCP Chat![/bold green]")
        self.console.print("This is a command-line interface for interacting with Google's Gemini models.")
        self.console.print("\n[bold]Features:[/bold]")
        self.console.print("- [bold]Interactive Chat:[/bold] Have a conversation with the AI.")
        self.console.print("- [bold]Commands:[/bold] Start your message with `/` to execute a command. For example, `/help`.")
        self.console.print("- [bold]Document Retrieval:[/bold] Use `@` followed by a document ID to include its content in your query. For example, `summarize @report.pdf`.")
        self.console.print("- [bold]Real-time Logging:[/bold] See tool calls and other state changes as they happen.")
        self.console.print("\nType `/help` to see a list of available commands.")
        self.console.print("Type `exit` or press `Ctrl+C` to quit.")

    async def initialize(self):
        self.print_welcome_message()
        await self.refresh_resources()
        await self.refresh_prompts()

    async def refresh_resources(self):
        try:
            self.resources = await self.agent.list_docs_ids()
            self.completer.update_resources(self.resources)
            self.validator.update_resources(self.resources)
        except Exception as e:
            print(f"Error refreshing resources: {e}")

    async def refresh_prompts(self):
        try:
            self.prompts = await self.agent.list_prompts()
            self.completer.update_prompts(self.prompts)
            self.command_autosuggester = CommandAutoSuggest(self.prompts)
            self.session.auto_suggest = self.command_autosuggester
        except Exception as e:
            print(f"Error refreshing prompts: {e}")

    async def _process_client_command(self, user_input: str) -> bool:
        """Process client-side commands that don't need the agent."""
        words = user_input.strip().split()
        if not words:
            return False

        command = words[0]
        if command == "/help":
            help_text = "[bold]Available Commands:[/bold]\n"
            help_text += "- /help: Show this help message.\n"
            help_text += "- /clear: Clear the conversation history.\n"
            help_text += "- /call <tool> [args]: Call a tool directly.\n"
            for p in self.prompts:
                help_text += f"- /{p.name} <doc_id>: {p.description}\n"
            self.console.print(help_text)
            return True

        if command == "/clear":
            self.agent.messages = []
            self.console.print("[bold yellow]Conversation history cleared.[/bold yellow]")
            return True

        return False

    async def run(self):
        while True:
            try:
                with patch_stdout():
                    user_input = await self.session.prompt_async("> ")
                if not user_input.strip():
                    continue

                if await self._process_client_command(user_input):
                    continue

                final_response = ""
                self.console.print("[bold green]Thinking...[/bold green]")
                async for event in self.agent.run(user_input):
                    kind = event["event"]
                    if kind == "on_tool_start":
                        self.console.print(f"\n[bold blue]Calling tool: {event['name']}[/bold blue]")
                        self.console.print(f"Tool input: {event['data'].get('input')}")
                    elif kind == "on_tool_end":
                        self.console.print(f"[bold blue]Tool output:[/bold blue] {event['data'].get('output')}")
                    elif kind == "on_chat_model_stream":
                        chunk = event["data"]["chunk"]
                        if chunk.content:
                            final_response += chunk.content
                    elif kind == "on_chain_end" and event["name"] == "__main__":
                        last_message = event["data"]["output"]["messages"][-1]
                        if last_message.content:
                            self.agent.messages.append(last_message)

                self.console.print(Markdown(final_response))

            except KeyboardInterrupt:
                break
