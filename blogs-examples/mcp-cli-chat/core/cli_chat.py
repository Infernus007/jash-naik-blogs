import json
from typing import List, Tuple
from langchain_core.messages import AIMessage, BaseMessage, HumanMessage
from mcp.types import Prompt, PromptMessage

from core.chat import Chat
from mcp_client import MCPClient


async def print_progress_callback(
    progress: float, total: float | None, message: str | None
):
    if total is not None:
        percentage = (progress / total) * 100
        print(f"Progress: {progress}/{total} ({percentage:.1f}%)")
    else:
        print(f"Progress: {progress}")


class CliChat(Chat):
    def __init__(
        self,
        doc_client: MCPClient,
        clients: dict[str, MCPClient],
    ):
        super().__init__(clients=clients)

        self.doc_client: MCPClient = doc_client

    async def list_prompts(self) -> list[Prompt]:
        return await self.doc_client.list_prompts()

    async def list_docs_ids(self) -> list[str]:
        return await self.doc_client.read_resource("docs://documents")

    async def get_doc_content(self, doc_id: str) -> str:
        return await self.doc_client.read_resource(f"docs://documents/{doc_id}")

    async def get_prompt(
        self,
        command: str,
        doc_id: str
    ) -> list[PromptMessage]:
        return await self.doc_client.get_prompt(command, {"doc_id": doc_id})

    async def _extract_resources(self, query: str) -> str:
        mentions = [word[1:] for word in query.split() if word.startswith("@")]

        doc_ids = await self.list_docs_ids()
        mentioned_docs: list[Tuple[str, str]] = []

        for doc_id in doc_ids:
            if doc_id in mentions:
                content = await self.get_doc_content(doc_id)
                mentioned_docs.append((doc_id, content))

        return "".join(
            f'\n<document id="{doc_id}">\n{content}\n</document>\n'
            for doc_id, content in mentioned_docs
        )

    async def _process_command(self, query: str) -> bool:
        if not query.startswith("/"):
            return False

        words = query.split()
        command = words[0].replace("/", "")

        if command == "call":
            if len(words) < 2:
                print("Usage: /call <tool_name> [json_args]")
                return True

            tool_name = words[1]
            tool_args = {}
            if len(words) > 2:
                try:
                    tool_args = json.loads(" ".join(words[2:]))
                except json.JSONDecodeError:
                    print("Invalid JSON arguments.")
                    return True

            tool_found = False
            for client in self.clients.values():
                tools = await client.list_tools()
                if any(t.name == tool_name for t in tools):
                    try:
                        print(f"Calling tool '{tool_name}'...")
                        result = await client.session().call_tool(
                            name=tool_name,
                            arguments=tool_args,
                            progress_callback=print_progress_callback,
                        )
                        print("Tool result:", result.result)
                        tool_found = True
                        break
                    except Exception as e:
                        print(f"Error calling tool: {e}")
                        return True

            if not tool_found:
                print(f"Tool '{tool_name}' not found.")

            return True

        # Validate that a document ID is provided
        if len(words) < 2:
            print(f"Error: Please specify a document ID. Usage: /{command} <doc_id>")
            return True

        doc_id = words[1]
        
        # Validate that the document exists
        try:
            doc_ids = await self.list_docs_ids()
            if doc_id not in doc_ids:
                print(f"Error: Document '{doc_id}' not found.")
                return True
        except Exception as e:
            print(f"Error validating document: {e}")
            return True

        try:
            prompt_messages = await self.doc_client.get_prompt(
                command, {"doc_id": doc_id}
            )

            server_prompt_text = ""
            if prompt_messages:
                server_prompt_text = convert_prompt_message_to_langchain_message(
                    prompt_messages[0]
                ).content

            combined_prompt = (
                f"The user has issued the following command: '{query}'\n\n"
                f"Please follow these instructions to fulfill the user's request:\n{server_prompt_text}"
            )

            self.messages.append(HumanMessage(content=combined_prompt))
            return True
        except Exception as e:
            print(f"Error processing command '{command}': {e}")
            return True

    async def _process_query(self, query: str):
        if await self._process_command(query):
            return

        added_resources = await self._extract_resources(query)

        prompt = f"""
        The user has a question:
        <query>
        {query}
        </query>

        The following context may be useful in answering their question:
        <context>
        {added_resources}
        </context>

        Note the user's query might contain references to documents like "@report.docx". The "@" is only
        included as a way of mentioning the doc. The actual name of the document would be "report.docx".
        If the document content is included in this prompt, you don't need to use an additional tool to read the document.
        Answer the user's question directly and concisely. Start with the exact information they need. 
        Don't refer to or mention the provided context in any way - just use it to inform your answer.
        """

        self.messages.append(HumanMessage(content=prompt))


def convert_prompt_message_to_langchain_message(
    prompt_message: "PromptMessage",
) -> BaseMessage:
    role = "user" if prompt_message.role == "user" else "assistant"

    content = prompt_message.content
    text_content = ""

    if isinstance(content, dict) and content.get("type") == "text":
        text_content = content.get("text", "")
    elif isinstance(content, list):
        text_blocks = []
        for item in content:
            if isinstance(item, dict) and item.get("type") == "text":
                text_blocks.append(item.get("text", ""))
        text_content = "\n".join(text_blocks)
    elif isinstance(content, str):
        text_content = content

    if role == "user":
        return HumanMessage(content=text_content)
    else:
        return AIMessage(content=text_content)


def convert_prompt_messages_to_langchain_messages(
    prompt_messages: List[PromptMessage],
) -> List[BaseMessage]:
    return [
        convert_prompt_message_to_langchain_message(msg) for msg in prompt_messages
    ]