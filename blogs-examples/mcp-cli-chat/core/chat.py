import os
from langchain_core.messages import BaseMessage, HumanMessage
from langgraph.prebuilt import create_react_agent
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_mcp_adapters.tools import load_mcp_tools

from mcp_client import MCPClient


class Chat:
    def __init__(self, clients: dict[str, MCPClient]):
        self.clients: dict[str, MCPClient] = clients
        self.messages: list[BaseMessage] = []
        self.agent = None

    async def initialize_agent(self):
        tools = []
        for client in self.clients.values():
            tools.extend(await load_mcp_tools(client.session()))
        gemini_model = os.getenv("GEMINI_MODEL", "gemini-2.5-pro")
        llm = ChatGoogleGenerativeAI(model=gemini_model)
        self.agent = create_react_agent(llm, tools)

    async def _process_query(self, query: str):
        self.messages.append(HumanMessage(content=query))

    async def run(
        self,
        query: str,
    ):
        if not self.agent:
            await self.initialize_agent()

        await self._process_query(query)

        async for event in self.agent.astream_events(
            {"messages": self.messages}, version="v1"
        ):
            yield event