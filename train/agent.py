from tensorforce.agents import DQNAgent
from train_simulation_wrapper import SimulationWrapper

environment = SimulationWrapper()

# Network is an ordered list of layers
network_spec = [dict(type='dense', size=256), dict(type='dense', size=128)]

agent = DQNAgent(
    states=environment.states,
    actions=environment.actions,
    network=network_spec,
    memory=dict(
        type='replay',
        include_next_states=True,
        capacity=1000
    ),
    target_sync_frequency=10
)

max_episodes = 1000
max_timesteps = 2000

episode = 0
episode_rewards = list()

while True:
    state = environment.reset()
    agent.reset()

    timestep = 0
    episode_reward = 0.0
    while True:
        action_int = agent.act(states=state)
        state, reward, terminal = environment.execute(action_int)
        agent.observe(reward=reward, terminal=terminal)

        timestep += 1
        episode_reward += reward

        if terminal or timestep == max_timesteps:
            break

    episode += 1
    print(episode_reward)
    episode_rewards.append(episode_reward)
    if episode == max_episodes:
        break
