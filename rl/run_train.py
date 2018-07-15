from agent import SemiAutonomousAgent
from rl_agent_server import RLAgentServer

print('start')

rl_agent = SemiAutonomousAgent()
print('made agent')
rl_agent.train()
